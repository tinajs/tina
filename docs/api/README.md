### Tina

#### 全局配置
##### Tina.globals
- 类型: ``Object``
- 默认值: ``{ App, Page, Component, wx }``
- 用法:

  ```javascript
  Tina.globals.Page = require('sinon').spy()
  ```

  Tina 所依赖的全局变量集合。在编写测试用例时，可通过重写该对象的值模拟小程序运行时的环境。

#### 全局 API
##### Tina.use(plugin)
- 参数:
  - ``{Object} plugin``
    - ``{Function} install``
- 用法:

  为全局 Tina 安装插件。

  ```javascript
  Tina.use({
    install (Tina, options) {
      let { Page, Component } = Tina
      console.log(Page, Component, options)
    },
  }, options)
  ```


### App

#### 全局配置
##### App.debug
- 类型: ``boolean``
- 默认值: ``false``
- 用法:

  ```javascript
  App.debug = true
  ```

  设置为 ``true`` 打开调试模式，输入到 ``App.log`` 的信息将被打印到控制台。


#### 全局 API
##### App.define(options)
- 参数:
  - ``{Object} options``
- 用法:

  定义程序。

  ```javascript
  App.define({})
  ```

##### App.mixin(mixin)
- 参数:
  - ``{Object | Function | Array} mixin``
- 用法:

  为全局 App 注册一个混合。

  ```javascript
  App.mixin({
    onLaunch () {
      console.log('hi')
    },
  })
  ```

##### App.mix(origin, mixin)
- 参数:
  - ``{Object} origin``
  - ``{Object | Function | Array} mixin``
- 返回值: 混合后的值
- 用法:

  按 App 的混合选项合并策略，计算并返回将 ``mixin`` 的值混入 ``origin`` 后的结果。

  ```javascript
  App.mix({
    onLaunch () {
      console.log('hello')
    },
  }, {
    onLaunch () {
      console.log('world')
    },
  })
  /**
   * return
   * {
   *   onLaunch: [
   *     function onLaunch () {
   *       console.log('hello')
   *     },
   *     function onLaunch () {
   *       console.log('world')
   *     },
   *   ],
   * }
  ```

##### App.log(action, data)
- 参数:
  - ``{String} action``
  - ``{any} data``
- 用法:

  输出日志。当 ``App.debug`` 为 ``true`` 时打印到控制台。

  ```javascript
  App.log('custom-action', { data: 'foobar' })
  // [Tina.App] - custom-action: >+data
  ```

##### getApp()
- 返回值: 由 Tina 代理的小程序 App 实例
- 用法:

  获取小程序 App 实例。与小程序全局的 `getApp` 方法不同，这个 API 将返回由 Tina 代理的实例。

  ```javascript
  import { App, getApp } from '@tinajs/tina'

  App.define({
    onLaunch () {
      console.log(getApp())
      /**
       * result:
       *
       *     app
       *
       */
    },
  })
  ```

#### App 选项 / 一般参数
##### mixins
- 类型: ``Array <Object | Function | Array>``
- 默认值: ``[]``
- 说明:

  页面混入的混合对象列表。

#### App 选项 / 生命周期和页面事件钩子
##### onLaunch(options)
- 参数:
  - ``{Object} options``
