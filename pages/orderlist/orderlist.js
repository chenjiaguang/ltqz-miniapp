// pages/orderlist/orderlist.js
const util = require('../../utils/util.js')
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
  fetchlist(e) {
    this.loadList(e.detail.idx, e.detail.pn)
  },

  loadList(index, pn = 1) {
    let data = {
      status: this.data.states[index] != '' ? this.data.states[index] : undefined,
      pn: pn
    }

    util.request('/order/list', data).then(res => {
      let list = []
      res.data.list.forEach((item) => {
        item.price = util.formatMoney(item.price).showMoney
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
  }
})