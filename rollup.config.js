import uglify from 'rollup-plugin-uglify'
import base from './rollup.conf.base.js'

export default Object.assign({}, base, {
  output: {
    file: 'dist/tina.min.js',
    format: 'umd',
    name: 'tina',
  },
  plugins: base.plugins.concat([
    uglify(),
  ]),
})
