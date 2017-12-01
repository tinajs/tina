import compose from 'compose-function'
import querystring from 'querystring'
import { mapObject, filterObject, isEmpty, addHooks } from './helpers'
import globals from './globals'
import Basic from './basic'

const PAGE_PROPERTIES = {
  ATTRIBUTES: ['data'],
  METHODS: ['setData', 'route'],
  HOOKS: ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll'],
}

const TINA_PAGE_EXTRA_HOOKS = PAGE_PROPERTIES.HOOKS.map((on) => on.replace(/^on/, 'before'))

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

class Page extends Basic {
  constructor (model = {}) {
    super()

    let self = this

    // use custom middlewares
    if (this.constructor.middlewares.length > 0) {
      model = compose(...this.constructor.middlewares)(model)
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

    new globals.Page(page)

    return self
  }
}

export default Page
