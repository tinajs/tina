import { isEmpty } from './helpers'
import globals from './globals'

class Basic {
  static debug = false

  static middlewares = []

  static use (middleware) {
    this.middlewares.unshift(middleware)
  }

  static log (behavior, data) {
    if (this.debug) {
      console.log(`[Tina.${this.name}] - ${behavior}${data ? ': ' : ''}`, data)
    }
  }

  set data (value) {
    throw new Error('Not allowed to setting ``data``, use ``setData(data, [callback])`` instead.')
  }
  get data () {
    return this.$page.data
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
    this.$page.setData(next, callback)
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
