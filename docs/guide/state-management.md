# 状态管理

在构建复杂应用时，随着页面和组件的增加，维护跨组件 (或页面) 状态的复杂度也会快速地增长。在 web 前端领域，解决该难题的常见思路是使用由 Facebook 提出的 [Flux 架构](https://facebook.github.io/flux/)；具体到 [React](https://reactjs.org/) 和 [Vue](https://vuejs.org) 中，则分别主流使用 [Redux](https://redux.js.org/) 和 [Vuex](https://vuex.vuejs.org/) 作为其 Flux 实现。

## Redux
> You can use Redux together with React, or with any other view library.
>
> —— https://redux.js.org/

没错！Redux 当然可以与 Tina.js 一起使用。

我们建议你首先阅读 [Redux 官方文档](https://cn.redux.js.org/)，了解 Redux 中的概念以及基础的使用方法。如果你在以往的 Web 项目中已经使用过 Redux 就更好了！

在 Tina.js 中，编写和组织 Action、Reducer、Store 的方式与一般 Web 项目并无差异；剩余需要做的，只是使用 [tina-redux](https://github.com/tinajs/tina-redux) 代理 store，并通过 [Mixin](/guide/mixin) 的方式将 Redux 绑定到 Page 或 Component 上：

```javascript
/**
 * /store.js
 */
import { createStore } from 'redux'
import todoApp from './reducers'
import TinaRedux from '@tinajs/tina-redux'

let reduxStore = createStore(todoApp)

let store = new TinaRedux(reduxStore)

export default store
```

```javascript
/**
 * /pages/home.js or <script> in /page/home.mina
 */
import { Page } from '@tinajs/tina'
import { addTodo, setVisibilityFilter } from '../actions'
import store from '../store'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    case 'SHOW_ALL':
    default:
      return todos
  }
}

function mapState (state) {
  return {
    todos: state.todos,
    filter: state.visibilityFilter,
    filtered: getVisibleTodos(state.todos, state.visibilityFilter),
  }
}
function mapDispatch (dispatch) {
  return {
    tapFilter (event) {
      dispatch(setVisibilityFilter(event.currentTarget.dataset.filter))
    },
    addTodo (event) {
      dispatch(addTodo(event.detail.value))
      this.setData({
        input: '',
      })
    },
  }
}

Page.define({
  mixins: [store.connect(mapState, mapDispatch)],
  data: {},
  methods: {
    clear () {
      this.$dispatch({ type: 'CLEAR_COMPLETED_TODOS' })
    }
  },
})
```

[查看完整的示例](https://github.com/tinajs/tina-redux/tree/master/example)。

### 参考更多关于 Tina-Redux 的资料
- [tina-redux 仓库](https://github.com/tinajs/tina-redux)
- [对比 Redux 在 React 中的示例](http://cn.redux.js.org/docs/basics/ExampleTodoList.html)
- [查看在 Tina.js 中同时使用 Redux 和 Immutable.js 的示例](https://github.com/tinajs/tina-examples/tree/master/packages/todomvc-lite-redux-immutable)。

## Tinax
如果你不喜欢 Redux，并且更喜爱 Vuex 的设计，我们则推荐使用 [Tinax](https://github.com/tinajs/tinax) 作为你的状态管理器。

尽管 Tinax 的 API 与 Vuex 并不完全一致，但毫无疑问 Tinax 受到了 Vuex 的启发，并学习了 Vuex 的核心概念 —— ``state``, ``getter``, ``mutation``, ``action``, ``module``；如果你还没有使用过 Vuex，在此建议你先了解 [Vuex 的核心概念](https://vuex.vuejs.org/zh-cn/core-concepts.html)。

示例：

```javascript
/**
 * /store/session.js
 */

import types from '../types'
import api from '../../api'

const initialState = {
  expiredAt: null,
}

const getters = {
  isExpired: (state) => state.expiredAt < Date.now(),
}

const actions = {
  fetchSession ({ commit, state }, { key }) {
    api.fetchSession(key).then((session) => commit(types.SET_SESSION, { session }))
  },
}

const mutations = {
  [types.SET_SESSION] (state, { session }) {
    return session
  },
}

export default {
  state: initialState,
  getters,
  actions,
  mutations,
}
```

```javascript
/**
 * /demo-page.js or <script> in /demo-page.mina
 */

import { Page } from '@tinajs/tina'
import { store } from './store'

Page.define({
  mixins: [
    store.connect({
      getters (getters) {
        return {
          isExpired: getters.isExpired(),
        }
      },
      actions ({ fetchSession }) {
        return {
          fetchSession,
        }
      },
    }),
  ],
  onLoad () {
    console.log(this.data.isExpired)
    this.fetchSession()
  },
})
```

> [查看完整的示例项目 —— tina-hackernews](https://github.com/imyelo/tina-hackernews)

如果你对 Tinax 感兴趣，欢迎访问 [@tinajs/tinax](https://github.com/tinajs/tinax) 了解更多信息。

## 更多状态管理扩展
你有更好的状态管理扩展，也欢迎提交 [Pull Request](https://github.com/tinajs/tina/pulls) 告诉我们。
