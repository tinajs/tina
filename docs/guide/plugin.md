# 插件

## 使用插件
> Tina 中的插件可以在全局或仅单个页面/组件中使用。

通过全局方法 ``Page.use`` 和 ``Component.use`` 可以分别为所有的 Page 和 Component 使用插件。

例如为所有页面和组件添加路由插件：

```javascript
// app.js or <script> in app.mina
import { Page, Component } from '@tinajs/tina'
import createRouterPlugin from '@tinajs/tina-router'

const router = createRouterPlugin()

Page.use(router)
Component.use(router)

App(......)
```

当然，你也可以仅仅在单个页面或组件中使用插件：

```javascript
// demo-page.js or <script> in demo-page.mina
import { Page } from '@tinajs/tina'
import router from '@tinajs/tina-router'

Page.define(router()({
  data: {
    ......
  },
  ......
}))
```

在单个页面或组件中使用多个插件时，推荐使用 [compose-function](https://www.npmjs.com/package/compose-function) 简化代码：

```javascript
// demo-page.js or <script> in demo-page.mina
import compose from 'compose-function'
import { Page } from '@tinajs/tina'
import router from '@tinajs/tina-router'
import tinax from '../store'

Page.define(compose(router(), tinax.connect())({
  data: {
    ......
  },
  ......
}))
```

## 开发插件
TODO
