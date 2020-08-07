import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    data: {
        tabs: [{
                id: 0,
                value: "综合",
                isActive: true
            },
            {
                id: 1,
                value: "销量",
                isActive: false
            }, {
                id: 2,
                value: "价格",
                isActive: false
            }
        ],
        goodsList: []
    },
    // 总页数
    totalPages: 1,
    // 接口要的参数
    QueryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
    },
    onLoad: function(options) {
        this.cid = options.cid
        this.getGoodsList()
    },

    // 获取商品列表数据
    async getGoodsList() {
        const res = await request({ url: "/goods/search", data: this.QueryParams })
            // console.log(res);
        const total = res.data.message.total; // 获取总条数
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize) // 计算总页数 
            // console.log(this.totalPages);  
        this.setData({
            // goodsList: res.data.message.goods,
            goodsList: [...this.data.goodsList, ...res.data.message.goods], // 将原数组数据与请求的新数组数据拼接
        })

        // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭页不会报错
        wx.stopPullDownRefresh()
    },

    // 标题点击事件 从子组件传递过来
    handleTabsItemChange(e) {
        // 1 获取被点击的标题索引
        const { index } = e.detail;
        // 2 修改源数组
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        // 3 赋值到data中
        this.setData({
            tabs
        })
    },

    /*  
     *  1 用户上滑页面滚动条触底开始加载下一页数据
     *    1 找到滚动条触底事件 微信小程序官方开发文档寻找
     *    2 判断还有没有下一页数据
     *         1 获取到总页数  返回的数据有总条数 total
     *              总页数 = math.ceil(总条数 / 页容量) 
     *              总页数 = math.ceil( 53 / 10 ) = 6 
     *         2 获取到当前页码 pagenum
     *         3 判断一下 当前页码是否大于等于 总页数
     *              大于 表示没有下一页         
     *    3 假如没有下一.页数据弹出一个提示
     *    4 假如还有下一页数据来加载下一页数据
     *         1 当前页码 ++
     *         2 重新发送请求
     *         3 数据请求回来 要对data中的数据进行拼接，而不是全部替换
     *  2 下拉刷新页面
     *      1 触发下拉刷新事件 在页面json文件中开启配置项
     *          找到触发下拉刷新的事件
     *      2 重置数据数组
     *      3 重置页码 设置为1
     *      4 重新发送请求
     *      5 数据请求回来 需要手动关闭 等待效果
     */
    // 滚动条触底事件
    onReachBottom() {
        // 1 判断还有没有下一页数据
        if (this.QueryParams.pagesize >= this.totalPages) {
            // 没有下一页数据
            wx.showToast({
                title: '没有下一页数据了',
            })
        } else {
            // 有下一页数据
            this.QueryParams.pagenum++
                this.getGoodsList()
        }
    },
    // 下拉刷新事件
    onPullDownRefresh() {
        // 1 重置数组
        this.setData({
                goodsList: []
            })
            // 2 重置页码
        this.QueryParams.pagenum = 1
            // 3 重新发送请求
        this.getGoodsList()
    }
})