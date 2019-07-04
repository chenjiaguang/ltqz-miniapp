// pages/selectuser/selectuser.js
const util = require('../../utils/util.js')
const app = getApp()
let themeColor = '#FFFFFF'
if (app) {
  themeColor = app.globalData.themeColor
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '选择账号',
    navBg: themeColor || '#FFFFFF',
    loaded: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    util.request('/admin/shop/can_login').then(res => {
      this.setData({
        list: res.data,
        loaded: true
      })
    }).catch(err => {
      console.log('err', err)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  goBusiness(e) {
    wx.navigateTo({
      url: '/pages/businessassistant/businessassistant?id=' + e.currentTarget.dataset.id
    })
  }
})