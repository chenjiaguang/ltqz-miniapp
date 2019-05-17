// pages/signupmanager/signupmanager.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    hd_id: '',
    join_num: '',
    js_price: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      hd_id: options.hd_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    util.request('/admin/huodong/detail', {
      id: this.data.id,
      hd_id: this.data.hd_id,
    }).then(res => {
      res.data.js_price = util.formatMoney(res.data.js_price).showMoney
      res.data.list.forEach((item) => {
        item.order.js_price = util.formatMoney(item.order.js_price).showMoney
        item.content = item.ticket.map((ticket) => {
          return ticket.name + 'x' + ticket.quantity
        }).join('，') + '，共计￥' + item.order.js_price
      })
      this.setData({
        join_num: res.data.join_num,
        js_price: res.data.js_price,
        list: res.data.list
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
  callPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  goDetail() {
    wx.navigateTo({
      url: '/pages/goodsdetail/goodsdetail?id=' + this.data.hd_id
    })
  }
})