import { request } from '../../request/index.js'
Page({
    data: {
        // 轮播图数组
        swiperList: [],
        // 导航数据
        catesList: [],
        // 楼层数据
        floorList: []
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    // 页面开始加载，就会触发onload
    onLoad: function() {
        //  1.发送异步请求获取轮播图数据
        // wx.request({
        //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
        //     success: (result) => {
        //         this.setData({
        //             swiperList: result.data.message
        //         })
        //     }
        // });

        // 获取轮播图
        this.getSwiperList();
        this.getCateList();
        this.getFloorList()
    },

    // 获取轮播图数据
    getSwiperList() {
        request({ url: '/home/swiperdata' })
            .then(result => {
                this.setData({
                    swiperList: result.data.message
                })
            })
    },
    // 获取分类导航数据
    getCateList() {
        request({ url: '/home/catitems' })
            .then(result => {
                this.setData({
                    catesList: result.data.message
                })
            })
    },
    // 获取楼层数据
    getFloorList() {
        request({ url: '/home/floordata' })
            .then(result => {
                this.setData({
                    floorList: result.data.message
                })
            })
    }
})