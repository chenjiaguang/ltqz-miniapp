// pages/goodsdetail/goodsdetail.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromUid: '',
    uid: '',
    uAvatar: 'http://img1.imgtn.bdimg.com/it/u=1366063848,1254383119&fm=26&gp=0.jpg',
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
    cover_url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2111762476,1358590461&fm=26&gp=0.jpg',
    title: '【穿行艺术】城市里的博物馆，外滩历险记(银行一条街)四六级阿舒服了阿舒服阿',
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
    showSession: false,
    show_share_box: false,
    localPoster: ''
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
    if (options.uid) {
      this.setData({
        fromUid: options.uid
      })
    }
    console.log('options.id', options.id)
    this.fetchGoods(options.id)
    this.fetchComment(options.id)
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
    const { title, id, cover_url, uid} = this.data
    return {
      title: title,
      path: '/pages/goodsdetail/goodsdetail?id=' + id + '&uid=' + uid,
      imageUrl: cover_url
    }
  },

  fetchGoods: function (id) {
    let rData = {id}
    util.request('/huodong/detail', rData).then(res => {
      console.log('/huodong/detail_res', res)
      if (res.error == 0 && res.data) {
        if (res.data.session) {
          this.initSession(res.data.session)
        }
        this.setData(res.data)
      }
    }).catch(err => {
      
    })
  },

  fetchComment: function (pid) {
    let rData = { product_id: pid, type: '1', pn: 1 }
    util.request('/rate/list', rData).then(res => {
      console.log('/rate/list_res', res)
      if (res.error == 0 && res.data) {
        this.setData(res.data)
      }
    }).catch(err => {

    })
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
      total += index === idx ? ((item.num + (type === 'minus' ? -1 : 1)) * item.type.price) : (item.num * item.type.price)
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
    const {id} = this.data
    wx.navigateTo({
      url: '/pages/commentlist/commentlist?pid=' + id + '&type=1'
    })
  },

  viewLocation: function (e) {
    console.log('viewLocation')
    const lnglat = this.data[e.currentTarget.dataset.ele]
    if (lnglat && lnglat[0] && lnglat[1]) {
      wx.openLocation({
        latitude: parseFloat(lnglat[1]),
        longitude: parseFloat(lnglat[0])
      })
    }
  },

  viewBusinessCertification: function () { // 查看商家资质
    console.log('viewBusinessCertification')
    wx.navigateTo({
      url: '/pages/imagepage/imagepage?image=' + this.data.shop.type_pic_url + '&title=商家资质',
    })
  },

  viewBusiness: function () { // 跳转到商家
    console.log('viewBusiness')
  },

  getPosterUserAvatar: function () {
    wx.getImageInfo({
      src: this.data.uAvatar,
      success: (res) => {
        this.canvas_user_avatar = res.path
        this.drawPoster()
      }
    })
  },

  getPosterGoodsRqcode: function () { // todo
    // 模拟ajax获取二维码
    if (!this.canvas_goods_qrcode && !this.code_image_fetching) {
      this.code_image_fetching = true
      setTimeout(res => {
        this.code_image_fetching = false
        wx.getImageInfo({
          src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557846509166&di=cb779e8e0db9220b8547916ae9032350&imgtype=0&src=http%3A%2F%2Fstatic-tp.fangdd.com%2Fxfwf%2FFmHIOQtJbJfJsYpdVMPBIuzuGVjJ.jpg',
          success: (res) => {
            this.canvas_goods_qrcode = res.path
            this.drawPoster()
          }
        })
      }, 1000)
    }
  },

  getPosterGoodsBanner: function () {
    wx.getImageInfo({
      src: this.data.cover_url,
      success: (res) => {
        // 按照aspectfill的方式截取
        const img_width = res.width
        const img_height = res.height
        const canvas_height = 316
        const canvas_width = 470
        let clip_left,clip_top,clip_width,clip_height // 左偏移值，上偏移值，截取宽度，截取高度
        clip_height = img_width * (canvas_height / canvas_width)
        if (clip_height > img_height) {
          clip_height = img_height
          clip_width = clip_height * (canvas_width / canvas_height)
          clip_left = (img_width - clip_width) / 2
          clip_top = 0
        } else {
          clip_left = 0
          clip_top = (img_height - clip_height) / 2
          clip_width = img_width
        }
        this.banner_clip = {
          clip_left,
          clip_top,
          clip_width,
          clip_height
        }
        this.canvas_goods_banner = res.path
        this.drawPoster()
      }
    })
  },

  drawPoster: function (goods) {
    if (!this.canvas_user_avatar || !this.canvas_goods_qrcode || !this.canvas_goods_banner || !this.banner_clip) {
      if (!this.canvas_user_avatar) {
        this.getPosterUserAvatar()
      }
      if (!this.canvas_goods_qrcode) {
        this.getPosterGoodsRqcode()
      }
      if (!this.canvas_goods_banner || !this.banner_clip) {
        this.getPosterGoodsBanner()
      }
      return false
    }
    const systemInfo = wx.getSystemInfoSync()
    const ctx = wx.createCanvasContext('share-poster', this)
    const rpx = systemInfo.windowWidth / 750

    ctx.drawImage('/assets/images/share_poster_bg.png', 0, 0, 526 * rpx, 816 * rpx) // 海报背景
    ctx.save()
    ctx.beginPath()
    ctx.arc(86 * rpx, 86 * rpx, 28 * rpx, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(this.canvas_user_avatar, 58 * rpx, 58 * rpx, 56 * rpx, 56 * rpx)
    ctx.restore()
    ctx.drawImage(this.canvas_goods_banner, this.banner_clip.clip_left, this.banner_clip.clip_top, this.banner_clip.clip_width, this.banner_clip.clip_height, 28 * rpx, 139 * rpx, 470 * rpx, 316 * rpx)
    ctx.drawImage('/assets/images/lutu_logo.png', 51 * rpx, 666 * rpx, 86 * rpx, 86 * rpx)
    ctx.drawImage(this.canvas_goods_qrcode, 374 * rpx, 644 * rpx, 105 * rpx, 105 * rpx)
    ctx.setFontSize(20 * rpx)
    ctx.setFillStyle('#333')
    ctx.fillText('@ 路上看到飞机水电费', 126 * rpx, 80 * rpx, 340 * rpx)
    ctx.setFontSize(18 * rpx)
    ctx.setFillStyle('#999')
    ctx.fillText('发现了一个宝贝，想要跟你分享~', 126 * rpx, 106 * rpx, 340 * rpx)
    ctx.setFontSize(22 * rpx)
    ctx.setFillStyle('#333')
    const title = this.data.title
    if (title.length > 20) {
      ctx.fillText(title.substring(0, 19), 51 * rpx, 500 * rpx, 425 * rpx)
      if (title.length > 37) {
        ctx.fillText(title.substring(19, 37) + '...', 51 * rpx, 530 * rpx, 425 * rpx)
      } else {
        ctx.fillText(title.substring(19, 37), 51 * rpx, 530 * rpx, 425 * rpx)
      }
    } else {
      ctx.fillText(title, 51 * rpx, 500 * rpx, 425 * rpx)
    }
    let price = ''
    const { min_price, price_num, join_num} = this.data
    if (min_price && min_price > 0) {
      if (price_num > 1) {
        price = '¥' + min_price + '起'
      } else {
        price = '¥' + min_price
      }
    } else {
      price = '免费'
    }
    ctx.setFontSize(36 * rpx)
    ctx.setFillStyle('#F24724')
    ctx.fillText(price, 51 * rpx, 590 * rpx, 425 * rpx)
    ctx.setFontSize(18 * rpx)
    ctx.setFillStyle('#999')
    const join_text = '累计' + (join_num || 0) + '人报名'
    const join_left = 526 - (join_text.length * 18 + 51)
    ctx.fillText(join_text, join_left * rpx, 585 * rpx, 425 * rpx)
    ctx.setFontSize(15 * rpx)
    ctx.setFillStyle('#999')
    ctx.fillText('路途亲子，共享美好时光！', 51 * rpx, 766 * rpx)
    ctx.fillText('长按立即购买', 382 * rpx, 766 * rpx)
    ctx.draw(true, () => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'share-poster',
        success: res => {
          let localPoster = res.tempFilePath
          this.setData({
            localPoster: localPoster
          })
        },
        fail: function (res) {

        }
      })
    })
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

  shareBtnTap: function () {
    console.log('shareBtnTap')
    const { show_share_box, localPoster} = this.data
    if (!show_share_box) {
      this.setData({
        show_share_box: true
      })
    }
    if (!localPoster) {
      this.drawPoster()
    }
  },

  toggleShareBox: function () {
    const { show_share_box } = this.data
    this.setData({
      show_share_box: !show_share_box
    })
  },

  shareFriend: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  savePoster: function () {
    console.log('savePoster')
    const { localPoster} = this.data
    if (!localPoster) {
      return false
    }
    // 获取用户是否开启用户授权相册
    wx.getSetting({
      success: res => {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum'] && res.authSetting['scope.writePhotosAlbum'] !== false) { // 未授权 且 未拒绝过
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              wx.saveImageToPhotosAlbum({
                filePath: this.data.localPoster,
                success: () => {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                  })
                },
                fail: () => {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            },
            fail: () => {

            }
          })
        } else if (!res.authSetting['scope.writePhotosAlbum'] && res.authSetting['scope.writePhotosAlbum'] === false) { // 未授权且拒绝过
          wx.showModal({
            content: '保存图片需要你授权，请授权相册', //提示的内容
            showCancel: true,
            confirmText: '去授权',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    const authSetting = res.authSetting
                    if (authSetting['scope.writePhotosAlbum']) {
                      wx.saveImageToPhotosAlbum({
                        filePath: this.data.localPoster,
                        success: () => {
                          wx.showToast({
                            title: '保存成功',
                            icon: 'none'
                          })
                        },
                        fail: () => {
                          wx.showToast({
                            title: '保存失败',
                            icon: 'none'
                          })
                        }
                      })
                    }
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if (res.authSetting['scope.writePhotosAlbum']) {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: this.data.localPoster,
            success: () => {
              wx.showToast({
                title: '保存成功',
                icon: 'none'
              })
            },
            fail: () => {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  }
})