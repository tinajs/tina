import compose from 'compose-function'
import { $initial, $log } from '../middlewares'
import { mapObject, filterObject, pick, without, values } from '../utils/functions'
import { prependHooks, linkProperties } from '../utils/helpers'
import globals from '../utils/globals'
import Basic from './basic'

const PAGE_OPTIONS = ['data', 'onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll']
const PAGE_HOOKS = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll']
const PAGE_METHODS = ['setData']
const PAGE_ATTRIBUTES = ['data', 'route']

const ADDON_BEFORE_HOOKS = PAGE_HOOKS.reduce((memory, on) => {
  return {
    ...memory,
    [on]: on.replace(/^on/, 'before'),
  }
}, {})

const OVERWRITED_METHODS = ['setData']
const OVERWRITED_ATTRIBUTES = ['data']

// generate methods for wx-Page
function methods (object) {
  return mapObject(object || {}, (method, name) => function handler (...args) {
    let context = this.__tina_page__
    return context[name].apply(context, args)
  })
}

// generate lifecycles for wx-Page
function lifecycles (hooks = PAGE_HOOKS) {
  let result = {}
  hooks.forEach((on) => {
    let before = on.replace(/^on/, 'before')
    result[on] = function handler () {
      let context = this.__tina_page__
      if (context[before]) {
        context[before].apply(context, arguments)
      }
      if (context[on]) {
        return context[on].apply(context, arguments)
      }
    }
  })
  return result
}

const BUILTIN_MIDDLEWARES = [$log, $initial]

class Page extends Basic {
  static middlewares = []

  static define (model = {}) {
    // use middlewares
    let middlewares = [...BUILTIN_MIDDLEWARES, ...Page.middlewares]
    model = compose(...middlewares.reverse())(model)

    // create wx-Page options
    let page = {
      ...methods(model.methods),
      ...lifecycles(),
    }

    // creating Tina-Page on **wx-Page** loaded.
    // !important: this hook is added to wx-Page directly, but not Tina-Page
    page = prependHooks(page, {
      onLoad () {
        let instance = new Page({ model, $source: this })
        // create bi-direction links
        this.__tina_page__ = instance
        instance.$source = this
      },
    })

    // apply wx-Page options
    new globals.Page({
      ...pick(model, without(PAGE_OPTIONS, PAGE_HOOKS)),
      ...page,
    })
  }

  constructor ({ model = {}, $source }) {
    super()

    // creating Tina-Page members
    let members = {
      compute: model.compute || function () {
        return {}
      },
      ...model.methods,
      ...filterObject(model, (property, name) => ~[...PAGE_HOOKS, ...values(ADDON_BEFORE_HOOKS)].indexOf(name)),
    }
    // apply members into instance
    for (let name in members) {
      this[name] = members[name]
    }

    return this
  }

  get data () {
    return this.$source.data
  }
}

// link the rest of wx-Component attributes and methods to Tina-Component
linkProperties({
  TargetClass: Page,
  getSourceInstance (context) {
    return context.$source
  },
  properties: [...without(PAGE_ATTRIBUTES, OVERWRITED_ATTRIBUTES), ...without(PAGE_METHODS, OVERWRITED_METHODS)],
})

export default Page
