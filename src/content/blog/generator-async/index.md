---
title: '生成器 Generator 的异步应用'
publishDate: '2020-11-01 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

生成器有一个问题就是需要我们手动调用 `next` 来执行，这就表示我们需要单独写一段代码来管理生成器的执行与暂停，这是比较麻烦的。如何让我们写的生成器能够自动执行，本文就来讨论实现方法。

> 如果你对生成器 `Generator` 还不了解，请先看另一篇详细介绍生成器的文章 [ES6 生成器 Generator](https://www.clloz.com/programming/front-end/js/2020/10/31/es6-generator/ 'ES6 生成器 Generator')

## 生成器的关键

生成器之所以能够比 `Promise` 更好的封装异步任务，首先是它可以利用 `yield` 和 `next` 来暂停和回复函数的执行。但是还有两个重要的特性让它能够更好的完成这个任务，那就是 `yield` 和 `next` 能够实现函数体内外的数据交换，以及函数体内外能够互相进行错误捕获。

封装异步任务的一个关键就是，当函数暂停执行之后，我们如何知道异步任务完成了，然后调用 `next` 执行下一步？对于异步任务，只有通过回调函数才能知道任务是否完成。所以要封装异步任务，我们就要保证回调函数是在生成器外部执行的，我们可以在回调函数中执行 `next`。所以我们要封装异步任务最主要的一个任务就是让回调函数在生成器外声明和执行。这就是核心思想。

## Thunk 函数

我们先来看看一般异步任务的形式，比如异步读取文件 `fs.readFile(fileName, callback);`，我们执行这个函数后悔立即根据第一个文件名参数读取文件，读取成功后执行 `callback`，根据 `API` 的不同，`callback` 会被传入相应的参数。如果我们直接把这么一个函数放到生成器的 `yield` 后面我们是无法处理的。因为我们肯定是希望 `callback` 执行以后再执行下一步，但是这样的调用方式，我们不可能知道 `callback` 何时执行，此时我们在生成器外部实际已经丢失了对异步任务的控制。

```javascript
var gen = function* () {
  yield readFile('/etc/filea')
}

let g = gen()
let filea = g.next() //此时我们实际已经丢失了异步任务的控制
```

所以我们要对异步任务进行封装。封装的目标是什么？我们希望在生成器内部传入文件名，在生成器外部传入 `callback`。形式如下：

```javascript
var gen = function* () {
  yield readFileThunk('/etc/filea')
}

let g = gen()
let filea = g.next()
filea.value(function (err, data) {
  //your code
  g.next(data)
})
```

其实我们可以看出，内部的封装函数执行只不过是传入了一个参数，真正的查询文件操作并没有执行，只是返回了一个带参数的函数而已，真正的执行还是在外部我们传入了 `callback` 之后，所以我们能够在 `callback` 中将控制权传回生成器内。这就是 `Thunk` 的目标，逻辑也非常简单。

一个 `Thunk` 函数我们大概要封装三层，第一层传入那个待执行的异步函数，然后传入参数，最后在生成器外部传入 `callback`。封装的实现我们可以参考 `tj` 实现的 [thunkify](https://github.com/tj/node-thunkify 'thunkify')。

```javascript
function thunkify(fn) {
  return function () {
    var args = new Array(arguments.length)
    var ctx = this
    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i]
    }
    return function (done) {
      var called
      args.push(function () {
        if (called) return
        called = true
        done.apply(null, arguments)
      })
      try {
        fn.apply(ctx, args)
      } catch (err) {
        done(err)
      }
    }
  }
}
```

我们可以看到整个代码非常短，内部有两个 `return`，连上最外层的函数调用，一共三层，分别传入异步函数，参数，和回调函数。

简要分析一下流程，传入异步函数（比如 `fs.readFile`）执行 `thunkify` 会返回一个函数。返回的函数是一个中间层，供我们传入参数，比如 `fs.readFile` 的文件名，这个函数也就是我们写在 `yield` 后面的函数。实际这一层的主要操作就是对 `arguments` 的操作，它将我们传入的参数保存到了一个数组中，同时保存了 `this`。

这个函数执行后返回一个函数，也就是被保存在 `yield` 返回的对象的 `value` 属性中。于是在生成器外，我们可以获得这个函数，然后就可以传入回调函数执行了。最后返回的这个函数内部主要的处理就是把新传入的回调函数放到刚刚保存的参数的数组的最后，然后用保存的 `this` 和这个参数数组执行异步函数 `fn`。这里它赌回调函数进行了一个封装，就是确保回调函数值执行一次。

有了这个 `thunkify` 函数对异步函数进行封装以后我们就可以向如下使用 `Generator` 封装异步任务了：

```javascript
var fs = require('fs')
var thunkify = require('thunkify')
var readFileThunk = thunkify(fs.readFile)
var gen = function* () {
  var r1 = yield readFileThunk('/etc/fstab')
  console.log(r1.toString())
  var r2 = yield readFileThunk('/etc/shells')
  console.log(r2.toString())
}

var g = gen()
var r1 = g.next()
r1.value(function (err, data) {
  if (err) throw err
  var r2 = g.next(data)
  r2.value(function (err, data) {
    if (err) throw err
    g.next(data)
  })
})
```

不过仔细看这个代码，好像比我们直接执行 `fs.readFile()` 复杂多了，而且最后的执行还是个回调嵌套，既不方便，也不优雅，兜了个大圈子还是跟原来一样。但其实我们仔细想一想，这里的回调函数不用像我们平时的嵌套回调一样，把所有的逻辑都写上，我们要做的就两件事，用 `next` 将回调结果传递到生成器内（数据处理的逻辑完全可以放到生成器内），同时将执行权交给生成器，当生成器返回一个新的异步任务后我们再重复这个步骤。也就是说每个回调的逻辑都是相同的。

既然每个回调的逻辑都相同，我们完全可以用递归来实现。比如实现如下这个 `run` 函数。

```javascript
function run(fn) {
  var gen = fn()
  function next(err, data) {
    var result = gen.next(data)
    if (result.done) return
    result.value(next)
  }
  next()
}
run(gen)
```

这个 `run` 函数就能实现生成器的自动执行。`run` 的参数 `fn` 就是生成器函数，内部的逻辑就是用一个 `next` 函数进行递归。在 `next` 函数中，我们调用生成器的 `next` 的方法恢复生成器执行，同时传入上次异步的结果 `data`。当生成器返回的时候，我们对返回的对象进行分析，如果 `done` 是 `true` 就直接 `return`。如果 `done` 为 `false` 就将 `next` 作为回调函数执行返回对象的 `value`。

所以这里的 `next` 函数就是我们上面说的，每个回调的逻辑都相同。它只做了两件事，传入 `data` 执行生成器的 `next`，将执行权交给生成器，在生成器返回新的函数后重复上述步骤，一直到所有异步任务完成，从而实现自动执行。当然这样的自动执行器有一个前提就是，每一个 `yield` 后面都是用 `thunkify` 封装好的 `Thunk` 函数。

现在我们的异步任务的写法已经和同步任务完全一样了，比如我们要异步读取 `n` 个文件。

```javascript
var g = function* () {
  var f1 = yield readFileThunk('fileA')
  var f2 = yield readFileThunk('fileB')
  // ...
  var fn = yield readFileThunk('fileN')
}
run(g)
```

代码逻辑非常清晰，看上去就和同步代码一样。

其实总结一下，要让生成器自动执行最重要的一点就是我们要在异步任务完成之后将执行权还给生成器，同时把异步任务的结果传递到生成器中。

## co 源码解读

其实包装 `Thunk` 函数还是有一点麻烦的，有没有其他更好的方法呢？当然可以，除了利用回调函数（`thunkify` 本身就是利用回调函数，在回调函数中将执行权交给生成器并且传递异步操作的记过），另一种就是 `Promise`。

`Promise` 的详细介绍请看我的另一篇文章 [深入 Promise](https://www.clloz.com/programming/front-end/js/2020/10/28/deep-into-promise/ '深入 Promise')，`Promise` 本身就是对回调函数形式的异步任务的一种封装，它让嵌套的异步操作不再是回调地狱，而是以一种接近于同步的形式来编写。所以可以使用回调函数自然能够使用 `Promise` 来实现。而且 `Promise` 比回调函数更好的是，我们可以直接在生成器内部执行异步任务，只要返回 `Promise` 对象即可，因为 `Promise` 对象会保存异步任务的状态和结果，我们随时可以取到，而不是像回调函数一样，你错过了就无法再获得这个回调的结果。

这里我们主要通过研究 `co` 模块的源码来理解其中的实现细节。`co` 模块是著名程序员 `TJ Holowaychuk` 在 `2013` 年编写的一个用于 `Generator` 自动执行的小工具。最初 `co` 是同时支持 `Thunk` 函数和 `Promise` 的，`4.0` 之后只支持 `Promise`了，我们这里主要从源码的角度看看它是如何基于 `Promise` 实现生成器的自动执行的。

先看下面这个例子：

```javascript
const co = require('./co')
const fs = require('fs')
var gen = function* () {
  var f1 = yield readFile('/Users/clloz/code/testing/.eslintrc.js')
  var f2 = yield readFile('/Users/clloz/code/testing/package.json')
  console.log(f1.toString()) //正常输出
  console.log(f2.toString()) //正常输出
}
co(gen).then(function () {
  console.log('Generator 函数执行完成')
})

function readFile(filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, function (err, data) {
      resolve()
    })
  })
}
//Generator 函数执行完成
```

我们可以看到，我们直接用 `co` 调用生成器函数，就直接自动执行了， 最后返回了一个 `Promise` 对象。我们也可以模仿上面的 `run` 写一个自动执行的函数。

```javascript
function run(gen) {
  var g = gen()
  function next(data) {
    var result = g.next(data)
    if (result.done) return result.value
    result.value.then(function (data) {
      next(data)
    })
  }
  next()
}
run(gen)
```

`co` 其实就是对这个 `run` 的扩展，我们可以看一看 [源码](https://github.com/tj/co/blob/master/index.js '源码')，源码去掉注释一共不到 `130` 行。其中大部分都是一些判断和转 `Promise` 代码，`co` 函数大概就 `40` 行。

`co` 函数内的结构是获取除了生成器函数以后的参数，然后返回一个 `Promise`，主要的逻辑都在 `Promise` 中完成。

```javascript
function co(gen) {
  var ctx = this
  var args = slice.call(arguments, 1)

  return new Promise(function (resolve, reject) {})
}
```

在返回的 `Promise` 中，首先是判断传入的参数是不是一个 `Generator` 函数。它的逻辑是，如果第一个参数是一个函数，先用保存的参数执行这个传入的函数，并保存执行结果。然后判断这个执行结果有没有 `next` 方法，如果没有直接 `resolve` 执行结果。如果有 `next` 的方法，那么我们已经获得了生成器，就是 `gen`。

```javascript
if (typeof gen === 'function') gen = gen.apply(ctx, args)
if (!gen || typeof gen.next !== 'function') return resolve(gen)
```

> 注意这里 `resolve` 前面加了 `return`，表示后面的代码都不会执行了.这是一个小技巧，`Promise` 默认会执行到 `return` 或者到函数结束（如果没有 `return`），如果我们不想执行 `resolve` 或者 `reject` 之后的代码可以在他们之前加上 `return`。

接下来是一个 `onFulfilled` 函数，这个函数内部用 `try ... catch` 来执行 `gen.next(res)`，目的就是为了捕获错误，生成器内部的错误也能捕获（如果生成器内部没有定义 `catch`，错误会抛到外面），如果抛错就直接 `reject(e)`。当生成器抛出的错误被外部的 `catch` 捕获，生成器就不会在执行了，其返回的对象的 `done` 会变成 `true`，相当于生成器执行完毕了，这个我在 [ES6 生成器 Generator](https://www.clloz.com/programming/front-end/js/2020/10/31/es6-generator/ 'ES6 生成器 Generator') 有详细说明。这里在执行 `gen.next` 的时候像生成器内部传入了数据 `res`。

```javascript
function onFulfilled(res) {
  var ret
  try {
    ret = gen.next(res)
  } catch (e) {
    return reject(e)
  }
  next(ret)
  return null
}
```

用 `try ... catch` 执行完 `gen.next` 之后是用 `yield` 返回的结果作为参数执行了一个 `next` 函数。

```javascript
function next(ret) {
  if (ret.done) return resolve(ret.value)
  var value = toPromise.call(ctx, ret.value)
  if (value && isPromise(value)) return value.then(onFulfilled, onRejected)
  return onRejected(
    new TypeError(
      'You may only yield a function, promise, generator, array, or object, ' +
        'but the following object was passed: "' +
        String(ret.value) +
        '"'
    )
  )
}
```

`next` 函数的 `ret` 就是 `yield` 返回的结果。`next` 方法主要做了以下几件事：

1. 判断返回对象的 `done` 是不是 `true`，如果是 `true` 直接 `resolve` 返回对象的 `value`。
2. 如果返回对象的 `done` 不是 `true`，也就是生成器还没有执行完，就将返回对象的 `value` 包装成一个 `Promise`。
3. 如果 `value` 成功包装成一个 `Promise`，那么就执行 `value.then(onFulfilled, onRejected)`。这里就相当于递归调用 `onFulfilled` 方法，实现自动执行。
4. 如果包装 `Promise` 失败，则用 `onRejected` 方法进行抛错。

我们可以看到，`co` 的做法就是在我们上面实现的 `run` 函数外面多加了一层，目的就是为了实现错误的抛出和捕获。这里我们也可以看出 `Promise` 相比于回调函数的优势，我们不需要思考回调函数什么时候触发，直接丢进 `Promise` 就可以了。`Promise` 会帮我们保存回调函数的状态和结果，我们用 `then` 来获取异步任务的状态和结果。

这里顺便说一下 `onRejected` 函数：

```javascript
function onRejected(err) {
  var ret
  try {
    ret = gen.throw(err)
  } catch (e) {
    return reject(e)
  }
  next(ret)
}
```

它其实是用 `gen.throw` 进行抛错，这个方法我们也在 [ES6 生成器 Generator](https://www.clloz.com/programming/front-end/js/2020/10/31/es6-generator/ 'ES6 生成器 Generator') 进行了详细说明。简单的来说就是错误如果被生成器内部 `catch` 了，那么生成器还能继续执行，生成器会执行到下一个 `yield` 然后暂停。如果是被外部的 `catch` 捕获了，那么生成器就执行结束了。

这就是 `co` 的主要执行逻辑，当然后面还有一些判断和转换 `Promise` 的方法，这里我们说一说比较重要的并发实现。

对象转 `Promise` 方法 `objectToPromise(obj)`。

```javascript
function objectToPromise(obj) {
  var results = new obj.constructor()
  var keys = Object.keys(obj)
  var promises = []
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var promise = toPromise.call(this, obj[key])
    if (promise && isPromise(promise)) defer(promise, key)
    else results[key] = obj[key]
  }
  return Promise.all(promises).then(function () {
    return results
  })

  function defer(promise, key) {
    // predefine the key in the result
    results[key] = undefined
    promises.push(
      promise.then(function (res) {
        results[key] = res
      })
    )
  }
}
```

它的处理逻辑是，把每一个键值包装成一个 `Promise`，这个 `Promise` 的 `then` 就是将 `Promise` 执行成功的结果放入一个新的对象中（这个对象是用传入对象的构造函数构造的一个空对象）。然后把这么多 `Promise.then` 放入一个数组然后执行 `Promise.all()`。

这么做的目的是啥呢？就是为了实现并发操作，有时候我们的异步不一定是一个等一个，可能有些任务可以同步执行，这些同步执行的任务如果一个等一个就太浪费时间了，`co` 就是通过上面对象的这种处理实现并发的。传入的 `obj` 的每一个键值都是一个异步任务，我们创建一个和这个 `obj` 同构造函数的空对象 `result`，然后把每个键值都包装成一个 `Promise`，只有这个 `Promise` 完成 `resolve(res)` 之后，我们才将 `Promise` 的结果 `res` 保存到 `result` 对象中，键名还是和 `obj` 的键名一样。将所有的键值都这么包装完成后，用 `Promise.all` 执行这个 `Promise` 数组，就实现了并发。

数组也是同样的逻辑，用 `Promise.all` 实现并发。
