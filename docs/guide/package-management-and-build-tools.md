# 包管理和构建工具
在传统小程序项目中，如果想使用第三方库，开发者必须先手动地将文件拷贝进项目。相比现代的 web 前端开发，这种刀耕火种的方式一方面增加了复杂项目的工作量，另一方面也使得第三方独立组件难以传播和应用。

于是，结合上一章节的单文件组件，我们也准备了一套使用 webpack 开发小程序的工具链 —— [mina-webpack](https://github.com/tinajs/mina-webpack)。

> mina-webpack 在 [wxapp-boilerplate](https://github.com/cantonjs/wxapp-boilerplate) 和 [wxapp-webpack-plugin](https://github.com/Cap32/wxapp-webpack-plugin) 当中得到了大量启发。如果你不喜欢单文件组件的想法，也不妨试试以上两个了不起的项目。

引入 webpack 之后，我们的小程序项目获得了这些能力：
- 不受环境限制的 es2015+
- 使用 npm 包
- mina 单文件组件
- 文件预处理器
- 代码混淆 / 压缩
- 等等等等...

## 使用项目模板
如果你已经等不及了，使用 [template-mina](https://github.com/tinajs/template-mina) 项目模板可以帮助你快速地搭建好基于 mina-webpack 的小程序项目：

```bash
npm i -g sao

sao mina my-app
cd my-app
```

然后便可以 [安装 Tina](guide/installation?id=webpack) 并开始开发：

```bash
npm i --save @tinajs/tina
npm start
```

> 编译生产环境版本时，请使用 ``npm run build``。

## 了解更多
mina-webpack 由 mina-loader 以及两个 webpack 插件组成，如果你感兴趣，欢迎访问 [项目仓库](https://github.com/imyelo/mina-webpack/tree/master/packages) 了解更多信息。
