import { isEmpty, pick } from '../utils/functions'
import globals from '../utils/globals'
import { appendHooks } from '../utils/helpers'

class Basic {
  static HOOKS = []

  static debug = false

  static mixins = []

  static mixin (mixin) {
    this.mixins.unshift(mixin)
  }

  static mix (options, mixin) {
    if (typeof mixin === 'function') {
      return mixin(options, this)
    }
    return {
      ...appendHooks(options, pick(mixin, this.HOOKS))
    }
  }

  static log (behavior, data) {
    if (this.debug) {
      console.log(`[Tina.${this.name}] - ${behavior}${data ? ': ' : ''}`, data)
    }
  }

  set data (value) {
    throw new Error('Not allowed to set ``data``, use ``setData(data, [callback])`` instead.')
  }
  get data () {
    throw new Error('class Basic doesnot have a ``data`` atttribute, please implement the ``data`` getter in the child-class.')
  }

  setData (newer, callback = () => {}) {
    let next = { ...this.data, ...newer }
    if (typeof this.compute === 'function') {
      next = { ...next, ...this.compute(next) }
    }
    next = diff(next, this.data)
    this.constructor.log('setData', next)
    if (isEmpty(next)) {
      return callback()
    }
    this.$source.setData(next, callback)
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

export default Basic
