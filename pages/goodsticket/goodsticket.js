// pages/goodsticket/goodsticket.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    huodong: {
      title: '【穿行艺术】城市里的博物馆，外滩历险记（银行一条街）',
      valid_btime: '2019-07-13',
      valid_etime: '2020-01-01',
      address: '北京市朝阳区 马桥路甲40号二十一世纪大北京市朝阳区 马桥路甲40号二十一世纪大'
    },
    hexiao_status_text: { // -1为失效订单|0为待付款|1为待参与|2为待评价|3已评价(当status为2或3时视为已核销)
      '-1': '未核销',
      0: '未核销',
      1: '未核销',
      2: '已核销',
      3: '已核销'
    },
    ticket: [
      {name: 'piao1', quantity: 2},
      {name: 'piao2', quantity: 1}
    ],
    ticked_num_text: '',
    qr_code_url: 'http://i1.bvimg.com/685753/bab59bb9490c8494.jpg',
    status: '1',
    checked_time: '',
    hexiao_staff: '',
    submitting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initTicketNumText(this.data.ticket)
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

  confirmCode: function (e) {
    console.log('confirmCode', e)
    let { value, ctx} = e.detail
    this.setData({
      submitting: true
    })
    setTimeout(() => {
      this.setData({
        submitting: false
      })
      ctx.close()
    }, 5000)
  },
  goComment: function () { // 跳转去评价页面
    console.log('goComment')
  },
  initTicketNumText: function (tickets) {
    let text = ''
    if (tickets && tickets[0]) {
      tickets.forEach((item, idx) => {
        text += (idx === 0 ? (item.name + 'x' + item.quantity) : ('，' + item.name + 'x' + item.quantity))
      })
    }
    this.setData({
      ticked_num_text: text
    })
  }
})