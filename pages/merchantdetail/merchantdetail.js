// pages/merchantdetail/merchantdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '1',
    name: '路途亲子',
    introduce: '路途亲子我们带领孩子探索世界，除了游玩我们选择用更科学的方式，天文、地理、化学、生物、自然，你以为科学只在课堂里吗？',
    rate: 4.5,
    evalution_num: 200,
    type_pic_url: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg',
    bg_pic_url: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg',
    logo_url: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg',
    activitys: [
      {
        id: '1',
        title: '或是对佛撒的发阿善良大方',
        desc: '活动描述',
        tags: [
          { type: 'class', label: '标签1' }
        ],
        cover_url: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg',
        join_num: 200,
        min_price: 49.9,
        price_num: 1,
        status: '1' // 状态：0为失效或已删除 | 1为报名中| 2为已满额未截止| 3为已截止未满额| 4为已截止且满额| 5为已结束
      },
      {
        id: '2',
        title: '或是对佛撒的发阿善良大方',
        desc: '活动描述',
        tags: [
          {type: 'class', label: '标签1'},
          {type: 'location', label: '标签2'},
          {type: 'address', label: '标签3'}
        ],
        cover_url: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg',
        join_num: 30,
        min_price: 99.9,
        price_num: 2,
        status: '1' // 状态：0为失效或已删除 | 1为报名中| 2为已满额未截止| 3为已截止未满额| 4为已截止且满额| 5为已结束
      }
    ],
    activityLoaded: true,
    activityLoading: false,
    activityPage: {
      total: 2,
      total_page: 1,
      is_end: true,
      limit: 10,
      pn: 1
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
  onShareAppMessage: function () {
    
  },

  activityTap: function (e) {
    console.log('activityTap', e)
    const { id } = e.detail
    if (id) {
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?id=' + id
      })
    }
  },

  viewComment: function () {
    console.log('viewComment')
  }
})