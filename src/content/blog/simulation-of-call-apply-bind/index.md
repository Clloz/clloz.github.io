---
title: '模拟实现call，apply 和 bind'
publishDate: '2020-10-07 12:00:00'
description: ''
tags:
  - js
  - 实用技巧
  - 编程技巧
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

`call`，`apply` 和 `bind` 是 `Function.prototype` 上的三个方法，他们能让我们指定函数执行的上下文和参数。关于他们的区别，可以参考我的另一篇文章 [apply和call, bing方法的应用](https://www.clloz.com/programming/front-end/js/2020/07/03/apply-call-bind/ 'apply和call, bing方法的应用')。为了加深对他们的理解，就动手实现一下模拟的 `call`，`apply` 和 `bind`。

## 模拟 call

`call` 和 `apply` 的主要区别就是参数的形式，本质并没有不同，我们实现了其中一个另一个也就解决了，这里我们详细说一下 `call` 实现的过程。

我们先来看看 `ES5` 标准中对 `call` 的定义：当以 `thisArg` 和可选的 `arg1, arg2` 等等作为参数在一个 `func` 对象上调用 `call` 方法，采用如下步骤：

- 如果 `IsCallable(func)` 是 `false`, 则抛出一个 `TypeError` 异常。
- 令 `argList` 为一个空列表。
- 如果调用这个方法的参数多于一个，则从 `arg1` 开始以从左到右的顺序将每个参数插入为 `argList` 的最后一个元素。
- 提供 `thisArg` 作为 `this` 值并以 `argList` 作为参数列表，调用 `func` 的 `[[Call]]`内部方法，返回结果。
- `call` 方法的 `length` 属性是 `1`。

> 在外面传入的 `thisArg` 值会修改并成为 `this` 值。`thisArg` 是 `undefined` 或 `null` 时它会被替换成全局对象，所有其他值会被应用 `ToObject` 并将结果作为 `this` 值，这是第三版引入的更改。

所以我们要做的事情很简单，就是将 `call` 的第一个参数作为函数执行的 `this`，`call` 的后面其他参数作为函数执行的参数执行函数即可。

改变函数的 `this` 就需要改变函数的调用方式，直接调用的话 `this` 指向的是全局对象。我们很容易想到的就是将函数作为一个方法添加到 `thisArg` 上。但是这样 `thisArg` 上就多了一个属性，改变了 `thisArg`，所以我们要在函数调用完之后用 `delete` 删除这个属性。这样处理虽然还是能在函数中的 `this` 中看到我们添加的属性（因为我们删除是在函数调用之后），和 **原版** 的 `call` 不一样，不过目前我能想到的只有这么解决。我们可以用 `Symbol` 来让这个新添加的方法不可访问，不过 `Symbol` 是 `ES6` 的新特性，而 `call` 和 `apply` 都是在 `es3` 就支持的方法，所以这里我们也可以用 `Math.random()` 生成一串随机数作为键名，或者用 `new Date().getTime()` 生成时间戳也可以，这样做的另一个原因就是防止和 `thisArg` 中原有的属性名冲突 :joy:。下面的代码可以看出两者的区别。

```javascript
//this is a testing javascript file

Function.prototype._call = function (thisArg) {
  thisArg.func = this
  thisArg.func()
  delete thisArg.func
}

let obj1 = {}
let obj2 = {}

function iscalled() {
  console.log(Object.getOwnPropertyNames(this))
}

iscalled._call(obj1) //['func']
iscalled.call(obj2) //[]
console.log(Object.getOwnPropertyNames(obj1)) //[]
```

将 `thisArg` 后面的参数作为函数调用的参数我们可以用一个数组将所有的参数 `push` 进去。但是执行的时候如何调用这个数组作为参数呢。我们比较容易想到用 `es6` 的扩展运算符 `...` 这样调用 `thisArg.func(...argList)`，这样确实能解决问题，但和上面的 `Symbol` 一样，扩展运算符是一个 `ES6` 的特性，我们想要模拟实现一个 `es3` 的方法。所以这里我们可以用拼接字符串然后用 `eval` 调用的方式来执行代码。最后的实现如下：

```javascript
Function.prototype._call = function (thisArg) {
    //判断this是否是函数
    if (typeof this !== 'function') {
        throw new TypeError(this + ' is not a function');
    }

    //thisArg 为 undefined 或者 null 则转为全局对象
    if (thisArg === void(0) || thisArg === null) {
        thisArg = window;
    } else {
        //thisArg 不是对象为其包装
        thisArg = new Object(thisArg)
    }
    console.log(thisArg)

    let argList = [];
    const FUNC = Symbol('func');
    thisArg[FUNC] = this;

    for (let i = 1; i < arguments.length; i++) {
        //es6
        //argList.push(arguments[i])

        //es3
        argList.push('arguments[' + i + ']');
    }
    //es6
    //let result = thisArg[FUNC](...argList);

    //es3
    let result = eval('thisArg[FUNC](' + argList + ')'); //这里会调用 `Array.prototype.toString()` 进行argList的类型转换
    delete thisArg[FUNC];
    return result;
}

// 测试
var value = 1;

var obj = {
    value: 2
}

function beCalled(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

beCalled._call(null); // 1 thisArg: window
beCalled._call(undefined); 1 thisArg: window
beCalled._call(1) // undefined thisArg: Number(1)

console.log(beCalled._call(obj, 'clloz', '28')); //2 {value: 2, name: "clloz", age: "28"}
```

对 `thisArg` 进行了一些判断，如果是 `undefined null` 就转为全局对象（判断 `undefined` 最好是使用 `void(0)`，因为在非全局作用域 `window` 和 `undefined` 都是能被修改的），如果不是对象则用 `Object()` 进行包装。

## 模拟 apply

有了 `call` 经验，实现 `apply` 就比较简单了，我们只是取参数的方式变化一下即可。我们需要判断一下 `apply` 的第二个参数是否是一个可用的数组。具体代码如下：

```javascript
Function.prototype._apply = function (thisArg, args) {
  //判断this是否是函数
  if (typeof this !== 'function') {
    throw new TypeError(this + ' is not a function')
  }

  //thisArg 为 undefined 或者 null 则转为全局对象
  if (thisArg === void 0 || thisArg === null) {
    thisArg = window
  } else {
    //thisArg 不是对象为其包装
    thisArg = new Object(thisArg)
  }

  const FUNC = Symbol('func')
  thisArg[FUNC] = this
  let argList = []
  let result

  if (!argList) {
    result = thisArg[FUNC]()
  } else {
    for (let i = 0; i < args.length; i++) {
      argList.push('args[' + i + ']')
    }
    result = eval('thisArg[FUNC](' + argList + ')')
  }

  delete thisArg[FUNC]
  return result
}

// 测试一下
var value = 1

var obj = {
  value: 2
}

function beCalled(name, age) {
  console.log(this.value)
  return {
    value: this.value,
    name: name,
    age: age
  }
}

beCalled._apply(null) // 2
beCalled._apply(undefined)
beCalled._apply(1)

console.log(beCalled._apply(obj, ['clloz', '28']))
```

## 模拟 bind

`bind` 是返回一个指定了 `this` 的函数，同时这个函数支持 `new` 调用，使用 `new` 调用则指定的 `this` 不生效。

在模拟 `bind` 之前，我们先看一下 [Function.prototype.bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind 'Function.prototype.bind') 上的一个例子，这个例子我在 [apply和call, bing方法的应用](https://www.clloz.com/programming/front-end/js/2020/07/03/apply-call-bind/#bind 'apply和call, bing方法的应用') 里面也谈过，不过今天看了下自己还不是很透彻就再讲一遍，感觉还是有助于对于本文知识点，包括是函数的理解的。

```javascript
//给 Array.prototype.slice 一个别名，方便调用
var slice = Array.prototype.slice

slice.apply(arguments)

//也可以这样用bind实现
var unboundSlice = Array.prototype.slice
var slice = Function.prototype.apply.bind(unboundSlice)

slice(arguments)
```

上面的两段代码实现的都是实现 `Array.prototype.slice` 的快捷调用，让我们不用每次都输入一长串字符，直接一个 `slice` 就可以了。不过第一种实现，我们需要显示的使用 `slice.apply`，第二种实现则直接使用 `slice` 即可。这是如何实现的呢？

首先我们要明白，`apply` 本身就是一个函数，它是在 `Function.prototype` 上定义的一个函数，所有函数都能调用它。当我们用 `func.apply()` 调用 `apply` 的时候，本质就是以 `func` 作为 `this` 调用 `apply`。那么第二种实现就是用 `Array.prototype.slice` 作为 `this` 创建 `apply` 的一个绑定函数。当我们调用这个绑定函数的时候就相当于调用 `Array.prototype.slice.apply()`。

> `Function.prototype.call.bind(func)` 或者 `Function.prototype.apply.bind(func)` 就可以直接理解为返回的绑定函数是 `func.call` 或者 `func.apply`。

当我们需要频繁调用一个指定 `this` 的函数，我们可以用 `bind` 来实现快捷调用。举个例子子，我们相对类数组对象（比如 `arguments`）执行数组方法（比如 `slice`），我们一般是 `Array.prototype.slice.apply(arguments)`，当我们需要频繁使用这个方法的时候，我们可能会这样 `let slice = Array.prototype.slice; slice.apply(arguments);`。如果我们使用 `bind`，我们可以直接 `slice(arguments)` 这样调用，更方便，具体实现看下面的代码。

---

实现 `bind` 主要有三个点，返回一个函数，可以预设参数以及生成的绑定函数可以使用 `new` 操作符。

返回函数和预设参数我们可以用 `apply` 来实现，大致的效果如下。

```javascript
Function.prototype._bind = function (thisArg) {
  let self = this
  let args = Array.prototype.slice.call(arguments, 1)
  let fBound = function () {
    let bindArgs = Array.prototype.slice.call(arguments)
    return self.apply(thisArg, args.concat(bindArgs))
  }
  return fBound
}

function sum(c, d) {
  return this.a + this.b + c + d
}

let obj = { a: 1, b: 2 }

let t = sum._bind(obj, 3)

console.log(t(4)) //10
```

---

下面就是要实现 `new` 调用。如果你对 `new` 操作符不熟悉，可以先看一下 [JavaScript 中的 new 操作符和实现](https://www.clloz.com/programming/front-end/js/2020/06/29/new-operator/ 'JavaScript 中的 new 操作符和实现')。当使用 `new` 调用绑定函数，`this` 将指向绑定函数的原型，我们要的效果是原型指向的是原函数的 `prototype`，那么最直接的想法就是将绑定函数的 `prototype` 指向原函数的 `prototype` 即可。但是这样做有一个问题就是当我们后面改变绑定函数的 `prototype`，原函数的 `prototype` 也会被修改，他们指向的是同一个对象。基于这样的原因我们需要在中间加一层。最终的实现如下：

```javascript
Function.prototype._bind = function (thisArg) {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
  }
  let self = this
  let args = Array.prototype.slice.call(arguments, 1)

  let fNOP = function () {}
  let fBound = function () {
    let bindArgs = Array.prototype.slice.call(arguments)
    return self.apply(this instanceof fNOP ? this : thisArg, args.concat(bindArgs))
  }

  fNOP.prototype = this.prototype
  fBound.prototype = new fNOP()

  return fBound
}

function sum(c, d) {
  console.log(this.a, this.b) //undefined undefined
  this.a = c
  this.b = d
}

let obj = { a: 1, b: 2 }

let t = sum._bind(obj, 3)

let m = new t(4, 5)

console.log(m) //{3, 4}
```

我们可以看到最后结果使用的参数是 `bind` 的时添加的一个参数和 `new` 添加的第一个参数，`new` 的多余参数被忽略。这也是 `bind` 的另一个功能，可以预设参数。而我们也发现 `bind` 绑定的 `obj` 没有生效，这部分我们是用 `instanceof` 判断调用绑定函数时的 `this` 来判断的，如果是 `new` 调用，那么这个 `this` 是 `fNOP` 的实例（如果是直接调用，那么这个 `this` 会是全局对象，浏览器环境就是 `window` 对象）。

关于原生的 `bind` 和我们这个 `bind` 还有一个区别就是原生的 `bind` 生成的绑定函数的 `prototype` 是 `undefined`，并且同时 `newObj instanceof 绑定函数` 返回时 `true`，这是违反我们对 `instanceof` 的理解的，我在标准中也没有找到合理的解释。我们这里实现的绑定函数的 `prototype` 就是 `new fNOP()`，在我们的代码里，`t.prototype.__proto__ === sum.prototype` 将返回 `true`。关于这一点，在我的另一片文章 [apply和call, bing方法的应用](https://www.clloz.com/programming/front-end/js/2020/07/03/apply-call-bind/#bind 'apply和call, bing方法的应用') 的 `bind` 章节有更详细的说明

## 参考文章

1. [JavaScript深入之call和apply的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11 'JavaScript深入之call和apply的模拟实现')
2. [JavaScript 深入之 bind 实现](https://github.com/mqyqingfeng/Blog/issues/12 'JavaScript 深入之 bind 实现')
3. [Function.prototype.bind - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind 'Function.prototype.bind - MDN')
4. [面试官问：能否模拟实现JS的call和apply方法](https://juejin.im/post/6844903728147857415 '面试官问：能否模拟实现JS的call和apply方法')
