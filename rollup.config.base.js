import commonjs from 'rollup-plugin-commonjs'
import nodejs from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'
import replace from 'rollup-plugin-replace'

export default function createConfig ({ output, env }) {
  let replacement = {}
  for (let key in env) {
    replacement[`process.env.${key}`] = env[key]
  }

  return {
    input: 'src/index.js',
    output: {
      exports: 'default',
      format: 'umd',
      name: 'tina',
      file: output,
    },
    plugins: [
      replace({
        values: replacement,
      }),
      builtins(),
      babel({
        exclude: ['node_modules/**'],
        plugins: [
          'external-helpers',
        ],
      }),
      nodejs(),
      commonjs(),
    ],
  }
}
