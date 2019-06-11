// pages/goodsdetail/goodsdetail.js
import util from '../../utils/util.js'
import storageHelper from '../../utils/storageHelper.js'

Page({
  name: 'goodsdetail',
  /**
   * 页面的初始数据
   */
  data: {
    tabFixed: false,
    goodsLoaded: false, // 是否已加载数据
    commentLoaded: false, // 是否已加载评价
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
    sale_type: '1',
    is_collect: false,
    showCollectTip: false,
    groupList: [],
    fenxiao_price: 0, // 分享赚fenxiao_price，如果为0或不存在，则分享按钮为普通样式，否则为分享赚xxx样式
    cover_url: '',
    title: '',
    desc: '',
    include_bx: '',
    min_price: 0,
    min_origin_price: 0,
    show_min_price: 0,
    show_min_origin_price: 0,
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
    join_num: 0,
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
    localPoster: '',
    orderContact: null
  },

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
    this.fetchGoods(id)
    this.fetchComment(id)
    this.getOrderContact()
    this.fetchUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initTabScroll()
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
    const { title, id, shareFriendBanner, share_cover_url, cover_url, uid} = this.data
    return {
      title: title,
      path: '/pages/goodsdetail/goodsdetail?id=' + id + '&uid=' + uid,
      imageUrl: shareFriendBanner || share_cover_url || cover_url
    }
  },

  fetchGoods: function (id) {
    let rData = {id}
    util.request('/huodong/detail', rData).then(res => {
      if (res.error == 0 && res.data) {
        // 测试原价todo
        // res.data.min_origin_price = 2000
        // 处理展示详情内容
        let arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"', 'mdash': '——', 'ldquo': '“', 'rdquo': '”', '#39': "'" }
        res.data.content = res.data.content.replace(/\n/ig, '').replace(/<img/ig, '<img style="max-width:100%;height:auto;display:block"').replace(/<section/ig, '<div').replace(/\/section>/ig, '/div>')
        // 处理时间格式
        res.data.valid_btime = util.formatDateTimeDefault('d', res.data.valid_btime)
        res.data.valid_etime = util.formatDateTimeDefault('d', res.data.valid_etime)
        // 价格处理(String -> Number，分润，最小价格)
        res.data.fenxiao_price = util.formatMoney(res.data.fenxiao_price).showMoney
        res.data.min_price = util.formatMoney(res.data.min_price).money
        res.data.show_min_price = util.formatMoney(res.data.min_price).showMoney
        res.data.min_origin_price = util.formatMoney(res.data.min_origin_price).money
        res.data.show_min_origin_price = util.formatMoney(res.data.min_origin_price).showMoney
        if (res.data.session) {
          res.data.session.forEach((item, idx) => { // 票的价格处理(String -> Number，分保留，另存一份用于展示的价格, 计算时用分，展示时用元)
            item.ticket.forEach(it => {
              it.type.show_price = util.formatMoney(it.type.price).showMoney
              it.type.price = util.formatMoney(it.type.price).money
              it.type.show_pt_price = util.formatMoney(it.type.pt_price).showMoney
              it.type.pr_price = util.formatMoney(it.type.pt_price).money
            })
          })
          this.initSession(res.data.session)
        }
        res.data.goodsLoaded = true
        // res.data.tuan = [
        //   {
        //     id: 4,
        //     tuan_master_avatar: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2652953858,1039653315&fm=27&gp=0.jpg',
        //     tuan_master_nick_name: '花心萝卜腿',
        //     remain_spell_num: 1,
        //     expired_timestamp: 10
        //   },
        //   {
        //     id: 5,
        //     tuan_master_avatar: 'http://img5.imgtn.bdimg.com/it/u=1414213419,839053634&fm=26&gp=0.jpg',
        //     tuan_master_nick_name: '毛腿萝莉',
        //     remain_spell_num: 2,
        //     expired_timestamp: 5
        //   }
        // ]
        // res.data.groupList = res.data.tuan.map(item => {
        //   return {
        //     id: item.id,
        //     avatar: item.tuan_master_avatar,
        //     username: item.tuan_master_nick_name,
        //     need: item.remain_spell_num,
        //     remain: item.expired_timestamp
        //   }
        // })
        // res.data.sale_type = '2'
        // res.data.spell_num = 8
        this.setData(res.data, () => {
          this.setData({
            content: this.data.content.replace(/\t\t\t/gi, '')
          })
        })
        // this.drawShareFriendBanner(res.data.cover_url, res.data.show_min_price, res.data.price_num) // 目前的版本不需要绘制分享的banner，先注释
      }
    }).catch(err => {
      
    })
  },

  fetchComment: function (pid) {
    let rData = { product_id: pid, type: '1', pn: 1 }
    util.request('/rate/list', rData).then(res => {
      if (res.error == 0 && res.data) {
        let {list, page, avg_score} = res.data
        list.forEach(item => {
          item.created_at = util.formatDateTimeDefault('d', item.created_at)
        })
        const total = (page && page.total) ? page.total : 0
        this.setData({
          commentLoaded: true,
          avg_score: avg_score,
          comment_num: total,
          comments: list
        })
      }
    }).catch(err => {

    })
  },

  changeTab: function (e) {
    const { idx, ele } = e.currentTarget.dataset
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    this.setData({
      currentTab: idx
    })
    const query = wx.createSelectorQuery()
    query.select(ele).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      // res[0].top // #the-id节点的上边界坐标
      // res[1].scrollTop // 显示区域的竖直滚动位置
      let pos = res[0].top + res[1].scrollTop
      wx.pageScrollTo({
        scrollTop: pos - 90 * rpx,
        duration: 0
      })
    })
  },

  initTabScroll: function () {
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    wx.createIntersectionObserver().relativeToViewport({ top: -90 * rpx }).observe('#tab-wrapper', (res) => {
      if (res.boundingClientRect.top < 300 * rpx) { // 上边界超出或上边界显示
        if (res.intersectionRatio > 0) { // 显示
          this.setData({
            tabFixed: false
          })
        } else { // 隐藏
          this.setData({
            tabFixed: true
          })
        }
      }
    })
    wx.createIntersectionObserver().relativeToViewport({ bottom: -systemInfo.windowHeight + (90 * rpx) }).observe('#comment-content', (res) => {
      if (res.boundingClientRect.top < 90 * rpx && res.intersectionRatio > 0) { // 评价模块完全显示
        this.setData({
          currentTab: 1
        })
      } else {
        this.setData({
          currentTab: 0
        })
      }
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
    const { currentSession} = this.data
    const session = JSON.parse(JSON.stringify(this.data.session))
    if (status === 'disabled' || currentSession === idx) { // 售罄 或 点击的是当前的场次
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
        continue
      }
      let valid = false
      let tickets = _session[i].ticket
      for (let j = 0; j < tickets.length; j++) {
        if (tickets[j].stock === 0) {
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
      selectedTicketLength: 0,
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

  order: function () {
    this.toggleSession()
    wx.navigateTo({
      url: '/pages/ordersubmit/ordersubmit'
    })
  },

  viewAllComment: function () {
    const {id} = this.data
    wx.navigateTo({
      url: '/pages/commentlist/commentlist?pid=' + id
    })
  },

  viewLocation: function (e) {
    const lnglat = this.data[e.currentTarget.dataset.ele]
    if (lnglat && lnglat[0] && lnglat[1]) {
      wx.openLocation({
        latitude: parseFloat(lnglat[1]),
        longitude: parseFloat(lnglat[0])
      })
    }
  },

  viewBusinessCertification: function () { // 查看商家资质
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

  fetchUserInfo: function (shouldDraw) {
    const uid = storageHelper.getStorage('uid')
    const uavatar = storageHelper.getStorage('uavatar')
    const unickname = storageHelper.getStorage('unickname')
    if (uid && uavatar && unickname) {
      this.setData({
        uid: uid,
        uavatar: uavatar,
        unickname: unickname
      })
      if (shouldDraw) {
        wx.getImageInfo({
          src: uavatar,
          success: (res) => {
            this.canvas_user_avatar = res.path
            this.drawPoster()
          }
        })
      }
    } else {
      util.request('/user/detail').then(res => {
        if (res.error == 0 && res.data) { // 获取用户信息成功
          this.setData({
            uid: res.data.id,
            uavatar: res.data.avatar,
            unickname: res.data.nick_name
          })
          storageHelper.setStorage('uid', res.data.id)
          storageHelper.setStorage('uavatar', res.data.avatar)
          storageHelper.setStorage('unickname', res.data.nick_name)
          if (shouldDraw) {
            wx.getImageInfo({
              src: res.data.avatar,
              success: (res) => {
                this.canvas_user_avatar = res.path
                this.drawPoster()
              }
            })
          }
        }
      })
    }
  },

  getPosterUserAvatar: function () {
    if (!this.data.uavatar) {
      this.fetchUserInfo(true)
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
    if (join_num && join_num > 0) {
      ctx.setFontSize(18 * rpx)
      ctx.setFillStyle('#999')
      ctx.setTextAlign('right')
      const join_text = '累计' + (join_num || 0) + '人报名'
      const join_left = 526 - 28 - 23
      ctx.fillText(join_text, join_left * rpx, 585 * rpx, 424 * rpx)
    }
    ctx.setFontSize(15 * rpx)
    ctx.setFillStyle('#999')
    ctx.setTextAlign('left')
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
    const { show_share_box, localPoster, uid} = this.data
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
    const { localPoster} = this.data
    if (!localPoster) {
      return false
    }
    // 获取用户是否开启用户授权相册
    const app = getApp()
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
                  wx.showModal({
                    title: '保存成功',
                    content: '海报已生成并保存至你的手机相册了哦，分享到朋友圈给好友种草一下吧',
                    showCancel: false,
                    confirmText: '确定',
                    confirmColor: app.globalData.themeColor || '#000000'
                  })
                  // wx.showToast({
                  //   title: '保存成功',
                  //   icon: 'none'
                  // })
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
                          wx.showModal({
                            title: '保存成功',
                            content: '海报已生成并保存至你的手机相册了哦，分享到朋友圈给好友种草一下吧',
                            showCancel: false,
                            confirmText: '确定',
                            confirmColor: app.globalData.themeColor || '#000000'
                          })
                          // wx.showToast({
                          //   title: '保存成功',
                          //   icon: 'none'
                          // })
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
              wx.showModal({
                title: '保存成功',
                content: '海报已生成并保存至你的手机相册了哦，分享到朋友圈给好友种草一下吧',
                showCancel: false,
                confirmText: '确定',
                confirmColor: app.globalData.themeColor || '#000000'
              })
              // wx.showToast({
              //   title: '保存成功',
              //   icon: 'none'
              // })
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
    let { id, fromUid, title, address, valid_btime, valid_etime, session, selectedTicketLength, currentSession, currentTickets, refund, include_bx, totalPrice} = this.data
    const data = JSON.parse(JSON.stringify({ id, fromUid, title, address, valid_btime, valid_etime, session, selectedTicketLength, currentSession, currentTickets, refund, include_bx, totalPrice}))
    return data
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
              const _obj = {
                name: '',
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
  
  drawShareFriendBanner: function (banner, show_min_price, price_num) {
    const systemInfo = wx.getSystemInfoSync()
    const ctx = wx.createCanvasContext('share-friend-banner', this)
    const rpx = systemInfo.windowWidth / 750
    wx.getImageInfo({
      src: banner,
      success: (info_res) => {
        // 按照aspectfill的方式截取
        const width = info_res.width
        const height = info_res.height
        const c_height = 450
        const c_width = 750
        let clip_left, clip_top, clip_width, clip_height // 左偏移值，上偏移值，截取宽度，截取高度
        clip_height = width * (c_height / c_width)
        if (clip_height > height) {
          clip_height = height
          clip_width = clip_height * (c_width / c_height)
          clip_left = (width - clip_width) / 2
          clip_top = 0
        } else {
          clip_left = 0
          clip_top = (height - clip_height) / 2
          clip_width = width
        }
        ctx.drawImage(info_res.path, clip_left, clip_top, clip_width, clip_height, 0, 0, 750 * rpx, 450 * rpx)
        let price = ''
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
        ctx.fillText(price, 50 * rpx, 544 * rpx)
        ctx.draw(true, () => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'share-friend-banner',
            success: res => {
              this.setData({
                shareFriendBanner: res.tempFilePath
              })
            },
            fail: function (res) {

            }
          })
        })
      }
    })
  },

  groupTap: function (e) { // todo
    const {ele} = e.detail
    console.log('page_groupTap', ele)
  },

  collectTap: function () {
    const {id, goodsLoaded, is_collect, collectting} = this.data
    if (!goodsLoaded || collectting) { // 未获取数据成功 或 正在操作，则点击收藏无效
      return false
    }
    wx.vibrateShort()
    const url = is_collect ? '/collect/delete' : '/collect/add'
    const rData = is_collect ? { ids: [id] } : { product_id: id}
    this.setData({
      collectting: true
    })
    util.request(url, rData).then(res => {
      if (res.error == 0) {
        if (!is_collect) { // 收藏成功才提示，其他情况静默
          wx.showToast({
            title: '收藏成功',
            icon: 'none'
          })
          const goodsCollected = storageHelper.getStorage('goodsCollected')
          if (!goodsCollected) {
            this.setData({
              showCollectTip: true
            })
            setTimeout(this.hideCollectTip, 3000)
          }
          storageHelper.setStorage('goodsCollected', true)
        }
        const collected = is_collect
        this.setData({
          is_collect: !collected
        })
      }
    }).catch(err => {

    }).finally(res => {
      this.setData({
        collectting: false
      })
    })
  },

  hideCollectTip: function () {
    this.setData({
      showCollectTip: false
    })
  }
})