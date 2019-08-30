// pages/orderlist/orderlist.js
const util = require('../../utils/util.js')
const storageHelper = require('../../utils/storageHelper.js')
Page({
  name: 'orderlist',
  /**
   * 页面的初始数据
   */
  data: {
    tabTitleRects: [],
    scrollLeft: 0,
    navTitle: '全部订单',
    refreshing: false,
    refreshed: true,
    index: 0,
    states: ['', '0', '4', '1', '6', '7', '2', '-4'], // -4普通退款|-3为手动下架|-2拼团失败|-1为失效订单|0为待付款|1为待参与|2为待评价|3已评价|4待成团|5已过期|6待发货|7已发货
    tabCurrentColor: '#000000',
    tabs: [{
      title: '全部',
      list: [],
      page: {
        pn: 1
      },
      loaded: false,
      loading: false
    }, {
      title: '待付款',
      list: [],
      page: {
        pn: 1
      },
      loaded: false,
      loading: false
    }, {
      title: '拼团中',
      list: [],
      page: {
        pn: 1
      },
      loaded: false,
      loading: false
    }, {
      title: '待使用',
      list: [],
      page: {
        pn: 1
      },
      loaded: false,
      loading: false
    },{
      title: '待发货',
      list: [],
      page: {
        pn: 1
      },
      loaded: false,
      loading: false
    },{
      title: '待收货',
      list: [],
      page: {
        pn: 1
      },
      loaded: false,
      loading: false
    }, {
      title: '待评价',
      list: [],
      page: {
        pn: 1
      },
      loaded: false,
      loading: false
    },{
      title: '退款',
      list: [],
      page: {
        pn: 1
      },
      loaded: false,
      loading: false
    },]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.options = options
    let index = parseInt(this.options ? this.options.type : 0)
    index = isNaN(index) ? 0 : index
    this.setData({
      index: index
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('options', this.options)
    const {rpx} = this.data._nav_data_
    wx.createSelectorQuery().selectAll('.title-box').fields({
      dataset: true,
      rect: true,
      size: true,
    }, rects => {
      let tabTitleRects = []
      let tabTitleConWidth = 0
      rects.forEach((rect, idx) => {
        tabTitleRects.push({left: rect.left, width: rect.width})
        tabTitleConWidth += rect.width
      })
      tabTitleConWidth += rpx * 34
      this.setData({tabTitleRects, tabTitleConWidth}, () => {
        const app = getApp()
        if (app.globalData && app.globalData.themeColor) { // 设置tab选中项颜色
          this.setData({
            tabCurrentColor: app.globalData.themeColor
          })
        }
        let index = parseInt(this.options ? this.options.type : 0)
        index = isNaN(index) ? 0 : index
        storageHelper.setStorage('orderListRefresh', '')
        this.currentChange({
          detail: {
            current: index,
            source: 'touch'
          }
        })
      })
    }).exec()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (storageHelper.getStorage('orderListRefresh') == '1') {
      this.refresh()
      storageHelper.setStorage('orderListRefresh', '')
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
    wx.stopPullDownRefresh()
    let i = this.data.index
    // this.setData({
    //   [`tabs[${i}].page`]: {
    //     pn: 1
    //   },
    //   [`tabs[${i}].list`]: [],
    //   [`tabs[${i}].loaded`]: false,
    //   [`tabs[${i}].loading`]: false,
    // }, () => {
    //   this.loadList(i, 1)
    // })
    this.loadList(i, 1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  
  tabTap: function(e) {
    let {
      idx
    } = e.currentTarget.dataset
    this.currentChange({
      detail: {
        current: idx,
        source: 'touch'
      }
    })
  },
  currentChange: function(e) {
    const {tabTitleRects, tabTitleConWidth} = this.data
    const {windowWidth} = this.data._nav_data_
    const {
      current,
      source
    } = e.detail
    if (source === 'touch') {
      let idx = current
      let indicatorPos = 0
      let scrollLeft = tabTitleRects[idx].left - (windowWidth - tabTitleRects[idx].width) / 2
      if (scrollLeft <= 0) {
        indicatorPos = tabTitleRects[idx].left + (tabTitleRects[idx].width / 2)
      } else if ((scrollLeft + tabTitleRects[idx].width + (windowWidth - tabTitleRects[idx].width) - tabTitleConWidth > 0)) {
        indicatorPos = windowWidth / 2 + scrollLeft + tabTitleRects[idx].width + (windowWidth - tabTitleRects[idx].width) - tabTitleConWidth
      } else {
        indicatorPos = windowWidth / 2
      }
      this.setData({
        scrollLeft: scrollLeft,
        indicatorPos: indicatorPos,
        index: idx
      })
      // 触发tabchange事件
      let {
        list,
        page,
        loading
      } = this.data.tabs[idx]
      let pn = (page && page.pn) ? page.pn : 1
      if (loading) { // 正在加载
        if (pn.toString() === '1') {
          wx.stopPullDownRefresh()
        }
        return false
      }
      if (list && list[0] && pn.toString() === '1') { // 已有数据 且 是请求第一页数据
        return false
      }
      if (page && page.is_end) { // 最后一页
        return false
      }
      // 触发加载fatchlist事件
      this.fetchlist({detail: {
        idx,
        pn
      }})
    }
  },
  fetchlist(e) {
    this.loadList(e.detail.idx, e.detail.pn)
  },
  scrollToEnd: function(e) {
    let {
      idx
    } = e.currentTarget.dataset
    let {
      list,
      page,
      loading
    } = this.data.tabs[idx]
    let pn = ((page && page.pn) ? page.pn : 1) + 1
    if (loading) { // 正在加载
      if (pn.toString() === '1') {
        wx.stopPullDownRefresh()
      }
      return false
    }
    if (list && list[0] && pn.toString() === '1') { // 已有数据 且 是请求第一页数据
      return false
    }
    if (page && page.is_end) { // 最后一页
      return false
    }
    // 触发加载fatchlist事件
    this.fetchlist({detail: {
      idx,
      pn
    }})
  },
  loadList(index, pn = 1) {
    let data = {
      status: this.data.states[index] != '' ? this.data.states[index] : undefined,
      pn: pn
    }

    this.setData({
      [`tabs[${index}].loading`]: true,
    })
    util.request('/order/list', data).then(res => {
      // let list = []
      res.data.list.forEach((item) => {
        item.price = util.formatMoney(item.price).showMoney
        item.refund_amount = util.formatMoney(item.refund_amount).showMoney
        let product = item.product || item.huodong || item.vgoods || item.goods
        if (product && product.valid_btime) {
          product.valid_btime = util.formatDateTimeDefault('d', product.valid_btime)
        }
        if (product && product.valid_etime) {
          product.valid_etime = util.formatDateTimeDefault('d', product.valid_etime)
        }
        item.product = product
        item.ticket_text = item.ticket.map((item) => {
          return item.name + '×' + item.quantity
        }).join(',')
      })
      let _obj = {}
      if (pn == 1) {
        _obj[`tabs[${index}].list`] = res.data.list
      } else {
        let preLen = this.data.tabs[index].list.length
        let currentNum = res.data.list.length
        for (let i = 0; i < currentNum; i++) {
          _obj[`tabs[${index}].list[${preLen + i}]`] = res.data.list[i]
        }
      }
      _obj[`tabs[${index}].page`] = res.data.page,
      _obj[`tabs[${index}].loaded`] = true,
      _obj[`tabs[${index}].loading`] = false
      this.setData(_obj)
    }).finally(res => {
      if (pn ==1) {
        this.setData({
          refreshing: false,
          refreshed: true
        })
      }
    })
  },

  refresh() {
    let _obj = {}
    let {tabs} = this.data
    tabs.forEach(item => {
      item.page = {pn: 1}
      item.list = []
      item.loaded = false
      item.loading = false
    })
    _obj.tabs = tabs
    this.setData(_obj, () => {
      this.currentChange({
        detail: {
          current: 0,
          source: 'touch'
        }
      })
    })
    // this.setData({
    //   [`index`]: 0,
    //   [`tabs[0].page`]: {
    //     pn: 1
    //   },
    //   [`tabs[0].list`]: [],
    //   [`tabs[0].loaded`]: false,
    //   [`tabs[0].loading`]: false,

    //   [`tabs[1].page`]: {
    //     pn: 1
    //   },
    //   [`tabs[1].list`]: [],
    //   [`tabs[1].loaded`]: false,
    //   [`tabs[1].loading`]: false,

    //   [`tabs[2].page`]: {
    //     pn: 1
    //   },
    //   [`tabs[2].list`]: [],
    //   [`tabs[2].loaded`]: false,
    //   [`tabs[2].loading`]: false,

    //   [`tabs[3].page`]: {
    //     pn: 1
    //   },
    //   [`tabs[3].list`]: [],
    //   [`tabs[3].loaded`]: false,
    //   [`tabs[3].loading`]: false,

    //   [`tabs[4].page`]: {
    //     pn: 1
    //   },
    //   [`tabs[4].list`]: [],
    //   [`tabs[4].loaded`]: false,
    //   [`tabs[4].loading`]: false
    // }, () => {
    //   this.loadList(0, 1)
    // })
  },

  shareTap: function (e) {
    const {product_id, pt_id} = e.detail
    console.log('shareTap', product_id, pt_id)
    if (product_id && pt_id) {
      const poster = this.selectComponent('#c-draw-poster')
      if (poster && poster.startDraw) {
        poster.startDraw(product_id, pt_id)
      }
    }
  }
})