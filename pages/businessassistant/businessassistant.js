// pages/businessassistant/businessassistant.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: 'http://i1.bvimg.com/685753/2712acb6dc8bcd2b.jpg',
    name: '路途亲子',
    intro: '路途亲子我们带领孩子探索世界，除了游玩我们选择用更科学的方式，天文、地理、化学、生物、自然，你以为科学只在课堂里吗？',
    profit: 899.99,
    activity_amount: 2,
    hexiao_code: 9909,
    hexiao_entrance: {
      title: '商家核销码：',
      path: '/pages/hexiaosetting/hexiaosetting'
    },
    other_entrances: [{
        title: '活动管理',
        path: '/pages/activitymanager/activitymanager'
      },
      {
        title: '评价管理',
        path: '/pages/commentmanager/commentmanager'
      }
    ]
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

  scanHexiaoCode: function() {
    if (false) {
      wx.showToast({
        title: '您没有扫码核销权限哦~',
        icon: 'none'
      })
    } else {
      wx.scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode'],
        success: e => {
          console.log('scanHexiaoCode', e)
        },
        fail: e => {
          console.log('fail', e)
        }
      })
    }
  },

  entranceTap: function(e) {
    console.log('entranceTap', e)
    const {
      path,
      phone
    } = e.detail
    if (path) {
      wx.navigateTo({
        url: path
      })
    }
  }
})