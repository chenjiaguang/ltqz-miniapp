// ftcomponents/ftModalBottom/ftModalBottom.js

let extraBottom = false
const systemInfo = wx.getSystemInfoSync()
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    extraBottom
  },

  showModal: false,
  
  /**
   * 组件的方法列表
   */
  methods: {
    stopPropagation: function () {
      return false
    },
    hide: function () {
      this.showModal = false
      if (!this.wrapperHideAnimation) {
        this.wrapperHideAnimation = wx.createAnimation({
          duration: 200,
          timingFunction: 'step-end',
        })
      }
      if (!this.maskAnimation) {
        this.maskAnimation = wx.createAnimation({
          duration: 200,
          timingFunction: 'linear',
        })
      }
      if (!this.topAnimation) {
        this.topAnimation = wx.createAnimation({
          duration: 200,
          timingFunction: 'linear',
        })
      }
      if (!this.bottomAnimation) {
        this.bottomAnimation = wx.createAnimation({
          duration: 200,
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
    },
    show: function () {
      this.showModal = true
      if (!this.wrapperShowAnimation) {
        this.wrapperShowAnimation = wx.createAnimation({
          duration: 200,
          timingFunction: 'step-start',
        })
      }
      if (!this.maskAnimation) {
        this.maskAnimation = wx.createAnimation({
          duration: 200,
          timingFunction: 'linear',
        })
      }
      if (!this.topAnimation) {
        this.topAnimation = wx.createAnimation({
          duration: 200,
          timingFunction: 'linear',
        })
      }
      if (!this.bottomAnimation) {
        this.bottomAnimation = wx.createAnimation({
          duration: 200,
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
  }
})
