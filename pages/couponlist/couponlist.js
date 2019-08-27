// pages/couponlist/couponlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '我的优惠券',
    list: [
      {
        id: '1',
        price: 20000,
        show_price: 200,
        threshold: 0,
        threshold_text: '无金额门槛',
        title: '此处为优惠券名称此处为优 惠券名称',
        tip: '2019-08-13 至 2019-08-20',
        received: false,
        extra_detail: '收到了看风景垃圾阿拉斯加发垃圾slkfj alsfj a离开是的肌肤拉萨家发拉萨肌肤拉萨的肌肤als'
      },
      {
        id: '2',
        price: 2000,
        show_price: 20,
        threshold: 10000,
        threshold_text: '满100可用',
        title: '此处为优惠券名称此处',
        tip: '2019-08-13 至 2019-08-20',
        received: true
      },
      {
        id: '3',
        price: 20000,
        show_price: 200,
        threshold: 0,
        threshold_text: '无金额门槛',
        title: '此处为优惠券名称此处为优 惠券名称',
        tip: '自领取之日起X天内有效',
        received: false
      }
    ],
    page: null,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // onShareAppMessage: function () {

  // }
})