---
title: 'JavaScript对象属性类型和赋值细节'
publishDate: '2020-09-09 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
heroImage: {"src":"./javascript-logo.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

在研究 `JavaScript` 中深浅拷贝的方式的时候遇到一个违反我直觉的内容，就是 `JavaScript` 对象在和原型对象的情况下的赋值行为。本文介绍一下这部分的一些细节。

## 问题

在研究 `Object.create` 方法的时候，发现用 `Object.create` 创建的对象的时候，给访问到的原型中的属性赋值的时候会在新创建的对象中新建这个属性。看如下代码：

```javascript
let Obj = {
    a: 1,
    b: 2
}

let obj = Object.create(Obj);

obj.a = 10;

console.log(obj, Obj); //{ a: 10 } { a: 1, b: 2 }
```

我也曾使用这个方法来复制对象的属性。但是今天仔细看里面的细节，发现这是违反我直觉的。我自己的思路是，`obj` 对象没有 `a` 属性，所以访问到的是原型 `Obj` 上的 `a` 属性，那么我修改属性的时候应该修改的也是原型上的属性。但是实际情况是一个 `a` 属性在 `obj` 对象上创建，原型上的 `a` 属性还保持原来的状态。

其实仔细想一下，这种处理才是合理的。原型存在的目的是为了继承，继承的目的本质也是为了复用。而用来复用的方法或者属性随便就被修改了，会影响到很多其他对象。所以 `JavaScript` 的这种处理是合理的。

我们可以把原型中的属性认为是一个**默认值**，当我们的对象没有对应属性的时候，原型能够提供一个默认值给我们，而默认值是不应该随便被修改的。甚至当我们用 `delete` 删除对象的属性的时候，原型上的同名属性依然是可以访问的，这也正是原型的意义。而且仔细想一想，非常频繁被使用的赋值操作都可以修改原型上的属性的话，将会是非常危险的。

## 深入

上面我们对属性的赋值的行为举了一个例子，在参考了网络上的其他文章后，我发现这个简单的赋值行为其实还有更多可以研究的行为。

## 属性类型

在分析具体的情况之前我们先说一下 `JavaScript` 中对象的属性。`JavaScript` 中属性分为两种类型，一种是数据属性 `data properties`，一种是访问器属性 `accessor properties`。`JavaScript` 标准还定义了一些用来描述属性的 **特性** `attributes`。属性的精确描述方式称为属性描述符 `properties descriptor`，也是 `Object.defineProperty()` 方法的第三个参数，数据属性的描述符称为 `data descriptor`，访问器属性的描述符称为 `accessor descriptor`。

属性描述符其实就是对属性的精确定义，数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。访问器描述符是由 `getter` 函数和 `setter` 函数所描述的属性。一个描述符只能是这两者其中之一，不能同时是两者。这两种描述符都是对象。

数据描述符和访问器描述符都支持支持以下两个 `attribute` 描述属性：

- `configurable`：特性表示对象的属性是否可以被删除，以及除 `value` 和 `writable` 特性外的其他特性是否可以被修改。。默认为 `false`。`configurable` 属性设置为 `false`，则该属性被认为是 **不可配置的**，并且没有属性可以被改变（除了单向改变 `writable` 为 `false`）。当属性不可配置时，不能在数据和访问器属性类型之间切换。
- `enumerable`：当且仅当该属性的 `enumerable` 键值为 `true` 时，该属性才会出现在对象的枚举属性中。默认为 `false`。定义了对象的属性是否可以在 `for...in` 循环和 `Object.keys()` 中被枚举。

数据描述符还支持两个独占的 `attribute` 来描述属性：

- `value`：该属性对应的值。可以是任何有效的 `JavaScript` 值（数值，对象，函数等）。默认为 `undefined`。
- `writable`：当且仅当该属性的 `writable` 键值为 `true` 时，属性的值，也就是上面的 `value`，才能被赋值运算符改变。默认为 `false`。

访问器属性也有两个独占的 `attribute` （两个都是函数）来描述属性：

`get`：属性的 `getter` 函数，如果没有 `getter`，则为 `undefined`。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 `this` 对象（由于继承关系，这里的 `this` 并不一定是定义该属性的对象，比如是从原型脸上访问到的 `get`）。该函数的返回值会被用作属性的值。默认为 `undefined`。 `set`：属性的 `setter` 函数，如果没有 `setter`，则为 `undefined`。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 `this` 对象。默认为 `undefined`。

`get` 和 `set` 并一定要成对出现，只指定 `getter` 意味着属性是不能写，尝试写入属性会被忽略。 在严格模式下，尝试写入只指定了 `getter` 函数的属性会抛出错误。类似地，只指定 `setter` 函数的属性也不能读，否则在非严格模式下会返回 `undefined`，而在严格模式下会抛出错误。

```javascript
// this 指向
function myclass() {
}

Object.defineProperty(myclass.prototype, "x", {
  get() {
    return this.stored_x;
  },
  set(x) {
    this.stored_x = x;
  }
});

var a = new myclass();
var b = new myclass();
a.x = 1; //this 是 a
console.log(b.x); // undefined //this 是 b
```

拥有布尔值的特性 `configurable`、`enumerable` 和 `writable` 的默认值都是 `false`。属性值和函数的键 `value`、`get` 和 `set` 字段的默认值为 `undefined`。默认值在描述符省略某些字段时启用。对于直接用对象字面量或属性访问器（点运算符或者方括号运算符）赋值的方式（比如 `obj.a = 10` ）创建的属性其数据描述符中的属性的默认值和 `Object.defineProperty()` 方法是不同的，参考如下代码：

```javascript
let a = {
    m: 1,
    set t(arg) {}
}
console.log(Object.getOwnPropertyDescriptors(a))

//{
//  m: { value: 1, writable: true, enumerable: true, configurable: true },
//  t: {
//      get: undefined,
//      set: [Function: set t],
//      enumerable: true,
//      configurable: true
//  }
//}
```

一个 `configurable` 为 `true` 的属性是可以在数据属性和访问器属性之间切换，方法就是用 `Object.defineProperty()` 方法重新定义一个同名属性。

```javascript
let a = {}
a.m = 10; //字面量定义，所有的布尔型 attribute 都为 true

Object.defineProperty(a, 'm', {
    get () {
        return 100;
    }
})

console.log(a.m) //100

Object.defineProperty(a, 'm', {
    value: 20
})

console.log(a.m) //20
```

如果一个描述符不具有 `value`、`writable`、`get` 和 `set` 中的任意一个键，那么它将被认为是一个数据描述符。如果一个描述符同时拥有 `value` 或 `writable` 和 `get` 或 `set` 键，则会产生一个异常。

无论是数据属性还是访问器属性，都是可以从原型上继承的。如果原型上是一些不希望被修改的默认值，可以用 `Object.freeze` 冻结源性对象，防止后续代码添加或删除对象原型的属性。

如果原型上有了同名的访问器属性，那么你无法用属性访问器（点运算符或者方括号运算符）赋值的方式，比如 `obj.a = 10`，在子对象上创建同名属性（只能用 `Object.defineProperty() 方法`），在子对象上访问或者修改这个属性都会调用原型上的 `get` 或者 `set` 方法（如果只指定了一个，那么行为参考上面的 `get` 和 `set` 部分）。和访问器属性不一样，数据属性始终在对象自身上设置，而不会影响到原型上的属性。但如果一个不可写的属性被继承，它仍然可以防止修改对象的属性。这也是我们这篇文章讨论的重点。

```javascript
//只设置set
let value = 10;
let a = {
    set m (m) {
        value = m; 
    },
}
let b = Object.create(a)
console.log(a.m) //没有设置get 返回undefined 严格模式下报错
console.log(b.m) //b对象没有m属性，调用a的get方法。返回undefined，同上
Object.defineProperty(b, 'm', {
    value: 100,
    writable: true,
    configurable: true,
    enmerable: true
})
console.log(b) //{m: 100}
console.log(b.m, a.m) //100 undefined

//只设置get
let value = 10;
let a = {
    get m () {
        return value;
    },
}
let b = Object.create(a)
console.log(a.m)//10
a.m = 100; //没有设置set，赋值会被忽略，严格模式下报错
console.log(a.m) //10

console.log(b.m) //10, b上面没有m属性，返回a.m
b.m = 100 //属性访问器（点运算符或方括号运算符）无法创建同名属性
console.log(b.m) //10, 依然返回a.m
Object.defineProperty(b, 'm', {
    value: 100,
    writable: true,
    configurable: true,
    enmerable: true
})
console.log(b, b.m) //{m:100} 100
console.log(a.m) //10 a对象不受影响
```

我们平时可能使用数据属性比较多，但是其访问器属性也有很多应用场景。比如我们属性的 `Vue` 的双向数据绑定就是用 `set` 实现的。

## 赋值行为

##### 原型链上没有同名属性

这是最简单的情况，会直接在子对象上创建一个新的属性。`JavaScript` 会现在子对象中检索该属性，如果没有找到则会沿着原型链寻找到原型链的终点 `null`，在原型链的任何位置找到会立即返回找到的值。

```javascript
let a = {}
let b = Object.create(a);
b.m = 10;
console.log(b) //{m: 10}
```

##### 原型链上有同名可写属性

这种情况就是开头的问题中提到的情况，同样会在子对象上创建新的属性。

```javascript
let a = {
    m: 2
}
let b = Object.create(a);
b.m = 10;
console.log(a) //{m: 2} a对象不变
console.log(b) //{m: 10}
```

##### 原型链上有同名不可写属性

这种情况下不会在子对象上创建新的属性，赋值也不会执行，在严格模式下会报错。至于为什么这样设计，[贺师俊](https://www.zhihu.com/question/31934148/answer/53949560 "贺师俊") 认为是保持 `getter-only property`（只定义了`get` 方法的访问器属性，上面详细介绍了） 和 `non-writable property` 行为的一致。`You Dont Know Js` 则认为是为了保持和传统语言继承表现的一致。

```javascript
//'use strict'
let a = {}
Object.defineProperty(a, 'm', {
    value: 10,
    configurable: true,
    enumerable: true,
    writable: false
})

console.log(a.m)
a.m = 100 //无效，严格模式下会报错 TypeError: Cannot assign to read only property 'm' of object

let b = Object.create(a);
console.log(b.m)
b.m = 200 //无效，严格模式下报错
console.log(b) //{} 不会创建新的属性
```

##### 访问器属性

关于访问器属性，我在上一节详细介绍过了。如果不考虑用 `Object.defineProperty` 来定义属性描述符，我们是无法在子对象上创建新的同名属性的，我们对同名属性的操作都是在调用原型对象上对应属性的 `get` 和 `set` 方法，唯一不同的就是方法内的 `this` 指向会发生变化。

## 总结

其实对属性类型和赋值行为的讨论，最终还是会回到继承机制的问题上。属性的类型和继承的机制在标准的发展过程中也不是一成不变的，`ES5` 标准中属性描述里的特性都是没法直接在 `JS` 中访问和操作的，它只是在实现引擎是使用的。而现在 `getter` 和 `setter` 也能够让我们实现一些高级特性。而继承机制需要在很多方面取得一个平衡，比如复用，灵活性和数据的安全性等。

## 参考文章

1. [Object.defineProperty() - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty "Object.defineProperty() - MDN")
2. [js细节剖析](https://segmentfault.com/a/1190000016865771 "js细节剖析")