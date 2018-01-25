import each from 'for-own'
import map from 'just-map-object'
import filter from 'just-filter-object'
import isPlainObject from 'is-plain-obj'
import BasicDataAdaptor from './basic'

class PlainDataAdaptor extends BasicDataAdaptor {
  static isInstance (data) {
    return isPlainObject(data)
  }

  static fromPlainObject (plain) {
    return plain
  }

  static merge (original, plain) {
    return { ...original, ...plain }
  }

  /**
   * shallow diff
   */
  static diff (original, extra) {
    return filter(original, (key, value) => value !== extra[key])
  }

  static toPlainObject (data) {
    return data
  }
}

export default PlainDataAdaptor
