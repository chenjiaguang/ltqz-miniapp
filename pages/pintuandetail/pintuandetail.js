// pages/pintuandetail/pintuandetail.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.fetchPintuan(options.id)
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

  },
  fetchPintuan: function (id) {
    const rData = {
      tuan_id: id
    }
    util.request('/order/tuan_detail', rData).then(res => {
      if (res.data) {
        console.log('/order/tuan_detail', res)
        this.setData({
          huodong_id: res.data.huodong.id
        })
      }
    }).catch(err => {
      
    })
  },
  shareTap: function () {
    const {huodong_id, id} = this.data
    if (huodong_id && id) {
      const poster = this.selectComponent('#c-draw-poster')
      if (poster && poster.startDraw) {
        poster.startDraw(huodong_id, id)
      }
    }
  }
})