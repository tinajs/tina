import { mapObject, fromPairs } from './functions'

// generate data for wx-Component
export function data (data) {
  return data.toPlainObject()
}

// generate methods for wx-Component
export function methods (object) {
  return mapObject(object || {}, (method, name) => function handler (...args) {
    let context = this.__tina_instance__
    return context[name].apply(context, args)
  })
}

// generate lifecycles for wx-Component
export function lifecycles (hooks, getBeforeHookName) {
  return fromPairs(hooks.map((origin) => {
    let before = getBeforeHookName(origin)
    return [
      origin,
      function handler () {
        let context = this.__tina_instance__
        if (before && context[before]) {
          context[before].apply(context, arguments)
        }
        if (context[origin]) {
          return context[origin].apply(context, arguments)
        }
      },
    ]
  }))
}

// generate properties for wx-Component
export function properties (object) {
  function wrap (key, handler) {
    return function observer (...args) {
      let newer = args[0]
      let context = this.__tina_instance__
      let Data = this.__tina_instance__.constructor.Data
      context.setData(new Data({
        [key]: newer,
      }))
      if (typeof handler === 'string') {
        return context[handler].apply(context, args)
      }
      if (typeof handler === 'function') {
        return handler.apply(context, args)
      }
    }
  }

  return mapObject(object || {}, (rule, key) => {
    if (typeof rule === 'function' || rule === null) {
      return {
        type: rule,
        observer: wrap(key),
      }
    }
    if (typeof rule === 'object') {
      return {
        ...rule,
        observer: wrap(key, rule.observer),
      }
    }
  })
}
