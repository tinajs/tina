# 界面反馈
得益于插件和混合能力，我们为你准备了常用的几种界面反馈插件。

## 弹窗
基于微信官方的接口 (``showModal``、``hideModal``)，[tina-modal](https://github.com/tinajs/tina-modal) 提供了使用方便的 Promise 风格的 ``alert``、``confirm`` 方法。

```javascript
/**
 * /app.js or <script> in /app.mina
 */
import Tina from '@tinajs/tina'
import modal from '@tinajs/tina-modal'

Tina.use(modal)
```

```javascript
/**
 * /demo-page.js or <script> in /demo-page.mina
 */
import { Page } from '@tinajs/tina'

Page.define({
  onLoad () {
    this.$confirm({ content: 'say hi?' })
      .then(() => this.$alert({ content: 'hi' }))
  },
})
```

!> 如果你不喜欢这样的设计，除了直接调用微信官方的接口外，使用 [wxio](https://github.com/imyelo/wxio) 也是一个不错的选择。

> [查看完整的示例项目 —— tina-hackernews](https://github.com/imyelo/tina-hackernews)

如果你对 tina-modal 感兴趣，欢迎访问 [@tinajs/tina-modal](https://github.com/tinajs/tina-modal) 了解更多信息。

## 加载状态
微信官方的接口提供了两种反馈加载状态的方式：``show (hide) Loading`` (强反馈) 和 ``show (hide) NavigationBarLoading`` (弱反馈)。使用 [tina-loading](https://github.com/tinajs/tina-loading) 并结合 ``Promise.prototype.finally``，可以很轻松地管理 ``NavigationBarLoading``。


```javascript
/**
 * /app.js or <script> in /app.mina
 */
import Tina from '@tinajs/tina'
import { loading } from '@tinajs/tina-loading'

Tina.use(loading)
```

```javascript
/**
 * /demo-page.js or <script> in /demo-page.mina
 */
import { Page } from '@tinajs/tina'
import { fetchData } from './api'
Page.define({
  methods: {
    usageA () {
      fetchData()
        .then((data) => {
          // ...balabala
        })
        .finally(this.$loading())
      },
    async usageB () {
      this.$loading.push()
      try {
        const data = await fetchData()
        // ...balabala
      } catch () {}
      this.$loading.pop()
    },
  },
})
```

> [查看完整的示例项目 —— tina-hackernews](https://github.com/imyelo/tina-hackernews)

如果你对 tina-loading 感兴趣，欢迎访问 [@tinajs/tina-loading](https://github.com/tinajs/tina-loading) 了解更多信息。

## 更多界面反馈扩展
或者你有更好的界面反馈扩展，也欢迎提交 [Pull Request](https://github.com/tinajs/tina/pulls) 告诉我们。
