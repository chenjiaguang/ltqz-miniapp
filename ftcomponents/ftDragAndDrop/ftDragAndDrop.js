// ftcomponents/ftDragAndDrop/ftDragAndDrop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if (newVal && newVal.length && this.data.rects[0]) {
          this.initRectObserver()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    minTop: 0,
    rects: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    consss(data) {
      console.log('consss', data)
    },
    initRectObserver() {
      this.createSelectorQuery().selectAll('.item').boundingClientRect((rects) => {
        if (rects && rects.length) {
          let rectsList = new Array(rects.length)
          let min_top = Number.POSITIVE_INFINITY
          rects.forEach((rect) => {
            if (rect.top < min_top) {
              min_top = rect.top
            }
            rectsList[rect.dataset.index] = {top: rect.top, height: rect.height, sort: rect.dataset.index}
          })
          rectsList.forEach(rect => {
            rect.top -= min_top
          })
          this.setData({rects: rectsList, minTop: min_top})
        }
      }).exec()
    },
    resetSort: function () {

    },
    vibrateShort() {
      wx.vibrateShort()
    }
  },
  ready() {
    this.initRectObserver()
  }
})