- 说明:

  小程序初始化完成（全局只触发一次）。

  与 [MINA 注册程序 - App(Object)](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html#appobject) 中的 ``onLaunch`` 一致。

##### onShow(options)
- 参数:
  - ``{Object} options``
- 说明:

  小程序显示。

  与 [MINA 注册程序 - App(Object)](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html#appobject) 中的 ``onShow`` 一致。

##### onHide()
- 说明:

  小程序隐藏。

  与 [MINA 注册程序 - App(Object)](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html#appobject) 中的 ``onHide`` 一致。

##### onError(message)
- 参数:
  - ``{String} message``
- 说明:

  小程序发生脚本错误，或者 api 调用失败.

  与 [MINA 注册程序 - App(Object)](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html#appobject) 中的 ``onError`` 一致。

##### onPageNotFound(options)
- 参数:
  - ``{Object} options``
- 说明:

  小程序要打开的页面不存在。

  与 [MINA 注册程序 - App(Object)](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html#appobject) 中的 ``onPageNotFound`` 一致。


#### 实例属性
##### app.$source
- 类型: ``Object``
- 说明:

  当前页面对应的 [原 MINA App 实例](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/app.html)。


### Page

#### 全局配置
##### Page.debug
- 类型: ``boolean``
- 默认值: ``false``
- 用法:

  ```javascript
  Page.debug = true
  ```

  设置为 ``true`` 打开调试模式，输入到 ``Page.log`` 的信息将被打印到控制台。


#### 全局 API
##### Page.define(options)
- 参数:
  - ``{Object} options``
- 用法:

  定义一个页面。

  ```javascript
  Page.define({
    data: {
      message: 'hi',
    },
  })
  ```

##### Page.mixin(mixin)
- 参数:
  - ``{Object | Function | Array} mixin``
- 用法:

  为全局 Page 注册一个混合。

  ```javascript
  Page.mixin({
    onLoad () {
      console.log('hi')
    },
  })
  ```

##### Page.mix(origin, mixin)
- 参数:
  - ``{Object} origin``
  - ``{Object | Function | Array} mixin``
- 返回值: 混合后的值
- 用法:

  按 Page 的混合选项合并策略，计算并返回将 ``mixin`` 的值混入 ``origin`` 后的结果。

  ```javascript
  Page.mix({
    onLoad () {
      console.log('hello')
    },
  }, {
    onLoad () {
      console.log('world')
    },
  })
  /**
   * return
   * {
   *   onLoad: [
   *     function onLoad () {
   *       console.log('hello')
   *     },
   *     function onLoad () {
   *       console.log('world')
   *     },
   *   ],
   * }
  ```

##### Page.log(action, data)
- 参数:
  - ``{String} action``
  - ``{any} data``
- 用法:

  输出日志。当 ``Page.debug`` 为 ``true`` 时打印到控制台。

  ```javascript
  Page.log('custom-action', { data: 'foobar' })
  // [Tina.Page] - custom-action: >+data
  ```

##### getCurrentPages()
- 返回值: 由 Tina 代理的当前页面栈
- 用法:

  获取当前页面栈。与小程序全局的 `getCurrentPages` 方法不同，这个 API 将返回由 Tina 代理的页面栈。

  ```javascript
  import { Page, getCurrentPages } from '@tinajs/tina'

  Page.define({
    onLoad () {
      console.log(getCurrentPages())
      /**
       * result:
       *
       *     [page]
       *
       */
    },
  })
  ```

#### Page 选项 / 一般参数
##### data
- 类型: ``Object``
- 默认值: ``{}``
- 说明:

  页面的初始数据。

  与 [MINA 注册页面 - 参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html) 中的 ``data`` 一致。

##### methods
- 类型: ``{ [key: String]: Function }``
- 默认值: ``{}``
- 说明:

  页面实例中可以访问并使用的方法，同时也可以作为视图层的 [事件处理函数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#事件处理函数) 使用。

##### compute(data)
- 类型: ``Function``
- 默认值: ``() => {}``
- 函数参数:
  - ``{Object} data``
- 函数返回值: 将被合并入实例 ``data`` 的数据。
- 说明:

  计算属性函数的返回值将被合并入实例 ``data``。

##### mixins
- 类型: ``Array <Object | Function | Array>``
- 默认值: ``[]``
- 说明:

  页面混入的混合对象列表。

##### adapters
- 类型: ``{ [key: String]: Object }``
- 默认值: ``{ data: SigmundDataAdapter }``
- 说明:

  适配器。可用于适配不同的数据模型，如 Immutable.js。

#### Page 选项 / 生命周期和页面事件钩子
##### beforeLoad(query)
- 参数:
  - ``{Object} query``
- 说明:

  页面加载的前置钩子。主要用于一般扩展初始化，并约定在该钩子函数中不应读取 ``this.data`` 或操作数据 (``this.setData()``)。

##### onLoad(query)
- 参数:
  - ``{Object} query``
- 说明:

  页面加载。

  与 [MINA 注册页面 - 生命周期函数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#生命周期函数) 中的 ``onLoad`` 一致。

##### onReady()
- 说明:

  页面初次渲染完成。

  与 [MINA 注册页面 - 生命周期函数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#生命周期函数) 中的 ``onReady`` 一致。

##### onShow()
- 说明:

  页面显示。

  与 [MINA 注册页面 - 生命周期函数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#生命周期函数) 中的 ``onShow`` 一致。

##### onHide()
- 说明:

  页面隐藏。

  与 [MINA 注册页面 - 生命周期函数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#生命周期函数) 中的 ``onHide`` 一致。

##### onUnload()
- 说明:

  页面卸载。

  与 [MINA 注册页面 - 生命周期函数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#生命周期函数) 中的 ``onUnload`` 一致。

##### onPullDownRefresh()
- 说明:

  下拉刷新。

  与 [MINA 注册页面 - 页面相关事件处理函数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#页面相关事件处理函数) 中的 ``onPullDownRefresh`` 一致。

##### onReachBottom()
- 说明:

  上拉触底。

  与 [MINA 注册页面 - 页面相关事件处理函数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#页面相关事件处理函数) 中的 ``onReachBottom`` 一致。

##### onPageScroll({ scrollTop })
- 参数
  - ``{Number} scrollTop`` 页面在垂直方向已滚动的距离（单位px）
- 说明:

  页面滚动。

  与 [MINA 注册页面 - 页面相关事件处理函数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#页面相关事件处理函数) 中的 ``onPageScroll`` 一致。

##### onShareAppMessage()
- 返回值:
  - ``{String} title`` 分享标题
  - ``{String} path`` 以 ``/`` 开头的完整分享路径。默认值为当前路径。
- 说明:

  用户转发时触发，返回值将用于设置分享内容。

  与 [MINA 注册页面 - 页面相关事件处理函数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#页面相关事件处理函数) 中的 ``onShareAppMessage`` 一致。

##### onTabItemTap()
- 返回值:
  - ``{Object} item`` Tab 项
- 说明:

  当前是 tab 页时，点击 tab 时触发。

  与 [MINA 注册页面 - 页面相关事件处理函数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#页面相关事件处理函数) 中的 ``onTabItemTap`` 一致。


#### 实例属性
##### page.data
- 类型: ``Object``
- 说明:

  页面实例和模板中可以访问的数据。**修改值时请使用 ``page.setData(data)``，切勿直接操作该对象。**

  与 [MINA 注册页面](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#页面相关事件处理函数) 中的 ``Page.prototype.data`` 一致。

##### page.route
- 类型: ``String``
- 说明:

  当前页面路径

  与 [MINA 注册页面](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#pageprototypesetdata) 中的 ``Page.prototype.route`` 一致。

##### page.$source
- 类型: ``Object``
- 说明:

  当前页面对应的 [原 MINA Page 实例](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html)。

#### 实例方法
##### page.setData(data)
- 参数
  - ``{Object} data`` 更新的数据
- 说明:

  更新数据。新数据将与旧数据浅合并后替换实例中的 ``data``，并异步生效于视图层。

  与 [MINA 注册页面](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#pageprototypesetdata) 中的 ``Page.prototype.setData`` 相似。


### Component
#### 全局配置
##### Component.debug
- 类型: ``boolean``
- 默认值: ``false``
- 用法:

  ```javascript
  Component.debug = true
  ```

  设置为 ``true`` 打开调试模式，输入到 ``Component.log`` 的信息将被打印到控制台。

#### 全局 API
##### Component.define(options)
- 参数:
  - ``{Object} options``
- 用法:

  定义一个组件。

  ```javascript
  Component.define({
    data: {
      message: 'hi',
    },
  })
  ```

##### Component.mixin(mixin)
- 参数:
  - ``{Object | Function | Array} mixin``
- 用法:

  为全局 Component 注册一个混合。

  ```javascript
  Component.mixin({
    created () {
      console.log('hi')
    },
  })
  ```

##### Component.mix(origin, mixin)
- 参数:
  - ``{Object} origin``
  - ``{Object | Function | Array} mixin``
- 返回值: 混合后的值
- 用法:

  按 Component 的混合选项合并策略，计算并返回将 ``mixin`` 的值混入 ``origin`` 后的结果。

  ```javascript
  Component.mix({
    created () {
      console.log('hello')
    },
  }, {
    created () {
      console.log('world')
    },
  })
  /**
   * return
   * {
   *   created: [
   *     function created () {
   *       console.log('hello')
   *     },
   *     function created () {
   *       console.log('world')
   *     },
   *   ],
   * }
  ```

##### Component.log(action, data)
- 参数:
  - ``{String} action``
  - ``{any} data``
- 用法:

  输出日志。当 ``Component.debug`` 为 ``true`` 时打印到控制台。

  ```javascript
  Component.log('custom-action', { data: 'foobar' })
  // [Tina.Component] - custom-action: >+data
  ```

#### Component 选项 / 一般参数
##### properties
- 类型: ``Object``
- 默认值: ``{}``
- 说明:

  组件的属性。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``properties`` 一致。

##### data

- 类型: ``Object``
- 默认值: ``{}``
- 说明:

  组件的初始数据。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``data`` 一致。

##### methods
- 类型: ``{ [key: String]: Function }``
- 默认值: ``{}``
- 说明:

  组件实例中可以访问并使用的方法，同时也可以作为视图层的事件处理函数。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``methods`` 一致。

##### observers
- 类型: ``{ [key: String]: Function }``
- 默认值: ``{}``
- 说明:

  [数据监听器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/observer.html)。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``observers`` 一致。

##### behaviors
- 类型: ``Array <Behavior>``
- 默认值: ``{}``
- 说明:

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``behaviors`` 一致。

##### relations
- 类型: ``Object``
- 默认值: ``{}``
- 说明:

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``relations`` 一致。

##### externalClasses
- 类型: ``String | Array``
- 默认值: ``''``
- 说明:

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``externalClasses`` 一致。

##### options
- 类型: ``Object``
- 默认值: ``{}``
- 说明:

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``options`` 一致。

##### compute(data)
- 类型: ``Function``
- 默认值: ``() => {}``
- 函数参数:
  - ``{Object} data``
- 函数返回值: 将被合并入实例 ``data`` 的数据。
- 说明:

  计算属性函数的返回值将被合并入实例 ``data``。

##### mixins
- 类型: ``Array <Object | Function | Array>``
- 默认值: ``[]``
- 说明:

  组件混入的混合对象列表。

#### Component 选项 / 生命周期钩子
##### created()
- 说明:

  组件实例进入页面节点树。该钩子函数内不应调用 ``component.setData``。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html)  中的 ``created`` 一致。

##### attached()
- 说明:

  组件实例进入页面节点树。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html)  中的 ``attached`` 一致。

##### ready()
- 说明:

  组件布局完成。该钩子函数内可以进行获取节点信息的操作。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html)  中的 ``ready`` 一致。

##### moved()
- 说明:

  组件实例被移动到节点树另一个位置。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html)  中的 ``moved`` 一致。

##### detached()
- 说明:

  组件实例被从页面节点树移除。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html)  中的 ``detached`` 一致。

#### Component 选项 / 所处页面生命周期钩子
##### pageLifetimes.show()
- 说明:

  组件实例所在的页面被展示。

  与 [MINA Component 组件所在页面的生命周期](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html#组件所在页面的生命周期)  中的 ``show`` 一致。

##### pageLifetimes.hide()
- 说明:

  组件实例所在的页面被隐藏。

  与 [MINA Component 组件所在页面的生命周期](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html#组件所在页面的生命周期)  中的 ``hide`` 一致。

##### pageLifetimes.resize(size)
- 参数:
  - ``{Object} size``
- 说明:

  组件实例所在的页面尺寸发生变化。

  与 [MINA Component 组件所在页面的生命周期](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html#组件所在页面的生命周期)  中的 ``resize`` 一致。


#### 实例属性
##### component.data
- 类型: ``Object``
- 说明:

  页面实例和模板中可以访问的数据。**修改值时请使用 ``page.setData(data)``，切勿直接操作该对象。**

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``Component.prototype.data`` 一致。

##### component.is
- 类型: ``String``
- 说明:

  组件的文件路径。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``Component.prototype.is`` 一致。


##### component.id
- 类型: ``String``
- 说明:

  节点id。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``Component.prototype.id`` 一致。

##### component.dataset
- 类型: ``Object``
- 说明:

  节点 dataset。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``Component.prototype.dataset`` 一致。

##### component.$source
- 类型: ``Object``
- 说明:

  当前组件对应的 [原 MINA Component 实例](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)。


#### 实例方法
##### component.setData(data)
- 参数
  - ``{Object} data`` 更新的数据
- 说明:

  更新数据。新数据将与旧数据浅合并后替换实例中的 ``data``，并异步生效于视图层。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``Component.prototype.setData`` 相似。

##### component.triggerEvent(name, detail, options)
- 参数
  - ``{String} name`` 事件名
  - ``{Object} detail`` 事件附加的详细信息
  - ``{Object} options`` 选项
- 说明:

  触发事件。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``Component.prototype.triggerEvent`` 一致。

##### component.hasBehavior(behavior)
- 参数
  - ``{Behavior} behavior`` 行为
- 说明:

  检查组件是否具有行为。

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``Component.prototype.hasBehavior`` 一致。

##### component.createSelectorQuery()
- 说明:

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``Component.prototype.createSelectorQuery`` 一致。

##### component.selectComponent(selector)
- 说明:

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``Component.prototype.setData`` 一致。

##### component.selectAllComponents(selector)
- 说明:

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``Component.prototype.setData`` 一致。

##### component.getRelationNodes(key)
- 说明:

  与 [MINA Component 构造器参数](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/component.html) 中的 ``Component.prototype.setData`` 一致。

##### component.createIntersectionObserver(options)
- 说明:

  与 [WXML节点布局相交状态](https://mp.weixin.qq.com/debug/wxadoc/dev/api/intersection-observer.html) 中的 ``Component.prototype.createIntersectionObserver`` 一致。


### BasicDataAdapter
#### 全局 API
##### isData(object)
- 参数
  - ``{Object} object`` 对象
- 返回值: object 是否为期望的数据模型。

##### fromPlainObject(plain)
- 参数
  - ``{Object} plain`` 可转换为 JSON 的对象
- 返回值: 经期望数据模型封装的实例。

##### merge(original, extra)
- 参数
  - ``{Object} original`` 原期望数据模型实例
  - ``{Object} extra`` 扩展的期望数据模型实例
- 返回值: extra 浅合并入 original 的新实例。

##### diff(original, extra)
- 参数
  - ``{Object} original`` 原期望数据模型实例
  - ``{Object} extra`` 扩展的期望数据模型实例
- 返回值: 回 original 中相比 extra 不同部分的新实例。

##### toPlainObject(data)
- 参数
  - ``{Object} original`` 期望数据模型实例
- 返回值: 可以转换为 JSON 的对象


### PlainDataAdapter
#### 全局 API
##### isData(object)
- 说明:

  覆盖并实现 BasicDataAdapter.isData

##### fromPlainObject(plain)
- 说明:

  覆盖并实现 BasicDataAdapter.fromPlainObject

##### merge(original, extra)
- 说明:

  覆盖并实现 BasicDataAdapter.merge

##### diff(original, extra)
- 说明:

  覆盖并实现 BasicDataAdapter.diff

##### toPlainObject(data)
- 说明:

  覆盖并实现 BasicDataAdapter.toPlainObject


### SigmundDataAdapter
#### 全局 API
##### isData(object)
- 说明:

  覆盖并实现 BasicDataAdapter.isData

##### fromPlainObject(plain)
- 说明:

  覆盖并实现 BasicDataAdapter.fromPlainObject

##### merge(original, extra)
- 说明:

  覆盖并实现 BasicDataAdapter.merge

##### diff(original, extra)
- 说明:

  覆盖并实现 BasicDataAdapter.diff

##### toPlainObject(data)
- 说明:

  覆盖并实现 BasicDataAdapter.toPlainObject

