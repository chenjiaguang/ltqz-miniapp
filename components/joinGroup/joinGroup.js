// components/joinGroup/joinGroup.js
import util from '../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    groupData: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    groupGetting: false,
    replyText: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getGroupData: function () {
      this.showModal()
    },
    hideModal: function () {
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.hide && ftModal.hide()
    },
    showModal: function () {
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.show && ftModal.show()
    },
  }
})
