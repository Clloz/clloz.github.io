---
title: 'call, apply 和 bing方法的应用'
publishDate: '2020-07-03 12:00:00'
description: ''
tags:
  - js
  - 实用技巧
  - 编程技巧
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

`JavaScript` 中所有函数的构造函数为 `ƒ Function() { [native code] }`，所有函数的 `[[prototype]]` 默认指向 `Function.prototype`，在 `Function.prototype` 上有三个方法 `call`，`apply` 和 `bind`，他们共同的作用就是为函数调用指定的执行上下文，也是就是 `this` 的指向。本文来说一说这三个方法的区别和使用场景。

## call 和 apply

`call` 和 `apply` 基本上没有什么区别，不同的地方是他们所接受的参数不同。两者的第一个参数都是函数执行时使用的 `this` 值，后面的参数就有所不同。`apply` 接受一个数组或类数组对象（比如 `arguments`），而 `call` 接受一组参数列表。

```javascript
//apply
func.apply(thisArg, [argsArray])

//call
function.call(thisArg, arg1, arg2, ...)
```

在 `JavaScript` 中参数的个数是有上限的，`JavaScriptCore` 引擎中有被硬编码的 参数个数上限：`65536`。但是实际能接受多少参数取决于当前的系统和浏览器，并不确定。比如我用下面的代码生成元素值为元素下标的数组，在 `safari` 中的上限是 `65536`，在 `chrome` 中是 `125382`。`let a = Object.keys(Array.apply(null, {length:125382}))`。任何用到超大栈空间的行为都有可能出现这个现象，超出限制则会报错 `Uncaught RangeError: Maximum call stack size exceeded`。

> 请注意，`this` 可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 `null` 或 `undefined` 时会自动替换为指向全局对象，原始值会被包装。

## 应用

##### 类数组对象调用数组方法

`JavaScript` 中有类数组对象，最常见的就是所有非箭头函数中都可以使用的局部变量 `arguments`，还有 `DOM` 操作返回的 `NodeList` 集合，它类似于 `Array`，但除了 `length` 属性和索引元素之外没有任何 `Array` 属性。例如，它没有 `pop` 方法。但是它可以被转换为一个真正的 `Array`。

```javascript
var args = Array.prototype.slice.call(arguments)
var args = [].slice.call(arguments)

// ES2015
const args = Array.from(arguments)
const args = [...arguments] //扩展运算符
```

> 实际上我们也可以自己定义类数组对象，只要有索引和 `length` 即可，`{'length': 2, '0': 'eat', '1': 'bananas'}`。

##### 数组拼接

我们可以用 `push` 方法为数组添加新的元素，虽然 `push` 方法接受可变参数，但是如果我们以数组作为参数的话，它只是把这个数组所谓一个元素添加，如果想把两个数组进行拼接，那么可以用 `concat`，但是 `concat` 是返回一个新的数组，如果只是想要将两个数组拼接，可以用 `apply`。

```javascript
var array = ['a', 'b']
var elements = [0, 1, 2]
array.push.apply(array, elements)
console.info(array) // ["a", "b", 0, 1, 2]
```

##### 用数组替代参数列表

其实从上面的例子就可以看出，对于一些可能需要很长参数列表的函数，`apply` 都可以让我们用数组来代替参数列表，比如 `Math.max` 和 `Math.min` 等。

```javascript
/* 找出数组中最大/小的数字 */
var numbers = [5, 6, 2, 3, 7]

/* 应用(apply) Math.min/Math.max 内置函数完成 */
var max = Math.max.apply(
  null,
  numbers
) /* 基本等同于 Math.max(numbers[0], ...) 或 Math.max(5, 6, ..) */
var min = Math.min.apply(null, numbers)
```

> 这样使用的风险就是如果数组非常大，在函数调用的时候可能参数个数会超出引擎的限制（JavaScript 核心中已经做了硬编码 参数个数限制在 `65536`，具体数值由引擎决定），如果遇到这种情况可以把数组切块循环执行。

##### 继承

```javascript
function Animal(name) {
  this.name = name
  this.showName = function () {
    console.log(this.name)
  }
}

function Cat(name) {
  Animal.call(this, name)
}
```

## bind

`bind` 和前面两者不一样的是他并不是立即调用函数，而是返回一个新的函数。`bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。`bind` 方法返回一个原函数的拷贝，并拥有指定的 `this` 值和初始参数。还有一点是 如果 `bind` 函数的参数列表为空，或者第一个参数是 `null` 或 `undefined`，执行作用域的 `this` 将被视为新函数的 `thisArg`。`apply` 和 `call` 则是如果这个函数处于非严格模式下，则指定为 `null` 或 `undefined` 时会自动替换为指向全局对象，原始值会被包装。

## bind 的 new 调用

`bind` 的另一个不同于 `apply，bind` 的特点就是 `bind` 创建一个指定了 `this` 的绑定函数，但是这个函数支持 `new` 调用。当绑定函数进行这种 `new` 形式的构造函数调用的时候，绑定的 `this` 将不再生效，而是用 `new` 创建的新对象作为 `this`，但是绑定的参数依然可用。可以看一下例子：

```javascript
function Bound(a, b) {
  console.log(this.a, this.b)
  this.a = a
  this.b = b
  console.log(this.a, this.b)
}

