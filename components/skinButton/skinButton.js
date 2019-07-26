// components/skinButton/skinButton.js
import skinStyle from '../../utils/skinStyle.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'default'
    },
    disabled: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        this.initBackground({disabled: newVal})
      }
    },
    formType: String,
    hoverClass: {
      type: String,
      value: 'button-hover'
    },
    hoverStopPropagation: {
      type: Boolean,
      value: false
    },
    hoverStartTime: {
      type: Number,
      value: 20
    },
    hoverStayTime: {
      type: Number,
      value: 70
    },
    appParameter: String,
    gradient: {
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal) {
        this.initBackground({gradient: newVal})
      }
    },
    dark: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        this.initBackground({dark: newVal})
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    background: ''
  },

  lifetimes: {
    attached: function () {
      this.initBackground()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initBackground: function (val) {
      const {dark, gradient, disabled} = this.data
      let args = JSON.parse(JSON.stringify({dark, gradient, disabled}))
      if (val) {
        args = Object.assign({}, args, val)
      }
      let background = ''
      if (args.disabled) {
        background = skinStyle.disabledColor
      } else if (args.dark) {
        background = skinStyle.darkColor
      } else if (args.gradient) {
        background = 'linear-gradient(137deg, ' + skinStyle.mainGradient[0] + ', ' + skinStyle.mainGradient[1] + ')'
      }
      this.setData({background})
    },
    btnTap: function () {
      this.triggerEvent('buttontap', this.dataset)
    },
    btnGetPhoneNumber: function () {
      this.triggerEvent('getphonenumber', this.dataset)
    },
    btnContact: function () {
      this.triggerEvent('contact', this.dataset)
    },
    btnGetuserinfo: function () {
      this.triggerEvent('getuserinfo', this.dataset)
    },
    btnOpensetting: function () {
      this.triggerEvent('opensetting', this.dataset)
    },
    btnLaunchapp: function () {
      this.triggerEvent('launchapp', this.dataset)
    },
    btnError: function () {
      this.triggerEvent('error', this.dataset)
    }
  }
})
