//index.js
//获取应用实例
const app = getApp()

Page({
  name: 'index',
  data: {
    banners: [
      { path: '/pages/goodsdetail/goodsdetail?id=1', image: 'http://i1.bvimg.com/685753/f356705dcb228db3.jpg' },
      { path: '/pages/goodsdetail/goodsdetail?id=2', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg' },
      { path: '/pages/goodsdetail/goodsdetail?id=3', image: 'http://i1.bvimg.com/685753/c5c4046d7878cacb.png' },
      { path: '/pages/goodsdetail/goodsdetail?id=4', image: 'http://i1.bvimg.com/685753/a841c521b0925e81.jpg' },
      { path: '/pages/goodsdetail/goodsdetail?id=5', image: 'http://i1.bvimg.com/685753/2712acb6dc8bcd2b.jpg' },
      { path: '/pages/goodsdetail/goodsdetail?id=6', image: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg' },
      { path: '/pages/goodsdetail/goodsdetail?id=7', image: 'http://i1.bvimg.com/685753/6f8dd9c1b77d3a79.png' },
      { path: '/pages/goodsdetail/goodsdetail?id=8', image: 'http://i1.bvimg.com/685753/c417dc1c13623f36.jpg' },
      { path: '/pages/goodsdetail/goodsdetail?id=9', image: 'http://i1.bvimg.com/685753/1f585e337b04cef3.jpg' }
    ],
    cates: [
      { name: '职业职业体检检', id: '1', image: 'http://i2.bvimg.com/685753/b5c05b9d420d8cc1.png' },
      { name: '城市认知', id: '2', image: 'http://i2.bvimg.com/685753/ffe5458de973c2bc.png' },
      { name: '科创', id: '3', image: 'http://i2.bvimg.com/685753/ba211fc91e6e6ee6.png' },
      { name: '运动', id: '4', image: 'http://i2.bvimg.com/685753/764b8f181b8b9bd0.png' },
      { name: '周末游', id: '5', image: 'http://i2.bvimg.com/685753/f547ae1b15e55e1a.png' },
      { name: '国内营', id: '6', image: 'http://i2.bvimg.com/685753/6b7f72d7f6c2c45b.png' },
      { name: '国外营', id: '7', image: 'http://i2.bvimg.com/685753/24835086c182d57f.png' },
      { name: '漂流书屋', id: '8', image: 'http://i2.bvimg.com/685753/e3796a12f04f3c08.png' }
    ],
    themes: [
      { name: '主题1', id: '1', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '14.5万人关注', tags: ['新品', '爆款']},
      { name: '主题2', id: '2', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '2万人已购买', tags: ['爆款'] },
      { name: '主题3', id: '3', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '', tags: []},
      { name: '主题4', id: '4', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '14.5万人关注', tags: [] },
      { name: '主题5', id: '5', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '14.5万人关注', tags: [] },
      { name: '主题6', id: '6', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '14.5万人关注', tags: [] },
      { name: '主题7', id: '7', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '14.5万人关注', tags: [] },
      { name: '主题8', id: '8', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '14.5万人关注', tags: [] }
    ],
    recommendations: [
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
          { type: 'class', label: '标签1' },
          { type: 'location', label: '标签2' },
          { type: 'address', label: '标签3' }
        ],
        cover_url: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg',
        join_num: 30,
        min_price: 99.9,
        price_num: 2,
        status: '1' // 状态：0为失效或已删除 | 1为报名中| 2为已满额未截止| 3为已截止未满额| 4为已截止且满额| 5为已结束
      }
    ],
    recommendationLoaded: true,
    recommendationLoading: false,
    recommendationPage: {pn: 1, is_end: true}
  },
  onLoad: function () {
    
  },
  bannerTap: function (e) {
    console.log('bannerTap', e)
    const {item} = e.detail
    if (item && item.path) {
      wx.navigateTo({
        url: item.path
      })
    }
  },
  cateTap: function (e) {
    console.log('cateTap', e)
    const { item } = e.detail
    if (item && item.id) {
      wx.navigateTo({
        url: '/pages/goodslist/goodslist?id=' + item.id
      })
    }
  },
  themeTap: function (e) {
    const {theme} = e.detail
    if (theme && theme.id) {
      wx.navigateTo({
        url: '/pages/themeaggregation/themeaggregation?id=' + theme.id
      })
    }
  },
  activityTap: function (e) {
    console.log('activityTap', e)
    const {id} = e.detail
    if (id) {
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?id=' + id
      })
    }
  }
})
