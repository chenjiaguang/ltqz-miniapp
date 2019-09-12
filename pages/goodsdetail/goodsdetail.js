// pages/goodsdetail/goodsdetail.js
import util from '../../utils/util.js'
import storageHelper from '../../utils/storageHelper.js'
import statusHelper from '../../utils/statusHelper'

Page({
  name: 'goodsdetail',
  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '商品详情',
    tabFixed: false,
    goodsLoaded: false, // 是否已加载数据
    commentLoaded: false, // 是否已加载评价
    fromUid: '',
    uid: '',
    uavatar: '',
    unickname: '',
    id: '',
    btnText: '',
    sale_type: '1', // 该商品是 团购 还是 普通商品（1:普通商品，2:团购商品，3:抢购模式）
    saletype: '1', // 当前是 普通购买 还是 发起拼团 还是 抢购模式
    is_collect: false,
    showCollectTip: false,
    groupList: [],
    fenxiao_price: '', // 分享赚fenxiao_price，如果为0或不存在，则分享按钮为普通样式，否则为分享赚xxx样式
    cover_url: '',
    title: '',
    desc: '',
    include_bx: false,
    min_price: 0,
    min_origin_price: 0,
    min_pt_price: 0,
    show_min_price: 0,
    show_min_origin_price: 0,
    show_min_pt_price: 0,
    price_num: 1,
    status: '', // 0为失效或已删除|1为销售中|2为已满额未截止|3为已截止未满额|4为已截止且满额|5为已结束 // 非活动 -3为手动下架|-2为审核中|-1为审核失败|0为未上架|1为出售中|6已售空
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
    can_refund: false, // 是否支持退款
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
    localPoster: '',
    orderContact: null,
    identificationText: {1: '个人认证', 2: '企业认证', 3: '其他组织认证'}
  },

  scrollpoint: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = ''
    let uid = ''
    this.options = options
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
  //   const { title, id, cover_url, uid, fenxiao_price} = this.data
  //   if (title && id && cover_url) {
  //     return {
  //       title: title,
  //       path: '/pages/goodsdetail/goodsdetail?id=' + id + ((uid && fenxiao_price) ? ('&uid=' + uid) : ''),
  //       imageUrl: cover_url + '?x-oss-process=image/resize,m_fill,w_750,h_600'
  //     }
  //   }
  // },

  fetchGoods: function (id) {
    let rData = {id, coupon: !this.options.fromnav}
    util.request('/product/detail', rData).then(res => {
      if (res.error == 0 && res.data) {
        // 处理展示详情内容
        let arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"', 'mdash': '——', 'ldquo': '“', 'rdquo': '”', '#39': "'", 'ensp': '' }
        res.data.content = res.data.content.replace(/\n/ig, '').replace(/\t/ig, '').replace(/<img/ig, '<img style="max-width:100%;height:auto;display:block"').replace(/<section/ig, '<div').replace(/\/section>/ig, '/div>')

        // 处理时间格式
        res.data.valid_btime = res.data.valid_btime ? util.formatDateTimeDefault('d', res.data.valid_btime) : ''
        res.data.valid_etime = res.data.valid_etime ? util.formatDateTimeDefault('d', res.data.valid_etime) : ''
        // 价格处理(String -> Number，分润，最小价格)
        // res.data.fenxiao_price = util.formatMoney(res.data.fenxiao_price).showMoney
        res.data.min_price = util.formatMoney(res.data.min_price).money
        res.data.show_min_price = util.formatMoney(res.data.min_price).showMoney
        res.data.min_origin_price = util.formatMoney(res.data.min_origin_price).money
        res.data.show_min_origin_price = util.formatMoney(res.data.min_origin_price).showMoney
        res.data.min_pt_price = util.formatMoney(res.data.min_pt_price).money
        res.data.show_min_pt_price = util.formatMoney(res.data.min_pt_price).showMoney
        res.data.min_qg_price = util.formatMoney(res.data.min_qg_price).money
        res.data.show_min_qg_price = util.formatMoney(res.data.min_qg_price).showMoney
        const { id, title, desc, type, sale_type, price_num, spell_num, status, qg_status, remain_qg, start_qg, show_min_price, show_min_origin_price, show_min_pt_price, show_min_qg_price, qg_btime, qg_etime, qg_max_limit, total_qg_count, is_book_remind } = res.data
        res.data.goods_status_data = JSON.parse(JSON.stringify({ id, title, desc, type, sale_type, price_num, spell_num, status, qg_status, remain_qg, start_qg, show_min_price, show_min_origin_price, show_min_pt_price, show_min_qg_price, qg_btime, qg_etime, qg_max_limit, total_qg_count, is_book_remind }))
        if (res.data.product_img_urls && res.data.product_img_urls.length) {
          res.data.banners = res.data.product_img_urls.map(item => {
            return {image: item}
          })
        } else if (res.data.product_cover_url) {
          res.data.banners = [{image: res.data.product_cover_url}]
        } else if (res.data.cover_url) {
          res.data.banners = [{image: res.data.cover_url}]
        }
        res.data.goodsLoaded = true
        res.data.goodsTimestamp = new Date().getTime()
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
        res.data.subOverview = this.getSubOverview(res.data)
        if (res.data.coupon) {
          res.data.coupon = res.data.coupon.map(item => {
            const priceObj = util.formatMoney(item.reduction_amount)
            const thresholdObj = util.formatMoney(item.full_amount)
            return {
              id: item.id,
              title: item.title,
              price: priceObj.money,
              show_price: parseFloat(priceObj.showMoney),
              threshold: thresholdObj.money,
              threshold_text: (thresholdObj.money && thresholdObj.money !== '0' && thresholdObj.money != '免费') ? `满¥${parseFloat(thresholdObj.showMoney)}可用` : '无金额门槛',
              tip: item.time_desc
            }
          })
        }
        if (res.data.shop && (res.data.shop.rate || res.data.shop.rate === 0)) { // 商家评分显示小数点后1位
          res.data.shop.rate = parseFloat(res.data.shop.rate).toFixed(1)
        }
        this.initBottomData(res.data)
        
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
    let rData = { product_id: pid, pn: 1 }
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
    const {rpx} = this.data._nav_data_
    
    const query = wx.createSelectorQuery()
    query.select(scrollid).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(res => {
      const scrollPos = res[0].top + res[1].scrollTop - (90 * rpx) - this.data._nav_data_.navHeight
      wx.pageScrollTo({
        scrollTop: scrollPos + 1,
        duration: 0
      })
    })
  },

  initTabScroll: function () {
    const {rpx, screenHeight} = this.data._nav_data_
      
    
    const tabHeaderObserveRect = { bottom: -(screenHeight - 1) + this.data._nav_data_.navHeight}
    const tabContentObserveRect = { top: -(90 * rpx) - this.data._nav_data_.navHeight, bottom: -(screenHeight - (90 * rpx) - this.data._nav_data_.navHeight - 1) }
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

  getSubOverview: function (data) {
    let {type, valid_btime, valid_etime, hx_rule, dead_line, refund_deadline, address, address_position, jh_address, jh_address_position, age_desc, min_age, max_age, limit_num, note, include_bx, can_refund, has_postage} = data
    let arr = []
    if (type && type == 1 && valid_btime && valid_etime) {
      arr.push({img: '/assets/images/time_jointime.png', text: `活动日期：${valid_btime} 至 ${valid_etime}`})
    }
    
    if (dead_line) {
      arr.push({img: '/assets/images/time_deadline.png', text: `${type == 1 ? '报名' : ''}截止时间：${dead_line}`})
    }
    if (hx_rule) {
      arr.push({img: '/assets/images/hx_rule_icon.png', text: `核销有效期：${hx_rule}`})
    }
    if (address) {
      arr.push({img: '/assets/images/huodong_location.png', text: `${type == 1 ? '活动' : ''}地点：${address}`, isAddress: true, lnglat: address_position, address: `${address}`})
    }
    // if (type == 1 && jh_address) {
    //   arr.push({img: '/assets/images/jihe_location.png', text: `集合地点：${jh_address}`, isAddress: true, lnglat: jh_address_position, address: `${jh_address}`})
    // }
    if (age_desc) {
      arr.push({img: '/assets/images/nianling.png', text: `适合年龄段：${age_desc}`})
    }
    if (limit_num) {
      arr.push({img: '/assets/images/chengtuan.png', text: limit_num})
    }
    if (note && note[0]) {
      note.forEach(item => {
        arr.push({img: '/assets/images/beizhu.png', text: item})
      })
    }
    if (include_bx) {
      arr.push({img: '/assets/images/baoxian.png', text: `本商品费用包含保险`})
    }
    if (type == 3) {
      arr.push({img: '/assets/images/shipping.png', text: `配送方式：${has_postage ? '包邮' : '邮费到付'}`})
    }
    if (type == 3) {
      arr.push({img: '/assets/images/tuikuan.png', text: `本商品${can_refund ? '发货前可申请' : '不支持'}退款`})
    } else {
      if (can_refund) {
        if (refund_deadline) {
          arr.push({img: '/assets/images/tuikuan.png', text: `本商品未消费在${refund_deadline}前可退款`})
        } else {
          arr.push({img: '/assets/images/tuikuan.png', text: `本商品未消费可随时退款，逾期未消费自动退款`})
        }
      } else {
        arr.push({img: '/assets/images/tuikuan.png', text: `本商品不支持退款`})
      }
    }
    return arr
  },

  stopPropagation: function () {
    return false
  },

  showShoppingView: function (e) {
    if (!util.checkLogin('navPermission')) {
      return false
    }
    this.setData({
      tuanId: e.detail.saletype == 2 ? 0 : null
    })
    const shoppingView = this.selectComponent('#c-shopping-view')
    if (shoppingView && shoppingView.toggleSession) {
      shoppingView.toggleSession({currentTarget:{dataset:{saletype: e.detail.saletype}}})
    }
  },

  viewAllComment: function () {
    const {id} = this.data
    this.navigateTo({
      url: '/pages/commentlist/commentlist?pid=' + id
    })
  },

  viewLocation: function (e) {
    const {lnglat, address} = e.currentTarget.dataset
    if (lnglat && lnglat[0] && lnglat[1]) {
      wx.openLocation({
        latitude: parseFloat(lnglat[1]),
        longitude: parseFloat(lnglat[0]),
        address: address,
        success: res => {
          console.log('success', res)
        }
      })
    }
  },

  viewBusinessCertification: function () { // 查看商家资质
    this.navigateTo({
      url: '/pages/imagepage/imagepage?image=' + this.data.shop.type_pic_url + '&title=商家资质',
    })
  },

  viewBusiness: function () { // 跳转到商家
    const {id} = this.data.shop
    this.navigateTo({
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
  
  groupTap: function (e) {
    if (!util.checkLogin('navPermission')) {
      return false
    }
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
    const shoppingView = this.selectComponent('#c-shopping-view')
    if (shoppingView && shoppingView.toggleSession) {
      shoppingView.toggleSession({currentTarget: {dataset: {saletype: '2'}}})
    }
  },

  nextTap: function (e) {
    const { saletype, currentSession, currentSubSession, currentTickets, subSessions, selectedTicketLength, totalPrice, totalPriceCal } = e.detail
    const { type, id, tuanId: tuan_id, fromUid, fill_info, fill_form, title, valid_btime, valid_etime, address, session, sale_type, can_refund = false, include_bx, hx_rule, has_postage, shop_id } = this.data
    let dataObj = {type, id, fromUid, fill_info, fill_form, title, address, valid_btime, valid_etime, session, sale_type, saletype, selectedTicketLength: selectedTicketLength[saletype], currentSession: currentSession[saletype], can_refund, include_bx, totalPrice: totalPrice[saletype], totalPriceCal: totalPriceCal[saletype], tuan_id, hx_rule, has_postage, shop_id}
    if (type == 1) { // 活动
      dataObj.currentTickets = currentTickets[saletype]
    } else if (type == 2 || type == 3) { // 非活动
      dataObj.currentSubSession = currentSubSession[saletype]
      dataObj.subSessions = subSessions[saletype]
    }
    let dataJson = JSON.stringify(dataObj)
    storageHelper.setStorage('orderSubmitJson', dataJson)
    this.navigateTo({
      url: '/pages/ordersubmit/ordersubmit'
    })
  },

  initBottomData: function (data) {
    let _obj = {}
    _obj.id = data.id
    _obj.type = data.type
    _obj.sale_type = data.sale_type
    _obj.status = data.status
    _obj.qg_status = data.qg_status
    _obj.is_collect = data.is_collect
    _obj.shop = data.shop
    _obj.show_min_price = data.show_min_price
    _obj.show_min_origin_price = data.show_min_origin_price
    _obj.show_min_pt_price = data.show_min_pt_price
    _obj.show_min_qg_price = data.show_min_qg_price
    const btnTextObj = statusHelper.getBtnText(data.type, data.sale_type, data.status, data.qg_status)
    const statusTipText = statusHelper.getStatusTipText(data.type, data.sale_type, data.status, data.qg_status)
    _obj = Object.assign({}, _obj, btnTextObj, {statusTipText})
    this.setData({bottomButtonData: _obj})
  },

  qgTimeout: function () {
    this.fetchGoods(this.options.id)
  },

  bePartner: function () {
    if (!util.checkLogin('navPermission')) {
      return false
    }
    this.navigateTo({
      url: '/pages/bepartner/bepartner'
    })
  },

  couponChange: function (e) {
    const {coupon} = e.detail
    const {coupon: coupons} = this.data
    if (coupon && coupon.time_desc && coupon.coupon_id) {
      let _obj = {}
      coupons.forEach((item, index) => {
        if (item.id == coupon.coupon_id) {
          _obj[`coupon[${index}].tip`] = coupon.time_desc
        }
      })
      this.setData(_obj)
    }
  }
})