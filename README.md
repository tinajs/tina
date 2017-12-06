<p align="center"><img src="https://avatars2.githubusercontent.com/u/33456300?s=200&v=4"/ ></p>
<p align="center">一款轻巧的渐进式小程序框架</p>

## 特性
- 轻巧。

  核心打包后仅 12kb+ 体积。

- 非入侵。

  兼容 mina (微信小程序官方框架) API，可从旧项目快速迁移。

- 易扩展。

  自由插拔任何扩展，如路由、状态管理，以及你自己创造的新功能。


## 开始之前
你也许还会对 [mina-webpack](https://github.com/tinajs/mina-webpack) 感兴趣，可使你的小程序项目：

- 支持使用 npm 库。
- 支持使用 ``.mina`` 单文件组件 (页面)；同时结合 npm 可引入第三方 mina 组件。
- 提供 webpack loaders / plugins 能力，如 babel、postcss、代码混淆等功能。

## 文档
所有详细的文档都可以在 [tinajs.github.io/tina](tinajs.github.io) 查阅

## 示例
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
    let id = this.$route.query.id
    fetchUser(id)
      .then(({ firstname, lastname ) => this.setData({ firstname, lastname }))
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

