import { mapObject } from './functions'

// generate methods
export function methods (object) {
  return mapObject(object || {}, (method, name) => function handler (...args) {
    let context = this.__tina_instance__
    return context[name].apply(context, args)
  })
}

// generate lifecycles
export function lifecycles (hooks, getBeforeHookName) {
  let result = {}
  hooks.forEach((hook) => {
    let before = getBeforeHookName(hook)
    if (!before) {
      result[hook] = function handler () {
        let context = this.__tina_instance__
        if (context[hook]) {
          return context[hook].apply(context, arguments)
        }
      }
      return
    }
    result[hook] = function handler () {
      let context = this.__tina_instance__
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

// generate properties for wx-Component
export function properties (object) {
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
