// pages/goodslist/goodslist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [
      { path: '/pages/goodsdetail/goodsdetail?id=1', image: 'http://i1.bvimg.com/685753/f356705dcb228db3.jpg' }
    ],
    activitys: [
      {
        id: '1',
        image: 'http://i1.bvimg.com/685753/2712acb6dc8bcd2b.jpg',
        status: '1',
        title: '活动标活动标题活动标题活动标题活动标题活动标题活动标题活动标题活动标题活动标题活动标题活动标题活动标题活动标题题',
        intro: '活动介绍',
        tags: [ // 活动标签
          { name: '标签名称1', type: '1', icon: '' },
          { name: '地址', type: '2', icon: 'location' },
          { name: '标签名称3', type: '3' },
          { name: '标签名称4', type: '1' },
          { name: '标签名称5', type: '2' }
        ],
        price: 0.05,
        originPrice: 0.5,
        enter: 100
      },
      {
        id: '2',
        image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg',
        status: '2',
        title: '活动标题2',
        intro: '活动介绍2',
        tags: [ // 活动标签
          { name: '标签名称6', type: '1' },
          { name: '标签名称7', type: '2' },
          { name: '标签名称8', type: '3' },
          { name: '标签名称9', type: '1' },
          { name: '标签名称10', type: '3' }
        ],
        price: 0,
        originPrice: 100,
        enter: 0
      },
      {
        id: '2',
        image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg',
        status: '2',
        title: '活动标题2',
        intro: '活动介绍2',
        tags: [ // 活动标签
          { name: '标签名称6', type: '1' },
          { name: '标签名称7', type: '2' },
          { name: '标签名称8', type: '3' },
          { name: '标签名称9', type: '1' },
          { name: '标签名称10', type: '3' }
        ],
        price: 0,
        originPrice: 100,
        enter: 0
      },
      {
        id: '2',
        image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg',
        status: '2',
        title: '活动标题2',
        intro: '活动介绍2',
        tags: [ // 活动标签
          { name: '标签名称6', type: '1' },
          { name: '标签名称7', type: '2' },
          { name: '标签名称8', type: '3' },
          { name: '标签名称9', type: '1' },
          { name: '标签名称10', type: '3' }
        ],
        price: 0,
        originPrice: 100,
        enter: 0
      },
      {
        id: '2',
        image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg',
        status: '2',
        title: '活动标题2',
        intro: '活动介绍2',
        tags: [ // 活动标签
          { name: '标签名称6', type: '1' },
          { name: '标签名称7', type: '2' },
          { name: '标签名称8', type: '3' },
          { name: '标签名称9', type: '1' },
          { name: '标签名称10', type: '3' }
        ],
        price: 0,
        originPrice: 100,
        enter: 0
      },

      {
        id: '2',
        image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg',
        status: '2',
        title: '活动标题2',
        intro: '活动介绍2',
        tags: [ // 活动标签
          { name: '标签名称6', type: '1' },
          { name: '标签名称7', type: '2' },
          { name: '标签名称8', type: '3' },
          { name: '标签名称9', type: '1' },
          { name: '标签名称10', type: '3' }
        ],
        price: 0,
        originPrice: 100,
        enter: 0
      }
    ],
    activityLoaded: true,
    activityLoading: false,
    activityPage: { pn: 1, is_end: true }
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

  bannerTap: function (e) {
    console.log('bannerTap', e)
    const { item } = e.detail
    if (item && item.path) {
      wx.navigateTo({
        url: item.path
      })
    }
  },

  activityTap: function (e) {
    console.log('activityTap', e)
    const { id } = e.detail
    if (id) {
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?id=' + id
      })
    }
  }
})