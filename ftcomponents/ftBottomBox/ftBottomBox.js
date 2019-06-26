// ftcomponents/ftBottomBox/ftBottomBox.js
let extraBottom = false
const systemInfo = wx.getSystemInfoSync()
const isIos = systemInfo.system.indexOf('iOS') !== -1
const higher = systemInfo.screenHeight > 736
if (isIos && higher) {
  extraBottom = true
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    boxHeight: {
      type: Number,
      value: 0
    },
    bg: {
      type: String,
      value: 'transparent'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    extraBottom
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
