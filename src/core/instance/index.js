import Unit from '../layers/unit'
import Page from '../layers/page'
import Component from '../layers/component'
import BasicDataAdapter from '../../adapters/data/basic'
import PlainDataAdapter from '../../adapters/data/plain'
import SigmundDataAdapter from '../../adapters/data/sigmund'

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
