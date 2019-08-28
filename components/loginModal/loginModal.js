// components/loginModal/loginModal.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    stopPropagation: function () {
      return false
    },
    hideModal: function () {
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.hide && ftModal.hide()
    },
    showModal: function () {
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.show && ftModal.show()
    },
    navToPermission: function () {
      this.hideModal()
      this.navigateTo({
        url: '/pages/permission/permission'
      })
    }
  }
})
