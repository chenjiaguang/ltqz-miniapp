// pages/userprofit/userprofit.js
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
    navTitle: '收益明细',
    navBg: themeColor || '#FFFFFF',
    total: '',
    can_remit: '',
    has_remit: '',
    freeze_remit: '',
    unfreeze_remit: '',
    today_remit: '',
    list: null,
    page: null,
    withdraw: true, // 是否可提现,
    loading: false
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
    util.request('/fenxiao/earn_list', {
      pn: pn
    }).then(res => {
      if (pn == 1) {
        res.data.total.total = util.formatMoney(res.data.total.total).showMoney
        res.data.total.can_remit = util.formatMoney(res.data.total.can_remit).showMoney
        res.data.total.has_remit = util.formatMoney(res.data.total.has_remit).showMoney
        res.data.total.freeze_remit = util.formatMoney(res.data.total.freeze_remit).showMoney
        res.data.total.unfreeze_remit = util.formatMoney(res.data.total.unfreeze_remit).showMoney
        res.data.total.today_remit = util.formatMoney(res.data.total.today_remit).showMoney
        this.setData({
          total: res.data.total.total,
          can_remit: res.data.total.can_remit,
          has_remit: res.data.total.has_remit,
          freeze_remit: res.data.total.freeze_remit,
          unfreeze_remit: res.data.total.unfreeze_remit,
          today_remit: res.data.total.today_remit,
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

  entranceTap: function(e) {
    const {
      path,
      phone
    } = e.detail
    if (path) {
      wx.navigateTo({
        url: path
      })
    }
  }
})