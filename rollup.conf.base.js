import commonjs from 'rollup-plugin-commonjs'
import nodejs from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'

const cssExportMap = {}

export default {
  input: 'src/index.js',
  plugins: [
    builtins(),
    babel({
      exclude: ['node_modules/**'],
    }),
    nodejs(),
    commonjs(),
  ],
}
