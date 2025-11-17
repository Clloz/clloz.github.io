---
title: 'JavaScript中的this指向'
publishDate: '2020-06-30 12:00:00'
description: ''
tags:
  - js
language: '中文'
---

## 前言

`JS` 中的 `this` 指向是一个经常被问到的问题，网上也有很多文章是关于 `this` 的。本文整理一下我理解下的 `this` 以及一些我比较疑惑的关于 `this` 问题。

## this 指向

有几个 `this` 的指向问题是几乎每篇文章都会说的，比如作为函数直接调用，作为对象的方法调用，`new` 运算符执行中的 `this` 行为。比较通用的说法是，`this` 指向的是直接调用该函数的对象。其实也很好理解，就是为什么需要 `this` 这个关键字，就是我们有需要在函数内部对调用函数的对象进行操作的需求。但是有时候我们遇到的情况并不是像书上或 `mdn` 上遇到的典型的情况，`this` 的行为可能就会让我们感到有点疑惑。

## 函数的直接调用

当我们直接调用一个已经声明的函数，那么在非严格模式下，该函数内部的 `this` 指向的是全局对象，浏览器环境下就是 `window` 对象。

```javascript
function f1() {
  return this
}
//在浏览器中：
f1() === window //在浏览器中，全局对象是window

//在Node中：
f1() === global
```

当函数是在全局环境下定义的时候，这种现象是可以理解的，因为全局环境下定义的函数其实就是挂载在全局对象上的一个属性，比附上面的 `f1` 也可以理解为 `window.f1`。但我认为严格模式下的行为才是更符合 `this` 这个关键字的目的的，特别是我们的函数可能是在非全局环境（比如另一个函数中）定义和调用的，这种情况下 `this` 还指向 `window` 是不太合理的。所以在严格模式下，一个函数直接调用，它的 `this` 指向的是 `undefined`，如果我们想要得到非严格模式下的结果，那我们调用函数的方法就要改为 `window.f1()`，而如果函数是在非全局环境下定义的话，那么始终返回的是 `undefined`。我认为这样的行为是更符合逻辑的。

```javascript
'use strict'
function d() {
  function e() {
    console.log(this)
  }
  console.log(this)
}

d()
//undefined
//undefined

window.d()
//Window{}
//undefined
```

> 这里在全局模式下使用 `use strict` 只是为了测试，实际使用还是尽量放在函数内局部使用严格模式，全局下的严格模式很容易导致出错。

## 函数作为对象的属性调用

这也是在代码中非常常见的场景，我认为这是比函数调用更好理解，也更能帮助我们理解 `this` 行为的场景。简单的来说就是 `this` 指向的是 **`直接`** 调用函数的那个对象。并且要注意的是，这跟函数在哪里定义的是无关的，我们看 `this`，看的就是从哪里调用的函数。

```javascript
//在对象内部定义
var o = {
  prop: 37,
  f: function () {
    return this.prop
  }
}

console.log(o.f()) // 37

//在对象外部定义
var o = { prop: 37 }

function independent() {
  return this.prop
}

o.f = independent

console.log(o.f()) // 37

//在对象内部定义，但是给外部变量引用并执行
var o = {
  prop: 37,
  f: function () {
    console.log(this)
    return this.prop
  }
}
var prop = 100
var m = o.f
console.log(m())
//Window{}
//100
```

上面的段落我给 `直接` 这两个字加粗了，想要表达的意思是当我们通过多个对象的属性嵌套找到并调用函数，那么最后那个最接近函数的对象就是函数 `this` 的指向。

```javascript
var o = {
  a: 10,
  b: {
    a: 12,
    fn: function () {
      console.log(this.a) //12
    }
  }
}
o.b.fn()

var o = {
  a: 10,
  b: {
    // a:12,
    fn: function () {
      console.log(this.a) //undefined
    }
  }
}
o.b.fn()
```

