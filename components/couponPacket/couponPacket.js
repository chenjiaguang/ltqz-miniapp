// components/couponPacket/couponPacket.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupons: {
      type: Array,
      value: [
        {
          id: '1',
          price: 20000,
          show_price: 200,
          threshold: 0,
          threshold_text: '无金额门槛',
          title: '此处为优惠券名称此处为优 惠券名称',
          tip: '2019-08-13 至 2019-08-20',
          received: false
        },
        {
          id: '2',
          price: 2000,
          show_price: 20,
          threshold: 10000,
          threshold_text: '满100可用',
          title: '此处为优惠券名称此处',
          tip: '2019-08-13 至 2019-08-20',
          received: true
        },
        {
          id: '3',
          price: 20000,
          show_price: 200,
          threshold: 0,
          threshold_text: '无金额门槛',
          title: '此处为优惠券名称此处为优 惠券名称',
          tip: '自领取之日起X天内有效',
          received: false
        },
        {
          id: '4',
          price: 2000,
          show_price: 20,
          threshold: 10000,
          threshold_text: '满100可用',
          title: '此处为优惠券名称此处为优 惠券名称',
          tip: '在2019-08-20前可用',
          received: true
        },
        {
          id: '5',
          price: 200,
          show_price: 2,
          threshold: 0,
          threshold_text: '无金额门槛',
          title: '此处为优惠券名称此处为优 惠券名称',
          tip: '2019-08-13 至 2019-08-20',
          received: false
        }
      ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
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
      console.log('imageLoaded', ele)
      if (!this[ele + 'Loaded']) {
        this[ele + 'Loaded'] = true
      }
      if (this.bgLoaded && this.footerLoaded && this.uncheckLoaded && this.checkedLoaded) {
        this.toggleModal()
      }
    }
  }
})
