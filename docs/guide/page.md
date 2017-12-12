# 页面

## 基础
Tina 高度保持了传统小程序 (MINA) 页面原有的设计，并在其身上附加了新的能力。有关 MINA 页面的基本介绍，请查阅微信官方的文档 ——
[MINA - 注册页面](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html)。

## 定义一个新页面
在使用 tina 定义一个新的页面时，与 MINA 并没有太大的区别：

```javascript
/*
 * 传统小程序 (MINA) 项目
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

```javascript
/**
  * 使用 tina 的项目
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

?> [为什么是 ``Page.define()`` 而不是 ``Page()``](guide/faq?id=%e4%b8%ba%e4%bb%80%e4%b9%88%e6%98%af-tinapagedefine-%e8%80%8c%e4%b8%8d%e6%98%af-tinapage-%ef%bc%9f)

## 更新数据
与使用 MINA 一样，你可以在页面实例中调用 ``this.setData(data)`` 更新数据。在 tina 的内部实现中，由于 MINA 限制了每次 setData 的数据大小 —— [单次设置的数据不能超过 1024kB](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#pageprototypesetdata)，传入 tina ``setData`` 中的数据会自动经过 *diff* 处理，以求减少数据传入 MINA 时的大小。

## 方法
Tina 将页面实例的方法折叠进了 ``methods`` 参数中，而这也是 tina 和 MINA 在定义页面时传参的最大区别。

## 生命周期 / 页面事件
Tina Page 保持了 MINA Page 的所有生命周期和页面事件，并新增 ``beforeLoad`` 钩子，即：

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

!> ``beforeLoad`` 钩子主要用于一般插件的加载注入，并约定在该钩子的处理函数中不应访问 ``this.data`` 或调用 ``this.setData()`` 操作数据。

## 计算属性
MINA 的 wxml 语言提供了 [简单的表达式运算能力](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/data.html#运算)，但冗长的表达式和过于简单的运算能力往往也无法满足项目的实际需求。

为此，Tina Page 中集成了计算属性的能力。

### 示例
```html
<template>
  <view>{{ today }}</view>
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

通过 ``compute(data)`` 方法计算返回的值，将被合并入实例的 ``data`` 属性中。你可以在模板或者实例方法中通过读取 ``data`` 使用计算后的值。
