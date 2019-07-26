// pages/commentmanager/commentmanager.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '评价管理',
    index: 0,
    tabs: [{
      title: '全部',
      list: [],
      page: {
        pn: 1
      },
      loaded: false,
      loading: false
    }, {
      title: '待回复',
      list: [],
      page: {
        pn: 1
      },
      loaded: false,
      loading: false
    }],
    showGoods: true,
    showTicket: false,
    top_fixed: false,

    current_reply_name: '', //回复对象的名称
    reply_focus: false, //是否在回复状态
    reply_value: '' //回复的内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { // options.sid(shop_id，传入商家id则请求商家的评论)、options.pid(product_id，传入商品id则请求商品的评论)、options.type(type，商品类型，活动为1)
    this.options = options // 把options保存下来
    this.tabTap({currentTarget: {dataset: {idx: 0}}})
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
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
    const {
      current,
      source
    } = e.detail
    if (source === 'touch') {
      let idx = current
      this.setData({
        index: idx
      })
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
    this.fetchComment(e.detail.idx, this.options, e.detail.pn)
  },
  fetchComment: function (index, options, pn) {
    // options.sid(shop_id，传入商家id则请求商家的评论)、options.pid(product_id，传入商品id则请求商品的评论)、options.type(type，商品类型，活动为1)
    const {
      list,
      page
    } = this.data
    let rData = {
      product_id: options.pid,
      shop_id: options.sid,
      type: options.pid ? '1' : '',
      pn: pn,
      reply: index == 1 ? null : ''
    }
    this.setData({
      [`tabs[${index}].loading`]: true,
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

        if (pn == 1) { } else {
          list = this.data.tabs[index].list.concat(list)
        }

        this.setData({
          [`tabs[${index}].list`]: list,
          [`tabs[${index}].page`]: res.data.page,
          [`tabs[${index}].loaded`]: true,
          [`tabs[${index}].loading`]: false,
        })


      }
    }).catch(err => {
      console.log('catch')
    })
  },

  replyTap: function (e) {
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

  replyInput: function (e) {
    const {
      value,
      cursor
    } = e.detail
    this.setData({
      reply_value: value,
      reply_cursor: cursor
    })
  },
  replySubmit: function () {
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