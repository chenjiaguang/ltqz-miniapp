// pages/businessassistant/businessassistant.js
const util = require('../../utils/util.js')

Page({
  name: 'businessassistant',
  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '商家助手',
    id: '',
    data: null,
    hexiao_entrance: {
      title: '商家核销码：',
      path: '/pages/hexiaosetting/hexiaosetting'
    },
    other_entrances: [{
        title: '订单管理',
        path: '/pages/activitymanager/activitymanager'
      },{
        title: '到账明细',
        path: '/pages/billlist/billlist'
      },{
        title: '待处理退款申请',
        path: '/pages/refundlist/refundlist'
      },
      {
        title: '评价管理',
        path: '/pages/commentmanager/commentmanager'
      },
      {
        title: '常见问题',
        path: '/pages/statement/statement?type=5'
      }
    ],
    ticketGetting: false, // 是否正在获取券码
    submitting: false,
    webLoging: false,
    ticket_total: 0,
    ticket_can_use: 0,
    can_check: false,
    tickets: [],
    choosedLen: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.options = options
    let hexiao_entrance = this.data.hexiao_entrance
    hexiao_entrance.path = hexiao_entrance.path + '?id=' + options.id

    let other_entrances = this.data.other_entrances
    other_entrances[0].path = other_entrances[0].path + '?id=' + options.id
    other_entrances[1].path = other_entrances[1].path + '?id=' + options.id
    other_entrances[2].path = other_entrances[2].path + '?id=' + options.id
    other_entrances[3].path = other_entrances[3].path + '?role=business&sid=' + options.id

    this.setData({
      id: options.id,
      hexiao_entrance: hexiao_entrance,
      other_entrances: other_entrances
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    util.request('/admin/shop/detail', {
      id: this.data.id
    }).then(res => {
      res.data.total_income = util.formatMoney(res.data.total_income).showMoney
      res.data.has_js_income = util.formatMoney(res.data.has_js_income).showMoney
      res.data.no_js_income = util.formatMoney(res.data.no_js_income).showMoney
      let other_entrances = this.data.other_entrances
      other_entrances[0].title = other_entrances[0].title.split('（')[0] + '（' + res.data.product_num + '）'
      other_entrances[3].title = other_entrances[3].title.split('（')[0] + '（' + res.data.rate_num + '）'
      let _obj = {}
      _obj.data = res.data
      _obj.other_entrances = other_entrances
      _obj.wait_refund = res.data.wait_refund
      this.setData(_obj)
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
  // onShareAppMessage: function() {

  // },

  goShopInfo: function () {
    this.navigateTo({
      url: `/pages/businessinfo/businessinfo?id=${this.options.id}`
    })
  },

  showTickets: function () { // 显示/隐藏券
    const ftModal = this.selectComponent('#c-ft-modal')
    ftModal && ftModal.show && ftModal.show()
  },

  hideTickets: function () { // 显示/隐藏券
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
    const {submitting, tickets, can_check} = this.data
    let ticket_ids = tickets.filter(item => item.choosed).map(item => item.id)
    if (!can_check || submitting || !tickets || !tickets.length || !ticket_ids.length) { // 正在提交 或 无券 或 无选中的券
      return false
    }

    let rData = {
      id: this.data.id,
      qr_code: this.qr_code_result,
      ticket_ids: ticket_ids
    }
    this.hideTickets()
    this.setData({
      submitting: true
    })
    util.request('/admin/hx/consume', rData).then(res => {
      // if (res.error == 0) {
      //   wx.showToast({
      //     title: '核销成功',
      //     icon: 'none'
      //   })
      // } else {
      //   if (res.msg) {
      //     wx.showToast({
      //       title: res.msg,
      //       icon: 'none'
      //     })
      //   }
      // }
      if (res.msg) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log('err', err)
    }).finally(res => {
      this.setData({
        submitting: false
      })
    })
  },

  hexiaoRequest: function (rData) {
    this.setData({
      ticketGetting: true
    })
    util.request('/admin/hx/order_ticket', rData).then(res => {
      if (res.error == 0) {
        let _obj = {}
        _obj.ticket_total = res.data.ticket_total
        _obj.ticket_can_use = res.data.ticket_can_use
        _obj.can_check = res.data.can_check
        _obj.choosedLen = 0
        _obj.tickets = res.data.ticket_list.map(item => ({code: item.code, id: item.id, is_check: item.is_check, order_id: item.order_id, choosed: false}))
        this.setData(_obj, () => {
          this.qr_code_result = e.result
          this.showTickets()
        })
      } else {
        if (res.msg) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    }).catch(err => {
      console.log('err', err)
    }).finally(res => {
      this.setData({
        ticketGetting: false
      })
    })
  },

  loginRequest: function (rData) {
    this.setData({
      webLoging: true
    })
    util.request('/admin/houtai/login', rData).then(res => {
      if (res.msg) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
      // if (res.error == 0) {
      //   let _obj = {}
      //   _obj.ticket_total = res.data.ticket_total
      //   _obj.ticket_can_use = res.data.ticket_can_use
      //   _obj.can_check = res.data.can_check
      //   _obj.choosedLen = 0
      //   _obj.tickets = res.data.ticket_list.map(item => ({code: item.code, id: item.id, is_check: item.is_check, order_id: item.order_id, choosed: false}))
      //   this.setData(_obj, () => {
      //     this.qr_code_result = e.result
      //     this.showTickets()
      //   })
      // } else {
      //   if (res.msg) {
      //     wx.showToast({
      //       title: res.msg,
      //       icon: 'none'
      //     })
      //   }
      // }
    }).catch(err => {
      console.log('err', err)
    }).finally(res => {
      this.setData({
        webLoging: false
      })
    })
  },

  scanHexiaoCode: function() { // 1为扫码核销权限|2为回复评论权限|3为微信接收下单通知
    if (this.data.data.access.indexOf('1') == -1) {
      wx.showToast({
        title: '您无此操作权限哦~',
        icon: 'none'
      })
    } else {
      wx.scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode'],
        success: e => {
          console.log('scancode', e)
          const {ticketGetting, submitting, webLoging} = this.data
          const isLoginQr = e.result.indexOf('login_qr') === 0
          if (isLoginQr) { // 扫码登录商家后台
            if (webLoging) { // 正在登录
              return false
            }
            let rData = {
              shop_id: this.data.id,
              str: e.result
            }
            this.loginRequest(rData)
          } else { // 扫码核销
            if (ticketGetting || submitting) { // 正在获取券码 或 正在核销中
              return false
            }
            let rData = {
              id: this.data.id,
              qr_code: e.result
            }
            this.hexiaoRequest(rData)
          }
          // if (ticketGetting || submitting) { // 正在获取券码 或 正在核销中
          //   return false
          // }
          // this.setData({
          //   ticketGetting: true
          // })
          // util.request('/admin/hx/order_ticket', {
          //   id: this.data.id,
          //   qr_code: e.result
          // }).then(res => {
          //   if (res.error == 0) {
          //     let _obj = {}
          //     _obj.ticket_total = res.data.ticket_total
          //     _obj.ticket_can_use = res.data.ticket_can_use
          //     _obj.can_check = res.data.can_check
          //     _obj.choosedLen = 0
          //     _obj.tickets = res.data.ticket_list.map(item => ({code: item.code, id: item.id, is_check: item.is_check, order_id: item.order_id, choosed: false}))
          //     this.setData(_obj, () => {
          //       this.qr_code_result = e.result
          //       this.showTickets()
          //     })
          //   } else {
          //     if (res.msg) {
          //       wx.showToast({
          //         title: res.msg,
          //         icon: 'none'
          //       })
          //     }
          //   }
          // }).catch(err => {
          //   console.log('err', err)
          // }).finally(res => {
          //   this.setData({
          //     ticketGetting: false
          //   })
          // })
        },
        fail: e => {
          console.log('fail', e)
        }
      })
    }
  },

  entranceTapHx: function(e) {
    if (this.data.data.access.indexOf('1') == -1) {
      wx.showToast({
        title: '您无此操作权限哦~',
        icon: 'none'
      })
    } else {
      this.entranceTap(e)
    }
  },

  entranceTap: function(e) {
    const {
      path,
      phone
    } = e.detail
    if (path.indexOf('/pages/commentmanager/commentmanager') !== -1 && this.data.data.access.indexOf('2') == -1) { // 是评价管理入口，且无回复权限，则提示暂无权限
      wx.showToast({
        title: '您无此操作权限哦~',
        icon: 'none'
      })
      return false
    }
    if (path) {
      this.navigateTo({
        url: path
      })
    }
  },

  provideCode: function () {
    return (this.data.data && this.data.data.hx_code) ? this.data.data.hx_code : ''
  }
})