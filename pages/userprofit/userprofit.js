// pages/userprofit/userprofit.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: '',
    can_remit: '',
    has_remit: '',
    freeze_remit: '',
    unfreeze_remit: '',
    today_remit: '',
    entrances: [{
        title: '收益明细',
        path: '/pages/userprofitdetail/userprofitdetail'
      },
      {
        title: '提现记录',
        path: '/pages/withdrawrecord/withdrawrecord'
      }
    ],
    withdraw: false // 是否可提现
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
    util.request('/fenxiao/earn_detail').then(res => {

      res.data.total = util.formatMoney(res.data.total).showMoney
      res.data.can_remit = util.formatMoney(res.data.can_remit).showMoney
      res.data.has_remit = util.formatMoney(res.data.has_remit).showMoney
      res.data.freeze_remit = util.formatMoney(res.data.freeze_remit).showMoney
      res.data.unfreeze_remit = util.formatMoney(res.data.unfreeze_remit).showMoney
      res.data.today_remit = util.formatMoney(res.data.today_remit).showMoney
      this.setData({
        total: res.data.total,
        can_remit: res.data.can_remit,
        has_remit: res.data.has_remit,
        freeze_remit: res.data.freeze_remit,
        unfreeze_remit: res.data.unfreeze_remit,
        today_remit: res.data.today_remit
      })
    }).catch(err => {})
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
    }
  },

  requestCash: function() {

    wx.showModal({
      title: '提示',
      content: '可提现收益将全部提现至您的为您零钱，是否继续提现操作？',
      success: (res) => {
        if (res.confirm) {
          util.request('/fenxiao/tx').then(res => {
            wx.showToast({
              title: '申请提现成功啦，预计将在2小时内到账',
              icon: 'none'
            })
            this.onReady()
          }).catch(err => {})
        }
      }
    })
  }
})