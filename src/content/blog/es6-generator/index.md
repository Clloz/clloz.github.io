---
title: 'ES6 生成器 Generator'
publishDate: '2020-08-18 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

上一篇文章讲了迭代器 `Iterator`，这篇文章讲一讲和 `Iterator` 息息相关，但是更复杂的生成器 `Generator`。

## 概念

要创建一个生成器，就要调用一个生成器函数。生成器函数的创建方法就是在 `function` 后面加上一个 `*`。和普通的函数不同的是，调用生成器函数不会立即执行函数，而是返回一个 `Generator` 对象，这个对象就是一个迭代器。而执行生成器对象的方式就是调用对象的 `next` 方法，每次调用 `next` 方法，函数就会执行，直到遇到 `yield` 关键字。换句话说，生成器函数可以分段执行，每次执行都要调用 `next` 方法，遇到 `yield` 就会暂停执行。`yield` 可以被认为是一个基于生成器的版本的 `return` 关键字。

> 生成器函数的构造器 `GeneratorFunction` 也是一个 `JavaScript` 标准内置对象，但是我们无法直接访问它，因为它不是一个全局对象。，我们可以通过 `Object.getPrototypeOf(function*(){}).constructor` 得到它。在获取它之后我们也可以用它作为一个构造函数创建新的生成器函数对象，`new GeneratorFunction ([arg1[, arg2[, ...argN]],] functionBody)`。

每次执行到 `yield` 暂停执行的时候，会返回一个对象，包含两个属性 `value` 和 `done`（生成器也是一个迭代器），其中 `value` 就是 `yield` 右边表达式的值，如果 `yield` 右边没有表达式，则返回 `undefined`。`done` 则表示生成器是否迭代结束，也可以理解为函数是否执行结束。如果函数有 `return`，也可以理解为一个 `yield`，它的 `value` 就是 `return` 后面的表达式的值，`done` 为 `true`。如果函数没有 `return`，则最后一次迭代就是执行到函数结束，`value` 返回 `undefined`，`done` 为 `true`。和迭代器一样，迭代完毕之后无论再调用多少次 `next`，返回值都不会发生变化了。

`yield` 方法后面的表达式，只有当调用 `next` 执行到该 `yield` 的时候才会进行求值，也就是惰性求值。生成器函数中如果没有 `yield` 就只是一个暂缓执行函数，当调用生成器的 `next` 的时候，才会执行函数。`yield` 表达式只能用在生成器函数中，用在其他地方会报错，特别要注意当函数作为参数时的情况，作为参数的函数只是一个普通函数，即使这个函数在一个生成器函数中。

`yield` 表达式如果用在另一个表达式之中，必须放在圆括号里面。用作函数参数或放在赋值表达式的右边，可以不加括号。

```javascript
function* demo() {
    console.log('Hello' + yield); // SyntaxError
    console.log('Hello' + yield 123); // SyntaxError
    console.log('Hello' + (yield)); // OK
    console.log('Hello' + (yield 123)); // OK
}
```

生成器的基本概念就是这些，它用迭代器将函数的执行进行分段，用 `yield` 和 `next` 来控制函数的状态。主要的目的就是让我们能够更合理定制函数的执行。

下面我们详细介绍生成器的行为已经如何进行应用。

## Generator 对象

