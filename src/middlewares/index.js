import querystring from 'querystring'
import { isEmpty } from '../utils/functions'
import { addHooks } from '../utils/helpers'

// builtin $route middleware for Tina-Page
export function $route (model) {
  return addHooks(model, {
    beforeLoad (options) {
      this.$route = {
        path: `/${this.route}`,
        query: { ...options },
        fullPath: isEmpty(options) ? `/${this.route}` : `/${this.route}?${querystring.stringify(options)}`,
      }
      this.$log('Route Middleware', 'Ready')
    },
  })
}

// builtin initial middleware for Tina-Page
function initial () {
  // init data (just for triggering ``compute`` in this moment)
  this.setData()
  this.$log('Initial Middleware', 'Ready')
}
export function $initial (model) {
  return addHooks(model, {
    attached: initial,
    onLoad: initial,
  })
}

// builtin log middleware for Tina-Page
function log () {
  this.$log = this.constructor.log.bind(this.constructor)
  this.$log('Log Middleware', 'Ready')
}
export function $log (model) {
  return addHooks(model, {
    beforeCreate: log,
    beforeLoad: log,
  })
}
