// pages/userinfo/userinfo.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    genderRange: [{
        title: '男',
        value: '1'
      },
      {
        title: '女',
        value: '2'
      }
    ],
    gender_text: {
      1: '男',
      2: '女'
    },
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
  genderChange: function(e) {
    this.setData({
      ['user.sex']: this.data.genderRange[e.detail.value].value
    })
  },
  save: function(e) {
    util.request('/user/update', {
      sex: this.data.user.sex
    }).then(res => {
      util.backAndToast('保存成功')
    }).catch(err => {})

  }
})