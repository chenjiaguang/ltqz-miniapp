// pages/signupmanager/signupmanager.js
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
    navTitle: '报名详情',
    navBg: themeColor || '#FFFFFF',
    genderText: {
      0: '保密',
      1: '男',
      2: '女'
    },
    id: '',
    product_id: '',
    join_num: '',
    js_price: '',
    list: [],
    page: null,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      product_id: options.product_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.fetchData(1)
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
    this.fetchData(parseInt(this.data.page.pn) + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  fetchData: function(pn = 1) {
    this.setData({
      loading: true
    })
    util.request('/admin/product/detail', {
      id: this.data.id,
      product_id: this.data.product_id,
      pn: pn
    }).then(res => {
      res.data.js_price = util.formatMoney(res.data.js_price).showMoney
      res.data.list.forEach((item) => {
        item.order.js_price = util.formatMoney(item.order.js_price).showMoney
        item.content = item.ticket.map((ticket) => {
          return ticket.name + 'x' + ticket.quantity
        }).join('，') + '，共计￥' + item.order.js_price
      })
      if (pn == 1) {
        this.setData({
          join_num: res.data.join_num,
          js_price: res.data.js_price,
          list: res.data.list,
          page: res.data.page,
          loading: false
        })
      } else {
        let list = this.data.list
        list = list.concat(res.data.list)
        this.setData({
          list: list,
          page: res.data.page,
          loading: false
        })
      }
    }).catch(err => {
      console.log('err', err)
    })
  },
  callPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  goDetail() {
    wx.navigateTo({
      url: '/pages/goodsdetail/goodsdetail?id=' + this.data.product_id
    })
  },
  tapItem() {
    wx.vibrateShort()
  }
})