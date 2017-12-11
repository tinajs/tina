import { isEmpty, pick, mapObject, filterObject } from '../utils/functions'
import globals from '../utils/globals'
import { appendHooks, appendHook } from '../utils/helpers'
import strategies from '../utils/mix-strategies'

class Basic {
  static debug = false

  static mixins = []

  static mixin (mixin) {
    this.mixins.push(mixin)
  }

  // utilty function for mixin
  static mix (options, mixins) {
    if (Array.isArray(mixins)) {
      return mixins.reduce((memory, mixin) => this.mix(memory, mixin), options)
    }
    if (typeof mixins === 'function') {
      return this.mix(mixins(options, this), options)
    }

    let mixin = mixins
    return {
      ...options,
      ...mapObject(mixin, (extra, key) => strategies.merge(options[key], extra)),
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
