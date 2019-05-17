// components/commentBox/commentBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    role: { // role：角色，【user/business】，user表示普通用户，始终不会出现回复按钮，只能查看，business表示商家，在未回复过的情况下可以回复
      type: String,
      value: 'user'
    },
    showGoods: {
      type: Boolean,
      value: false
    },
    showTicket: {
      type: Boolean,
      value: false
    },
    comment: {
      type: Object,
      value: {}
    },
    topBorder: {
      type: Boolean,
      value: false
    },
    bottomBorder: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    viewImages: function(e) {
      console.log('viewImages', e)
      const {
        idx
      } = e.currentTarget.dataset
      const {
        img_urls
      } = this.data.comment
      const current = img_urls[idx]
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: img_urls // 需要预览的图片http链接列表
      })
    },
    reply: function() {
      const {
        id,
        user
      } = this.data.comment
      this.triggerEvent('reply', {
        id,
        username: user.name
      })
    }
  }
})