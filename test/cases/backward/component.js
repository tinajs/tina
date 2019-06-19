import '../../helpers/wx-globals'
import test from 'ava'
import sinon from 'sinon'

import MinaSandbox from '../../helpers/mina-sandbox'
import { objectify } from '../../helpers/functions'

import Tina from '../../..'

test.beforeEach((t) => {
  t.context.mina = new MinaSandbox({ Tina })
})
test.afterEach((t) => {
  t.context.mina.restore()
})

test.serial('`created`, `attached`, `ready`, `moved`, `detached` should be called', async (t) => {
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

  await component._emit('created')
  t.true(options.created.calledOnce)

  await component._emit('attached')
  t.true(options.attached.calledOnce)

  await component._emit('ready')
  t.true(options.ready.calledOnce)

  await component._emit('moved')
  t.true(options.moved.calledOnce)

  await component._emit('detached')
  t.true(options.detached.calledOnce)

  t.is(typeof component.onNonexistentHook, 'undefined')
  t.true(options.onNonexistentHook.notCalled)
})

test.serial('`data` could be defined by `Component.define({ data })', (t) => {
  Tina.Component.define({
    data: {
      foo: 'bar',
    },
  })
  t.deepEqual(t.context.mina.globals.Component.lastCall.args[0].data, { foo: 'bar' } )
})

test.serial('`behaviors` could be defined by `Component.define({ behaviors })', (t) => {
  const behaviors = ['foobar', function () {}]
  Tina.Component.define({
    behaviors,
  })
  t.deepEqual(t.context.mina.globals.Component.lastCall.args[0].behaviors, behaviors)
})

test.serial('`relations` could be defined by `Component.define({ relations })', (t) => {
  let relations = {
    './custom-li': {
      type: 'child',
    },
    linked: function () {},
    linkChanged: function () {},
    unlinked: function () {},
  }
  Tina.Component.define({
    relations,
  })
  t.deepEqual(t.context.mina.globals.Component.lastCall.args[0].relations, relations)
})

test.serial('`externalClasses` could be defined by `Component.define({ externalClasses })', (t) => {
  Tina.Component.define({
    externalClasses: ['foobar'],
  })
  t.deepEqual(t.context.mina.globals.Component.lastCall.args[0].externalClasses, ['foobar'])
})

test.serial('`options` could be defined by `Component.define({ options })', async (t) => {
  Tina.Component.define({
    options: {
      foo: 'bar',
    },
  })
  t.deepEqual(t.context.mina.globals.Component.lastCall.args[0].options, { foo: 'bar' })
})

