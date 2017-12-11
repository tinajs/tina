export default {
  merge: function (source, extra) {
    if (Array.isArray(source)) {
      return source.concat(extra)
    }
    if (typeof source === 'object') {
      return {
        ...source,
        ...extra,
      }
    }
    return extra
  }
}
