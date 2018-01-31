# 数据

## 数据模型适配器
在 MINA 中，[动态数据只允许使用可以被转换成 JSON 的格式：字符串、数字、布尔值、对象、数组](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#初始化数据)。
尽管 Tina.js 本身并不具备扩展 wxml 语言的能力，但借助数据模型适配器 (DataAdapter)，你可以在逻辑层 (JavaScript) 中使用不同的数据类型，比如 React 中常用的 [Immutable.js](https://github.com/facebook/immutable-js)。

> 使用不同的数据模型，是 Tina.js 中一项 **可选** 的功能。你不必马上熟悉这一特性 —— 因为即使使用默认的数据模型，Tina.js 也可以很好地为你工作。

### 使用数据模型适配器
通过 ``adapters.data`` 参数设置页面或组件的数据模型适配器:

```javascript
import { Page } from '@tinajs/tina'

// ... import MyDataAdapter
// ...

Page.define({
  adapters: {
    data: MyDataAdapter,
  },
})
```

或借助混合设置全局数据模型适配器:
```javascript
import { Page, Component } from '@tinajs/tina'

// ... import MyDataAdapter
// ...

const mixin = {
  adapters: {
    data: MyDataAdapter,
  },
}

Page.mixin(mixin)
Component.mixin(mixin)
```

更多关于混合的介绍，请阅读下一章节 —— [混合](/guide/mixin)。

### 编写数据模型适配器
数据模型适配器应继承于 Tina.js 内置的 ``BasicDataAdapter``，并重写以下静态方法：

- isData(object)

  接收一个 object, 返回 object 是否为期望的数据模型。

- fromPlainObject(plain)

  接受一个可转换为 JSON 的对象，返回一个经期望数据模型封装的实例。

- merge(original, extra)

  接受两个期望数据模型实例，返回后者浅合并入前者的新实例。

- diff(original, extra)

  接受两个期望数据模型实例，返回前者中相比后者不同部分的新实例。

- toPlainObject(data)

  接受一个期望数据模型实例，返回一个可以转换为 JSON 的对象

你可以查看 [Tina.js 集成的数据模型适配器源码](https://github.com/tinajs/tina/tree/master/src/adapters/data)，参考更多关于编写数据模型适配器的细节。


## 不可变数据
在小程序开发中，[应尽量避免直接修改 ``this.data``](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#pageprototypesetdata)。

大多数情况下，你可以使用 ``Object.assign`` 或者 [ES2015 - Spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)：

**Object.assign:**
```html
<template>
  <view>
    <text>Hi {{ user.name }}!</text>
  </view>
</template>

<script>
import { Page } from '@tinajs/tina'

Page.define({
  data: {
    user: {
      name: 'yoga',
    },
  },
  methods: {
    rename (name) {
      this.setData({
        user: Object.assign({}, this.data.user, {
          name,
        })
      })
    },
  },
  // ...
})
</script>
```

**ES2015 - Spread operator:**
```javascript
// ...
    rename (name) {
      this.setData({
        user: { ...this.data.user, { name } }
      })
    },
// ...
```

但在面对复杂的数据结构时，也许便是时候考虑如何更简洁地更新数据了：

```html
<template>
  <view>
    <view wx:for="{{ user.devices }}" wx:for-item="device">
      <view wx:for="{{ device.buttons }}" wx:for-item="button">
        <view>{{ button.label }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { Page } from '@tinajs/tina'

Page.define({
  data: {
    user: {
      devices: [
        {
          buttons: [
            {
              label: 'keep calm',
            },
            {
              label: 'git commit',
            },
            {
              label: 'run',
            },
          ],
        },
      ],
    },
  },
  methods: {
    fix () {
      this.setData({
        user: {
          ...this.data.user, {
            devices: [
              {
                ...this.data.user.devices[0],
                {
                  buttons: [
                    ...this.data.user.devices[0].buttons.slice(0, 2),
                    {
                      ...this.data.user.devices[0].buttons[2],
                      {
                        label: 'git push',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      })
    },
  },
  // ...
})
</script>
```

<del>这样的操作令人窒息。</del>

你可以引入一些工具简化这一操作，比如使用 [immutability-helper](https://github.com/kolodny/immutability-helper):
```javascript
// ...
import update from 'immutability-helper'
// ...
    fix () {
      this.setData({
        user: update(this.data.user, {
          devices: {
            0: {
              buttons: {
                2: {
                  label: { $set: 'git push' },
                },
              },
            },
          },
        }),
      })
    },
// ...
```

或者借助 [tina-immutable](https://github.com/tinajs/tina-immutable) 插件提供的 ImmutableDataAdapter，在基于 Tina.js 驱动的项目中使用 [Immutable.js](https://github.com/facebook/immutable-js):
```javascript
/**
 * app.js or <script> in app.mina
 */
import Tina from '@tinajs/tina'
import ImmutablePlugin from '@tinajs/tina-immutable'

Tina.use(ImmutablePlugin)
// ...
```

```javascript
// ...
    fix () {
      this.setData({
        user: this.data.get('user').setIn(['devices', 0, 'buttons', 2, 'label'], 'git push'),
      })
    },
// ...
```

代码是不是变得清爽了？

> 你可以通过查看 [tina-immutable](https://github.com/tinajs/tina-immutable) 及其 [示例](https://github.com/tinajs/tina-immutable/tree/master/example)，更深入地了解如何在 Tina.js 中使用 Immutable.js。

## 性能优化
就目前的小程序基础库版本 (1.9.0) 而言，其实直接修改 ``this.data`` 并不是完全严格被禁止的操作 —— 虽然某些情况下会造成视图 (View Thread) 的数据与逻辑层 (AppService Thread) 的不一致，但只要你将改变后的数据放入 ``setData`` 中执行，数据还是会重新向视图同步。

!> 但即便如此，我们还是建议你不要直接修改 ``this.data`` —— 因为这是一个行为不明确的反模式的操作。

为了兼容上述在 MINA 中直接修改 ``this.data`` 的特殊用例，在 Tina.js 中，``setData`` 的默认去重算法便无法简单地只做浅比较 —— 这也就给更新数据带来了不必要的性能损耗。

> Tina.js 默认使用 SigmundData 数据模型封装 data —— 一个基于 [isaacs/sigmund](https://github.com/isaacs/sigmund)，通过对数据签名实现脏检查的数据模型；其检查效率高于深对比，但代价是牺牲了少数场景下的准确度。

如果你严格地保持以不可变数据看待 ``this.data``，不直接对其进行修改，那么你还可以选择将数据模型适配器设置为 Tina.js 集成的 PlainDataAdapter —— 让去重算法仅做简单的浅比较，从而提高性能 ：

```javascript
// ...
import { Page, PlainDataAdapter } from '@tinajs/tina'

Page.define({
  // ...
  adatpers: {
    data: PlainDataAdapter,
  },
})
// ...
```

## 为什么不是 setData({ [path]: value })
在 MINA 中，``setData`` 方法中的 [key 支持使用数据路径](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html#setdata-参数格式)，如 ``array[2].message``。虽然这样的设计同样可以简化更新复杂数据结构的操作，但 Tina.js 中默认并不支持这一方法。原因主要是：

1. ``setData({ [path]: value })`` 的 API 设计稍显粗暴，不容易被代理（重新实现），同时也隐含了 ``data`` 中 key 不能含 ``.`` 和 ``[]`` 的副作用。如果是类似 ``setData(path, value)`` 的重载设计，则更为优雅和更容易被接受。
2. 在复杂项目中，经常需要引入如 Redux 的全局状态管理器；在这种情况下，更新数据的操作大多发生在全局状态管理器，而非页面和组件中，这时仅依靠 ``setData`` 便稍显无力。相反，直接使用 **immutability-helper**、**Immutable.js** 或者类似的工具，则可以满足所有场景。
