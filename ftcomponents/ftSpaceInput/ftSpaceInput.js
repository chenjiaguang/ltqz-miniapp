// ftcomponents/ftSpaceInput/ftSpaceInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    default: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        this.inputChange({detail: {value: newVal}})
      }
    },
    space: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getSpaceVal: function (string) {
      let val = ''
      let space = this.data.space.concat([])
      if (string && space && space.length) {
        space.forEach((item, idx) => {
          let str = ''
          if (idx === 0) { // 第一个
            str = string.substring(0, item)
          } else if (idx === space.length - 1) { // 最后一个
            if (string.substring(space[idx - 1], item)) {
              str += ' ' + string.substring(space[idx - 1], item)
            }
            if (string.substring(item)) {
              str += ' ' + string.substring(item)
            }
          } else {
            if (string.substring(space[idx - 1], item)) {
              str += ' ' + string.substring(space[idx - 1], item)
            }
          }
          val += str
        })
      } else {
        val = string
      }
      return val
    },
    inputChange: function (e) {
      const {value} = e.detail
      const newStr = value.replace(/\s+/g, '')
      let newVal = this.getSpaceVal(newStr)
      this.setData({value: newVal})
      this.triggerEvent('valuechange', {value: newStr})
    }
  }
})
