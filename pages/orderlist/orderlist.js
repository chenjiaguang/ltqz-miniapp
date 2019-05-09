// pages/orderlist/orderlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      title: '全部',
      list: [],
      page: {},
      loaded: false,
      loading: false
    }, {
      title: '待付款',
      list: [],
      page: {},
      loaded: false,
      loading: false
    }, {
      title: '待参与',
      list: [],
      page: {},
      loaded: false,
      loading: false
    }, {
      title: '待评价',
      list: [],
      page: {},
      loaded: false,
      loading: false
    }],
    list: [{
        state: 0,
        money: '49.9',
        cover: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg',
        title: '从5万到100万，给家庭投资赋 能小天才凯叔滴滴答答叽叽从5万到100万，给家庭投资赋 能小天才凯叔滴滴答答叽叽',
        location: '北京市朝阳区马桥路甲马桥路甲马桥路',
        time: '2019.07.13 至 2020.01.01',
        tickets: '成人票×1，儿童票×2'
      },
      {
        state: 1,
        money: '49.9',
        cover: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg',
        title: '从5万到100万，给家庭投资赋 能小天才凯叔滴滴答答叽叽从5万到100万，给家庭投资赋 能小天才凯叔滴滴答答叽叽',
        location: '北京市朝阳区马桥路甲马桥路甲马桥路',
        time: '2019.07.13 至 2020.01.01',
        tickets: '成人票×1，儿童票×2'
      },
      {
        state: 2,
        money: '49.9',
        cover: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg',
        title: '从5万到100万，给家庭投资赋 能小天才凯叔滴滴答答叽叽从5万到100万，给家庭投资赋 能小天才凯叔滴滴答答叽叽',
        location: '北京市朝阳区马桥路甲马桥路甲马桥路',
        time: '2019.07.13 至 2020.01.01',
        tickets: '成人票×1，儿童票×2'
      },
      {
        state: 3,
        money: '49.9',
        cover: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg',
        title: '从5万到100万，给家庭投资赋 能小天才凯叔滴滴答答叽叽从5万到100万，给家庭投资赋 能小天才凯叔滴滴答答叽叽',
        location: '北京市朝阳区马桥路甲马桥路甲马桥路',
        time: '2019.07.13 至 2020.01.01',
        tickets: '成人票×1，儿童票×2'
      },
      {
        state: 4,
        money: '49.9',
        cover: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg',
        title: '从5万到100万，给家庭投资赋 能小天才凯叔滴滴答答叽叽从5万到100万，给家庭投资赋 能小天才凯叔滴滴答答叽叽',
        location: '北京市朝阳区马桥路甲马桥路甲马桥路',
        time: '2019.07.13 至 2020.01.01',
        tickets: '成人票×1，儿童票×2'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('orderlist_onload_options', options)
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

  }
})