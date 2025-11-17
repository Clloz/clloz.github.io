---
title: '深入发布订阅模式'
publishDate: '2020-10-18 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

前端其实涉及到的设计模式不多，不过现在的主流框架都是用了发布订阅模式，所以这个设计模式也经常被提到，也是面试的时候的高频问题，这篇文章我们来深入讨论一下什么是发布订阅模式，为什么要使用发布订阅模式以及如何实现发布订阅模式。

## 观察者模式 Observer pattern

在讨论发布订阅模式之前，我们先来讨论一下观察者模式。这两者的思想是一致的，只是具体的实现不同，应用场景也不同，可以说发布订阅模式是观察者模式的一种更优化的实现。但是我觉的观察者模式更容易理解，我们也经常使用，所以作为前置。

观察者模式说起来很简单，我们希望对一个目标进行 `observe`，当这个目标发生变化的时候告诉我们。其实这听上去和回调函数很像，其实回调函数就是一种特殊的观察者模式。真正的观察者模式需要是一对多的，被观察者 `Subject` 会管理一个观察者列表，当这个 `Subject` 发生某个变化的时候会通知观察者列表中的所有观察者。大概关系如下图：

![observer1](./images/observer1.png 'observer1')

有没有感觉这个模式非常熟悉，这和我们经常使用的 `DOM` 事件模式完全相同。我们的 `DOM` 事件也就是一个观察者模式的实现。当我们为一个元素绑定事件的时候，我们就相当于进行了 `Subscribe` 订阅，成为了一个观察者。当对应的事件触发的时候，被观察的元素会通知我们，执行我们的回调函数（所谓的通知其实就是执行观察者中的对应方法，并不是真的发个通知）。我们也可以绑定多个 `Observer`，当事件触发的时候，所有的观察者都会被通知。`DOM` 提供了我们订阅 `addEventListener`，和取消订阅 `removeEventListener` 的 `API`。

所以观察者模式有两个部分；观察者和被观察对象。而主要的实现都是在被观察对象上，一个模拟的观察者模式的实现如下：

```javascript
// 观察者
class Observer {
  constructor() {}
  update(val) {}
}
// 观察者列表
class ObserverList {
  constructor() {
    this.observerList = []
  }
  add(observer) {
    return this.observerList.push(observer)
  }
  remove(observer) {
    this.observerList = this.observerList.filter((ob) => ob !== observer)
  }
  count() {
    return this.observerList.length
  }
  get(index) {
    return this.observerList(index)
  }
}
// 目标
class Subject {
  constructor() {
    this.observers = new ObserverList()
  }
  addObserver(observer) {
    this.observers.add(observer)
  }
  removeObserver(observer) {
    this.observers.remove(observer)
  }
  notify(...args) {
    let obCount = this.observers.count()
    for (let i = 0; i < obCount; i++) {
      this.observers.get(i).update(...args)
    }
  }
}
```

我们可以看到所以的逻辑都是在被观察者 `Subject` 上，它提供了添加观察者，删除观察者和通知等方法，有一个管理观察者列表的机制，当事件触发的时候，会执行列表中所有观察者的对应方法。

观察者模式的逻辑是非常简单的，特别是我们可以和经常使用的 `DOM` 事件结合起来。它主要解决的问题就是我们希望在某种情况下执行我们的代码，但我们不确定这个情况什么时候发生，比如浏览器事件（我们不知道用户什么时候点击，但我们希望用户点击的时候执行某一段代码）。

最后在放一个用 `Proxy` 实现的简单的观察者模式。

```javascript
let fnArr = new Set()
function observable(obj) {
  return new Proxy(obj, {
    set: function (target, prop, value, receiver) {
      Reflect.set(target, prop, value)
      for (let fn of fnArr) {
        console.log(fn)
        fn()
      }
    }
  })
}

function observe(fn) {
  fnArr.add(fn)
}

const person = observable({
  name: '张三',
  age: 20
})
function print() {
  console.log(`${person.name}, ${person.age}`)
}
observe(print)
person.name = '李四' // 李四, 20
```

