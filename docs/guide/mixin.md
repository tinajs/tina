# 混合
Tina 为小程序带来了 **混合** (mixin) 能力，开发者可以通过混合为全局或仅单个页面/组件扩展功能。

## 使用混合
在单个页面或组件中，通过传入 ``mixins`` 参数使用混合：

```javascript
/**
 * /demo-page.js or <script> in /demo-page.mina
 */
import { Page } from '@tinajs/tina'

const sayhi = {
  onLoad () {
    console.log('hi')
  },
}

const wag = {
  methods: {
    wag () {
      console.log('wagged')
    },
  },
}

Page.define({
  mixins: [sayhi, wag],
  onLoad () {
    this.wag()
  },
})

// -- console --
// [log] hi
// [log] wagged
```


## 全局混合
通过全局方法 ``Page.mixin`` 和 ``Component.mixin`` 可以分别混合所有的 Page 和 Component：

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

const wag = {
  methods: {
    wag () {
      console.log('wagged')
    },
  },
}

Page.mixin(wag)
Component.mixin(wag)

App(......)
```


## 合并策略
在进行混合时，混合对象中的所有一级参数将被依次进行合并，并满足以下合并策略：

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

  !> 需要注意：**钩子函数** *(``onLoad``、``created``、``onReachBottom`` 等)* 默认均作为 **数组类型** 合并。

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

?> *这也意味着，当存在同名参数时，通过 ``.define()`` 传入的参数一定会被保留，而且其中钩子函数会被最后调用。*

## 混合对象的特殊类型
混合对象 (Mixin) 一般为普通的 ``Object``，但在某些特殊场景下，也可以是 ``Array`` (数组) 或 ``Function`` (函数)。

在进行混合操作时，如果遇到 ``Array`` 类型的混合对象，Tina 内部会将其展开后再依次混合；如果遇到 ``Function`` 类型的混合对象，则会把经上游混合后的参数``options`` 以及当前混合方法所属的类 ``Model`` (Page 或 Component) 传入该函数，并取返回值再进行混合。

例如以下示例，我们将使用 **数组类型** 的混合对象，在 ``tinax`` 和 ``tina-router`` 的基础上实现一个 ``mustLoggedIn`` 的混合：

```javascript
import { Page } from '@tinajs/tina'
import router from '@tinajs/tina-router'
import tinax from '../store'

const mustLoggedIn = [
  // 注入路由助手
  router(),
  // 从 tinax 注入 actions 方法
  tinax.connect({
    actions ({ fetchSession }) {
      return {
        fetchSession,
      }
    },
  }),
  // 在页面加载后确认用户已登录
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
  mixin: [mustLoggedIn()],
})
```
