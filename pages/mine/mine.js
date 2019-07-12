// pages/mine/mine.js
const util = require('../../utils/util.js')
const app = getApp()
let themeColor = '#FFFFFF'
if (app) {
  themeColor = app.globalData.themeColor
}
Page({
  name: "mine",
  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '我的',
    navBg: themeColor || '#FFFFFF',
    user: null,
    fx_apply_entrance: false,
    be_partner_entrance: {
      title: '成为合伙人',
      path: '/pages/bepartner/bepartner'
    },
    assistant_entrance: {
      title: '商家助手',
      path: '/pages/selectuser/selectuser'
    },
    other_entrances: [{
        title: '我的收藏',
        path: '/pages/collection/collection'
      }, {
        title: '常用信息',
        path: '/pages/usuallycontacts/usuallycontacts'
      },
      {
        title: '联系客服',
        path: '',
        phone: '400-4504-2626'
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
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    util.request('/user/detail').then(res => {
      let assistant_entrance = this.data.assistant_entrance
      if (res.data.shop && res.data.shop.length > 1) {
        assistant_entrance.path = '/pages/selectuser/selectuser'
      } else if (res.data.shop && res.data.shop.length == 1) {
        assistant_entrance.path = '/pages/businessassistant/businessassistant?id=' + res.data.shop[0].id
      }
      if (res.data.fenxiao) {
        res.data.fenxiao.total = util.formatMoney(res.data.fenxiao.total).showMoney
        res.data.fenxiao.today_remit = util.formatMoney(res.data.fenxiao.today_remit).showMoney
        res.data.fenxiao.can_remit = util.formatMoney(res.data.fenxiao.can_remit).showMoney
      }
      this.setData({
        fx_apply_entrance: res.data.fx_apply_entrance,
        user: res.data,
        assistant_entrance: assistant_entrance
      })
    }).catch(err => {
      console.log('err', err)
    })
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
    wx.navigateTo({
      url: '/pages/userinfo/userinfo'
    })
  },

  goOrder: function(e) {
    const {
      type
    } = e.currentTarget.dataset
    const url = '/pages/orderlist/orderlist?type=' + type
    wx.navigateTo({
      url: url
    })
  },

  goProfit: function() {
    wx.navigateTo({
      url: '/pages/userprofit/userprofit'
    })
  },

  entranceTap: function(e) {
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