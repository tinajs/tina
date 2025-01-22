import '../../helpers/wx-globals'
import test from 'ava'
import sinon from 'sinon'

import MinaSandbox from '../../helpers/mina-sandbox'

import Tina from '../../..'

test.beforeEach((t) => {
  t.context.mina = new MinaSandbox({ Tina })
})
test.afterEach((t) => {
  t.context.mina.restore()
})

test.serial('`onLoad`, `onReady`, `onShow`, `onHide`, `onUnload` should be called', async (t) => {
  const options = {
    onLoad: sinon.spy(),
    onReady: sinon.spy(),
    onShow: sinon.spy(),
    onHide: sinon.spy(),
    onUnload: sinon.spy(),
    onNonexistentHook: sinon.spy(),
  }
  Tina.Page.define(options)

  const page = t.context.mina.getPage(-1)

  t.true(options.onLoad.notCalled)
  t.true(options.onReady.notCalled)
  t.true(options.onShow.notCalled)
  t.true(options.onHide.notCalled)
  t.true(options.onUnload.notCalled)
  t.true(options.onNonexistentHook.notCalled)

  await page._emit('onLoad')
  t.true(options.onLoad.calledOnce)

  await page._emit('onReady')
  t.true(options.onReady.calledOnce)

  await page._emit('onShow')
  t.true(options.onShow.calledOnce)

  await page._emit('onHide')
  t.true(options.onHide.calledOnce)

  await page._emit('onUnload')
  t.true(options.onUnload.calledOnce)

  t.is(typeof page.onNonexistentHook, 'undefined')
  t.true(options.onNonexistentHook.notCalled)
})

test.serial('`onPullDownRefresh`, `onReachBottom`, `onShareAppMessage`, `onPageScroll`, `onTabItemTap` should be called', async (t) => {
  const options = {
    onPullDownRefresh: sinon.spy(),
    onReachBottom: sinon.spy(),
    onShareAppMessage: sinon.spy(),
    onPageScroll: sinon.spy(),
    onTabItemTap: sinon.spy(),
  }
  Tina.Page.define(options)

  const page = t.context.mina.getPage(-1)

  t.true(options.onPullDownRefresh.notCalled)
  t.true(options.onReachBottom.notCalled)
  t.true(options.onShareAppMessage.notCalled)
  t.true(options.onPageScroll.notCalled)
  t.true(options.onTabItemTap.notCalled)

  await page._emit('onLoad')

  await page._emit('onPullDownRefresh')
  t.true(options.onPullDownRefresh.calledOnce)

  await page._emit('onReachBottom')
  t.true(options.onReachBottom.calledOnce)

  await page._emit('onShareAppMessage')
  t.true(options.onShareAppMessage.calledOnce)

  await page._emit('onPageScroll')
  t.true(options.onPageScroll.calledOnce)

  await page._emit('onTabItemTap')
  t.true(options.onTabItemTap.calledOnce)
})

test.serial('`before` hooks should called before `on` hooks', async (t) => {
  const options = {
    beforeLoad: sinon.spy(),
    onLoad: sinon.spy(),
  }
  Tina.Page.define(options)

  const page = t.context.mina.getPage(-1)

  t.true(options.beforeLoad.notCalled)
  t.true(options.onLoad.notCalled)

  await page._emit('onLoad')
  t.true(options.beforeLoad.calledOnce)
  t.true(options.onLoad.calledOnce)
  t.true(options.beforeLoad.calledBefore(options.onLoad))
})

test.serial('`data` could be defined by `Page.define({ data })`', (t) => {
  const options = {
    data () {
      return {
        foo: 'bar',
      }
    },
  }
  Tina.Page.define(options)

  const page = t.context.mina.getPage(-1)

  t.deepEqual(page.data, options.data)
})

test.serial('`this.data` could be accessed', async (t) => {
  const spy = sinon.spy()
  const options = {
    data () {
      return {
        foo: 'bar',
      }
    },
    onLoad () {
      spy(this.data)
    },
  }
  Tina.Page.define(options)

  const page = t.context.mina.getPage(-1)
  await page._emit('onLoad')

  t.true(spy.calledWithExactly(options.data))
})

test.serial('`this.route` could be accessed', async (t) => {
  const ROUTE = '/somewhere'
  const spy = sinon.spy()
  const options = {
    onLoad () {
      spy(this.route)
    },
  }
  Tina.Page.define(options)

  const page = t.context.mina.getPage(-1)
  page.route = ROUTE
  await page._emit('onLoad')

  t.true(spy.calledWithExactly(ROUTE))
})

test.serial('`methods` could be called in context of Tina.Page instance', async (t) => {
  const options = {
    onLoad () {
      this.foo()
    },
    methods: {
      foo: sinon.stub().callsFake(function () {
        this.bar()
      }),
      bar: sinon.spy(),
    },
  }
  Tina.Page.define(options)

  const page = t.context.mina.getPage(-1)

  t.true(options.methods.foo.notCalled)
  t.true(options.methods.bar.notCalled)

  await page._emit('onLoad')

  t.true(options.methods.foo.calledOnce)
  t.true(options.methods.bar.calledOnce)
})

test.serial('`this.setData(patch)` could update data', async (t) => {
  const options = {
    data () {
      return {
        foo: 'bar',
      }
    },
    onLoad () {
      this.setData({
        foo: 'baz',
      })
    },
  }
  Tina.Page.define(options)

  const page = t.context.mina.getPage(-1)
  t.deepEqual(page.data, { foo: 'bar' })

  await page._emit('onLoad')
  t.deepEqual(page.data, { foo: 'baz' })
})

test.serial('`this.setData(patch, callback)` could update data and then execute callback', async (t) => {
  const spy = sinon.spy()
  const options = {
    data () {
      return {
        foo: 'bar',
      }
    },
    onLoad () {
      this.setData({
        foo: 'baz',
      }, spy)
    },
  }
  Tina.Page.define(options)

  const page = t.context.mina.getPage(-1)
  t.deepEqual(page.data, { foo: 'bar' })
  t.true(spy.notCalled)

  await page._emit('onLoad')
  t.deepEqual(page.data, { foo: 'baz' })
  t.true(spy.called)
})

test.serial('`getCurrentPages` should return the instances created with Tina.Page', async (t) => {
  const spy = sinon.spy()
  Tina.Page.define({
    onLoad () {
      spy(this)
    },
  })

  const page = t.context.mina.getPage(-1)

  await page._emit('onLoad')

  t.is(Tina.getCurrentPages()[0], page.__tina_instance__)
  t.true(spy.calledOnce)
  t.true(spy.calledWithExactly(Tina.getCurrentPages()[0]))
})
