// pages/userprofit/userprofit.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    navTitle: '收益详情',
    total: 0,
    show_can_remit: 0,
    can_remit: 0,
    show_has_remit: 0,
    show_freeze_remit: 0,
    show_unfreeze_remit: 0,
    show_no_read_remit: 0,
    entrances: [{
        title: '收益明细',
        path: '/pages/userprofitdetail/userprofitdetail',
        subTitle: '',
        noRead: 0
      },
      {
        title: '提现记录',
        path: '/pages/withdrawrecord/withdrawrecord',
        subTitle: ''
      },
      {
        title: '常见问题',
        path: '/pages/statement/statement?type=4'
      }
    ],
    withdraw: false // 是否可提现
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.fetchProfit()
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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // },

  entranceTap: function(e) {
    const {
      path
    } = e.detail
    if (path) {
      this.navigateTo({
        url: path
      })
    }
  },

  fetchProfit: function () {
    const {loading} = this.data
    if (loading) {
      return false
    }
    this.setData({
      loading: true
    })
    util.request('/fenxiao/earn_detail').then(res => {
      let total = util.formatMoney(res.data.total)
      let min_tx_amount = util.formatMoney(res.data.min_tx_amount)
      let can_remit = util.formatMoney(res.data.can_remit)
      let has_remit = util.formatMoney(res.data.has_remit)
      let freeze_remit = util.formatMoney(res.data.freeze_remit)
      let unfreeze_remit = util.formatMoney(res.data.unfreeze_remit)
      let no_read_remit = util.formatMoney(res.data.no_read_remit)
      let today_tx = util.formatMoney(res.data.today_tx)
      let _obj = {}
      _obj.show_total = total.showMoney
      _obj.total = total.money
      _obj.show_min_tx_amount = min_tx_amount.showMoney
      _obj.min_tx_amount = min_tx_amount.money
      if (min_tx_amount.showMoney && min_tx_amount.showMoney.indexOf('.00') !== -1) {
        _obj.tip_min_tx_amount = min_tx_amount.showMoney.replace('.00', '')
      }
      _obj.show_can_remit = can_remit.showMoney
      _obj.can_remit = can_remit.money
      _obj.show_has_remit = has_remit.showMoney
      _obj.has_remit = has_remit.money
      _obj.show_freeze_remit = freeze_remit.showMoney
      _obj.freeze_remit = freeze_remit.money
      _obj.show_unfreeze_remit = unfreeze_remit.showMoney
      _obj.unfreeze_remit = unfreeze_remit.money
      _obj.show_today_tx = today_tx.showMoney
      _obj.today_tx = today_tx.money
      _obj.show_no_read_remit = no_read_remit.showMoney
      _obj.no_read_remit = no_read_remit.money
      _obj['entrances[0].subTitle'] = no_read_remit.money ? ('新增收益' + (no_read_remit.showMoney || 0) + '元') : ''
      _obj['entrances[0].noRead'] = no_read_remit.money || 0
      _obj.withdraw = can_remit.money >= min_tx_amount.money
      this.setData(_obj)
    }).catch(err => {
      console.log('err', err)
    }).finally(res => {
      this.setData({
        loading: false
      })
    })
  },

  requestCash: function() {
    const {withdraw, show_can_remit} = this.data
    let titleAmount = ''
    if (show_can_remit && show_can_remit.indexOf('.00') !== -1) {
      titleAmount = show_can_remit.replace('.00', '')
    } else {
      titleAmount = show_can_remit
    }
    if (withdraw) {
      const app = getApp()
      const cancelColor = '#999999'
      const confirmColor = app.globalData.themeModalConfirmColor || '#576B95' // #576B95是官方颜色
      wx.showModal({
        title: '当前可提现收益为' + titleAmount + '元',
        content: '可提现收益将全部提现至您的零钱，是否继续提现操作',
        showCancel: true,
        cancelText: '取消',
        cancelColor,
        confirmText: '继续',
        confirmColor,
        success: (res) => {
          if (res.confirm) {
            util.request('/fenxiao/tx').then(res => {
              wx.showToast({
                title: '申请提现成功啦，预计将在2小时内到账',
                icon: 'none'
              })
              this.fetchProfit()
            }).catch(err => {
              console.log('err', err)
            })
          }
        }
      })
    }
  },

  questionTap: function () {
    const app = getApp()
    if (app) {
      const confirmColor = app.globalData.themeModalConfirmColor || '#576B95' // #576B95是官方颜色
      wx.showModal({
        title: '待解冻收益',
        content: '若成交的推广商品为可退商品，则合伙人的所得收益将暂存于待解冻收益中，待好友进行商品核销后，方可转入可提现收益',
        showCancel: false,
        confirmText: '确定',
        confirmColor: confirmColor
      })
    }
  }
})