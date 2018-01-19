import equal from 'fast-deep-equal'
import { is } from 'immutable'
import { isEmpty, pick, mapObject, filterObject } from '../utils/functions'
import globals from '../utils/globals'
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
      return this.mix(options, mixins(options, this))
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
    let last = this.data
    let next = last.merge(newer)
    if (typeof this.compute === 'function') {
      next = next.merge(this.compute(next.toJS()))
    }
    let patch = next.filter((value, key) => !is(value, last.get(key))).toJS()
    if (hasDotPath(patch)) {
      throw new Error('The data object in method ``setData`` is not support dot-path key (``"x.y"`` or ``"x[n]"``) yet, please use a plain object instead.')
    }
    this.constructor.log('setData', patch)
    if (isEmpty(patch)) {
      return callback()
    }
    this.$source.setData(patch, callback)
  }
}

function hasDotPath (obj) {
  return Object.keys(obj).some((key) => {
    return /\.|\[.*\]/.test(key)
  })
}

export default Basic
