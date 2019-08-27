// ftcomponents/ftModalBottom/ftModalBottom.js
const app = getApp()

let systemInfo = app.globalData.systemInfo || wx.getSystemInfoSync()
let MenuButtonInfo = app.globalData.MenuButtonInfo || wx.getMenuButtonBoundingClientRect()

const statusBarHeight = systemInfo.statusBarHeight
const menuTopSpace = MenuButtonInfo.top - statusBarHeight
const menuHeight = MenuButtonInfo.height
const navBoxHeight = menuTopSpace * 2 + menuHeight // 导航胶囊上下分别留6px的间隔
const navWrapperHeight = statusBarHeight + navBoxHeight

let extraBottom = false
const isIos = systemInfo.system.indexOf('iOS') !== -1
const higher = systemInfo.screenHeight > 736
if (isIos && higher) {
  extraBottom = true
}

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    mode: { // mode：1（安卓风格），mode：2（ios风格）
      type: String,
      value: '1'
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    hideCancel: {
      type: Boolean,
      value: false
    },
    topTouchHide: {
      type: Boolean,
      value: false
    },
    bottomTouchHide: {
      type: Boolean,
      value: false
    },
    maskTapHide: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navWrapperHeight: navWrapperHeight,
    extraBottom,
    topReached: false,
    bottomReached: false,
    topHeight: 0,
    bottomHeight: 0
  },

  showModal: false,
  
  /**
   * 组件的方法列表
   */
  methods: {
    initObserver() {
      if (this.data.topTouchHide) {
        this.observerTop = this.createIntersectionObserver()
        this.observerTop.relativeToViewport().observe(".intersection-dot-top", (res) => {
          if (res.intersectionRatio > 0) {
            this.setData({
              topReached: true,
            })
          } else {
            this.setData({
              topReached: false,
            })
          }
        })
        this.createSelectorQuery().select('.top').boundingClientRect(rect => {
          this.setData({topHeight: rect.height})
        }).exec()
      }
      if (this.data.bottomTouchHide) {
        this.observerBottom = this.createIntersectionObserver()
        this.observerBottom.relativeToViewport().observe(".intersection-dot-bottom", (res) => {
          if (res.intersectionRatio > 0) {
            this.setData({
              bottomReached: true,
            })
          } else {
            this.setData({
              bottomReached: false,
            })
          }
        })
        this.createSelectorQuery().select('.bottom').boundingClientRect(rect => {
          this.setData({bottomHeight: rect.height})
        }).exec()
      }
    },
    clearObserver() {
      if (this.observerTop) {
        this.observerTop.disconnect()
        this.observerTop = null
      }
      if (this.observerBottom) {
        this.observerBottom.disconnect()
        this.observerBottom = null
      }
    },
    stopPropagation: function () {
      return false
    },
    hide: function (e) {
      const {maskTapHide} = this.data
      if (e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.origin == 'mask' && !maskTapHide) { // 禁止点击遮罩关闭
        return false
      }
      this.showModal = false
      const duration = (e && e.duration) ? e.duration : 200
      if (!this.wrapperHideAnimation) {
        this.wrapperHideAnimation = wx.createAnimation({
          duration: duration,
          timingFunction: 'step-end',
        })
      }
      if (!this.maskAnimation) {
        this.maskAnimation = wx.createAnimation({
          duration: duration,
          timingFunction: 'linear',
        })
      }
      if (!this.topAnimation) {
        this.topAnimation = wx.createAnimation({
          duration: duration,
          timingFunction: 'linear',
        })
      }
      if (!this.bottomAnimation) {
        this.bottomAnimation = wx.createAnimation({
          duration: duration,
          timingFunction: 'linear',
        })
      }
      this.wrapperHideAnimation.left('-200%').top('-200%').step()
      this.maskAnimation.opacity(0).step()
      this.topAnimation.opacity(0).translateY(-30).step()
      this.bottomAnimation.translateY('100%').step()
      this.setData({
        wrapperAnimationData: this.wrapperHideAnimation.export(),
        maskAnimationData: this.maskAnimation.export(),
        topAnimationData: this.topAnimation.export(),
        bottomAnimationData: this.bottomAnimation.export()
      })
      if (e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.origin == 'mask') { // 如果是点击遮罩隐藏，则执行maskhide回调
        this.triggerEvent('maskhide')
      }
    },
    show: function (e) {
      this.showModal = true
      const duration = (e && e.duration) ? e.duration : 200
      if (!this.wrapperShowAnimation) {
        this.wrapperShowAnimation = wx.createAnimation({
          duration: duration,
          timingFunction: 'step-start',
        })
      }
      if (!this.maskAnimation) {
        this.maskAnimation = wx.createAnimation({
          duration: duration,
          timingFunction: 'linear',
        })
      }
      if (!this.topAnimation) {
        this.topAnimation = wx.createAnimation({
          duration: duration,
          timingFunction: 'linear',
        })
      }
      if (!this.bottomAnimation) {
        this.bottomAnimation = wx.createAnimation({
          duration: duration,
          timingFunction: 'linear',
        })
      }
      this.wrapperShowAnimation.left(0).top(0).step()
      this.maskAnimation.opacity(1).step()
      this.topAnimation.opacity(1).translateY(0).step()
      this.bottomAnimation.translateY(0).step()
      this.setData({
        wrapperAnimationData: this.wrapperShowAnimation.export(),
        maskAnimationData: this.maskAnimation.export(),
        topAnimationData: this.topAnimation.export(),
        bottomAnimationData: this.bottomAnimation.export()
      })
    },
    toggle: function () {
      if (this.showModal) {
        this.hide()
      } else {
        this.show()
      }
    }
  },
  ready() {
    this.initObserver()
  },
  detached() {
    this.clearObserver()
  }
})
