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
    taped: false,
    extraBottom,
    showModal: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    stopPropagation: function () {
      return false
    },
    hide: function () {
      console.log('hide')
      this.setData({ showModal: false, taped: true })
    },
    show: function () {
      this.setData({ showModal: true, taped: true})
    }
  }
})
