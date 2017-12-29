# 单文件组件
在传统小程序项目中，一个页面或组件 [由多个文件名相同而后缀类型不同的文件组成](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html#pages) 。虽然这样的设定足以应对一般项目的需要，但在开发和维护的过程中，繁琐的操作还是显得十分麻烦。如果我们拥有一个类似 [Vue.js - 单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html) 的模式，便可以更优雅地管理小程序项目中的文件，也可以更轻松地分享独立组件。

基于这样的想法，我们定义了 ``.mina`` 文件。

!> 虽然我们统称为 **单文件组件**，但一个 ``.mina`` 文件可以是小程序概念中的 **组件** 或 **页面**。

> 关于 *单文件组件* 和 *分离多个独立文件* 两种模式间的权衡，推荐阅读 [Vue.js - 怎么看待关注点分离](https://cn.vuejs.org/v2/guide/single-file-components.html#怎么看待关注点分离？) 。


## 文件结构
一个 ``.mina``文件由四个部件组成：

- **config** : 对应 ``${basename}.json``
- **template** : 对应 ``${basename}.wxml``
- **script** : 对应 ``${basename}.js``
- **style** : 对应 ``${basename}.wxss``

编写格式与 ``.vue`` 类似，例如以下示例：
```html
<config>
{
  "component": true
}
</config>

<template>
  <view>
    <view wx:if="{{ isLoading }}" class="loading">
      Loading...
    </view>
  </view>
</template>

<script>
import { Component } from '@tinajs/tina'

Component.define({
  properties: {
    isLoading: {
      type: Boolean,
      value: false,
    },
  },
})
</script>

<style>
.loading {
  font-size: 12px;
}
</style>
```

## 预处理器
与 Vue.js 不同，``.mina`` 文件没有内置预处理器。但借助 webpack 或 gulp 等构建工具，你可以更加灵活地处理文件中的各个部件。

> 对于一般项目的构建，推荐使用 [mina-webpack](https://github.com/tinajs/mina-webpack) ；而对于构建独立组件库，则推荐使用 [gulp-mina](https://github.com/tinajs/gulp-mina)。

关于在项目中使用构建工具的更多细节，请阅读下一章节。

## 语法高亮
在编辑器中，目前建议借助 **Vue** 的插件实现语法高亮功能。

例如在 VSCode 中：
1. 安装 [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
2. 打开 ``.mina`` 文件
3. 按下 ``Ctrl+K``, ``M``
4. 弹出菜单中选择 ``".mina"的配置文件关联``
5. 弹出菜单中选择 ``Vue``。

由于使用的是 **Vue** 的插件，你可以为文件中的部件设置 ``lang`` 属性，进一步高亮预处理器语法（虽然这一设置并不会在构建时产生实质作用）：

```html
...
<style lang="less">
.container {
  .content {
    font-size: 12px;
  }
}
</style>
```
