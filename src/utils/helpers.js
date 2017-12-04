export function mapObject (obj, iteratee = o => o) {
  let result = {}
  for (let key in obj) {
    result[key] = iteratee(obj[key], key, obj)
  }
  return result
}

export function filterObject (obj, predicate = o => o) {
  let result = {}
  for (let key in obj) {
    if (predicate(obj[key], key, obj)) {
      result[key] = obj[key]
    }
  }
  return result
}

export function isEmpty (obj) {
  if (obj == null) {
    return true
  }
  if (obj.length > 0) {
    return false
  }
  if (obj.length === 0) {
    return true
  }
  for (let key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      return false
    }
  }
  return true
}

export function pick (object, keys = []) {
  let picked = {}
  keys.forEach((key) => {
    picked[key] = object[key]
  })
  return picked
}

export function without (input, exclude = []) {
	return input.filter((x) => exclude.indexOf(x) === -1)
}

export function addHooks (context, handlers, isPrepend = false) {
  let result = {}
  for (let name in handlers) {
    result[name] = function handler (...args) {
      if (isPrepend) {
        handlers[name].apply(this, args)
      }
      if (typeof context[name] === 'function') {
        context[name].apply(this, args)
      }
      if (!isPrepend) {
        handlers[name].apply(this, args)
      }
    }
  }
  return {
    ...context,
    ...result,
  }
}
