# 组件

## 基础
Tina 没有破坏 MINA 自定义组件原有的设计，仅仅是在其身上附加了新的能力。有关数据、方法、生命周期等基本介绍，请先查阅微信官方的文档 —— [MINA - 自定义组件](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)。

## 定义一个新组件
在使用 Tina 定义一个新的组件时，与传统的小程序 (**MINA**) 并没有太大的区别：


**传统小程序 (MINA) 项目：**
```javascript
/*
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

**使用 Tina 的项目：**
```javascript
/**
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

**对比：**
```diff
@@ -1,5 +1,7 @@
-Component({
+import { Component } from '@tinajs/tina'
+
+Component.define({
   properties: {
     content: String,
   },
   data: {
```

## 更新数据
与 Tina Page 一样，Tina Component 中的 ``setData`` 也会自动做 *diff* 优化。具体请查阅 [页面 - 更新数据](guide/page?id=更新数据)。

## 计算属性
与 Tina Page 一样，Tina Component 中也集成了计算属性的能力。具体请查阅 [页面 - 计算属性](guide/page?id=计算属性) 。
