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
        this.initShowList(newVal)
        // if (newVal && newVal.length && this.data.rects[0]) {
        //   this.initRectObserver()
        // }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    minTop: 0,
    showList: [],
    rects: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    consss(data) {
      console.log('consss', data)
    },
    changePos ({newIndex, oldIndex}) {
      const {showList} = this.data
      let arr = showList.filter((item, idx) => idx !== oldIndex)
      arr.splice(newIndex, 0, showList[oldIndex])
      this.initShowList(arr)
    },
    initShowList (list) {
      console.log('initShowList', list)
      this.setData({showList: list, disableMove: true})
      wx.nextTick(() => {
        this.setData({disableMove: false})
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
          this.setData({rects: rectsList, minTop: min_top})
        }
      }).exec()
    },
    vibrateShort() {
      wx.vibrateShort()
    }
  }
})
