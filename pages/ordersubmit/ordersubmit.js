// pages/ordersubmit/ordersubmit.js
import util from '../../utils/util.js'
import storageHelper from '../../utils/storageHelper'

Page({
  name: 'ordersubmit',
  /**
   * 页面的初始数据
   */
  data: {
    id: '', // 商品id
    fromUid: '', // 分销员id（分享出去的人的id）
    orderId: '', // 提交订单后生成的订单id
    title: '',
    address: '',
    valid_btime: '',
    valid_etime: '',
    session: [],
    currentSession: null,
    currentTickets: [],
    selectedTickets: [],
    selectedTicketLength: 0,
    refund: false,
    include_bx: '', // 不包含保险：0，包含保险：1
    buy_for: [],
    buy_for_text: '',
    buyfors: [],
    contact: {
      name: '',
      phone: ''
    },
    clauses: [
      { name: '用户须知', path: '/pages/statement/statement?type=1'},
      { name: '平台免责声明', path: '/pages/statement/statement?type=2'}
    ],
    clause_checked: true,
    totalPrice: 0,
    disabled_submit: false,
    submitting: false,
    show_buy_for: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = storageHelper.getStorage('orderSubmitJson') ? JSON.parse(storageHelper.getStorage('orderSubmitJson')) : {}
    const contactJson = storageHelper.getStorage('orderContact')
    if (contactJson) {
      data.contact = JSON.parse(contactJson)
    }
    data.selectedTickets = data.currentTickets.filter(item => item.num > 0)
    this.setData(data)
    this.fetchBuyfors() // 获取常用联系人
    this.setBuyforsWrapperHeight() // 设置选择联系人弹窗高度为扳平高度
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

  fetchBuyfors: function () {
    util.request('/traveler/list').then(res => {
      console.log('fetchBuyfors', res)
      if (res.error == 0 && res.data) {
        this.setData({
          buyfors: res.data
        })
      }
    })
  },

  updateBuyfors: function (id) {
    util.request('/traveler/list').then(res => {
      console.log('updateBuyfors', res)
      if (res.error == 0 && res.data) {
        let _buyfors = res.data
        let {buyfors} = this.data
        let checkedIds = buyfors.filter(item => item.checked).map(item => item.id)
        _buyfors.forEach(item => {
          if (checkedIds.indexOf(item.id) !== -1 || item.id === id) { // 原data中已选中 或 是当前的id
            item.checked = true
          }
        })
        this.setData({
          buyfors: _buyfors
        })
      }
    })
  },

  getBuyforFromData: function (id) {
    const {buyfors} = this.data
    const buyfor = buyfors.filter(item => item.id == id)[0]
    return buyfor ? JSON.parse(JSON.stringify(buyfor)) : null
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
            console.log('success')
            if (res.confirm) {
              console.log('confirm')
              this.pay(id, paydata)
            } else {
              console.log('cancel')
              wx.redirectTo({
                url: '/pages/orderdetail/orderdetail?id=' + id,
              })
            }
          },
          fail: res => {
            console.log('fail')
            wx.redirectTo({
              url: '/pages/orderdetail/orderdetail?id=' + id,
            })
          }
        })
      }
    })
  },

  submitOrder: function () {
    console.log('submitOrder')
    const { id, fromUid, selectedTickets, contact, buy_for, submitting, clause_checked, saletype, tuan_id, totalPrice} = this.data
    if (!(contact.name && contact.phone && buy_for && buy_for.length && !submitting && clause_checked)) { // 如果联系人信息不完整、没有选中的出行人、正在提交，则中断操作
      if (!contact.name) {
        wx.showToast({
          title: '填写联系人姓名',
          icon: 'none'
        })
      } else if (!contact.phone) {
        wx.showToast({
          title: '填写联系人手机号',
          icon: 'none'
        })
      } else if (!buy_for || !buy_for.length) {
        wx.showToast({
          title: '选择出行人',
          icon: 'none'
        })
      } else if (!clause_checked) {
        wx.showToast({
          title: '请勾选同意重要条款',
          icon: 'none'
        })
      }
      return false
    }
    // 保存联系人信息
    let contactJson = JSON.stringify(contact)
    storageHelper.setStorage('orderContact', contactJson)
    // 提交支付信息
    let ticket = selectedTickets.map(item => {
      return {id: item.id, quantity: item.num}
    })
    let buy_for_ids = buy_for.map(item => item.id)
    const tuanid = saletype == 1 ? null : (tuan_id || 0)
    let rData = {
      huodong_id: id,
      ticket: ticket,
      traveler_ids: buy_for_ids,
      name: contact.name,
      phone: contact.phone,
      fenxiao_user_id: fromUid,
      tuan_id: tuanid,
      total_price: totalPrice
    }
    this.setData({
      submitting: true
    })
    util.request('/order/commit', rData).then(res => {
      console.log('/order/commit', res)
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

  setBuyforsWrapperHeight: function () {
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
      buyforsWrapperHeight: wrapperHeight + 'px'
    })
  },

  changeClause: function () {
    console.log('changeClause')
    const { clause_checked} = this.data
    this.setData({
      clause_checked: !clause_checked
    })
  },

  contactInput: function (e) {
    const {value} = e.detail
    const {ele} = e.currentTarget.dataset
    let _obj = {}
    _obj['contact.' + ele] = value
    this.setData(_obj)
  },

  toggleBuyfor: function () {
    const { show_buy_for, buy_for, buyfors } = this.data
    let _buyfors = [].concat(buyfors)
    let _obj = {}
    if (!show_buy_for) {
      let ids = buy_for.map(item => item.id)
      if (_buyfors && _buyfors.length) {
        _buyfors.forEach(item => {
          item.checked = ids.indexOf(item.id) !== -1
        })
      }
      _obj.buyfors = _buyfors
    }
    _obj.show_buy_for = !show_buy_for
    this.setData(_obj)
  },

  cancelChangeBuyfor: function () {
    console.log('cancelChangeBuyfor')
    this.toggleBuyfor()
  },

  confirmChangeBuyfor: function () {
    console.log('confirmChangeBuyfor')
    const {buyfors, include_bx} = this.data
    let bfs = buyfors.filter(item => item.checked)
    let _obj = {}
    if (include_bx === '0' || include_bx === 0) { // 不包含保险
      let text = ''
      bfs.forEach((item, idx) => {
        text += (idx === 0) ? item.name : ('，' + item.name)
      })
      _obj.buy_for_text = text
    }
    _obj.buy_for = bfs
    console.log('_obj', _obj)
    this.setData(_obj, () => {
      this.toggleBuyfor()
    })
  },

  toggleBuyforChecked: function (e) {
    let {idx} = e.currentTarget.dataset
    let { buyfors, include_bx} = this.data
    let _obj = {}
    if ((include_bx === '1' || include_bx === 0) && !buyfors[idx].id_number) {
      _obj['buyfors[' + idx + '].tip'] = '请填写身份证号'
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
  }
})