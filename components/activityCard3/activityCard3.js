// components/activityCard3/activityCard3.js
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
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusText: '',
    statusDisabled: false,
    priceText: '',
    isFree: false,
    hasMore: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goGoodsdetail: function (e) {
      const {productid} = e.currentTarget.dataset
      this.navigateTo({
        url: `/pages/goodsdetail/goodsdetail?id=${productid}`
      })
    },
    goSignUpManager(e) {
      const {shopid, productid, status, type} = e.currentTarget.dataset
      this.navigateTo({
        url: `/pages/signupmanager/signupmanager?id=${shopid}&product_id=${productid}&status=${status}&type=${type}`
      })
    }
  }
})