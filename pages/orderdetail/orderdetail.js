// pages/orderdetail/orderdetail.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    order: null,
    traveler_infos: [],
    countdown: 0,
    countdown_text: '',
    repaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fetchOrder(options.id)
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
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
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
  onShareAppMessage: function(e) {

  },

  secondToMinute: function (seconds) {
    if (seconds <= 0) {
      return '00:00'
    }
    let min = seconds / 60
    let second = seconds % 60
    min = (min >= 10) ? parseInt(min) : ('0' + parseInt(min))
    second = (second >= 10) ? second : ('0' + second)
    return [min, second].join(':')
  },

  fetchOrder: function (id) {
    util.request('/order/detail', {id}).then(res => {
      if (res.error == 0 && res.data) {
        res.data.ticket_text = res.data.ticket.map((item) => {
          return item.name + '×' + item.quantity
        }).join(',')
        res.data.show_price = util.formatMoney(res.data.price).showMoney
        res.data.status = res.data.status.toString()
        let countdown = 0
        let countdown_text = ''
        if (this.countdownTimer) {
          clearInterval(this.countdownTimer)
        }
        if (res.data.remain_time) {
          countdown = res.data.remain_time
          countdown_text = '剩余支付时间' + this.secondToMinute(res.data.remain_time)
          this.countdownTimer = setInterval(this.startCountdown, 1000)
        }
        this.setData({
          countdown: countdown,
          countdown_text: countdown_text,
          huodong: res.data.huodong,
          order: res.data,
          traveler_infos: res.data.traveler_infos
        })
      }
    }).catch(err => { })
  },

  startCountdown: function (time) {
    const { countdown } = this.data
    
    let _countdown = 0
    let _countdown_text = ''
    let remain_time = countdown - 1
    if (remain_time <= 0) {
      clearInterval(this.countdownTimer)
      this.setData({
        countdown: _countdown,
        countdown_text: _countdown_text,
      })
      this.fetchOrder(this.data.order.order_id)
      return false
    }
    _countdown = remain_time
    _countdown_text = '剩余支付时间' + this.secondToMinute(remain_time)
    this.setData({
      countdown: _countdown,
      countdown_text: _countdown_text,
    })
  },

  goGoodsTicket() {
    wx.navigateTo({
      url: '/pages/goodsticket/goodsticket?id=' + this.data.order.order_id
    })
  },

  repay: function () { // 重新支付
    let { repaying} = this.data
    const status = this.data.order.status
    const id = this.data.order.order_id
    if (status.toString() !== '0' || repaying) { // 不是待支付状态 或 正在支付
      return false
    }
    this.setData({
      repaying: true
    })
    util.request('/order/pay', {id}).then(res => {
      if (res.error == 0 && res.data) {
        console.log('res.data', res.data)
        const { nonceStr, paySign, signType, timeStamp} = res.data
        wx.requestPayment({
          timeStamp,
          nonceStr,
          package: res.data.package,
          signType,
          paySign,
          success: () => {
            this.fetchOrder(id)
          }
        })
      }
    }).catch(err => {
      
    }).finally(res => {
      this.setData({
        repaying: false
      })
    })
  },

  goGoodsDetail() {
    wx.navigateTo({
      url: '/pages/goodsdetail/goodsdetail?id=' + this.data.order.order_id
    })
  }
})