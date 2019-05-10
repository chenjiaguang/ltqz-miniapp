// pages/userprofit/userprofit.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    all: 60,
    today: 0,
    cashed: 55,
    cashabled: 5,
    tobefree: 0,
    list: [
      { title: '收益到账', content: '花心萝卜腿通过你的分享购买了2份产品，恭喜获得收9.26', time: '2019.07.13 16:26:02' },
      { title: '收益到账', content: '花心萝卜腿通过你的分享购买了2份产品，恭喜获得收9.26', time: '2019.07.13 16:26:02' }
    ],
    withdraw: true // 是否可提现
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
  onShareAppMessage: function () {

  },

  entranceTap: function (e) {
    console.log('entranceTap', e)
    const { path, phone } = e.detail
    if (path) {
      wx.navigateTo({
        url: path
      })
    }
  },

  requestCash: function () {
    wx.navigateTo({
      url: '/pages/requestcash/requestcash'
    })
  }
})