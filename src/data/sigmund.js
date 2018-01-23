import sigmund from 'sigmund'
import each from 'for-own'
import map from 'just-map-object'
import filter from 'just-filter-object'
import BasicData from './basic'

export default class SigmundData extends BasicData {
  static isInstance (data) {
    return data instanceof this
  }

  constructor (plain) {
    super(plain)

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

  /**
   * @override
   */
  diff (data) {
    return new SigmundData(filter(this, (key, value) => value !== data[key] || this.signature(key) !== data.signature(key)))
  }
}
