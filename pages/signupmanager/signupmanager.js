// pages/signupmanager/signupmanager.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFixedFilter: true,
    offline: false, // 表示该商品是否下架
    dateFilter: [],
    dateSelected: '',
    dateSelectedShow: '',
    statusFilter: [],
    statusSelected: 0,
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
    join_num: '',
    js_price: '',
    list: [],
    page: null,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.options = options
    const now = new Date()
    const start = '2019-01'
    const end = [now.getFullYear(), (now.getMonth() + 1) > 9 ? now.getMonth() + 1 : ('0' + (now.getMonth() + 1))].join('-')
    const offline = options.status == -3 || options.status == -2 || options.status == -1 || options.status == 0
    let statusArr = []
    if (options.type == 3) { // 物流商品
      if (offline) {
        statusArr = [{status: '', text: '全部'}, {status: '-3', text: '已取消'}, {status: ['2', '3'], text: '已完成'}, {status: '-4', text: '已退款'}]
      } else {
        statusArr = [{status: '', text: '全部'}, {status: '6', text: '待发货', hx_status: '0'}, {status: '7', text: '已发货'}, {status: ['2', '3'], text: '已完成'}, {status: '-4', text: '已退款'}]
      }
    } else {
      if (offline) {
        statusArr = [{status: '', text: '全部'}, {status: '-3', text: '已取消'}, {status: ['2', '3'], text: '已完成'}, {status: '-4', text: '已退款'}]
      } else {
        statusArr = [{status: '', text: '全部'}, {status: '1', text: '待使用', hx_status: '0'}, {status: '1', text: '已核销', hx_status: '1'}, {status: ['2', '3'], text: '已完成'}, {status: '-4', text: '已退款'}]
      }
    }
    this.setData({
      dateFilter: [start, end],
      dateSelectedShow: end.split('-').map(item => parseInt(item)).join('年') + '月',
      statusFilter: statusArr,
      offline: offline
    }, () => {
      this.fetchData(1)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.initObserver()
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
    this.clearObserver()
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
    const {dateSelected, dateFilter, statusSelected, statusFilter, loading} = this.data
    let rData = {
      id: this.options.id,
      product_id: this.options.product_id,
      date: dateSelected || dateFilter[1],
      status: statusFilter[statusSelected].status,
      pn: pn
    }
    if (loading) {
      return false
    }
    this.setData({
      loading: true
    })
    util.request('/admin/product/detail', rData).then(res => {
      const {genderText} = this.data
      res.data.js_price = util.formatMoney(res.data.js_price).showMoney
      res.data.list.forEach((item) => {
        item.js_price = util.formatMoney(item.js_price).showMoney
        item.real_income = util.formatMoney(item.real_income).showMoney
        item.unit_price = util.formatMoney(item.unit_price).showMoney
        // item.content = item.ticket.map((ticket) => {
        //   return ticket.name + 'x' + ticket.quantity
        // }).join('，') + '，共计￥' + item.order.js_price
        item.tableContent = []
        if ((item.status == 6 || item.status == 7 || item.status == 1) && item.hx_status == 0) {
          item.tableContent.push({title: '预计收入', content: '¥' + item.js_price})
        } else {
          item.tableContent.push({title: '实际收入', content: '¥' + item.real_income})
        }
        if (res.data.type == 1 || res.data.type == 2) { // 非物流商品
          item.tableContent.push({title: '结算单价', content: '¥' + item.unit_price})
        } else if (res.data.type == 3) { // 物流商品

        }
        item.tableContent.push({title: '已购数量', content: item.ticket.map((ticket) => {
          return ticket.name + 'x' + ticket.quantity
        }).join('，')})
        item.tableContent.push({title: '下单时间', content: item.created_at})
        if (item.traveler_infos && item.traveler_infos.length) {
          item.traveler_infos.forEach((traveler, idx) => {
            item.tableContent.push({title: '出行人' + (idx + 1), content: traveler.name + (genderText[traveler.sex] ? ('，' + genderText[traveler.sex]) : '') + (traveler.id_number ? ('，' + traveler.id_number) : '')})
          })
        }
        if (item.form) {
          let formLen = Object.keys(item.form).length
          if (formLen) {
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
        }, () => { // 每次更新数据，获取悬浮筛选框的高度
          wx.createSelectorQuery().select('#fixed-header').boundingClientRect(rect => {
            this.fixedHeight = rect.height
          }).exec()
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
      url: '/pages/goodsdetail/goodsdetail?id=' + this.options.product_id
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
    const {shippingMap, shippingIndex, shippingNumber} = this.data
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
    if (this.confirmShipping) {
      return false
    }
    const s_id = this.shop_id
    const o_id = this.order_id
    const ship_num = shippingNumber
    const ship_company = shippingMap[shippingIndex]
    let rData = {
      id: s_id,
      order_id: o_id,
      express_number: ship_num,
      express_company: ship_company,
    }
    if (this.confirmTimer) {
      clearTimeout(this.confirmTimer)
    }
    this.confirmShipping = true
    util.request('/admin/product/delivery', rData).then(res => {
      if (res && (res.error === 0 || res.error === '0')) {
        wx.showToast({
          title: res.msg || '确认发货成功啦~',
          icon: 'none'
        })
        this.updateItemStatus(o_id, '7', ship_company, ship_num)
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
      if (this.confirmTimer) {
        clearTimeout(this.confirmTimer)
      }
      this.confirmTimer = setTimeout(() => {
        this.confirmShipping = false
      }, 300)
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
  },
  statusChange: function (e) {
    const {value} = e.detail
    const {statusSelected} = this.data
    this.setData({statusSelected: value}, () => {
      if (statusSelected !== value) {
        this.fetchData(1)
      }
    })
  },
  dateChange: function (e) {
    const {value} = e.detail
    const {dateSelected} = this.data
    this.setData({dateSelected: value, dateSelectedShow: value.split('-').map(item => parseInt(item)).join('年') + '月'}, () => {
      if (dateSelected !== value) {
        this.fetchData(1)
      }
    })
  },
  onPageScroll: function (e) {
    if (!this.fixedHeight || e.scrollTop < 0) {
      return
    }
    if (this.reachTop) { // 滚动距离未超过悬浮筛选框的高度，显示悬浮
      if (!this.data.showFixedFilter) {
        this.setData({showFixedFilter: true})
      }
      return
    }
    if (this.lastScrollTop) {
      const dist = e.scrollTop - this.lastScrollTop
      if (dist < -30 && !this.data.showFixedFilter) { // 下拉，且单次距离大于5
        this.setData({showFixedFilter: true})
      } else if (dist > 0 && this.data.showFixedFilter) {
        this.setData({showFixedFilter: false})
      }
    }
    this.lastScrollTop = e.scrollTop
  },
  initObserver() {
    this.observer = this.createIntersectionObserver()
    this.observer.relativeToViewport().observe(".intersection-dot", (res) => {
      if (res.intersectionRatio > 0) {
        this.reachTop = true
        this.setData({
          showFixedFilter: true
        })
      } else {
        this.reachTop = false
        this.setData({
          showFixedFilter: false
        })
      }
    })
  },
  clearObserver() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
})