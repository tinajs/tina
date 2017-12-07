import merge from 'deepmerge'
import base from './rollup.config.base.js'

export default merge(base, {
  output: {
    file: 'dist/tina.js',
    format: 'umd',
    name: 'tina',
  },
})
