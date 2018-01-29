import Unit from '../core/unit'
import Page from '../core/page'
import Component from '../core/component'
import BasicDataAdapter from '../data/basic'
import PlainDataAdapter from '../data/plain'
import SigmundDataAdapter from '../data/sigmund'

class Tina {
  static Unit = Unit
  static Page = Page
  static Component = Component
  static BasicDataAdapter = BasicDataAdapter
  static PlainDataAdapter = PlainDataAdapter
  static SigmundDataAdapter = SigmundDataAdapter

  static _plugins = []

  static use (plugin, ...args) {
    if (~this._plugins.indexOf(plugin)) {
      return this
    }

    if (typeof plugin.install === 'function') {
      plugin.install(this, ...args)
    }
    this._plugins.push(plugin)
    return this
  }
}

export default Tina
