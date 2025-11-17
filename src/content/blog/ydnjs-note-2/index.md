---
title: 'YDNJS学习笔记：上卷-第二部分'
publishDate: '2020-07-18 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
  - 编程技巧
language: '中文'
---

## YDNJS 学习笔记

1. [YDNJS学习笔记：上卷第一部分](https://www.clloz.com/programming/front-end/js/2020/07/16/ydnjs-note/ 'YDNJS学习笔记：上卷第一部分')

## 前言

承接第一卷第一部分

## this

关于 `this` 的行为我已经写过一篇文章：[JavaScript中this的指向](https://www.clloz.com/programming/front-end/js/2020/06/30/js-this/ 'JavaScript中this的指向')；关于 `bind call apply` 也写过一篇文章：[apply和call, bing方法的应用](https://www.clloz.com/programming/front-end/js/2020/07/03/apply-call-bind/ 'apply和call, bing方法的应用')。所以这一部分重复的内容就不写了。只补充一些自己没有掌握的细节。

## 为什么要使用 this

`this` 给我提供了一种优雅的方式来隐式传递一个对象的引用，因此我们可以将 `API` 设计的更加简介并且易于复用。随着代码越来越复杂，显示传递上下文的方式会让代码越来越混乱而难以理解和维护。特别是在 `JavaScript` 这样一个基于原型的面向对象语言中，`this` 更加显得重要。

```javascript
// 用this隐式传递对象的引用
function identify() {
  return this.name.toUpperCase()
}

var me = {
  name: 'Kyle'
}

var you = {
  name: 'Reader'
}

identify.call(me) // KYLE
identify.call(you) // READER

//显式传入对象
function identify(context) {
  return context.name.toUpperCase()
}
function speak(context) {
  var greeting = "Hello, I'm " + identify(context)
  console.log(greeting)
}
identify(you) // READER
speak(me) //hello, I'm KYLE
```

> 熟练的运用 `devtools` 能够让我们更有效率地调试我们的代码。比如查看调用栈。

---

采用默认调用的函数只有内部使用严格模式才能限制 `this` 绑定到全局对象上，如果只是在函数调用的部分使用严格模式，而函数体内部使用非严格模式，函数内的 `this` 还是会绑定到全局对象上。

```javascript
//函数内部为严格模式
function foo() {
  'use strict'
  console.log(this.a)
}
var a = 2
foo() // TypeError: this is undefined

//函数内部非严格，调用环境严格
function foo() {
  console.log(this.a)
}
var a = 2
;(function () {
  'use strict'
  foo() // 2
})()
```

> 不要在代码中混合使用严格模式和非严格模式，可能造成兼容性问题。

---

参数的传递也是一种隐式的赋值，在传递过程中也会丢失对象的绑定。不管是我们自己定义的回调函数还是内置方法的回调函数都一样，因为实参传递给形参的时候已经丢失了原来绑定的对象。

```javascript
function foo() {
  console.log(this.a)
}
function doFoo(fn) {
  // fn 其实引用的是 foo fn(); // <-- 调用位置!
}
var obj = {
  a: 2,
  foo: foo
}
var a = 'oops, global' // a 是全局对象的属性 doFoo( obj.foo ); // "oops, global"
```

---

硬绑定在 `ES5` 中已经提供了标准化的内置方法 `bind`，它的原型如下。

```javascript
function foo(something) {
  console.log(this.a, something)
  return this.a + something
}
// 简单的辅助绑定函数
function bind(fn, obj) {
  return function () {
    return fn.apply(obj, arguments)
  }
}
var obj = {
  a: 2
}
var bar = bind(foo, obj)
var b = bar(3) // 2 3
console.log(b) // 5

//ES5的bind
function foo(something) {
  console.log(this.a, something)
  return this.a + something
}

var obj = {
  a: 2
}

var bar = foo.bind(obj)

var b = bar(3) // 2 3
console.log(b) // 5
```

第三方库的许多函数，以及 `JavaScript` 语言和宿主环境中许多新的内置函数，都提供了一 个可选的参数，通常被称为“上下文”(`context`)，其作用和 `bind(..)` 一样，确保你的回调 函数使用指定的 `this`。这些函数实际上就是通过 `call(..)` 或者 `apply(..)` 实现了显式绑定，这样你可以少写一些代码。

---

四种绑定模式：默认绑定，隐式绑定，显示绑定和 `new` 绑定，优先级从低到高。其中比较容易忽略的一点就是 `bind` 和 `new` 的优先级以及应用。如果我们对一个 `bind` 硬绑定的函数执行 `new` 运算，那么函数执行过程中 `new` 运算新创建的对象会覆盖 `bind` 绑定的对象。书中有一处我觉得表述的比较有问题，就是模拟 `bind` 的那个函数的运行结果，代码如下。

```javascript
//模拟 bind
function bind(fn, obj) {
  return function () {
    fn.apply(obj, arguments)
  }
}

function foo(something) {
  this.a = something
}

var obj1 = {}

var bar = bind(foo, obj1)

bar(2)
console.log(obj1.a) // 2

var baz = new bar(3)
console.log(obj1.a) // 3
console.log(baz.a) // undefined

//标准bind
function foo(something) {
  this.a = something
}

var obj1 = {}
var bar = foo.bind(obj1)
bar(2)

console.log(obj1.a) // 2
var baz = new bar(3)
console.log(obj1.a) // 2
console.log(baz.a) // 3
```

两段代码看似没什么不同，但是模拟 `bind` 中最后实际 `new` 的函数是

```javascript
function() {
        fn.apply( obj, arguments );
};
```

在 `fn` 外面嵌套了一层，而标准中的则是直接 `new` 的 `bind` 返回的函数。内部嵌套的函数中的 `this` 和 所在环境的 `this` 是不相关的，所以这两者的类比其实没什么意义。

> 嵌套的原因主要是 `apply` 和 `call` 是立即执行的，不像 `bind` 是返回一个带参数的函数，所以 `new` 和 `call/apply` 无法一起使用。`new` 和 `bind` 一起使用还有一个功能就是能够预设参数，达到和函数柯里化一样的效果。

---

最后说一下 `mdn` 给出的 `bind`的 `polyfill`，这个 `polyfill` 能够检测是否是 `new` 操作符，将标准中的 `bind` 对 `new (funcA.bind(thisArg, args))` 的行为也实现。在 `ES6` 中有 `new.target` 可以轻松实现这个功能，但这个 `polyfill` 使用的场景是 `bind` 都没有，更不用说 `new.target` 了。

> `polyfill` 就是我们常说的刮墙用的腻子，`polyfill` 代码主要用于旧浏览器的兼容，比如说在旧的浏览器中并没有内置 `bind` 函数，因此可以使用 `polyfill` 代码在旧浏览器中实现新的功能.

```javascript
//  Yes, it does work with `new (funcA.bind(thisArg, args))`
//第一层
if (!Function.prototype.bind)
  (function () {
    var ArrayPrototypeSlice = Array.prototype.slice
    //第二层
    Function.prototype.bind = function (otherThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
      }

      var baseArgs = ArrayPrototypeSlice.call(arguments, 1),
        baseArgsLength = baseArgs.length,
        fToBind = this,
        fNOP = function () {},
        //第三层
        fBound = function () {
          baseArgs.length = baseArgsLength // reset to default base arguments
          baseArgs.push.apply(baseArgs, arguments)
          return fToBind.apply(fNOP.prototype.isPrototypeOf(this) ? this : otherThis, baseArgs)
        }

      if (this.prototype) {
        // Function.prototype doesn't have a prototype property
        fNOP.prototype = this.prototype
      }
      fBound.prototype = new fNOP()

      return fBound
    }
  })()
```

我把代码分为了三层，第一层是判断 `API` 是否有 `bind`，第二层就是在 `Function.prototype` 上添加 `bind` 方法，第三层则是我们调用 `bind` 后返回的函数。对于非 `new` 调用，就直接是 `apply` 并传入 `otherThis`，非常简单。但对于 `new` 我还是有点疑问的。

我们 `new` 的实际上是 `第三层` 的 `fBound` 函数。根据 `new` 的行为会创建一个 `[[prototype]]` 指向 `fBound.prototype` 的新对象，然后以这个新对象作为 `this` 执行 `fBound` 并返回新对象。要注意的一点是，第二层中的 `this` 是调用 `bind` 的函数（我们设这个方法为 `fn`），而第三层中的 `this` 是 `new` 运算符创造的新对象。

我们最后 `new` 的新对象的 `[[prototype]]` 应该是第二层的调用 `bind` 函数（标准中的 `bind` 就是如此）的 `prototype`，这条线索也就是整个方法的核心，在第三层用 `fNOP.prototype.isPrototypeOf(this)` 来验证 `this` 的原型链上是不是有 `fn.prototype`，如果有就说明这是个 `new` 调用。但是在 `mdn` 的这个实现中，是用一个空对象 `fNOP` 的 `prototype` 指向`fn.prototype`，然后将 `fBound.prototype` 指向一个 `fNOP` 的实例。这样操作虽然 `fn.prototype` 还在 `new` 的对象的原型链上，但是和标准中的 `bind` 行为不一致，中间多了一个 `fNOP` 的实例。而且在第二层将 `fBound.prototype` 设为和 `fNOP.prototype` 一样的 `this.prototype` 并不影响整个方法的逻辑（这样设置 `new` 的新对象的 `[[prototyep]]` 指向 `fn.prototype`），执行结果也没有异常，不影响第三层 `fNOP.prototype.isPrototypeOf(this)` 的验证。不知道 `mdn` 上的方法是不是有什么其他我没想到的用意，如果哪位读者知道，希望指点一下。

---

书中总结的 `this` 的判断规则：

1. 函数是否在 `new` 中调用(`new` 绑定)?如果是的话 `this` 绑定的是新创建的对象。`var bar = new foo()`
2. 函数是否通过 `call`、`apply` (显式绑定)或者硬绑定调用?如果是的话，`this` 绑定的是 指定的对象。`var bar = foo.call(obj2)`
3. 函数是否在某个上下文对象中调用(隐式绑定)?如果是的话，this 绑定的是那个上 下文对象。`var bar = obj1.foo()`
4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 `undefined`，否则绑定 到全局对象。 `var bar = foo()`
5. 如果你把 `null` 或者 `undefined` 作为 `this` 的绑定对象传入 `call`、`apply` 或者 `bind`，这些值在调用时会被忽略，实际应用的是默认绑定规则。

使用 `null` 作为参数的情况一般是用 `apply` 展开数组（有些函数只接受一个个单独的参数，我们想直接传入数组用 `apply` 是个方便的方法，当然 `ES6` 中有扩展运算符 `...` 可以直接使用）；用 `bind` 进行函数柯里化（预先传入参数）。

绑定 `null` 作为 `this` 不是一个安全的方法，最好是用 `var ø = Object.create( null );` 创建一个空对象来代替 `null`，这样可以避免发生意外。

`(p.foo = o.foo)();` 会应用默认绑定，赋值表达式返回值是右值，此处为对应方法的引用。
