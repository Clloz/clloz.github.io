---
title: '深入扩展运算符'
publishDate: '2020-11-05 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

扩展运算符 (`spread syntax`) 是 `ES6` 提供的一种非常便捷的新语法，给我们操作数组和对象带来了非常大的便利，我在很多文章中也提到了这个语法。但是其实扩展运算符的用法还是比较多比较杂的，我用一篇文章来做一下总结，梳理一下扩展运算的语法和使用细节。

## 基础用法

扩展运算符 `spread syntax` 又叫展开语法，写法是 `...`，顾名思义，其实是用来展开字符串，数组和对象的一种语法，可以在函数调用/数组构造时, 将数组表达式或者 `string` 在语法层面展开；还可以在构造字面量对象时, 将对象表达式按 `key-value` 的方式展开。常用的语法如下：

```javascript
//函数调用：
myFunction(...iterableObj)

//字面量数组构造或字符串：
;[...iterableObj, '4', ...'hello', 6]

// 构造字面量对象时,进行克隆或者属性拷贝（ECMAScript 2018规范新增特性）：
let objClone = { ...obj }
```

在函数调用时使用扩展运算符相当于使用 `Function.prototype.apply`：

```javascript
function myFunction(x, y, z) {}
var args = [0, 1, 2]
myFunction(...args)

//相当于
function myFunction(x, y, z) {}
var args = [0, 1, 2]
myFunction.apply(null, args)
```

和 `apply` 不同的是，我们不仅可以将全部参数放到一个数组中，还可以只将其中几个参数用扩展运算符展开，并且可以再一次调用中多次使用扩展运算符。

```javascript
function myFunction(a, b, c, d, e) {
  console.log(a, b, c, d, e) //-1 0 1 2 3
  console.log(arguments) //[Arguments] { '0': -1, '1': 0, '2': 1, '3': 2, '4': 3 }
}
var args = [0, 1]
myFunction(-1, ...args, 2, ...[3])
```

---

使用 `new` 关键字来调用构造函数时，不能直接使用数组加上 `apply` 的方式（`apply` 执行的是调用 `[[Call]]` , 而不是构造 `[[Construct]]`）。有了展开语法, 将数组展开为构造函数的参数就很简单了：

```javascript
var dateFields = [1970, 0, 1] // 1970年1月1日
var d = new Date(...dateFields)
```

如果想要不使用扩展运算符实现同样的效果，我们必须用一个函数包装构造函数，将这个新的构造函数的 `prototype` 设为原构造函数的实例，用 `Object.create(constructor.prototype)`（这里主要是为了新构造函数原型的修改不影响原构造函数的原型，直接用 `constructor.prototype` 作为新构造函数的原型也可以实现）。

```javascript
function applyAndNew(constructor, args) {
  function partial() {
    return constructor.apply(this, args)
  }
  if (typeof constructor.prototype === 'object') {
    partial.prototype = Object.create(constructor.prototype)
  }
  return partial
}

function myConstructor() {
  console.log('arguments.length: ' + arguments.length)
  console.log(arguments)
  this.prop1 = 'val1'
  this.prop2 = 'val2'
}

var myArguments = ['hi', 'how', 'are', 'you', 'mr', null]
var myConstructorWithArguments = applyAndNew(myConstructor, myArguments)

console.log(new myConstructorWithArguments())
// (myConstructor构造函数中):           arguments.length: 6
// (myConstructor构造函数中):           ["hi", "how", "are", "you", "mr", null]
// ("new myConstructorWithArguments"中): {prop1: "val1", prop2: "val2"}
```

---

当然用的最多的还是在字面量数组上，没有展开语法的时候，只能组合使用 `push, splice, concat` 等方法，来将已有数组元素变成新数组的一部分。有了展开语法, 通过字面量方式, 构造新数组会变得更简单、更优雅：

```javascript
var parts = ['shoulders', 'knees']
var lyrics = ['head', ...parts, 'and', 'toes']
// ["head", "shoulders", "knees", "and", "toes"]
```

可以用来实现数组浅拷贝：

```javascript
var arr = [1, 2, 3]
var arr2 = [...arr] // like arr.slice()
arr2.push(4)

// arr2 此时变成 [1, 2, 3, 4]
// arr 不受影响
```

连接多个数组：

```javascript
var arr1 = [0, 1, 2]
var arr2 = [3, 4, 5]
var arr3 = [...arr1, ...arr2]
```

---

扩展运算符还可以将已有对象的所有可枚举(`enumerable`)属性拷贝到新构造的对象中。该方法为浅拷贝，可以拷贝 `Symbol` 属性，但不包含原型上的属性和方法。如果同时拷贝多个对象，后面的对象会覆盖前面对象的同名属性。

```javascript
var obj1 = { foo: 'bar', x: 42, [Symbol('a')]: 123 }
var obj2 = { foo: 'baz', x: 100, y: 13 }

var clonedObj = { ...obj1 }
console.log(clonedObj) //{ foo: 'bar', x: 42, [Symbol(a)]: 123 }

var mergedObj = { ...obj1, ...obj2 }
console.log(mergedObj) //{ foo: 'baz', x: 100, y: 13, [Symbol(a)]: 123 }
```

该方法的性质和 `Object.assign` 类似，但是 `Object.assign()` 函数会触发 `setters`，而展开语法则不会。

扩展运算符用于展开对象的时候可以发生覆盖，后面展开的或声明的属性会覆盖前面的。

```javascript
const test = {
    name: 'clloz',
    age: 29
}
{...test, age: 30} // {name: "clloz", age: 30}
```

## 注意事项

1. 在数组或函数参数中使用展开语法时, 扩展运算符只能用于可迭代对象。
2. 只有函数调用时，扩展运算符才可以放在圆括号中，否则会报错。
3. 只能用在函数调用，字面量数组（可以在数组中展开字符串），字面量对象中。
4. 用于数组的解构赋值的时候，扩展运算符只能处于最后一个。
5. 展开对象可以是任意可迭代对象。

## 剩余参数

剩余参数语法允许我们将一个不定数量的参数表示为一个数组。如果函数的最后一个命名参数以 `...` 为前缀，则它将成为一个由剩余参数组成的真数组，其中从 `0`（包括）到 `theArgs.length`（排除）的元素由传递给函数的实际参数提供。

剩余语法(`Rest syntax`) 看起来和展开语法完全相同，不同点在于, 剩余参数用于解构数组和对象。从某种意义上说，剩余语法与展开语法是相反的：展开语法将数组展开为其中的各个元素，而剩余语法则是将多个元素收集起来并“凝聚”为单个元素。扩展运算符是用在函数调用，而剩余参数是用在函数声明。

剩余参数和 `arguments` 对象之间的区别主要有三个：

- 剩余参数只包含那些没有对应形参的实参，而 `arguments` 对象包含了传给函数的所有实参。
- `arguments` 对象不是一个真正的数组，而剩余参数是真正的 `Array` 实例，也就是说你能够在它上面直接使用所有的数组方法，比如 `sort`，`map`，`forEach` 或 `pop`。
- `arguments` 对象还有一些附加的属性 （如 `callee` 属性）。

如果剩余参数（包括在解构赋值中）右侧有逗号，会抛出 `SyntaxError`，因为剩余元素必须是函数的最后一个参数或者数组的最后一个元素。
