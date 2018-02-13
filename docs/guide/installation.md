# 安装和引用
我们推荐在小程序项目中 [借助 Webpack](guide/installation?id=Webpack) 使用 Tina，但如果你只是希望在现有的项目中小试牛刀，也可以通过拷贝文件的形式 [直接引入](guide/installation?id=直接引入) 。

## 直接引入
从传统项目中引入 Tina 非常简单。你只需要将最新的 [tina.min.js](https://unpkg.com/@tinajs/tina/dist/tina.min.js) 拷贝至项目中，并借助小程序环境集成的 ``require`` 方法加载使用。

例如我们将 *tina.min.js* 存放在项目的 *libraries* 目录中：

```
.
├── api.js
├── app.json
├── libraries
│   └── tina.min.js ※
├── pages
│   ├── hi.js ※
│   ├── hi.wxml
│   └── hi.wxss
└── project.config.json
```

然后在页面 *pages/hi.js* 中便可以加载使用：
```javascript
var { Page } = require('../libraries/tina.min.js')

// 开始定义页面
Page.define(......)
```

如果你感兴趣，欢迎查看 [完整的示例 - sayhi](https://github.com/tinajs/tina-examples/tree/master/packages/sayhi) 。

## Webpack
借助 [mina-webpack](https://github.com/tinajs/mina-webpack) , 你可以通过 **npm** 安装和使用 tina。

> 使用 mina-webpack ，你的项目将获得 es2015+、npm、mina 单文件组件、文件预处理器、代码混淆和压缩等能力。

> 如果你不知道该如何开始，不妨先阅读 [包管理及构建工具](/guide/package-management-and-build-tools.md) 章节，尝试使用我们为你准备的 [项目模板](/guide/package-management-and-build-tools.md?id=使用项目模板)。

例如在一个集成 mina-webpack 的项目中：

```
.
├── node_modules ※
│   ├── ...
├── package-lock.json
├── package.json
├── postcss.config.js
├── src
│   ├── api.js
│   ├── app.mina
│   ├── pages
│   │   └── hi.mina ※
│   └── project.config.json
└── webpack.config.babel.js
```

使用 npm 安装 tina

```bash
npm i --save @tinajs/tina
```

然后便可以在页面 *src/pages/hi.mina* 中加载使用：

```html
......
<script>
import { Page } from '@tinajs/tina'

// 开始定义页面
Page.define(......)
</script>
.....
```

> ``*.mina`` 是受 [Vue](https://vuejs.org/v2/guide/single-file-components.html) 启发，由 ``config``, ``template``, ``script``, ``style`` 四个部块组成的小程序 [单文件组件](guide/single-file-component) (含页面)，对应的是传统小程序项目中的 ``*.json``, ``*.wxml``, ``*.js``, ``*.wxss`` 文件。

如果你感兴趣，欢迎查看 [完整的示例 - sayhi-mina](https://github.com/tinajs/tina-examples/tree/master/packages/sayhi-mina) 。
