---
title: 'JavaScript常用内置对象API'
publishDate: '2020-07-10 12:00:00'
description: ''
tags:
  - js
  - 实用技巧
  - 编程技巧
language: '中文'
heroImage: {"src":"./javascript-logo.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

`JavaScript` 中的引用类型有非常多的属性和方法，随着标准的更新还在不断的增加。很多有用的属性或者方法自己不了解，或者看过又忘记了，很难运用到自己的编码中，虽然使用时最好的记忆，不过还是要加深在脑中的映像，在写代码的时候才能想到使用。本文整理一下各个常用引用类型的属性和方法，经常拿出来看一看，增加自己的记忆。不收录废弃和试验性属性和方法。

## 内置对象的 new

由于很多内置对象的构造函数的 `new` 行为并不一致，这里单独说一说。

`RegExp`，`Error`，`Object`，`Function` 和 `Array` 的 `new` 就是用来创建实例的，它们的 `new` 可以省略。

`String`，`Number` 和 `Boolean` 三种原始类型对应的构造函数在不使用 `new` 时相当于强制类型转换，可以参考 [深入 JavaScript 类型转换](https://www.clloz.com/programming/front-end/js/2020/10/13/type-conversion/ "深入 JavaScript 类型转换")。而是用 `new` 的情况下就是创建一个包装对象。

`Proxy`，`Map`，`WeakMap`，`Set` 和 `WeakSet` 都必须使用 `new` 来实例化一个对象。

`Symbol` 和 `BigInt` 不是一个构造函数，所以不能使用 `new` 操作符，只能直接使用该函数和它的静态方法。

创建一个新 `Date` 对象的唯一方法是通过 `new` 操作符，例如：`let now = new Date();`。若将它作为常规函数调用（即不加 `new` 操作符），将返回一个字符串，而非 `Date` 对象。

`Reflect`，`Math`，`JSON` 对象不是构造函数，甚至不是一个函数，只能直接使用他们的静态方法或属性。

创建 `Promise` 实例必须要使用 `new`。

`null` 和 `undefined` 没有对应的构造函数。

## Object

`JavaScript` 中的所有对象都来自 `Object`；所有对象从 `Object.prototype` 继承方法和属性，尽管它们可能被覆盖。例如，其他构造函数的原型将覆盖 `constructor` 属性并提供自己的 `toString()` 方法。`Object` 原型对象的更改将传播到所有对象，除非受到这些更改的属性和方法将沿原型链进一步覆盖。

在 `JvaScript` 中，几乎所有的对象都是 `Object` 类型的实例，它们都会从 `Objet.prototype` 继承属性和方法。`Object` 构造函数为给定值创建一个对象包装器。`Object` 构造函数，会根据给定的参数创建对象，具体有以下情况：

- 如果给定值是 `null` 或 `undefined`，将会创建并返回一个空对象
- 如果传进去的是一个基本类型的值，则会构造其包装类型的对象
- 如果传进去的是引用类型的值，仍然会返回这个值。
- 当以非构造函数形式被调用时，`Object` 的行为等同于 `new Object()`。

| 方法/属性 | 描述 |
| --- | --- |
| `Object.length` | 值为 `1` 的属性 |
| [Object.prototype](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype "Object.prototype") | 所有对象的原型，可以为所有 `Object` 类型的对象添加属性。 |
| [Object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign "Object.assign()") | 将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。 |
| [Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create "Object.create()") | 创建一个新对象，使用现有的对象来提供新创建的对象的 `[[prototype]]`。第二个可选参数可以为新对象添加属性特性默认为 `false` 的属性， |
| [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty "Object.defineProperty()") | 在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。 |
| [Object.defineProperties()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties "Object.defineProperties()") | 给对象添加多个属性并分别指定它们的配置。 |
| [Object.entries()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries "Object.entries()") | 返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 `for...in` 循环遍历该对象时返回的顺序一致（区别在于 `for-in` 循环还会枚举原型链中的属性）。 |
| [Object.freeze()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze "Object.freeze()") | 冻结对象：其他代码不能删除或更改任何属性。冻结一个对象后该对象的原型也不能被修改。返回和传入的参数相同的对象。 |
| [Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor "Object.getOwnPropertyDescriptor()") | 返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性） |
| [Object.getOwnPropertyDescriptors()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors "Object.getOwnPropertyDescriptors()") | 用来获取一个对象的所有自身属性的描述符。 |
| [Object.getOwnPropertyNames()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames "Object.getOwnPropertyNames()") | 返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括 `Symbol` 值作为名称的属性）组成的数组。 |
| [Object.getOwnPropertySymbols()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols "Object.getOwnPropertySymbols()") | 返回一个给定对象自身的所有 `Symbol` 属性的数组。 |
| [Object.getPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf "Object.getPrototypeOf()") | 返回指定对象的原型（内部 `[[Prototype]]` 属性的值） |
| [Object.is()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is "Object.is()") | 比较两个值是否相同。所有 `NaN` 值都相等，`+0` 和 `-0` 不相等。（与 `==` 和 `===` 都不同） |
| [Object.isExtensible()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible "Object.isExtensible()") | 判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）。返回一个 `Boolean` |
| [Object.isFrozen()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen "Object.isFrozen()") | 判断一个对象是否被冻结。 |
| [Object.isSealed()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed "Object.isSealed()") | 判断一个对象是否被密封。在 `ES5` 中，如果这个方法的参数不是一个对象（一个原始类型），那么它会导致 `TypeError`。在 `ES2015` 中，非对象参数将被视为是一个密封的普通对象，只返回 `true`。 |
| [Object.keys()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys "Object.keys()") | 返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致 。 |
| [Object.preventExtensions()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions "Object.preventExtensions()") | 让一个对象变的不可扩展，也就是永远不能再添加新的属性。该方法使得目标对象的 `[[prototype]]` 不可变；任何重新赋值 `[[prototype]]` 操作都会抛出 `TypeError` 。一旦将对象变为不可扩展的对象，就再也不能使其可扩展。 |
| [Object.seal()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal "Object.seal()") | 封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置，返回被密封对象的引用。当前属性的值只要原来是可写的就可以改变。不会影响从原型链上继承的属性。但 `__proto__` 属性的值也会不能修改。 |
| [Object.setPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf "Object.setPrototypeOf()") | 设置一个指定的对象的原型 ( 即, 内部 `[[Prototype]]` 属性）到另一个对象或 `null`。更改 `[[prototype]]` 在浏览器上是个很慢的操作，对性能有要求不建议使用。 |
| [Object.value()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values "Object.values()") | 返回一个给定对象自身的所有可枚举属性值的数组，值的顺序与使用 `for...in` 循环的顺序相同 ( 区别在于 `for-in` 循环枚举原型链中的属性 )。 |
| [Object.prototype.constructor](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor "Object.prototype.constructor") | 返回创建实例对象的 `Object` 构造函数的引用。注意，此属性的值是对函数本身的引用，而不是一个包含函数名称的字符串。对原始类型来说，如`1`，`true` 和 `"test"`，返回基本包装类型的构造函数，该值只可读。 |
| [Object.prototype.hasOwnProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty "Object.prototype.hasOwnProperty()") | 返回一个布尔值，指示对象自身属性中是否具有指定的属性 |
| [Object.prototype.isPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf "Object.prototype.isPrototypeOf()") | 用于测试一个对象是否存在于另一个对象的原型链上。如果调用对象为 `undefined` 或 `null`，会抛出 `TypeError`。 |
| [Object.prototype.propertyIsEnumerable()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable "Object.prototype.propertyIsEnumerable()") | 返回一个布尔值，表示指定的自身属性是否可枚举。可以用于数组对象 |
| [Object.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toLocaleString "Object.prototype.toLocaleString()") | 返回调用 `toString()` 的结果 |
| [Object.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString "Object.prototype.toString()") | 返回一个表示该对象的字符串。除了 `Object` 创建的对象，其他对象的该函数都被重写，`Object.prototype.toString()` 可以用来检测对象类型 |
| [Object.prototype.valueOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf "Object.prototype.valueOf()") | 返回指定对象的原始值，一般不需要用到，不同对象的调用结果查看 `MDN` |

## Array

创建数组可以使用字面量或者 `Array()` 构造函数，使用构造函数时可以省略 `new`。想要深入学习 `JavaScript` 数组的内容可以看我的另一篇文章 [深入 JavaScript 数组](https://www.clloz.com/programming/front-end/js/2020/10/10/javascript-array-skills/ "深入 JavaScript 数组")

| 方法/属性 | 描述 |
| --- | --- |
| [Array.from()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from "Array.from()") | 从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。第二个参数为新数组元素调用的函数，第三个参数为函数调用时的 `this` |
| [Array.isArray()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray "Array.isArray()") | 判断一个对象是否是数组对象 |
| [Array.of()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/of "Array.of()") | 创建一个具有可变数量参数的新数组实例，而不考虑参数的数量或类型。 |
| `Array.prototype.constructor` | 所有的数组实例都继承了这个属性，它的值就是 `Array`，表明了所有的数组都是由 `Array` 构造出来的。 |
| [Array.prototype](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype "Array.prototype") | `Array.prototype` 本身也是一个 `Array` |
| [Array.prototype.length](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/length "Array.prototype.length") | 返回或设置一个数组中的元素个数，该值是一个无符号 `32-bit` 整数，`Array.prototype` 本身是一个空数组 |
| [Array.prototype.copyWithin()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin "Array.prototype.copyWithin()") | 浅复制数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的长度。 |
| [Array.prototype.fill()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill "Array.prototype.fill()") | 用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。 |
| [Array.prototype.flat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat "Array.prototype.flat()") | `ES2019` 提供的数组扁平化的方法。 |
| [Array.prototype.flatMap()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap "Array.prototype.flatMap()") | flatMap() 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。 |
| [Array.prototype.pop()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/pop "Array.prototype.pop()") | 从数组中删除最后一个元素，并返回该元素的值。此方法更改数组的长度。 |
| [Array.prototype.push()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/push "Array.prototype.push()") | 将一个或多个元素添加到数组的末尾，并返回该数组的新长度。 |
| [Array.prototype.reverse()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse "Array.prototype.reverse()") | 将数组中元素的位置颠倒，并返回该数组。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。该方法会改变原数组。 |
| [Array.prototype.shift()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/shift "Array.prototype.shift()") | 从数组中删除第一个元素，并返回该元素的值。此方法更改数组的长度。 |
| [Array.prototype.sort()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort "Array.prototype.sort()") | 用原地算法对数组的元素进行排序，并返回数组。默认排序顺序是在将元素转换为字符串，然后比较它们的 `UTF-16` 代码单元值序列时构建的。由于它取决于具体实现，因此无法保证排序的时间和空间复杂性。 |
| [Array.prototype.splice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice "Array.prototype.splice()") | 通过删除或替换现有元素或者原地添加新的元素来修改数组,并以数组形式返回被删除的内容。此方法会改变原数组 |
| [Array.prototype.unshift()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift "Array.prototype.unshift()") | 将一个或多个元素添加到数组的开头，并返回该数组的新长度(该方法修改原有数组)。 |
| [Array.prototype.concat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat "Array.prototype.concat()") | 用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。 |
| [Array.prototype.includes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes "Array.prototype.includes()") | 用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 `true`，否则返回 `false`。比较字符串和字符时区分大小写 |
| [Array.prototype.join()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/join "Array.prototype.join()") | 将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串。如果数组只有一个项目，那么将返回该项目而不使用分隔符。 |
| [Array.prototype.slice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice "Array.prototype.slice()") | 返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的浅拷贝（包括 `begin`，不包括 `end`）。原始数组不会被改变。 |
| [Array.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/toString "Array.prototype.toString()") | 返回一个由所有数组元素组合而成的字符串，用逗号分隔。覆盖了原型链上的 `Object.prototype.toString()` 方法。 |
| [Array.prototype.indexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf "Array.prototype.indexOf()") | 返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回 `-1`。 |
| [Array.prototype.lastIndexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf "Array.prototype.lastIndexOf()") | 返回指定元素（也即有效的 `JavaScript` 值或变量）在数组中的最后一个的索引，如果不存在则返回 `-1`。从数组的后面向前查找，从 `fromIndex` 处开始。 |
| [Array.prototype.forEach()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach "Array.prototype.forEach()") | 对数组的每个元素执行一次给定的函数。 |
| [Array.prototype.entries()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/entries "Array.prototype.entries()") | 返回一个新的 `Array Iterator` 对象，该对象包含数组中每个索引的键/值对。 |
| [Array.prototype.every()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every "Array.prototype.every()") | 测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。若收到一个空数组，此方法在一切情况下都会返回 `true`。 |
| [Array.prototype.some()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some "Array.prototype.some()") | 测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个布尔类型的值。如果用一个空数组进行测试，在任何情况下它返回的都是`false`。 |
| [Array.prototype.filter()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter "Array.prototype.filter()") | 创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。 |
| [Array.prototype.find()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find "Array.prototype.find()") | 返回数组中满足提供的测试函数的第一个元素的值。否则返回 `undefined`。 |
| [Array.prototype.findIndex()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex "Array.prototype.findIndex() ") | 找到第一个满足测试函数的元素并返回那个元素的索引，如果找不到，则返回 `-1`。 |
| [Array.prototype.keys()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/keys "Array.prototype.keys()") | 返回一个包含数组中每个索引键的`Array Iterator`对象。 |
| [Array.prototype.map()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map "Array.prototype.map()") | 创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。 |
| [Array.prototype.reduce()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce "Array.prototype.reduce()") | 从左到右为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值。 |
| [Array.prototype.reduceRight()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight "Array.prototype.reduceRight()") | 从右到左为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值 |
| [Array.prototype.values()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/values "Array.prototype.values()") | 返回一个新的 `Array Iterator` 对象，该对象包含数组每个索引的值 |

## String

请注意区分 `JavaScript` 字符串对象和基本字符串值 . ( 对于 `Boolean` 和 `Numbers` 也同样如此.)

字符串字面量 (通过单引号或双引号定义) 和 直接调用 `String` 方法(没有通过 `new` 生成字符串对象实例)的字符串都是基本字符串。`JavaScript` 会自动将基本字符串转换为字符串对象，只有将基本字符串转化为字符串对象之后才可以使用字符串对象的方法。当基本字符串需要调用一个字符串对象才有的方法或者查询值的时候(基本字符串是没有这些方法的)，`JavaScript` 会自动将基本字符串转化为字符串对象并且调用相应的方法或者执行查询。

| 方法/属性 | 描述 |
| --- | --- |
| [String.fromCharCode()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode "String.fromCharCode()  ") | 返回由指定的 `UTF-16` 代码单元序列创建的字符串。范围介于 `0` 到 `65535（0xFFFF）` 之间。 大于 `0xFFFF` 的数字将被截断。 不进行有效性检查。 |
| [String.fromCodePoint()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint "String.fromCodePoint()") | 静态方法返回使用指定的代码点序列创建的字符串。 |
| [String.raw()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/raw "String.raw()") | 通过模板字符串创建字符串。 |
| [String.prototype.length](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/length "String.prototype.length") | 该属性返回字符串中字符编码单元的数量。`JavaScript` 使用 `UTF-16` 编码，该编码使用一个 `16` 比特的编码单元来表示大部分常见的字符，使用两个代码单元表示不常用的字符。因此 `length` 返回值可能与字符串中实际的字符数量不相同。空字符串的 `length` 为 `0`。静态属性 `String.length` 返回 `1`。 |
| `N` | 用于访问第 `N` 个位置的字符，其中 `N` 是小于 `length` 和 `0` 之间的正整数。这些属性都是“只读”性质，不能编辑。 |
| [String.prototype.charAt()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charAt "String.prototype.charAt()") | 从一个字符串中返回指定的字符，辅助平面的字符无法正确输出，详见文章[搞懂字符编码](https://www.clloz.com/programming/assorted/2019/04/26/character-encoding/ "搞懂字符编码") |
| [String.prototype.charCodeAt()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt "String.prototype.charCodeAt()") | 返回 `0` 到 `65535` 之间的整数，表示给定索引处的 `UTF-16` 代码单元 |
| [String.prototype.codePointAt()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt "String.prototype.codePointAt()") | 返回 一个 `Unicode` 编码点值的非负整数。 |
| [String.prototype.concat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/concat "String.prototype.concat()") | 将一个或多个字符串与原字符串连接合并，形成一个新的字符串并返回。 |
| [String.prototype.includes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/includes "String.prototype.includes()") | 判断一个字符串是否包含在另一个字符串中，根据情况返回 `true` 或 `false`。区分大小写。 |
| [String.prototype.endsWith()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith "String.prototype.endsWith()") | 判断当前字符串是否是以另外一个给定的子字符串“结尾”的，根据判断结果返回 `true` 或 `false`。区分大小写 |
| [String.prototype.indexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf "String.prototype.indexOf()") | 返回调用它的 `String` 对象中第一次出现的指定值的索引，从 `fromIndex` 处进行搜索。如果未找到该值，则返回 `-1`。 |
| [String.prototype.lastIndexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf "String.prototype.lastIndexOf()") | 返回调用 `String` 对象的指定值最后一次出现的索引，在一个字符串中的指定位置 `fromIndex` 处从后向前搜索。如果没找到这个特定值则返回 `-1` 。 |
| [String.prototype.localeCompare()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare "String.prototype.localeCompare()") | 返回一个数字来指示一个参考字符串是否在排序顺序前面或之后或与给定字符串相同。 |
| [String.prototype.match()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match "返回一个数字来指示一个参考字符串是否在排序顺序前面或之后或与给定字符串相同。") | 检索返回一个字符串匹配正则表达式的的结果。 |
| [String.prototype.normalize()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/normalize "String.prototype.normalize()") | 按照指定的一种 Unicode 正规形式将当前字符串正规化。（如果该值不是字符串，则首先将其转换为一个字符串）。 |
| [String.prototype.padEnd()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd "String.prototype.padEnd()") | 会用一个字符串填充当前字符串（如果需要的话则重复填充），返回填充后达到指定长度的字符串。从当前字符串的末尾（右侧）开始填充。 |
| [String.prototype.padStart()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padStart "String.prototype.padStart()") | 用另一个字符串填充当前字符串(重复，如果需要的话)，以便产生的字符串达到给定的长度。填充从当前字符串的开始(左侧)应用的。 |
| [String.prototype.repeat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/repeat "String.prototype.repeat()") | 构造并返回一个新字符串，该字符串包含被连接在一起的指定数量的字符串的副本。 |
| [String.prototype.replace()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace "String.prototype.replace()") | 返回一个由替换值（`replacement`）替换一些或所有匹配的模式（`pattern`）后的新字符串。模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。原字符串不会改变。 |
| [String.prototype.search()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/search "String.prototype.search()") | 执行正则表达式和 `String` 对象之间的一个搜索匹配。如果匹配成功，返回正则表达式在字符串中首次匹配项的索引;否则，返回 `-1`。 |
| [String.prototype.slice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/slice "String.prototype.slice()") | 提取某个字符串的一部分，并返回一个新的字符串（`end` 不计入），且不会改动原字符串。 |
| [String.prototype.split()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split "String.prototype.split()") | 使用指定的分隔符字符串将一个 `String` 对象分割成子字符串数组，以一个指定的分割字串来决定每个拆分的位置。 用空字符串(“)作为分隔符，字符串分隔是以 `16` 比特的 `UTF-16` 代码单元为单位 |
| [String.prototype.startsWith()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith "String.prototype.startsWith()") | 判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回 `true` 或 `false`。 |
| [String.prototype.substr()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substr "String.prototype.substr()") | 返回一个字符串中从指定位置开始到指定字符数的字符。非标准方法，未来可能被移除，用 `substring` 代替 |
| [String.prototype.substring()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substring "String.prototype.substring()") | 提取从 `indexStart` 到 `indexEnd`（不包括）之间的字符。不改变原字符串 |
| [String.prototype.toLocaleLowerCase()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase "String.prototype.toLocaleLowerCase()") | 根据任何指定区域语言环境设置的大小写映射，返回调用字符串被转换为小写的格式。 |
| [String.prototype.toLocaleUpperCase()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase "String.prototype.toLocaleUpperCase()") | 根据本地主机语言环境把字符串转换为大写格式，并返回转换后的字符串。 |
| [String.prototype.toLowerCase()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase "String.prototype.toLowerCase()") | 将调用该方法的字符串值转为小写形式，并返回。 |
| [String.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/toString "String.prototype.toString()") | `String` `对象覆盖了Object` 对象的 `toString` 方法；并没有继承 `Object.toString()`。对于 `String` 对象，`toString` 方法返回该对象的字符串形式，和 `String.prototype.valueOf()` 方法返回值一样。 |
| [String.prototype.toUpperCase()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase "String.prototype.toUpperCase()") | 将调用该方法的字符串转为大写形式并返回（如果调用该方法的值不是字符串类型会被强制转换）。 |
| [String.prototype.trim()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trim "String.prototype.trim()") | 从一个字符串的两端删除空白字符。在这个上下文中的空白字符是所有的空白字符 (`space, tab, no-break space` 等) 以及所有行终止符字符（如 `LF`，`CR` 等）。 |
| [String.prototype.trimStart()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trimLeft "String.prototype.trimStart()") | 从字符串的开头删除空格。`trimLeft()` 是此方法的别名。 |
| [String.prototype.trimEnd()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/TrimRight "String.prototype.trimEnd()") | 从一个字符串的末端移除空白字符。`trimRight()` 是这个方法的别名。 |
| [String.prototype.valueOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/valueOf "String.prototype.valueOf()") | 返回特定对象的原始值。重写 `Object.prototype.valueOf` 方法。 |

## Function

每个 `JavaScript` 函数实际上都是一个 `Function` 对象。运行 `(function(){}).constructor === Function // true` 便可以得到这个结论。

我们也可以用构造函数的形式 `new Function` 动态创建函数（效果类似于 `eval`，也会产生安全和性能问题，但是远小于 `eval`），这种形式可以接收任意数量的参数，但最后一个参数会作为新函数的函数体，而前面的参数就是新函数的参数（`new` 操作符可以省略）。使用 `Function` 构造器生成的 `Function` 对象是在函数创建时解析的。这比你使用函数声明或者函数表达式并在你的代码中调用更为低效，因为使用后者创建的函数是跟其他代码一起解析的，即这种语 法会导致解析两次代码(第一次是解析常规 `ECMAScript` 代码，第二次是解析传入构造函数中的字符串，所以会对性能造成影响。构造器生成函数可以直接作为函数表达式执行。

`Function.prototype` 本身就是函数，可以直接调用，接受任何参数并返回 `undefined`。

```javascript
var sum = new Function("num1", "num2", "return num1 + num2");
sum(1, 2) // 3 不推荐。mdn上说直接调用Function构造函数创建的函数只能在全局作用域下调用，但我的测试似乎在函数内部也可以正常调用
```

| 方法/属性 | 描述 |
| --- | --- |
| [Function.prototype.caller](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/caller "Function.prototype.caller") | `caller` 这个属性函数实例和 `Function.prototype` 都有，`Function` 构造函数没有，他的该属性是从 `Function.prototype` 上继承的，该属性不是标准上的属性，但是大部分引擎都实现了它。如果一个函数 `f` 是在全局作用域内被调用的,则 `f.caller` 为 `null`,相反,如果一个函数是在另外一个函数作用域内被调用的,则 `f.caller` 指向调用它的那个函数.该属性的常用形式 `arguments.callee.caller` 替代了被废弃的 `arguments.caller`。该属性严格模式下不可用（`arguments.callee` 在严格模式下也不可用） |
| [Function.name](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/name "Function.name") | 该属性 `Function` 构造函数，`Function.prototype` 和 实例都有，`writable`为`false`，`enumerable`为`false`，`configurable`为 `true`，返回一个函数声明的名称。如果是用 `new Function()` 或者 直接调用 `Function ()` 创建的函数返回的是 `anonymous`。函数表达式中的匿名函数也是可以命名的。`bind` 创建的函数的返回值为 `bound name`，`setter` 和 `getter` 函数返回值为 `set name` 和 `get name`。如果函数原型上有 `name` 属性了，该属性就不会在函数上创建了。 |
| [Function.length](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/length "Function.length") | 函数有多少个必须要传入的参数，即形参的个数。形参的数量不包括剩余参数个数，仅包括第一个具有默认值之前的参数个数。与之对比的是， `arguments.length` 是函数被调用时实际传参的个数。`Function.length` 为 `1`，`Function.length` 为 `0`。 |
| [Function.prototype.apply()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply "Function.prototype.apply()") | 详见[apply和call, bing方法的应用](https://www.clloz.com/programming/front-end/js/2020/07/03/apply-call-bind/ "apply和call, bing方法的应用") |
| [Function.prototype.bind()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind "Function.prototype.bind()") | 详见[apply和call, bing方法的应用](https://www.clloz.com/programming/front-end/js/2020/07/03/apply-call-bind/ "apply和call, bing方法的应用") |
| [Function.prototype.call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call "Function.prototype.call()") | 详见[apply和call, bing方法的应用](https://www.clloz.com/programming/front-end/js/2020/07/03/apply-call-bind/ "apply和call, bing方法的应用") |
| [Function.prototype.isGenerator()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/isGenerator "Function.prototype.isGenerator()") | 判断函数是否为一个生成器 |
| [Function.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/toString "Function.prototype.toString()") | 返回一个表示当前函数源代码的字符串。覆盖了 `Object.prototype.toString` 方法。 |

## Date

创建一个 `JavaScript Date` 实例，该实例呈现时间中的某个时刻。`Date` 对象则基于 `Unix Time Stamp`，即自`1970年1月1日（UTC）`起经过的毫秒数。创建一个新 `Date` 对象的唯一方法是通过 `new` 操作符，若将它作为常规函数调用（即不加 `new` 操作符），将返回一个字符串，而非 `Date` 对象。

```javascript
//语法，四种参数形式
new Date(); //如果没有提供参数，那么新创建的Date对象表示实例化时刻的日期和时间。
new Date(value); //一个 Unix 时间戳（Unix Time Stamp），它是一个整数值，表示自1970年1月1日00:00:00 UTC（the Unix epoch）以来的毫秒数，忽略了闰秒。请注意大多数 Unix 时间戳功能仅精确到最接近的秒。
new Date(dateString); 表示日期的字符串值。该字符串应该能被 Date.parse() 正确方法识别（即符合 IETF-compliant RFC 2822 timestamps 或 version of ISO8601）。由于浏览器之间的差异，强烈不推荐。
new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]); //当至少提供了年份与月份时，这一形式的 Date() 返回的 Date 对象中的每一个成员都来自下列参数。没有提供的成员将使用最小可能值（对日期为1，其他为0）。
```

| 方法/属性 | 描述 |
| --- | --- |
| `Date.prototype` | 允许为 `Date` 对象添加属性。 |
| `Date.length` | 值是 `7`。这是该构造函数可接受的参数个数。 |
| [Date.now()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/now "Date.now()") | 返回自 `1970 年 1 月 1 日 00:00:00 (UTC)` 到当前时间的毫秒数。 |
| [Date.parse()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/parse "Date.parse()") | 解析一个表示某个日期的字符串，并返回从`1970-1-1 00:00:00 UTC` 到该日期对象（该日期对象的 `UTC` 时间）的毫秒数，如果该字符串无法识别，或者一些情况下，包含了不合法的日期数值（如：`2015-02-31`），则返回值为`NaN`。参数为一个符合 `RFC2822` 或 `ISO 8601` 日期格式的字符串（其他格式也许也支持，但结果可能与预期不符）。推荐始终手动解析日期字符串 |
| [Date.UTC()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC "Date.UTC()") | 接受和构造函数最长形式的参数相同的参数（从`2`到`7`），并返回从 `1970-01-01 00:00:00 UTC` 开始所经过的毫秒数。 |
| `Date.prototype.constructor` | 默认为 `Date` 构造函数 |
| [Date.prototype.getDate()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate "Date.prototype.getDate()") | 根据本地时间，返回一个指定的日期对象为一个月中的哪一日（从`1 ~ 31`）。 |
| [Date.prototype.getDay()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay "Date.prototype.getDay()") | 根据本地时间，返回一个具体日期中一周的第几天，`0` 表示星期天。 |
| [Date.prototype.getFullYear()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear "Date.prototype.getFullYear()") | 根据本地时间返回指定日期的年份。此方法替代 `getYear()` 。 |
| [Date.prototype.getHours()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getHours "Date.prototype.getHours()") | 根据本地时间，返回一个指定的日期对象的小时。 |
| [Date.prototype.getMilliseconds()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getMilliseconds "Date.prototype.getMilliseconds()") | 根据本地时间，返回一个指定的日期对象的毫秒数。 |
| [Date.prototype.getMinutes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getMinutes "Date.prototype.getMinutes()") | 根据本地时间，返回一个指定的日期对象的分钟数。 |
| [Date.prototype.getMonth()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth "Date.prototype.getMonth()") | 根据本地时间返回指定日期对象的月份 `（0-11）`。 |
| [Date.prototype.getSeconds()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getSeconds "Date.prototype.getSeconds()") | 根据本地时间返回指定日期对象的秒数 `（0-59）`。 |
| [Date.prototype.getTime()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime "Date.prototype.getTime()") | 返回一个时间的格林威治时间数值，从 `1970-1-1 00:00:00 UTC`（协调世界时）到该日期经过的毫秒数，对于 `1970-1-1 00:00:00 UTC` 之前的时间返回负值。你可以使用这个方法把一个日期时间赋值给另一个 `Date` 对象。这个方法的功能和 `valueOf()` 方法一样。 |
| [Date.prototype.getTimezoneOffset()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset "Date.prototype.getTimezoneOffset()") | 返回协调世界时（UTC）相对于当前时区的时间差值，单位为分钟。 |
| [Date.prototype.getUTCDate()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCDate "Date.prototype.getUTCDate()") | 以世界时为标准，返回一个指定的日期对象为一个月中的第几天，`1-31` |
| [Date.prototype.getUTCDay()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCDay "Date.prototype.getUTCDay()") | 以世界时为标准，返回一个指定的日期对象为一星期中的第几天，其中 `0` 代表星期天。`0-6` |
| [Date.prototype.getUTCFullYear()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCFullYear "Date.prototype.getUTCFullYear()") | 以世界时为标准，返回一个指定的日期对象的年份（四位数）。 |
| [Date.prototype.getUTCHours()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCHours "Date.prototype.getUTCHours()") | 以世界时为标准，返回一个指定的日期对象的小时数。`0-23` |
| [Date.prototype.getUTCMilliseconds()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCMilliseconds "Date.prototype.getUTCMilliseconds()") | 以世界时为标准，返回一个指定的日期对象的毫秒数。`0-999` |
| [Date.prototype.getUTCMinutes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCMinutes "Date.prototype.getUTCMinutes()") | 以世界时为标准，返回一个指定的日期对象的分钟数。`0-59` |
| [Date.prototype.getUTCMonth()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCMonth "Date.prototype.getUTCMonth()") | 以世界时为标准，返回一个指定的日期对象的月份，它是从 `0` 开始计数的（`0` 代表一年的第一个月）。 |
| [Date.prototype.getUTCSeconds()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCSeconds "Date.prototype.getUTCSeconds()") | 以世界时为标准，返回一个指定的日期对象的秒数。`0-59` |
| [Date.prototype.setDate()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate "Date.prototype.setDate()") | 根据本地时间来指定一个日期对象的天数。 |
| [Date.prototype.setFullYear()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setFullYear "Date.prototype.setFullYear()") | 根据本地时间为指定日期对象设置完整年份（四位数年份是四个数字）。 |
| [Date.prototype.setHours()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours "Date.prototype.setHours()") | 根据本地时间为指定日期对象设置小时数。 |
| [Date.prototype.setMilliseconds()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setMilliseconds "Date.prototype.setMilliseconds()") | 根据本地时间为指定日期对象设置毫秒数。 |
| [Date.prototype.setMinutes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setMinutes "Date.prototype.setMinutes()") | 根据本地时间为指定日期对象设置分钟数。 |
| [Date.prototype.setMonth()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth "Date.prototype.setMonth()") | 根据本地时间为指定日期对象设置月份。 |
| [Date.prototype.setSeconds()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setSeconds "Date.prototype.setSeconds()") | 根据本地时间为指定日期对象设置秒数。 |
| [Date.prototype.setTime()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setTime "Date.prototype.setTime()") | 通过指定从 `1970-1-1 00:00:00 UTC` 开始经过的毫秒数来设置日期对象的时间，对于早于 `1970-1-1 00:00:00 UTC` 的时间可使用负值。 |
| [Date.prototype.setUTCDate()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCDate "Date.prototype.setUTCDate()") | 根据世界时设置 Date 对象中月份的一天 (`1 ~ 31`)。 |
| [Date.prototype.setUTCFullYear()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCFullYear "Date.prototype.setUTCFullYear()") | 根据世界时设置 Date 对象中的年份（四位数字）。 |
| [Date.prototype.setUTCHours()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCHours "Date.prototype.setUTCHours()") | 根据世界时设置 Date 对象中的小时 (`0 ~ 23`)。 |
| [Date.prototype.setUTCMilliseconds()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCMilliseconds "Date.prototype.setUTCMilliseconds()") | 根据世界时设置 Date 对象中的毫秒 (`0 ~ 999`)。 |
| [Date.prototype.setUTCMinutes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCMinutes "Date.prototype.setUTCMinutes()") | 根据世界时设置 Date 对象中的分钟 (`0 ~ 59`)。 |
| [Date.prototype.setUTCMonth()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCMonth "Date.prototype.setUTCMonth()") | 根据世界时设置 Date 对象中的月份 (`0 ~ 11`)。 |
| [Date.prototype.setUTCSeconds()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCSeconds "Date.prototype.setUTCSeconds()") | 根据世界时设置 Date 对象中的秒钟 (`0 ~ 59`)。 |
| [Date.prototype.toDateString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toDateString "Date.prototype.toDateString()") | 以美式英语和人类易读的形式返回一个日期对象日期部分的字符串。 |
| [Date.prototype.toISOString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString "Date.prototype.toISOString()") | 返回一个 `ISO（ISO 8601 Extended Format）`格式的字符串： `YYYY-MM-DDTHH:mm:ss.sssZ`。时区总是 `UTC`（协调世界时），加一个后缀 `Z` 标识。 |
| [Date.prototype.toJSON()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON "Date.prototype.toJSON()") | 返回一个 JSON 格式字符串(使用 `toISOString()`)，表示该日期对象的值。默认情况下，这个方法常用于 `JSON` 序列化 `Date` 对象。 |
| [Date.prototype.toLocaleDateString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString "Date.prototype.toLocaleDateString()") | 返回该日期对象日期部分的字符串，该字符串格式因不同语言而不同。新增的参数 `locales` 和 `options` 使程序能够指定使用哪种语言格式化规则，允许定制该方法的表现。 |
| [Date.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString "Date.prototype.toLocaleString()") | 返回该日期对象的字符串，该字符串格式因不同语言而不同。新增的参数 `locales` 和 `options` 使程序能够指定使用哪种语言格式化规则，允许定制该方法的表现。覆盖了 `Object.prototype.toLocaleString()` 方法。 |
| [Date.prototype.toLocaleTimeString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString "Date.prototype.toLocaleTimeString()") | 返回该日期对象时间部分的字符串，该字符串格式因不同语言而不同。新增的参数 `locales` 和 `options` 使程序能够指定使用哪种语言格式化规则，允许定制该方法的表现 |
| [Date.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toString "Date.prototype.toString()") | 返回一个字符串，表示该 `Date` 对象。覆盖了`Object.prototype.toString()` 方法。 |
| [Date.prototype.toTimeString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toTimeString "Date.prototype.toTimeString()") | 以人类易读形式返回一个日期对象时间部分的字符串，该字符串以美式英语格式化。 |
| [Date.prototype.toUTCString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString "Date.prototype.toUTCString()") | 把一个日期对象转换为一个以 `UTC` 时区计时的字符串。 |
| [Date.prototype.valueOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/valueOf "Date.prototype.valueOf()") | 返回从 `1970年1月1日0时0分0秒`（UTC，即协调世界时）到该日期的毫秒数。 |

## Math

`Math` 是一个内置对象，它拥有一些数学常数属性和数学函数方法。`Math` 不是一个函数对象。`Math` 用于 `Number` 类型。它不支持 `BigInt`。

| 方法/属性 | 描述 |
| --- | --- |
| [Math.E](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/E "Math.E") | 静态属性表示自然对数的底数（或称为基数），`e`，约等于 `2.718`。 |
| `Math.LN2` | 静态属性表示 `2` 的自然对数，约为 `0.693` |
| `Math.LN10` | `10` 的自然对数，约等于 `2.303`。 |
| `Math.LOG2E` | 以 `2` 为底的 `e` 的对数，约等于 `1.443`。 |
| `Math.LOG10E` | 以 `10` 为底的 `e` 的对数，约等于 `0.434`。 |
| `Math.PI` | 圆周率，一个圆的周长和直径之比，约等于 `3.14159`。 |
| `Math.SQRT1_2` | 二分之一 `½` 的平方根，约等于 `0.707`。 |
| `Math.SQRT2` | `2` 的平方根，约等于 `1.414` |
| `Math.abs(x)` | 返回一个数的绝对值 |
| `Math.acos(x)` | 返回一个数的反余弦值，弧度 |
| `Math.acosh(x)` | 返回一个数的反双曲余弦值，弧度 |
| `Math.asin(x)` | 返回一个数的反正弦值，弧度 |
| `Math.asinh(x)` | 返回一个数的反双曲正弦值，弧度 |
| `Math.atan(x)` | 返回一个数的反正切值，弧度 |
| `Math.atanh(x)` | 返回一个数的反双曲正切值，弧度 |
| `Math.atan2(y, x)` | 返回 `y/x` 的反正切值。 |
| `Math.cbrt(x)` | 返回一个数的立方根 |
| `Math.ceil(x)` | 向上取整 |
| `Math.clz32(x)` | 返回一个 `32` 位（二进制）整数的前导 `0` 的数量 |
| `Math.cos(x)` | 返回一个数的余弦值，弧度 |
| `Math.cosh(x)` | 返回一个数的双曲余弦值，弧度 |
| `Math.exp(x)` | 返回欧拉常数的参数次方 |
| `Math.expm1(x)` | 返回 `exp(x) - 1` 的值 |
| `Math.floor(x)` | 向下取整 |
| `Math.fround(x)` | 返回最接近一个数的单精度浮点型表示。 |
| `Math.hypot([x[, y[, …]]])` | 返回所有参数平方和的平方根 |
| `Math.imul(x, y)` | 返回 `32`位（二进制）整数乘法的结果 |
| `Math.log(x)` | 返回一个数的自然对数 `ln(x)` |
| `Math.log10(x)` | 返回一个数的 `10` 为底的对数 |
| `Math.log2(x)` | 返回一个数的 `2` 为底的对数 |
| `Math.max([x[, y[, …]]])` | 返回一组数中的最大值，如果给定的参数中至少有一个参数无法被转换成数字，则会返回 `NaN`。如果没有参数，则结果为 - `Infinity`。 |
| `Math.min([x[, y[, …]]])` | 返回零个或更多个数值的最小值。如果任一参数不能转换为数值，则返回 `NaN`。如果没有参数，结果为 `Infinity`。 |
| `Math.pow(x, y)` | 返回 `x` 的 `y` 次幂 |
| `Math.random()` | 返回 `0` 到 `1` 之间的伪随机数 |
| `Math.round(x)` | 返回四舍五入后的整数 |
| `Math.sign(x)` | 返回一个数的符号，正负或者 `0` |
| `Math.sin(x)` | 返回一个数的正弦值，弧度 |
| `Math.sinh(x)` | 返回一个数的双曲正弦值，弧度 |
| `Math.sqrt(x)` | 返回一个数的平方根 |
| `Math.tan(x)` | 返回一个数的正切值，弧度 |
| `Math.tanh(x)` | 返回一个数的双曲正切值，弧度 |
| `Math.trunc(x)` | 返回一个数的整数部分 |

## Number

`Number` 的很多属性都是跟 `JavaScript` 使用的双精度浮点数相关的，具体内容可以看[JavaScript中的Number](https://www.clloz.com/programming/front-end/js/2019/06/11/javascript-number/ "JavaScript中的Number")

还有 `Number` 作为 `Number` 类型的包装对象构造函数，使用 `new` 实例化包装对象和直接调用的结果是完全不同的，直接调用和直接用字面量赋值相同（`String` 和 `Boolean` 相同），而且 `instanceof` 运算符符的返回值也不同，具体结果看下面的代码。

```javascript
new Number(value); 
var a = new Number('123'); // a === 123 is false
var b = Number('123'); // b === 123 is true
a instanceof Number; // is true
b instanceof Number; // is false
```

| 方法/属性 | 描述 |
| --- | --- |
| `Number.EPSILON` | 两个可表示(`representable`)数之间的最小间隔，接近于 $2^{-52}$ |
| `Number.MAX_SAFE_INTEGER` | `JavaScript` 中的最大安全整数，$2^{53} -1$ |
| `Number.MAX_VALUE` | `MAX_VALUE` 属性值接近于 `1.79E+308`。大于 `MAX_VALUE` 的值代表 `Infinity`。 |
| `Number.MIN_SAFE_INTEGER` | 最小安全整数 $-(2^{53} -1)$ |
| `Number.MIN_VALUE` | `JavaScript` 中能表示的最小正数，值约为 `5e-324`。小于 `MIN_VALUE` ("`underflow values`") 的值将会转换为 `0`。 |
| `Number.NaN` | `not a number` 不是一个数字，和全局对象的属性 `NaN` 相同 |
| `Number.NEGATIVE_INFINITY` | 表示负无穷大，和全局对象的属性 `INFINITY` 的负值相同 |
| `Number.POSITIVE_INFINITY` | 表示正无穷大，全局对象 `Infinity` 属性的值相同。 |
| `Number.prototype` | 所有 `Number` 实例都继承自`Number.prototype`。修改 `Number` 构造函数的原型对象会影响到所有 `Number` 实例。 |
| [Number.isNaN()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN "Number.isNaN()") | 确定传递的值是否为 `NaN`，并且检查其类型是否为 `Number`。它是原来的全局 `isNaN()` 的更稳妥的版本。`Number.isNaN()`不会自行将参数转换成数字，只有在参数是值为 `NaN` 的数字时，才会返回 `true`。 |
| [Number.isFinite()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite "Number.isFinite()") | 用来检测传入的参数是否是一个有穷数（`finite number`）。和全局的 `isFinite()` 函数相比，这个方法不会强制将一个非数值的参数转换成数值，这就意味着，只有数值类型的值，且是有穷的（`finite`），才返回 `true`。 |
| [Number.isInteger()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger "Number.isInteger()") | 用来判断给定的参数是否为整数。注意 `NaN` 和正负 `Infinity` 不是整数。 |
| [Number.isSafeInteger()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger "Number.isSafeInteger()") | 判断传入的参数值是否是一个“安全整数”（safe integer）。安全整数范围是从 $-(2^{53} -1)$ 到 $2^{53} -1$ 之间的正数，闭合区间 |
| [Number.parseFloat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/parseFloat "Number.parseFloat()") | 把一个字符串解析成浮点数。该方法与全局的 `parseFloat()` 函数相同，并且处于 `ECMAScript 6` 规范中（用于全局变量的模块化）。 |
| [Number.parseInt()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/parseInt "Number.parseInt()") | 依据指定基数，把字符串解析成整数。这个方法和全局的 `parseInt()` 函数具有一样的函数功能，并且处于 `ECMAScript 6` 规范中（用于全局变量的模块化）。 |
| [Number.prototype.toExponential()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toExponential "Number.prototype.toExponential()") | 返回一个使用指数表示法表示的该数值的字符串表示。 |
| [Number.prototype.toFixed()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed "Number.prototype.toFixed()") | 返回一个使用定点表示法表示的该数值的字符串表示。 |
| [Number.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString "Number.prototype.toLocaleString()") | 返回一个与语言相关的该数值对象的字符串表示。覆盖了 `Object.prototype.toLocaleString()` 方法。 |
| [Number.prototype.toPrecision()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toPrecision "Number.prototype.toPrecision()") | 使用定点表示法或指数表示法来表示的指定显示位数的该数值对象的字符串表示。 |
| [Number.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toString "Number.prototype.toString()") | 返回一个表示该数值对象的字符串。覆盖了 `Object.prototype.toString()` 方法。 |
| [Number.prototype.valueOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/valueOf "Number.prototype.valueOf()") | 返回该数值对象的原始值。覆盖了 `Object.prototype.valueOf()` 方法。 |

## Boolean

`Boolean` 对象是一个布尔值的对象包装器。如果省略或值 `0，-0，null，false，NaN，undefined` 或空字符串 `""`，该对象具有的初始值 `false`。所有其他值，包括任何对象，空数组 `[]` 或字符串 `false`，都会创建一个初始值为的对象 `true`。注意不要将基本类型中的布尔值 `true` 和 `false` 与值为 `true` 和 `false` 的 `Boolean` 对象弄混了。其值不是 `undefined` 或 `null` 的任何对象（包括其值为 `false` 的布尔对象）在传递给条件语句时都将计算为 `true`。

不要用创建 `Boolean` 对象的方式将一个非布尔值转化成布尔值，直接将 `Boolean` 当做转换函数来使用即可，或者使用双重非 `!!` 运算符。不要在应该使用基本类型布尔值的地方使用 `Boolean` 对象。

```javascript
//创建值为 false 的 Boolean 对象
var bNoParam = new Boolean();
var bZero = new Boolean(0);
var bNull = new Boolean(null);
var bEmptyString = new Boolean('');
var bfalse = new Boolean(false);

//创建值为 true 的  Boolean 对象
var btrue = new Boolean(true);
var btrueString = new Boolean('true');
var bfalseString = new Boolean('false');
var bSuLin = new Boolean('Su Lin');
var bArrayProto = new Boolean([]);
var bObjProto = new Boolean({});
```

## RegExp

`RegExp` 是 `JavaScript` 中的正则表达式构造函数，它提供了一系列与正则表达式相关的属性和方法来匹配字符串，关于正则表达式的内容参考另一篇文章[正则表达式入门以及JavaScript中的应用](https://www.clloz.com/programming/front-end/js/2020/08/05/regex-javascript-apply/ "正则表达式入门以及JavaScript中的应用")。创建 `RegExp` 对象的方法有两种，一种是字面量形式，一种是构造函数形式，字面量形式的正则表达式处于编译状态，而构造函数形式的正则表达式则为运行时编译。

```javascript
//regexp表示正则表达式的模式，后面i的位置则是flag，可以为我们提供一些高级功能
/regexp/i;
new RegExp('regexp', 'i');
new RegExp(/regexp/, 'i');
```

* * *

`JavaScript` 中可选的 `flag` 有如下几种。

| 标志 | 描述 |
| --- | --- |
| `g` | 全局搜索。 |
| `i` | 不区分大小写搜索。 |
| `m` | 多行搜索。 |
| `s` | 允许`.`匹配换行符。 |
| `u` | 使用|`unicode` 码的模式进行匹配。 |
| `y` | 执行“粘性(`sticky`)”搜索,匹配从目标字符串的当前位置开始。 |

* * *

| 方法/属性 | 描述 |
| --- | --- |
| [get RegExp\[@@species\]](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/@@species "get RegExp[@@species]") | `访问器属性返回RegExp` 的构造器。 |
| [RegExp.lastIndex](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex "RegExp.lastIndex") | 指定下一次匹配的起始索引。只有正则表达式使用了表示全局检索的 "g" 标志时，该属性才会起作用 |
| [RegExp.prototype.flags](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/flags "RegExp.prototype.flags") | 返回当前 `RegExp` 对象使用的 `flag` 字符串（以字典序排序）。 |
| [RegExp.prototype.dotAll](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/dotAll "RegExp.prototype.dotAll") | 只读布尔属性，只属于当前`RegExp` 对象，表示当前正则表达式时候使用 `s` 标志。 |
| [RegExp.prototype.global](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global "RegExp.prototype.global") | 只读布尔属性，表示当前 `RegExp` 是否使用了 `g` 标志 |
| [RegExp.prototype.ignoreCase](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/ignoreCase "RegExp.prototype.ignoreCase") | 只读布尔属性，表示当前 `RegExp` 是否使用了 `i` 标志。 |
| [RegExp.prototype.multiline](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/multiline "RegExp.prototype.multiline") | 只读布尔属性，表示当前 `RegExp` 是否使用了 `m` 标志。 |
| [RegExp.prototype.sticky](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky "RegExp.prototype.sticky") | 只读布尔属性，表示当前 `RegExp` 是否使用了 `y` 标志。 |
| [RegExp.prototype.unicode](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode "RegExp.prototype.unicode") | 只读布尔属性，表示当前 `RegExp` 是否使用了 `u` 标志。 |
| [RegExp.prototype.source](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/source "RegExp.prototype.source") | 返回一个值为当前正则表达式对象的模式文本的字符串，该字符串不会包含正则字面量两边的斜杠以及任何的标志字符。 |
| [RegExp.$1-$9](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/n) | 非标准 $1, $2, $3, $4, $5, $6, $7, $8, $9 属性是包含括号子串匹配的正则表达式的静态和只读属性。属性的值是只读的而且只有在正确匹配的情况下才会改变。`RegExp` 对象能捕获的只有九个，如果分组超过九个，则匹配后九个。 |
| [RegExp.prototype.exec()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec "RegExp.prototype.exec()") | 在一个指定字符串中执行一个搜索匹配。返回一个结果数组或 `null`。 |
| [RegExp.prototype.test()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test "RegExp.prototype.test()") | 执行一个检索，用来查看正则表达式与指定的字符串是否匹配。返回 `true` 或 `false`。和 `String.prototype.search()` 的区别在于一个返回布尔值，一个返回匹配索引。如果正则表达式设置了全局标志，`test()` 的执行会改变正则表达式 `lastIndex` 属性。连续的执行 `test()` 方法，后续的执行将会从 `lastIndex` 处开始匹配字符串。 |
| [RegExp.prototype\[@@match\]()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/@@match "RegExp.prototype[@@match]()") | 对正则表达式匹配字符串时，`[@@match]()`方法用于获取匹配结果。返回一个数组，它包括整个匹配结果，和通过捕获组匹配到的结果，如果没有匹配到则返回 `null`。 `String.prototype.match()` 的内部即调用此方法。使用方式和 `String.prototype.match()` 相同，不同之处是 `this` 和参数顺序。 |
| [RegExp.prototype\[@@matchAll\]()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/@@matchAll "RegExp.prototype[@@matchAll]()") | 返回对字符串使用正则表达式的所有匹配项的一个迭代器。`String.prototype.matchAll()` 中被内部调用，使用方法几乎与 `String.prototype.matchAll()` 相同，除了 `this` 的不同以及参数顺序的的差异。 |
| [RegExp.prototype\[@@replace\]()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/@@replace "RegExp.prototype[@@replace]()") | 在一个字符串中用给定的替换器，替换所有符合正则模式的匹配项，并返回替换后的新字符串结果。用来替换的参数可以是一个字符串或是一个针对每次匹配的回调函数。如果匹配模式也是 `RegExp` 对象，这个方法在 `String.prototype.replace()` 的内部调用。 |
| [RegExp.prototype\[@@search\]()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/@@search "RegExp.prototype[@@search]()") | 执行正则表达式和 String 对象之间的一个搜索匹配。如果成功的话，`[@@search]()` 返回该正则模式的第一个匹配项的在字符串中的位置索引。否则将返回 `-1`。`String.prototype.search()` 的内部即调用该方法。 |
| [RegExp.prototype\[@@split\]()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/@@split "RegExp.prototype[@@split]()") | 切割 `String` 对象为一个其子字符串的数组 。返回一个包含其子字符串的 `Array`。如果切割器是一个 `RegExp` 对象，这个方法就将在 `String.prototype.split()` 的内部调用。 |
| [RegExp.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/toString "RegExp.prototype.toString()") | 返回一个表示该正则表达式的字符串，和 `source` 属性不同的是，该方法包含斜杠和标志 |

## Error

`Error` 的构造器可以创建一个错误对象。当运行时错误产生时，`Error` 的实例对象会被抛出。`Error` 对象也可用于用户自定义的异常的基础对象。下面列出了各种内建的标准错误类型。`Error` 构造函数可以直接调用，效果和用 `new` 操作符调用相同。`Error` 接受三个参数 `new Error([message[, fileName[,lineNumber]]])`，`message` 是错误信息，`fileName` 默认是当前文件路径，`lineNumber` 默认为 `Error` 构造函数所在行。`Error` 构造函数本身没有属性和方法，`Error.prototype` 有 `name` 和 `message` 属性，分别表示错误名称和错误信息。

```javascript
try {
    throw new Error("Whoops!");
} catch (e) {
    console.log(e.name + ": " + e.message);
}
```

* * *

我们可以用 `Error.prototype` 来自定义错误类型。

```javascript
// Create a new object, that prototypally inherits from the Error constructor.
function MyError(message) {
  this.name = 'MyError';
  this.message = message || 'Default Message';
  this.stack = (new Error()).stack;
}
MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;

try {
  throw new MyError();
} catch (e) {
  console.log(e.name);     // 'MyError'
  console.log(e.message);  // 'Default Message'
}

try {
  throw new MyError('custom message');
} catch (e) {
  console.log(e.name);     // 'MyError'
  console.log(e.message);  // 'custom message'
}
```

* * *

除了 `Error` 构造函数外，`JavaScript` 有六个基本的错误类型。

`EvalError`：创建一个 `error` 实例，表示错误的原因：与 `eval()` 有关。 `InternalError`：创建一个代表 `Javascript` 引擎内部错误的异常抛出的实例。 如: "递归太多". `RangeError`：创建一个 `error` 实例，表示错误的原因：数值变量或参数超出其有效范围。 `ReferenceError`：创建一个 `error` 实例，表示错误的原因：无效引用。 `SyntaxError`：创建一个 `error` 实例，表示错误的原因：`eval()` 在解析代码的过程中发生的语法错误。 `TypeError`：创建一个 `error` 实例，表示错误的原因：变量或参数不属于有效类型。 `URIError`：创建一个 `error` 实例，表示错误的原因：给 `encodeURI()` 或 `decodeURl()` 传递的参数无效。

## Symbol

`symbol` 是一种基本数据类型 （`primitive data type`）。`Symbol()` 函数会返回symbol类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的symbol注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法：`new Symbol()`。每个从 `Symbol()` 返回的 `symbol` 值都是唯一的。一个 `symbol` 值能作为对象属性的标识符；这是该数据类型仅有的目的。`Symbol()` 函数只接受一个可选参数，字符串类型，用于对 `symbol` 的描述，可用于调试但不是访问 `symbol` 本身。

除了自己创建的 `symbol`，`JavaScript` 还内建了一些在 `ECMAScript 5` 之前没有暴露给开发者的 `symbol`，它们代表了内部语言行为。我们很多平时使用的 `API` 实际是借助 `symbol` 实现的。他们的关系如下：

| 隐藏`symbol` | 使用方法 |
| --- | --- |
| [Symbol.iterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator "Symbol.iterator") | 为每一个对象定义了默认的迭代器。该迭代器可以被 `for...of` 循环使用。 |
| [Symbol.asyncIterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator "Symbol.asyncIterator") | 指定了一个对象的默认异步迭代器。如果一个对象设置了这个属性，它就是异步可迭代对象，可用于 `for await...of` 循环。 |
| 正则表达式 `symbols`：[Symbol.match](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/match "Symbol.match") | 一个用于对字符串进行匹配的方法，也用于确定一个对象是否可以作为正则表达式使用。被 `String.prototype.match()`使用。 |
| 正则表达式 `symbols`：[Symbol.replace](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/replace "Symbol.replace") | 一个替换匹配字符串的子串的方法. 被 `String.prototype.replace()` 使用。 |
| 正则表达式 `symbols`：[Symbol.search](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/search "Symbol.search")一个返回一个字符串中与正则表达式相匹配的索引的方法。被 `String.prototype.search()` 使用。 |  |
| 正则表达式 `symbols`：[Symbol.split](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/split "Symbol.split") | 一个在匹配正则表达式的索引处拆分一个字符串的方法.。被 `String.prototype.split()` 使用。 |
| [Symbol.hasInstance](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance "Symbol.hasInstance") | 一个确定一个构造器对象识别的对象是否为它的实例的方法。被 `instanceof` 使用。 |
| [Symbol.isConcatSpreadable](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/isConcatSpreadable "Symbol.isConcatSpreadable") | 一个布尔值，表明一个对象是否应该flattened为它的数组元素。被 `Array.prototype.concat()` 使用。 |
| [Symbol.unscopables](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables "Symbol.unscopables") | 拥有和继承属性名的一个对象的值被排除在与环境绑定的相关对象外。 |
| [Symbol.species](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species "Symbol.species") | 函数值属性，其被构造函数用以创建派生对象。属性允许子类覆盖对象的默认构造函数。 |
| [Symbol.toPrimitive](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive "Symbol.toPrimitive") | 一个将对象转化为基本数据类型的方法。 |
| [Symbol.toStringTag](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag "Symbol.toStringTag") | 用于对象的默认描述的字符串值。被 `Object.prototype.toString()` 使用。 |

* * *

| 方法/属性 | 描述 |
| --- | --- |
| `Symbol.length` | 长度属性，值为 `0` |
| [Symbol.prototype](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/prototype "Symbol.prototype") | `Symbol` 构造函数的原型 |
| [Symbol.for(key)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for "Symbol.for(key)") | 根据给定的键 `key`，来从运行时的 symbol 注册表中找到对应的 `symbol`，如果找到了，则返回它，否则，新建一个与该键关联的 `symbol`，并放入全局 `symbol` 注册表中。 |
| [Symbol.keyFor(sym)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/keyFor "Symbol.keyFor(sym)") | 用来获取 `symbol` 注册表中与某个 `symbol` 关联的键。 |
| `Symbol.prototype.constructor` | 返回创建实例原型的函数. 默认为 `Symbol` 函数。 |
| `Symbol.prototype.description` | 一个包含 `symbol` 描述的只读字符串。 |
| [Symbol.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toString "Symbol.prototype.toString()") | 返回包含 `Symbol` 描述符的字符串。 覆盖 `Object.prototype.toString()` 方法。 |
| [Symbol.prototype.valueOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/valueOf "Symbol.prototype.valueOf()") | 返回 `Symbol` 对象的初始值.。覆盖 `Object.prototype.valueOf()` 方法。 |
| [Symbol.prototype\[@@toPrimitive\]](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/@@toPrimitive "Symbol.prototype[@@toPrimitive]") | 返回 `Symbol` 对象的初始值。 |

## Console

`Console` 并非 `JavaScript` 的内置对象，他是浏览器的用来 `debug` 的一个 `Web API`，现在已经成为标准（虽然可能各个实现有自己的扩展），包括 `NodeJS` 也有自己的实现。平常用的最多的就是 `console.log()`，但其实 `Console` 对象还有很多有用的方法，因为不想另写一篇文章了，就也放到这篇文章下面。

| 方法/属性 | 描述 |
| --- | --- |
| [Console.assert()](https://developer.mozilla.org/zh-CN/docs/Web/API/Console/assert "Console.assert()") | `第一个参数作为断言，如果断言为false`，则将一个错误消息写入控制台。如果断言是 `true`，没有任何反应。 |
| `Console.clear()` | 清空控制台，并输出 `Console was cleared`。 |
| [Console.count()](https://developer.mozilla.org/zh-CN/docs/Web/API/Console/count "Console.count()") | 输出 `count()`被调用的次数。此函数接受一个可选参数 `label`。 |
| `Console.countReset()` | 重置指定标签的计数器值。 |
| `Console.debug()` | 输出“调试”级别的消息且仅仅控制台配置为显示调试输出时才显示该消息。`chrome` 中勾选 `debug level` 的 `verbose` |
| [Console.dir()](https://developer.mozilla.org/zh-CN/docs/Web/API/Console/dir "Console.dir()") | 在控制台中显示指定 `JavaScript` 对象的属性，并通过类似文件树样式的交互列表显示。 |
| [Console.dirxml()](https://developer.mozilla.org/zh-CN/docs/Web/API/Console/dirxml "Console.dirxml()") | 显示一个明确的 `XML/HTML` 元素的包括所有后代元素的交互树。 如果无法作为一个 `element` 被显示，那么会以 `JavaScript` 对象的形式作为替代。 它的输出是一个继承的扩展的节点列表，可以让你看到子节点的内容。 |
| `Console.error()` | 打印一条错误信息 |
| `Console.group()` | 创建一个新的内联 `group`, 后续所有打印内容将会以子层级的形式展示。调用 `groupEnd()` 来闭合组。 |
| `Console.groupCollapsed()` | 创建一个新的内联 `group`。使用方法和 `group()` 相同，不同的是，`groupCollapsed()` 方法打印出来的内容默认是折叠的。调用 `groupEnd()` 来闭合组。 |
| `Console.groupEnd()` | 闭合当前内联 `group`。 |
| `Console.info()` | 打印资讯类说明 |
| `Console.log()` | 打印内容的通用方法。 |
| `Console.profile()` | 开始记录性能描述信息 |
| `Console.profileEnd()` | 结束性能描述信息记录 |
| [Console.table()](https://developer.mozilla.org/zh-CN/docs/Web/API/Console/table "Console.table()") | 将列表型的数据打印成表格。 |
| `Console.time()` | 启动一个以入参作为特定名称的计时器，在显示页面中可同时运行的计时器上限为 `10,000`. |
| `Console.timeEnd()` | 结束特定的 `计时器` 并以豪秒打印其从开始到结束所用的时间。 |
| `Console.timeLog()` | 打印特定 `计时器` 所运行的时间。 |
| `Console.timeStamp()` | 添加一个标记到浏览器的 `Timeline(Performance)` 或 `Waterfall` 工具。 |
| `Console.trace()` | 向 `Web` 控制台 输出一个堆栈跟踪。在页面 `console` 文档中查看堆栈跟踪的详细介绍和示例。 |
| `Console.warn()` | 打印一个警告信息 |

`console` 对象中较多使用的主要有四个方法 `console.log()`, `console.info()`, `console.warn(),` 和 `console.error()`。每一个结果在日志中都有不同的样式，可以使用浏览器控制台的日志筛选功能筛选出感兴趣的日志信息。

* * *

可以在传递给 `console` 的方法的时候使用下面的字符以期进行参数的替换。

| Substitution string | Description |
| --- | --- |
| `%o`or `%O` | 打印 `JavaScript` 对象。在审阅器点击对象名字可展开更多对象的信息。 |
| `%d` or `%i` | 打印整数。支持数字格式化。例如, `console.log("Foo %.2d", 1.1)` 会输出有先导 `0` 的两位有效数字: `Foo 01`。 |
| `%s` | 打印字符串。 |
| `%f` | 打印浮点数。支持格式化，比如 `console.log("Foo %.2f", 1.1)` 会输出两位小数: `Foo 1.10` |

> 注意：`Chrome` 不支持精确格式化。

* * *

可以使用 `%c` 为打印内容定义样式，相当于把打印内容当做一个元素，写入内联样式 `console.log("This is %cMy stylish message", "color: yellow; font-style: italic; background-color: blue;padding: 2px");`：

- `background` 与其全写版本。
- `border` 与其全写版本。
- `border-radius`
- `box-decoration-break`
- `box-shadow`
- `clear` 和 `float`
- `color`
- `cursor`
- `display`
- `font` 与其全写版本。
- `line-height`
- `margin`
- `outline` 与其全写版本。
- `padding`
- `text-transform` 这类 `text-*` 属性
- `white-space`
- `word-spacing` 和 `word-break`
- `writing-mode`

> 控制台信息的默认行为与行内元素相似。为了应用 `padding`, `margin` 这类效果，你应当这样设置`display: inline-block`。

* * *

可以使用嵌套组来把视觉上相关的元素合并，以协助组织你的输出。使用 `console.group()` 创建新的嵌套块，或者用 `console.groupCollapsed()` 创建默认折叠的块，这种块需要点击闭合按钮来展开才能读到。直接调用 `console.groupEnd()` 就可以退出当前组

## Intl

`Intl` 对象是 `ECMAScript` 国际化 `API` 的一个命名空间，它提供了精确的字符串对比、数字格式化，和日期时间格式化。

| 方法/属性 | 描述 |
| --- | --- |
| [Intl.Collator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator "Intl.Collator") | 构造函数，用于启用对语言敏感的字符串比较的对象。 |
| [Intl.DateTimeFormat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat "Intl.DateTimeFormat") | 用于启用语言敏感的日期和时间格式的对象的构造函数。 |
| [Intl.ListFormat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ListFormat "Intl.ListFormat") | 一个语言相关的列表格式化构造器 |
| [Intl.NumberFormat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat "Intl.NumberFormat") | 用于启用语言敏感数字格式的对象的构造函数。 |
| [Intl.PluralRules](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/PluralRules "Intl.PluralRules") | 用于启用多种敏感格式和多种语言语言规则的对象的构造函数。 |
| [Intl.RelativeTimeFormat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RelativeTimeFormat "Intl.RelativeTimeFormat") | 用于启用语言敏感的相对时间格式的构造函数 |