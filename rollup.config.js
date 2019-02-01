import createConfig from './rollup.config.base.js'

export default [
  {
    output: 'lib/wechat/tina.js',
    env: {
      MINA_PLATFORM: JSON.stringify('wechat'),
    },
  },
  {
    output: 'lib/ant/tina.js',
    env: {
      MINA_PLATFORM: JSON.stringify('ant'),
    },
  },
].map(createConfig)