为什么我说这个场景能够帮助我们理解，原因就是它反映出 `this` 这个关键字的本质。`JS` 中的函数也是一种对象，在我们的执行环境中的活动对象保存的也只是函数对象的一个引用，如果这个引用是保存在活动对象中的某个对象的属性中（即我们通过活动对象中的某个对象的属性找到该函数），那么函数执行的时候 `this` 就会指向这个对象，这也是为什么多层对象的调用，还是最靠近函数的那个对象作为 `this`。虽然在代码中我们的函数是在对象中定义的，但是实际在内存中，对象中只保存着函数的引用，函数自己是在一个单独的内存空间中。所以我们通过哪个对象找到函数并执行，函数中的 `this` 就指向这个对象。上面的直接调用 `this` 返回 `undefined` 也是说得通的。

## 通过原型的调用

有时我们是通过原型来执行公用的函数，此时已然符合我们上面的逻辑，我们通过哪个实例 `找到` 函数，那么 `this` 就指向那个实例。

```javascript
var o = {
  f: function () {
    return this.a + this.b
  }
}
var p = Object.create(o)
p.a = 1
p.b = 4

console.log(p.f()) // 5
```

## 箭头函数

箭头函数不会创建自己的 `this`，它只会从自己的作用域链的上一层继承 `this` （`mdn` 写的是封闭的词法环境）。当你遇到箭头函数中的 `this` 不确定的时候，你可以想象把这个箭头函数换成 `console.log(this)`，这个 `console` 的输出就是箭头函数中 `this` 的值，并且箭头函数的 `this` 是绑定的，不会改变（有时候看上去改变了是所在的 `context` 改变了）。还有一点需要注意的是，用 `call`，`apply`，`bind` 来调用箭头函数，第一个参数是没有意义的，也就是无法改变 `this`，如果仍需要使用，第一个参数应该传 `null`。看 `mdn` 给出的示例。

```javascript
var globalObject = this
var foo = () => this
console.log(foo() === globalObject) // true

// 接着上面的代码
// 作为对象的一个方法调用
var obj = { foo: foo }
console.log(obj.foo() === globalObject) // true

// 尝试使用call来设定this
console.log(foo.call(obj) === globalObject) // true

// 尝试使用bind来设定this
foo = foo.bind(obj)
console.log(foo() === globalObject) // true

// 创建一个含有bar方法的obj对象，
// bar返回一个函数，
// 这个函数返回this，
// 这个返回的函数是以箭头函数创建的，
// 所以它的this被永久绑定到了它外层函数的this。
// bar的值可以在调用中设置，这反过来又设置了返回函数的值。
var obj = {
  bar: function () {
    var x = () => this
    return x
  }
}

// 作为obj对象的一个方法来调用bar，把它的this绑定到obj。
// 将返回的函数的引用赋值给fn。
var fn = obj.bar()

// 直接调用fn而不设置this，
// 通常(即不使用箭头函数的情况)默认为全局对象
// 若在严格模式则为undefined
console.log(fn() === obj) // true

// 但是注意，如果你只是引用obj的方法，
// 而没有调用它
var fn2 = obj.bar
// 那么调用箭头函数后，this指向window，因为它从 bar 继承了this。
console.log(fn2()() == window) // true
```

---

由于箭头函数没有自己的 `this`，所以在一些情况下不要使用箭头函数，会导出错误或者意外的行为。下面是一些总结的箭头函数的一些规则。关于 `this` 其实总的来说就是一条，箭头函数没有自己的 `this`，如果在箭头函数中使用 `this`，这个 `this` 指向函数定义时所在的环境中的 `this`，这一这个环境是可能变化的，这将导致箭头函数中的 `this` 发生变化。

1. 对象的方法：对象的方法如果使用箭头函数则箭头函数中的 `this` 指向的是对象所在环境的 `this`。如果是在全局环境中创建的对象，`this` 指向全局对象 `window`。如果实在 `node` 模块中则指向 `module.exports` 对象。

   ```javascript
   let outerObj = {
     name: 'clloz'
   }
   function outer() {
     console.log(this) // outerObj { name: 'clloz' }
     const obj = {
       arr: [1, 2, 3],
       sun: () => {
         console.log(this) // outerObj { name: 'clloz' }
       }
     }
     obj.sun()
   }
   outer.apply(outerObj)
   ```

