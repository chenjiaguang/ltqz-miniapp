// pages/usuallycontacts/usuallycontacts.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '常用信息',
    loaded: false,
    contacts: [],
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
  onShow: function () {
    this.fetch()
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
  fetch: function () {
    this.setData({
      loaded: false
    })
    util.request('/traveler/list').then(res => {
      this.setData({
        loaded: true,
        contacts: res.data
      })
    }).catch(err => {
      console.log('err', err)
    })
  },
  addItem: function() {
    this.navigateTo({
      url: '/pages/editcontact/editcontact'
    })
  },
  editItem: function(e) {
    let item = e.currentTarget.dataset.item
    this.navigateTo({
      url: `/pages/editcontact/editcontact?id=${item.id}&name=${item.name}&id_number=${item.id_number}&sex=${item.sex}`
    })
  }
})