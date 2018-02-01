# 路由增强
微信官方小程序框架 (MINA) 中集成了基础的 [路由功能](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/route.html)。在 Tina 中，你可以毫无疑问地直接使用官方接口，同时也可以借助插件扩展这一能力。

## tina-router
我们推荐使用 [@tinajs/tina-router](https://github.com/tinajs/tina-router) 库。在安装 **tina-router** 后，你将可以在页面或组件的实例中更优雅地读取和使用路由。

```javascript
/**
 * /app.js or <script> in /app.mina
 */
import Tina from '@tinajs/tina'
import router from '@tinajs/tina-router'

Tina.use(router)
```

```javascript
/**
 * /pages/user.js or <script> in /pages/user.mina
 *
 * 当前路径: /pages/user?id=4310
 */
import { Page } from '@tinajs/tina'
import { api } from '../api'

Page.define({
  onLoad () {
    api.fetchUser({ id: this.$route.query.id }).then((data) => this.setData(data))
  },
  methods: {
    toLogin () {
      this.$router.navigate(`/pages/login?from=${this.$route.fullPath}`)
    },
  }
})
```

> [查看完整的示例项目 —— tina-hackernews](https://github.com/imyelo/tina-hackernews)


如果你对 tina-router 感兴趣，欢迎访问 [@tinajs/tina-router](https://github.com/tinajs/tina-router) 了解更多信息。

或者你有更好的路由扩展，也欢迎提交 [Pull Request](https://github.com/tinajs/tina/pulls) 告诉我们。
