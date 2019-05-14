// pages/goodsdetail/goodsdetail.js
const WxParse = require('../../utils/wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAvatar: 'http://testdimg.lutu.com/img/5f/e7/a8/d1/5fe7a8d12859397c26adcba0a4f4044a.jpg',
    lutuLogo: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=232958732,1443508848&fm=26&gp=0.jpg',
    goodsCodeUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557846509166&di=cb779e8e0db9220b8547916ae9032350&imgtype=0&src=http%3A%2F%2Fstatic-tp.fangdd.com%2Fxfwf%2FFmHIOQtJbJfJsYpdVMPBIuzuGVjJ.jpg',
    id: '1',
    statusText: {
      0: '活动已失效',
      1: '活动报名中',
      2: '活动报名中',
      3: '报名已结束',
      4: '报名已结束',
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
    include_bx: '1',
    min_price: 49.9,
    price_num: 1,
    status: '1', // 0为失效或已删除|1为报名中|2为已满额未截止|3为已截止未满额|4为已截止且满额|5为已结束
    valid_btime: '01-03 9:00',
    valid_etime: '04-30 17:00',
    dead_line: '01-01 18:00',
    address: '北京市朝阳区 马桥路甲40号二十一使广大三个数发',
    address_position: [116.40, 39.90],
    jh_address: '北京市朝阳区 马桥路甲40号二十一使广大三个数发',
    jh_address_position: [116.40, 39.90],
    min_age: '-1',
    max_age: '60',
    limit_num: '10组开始成团',
    refund: false, // 是否支持退款
    join_num: 23,
    join_users: [
      { id: '1', avatar: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg'},
      { id: '2', avatar: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg'},
      { id: '3', avatar: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg'},
      { id: '4', avatar: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg'},
      { id: '5', avatar: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg'},
      { id: '6', avatar: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg'}
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
    content: '',
    evaluation_num: 11,
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
          { id: '2', stock: 18, name: '票种名称2', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
        ]
      },
      {
        id: "2",
        name: '场次名称2',
        stock: 0, // 剩余总库存 NULL为无限制，0为没有该票
        ticket: [
          { id: '3', stock: 0, name: '票种名称3', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '4', stock: null, name: '票种名称4', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
        ]
      },
      {
        id: "3",
        name: '场次名称3',
        stock: null, // 剩余总库存 NULL为无限制，0为没有该票
        ticket: [
          { id: '5', stock: 0, name: '票种名称5', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '6', stock: 0, name: '票种名称6', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '7', stock: 0, name: '票种名称7', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '8', stock: 0, name: '票种名称8', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '9', stock: 0, name: '票种名称9', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '10', stock: 0, name: '票种名称10', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '11', stock: 0, name: '票种名称11', price: 0 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
          { id: '12', stock: null, name: '票种名称12', price: 0.55 }, // stock: 剩余总库存 NULL为无限制，0为没有该票
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
    currentSession: null,
    currentTickets: [],
    selectedTicketLength: 0,
    totalPrice: 0,
    showSession: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' }
    let article = '<section style="box-sizing: border-box; font-style: normal; font-weight: 400; text-align: justify; font-size: 16px;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="margin: 10px 0%; position: static; box-sizing: border-box;"><section style="display: inline-block; vertical-align: middle; width: 70%; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="text-align: center; margin: 0px 0%; position: static; box-sizing: border-box;"><section style="display: inline-block; width: 250px; height: 100px; vertical-align: top; overflow: hidden; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="text-align: left; transform: translate3d(16px, 0px, 0px); -webkit-transform: translate3d(16px, 0px, 0px); -moz-transform: translate3d(16px, 0px, 0px); -o-transform: translate3d(16px, 0px, 0px); margin: 0px 0% 10px; position: static; box-sizing: border-box;"><section style="display: inline-block; vertical-align: bottom; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="box-sizing: border-box;"><section style="text-align: center; position: static; box-sizing: border-box;"><section style="font-size: 36px; line-height: 1.2; color: rgb(206, 171, 115); box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">感</strong></p></section></section></section></section><section style="display: inline-block; vertical-align: bottom; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="text-align: center; font-size: 36px; line-height: 1.2; color: rgb(206, 171, 115); box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">恩</strong></p></section></section></section></section><section style="display: inline-block; vertical-align: bottom; width: 50%; box-sizing: border-box;"><section powered-by="xiumi.us" style="box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="text-align: justify; color: rgb(206, 171, 115); font-size: 14px; line-height: 1.4; box-sizing: border-box;"><p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">2019/05/12</strong></p><p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">Mother-s Day</strong></p></section></section></section></section></section></section><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style=" transform: translate3d(-10px, 0px, 0px); -webkit-transform: translate3d(-10px, 0px, 0px); -moz-transform: translate3d(-10px, 0px, 0px); -o-transform: translate3d(-10px, 0px, 0px); position: static; box-sizing: border-box;"><section style="display: inline-block; vertical-align: top; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="text-align: right; margin: 0px 0%; position: static; box-sizing: border-box;"><section style="max-width: 100%; vertical-align: middle; display: inline-block; line-height: 0; width: 60%; box-sizing: border-box;"><img data-cke-saved-src="http://staticcdn.fantuan.cn/uimage/a2/55/3a/d8/a2553ad8269f56bdacc18ac9e3abb061.jpg?x-oss-process=image/format,jpg" src="http://staticcdn.fantuan.cn/uimage/a2/55/3a/d8/a2553ad8269f56bdacc18ac9e3abb061.jpg?x-oss-process=image/format,jpg" data-ratio="0.9909091" data-w="220" _width="100%" style="vertical-align: middle; max-width: 100%; width: 100%; box-sizing: border-box;" class="raw-image"></section></section></section></section><section style="display: inline-block; vertical-align: top; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="font-size: 36px; line-height: 1.2; color: rgb(206, 171, 115); box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">母</strong></p></section></section></section></section><section style="display: inline-block; vertical-align: top; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="font-size: 36px; line-height: 1.2; color: rgb(206, 171, 115); box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">亲</strong></p></section></section></section></section><section style="display: inline-block; vertical-align: top; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="font-size: 36px; line-height: 1.2; color: rgb(206, 171, 115); box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">节</strong></p></section></section></section></section></section></section></section></section></section></section><section style="display: inline-block; vertical-align: middle; width: 30%; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="text-align: right; margin: 0px 0%; position: static; box-sizing: border-box;"><section style="max-width: 100%; vertical-align: middle; display: inline-block; line-height: 0; width: 100%; box-sizing: border-box;"><img data-cke-saved-src="http://staticcdn.fantuan.cn/uimage/fd/bc/4e/83/fdbc4e83449a8543b70185c929b4e725.jpg?x-oss-process=image/format,jpg" src="http://staticcdn.fantuan.cn/uimage/fd/bc/4e/83/fdbc4e83449a8543b70185c929b4e725.jpg?x-oss-process=image/format,jpg" data-ratio="1.2090909" data-w="330" _width="100%" style="vertical-align: middle; max-width: 100%; width: 100%; box-sizing: border-box;" class="raw-image"></section></section></section></section></section></section><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="margin: 10px 0%; text-align: center; position: static; box-sizing: border-box;"><section style="display: inline-block; vertical-align: top; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="margin: 0px 0%; position: static; box-sizing: border-box;"><section style="max-width: 100%; vertical-align: middle; display: inline-block; line-height: 0; width: 60%; box-sizing: border-box;"><img data-cke-saved-src="http://staticcdn.fantuan.cn/uimage/5f/8c/4f/07/5f8c4f07a6ce1d6d60a1bc87d0ec4988.jpg?x-oss-process=image/format,jpg" src="http://staticcdn.fantuan.cn/uimage/5f/8c/4f/07/5f8c4f07a6ce1d6d60a1bc87d0ec4988.jpg?x-oss-process=image/format,jpg" data-ratio="1.3142857" data-w="210" _width="100%" style="vertical-align: middle; max-width: 100%; width: 100%; box-sizing: border-box;" class="raw-image"></section></section></section></section><section style="display: inline-block; vertical-align: top; width: 60%; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="text-align: left; margin: 0px 0% -10px; transform: translate3d(10px, 0px, 0px); -webkit-transform: translate3d(10px, 0px, 0px); -moz-transform: translate3d(10px, 0px, 0px); -o-transform: translate3d(10px, 0px, 0px); position: static; box-sizing: border-box;"><section style="max-width: 100%; vertical-align: middle; display: inline-block; line-height: 0; width: 10%; box-sizing: border-box;"><img data-cke-saved-src="http://staticcdn.fantuan.cn/uimage/b6/ed/4e/c2/b6ed4ec2140b01d16541fd0fea80cb63.jpg?x-oss-process=image/format,jpg" src="http://staticcdn.fantuan.cn/uimage/b6/ed/4e/c2/b6ed4ec2140b01d16541fd0fea80cb63.jpg?x-oss-process=image/format,jpg" data-ratio="1" data-w="108" _width="100%" style="vertical-align: middle; max-width: 100%; width: 100%; box-sizing: border-box;" class="raw-image"></section></section></section><section powered-by="xiumi.us" style="box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="color: rgb(206, 171, 115); box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">你第一次当宝宝</strong></p><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">我也第一次当妈妈</strong></p></section></section></section><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="text-align: right; margin: -10px 0% 0px; transform: translate3d(-10px, 0px, 0px); -webkit-transform: translate3d(-10px, 0px, 0px); -moz-transform: translate3d(-10px, 0px, 0px); -o-transform: translate3d(-10px, 0px, 0px); position: static; box-sizing: border-box;"><section style="max-width: 100%; vertical-align: middle; display: inline-block; line-height: 0; width: 5%; box-sizing: border-box;"><img data-cke-saved-src="http://staticcdn.fantuan.cn/uimage/34/ef/d6/0b/34efd60b6d0067595c3d330f73b320e3.jpg?x-oss-process=image/format,jpg" src="http://staticcdn.fantuan.cn/uimage/34/ef/d6/0b/34efd60b6d0067595c3d330f73b320e3.jpg?x-oss-process=image/format,jpg" data-ratio="0.8734177" data-w="79" _width="100%" style="vertical-align: middle; max-width: 100%; width: 100%; box-sizing: border-box;" class="raw-image"></section></section></section></section><section style="display: inline-block; vertical-align: top; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="margin: 0px 0%; position: static; box-sizing: border-box;"><section style="max-width: 100%; vertical-align: middle; display: inline-block; line-height: 0; box-sizing: border-box;"><img data-cke-saved-src="http://staticcdn.fantuan.cn/uimage/fe/0e/e6/bc/fe0ee6bc9a626edb3dbbfd877be69888.jpg?x-oss-process=image/format,jpg" src="http://staticcdn.fantuan.cn/uimage/fe/0e/e6/bc/fe0ee6bc9a626edb3dbbfd877be69888.jpg?x-oss-process=image/format,jpg" data-ratio="0.86875" data-w="480" style="vertical-align: middle; max-width: 100%; box-sizing: border-box;" class="raw-image"></section></section></section></section></section></section><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="text-align: left; margin: 10px 0% -55px; position: static; box-sizing: border-box;"><section style="display: inline-block; width: 80px; height: 120px; vertical-align: top; overflow: hidden; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="margin: 0px 0% -50px; transform: translate3d(1px, 0px, 0px); -webkit-transform: translate3d(1px, 0px, 0px); -moz-transform: translate3d(1px, 0px, 0px); -o-transform: translate3d(1px, 0px, 0px); position: static; box-sizing: border-box;"><section style="max-width: 100%; vertical-align: middle; display: inline-block; line-height: 0; width: 100%; box-sizing: border-box;"><img data-cke-saved-src="http://staticcdn.fantuan.cn/uimage/8a/f8/77/cb/8af877cb5716a89808ffba0729c8cf86.jpg?x-oss-process=image/format,jpg" src="http://staticcdn.fantuan.cn/uimage/8a/f8/77/cb/8af877cb5716a89808ffba0729c8cf86.jpg?x-oss-process=image/format,jpg" data-ratio="1.44" data-w="150" _width="100%" style="vertical-align: middle; max-width: 100%; width: 100%; box-sizing: border-box;" class="raw-image"></section></section></section></section></section></section><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="text-align: center; margin: 0px 0% 10px; position: static; box-sizing: border-box;"><section style="display: inline-block; width: 96%; vertical-align: top; padding: 5px; background-position: 73.0173% -1.74799%; background-repeat: repeat; background-size: 101.073%; background-attachment: scroll; border-width: 0px; border-radius: 10px; border-style: none; border-color: rgb(62, 62, 62); overflow: hidden; box-shadow: rgb(164, 127, 115) 0px 0px 5px; background-image: url(&quot;http://statics.xiumi.us/stc/images/templates-assets/tpl-paper/image/d30bc84f211910463011580e7291ef42-sz_63769.jpg?x-oss-process=style/xmorient&quot;); box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="display: inline-block; width: 100%; vertical-align: top; padding: 15px; border-style: dashed; border-width: 1px; border-radius: 10px; border-color: rgb(255, 255, 255); overflow: hidden; box-sizing: border-box;"><section powered-by="xiumi.us" style="box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="text-align: justify; color: rgb(102, 110, 130); line-height: 1.8; box-sizing: border-box;"><p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">母亲想念成长的孩子，总是单向的；充满青春活力的孩子奔向他人生的愿景，眼睛热切望着前方，母亲只能在后头张望他越来越小的背影，揣摩，那地平线有多远，有多长，怎么一下子，就看不见了。</p><p style="text-align: right; white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">——龙应台《亲爱的安德烈》</p></section></section></section></section></section></section></section></section></section><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="text-align: center; margin: 10px 0%; position: static; box-sizing: border-box;"><section style="display: inline-block; width: 300px; height: 240px; vertical-align: top; overflow: hidden; background-position: 50% 50%; background-repeat: no-repeat; background-size: contain; background-attachment: scroll; background-image: url(&quot;http://statics.xiumi.us/stc/images/templates-assets/tpl-paper/image/f89e1b6fd4af73e09bdb36828bfcc9db-sz_25748.png&quot;); box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="margin: 45px 0% 0px; position: static; box-sizing: border-box;"><section style="display: inline-block; width: 100%; vertical-align: top; background-image: linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 25%, rgb(255, 255, 255) 75%, rgba(255, 255, 255, 0) 100%); box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="margin: 25px 0%; position: static; box-sizing: border-box;"><section style="display: inline-block; width: 250px; height: 100px; vertical-align: top; overflow: hidden; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="text-align: left; transform: translate3d(16px, 0px, 0px); -webkit-transform: translate3d(16px, 0px, 0px); -moz-transform: translate3d(16px, 0px, 0px); -o-transform: translate3d(16px, 0px, 0px); margin: 0px 0% 10px; position: static; box-sizing: border-box;"><section style="display: inline-block; vertical-align: bottom; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="box-sizing: border-box;"><section style="text-align: center; position: static; box-sizing: border-box;"><section style="font-size: 36px; line-height: 1.2; color: rgb(206, 171, 115); box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">感</strong></p></section></section></section></section><section style="display: inline-block; vertical-align: bottom; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="text-align: center; font-size: 36px; line-height: 1.2; color: rgb(206, 171, 115); box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">恩</strong></p></section></section></section></section><section style="display: inline-block; vertical-align: bottom; width: 50%; box-sizing: border-box;"><section powered-by="xiumi.us" style="box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="text-align: justify; color: rgb(206, 171, 115); font-size: 14px; line-height: 1.4; box-sizing: border-box;"><p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">2019/05/12</strong></p><p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">Mother-s Day</strong></p></section></section></section></section></section></section><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style=" transform: translate3d(-10px, 0px, 0px); -webkit-transform: translate3d(-10px, 0px, 0px); -moz-transform: translate3d(-10px, 0px, 0px); -o-transform: translate3d(-10px, 0px, 0px); position: static; box-sizing: border-box;"><section style="display: inline-block; vertical-align: top; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="text-align: right; margin: 0px 0%; position: static; box-sizing: border-box;"><section style="max-width: 100%; vertical-align: middle; display: inline-block; line-height: 0; width: 60%; box-sizing: border-box;"><img data-cke-saved-src="http://staticcdn.fantuan.cn/uimage/a2/55/3a/d8/a2553ad8269f56bdacc18ac9e3abb061.jpg?x-oss-process=image/format,jpg" src="http://staticcdn.fantuan.cn/uimage/a2/55/3a/d8/a2553ad8269f56bdacc18ac9e3abb061.jpg?x-oss-process=image/format,jpg" data-ratio="0.9909091" data-w="220" _width="100%" style="vertical-align: middle; max-width: 100%; width: 100%; box-sizing: border-box;" class="raw-image"></section></section></section></section><section style="display: inline-block; vertical-align: top; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="font-size: 36px; line-height: 1.2; color: rgb(206, 171, 115); box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">母</strong></p></section></section></section></section><section style="display: inline-block; vertical-align: top; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="font-size: 36px; line-height: 1.2; color: rgb(206, 171, 115); box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">亲</strong></p></section></section></section></section><section style="display: inline-block; vertical-align: top; width: 20%; box-sizing: border-box;"><section powered-by="xiumi.us" style="position: static; box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="font-size: 36px; line-height: 1.2; color: rgb(206, 171, 115); box-sizing: border-box;"><p style="margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box">节</strong></p></section></section></section></section></section></section></section></section></section></section></section></section></section></section></section></section>'
    article = article.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block"')
      .replace(/<section/gi, '<div')
      .replace(/\/section>/gi, '/div>')
    this.setData({
      content: article
    })
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    // let that = this
    // WxParse.wxParse('article', 'html', article, that, 5)
    this.initSession(this.data.session)
    this.getPosterUserAvatar()
    this.getPosterLutuLogo()
    this.getPosterGoodsRqcode()
    this.getPosterGoodsBanner()
    setTimeout(() => {
      this.drawPoster()
    }, 3000)
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
  },

  stopPropagation: function () {
    return false
  },

  sessionTap: function (e) {
    const { status, idx} = e.currentTarget.dataset
    const session = JSON.parse(JSON.stringify(this.data.session))
    if (status === 'disabled') { // 售罄
      return false
    }
    const tickets = session[idx].ticket.map(item => Object.assign({}, item, {num: 0}))
    this.setData({
      selectedTicketLength: 0,
      totalPrice: 0,
      currentSession: idx,
      currentTickets: tickets
    })
  },

  initSession: function (session) {
    let _session = JSON.parse(JSON.stringify(session))
    let current = null
    let selected = []
    for (let i = 0; i < _session.length; i++) {
      if (_session[i].stock === 0) {
        console.log('continue1', i, _session[i].stock, null <= 0)
        continue
      }
      let valid = false
      let tickets = _session[i].ticket
      for (let j = 0; j < tickets.length; j++) {
        if (tickets[j].stock === 0) {
          console.log('continue2', j, tickets[j].stock)
          continue
        }
        valid = true
      }
      if (valid) {
        current = i
        break
      }
    }
    if (current !== null) {
      selected = _session[current].ticket.map(item => Object.assign({}, item, {num: 0}))
    }
    this.setData({
      selectedTicketLen: 0,
      totalPrice: 0,
      currentSession: current,
      currentTickets: selected
    })
  },

  countTicket: function (e) {
    let tickets = JSON.parse(JSON.stringify(this.data.currentTickets))
    let selectedTicketLen = 0
    let total = 0
    const {type, idx} = e.currentTarget.dataset
    let ticket = tickets[idx]
    let disabled = ticket.stock === 0 || (ticket.num <= 0 && type === 'minus') || (ticket.stock && ticket.num >= ticket.stock && type === 'add')
    if (disabled) {
      return false
    }
    tickets.forEach((item, index) => {
      selectedTicketLen += index === idx ? (item.num + (type === 'minus' ? -1 : 1)) : item.num
      total += index === idx ? ((item.num + (type === 'minus' ? -1 : 1)) * item.price) : (item.num * item.price)
    })
    let num = ticket.num + (type === 'minus' ? -1 : 1)
    let _obj = {}
    _obj.selectedTicketLength = selectedTicketLen
    _obj.totalPrice = parseFloat(total.toFixed(2))
    _obj['currentTickets[' + idx + '].num'] = num
    this.setData(_obj)
  },

  toggleSession: function () {
    const {showSession} = this.data
    this.setData({
      showSession: !showSession
    })
  },

  order: function () {
    this.toggleSession()
    console.log('跳转提交订单页面')
    wx.navigateTo({
      url: '/pages/ordersubmit/ordersubmit'
    })
  },

  viewAllComment: function () {
    console.log('viewAllComment')
  },

  viewLocation: function (e) {
    console.log('viewLocation')
  },

  viewBusinessCertification: function () { // 查看商家资质
    console.log('viewBusinessCertification')
  },

  viewBusiness: function () { // 跳转到商家
    console.log('viewBusiness')
  },

  getPosterUserAvatar: function () {
    wx.getImageInfo({
      src: this.data.userAvatar,
      success: (res) => {
        this.canvas_user_avatar = res.path
      }
    })
  },

  getPosterLutuLogo: function () {
    wx.getImageInfo({
      src: this.data.lutuLogo,
      success: (res) => {
        this.canvas_lutu_logo = res.path
      }
    })
  },

  getPosterGoodsRqcode: function () {
    wx.getImageInfo({
      src: this.data.goodsCodeUrl,
      success: (res) => {
        this.canvas_goods_qrcode = res.path
      }
    })
  },

  getPosterGoodsBanner: function () {
    wx.getImageInfo({
      src: this.data.cover_url,
      success: (res) => {
        this.canvas_goods_banner = res.path
      }
    })
  },

  drawPoster: function (goods) {
    if (!this.canvas_user_avatar || !this.canvas_lutu_logo || !this.canvas_goods_qrcode || !this.canvas_goods_banner) {
      return false
    }
    const systemInfo = wx.getSystemInfoSync()
    const ctx = wx.createCanvasContext('share-image', this)
    const rpx = systemInfo.windowWidth / 750
    ctx.save()
    ctx.beginPath()
    ctx.arc(86 * rpx, 86 * rpx, 28 * rpx, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(this.canvas_user_avatar, 58 * rpx, 58 * rpx, 56 * rpx, 56 * rpx)
    ctx.restore()
    ctx.drawImage(this.canvas_goods_banner, 28 * rpx, 139 * rpx, 470 * rpx, 316 * rpx)
    ctx.drawImage(this.canvas_goods_banner, 51 * rpx, 666 * rpx, 86 * rpx, 86 * rpx)
    ctx.drawImage(this.canvas_goods_banner, 374 * rpx, 644 * rpx, 105 * rpx, 105 * rpx)
    ctx.draw()
    // const systemInfo = wx.getSystemInfoSync()
    // const ctx = wx.createCanvasContext('share-image', this)
    // const rpx = systemInfo.windowWidth / 750
    // ctx.save()
    // ctx.beginPath()
    // ctx.arc(86 * rpx, 86 * rpx, 28 * rpx, 0, 2 * Math.PI)
    // ctx.clip()
    // this.setDrawImage(ctx, 'http://testdimg.lutu.com/img/5f/e7/a8/d1/5fe7a8d12859397c26adcba0a4f4044a.jpg', 58 * rpx, 58 * rpx, 56 * rpx, 56 * rpx)
    // ctx.restore()
    // ctx.draw()
    // wx.getImageInfo({
    //   src: 'http://testdimg.lutu.com/img/5f/e7/a8/d1/5fe7a8d12859397c26adcba0a4f4044a.jpg',
    //   success: (res) => {
    //     console.log('success', res)
    //   },
    //   fail: (res) => {
    //     console.log('fail', res)
    //   },
    //   complete: (res) => {
    //     console.log('complete', res)
    //   }
    // })
  },

  drawing: function () {
    var rpx;
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: function (res) {
        rpx = res.windowWidth / 750;
      },
    });
    let _this = this;
    const ctx = wx.createCanvasContext('goodsImage', this);
    _this.setDrawImage(ctx, _this.data.pageQRCodeData.goodsInfo.goods_img, 0, 0, 300 * rpx, 160 * rpx);
    _this.setDrawImage(ctx, _this.data.pageQRCodeData.goodsInfo.qrcode_img_url, 195 * rpx, 180 * rpx, 80 * rpx, 80 * rpx)
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, 300 * rpx, 300 * rpx)
    ctx.draw(true)
    _this.setFillText(ctx, _this.data.pageQRCodeData.goodsInfo.text, '#333333', 210 * rpx);

    ctx.draw(true)
  },
  setFillText: function (ctx, text, color, y) {
    let textString;
    if (text.length > 26) {
      textString = text.substr(0, 23) + '...';
    } else {
      textString = text;
    }
    let textRowArr = [];
    for (let tmp = 0; tmp < textString.length;) {
      textRowArr.push(textString.substr(tmp, 13))
      tmp += 13
    }
    for (let item of textRowArr) {
      ctx.setFontSize(13);
      ctx.setFillStyle(color);
      ctx.fillText(item, 10, y);
      y += 20;

    }

    if (this.data.pageQRCodeData.goodsInfo.price) {
      // ctx.setFontSize(14);
      // ctx.setFillStyle('#FF3600');
      // ctx.fillText('￥' + this.data.pageQRCodeData.goodsInfo.price, 10, y+5)

    }
    ctx.setFontSize(10);
    ctx.setFillStyle('#69C4AA');
    ctx.fillText('长按图片查看详情', 10, y + 20)
  },
  setDrawImage: function (ctx, src, x, y, w, h) {
    wx.getImageInfo({
      src: src,
      success: function (res) {
        ctx.drawImage(res.path, x, y, w, h)
        ctx.draw(true)
      }
    })
  },
  savePageCode: function () {
    let _this = this;
    wx.canvasToTempFilePath({
      canvasId: 'goodsImage',
      success(res) {
        _this.pageCode(res.tempFilePath);
      }
    }, this)
  },
  pageCode: function (url) {
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease"
    })
    this.animation = animation;
    animation.bottom("-320rpx").step()
    let that = this;
    wx.showLoading({ mask: true })
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success: function (data) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 4000
        })
        that.animation = animation;
        that.animation.bottom("-320rpx").step();
        that.setData({
          "pageQRCodeData.shareDialogShow": "100%",
          "pageQRCodeData.shareMenuShow": false,
          "pageQRCodeData.animation": that.animation.export(),
          "pageQRCodeShow": false
        })
      },
      fail: function (res) {
        if (res && (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail:auth denied")) {
          wx.showModal({
            title: '提示',
            content: '您已经拒绝授权保存图片到您的相册，这将影响您使用小程序，您可以点击右上角的菜单按钮，选择关于。进入之后再点击右上角的菜单按钮，选择设置，然后将保存到相册按钮打开，返回之后再重试。',
            showCancel: false,
            confirmText: "确定",
            success: function (res) {
            }
          })
        }
      }
    })
  }
})