## 发布订阅模式 Pub-sub pattern

有了观察者模式，为什么又要有发布订阅模式呢？观察者模式中，观察者和目标是依赖的，耦合性很强。

我们可以想象一个场景，我们有多个目标要进行监听，但是这些目标事件触发后执行的逻辑其实是相同的，如果是使用观察者模式我们不得不对每一个目标都进行绑定，并且每一个目标都要事先一套上面 `Subject` 的逻辑。这样处理在系统越来越复杂的情况下代码的逻辑会非常混乱，也非常难以管理，并且有非常多冗余的部分。

为了解决这个问题，就有了发布订阅模式。他们的本质都是一样的，都是对于未来会发生的事件进行一个监听，当事件发生了，通知监听的对象执行对应的方法。但是他们实现的逻辑不同。看下图：

![observer2](./images/observer2.png 'observer2')

在发布订阅模式中，添加了一个事件通道，发布者和订阅者不在直接进行交互。所有的注册，解绑，发布都是通过 `Event Channel` 来实现的。也就是说我们把观察者模式中的逻辑抽象出来，形成了一个单独的模块。

现在整个的逻辑大概是这样：我们不再是对某个对象进行监听，而是告诉 `Event Channel`，我想要注册一个名叫 `type` 的事件，当这个事件触发以后，请执行 `fn` 函数。事件中心将我的注册信息进行保存。当有一个模块想要执行订阅者的对应方法的时候，只要告诉 `Event Channel`，我想要触发 `type` 事件，并且传入参数 `arg1, arg2 ...`。`Event Channel` 就会找到对应事件对应的 `fn` 传入 `arg1, arg2 ...` 并执行。

我们可以看到 `Event Channel` 就像一个消息中介，调度中心，它让发布者和订阅者之间完全解耦，它们甚至不知道对方的存在。我们将所有的订阅发布行为进行集中的管理，并且能够定制我们的订阅发布行为，让不同模块之间的通信业变得非常便捷。我们看下面的模拟实现发布订阅代码：

```javascript
class PubSub {
  constructor() {
    this.subscribers = {}
  }
  subscribe(type, fn) {
    let listeners = this.subscribers[type] || []
    listeners.push(fn)
  }
  unsubscribe(type, fn) {
    let listeners = this.subscribers[type]
    if (!listeners || !listeners.length) return
    this.subscribers[type] = listeners.filter((v) => v !== fn)
  }
  publish(type, ...args) {
    let listeners = this.subscribers[type]
    if (!listeners || !listeners.length) return
    listeners.forEach((fn) => fn(...args))
  }
}

let ob = new PubSub()
ob.subscribe('add', (val) => console.log(val))
ob.publish('add', 1)
```

比较观察者模式和发布订阅模式的代码我们可以发现，观察者模式由具体目标调度，每个被订阅的目标里面都需要有对观察者的处理，会造成代码的冗余。而发布订阅模式则统一由调度中心处理，消除了发布者和订阅者之间的依赖。

我们可以结合生活中的实例来帮助你理解，比如你周五想约朋友去吃饭，你不知道谁有空，按观察者模式的逻辑来说，你得给每个可能的朋友发条信息：`如果触发有空事件请给我打电话`（注册），当朋友触发 `有空` 事件的时候，将会对你进行通知（执行 `打电话` 方法）。如果是订阅发布模式的话逻辑就是，你向 `朋友圈`（这里相当于 `Event Channel`） 注册了一个事件，名字叫 `有空`，方法是 `打电话`，当有朋友想要参与聚会的时候，会告诉 `朋友圈` （`Event Channel`），你要发布 `有空` 事件，参数是 `185xxxxxxxx`，朋友圈用这个参数执行了 `打电话` 方法。

不知道上面这个例子有没有帮助你理解观察者模式和订阅发布模式的逻辑和区别。

