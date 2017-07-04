//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},  // 用户信息
    autoplay:true, // 自动播放
    duration:500, // 动画时间
    interval:4000, // 切换时间间隔
    loadingHidden:false, // 加载
    swiperCurrent: 0, // swiper当前下标 默认为0
    selectCurrent:0, // 小圆点当前下标 默认为0
    categories:[], // 分类
    activeCategoryTd:0, // 分类导航 默认为0
    goods:[], // 所有商品数据 
    scrollTop:0, // 初始化滚动条的位置
    scrollHeight: 0, // 滚动条加载 是需要设置高度；不然监听不了
    loadingMoreHidden: true
  },
  onLoad: function (e) { // 初始化加载
    // e可以获取data参数
    // 这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    wx.getSystemInfo({ // 获取设备信息
      success: (res)=> {
        // console.info(res.windowHeight);
        this.setData({ // 
          scrollHeight: res.windowHeight
        });
      }
    });
    // 动态设置导航栏标题
    wx.setNavigationBarTitle({ // 动态设置导航栏
      title: '商城',
    })
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
      data: {
        key: 'mallName'
      },
      success: (res)=> {
        this.setData({ //
          imgUrls: res.data.data
        });
      }
    });
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/category/all',
      success: (res) => {
        let categories = [{id: 0,name:"全部"}];
        const data = res.data.data
        for(let i = 0; i < data.length; i++){
          categories.push(data[i]);
        }
        this.setData({
          categories: categories,
          activeCategoryId:0
        })
        this.getGoodsList(0);
      },
      fail: (err) => {
        console.log("获取数据失败")
      }
    });
  },
  getGoodsList: function (categoryId){ // 获取所有商品
    if (categoryId == 0){
      categoryId = '';
    }
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
      data:{
        categoryId: categoryId
      },
      success: (res) => {
        this.setData({
          goods: res.data.data
        })
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
  swiperChange:function(e){ // 监听swiper的改变
    this.setData({
      swiperCurrent:e.detail.current
    })
  },
  tabClick:function(e){ // 查询切换
    this.setData({
      activeCategoryId: e.currentTarget.id
    })
    this.getGoodsList(e.currentTarget.id)
  },
  toDetailsTap:function(e){  // 详情页
    // console.log(e.currentTarget.dataset.id) // e包含data数据
    wx.navigateTo({
      url: "/pages/detail/index?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner:function(e){ // banner详情页
    wx.navigateTo({
      url: "/pages/detail/index?id=" + e.currentTarget.dataset.id
    })
  },
  onPullDownRefresh:function(){  // 下拉刷新
    console.log("下拉刷新")
  },
  bindDownLoad:function(e){ // 上拉加载
    console.log("上拉加载");
  },
  onReachBottom:function(e){ // 下拉事件
    console.log("下拉11111")
  },
  scroll: function (e) { // 滚动条
    this.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  onHide:function(e){ // 监听页面隐藏
    console.log("========")
  }
})
