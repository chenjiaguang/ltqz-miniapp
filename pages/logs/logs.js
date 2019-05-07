//logs.js
const util = require('../../utils/util.js')
const storageHelper = require('../../utils/storageHelper.js')

Page({
  name: 'logs',
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (storageHelper.getStorage('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
