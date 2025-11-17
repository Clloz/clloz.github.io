---
title: '深入 Promise'
publishDate: '2020-10-28 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

本文主要根据源码讲一讲 `Promise` 原理和用法。主要参考 [ES6 Promise](https://github.com/stefanpenner/es6-promise 'ES6 Promise') 和 [Promise/A+](https://promisesaplus.com 'Promise/A+')。

> 本文目前还在修改中，肯能有错漏和不完善之处，欢迎指正。

## `Promise` 源码实现

这个 `Promise` 源码实现是结合 [面试官：“你能手写一个 Promise 吗”](https://juejin.im/post/6850037281206566919) 和 [ES6-Promise](https://github.com/stefanpenner/es6-promise 'ES6-Promise')来的。前者没有考虑 `new Promise` 中的 `resolve` 参数为 `Promise` 的情况，后者没有考虑微任务处理逻辑。由于 `JS` 的 `API` 没有提供微任务处理逻辑，只能用宏任务 `setTimeout` 模拟。

```javascript
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

const resolvePromise = (promise2, x, resolve, reject) => {
  // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise  Promise/A+ 2.3.1
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // Promise/A+ 2.3.3.3.3 只能调用一次
  let called
  // 后续的条件要严格判断 保证代码能和别的库一起使用
  if ((typeof x === 'object' && x != null) || typeof x === 'function') {
    try {
      // 为了判断 resolve 过的就不用再 reject 了（比如 reject 和 resolve 同时调用的时候）  Promise/A+ 2.3.3.1
      let then = x.then
      if (typeof then === 'function') {
        // 不要写成 x.then，直接 then.call 就可以了 因为 x.then 会再次取值，Object.defineProperty  Promise/A+ 2.3.3.3
        then.call(
          x,
          (y) => {
            // 根据 promise 的状态决定是成功还是失败
            if (called) return
            called = true
            // 递归解析的过程（因为可能 promise 中还有 promise） Promise/A+ 2.3.3.3.1
            resolvePromise(promise2, y, resolve, reject)
          },
          (r) => {
            // 只要失败就失败 Promise/A+ 2.3.3.3.2
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        // 如果 x.then 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.3.4
        resolve(x)
      }
    } catch (e) {
      // Promise/A+ 2.3.3.2
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // 如果 x 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.4
    resolve(x)
  }
}

class Promise {
  constructor(executor) {
    this._this = this
    this._this.status = PENDING
    this._this.value = undefined
    this._this.reason = undefined
    this._this.onResolvedCallbacks = []
    this._this.onRejectedCallbacks = []

    let resolve = (value) => {
      //判断一下是否是 promise，是的话更换 this._this 到 value
      if (value instanceof Promise) {
        console.log(1)
        this._this = value.then(
          (value) => value,
          (reason) => reason
        )
      } else {
        if (this._this.status === PENDING) {
          this._this.status = FULFILLED
          this._this.value = value
          this._this.onResolvedCallbacks.forEach((fn) => fn())
        }
      }
    }

    let reject = (reason) => {
      if (this._this.status === PENDING) {
        this._this.status = REJECTED
        this._this.reason = reason
        this._this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
    // if (this._this.isValuePromise) {
    // }
  }

  then(onFulfilled, onRejected) {
    //解决 onFufilled，onRejected 没有传值的问题
    //Promise/A+ 2.2.1 / Promise/A+ 2.2.5 / Promise/A+ 2.2.7.3 / Promise/A+ 2.2.7.4
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v
    //因为错误的值要让后面访问到，所以这里也要抛出个错误，不然会在之后 then 的 resolve 中捕获
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (err) => {
            throw err
          }
    // 每次调用 then 都返回一个新的 promise  Promise/A+ 2.2.7
    let promise2 = new Promise((resolve, reject) => {
      if (this._this.status === FULFILLED) {
        //Promise/A+ 2.2.2
        //Promise/A+ 2.2.4 --- setTimeout
        setTimeout(() => {
          try {
            //Promise/A+ 2.2.7.1
            let x = onFulfilled(this._this.value)
            // x可能是一个proimise
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            //Promise/A+ 2.2.7.2
            reject(e)
          }
        }, 0)
      }

      if (this._this.status === REJECTED) {
        //Promise/A+ 2.2.3
        setTimeout(() => {
          try {
            let x = onRejected(this._this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      if (this._this.status === PENDING) {
        this._this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this._this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })

        this._this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this._this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })

    return promise2
  }
}
```

`new Promise` 接受一个函数作为参数 `fn(resolve, reject){}`。`resolve` 和 `reject` 是内部实现的函数，主要作用是改变状态，发布状态，这里使用了发布订阅模式。

`Promise` 实例内部的状态有三种 `pendding`，`fulfilled` 和 `rejected`。内部实现了一些设施，首先就是有一个 `state` 属性保存当前状态，一个 `result` 属性保存当前任务的结果（传递给 `resolve` 或者 `reject` 的参数），还有一个发布订阅模式的事件中心 `subscriber` 数组（保存我们状态改变时需要执行的回调函数）。

当执行 `new Promise` 之后会立即执行参数 `fn`，`new Promise` 创建实例是同步执行，包括`then`，`catch` 和 `finally` 执行也是同步的，只有他们内部的的回调函数才是异步的。我们可以在 `fn` 中自己控制流程，比如当完成某个语句就表示当前任务完成，我们就调用 `resolve(value)`，并将我们要传递给下一个任务的数据当做参数传递给 `resolve`。`reject` 同理，不过他是用来处理任务失败的情况。状态一旦变更就无法再次改变，所以在 `fn` 中对此调用 `resolve` 和 `reject`，只有第一个会生效。并且，`fn` 会执行完毕，而不是执行到 `resolve` 或者 `reject` 就停止执行了。如果你不希望执行 `resolve` 或者 `reject` 之后的代码，可以在 `resolve` 或 `reject` 之前加上 `return`。

这里在执行参数 `fn` 的时候用的是 `try ... catch`，如果抛错则直接执行 `reject`，参数就是错误对象。其实 `reject` 等同于抛出错误。如果状态已经改变了（即已经调用了 `resolve` 或者 `reject`），那么再次抛错也不会有什么效果。

`resolve` 的原理（`reject` 更简单，这里以 `resolve` 分析）：如果 `Promise` 的 `result` （传递给 `resolve` 的参数）不是 `Promise` 实例的话，就直接通知发布订阅模式的事件中心 `subscriber` 当前任务完成了，请执行对应的回调函数。

关于 `resolve` 的参数是一个 `Promise` 的情况，`Promise/A+` 并没有给出说明，`ES6-Promise` 虽然处理的了这个逻辑，但是它并没有在 `then` 中模拟微任务。这里就都是我个人的处理，我是在 `resolve` 中判断，如果 `value` 参数是一个 `Promise`，就将当前对象的 `this` 换成 `value.then(value => value, reason => reason)`。这样我们的下一个 `then` 接受到的状态就是 `value` 的状态和结果。这个和浏览器以及 `node` 中的执行结果是相同的。可以用下面一段代码测试：

```javascript
let p1 = new Promise((resolve, reject) => {
  resolve('p1')
})

let p2 = new Promise((resolve, reject) => {
  resolve(p1)
})

// p2.then(value => {
//     return p1;
// }).then(value => {
//     console.log(value);
// });

p2.then((value) => {
  console.log(value)
})
```

从 `resolve` 的逻辑我们可以看出。对于一个 `Promise` 我们只关心它的状态 `state` 和它的结果 `result`，无论里面怎么绕我们最后就是确定这个 `Promise` 的 `state` 和 `result`。`state` 确定我们下一个任务的回调函数，而 `result` 是我们要传递给下一个任务的数据。所以当出现 `resolve` 嵌套 `Promise` 情况，假设是 `PromiseA` 中的 `resolve` 参数是 `PromiseB`，我们现在想知道 `PromiseA` 的状态和 `result` 就必须要等到 `PromiseB` 的状态和 `result` 确定才能知道，而最后的状态和 `result` 也是由 `PromiseB` 确定的。

---

下面分析 `Promise.prototype.then()`。我们已经理清了 `Promise` 实例化的过程，而 `then` 的作用就是添加下一个任务，添加任务的形式就是给 `then` 传递两个参数，第一个参数是 `fnResolve(data)`，也就是 `Promise` 的状态变为 `fulfilled` 的时候，将执行`fnResolve(data)`，你可能会感觉这个 `data` 是上面 `resolve` 的参数，其实他是调用 `then` 的 `Promise` 对象的 `value` 或 `reason`。

那么 `then` 的内部逻辑是什么呢，为什么能够实现链式调用？原理其实也并不复杂，每一个 `then` 都返回一个新的 `Promise`（当时 `then` 的 `Promise` 构造和最初的 `Promise` 构造还是有些不同，这个下面说）。执行 `then` 其实和上面 `resolve` 嵌套 `Promise` 逻辑是类似的。如果 `Promise` 的状态已经是 `fulfilled` 或者 `rejected`，那么 `then` 就直接执行对应的函数（这里用 `setTimeout(callback, 0)` 包装执行函数是用宏任务模拟微任务）。如果 `Promise` 的状态是 `pendding`，那么 `then` 就需要向事件中心进行注册，把待执行的函数用 `setTimout(callback, 0)` 包装后 `push` 进发布订阅中心的数组中（这里用 `setTimeout` 包装依然是为了模拟微任务）。当父 `Promise` 状态变化的时候，事件中心会执行子 `Promise` 的对应方法。

而下一个链式调用的 `then`，它的父 `Promise` 就是上一个 `then` 新建的 `Promise`，执行逻辑是一样的。我们可以发现父子 `Promise` 的状态是同步的。而如果 `then` 没有传入回调函数，则直接将父 `Promise` 的 `result` 传递给子 `Promise`，作为子 `Promise` 的 `result`。

另外注意一点，在 `then` 中我们无法直接设定我们的状态，也就是我们不能像 `new Promise` 一样直接操作 `resolve` 和 `reject` 方法来改变我们的状态，因为 `then` 的回调函数接收的参数只有上一个 `Promise` 穿过来的结果，内部的 `resolve` 和 `reject` 对我们来说都是不可以减的。当我们的回调函数执行报错，或者我们的回调函数返回值等于我们创建的 `promise`，就会调用 `reject`，参数是对应的报错，也就是状态变为 `rejected`；如果有回调函数并且正常返回，则调用 `resolve` 方法，参数就是回调函数的返回值（也可以没有返回值，下一个 `then` 接收到的结果就是 `undefined`），状态变为 `fulfilled`；如果没有回调函数，则直接用父 `Promise` 的 `result` 调用 `fulfill` 方法，也就是设置 `then` 的 `promise` 状态为 `fulfilled`。

> 就功能来说 `ES6-Promise` 是实现的比较完善的，不过它似乎没有考虑微任务的问题。不过它的代码还是应该看一看的。

## Promise.prototype.catch()

`Promise.prototype.catch` 方法是 `.then(null, rejection)` 的别名，用于指定发生错误时的回调函数。

```javascript
p.then((val) => console.log('fulfilled:', val)).catch((err) => console.log('rejected', err))
// 等同于
p.then((val) => console.log('fulfilled:', val)).then(null, (err) => console.log('rejected:', err))

// 写法一
var promise = new Promise(function (resolve, reject) {
  try {
    throw new Error('test')
  } catch (e) {
    reject(e)
  }
})
promise.catch(function (error) {
  console.log(error)
})
// 写法二
var promise = new Promise(function (resolve, reject) {
  reject(new Error('test'))
})
promise.catch(function (error) {
  console.log(error)
})
```

链式调用的 `then` 中任何一个抛错都会被 `.catch` 捕捉到。跟传统的 `try/catch` 代码块不同的是，如果没有使用 `catch` 方法指定错误处理的回调函数，`Promise` 对象抛出的错误不会传递到外层代码，即不会有任何反应，代码执行也不会中断。

`Promise` 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 `catch` 语句捕获。所以使用 `catch` 比使用 `reject` 函数要好。

需要注意的是， `catch` 方法返回的还是一个 `Promise` 对象，因此后面还可以接着调用 `then` 方法。

```javascript
var someAsyncThing = function () {
  return new Promise(function (resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2)
  })
}
someAsyncThing().then(function () {
  console.log('everything is great')
})

console.log(123123) //123123
```

上面代码中， `someAsyncThing` 函数产生的 `Promise` 对象会报错，但是由于没有指定 `catch` 方法，这个错误不会被捕获，也不会传递到外层代码。在浏览器环境会抛错 `Uncaught (in promise) ReferenceError: x is not defined`，但是代码的执行不会中断，在 `node` 中会抛错 `UnhandledPromiseRejectionWarning: ReferenceError: x is not defined`，当然也不会中断代码执行，最后的 `123123` 都能成功打印。

所以如果出现报错会直接冒泡到 `catch`，而如果没有报错，则 `catch` 会被跳过。而 `catch` 执行完之后会继续执行后面的 `then`，我们可以在 `catch` 中返回值传递给下一个 `then`，当然 `catch` 方法中也能继续抛错。

## 模拟实现 Promise.prototype.catch()

```javascript
Promise.prototype.catch = function (errCallback) {
  return this.then(null, errCallback)
}
```

## Promise.all()

该方法用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例，如果有参数不是 `Promise` 实例，就会先调用下面讲到的 `Promise.resolve()` 方法，将参数转为 `Promise` 实例， 再进一步处理。只有每个实例的状态都变成 `fulfilled`，新实例的状态才会变成 `fulfilled`，此时每个实例的返回值组成一个数组，传递给新实例的回调函数。这里其实不应该称作返回值，是 `Promise` 实例上的一个属性，`resolve` 方法会处理这个属性。如果数组中的元素不是 `thenable`，那么这个元素会在 `resolve` 成功的时候直接作为输出数组的元素输出。

```javascript
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok1')
  }, 1000)
})

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok2')
  }, 1000)
})
Promise.all([1, 2, 3, p1, p2]).then(
  (data) => {
    console.log('resolve', data)
  },
  (err) => {
    console.log('reject', err)
  }
)
//resolve [ 1, 2, 3, 'ok1', 'ok2' ]
```

这些被打包的实例中只要有一个状态编程 `rejected`，新实例的状态就编程 `rejected`，第一个编程 `rejected` 的实例的返回值传递给 `p` 的回调函数（一般是 `catch`）。如果被打包的实例自己定义了 `catch` 方法，那么它 `rejected` 的时候触发的将是自己的方法，而不会触发新实例的 `catch` 方法。并且自己的 `catch` 调用完之后，状态也会编程 `resolved`，这可能导致最后的新实例将会调用 `resolve` 方法。

```javascript
const p1 = new Promise((resolve, reject) => {
  resolve('hello')
})
  .then((result) => result)
  .catch((e) => e)
const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了')
})
  .then((result) => result)
  .catch((e) => e)
Promise.all([p1, p2])
  .then((result) => console.log(result))
  .catch((e) => console.log(e))
// ["hello", Error: 报错了]
```

## 模拟实现 Promise.all()

```javascript
Promise.all1 = function (values) {
  if (!Array.isArray(values)) {
    const type = typeof values
    return new TypeError(`TypeError: ${type} ${values} is not iterable`)
  }

  return new Promise((resolve, reject) => {
    let resultArr = []
    let orderIndex = 0
    const processResultByKey = (value, index) => {
      resultArr[index] = value
      if (++orderIndex === values.length) {
        // console.log(resultArr);
        resolve(resultArr)
      }
    }
    for (let i = 0; i < values.length; i++) {
      let value = values[i]
      if (value && typeof value.then === 'function') {
        value.then((value) => {
          processResultByKey(value, i)
        }, reject)
      } else {
        processResultByKey(value, i)
      }
    }
  })
}
```

## Promise.race()

该方法同样是将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。被包装的实例中只要有一个先改变了状态，新的实例的状态也就跟着改变，那个率先改变的实例的返回值会传递给新对象的回调函数。如果有参数不是 `Promise` 实 例，就会先调用下面讲到的 方法，将参数转为 `Promise` 实例， 再进一步处理。

```javascript
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
])
p.then((response) => console.log(response))
p.catch((error) => console.log(error))
```

这个例子请求指定资源，如果 `5` 秒内没有请求到，那么 `p` 的状态就会变为 `rejected`，从而触发 `catch` 方法指定的回调函数。

> 和 `Promise.all()` 一样，如果传入的参数数组中有不是 `thenable` 的元素则该元素会直接触发 `resolve`，返回的就是该元素的值。

## 模拟实现 Promise.race()

```javascript
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    // 一起执行就是for循环
    for (let i = 0; i < promises.length; i++) {
      let val = promises[i]
      if (val && typeof val.then === 'function') {
        val.then(resolve, reject)
      } else {
        // 普通值
        resolve(val)
      }
    }
  })
}
```

## Promise.resolve()

该方法用来将现有对象转为 `Promise` 对象，`Promise.resolve()` 可以接受四种参数：

1. 参数是一个 `Promise` 实例：如果参数是 `Promise` 实例，那么 `Promise.resolve` 将不做任何修改、原封不动地返回这个实例。
2. 参数是一个 `thenable` 对象，就是一个有 `then` 方法的对象。`Promise.resolve()` 方法会将这个对象转为 `Promise` 对象，然后就立即执对象的 `then` 方法。这里的 `then` 方法就相当于我们 `new Promise` 时传入的函数参数，使用方式也一样，我们可以进行 `resolve` 或者 `reject`，也可以抛出错误，和一个正常的 `Promise` 相同。

```javascript
let thenable = {
  then: function (resolve, reject) {
    resolve(42)
  }
}
let p1 = Promise.resolve(thenable)
p1.then(function (value) {
  console.log(value) // 42
})
```

3. 参数不具备 `then` 方法，或根本不是一个对象：如果参数是一个原始值，或者是一个不具有 `then` 方法的对象，则 `Promise.resolve` 方法返回一个新的 `Promise` 对象，状态为 `resolved` 。而我们传入 `Promise.resolve()` 的参数也会传给 `then` 的回调函数。

```javascript
var p = Promise.resolve({ name: 'clloz' })
p.then(function (s) {
  console.log(s) //{ name: 'clloz' }
})
```

4. 不带有任何参数：该方法允许调用时不带参数，直接返回一个 `resolved` 状态的 `Promise` 对象。 所以，如果希望得到一个 `Promise` 对象，比较方便的方法就是直接调用 `Promise.resolve` 方法。需要注意的是，立即 `resolve` 的 `Promise` 对象，是在本轮“事件循环”(`event loop`)的结束时，而不是在下一轮“事件循环”的开始时，其实所有的异步 `Promise`，包括 `then`，`catch` 和 `finally` 包括 `node` 的 `process.nextTick` 都会在本轮事件循环的宏任务结束后执行，其中 `nextTick` 是微任务中最先执行的。

```javascript
setTimeout(function () {
  console.log('three')
}, 0)
Promise.resolve().then(function () {
  console.log('two')
})
console.log('one')
// one
// two
// three
```

> 不要在 `then` 指向自身的循环引用对象上调用 `Promise.resolve`。这将导致无限递归，因为它试图展平无限嵌套的 `promise`。

## 模拟实现 Promise.resolve()

```javascript
Promise.resolve = function (val) {
  if (val instanceof Promise) {
    return val
  }
  if (val.then && typeof val.then === 'function') {
    console.log(val)
    return new Promise(val.then)
  }
  return new Promise((resolve) => {
    resolve(val)
  })
}
```

## Promise.reject()

该方法也会返回一个新的 `Promise` 实例，该实例的状态为 `rejected`。

```javascript
var p = Promise.reject('出错了')
// 等同于
var p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
})
// 出错了
```

`Promise.reject()` 方法的参数，会原封不动地作为 `reject` 的理由，变成后续方法的参数。这一点与 `Promise.resolve` 方法不一致。`Promise.resolve()` 是有多种不同的情况不一样处理。

```javascript
const thenable = {
  then(resolve, reject) {
    reject('出错了')
  }
}
Promise.reject(thenable).catch((e) => {
  console.log(e === thenable)
})
// true
```

## 模拟实现 Promise.reject()

```javascript
Promise.reject(reason){
  return new Promise((resolve,reject)=>{
    reject(reason);
  })
}
```

## Promise.finally()

`finally()` 方法返回一个 `Promise`。在 `promise` 结束时，无论结果是 `fulfilled` 或者是 `rejected`，都会执行指定的回调函数。这为在 `Promise` 是否成功完成后都需要执行的代码提供了一种方式。这避免了同样的语句需要在 `then()` 和 `catch()` 中各写一次的情况。

需要注意的是，`finally` 表示的是一定会执行，而不是说最后执行，即使 `finally` 后面仍然有 `then` 或者 `catch`，也是能工作的。`finally` 的实现如下：

```javascript
Promise.prototype.finally = function (callback = '') {
  let P = this.constructor
  return this.then(
    (value) => P.resolve(callback()).then(() => value),
    (reason) =>
      P.resolve(callback()).then(() => {
        throw reason
      })
  )
}
```

从代码总我们可以看到 `finally` 方法执行后返回的是 `this.then`，说明它只是 `then` 链式调用中比较特殊的一环。我们可以看到它内部有两个函数参数，跟普通的 `then` 一样，分别用来处理两个 `resolved` 和 `rejected` 两种情况。其实 `then` 我们可以理解为接受上一个 `Promise` 传递的参数，以及向下一个 `Promise` 传递参数。

`then` 中的函数处理方式一样，就是执行 `callback`，然后用 `callback` 的返回值用 `Promise.resolve()` 生成一个 `Promise`。这里处理 `callback` 的时候我们没有传入任何参数，因为不知道执行 `finally` 的时候 `Promise` 的状态是什么，最后返回的也是上一个 `Promise` 的 `value` 或 `抛出` 上一个 `Promise` 的 `reason`。所以整个 `finally` 的逻辑就是执行 `callback`，返回上一次 `Promise` 的状态和结果。

这个例子是如果`callback` 的结果不重要，为什么要使用 `Promise.resolve`？这个问题我的思考，如果只考虑执行 `callback`，然后返回上一次 `Promise` 的状态和结果，那么我们完全可以写成下面这样：

```javascript
Promise.prototype.finally1 = function (callback = '') {
  return this.then(
    (value) => {
      callback()
      return value
    },
    (reason) => {
      callback()
      throw reason
    }
  )
}
```

之所以要将 `callback` 的结果进行包装就是为了处理 `callback` 中可能是异步操作，返回一个 `Promise`，我们需要等到异步操作完成。所以在 `Promise` 的步骤中处处皆可异步，需要注意它的思想以及实现原理。

上面的例子是阮一峰老师的《ES6 标准入门》中的，我给 `callback` 添加了一个默认值，否则如果我们没有传入`callback` 的话，会直接将 `callback is not a function` 的错误抛出来。

## Promise.allSettled()

`Promise.allSettled()` 方法返回一个在所有给定的 `promise` 都已经 `fulfilled` 或 `rejected` 后的 `promise`，并带有一个对象数组，每个对象表示对应的 `promise` 结果。跟 `Promise.all()` 相比，它更适合一些互相不依赖的异步任务，你想在它们都完成的时候执行某个操作。而 `Promise.all()` 则比较适合相互之间有依赖关系的异步任务。

```javascript
const promise1 = Promise.resolve(3)
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'))
const promises = [promise1, promise2]

Promise.allSettled(promises).then((results) =>
  results.forEach((result) => console.log(result.status))
)

// expected output:
// "fulfilled"
// "rejected"
```

## Promise.done()

`Promise.done()` 在 `ES6 Promise` 和 `Promise/A+` 标准中都没有，这是第三方的 `Promise` 实现的一个功能，主要是为了应对 `Promise` 回调链的最后一个方法的抛错无法捕捉的问题。

```javascript
Promise.prototype.done = function (onResolved, onRejected) {
  this.then(onResolved, onRejected).catch(function (err) {
    setTimeout(() => {
      throw err
    }, 0) //抛出一个全局错误
  })
}
var p = () => new Promise((resolve, reject) => resolve('success'))
p()
  .then((data) => {
    console.log(data)
    x + 1
  })
  .catch((err) => {
    console.log(err.message)
    throw 'cllzo'
  })
  .then((data) => console.log(data))
  .done()

//success
//x is not defined
///Users/clloz/Code/testing/reverse.js:4
//            throw err;
//            ^
//ReferenceError: y is not defined
//    at /Users/clloz/Code/testing/reverse.js:16:9
```

使用时直接使用 `.done()` 就可以了，因为他的作用只是抛错，如果有其他逻辑不应该写在这里。如果你在 `done()` 中添加了第二个参数，会导致内部的 `catch` 不工作。

## 应用

## 图片加载

我们可以将图片的加载写成一个 `Promise` ，一旦加载完成， `Promise` 的状态就发生变化。

```javascript
const preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    var image = new Image()
    image.onload = resolve
    image.onerror = reject
    image.src = path
  })
}
```

## 合并多个请求

当我们需要多个请求都返回之后才能进行处理，我们可以用 `Promise.all()` 合并这些请求。

```javascript
//1.获取轮播数据列表
function getBannerList() {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve('轮播数据')
    }, 300)
  })
}

//2.获取店铺列表
function getStoreList() {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve('店铺数据')
    }, 500)
  })
}

//3.获取分类列表
function getCategoryList() {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve('分类数据')
    }, 700)
  })
}

function initLoad() {
  // loading.show() //加载loading
  Promise.all([getBannerList(), getStoreList(), getCategoryList()])
    .then((res) => {
      console.log(res)
      // loading.hide() //关闭loading
    })
    .catch((err) => {
      console.log(err)
      // loading.hide()//关闭loading
    })
}
//数据初始化
initLoad()
```

如果每个请求的结果不确定，那么我们可以使用 `Promise.allSettled()`:

```javascript
//1.获取轮播图数据列表
function getBannerList() {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      // resolve('轮播图数据')
      reject('获取轮播图数据失败啦')
    }, 300)
  })
}

//2.获取店铺列表
function getStoreList() {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve('店铺数据')
    }, 500)
  })
}

//3.获取分类列表
function getCategoryList() {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve('分类数据')
    }, 700)
  })
}

function initLoaded() {
  Promise.allSettled([getBannerList(), getStoreList(), getCategoryList()]).then((val) => {
    console.log(val)
  })
}
initLoaded()
// [
//     { status: 'rejected', reason: '获取轮播图数据失败啦' },
//     { status: 'fulfilled', value: '店铺数据' },
//     { status: 'fulfilled', value: '分类数据' },
// ];
```

## 链式调用执行顺序

我们都知道 `Promise` 的 `then`，`catch`，`finally` 是微任务，会在同步任务执行外之后执行。但是如果有不同的 `Promise` 的 `then` 链式调用，还有嵌套的 `Promise`，它们的执行顺序如何呢？要搞清楚这个问题一个要把事件循环搞清楚，另一个就是把 `Promise` 的实现搞清楚。

首先一点我们要区分哪些大妈是同步的，哪些代码使异步的。在 `new Promise` 中的代码都是同步执行，同时 `.then` 本身也是同步执行的，它内部的回调函数是异步执行的。而 `Event Loop` 机制是，执行栈中的同步代码执行过程中遇到异步代码，交给异步处理线程进行注册，当异步事件完成的时候放入任务队列，这里我们主要讨论的是 `Promise`，所以都是微任务。

再来说一说 `then` 的内部实现，`then` 的内部的原理并不复杂。首先是创建一个 `Promise` 实例，传给 `new Promise` 的函数逻辑是看 `this` 的状态（也就是调用 `then` 的 `Promise`）。如果这个状态是 `resolve` 或者 `reject`，那么就调用对应的函数参数执行得到返回值（这里如果函数没定义，则直接返回上一个 `Promise` 的结果），当然这里要处理返回值是一个 `Promise` 的情况（如果返回值是 `Promise` 其实也是调用这个 `Promise` 的 `then` 得到结果在执行 `resolve` 或者 `reject` ）。如果 `this` 的状态是 `pending`，就会把回调函数放到一个队列，`this` 的状态改变的时候再执行回调函数。上面的情况处理完毕以后，新的 `Promise` 创建完成，返回这个新的 `Promise` 实例。

`.then` 的目的就是获得新的 `Promise` 的状态和返回值，我们上面说的执行回调函数都会被推到一个微任务中执行（有些浏览器端的 `Promise` 实现使用 `setTimout` 宏任务来模拟的，因为没有提供像 `Node` 中的 `Process.nextTick` 一样的 `API`）。

综合上面的结论我们可以这么理解：当同步代码执行到 `then` 的时候，回调函数会被异步处理线程注册，如果调用 `then` 的 `Promise` 状态已经改变，则回调函数会被放入微任务队列，在本轮的世界循环结束之前执行；如果调用 `then` 的 `Promise` 的状态还是 `pending`，那么回调函数会放到一个微任务中，这个微任务作为一个元素（不会执行）被加入发布订阅模式的队列中，当 `Promise` 状态改变时，通知任务队列，将对应的回调函数推入微任务队列。中间任何一环遇到嵌套的 `Promise`，就当做多一层 `then` 来处理。

我们来看两个例子：

```javascript
var p2 = new Promise((resolve, reject) => {
  resolve('p2 resolve')
})
var p3 = new Promise((resolve, reject) => {
  resolve('p3 resolve')
})
var p1 = new Promise((resolve, reject) => {
  resolve(p3)
})

p2.then((v) => console.log(v))
  .then(() => console.log(1))
  .then(() => console.log(2))
  .then(() => console.log(3))
  .then(() => console.log(4))
p1.then((v) => console.log('new' + v))
  .then(() => console.log('new' + 1))
  .then(() => console.log('new' + 2))
  .then(() => console.log('new' + 3))
  .then(() => console.log('new' + 4))

// p2 resolve
// 1
// newp3 resolve
// 2
// new1
// 3
// new2
// 4
// new3
// new4
```

在执行到 `p1` 的实例化的时候，里面有一个 `resolve(p3)`，当 `resolve` 的参数是另一个 `Promise` 的时候，它会用参数 `Promise` 的状态和结果作为自己的状态和结果。此时 `p3` 的状态和结果都已经确定了。所以执行到第一个 `then` 之前，`p1`，`p2` 和 `p3` 的状态都是 `resolve`，返回值也确定了。

下面开始执行 `then`，注意 `then` 的执行时同步，所以在执行完最后一个 `then` 之前我们不会执行微任务。`p2` 和 `p2` 分别有 `5` 个 `then`，我们来仔细分析一下。

执行第一个 `p2.then`，回调函数被异步线程注册，此时 `p2` 的状态和结果都确定了，那么回调函数被直接推入微任务队列。此时的微任务队列是 `[p2.then]`。

执行第二个 `then`，回调函数被异步线程注册，此时 `p2.then` 的状态还是 `pending`，所以它被包裹成一个待执行的微任务函数（执行以后才是微任务）放入事件队列中等待 `p2.then` 的状态变化。此时微任务队列是 `[p2.then]`。

`p2` 的后面几个 `then` 一样，调用他们的 `Promise` 状态都不确定，他们被放入事件队列等待调用它们的 `Promise` 的状态改变。

`p1` 的逻辑要和 `p2` 不同，因为 `p1` 的 `resolve` 中的参数是一个 `Promise`。在链式调用中，任何一部出现一个 `Promise`，我们都相当于多加一层 `then`。比如下面的代码：

```javascript
let p1 = new Promise((resolve, reject) => {
  resolve('p1')
})

let p2 = new Promise((resolve, reject) => {
  resolve(p1)
})

//执行 then
p2.then((value) => {
  console.log(value) //
})
```

我们可以像如下这样理解：

```javascript
p2.then((value) => {
  //这个 then 返回的状态是 p1 的状态，返回的结果是 p1 的结果，当然需要等待p1状态改变才能输出这些内容。
  return p1.result
}).then((value) => {
  console.log(value)
})
```

就是说在如果有一个 `then` 的回调函数中出现 `Promise` 你可以把这个 `Promise` 想象成一个 `then` 插入到原来的 `Promise` 和 `then` 中间。下一个 `then` 接受的就是这个插入的 `then` 的状态和结果。

所以 `p1` 的第一个 `then` 就是 `p3` 的状态，并将 `p3` 的结果传给下一个 `then` 的回调函数。后面的逻辑就和 `p2` 相同了，只是这第一层不一样。

所以当我们执行完所有的同步代码之后，微任务队列中有 `[p2.then, p3]`，执行他们之后，输出 `p2 resolve`，`p3` 是一个隐藏的过程，没有输出。当 `p2.then` 执行完成之后，对应的 `Promise` 的 `resolve` 就执行成功了，会通知发布订阅中心，执行 将 `p2.then.then` 放入微任务队列。同理 `p3` 对应的 `then` 执行完成之后，也会将 `p1.then` 放入微任务队列。所以微任务队列会依次插入 `p2` 和 `p1` 之后的 `then`，我们就得到最后的输出。

---

再来看一个网络上常出现的例子：

```javascript
new Promise((resolve, reject) => {
  console.log('外部promise')
  resolve()
})
  .then(() => {
    console.log('外部第一个then')
    new Promise((resolve, reject) => {
      console.log('内部promise')
      resolve()
    })
      .then(() => {
        console.log('内部第一个then')
      })
      .then(() => {
        console.log('内部第二个then')
      })
      .then(() => {
        console.log('内部第3个then')
      })
  })
  .then(() => {
    console.log('外部第二个then')
  })
  .then(() => {
    console.log('外部第3个then')
  })

// 外部promise
// 外部第一个then
// 内部promise
// 内部第一个then
// 外部第二个then
// 内部第二个then
// 外部第3个then
// 内部第3个then
```

执行完 `new Promise` 之后直接输出 `外部 Promise`，然后这个新的 `Promise` 的状态变为 `fulfilled`，没有返回任何值。由于 `new Promise` 的状态确定，所以第一个 `外部then` 的回调函数直接放入微任务队列。然后第二个和第三个外部 `then` 的回调函数只是被包装成一个微任务方法放进发布订阅中心的队列（再次强调，这个微任务方法此时都还没有执行，只是进入发布订阅中心的队列）。到此同步任务执行完成。

下面开始执行微任务，此时微任务队列中只有一个方法就是第一个外部 `then` 的回调函数。执行 第一个外部 `then` 回调函数，先输出 `外部第一个 then`，然后新建了一个 `Promise`，执行里面的同步代码，输出 `内部promise`。由于内部 `Promise` 同步之后直接 `resolve`，那么 `内部 promise` 的第一个 `then` 直接放入微任务队列，后面的三个内部 `then` 同样放入发布订阅的队列中等待对应的 `Promise` 状态改变。到此处，同步任务执行完成，由于没有任何返回值，也没有抛错，外部第一个 `then` 相当于 `resolve` 了，所以外部第二个 `then` 也被放入微任务队列。

下面开始执行微任务队列，此时微任务队列有`[内部第一个then, 外部第二个then]`，限制性内部第一个 `then`，打印 `内部第一个then`，然后内部第二个 `then` 进入微任务队列。然后执行外部第二个 `then`，打印 `外部第二个then`，同时外部第三个 `then` 进入微任务队列。接执行内部第二个 `then`，打印，然后将内部第三个 `then` 放入微任务队列。接着执行外部第三个 `then` 和 内部第三个 `then`。

这里还可以思考一个问题，如果外部第一个 `then` 的 `new Promise` 是 `return` 的，结果会如何呢？结果应该如下：

```javascript
//外部promise
// 外部第一个then
// 内部promise
// 内部第一个then
// 内部第二个then
// 内部第3个then
// 外部第二个then
// 外部第3个then
```

你也可以找更多关于执行顺序的题目来监测一下自己是不是已经掌握 `Promise` 原理了。

## 红绿灯问题

实现红灯 `3s`，绿灯 `2s`，黄灯 `1s` 的循环。

在没有 `Promise` 之前，我们可以使用 `setTimeout` 和递归来实现：

```javascript
function lightloop() {
  setTimeout(() => {
    console.log('red')
    setTimeout(() => {
      console.log('green')
      setTimeout(() => {
        console.log('yellow')
        lightloop()
      }, 1000)
    }, 2000)
  }, 3000)
}
lightloop()
```

如果嵌套层数多了就会出现回调地狱，有了 `Promise` 之后我们可以利用 `Promise` 实现。

```javascript
function red() {
  console.log('red')
}
function green() {
  console.log('green')
}
function yellow() {
  console.log('yellow')
}

var light = function (timmer, cb) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      cb()
      resolve()
    }, timmer)
  })
}

var step = function () {
  Promise.resolve()
    .then(function () {
      return light(3000, red)
    })
    .then(function () {
      return light(2000, green)
    })
    .then(function () {
      return light(1000, yellow)
    })
    .then(function () {
      step()
    })
}

step()
```

## 内存泄漏

使用 `Promise` 要注意内存泄漏 `memory leak` 问题。在 `Promise` 中我们传给 `resolve` 的参数可以是一个 `Promise`，如果我们传的是自身这个 `Promise`，那么就递归调用自身，`Promise` 会无限嵌套下去，会造成内存泄漏。

```javascript
;(function () {
  function printMemory(i) {
    console.log(i)
    console.log(process.memoryUsage())
  }

  // 记录 Promise 链的长度
  var i = 0
  function run() {
    return new Promise(function (resolve) {
      // 每增加 10000 个 Promise 打印一次内存使用情况
      if (i % 1000 === 0) {
        global.gc()
        printMemory(i)
      }
      i++
      // 模拟一个异步操作
      setTimeout(function () {
        // 1000 个 Promise 之后退出
        if (i === 10000 * 10) return resolve()
        // 如果 resolve 的参数是一个 Promise ，外层 Promise 将接管这个 Promise 的状态，构成嵌套 Promise
        resolve(run())
      }, 0)
    }).then(function () {
      // console.log(j);
      return true
    })
  }
  run().then(function (r) {
    global.gc()
    console.log(111)
    printMemory()
  })
})()
```

上面这段代码就是一个例子，由于用到了 `global.gc()` 方法所以我们的 `node` 要带上参数 `node --expose-gc` 来执行。在打印的 `memoryUsage` 信息中我们可以看到 `heapUsed` 会不断攀高，说明内存泄漏了。

## 参考文章

1. [面试官：“你能手写一个 Promise 吗”](https://juejin.im/post/6850037281206566919)
2. [ES6 标准入门](https://es6.ruanyifeng.com/#docs/promise)
3. [ES6 系列之我们来聊聊 Promise](https://github.com/mqyqingfeng/Blog/issues/98)
4. [Promise V8 源码分析(一)](https://zhuanlan.zhihu.com/p/264944183)
5. [JS异步之Promise,Generator,Async](https://segmentfault.com/a/1190000010914001)
6. [ES6-Promise 源码阅读](https://juejin.im/post/6844903684904583181)
7. [30分钟，让你彻底明白Promise原理](https://mengera88.github.io/2017/05/18/Promise%E5%8E%9F%E7%90%86%E8%A7%A3%E6%9E%90/)
8. [前端 Promise 常见的应用场景](https://juejin.im/post/6844904131702833159#heading-1 '前端 Promise 常见的应用场景')
9. [Promise 链式调用引发的思考](https://juejin.im/post/6844903972008886279 'Promise 链式调用引发的思考')
10. [Promise 内存泄漏问题](https://github.com/wangning0/Autumn_Ning_Blog/issues/44 'Promise 内存泄漏问题')