2. 原型上的方法逻辑也和上面一样，不过要注意一点，在 `class` 中定义方法如果使用箭头函数的话，这个函数会被 `babel` 转换到构造函数中。结合上面一点，不要在对象的方法或类方法中使用箭头函数。

   ```javascript
   class Point {
     constructor(x, y) {
       // ...
       this.say = () => {
         // ...
       }
     }

     toString() {
       // ...
     }
   }

   //等同于
   class Point {
     constructor(x, y) {
       // ...
       this.say = function () {
         const _this = this
         return function () {}.bind(_this)
       }
     }

     toString() {
       // ...
     }
   }
   ```

3. 箭头函数的 `this` 并不是不会变的，只是它确定指向它所在环境的 `this`，这个环境可能会变化。

   ```javascript
   var handler = {
     id: '123456',
     init: function () {
       let func = () => {
         console.log(this)
       }
       func()
     }
   }
   handler.init() //{ id: '123456', init: [Function: init] }
   let m = handler.init
   m() //全局对象
   ```

4. 箭头函数不能作为构造函数。
5. 箭头函数没有自己的 `this`，`arguments`，`super` 或 `new.target`。
6. 箭头函数不能作为生成器函数。
7. 由于箭头函数没有自己的 `this` 指针，通过 `bind()`，`call()` 或 `apply()` 方法调用一个函数时，只能传递参数（不能绑定 `this`），他们的第一个参数会被忽略。
8. 箭头函数没有 `prototype` 属性。
9. 箭头函数在参数和箭头之间不能换行。
10. 箭头函数中的箭头不是运算符，但箭头函数具有与常规函数不同的特殊运算符优先级解析规则。
11. 严格模式下函数中的 `this` 不能指向全局对象，如果箭头函数的 `this` 指向全局对象，会返回 `undefined`。

```javascript
let callback;

callback = callback || function() {}; // ok

callback = callback || () => {};
// SyntaxError: invalid arrow-function arguments

callback = callback || (() => {});    // ok
```

## vue methods 中的 this

在 `vue` 的 `methods` 中使用 `throttle` 的时候一般这样使用：

```javascript
//...
methods: {
  func: throttle(function () {
    // function body
  })
}
//...
```

我们将一个函数作为参数传给 `throttle` 函数，返回的函数作为 `methods` 中的一个方法。在使用的时候我发现，如果 `throttle` 的函数参数用箭头函数，`this` 是 `undefined`（应该是在严格模式中）。这里分析一下原因，可以看下面的代码

```javascript
const obj = {
  func: getFunc(() => {
    console.log(this)
  })
}

function getFunc(func) {
  console.log(this)
  return func
}

obj.func()
```

要获取 `func` 属性，我们先要计算 `getFunc()`，这相当于直接执行 `getFunc` 函数，和我们 `2.1` 中的函数直接调用是一样的，所以这里的 `getFunc` 中的 `this` 必然是全局对象(严格模式下是 `undefined`)。执行完之后返回了一个函数，我们的 `obj.func` 指向的就是这个返回的函数，而这个函数的调用方式是 `obj.func`，作为 `obj` 的属性调用，和 `2.2` 中是一样的，所以内部的 `this` 指向 `obj`。

当然我们的 `throttle` 实际返回的不是我们传入的参数，而是一个如下的形式

```javascript
function throttle(fn, interval) {
  var executing = false
  return function () {
    if (executing) return
    executing = true
    setTimeout(() => {
      fn.apply(this, arguments)
      executing = false
    }, interval)
  }
}
```

内部 `return` 的 `function` 中的 `this` 是 `obj`，而我们的 `fn` 则用 `apply` 绑定了这个 `this`，而如果我们的 `fn` 是箭头函数的话，这个绑定则无法生效，因为箭头函数没有自己的 `this`，这也是我上面说的现象的原因。

> `vue` 中的 `throttle` 使用的是 `lodash`，其内部也是用的 `apply` 绑定的 `this`。

## 定时器的 `this`

