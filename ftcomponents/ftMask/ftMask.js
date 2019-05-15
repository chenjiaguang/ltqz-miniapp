// ftcomponents/ftMask/ftMask.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        if (newVal != oldVal) {
          if (newVal == true) {
            this.setData({
              ahead: true,
              render: true
            })
          } else {
            this.setData({
              render: false
            }, () => {
              setTimeout(() => {
                this.setData({
                  ahead: false
                })
              }, 300)
            })
          }
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    render: false,
    ahead: false
  },

  ready() {},
  /**
   * 组件的方法列表
   */
  methods: {
    hide() {
      this.setData({
        show: false
      })
    }
  }
})