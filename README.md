<p align="center"><img src="https://avatars2.githubusercontent.com/u/33456300?s=200&v=4"/ ></p>
<p align="center">一款轻巧的渐进式小程序框架</p>

## 特性
- 轻巧

  核心打包后仅 ![](http://img.badgesize.io/https://unpkg.com/@tinajs/tina/dist/tina.min.js?style=flat-square) 。

- 易上手

  保持 mina (微信小程序官方框架) 大部分 API 设计，可从传统项目快速迁移上手。

- 渐进增强

  自由选择扩展功能，如路由、状态管理，以及由你自己编写的插件。


## 开始之前
你也许还会对 [@tinajs/mina-webpack](https://github.com/tinajs/mina-webpack) 感兴趣，可使你的小程序项目：

- 支持使用 npm 库。
- 支持使用 ``.mina`` 单文件组件 (页面)；同时结合 npm 可引入第三方 mina 组件。
- 获得 webpack loaders / plugins 能力，如 babel、postcss、代码混淆等功能。

## 文档
如果你已经熟悉传统的小程序开发，那么上手 tina 将会非常简单。

详尽的文档可以在 [tinajs.github.io/tina](tinajs.github.io) 查阅。

## 上手示例
```javascript
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
```

## Showcase
- [Hacker News 热点](https://github.com/imyelo/tina-hackernews)

## License
MIT @ [yelo](https://github.com/imyelo), 2017 - present

