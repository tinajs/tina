import compose from 'compose-function'
import querystring from 'querystring'
import { mapObject, filterObject, isEmpty, pick, without, addHooks } from '../utils/helpers'
import globals from '../utils/globals'
import Basic from './basic'

const COMPONENT_OPTIONS = ['properties', 'data', 'methods', 'behaviors', 'created', 'attached', 'ready', 'moved', 'detached', 'relations', 'options']
const COMPONENT_HOOKS = ['created', 'attached', 'ready', 'moved', 'detached']
const COMPONENT_METHODS = ['setData', 'hasBehavior', 'triggerEvent', 'createSelectorQuery', 'selectComponent', 'selectAllComponents', 'getRelationNodes']
const COMPONENT_ATTRIBUTES = ['is', 'id', 'dataset', 'data']

const ADDON_BEFORE_HOOKS = {
  created: 'beforeCreate',
  attached: 'beforeAttach',
  ready: 'beforeReady',
  move: 'beforeMove',
  detached: 'beforeDetach',
}

const OVERWRITED_METHODS = ['setData']
const OVERWRITED_ATTRIBUTES = ['data']

// generate methods for wx-Component
function methods (object) {
  return mapObject(object || {}, (method, name) => function handler (...args) {
    let context = this.__tina_component__
    return context[name].apply(context, args)
  })
}

// generate lifecycles for wx-Component
function lifecycles (hooks = COMPONENT_HOOKS) {
  let result = {}
  COMPONENT_HOOKS.forEach((hook) => {
    let before = ADDON_BEFORE_HOOKS[hook]
    if (!before) {
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

// builtin initial middleware for Tina-Component
function $initial (model) {
  return addHooks(model, {
    attached () {
      // init data (just for triggering ``compute`` in this moment)
      this.setData()
      this.$log('Initial Middleware', 'Ready')
    }
  })
}
// builtin log middleware for Tina-Component
function $log (model) {
  return addHooks(model, {
    beforeCreate () {
      this.$log = this.constructor.log.bind(this.constructor)
      this.$log('Log Middleware', 'Ready')
    }
  })
}

const BUILTIN_MIDDLEWARES = [$initial, $log]

class Component extends Basic {
  static define (model = {}) {
    // use builtin middlewares
    model = compose(...BUILTIN_MIDDLEWARES)(model)
    // use custom middlewares
    if (Component.middlewares.length > 0) {
      model = compose(...Component.middlewares)(model)
    }

    // create wx-Component options
    let component = {
      methods: methods(model.methods),
      ...lifecycles(),
    }

    // creating Tina-Component on **wx-Component** created.
    // !important: this hook is added to wx-Component directly, but not Tina-Component
    component = addHooks(component, {
      created () {
        let instance = new Component({ model, $component: this })
        // create bi-direction links
        this.__tina_component__ = instance
        instance.$component = this
      },
    }, true)

    // apply wx-Component options
    new globals.Component({
      ...pick(model, without(COMPONENT_OPTIONS, COMPONENT_HOOKS)),
      ...component,
    })
  }

  constructor ({ model = {}, $component }) {
    super()

    // creating Tina-Component members
    let members = {
      compute: model.compute || function () {
        return {}
      },
      ...model.methods,
      ...filterObject(model, (property, name) => ~[...COMPONENT_HOOKS, ...Object.values(ADDON_BEFORE_HOOKS)].indexOf(name)),
    }
    // apply members into instance
    for (let name in members) {
      this[name] = members[name]
    }

    return this
  }

  get data () {
    return this.$component.data
  }
}

// link the rest of wx-Component attributes and methods to Tina-Component
;[...without(COMPONENT_ATTRIBUTES, OVERWRITED_ATTRIBUTES), ...without(COMPONENT_METHODS, OVERWRITED_METHODS)].forEach((name) => {
  Object.defineProperty(Component.prototype, name, {
    set: function (value) {
      throw new Error(`Not allowed to set ${name}`)
    },
    get: function () {
      let context = this.$component
      let member = context[name]
      if (typeof member === 'function') {
        return member.bind(context)
      }
      return member
    },
  })
})

export default Component
