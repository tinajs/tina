import Unit from '../layers/unit'
import App, { getApp } from '../layers/app'
import Page, { getCurrentPages } from '../layers/page'
import Component from '../layers/component'
import BasicDataAdapter from '../../adapters/data/basic'
import PlainDataAdapter from '../../adapters/data/plain'
import SigmundDataAdapter from '../../adapters/data/sigmund'
import globals from '../../utils/globals'

class Tina {
  static Unit = Unit
  static App = App
  static getApp = getApp
  static Page = Page
  static getCurrentPages = getCurrentPages
  static Component = Component
  static BasicDataAdapter = BasicDataAdapter
  static PlainDataAdapter = PlainDataAdapter
  static SigmundDataAdapter = SigmundDataAdapter
  static globals = globals

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
