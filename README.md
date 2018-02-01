# Tina.js
> 一款轻巧的渐进式微信小程序框架

[![npm](https://img.shields.io/npm/v/@tinajs/tina.svg?style=flat-square)](https://www.npmjs.com/package/@tinajs/tina)
[![license](https://img.shields.io/github/license/tinajs/tina.svg?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## 特性
- :honeybee: 轻盈小巧

  核心框架打包后仅 ![](http://img.badgesize.io/https://unpkg.com/@tinajs/tina/dist/tina.min.js?style=flat-square) 。

- :raising_hand: 极易上手

  保留 MINA (微信小程序官方框架) 的大部分 API 设计；无论你有无小程序开发经验，都可以轻松过渡上手。

- :chart_with_upwards_trend: 渐进增强

  我们已经为你准备好了 [状态管理器](https://tina.js.org/#/guide/state-management) (比如 Redux)、[Immutable.js](https://github.com/tinajs/tina-immutable)、[路由增强](https://tina.js.org/#/guide/router) 等扩展，当然你也可以 [自己编写一个新的插件](https://tina.js.org/#/guide/plugin)。

## NPM 与单文件组件

结合我们为你准备的 [mina-webpack](https://github.com/tinajs/mina-webpack)，还能够为你的小程序项目带来：

- :oden: Mina 单文件组件 / 页面
- :package: NPM（没错！除了一般的包，你还可以分享或下载独立的 Mina 组件）
- :crystal_ball: 以及 Webpack 附带的其他能力，如 Babel、PostCSS、代码压缩等功能。

## 一个简单的例子
**/app.mina**
```html
<script>
import Tina from '@tinajs/tina'
import router from '@tinajs/tina-router'

Tina.use(router)

App()
</script>
```

**/pages/home.mina**
```html
<config>
{
  "usingComponent": {
    "logo": "../components/logo.mina"
  }
}
</config>

<template>
  <view>
    <text>I'm {{ name }}. </text>
    <button bindtap="sayHi">Say Hi</button>
    <logo />
  </view>
</template>

<script>
import { Page } from '@tinajs/tina'
import { fetchUser } from '../api'

Page.define(({
  data: {
    firstname: 'Tina',
    lastname: 'S',
  },

  // 由 tina 集成的计算属性能力
  compute ({ firstname, lastname }) {
    return {
      name: `${firstname} ${lastname}`,
    }
  }

  onLoad () {
    // 由 tina-router 提供的路由能力扩展
    let { id } = this.$route.query
    fetchUser(id)
      .then(({ firstname, lastname ) => this.setData({ firstname, lastname }))
      .catch(() => this.$router.redirect(`/pages/login?from=${this.$route.fullPath}`))
  },

  methods: {
    sayHi () {
      wechat.showModal({
        title: `Hi ${this.data.name}`,
      })
    },
  },
}))
</script>

<style>
view {
  padding: 30px 20px;
}
button {
  margin: 20px 0;
}
</style>
```

## 浏览更多示例
[浏览更多使用 Tina.js 的示例](https://tina.js.org/#/guide/examples)

## 文档
如果你已经熟悉传统的小程序开发，那么上手 tina 将会非常简单。

接下来，请前往 [tina.js.org](https://tina.js.org) 查阅更详尽的指南。

## Showcase
- [Hacker News 热点](https://github.com/imyelo/tina-hackernews)

  ![wxcode](https://github.com/tinajs/assets/raw/master/images/showcases/hackernews-wxcode-172.png)

## License
Apache-2.0 &copy; [yelo](https://github.com/imyelo), 2017 - present
