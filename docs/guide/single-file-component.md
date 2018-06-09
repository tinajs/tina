# 单文件组件
在传统小程序项目中，一个页面或组件 [由多个文件名相同而后缀类型不同的文件组成](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html#pages) 。虽然这样的设定足以应对一般项目的需要，但在开发和维护的过程中，繁琐的操作还是显得十分麻烦。如果我们拥有一个类似 [Vue.js - 单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html) 的模式，便可以更优雅地管理小程序项目中的文件，也可以更轻松地分享独立组件。

基于这样的想法，我们定义了 Mina 文件 (``.mina``)。

!> 虽然我们统称为 **单文件组件**，但一个 Mina 文件除了可以是小程序概念中的 **组件** 以外，也可以是 **页面**。

> 关于 *单文件组件* 和 *分离多个独立文件* 两种模式间的权衡，推荐阅读 [Vue.js - 怎么看待关注点分离](https://cn.vuejs.org/v2/guide/single-file-components.html#怎么看待关注点分离？) 。


## 文件结构
一个 Mina 文件由四个部块组成：

- **config** : 对应 ``${basename}.json``
- **template** : 对应 ``${basename}.wxml``
- **script** : 对应 ``${basename}.js``
- **style** : 对应 ``${basename}.wxss``

编写格式与 ``.vue`` 类似，例如以下示例：
```html
<config>
{
  "component": true,
  "usingComponents": {
    "logo": "./logo.mina"
  }
}
</config>

<template>
  <view>
    <view wx:if="{{ isLoading }}" class="loading">
      Loading...
    </view>
    <logo />
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

## 页面和组件引用
小程序中规定，[全局配置的 ``pages`` 项](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html#pages) 决定了项目应引用哪些页面；在页面或组件中，[设置配置项 ``usingComponents``](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/#使用自定义组件) 则声明了应引用哪些组件。

通过观察示例，我们不难发现 Mina 文件的 ``config`` 部块延续了以上设定；但与传统小程序规则不同的是，我们还约定文件路径 **不应省略文件后缀**。

也就是说，除了 ``.mina``，你也可以根据你的喜好，在你的项目中自由地使用其他后缀名编写 Mina 文件，比如 ``.wx``、``.page``、``.component`` 等。

> 得益于这一设定的改变，使用 Mina 单文件组件格式，你可以更加轻松地引用 NPM 上的独立组件。

### 从 NPM 引用独立组件
由于 ``config`` 部块里的无前缀路径 (如 ``"components/spinner"``) 在原小程序框架中代表相对路径，所以我们在不破坏其原设定的基础上，额外约定使用 ``~`` 前缀表示引用 *node_modules* 中的独立组件（或页面）。

比如引入 [@tinajs/tina-logo.mina](https://www.npmjs.com/package/@tinajs/tina-logo.mina)：

```html
<config>
{
  "usingComponents": {
    "tina-logo": "~@tinajs/tina-logo.mina"
  }
}
</config>
```

[查看从 NPM 引用独立组件的示例](https://github.com/tinajs/tina-examples/tree/master/packages/counter)

### 引用组件的所有路径规则
| 路径前缀 |              含义              |      示例 (假定当前文件为 ``/cabin/page.mina``)      |
| -------- | ------------------------------ | ---------------------------------------------------- |
| *无*     | 从当前目录开始的相对路径       | ``octocat.mina`` -> ``/cabin/octocat.mina``          |
| ``./``   | 从当前目录开始的相对路径       | ``./octocat.mina`` -> ``/cabin/octocat.mina``        |
| ``../``  | 从上级目录开始的相对路径       | ``../octocat.mina`` -> ``/octocat.mina``             |
| ``/``    | 从应用根目录开始的绝对路径     | ``/octocat.mina`` -> ``/octocat.mina``               |
| ``~``    | 从 node_modules 开始的绝对路径 | ``~octocat-mina`` -> ``(node_modules/)octocat-mina`` |

## 预处理器
与 Vue.js 不同，Mina 文件没有内置预处理器。但借助 webpack 或 gulp 等构建工具，你可以更加灵活地处理文件中的各个部块。

> 对于一般项目的构建，推荐使用 [mina-webpack](https://github.com/tinajs/mina-webpack) ；而对于构建独立组件库，则推荐使用 [gulp-mina](https://github.com/tinajs/gulp-mina)。

我们将在下一章节为你介绍更多关于在项目中使用构建工具的细节。

## 语法高亮
在编辑器中，目前建议借助 **Vue** 的插件实现语法高亮功能。

例如在 VSCode 中：
1. 安装 [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
2. 打开 Mina 文件 (``.mina``)
3. 按下 ``Ctrl+K``, ``M``
4. 弹出菜单中选择 ``".mina"的配置文件关联``
5. 弹出菜单中选择 ``Vue``。

由于使用的是 **Vue** 的插件，你可以为文件中的部块设置 ``lang`` 属性，进一步高亮预处理器语法（虽然这一属性并不会在构建时产生实质作用）：

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

你还可以通过配置 Vetur 的 [``vetur.grammar.customBlocks``](https://vuejs.github.io/vetur/highlighting.html#custom-block) 为 ``<config>`` 部块也设置语法高亮：

1. 在 VSCode 中按下 ``Ctrl+,`` 打开用户设置 (User Settings)
2. 在用户设置中追加如下配置并保存

  ```json
  "vetur.grammar.customBlocks": {
      "config": "json"
  }
  ```

3. 通过 ``Ctrl+Shift+P`` 唤起命令面板，执行 ``Vetur: Generate grammar from vetur.grammar.customBlocks``
4. 通过 ``Ctrl+Shift+P`` 唤起命令面板，执行 ``Reload Window``，或直接重启 VSCode

