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
    statusText: { // -4为已退款|-3为手动下架|-2拼团失败|-1为失效订单|0为待付款|1为待参与|2为待评价|3已评价|4待成团|5已过期
      '-4': '已退款',
      '-3': '已取消',
      '-2': '已取消',
      '-1': '已取消',
      '0': '待付款',
      '1': '待使用',
      '2': '待评价',
      '3': '已完成',
      '4': '拼团中',
      '5': '已完成'
    },
    statusClass: { // -4为已退款|-3为手动下架|-2拼团失败|-1为失效订单|0为待付款|1为待参与|2为待评价|3已评价|4待成团|5已过期
      '-4': 'state-normal',
      '-3': 'state-normal',
      '-2': 'state-normal',
      '-1': 'state-normal',
      '0': 'state-red',
      '1': 'theme-color',
      '2': 'state-normal',
      '3': 'state-normal',
      '4': 'theme-color',
      '5': 'state-normal'
    },
    repaying: false,
    canceling: false,
    refunding: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail() {
      wx.navigateTo({
        url: '/pages/orderdetail/orderdetail?id=' + this.data.item.order_id
      })
    },
    goComment() {
      wx.navigateTo({
        url: '/pages/orderComment/orderComment?id=' + this.data.item.order_id
      })
    },
    goCancel() {
      console.log('goCancel')
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
      console.log('cancel')
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
      console.log('goRefund')
      const {item: {can_refund, refund_all, refund_amount}, refunding} = this.data
      if (refunding || !can_refund) {
        return false
      }
      const app = getApp()
      const confirmColor = app.globalData.themeModalConfirmColor || '#576B95' // #576B95是官方颜色
      if (refund_all) {
        wx.showModal({
          title: '订单退款',
          content: '退款后您可能会错过此商品哦，确定要退款吗？',
          showCancel: true,
          confirmText: '确定',
          confirmColor,
          success: res => {
            if (res.confirm) {
              this.refund()
            }
          }
        })
      } else {
        wx.showModal({
          title: '订单退款',
          content: '本商品属于特价商品，退款需用户承担一定手续费，退款金额为' + refund_amount + '元，您确定要退款吗？',
          showCancel: true,
          confirmText: '确定',
          confirmColor,
          success: res => {
            if (res.confirm) {
              this.refund()
            }
          }
        })
      }
    },
    refund() {
      console.log('refund')
      const {item: {can_refund, order_id }, refunding} = this.data
      if (refunding || !can_refund) {
        return false
      }
      this.setData({refunding: true})
      util.request('/order/refund', {
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
      wx.navigateTo({
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