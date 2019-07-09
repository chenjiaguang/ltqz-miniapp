// pages/orderComment/orderComment.js
const util = require('../../utils/util.js')
const storageHelper = require('../../utils/storageHelper.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '订单评价',
    id: '',
    order: null,
    content: '',
    covers: [],
    score: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    util.request('/order/detail', {
      id: this.data.id
    }).then(res => {
      let product = res.data.huodong || res.data.vgoods
      if (product && product.valid_btime) {
        product.valid_btime = util.formatDateTimeDefault('d', product.valid_btime)
      }
      if (product && product.valid_etime) {
        product.valid_etime = util.formatDateTimeDefault('d', product.valid_etime)
      }
      res.data.ticket_text = res.data.ticket.map((item) => {
        return item.name + '×' + item.quantity
      }).join(',')
      res.data.product = product
      this.setData({
        order: res.data
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
  coverChange(e) {
    this.setData({
      covers: e.detail.ids
    })
  },
  contentInput(e) {
    let _obj = {}
    _obj['content'] = e.detail.value
    this.setData(_obj)
  },
  starChange(e) {
    this.setData({
      score: e.detail.score
    })
  },
  submit() {
    if (this.data.content.length < 10) {
      wx.showToast({
        title: '评价内容请输入10字以上哦~',
        icon: 'none'
      })
    } else {
      util.request('/rate/create', {
        order_id: this.data.id,
        content: this.data.content,
        img_json: this.data.covers,
        score: this.data.score
      }).then(res => {
        storageHelper.setStorage('orderListRefresh', '1')
        util.backAndToast('评价成功，感谢您的支持!')
      }).catch(err => {
        console.log('err', err)
      })
    }
  }
})