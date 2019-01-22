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

    sandbox.App = spy(function (options) {
      sandbox._apps.push(new App(options))
    })
    sandbox.Page = spy(function (options) {
      sandbox._pages.push(new Page(options))
    })
    sandbox.Component = spy(function (options) {
      sandbox._components.push(new Component(options))
    })

    // replace Tina.globals
    sandbox._replaced = {
      Tina,
      App: Tina.globals.App,
      Page: Tina.globals.Page,
      Component: Tina.globals.Component,
    }
    Tina.globals.App = sandbox.App
    Tina.globals.Page = sandbox.Page
    Tina.globals.Component = sandbox.Component
  }

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
    this._replaced.Tina.globals.App = this._replaced.App
    this._replaced.Tina.globals.Page = this._replaced.Page
    this._replaced.Tina.globals.Component = this._replaced.Component
  }
}
