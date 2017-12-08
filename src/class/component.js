import compose from 'compose-function'
import { $initial, $log } from '../mixins'
import { mapObject, filterObject, pick, without, values } from '../utils/functions'
import { prependHooks, linkProperties, appendHooks } from '../utils/helpers'
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
      let context = this.__tina_component__
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

// generate methods for wx-Component
function methods (object) {
  return mapObject(object || {}, (method, name) => function handler (...args) {
    let context = this.__tina_component__
    return context[name].apply(context, args)
  })
}

// generate lifecycles for wx-Component
function lifecycles (hooks = MINA_COMPONENT_HOOKS) {
  let result = {}
  hooks.forEach((hook) => {
    let before = ADDON_BEFORE_HOOKS[hook]
    if (!before) {
      result[hook] = function handler () {
        let context = this.__tina_component__
        if (context[hook]) {
          return context[hook].apply(context, arguments)
        }
      }
      return
    }
    result[hook] = function handler () {
      let context = this.__tina_component__
      if (context[before]) {
        context[before].apply(context, arguments)
      }
      if (context[hook]) {
        return context[hook].apply(context, arguments)
      }
    }
  })
  return result
}

const BUILTIN_MIXINS = [$initial, $log]

class Component extends Basic {
  static HOOKS = [...MINA_COMPONENT_HOOKS, ...values(ADDON_BEFORE_HOOKS)]

  static mixins = []

  static define (model = {}) {
    // use mixins
    let mixins = [...BUILTIN_MIXINS, ...Component.mixins, ...(model.mixins || [])].map((mixin) => {
      return (model) => Component.mix(model, mixin)
    })
    model = compose(...mixins.reverse())(model)

    // create wx-Component options
    let component = {
      properties: properties(model.properties),
      methods: methods(model.methods),
      ...lifecycles(),
    }

    // creating Tina-Component on **wx-Component** created.
    // !important: this hook is added to wx-Component directly, but not Tina-Component
    component = prependHooks(component, {
      created () {
        let instance = new Component({ model, $source: this })
        // create bi-direction links
        this.__tina_component__ = instance
        instance.$source = this
      },
    })

    // apply wx-Component options
    new globals.Component({
      ...pick(model, without(MINA_COMPONENT_OPTIONS, MINA_COMPONENT_HOOKS)),
      ...component,
    })
  }

  constructor ({ model = {}, $source }) {
    super()

    // creating Tina-Component members
    let members = {
      compute: model.compute || function () {
        return {}
      },
      ...model.methods,
      ...filterObject(model, (property, name) => ~Component.HOOKS.indexOf(name)),
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
