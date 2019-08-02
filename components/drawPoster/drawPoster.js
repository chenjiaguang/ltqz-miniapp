// components/drawPoster/drawPoster.js
import util from '../../utils/util.js'
const app = getApp()

let systemInfo = app.globalData.systemInfo || wx.getSystemInfoSync()
let MenuButtonInfo = app.globalData.MenuButtonInfo || wx.getMenuButtonBoundingClientRect()

const statusBarHeight = systemInfo.statusBarHeight
const menuTopSpace = MenuButtonInfo.top - statusBarHeight
const menuHeight = MenuButtonInfo.height
const navBoxHeight = menuTopSpace * 2 + menuHeight // 导航胶囊上下分别留6px的间隔
const navWrapperHeight = statusBarHeight + navBoxHeight

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hideComponent: { // 是否在分享时显示相应的界面
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navWrapperHeight,
    fetching: false, // 是否正在拉取数据
    drawing: false, // 是否正在画图
    huodongId: '',
    tuanId: '',
    localPoster: '',
    fenxiao_price: '',
    canShareFriend: false,
    showHideClass: {
      1: ' hide',
      2: ' show'
    },
    uid: ''
  },

  attached: function () {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    draw: function (drawSuccess) { // drawSuccess在生成图片成功时会回调，并传入图片临时地址
      this.setData({
        drawing: true
      }, () => {
        this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing })
      })
      this.createSelectorQuery().select('#wrapper').boundingClientRect(rect => {
        const ctx = wx.createCanvasContext('c-draw-poster', this)
        ctx.fillStyle = '#FFFFFF'
        this.posterWidth = rect.width
        this.posterHeight = rect.height
        ctx.fillRect(0, 0, rect.width, rect.height)
        this.createSelectorQuery().selectAll('.draw-image').fields({
          dataset: true,
          rect: true,
          size: true,
          scrollOffset: true,
          properties: ['src'],
          computedStyle: ['borderRadius'],
        }, res => {
          this.imageLen = res.length
          this.drawImage(res, ctx, 0, drawSuccess)
        }).exec()
      }).exec()
    },
    canvasError: function () {
      this.setData({
        drawing: false
      }, () => {
        this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing })
      })
    },
    drawImage: function (imageData, ctx, idx, drawSuccess) {
      wx.getImageInfo({
        src: imageData[idx].src,
        success: (res) => {
          // 按照aspectfill的方式截取
          const img_width = res.width
          const img_height = res.height
          const draw_height = imageData[idx].height
          const draw_width = imageData[idx].width
          let clip_left, clip_top, clip_width, clip_height // 左偏移值，上偏移值，截取宽度，截取高度
          clip_height = img_width * (draw_height / draw_width)
          if (clip_height > img_height) {
            clip_height = img_height
            clip_width = clip_height * (draw_width / draw_height)
            clip_left = (img_width - clip_width) / 2
            clip_top = 0
          } else {
            clip_left = 0
            clip_top = (img_height - clip_height) / 2
            clip_width = img_width
          }
          const banner_clip = { clip_left, clip_top, clip_width, clip_height }
          if (parseInt(imageData[idx].borderRadius) > 0) {
            ctx.save()
            ctx.beginPath()
            ctx.arc((imageData[idx].left + (imageData[idx].width / 2)), (imageData[idx].top + (imageData[idx].height / 2)), imageData[idx].width / 2, 0, 2 * Math.PI)
            ctx.closePath()
            ctx.clip()
            ctx.drawImage(imageData[idx].dataset.islocal ? imageData[idx].src : res.path, banner_clip.clip_left, banner_clip.clip_top, banner_clip.clip_width, banner_clip.clip_height, imageData[idx].left, imageData[idx].top, imageData[idx].width, imageData[idx].height)
            ctx.restore()
          } else {
            ctx.drawImage(imageData[idx].dataset.islocal ? imageData[idx].src : res.path, banner_clip.clip_left, banner_clip.clip_top, banner_clip.clip_width, banner_clip.clip_height, imageData[idx].left, imageData[idx].top, imageData[idx].width, imageData[idx].height)
          }
          if ((idx + 1) == imageData.length) {
            // ctx.draw(true, () => {
            //   this.drawFillFunc(ctx, drawSuccess)
            // })
            this.drawFillFunc(ctx, drawSuccess)
          } else {
            // ctx.draw(true, () => {
            //   this.drawImage(imageData, ctx, idx + 1, drawSuccess)
            // })
            this.drawImage(imageData, ctx, idx + 1, drawSuccess)
          }
        }
      })
    },
    drawFill: function (fillData, ctx, idx, drawSuccess) {
      let radius = {
        lt: 0,
        rt: 0,
        rb: 0,
        rl: 0
      }
      if (fillData[idx].borderRadius) {
        const radiusArr = fillData[idx].borderRadius.split(' ')
        radius.lt = parseInt(radiusArr[0])
        radius.rt = parseInt(radiusArr[1] || radiusArr[0])
        radius.rb = parseInt(radiusArr[2] || radiusArr[0])
        radius.lb= parseInt(radiusArr[3] || radiusArr[1] || radiusArr[0])
      }
      const x1 = fillData[idx].left + radius.lt
      const y1 = fillData[idx].top + radius.lt
      const r1 = radius.lt
      const sA1 = Math.PI
      const eA1 = 1.5 * Math.PI
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(fillData[idx].left, fillData[idx].top + r1)
      ctx.arc(x1, y1, r1, sA1, eA1)
      ctx.lineTo(fillData[idx].right - r1, fillData[idx].top)
      const x2 = fillData[idx].right - radius.rt
      const y2 = fillData[idx].top + radius.rt
      const r2 = radius.rt
      const sA2 = 1.5 * Math.PI
      const eA2 = 2 * Math.PI
      ctx.arc(x2, y2, r2, sA2, eA2)
      ctx.lineTo(fillData[idx].right, fillData[idx].bottom - r2)
      const x3 = fillData[idx].right - radius.rb
      const y3 = fillData[idx].bottom - radius.rb
      const r3 = radius.rb
      const sA3 = 0
      const eA3 = 0.5 * Math.PI
      ctx.arc(x3, y3, r3, sA3, eA3)
      ctx.lineTo(fillData[idx].left + r3, fillData[idx].bottom)
      const x4 = fillData[idx].left + radius.lb
      const y4 = fillData[idx].bottom - radius.lb
      const r4 = radius.lb
      const sA4 = 0.5 * Math.PI
      const eA4 = Math.PI
      ctx.arc(x4, y4, r4, sA4, eA4)
      ctx.lineTo(fillData[idx].left, fillData[idx].top + r4)
      ctx.fillStyle = fillData[idx].backgroundColor
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      if ((idx + 1) == fillData.length) {
        // ctx.draw(true, () => {
        //   this.drawStrokeFunc(ctx, drawSuccess)
        // })
        this.drawStrokeFunc(ctx, drawSuccess)
      } else {
        // ctx.draw(true, () => {
        //   this.drawFill(fillData, ctx, idx + 1, drawSuccess)
        // })
        this.drawFill(fillData, ctx, idx + 1, drawSuccess)
      }
    },
    drawStroke: function (strokeData, ctx, idx, drawSuccess) {
      let radius = {
        lt: 0,
        rt: 0,
        rb: 0,
        rl: 0
      }
      if (strokeData[idx].borderRadius) {
        const radiusArr = strokeData[idx].borderRadius.split(' ')
        radius.lt = parseInt(radiusArr[0])
        radius.rt = parseInt(radiusArr[1] || radiusArr[0])
        radius.rb = parseInt(radiusArr[2] || radiusArr[0])
        radius.lb = parseInt(radiusArr[3] || radiusArr[1] || radiusArr[0])
      }
      const x1 = strokeData[idx].left + radius.lt
      const y1 = strokeData[idx].top + radius.lt
      const r1 = radius.lt
      const sA1 = Math.PI
      const eA1 = 1.5 * Math.PI
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(strokeData[idx].left, strokeData[idx].top + r1)
      ctx.arc(x1, y1, r1, sA1, eA1)
      ctx.lineTo(strokeData[idx].right - r1, strokeData[idx].top)
      const x2 = strokeData[idx].right - radius.rt
      const y2 = strokeData[idx].top + radius.rt
      const r2 = radius.rt
      const sA2 = 1.5 * Math.PI
      const eA2 = 2 * Math.PI
      ctx.arc(x2, y2, r2, sA2, eA2)
      ctx.lineTo(strokeData[idx].right, strokeData[idx].bottom - r2)
      const x3 = strokeData[idx].right - radius.rb
      const y3 = strokeData[idx].bottom - radius.rb
      const r3 = radius.rb
      const sA3 = 0
      const eA3 = 0.5 * Math.PI
      ctx.arc(x3, y3, r3, sA3, eA3)
      ctx.lineTo(strokeData[idx].left + r3, strokeData[idx].bottom)
      const x4 = strokeData[idx].left + radius.lb
      const y4 = strokeData[idx].bottom - radius.lb
      const r4 = radius.lb
      const sA4 = 0.5 * Math.PI
      const eA4 = Math.PI
      ctx.arc(x4, y4, r4, sA4, eA4)
      ctx.lineTo(strokeData[idx].left, strokeData[idx].top + r4)
      ctx.strokeStyle = strokeData[idx].borderColor
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
      if ((idx + 1) == strokeData.length) {
        // ctx.draw(true, () => {
        //   this.drawTextFunc(ctx, drawSuccess)
        // })
        this.drawTextFunc(ctx, drawSuccess)
      } else {
        // ctx.draw(true, () => {
        //   this.drawStroke(strokeData, ctx, idx + 1, drawSuccess)
        // })
        this.drawStroke(strokeData, ctx, idx + 1, drawSuccess)
      }
    },
    drawText: function (textData, ctx, idx, drawSuccess) {
      const alignObj = {start: 'left', center: 'center', end: 'right'}
      ctx.save()
      ctx.font = parseInt(textData[idx].fontSize) + 'px sans-serif'
      ctx.setTextAlign(alignObj[textData[idx].textAlign])
      ctx.setTextBaseline('middle')
      ctx.fillStyle = textData[idx].color
      if (textData[idx].dataset.maxline && textData[idx].dataset.maxlength) {
        const chr = textData[idx].dataset.text
        let temp = ""
        let _row = []
        for (let char of chr) {
          if (((temp + (char)).length <= textData[idx].dataset.maxlength)) {
            temp += char
          } else {
            _row.push(temp)
            temp = char
          }
        }
        _row.push(temp)
        let row = _row.filter((item, _idx) => _idx < textData[idx].dataset.maxline)
        if (_row.length >= textData[idx].dataset.maxline && _row[row.length - 1].length >= textData[idx].dataset.maxlength) {
          row[row.length - 1] = row[row.length - 1] + '...'
        }
        if (row.length != Math.round(textData[idx].height / parseInt(textData[idx].lineHeight))) { // 实际上没有超过最大宽度，但是按照20个字一行来算确超过时，修正
          const realRowNum = Math.round(textData[idx].height / parseInt(textData[idx].lineHeight))
          row[realRowNum - 1] = row[realRowNum - 1] + row[realRowNum]
          row = row.filter((item, idx) => idx < realRowNum)
        }
        for (let b = 0; b < row.length; b++) {
          ctx.fillText(row[b], alignObj[textData[idx].textAlign] == 'center' ? (textData[idx].left + textData[idx].width / 2) : textData[idx].left + parseInt(textData[idx].paddingLeft) + parseInt(textData[idx].borderLeftWidth), textData[idx].top + parseInt(textData[idx].paddingTop) + parseInt(textData[idx].borderTopWidth) + parseInt(textData[idx].lineHeight) * (b + (1 / 2)), textData[idx].width)
        }
      } else {
        ctx.fillText(textData[idx].dataset.text, alignObj[textData[idx].textAlign] == 'center' ? (textData[idx].left + textData[idx].width / 2) : textData[idx].left + parseInt(textData[idx].paddingLeft) + parseInt(textData[idx].borderLeftWidth), textData[idx].top + parseInt(textData[idx].paddingTop) + parseInt(textData[idx].borderTopWidth) + parseInt(textData[idx].lineHeight) / 2, textData[idx].width)
      }
      ctx.restore()
      this.textLen -= 1
      if ((idx + 1) == textData.length) {
        ctx.draw(true, () => {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              canvasId: 'c-draw-poster',
              success: res => {
                const query = this.createSelectorQuery().select('#top-wrapper').boundingClientRect(rect => {
                  if (rect) { // #top-wrapper有可能时隐藏状态的，所以做此判断
                    let width = 0
                    let height = 0
                    rect.height = rect.height - 44
                    const posterRatio = this.posterWidth / this.posterHeight
                    const topWrapperRatio = rect.width / rect.height
                    if (posterRatio < topWrapperRatio) {
                      height = rect.height * 0.88
                      width = height * posterRatio
                    } else {
                      width = rect.width * 0.88
                      height = width / posterRatio
                    }
                    this.setData({
                      posterWidth: width,
                      posterHeight: height
                    })
                  }
                }).exec()
                let localPoster = res.tempFilePath
                this.setData({
                  localPoster: localPoster,
                  drawing: false
                }, () => {
                  this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing })
                  drawSuccess && drawSuccess(localPoster)
                })
              },
              fail: res => {
                console.log('fail_res', res)
                this.setData({
                  drawing: false
                }, () => {
                  this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing })
                })
              }
            }, this)
          }, 200)
        })
      } else {
        // ctx.draw(true, () => {
        //   this.drawText(textData, ctx, idx + 1, drawSuccess)
        // })
        this.drawText(textData, ctx, idx + 1, drawSuccess)
      }
    },
    drawFillFunc: function (ctx, drawSuccess) {
      this.createSelectorQuery().selectAll('.draw-fill').fields({
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['borderRadius', 'backgroundColor']
      }, res => {
        if (!res.length) {
          this.drawStrokeFunc(ctx, drawSuccess)
          return false
        }
        this.drawFill(res, ctx, 0, drawSuccess)
      }).exec()
    },
    drawStrokeFunc: function (ctx, drawSuccess) {
      this.createSelectorQuery().selectAll('.draw-stroke').fields({
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['borderRadius', 'borderColor']
      }, res => {
        if (!res.length) { // 不存在stroke类型时，直接跳过
          this.drawTextFunc(ctx, drawSuccess)
          return false
        }
        this.drawStroke(res, ctx, 0, drawSuccess)
      }).exec()
    },
    drawTextFunc: function (ctx, drawSuccess) {
      this.createSelectorQuery().selectAll('.draw-text').fields({
        dataset: true,
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['fontSize', 'color', 'lineHeight', 'textAlign', 'paddingLeft', 'paddingTop', 'borderLeftWidth', 'borderTopWidth']
      }, res => {
        // const arr = res.map(item => {
        //   return { fontsize: item.fontSize, dataset: item.dataset, lineHeight: item.lineHeight, color: item.color }
        // })
        this.drawText(res, ctx, 0, drawSuccess)
      }).exec()
    },
    getPosterData: function (huodong_id, tuan_id, dataSuccess) { // dataSuccess在成功获取后执行
      const { fetching } = this.data
      if (fetching) { // 正在拉取数据
        return false
      }
      let rData = {
        id: huodong_id,
        tuan_id: tuan_id
      }
      this.setData({
        huodongId: huodong_id || '',
        tuanId: tuan_id || '',
        localPoster: '',
        canShareFriend: false,
        fenxiao_price: '',
        fetching: true
      }, () => {
        this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing })
      })
      util.request('/product/share', rData).then(res => {
        if (res.data) {
          let data = res.data
          let _obj = {}
          _obj.saleType = data.sale_type
          _obj.uid = data.user.id
          _obj.hAvatar = data.user.avatar
          _obj.hName = data.user.nick_name
          _obj.hTip = (data.sale_type == 2 && tuan_id) ? '发起了拼团，邀请你参与拼团~' : '发现了一个宝贝，想要跟你分享~'
          _obj.banner = data.product_cover_url || data.cover_url
          _obj.title = data.title
          let price = ''
          if (data.sale_type == 1) { // 普通
            price = util.formatMoney(data.min_price).showMoney
          } else if (data.sale_type == 2) { // 拼团
            price = util.formatMoney(data.min_pt_price).showMoney
          } else if (data.sale_type == 3) { // 抢购
            price = util.formatMoney(data.min_qg_price).showMoney
          }
          _obj.price = price
          _obj.fenxiao_price = data.fenxiao_price
          _obj.pintuan = data.spell_num
          _obj.joinNumber = data.join_num
          _obj.joinUsers = []
          if (data.tuan && data.tuan.tuanRecord && data.tuan.tuanRecord[0]) {
            let recordArr = [].concat(data.tuan.tuanRecord)
            let leftNum = data.spell_num - data.tuan.tuanRecord.length
            if (leftNum > 0) {
              for (let i = 0; i < leftNum; i++) {
                recordArr.push({ id: new Date().getTime() + i })
              }
            }
            _obj.joinUsers = recordArr
            _obj.leftNum = leftNum
          }
          _obj.qrcode = data.miniqr
          this.setData(_obj, dataSuccess)
        }
      }).catch(err => {

      }).finally(res => {
        this.setData({
          fetching: false
        }, () => {
          this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing })
        })
      })
    },
    startDraw: function (huodong_id, tuan_id) {
      this.showPoster()
      const { huodongId, tuanId, localPoster } = this.data
      if (huodong_id == huodongId && ((!tuan_id && !tuanId) || tuan_id == tuanId) && localPoster) { // 之前已经画过
        return false
      }
      const dataSuccess = () => {
        this.initShare()
        this.draw()
      }
      this.getPosterData(huodong_id, tuan_id, dataSuccess)
    },
    startDrawAndSavePoster: function (huodong_id, tuan_id) {
      const { huodongId, tuanId, localPoster } = this.data
      if (huodong_id == huodongId && ((!tuan_id && !tuanId) || tuan_id == tuanId) && localPoster) { // 之前已经画过
        this.savePoster()
        return false
      }
      const dataSuccess = () => {
        this.draw(() => {
          this.savePoster()
        })
      }
      this.getPosterData(huodong_id, tuan_id, dataSuccess)
    },
    showPoster: function () {
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.toggle && ftModal.toggle()
      this.initShare()
    },
    hidePoster: function () {
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.toggle && ftModal.toggle()
      this.recoverShare()
    },
    initShare: function () {
      const { title, banner, huodongId, tuanId, fenxiao_price, uid, saleType, hName } = this.data
      if (title && banner && huodongId) { // 存在数据
        let path = ''
        if (huodongId && tuanId) { // 分享团
          path += '/pages/pintuandetail/pintuandetail?id=' + tuanId
        } else if (huodongId && !tuanId) { // 分享商品
          path += '/pages/goodsdetail/goodsdetail?id=' + huodongId
        }
        if (fenxiao_price && uid) { // 有分销红利
          path += ('&uid=' + uid)
        }
        const pages = getCurrentPages()
        const page = pages[pages.length - 1]
        let passShareFunc = page.onShareAppMessage
        page._onShareAppMessage = passShareFunc
        page.onShareAppMessage = function () {
          return {
            title: (saleType == 2 && tuanId && hName) ? (hName + '邀请你参与拼团') : title,
            path: path,
            imageUrl: banner
          }
        }
        this.setData({
          canShareFriend: true
        })
      }
    },
    recoverShare: function () {
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      let passShareFunc = page._onShareAppMessage
      page.onShareAppMessage = passShareFunc
    },
    savePoster: function () {
      const {localPoster } = this.data
      if (!localPoster) {
        return false
      }
      // 获取用户是否开启用户授权相册
      const app = getApp()
      const confirmColor = app.globalData.themeModalConfirmColor || '#576B95' // #576B95是官方颜色
      wx.getSetting({
        success: res => {
          // 如果没有则获取授权
          if (!res.authSetting['scope.writePhotosAlbum'] && res.authSetting['scope.writePhotosAlbum'] !== false) { // 未授权 且 未拒绝过
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                wx.saveImageToPhotosAlbum({
                  filePath: this.data.localPoster,
                  success: () => {
                    wx.showModal({
                      title: '保存成功',
                      content: '海报已生成并保存至你的手机相册了哦，分享到朋友圈给好友种草一下吧',
                      showCancel: false,
                      confirmText: '确定',
                      confirmColor,
                      success: res => {
                        if (res.confirm) {
                          this.hidePoster()
                        }
                      }
                    })
                  },
                  fail: () => {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none'
                    })
                  }
                })
              },
              fail: () => {

              }
            })
          } else if (!res.authSetting['scope.writePhotosAlbum'] && res.authSetting['scope.writePhotosAlbum'] === false) { // 未授权且拒绝过
            wx.showModal({
              content: '保存图片需要你授权，请授权相册', //提示的内容
              showCancel: true,
              confirmText: '去授权',
              confirmColor,
              success: res => {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      const authSetting = res.authSetting
                      if (authSetting['scope.writePhotosAlbum']) {
                        wx.saveImageToPhotosAlbum({
                          filePath: this.data.localPoster,
                          success: () => {
                            wx.showModal({
                              title: '保存成功',
                              content: '海报已生成并保存至你的手机相册了哦，分享到朋友圈给好友种草一下吧',
                              showCancel: false,
                              confirmText: '确定',
                              confirmColor,
                              success: res => {
                                if (res.confirm) {
                                  this.hidePoster()
                                }
                              }
                            })
                          },
                          fail: () => {
                            wx.showToast({
                              title: '保存失败',
                              icon: 'none'
                            })
                          }
                        })
                      }
                    }
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else if (res.authSetting['scope.writePhotosAlbum']) {
            // 有则直接保存
            wx.saveImageToPhotosAlbum({
              filePath: this.data.localPoster,
              success: () => {
                wx.showModal({
                  title: '保存成功',
                  content: '海报已生成并保存至你的手机相册了哦，分享到朋友圈给好友种草一下吧',
                  showCancel: false,
                  confirmText: '确定',
                  confirmColor,
                  success: res => {
                    if (res.confirm) {
                      this.hidePoster()
                    }
                  }
                })
              },
              fail: () => {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    },
    stopPropagation: function () {
      return false
    }
  }
})
