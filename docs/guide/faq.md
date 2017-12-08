# 常见问题

### 为什么是 ``tina.Page.define()`` 而不是 ``tina.Page()`` 或 ``new tina.Page()`` ？
在调用微信小程序中集成的 ``Page()`` 方法时，其实际的作用是 **定义/声明/注册一个页面** ，而非创建一个页面实例。但由于首字母大写的命名，容易被误解为等同于 ``new Page()``。所以在 tina 中，该行为的方法名被明确为 ``Page.define()``。

而组件 ``tina.Component.define()`` 的设计同理。

当然，在这个问题上更高明的设计，其实是 [Vue SFC](https://vuejs.org/v2/guide/single-file-components.html) 中的 ``module.exports =`` 。

