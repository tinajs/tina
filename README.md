# Tina.js
> 一款轻巧的渐进式小程序框架

[![npm](https://img.shields.io/npm/v/@tinajs/tina.svg?style=flat-square)](https://www.npmjs.com/package/@tinajs/tina)
[![license](https://img.shields.io/github/license/tinajs/tina.svg?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## 特性
- 轻盈小巧

  核心打包后仅 ![](http://img.badgesize.io/https://unpkg.com/@tinajs/tina@1.0.1/dist/tina.min.js?style=flat-square) 。

- 极易上手

  保持 MINA (微信小程序官方框架) 大部分 API 设计，可从传统项目快速迁移上手。

- 渐进增强

  自由选择扩展功能，如路由、状态管理，以及由你自己编写的插件。

## NPM 与单文件组件

结合我们为你准备的 [mina-webpack](https://github.com/tinajs/mina-webpack)，还能够为你的小程序项目带来：

- Mina 单文件组件 / 页面
- NPM（没错！除了一般的包，你还可以分享或下载独立的 Mina 组件）
- 以及 Webpack 附带的其他能力，如 Babel、PostCSS、代码压缩等功能。

## 示例
**pages/home.mina**
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

查看更多示例：
- [tina-examples](https://github.com/tinajs/tina-examples/packages)
- [tina-hackernews](https://github.com/tinajs/tina-hackernews)

## 文档
如果你已经熟悉传统的小程序开发，那么上手 tina 将会非常简单。

接下来，请前往 [tinajs.github.io/tina](https://tinajs.github.io/tina) 查阅更详尽的指南。

## Showcase
- [Hacker News 热点](https://github.com/imyelo/tina-hackernews)

  ![wxcode](https://github.com/tinajs/assets/raw/master/images/showcases/hackernews-wxcode-172.png)

## License
Apache-2.0 &copy; [yelo](https://github.com/imyelo), 2017 - present
