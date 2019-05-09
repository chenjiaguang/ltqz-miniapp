// pages/goodsdetail/goodsdetail.js
const WxParse = require('../../utils/wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusText: {
      1: '活动报名中',
      2: '活动已截止',
      3: '活动已结束'
    },
    shareProfit: 3.99, // 分享赚shareProfit，如果为0或不存在，则分享按钮为普通样式，否则为分享赚xxx样式
    cover: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg',
    title: '【穿行艺术】城市里的博物馆，外滩历险记(银行一条街)',
    intro: '三大保障类别，全方位守护您的财富和家庭全方位守护您的财富和家庭',
    actualPrice: 49.9,
    originPrice:  99.9,
    status: '1',
    startTime: '01-03 9:00',
    endTime: '04-30 17:00',
    enterEndTime: '01-01 18:00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('detailonLoad_options', options)
    const article = '<div>我是HTML代码</div>'
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    let that = this
    WxParse.wxParse('article', 'html', article, that, 5)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '活动详情页转发',
      path: '/pages/goodsdetail/goodsdetail?id=555&uid=999',
      imageUrl: 'http://i1.bvimg.com/685753/f356705dcb228db3.jpg'
    }
  }
})