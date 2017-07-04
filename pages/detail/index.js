// index.js
let app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    autoplay:true,  // 是否自动轮播
    interval: 3000,  // 自动切换时间间隔
    duration: 500,  // 动画时间
    details: [],    // 用于存储商品详情信息
    swiperCurrent: 0, // 当前
    hasMoreSelect:false, // 展示更多选择
    selectSIze:"选择：", // 选择
    selectSizePrice: 0, // 选择价格
    shopNum: 0,  // 购物车数量
    hideShopPopup: true,
    buyNumber: 0, // 购买数量
    buyNumMin: 0, // 最小购买数量
    buyNumMax: 0, // 最大购买数量
    propertyChildIds: "", //
    propertyChildNames: "", //
    canSubmit: false, // 选中规格尺寸时候是否允许加入购物车
    shopCarInfo: {}
  },
  // 生命周期函数--监听页面加载
  onLoad: function (e) {
    //console.log(e); // onLoad里面 的数据
    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: (res) => {
        this.setData({
          shopCarInfo:res.data,
          shopNum: res.data.shopNum
        })
      },
      fail: (err) => {
        console.log("缓存数据获取失败");
      }
    });
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/detail',
      data: {
        id: e.id
      },
      success: ({data: {data, data: {properties = []}}}) => {
        let selectSizeTemp = "";
        // 判断是否存在商品规格选择
        if (properties && properties.length){
          properties.forEach((item,index) => {
            selectSizeTemp = selectSizeTemp + " " + properties[index].name;
          });
          this.setData({
            hasMoreSelect: true,
            selectSize: this.data.selectSize + selectSizeTemp,
            selectSizePrice: data.basicInfo.minPrice,
          });
        }
        this.setData({
          details: data, // 商品详细信息
          selectSizePrice: data.basicInfo.minPrice, // 商品价格
          buyNumMax: data.basicInfo.stores, // 最大购买数量
          buyNumber: (data.basicInfo.stores > 0) ? 1 : 0 // 最小购买数量
        })
        WxParse.wxParse('article', 'html', data.content, this, 5);
        //console.log(data.basicInfo)
      },
      fail: (err) => {
        console.log("数据获取失败");
      }
    })
  },
  swiperchange:function(e){
    this.setData({
      swiperCurrent: e.detail.current
    })
  }
})