// pages/refundlist/refundlist.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '退款申请',
    rejectRecord: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    this.fetchData(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },

  fetchData: function(pn = 1) {
    this.setData({
      loading: true
    })
    util.request('/admin/product/detail', {
      id: this.options.id,
      refund_info: true,
      pn: pn
    }).then(res => {
      const {genderText} = this.data
      res.data.js_price = util.formatMoney(res.data.js_price).showMoney
      res.data.list.forEach((item) => {
        item.order.js_price = util.formatMoney(item.order.js_price).showMoney
        // item.content = item.ticket.map((ticket) => {
        //   return ticket.name + 'x' + ticket.quantity
        // }).join('，') + '，共计￥' + item.order.js_price
        item.tableContent = []
        item.tableContent.push({title: '商品名称', content: item.product_name, c_color: '#637BD9', isGoods: true, goodsid: item.product_id})
        item.tableContent.push({title: '预计收入', content: '¥' + item.order.js_price})
        item.tableContent.push({title: '已购数量', content: item.ticket.map((ticket) => {
          return ticket.name + 'x' + ticket.quantity
        }).join('，')})
        if (item.traveler_infos && item.traveler_infos.length) {
          item.traveler_infos.forEach((traveler, idx) => {
            item.tableContent.push({title: '出行人' + (idx + 1), content: traveler.name + (genderText[traveler.sex] ? ('，' + genderText[traveler.sex]) : '') + (traveler.id_number ? ('，' + traveler.id_number) : '')})
          })
        }
        if (item.form && item.form.length) {
          for (let key in item.form) {
            if (item.form[key] !== '') {
              let conData = {}
              conData.title = key
              conData.content = item.form[key]
              if (item.form[key] + '' && item.phone && item.phone + '') {
                conData.isPhone = item.form[key].toString() === item.phone.toString()
                conData.c_color = item.form[key].toString() === item.phone.toString() ? '#637BD9' : ''
              }
              item.tableContent.push(conData)
            }
          }
        }
        if (item.contact_who) {
          item.tableContent.push({title: '收货人', content: item.contact_who})
        }
        if (item.contact_phone) {
          item.tableContent.push({title: '收货电话', content: item.contact_phone.toString(), isPhone: true, c_color: '#637BD9'})
        }
        if (item.contact_address) {
          item.tableContent.push({title: '收货地址', content: item.contact_address})
        }
      })
      if (pn == 1) {
        this.setData({
          js_price: res.data.js_price,
          list: res.data.list,
          page: res.data.page,
          loading: false
        })
      } else {
        let list = this.data.list
        list = list.concat(res.data.list)
        this.setData({
          list: list,
          page: res.data.page,
          loading: false
        })
      }
    }).catch(err => {
      console.log('err', err)
    })
  },
  showReject: function (e) {
    const {shop_id, order_id} = e.detail
    if (shop_id && order_id) {
      this.showRejectModal(shop_id, order_id)
    }
  },
  areaFocus: function () {
    this.setData({areaFocus: true})
  },
  areaBlur: function () {
    this.setData({areaFocus: false})
  },
  rejectRecordInput: function (e) {
    const {value} = e.detail
    this.setData({rejectRecord: value})
  },
  stopPropagation: function () {
    return false
  },
  hideRejectModal: function () {
    const {rejectRecord} = this.data
    if (!this.rejectRecord) {
      this.rejectRecord = {}
    }
    this.rejectRecord[this.order_id.toString()] = rejectRecord
    const ftModal = this.selectComponent('#c-ft-modal')
    if (ftModal && ftModal.hide) {
      ftModal.hide()
    }
  },
  showRejectModal: function (shop_id, order_id) {
    this.shop_id = shop_id
    this.order_id = order_id
    if (this.rejectRecord && this.rejectRecord[order_id.toString()]) {
      this.setData({
        rejectRecord: this.rejectRecord[order_id.toString()]
      })
    }
    const ftModal = this.selectComponent('#c-ft-modal')
    if (ftModal && ftModal.show) {
      ftModal.show()
    }
  },
  confirmTap: function (e) {
    const {agree} = e.currentTarget.dataset
    const {shop_id, order_id} = e.detail
    if (shop_id) {
      this.shop_id = shop_id
    }
    if (order_id) {
      this.order_id = order_id
    }
    if (agree) {
      const app = getApp()
      const confirmColor = app.globalData.themeModalConfirmColor || '#576B95' // #576B95是官方颜色
      wx.showModal({
        title: '同意退款',
        content: '确定同意此退款申请吗？请注意避免损失哦~',
        showCancel: true,
        confirmText: '确定',
        confirmColor,
        success: res => {
          if (res.confirm) {
            this.confirmRefund(agree)
          }
        }
      })
    } else {
      this.confirmRefund(agree)
    }
  },
  confirmRefund: function (agree) {
    const {rejectRecord, refundConfirming} = this.data
    if (!agree && !rejectRecord) { // 提交的是拒绝 且 无拒绝原因
      wx.showToast({
        title: '请输入拒绝原因',
        icon: 'none'
      })
      return false
    }
    if (refundConfirming) {
      return false
    }
    const s_id = this.shop_id
    const o_id = this.order_id
    let rData = {
      id: s_id,
      order_id: o_id,
      agree,
      reject_reason: rejectRecord
    }
    this.setData({
      refundConfirming: true
    })
    this.hideRejectModal()
    util.request('/admin/product/deal_refund', rData).then(res => {
      if (res && (res.error === 0 || res.error === '0')) {
        wx.showToast({
          title: res.msg || (agree ? '您已同意用户的退款申请' : '您已拒绝了用户的退款申请'),
          icon: 'none'
        })
        this.hideItem(o_id)
        this.hideRejectModal()
      } else {
        if (res.msg) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    }).finally(res => {
      this.setData({
        refundConfirming: false
      })
    })
  },
  hideItem: function (order_id) {
    const {list} = this.data
    let _list = list.filter(item => item.order_id != order_id)
    this.setData({list: _list})
  }
})