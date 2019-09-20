// components/activityCard2/activityCard2.js
import statusHelper from '../../utils/statusHelper'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activity: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { // 初始化状态
        // 属性值变化时执行
        if (newVal) {
          const statusObj = statusHelper.getCardText(newVal.type, newVal.sale_type, newVal.status, newVal.qg_status)
          const priceObj = statusHelper.getPriceText(newVal.type, newVal.sale_type, newVal.status, newVal.qg_status, newVal.min_price, newVal.min_pt_price, newVal.min_qg_price, newVal.price_num)
          let _obj = Object.assign({}, statusObj, priceObj)
          this.setData(_obj)
        }
      }
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
    statusText: '',
    statusDisabled: false,
    priceText: '',
    isFree: false,
    hasMore: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    boxTap: function () {
      const { id } = this.data.activity
      this.triggerEvent('activitytap', { id })
    }
  }
})
