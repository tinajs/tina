import Unit from '../core/unit'
import Page from '../core/page'
import Component from '../core/component'
import BasicData from '../data/basic'
import SigmundData from '../data/sigmund'

class Tina {
  static Unit = Unit
  static Page = Page
  static Component = Component
  static BasicData = BasicData
  static SigmundData = SigmundData

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
