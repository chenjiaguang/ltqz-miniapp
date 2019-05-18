// pages/orderlist/orderlist.js
const util = require('../../utils/util.js')
const storageHelper = require('../../utils/storageHelper.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    states: ['', '0', '1', '2'],
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
      title: '待使用',
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
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('orderlist_onload_options', options)
    let index = parseInt(options ? options.type : 0)
    index = isNaN(index) ? 0 : index
    storageHelper.setStorage('orderListRefresh', '')
    this.setData({
      index: index
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
    console.log('11111111111')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  tabchange(e) {
    this.setData({
      index: e.detail.current
    })
  },
  fetchlist(e) {
    this.loadList(e.detail.idx, e.detail.pn)
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
      let list = []
      res.data.list.forEach((item) => {
        item.price = util.formatMoney(item.price).showMoney
        item.huodong.valid_btime = util.formatDateTimeDefault('d', item.huodong.valid_btime)
        item.huodong.valid_etime = util.formatDateTimeDefault('d', item.huodong.valid_etime)
      })
      if (pn == 1) {
        list = res.data.list
      } else {
        list = this.data.tabs[index].list.concat(res.data.list)
      }
      this.setData({
        [`tabs[${index}].list`]: list,
        [`tabs[${index}].page`]: res.data.page,
        [`tabs[${index}].loaded`]: true,
        [`tabs[${index}].loading`]: false,
      })
    }).catch(err => {})
  },

  refresh() {
    this.setData({
      [`index`]: 0,
      [`tabs[0].page`]: {
        pn: 1
      },
      [`tabs[0].list`]: [],
      [`tabs[0].loaded`]: false,
      [`tabs[0].loading`]: false,

      [`tabs[1].page`]: {
        pn: 1
      },
      [`tabs[1].list`]: [],
      [`tabs[1].loaded`]: false,
      [`tabs[1].loading`]: false,

      [`tabs[2].page`]: {
        pn: 1
      },
      [`tabs[2].list`]: [],
      [`tabs[2].loaded`]: false,
      [`tabs[2].loading`]: false,

      [`tabs[3].page`]: {
        pn: 1
      },
      [`tabs[3].list`]: [],
      [`tabs[3].loaded`]: false,
      [`tabs[3].loading`]: false,
    }, () => {
      this.loadList(0, 1)
    })
  }
})