// components/ftTableList/ftTableList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tableData: {
      type: Object,
      value: []
    },
    fontSize: {
      type: Number,
      value: 28
    },
    lineHeight: {
      type: String,
      value: '1.3'
    },
    titleColor: {
      type: String,
      value: '#333'
    },
    titleStyle: {
      type: String,
      value: ''
    },
    contentColor: {
      type: String,
      value: '#666'
    },
    titleAlign: {
      type: String,
      value: 'justify',
    },
    spacing: {
      type: Number,
      value: 12
    },
    contentLine: {
      type: String,
      value: ''
    },
    showColon: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    titleAlignText: {
      justify: 'space-between'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    contentTap: function (e) {
      console.log('dffd')
      const {content, isphone} = e.currentTarget.dataset
      if (isphone && content) {
        wx.makePhoneCall({
          phoneNumber: content.toString()
        })
      }
    }
  }
})
