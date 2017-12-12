# 页面

## 基础
Tina 没有破坏 MINA 自定义组件原有的设计，并在其身上附加了新的能力。有关数据、方法、生命周期等介绍，请查阅微信官方的文档 —— [MINA - 自定义组件](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)。

## 定义一个新组件
在使用 tina 定义一个新的组件时，与传统的小程序 (**MINA**) 并没有太大的区别：

```javascript
/*
 * 传统小程序 (MINA) 项目
 * /demo-component.js
 */
Component({
  properties: {
    content: String,
  },
  data: {
    ready: false,
  },
  attached () {
    console.log(this.data.content)
  },
  methods: {
    handleTapButton () {
      console.log(this.data.content)
    },
  },
})
```

```javascript
/**
  * 使用 tina 的项目
  * /demo-component.js or <script> in demo-component.mina
  */
import { Component } from '@tinajs/tina'

Component.define({
  properties: {
    content: String,
  },
  data: {
    ready: false,
  },
  attached () {
    console.log(this.data.content)
  },
  methods: {
    handleTapButton () {
      console.log(this.data.content)
    },
  },
})
```

?> [为什么是 ``Component.define()`` 而不是 ``Component()``](guide/faq?id=%e4%b8%ba%e4%bb%80%e4%b9%88%e6%98%af-tinapagedefine-%e8%80%8c%e4%b8%8d%e6%98%af-tinapage-%ef%bc%9f)

## 更新数据
与 Tina Page 一致，Tina Component 中的 ``setData`` 同样会自动做 *diff* 优化。具体请查阅 [页面 - 更新数据](guide/page?id=更新数据)。

## 计算属性
与 Tina Page 一致，Tina Component 中同样集成了计算属性的能力。具体请查阅 [页面 - 计算属性](guide/page?id=计算属性) 。
