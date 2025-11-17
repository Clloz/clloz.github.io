---
title: '对 Promise 的一些新的思考'
publishDate: '2021-03-18 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

我之前在阅读 `《ECMAScript 6 入门》` 的时候曾经写过一篇 [深入 Promise](https://www.clloz.com/programming/front-end/js/2020/10/28/deep-into-promise/ '深入 Promise')，从 `Promise` 实现的角度对 `Promise` 的机制进行了一点探究，我自己认为理解的还可以，不过昨天同事给了我一道 `Promise` 的执行顺序题，让我久违的复习了一下 `Promise`，发现之前的理解还是存在一些问题。

## 题目分析

```javascript
Promise.resolve()
  .then(() => {
    console.log('0')
    return Promise.resolve('4')
  })
  .then((res) => {
    console.log(res)
  })
Promise.resolve()
  .then(() => {
    console.log('1')
  })
  .then(() => {
    console.log('2')
  })
  .then(() => {
    console.log('3')
  })
  .then(() => {
    console.log('5')
  })
  .then(() => {
    console.log('6')
  })
```

就是这样一个 `Promise` 的执行顺序题，我当时的第一反应是 `0 1 4 2 3 5 6`，我在 `code runner` 里面跑了一下也没问题，但是后来到浏览器控制台以及 `node` 中跑了一下代码，发现输出都是 `0 1 2 3 4 5 6`，就让我非常迷茫，后面我又把我那篇 [深入 Promise](https://www.clloz.com/programming/front-end/js/2020/10/28/deep-into-promise/ '深入 Promise') 看了一遍，发现了一些问题。

首先是对 `then` 的理解，我在之前的文章中也写了 `new Promise` 和 `then` 本身都是同步执行的，但我还是认为 `Promise` 变为 `settled` 状态以后才会执行 `then`，但这显然是不太可能，也不符合 `JS` 引擎的执行规律。在 `Promise` 的实现中 `then` 本身就是 `Promise` 类的一个方法，其执行会返回一个 `Promise` 对象，既然是方法并且是同步代码，`then` 肯定会同步执行。只不过如果上级 `Promise` 如果是 `pending` 状态，`then` 的参数方法会被缓存到上级 `Promise` 的回调函数队列中而已，上级 `Promise` 已经 `resolved` 进入 `fulfilled` 状态，则 `then` 的参数方法直接进入微任务队列。

但是 `then` 还有一个细节就是如果我们在 `then` 中返回的是一个 `Promise`，会调用这个 `Promise` 的 `then` 方法，并且在这个 `then` 当中进行父级 `Promise` 的 `resolve` 或者 `reject`，细节参考 [深入 Promise](https://www.clloz.com/programming/front-end/js/2020/10/28/deep-into-promise/ '深入 Promise') 的源码实现中的 `resolvePromise`方法。其实解释这个也很简单，当我们返回的是一个 `Promise` 的时候，我们需要在这个 `Promise` 的状态 `settled` 之后才能对父级的这个 `then` 进行 `resolve`，所以当 `then` 中返回的是一个 `Promise` 的时候会存在一次隐式的 `then` 调用。我们来看下面四段代码的输出：

```javascript
// 第一段代码
Promise.resolve()
  .then(() => {
    console.log('0')
    return new Promise((resolve) => {
      return resolve(10)
    })
  })
  .then((res) => {
    console.log(res)
  })
Promise.resolve()
  .then(() => {
    console.log('1')
  })
  .then(() => {
    console.log('2')
  })
  .then(() => {
    console.log('3')
  })
  .then(() => {
    console.log('5')
  })
  .then(() => {
    console.log('6')
  })

// 0
// 1
// 2
// 3
// 10
// 5
// 6
```

```javascript
// 第二段代码
Promise.resolve()
  .then(() => {
    console.log('0')
    return new Promise((resolve) => {
      return resolve(4)
    }).then(() => 11)
  })
  .then((res) => {
    console.log(res)
  })
Promise.resolve()
  .then(() => {
    console.log('1')
  })
  .then(() => {
    console.log('2')
  })
  .then(() => {
    console.log('3')
  })
  .then(() => {
    console.log('5')
  })
  .then(() => {
    console.log('6')
  })

// 0
// 1
// 2
// 3
// 11
// 5
// 6
```

```javascript
// 第三段代码
Promise.resolve()
  .then(() => {
    console.log('0')
    return new Promise((resolve) => {
      return resolve(4)
    })
      .then(() => 11)
      .then(() => 12)
  })
  .then((res) => {
    console.log(res)
  })
Promise.resolve()
  .then(() => {
    console.log('1')
  })
  .then(() => {
    console.log('2')
  })
  .then(() => {
    console.log('3')
  })
  .then(() => {
    console.log('5')
  })
  .then(() => {
    console.log('6')
  })

// 0
// 1
// 2
// 3
// 5
// 12
// 6
```

```javascript
// 第四段代码
Promise.resolve()
  .then(() => {
    console.log('0')
    return new Promise((resolve) => {
      return resolve(4)
    })
      .then(() => 11)
      .then(() => 12)
      .then(() => 13)
  })
  .then((res) => {
    console.log(res)
  })
Promise.resolve()
  .then(() => {
    console.log('1')
  })
  .then(() => {
    console.log('2')
  })
  .then(() => {
    console.log('3')
  })
  .then(() => {
    console.log('5')
  })
  .then(() => {
    console.log('6')
  })

// 0
// 1
// 2
// 3
// 5
// 6
// 13
```

第一段代码中我们返回了一个直接 `resolve` 的 `Promise`，我们发现和 `Promise.reslove()` 效果是一样的。我们可以看到返回的这个 `Promise` 它只是 `resolve` 了它自己，而父级的 `then` 状态改变必然要在这个返回的 `Promise` 状态确定之后才能确定是 `resolve` 还是 `reject`，所以在 `Promise` 实现的源码中我们可以发现，如果 `then` 的返回是一个 `Promise`，会在这个 `Promise` 的 `then` 中进行 `resolve` 和 `reject`。

第二段代码中我们对返回的 `Promise` 进行了 `then`，结果和第一段代码的执行结果是相同的。这段代码的过程比较好分析（以打印的值来标志代码段，比如 `console.log(0)` 这段代码我们就称为 `0`）： 1. 执行所有同步代码，两个 `Promise.resolve()` 直接 `resolved`，所以 `0` 和 `1` 都被加入微任务队列。 2. 同步代码执行完成，开始执行微任务，先执行 `0`，打印 `0`，然后执行 `new Promise` 并直接 `resolve`，将这个新的 `Promise` 的 `then` 中的 `11` 加入微任务队列。 3. 执行下一个 `1` 微任务，打印 `1`，并把 `2` 加入微任务队列。 4. 执行 `11` 微任务，并隐式调用返回的 `Promise` 的 `then`，隐式调用的 `then` 的回调函数加入微任务队列 5. 执行 `2`，打印 `2`，将 `3` 加入微任务队列， 6. 执行隐式调用的 `then` 微任务，在这个 `then` 中 `resolve` 父级的 `then`，同时将 `console.log(res)` 这段代码加入微任务队列 7. 执行 `3`，打印 `3`，将 `5` 加入微任务队列 8. 执行 `console.log(res)`，打印 `11` 9. 执行 `5`，打印 `5`，将 `6` 加入微任务队列 10. 执行 `6`，打印 `6`

这个过程逻辑没有什么问题，但是第一段代码比第二段少一个 `then` 执行结果依然是一样的，感觉就像是隐式调用了两次 `then`，这里我没有找到具体的原因，去翻了翻 `v8` 的 `Promise` 源码也没有找到合适的解释（源码参考 [从Google V8引擎剖析Promise实现](https://segmentfault.com/a/1190000019258738 '从Google V8引擎剖析Promise实现')。

后面的两段代码用上面的理论也比较好解释，每多一个 `then` 就推迟一次打印结果。有了这几个例子，上面的 `Promise.resolve` 那一个问题也是一样的思考逻辑。

## 总结

本文对 `Promise` 特别是 `then` 的执行细节进行了更深入的探究，但还是有一个问题没有解决，如果你知道答案欢迎回复评论。这里在分享几个跟 `Promise` 相关的题目 [关于 ES6 中 Promise 的面试题](https://segmentfault.com/a/1190000016848192 '关于 ES6 中 Promise 的面试题')，第五题和第七题还是有点意思的。
