---
title: 'JavaScript 原型机制'
publishDate: '2020-09-11 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
  - 编程技巧
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

原型链的概念相信大家都知道，`ES6` 出来以后可能关注度没有以前那么高的。虽然在 `ES2015/ES6` 中引入了 `class` 关键字，但那只是语法糖，`JavaScript` 仍然是基于原型的，作为 `JavaScript` 中的主要继承方式，我们有必要深入理解它。理解了原型之后，你对对象的理解也会更深入。

## 原型机制

原型机制说起来很简单，就是一个对象可以访问它原型对象上的属性和方法，从而实现属性和方法的复用。而原型对象又有自己的原型对象，这样原型就构成了一个链式结构，也就是我们说的原型链。一个对象可以访问自己原型链上的所有方法和属性。

`JavaScript` 中的继承只有一种结构：对象。每个实例对象（ `object` ）都有一个私有属性（称之为 `__proto__`，引擎内部是 `[[prototype]]` ）指向它的构造函数的原型对象（`prototype` ）。该原型对象也有一个自己的原型对象( `__proto__` ) ，层层向上直到一个对象的原型对象为 `null`。根据定义，`null` 没有原型，并作为这个原型链中的最后一个环节。

在 `JavaScript` 中，我们知道的数据类型有 `Number, String, Undefined, Null, Boolean, BigInt, Symbol` 七个基础类型，还有就是一个引用类型 `Object`。在内置对象比如 `Function, Array, Date, RegExp` 等中，`Function` 是一个特殊的内置对象。

我们将 `JavaScript` 中的对象分成两大类，一类是 `Object` ，一类就是 `Function`。我们来说一下他们之间的关系。

---