`Generator` 对象也是 `JavaScript` 的一个内置对象，它由生成器函数 `generator function` 执行后生成，我们不能像其他内置对象一样，直接访问到 `Generator` ，它是一个生成器对象，同时也是一个符合可迭代协议和迭代协议的迭代器（可以参考 [ES6 迭代器 Iterator](https://www.clloz.com/programming/front-end/js/2020/10/31/es6-iterator/ 'ES6 迭代器 Iterator')）。注意的是生成器函数不是构造函数，所以不能进行 `new` 调用。

```javascript
let gen = function* () {}
let g = gen()
console.log(g[Symbol.iterator]() === g) //true
console.log(typeof g.next) //function
```

## Generator.prototype.next()

我们上面已经介绍了 `next` 的使用方式了，和迭代器相同。但是 `next` 方法还有一个特点是可以向生成器传值，方法就是在调用 `next` 方法的时候传入参数。

`next` 方法能够传值主要是因为 `yield` 方法是没有返回值的（也可以说返回值为 `undefined`，`undefined` 在和数字运算的时候会转为 `NaN`，和字符串运算则转为 `'undefined'`）。`yield` 中断函数执行后，用 `next` 继续执行函数时，我们很可能需要将一个值传递过去，继续下一段执行（如果不是这样，中断的意义就不大了）。所以 `yield` 是在中断时向生成器外传值，`next` 是在继续时向生成器内传值。这个功能有很重要的语法意义。`Generator` 函数从暂停状态到恢复运行，它的上下 文状态(`context`)是不变的。通过 `next` 方法的参数，就有办法在 `Generator` 函 数开始运行之后，继续向函数体内部注入值。也就是说，可以在 `Generator` 函数运 行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。可以看一下下面这个例子：

```javascript
function* f() {
  for (var i = 0; true; i++) {
    var reset = yield i
    if (reset) {
      i = -1
    }
  }
}
var g = f()
g.next()
g.next()
g.next(true)
```

这个生成器可以随着 `i` 无限执行。但是让我们用 `next` 向内传入一个 `true` 就可以中断执行。`next` 传入参数这个机制，让我们可以在生成器外部更好的控制函数执行的逻辑。再来看一个更有趣的例子：

```javascript
function* dataConsumer() {
  console.log('Started')
  console.log(`1. ${yield}`)
  console.log(`2. ${yield}`)
  return 'result'
}
let genObj = dataConsumer()
genObj.next()
// Started
genObj.next('a')
// 1. a
genObj.next('b') // 2. b
```

这个例子更直观，我们直接用 `console.log` 配合模版字符串，直接输出 `yield`。如果我们不在 `next` 中传入参数的话，输出将会是 `undefined`。注意，由于 `next` 传入的参数是上一个 `yield` 表达式的返回值，所以第一次执行 `next` 传入参数是没意义的，因为第一次执行 `next` 只是启动函数执行到第一个 `yield`。如果你想要实现第一次 `next` 就能传入值，可以用一个函数包装生成器函数，然后在内部完成函数的启动即可。

```javascript
function* dataConsumer() {
  console.log('Started')
  console.log(`1. ${yield}`)
  console.log(`2. ${yield}`)
  return 'result'
}

function wrapper(gen) {
  return function (...args) {
    let g = gen(...args)
    g.next()
    return g
  }
}

let wrapped = wrapper(dataConsumer)
wrapped().next('hello')
wrapped().next('world')
// Started
// 1. hello
// Started
// 1. world
```

## for ... of 遍历

由于生成器对象是一个迭代器，所以我们当然可以用 `for ... of` 进行遍历。需要注意的是一旦返回的对象 `done` 为 `true`，`for ... of` 循环就会终止，所以 `return` 的值并不会在 `for ... of` 中输出。`for ... of` 包括扩展运算符等相当于一个自动运行的生成器，我们不在需要一步步调用 `next` 来运行生成器。

```javascript
function* foo() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
  return 6
}
for (let v of foo()) {
  console.log(v)
}
// 1 2 3 4 5
```

使用生成器和 `for ... of` 可以很简单的实现斐波那契数列：

```javascript
function* fibonacci() {
  let [prev, curr] = [0, 1]
  for (;;) {
    ;[prev, curr] = [curr, prev + curr]
    yield curr
  }
}
for (let n of fibonacci()) {
  if (n > 1000) break
  console.log(n)
}
```

## Generator.prototype.throw()

`Generator` 生成器对象的原型上有一个 `throw()` 方法，`throw()` 方法用来向生成器抛出异常，并恢复生成器的执行，返回带有 `done` 及 `value` 两个属性的对象。

有了 `throw` 之后我们可以在生成器外抛出错误，而在生成器内进行捕获。使用的时候需要注意，每一个 `catch` 只能工作一次，内部对应的 `yield` 如果没有 `catch`，那么会抛给外面的 `catch`，如果外面也没有定义，那么就会报错。如果 `throw` 的错误是生成器内部的 `catch` 捕获，那么同一个 `try` 代码块位于 `throw` 后面的代码会继续执行，如果是被外部的 `catch` 捕获的话，后面的代码将不会继续执行，这是和普通的 `try ... catch` 的主要不同。

```javascript
var g = function* () {
  try {
    yield
  } catch (e) {
    console.log('内部捕获', e)
  }
}
var i = g()
i.next()
try {
  i.throw('a')
  console.log(234) //成功输出
  i.throw('b')
  console.log(123) //不会执行
} catch (e) {
  console.log('外部捕获', e)
}
// 内部捕获 a
// 外部捕获 b
```

由于可能同时存在生成外和生成器内的 `try ... catch`，并且 `yield` 会暂停函数的执行，所以这里的逻辑可能会产生混乱，这里我详细说一下。

首先无论是内部还是外部的 `try ... catch` 都是一样的，`try` 语句包含了由一个或者多个语句组成的 `try` 块, 和一个 `catch` 块或者一个 `finally` 块的其中一个，或者两个兼有。`catch` 子句包含 `try` 块中抛出异常时要执行的语句。 如果在 `try` 块中有任何一个语句抛出异常，控制立即转向 `catch` 子句。如果在 `try` 块中没有异常抛出，会跳过 `catch` 子句。`finally` 子句在 `try` 块和 `catch` 块之后执行但是在下一个 `try` 声明之前执行。无论是否有异常抛出或捕获它总是执行。你可以嵌套一个或者更多的 `try` 语句。如果内部的 `try` 语句没有 `catch` 子句，那么将会进入包裹它的 `try` 语句的 `catch` 子句。

特别注意的是每个 `catch` 只能执行一次，不管是外部的还是内部的。只要 `try` 中的内容抛错，那么就追进入 `catch`，且 `try` 块中位于抛错之后的语句不会再执行。这也就意味着，如果多个 `yield` 表达式写在同一个 `try` 里面，如果其中一个 `yield` 抛错，后面的 `yield` 将无法用 `next` 执行，会直接执行 `try ... catch` 之后的（如果有 `finally` 则会先执行 `finally` 中的）。

`try ... catch` 的逻辑搞清楚后我们要注意，每次调用生成器的 `throw` 方法，都有一条对应的 `yield`。我们可以把 `throw` 想象成如下的过程，先执行 `next`，在执行到 `yield` 的时候不是暂停执行后返回，而是抛出一个错误。在错误被 `catch` 捕获后执行 `catch` 中的代码(如果没有 `catch` 就会向外层抛错，一直抛到最外层还没有就报错），一直执行到下一个 `yield` 才暂停并返回。

```javascript
function* gen() {
  try {
    yield 1
    yield 2
  } catch (e) {
    console.log(e)
    yield 'catch'
  } finally {
    yield 3
  }
  yield 4
}
let g = gen()

console.log(g.next()) //{ value: 1, done: false }
console.log(g.throw(new Error('error'))) // 先抛错，然后执行到下一个 yield 在暂停返回 Error: error { value: 'catch', done: false }
console.log(g.next()) //{ value: 3, done: false }
console.log(g.next()) //{ value: 4, done: false }
console.log(g.next()) //{ value: undefined, done: true }
```

当然也不一定要我们手动进行执行 `throw` 方法，如果在 `next` 的过程中，内部代码抛错也能被正常捕获。

```javascript
function* foo() {
  var x = yield 3
  var y = x.toUpperCase()
  yield y
  yield 1
}
var it = foo()
console.log(it.next()) // { value:3, done:false }
try {
  console.log(it.next(42))
} catch (err) {
  console.log(err) //TypeError: x.toUpperCase is not a function
}
console.log(it.next()) //{ value: undefined, done: true }
```

一旦内部的错误被外部捕获，那么这个生成器就不能再进行迭代了，也就是说内部的代码不会在执行了。再次调用 `next` 方法只会返回一个 `value` 为 `undefined`，`done` 为 `true` 的对象。

## Generator.prototype.return()

`return()` 方法简单的说就是返回给定的值并结束生成器。返回值的 `value` 就是 `return` 的参数，如果没有给 `return` 传入参数，返回值的 `value` 就是是 `undefined`，返回值的 `done` 为 `true`。如果 `Generator` 函数内部有 `try...finally` 代码块，那么 `return` 方法会推迟 到 `finally` 代码块执行完再执行。

```javascript
function* numbers() {
  yield 1
  try {
    yield 2
    yield 3
  } finally {
    yield 4
    yield 5
  }
  yield 6
}
var g = numbers()
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

## yield\*

`yield*` 表达式用于委托给另一个 `generator` 或可迭代对象。`yield*` 表达式迭代操作数，并产生它返回的每个值。`yield*` 表达式本身的值是当迭代器关闭时返回的值（即 `done` 为 `true` 时）。

生成器函数生成一个迭代器，我们可以理解成迭代器的嵌套（可以类比成二维数组理解）当我们遍历到这个嵌套的迭代器的时候，我们会进入这个迭代器内部遍历完之后再到外层遍历。我们完全可以把 `yield*` 理解为内部部署的一个 `for ... of` 循环，它的作用就是遍历被代理的生成器对象，并且在每一个输出前加上 `yield`。逻辑其实非常简单。

```javascript
function* foo() {
  yield 'a'
  yield 'b'
}

function* bar() {
  yield 'x'
  yield* foo()
  yield 'y'
}

// 等同于
function* bar() {
  yield 'x'
  yield 'a'
  yield 'b'
  yield 'y'
}

// 等同于
function* bar() {
  yield 'x'
  for (let v of foo()) {
    yield v
  }
  yield 'y'
}
for (let v of bar()) {
  console.log(v)
}
// "x"
// "a"
// "b"
// "y"
```

还有一个简单的例子可以帮助理解，`yield*` 后面的 `Generator` 函数(没有 `return` 语句时)，不过是 `for ... of` 的一种简写形式，完全可以用后者替代前者。反之，在有 `return` 语句时，则需要用 `var value = yield* iterator` 的形式获取 `return` 语句的值。

```javascript
function* concat(iter1, iter2) {
  yield* iter1
  yield* iter2
}
// 等同于
function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value
  }
  for (var value of iter2) {
    yield value
  }
}
```

如果我们不用 `yield*` ，而是直接用 `yield`，那么我们只能得到一个生成器对象（生成器函数执行后的结果）。

```javascript
function* inner() {
  yield 'hello!'
}
function* outer1() {
  yield 'open'
  yield inner()
  yield 'close'
}
var gen = outer1()
let g
console.log(gen.next().value) // "open"
console.log((g = gen.next().value)) // Object [Generator] {}
console.log(gen.next().value) // "close"