由于 `setTimeout` 和 `setInterval` 是全局对象的方法，所以它们回调函数中的 `this` 指向的是全局对象 `window`（**注意：不管是严格模式还是非严格模式**）。在 `NodeJS` 中，`setTimeout` 和 `setInterval` 的回到函数中的 `this` 指向的是一个 `Timeout` 对象。

解决 `setTimeout` 的 `this` 指向问题有如下几个方法：

- 使用箭头函数
- 使用中间变量
- 使用 `bind`

```javascript
//箭头函数
let obj = Object.create(null)
obj.func = function () {
  setTimeout(() => {
    console.log(this)
  }, 1000)
}
obj.func()

// 使用中间变量
let obj = Object.create(null)
obj.func = function () {
  let that = this
  setTimeout(function () {
    console.log(that)
  }, 1000)
}
obj.func()

// 使用 bind
let obj = Object.create(null)
obj.func = function () {
  setTimeout(
    function () {
      console.log(this)
    }.bind(this),
    1000
  )
}
obj.func() //[Object: null prototype] { func: [Function] }
```

## 其他情况

还有一些情况我觉得比较简单，就一笔带过。 1. 当函数被用作事件处理函数时，它的 `this` 指向触发事件的元素。 2. 当代码被内联 `on-event` 处理函数调用时，它的this指向监听器所在的 `DOM` 元素，需要注意的是只有最外层的 `this` 是这样，如果里面还有嵌套函数，则嵌套函数的 `this` 在非严格模式下仍然指向全局对象。 3. 构造函数中的 `this` 请看之前的文章[JavaScript中new操作符的解析和实现](https://www.clloz.com/programming/front-end/js/2020/06/29/new-operator/ 'JavaScript中new操作符的解析和实现') 4. `bind`，`call` 和 `apply` 都一样，函数的 `this` 被绑定到第一个参数上。 5. 在全局作用域中的 `this` 无论是否在严格模式下，都指向 `window`。在全局作用域中用 `var` 声明的变量都是 `window` 对象上的属性，函数声明和 `var` 声明的函数表达式则是全局对象上的方法。（用 `var` 声明的变量虽然是全局对象上的属性，但是不能用 `delete` 删除）

## NodeJS 中的 this

这里特别提一下 `NodeJS` 中的 `this`。因为它和浏览器环境还是有些不同的。

在 `NodeJS` 中我们无法定义全局变量，所有变量都是在模块中的。不过 `NodeJS` 提供了一些全局对象，`global`，`process` 和 `console`，他们是所有模块都可以调用的。由于不能像浏览器一样直接声明全局变量，所以 `global` 就成为全局变量的一个宿主（`Node` 不推荐全局变量）。

浏览器的全局对象是 `window`，`NodeJS` 的全局对象是 `global`，为了应对不同环境全局对象的名称不一样，所以引入了 `globalThis`，它是指向当前环境全局对象的一个引用。

在 `NodeJS` 中，每一个模块中最外层的 `this` 指向的是 `module.exports`。这一点跟浏览器很不同，浏览器最外层的 `this` 是指向全局对象的，而且模块中用 `var` 声明的变量也不是 `module.exports` 的属性。`node` 中最外层的 `this` 和全局对象 `global` 没有关系。

```javascript
console.log(this === module.exports) //true
console.log(this === exports) //true
```

而函数中的 `this` 则是指向全局对象，严格模式下则为 `undefined`，这和浏览器逻辑一致的。

```javascript
function a() {
  console.log(this === globalThis) //true
}
a()
console.log(globalThis === global) //true

function a() {
  'use strict'
  console.log(this) //undefined
}
a()
```

其他的没有提到的，基本跟浏览器的逻辑保持一致。

## 总结

以上就是我所总结的 `JS` 中的 `this` 的一些要点，如果有什么遗漏或者错误的地方，欢迎指正。

## 参考文章

1. [this - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this 'this - MDN')
2. [this 的值到底是什么？一次说清楚](https://zhuanlan.zhihu.com/p/23804247 'this 的值到底是什么？一次说清楚')
3. [彻底理解JS中this的指向](cnblogs.com/pssp/p/5216085.html '彻底理解JS中this的指向')
