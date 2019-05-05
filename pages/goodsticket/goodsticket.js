// pages/goodsticket/goodsticket.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hexiao_status_text: {
      1: '未核销',
      2: '已核销'
    },
    qrcode: 'http://i1.bvimg.com/685753/bab59bb9490c8494.jpg',
    deadline: '2020-04-25',
    hexiao_status: '1', // 1表示未核销、2表示已核销
    hexiao_time: '',
    hexiao_staff: '',
    out_of_time: false, // 是否过期
    commented: false, // 是否已评价
    name: '【穿行艺术】城市里的博物馆，外滩历险记（银行一条街）',
    location: {
      text: '北京市朝阳区 马桥路甲40号二十一世纪大北京市朝阳区 马桥路甲40号二十一世纪大',
      lnglat: ['116.40', '39.90']
    },
    start_time: '2019-07-13',
    end_time: '2020-01-01',
    submitting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  }
})