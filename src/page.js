import compose from 'compose-function'
import querystring from 'querystring'
import { mapObject, filterObject, isEmpty, addHooks } from './helpers'

const PAGE_PROPERTIES = {
  ATTRIBUTES: ['data'],
  METHODS: ['setData', 'route'],
  HOOKS: ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll'],
}

const TINA_PAGE_EXTRA_HOOKS = PAGE_PROPERTIES.HOOKS.map((on) => on.replace(/^on/, 'before'))

let middlewares = []

function log (...args) {
  if (TinaPage.debug) {
    console.log(`[Tina] -`, ...args)
  }
}

function createBeforeHooks (context, hooks) {
  let result = { ...context }
  hooks.forEach((on) => {
    let before = on.replace(/^on/, 'before')
    result[on] = function handler () {
      if (context[before]) {
        context[before].apply(this, arguments)
      }
      if (context[on]) {
        return context[on].apply(this, arguments)
      }
    }
    delete result[before]
  })
  return result
}

class TinaPage {
  static debug = false

  static use (middleware) {
    middlewares.unshift(middleware)
  }

  constructor (model = {}) {
    let self = this

    // use custom middlewares
    if (middlewares.length > 0) {
      model = compose(...middlewares)(model)
    }

    // parse model
    let page = {
      ...mapObject(model.methods || {}, (method) => method.bind(self)),
      ...mapObject(filterObject(model, (property, name) => ~[...PAGE_PROPERTIES.HOOKS, ...TINA_PAGE_EXTRA_HOOKS].indexOf(name)), (method, name) => method.bind(self)),
      data: model.data,
    }

    // copy properties into context
    for (let property in page) {
      self[property] = page[property]
    }

    // add $page into context
    page = addHooks(page, {
      beforeLoad (options) {
        // basic attrs
        self.route = this.route
        // extra attrs
        self.$page = this
        self.$route = {
          path: `/${this.route}`,
          query: { ...options },
          fullPath: isEmpty(options) ? `/${this.route}` : `/${this.route}?${querystring.stringify(options)}`,
        }
        // init data
        self.data = model.data || {}
        self.setData({})
      },
    }, true)

    // create before-hooks
    page = createBeforeHooks(page, PAGE_PROPERTIES.HOOKS)

    // add compute into context
    self.compute = model.compute || function () {
      return {}
    }

    new Page(page)

    return self
  }

  setData (newer, callback = () => {}) {
    let next = { ...this.data, ...newer }
    if (typeof this.compute === 'function') {
      next = { ...next, ...this.compute(next) }
    }
    next = diff(next, this.data)
    log(`[setData] - ${JSON.stringify(next)}`)
    if (isEmpty(next)) {
      return callback()
    }
    this.data = { ...this.data, ...next }
    this.$page.setData(next, callback)
  }
}

function diff (newer, older) {
  let result = {}
  for (let key in newer) {
    if (newer[key] !== older[key]) {
      result[key] = newer[key]
    }
  }
  return result
}

export default TinaPage
