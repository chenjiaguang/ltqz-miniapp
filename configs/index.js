const env = 'dev' //更改该env参数来更换环境，dev，test，为测试环境域名，prod为正式环境域名

let commonConfig = require('common.env.js')
let config = {}
if (env == 'prod') {
  config = require('prod.env.js')
} else if (env == 'test') {
  config = require('test.env.js')
} else {
  console.error('导航请用this.navigateTo、this.redirectTo、this.switchTab、this.reLaunch、this.navigateBack代替微信的导航，这是封装过后的，仅往url中自动注入“fromnav=true”，fromnav[是否小程序内的导航进入该页面]')
  config = require('dev.env.js')
}

module.exports = Object.assign({}, commonConfig, config)