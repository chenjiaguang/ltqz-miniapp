// pages/commentmanager/commentmanager.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top_fixed: false,
    everage_score: 4.5,
    total_comment: 4,
    comments: [
      {
        id: '1',
        avatar: 'http://i1.bvimg.com/685753/6f8dd9c1b77d3a79.png',
        username: '洋洋八月',
        score: 5,
        time: '2019-04-29',
        content: '馆内部大，孩子可以自己组装手表，孩子挺感兴趣的，了解了中标的基本概念，不错的体验',
        images: [
          'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg',
          'http://i1.bvimg.com/685753/ae8c8ab12fbad6c3.png',
          'http://i1.bvimg.com/685753/a841c521b0925e81.jpg',
          'http://i1.bvimg.com/685753/6f8dd9c1b77d3a79.png',
          'http://i1.bvimg.com/685753/2712acb6dc8bcd2b.jpg',
          'http://i1.bvimg.com/685753/c5c4046d7878cacb.png',
          'http://i1.bvimg.com/685753/7a8753495b2244b7.jpg',
          'http://i1.bvimg.com/685753/f356705dcb228db3.jpg',
          'http://i1.bvimg.com/685753/c417dc1c13623f36.jpg'
        ],
        goods: {
          id: '1',
          title: '【穿行艺术】城市里的博物馆，外滩历险记（银行一条街）'
        },
        reply: '很有童趣的小总结，我喜欢。'
      },
      {
        id: '2',
        avatar: 'http://i1.bvimg.com/685753/a841c521b0925e81.jpg',
        username: '洋洋九月',
        score: 4,
        time: '2019-04-28',
        content: '啦啦啦啦啦',
        images: [
          'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg',
          'http://i1.bvimg.com/685753/ae8c8ab12fbad6c3.png',
          'http://i1.bvimg.com/685753/a841c521b0925e81.jpg',
          'http://i1.bvimg.com/685753/6f8dd9c1b77d3a79.png',
          'http://i1.bvimg.com/685753/2712acb6dc8bcd2b.jpg',
          'http://i1.bvimg.com/685753/c5c4046d7878cacb.png',
          'http://i1.bvimg.com/685753/7a8753495b2244b7.jpg'
        ],
        goods: {
          id: '1',
          title: '【穿行艺术】城市里的博物馆，外滩历险记（银行一条街）'
        }
      },
      {
        id: '3',
        avatar: 'http://i1.bvimg.com/685753/a841c521b0925e81.jpg',
        username: '洋洋十月',
        score: 5,
        time: '2019-04-27',
        content: '啦啦啦啦啦',
        images: [],
        goods: {
          id: '1',
          title: '【穿行艺术】城市里的博物馆，外滩历险记（银行一条街）'
        },
        reply: '很有童趣的小总结，我喜欢。'
      }
    ],
    current_reply: '',
    reply_focus: false,
    reply_value: '',
    reply_cursor: 0
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

  onPageScroll: function (e) {
    // console.log('onPageScroll', e.scrollTop)
    const { top_fixed} = this.data
    if (e.scrollTop <= 0 && top_fixed) {
      console.log('ddd')
      this.setData({
        top_fixed: false
      })
    } else if (e.scrollTop > 0 && !top_fixed) {
      console.log('eee')
      this.setData({
        top_fixed: true
      })
    }
  },

  scoreChange: function (e) {
    const {score} = e.detail
    console.log('scoreChange', score)
    this.setData({
      everage_score: score
    })
  },

  replyTap: function (e) {
    const {id, username} = e.detail
    console.log('reply', id, username)
    this.setData({
      current_reply: username,
      reply_focus: true
    })
  },

  replyInput: function (e) {
    const { value, cursor } = e.detail
    console.log('replyInput', value, cursor)
    this.setData({
      reply_value: value,
      reply_cursor: cursor
    })
  },

  replyBlur: function () {
    const {reply_focus} = this.data
    if (!reply_focus) {
      return false
    }
    this.setData({
      reply_focus: false
    })
  },

  replySubmit: function () {
    console.log('replySubmit')
  }
})