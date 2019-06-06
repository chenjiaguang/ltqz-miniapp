// components/drawPoster/drawPoster.js
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
    posterStyle: {
      textColor: '#333',
      tipColor: '#999',
      textShadowColor: '#FFC987'
    },
    hAvatar: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2652953858,1039653315&fm=27&gp=0.jpg',
    hName: '@花心萝卜腿',
    hTip: '发起了拼团，邀请你参与拼团~',
    banner: 'http://img1.imgtn.bdimg.com/it/u=3587751191,555161372&fm=26&gp=0.jpg',
    title: '从5万到100万，给家庭投资赋能小天才凯叔滴滴答答叽叽喳喳从5万到100万，给家庭投资赋能小天才凯叔滴滴答答叽叽喳喳…'
  },

  attached: function () {
    setTimeout(() => {
      this.draw()
    }, 500)
    // this.draw()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    draw: function () {
      console.log('draw', this)
      this.createSelectorQuery().selectAll('.draw-text').fields({
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['fontSize', 'color', 'lineHeight'],
        context: true,
      }, res => {
        res.forEach(res => {
          console.log('res', res)
          res.id      // 节点的ID
          res.dataset // 节点的dataset
          res.left    // 节点的左边界坐标
          res.right   // 节点的右边界坐标
          res.top     // 节点的上边界坐标
          res.bottom  // 节点的下边界坐标
          res.width   // 节点的宽度
          res.height  // 节点的高度
        })
      }).exec()
    }
  }
})
