# 页面

## 基础
Tina 高度保持了传统小程序 (MINA) 页面原有的设计，并在其身上附加了新的能力。有关 MINA 页面的基本介绍，请查阅微信官方的文档 ——
[MINA - 注册页面](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html)。

## 定义一个新页面
在使用 Tina 定义一个新的页面时，与 MINA 并没有太大的区别：

**传统小程序 (MINA) 项目：**
```javascript
/*
 * /demo-page.js
 */
Page({
  data: {
    count: 0,
  },
  onLoad () {
    console.log(this.data.count)
  },
  handleTapButton () {
    console.log(this.data.count)
  },
})
```

**使用 Tina 的项目**：
```javascript
/**
  * /demo-page.js or <script> in demo-page.mina
  */
import { Page } from '@tinajs/tina'

Page.define({
  data: {
    count: 0,
  },
  onLoad () {
    console.log(this.data.count)
  },
  methods: {
    handleTapButton () {
      console.log(this.data.count)
    },
  },
})
```

**对比：**
```diff
@@ -1,11 +1,15 @@
-Page({
+import { Page } from '@tinajs/tina'
+
+Page.define({
   data: {
     count: 0,
   },
   onLoad () {
     console.log(this.data.count)
   },
-  handleTapButton () {
-    console.log(this.data.count)
+  methods: {
+    handleTapButton () {
+      console.log(this.data.count)
+    },
   },
 })
```

## 更新数据
与使用 MINA 一样，你可以在页面实例中调用 ``this.setData(data)`` 更新数据。

除此以外，由于 MINA 限制了每次 setData 的数据量 —— [单次设置的数据不能超过 1024kB](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#pageprototypesetdata)，所以在 Tina 的内部，传入 ``setData`` 的数据都会自动经过 *diff* 处理，以助减轻数据传至 MINA 时的大小。

## 方法
Tina 将页面实例的方法折叠进了 ``methods`` 参数中，而这也是 Tina 和 MINA 在定义页面时传参的最大区别。

## 生命周期 / 页面事件
Tina Page 保持了 MINA Page 的所有生命周期和页面事件，并额外增加 ``beforeLoad`` 钩子，即：

- 生命周期钩子
  - **beforeLoad**
  - onLoad
  - onReady
  - onShow
  - onHide
  - onUnload
- 页面事件
  - onPullDownRefresh
  - onReachBottom
  - onShareAppMessage
  - onPageScroll

!> ``beforeLoad`` 钩子主要用于注入一般扩展的加载函数，并约定在该钩子的处理函数中不应访问 ``this.data`` 或调用 ``this.setData()`` 操作数据。

## 计算属性
MINA 的 wxml 语言提供了 [简单的表达式运算能力](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/data.html#运算)，但冗长的表达式和过于简单的运算能力往往也无法满足项目的实际需求。

为此，Tina Page 中集成了计算属性的能力。

### 示例
```html
<template>
  <view>Today: {{ today }}</view>
</template>

<script>
import { Page } from '@tinajs/tina'
import fecha from 'fecha'

Page.define({
  data: {
    now: new Date(),
  },
  compute ({ now }) {
    return {
      today: fecha.format(now, 'YYYY-MM-DD'),
    }
  },
  onLoad () {
    console.log(this.data.today)
  },
})
</script>
```

通过 ``compute(data)`` 方法计算返回的值，将被合并入实例的 ``data`` 属性中。你可以在模板或者实例方法中通过读取 ``data`` 使用。


## getCurrentPages
当使用 Tina 后，你依旧可以通过小程序自身暴露的全局 API [`getCurrentPages()`](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html#getcurrentpages) 获取当前页面栈。
但需要注意的是，该 API 返回的页面栈并非 `Tina.Page.define(...)` 中的实例，这可能会让你感到困扰；因此我们也提供了与之相应的 `getCurrentPages()` API，帮助你访问 **当前通过 Tina Page 构造的页面栈** ：

```javascript
/**
 * 从 `@tinajs/tina` 中引入 `getCurrentPages`，而非直接使用全局暴露的 API
 */
import { Page, getCurrentPages } from '@tinajs/tina'

Page.define({
  onLoad () {
    console.log(getCurrentPages())
  },
})
```

> 但通常来说，对于跨页面操作数据的场景，我们更推荐你使用 [全局状态管理器](/guide/state-management)。


## 为什么是 Page.define
*为什么是 ``Page.define()``，而不是 ``Page()`` 或 ``new Page()`` ？*

因为在调用微信小程序中集成的 ``Page()`` 方法时，其实际的作用是 **定义/声明/注册一个页面** ，而非创建一个页面实例。由于首字母大写的命名，容易与 ``new Page()`` 混淆。所以在 tina 中，该行为的方法名被明确为 ``Page.define()``。

> 当然，在这个问题上还有更高明的设计，例如 [Vue SFC](https://vuejs.org/v2/guide/single-file-components.html) 中的 ``module.exports = ...`` :wink:。
