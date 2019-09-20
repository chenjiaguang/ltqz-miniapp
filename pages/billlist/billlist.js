// pages/billlist/billlist.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '到账明细',
    list:[],
    page: null,
    loaded: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    this.fetchBill(1)
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
    const {page, loading} = this.data
    if (!page || (page && !page.pn) || (page && page.is_end) || loading) {
      return false
    }
    this.fetchBill(parseInt(page.pn) + 1)
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },

  fetchBill: function (pn = 1) {
    console.log('fetchBill')
    const {loading} = this.data
    if (loading) {
      return false
    }
    this.setData({
      loading: true
    })
    util.request('/admin/order/remit_list', {
      id: this.options.id,
      pn: pn
    }).then(res => {
      if (res.error == 0 && res.data) {
        console.log('ffff', res)
        if ((res.error === 0 || res.error === '0') && res.data) {
          const {list: _list, page} = res.data
          const list = _list.map(item => {
            let datalist = [
              {title: '结算周期',content: `${item.remit_btime} 至 ${item.remit_etime}`},
              {title: '结算金额',content: `¥${util.formatMoney(item.amount).showMoney}`}
            ]
            if (item.ticket && item.ticket !== '0') {
              datalist.push({title: '核销券票数',content: `${item.ticket}张`})
            }
            if (item.goods && item.goods !== '0') {
              datalist.push({title: '物流商品订单笔数',content: `${item.goods}笔`})
            }
            if (item.remit_way == 0) { //微信零钱结算
              datalist.push({title: '结算账户',content: `${item.remit_wxid_name}`})
            } else if (item.remit_way == 1) { //线下结算
              datalist.push({title: '收款人',content: `${item.remit_payee}`})
              datalist.push({title: '收款银行卡号',content: `${item.remit_bank_card}`})
            }
            datalist.push({title: '打款时间',content: `${item.created_at}`})
            return {
              id: item.id,
              unread: !item.has_read,
              datalist: datalist
            }
          })
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
      }
    }).catch(err => {
      console.log('err', err)
    }).finally(res => {
      this.setData({
        loading: false
      })
    })
  }
})