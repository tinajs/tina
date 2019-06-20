import map from 'just-map-object'

const strategies = (toOptions, fromOptions) => ({
  ...toOptions,
  ...map(fromOptions, (key, extra) => {
    const strat = strategies[key] || strategies.default
    return strat(toOptions[key], extra)
  })
})

strategies.default = (toValue, fromValue) => {
  if (Array.isArray(toValue)) {
    return toValue.concat(fromValue)
  }
  if (typeof toValue === 'object') {
    return {
      ...toValue,
      ...fromValue,
    }
  }
  return fromValue
}
strategies.pageLifetimes = (toValue, fromValue) => strategies(toValue, fromValue)

export default strategies
