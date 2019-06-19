import '../helpers/wx-globals'
import test from 'ava'

import MinaSandbox from '../helpers/mina-sandbox'

import Tina from '../..'

test.beforeEach((t) => {
  t.context.mina = new MinaSandbox({ Tina })
})
test.afterEach((t) => {
  t.context.mina.restore()
})

test.serial('`compute` should be called and merged with `data` by Page', async (t) => {
  const options = {
    data: {
      foo: 'bar',
    },
    compute (state) {
      return {
        foobar: state.foo + 'baz',
      }
    },
  }
  Tina.Page.define(options)

  const page = t.context.mina.getPage(-1)
  await page._emit('onLoad')

  t.deepEqual(page.data, {
    foo: 'bar',
    foobar: 'barbaz',
  })
})

test.serial('`compute` should be called and merged with `data` by Component', async (t) => {
  const options = {
    properties: {
      qux: {
        type: String,
        value: 'quux',
      },
    },
    data: {
      foo: 'bar',
    },
    compute (state) {
      return {
        foobar: state.foo + 'baz' + state.qux,
      }
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  await component._emit('created')
  await component._emit('attached')

  t.deepEqual(component.data, {
    foo: 'bar',
    foobar: 'barbazquux',
    qux: 'quux',
  })
})
