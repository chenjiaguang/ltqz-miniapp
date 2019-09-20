// components/orderCard/orderCard.js
const util = require('../../utils/util.js')
const storageHelper = require('../../utils/storageHelper.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusText: { // -4普通退款|-3为手动下架|-2拼团失败|-1为失效订单|0为待付款|1为待参与|2为待评价|3已评价|4待成团|5已过期|6待发货|7已发货
      '-4': '已退款',
      '-3': '已退款',
      '-2': '已取消',
      '-1': '已取消',
      '0': '待付款',
      '1': '待使用',
      '2': '待评价',
      '3': '已完成',
      '4': '拼团中',
      '5': '已完成',
      '6': '待发货',
      '7': '待收货'
    },
    statusClass: { // -4普通退款|-3为手动下架|-2拼团失败|-1为失效订单|0为待付款|1为待参与|2为待评价|3已评价|4待成团|5已过期|6待发货|7已发货
      '-4': 'state-normal',
      '-3': 'state-normal',
      '-2': 'state-normal',
      '-1': 'state-normal',
      '0': 'theme-color',
      '1': 'theme-color',
      '2': 'state-normal',
      '3': 'state-normal',
      '4': 'theme-color',
      '5': 'state-normal',
      '6': 'theme-color',
      '7': 'theme-color'
    },
    repaying: false,
    canceling: false,
    refunding: false,
    confirming: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail() {
      this.navigateTo({
        url: '/pages/orderdetail/orderdetail?id=' + this.data.item.order_id
      })
    },
    goComment() {
      this.navigateTo({
        url: '/pages/orderComment/orderComment?id=' + this.data.item.order_id
      })
    },
    goCancel() {
      const {canceling} = this.data
      if (canceling) {
        return false
      }
      const app = getApp()
      const confirmColor = app.globalData.themeModalConfirmColor || '#576B95' // #576B95是官方颜色
      wx.showModal({
        title: '取消订单',
        content: '取消订单后您可能会错过此商品哦，确定要取消订单吗？',
        showCancel: true,
        confirmText: '确定',
        confirmColor,
        success: res => {
          if (res.confirm) {
            this.cancel()
          }
        }
      })
    },
    cancel: function () {
      let {canceling} = this.data
      const status = this.data.item.status
      const id = this.data.item.order_id
      if (status.toString() !== '0' || canceling) { // 不是待支付状态 或 正在取消
        return false
      }
      this.setData({
        canceling: true
      })
      util.request('/order/cancel', {
        id: id
      }).then(res => {
        if (res.error == 0) { // 成功取消
          wx.showToast({
            title: '订单取消成功',
            icon: 'none'
          })
          this.triggerEvent('orderListRefresh')
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
          canceling: false
        })
      })
    },
    goRefund() {
      const {item: {can_refund}, refunding} = this.data
      if (refunding || !can_refund) {
        return false
      }
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      page.refundData = this.data.item
      this.navigateTo({
        url: '/pages/refundapply/refundapply'
      })
      return false
    },
    refund(form_id) {
      const {item: {can_refund, order_id }, refunding} = this.data
      if (refunding || !can_refund) {
        return false
      }
      this.setData({refunding: true})
      util.request('/order/refund', {
        form_id: form_id,
        id: order_id
      }).then(res => {
        if (res.error == 0) { // 退款成功
          wx.showToast({
            title: res.msg || '退款成功，退款金额将于1-2个工作日原路退回您的付款账户',
            icon: 'none',
            duration: 3000
          })
          this.triggerEvent('orderListRefresh')
        } else {
          if (res.msg) {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(res => {
        this.setData({refunding: false})
      })
    },
    goConfirm: function () {
      const {item: {status}, confirming} = this.data
      if (confirming || status != 7) {
        return false
      }
      const app = getApp()
      const confirmColor = app.globalData.themeModalConfirmColor || '#576B95' // #576B95是官方颜色
      
      wx.showModal({
        title: '确定收货',
        content: '确定已经收到宝贝了吗？',
        showCancel: true,
        confirmText: '确定',
        confirmColor,
        success: res => {
          if (res.confirm) {
            this.confirm()
          }
        }
      })
    },
    confirm: function () {
      const {item: {status, order_id }, confirming} = this.data
      if (confirming || status != 7) {
        return false
      }
      this.setData({confirming: true})
      util.request('/order/receipt', {
        id: order_id
      }).then(res => {
        if (res.error == 0) { // 收货成功
          wx.showToast({
            title: res.msg || '交易成功啦！快去评价一下宝贝吧~',
            icon: 'none',
            duration: 3000
          })
          this.triggerEvent('orderListRefresh')
        } else {
          if (res.msg) {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(res => {
        this.setData({confirming: false})
      })
    },
    goPay() {
      let { repaying} = this.data
      const status = this.data.item.status
      const id = this.data.item.order_id
      if (status.toString() !== '0' || repaying) { // 不是待支付状态 或 正在支付
        return false
      }
      this.setData({
        repaying: true
      })
      util.request('/order/pay', {
        id: id
      }).then(res => {
        let data = Object.assign({}, res.data, {
          success: () => {
            util.request('/order/pay_result', {
              id: id
            }).then(res => {
              if (res.error == 0) { // 查询结果为已支付
                wx.showToast({
                  title: '支付成功',
                  icon: 'none'
                })
                this.triggerEvent('orderListRefresh')
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
            })
          }
        })
        wx.requestPayment(data)
      }).catch(err => {
        console.log('err', err)
      }).finally(res => {
        this.setData({
          repaying: false
        })
      })
    },
    goTicket() {
      this.navigateTo({
        url: '/pages/goodsticket/goodsticket?id=' + this.data.item.order_id
      })
    },
    shareTap: function (e) {
      const { product_id, tuan_id} = this.data.item
      this.triggerEvent('share', {
        product_id,
        pt_id: tuan_id
      })
    }
  }
})