我们创建对象有很多种方法，`Object.create()`，`new Object()`，`new function()`，和对象字面量等。但其实他们的本质都是 `new Object()` （关于 `new` 和对象创建的内容参考另外两篇文章：[JavaScript对象属性类型和赋值细节](https://www.clloz.com/programming/front-end/js/2020/09/09/javascript-object-prop-assign/ 'JavaScript对象属性类型和赋值细节') 和 [JavaScript中new操作符的解析和实现](https://www.clloz.com/programming/front-end/js/2020/06/29/new-operator/ 'JavaScript中new操作符的解析和实现')）。

## Object.prototype.**\_\_proto\_\_**

我们用 `new Object()` 创建一个空对象，它在 `Chrome` 中打印出的结果如下。

![proto3](./images/proto1.png 'proto1')

我们可以看到所谓的 **空对象**，并不是完全空的，它内部有一个 `__proto__` 属性。但其实这个属性并不是它自身的，这个属性是 `Object.prototype.__proto__`，一个访问器属性（一个 `getter` 函数和一个 `setter` 函数）, 暴露了通过它访问的对象的内部 `[[Prototype]]` (一个对象或 `null`)。

> 这里要注意，`Object.prototype.__proto__` 和内部的 `[[prototype]]` 并不是同一个东西。我们的原型是靠内部的 `[[prototype]]` 链接的，`Object.prototype.__proto__` 只是浏览器提供的一个访问器属性向我们暴露 `[[prototype]]`。

这个属性是由浏览器厂商提供的，并且目前绝大多数的浏览器都支持这个属性，所以 `ECMAScript 2015` 中也将其写入标准附录中，保持浏览器的兼容性。但是直接修改对象的 `[[prototype]]` 在任何引擎和浏览器中都是非常慢并且影响性能的操作，使用这种方式来改变和继承属性是对性能影响非常严重的，并且性能消耗的时间也不是简单的花费在 `obj.__proto__ = ...` 语句上, 它还会影响到所有继承来自该 `[[Prototype]]` 的对象。标准中还提供了两组关于读写原型对象的方法 `Object.getPrototypeOf/Reflect.getPrototypeOf` 和 `Object.setPrototypeOf/Reflect.setPrototypeOf`。不过写对象和上面说的一样，依然是一个影响性能的操作，如果你关心性能，不应该用这些方法。比较好的实践是用 `Object.create()` 来设置原型，用 `Object.getPrototypeOf()` 来读取原型对象。

> 我们同样可以用对象字面量来设置 `__proto__`，也可以自定义 `__proto__` 来覆盖 `Object.prototype.__proto__`。参考文章：[JavaScript对象属性类型和赋值细节](https://www.clloz.com/programming/front-end/js/2020/09/09/javascript-object-prop-assign/ 'JavaScript对象属性类型和赋值细节')。

不同类型的对象其 `[[prototype]]` 是不同的，对于使用数组字面量创建的对象，这个值是 `Array.prototype`。对于 `functions`，这个值是 `Function.prototype`。对于使用 `new fun` 创建的对象，其中 `fun` 是由 `js` 提供的内建构造器函数之一(`Array, Boolean, Date, Number, Object, String` 等等），这个值总是 `fun.prototype`。对于用 `js` 定义的其他 `js` 构造器函数创建的对象，这个值就是该构造器函数的 `prototype` 属性。关于内置对象之间的关系，我们后面会详细讨论。

## Object 和 Function

`Object` 和 `Function` 是 `JavaScript` 中最重要的两个对象，他们同时也是构造函数 `function Object(), function Function()`。几乎所有对象都是 `function Object()` 的实例，而所有函数都是 `function Function()` 的实例，包括 `Object` 也是由 `Function` 构造的。

我们上面说过对象内部有一个 `[[prototype]]` 属性指向它的源性对象；而每一个函数都有一个 `prototype` 属性，指向由这个函数构造出的对象的 `[[prototype]]`。更准确的说，在函数被创建的时候，就有一个 `prototype` 属性指向一个对象，这个对象本身只有一个 `constructor` 属性指向这个函数。当用 `new func()` 创建对象的时候，新对象的 `[[prototype]]` 就指向构造函数的 `prototype` 对应的对象。不过需要注意的是 `prototype` 和 `constructor` 都是可以 **重写** 的。

![proto3](./images/proto2.png 'proto2')

对于我们的自定义对象，这是很好理解的。那么内置对象之间的关系，特别是 `Object` 和 `Function` 之间的关系是怎么样的呢。先明确两点：

1. 一切函数都是由 `function Function()` 构造的，所以函数的 `[[prototype]]` 指向 `Function.prototype`。
2. 所有由 `function Object()` 构造的非函数对象的 `[[prototype]]` 指向 `Object.prototype`。
3. 函数的创建的同时，会创建一个 `function.prototype` 对象，该对象是一个由 `function Object()` 构造的对象。`prototype` 属性可以任意指定，指定的对象内可能没有 `constructor` 属性或者是错误的 `constructor`。
4. 所有非函数对象都是由构造函数通过 `new` 运算符创建的（本质都是 `new Object()`，很多内置对象可以省略 `new`，比如 `Function`， `Object`，`Array`，省略和不省略效果是一样的)。这个构造函数要么是自定义的（由 `function Function()` 构造），要么是 `function Object()`。
5. 自定义函数手动指定 `prototype` 为其它自定函数的实例， 可以让我们实现链式继承，这条链最终有一个节点会是有 `function Object()` 构造的对象，它的 `[[protottype]]` 指向 `Object.prototype`。所以我们可以说，所有的非函数对象都是 `function Object()` 的实例。

其实记住这几点就可以应对绝大部分问题，如果你还对内置对象的关系有兴趣，可以继续往下看。

---

根据我们上面的两条规律我们可以知道 `Object` 的 `[[prototype]]` 指向 `Function.prototype`，那么 `function Function()` ，`Function.prototype` 和 `Object.prototype` 的 `[[prototype]]` 都分别是什么呢？

先说 `Object.prototype`，它是所有非函数对象的 `[[prototype]]` 指向，而它自己的 `[[prototype]]` 指向的就是 `null`，也就是一切对象的原型链的终点。它的 `constructor` 属性指向 `function Object()`

而 `function Function()` 的 `[[prototype]]` 和其它的函数一样，指向 `Function.prototype`，也就是说 `function Function()` 的 `prototype` 和 `[[prototype]]`指向的是同一个对象 `Function.prototype`。

`Function.prototype` 的 `[[prototype]]` 指向的是 `Object.prototype`。`consctructor` 指向的是 `function Function()`。其实 `Function.prototype` 本身就是函数，可以直接调用，接受任何参数并返回 `undefined`。

为什么要这样呢？我认为是确保每一个函数对象，非函数对象，他们的原型链上都有 `Object.prototype`，都能够访问 `Object.prototype` 上定义的一些公有方法。

```javascript
constructor: ƒ Object()
hasOwnProperty: ƒ hasOwnProperty()
isPrototypeOf: ƒ isPrototypeOf()
propertyIsEnumerable: ƒ propertyIsEnumerable()
toLocaleString: ƒ toLocaleString()
toString: ƒ toString()
valueOf: ƒ valueOf()
__defineGetter__: ƒ __defineGetter__()
__defineSetter__: ƒ __defineSetter__()
__lookupGetter__: ƒ __lookupGetter__()
__lookupSetter__: ƒ __lookupSetter__()
get __proto__: ƒ __proto__()
set __proto__: ƒ __proto__()
```

想要更清晰的看清楚我上面说的关系，可以借助于这张来自网上的图，画的非常好。

![proto3](./images/proto3.jpg 'proto3')

## 其他内置对象

最后在说一说其他的内置对象，绝大多数内置对象都是函数对象（`BigInt`，`Math`，`JSON` 和 `Reflect` 不是函数对象），虽然有些不能用 `new` 操作符（比如 `Symbol`，有些对象用不用 `new` 表现一样，比如 `Object`， `Function`，`Array` 等）。所以内置对象的 `[[prototype]]` 指向 `function.prototype`。内置对象的 `prototype` 一般来说就是一个普通的对象（用 `function Object()` 构造的）。这个对象上挂载了很多该类型可以使用的方法，比如 `Array.prototype` 有如下属性：

```javascript
concat: ƒ concat()
constructor: ƒ Array()
copyWithin: ƒ copyWithin()
entries: ƒ entries()
every: ƒ every()
fill: ƒ fill()
filter: ƒ filter()
find: ƒ find()
findIndex: ƒ findIndex()
flat: ƒ flat()
flatMap: ƒ flatMap()
forEach: ƒ forEach()
includes: ƒ includes()
indexOf: ƒ indexOf()
join: ƒ join()
keys: ƒ keys()
lastIndexOf: ƒ lastIndexOf()
length: 0
map: ƒ map()
pop: ƒ pop()
push: ƒ push()
reduce: ƒ reduce()
reduceRight: ƒ reduceRight()
reverse: ƒ reverse()
shift: ƒ shift()
slice: ƒ slice()
some: ƒ some()
sort: ƒ sort()
splice: ƒ splice()
toLocaleString: ƒ toLocaleString()
toString: ƒ toString()
unshift: ƒ unshift()
values: ƒ values()
Symbol(Symbol.iterator): ƒ values()
Symbol(Symbol.unscopables): {copyWithin: true, entries: true, fill: true, find: true, findIndex: true, …}
__proto__: Object
```

需要注意的一点是，几乎所有内置对象的属性都是不可枚举的，所以无论是 `for ... in` 还是 `Object.keys()` 都是无法枚举这些属性的。我们自己也可以在内置对象的 `prototype` 上添加属性或者方法，让所有该类型的对象都能使用。

基本包装类型 `String`，`Number` 和 `Boolean` 在一般情况下不要使用创建对象的方式来初始化对应的类型。使用这种方式创建的值都是对象（使用 `typeof` 返回 `object`），而且所有基本包装类型的对象都会被转换为布尔值 `true`。看下面的代码。

```javascript
console.log(typeof String('')) //string
console.log(typeof new String('')) //object
console.log(!!'') //false
console.log(!!String('')) //false
console.log(!!new String('')) //true

console.log(typeof Number(0)) //number
console.log(typeof new Number(0)) //object
console.log(!!0) //false
console.log(!!Number(0)) //false
console.log(!!new Number(0)) //true

console.log(typeof Boolean('')) //string
console.log(typeof new Boolean('')) //object
console.log(!!Boolean('')) //false
console.log(!!new Boolean('')) //true
```

关于 `constructor` 和 `prototype` 有一个有趣的小题目，可以看一看：[关于constructor和prototype的思考](https://www.clloz.com/programming/front-end/js/2019/05/31/prototype-constructor/ '关于constructor和prototype的思考')

## 参考文章

1. [继承与原型链 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain '继承与原型链')
2. [Object.prototype.**proto** - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/proto 'Object.prototype.__proto__ - MDN')
