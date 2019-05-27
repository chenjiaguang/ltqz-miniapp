//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  name: 'index',
  data: {
    banners: [],
    cates: [],
    // themes: [
    //   { name: '主题1', id: '1', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '14.5万人关注', tags: ['新品', '爆款'] },
    //   { name: '主题2', id: '2', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '2万人已购买', tags: ['爆款'] },
    //   { name: '主题3', id: '3', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '', tags: [] },
    //   { name: '主题4', id: '4', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '14.5万人关注', tags: [] },
    //   { name: '主题5', id: '5', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '14.5万人关注', tags: [] },
    //   { name: '主题6', id: '6', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '14.5万人关注', tags: [] },
    //   { name: '主题7', id: '7', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '14.5万人关注', tags: [] },
    //   { name: '主题8', id: '8', image: 'http://i1.bvimg.com/685753/b9ba96284fff562b.jpg', maskText: '14.5万人关注', tags: [] }
    // ],
    themes: [],
    recommendations: [
      // {
      //   id: '1',
      //   title: '或是对佛撒的发阿善良大方',
      //   desc: '活动描述',
      //   tags: [
      //     { type: 'class', label: '标签1' }
      //   ],
      //   cover_url: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg',
      //   join_num: 200,
      //   min_price: 49.9,
      //   price_num: 1,
      //   status: '1' // 状态：0为失效或已删除 | 1为报名中| 2为已满额未截止| 3为已截止未满额| 4为已截止且满额| 5为已结束
      // },
      // {
      //   id: '2',
      //   title: '或是对佛撒的发阿善良大方',
      //   desc: '活动描述',
      //   tags: [
      //     { type: 'class', label: '标签1' },
      //     { type: 'location', label: '标签2' },
      //     { type: 'address', label: '标签3' }
      //   ],
      //   cover_url: 'http://i1.bvimg.com/685753/69601cd97e8be3cb.jpg',
      //   join_num: 30,
      //   min_price: 99.9,
      //   price_num: 2,
      //   status: '1' // 状态：0为失效或已删除 | 1为报名中| 2为已满额未截止| 3为已截止未满额| 4为已截止且满额| 5为已结束
      // }
    ],
    recommendationLoaded: false,
    recommendationLoading: false,
    recommendationPage: {}
  },
  onLoad: function () {
    this.fetchPageData()
    this.fetchRecommandGoods(1)
  },
  onPullDownRefresh: function () {
    this.fetchPageData()
    this.fetchRecommandGoods(1)
  },
  onReachBottom: function () {
    const {
      recommendationPage
    } = this.data
    if (recommendationPage && !recommendationPage.is_end) {
      this.fetchRecommandGoods(parseInt(recommendationPage.pn) + 1)
    }
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
        url: '/pages/goodslist/goodslist?id=' + item.id + '&title=' + item.name
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
  },
  fetchPageData: function () {
    util.request('/home').then(res => {
      if (res.error == 0 && res.data) {
        const banners = res.data.banner.map(item => {
          return {path: item.link, image: item.banner_url}
        })
        const cates = res.data.class.map(item => {
          return {id: item.id, name: item.name, image: item.icon_url}
        })
        this.setData({
          banners,
          cates
        })
      }
    })
  },
  fetchRecommandGoods: function (pn) {
    const {
      recommendationLoading,
      recommendations,
      recommendationPage
    } = this.data
    if (recommendationLoading || (recommendationPage && recommendationPage.is_end && pn !== 1)) { // 正在加载 或 最后一页并且不是刷新
      return false
    }
    this.setData({
      recommendationLoading: true
    })
    let rData = {
      status: 1,
      pn: pn
    }
    util.request('/huodong/list', rData).then(res => {
      console.log('/huodong/list', res)
      if (res.error == 0 && res.data) {
        let {
          list,
          page
        } = res.data
        list.forEach(item => {
          item.min_price = util.formatMoney(item.min_price).showMoney
        })
        let _obj = {}
        _obj.recommendationLoaded = true
        if (pn === 1) { // 刷新
          _obj.recommendationPage = page
          _obj.recommendations = list
        } else {
          let oldLen = this.data.recommendations.length
          let newLen = list.length
          for (let i = 0; i < newLen; i++) {
            _obj['recommendations[' + (oldLen + i) + ']'] = list[i]
          }
          _obj.recommendationPage = page
        }
        this.setData(_obj)
      }
    }).catch(err => {
      console.log('catch')
    }).finally(res => {
      this.setData({
        recommendationLoading: false
      })
      wx.stopPullDownRefresh()
    })
  }
})
