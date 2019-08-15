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
          this.initShowList(newVal)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    minTop: 0,
    showList: [],
    rects: [],
    disableMove: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initShowList (list) {
      console.log('ddd')
      this.setData({showList: list, disableMove: true})
      wx.nextTick(() => {
        this.initRectObserver()
      })
    },
    initRectObserver() {
      console.log('initRectObserver')
      this.createSelectorQuery().selectAll('.item').boundingClientRect((rects) => {
        if (rects && rects.length) {
          let rectsList = new Array(rects.length)
          let min_top = Number.POSITIVE_INFINITY
          rects.forEach((rect) => {
            if (rect.top < min_top) {
              min_top = rect.top
            }
            rectsList[rect.dataset.index] = {top: rect.top, height: rect.height, y: 0}
          })
          rectsList.forEach(rect => {
            rect.top -= min_top
          })
          console.log('rectsList', rectsList)
          this.setData({rects: rectsList, minTop: min_top, disableMove: false})
        }
      }).exec()
    },
    vibrateShort() {
      wx.vibrateShort()
    },
    sortChange(sortArr) {
      console.log('sortArr', sortArr)
    }
  },

  ready () {
    if (this.data.list && this.data.list.length) {
      this.initShowList(this.data.list)
    }
  }
})
