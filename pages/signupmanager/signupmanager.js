// pages/signupmanager/signupmanager.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usernum: 20,
    moneysum: 20000,
    list: [{
      avatar: 'http://i1.bvimg.com/685753/2712acb6dc8bcd2b.jpg',
      username: '花心萝卜腿',
      content: '成人票×1，儿童票×2，共计￥500.36',
      state: '0',
      phone: '13333333333'
    }, {
      avatar: 'http://i1.bvimg.com/685753/2712acb6dc8bcd2b.jpg',
      username: '花心萝卜腿',
      content: '成人票×1，儿童票×2，共计￥500.36',
      state: '1',
      phone: '13333333333'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  callPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  goDetail() {
    wx.navigateTo({
      url: '/pages/goodsdetail/goodsdetail'
    })
  }
})