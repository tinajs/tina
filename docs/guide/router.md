# 路由
微信官方小程序框架 (MINA) 中集成了基础的[路由功能](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/route.html)，但对比主流的 web 前端框架而言还是稍显不足。

而使用 tina，你可以借助混合 (mixin) 增强其功能。

## tina-router
我们推荐使用 [@tinajs/tina-router](https://github.com/tinajs/tina-router) 库。在混合 **tina-router** 后，你将可以在页面或组件的实例中更优雅地读取和使用路由。

```javascript
/**
 * demo-page.js or <script> in demo-page.mina
 *
 * 当前路径: /pages/user?id=4310
 */
import { Page } from '@tinajs/tina'
import router from '@tinajs/tina-router'
import { api } from '../api'

Page.define({
  mixins: [router()],
  onLoad () {
    api.fetchUser({ id: this.$router.query.id }).then((data) => this.setData(data))
  },
  methods: {
    toArticles () {
      this.$router.navigate(`/pages/articles?by=${this.$router.query.id}`)
    },
  }
})
```

了解更多的信息请查阅 [@tinajs/tina-router 文档](https://github.com/tinajs/tina-router)。
