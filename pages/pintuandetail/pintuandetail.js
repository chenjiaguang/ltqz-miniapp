// pages/pintuandetail/pintuandetail.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '', // 0:拼团失败，1:拼团中，2:拼团成功
    remainTime: 0,
    remainTimeText: '',
    users: [],
    needUsers: 0,
    timeout: false
  },

  timer: null,
  remainSeconds: 0,

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
    if (this.timer) {
      clearInterval(this.timer)
    }
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
        res.data.huodong.valid_btime = util.formatDateTimeDefault('d', res.data.huodong.valid_btime)
        res.data.huodong.valid_etime = util.formatDateTimeDefault('d', res.data.huodong.valid_etime)
        res.data.created_at = util.formatDateTimeDefault('m', res.data.created_at)
        res.data.users = this.getUsers(res.data)
        // res.data.status = 0
        this.setData(res.data)
        this.countDown(res.data)
      }
    }).catch(err => {
      
    })
  },
  getUsers: function (tuan) {
    const len = tuan.spell_num
    let users = []
    users = users.concat(tuan.tuanRecord)
    const length = len - users.length
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        users.push({ id: new Date().getTime() + i, avatar: '' })
      }
    }
    return users
  },
  countDown: function (tuan) {
    if (!tuan || !tuan.expired_timestamp) {
      return false
    }
    this.remainSeconds = tuan.expired_timestamp
    const func = () => {
      const needUsers = tuan.spell_num - tuan.tuanRecord.length
      this.remainSeconds -= 1
      const remainTime = this.remainSeconds
      const remainClock = this.secondToClock(remainTime)
      const remainTimeText = '剩余' + remainClock + '结束'
      const timeout = remainTime <= 0
      this.setData({
        needUsers,
        remainTimeText,
        remainTime,
        timeout
      })
      if (timeout && this.timer) {
        clearInterval(this.timer)
      }
    }
    func()
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.timer = setInterval(func, 1000)
  },
  secondToClock: function (seconds) {
    if (seconds <= 0) {
      return '00:00:00'
    }
    let hour = seconds / 3600
    let min = (seconds % 3600) / 60
    let second = seconds % 60
    hour = (hour >= 10) ? parseInt(hour) : ('0' + parseInt(hour))
    min = (min >= 10) ? parseInt(min) : ('0' + parseInt(min))
    second = (second >= 10) ? second : ('0' + second)
    return [hour, min, second].join(':')
  },
  shareTap: function () {
    const { product_id, id} = this.data
    if (product_id && id) {
      const poster = this.selectComponent('#c-draw-poster')
      if (poster && poster.startDraw) {
        poster.startDraw(product_id, id)
      }
    }
  }
})