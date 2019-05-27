// pages/bepartner/bepartner.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    util.request('/user/detail').then(res => {
      this.setData({
        user: res.data
      })
    }).catch(err => {
      console.log('err', err)
    })
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
  apply() {
    util.request('/user/become_fenxiao', {
      phone: this.data.user.phone,
    }).then(res => {
      util.backAndToast('申请信息已提交成功')
    }).catch(err => {
      console.log('err', err)
    })
  },

  getPhoneNumber(e) {
    if (e.detail.encryptedData) {
      util.request('/common/decrypt', {
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
      }).then(res => {
        this.setData({
          ['user.phone']: res.data.phoneNumber
        })
      }).catch(err => {
        console.log('err', err)
      })
    }
  }
})