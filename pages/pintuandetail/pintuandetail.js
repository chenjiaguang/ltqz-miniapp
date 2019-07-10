// pages/pintuandetail/pintuandetail.js
import util from '../../utils/util.js'
import storageHelper from '../../utils/storageHelper.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '拼团详情',
    status: '', // 0:拼团失败，1:拼团中，2:拼团成功
    remainTime: 0,
    remainTimeText: '',
    users: [],
    needUsers: 0,
    timeout: false,
    sharing: false
  },

  timer: null,
  remainSeconds: 0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = ''
    let uid = ''
    if (options.scene) { // 扫码进来
      const scene = decodeURIComponent(options.scene)
      let paramsArr = scene.split('&')
      let paramsObj = {}
      paramsArr.forEach(item => {
        let obj = item.split('=')
        paramsObj[obj[0]] = obj[1]
      })
      id = paramsObj.id
      uid = paramsObj.uid || ''
    } else { // url跳转进来
      id = options.id
      uid = options.uid || ''
    }
    if (uid) {
      this.setData({
        fromUid: uid
      })
    }
    this.setData({
      id: id
    })
    this.pintuanid = id
    this.fetchPintuan(this.pintuanid)
    this.getOrderContact()
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
        let product = res.data.huodong || res.data.vgoods
        if (product && product.valid_btime) {
          product.valid_btime = util.formatDateTimeDefault('d', product.valid_btime)
        }
        if (product && product.valid_etime) {
          product.valid_etime = util.formatDateTimeDefault('d', product.valid_etime)
        }
        res.data.product = product
        res.data.created_at = util.formatDateTimeDefault('m', res.data.created_at)
        res.data.users = this.getUsers(res.data)
        res.data.pintuanTimestamp = new Date().getTime()
        if (res.data.status == 1) { // 状态为拼团中时，初始化分享到朋友圈
          const title = res.data.current_user_name + '邀请你参与拼团'
          let path = '/pages/pintuandetail/pintuandetail?id=' + id
          if (res.data.fenxiao_price && res.data.fenxiao_price > 0) {
            path += ('&uid=' + res.data.current_user_id)
          }
          const imageUrl = res.data.product.cover_url
          this.initShare(title, path, imageUrl)
        }
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
        this.fetchPintuan(this.pintuanid)
        if (this.timer) {
          clearInterval(this.timer)
        }
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
  initShare: function (title, path, imageUrl) {
    this.onShareAppMessage = function () {
      return {
        title,
        path,
        imageUrl
      }
    }
    this.setData({
      canShareFriend: true
    })
  },
  drawPosterChange: function (e) {
    const {fetching, drawing} = e.detail
    const sharing = fetching || drawing
    this.setData({ sharing})
  },
  savePoster: function () {
    const { product_id, id } = this.data
    if (product_id && id) {
      const poster = this.selectComponent('#c-draw-poster')
      if (poster && poster.startDrawAndSavePoster) {
        poster.startDrawAndSavePoster(product_id, id)
      }
    }
  },
  createTuan: function () {
    const shoppingView = this.selectComponent('#c-shopping-view')
    if (shoppingView && shoppingView.toggleSession) {
      shoppingView.toggleSession({ currentTarget: { dataset: {saletype: 2} } })
    }
  },
  joinTuan: function () {
    const shoppingView = this.selectComponent('#c-shopping-view')
    if (shoppingView && shoppingView.toggleSession) {
      shoppingView.toggleSession({ currentTarget: { dataset: { saletype: 2 } } })
    }
  },
  goHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  getOrderContact: function () {
    const contactJson = storageHelper.getStorage('orderContact')
    if (contactJson) {
      this.setData({
        orderContact: JSON.parse(contactJson)
      })
    } else {
      let phone = storageHelper.getStorage('uphone')
      if (phone) {
        let _obj = {
          name: '',
          phone: phone
        }
        storageHelper.setStorage('orderContact', JSON.stringify(_obj))
        this.setData({
          orderContact: _obj
        })
      } else {
        util.request('/user/detail').then(res => {
          if (res.error == 0 && res.data) { // 获取用户信息成功
            if (res.data.phone) { // 有电话才设置
              storageHelper.setStorage('uphone', res.data.phone)
              const _obj = {
                name: res.data.nick_name,
                phone: res.data.phone
              }
              storageHelper.setStorage('orderContact', JSON.stringify(_obj))
              this.setData({
                orderContact: _obj
              })
            }
          }
        })
      }
    }
  },

  initContact: function (e) {
    const { iv, encryptedData } = e.detail
    if (iv && encryptedData) {
      util.request('/common/decrypt', {
        iv: iv,
        encryptedData: encryptedData,
      }).then(res => {
        if (res.error == 0) {
          let _obj = {
            name: '',
            phone: res.data.phoneNumber
          }
          storageHelper.setStorage('orderContact', JSON.stringify(_obj))
          this.setData({
            orderContact: _obj
          }, () => {
            console.log('感谢您的授权，继续操作报名吧')
          })
        }
      }).catch(err => { })
    }
  },
  goGoodsDetail: function (e) {
    if (e.currentTarget.dataset.goodsid) {
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?id=' + e.currentTarget.dataset.goodsid
      })
    }
  },
  nextTap: function (e) {
    const { saletype, currentSession, currentSubSession, currentTickets, subSessions, selectedTicketLength, totalPrice} = e.detail
    const { type, product_id: id, id: tuan_id, fromUid, product: { title, valid_btime, valid_etime, address, session, sale_type, refund = false, include_bx }, hx_rule } = this.data
    let dataObj = {type, id, fromUid, title, address, valid_btime, valid_etime, session, sale_type, saletype, selectedTicketLength: selectedTicketLength[saletype], currentSession: currentSession[saletype], refund, include_bx, totalPrice: totalPrice[saletype], tuan_id, hx_rule}
    if (type == 1) { // 活动
      dataObj.currentTickets = currentTickets[saletype]
    } else if (type == 2) { // 非活动
      dataObj.currentSubSession = currentSubSession[saletype]
      dataObj.subSessions = subSessions[saletype]
    }
    if (this.data.status != 1) { // 如果不是拼团中，设置tuan_id为0，即为新开一个团
      dataObj.tuan_id = 0
    }
    storageHelper.setStorage('orderSubmitJson', JSON.stringify(dataObj))
    wx.navigateTo({
      url: '/pages/ordersubmit/ordersubmit'
    })
  }
})