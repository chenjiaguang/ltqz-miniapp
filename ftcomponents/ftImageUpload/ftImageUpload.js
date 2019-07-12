// ftcomponents/ftImageUpload/ftImageUpload.js
const fileUpload = require('../../utils/fileUpload.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    add() {
      wx.chooseImage({
        count: 9 - this.data.list.length,
        success: (res) => {
          let list = this.data.list
          res.tempFiles.map((item) => {
            return item.path
          }).splice(0, 9 - list.length).forEach((item) => {
            let tempId = Math.round(Math.random() * 999999999)
            list.push({
              url: item,
              tempId: tempId,
              id: ''
            })
            fileUpload.upload(item).then((res) => {
              let i = this.data.list.findIndex(function(value, index, arr) {
                return value.tempId == tempId;
              })
              this.setData({
                [`list[${i}].id`]: res.data.pic_id
              }, () => {
                this.onChange()
              })
            })
          })
          this.setData({
            list: list
          })
        }
      })
    },
    onChange() {
      this.triggerEvent('change', {
        ids: this.data.list.map((item) => {
          return item.id
        })
      })
    },
    del(e) {
      let i = e.currentTarget.dataset.idx
      let list = this.data.list
      list.splice(i, 1)
      this.setData({
        list: list
      }, () => {
        this.onChange()
      })
    }
  }
})