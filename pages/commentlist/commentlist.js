// pages/commentlist/commentlist.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: 'user',
    showGoods: false,
    showTicket: false,
    top_fixed: false,
    avg_score: 0,
    commentLoaded: false,
    commentLoading: false,
    page: {},
    list: [],

    current_reply_name: '', //回复对象的名称
    reply_focus: false, //是否在回复状态
    reply_value: '' //回复的内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { // options.sid(shop_id，传入商家id则请求商家的评论)、options.pid(product_id，传入商品id则请求商品的评论)、options.type(type，商品类型，活动为1)
    if (options.sid) { // 展示的是商家评价，则显示活动
      this.setData({
        showGoods: true
      })
    } else if (options.pid) { // 展示的是活动评价，则显示已购买的票
      this.setData({
        showTicket: true
      })
    }
    if (options.role) {
      this.setData({
        role: options.role
      })
    }
    this.options = options // 把options保存下来
    this.fetchComment(options, 1)
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
  onPullDownRefresh: function() {
    this.fetchComment(this.options, 1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    const {
      page
    } = this.data
    if (page && !page.is_end) {
      this.fetchComment(this.options, parseInt(page.pn) + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onPageScroll: function(e) {
    // console.log('onPageScroll', e.scrollTop)
    const {
      top_fixed
    } = this.data
    if (e.scrollTop <= 0 && top_fixed) {
      console.log('ddd')
      this.setData({
        top_fixed: false
      })
    } else if (e.scrollTop > 0 && !top_fixed) {
      console.log('eee')
      this.setData({
        top_fixed: true
      })
    }
  },

  fetchComment: function(options, pn) {
    // options.sid(shop_id，传入商家id则请求商家的评论)、options.pid(product_id，传入商品id则请求商品的评论)、options.type(type，商品类型，活动为1)
    const {
      commentLoaded,
      commentLoading,
      list,
      page
    } = this.data
    if (commentLoading || (page && page.is_end && pn !== 1)) { // 正在加载 或 最后一页并且不是刷新
      return false
    }
    this.setData({
      commentLoading: true
    })
    let rData = {
      product_id: options.pid,
      shop_id: options.sid,
      type: options.pid ? '1' : '',
      pn: pn
    }
    util.request('/rate/list', rData).then(res => {
      if (res.error == 0 && res.data) {
        let {
          list,
          page,
          avg_score
        } = res.data
        let _obj = {}
        _obj.commentLoaded = true
        if (pn === 1) { // 刷新
          _obj.avg_score = avg_score
          _obj.page = page
          _obj.list = list
        } else {
          let oldLen = this.data.list.length
          let newLen = list.length
          for (let i = 0; i < newLen; i++) {
            _obj['list[' + (oldLen + i) + ']'] = list[i]
          }
          _obj.avg_score = avg_score
          _obj.page = page
        }
        this.setData(_obj)
      }
    }).catch(err => {
      console.log('catch')
    }).finally(res => {
      this.setData({
        commentLoading: false
      })
      wx.stopPullDownRefresh()
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
      let i = this.data.list.findIndex((item) => {
        return item.id == this.data.current_reply_id
      })
      this.setData({
        reply_focus: false,
        [`list[${i}].reply`]: this.data.reply_value
      })
    }).catch(err => {})

  }
})