// pages/signupmanager/signupmanager.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shippingMap: [],
    shippingIndex: '',
    shippingNumber: '',
    navTitle: '订单详情',
    genderText: {
      0: '保密',
      1: '男',
      2: '女'
    },
    statusText: { // -4普通退款|-3为手动下架|-2拼团失败|-1为失效订单|0为待付款|1为待参与|2为待评价|3已评价|4待成团|5已过期|6待发货|7已发货
      '-4': '已退款',
      '-3': '已取消',
      '-2': '已取消',
      '-1': '已取消',
      '0': '',
      '1': '待使用',
      '2': '已核销',
      '3': '已核销',
      '4': '',
      '5': ''
    },
    id: '',
    product_id: '',
    join_num: '',
    js_price: '',
    list: [],
    page: null,
    loading: false,
    confirmShipping: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      product_id: options.product_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.fetchData(1)
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
    const {page, loading} = this.data
    if (!page || (page && !page.pn) || (page && page.is_end) || loading) {
      return false
    }
    this.fetchData(parseInt(page.pn) + 1)
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // },
  fetchData: function(pn = 1) {
    this.setData({
      loading: true
    })
    util.request('/admin/product/detail', {
      id: this.data.id,
      product_id: this.data.product_id,
      pn: pn
    }).then(res => {
      const {genderText} = this.data
      res.data.js_price = util.formatMoney(res.data.js_price).showMoney
      res.data.list.forEach((item) => {
        item.js_price = util.formatMoney(item.js_price).showMoney
        item.real_income = util.formatMoney(item.real_income).showMoney
        // item.content = item.ticket.map((ticket) => {
        //   return ticket.name + 'x' + ticket.quantity
        // }).join('，') + '，共计￥' + item.order.js_price
        item.tableContent = []
        if ((item.status == 6 || item.status == 7 || item.status == 1) && item.hx_status == 0) {
          item.tableContent.push({title: '预计收入', content: '¥' + item.js_price})
        } else {
          item.tableContent.push({title: '实际收入', content: '¥' + item.real_income})
        }
        // item.tableContent.push({title: '预计收入', content: '¥' + item.order.js_price})
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
      let shippingMap = []
      if (res.data.shipper_map) {
        for (let key in res.data.shipper_map) {
          shippingMap.push(res.data.shipper_map[key])
        }
      }
      if (pn == 1) {
        this.setData({
          type: res.data.type,
          shippingMap: shippingMap,
          join_num: res.data.join_num,
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
  callPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  goDetail() {
    this.navigateTo({
      url: '/pages/goodsdetail/goodsdetail?id=' + this.data.product_id
    })
  },
  tapItem() {
    wx.vibrateShort()
  },
  showConfirmDeliver: function (e) {
    const {shop_id, order_id} = e.detail
    if (shop_id && order_id) {
      this.showConfirmModal(shop_id, order_id)
    }
  },
  shippingChange: function (e) {
    const {value} = e.detail
    this.setData({shippingIndex: parseInt(value)})
  },
  shippingNumberInput: function (e) {
    const {value} = e.detail
    this.setData({shippingNumber: value})
  },
  stopPropagation: function () {
    return false
  },
  hideConfirmModal: function () {
    const {shippingIndex, shippingNumber} = this.data
    if (!this.shippingRecord) {
      this.shippingRecord = {}
    }
    this.shippingRecord[this.order_id.toString()] = {
      shippingIndex,
      shippingNumber
    }
    const ftModal = this.selectComponent('#c-ft-modal')
    if (ftModal && ftModal.hide) {
      ftModal.hide()
    }
  },
  showConfirmModal: function (shop_id, order_id) {
    this.shop_id = shop_id
    this.order_id = order_id
    if (this.shippingRecord && this.shippingRecord[order_id.toString()]) {
      this.setData({
        shippingIndex: this.shippingRecord[order_id.toString()].shippingIndex,
        shippingNumber: this.shippingRecord[order_id.toString()].shippingNumber
      })
    } else {
      this.setData({
        shippingIndex: '',
        shippingNumber: ''
      })
    }
    const ftModal = this.selectComponent('#c-ft-modal')
    if (ftModal && ftModal.show) {
      ftModal.show()
    }
  },
  confirmTap: function () {
    const {shippingMap, shippingIndex, shippingNumber, confirmShipping} = this.data
    if (!shippingIndex && shippingIndex !== 0) {
      wx.showToast({
        title: '请选择快递公司',
        icon: 'none'
      })
      return false
    } else if (!shippingNumber) {
      wx.showToast({
        title: '请输入快递单号',
        icon: 'none'
      })
      return false
    }
    if (confirmShipping) {
      return false
    }
    const s_id = this.shop_id
    const o_id = this.order_id
    const ship_num = shippingNumber
    const ship_index = shippingMap[shippingIndex]
    let rData = {
      id: s_id,
      order_id: o_id,
      express_number: ship_num,
      express_company: ship_index,
    }
    this.setData({
      confirmShipping: true
    })
    util.request('/admin/product/delivery', rData).then(res => {
      if (res && (res.error === 0 || res.error === '0')) {
        wx.showToast({
          title: res.msg || '确认发货成功啦~',
          icon: 'none'
        })
        this.updateItemStatus(o_id, '7', ship_index, ship_num)
        this.hideConfirmModal()
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
        confirmShipping: false
      })
    })
  },
  updateItemStatus: function (order_id, status, express_company, express_number) {
    const {list} = this.data
    list.forEach(item => {
      if (item.id == order_id) {
        item.status = status
        item.express_company = express_company
        item.express_number = express_number
      }
    })
    this.setData({list})
  }
})