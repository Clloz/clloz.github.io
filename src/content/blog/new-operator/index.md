---
title: 'JavaScript中new操作符的解析和实现'
publishDate: '2020-06-29 12:00:00'
description: ''
tags:
  - js
  - 实用技巧
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

`new` 运算符是我们在用构造函数创建实例的时候使用的，本文来说一下 `new` 运算符的执行过程和如何自己实现一个类似 `new` 运算符的函数。

## new 运算符的运行过程

`new` 运算符的主要目的就是为我们创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例（比如箭头函数就没有构造函数，所以是不能 `new` 的）。`new` 操作符的执行大概有以下几个步骤：

1. 创建一个新的空对象
2. 把新对象的 `__proto__` 链接到构造函数的 `prototype` 对象（每一个用户定义函数都有一个 `prototype` 属性指向一个对象，该对象有一个 `constructor` 属性指向该函数），让我们的公共属性和方法可以从原型上继承，不用每个实例都创建一次。
3. 将第一步创建的新的对象作为构造函数的 `this` 的上下文，执行构造函数，构造函数的执行让我们配置对象的私有属性和方法。
4. 执行构造函数，如果构造函数没有返回值或者返回值不是一个对象，则返回 `this`。

我么可以用代码简单表示上面的逻辑：

```javascript
function new_(constr, ...rests) {
  var obj = {}
  obj.__proto__ = constr.prototype
  var ret = constr.apply(obj, rests)
  return isPrimitive(ret) ? obj : ret //判断构造函数的返回值是否为对象，不是则直接返回创建的obj对象
}
```

## new 的实现

上面讲了 `new` 运算符的执行过程，下面我们来自己动手实现一个 `new` 运算符。

```javascript
function new_(constr, ...rests) {
  if (typeof constr !== 'function') {
    throw 'the first param must be a function'
  }
  new_.target = constr
  var obj = Object.create(constr.prototype)
  var ret = constr.apply(obj, rests)
  var isObj = typeof ret !== null && typeof ret === 'object'
  var isFun = typeof ret === 'function'
  //var isObj = typeof ret === "function" || typeof ret === "object" && !!ret;
  if (isObj || isFun) {
    return ret
  }
  return obj
}

function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.say = function () {
  console.log(this.name)
}
var p1 = new_(Person, 'clloz', '28')
var p2 = new_(Person, 'csx', '31')
console.log(p1) //Person {name: "clloz", age: "28"}
p1.say() //clloz
console.log(p2) //Person {name: "csx", age: "31"}
p2.say() //csx

console.log(p1.__proto__ === Person.prototype) //true
console.log(p2.__proto__ === Person.prototype) //true
```

以上就是一个简单的 `new` 实现，判断是否为对象那里可能不是很严谨，不过没有想到更好的方法。

一个小补充，在 `mdn` 的 `Function.prototype.apply()` 词条中看到的直接把方法写到 `Function.prototype` 上，也是个不错的思路，`Function.prototype` 在所以函数的原型链上，所以这个方法可以在每个函数上调用，方法内部的 `this` 也是指向调用方法的函数的。

```javascript
Function.prototype.construct = function (aArgs) {
  var oNew = Object.create(this.prototype)
  this.apply(oNew, aArgs)
  return oNew
}
```

## 强制用 new 调用构造函数

```javascript
function Clloz(...arguments) {
  if (!(this instanceof Clloz)) {
    return new Clloz(...arguments)
  }
}
```

## new 的特殊行为

我今天偶然突然奇想，如果一个函数的 `prototype` 属性被我设为一个非对象的属性，再 `new` 会发生什么。结果非常出乎我的意料。

```javascript
let a = function () {};

a.prototype = false;

let b = new a();

b instance of a; //Uncaught TypeError: Function has non-object prototype 'false' in instanceof check

a.prototype === false;  //true

b.__proto__ === Object.prototype //true
```

由 `a` 创建的对象 `b` 现在好像被 `function Object()` 创建的一样。我在标准中没有找到讲 `new` 执行细节的，标准中只是说执行构造函数 内部的一个 `[[contruct]]` 方法。

## Tips

补充三个关于 `new` 运算符的知识点。

1. 上面提到 `new` 的执行过程的最后一步，如果构造函数没有返回值或者返回值不是一个对象，则返回 `this`。但是如果返回的是一个 `null` 的话，依然返回 `this`，虽然 `null` 也算是 `object`。
2. `new` 操作符后面的构造函数可以带括号也可以不带括号，除了带括号可以传递参数以外，还有一个重要的点是两种用法的运算符优先级不一样，在[JS运算符优先级](https://www.clloz.com/programming/front-end/js/2019/04/05/operator-precedence/ 'JS运算符优先级')这篇文章中有提到，带参数的 `new` 操作符的优先级是比不带参数的要高的，`new Foo() > Foo() > new Foo`。
3. 运算符优先级相关：对于 `new`，函数调用，成员访问三者结合的情况，比如 `new obj1.obj2.obj3.fun().prop` 这样的情况，我个人总结就是函数调用直接到前面的 `new` 先计算，得到的结果在进行成员访问。

一般不太会遇到，可能有些题目会问这些问题。

## 参考文章

1. [能否实现JS的new操作符](https://juejin.im/post/5bde7c926fb9a049f66b8b52 '能否实现JS的new操作符')
