import map from 'just-map-object'
import { $initial, $log } from '../../mixins'
import { pick, omit, without, values, fromPairs } from '../../utils/functions'
import { prependHooks, linkProperties } from '../../utils/helpers'
import * as wxOptionsGenerator from '../../utils/wx-options-generator'
import globals from '../../utils/globals'
import Unit from './unit'

const MINA_APP_OPTIONS = ['onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound']
const MINA_APP_HOOKS = ['onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound']
const MINA_APP_METHODS = []
const MINA_APP_ATTRIBUTES = []

const ADDON_BEFORE_HOOKS = {}
const ADDON_OPTIONS = ['mixins']

const OVERWRITED_OPTIONS = [...MINA_APP_HOOKS]
const OVERWRITED_METHODS = []
const OVERWRITED_ATTRIBUTES = []

const APP_HOOKS = [...MINA_APP_HOOKS, ...values(ADDON_BEFORE_HOOKS)]

const APP_INITIAL_OPTIONS = {
  mixins: [],
  // hooks: return { created: [], ...... }
  ...fromPairs(APP_HOOKS.map((name) => [name, []])),
}

const BUILTIN_MIXINS = [$log]

class App extends Unit {
  static _mixins = []

  static define (options = {}) {
    // use mixins
    options = this.mix(APP_INITIAL_OPTIONS, [...BUILTIN_MIXINS, ...this._mixins, ...(options.mixins || []), options])

    // create wx-App options
    let app = {
      ...wxOptionsGenerator.lifecycles(MINA_APP_HOOKS.filter((name) => options[name].length > 0), (name) => ADDON_BEFORE_HOOKS[name]),
    }

    // creating Tina-App on **wx-App** launched.
    // !important: this hook is added to wx-App directly, but not Tina-App
    app = prependHooks(app, {
      onLaunch () {
        let instance = new App({ options })
        // create bi-direction links
        this.__tina_instance__ = instance
        instance.$source = this
      },
    })

    // apply wx-App options
    new globals.App({
      ...pick(options, without(MINA_APP_OPTIONS, OVERWRITED_OPTIONS)),
      ...app,
    })
  }

  constructor ({ options = {} }) {
    super()

    // creating Tina-App members
    let members = {
      ...omit(options, [...MINA_APP_OPTIONS, ...ADDON_OPTIONS]),
      // hooks
      ...map(pick(options, APP_HOOKS), (name, handlers) => function (...args) {
        return handlers.reduce((memory, handler) => handler.apply(this, args.concat(memory)), void 0)
      }),
    }
    // apply members into instance
    for (let name in members) {
      this[name] = members[name]
    }

    return this
  }
}

// link the rest of wx-App attributes and methods to Tina-App
linkProperties({
  TargetClass: App,
  getSourceInstance (context) {
    return context.$source
  },
  properties: [...without(MINA_APP_ATTRIBUTES, OVERWRITED_ATTRIBUTES), ...without(MINA_APP_METHODS, OVERWRITED_METHODS)],
})

export default App

export function getApp () {
  return globals.getApp().__tina_instance__
}
