// pages/orderdetail/orderdetail.js
const util = require('../../utils/util.js')
import storageHelper from '../../utils/storageHelper'

Page({
  name: 'orderdetail',
  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '订单详情',
    id: '',
    order: null,
    traveler_infos: [],
    contact_info: [],
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
        let navWrapperHeight = this.data.navWrapperHeight || 0
        res.data.ticket_text = res.data.ticket.map((item) => {
          return item.name + '×' + item.quantity
        }).join(',')
        let product = res.data.huodong || res.data.vgoods
        // 处理时间格式
        product.valid_btime = product.valid_btime ? util.formatDateTimeDefault('d', product.valid_btime) : ''
        product.valid_etime = product.valid_etime ? util.formatDateTimeDefault('d', product.valid_etime) : ''
        res.data.created_at = util.formatDateTimeDefault('m', res.data.created_at)
        // 处理价格
        res.data.show_price = util.formatMoney(res.data.price).showMoney
        res.data.status = res.data.status.toString()
        let countdown = 0
        let countdown_text = ''
        if (this.countdownTimer) {
          clearInterval(this.countdownTimer)
        }
        if (res.data.remain_time) {
          let app = getApp()
          let systemInfo = app.globalData.systemInfo || wx.getSystemInfoSync()
          let MenuButtonInfo = app.globalData.MenuButtonInfo || wx.getMenuButtonBoundingClientRect()

          const statusBarHeight = systemInfo.statusBarHeight
          const menuTopSpace = MenuButtonInfo.top - statusBarHeight
          const menuHeight = MenuButtonInfo.height
          const navBoxHeight = menuTopSpace * 2 + menuHeight // 导航胶囊上下分别留6px的间隔
          navWrapperHeight = statusBarHeight + navBoxHeight
          countdown = res.data.remain_time
          countdown_text = '剩余支付时间' + this.secondToMinute(res.data.remain_time)
          this.countdownTimer = setInterval(this.startCountdown, 1000)
        }
        let traveler_name_text = ''
        if (product && product.include_bx != 1) { // 不包含保险时生成出行人名字字符串
          traveler_name_text = res.data.traveler_infos.map(item => item.productTraveler.name).join('，')
        }
        let contact_info = []
        for (let key in res.data.form) {
          contact_info.push({label: key, value: res.data.form[key]})
        }
        this.setData({
          traveler_name_text: traveler_name_text,
          countdown: countdown,
          countdown_text: countdown_text,
          product: product,
          order: res.data,
          traveler_infos: res.data.traveler_infos,
          contact_info: contact_info,
          navWrapperHeight
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
      const pages = getCurrentPages()
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].name === 'goodsdetail' && pages[i].data && pages[i].data.id && pages[i].fetchGoods) { // 刷新活动详情页信息
          pages[i].fetchGoods(pages[i].data.id)
        }
      }
      const prePage = pages[pages.length - 2]
      if (prePage && prePage.name === 'orderlist') { // 更新订单列表页的信息
        storageHelper.setStorage('orderListRefresh', '1')
      }
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
        const { nonceStr, paySign, signType, timeStamp} = res.data
        wx.requestPayment({
          timeStamp,
          nonceStr,
          package: res.data.package,
          signType,
          paySign,
          success: () => {
            util.request('/order/pay_result', { id }).then(res => {
              if (res.error == 0) { // 查询结果为已支付
                wx.showToast({
                  title: '支付成功',
                  icon: 'none'
                })
                this.fetchOrder(id) // 重新获取数据
              } else {
                if (res.msg) {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none'
                  })
                }
              }
            }).catch(err => {

            })
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
    let id = null
    if (this.data.product && this.data.product.id) {
      id = this.data.product.id
    }
    if (id !== null) {
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?id=' + id
      })
    }
  },

  shareTap: function (e) {
    const {product_id, pt_id} = e.detail
    if (product_id && pt_id) {
      const poster = this.selectComponent('#c-draw-poster')
      if (poster && poster.startDraw) {
        poster.startDraw(product_id, pt_id)
      }
    }
  }
})