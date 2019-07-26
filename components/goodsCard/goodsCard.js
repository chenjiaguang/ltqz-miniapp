// components/goodsCard/goodsCard.js
import statusHelper from '../../utils/statusHelper'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goods: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { // 初始化状态
        // 属性值变化时执行
        if (newVal) {
          const priceObj = statusHelper.getPriceText(newVal.type, newVal.sale_type, newVal.status, newVal.qg_status, newVal.min_price, newVal.min_pt_price, newVal.min_qg_price, newVal.price_num)
          this.setData(priceObj)
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
    priceText: '125',
    isFree: false,
    hasMore: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    boxTap: function () {
      const { id } = this.data.goods
      this.triggerEvent('goodstap', { id })
    },
    shareTap: function (e) {
      const { id } = this.data.goods
      this.triggerEvent('share', { id })
    }
  }
})
