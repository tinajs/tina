import isPlainObject from 'is-plain-obj'
import map from 'just-map-object'
import SigmundDataAdaptor from '../data/sigmund'
import { isEmpty, pick } from '../utils/functions'
import globals from '../utils/globals'
import strategies from '../utils/mix-strategies'

class Basic {
  static debug = false

  static DataAdaptor = SigmundDataAdaptor

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
    let { DataAdaptor } = this.constructor
    newer = DataAdaptor.isInstance(newer) ? newer : DataAdaptor.fromPlainObject(newer)

    let next = DataAdaptor.merge(this.data, newer)
    if (typeof this.compute === 'function') {
      next = DataAdaptor.merge(next, this.compute(next))
    }

    let patch = DataAdaptor.toPlainObject(DataAdaptor.diff(next, this.data))
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
