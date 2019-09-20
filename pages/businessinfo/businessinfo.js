// pages/businessinfo/businessinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '商家资料',
    principalInfo: [
      {
        title: '负责人姓名',
        content: '张三'
      },
      {
        title: '负责人联系方式',
        content: '15808937794'
      }
    ],
    settlementInfo: [
      {
        title: '结算周期',
        content: '周结'
      },
      {
        title: '结算方式',
        content: '微信零钱'
      },
      {
        title: '结算账户',
        content: '花心萝卜腿'
      }
    ],
    managerInfo: [
      {
        avatar: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1820523987,3798556096&fm=26&gp=0.jpg',
        nick_name: '葡萄'
      },
      {
        avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3136075639,3338708347&fm=26&gp=0.jpg',
        nick_name: '大宝小岛',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const pages = getCurrentPages()
    const lastPage = pages[pages.length - 2]
    if (lastPage && lastPage.name === 'businessassistant') {
      const data = JSON.parse(JSON.stringify(lastPage.data.data))
      this.handleData(data)
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
  // onShareAppMessage: function () {

  // },

  handleData: function (data) { // remit_cycle:1为活动结束后T+1打款|2为日结|3为周结|4为月结      remit_way:0为微信打款 1线下结算
    const {manager_name, phone, remit_cycle, remit_way, remit_wxid_name, payee, bank_card, bank_name, admin_info} = data
    let _obj = {}
    _obj.principalInfo = [{title: '负责人姓名', content: manager_name}, {title: '负责人联系方式', content: phone}]
    _obj.settlementInfo = []
    const remitCycleText = {1: 'T+1打款', 2: '日结', 3: '周结', 4: '月结'}
    const remitWayText = {0: '微信零钱', 1: '线下结算'}
    _obj.settlementInfo.push({title: '结算周期', content: remitCycleText[remit_cycle]})
    _obj.settlementInfo.push({title: '结算方式', content: remitWayText[remit_way]})
    if (remit_way == 0) { // 微信零钱结算
      _obj.settlementInfo.push({title: '结算账户', content: remit_wxid_name})
    } else {
      _obj.settlementInfo.push({title: '收款人', content: payee})
      _obj.settlementInfo.push({title: '开户行', content: bank_name})
      let bank_card_arr = bank_card.split('')
      bank_card_arr = bank_card_arr.map((item, idx) => {
        let text = idx < bank_card_arr.length - 4 ? 'x' : item
        if (idx % 4 === 0 && idx !== 0) {
          text = ' ' + text
        }
        return text
      })
      _obj.settlementInfo.push({title: '收款银行卡号', content: bank_card_arr.join('')})
    }
    _obj.managerInfo = admin_info
    this.setData(_obj)
  }
})