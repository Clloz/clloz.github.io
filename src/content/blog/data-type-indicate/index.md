---
title: 'JS数据类型和判断方法'
publishDate: '2020-06-29 12:00:00'
description: ''
tags:
  - js
  - 实用技巧
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

`JavaScript` 中目前有 `7` 种基本（原始`primitives`）数据类型 `Undefined`， `Null`，`Boolean`， `Number`， `String`，`BigInt`，`Symbol`，以及一种引用类型 `Object`，`Object` 中又包括 `Function`，`Date`，`JSON`，`RegExp`等，除了 `7` 种原始类型，其他的所有能够用 `new` 实例化的内置类型都是 `Object` 构造的。

`JavaScript` 是一种弱类型或者说动态语言。这意味着你不用提前声明变量的类型，在程序运行过程中，类型会被自动确定。这也意味着你可以使用同一个变量保存不同类型的数据。

## 数据类型

对于数据了类型我们可以通过 `typeof` 运算符来判断，具体结果看下图。

![typeof](./images/typeof.png 'typeof')

## 基本数据类型

基本数据类型 `primitive values` 也成为原始数据或原始类型。它们是一种既非对象也无方法的数据。在 `JavaScript` 中，共有 `7` 种基本类型：`string，number，bigint，boolean，null，undefined，symbol` (`ECMAScript 2016` 新增)。多数情况下，基本类型直接代表了最底层的语言实现。

所有基本类型的值都是不可改变的。但需要注意的是，基本类型本身和一个赋值为基本类型的变量的区别。变量会被赋予一个新值，而原值不能像数组、对象以及函数那样被改变。即基本类型值可以被替换，但不能被改变。比如，`JavaScript` 中对字符串的操作一定返回了一个新字符串，原始字符串并没有被改变。

原始类型中两个比较特殊的就是 `Undefined` 和 `Null`，他们两个类型都只有一个值就是 `undefined` 和 `null`。除了 `null` 和 `undefined` 之外，所有基本类型都有其对应的包装对象：

- `String` 为字符串基本类型。
- `Number` 为数值基本类型。
- `BigInt` 为大整数基本类型。
- `Boolean` 为布尔基本类型。
- `Symbol` 为字面量基本类型。

## Undefined

`undefined` 一般表示我们未对变量进行初始化。使用 `typeof` 操作符的时候，如果是未声明变量，同样也会返回 `undefined`，再比如未设置返回值的函数执行的结果是 `undefined`，未设置的参数也会被默认为 `undefined`。最后还有一点需要注意的是，`undefined` 并不是 `js` 的保留字，并且是全局对象的一个属性，在浏览器环境中就是 `window.undefined`。当在局部环境中，我们是可以自己给 `undefined` 属性赋值的，也就是重写 `undefined`，所以为了确保我们使用的 `undefined` 是未被重写的，我们可以使用 `void 0` 来代替。

## Null

`null` 可以简单理解为一个未被创建的对象，比如我们使用 `document.getElementById` 并没有找到对应元素的时候就会返回 `null`。`null` 和 `undefined` 有一些区别，在转换为 `Number` 的时候，`null` 会转换为 `0` 而 `undefined` 会转换为 `NaN`，执行 `typeof` 运算的时候，`undefined`返回 `undefined` 而 `null` 返回 `object`。使用 `==` 判断两者相等会返回 `true`，所以为了防止误判一般我们使用全等 `===`。`null` 是所有对象原型链的终点，`Object.prototype.__proto__ === null`。

关于 `null` 的使用，当我们声明一个变量是用来存储对象我们可以先赋值为 `null`，当一个对象不再需要的时候，我们可以设置为 `null` 解除这个引用。

## Number

根据 `ECMAScript` 标准，`JavaScript` 中只有一种数字类型：`基于 IEEE 754` 标准的双精度 `64` 位二进制格式的值。关于 `Number` 我已经在其他的文章中进行了深入的研究，你可以参考另外的文章：

