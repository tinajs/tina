import each from 'for-own'
import map from 'just-map-object'
import filter from 'just-filter-object'

export default class BasicData {
  static isInstance (data) {
    return data instanceof this
  }

  constructor (plain) {
    each(plain, (value, key) => {
      this[key] = value
    })
  }

  merge (data) {
    if (!this.constructor.isInstance(data)) {
      data = new this.constructor(data)
    }
    return new this.constructor({ ...this, ...data })
  }

  /**
   * shallow diff
   */
  diff (data) {
    return new this.constructor(filter(this, (key, value) => value !== data[key]))
  }

  toPlainObject () {
    return map(this, (key, value) => value)
  }
}