## 实现

正因为观察订阅模式的这种机制，它成了很多框架和库用来实现模块之间通信的方式。比如 `Vue` 的 `Event(bus)`，`React` 的 `Event` 模块，他们都用来实现非父子组件的通信。实际上几乎所有的模块通信都是基于类似的模式,包括安卓开发中的`Event Bus`，`Node.js` 中的 `Event` 模块( `Node` 中几乎所有的模块都依赖于 `Event`,包括不限于 `http`、`stream`、`buffer`、`fs` 等)。

这一小节我们就仿照 `NodeJS` 的 `Event API` 实现一个简单的 `Event` 库。

我们的大致需求是：实现一个 `Emitter` 类，该类能够实现事件的订阅，解绑，发布。事件的存储使用 `Map`。对于同一个类型的事件，支持多次绑定（即传入多个方法），当事件发布的时候，这些方法都将执行。

```javascript
class Emitter {
  constructor() {
    this._event = this._event || new Map()
    this.maxListeners = 10
  }

  addEventListener(type, fn) {
    const handler = this._event.get(type)

    if (!handler) {
      this._event.set(type, fn)
    } else {
      if (handler && typeof handler === 'function') {
        this._event.set(type, [handler, fn])
      } else {
        handler.push(fn)
      }
    }
  }

  removeEventListener(type, fn) {
    const handler = this._event.get(type)

    if (handler && typeof handler === 'function') {
      if (handler === fn) this._event.delete(type)
    } else {
      let newHandler = handler.filter((v) => v !== fn)
      if (newHandler.length === 1) {
        this._event.set(type, newHandler[0])
      } else {
        this._event.set(type, newHandler)
      }
    }
  }

  emit(type, ...args) {
    const handler = this._event.get(type)

    if (Array.isArray(handler)) {
      handler.forEach((fn) => {
        fn.apply(this, args)
      })
    } else {
      handler.apply(this, args)
    }
    return true
  }
}

let emitter = new Emitter()

emitter.addEventListener('change', (obj) => {
  console.log(`name is ${obj.name}.`)
})

emitter.addEventListener('change', (obj) => {
  console.log(`age is ${obj.age}.`)
})

emitter.addEventListener('change', (obj) => {
  console.log(`sex is ${obj.sex}.`)
})

function site(obj) {
  console.log(`site is ${obj.site}`)
}

emitter.addEventListener('change', site)

emitter.emit('change', {
  name: 'clloz',
  age: 28,
  sex: 'male',
  site: 'clloz.com'
})
//name is clloz.
//age is 28.
//sex is male.
//site is clloz.com

emitter.removeEventListener('change', site)

emitter.emit('change', {
  name: 'clloz',
  age: 28,
  sex: 'male',
  site: 'clloz.com'
})
//name is clloz.
//age is 28.
//sex is male.
```

如果你有兴趣也可以研究一下 `browserify` 的 `Event` 模块实现：[event.js - browserify](https://github.com/browserify/events/blob/master/events.js 'event.js - browserify')。

## 总结

本文对观察者模式和发布订阅模式进行了比较深入的分析，也进行了简单的模拟实现，希望对你的理解有所帮助。如果有错漏之处欢迎指正。

## 参考文章

1. [面试官:既然React/Vue可以用Event Bus进行组件通信,你可以实现下吗?](https://juejin.im/post/6844903587043082247 '面试官:既然React/Vue可以用Event Bus进行组件通信,你可以实现下吗?')
2. [观察者模式和发布订阅模式有什么不同？ - 无邪气的回答 - 知乎](https://www.zhihu.com/question/23486749/answer/314072549 '观察者模式和发布订阅模式有什么不同？ - 无邪气的回答 - 知乎')
3. [面试题， 实现一个Event类（发布订阅模式）](https://zhuanlan.zhihu.com/p/60324936 '面试题， 实现一个Event类（发布订阅模式）')
