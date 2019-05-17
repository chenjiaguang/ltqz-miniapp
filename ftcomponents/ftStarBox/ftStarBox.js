// components/starBox/starBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    score: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
        this.generateStar(newVal)
      }
    },
    size: {
      type: Number,
      value: 24
    },
    showScoreText: {
      type: Boolean,
      value: true
    },
    color: { // 星星及字体颜色
      type: String,
      value: '#64B631'
    },
    startColor: { // 星星渐变（自上而下）初始颜色
      type: String,
      value: ''
    },
    endColor: { // 星星渐变（自上而下）结束颜色
      type: String,
      value: ''
    },
    emptyColor: {
      type: String,
      value: 'transparent'
    },
    maxScore: {
      type: Number,
      value: 5
    },
    touchable: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    stars: [],
    scoreText: '',
    showStar: false
  },

  ready: function () {
    const { score} = this.data
    this.generateStar(score)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    generateStar: function (score) {
      const { maxScore } = this.data
      let stars = []
      const scoreText = score.toFixed(1)
      let fullLen = parseInt(score)
      let decimal = score - fullLen
      for (let i = 0; i < maxScore; i++) {
        if (i < fullLen) {
          stars.push({ key: i, rate: 1 })
        } else if (i === fullLen) {
          stars.push({ key: i, rate: decimal })
        } else {
          stars.push({ key: i, rate: 0 })
        }
      }
      this.setData({
        stars,
        scoreText
      })
    },
    setStar: function (e) {
      this.triggerEvent('tap')
      if (!this.data.touchable) { // touchable -> 是否允许点击设置星星数
        return false
      }
      const {score} = e.currentTarget.dataset
      this.generateStar(score)
      this.triggerEvent('change', {score})
    },
    imageComplete: function () { // 无论加载成功或失败
      if (this.data.showStar) {
        return false
      }
      this.setData({
        showStar: true
      })
    }
  }
})