console.log(g.toString()) //object Generator
for (let c of g) {
  console.log(c) //hello!
}
```

`yield*` 表达式本身的值是当迭代器关闭时返回的值（即 `done` 为 `true` 时），如果有 `return`，那么就是 `return` 的值，如果没有则是执行到最后返回 `undefined`。当然我们也可以定制自己的迭代器，让迭代器 `done` 为 `true` 的时候也返回一个值，这个值就会是 `yield*` 表达式的返回值。

```javascript
let it = {
  num: 0,
  [Symbol.iterator]() {
    return this
  },
  next() {
    if (this.num < 3) {
      return {
        value: this.num++,
        done: false
      }
    } else {
      return {
        value: 'clloz',
        done: true
      }
    }
  }
}

function* gen() {
  yield 'a'
  console.log(yield* it) //表达式的返回值是 clloz
  yield 'b'
  yield 'c'
}

let g = gen()

for (let c of g) {
  console.log(c)
}
```

从这个例子中我们也可以看出，不仅仅是生成器对象可以用 `yield*` 进行遍历，任何迭代器都可以。所以包括数组，字符串，类数组对象，`Map`，`Set` 都可以作为 `yield*` 的迭代对象。

## 生成器函数

生成器函数可以作为对象的属性，他有如下两种形式：

```javascript
let obj = {
  *myGeneratorMethod() {}
}
let obj = {
  myGeneratorMethod: function* () {}
}
```

生成器函数不是一个构造函数，所以它不能进行 `new` 操作。执行生成器函数它总是返回生成器对象（也是一个迭代器），这个生成器对象是 `Generator` 对象的实例（我们不能直接访问 `Generator`），继承了 `Generator.prototype` 上的方法，`next`，`return` 和 `throw`，同时它也是生成器函数的实例，也继承了生成器函数原型上定义的方法。

```javascript
function* g() {}
g.prototype.hello = function () {
  return 'hi!'
}
let obj = g()
console.log(obj instanceof g) // true
console.log(obj.hello()) // 'hi!'
```

由于不能进行 `new` 调用，所以生成器函数内的 `this` 就没有效果。想要让这个 `this` 生效我们可以利用 `call`。

```javascript
function* F() {
  this.a = 1
  yield (this.b = 2)
  yield (this.c = 3)
}
var obj = {}
var f = F.call(obj)
console.log(f.next()) // Object {value: 2, done: false}
console.log(f.next()) // Object {value: 3, done: false}
console.log(f.next()) // Object {value: undefined, done: true}
console.log(obj.a) // 1 obj.b // 2 obj.c // 3
```

还可以进一步改造成一个可以用 `new` 调用的函数：

```javascript
function* gen() {
  this.a = 1
  yield (this.b = 2)
  yield (this.c = 3)
}
function F() {
  return gen.call(gen.prototype)
}
var f = new F()
console.log(f.next()) // Object {value: 2, done: false}
console.log(f.next()) // Object {value: 3, done: false}
console.log(f.next()) // Object {value: undefined, done: true}
console.log(f.a) // 1
console.log(f.b) // 2
console.log(f.c) // 3
```

这里其实就是利用的生成器函数 `gen` 生成的生成器是 `gen` 的实例，利用 `call` 将 `gen` 的 `this` 绑定到 `gen.prototype` 上（`this` 上的属性被设置到原型上），那么最后生成的生成器自然能通过原型链访问到对应的属性。

## 用法

## Symbol.iterator 使用生成器函数

生成器函数返回的是一个迭代器对象，所以我们可以将一个生成器函数作为对象的 `Symbol.iterator` 方法，就能让对象变为一个可迭代对象。

```javascript
var myIterable = {}
myIterable[Symbol.iterator] = function* () {
  yield 1
  yield 2
  yield 3
}
console.log([...myIterable]) // [1, 2, 3]
```

## 生成器函数 和 yield 位置

生成器函数可以用在一个函数声明，函数表达式或者一个类的方法中。`yield` 可以插入在生成器函数的任何位置，包括参数。`yield` 表达式放在其他表达式中的时候需要用括号括起来，作为参数和右值的时候可以省略括号。看下面的例子：

```javascript
function* demo() {
  function foo(a, b) {
    console.log('this is foo output: ' + a, b) //this is foo output: hello world
  }
  foo(yield 'a', yield 'b')
  let input = yield '123'
  console.log('this is input: ' + input) //this is input: clloz
}
let g = demo()
console.log(g.next()) //{ value: 'a', done: false }
console.log(g.next('hello')) //{ value: 'b', done: false }
console.log(g.next('world')) //{ value: '123', done: false }
console.log(g.next('clloz')) //{ value: undefined, done: true }
```

## 转换普通对象为可迭代对象

在将迭代器的时候，我们要将一个普通的 `Object` 转为一个可迭代对象需要自己定义 `Symbol.iterator` 方法，还是比较麻烦的，有了生成器之后我们可以很轻松的将一个普通对象变为可迭代对象。一种方式是直接将对象传入一个生成器函数中进行处理。

```javascript
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj)
  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]]
  }
}
let jane = { first: 'Jane', last: 'Doe' }
for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`)
}
// first: Jane
// last: Doe
```

