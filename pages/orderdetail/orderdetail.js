// pages/orderdetail/orderdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: {
      username: '陈加尧',
      phone: '17508959493'
    },
    goods_info: {
      name: '【穿行艺术】城市里的博物馆，外滩历险记（银行一条街）',
      location: {
        text: '北京市朝阳区 马桥路甲40号二十一世纪大北京市朝阳区 马桥路甲40号二十一世纪大',
        lnglat: ['116.40', '39.90']
      },
      start_time: '2019-07-13',
      end_time: '2020-01-01',
      amount: 1,
      actual_price: 5980
    },
    order_info: {
      order_number: '110568508545687',
      order_time: '2019-04-29 14:36'
    }
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
  onShareAppMessage: function (e) {
    
  }
})