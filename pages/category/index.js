import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    data: {
        // 左侧菜单数据
        leftMenuList: [],
        // 右侧商品数据
        rightContent: [],
        // 被点击的左侧菜单
        currentIndex: 0,
        // 右侧内容的滚动条距离顶部的距离
        scrollTop: 0
    },
    // 接口的返回数据
    Cates: [],
    onLoad: function(options) {
        /* 使用缓存技术
         * 0 web中的木地存储和小程序中的木地存储的区别
         *    1.写代码的方式不一样了
         *       web: 存值：localStorage.setItem("key","value")  取值:localStorage.getItem("key")
         *       小程序中: 存值 wx.setStorageSync("key","value");  取值: Wx.etStorageSync("key");
         *    2.存的时候有没有做类型转换
         *       web: 不管存入的是什么类型的数据，最终都会先调用以下toString(),把数据变成字符串再存入进去
         *       小程序: 不存在类型转换的这个操作存什么类似的数据进去，获取的时候就是什么类型
         * 1 先判断下本地存储中有没有旧的数据
         *   存储格式 {时间戳，数据} => {time:Date.now() ,data:[...] }
         * 2 没有旧数据直接发送新请求
         * 3 有旧的数据同时旧的数据也没有过期就使用本地存储中的旧数据即可
         */

        // 1 获取本地存储中的数据(小程序中也是存在本地存储技术)
        const Cates = wx.getStorageSync("cates");
        // 2 判断
        if (!Cates) {
            // 本地缓存不存在 发送请求获取数据
            this.getCates()
        } else {
            // 有旧的数据，定义过期时间 此时过期时间为5分钟
            if (Date.now() - Cates.time > 1000 * 50 * 5) {
                // 如果时间超过过期时间，重新发送请求
                this.getCates()
            } else {
                // 可以使用缓存数据
                this.Cates = Cates.data
                    // 因为leftMenuList，rightContent是在getCates()中设置的，此时没有发送请求，没有调用getCates()，因此需要手动为leftMenuList，rightContent赋值
                let leftMenuList = this.Cates.map(item => item.cat_name)
                let rightContent = this.Cates[0].children
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }

    },
    // 获取分类数据
    // getCates() {
    //     request({ url: '/categories' })
    //         .then(result => {
    //             this.Cates = result.data.message // 将请求的数据放入Cates中

    //             // 将接口的数据存入到本地存储中
    //             wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });

    //             // console.log(this.Cates);

    //             // 获取左侧菜单数据
    //             let leftMenuList = this.Cates.map(item => item.cat_name)
    //                 /* 上面是通过map()方法,下面是通过forEach()遍历方法
    //                  * let leftMenuList = []
    //                  * this.Cates.forEach(element => {
    //                  * leftMenuList.push(element.cat_name)
    //                  * }) 
    //                  */

    //             //获取右侧商品数据
    //             let rightContent = this.Cates[0].children
    //             this.setData({
    //                 leftMenuList: leftMenuList,
    //                 rightContent
    //             })

    //         })
    // },
    // 采用async方式
    async getCates() {
        const result = await request({ url: "/categories" })
        this.Cates = result.data.message
            // 将接口的数据存入到本地存储中
        wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
        // 获取左侧菜单数据
        let leftMenuList = this.Cates.map(item => item.cat_name)
            //获取右侧商品数据
        let rightContent = this.Cates[0].children
        this.setData({
            leftMenuList: leftMenuList,
            rightContent
        })
    },


    // 左侧菜单点击事件
    handleItemTap(e) {
        // 1.获取被点击标题的索引
        let { index } = e.currentTarget.dataset

        // 3.根据不同的索引來渲染右侧的商品内容
        let rightContent = this.Cates[index].children

        // 2.给data中的index赋值
        this.setData({
            currentIndex: index,
            rightContent,
            scrollTop: 0 //重新设置 右侧内容的scroll-view标签距离顶部的距离
        })
    }
})