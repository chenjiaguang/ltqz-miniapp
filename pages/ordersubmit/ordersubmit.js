// pages/ordersubmit/ordersubmit.js
import util from '../../utils/util.js'
import storageHelper from '../../utils/storageHelper'

Page({
  name: 'ordersubmit',
  /**
   * 页面的初始数据
   */
  data: {
    shippingInfo: {},
    coupons: [],
    couponSelected: [],
    couponPrice: 0,
    couponShowPrice: 0,
    recommendCoupon: 0,
    genderArray: ['男', '女'],
    genderIdx: 0,
    inputType: {
      phone: 'number',
      id_number: 'idcard'
    },
    navTitle: '提交订单',
    id: '', // 商品id
    fromUid: '', // 分销员id（分享出去的人的id）
    orderId: '', // 提交订单后生成的订单id
    title: '',
    address: '',
    valid_btime: '',
    valid_etime: '',
    session: [],
    currentSession: null,
    currentSubSession: null,
    currentTickets: [],
    subSessions: [],
    selectedTickets: [],
    selectedSessions: [],
    selectedTicketLength: 0,
    can_refund: false,
    include_bx: false, // 不包含保险：0，包含保险：1
    buy_for: [],
    buy_for_text: '',
    buyfors: [],
    contact: [],
    clauses: [
      { name: '用户须知', path: '/pages/statement/statement?type=1'},
      { name: '平台免责声明', path: '/pages/statement/statement?type=2'}
    ],
    clause_checked: true,
    totalPrice: 0,
    disabled_submit: false,
    submitting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = storageHelper.getStorage('orderSubmitJson') ? JSON.parse(storageHelper.getStorage('orderSubmitJson')) : {}
    const contactJson = storageHelper.getStorage('orderContact')
    if (contactJson) {
      let contactObj = JSON.parse(contactJson) || {}
      let shouldFill = this.getFillForm(data.fill_form)
      shouldFill.forEach(item => {
        for (let key in contactObj) {
          if ((key === '姓名' || key === '手机') && item.name === key && contactObj[key]) { // 只有手机和姓名使用上次使用的字段，其他不设置
            item.value = contactObj[key]
          }
        }
      })
      data.contact = shouldFill
    }
    if (data.type == 1) { // 活动，已购买的票
      data.selectedTickets = data.currentTickets.filter(item => item.num > 0)
    } else if (data.type == 2 || data.type == 3) { // 非活动，已购买的商品
      data.selectedSessions = [data.session[data.currentSession]]
      data.selectedSessions.forEach(item => {
        item.num = data.selectedTicketLength
        if (data.subSessions && data.subSessions.length) {
          const sub = data.subSessions.filter(item => item.num > 0)[0]
          item.subName = sub.name
          item.subId = sub.id
        }
      })
    }
    this.setData(data)
    this.initShippingInfo()
    this.fetchCoupon(data.totalPriceCal)
    this.fetchBuyfors() // 获取常用联系人
    this.getHalfScreenHeight() // 获取半屏幕高度，用于联系人选择 和 优惠券选择
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

  },

  stopPropagation: function () {
    return false
  },

  getFillForm: function (form) {
    let fillForm = []
    if (form && form.key) {
      for( let key in form.key) {
        fillForm.push({name: key, label: key, value: '', type: form.key[key]})
      }
    }
    return fillForm
  },

  fetchBuyfors: function () {
    util.request('/traveler/list').then(res => {
      if (res.error == 0 && res.data) {
        this.setData({
          buyfors: res.data
        })
      }
    })
  },

  editBack: function (editBuyfor) {
    let {buyfors, include_bx} = this.data
    const id = editBuyfor.id
    let hasBuyfor = false
    let index = null
    buyfors.forEach((item, idx) => {
      if (item.id == id) {
        hasBuyfor = true
        index = idx
      }
    })
    if (hasBuyfor && index !== null) {
      buyfors[index] = editBuyfor
      
    } else {
      buyfors = [editBuyfor].concat(buyfors)
      index = 0
    }
    this.setData({
      buyfors: buyfors
    }, () => {
      if ((include_bx && editBuyfor.id_number) || !include_bx) {
        const event = {currentTarget: {dataset: {idx: index}}}
        this.toggleBuyforChecked(event)
      }
    })
  },

  // updateBuyfors: function (id) {
  //   util.request('/traveler/list').then(res => {
  //     if (res.error == 0 && res.data) {
  //       let _buyfors = res.data
  //       let {buyfors} = this.data
  //       let checkedIds = buyfors.filter(item => item.checked).map(item => item.id)
  //       _buyfors.forEach(item => {
  //         if (checkedIds.indexOf(item.id) !== -1 || item.id === id) { // 原data中已选中 或 是当前的id
  //           item.checked = true
  //         }
  //       })
  //       this.setData({
  //         buyfors: _buyfors
  //       })
  //     }
  //   })
  // },

  getBuyforFromData: function (id) {
    const {buyfors} = this.data
    const buyfor = buyfors.filter(item => item.id == id)[0]
    return buyfor ? JSON.parse(JSON.stringify(buyfor)) : null
  },

  genderChange: function (e) {
    let _obj = {}
    _obj.genderIdx = e.detail.value
    _obj['contact[' + e.currentTarget.dataset.idx + '].value'] = this.data.genderArray[e.detail.value]
    this.setData(_obj)
  },
  pay: function (id, paydata) {
    const { timeStamp, nonceStr, signType, paySign } = paydata
    wx.requestPayment({
      timeStamp,
      nonceStr,
      package: paydata.package,
      signType,
      paySign,
      success: res => {
        util.request('/order/pay_result', {id}).then(res => {
          if (res.error == 0) { // 查询结果为已支付
            wx.redirectTo({
              url: '/pages/paysuccess/paysuccess?id=' + id,
            })
          } else {
            wx.redirectTo({
              url: '/pages/paysuccess/paysuccess?id=' + id,
            })
            if (res.msg) {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          }
        }).catch(err => {

        })
      },
      fail: res => {
        const app = getApp()
        const confirmColor = app.globalData.themeModalConfirmColor || '#576B95' // #576B95是官方颜色
        wx.showModal({
          title: '确定要取消支付吗？',
          content: '您的订单在30分钟内未支付将被取消，请尽快完成支付哦~',
          confirmText: '继续支付',
          confirmColor,
          success: res => {
            if (res.confirm) {
              this.pay(id, paydata)
            } else {
              wx.redirectTo({
                url: '/pages/orderdetail/orderdetail?id=' + id,
              })
            }
          },
          fail: res => {
            wx.redirectTo({
              url: '/pages/orderdetail/orderdetail?id=' + id,
            })
          }
        })
      }
    })
  },

  submitOrder: function (e) {
    const { type, id, fromUid, fill_info, fill_form, selectedTickets, selectedSessions, contact, buy_for, submitting, clause_checked, saletype, tuan_id, totalPrice, shippingInfo: { provinceName, cityName, countyName, detailInfo, telNumber, userName}} = this.data
    const {formId} = e.detail
    console.log('formId', formId)
    const contactEmptyItem = contact.filter(item => !item.value)

    if (fill_info && (!buy_for || (buy_for && !buy_for.length))) { // 联系人信息不完整
      wx.showToast({
        title: '请选择出行人',
        icon: 'none'
      })
      return false
    } else if (contactEmptyItem && contactEmptyItem.length) { // 需要填写出行人信息 且 没有选中的出行人
      wx.showToast({
        title: contactEmptyItem[0].type == 'gender' ? '请选择性别' : ('请填写' + contactEmptyItem[0].label),
        icon: 'none'
      })
      return false
    } else if (type == 3 && !(provinceName && cityName && countyName && detailInfo && telNumber && userName)) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return false
    } else if (!clause_checked) { // 未同意条款
      wx.showToast({
        title: '请勾选同意重要条款',
        icon: 'none'
      })
      return false
    } else if (submitting) { // 正在提交
      return false
    }
    // 保存、生成提交联系人信息
    let form = {}
    const contactJson = storageHelper.getStorage('orderContact')
    let _obj = contactJson ? JSON.parse(contactJson): {}
    contact.forEach(item => {
      if (item.value) {
        form[item.name] = item.value
        _obj[item.name] = item.value
      }
    })
    storageHelper.setStorage('orderContact', JSON.stringify(_obj))
    // 提交支付信息
    let ticket = null
    if (type == 1) { // 活动
      ticket = selectedTickets.map(item => {
        return {id: item.id, quantity: item.num}
      })
    } else if (type == 2 || type == 3) { // 非活动
      ticket = {}
      let selected = selectedSessions[0]
      ticket.id = type == 3 ? (selected.subId || selected.id) : selected.id
      ticket.quantity = selected.num
      ticket.style_id = selected.subId
    }
    let contact_info = null
    if (provinceName && cityName && countyName && detailInfo && telNumber && userName) { // 收货地址信息
      contact_info = {}
      contact_info.who = userName
      contact_info.phone = telNumber
      contact_info.address = provinceName + cityName + countyName + detailInfo
    }
    let buy_for_ids = buy_for.map(item => item.id)
    const tuanid = saletype == 2 ? (tuan_id || 0) : null

    let rData = {
      id: id,
      ticket: ticket,
      traveler_ids: buy_for_ids,
      fenxiao_user_id: fromUid,
      tuan_id: tuanid,
      total_price: totalPrice,
      form_id: formId,
      form: form,
      contact: contact_info
    }
    this.setData({
      submitting: true
    })
    util.request('/order/commit', rData).then(res => {
      if (res.error == 0 && res.data) { // 提交订单成功
        this.updatePrePageData() // 提交订单成功则刷新页面
        this.setData({
          orderId: res.data.id
        })
        if (res.data.pay) {
          this.pay(res.data.id, res.data.pay)
        } else {
          wx.redirectTo({
            url: '/pages/paysuccess/paysuccess?id=' + res.data.id,
          })
        }
      }
    }).catch(err => {

    }).finally(res => {
      this.setData({
        submitting: false
      })
    })
  },

  updatePrePageData: function () {
    const {id} = this.data
    const pages = getCurrentPages()
    const prePage = pages[pages.length - 2]
    if (prePage && prePage.name === 'goodsdetail') { // 上个页面是订单详情页，更新订单详情页的信息
      if (prePage.fetchGoods) {
        prePage.fetchGoods(id)
      }
      if (prePage.fetchComment) {
        prePage.fetchComment(id)
      }
    }
  },

  getHalfScreenHeight: function () {
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    const halfHeight = systemInfo.windowHeight / 2
    const isIos = systemInfo.system.indexOf('iOS') !== -1
    const higher = systemInfo.screenHeight > 736
    let extraBottom = false
    if (isIos && higher) {
      extraBottom = true
    }
    const wrapperHeight = parseInt(halfHeight - (88 + 80 + 16 + (extraBottom ? 68 : 0)) * rpx)
    this.setData({
      halfScreenHeight: halfHeight + 'px'
    })
  },

  changeClause: function () {
    const { clause_checked} = this.data
    this.setData({
      clause_checked: !clause_checked
    })
  },

  contactInput: function (e) {
    const {value} = e.detail
    const {idx} = e.currentTarget.dataset
    let _obj = {}
    _obj['contact[' + idx + '].value'] = value
    this.setData(_obj)
  },

  toggleBuyfor: function (e) {
    if (e && e.currentTarget.dataset.compute) {
      const { buy_for, buyfors } = this.data
      let _buyfors = [].concat(buyfors)
      let _obj = {}
      let ids = buy_for.map(item => item.id)
      if (_buyfors && _buyfors.length) {
        _buyfors.forEach(item => {
          item.checked = ids.indexOf(item.id) !== -1
        })
      }
      _obj.buyfors = _buyfors
      this.setData(_obj)
    }
    const ftModal = this.selectComponent('#c-ft-modal')
    ftModal && ftModal.toggle && ftModal.toggle()
  },

  cancelChangeBuyfor: function () {
    this.toggleBuyfor()
  },

  confirmChangeBuyfor: function () {
    const {buyfors, include_bx} = this.data
    let bfs = buyfors.filter(item => item.checked)
    let _obj = {}
    if (!include_bx) { // 不包含保险
      let text = ''
      bfs.forEach((item, idx) => {
        text += (idx === 0) ? item.name : ('，' + item.name)
      })
      _obj.buy_for_text = text
    }
    _obj.buy_for = bfs
    this.setData(_obj, () => {
      this.toggleBuyfor()
    })
  },

  toggleBuyforChecked: function (e) {
    let {idx} = e.currentTarget.dataset
    let { buyfors, include_bx} = this.data
    let _obj = {}
    if (include_bx && !buyfors[idx].id_number) {
      _obj['buyfors[' + idx + '].tip'] = '请填写身份证号'
      const event = {currentTarget: {dataset: {buyfor: buyfors[idx], needidcard: true}}}
      this.editBuyfor(event)
    } else {
      const checked = buyfors[idx].checked
      _obj['buyfors[' + idx + '].checked'] = !checked
    }
    this.setData(_obj)
  },

  editBuyfor: function (e) {
    const { needidcard, buyfor} = e.currentTarget.dataset // type: 1不需要填写身份证号、2需要填写身份证号
    let url = ''
    if (buyfor && buyfor.id) { // 如果传入id，则是之前存在的，属于编辑
      const { id, name, sex, id_number } = buyfor
      const dataArr = ['id=' + id, 'name=' + name, 'sex=' + sex]
      if (id_number) {
        dataArr.push('id_number=' + id_number)
      }
      if (needidcard) {
        dataArr.push('requireidcard=true')
      }
      const paramsStr = dataArr.join('&')
      url = '/pages/editcontact/editcontact?' + paramsStr
    } else { // 属于新增
      url = '/pages/editcontact/editcontact' + (needidcard ? '?requireidcard=true' : '')
    }
    wx.navigateTo({
      url: url
    })
  },

  clauseTap: function (e) {
    let {ele} = e.currentTarget.dataset
    if (ele.path) {
      wx.navigateTo({
        url: ele.path
      })
    }
  },

  fetchCoupon: function (totalPriceCal) {
    setTimeout(() => {
      const coupons = [
        {
          id: '1',
          price: 50,
          show_price: 0.50,
          threshold: 0,
          threshold_text: '无金额门槛',
          title: '此处为优惠券名称此处为优 惠券名称',
          tip: '2019-08-13 至 2019-08-20',
          selected: true
        },
        {
          id: '2',
          price: 20,
          show_price: 0.20,
          threshold: 0,
          threshold_text: '无金额门槛',
          title: '此处为优惠券名称此处',
          tip: '2019-08-13 至 2019-08-20',
          selected: false
        },
        {
          id: '3',
          price: 20000,
          show_price: 200,
          threshold: 0,
          threshold_text: '无金额门槛',
          title: '此处为优惠券名称此处为优 惠券名称',
          tip: '自领取之日起X天内有效',
          selected: false
        },
        {
          id: '4',
          price: 2000,
          show_price: 20,
          threshold: 10000,
          threshold_text: '满100可用',
          title: '此处为优惠券名称此处为优 惠券名称',
          tip: '在2019-08-20前可用',
          selected: false
        },
        {
          id: '5',
          price: 200,
          show_price: 2,
          threshold: 0,
          threshold_text: '无金额门槛',
          title: '此处为优惠券名称此处为优 惠券名称',
          tip: '2019-08-13 至 2019-08-20',
          selected: false
        }
      ]
      this.initCoupon(coupons, totalPriceCal)
    }, 1000)
  },

  initCoupon: function (coupons, totalPriceCal) {
    if (!coupons || !coupons.length || !totalPriceCal) { // 没有优惠券
      return false
    }
    let _coupons = []
    let _couponSelected = []
    let _couponPrice = 0
    let _couponShowPrice = 0
    let _recommendCoupon = 0
    coupons = coupons.forEach(item => {
      item.disabled = (item.threshold > totalPriceCal) || (totalPriceCal < item.price)
      if (!item.disabled) {
        _coupons.push(item)
        if (item.price > _couponPrice) {
          _couponSelected = [_coupons.length - 1]
          _couponPrice = util.formatMoney(item.price).money
          _couponShowPrice = util.formatMoney(item.price).showMoney
          _recommendCoupon = _coupons.length - 1
        }
      }
    })
    let _totalPrice = util.formatMoney(totalPriceCal - _couponPrice).showMoney
    this.setData({
      coupons: _coupons,
      couponSelected: _couponSelected,
      couponPrice: _couponPrice,
      couponShowPrice: _couponShowPrice,
      totalPrice: _totalPrice,
      recommendCoupon: _recommendCoupon
    })
  },

  toggleCoupon: function (e) {
    if (e && e.currentTarget.dataset.compute) {
      const { coupons, couponSelected } = this.data
      let _coupons = [].concat(coupons)
      let _obj = {}
      if (_coupons && _coupons.length) {
        _coupons.forEach((item, idx) => {
          item.selected = couponSelected.indexOf(idx) !== -1
        })
      }
      _obj.coupons = _coupons
      this.setData(_obj)
    }
    const ftModal = this.selectComponent('#c-ft-modal-coupon')
    ftModal && ftModal.toggle && ftModal.toggle()
  },

  confirmCoupon: function () {
    const {coupons, totalPriceCal} = this.data
    let _obj = {}
    let selectedArr = []
    let price = 0
    coupons.forEach((item, idx) => {
      if (item.selected) {
        selectedArr.push(idx)
        price += item.price
      }
    })
    _obj.couponSelected = selectedArr
    _obj.couponPrice = util.formatMoney(price).money
    _obj.couponShowPrice = util.formatMoney(price).showMoney
    _obj.totalPrice = util.formatMoney(totalPriceCal - price).showMoney
    this.setData(_obj, () => {
      this.toggleCoupon()
    })
  },

  couponTap: function (e) {
    let {coupons} = this.data
    const {idx} = e.currentTarget.dataset
    const isSelected = coupons[idx].selected
    coupons.forEach((item, cidx) => {
      item.selected = cidx === idx ? (!isSelected) : false
    })
    this.setData({coupons})
  },

  initShippingInfo: function (e) {
    const shippingInfoJson = storageHelper.getStorage('shippingInfoJson')
    if (shippingInfoJson) {
      const shippingInfo = JSON.parse(shippingInfoJson)
      this.setData({
        shippingInfo
      })
    }
  },

  getShippingInfo: function (e) {
    const authSuccess = () => {
      wx.chooseAddress({
        success: res => {
          const {cityName, countyName, detailInfo, nationalCode, postalCode, provinceName, telNumber, userName} = res
          if (provinceName && cityName && countyName && detailInfo && telNumber && userName) {
            const shippingInfoJson = JSON.stringify(res)
            storageHelper.setStorage('shippingInfoJson', shippingInfoJson)
            this.setData({
              shippingInfo: res
            })
          }
        }
      })
    }
    const app = getApp()
    const confirmColor = app.globalData.themeModalConfirmColor || '#576B95' // #576B95是官方颜色
    wx.getSetting({
      success: res => {
        // 如果没有则获取授权
        if (!res.authSetting['scope.address'] && res.authSetting['scope.address'] !== false) { // 未授权 且 未拒绝过
          wx.authorize({
            scope: 'scope.address',
            success: () => {
              authSuccess()
            }
          })
        } else if (!res.authSetting['scope.address'] && res.authSetting['scope.address'] === false) { // 未授权且拒绝过
          wx.showModal({
            content: '获取收货地址需要你授权，请授权收货地址', //提示的内容
            showCancel: true,
            confirmText: '去授权',
            confirmColor,
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: res => {
                    const authSetting = res.authSetting
                    if (authSetting['scope.address']) {
                      authSuccess()
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.address']) { // 有则直接保存
          authSuccess()
        }
      }
    })
  }
})