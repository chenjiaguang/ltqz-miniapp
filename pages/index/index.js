//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  name: 'index',
  data: {
    refreshing: false,
    refreshed: false,
    collected: false,
    banners: [], // 主banner
    subBanners: [], // 副banner
    cates: [], // 分类
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
    themes: [], // 主题
    sales: [], // 营销活动
    hots: [], // 爆款
    news: [], // 新品
    recommendations: [], // 推荐
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
  onShareAppMessage: function () {
    const { cover_url } = this.data
    return {
      title: '范团精选-最好的成长在路上',
      path: '/pages/index/index'
    }
  },
  bannerTap: function (e) {
    const {item} = e.detail
    if (item && item.path) {
      wx.navigateTo({
        url: item.path
      })
    }
  },
  subBannerTap: function (e) {
    const {path} = e.currentTarget.dataset
    if (path) {
      wx.navigateTo({
        url: path
      })
    }
  },
  cateTap: function (e) {
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
    const { link } = e.currentTarget.dataset
    if (link) {
      wx.navigateTo({
        url: link
      })
    }
  },
  goodsTap: function (e) {
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
        const subBanners = res.data.banner_sub ? res.data.banner_sub.map(item => {
          return { path: item.link, image: item.banner_url }
        }) : []
        const cates = res.data.class.map(item => {
          return {id: item.id, name: item.name, image: item.icon_url}
        })

        let sales = res.data.subject
        let hots = []
        let news = []
        let recommend = res.data.recommend
        
        if (recommend && recommend.top && recommend.top.length) { // 热卖
          hots = recommend.top
        }
        if (recommend && recommend.new && recommend.new.length) { // 新品
          news = recommend.new
        }
        hots.forEach(item => {
          item.min_price = util.formatMoney(item.min_price).showMoney
          item.min_origin_price = util.formatMoney(item.min_origin_price).showMoney
          item.min_pt_price = util.formatMoney(item.min_pt_price).showMoney
          item.min_qg_price = util.formatMoney(item.min_qg_price).showMoney
        })
        news.forEach(item => {
          item.min_price = util.formatMoney(item.min_price).showMoney
          item.min_origin_price = util.formatMoney(item.min_origin_price).showMoney
          item.min_pt_price = util.formatMoney(item.min_pt_price).showMoney
          item.min_qg_price = util.formatMoney(item.min_qg_price).showMoney
        })
        this.setData({
          banners,
          subBanners,
          cates,
          sales,
          hots,
          news
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
    util.request('/product/list', rData).then(res => {
      if (res.error == 0 && res.data) {
        let {
          list,
          page
        } = res.data
        list.forEach(item => {
          item.min_price = util.formatMoney(item.min_price).showMoney
          item.min_origin_price = util.formatMoney(item.min_origin_price).showMoney
          item.min_pt_price = util.formatMoney(item.min_pt_price).showMoney
          item.min_qg_price = util.formatMoney(item.min_qg_price).showMoney
        })
        let _obj = {}
        _obj.recommendationLoaded = true
        if (pn === 1) { // 刷新
          _obj.recommendationPage = page
          _obj.recommendations = list
          // _obj.hots = [list[0], list[1]]
          // _obj.news = [list[0]]
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
      
    }).finally(res => {
      this.setData({
        recommendationLoading: false
      })
      if (pn ==1) {
        this.setData({
          refreshing: false,
          refreshed: true
        })
      }
      wx.stopPullDownRefresh()
    })
  },
  test: function () {
    this.setData({
      collected: !this.data.collected
    })
  }
})
