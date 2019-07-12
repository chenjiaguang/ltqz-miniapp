// pages/merchantdetail/merchantdetail.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '商家详情',
    id: '',
    name: '',
    nature: '', // nature: 1自营|2第三方
    introduce: '',
    rate: 0,
    rate_num: 0,
    type_pic_url: '',
    bg_pic_url: '',
    logo_url: '',
    activitys: [],
    activityLoaded: false,
    activityLoading: false,
    activityPage: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchMerchant(options.id)
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
      activityPage
    } = this.data
    if (activityPage && !activityPage.is_end) {
      this.fetchGoods(this.options.id, parseInt(activityPage.pn) + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  activityTap: function (e) {
    const { id } = e.detail
    if (id) {
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?id=' + id
      })
    }
  },

  viewComment: function () {
    if (this.data.id) {
      wx.navigateTo({
        url: '/pages/commentlist/commentlist?sid=' + this.data.id
      })
    }
  },

  fetchMerchant: function (id) {
    util.request('/shop/detail', {id}).then(res => {
      if (res.error == 0 && res.data) { // 成功获取数据
        this.setData(res.data)
      }
    }).catch(err => {

    })
  },

  fetchGoods: function (id, pn) {
    const {
      activityLoading,
      activitys,
      activityPage
    } = this.data
    if (activityLoading || (activityPage && activityPage.is_end && pn !== 1)) { // 正在加载 或 最后一页并且不是刷新
      return false
    }
    this.setData({
      activityLoading: true
    })
    let rData = {
      shop_id: id,
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
        _obj.activityLoaded = true
        _obj.activityPage = page
        if (pn === 1) { // 刷新
          _obj.activitys = list
        } else {
          let oldLen = this.data.activitys.length
          let newLen = list.length
          for (let i = 0; i < newLen; i++) {
            _obj['activitys[' + (oldLen + i) + ']'] = list[i]
          }
        }
        this.setData(_obj)
      }
    }).catch(err => {
      console.log('catch')
    }).finally(res => {
      this.setData({
        activityLoading: false
      })
      wx.stopPullDownRefresh()
    })
  }
})