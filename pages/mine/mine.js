// pages/mine/mine.js
const util = require('../../utils/util.js')
Page({
  name: "mine",
  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    is_partner: true,
    profit: {
      all: 60,
      today: 0,
      cashabled: 5
    },
    show_be_partner: true,
    is_business: true,
    be_partner_entrance: {
      title: '成为合伙人',
      path: '/pages/bepartner/bepartner'
    },
    assistant_entrance: {
      title: '商家助手',
      path: '/pages/businessassistant/businessassistant'
    },
    other_entrances: [{
        title: '常用联系人',
        path: '/pages/usuallycontacts/usuallycontacts'
      },
      {
        title: '联系客服',
        path: '',
        phone: '1234567890'
      }
    ]
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
    util.checkLogin();
    util.request('/user/detail').then(res => {
      this.setData({
        user: res.data
      })
      console.log('res', res)
    }).catch(err => {
      console.log('/login_err', err)
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

  goUserInfo: function() {
    console.log('goUserInfo')
    wx.navigateTo({
      url: '/pages/userinfo/userinfo'
    })
  },

  goOrder: function(e) {
    console.log('goOrder', e)
    const {
      type
    } = e.currentTarget.dataset
    const url = '/pages/orderlist/orderlist?type=' + type
    wx.navigateTo({
      url: url
    })
  },

  goProfit: function() {
    console.log('goProfit')
    wx.navigateTo({
      url: '/pages/userprofit/userprofit'
    })
  },

  entranceTap: function(e) {
    console.log('entranceTap', e)
    const {
      path,
      phone
    } = e.detail
    if (path) {
      wx.navigateTo({
        url: path
      })
    } else if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      })
    }
  }
})