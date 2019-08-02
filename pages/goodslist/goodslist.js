// pages/goodslist/goodslist.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '',
    banners: [],
    list: [],
    loaded: false,
    loading: false,
    page: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      })
      this.setData({
        navTitle: options.title
      })
    }
    this.options = options
    this.fetchGoods(options.id, 1)
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
    const {
      page
    } = this.data
    if (page && !page.is_end) {
      this.fetchGoods(this.options.id, parseInt(page.pn) + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const { cover_url } = this.data
    return {
      title: '给你分享了范团精选的' + (this.options.title || '') + '，快来看看有没有适合你的吧~',
      path: '/pages/goodslist/goodslist?id=' + this.options.id + (this.options.title ? ('&title=' + this.options.title) : '')
    }
  },

  bannerTap: function (e) {
    const { item } = e.detail
    if (item && item.path) {
      wx.navigateTo({
        url: item.path
      })
    }
  },

  goodsTap: function (e) {
    const { id } = e.detail
    if (id) {
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?id=' + id
      })
    }
  },

  fetchGoods: function (id, pn) {
    const {
      loading,
      page
    } = this.data
    if (loading || (page && page.is_end && pn !== 1)) { // 正在加载 或 最后一页并且不是刷新
      return false
    }
    this.setData({
      loading: true
    })
    let rData = {
      home_class: id,
      pn: pn
    }
    util.request('/product/list', rData).then(res => {
      if (res.error == 0 && res.data) {
        let {
          list,
          page
        } = res.data
        list.forEach(item => {
          item.min_price = util.formatMoney(item.min_price).showMoney
          item.min_origin_price = util.formatMoney(item.min_origin_price).showMoney
          item.min_pt_price = util.formatMoney(item.min_pt_price).showMoney
          item.min_qg_price = util.formatMoney(item.min_qg_price).showMoney
        })
        let _obj = {}
        _obj.loaded = true
        _obj.page = page
        if (res.data.home_class_banner) {
          _obj['banners[0].image'] = res.data.home_class_banner
        }
        if (pn === 1) { // 刷新
          _obj.list = list
        } else {
          let oldLen = this.data.list.length
          let newLen = list.length
          for (let i = 0; i < newLen; i++) {
            _obj['list[' + (oldLen + i) + ']'] = list[i]
          }
        }
        this.setData(_obj)
      }
    }).catch(err => {
      console.log('catch')
    }).finally(res => {
      this.setData({
        loading: false
      })
      wx.stopPullDownRefresh()
    })
  }
})