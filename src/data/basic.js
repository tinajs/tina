import each from 'for-own'
import map from 'just-map-object'
import filter from 'just-filter-object'
import isPlainObject from 'is-plain-obj'

function shouleBeOverrided (name, args, result) {
  throw new Error(`[Tina] - The method "${name}" of DataAdaptor should be overrided by a function, which receives arguments <(${args.join(', ')})> and return <${result}>.`)
}

class BasicDataAdapter {
  static isData (data) {
    shouleBeOverrided('isData', ['data'], 'Boolean()')
  }

  static fromPlainObject (plain) {
    shouleBeOverrided('fromPlainObject', ['plain'], 'data')
  }

  static merge (original, extra) {
    shouleBeOverrided('merge', ['original', 'extra'], 'data')
  }

  static diff (original, extra) {
    shouleBeOverrided('diff', ['original', 'extra'], 'data')
  }

  static toPlainObject (data) {
    shouleBeOverrided('diff', ['data'], 'plain')
  }
}

export default BasicDataAdapter
