// pages/goodsdetail/goodsdetail.js
import util from '../../utils/util.js'
import storageHelper from '../../utils/storageHelper.js'
// todo 添加购买须知后滚动切换tab有bug，需修复
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
      0: '活动未上架',
      1: '活动报名中',
      2: '活动报名中',
      3: '报名已结束',
      4: '报名已结束',
      5: '活动已结束'
    },
    buttonStatusText: {
      0: '敬请期待',
      1: '立即报名',
      2: '报名已满',
      3: '报名截止',
      4: '报名已满',
      5: '活动结束'
    },
    sale_type: '1', // 该商品是 团购 还是 普通商品（1:普通商品，2:团购商品）
    saletype: '1', // 当前是 普通购买 还是 发起拼团
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
    min_pt_price: 0,
    show_min_price: 0,
    show_min_origin_price: 0,
    show_min_pt_price: 0,
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
    currentSession: {1: null, 2: null},
    currentTickets: {1: [], 2: []},
    selectedTicketLength: {1: 0, 2: 0},
    totalPrice: {1: 0, 2: 0},
    showSession: false,
    show_share_box: false,
    localPoster: '',
    orderContact: null
  },

  scrollpoint: {},

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
  // onShareAppMessage: function () {
  //   const { title, id, shareFriendBanner, share_cover_url, cover_url, uid} = this.data
  //   return {
  //     title: title,
  //     path: '/pages/goodsdetail/goodsdetail?id=' + id + '&uid=' + uid,
  //     imageUrl: shareFriendBanner || share_cover_url || cover_url
  //   }
  // },

  fetchGoods: function (id) {
    let rData = {id}
    util.request('/huodong/detail', rData).then(res => {
      if (res.error == 0 && res.data) {
        // 处理展示详情内容
        let arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"', 'mdash': '——', 'ldquo': '“', 'rdquo': '”', '#39': "'", 'ensp': '' }
        res.data.content = res.data.content.replace(/\n/ig, '').replace(/\t/ig, '').replace(/<img/ig, '<img style="max-width:100%;height:auto;display:block"').replace(/<section/ig, '<div').replace(/\/section>/ig, '/div>')
        // 处理时间格式
        res.data.valid_btime = util.formatDateTimeDefault('d', res.data.valid_btime)
        res.data.valid_etime = util.formatDateTimeDefault('d', res.data.valid_etime)
        // 价格处理(String -> Number，分润，最小价格)
        res.data.fenxiao_price = util.formatMoney(res.data.fenxiao_price).showMoney
        res.data.min_price = util.formatMoney(res.data.min_price).money
        res.data.show_min_price = util.formatMoney(res.data.min_price).showMoney
        res.data.min_origin_price = util.formatMoney(res.data.min_origin_price).money
        res.data.show_min_origin_price = util.formatMoney(res.data.min_origin_price).showMoney
        res.data.min_pt_price = util.formatMoney(res.data.min_pt_price).money
        res.data.show_min_pt_price = util.formatMoney(res.data.min_pt_price).showMoney
        res.data.goodsLoaded = true
        if (res.data.tuan && res.data.tuan.length > 0) {
          res.data.groupList = res.data.tuan.map(item => {
            return {
              id: item.id,
              avatar: item.tuan_master_avatar,
              username: item.tuan_master_nick_name,
              need: item.remain_spell_num,
              remain: item.expired_timestamp,
              is_join: item.is_join
            }
          })
        }
        this.setData(res.data, () => {
          this.setData({
            content: this.data.content.replace(/\t\t\t/gi, '')
          })
        })
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
    const { idx, scrollid } = e.currentTarget.dataset
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    this.setData({
      currentTab: idx
    })
    const query = wx.createSelectorQuery()
    query.select(scrollid).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(res => {
      const scrollPos = res[0].top + res[1].scrollTop - 90 * rpx
      wx.pageScrollTo({
        scrollTop: scrollPos,
        duration: 0
      })
    })
  },

  initTabScroll: function () {
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    const tabHeaderObserveRect = { bottom: -(systemInfo.windowHeight - 1)}
    const tabContentObserveRect = { top: -90 * rpx, bottom: -(systemInfo.windowHeight - 1 - 90 *rpx) }
    wx.createIntersectionObserver().relativeToViewport(tabHeaderObserveRect).observe('#tab-wrapper', (res) => {
      const tabFixed = res.intersectionRatio > 0
      this.setData({tabFixed})
    })
    wx.createIntersectionObserver().relativeToViewport(tabContentObserveRect).observe('#goods-content', (res) => {
      if (res.intersectionRatio > 0) {
        const { tabindex: currentTab } = res.dataset
        this.setData({ currentTab })
      }
    })
    wx.createIntersectionObserver().relativeToViewport(tabContentObserveRect).observe('#goods-notice', (res) => {
      if (res.intersectionRatio > 0) {
        const { tabindex: currentTab } = res.dataset
        this.setData({currentTab})
      }
    })
    wx.createIntersectionObserver().relativeToViewport(tabContentObserveRect).observe('#comment-content', (res) => {
      if (res.intersectionRatio > 0) {
        const { tabindex: currentTab } = res.dataset
        this.setData({ currentTab })
      }
    })
  },

  stopPropagation: function () {
    return false
  },

  showShoppingView: function (e) {
    this.setData({
      tuanId: e.currentTarget.dataset.saletype == 2 ? 0 : null
    })
    const shoppingView = this.selectComponent('#c-shopping-view')
    if (shoppingView && shoppingView.toggleSession) {
      shoppingView.toggleSession(e)
    }
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

  shareBtnTap: function () {
    const poster = this.selectComponent('#c-draw-poster')
    if (poster && poster.startDraw) {
      const {id} = this.data
      poster.startDraw(id)
    }
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
  
  groupTap: function (e) {
    const shoppingView = this.selectComponent('#c-shopping-view')
    if (e.detail.isJoin) {
      wx.showToast({
        title: '您正在参与这个团哦～',
        icon: 'none'
      })
      return false
    }
    this.setData({
      tuanId: e.detail.tuanId
    })
    if (shoppingView && shoppingView.toggleSession) {
      shoppingView.toggleSession({currentTarget: {dataset: {saletype: '2'}}})
    }
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
        if (!is_collect) { // 收藏成功 且 是第一次收藏 才提示，其他情况静默
          const goodsCollected = storageHelper.getStorage('goodsCollected')
          if (!goodsCollected) {
            this.setData({
              showCollectTip: true
            })
            setTimeout(this.hideCollectTip, 3000)
          } else {
            wx.showToast({
              title: '收藏成功',
              icon: 'none'
            })
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
  },

  nextTap: function (e) {
    const { saletype, currentSession, currentTickets, selectedTicketLength, totalPrice } = e.detail
    const { id, tuanId: tuan_id, fromUid, title, valid_btime, valid_etime, address, session, sale_type, refund = false, include_bx } = this.data
    let data = JSON.parse(JSON.stringify({ id, fromUid, title, address, valid_btime, valid_etime, session, sale_type, saletype, selectedTicketLength: selectedTicketLength[saletype], currentSession: currentSession[saletype], currentTickets: currentTickets[saletype], refund, include_bx, totalPrice: totalPrice[saletype], tuan_id }))
    storageHelper.setStorage('orderSubmitJson', JSON.stringify(data))
    wx.navigateTo({
      url: '/pages/ordersubmit/ordersubmit'
    })
  }
})