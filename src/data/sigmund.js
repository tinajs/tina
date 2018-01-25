import sigmund from 'sigmund'
import each from 'for-own'
import map from 'just-map-object'
import filter from 'just-filter-object'
import BasicDataAdaptor from './basic'

export class SigmundData {
  constructor (plain) {
    each(plain, (value, key) => {
      this[key] = value
    })

    Object.defineProperty(this, '__signatures', {
      enumerable: false,
      writable: true,
    })

    this.sign()
  }

  sign () {
    this.__signatures = map(this, (key, value) => sigmund(value))
  }

  signature (key) {
    return this.__signatures[key]
  }

  isDirty (key) {
    if (!key) {
      return Object.keys(this).some((key) => this.isDirty(key))
    }
    if (!this[key] && !this.__signatures[key]) {
      return false
    }
    return this.__signatures[key] !== sigmund(this[key])
  }
}

class SigmundDataAdaptor extends BasicDataAdaptor {
  static isInstance (data) {
    return data instanceof SigmundData
  }

  static fromPlainObject (plain) {
    return new SigmundData(plain)
  }

  static merge (original, extra) {
    // let extra = original.isInstance(extra) ? extra : new SigmundData(extra)
    // return new SigmundData({ ...original, ...extra })
    return new SigmundData({ ...original, ...extra })
  }

  static diff (original, extra) {
    return new SigmundData(filter(original, (key, value) => value !== extra[key] || original.signature(key) !== extra.signature(key)))
  }

  static toPlainObject (data) {
    return map(data, (key, value) => value)
  }
}

export default SigmundDataAdaptor
