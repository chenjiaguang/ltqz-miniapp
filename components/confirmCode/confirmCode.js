// components/confirmCode/confirmCode.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    confirming: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    maxLength: 4,
    title: '请输入工作人员出示的核销码进行核销',
    btnText: '确认核销',
    focus: false,
    codeArr: [],
    cursor: 0,
    codeStr: '',
    actived: false
  },

  attached: function () {
    const { maxLength} = this.data
    let arr = []
    for (let i = 0; i < maxLength; i++) {
      arr.push(i)
    }
    this.setData({
      codeArr: arr
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    codeInput: function (e) {
      let { value, cursor } = e.detail
      console.log('codeInput', value, cursor)
      this.setData({
        cursor: cursor,
        codeStr: value
      })
    },
    onFocus: function (e) {
      let { focus, codeStr} = this.data
      console.log('onFocus', codeStr, focus)
      if (focus) return false
      this.setData({
        focus: true
      })
    },
    onBlur: function (e) {
      this.setData({
        focus: false
      })
    },
    open: function (e) {
      let {maxLength, title, btnText} = e
      let _obj = {}
      if (maxLength) {
        _obj.maxLength = maxLength
        let arr = []
        for (let i = 0; i < maxLength; i++) {
          arr.push(i)
        }
        _obj.codeArr = arr
      }
      if (title) _obj.title = title
      if (btnText) _obj.btnText = btnText
      _obj.cursor = 0
      _obj.focus = false
      _obj.codeStr = ''
      _obj.actived = true
      this.setData(_obj)
    },
    close: function () {
      this.setData({
        cursor: 0,
        focus: false,
        codeStr: '',
        actived: false
      })
    },
    confirm: function () {
      const { maxLength, codeStr, confirming} = this.data
      if (codeStr.length !== maxLength || confirming) {
        return false
      }
      this.triggerEvent('confirm', { value: codeStr, ctx: this})
    },
    stopPropagation: function () {
      return false
    }
  }
})
