// pages/businessassistant/businessassistant.js
const util = require('../../utils/util.js')
const app = getApp()
let themeColor = '#FFFFFF'
if (app) {
  themeColor = app.globalData.themeColor
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '商家助手',
    navBg: themeColor || '#FFFFFF',
    id: '',
    data: null,
    hexiao_entrance: {
      title: '商家核销码：',
      path: '/pages/hexiaosetting/hexiaosetting'
    },
    other_entrances: [{
        title: '活动管理',
        path: '/pages/activitymanager/activitymanager'
      },
      {
        title: '评价管理',
        path: '/pages/commentmanager/commentmanager'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let hexiao_entrance = this.data.hexiao_entrance
    hexiao_entrance.path = hexiao_entrance.path + '?id=' + options.id

    let other_entrances = this.data.other_entrances
    other_entrances[0].path = other_entrances[0].path + '?id=' + options.id
    other_entrances[1].path = other_entrances[1].path + '?role=business&sid=' + options.id

    this.setData({
      id: options.id,
      hexiao_entrance: hexiao_entrance,
      other_entrances: other_entrances
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
    util.request('/admin/shop/detail', {
      id: this.data.id
    }).then(res => {
      res.data.total_income = util.formatMoney(res.data.total_income).showMoney
      let other_entrances = this.data.other_entrances
      other_entrances[0].title = other_entrances[0].title.split('（')[0] + '（' + res.data.product_num + '）'
      other_entrances[1].title = other_entrances[1].title.split('（')[0] + '（' + res.data.rate_num + '）'
      this.setData({
        data: res.data,
        other_entrances: other_entrances
      })
    }).catch(err => {
      console.log('err', err)
    })
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
  onShareAppMessage: function() {

  },

  scanHexiaoCode: function() {
    if (this.data.data.access.indexOf('1') == -1) {
      wx.showToast({
        title: '您没有扫码核销权限哦~',
        icon: 'none'
      })
    } else {
      wx.scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode'],
        success: e => {
          util.request('/admin/hx/consume', {
            id: this.data.id,
            qr_code: e.result
          }).then(res => {
            wx.showToast({
              title: '核销成功',
              icon: 'none'
            })
          }).catch(err => {
            console.log('err', err)
          })
        },
        fail: e => {
          console.log('fail', e)
        }
      })
    }
  },

  entranceTapHx: function(e) {
    if (this.data.data.access.indexOf('1') == -1) {
      wx.showToast({
        title: '您没有扫码核销权限哦~',
        icon: 'none'
      })
    } else {
      this.entranceTap(e)
    }
  },

  entranceTap: function(e) {
    const {
      path,
      phone
    } = e.detail
    if (path) {
      wx.navigateTo({
        url: path
      })
    }
  }
})