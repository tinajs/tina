import isPlainObject from 'is-plain-obj'
import { isEmpty } from '../../utils/functions'
import strategies from '../../utils/mix-strategies'

class Basic {
  static debug = false

  static _mixins = []

  static mixin (mixin) {
    this._mixins.push(mixin)
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
    return strategies(options, mixin)
  }

  static log (behavior, data) {
    if (this.debug) {
      console.log(`[Tina.${this.name}] - ${behavior}${data ? ': ' : ''}`, data)
    }
  }

  setData (newer, callback = () => {}) {
    let { isData, fromPlainObject, merge, diff, toPlainObject } = this.adapters.data

    newer = isData(newer) ? newer : fromPlainObject(newer)

    let next = merge(this.data, newer)
    if (typeof this.compute === 'function') {
      let computed = this.compute(next)
      computed = isData(computed) ? computed : fromPlainObject(computed)
      next = merge(next, computed)
    }

    let patch = toPlainObject(diff(next, this.data))
    if (!isPlainObject(patch)) {
      console.warn('[Tina] - The data which is passed to MINA should be a plain object, please check your DataAdaptor-class.')
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