另一种是将生成器作为对象的 `Symbol.iterator` 方法，因为生成器对象既满足可迭代协议，也满足迭代协议。

```javascript
function* objectEntries() {
  let propKeys = Object.getOwnPropertyNames(this)
  for (let propKey of propKeys) {
    yield [propKey, this[propKey]]
  }
}
let jane = { first: 'Jane', last: 'Doe', [Symbol.iterator]: objectEntries }

for (let [key, value] of jane) {
  console.log(key, value)
}
// first: Jane
// last: Doe
```

他们本质并没有什么区别，都是对生成器对象的迭代。除了 `for...of` 循环以外，扩展运算符、解构赋值和 `Array.from` 方法内部调用的，都是迭代器。这意味着，它们都可以将 `Generator` 函数返回的 `Iterator` 对象，作为参数。

## 用 yield\* 展开嵌套数组

```javascript
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      yield* iterTree(tree[i])
    }
  } else {
    yield tree
  }
}
const tree = ['a', ['b', 'c'], ['d', 'e']]
for (let x of iterTree(tree)) {
  console.log(x)
}
// a b c d e
```

## yield\* 实现二叉树遍历

```javascript
function Tree(left, label, right) {
  this.left = left
  this.label = label
  this.right = right
}
// 下面是中序(inorder)遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历
function* inorder(t) {
  if (t) {
    yield* inorder(t.left)
    yield t.label
    yield* inorder(t.right)
  }
}
// 下面生成二叉树
function make(array) {
  // 判断是否为叶节点
  if (array.length == 1) return new Tree(null, array[0], null)
  return new Tree(make(array[0]), array[1], make(array[2]))
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]])
// 遍历二叉树
var result = []
for (let node of inorder(tree)) {
  result.push(node)
}
console.log(result)
// ['a', 'b', 'c', 'd', 'e', 'f', 'g']
```

## 总结

本文讲了 `ES6` 中生成器的原理和主要的用法。其实生成器最重要的应用是在异步的处理上，这部分内容放到下一篇文章。
