import isPlainObject from 'is-plain-obj'
import map from 'just-map-object'
import SigmundData from '../data/sigmund'
import { isEmpty, pick } from '../utils/functions'
import globals from '../utils/globals'
import strategies from '../utils/mix-strategies'

class Basic {
  static debug = false

  static Data = SigmundData

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
      return this.mix(options, mixins(options, this))
    }

    let mixin = mixins
    return {
      ...options,
      ...map(mixin, (key, extra) => strategies.merge(options[key], extra)),
    }
  }

  static log (behavior, data) {
    if (this.debug) {
      console.log(`[Tina.${this.name}] - ${behavior}${data ? ': ' : ''}`, data)
    }
  }

  setData (newer, callback = () => {}) {
    let next = this.data.merge(newer)
    if (typeof this.compute === 'function') {
      next = next.merge(this.compute(next))
    }
    let patch = next.diff(this.data).toPlainObject()
    if (!isPlainObject(patch)) {
      console.warn('[Tina] - The data which is passed to MINA should be a plain object, please check your Data-class.')
    }
    this.constructor.log('setData', patch)
    this.data = next
    if (isEmpty(patch)) {
      return callback()
    }
    this.$source.setData(patch, callback)
  }
}

export default Basic
