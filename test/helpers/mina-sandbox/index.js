import { spy } from 'sinon'
import set from 'set-value'
import clone from 'clone'

class Unit {
  constructor (options) {
    for (let key in options) {
      this[key] = options[key]
    }
  }

  setData (data, callback) {
    let next = clone(this.data)
    for (let key in data) {
      if (key.includes('[') || key.includes('.')) {
        set(next, key, data[key])
      } else {
        next[key] = data[key]
      }
    }
    this.data = next
    if (typeof callback === 'function') {
      callback()
    }
  }

  async _emit (name, ...argv) {
    return this[name].call(this, ...argv)
  }
}

class App extends Unit {
  setData () {
    throw new Error('`setData` of App is not a function')
  }
}

class Page extends Unit {
  constructor (options) {
    super(options)
    this.data = this.data || {}
    this.route = '/'
  }
}

class Component extends Unit {
  constructor (options) {
    super(options)
    this.data = this.data || {}
  }
  _property (key, value) {
    if (this.properties && this.properties[key] && typeof this.properties[key].observer === 'function') {
      this.properties[key].observer.call(this, value, this.data[key])
    }
  }
  _dataset (key, value) {
    this.dataset = {
      ...(this.dataset || {}),
      key: value,
    }
  }
  _emitObserver (name, ...values) {
    this.observers[name].call(this, ...values)
  }

  hasBehavior () {}
  triggerEvent () {}
  createSelectorQuery () {}
  selectComponent () {}
  selectAllComponents () {}
  getRelationNodes () {}
}

export default class MinaSandbox {
  constructor ({ Tina }) {
    const sandbox = this

    sandbox._apps = []
    sandbox._pages = []
    sandbox._components = []

    // globals function of mina
    sandbox.globals = {
      App: spy(function (options) {
        sandbox._apps.push(new App(options))
      }),
      Page: spy(function (options) {
        sandbox._pages.push(new Page(options))
      }),
      Component: spy(function (options) {
        sandbox._components.push(new Component(options))
      }),
      getApp: () => sandbox.getApp(-1),
      getCurrentPages: () => [sandbox.getPage(-1)],
    }

    // replace Tina.globals
    sandbox._original = {
      Tina,
      App: Tina.globals.App,
      Page: Tina.globals.Page,
      Component: Tina.globals.Component,
      getApp: Tina.globals.getApp,
      getCurrentPages: Tina.globals.getCurrentPages,
    }
    Tina.globals.App = sandbox.globals.App
    Tina.globals.Page = sandbox.globals.Page
    Tina.globals.Component = sandbox.globals.Component
    Tina.globals.getApp = sandbox.globals.getApp
    Tina.globals.getCurrentPages = sandbox.globals.getCurrentPages
  }

  // shortcut methods of sandbox
  getApp (index) {
    return this._apps[index >= 0 ? index : this._apps.length + index]
  }
  getPage (index) {
    return this._pages[index >= 0 ? index : this._pages.length + index]
  }
  getComponent (index) {
    return this._components[index >= 0 ? index : this._components.length + index]
  }

  restore () {
    this._original.Tina.globals.App = this._original.App
    this._original.Tina.globals.Page = this._original.Page
    this._original.Tina.globals.Component = this._original.Component
    this._original.Tina.globals.getApp = this._original.getApp
    this._original.Tina.globals.getCurrentPages = this._original.getCurrentPages
  }
}
