// pages/goodsdetail/goodsdetail.js
import util from '../../utils/util.js'
import storageHelper from '../../utils/storageHelper.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsLoaded: false,
    fromUid: '',
    uid: '',
    uavatar: '',
    unickname: '',
    id: '',
    statusText: {
      0: '活动已失效',
      1: '活动报名中',
      2: '活动报名中',
      3: '报名已结束',
      4: '报名已结束',
      5: '活动已结束'
    },
    buttonStatusText: {
      0: '活动失效',
      1: '立即报名',
      2: '报名已满',
      3: '报名截止',
      4: '报名已满',
      5: '报名结束'
    },
    fenxiao_price: 0, // 分享赚fenxiao_price，如果为0或不存在，则分享按钮为普通样式，否则为分享赚xxx样式
    cover_url: '',
    title: '',
    desc: '',
    include_bx: '1',
    min_price: 0,
    show_min_price: 0,
    price_num: 1,
    status: '', // 0为失效或已删除|1为报名中|2为已满额未截止|3为已截止未满额|4为已截止且满额|5为已结束
    valid_btime: '',
    valid_etime: '',
    dead_line: '',
    address: '',
    address_position: [],
    jh_address: '',
    jh_address_position: [],
    min_age: '',
    max_age: '',
    limit_num: '',
    refund: false, // 是否支持退款
    join_num: 23,
    join_users: [],
    shop: {}, // 商家信息
    currentTab: 0,
    content: '',
    avg_score: 0,
    comment_num: 0,
    comments: [],
    contact: '',
    session: [],
    currentSession: null,
    currentTickets: [],
    selectedTicketLength: 0,
    totalPrice: 0,
    showSession: false,
    show_share_box: false,
    localPoster: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('ooo', options)
    if (options.uid) {
      this.setData({
        fromUid: options.uid
      })
    }
    this.fetchGoods(options.id)
    this.fetchComment(options.id)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const { title, id, cover_url, uid} = this.data
    return {
      title: title,
      path: '/pages/goodsdetail/goodsdetail?id=' + id + '&uid=' + uid,
      imageUrl: cover_url
    }
  },

  fetchGoods: function (id) {
    let rData = {id}
    util.request('/huodong/detail', rData).then(res => {
      console.log('/huodong/detail_res', res)
      if (res.error == 0 && res.data) {
        // 处理展示详情内容
        let arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' }
        res.data.content = res.data.content.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block"').replace(/<section/gi, '<div').replace(/\/section>/gi, '/div>')
        // 价格处理(String -> Number，分润，最小价格)
        res.data.fenxiao_price = util.formatMoney(res.data.fenxiao_price).money
        res.data.min_price = util.formatMoney(res.data.min_price).money
        res.data.show_min_price = util.formatMoney(res.data.min_price).showMoney
        if (res.data.session) {
          res.data.session.forEach((item, idx) => { // 票的价格处理(String -> Number，分保留，另存一份用于展示的价格, 计算时用分，展示时用元)
            item.ticket.forEach(it => {
              it.type.show_price = util.formatMoney(it.type.price).showMoney
              it.type.price = util.formatMoney(it.type.price).money
            })
          })
          this.initSession(res.data.session)
        }
        res.data.goodsLoaded = true
        this.setData(res.data)
      }
    }).catch(err => {
      
    })
  },

  fetchComment: function (pid) {
    let rData = { product_id: pid, type: '1', pn: 1 }
    util.request('/rate/list', rData).then(res => {
      console.log('/rate/list_res', res)
      if (res.error == 0 && res.data) {
        let {list, page, avg_score} = res.data
        const total = (page && page.total) ? page.total : 0
        console.log('avg_score', avg_score)
        this.setData({
          avg_score: avg_score,
          comment_num: total,
          comments: list
        })
      }
    }).catch(err => {

    })
  },

  changeTab: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  call: function (e) {
    const { phone } = e.currentTarget.dataset
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone.toString()
      })
    }
  },

  stopPropagation: function () {
    return false
  },

  sessionTap: function (e) {
    const { status, idx} = e.currentTarget.dataset
    const session = JSON.parse(JSON.stringify(this.data.session))
    if (status === 'disabled') { // 售罄
      return false
    }
    const tickets = session[idx].ticket.map(item => Object.assign({}, item, {num: 0}))
    this.setData({
      selectedTicketLength: 0,
      totalPrice: 0,
      currentSession: idx,
      currentTickets: tickets
    })
  },

  initSession: function (session) {
    let _session = JSON.parse(JSON.stringify(session))
    let current = null
    let selected = []
    for (let i = 0; i < _session.length; i++) {
      if (_session[i].stock === 0) {
        console.log('continue1', i, _session[i].stock, null <= 0)
        continue
      }
      let valid = false
      let tickets = _session[i].ticket
      for (let j = 0; j < tickets.length; j++) {
        if (tickets[j].stock === 0) {
          console.log('continue2', j, tickets[j].stock)
          continue
        }
        valid = true
      }
      if (valid) {
        current = i
        break
      }
    }
    if (current !== null) {
      selected = _session[current].ticket.map(item => Object.assign({}, item, {num: 0}))
    }
    this.setData({
      selectedTicketLen: 0,
      totalPrice: 0,
      currentSession: current,
      currentTickets: selected
    })
  },

  countTicket: function (e) {
    let tickets = JSON.parse(JSON.stringify(this.data.currentTickets))
    let selectedTicketLen = 0
    let total = 0
    const {type, idx} = e.currentTarget.dataset
    let ticket = tickets[idx]
    let disabled = ticket.stock === 0 || (ticket.num <= 0 && type === 'minus') || (ticket.stock && ticket.num >= ticket.stock && type === 'add')
    if (disabled) {
      return false
    }
    tickets.forEach((item, index) => {
      selectedTicketLen += index === idx ? (item.num + (type === 'minus' ? -1 : 1)) : item.num
      total += index === idx ? ((item.num + (type === 'minus' ? -1 : 1)) * item.type.price) : (item.num * item.type.price)
    })
    let num = ticket.num + (type === 'minus' ? -1 : 1)
    let _obj = {}
    _obj.selectedTicketLength = selectedTicketLen
    _obj.totalPrice = parseFloat((total / 100).toFixed(2))
    _obj['currentTickets[' + idx + '].num'] = num
    this.setData(_obj)
  },

  toggleSession: function () {
    const {showSession} = this.data
    this.setData({
      showSession: !showSession
    })
  },

  order: function () { // todo
    this.toggleSession()
    console.log('跳转提交订单页面')
    wx.navigateTo({
      url: '/pages/ordersubmit/ordersubmit'
    })
  },

  viewAllComment: function () {
    console.log('viewAllComment')
    const {id} = this.data
    wx.navigateTo({
      url: '/pages/commentlist/commentlist?pid=' + id
    })
  },

  viewLocation: function (e) {
    console.log('viewLocation')
    const lnglat = this.data[e.currentTarget.dataset.ele]
    if (lnglat && lnglat[0] && lnglat[1]) {
      wx.openLocation({
        latitude: parseFloat(lnglat[1]),
        longitude: parseFloat(lnglat[0])
      })
    }
  },

  viewBusinessCertification: function () { // 查看商家资质
    console.log('viewBusinessCertification')
    wx.navigateTo({
      url: '/pages/imagepage/imagepage?image=' + this.data.shop.type_pic_url + '&title=商家资质',
    })
  },

  viewBusiness: function () { // 跳转到商家
    const {id} = this.data.shop
    wx.navigateTo({
      url: '/pages/merchantdetail/merchantdetail?id=' + id
    })
  },

  fetchUserInfo: function () {
    const uid = storageHelper.getStorage('uid')
    const uavatar = storageHelper.getStorage('uavatar')
    const unickname = storageHelper.getStorage('unickname')
    if (uid && uavatar && unickname) {
      this.setData({
        uid: uid,
        uavatar: uavatar,
        unickname: unickname
      })
      wx.getImageInfo({
        src: uavatar,
        success: (res) => {
          this.canvas_user_avatar = res.path
          this.drawPoster()
        }
      })
    } else {
      util.request('/user/detail').then(res => {
        if (res.error == 0 && res.data) { // 获取用户信息成功
          this.setData({
            uid: res.data.id,
            uavatar: res.data.avatar,
            unickname: res.data.nick_name
          })
          wx.getImageInfo({
            src: res.data.avatar,
            success: (res) => {
              this.canvas_user_avatar = res.path
              this.drawPoster()
            }
          })
        }
      })
    }
  },

  getPosterUserAvatar: function () {
    if (!this.data.uavatar) {
      this.fetchUserInfo()
      return false
    }
    wx.getImageInfo({
      src: this.data.uavatar,
      success: (res) => {
        this.canvas_user_avatar = res.path
        this.drawPoster()
      }
    })
  },

  getPosterGoodsRqcode: function () {
    let { id } = this.data
    if (!this.canvas_goods_qrcode && !this.code_image_fetching) {
      this.code_image_fetching = true
      util.request('/huodong/miniqr', { id }).then(res => {
        if (res.error == 0 && res.data) { // 获取活动二维码
          console.log('获取活动二维码', res)
          wx.getImageInfo({
            src: res.data,
            success: (res) => {
              this.canvas_goods_qrcode = res.path
              this.drawPoster()
            }
          })
        }
      }).finally(res => {
        this.code_image_fetching = false
      })
    }
  },

  getPosterGoodsBanner: function () {
    wx.getImageInfo({
      src: this.data.cover_url,
      success: (res) => {
        // 按照aspectfill的方式截取
        const img_width = res.width
        const img_height = res.height
        const canvas_height = 316
        const canvas_width = 470
        let clip_left,clip_top,clip_width,clip_height // 左偏移值，上偏移值，截取宽度，截取高度
        clip_height = img_width * (canvas_height / canvas_width)
        if (clip_height > img_height) {
          clip_height = img_height
          clip_width = clip_height * (canvas_width / canvas_height)
          clip_left = (img_width - clip_width) / 2
          clip_top = 0
        } else {
          clip_left = 0
          clip_top = (img_height - clip_height) / 2
          clip_width = img_width
        }
        this.banner_clip = {
          clip_left,
          clip_top,
          clip_width,
          clip_height
        }
        this.canvas_goods_banner = res.path
        this.drawPoster()
      }
    })
  },

  drawPoster: function (goods) {
    console.log('drawPoster', this.canvas_user_avatar, this.canvas_goods_qrcode, this.canvas_goods_banner, this.banner_clip)
    if (!this.canvas_user_avatar || !this.canvas_goods_qrcode || !this.canvas_goods_banner || !this.banner_clip) {
      if (!this.canvas_user_avatar) {
        this.getPosterUserAvatar()
      }
      if (!this.canvas_goods_qrcode) {
        this.getPosterGoodsRqcode()
      }
      if (!this.canvas_goods_banner || !this.banner_clip) {
        this.getPosterGoodsBanner()
      }
      return false
    }
    const systemInfo = wx.getSystemInfoSync()
    const ctx = wx.createCanvasContext('share-poster', this)
    const rpx = systemInfo.windowWidth / 750

    ctx.drawImage('/assets/images/share_poster_bg.png', 0, 0, 526 * rpx, 816 * rpx) // 海报背景
    ctx.save()
    ctx.beginPath()
    ctx.arc(86 * rpx, 86 * rpx, 28 * rpx, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(this.canvas_user_avatar, 58 * rpx, 58 * rpx, 56 * rpx, 56 * rpx)
    ctx.restore()
    ctx.drawImage(this.canvas_goods_banner, this.banner_clip.clip_left, this.banner_clip.clip_top, this.banner_clip.clip_width, this.banner_clip.clip_height, 32 * rpx, 139 * rpx, 462 * rpx, 316 * rpx)
    ctx.drawImage('/assets/images/lutu_logo.png', 51 * rpx, 666 * rpx, 86 * rpx, 86 * rpx)
    ctx.drawImage(this.canvas_goods_qrcode, 374 * rpx, 644 * rpx, 105 * rpx, 105 * rpx)
    ctx.setFontSize(20 * rpx)
    ctx.setFillStyle('#333')
    ctx.fillText('@ ' + this.data.unickname, 126 * rpx, 80 * rpx, 340 * rpx)
    ctx.setFontSize(18 * rpx)
    ctx.setFillStyle('#999')
    ctx.fillText('发现了一个宝贝，想要跟你分享~', 126 * rpx, 106 * rpx, 340 * rpx)
    ctx.setFontSize(22 * rpx)
    ctx.setFillStyle('#333')
    const title = this.data.title
    if (title.length > 20) {
      ctx.fillText(title.substring(0, 19), 51 * rpx, 500 * rpx, 425 * rpx)
      if (title.length > 37) {
        ctx.fillText(title.substring(19, 37) + '...', 51 * rpx, 530 * rpx, 425 * rpx)
      } else {
        ctx.fillText(title.substring(19, 37), 51 * rpx, 530 * rpx, 425 * rpx)
      }
    } else {
      ctx.fillText(title, 51 * rpx, 500 * rpx, 425 * rpx)
    }
    let price = ''
    const { show_min_price, price_num, join_num} = this.data
    if (show_min_price && show_min_price > 0) {
      if (price_num > 1) {
        price = '¥' + show_min_price + '起'
      } else {
        price = '¥' + show_min_price
      }
    } else {
      price = '免费'
    }
    ctx.setFontSize(36 * rpx)
    ctx.setFillStyle('#F24724')
    ctx.fillText(price, 51 * rpx, 590 * rpx, 425 * rpx)
    ctx.setFontSize(18 * rpx)
    ctx.setFillStyle('#999')
    const join_text = '累计' + (join_num || 0) + '人报名'
    const join_left = 526 - (join_text.length * 18 + 51)
    ctx.fillText(join_text, join_left * rpx, 585 * rpx, 425 * rpx)
    ctx.setFontSize(15 * rpx)
    ctx.setFillStyle('#999')
    ctx.fillText('路途亲子，共享美好时光！', 51 * rpx, 766 * rpx)
    ctx.fillText('长按立即购买', 382 * rpx, 766 * rpx)
    ctx.draw(true, () => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'share-poster',
        success: res => {
          let localPoster = res.tempFilePath
          this.setData({
            localPoster: localPoster
          })
        },
        fail: function (res) {

        }
      })
    })
  },

  setDrawImage: function (ctx, src, x, y, w, h) {
    wx.getImageInfo({
      src: src,
      success: function (res) {
        ctx.drawImage(res.path, x, y, w, h)
        ctx.draw(true)
      }
    })
  },

  shareBtnTap: function () {
    console.log('shareBtnTap')
    const { show_share_box, localPoster} = this.data
    if (!show_share_box) {
      this.setData({
        show_share_box: true
      })
    }
    if (!localPoster) {
      this.drawPoster()
    }
  },

  toggleShareBox: function () {
    const { show_share_box } = this.data
    this.setData({
      show_share_box: !show_share_box
    })
  },

  shareFriend: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  savePoster: function () {
    console.log('savePoster')
    const { localPoster} = this.data
    if (!localPoster) {
      return false
    }
    // 获取用户是否开启用户授权相册
    wx.getSetting({
      success: res => {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum'] && res.authSetting['scope.writePhotosAlbum'] !== false) { // 未授权 且 未拒绝过
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              wx.saveImageToPhotosAlbum({
                filePath: this.data.localPoster,
                success: () => {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                  })
                },
                fail: () => {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            },
            fail: () => {

            }
          })
        } else if (!res.authSetting['scope.writePhotosAlbum'] && res.authSetting['scope.writePhotosAlbum'] === false) { // 未授权且拒绝过
          wx.showModal({
            content: '保存图片需要你授权，请授权相册', //提示的内容
            showCancel: true,
            confirmText: '去授权',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    const authSetting = res.authSetting
                    if (authSetting['scope.writePhotosAlbum']) {
                      wx.saveImageToPhotosAlbum({
                        filePath: this.data.localPoster,
                        success: () => {
                          wx.showToast({
                            title: '保存成功',
                            icon: 'none'
                          })
                        },
                        fail: () => {
                          wx.showToast({
                            title: '保存失败',
                            icon: 'none'
                          })
                        }
                      })
                    }
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if (res.authSetting['scope.writePhotosAlbum']) {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: this.data.localPoster,
            success: () => {
              wx.showToast({
                title: '保存成功',
                icon: 'none'
              })
            },
            fail: () => {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  getOrderData: function () { // 该方法提供给提交订单页面使用,返回提交订单页面需要的信息
    let { id, fromUid, title, address, valid_btime, valid_etime, selectedTicketLength, currentTickets, refund, include_bx, totalPrice} = this.data
    const data = JSON.parse(JSON.stringify({ id, fromUid, title, address, valid_btime, valid_etime, selectedTicketLength, currentTickets, refund, include_bx, totalPrice}))
    return data
  }
})