test.serial('`observers` could be triggered', async (t) => {
  let options = {
    properties: {
      qux: {
        type: String,
        value: 'quux',
      },
    },
    data: {
      foo: 'bar',
    },
    observers: {
      qux: sinon.spy(),
      foo: sinon.spy(),
      'corge grault': sinon.spy(),
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  await component._emit('created')

  component._emitObserver('qux', 'quuz')
  t.true(options.observers.qux.called)
  t.deepEqual(options.observers.qux.args[0], ['quuz'])

  component._emitObserver('foo', 'baz')
  t.true(options.observers.foo.called)
  t.deepEqual(options.observers.foo.args[0], ['baz'])

  component._emitObserver('corge grault', 'garply', 'waldo')
  t.true(options.observers['corge grault'].called)
  t.deepEqual(options.observers['corge grault'].args[0], ['garply', 'waldo'])
})

test.serial('`observers` could access methods', async (t) => {
  const options = {
    properties: {
      qux: {
        type: String,
        value: 'quux',
      },
    },
    observers: {
      qux () {
        this.foo()
      },
    },
    methods: {
      foo: sinon.stub().callsFake(function () {
        this.bar()
      }),
      bar: sinon.spy(),
    }
  }

  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  await component._emit('created')

  component._emitObserver('qux', 'baz')
  t.true(options.methods.foo.calledOnce)
  t.true(options.methods.bar.calledOnce)
})

test.serial('`this.data` could be accessed', async (t) => {
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
  await component._emit('created')

  t.deepEqual(objectify(spy.lastCall.args[0]), { foo: 'bar' })
})

// TODO
test.serial.skip('`this.properties` could be accessed', async (t) => {
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
      spy(this.properties)
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  await component._emit('created')

  t.deepEqual(objectify(spy.lastCall.args[0]), { foo: 'bar', qux: 'quux' })
})

test.serial('`this.is`, `this.id`, `this.dataset` could be accessed', async (t) => {
  const IS = '/somewhere'
  const ID = 'foo'
  const DATASET = 'bar'
  const spy = sinon.spy()
  const options = {
    created () {
      spy(this.is, this.id, this.dataset)
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  component.is = IS
  component.id = ID
  component.dataset = DATASET
  await component._emit('created')

  t.true(spy.calledWithExactly(IS, ID, DATASET))
})

test.serial('`properties` should be merged with `data`', async (t) => {
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
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)
  await component._emit('created')

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

test.serial('`properties` should work with custom observer', async (t) => {
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
  await component._emit('created')

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

test.serial('`properties` should work with custom observer which is defined in `methods`', async (t) => {
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
  await component._emit('created')

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

test.serial('`methods` could be called in context of Tina.Component instance', async (t) => {
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

  await component._emit('created')
  await component._emit('attached')

  t.true(options.methods.foo.calledOnce)
  t.true(options.methods.bar.calledOnce)
})

test.serial('`this.setData(patch)` could update data', async (t) => {
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

  await component._emit('created')
  await component._emit('attached')
  t.deepEqual(component.data, { foo: 'baz' })
})

test.serial('`this.setData(patch, callback)` could update data and then execute callback', async (t) => {
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

  await component._emit('created')
  await component._emit('attached')
  t.deepEqual(component.data, { foo: 'baz' })
  t.true(spy.called)
})

test.serial('`this.hasBehavior` method should exist', async (t) => {
  const spy = sinon.spy()
  const options = {
    data: {
      foo: 'bar',
    },
    created () {
      spy(this.hasBehavior)
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)

  await component._emit('created')
  await component._emit('attached')
  t.true(spy.lastCall.calledWithExactly(sinon.match.func))
})

test.serial('`this.triggerEvent` method should exist', async (t) => {
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

  await component._emit('created')
  await component._emit('attached')
  t.true(spy.lastCall.calledWithExactly(sinon.match.func))
})

test.serial('`this.createSelectorQuery` method should exist', async (t) => {
  const spy = sinon.spy()
  const options = {
    data: {
      foo: 'bar',
    },
    created () {
      spy(this.createSelectorQuery)
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)

  await component._emit('created')
  await component._emit('attached')
  t.true(spy.lastCall.calledWithExactly(sinon.match.func))
})

test.serial('`this.selectComponent` method should exist', async (t) => {
  const spy = sinon.spy()
  const options = {
    data: {
      foo: 'bar',
    },
    created () {
      spy(this.selectComponent)
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)

  await component._emit('created')
  await component._emit('attached')
  t.true(spy.lastCall.calledWithExactly(sinon.match.func))
})

test.serial('`this.selectAllComponents` method should exist', async (t) => {
  const spy = sinon.spy()
  const options = {
    data: {
      foo: 'bar',
    },
    created () {
      spy(this.selectAllComponents)
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)

  await component._emit('created')
  await component._emit('attached')
  t.true(spy.lastCall.calledWithExactly(sinon.match.func))
})

test.serial('`this.getRelationNodes` method should exist', async (t) => {
  const spy = sinon.spy()
  const options = {
    data: {
      foo: 'bar',
    },
    created () {
      spy(this.getRelationNodes)
    },
  }
  Tina.Component.define(options)

  const component = t.context.mina.getComponent(-1)

  await component._emit('created')
  await component._emit('attached')
  t.true(spy.lastCall.calledWithExactly(sinon.match.func))
})
