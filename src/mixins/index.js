import { appendHooks } from '../utils/helpers'

// builtin initial mixin for Tina-Page
function initial () {
  // init data (just for triggering ``compute`` in this moment)
  this.setData()
  this.$log('Initial Mixin', 'Ready')
}
export const $initial = {
  attached: initial,
  onLoad: initial,
}

// builtin log mixin for Tina-Page
function log () {
  this.$log = this.constructor.log.bind(this.constructor)
  this.$log('Log Mixin', 'Ready')
}
export const $log = {
  created: log,
  beforeLoad: log,
  onLaunch: log,
}
