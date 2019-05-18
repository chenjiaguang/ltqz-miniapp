// pages/goodsticket/goodsticket.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '',
    huodong: {},
    hexiao_status_text: { // -1为失效订单|0为待付款|1为待参与|2为待评价|3已评价(当status为2或3时视为已核销)
      '-1': '未核销',
      0: '未核销',
      1: '未核销',
      2: '已核销',
      3: '已核销'
    },
    status: '',
    ticked_num_text: '',
    qr_code_url: '',
    checked_time: '',
    hexiao_staff: '',
    submitting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.options = options
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
    if (this.options && this.options.id) {
      this.fetchOrder(this.options.id)
    }
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

  confirmCode: function(e) {
    let {
      value,
      ctx
    } = e.detail
    let { submitting} = this.data
    if (submitting) {
      return false
    }
    let rData = {
      id: this.options.id,
      hx_code: value
    }
    this.setData({
      submitting: true
    })
    util.request('/order/consume', rData).then(res => {
      console.log('then', rData, res)
      if (res.error == 0 && res.data) { // 请求接口成功
        wx.showToast({
          title: '核销成功',
          icon: 'none'
        })
        this.fetchOrder(this.options.id)
        ctx.close()
      } else {
        if (res.msg) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    }).catch(err => {
      if (err.error == 1) {
        ctx.clearCode()
      }
    }).finally(res => {
      this.setData({
        submitting: false
      })
    })
  },
  goComment: function() { // 跳转去评价页面
    console.log('goComment')
    wx.navigateTo({
      url: '/pages/orderComment/orderComment?id=' + this.data.order_id
    })
  },
  initTicketNumText: function(tickets) {
    let text = ''
    if (tickets && tickets[0]) {
      tickets.forEach((item, idx) => {
        text += (idx === 0 ? (item.name + 'x' + item.quantity) : ('，' + item.name + 'x' + item.quantity))
      })
    }
    return text
  },
  fetchOrder: function (id) {
    util.request('/order/detail', {
      id: id
    }).then(res => {
      console.log('/order/detail', res)
      if (res.error == 0 && res.data) {
        let _obj = {}
        _obj.order_id = res.data.order_id
        _obj.ticked_num_text = this.initTicketNumText(res.data.ticket)
        _obj.huodong = {
          title: res.data.huodong.title,
          address: res.data.huodong.address,
          session: res.data.huodong.session
        }
        _obj.status = res.data.status
        _obj.qr_code_url = res.data.qr_code_url
        _obj.checked_time = res.data.checked_time ? util.formatDateTimeDefault('m', res.data.checked_time) : ''
        this.setData(_obj)
      }
    }).catch(err => {
      
    })
  }
})