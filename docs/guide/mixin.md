# 混合
Tina 为小程序带来了 **混合** (mixin) 能力，开发者可以通过混合为全局或仅单个页面/组件扩展功能。

## 使用混合
在单个页面或组件中，通过传入 ``mixins`` 参数使用混合：

```javascript
/**
 * /demo-page.js or <script> in /demo-page.mina
 */
import { Page } from '@tinajs/tina'

const sayHiMixin = {
  onLoad () {
    console.log('hi')
  },
}

const askMixin = {
  methods: {
    ask () {
      console.log('How was your day?')
    },
  },
}

Page.define({
  mixins: [sayHiMixin, askMixin],
  onLoad () {
    this.ask()
  },
})

// -- console --
// [log] hi
// [log] How was your day?
```


## 全局混合
通过全局方法 ``Page.mixin`` 和 ``Component.mixin`` 可以分别将功能混入所有的 Page 和 Component：

```javascript
/**
 * /app.js or <script> in /app.mina
 */
import { Page, Component } from '@tinajs/tina'

function sayHi () {
  console.log('hi')
}

Page.mixin({
  onLoad: sayHi,
})
Component.mixin({
  created: sayHi,
})

const askMixin = {
  methods: {
    ask () {
      console.log('How was your day?')
    },
  },
}

Page.mixin(askMixin)
Component.mixin(askMixin)

App(......)
```


## 合并策略
在进行混合时，混合对象中的所有一级参数将被依次进行合并；并优先使用与参数名一致的合并方法，否则使用默认合并方法。

### 默认合并方法
默认合并方法满足以下策略：

1. 同名参数为数组类型时，将返回以先后顺序 ``concat`` 的结果：

  ```javascript
  // pseudocode example
  mix({
    array: ['a', 'b'],
  }, {
    array: ['c'],
  })
  /**
   * return
   * {
   *   array: ['a', 'b', 'c']
   * }
   */
  ```

  !> 请特别留意：**钩子函数** *(``onLoad``、``created``、``onReachBottom`` 等)* 默认均作为 **数组类型** 合并。

2. 同名参数为对象类型时，将返回以先后顺序浅合并的结果：

  ```javascript
  // pseudocode example
  mix({
    object: {
      a: 1,
      b: 2,
    },
  }, {
    object: {
      a: 0,
      c: 3,
    },
  })
  /**
   * return
   * {
   *   a: 0,
   *   b: 2,
   *   c: 3,
   * }
   */
  ```

3. 其他情况时，将返回唯一存在的值或后传入的值：

  ```javascript
  // pseudocode example
  mix({
    string: 'foo',
    exist: 'baz',
  }, {
    string: 'bar',
  })
  /**
   * return
   * {
   *   string: 'bar',
   *   exist: 'baz,
   * }
   */
  ```

此外，还需注意，**通过 ``.define()`` 传入的参数将被最后合并**。

?> *这意味着，当存在同名参数时，通过 ``.define()`` 传入的参数一定会被保留，而且其中钩子函数会被最后调用。*

### 特殊合并方法
- pageLifetimes
  - 在组件中合并 `pageLifetimes` 参数时，会将整个参数视为一级参数执行完整的合并策略；而不是直接以默认的对象类型进行合并。

### 参考实际的混合策略
- [混合策略源代码](https://github.com/tinajs/tina/blob/master/src/utils/mix-strategies.js)


## 混合对象的特殊类型
混合对象 (Mixin) 一般为普通的 ``Object``，但在某些特殊场景下，也可以是 ``Array`` (数组) 类型；当 Tina 在执行混合操作时遇到 ``Array`` 类型的混合对象，会将其展开后再依次混合。

除此以外，在一些复杂的场景下，你还可以使用 ``Function`` (函数) 类型的混合对象；Tina 会取 ``fn(options, Model)`` 的结果进行混合 —— 其中 ``options`` 为经上游混合后的参数，而 ``Model`` 为当前混合方法所属的类 (即 Page 或 Component)。

例如以下示例，我们将使用 **数组类型** 的混合对象，在 ``tinax`` 和 ``tina-router`` 的基础上快速地实现一个 ``mustLoggedIn`` 的混合：

```javascript
import { Page } from '@tinajs/tina'
import router from '@tinajs/tina-router'
import tinax from '../store'

const mustLoggedIn = [
  // 注入路由助手
  router(),
  // 从 tinax 注入 actions
  tinax.connect({
    actions ({ fetchSession }) {
      return {
        fetchSession,
      }
    },
  }),
  // 依赖的扩展准备好了。
  // 紧接着便可以在页面加载后核实用户是否已登录；若未登录则跳转至登录页。
  {
    onLoad () {
      this.fetchSession()
        .then(({ isLogged }) => {
          if (!isLogged) {
            this.$router.redirect('/page/login'))
          }
        })
    },
  },
]

Page.define({
  mixin: [mustLoggedIn],
})
```
