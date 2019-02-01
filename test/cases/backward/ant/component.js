import '../../../helpers/wx-globals'
import test from 'ava'
import sinon from 'sinon'

import MinaSandbox from '../../../helpers/mina-sandbox/ant'
import { objectify } from '../../../helpers/functions'

import Tina from '../../../../lib/ant/tina'

function plain (object) {
  return JSON.parse(JSON.stringify(object))
}

test.beforeEach((t) => {
  t.context.mina = new MinaSandbox({ Tina })
})
test.afterEach((t) => {
  t.context.mina.restore()
})

test('`created`, `attached`, `ready`, `moved`, `detached` should be called', async (t) => {
  const options = {
    created: sinon.spy(),
    attached: sinon.spy(),
    ready: sinon.spy(),
    moved: sinon.spy(),
    detached: sinon.spy(),
    onNonexistentHook: sinon.spy(),
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)

  t.true(options.created.notCalled)
  t.true(options.attached.notCalled)
  t.true(options.ready.notCalled)
  t.true(options.moved.notCalled)
  t.true(options.detached.notCalled)
  t.true(options.onNonexistentHook.notCalled)

  await component._emit('didMount')
  t.true(options.created.calledOnce)
  t.true(options.attached.calledOnce)
  t.true(options.ready.calledOnce)

  await component._emit('didUnmount')
  t.true(options.detached.calledOnce)

  t.is(typeof component.onNonexistentHook, 'undefined')
  t.true(options.onNonexistentHook.notCalled)
})

test('`data` could be defined by `Component.define({ data })', (t) => {
  Tina.Component.define({
    data: {
      foo: 'bar',
    },
  })
  t.deepEqual(t.context.mina.globals.Component.lastCall.args[0].data, { foo: 'bar' } )
})

test('`this.data` could be accessed', async (t) => {
  const spy = sinon.spy()
  const options = {
    data: {
      foo: 'bar',
    },
    created () {
      spy(this.data)
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  await component._emit('didMount')

  t.deepEqual(objectify(spy.lastCall.args[0]), { foo: 'bar' })
})

test('`this.is`, `this.id` could be accessed', async (t) => {
  const IS = '/somewhere'
  const ID = 'foo'
  // TODO: DATASET

  const spy = sinon.spy()
  const options = {
    created () {
      spy(this.is, this.id)
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  component.is = IS
  component.$id = ID
  await component._emit('didMount')

  t.true(spy.calledWithExactly(IS, ID))
})

test('`properties` should be merged with `data`', async (t) => {
  const spy = sinon.spy()
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
    created () {
      spy(this.data)
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  await component._emit('didMount')

  t.deepEqual(plain(spy.lastCall.lastArg), {
    foo: 'bar',
    qux: 'quux',
  })

  t.deepEqual(component.data, {
    foo: 'bar',
    qux: 'quux',
  })

  component._property('qux', 'quuz')

  t.deepEqual(component.data, {
    foo: 'bar',
    qux: 'quuz',
  })
})

test('`properties` should work with custom observer', async (t) => {
  const spy = sinon.spy()
  const options = {
    properties: {
      qux: {
        type: String,
        value: 'quux',
        observer: spy,
      },
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  await component._emit('didMount')

  t.deepEqual(component.data, {
    qux: 'quux',
  })
  t.true(spy.notCalled)

  component._property('qux', 'quuz')

  t.deepEqual(component.data, {
    qux: 'quuz',
  })
  t.true(spy.calledWith('quuz', 'quux'))
})

test('`properties` should work with custom observer which is defined in `methods`', async (t) => {
  const spy = sinon.spy()
  const options = {
    properties: {
      qux: {
        type: String,
        value: 'quux',
        observer: 'quxObserver',
      },
    },
    methods: {
      quxObserver: spy,
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  await component._emit('didMount')

  t.deepEqual(component.data, {
    qux: 'quux',
  })
  t.true(spy.notCalled)

  component._property('qux', 'quuz')

  t.deepEqual(component.data, {
    qux: 'quuz',
  })
  t.true(spy.calledWith('quuz', 'quux'))
})

test('`methods` could be called in context of Tina.Component instance', async (t) => {
  const options = {
    attached () {
      this.foo()
    },
    methods: {
      foo: sinon.stub().callsFake(function () {
        this.bar()
      }),
      bar: sinon.spy(),
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)

  t.true(options.methods.foo.notCalled)
  t.true(options.methods.bar.notCalled)

  await component._emit('didMount')

  t.true(options.methods.foo.calledOnce)
  t.true(options.methods.bar.calledOnce)
})

test('`this.setData(patch)` could update data', async (t) => {
  const options = {
    data: {
      foo: 'bar',
    },
    attached () {
      this.setData({
        foo: 'baz',
      })
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  t.deepEqual(component.data, { foo: 'bar' })

  await component._emit('didMount')
  t.deepEqual(component.data, { foo: 'baz' })
})

test('`this.setData(patch, callback)` could update data and then execute callback', async (t) => {
  const spy = sinon.spy()
  const options = {
    data: {
      foo: 'bar',
    },
    attached () {
      this.setData({
        foo: 'baz',
      }, spy)
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  t.deepEqual(component.data, { foo: 'bar' })
  t.true(spy.notCalled)

  await component._emit('didMount')
  t.deepEqual(component.data, { foo: 'baz' })
  t.true(spy.called)
})

test('`this.triggerEvent` method should exist', async (t) => {
  const spy = sinon.spy()
  const options = {
    data: {
      foo: 'bar',
    },
    created () {
      spy(this.triggerEvent)
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)

  await component._emit('didMount')
  t.true(spy.lastCall.calledWithExactly(sinon.match.func))
})
