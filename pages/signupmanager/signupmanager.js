// pages/signupmanager/signupmanager.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '订单详情',
    genderText: {
      0: '保密',
      1: '男',
      2: '女'
    },
    statusText: { // -4为已退款|-3为手动下架|-2拼团失败|-1为失效订单|0为待付款|1为待参与|2为待评价|3已评价|4待成团|5已过期
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
    loading: false
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
  onShareAppMessage: function() {

  },
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
        item.order.js_price = util.formatMoney(item.order.js_price).showMoney
        // item.content = item.ticket.map((ticket) => {
        //   return ticket.name + 'x' + ticket.quantity
        // }).join('，') + '，共计￥' + item.order.js_price
        item.tableContent = []
        item.tableContent.push({title: '预计结算金额', content: '¥' + item.order.js_price})
        item.tableContent.push({title: '已购票券', content: item.ticket.map((ticket) => {
          return ticket.name + 'x' + ticket.quantity
        }).join('，')})
        if (item.traveler_infos && item.traveler_infos.length) {
          item.traveler_infos.forEach((traveler, idx) => {
            item.tableContent.push({title: '出行人' + (idx + 1), content: traveler.name + (genderText[traveler.sex] ? ('，' + genderText[traveler.sex]) : '') + (traveler.id_number ? ('，' + traveler.id_number) : '')})
          })
        }
        if (item.form) {
          for (let key in item.form) {
            item.tableContent.push({title: key, content: item.form[key], isPhone: item.form[key].toString() === item.phone.toString(), c_color: item.form[key].toString() === item.phone.toString() ? '#FF296B' : ''})
          }
        }
      })
      if (pn == 1) {
        this.setData({
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
    wx.navigateTo({
      url: '/pages/goodsdetail/goodsdetail?id=' + this.data.product_id
    })
  },
  tapItem() {
    wx.vibrateShort()
  }
})