import { mapObject } from './functions'

// generate methods for wx-Component
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
