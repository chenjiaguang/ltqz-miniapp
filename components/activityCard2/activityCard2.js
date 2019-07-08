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
        // this.initStatus(newVal)
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
    initStatus: function (activity) {
      let statusText = ''
      let statusDisabled = false
      let priceText = ''
      let isFree = false
      let hasMore = false
      if (activity.sale_type == 1) { // 普通
        const text = {
          0: '未上架',
          1: '报名中',
          2: '已满额',
          3: '已截止',
          4: '已截止',
          5: '已结束'
        }
        statusText = text[activity.status]
        statusDisabled = activity.status != 1
        priceText = (activity.min_price && activity.min_price) > 0 ? activity.min_price : '免费'
        isFree = !activity.min_price || activity.min_price == 0
        hasMore = activity.price_num > 1 && activity.min_price && activity.min_price > 0
      } else if (activity.sale_type == 2) { // 拼团
        const text = {
          0: '未上架',
          1: '报名中',
          2: '已满额',
          3: '已截止',
          4: '已截止',
          5: '已结束'
        }
        statusText = text[activity.status]
        statusDisabled = activity.status != 1
        priceText = (activity.min_pt_price && activity.min_pt_price > 0) ? activity.min_pt_price : '免费'
        isFree = !activity.min_pt_price || activity.min_pt_price == 0
        hasMore = activity.price_num > 1 && activity.min_pt_price && activity.min_pt_price > 0
      } else if (activity.sale_type == 3) { // 抢购
        const text = {
          0: '未上架',
          1: '预热中',
          2: '抢购中',
          3: '已抢光',
          8: '已结束'
        }
        statusText = text[activity.qg_status]
        statusDisabled = activity.qg_status != 1 && activity.qg_status != 2
        priceText = (activity.min_qg_price && activity.min_qg_price > 0) ? activity.min_qg_price : '免费'
        isFree = !activity.min_qg_price || activity.min_qg_price == 0
        hasMore = activity.price_num > 1 && activity.min_qg_price && activity.min_qg_price > 0
      }
      this.setData({
        statusText,
        statusDisabled,
        priceText,
        isFree,
        hasMore
      })
    },
    boxTap: function () {
      const { id } = this.data.activity
      this.triggerEvent('activitytap', { id })
    }
  }
})
