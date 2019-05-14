// pages/ordersubmit/ordersubmit.js
import storageHelper from '../../utils/storageHelper'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '1',
    title: '【穿行艺术】城市里的博物馆，外滩历险记(银行一条街)',
    address: '北京市朝阳区 马桥路甲40号二十一世纪大北京市朝阳区马桥路甲40号二十一世纪大一个地址这么长也是够了满两行最后省收到了饭就阿善良分 萨里看到肌肤',
    valid_btime: '01-03 9:00',
    valid_etime: '04-30 17:00',
    currentTickets: [
      { id: '5', stock: 0, name: '票种名称5', price: 0, num: 1 },
      { id: '6', stock: 0, name: '票种名称6', price: 0.55, num: 2 }
    ],
    selectedTicketLength: 0,
    refund: false,
    include_bx: false,
    buy_for: [],
    buy_for_text: '',
    buyfors: [
      {
        id: '1',
        name: '出行人1',
        sex: '1', // 性别：0为未知 | 1为男| 2为女
        id_number: '8327237349249429', // 身份证号
        status: '1', // 0为无效，1为有效
        checked: false
      },
      {
        id: '2',
        name: '出行人2',
        sex: '2', // 性别：0为未知 | 1为男| 2为女
        id_number: '8327237349249429', // 身份证号
        status: '1', // 0为无效，1为有效
        checked: false
      },
      {
        id: '3',
        name: '出行人3',
        sex: '2', // 性别：0为未知 | 1为男| 2为女
        id_number: '', // 身份证号
        status: '1', // 0为无效，1为有效
        checked: false
      }
    ],
    contact: {
      name: '',
      phone: ''
    },
    clauses: [
      { name: '条款1', path: ''},
      { name: '条款2', path: ''}
    ],
    clause_checked: false,
    totalPrice: 0,
    disabled_submit: false,
    submitting: false,
    show_buy_for: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const contactJson = storageHelper.getStorage('orderContact')
    if (contactJson) {
      this.setData({
        contact: JSON.parse(contactJson)
      })
    }
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

  submitOrder: function () {
    console.log('submitOrder')
    const {contact, buy_for, submitting} = this.data
    if (!(contact.name && contact.phone && buy_for && buy_for.length && !submitting)) { // 如果联系人信息不完整、没有选中的出行人、正在提交，则中断操作
      return false
    }
    if (contact.name && contact.phone) {
      let contactJson = JSON.stringify(contact)
      storageHelper.setStorage('orderContact', contactJson)
    }
    // 提交支付信息
    // 模仿
    setTimeout(() => {

    }, 5000)
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
    if (!include_bx) { // 不包含保险
      console.log('include_bx', include_bx)
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
    if (include_bx && !buyfors[idx].id_number) {
      _obj['buyfors[' + idx + '].tip'] = '请填写身份证号'
    } else {
      const checked = buyfors[idx].checked
      _obj['buyfors[' + idx + '].checked'] = !checked
    }
    this.setData(_obj)
  },

  editBuyfor: function (e) {
    const { needidcard, id} = e.currentTarget.dataset // type: 1不需要填写身份证号、2需要填写身份证号
    let url = ''
    if (id) { // 如果传入id，则是之前存在的，属于编辑
      url = '/pages/editcontact/editcontact?id=' + id + (needidcard ? '&requireidcard=true' : '')
    } else { // 属于新增
      url = '/pages/editcontact/editcontact' + (needidcard ? '?requireidcard=true' : '')
    }
    wx.navigateTo({
      url: url
    })
  }
})