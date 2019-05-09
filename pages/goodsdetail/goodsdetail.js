// pages/goodsdetail/goodsdetail.js
const WxParse = require('../../utils/wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '1',
    statusText: {
      0: '活动已失效',
      1: '活动报名中',
      2: '活动报名中',
      3: '活动已截止',
      4: '活动已截止',
      5: '活动已结束'
    },
    buttonStatusText: {
      0: '活动失效',
      1: '立即报名',
      2: '报名已满',
      3: '报名截止',
      4: '报名已满',
      5: '报名结束'
    },
    shareProfit: 3.99, // 分享赚shareProfit，如果为0或不存在，则分享按钮为普通样式，否则为分享赚xxx样式
    cover_url: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg',
    title: '【穿行艺术】城市里的博物馆，外滩历险记(银行一条街)',
    desc: '三大保障类别，全方位守护您的财富和家庭全方位守护您的财富和家庭',
    include_bx: false,
    min_price: 49.9,
    price_num: 1,
    status: '1', // 0为失效或已删除|1为报名中|2为已满额未截止|3为已截止未满额|4为已截止且满额|5为已结束
    valid_btime: '01-03 9:00',
    valid_etime: '04-30 17:00',
    dead_line: '01-01 18:00',
    address: {
      text: '北京市朝阳区 马桥路甲40号二十一使广大三个数发',
      lnglat: [116.40, 39.90]
    },
    jh_address: {
      text: '北京市朝阳区 马桥路甲40号二十一使广大三个数发',
      lnglat: [116.40, 39.90]
    },
    min_age: '-1',
    max_age: '60',
    limit_num: '10组开始成团',
    join_num: 23,
    join_users: [
      { id: '1', avatar: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg'},
      { id: '2', avatar: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg'},
      { id: '3', avatar: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg'},
      { id: '4', avatar: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg'},
      { id: '5', avatar: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg'}
    ],
    shop: { // 商家信息
      id: '1',
      type_pic_url: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg',
      logo_url: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg',
      name: '自在游', 
      introduce: '我们带领孩子探索世界，除了游玩我们选择用更科学的方式，天文、地理撒的发顺丰阿舒服 阿舒服',
      huodong_num: 200,
      rate: 4.5
    },
    currentTab: 0,
    content: '<div>我是HTML代码</div>',
    evaluation_num: 1,
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
    contact: '17508959493',
    session: [
      {
        id: "1",
        name: '场次名称1',
        stock: null, // 剩余总库存 NULL为无限制，0为没有该票
        ticket: [
          { id: '1', stock: 0, name: '票种名称1', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '2', stock: null, name: '票种名称2', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
        ]
      },
      {
        id: "2",
        name: '场次名称2',
        stock: 50, // 剩余总库存 NULL为无限制，0为没有该票
        ticket: [
          { id: '3', stock: 0, name: '票种名称3', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '4', stock: null, name: '票种名称4', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
        ]
      },
      {
        id: "3",
        name: '场次名称3',
        stock: 0, // 剩余总库存 NULL为无限制，0为没有该票
        ticket: [
          { id: '5', stock: 0, name: '票种名称5', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '6', stock: 0, name: '票种名称6', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '7', stock: 0, name: '票种名称7', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '8', stock: 0, name: '票种名称8', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '9', stock: 0, name: '票种名称9', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '10', stock: 0, name: '票种名称10', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '11', stock: 0, name: '票种名称11', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '12', stock: 0, name: '票种名称12', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '13', stock: 0, name: '票种名称13', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '14', stock: 0, name: '票种名称14', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
        ]
      },
      {
        id: "4",
        name: '场次名称4',
        stock: 0, // 剩余总库存 NULL为无限制，0为没有该票
        ticket: [
          { id: '15', stock: 0, name: '票种名称15', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
        ]
      }
    ],
    currentTickets: [
      { id: '1', stock: 0, name: '票种名称1', price: 0, num: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
      { id: '2', stock: null, name: '票种名称2', price: 0.55, num: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const article = this.data.content
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    let that = this
    WxParse.wxParse('article', 'html', article, that, 5)
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
    return {
      title: '活动详情页转发',
      path: '/pages/goodsdetail/goodsdetail?id=555&uid=999',
      imageUrl: 'http://i1.bvimg.com/685753/f356705dcb228db3.jpg'
    }
  },

  changeTab: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  call: function (e) {
    const { phone } = e.currentTarget.dataset
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone.toString()
      })
    }
  }
})