import map from 'just-map-object'
import filter from 'just-filter-object'
import globals from '../../utils/globals'
import { isEmpty } from '../../utils/functions'

function warn (message) {
  console.warning(new Error(message))
}

export function createAntBuiltinMixins (BUILTIN_MIXINS) {
  return [...BUILTIN_MIXINS,
    {
      created () {
        // sync props into readable data
        this.setData(this.$source.props)
      },
    },
  ]
}

export function AntComponent (wechatOptions) {
  function notSupported (option) {
    warn(`\`Component({ ${option} })\` is not supported in Ant Mini Program.`)
  }

  let {
    behaviors,
    relations,
    options,
    data,
    properties,
    methods,
    created,
    attached,
    ready,
    moved,
    detached,
  } = wechatOptions

  let props = map(properties, (key, prop) => {
    /**
     * properties: {
     *   foo: String,
     * }
     */
    if (!('type' in prop)) {
      return prop()
    }
    /**
     * properties: {
     *   foo: {
     *     type: String,
     *   },
     * }
     */
    return 'value' in prop ? prop.value : prop.type()
  })

  let observers = map(filter(properties, (key, prop) => {
    return 'observer' in prop
  }), (key, prop) => {
    return prop.observer
  })

  properties = map(properties, (key, value) => {
    if (!('type' in value)) {
      return {
        type: value,
        value: value(),
        observer () {},
      }
    }
    return Object.assign({
    }, value)
  })

  if (!isEmpty(behaviors)) {
    notSupported('behaviors')
  }
  if (!isEmpty(relations)) {
    notSupported('relations')
  }
  if (!isEmpty(options)) {
    notSupported('options')
  }
  if (!isEmpty(moved)) {
    notSupported('moved')
  }

  return new globals.Component({
    data,
    props,
    methods: map(methods, (key, method) => {
      return function () {
        return method.apply(this, arguments)
      }
    }),
    didMount () {
      // add missing property
      this.triggerEvent = function (name, detail, options) {
        let listener = this.props[`on${name[0].toUpperCase()}${name.slice(1)}`]
        if (listener) {
          listener({
            detail,
            options,
          })
        }
      }
      this.id = this.$id

      if (created) {
        created.call(this)
      }
      if (attached) {
        attached.call(this)
      }
      if (ready) {
        ready.call(this)
      }
    },
    didUpdate (prevProps) {
      for (let key in observers) {
        if (prevProps[key] !== this.props[key]) {
          observers[key].call(this, this.props[key], prevProps[key])
        }
      }
      for (let key in prevProps) {
        if (prevProps[key] !== this.props[key]) {
          this.__tina_instance__.setData({
            [key]: this.props[key],
          })
        }
      }
    },
    didUnmount () {
      if (detached) {
        detached.call(this)
      }
    },
  })
}
