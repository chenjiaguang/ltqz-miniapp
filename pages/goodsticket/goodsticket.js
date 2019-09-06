// pages/goodsticket/goodsticket.js
const util = require('../../utils/util.js')
const storageHelper = require('../../utils/storageHelper.js')

Page({
  name: 'goodsticket',
  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '电子票',
    order_id: '',
    product: {},
    hexiao_status_text: { // -3为手动下架|-2拼团失败|-1为失效订单|0为待付款|1为待参与|2为待评价|3已评价|4待成团|5已过期
      '-3': '未核销',
      '-2': '未核销',
      '-1': '未核销',
      '0': '未核销',
      '1': '未核销',
      '2': '已核销',
      '3': '已核销',
      '4': '未核销',
      '5': '未核销'
    },
    status: '',
    ticked_num_text: '',
    qr_code_url: '',
    checked_time: '',
    hexiao_staff: '',
    submitting: false,
    ticket_total: 0,
    ticket_can_use: 0,
    can_check: false,
    tickets: [],
    choosedLen: 0,
    loaded: false
  },

  fetchTimer: null,

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
    if (this.fetchTimer) {
      clearTimeout(this.fetchTimer)
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
  // onShareAppMessage: function() {

  // },

  goConfirm: function (e) {
    const {tickets} = this.data
    if (tickets && tickets.length > 1) { // 多张券，弹出选券弹窗
      this.toggleTickets()
    } else { // 一张券，则直接弹出核销码输入弹窗
      const confirmCode = this.selectComponent('#confirm-code')
      if (confirmCode) {
        confirmCode.open(e)
      }
    }
  },

  toggleTickets: function () { // 显示/隐藏券
    const ftModal = this.selectComponent('#c-ft-modal')
    ftModal && ftModal.toggle && ftModal.toggle()
  },

  hideTickets: function () { // 隐藏券
    const ftModal = this.selectComponent('#c-ft-modal')
    ftModal && ftModal.hide && ftModal.hide()
  },

  ticketChange: function (e) { // 选择券
    const {idx} = e.currentTarget.dataset
    const {tickets} = this.data
    if (tickets[idx].is_check) { // 已经核销过该券码
      return false
    }
    const choosed = !tickets[idx].choosed
    let choosedLen = tickets.filter(item => item.choosed).length
    choosedLen += choosed ? 1 : -1
    let _obj = {[`tickets[${idx}].choosed`]: choosed, choosedLen}
    this.setData(_obj)
  },

  changeAllTicket: function () {
    const {choosedLen, tickets, ticket_can_use} = this.data
    let _obj = {}
    _obj.choosedLen = 0
    tickets.forEach((item, idx) => {
      if (!item.is_check) {
        _obj['tickets[' + idx + '].choosed'] = choosedLen != ticket_can_use
        _obj.choosedLen += choosedLen != ticket_can_use ? 1 : 0
      }
    })
    this.setData(_obj)
  },

  confirmBtnTap: function (e) { // 点击选择券页面的确认按钮
    this.toggleTickets()
    const confirmCode = this.selectComponent('#confirm-code')
    if (confirmCode) {
      confirmCode.open(e)
    }
  },

  confirmCode: function(e) {
    let {
      value,
      ctx
    } = e.detail
    let { submitting, tickets} = this.data
    let ticket_ids = []
    if (tickets && tickets.length === 1) { // 只有一张券
      ticket_ids = [tickets[0].id]
    } else if (tickets && tickets.length > 1) { // 多张券
      ticket_ids = tickets.filter(item => item.choosed).map(item => item.id)
    }
    if (submitting || !tickets || !tickets.length || !ticket_ids.length) { // 正在提交 或 无券 或 无选中的券
      return false
    }
    let rData = {
      id: this.options.id,
      hx_code: value,
      ticket_ids: ticket_ids
    }
    this.setData({
      submitting: true
    })
    util.request('/order/consume', rData).then(res => {
      if (res.error == 0) { // 请求接口成功
        wx.showToast({
          title: res.msg || '核销成功',
          icon: 'none'
        })
        const pages = getCurrentPages()
        for (let i = 0; i < pages.length; i++) {
          if (pages[i].name === 'orderdetail' && pages[i].fetchOrder && pages[i].data.order && pages[i].data.order.order_id) { // 上个页面是订单详情页，更新订单详情页的信息
            pages[i].fetchOrder(pages[i].data.order.order_id)
          }
          if (pages[i].name === 'orderlist') { // 更新订单列表页的信息
            storageHelper.setStorage('orderListRefresh', '1')
          }
        }
        this.fetchOrder(this.options.id)
        ctx.close()
      } else {
        if (res.error == 1) { // 核销码错误，则仅仅清除以输入等核销码
          ctx.clearCode()
        } else { // 否则关闭核销弹窗
          ctx.close()
        }
        if (res.msg) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
        }
      }
    }).catch(err => {
      if (err.error == 1) { // 核销码错误，则仅仅清除以输入等核销码
        ctx.clearCode()
      } else { // 否则关闭核销弹窗
        ctx.close()
      }
      if (err.msg) {
        wx.showToast({
          title: err.msg,
          icon: 'none',
          duration: 3000
        })
      }
    }).finally(res => {
      this.setData({
        submitting: false
      })
    })
  },
  goComment: function() { // 跳转去评价页面
    this.navigateTo({
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
      if (res.error == 0 && res.data) {
        if (res.data.status == 1) { // 如果是未核销状态，轮询更新状态信息
          if (this.fetchTimer) {
            clearTimeout(this.fetchTimer)
          }
          const pages = getCurrentPages()
          const page = pages[pages.length - 1]
          if (page.name === 'goodsticket') {
            this.fetchTimer = setTimeout(() => {
              this.updateOrder(id, true)
            }, 1000)
          }
        }
        let _obj = {}
        _obj.loaded = true
        _obj.hx_rule = res.data.hx_rule
        _obj.type = res.data.type
        _obj.order_id = res.data.order_id
        _obj.ticked_num_text = this.initTicketNumText(res.data.ticket)
        let product = res.data.product || res.data.huodong || res.data.vgoods || res.data.goods
        _obj.product = {
          title: product.title,
          address: product.address,
          session: product.session
        }
        _obj.status = res.data.status
        _obj.qr_code_url = res.data.qr_code_url
        _obj.checked_time = res.data.checked_time ? util.formatDateTimeDefault('m', res.data.checked_time) : ''
        _obj.ticket_total = res.data.ticket_total
        _obj.ticket_can_use = res.data.ticket_can_use
        _obj.can_check = res.data.can_check
        _obj.choosedLen = 0
        _obj.tickets = res.data.ticket_list.map(item => ({code: item.code, id: item.id, is_check: item.is_check, order_id: item.order_id, choosed: false}))
        this.setData(_obj)
      }
    }).catch(err => {
      
    })
  },
  updateOrder: function (id, updateOtherPage) {
    util.request('/order/detail', {
      id: id
    }).then(res => {
      if (res.error == 0 && res.data) {
        const {status} = this.data
        if (res.data.status == 1) { // 如果是未核销状态，轮询更新状态信息
          if (this.fetchTimer) {
            clearTimeout(this.fetchTimer)
          }
          const pages = getCurrentPages()
          const page = pages[pages.length - 1]
          if (page.name === 'goodsticket') {
            this.fetchTimer = setTimeout(() => {
              this.updateOrder(id, true)
            }, 1000)
          }
        } else {
          if (status == res.data.status) {
            return false
          }
          if (updateOtherPage) {
            const pages = getCurrentPages()
            for (let i = 0; i < pages.length; i++) {
              if (pages[i].name === 'orderdetail' && pages[i].fetchOrder && pages[i].data.order && pages[i].data.order.order_id) { // 上个页面是订单详情页，更新订单详情页的信息
                pages[i].fetchOrder(pages[i].data.order.order_id)
              }
              if (pages[i].name === 'orderlist') { // 更新订单列表页的信息
                storageHelper.setStorage('orderListRefresh', '1')
              }
            }
          }
          if (status == 1 && (res.data.status == 2 || res.data.status == 3)) { // 上个状态是未核销，现在是核销
            wx.showToast({
              title: '核销成功',
              icon: 'none'
            })
          }
          let _obj = {}
          _obj.hx_rule = res.data.hx_rule
          _obj.type = res.data.type
          _obj.order_id = res.data.order_id
          _obj.ticked_num_text = this.initTicketNumText(res.data.ticket)
          let product = res.data.product || res.data.huodong || res.data.vgoods || res.data.goods
          _obj.product = {
            title: product.title,
            address: product.address,
            session: product.session
          }
          _obj.status = res.data.status
          _obj.qr_code_url = res.data.qr_code_url
          _obj.checked_time = res.data.checked_time ? util.formatDateTimeDefault('m', res.data.checked_time) : ''
          _obj.ticket_total = res.data.ticket_total
          _obj.ticket_can_use = res.data.ticket_can_use
          _obj.can_check = res.data.can_check
          _obj.choosedLen = 0
          _obj.tickets = res.data.ticket_list.map(item => ({code: item.code, id: item.id, is_check: item.is_check, order_id: item.order_id, choosed: false}))
          this.setData(_obj)
        }
      }
    }).catch(err => {

    })
  }
})