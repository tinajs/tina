export function objectify (object) {
  if (typeof object !== 'object') {
    return object
  }
  return JSON.parse(JSON.stringify(object))
}
