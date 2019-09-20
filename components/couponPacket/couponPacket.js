// components/couponPacket/couponPacket.js
import util from '../../utils/util.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupons: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    received: {}
  },

  isImageLoaded: {
    bg: false,
    footer: false,
    uncheck: false,
    checked: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    stopPropagation: function () {
      return false
    },
    toggleModal: function () {
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.toggle && ftModal.toggle()
    },
    imageLoaded: function (e) {
      const {ele} = e.currentTarget.dataset
      if (!this[ele + 'Loaded']) {
        this[ele + 'Loaded'] = true
      }
      if (this.bgLoaded && this.footerLoaded && this.uncheckLoaded && this.checkedLoaded) {
        if (this.firstShow) {
          return false
        }
        this.firstShow = true
        this.toggleModal()
      }
    },
    receiveCoupon: function (e) {
      if (!util.checkLogin('navPermission')) {
        return false
      }
      const {received} = this.data
      const {coupon} = e.currentTarget.dataset
      if (received[coupon.id] || (this.receiving && this.receiving[coupon.id])) { // 不可领 或 正在领
        return false
      }
      let rData = {
        coupon_id: coupon.id
      }
      if (!this.receiving) {
        this.receiving = {}
      }
      this.receiving[coupon.id] = true
      util.request('/coupon/get', rData).then(res => {
        if (res.error === 0 || res.error === '0') {
          this.setData({
            ['received.' + coupon.id]: true
          })
          if (res.data) {
            this.triggerEvent('couponchange', {coupon: res.data})
          }
        }
      }).finally(res => {
        this.receiving[coupon.id] = false
      })
    },
    goCouponlist: function () {
      this.navigateTo({
        url: '/pages/couponlist/couponlist'
      })
    }
  }
})
