// pages/commentlist/commentlist.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '全部评价',
    role: 'user',
    showGoods: false,
    showTicket: false,
    loaded: false,
    list: [],
    page: {},
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { // options.sid(shop_id，传入商家id则请求商家的评论)、options.pid(product_id，传入商品id则请求商品的评论)、options.type(type，商品类型，活动为1)
    if (options.sid) { // 展示的是商家评价，则显示活动
      wx.setNavigationBarTitle({
        title: '全部评价'
      })
      this.setData({
        showGoods: true,
        navTitle: '全部评价'
      })
    } else if (options.pid) { // 展示的是活动评价，则显示已购买的票
      wx.setNavigationBarTitle({
        title: '全部评价',
      })
      this.setData({
        showTicket: true,
        navTitle: '全部评价'
      })
    }
    this.options = options // 把options保存下来
    this.fetchComment(this.options, 1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    const {page, loading} = this.data
    if (loading || page.is_end) {
      return false
    }
    this.fetchComment(this.options, parseInt(page.pn) + 1)
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // },
  fetchComment: function(options, pn) {
    // options.sid(shop_id，传入商家id则请求商家的评论)、options.pid(product_id，传入商品id则请求商品的评论)、options.type(type，商品类型，活动为1)
    let rData = {
      product_id: options.pid,
      shop_id: options.sid,
      pn: pn
    }
    this.setData({
      loading: true
    })
    util.request('/rate/list', rData).then(res => {
      if (res.error == 0 && res.data) {
        let {
          list,
          page
        } = res.data
        list.forEach(item => {
          item.created_at = util.formatDateTimeDefault('d', item.created_at)
        })
        if (pn == 1) {} else {
          list = this.data.list.concat(list)
        }
        this.setData({
          list: list,
          page: res.data.page,
          loaded: true,
          loading: false
        })
      }
    }).catch(err => {
      console.log('catch')
    }).finally(res => {
      this.setData({
        loading: false
      })
    })
  },

  replyTap: function(e) {
    const {
      id,
      username
    } = e.detail
    this.setData({
      current_reply_id: id,
      current_reply_name: username,
      reply_focus: true
    })
  },

  replyInput: function(e) {
    const {
      value,
      cursor
    } = e.detail
    this.setData({
      reply_value: value,
      reply_cursor: cursor
    })
  },
  replySubmit: function() {
    util.request('/admin/rate/reply', {
      id: this.options.sid,
      rate_id: this.data.current_reply_id,
      reply: this.data.reply_value,
    }).then(res => {
      wx.showToast({
        title: '回复成功',
        icon: 'none'
      })
      let i = this.data.tabs[this.data.index].list.findIndex((item) => {
        return item.id == this.data.current_reply_id
      })
      this.setData({
        reply_focus: false,
        reply_value: '',
        [`tabs[${this.data.index}].list[${i}].reply`]: this.data.reply_value
      })
    }).catch(err => {
      console.log('err', err)
    })

  }
})