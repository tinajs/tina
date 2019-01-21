import config from './config'

export default {
  get App () {
    return config.globals.App || App
  },
  get Page () {
    return config.globals.Page || Page
  },
  get Component () {
    return config.globals.Component || Component
  },
  get wx () {
    return config.globals.wx || wx
  },
  get getApp () {
    return config.globals.getApp || getApp
  },
  get getCurrentPages () {
    return config.globals.getCurrentPages || getCurrentPages
  },
}
