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
      { name: '职业体检', id: '1', image: 'http://i2.bvimg.com/685753/b5c05b9d420d8cc1.png' },
      { name: '城市认知', id: '2', image: 'http://i2.bvimg.com/685753/ffe5458de973c2bc.png' },
      { name: '科创', id: '3', image: 'http://i2.bvimg.com/685753/ba211fc91e6e6ee6.png' },
      { name: '运动', id: '4', image: 'http://i2.bvimg.com/685753/764b8f181b8b9bd0.png' },
      { name: '周末游', id: '5', image: 'http://i2.bvimg.com/685753/f547ae1b15e55e1a.png' },
      { name: '国内营', id: '6', image: 'http://i2.bvimg.com/685753/6b7f72d7f6c2c45b.png' },
      { name: '国外营', id: '7', image: 'http://i2.bvimg.com/685753/24835086c182d57f.png' },
      { name: '漂流书屋', id: '8', image: 'http://i2.bvimg.com/685753/e3796a12f04f3c08.png' }
    ],
    themes: [
      {name: '主题1', id: '1'},
      {name: '主题2', id: '2'},
      {name: '主题3', id: '3'},
      {name: '主题4', id: '4'},
      {name: '主题5', id: '5'},
      {name: '主题6', id: '6'},
      {name: '主题7', id: '7'},
      {name: '主题8', id: '8'},
      {name: '主题9', id: '9'},
      {name: '主题10', id: '10'},
      {name: '主题11', id: '11'},
      {name: '主题12', id: '12'},
      {name: '主题13', id: '13'},
      {name: '主题14', id: '14'}
    ],
    recommendations: [
      {
        id: '1',
        image: 'http://i1.bvimg.com/685753/2712acb6dc8bcd2b.jpg',
        title: '活动标题',
        intro: '活动介绍',
        tags: [ // 活动标签
          { name: '标签名称1', type: '1' },
          { name: '标签名称2', type: '2' },
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
    ]
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
    const {id} = e.currentTarget.dataset
    if (id) {
      wx.navigateTo({
        url: '/pages/themeaggregation/themeaggregation?id=' + id
      })
    }
  }
})
