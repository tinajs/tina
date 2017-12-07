import { appendHooks } from '../utils/helpers'

// builtin initial middleware for Tina-Page
function initial () {
  // init data (just for triggering ``compute`` in this moment)
  this.setData()
  this.$log('Initial Middleware', 'Ready')
}
export function $initial (model) {
  return appendHooks(model, {
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
  return appendHooks(model, {
    beforeCreate: log,
    beforeLoad: log,
  })
}
