import { $initial, $log } from '../mixins'
import { mapObject, filterObject, pick, without, values } from '../utils/functions'
import { prependHooks, linkProperties, appendHooks } from '../utils/helpers'
import { methods, lifecycles } from '../utils/generator'
import globals from '../utils/globals'
import Basic from './basic'

const MINA_COMPONENT_OPTIONS = ['properties', 'data', 'methods', 'behaviors', 'created', 'attached', 'ready', 'moved', 'detached', 'relations', 'options']
const MINA_COMPONENT_HOOKS = ['created', 'attached', 'ready', 'moved', 'detached']
const MINA_COMPONENT_METHODS = ['setData', 'hasBehavior', 'triggerEvent', 'createSelectorQuery', 'selectComponent', 'selectAllComponents', 'getRelationNodes']
const MINA_COMPONENT_ATTRIBUTES = ['is', 'id', 'dataset', 'data']

const ADDON_BEFORE_HOOKS = {}

const OVERWRITED_METHODS = ['setData']
const OVERWRITED_ATTRIBUTES = ['data']

// generate properties for wx-Component
function properties (object) {
  function wrap (original) {
    return function observer (...args) {
      let context = this.__tina_instance__
      // trigger ``compute``
      context.setData()
      if (typeof original === 'string') {
        return context[original].apply(context, args)
      }
      if (typeof original === 'function') {
        return original.apply(context, args)
      }
    }
  }

  return mapObject(object || {}, (rule) => {
    if (typeof rule === 'function' || rule === null) {
      return {
        type: rule,
        observer: wrap(),
      }
    }
    if (typeof rule === 'object') {
      return {
        ...rule,
        observer: wrap(rule.observer),
      }
    }
  })
}

const BUILTIN_MIXINS = [$initial, $log]

class Component extends Basic {
  static HOOKS = [...MINA_COMPONENT_HOOKS, ...values(ADDON_BEFORE_HOOKS)]

  static mixins = []

  static define (options = {}) {
    // use mixins
    options = this.mix(options, [...BUILTIN_MIXINS, ...this.mixins, ...(options.mixins || [])])

    // create wx-Component options
    let component = {
      properties: properties(options.properties),
      methods: methods(options.methods),
      ...lifecycles(MINA_COMPONENT_HOOKS, (name) => ADDON_BEFORE_HOOKS[name]),
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
      ...pick(options, without(MINA_COMPONENT_OPTIONS, MINA_COMPONENT_HOOKS)),
      ...component,
    })
  }

  constructor ({ options = {}, $source }) {
    super()

    // creating Tina-Component members
    let members = {
      compute: options.compute || function () {
        return {}
      },
      ...options.methods,
      ...filterObject(options, (property, name) => ~Component.HOOKS.indexOf(name)),
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
  TargetClass: Component,
  getSourceInstance (context) {
    return context.$source
  },
  properties: [...without(MINA_COMPONENT_ATTRIBUTES, OVERWRITED_ATTRIBUTES), ...without(MINA_COMPONENT_METHODS, OVERWRITED_METHODS)],
})

export default Component
