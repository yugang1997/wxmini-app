import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    data: {
        goodsObj: {}
    },

    // 商品对象
    goodsInfo: {},

    onLoad: function(options) {
        const { goods_id } = options
        this.getGoodsDetail(goods_id)
    },

    // 获取商品详情数据 
    async getGoodsDetail(goods_id) {
        const res = await request({ url: "/goods/detail", data: { goods_id } })
        this.goodsInfo = res.data.message
        this.setData({
            goodsObj: {
                goods_name: res.data.message.goods_name,
                goods_price: res.data.message.goods_price,
                // 返回的数据中有 .webp 格式的图片，部分iPhone不识别
                // 将 .webp 格式转换为 .jpg 格式 通过正则表达式替换
                // 但一般是通过后台修改数据格式
                goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: res.data.message.pics
            }
        })
    },

    /* 点击轮播图预览大图
     *   1 给轮播图绑定点击事件
     *   2 调用小程序的api previewImage 
     */
    handlePrevewImage(e) {
        // 预览的图片数组
        const urls = this.goodsInfo.pics.map(item => item.pics_mid)
            // 通过自定义属性传参
        const current = e.currentTarget.dataset.url // 接收传过来的参数
        wx.previewImage({
            current: current,
            urls: urls
        });
    },

    /** 点击 加入购物车
     *    1 先绑定点击事件
     *    2 获取缓存中的购物车数据 数组格式
     *    3 先判断当前的商品是否已经存在于购物车 
     *    4 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组填充回缓存中
     *    5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素带上购买数 量属性num 重新把购物车数组填充回缓存中
     *    6 弹出提示 
     */
    handleCartAdd() {
        // 获取缓存中的购物车数据
        let cart = wx.getStorageSync("cart") || [];
        // 判断 商品对象是否存在于购物车数组中
        let index = cart.findIndex(item => item.goods_id === this.goodsInfo.goods_id)
        if (index === -1) {
            // 不存在这条商品数据 第一次添加
            this.goodsInfo.num = 1
            // 设置购物车复选框的状态
            this.checked=true
            cart.push(this.goodsInfo)
        } else {
            // 存在购物车数据 执行num++
            cart[index].num++
        }
        // 将购物车数据重新添加回缓存中
        wx.setStorageSync("cart", cart);
        // 弹框提示
        wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            mask: true, //防止用户两虚点击，需要等待一定时间才能再次点击
        });

    }
})