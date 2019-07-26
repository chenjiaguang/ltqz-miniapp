// pages/userfxgoods/userfxgoods.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '推广商品',
    sharing: false,
    list: [],
    page: null,
    loaded: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchGoods()
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
      this.fetchGoods(parseInt(page.pn) + 1)
    }
  },

  fetchGoods: function (pn) {
    const {
      loading,
      list,
      page
    } = this.data
    if (loading || (page && page.is_end && pn !== 1)) { // 正在加载 或 最后一页并且不是刷新
      return false
    }
    this.setData({
      loading: true
    })
    let rData = {
      pn: pn
    }
    util.request('/fenxiao/product', rData).then(res => {
      if (res.error == 0 && res.data) {
        console.log('/fenxiao/product', res)
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
        list = []
        let _obj = {}
        _obj.loaded = true
        _obj.page = page
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
    }).finally(res => {
      this.setData({
        loading: false
      })
      wx.stopPullDownRefresh()
    })
  },

  goodsTap: function (e) {
    console.log('goodsTap')
    const {id} = e.detail
    if (id) {
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?id=' + id
      })
    }
  },

  shareGoods: function (e) {
    const {id} = e.detail
    const poster = this.selectComponent('#c-draw-poster')
    if (poster && poster.startDraw && id) {
      poster.startDraw(id)
    }
  }
})