let obj = { a: 10, b: 20 }

let bFun = Bound.bind(obj, 1, 2)
bFun() //10 20   1 2

let bObj = new bFun(3, 4) //undefined,undefined    1 2
console.log(bObj instanceof Bound) //true
console.log(bObj instanceof bFun) //true
console.log(bObj.__proto__ === Bound.prototype) //true
console.log(bFun.prototype) //undefined
```

我们可以看到当我们直接调用绑定函数，我们的绑定的 `this` 也就是 `obj` 生效了，传入的参数也生效了。当我们用 `new` 调用绑定函数，绑定的 `this` 并没有生效（第一个 `console.log(this.a, this.b);` 输出 `undefined`），但是传入的参数生效了（`Bound` 只接受两个参数，最后生效的是 `bind` 时传入的参数，而不是 `new` 的时候传入的参数）。

`bind` 的 `new` 比较奇怪的地方就是生成的绑定函数的 `prototype` 是 `undefined`，但是生成对象 `bObj` 进行 `bObj instanceof bFun` 依然返回 `true`，而且生成对象 `bObj` 的 `[[prototype]]` 指向的是原函数 `Bound` 的 `prototype`。这里我没有找到具体的原因，在模拟实现 `bind` 的时候也无法达到这个效果。

## 应用

##### 创建绑定函数

```javascript
this.x = 9 // 在浏览器中，this 指向全局的 "window" 对象
var module = {
  x: 81,
  getX: function () {
    return this.x
  }
}

module.getX() // 81

var retrieveX = module.getX
retrieveX()
// 返回 9 - 因为函数是在全局作用域中调用的

// 创建一个新函数，把 'this' 绑定到 module 对象
// 新手可能会将全局变量 x 与 module 的属性 x 混淆
var boundGetX = retrieveX.bind(module)
boundGetX() // 81
```

##### 预设函数初始参数

这种用法可以为函数设置一些初始参数，有点类似函数柯里化。

```javascript
function list() {
  return Array.prototype.slice.call(arguments)
}

function addArguments(arg1, arg2) {
  return arg1 + arg2
}

var list1 = list(1, 2, 3) // [1, 2, 3]

var result1 = addArguments(1, 2) // 3

// 创建一个函数，它拥有预设参数列表。
var leadingThirtysevenList = list.bind(null, 37)

// 创建一个函数，它拥有预设的第一个参数
var addThirtySeven = addArguments.bind(null, 37)

var list2 = leadingThirtysevenList()
// [37]

var list3 = leadingThirtysevenList(1, 2, 3)
// [37, 1, 2, 3]

var result2 = addThirtySeven(5)
// 37 + 5 = 42

var result3 = addThirtySeven(5, 10)
// 37 + 5 = 42 ，第二个参数被忽略
```

##### 快捷调用

这是一个 `mdn` 上给出的示例。当我们需要频繁调用一个指定 `this` 的函数，我们可以用 `bind` 来实现快捷调用。举个例子子，我们相对类数组对象（比如 `arguments`）执行数组方法（比如 `slice`），我们一般是 `Array.prototype.slice.apply(arguments)`，当我们需要频繁使用这个方法的时候，我们可能会这样 `let slice = Array.prototype.slice; slice.apply(arguments);`。如果我们使用 `bind`，我们可以直接 `slice(arguments)` 这样调用，更方便，具体实现看下面的代码。

```javascript
var slice = Array.prototype.slice

// ...

slice.apply(arguments)

// 与前一段代码的 "slice" 效果相同
var unboundSlice = Array.prototype.slice
var slice = Function.prototype.apply.bind(unboundSlice)

// ...

slice(arguments)
```

要理解这段代码我们需要理解 `apply` 本身也是一个函数，它是在 `Function.prototype` 上定义的一个函数，所有函数都能调用它。当我们用 `func.apply()` 调用 `apply` 的时候，本质就是以 `func` 作为 `this` 调用 `apply`。那么第二种实现就是用 `Array.prototype.slice` 作为 `this` 创建 `apply` 的一个绑定函数。当我们调用这个绑定函数的时候就相当于调用 `Array.prototype.slice.apply()`。

## 模拟实现 call，apply 和 bind

关于如何手写 `call， apply，bind` 我在另一篇文章中写下了详细的过程，点击查看 [模拟实现call，apply 和 bind](https://www.clloz.com/programming/front-end/js/2020/10/07/simulation-of-call-apply-bind/ '模拟实现call，apply 和 bind')。

## 参考文章

1. MDN
