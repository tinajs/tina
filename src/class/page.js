import compose from 'compose-function'
import querystring from 'querystring'
import { mapObject, filterObject, isEmpty, addHooks } from '../utils/helpers'
import globals from '../utils/globals'
import Basic from './basic'

const PAGE_PROPERTIES = {
  ATTRIBUTES: ['data'],
  METHODS: ['setData', 'route'],
  HOOKS: ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll'],
}

const TINA_PAGE_EXTRA_HOOKS = PAGE_PROPERTIES.HOOKS.map((on) => on.replace(/^on/, 'before'))

// generate methods for wx-Page
function methods (object) {
  return mapObject(object || {}, (method, name) => function handler (...args) {
    let context = this.__tina_page__
    return context[name].apply(context, args)
  })
}

// generate lifecycles for wx-Page
function lifecycles (hooks = PAGE_PROPERTIES.HOOKS) {
  let result = {}
  hooks.forEach((on) => {
    let before = on.replace(/^on/, 'before')
    result[on] = function handler () {
      let context = this.__tina_page__
      if (context[before]) {
        context[before].apply(context, arguments)
      }
      if (context[on]) {
        return context[on].apply(context, arguments)
      }
    }
  })
  return result
}

// builtin $route middleware for Tina-Page
function $route (model) {
  return addHooks(model, {
    beforeLoad (options) {
      this.$route = {
        path: `/${this.route}`,
        query: { ...options },
        fullPath: isEmpty(options) ? `/${this.route}` : `/${this.route}?${querystring.stringify(options)}`,
      }
      this.$log('Route Middleware', 'Ready')
    }
  })
}
// builtin initial middleware for Tina-Page
function $initial (model) {
  return addHooks(model, {
    onLoad () {
      // init data (just for triggering ``compute`` in this moment)
      this.setData()
      this.$log('Initial Middleware', 'Ready')
    }
  })
}
// builtin log middleware for Tina-Page
function $log (model) {
  return addHooks(model, {
    beforeLoad () {
      this.$log = this.constructor.log.bind(this.constructor)
      this.$log('Log Middleware', 'Ready')
    }
  })
}

const BUILTIN_MIDDLEWARES = [$route, $initial, $log]

class Page extends Basic {
  static define (model = {}) {
    // use builtin middlewares
    model = compose(...BUILTIN_MIDDLEWARES)(model)
    // use custom middlewares
    if (Page.middlewares.length > 0) {
      model = compose(...Page.middlewares)(model)
    }

    // create wx-Page options
    let page = {
      ...methods(model.methods),
      ...lifecycles(),
    }

    // creating Tina-Page on **wx-Page** loaded.
    // !important: this hook is added to wx-Page directly, but not Tina-Page
    page = addHooks(page, {
      onLoad () {
        let instance = new Page({ model, $page: this })
        // create bi-direction links
        this.__tina_page__ = instance
        instance.$page = this

        // read basic attrs
        instance.route = this.route
      },
    }, true)

    // apply wx-Page options
    new globals.Page({
      ...page,
      data: model.data,
    })
  }

  constructor ({ model = {}, $page }) {
    super()

    // creating Tina-Page members
    let members = {
      compute: model.compute || function () {
        return {}
      },
      ...model.methods,
      ...filterObject(model, (property, name) => ~[...PAGE_PROPERTIES.HOOKS, ...TINA_PAGE_EXTRA_HOOKS].indexOf(name)),
    }
    // apply members into instance
    for (let name in members) {
      this[name] = members[name]
    }

    return this
  }

  get data () {
    return this.$page.data
  }
}

export default Page
