import map from 'just-map-object'
import { $initial, $log } from '../mixins'
import { pick, without, values, fromPairs } from '../utils/functions'
import { prependHooks, linkProperties, appendHooks } from '../utils/helpers'
import * as wxOptionsGenerator from '../utils/wx-options-generator'
import globals from '../utils/globals'
import Unit from './unit'

const MINA_COMPONENT_OPTIONS = ['properties', 'data', 'methods', 'behaviors', 'created', 'attached', 'ready', 'moved', 'detached', 'relations', 'options']
const MINA_COMPONENT_HOOKS = ['created', 'attached', 'ready', 'moved', 'detached']
const MINA_COMPONENT_METHODS = ['setData', 'hasBehavior', 'triggerEvent', 'createSelectorQuery', 'selectComponent', 'selectAllComponents', 'getRelationNodes']
const MINA_COMPONENT_ATTRIBUTES = ['is', 'id', 'dataset', 'data']

const ADDON_BEFORE_HOOKS = {}
const ADDON_OPTIONS = ['mixins', 'compute']

const OVERWRITED_OPTIONS = ['properties', 'data', 'methods', ...MINA_COMPONENT_HOOKS]
const OVERWRITED_METHODS = ['setData']
const OVERWRITED_ATTRIBUTES = ['data']

const COMPONENT_HOOKS = [...MINA_COMPONENT_HOOKS, ...values(ADDON_BEFORE_HOOKS)]

const COMPONENT_INITIAL_OPTIONS = {
  mixins: [],
  behaviors: [],
  properties: {},
  data: {},
  compute () {},
  // hooks: return { created: [], ...... }
  ...fromPairs(COMPONENT_HOOKS.map((name) => [name, []])),
  methods: {},
  relations: {},
  options: {},
}

const BUILTIN_MIXINS = [$log, $initial]

class Component extends Unit {
  static _mixins = []

  static define (options = {}) {
    // use mixins
    options = this.mix(COMPONENT_INITIAL_OPTIONS, [...BUILTIN_MIXINS, ...this._mixins, ...(options.mixins || []), options])

    // initilize data
    options.data = this.Data.isInstance(options.data) ? data : new this.Data(options.data)

    // create wx-Component options
    let component = {
      data: wxOptionsGenerator.data(options.data, options.properties),
      properties: wxOptionsGenerator.properties(options.properties),
      methods: wxOptionsGenerator.methods(options.methods),
      ...wxOptionsGenerator.lifecycles(MINA_COMPONENT_HOOKS.filter((name) => options[name].length > 0), (name) => ADDON_BEFORE_HOOKS[name]),
    }

    // creating Tina-Component on **wx-Component** created.
    // !important: this hook is added to wx-Component directly, but not Tina-Component
    component = prependHooks(component, {
      created () {
        let instance = new Component({ options, $source: this })
        // create bi-direction links
        this.__tina_instance__ = instance
        instance.$source = this
      },
    })

    // apply wx-Component options
    new globals.Component({
      ...pick(options, without(MINA_COMPONENT_OPTIONS, OVERWRITED_OPTIONS)),
      ...component,
    })
  }

  constructor ({ options = {}, $source }) {
    super()

    // creating Tina-Component members
    let members = {
      data: options.data,
      compute: options.compute || function () {
        return {}
      },
      ...options.methods,
      // hooks
      ...map(pick(options, COMPONENT_HOOKS), (name, handlers) => function (...args) {
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

// link the rest of wx-Component attributes and methods to Tina-Component
linkProperties({
  TargetClass: Component,
  getSourceInstance (context) {
    return context.$source
  },
  properties: [...without(MINA_COMPONENT_ATTRIBUTES, OVERWRITED_ATTRIBUTES), ...without(MINA_COMPONENT_METHODS, OVERWRITED_METHODS)],
})

export default Component