1. [JavaScript 常用内置对象API - Number](https://www.clloz.com/programming/front-end/js/2020/07/10/built-in-objects-api/#Number 'JavaScript 常用内置对象API')
2. [JavaScript 中的 Number](https://www.clloz.com/programming/front-end/js/2019/06/11/javascript-number/ 'JavaScript 中的 Number')
3. [JavaScript 中的按位操作符](https://www.clloz.com/programming/front-end/js/2020/10/04/bitwise-operator/ 'JavaScript 中的按位操作符')

这里特别提一点上面几篇文章没有说的小细节，数字类型中只有一个整数有两种表示方法（正负）： `0` 可表示为 `-0` 和 `+0`（`0` 是 `+0` 的简写）。 在实践中，这也几乎没有影响。 例如 `+0 === -0` 为真。 但是，你可能要注意除以 `0` 的时候：

```javascript
42 / +0 // Infinity
42 / -0 // -Infinity
```

## String

`JavaScript` 中的 `String` 类型用于表示文本型的数据. 它是由无符号整数值（`16bit`）作为元素而组成的集合. 字符串中的每个元素在字符串中占据一个位置. 第一个元素的 `index` 值是 `0`, 下一个元素的 `index` 值是 `1`, 以此类推. 字符串的长度就是字符串中所含的元素个数.你可以通过 `String` 字面值或者 `String` 对象两种方式创建一个字符串。

如果你想对字符串有更多的了解可以参考我的另外几篇文章：

1. [搞懂字符编码](https://www.clloz.com/programming/assorted/2019/04/26/character-encoding/ '搞懂字符编码')
2. [JavaScript 常用内置对象 API - String](https://www.clloz.com/programming/front-end/js/2020/07/10/built-in-objects-api/#String 'JavaScript 常用内置对象 API - String')
3. [正则表达式入门以及JavaScript中的应用](https://www.clloz.com/programming/front-end/js/2020/08/05/regex-javascript-apply/ '正则表达式入门以及JavaScript中的应用')
4. [状态机和KMP算法](https://www.clloz.com/programming/front-end/js/2020/07/24/fsm-kmp/ '状态机和KMP算法')

## Symbol 和 BigInt

这两个都是 `ES6` 新增的原始数据类型，`Symbol` 类型的数据通过 `Symbol()` 方法的执行产生，不过需要注意的是 `Symbol` 不能作为构造函数，每个从 `Symbol()` 返回的 `symbol` 值都是唯一的。一个 `symbol` 值能作为对象属性的标识符；这是该数据类型仅有的目的。

而 `BigInt` 则是为了精确表示超出双精度浮点数的最大安全表示范围的大数而新增的基本数据类型。

## 判断数据类型的方法

## typeof 运算符

最简单的判断数据类型的方法是 `typeof` 运算符，返回值为字符串。`typeof` 的缺点是除了 `Function` 以外的其他所有对象的返回值都是 `object` （`null` 的返回值也是 `object`），如果我们需要区分不同的对象，就无法使用 `typeof`。

`js` 在底层存储变量的时候，会在变量的机器码的低位 `1-3` 位存储其类型信息：

- `000`：对象
- `010`：浮点数
- `100`：字符串
- `110`：布尔
- `1`：整数
- `but`, 对于 undefined 和 null 来说，这两个值的信息存储是有点特殊的。
- `null`：所有机器码均为0
- `undefined`：用 `−2^30` 整数来表示

所以，`typeof` 在判断 `null` 的时候就出现问题了，由于 `null` 的所有机器码均为 `0`，因此直接被当做了对象来看待。

## instanceof 运算符

`instanceof` 运算符是检测构造函数的原型是否出现在某个对象的原型链上。通过 `instanceof` 运算符我们可以实现对 `Object` 类型的细分，确定属于哪种对象。但是 `instanceof` 的缺点是只能对对象进行检测，对于基本数据类型的实例无法检测（字面量无法检测，但是通过基本包装类型的构造函数创建的基本类型可以进行检测）。

## constructor 属性

利用实例的 `constructor` 属性来辅助判断实例的数据类型也是一种手段。一般来说，实例本身是没有 `constructor` 属性的，我们所看到的属性都是 `实例.__proto__.constructor`，换言之也就是实例的构造函数，这种方式对基本数据类型也是有效的。这种方法的一个比较大的问题是 `constructor` 属性是个不受保护的属性，随时可能被更改，我们既可以给实例增加 `constructor` 属性，也可以修改构造函数的 `prototype` 的引用，也可以直接修改原型的 `constructor` 属性。

## Object.prototype.toString.call()

这是最安全准确的检测数据类型的方法，每一种数据类型的构造函数的原型上都有 `toString` 方法，但是除了 `Object.prototype`上的 `toString` 是用来返回当前实例所属类的信息（检测数据类型的），其余的都是转换为字符串的。该方法可以准确检测所有内置类型。自定义类型的返回值为 `Object Object`。

所有 `typeof` 返回值为 `"object"` 的对象(如数组)都包含一个内部属性 `[[Class]]` (我们可 以把它看作一个内部的分类，而非传统的面向对象意义上的类)。这个属性无法直接访问， 一般通过 `Object.prototype.toString(..)` 来查看。所以当我们使用 `Object.prototype.toString.call()` 的时候，实际上访问的是对象的内容不属性 `[[Class]]`，基本类型会返回他们的包装对象的 `[[Class]]`。

```javascript
let toString = Object.prototype.toString //=>Object.prototype.toString

console.log(toString.call(10)) //=>"[object Number]"
console.log(toString.call(NaN)) //=>"[object Number]"
console.log(toString.call('xxx')) //=>"[object String]"
console.log(toString.call(true)) //=>"[object Boolean]"
console.log(toString.call(null)) //=>"[object Null]"
console.log(toString.call(undefined)) //=>"[object Undefined]"
console.log(toString.call(Symbol())) //=>"[object Symbol]"
console.log(toString.call(BigInt(10))) //=>"[object BigInt]"
console.log(toString.call({ xxx: 'xxx' })) //=>"[object Object]"
console.log(toString.call([10, 20])) //=>"[object Array]"
console.log(toString.call(/^\d+$/)) //=>"[object RegExp]"
console.log(toString.call(function () {})) //=>"[object Function]"
```

## 参考文章

1. [JavaScript深入理解之undefined与null](https://juejin.im/post/5aa4f7cc518825557e780256 'JavaScript深入理解之undefined与null')
2. [简单了解ES6/ES2015 Symbol() 方法](https://www.zhangxinxu.com/wordpress/2018/04/known-es6-symbol-function/ '简单了解ES6/ES2015 Symbol() 方法')
3. [JS中数据类型检测四种方式的优缺点](https://juejin.im/post/5e88a683f265da47db2e38b8 'JS中数据类型检测四种方式的优缺点')
4. [JavaScript 数据类型和数据结构 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures 'JavaScript 数据类型和数据结构 - MDN')
