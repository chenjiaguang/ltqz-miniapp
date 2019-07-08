// ftcomponents/ftPullToRefresh/ftPullToRefresh.js
// 使用的时候，用本组件包裹可以触发下拉刷新的内容。enablePullDownRefresh需要设置为false。
const app = getApp()
const platform = app.globalData.platform
  
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    refreshed: { // 必选，通知本组件收起
      type: Boolean,
      value: false,
    },
    refreshing: { // 可选，通知本组件直接进入refreshing状态
      type: Boolean,
      value: false,
    },
    distMax: { // 可选，可以下拉的最大高度，回弹的高度为最大高度的75%
      type: Number,
      value: 110,
    },
    iconDist: {
      type: Number,
      value: 110
    }
  },
  data: {
    platform: platform,
    reachTop: false
  },
  methods: {
    initObserver() {
      this.observer = this.createIntersectionObserver()
      this.observer.relativeToViewport().observe(".intersection-dot", (res) => {
        if (res.intersectionRatio > 0) {
          this.setData({
            reachTop: true,
          })
        } else {
          this.setData({
            reachTop: false,
          })
        }
      })
    },
    clearObserver() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    },
    vibrateShort() {
      wx.vibrateShort()
    }
  },
  ready() {
    this.initObserver()
  },
  detached() {
    this.clearObserver()
  },
})
