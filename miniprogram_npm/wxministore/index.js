module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1556504955080, function(require, module, exports) {
/**
 * @author 逍遥
 * @update 2019.4.15
 * @version 1.2.3
 */
const Version = '1.2.3'
const TYPE_ARRAY = '[object Array]'
const TYPE_OBJECT = '[object Object]'

function Store(option) {
  //必要参数的默认值处理
  const {
    state = {},
      openPart = false,
      behavior,
      methods = {},
      pageLisener = {},
      nonWritable = false
  } = option

  //状态初始化
  this.$state = {}
  if (_typeOf(option.state) === TYPE_OBJECT) {
    this.$state = Object.assign({}, _deepClone(option.state))
  }
  //页面+组件树
  this.$r = []
  //创建时，添加组件
  const _create = function(r, o = {}) {
    r.$store = {}
    const {
      useProp
    } = o;
    if (o.hasOwnProperty('useProp')) {
      if (useProp && typeof useProp === 'string' || _typeOf(useProp) === TYPE_ARRAY) {
        r.$store.useProp = [].concat(useProp)
      } else {
        r.$store.useProp = []
      }
    }
    
    r.$store.useStore = canUseStore(o)
    if (canUseStore(o)) {
      _store.$r.push(r)
      if (r.$store.useProp) {
        r.setData({
          $state: _filterKey(_store.$state, r.$store.useProp, (key, usekey) => key === usekey)
        })
      } else {
        r.setData({
          $state: _store.$state
        })
      }
    }

  }
  //销毁时，移除组件
  const _destroy = function(r) {
    let index = _store.$r.findIndex(item => item === r)
    if (index > -1) {
      _store.$r.splice(index, 1)
    }
  }
  //状态局部模式
  this.$openPart = openPart
  //其他参数
  const _store = this
  const pageLife = [
    'data',
    'onLoad',
    'onShow',
    'onReady',
    'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onShareAppMessage',
    'onPageScroll',
    'onTabItemTap'
  ]
  const canUseStore = function(o = {}) {
    return (openPart === true && o.useStore === true) || !openPart
  }

  const originPage = Page,
    originComponent = Component

  //重写Page
  App.Page = function(o = {}, ...args) {
    if (canUseStore(o)) {
      //状态注入
      o.data = Object.assign(o.data || {}, {
        $state: _store.$state
      })
    }
    //行为注入
    Object.keys(methods).forEach(key => {
      //不能是周期事件
      if (
        typeof methods[key] === 'function' &&
        !pageLife.some(item => item === key)
      ) {
        o[key] = methods[key]
      }
    })
    //覆盖原周期
    const originCreate = o.onLoad
    o.onLoad = function() {
      _create(this, o)
      originCreate && originCreate.apply(this, arguments)
    }
    const originonDestroy = o.onUnload
    o.onUnload = function() {
      _destroy(this)
      originonDestroy && originonDestroy.apply(this, arguments)
    }
    //其他页面周期事件注入 pageListener
    Object.keys(pageLisener).forEach(key => {
      //不能是周期事件
      if (
        typeof pageLisener[key] === 'function' &&
        pageLife.some(item => item === key)
      ) {
        const originLife = o[key]
        o[key] = function() {
          pageLisener[key].apply(this, arguments)
          originLife && originLife.apply(this, arguments)
        }
      }
    })
    originPage(o, ...args)
  }

  if (!nonWritable) {
    try {
      Page = App.Page
    } catch (e) {}
  }

  //重写组件
  App.Component = function(o = {}, ...args) {
    //状态注入
    if (canUseStore(o)) {
      o.data = Object.assign(o.data || {}, {
        $state: _store.$state
      })
    }
    //行为注入
    Object.keys(methods).forEach(key => {
      //不能是周期事件
      if (
        typeof methods[key] === 'function' &&
        !pageLife.some(item => item === key)
      ) {
        o.methods || (o.methods = {})
        o.methods[key] = methods[key]
      }
    })
    //behavior
    if (behavior) {
      o.behaviors = [behavior, ...(o.behaviors || [])]
    }
    const {
      lifetimes = {}
    } = o

    let originCreate = lifetimes.attached || o.attached,
      originonDestroy = lifetimes.detached || o.detached
    const attached = function() {
      _create(this, o)
      originCreate && originCreate.apply(this, arguments)
    }

    const detached = function() {
      _destroy(this)
      originonDestroy && originonDestroy.apply(this, arguments)
    }
    if (_typeOf(o.lifetimes) === TYPE_OBJECT) {
      o.lifetimes.attached = attached
      o.lifetimes.detached = detached
    } else {
      o.attached = attached
      o.detached = detached
    }

    //覆盖原周期

    originComponent(o, ...args)
  }
  if (!nonWritable) {
    try {
      Component = App.Component
    } catch (e) {}
  }

  this.version = Version
}

Store.prototype.setState = function(obj, fn = () => {}) {
  if (_typeOf(obj) !== TYPE_OBJECT) {
    throw new Error('setState的第一个参数须为object!')
  }
  console.timeline && console.timeline('setState')
  let prev = this.$state
  let current = setData(obj, prev)
  this.$state = current
  //如果有组件
  if (this.$r.length > 0) {
    let diffObj = diff(current, prev)
    console.log('diff后实际设置的值：', diffObj)
    let keys = Object.keys(diffObj)
    if (keys.length > 0) {
      const newObj = {}
      keys.forEach(key => {
        newObj['$state.' + key] = diffObj[key]
      })
      let pros = this.$r.map(r => {
        if (r.$store.hasOwnProperty('useProp')) {
          let useprops = _filterKey(
            newObj,
            r.$store.useProp,
            (key, useKey) => (key === '$state.' + useKey) || !!key.match(new RegExp('^[\$]state.' + useKey + '[\.|\[]', 'g'))
          )
          if (Object.keys(useprops).length > 0) {
            return new Promise(resolve => {
              r.setData(useprops, resolve)
            })
          } else {
            return Promise.resolve()
          }
        }
        return new Promise(resolve => {
          r.setData(newObj, resolve)
        })
      })
      Promise.all(pros).then(fn)
    } else {
      fn()
    }
  } else {
    fn()
  }
  console.timelineEnd && console.timelineEnd('setState')
}

const _filterKey = function(obj, useKeys = [], fn) {
  let result = {}
  Object.keys(obj)
    .filter(key =>
      useKeys.some(usekey => {
        return fn(key, usekey)
      })
    )
    .forEach(key => {
      result[key] = obj[key]
    })
  return result
}

const _typeOf = function(val) {
  return Object.prototype.toString.call(val)
}

const setData = function(obj, data) {
  let result = _deepClone(data)
  Object.keys(obj).forEach(key => {
    dataHandler(key, obj[key], result)
  })
  return result
}

const dataHandler = function(key, result, data) {
  let arr = pathHandler(key)
  let d = data
  for (let i = 0; i < arr.length - 1; i++) {
    keyToData(arr[i], arr[i + 1], d)
    d = d[arr[i]]
  }
  d[arr[arr.length - 1]] = result
}

const pathHandler = function(key) {
  let current = '',
    keyArr = []
  for (let i = 0, len = key.length; i < len; i++) {
    if (key[0] === '[') {
      throw new Error('key值不能以[]开头')
    }
    if (key[i].match(/\.|\[/g)) {
      cleanAndPush(current, keyArr)
      current = ''
    }
    current += key[i]
  }
  cleanAndPush(current, keyArr)
  return keyArr
}

const cleanAndPush = function(key, arr) {
  let r = cleanKey(key)
  if (r !== '') {
    arr.push(r)
  }
}

const keyToData = function(prev, current, data) {
  if (prev === '') {
    return
  }
  const type = _typeOf(data[prev])
  if (typeof current === 'number' && type !== TYPE_ARRAY) {
    data[prev] = []
  } else if (typeof current === 'string' && type !== TYPE_OBJECT) {
    data[prev] = {}
  }
}

const cleanKey = function(key) {
  if (key.match(/\[\S+\]/g)) {
    let result = key.replace(/\[|\]/g, '')
    if (!Number.isNaN(parseInt(result))) {
      return +result
    } else {
      throw new Error(`[]中必须为数字`)
    }
  }
  return key.replace(/\[|\.|\]| /g, '')
}

const _deepClone = function(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * diff算法
 * @author 逍遥
 */
const addDiff = function addDiff(
  current = {},
  prev = {},
  root = '',
  result = {}
) {
  Object.entries(current).forEach(item => {
    let key = item[0],
      value = item[1],
      path = root === '' ? key : root + '.' + key
    if (_typeOf(current) === TYPE_ARRAY) {
      path = root === '' ? key : root + '[' + key + ']'
    }

    if (!prev.hasOwnProperty(key)) {
      result[path] = value
    } else if (
      (_typeOf(prev[key]) === TYPE_OBJECT &&
        _typeOf(current[key]) === TYPE_OBJECT) ||
      (_typeOf(prev[key]) === TYPE_ARRAY &&
        _typeOf(current[key]) === TYPE_ARRAY)
    ) {
      addDiff(current[key], prev[key], path, result)
    } else if (prev[key] !== current[key]) {
      result[path] = value
    }
  })
  return result
}

const nullDiff = function nullDiff(
  current = {},
  prev = {},
  root = '',
  result = {}
) {
  Object.entries(prev).forEach(item => {
    let key = item[0],
      value = item[1],
      path = root === '' ? key : root + '.' + key
    if (_typeOf(current) === TYPE_ARRAY) {
      path = root === '' ? key : root + '[' + key + ']'
    }

    if (!current.hasOwnProperty(key)) {
      result[path] = null
    } else if (
      (_typeOf(prev[key]) === TYPE_OBJECT &&
        _typeOf(current[key]) === TYPE_OBJECT) ||
      (_typeOf(prev[key]) === TYPE_ARRAY &&
        _typeOf(current[key]) === TYPE_ARRAY)
    ) {
      nullDiff(current[key], prev[key], path, result)
    }
  })
  return result
}

const diff = function diff(current = {}, prev = {}) {
  let result = {}
  addDiff(current, prev, '', result)
  nullDiff(current, prev, '', result)
  return result
}

module.exports = Store
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1556504955080);
})()
//# sourceMappingURL=index.js.map