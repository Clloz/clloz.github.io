---
title: '深入 JavaScript 数组'
publishDate: '2020-10-09 12:00:00'
description: ''
tags:
  - js
  - 奇技淫巧
  - 编程技巧
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

本文整理一些我觉得有用或者没用的（说不定哪天就有用了 :stuck_out_tongue: ） `JavaScript` 数组技巧。本文前半部分是对 `Array` 的 `API` 进行比较深入的解读，后半部分是对一些具体场景的解决方案。本文较长，请耐心阅读。

## 创建数组

`JavaScript` 的数组创建大致三种方式：字面量，`new Array(el1, el2, el3...)`，`new Array(length)`。`new` 可以省略。

`new Array()` 有两种初始化可能，即 `new Array(el1, el2, el3...)`，`new Array(length)`，出现第二种情况当且仅当只有一个参数，并且该参数是 $1 - (2^{32} - 1)$ 之间的整数，其他情况都会把传入的参数当做生成的数组的元素。

> 实际上， `JavaScript` 并没有常规的数组，所有的数组其实就是个对象，只不过会自动管理一些"数字"属性和 `length` 属性罢了。说的更直接一点, `JavaScript` 中的数组根本没有索引，因为索引应该是数字，而 `JavaScript` 中数组的索引其实是字符串。`arr[1]`其实就是 `arr["1"]`，给`arr["1000"] = 1`，`arr.length` 也会自动变为 `1001`。这些表现的根本原因就是，`JavaScript` 中的对象就是字符串到任意值的键值对。注意键只能是字符串。不过目前 `ES6` 中已经有了类似于 `Java` 等语言的 `Map` 类型,键可以是任意类型的值。

## 稀疏数组和密集数组

在 `Java` 和C语言中，数组是一片连续的存储空间，有着固定的长度。即数组元素之间是紧密相连的，不存在空隙，这就是密集数组。在 `JavaScript` 中是支持稀疏数组的，比如我们用 `new Array(length)` 创建的就是一个稀疏数组。

我们熟知的 `Array` 的 `API` 都会对这些空位有自己的处理：

- `flat()，flatMap()` 会移除空位。
- `Object.keys()`，`Object.entires()` 会跳过数组的空位
- `forEach(), filter(), reduce(), every() 和some()`都会跳过空位。
- `map()` 会跳过空位，但会保留这个值，即保留这个空位。
- `join()`和 `toString()` 会将空位视为 `undefined`，而 `undefined` 和 `null` 会被处理成空字符串。
- `Array.from` 将数组的空位转为 `undefined`
- `…` 将空位转换为 `undefined`
- `copyWithin` 将空位一起拷贝
- `fill()` 将空位视为正常的数组位置
- `for…of` 循环会遍历空位
- `entries()`、`keys()`、`includes()`、`values()`、`find()` 和 `findIndex()` 将空位处理成 `undefined`。

如果你遍历数组希望跳过数组中的未赋值空位，可以使用 `in` 操作符，

```javascript
let a = []
a[1] = 'clloz'
console.log(a) //[ <1 empty item>, 'clloz' ]
console.log(0 in a) //false
console.log(1 in a) //true
```

---

创建密集数组的方法：

```javascript
//利用 apply 将数组作为多个参数传入
Array.apply(null, Array(3)) //[undefined, undefined, undefined]

//生成一个元素值等于下标的数组
Array.apply(null, Array(3)).map(Function.prototype.call.bind(Number)) // [0, 1, 2]
//上面这行代码等同于下面的代码
;[undefined, undefined, undefined].map((value, index) => Number.call(value, index)) //index

Array.from({ length: 3 }) //Array.from() 可以作用于拥有一个 length 属性和若干索引属性的任意对象

Array.apply(null, { length: 3 }) //这种用法突出了JavaScript中的数组其实就是个对象，只要有 `length` 属性，并且都是数字索引属性即使数组

new Array(...Array(3)) //扩展运算符和 apply 类似的效果
```

`Array.apply` 实际上是利用了 `apply` 将数组作为多个参数传递的特性来生成密集数组，`Array.call(null, Array(3))` 实际上等于 `Array(arr[0], arr[1], arr[2])`（设 `Array(3)` 生成的数组是 `arr`）。

如果想让数组变为稀疏数组，可以用 `delete` 操作符删除数组的项，比如 `delete arr[1]` 则下标为 `1` 的数组项会变为 `empty`。

## Array API 深入

我在 [JavaScript常用内置对象API](https://www.clloz.com/programming/front-end/js/2020/07/10/built-in-objects-api/ 'JavaScript常用内置对象API') 一文整理了一些 `JavaScript` 内置对象的 `API`，主要是当做工具表，在使用一些不熟悉的 `API` 的时候有快速查询的地方（不常使用的知识很快就忘了 :sleeping: ，不过学习也就是不断遗忘和重复的过程）。本文主要是说 `Array` 的技巧，必然要对 `API` 深入一些，这一小节我们就对 `Array` 相关的内容进行梳理。

因为数组的 `API` 很多，有些很类似，特别是有没有返回值，以及是否会改变原数组，很容易混淆，在这一小节的最前面进行一个整理。

### 不改变原数组

- `Array.from()`
- `Array.isArray()`
- `Array.prototype.concat()`
- `Array.prototype.every()`
- `Array.prototype.filter()`
- `Array.prototype.find()`
- `Array.prototype.findIndex()`
- `Array.prototype.flat()`
- `Array.prototype.flatMap()`
- `Array.prototype.forEach()` **forEach本身不改变原数组，但是 callback 可能会改变**
- `Array.prototype.includes()`
- `Array.prototype.map()` **map，但是 callback 可能会改变**
- `Array.prototype.reduce()`
- `Array.prototype.reduceRight()`
- `Array.prototype.slice()`

### 改变原数组

- `Array.prototype.copyWithin()`
- `Array.prototype.fill()`
- `Array.prototype.pop()`
- `Array.prototype.push()`
- `Array.prototype.shift()`
- `Array.prototype.sort()`
- `Array.prototype.splice()`
- `Array.prototype.unshift()`

### 返回数组

- `Array.from()`
- `Array.prototype.concat()`
- `Array.prototype.copyWithin()`
- `Array.prototype.fill()`
- `Array.prototype.filter()`
- `Array.prototype.flat()`
- `Array.prototype.flatMap()`
- `Array.prototype.map()`
- `Array.prototype.slice()`
- `Array.prototype.sort()`
- `Array.prototype.splice()`

### 不返回数组

- `Array.isArray()` 返回 `Boolean`
- `Array.prototype.every()` 返回 `Boolean`
- `Array.prototype.find()` 返回第一个满足测试函数的元素值或 `undefined`
- `Array.prototype.findIndex()` 返回第一个满足测试函数的元素索引或 `-1`
- `Array.prototype.forEach()` 返回 `undefined`
- `Array.prototype.includes()` 返回 `Boolean`
- `Array.prototype.pop()` 返回元素的值
- `Array.prototype.pop()` 返回数组的新长度
- `Array.prototype.reduce()` 返回遍历完成后累积的值
- `Array.prototype.reduceRight()`返回遍历完成后累积的值
- `Array.prototype.shift()` 返回删除的元素
- `Array.prototype.unshift()` 返回新数组的长度

## Array.length

`JavaScript` 规定了数组的 `length` 是一个 `32bits` 无符号整数，所以数组的最大长度是是 $2^{32} - 1$，所以 `Array.length` 的范围应该是在 `0 - 4294967295` 之间。

```javascript
var namelistA = new Array(4294967296) // 2的32次方 = 4294967296
var namelistC = new Array(-100) // 负号

console.log(namelistA.length) // RangeError: 无效数组长度
console.log(namelistC.length) // RangeError: 无效数组长度

var namelistB = []
namelistB.length = Math.pow(2, 32) - 1 //set array length less than 2 to the 32nd power
console.log(namelistB.length) // 4294967295
```

改变 `length` 的大小会改变数组。当我们设置 `length` 小于数组长度的时候。超过的部分会被截断。当我们设置 `length` 大于数组长度的时候，实际的元素数目会增加，新增的元素的值为 `undefined`（实际上和 `Array(length)` 一样，新增的位置此时并没有包含任何实际的元素，不能理所当然地认为它包含 `arrayLength` 个值为 `undefined` 的元素，但是如果输出）。

```javascript
let arr = [1, 2, 3]

arr.length = 5

console.log(arr, arr[3], arr[4]) //[ 1, 2, 3, <2 empty items> ] undefined undefined

let b = arr.map((e) => e)
console.log(b) //[ 1, 2, 3, <2 empty items> ]

arr.forEach((e) => console.log(e)) //forEach 会跳过空位
//1
//2
//3
```

`Array.length` 的属性特性为

- `writable：true` 属性值可写。
- `enumerable：false` 属性不可以通过迭代器 `for` 或 `for...in` 进行迭代。
- `configurable：false` 不可删除或更改属性特性。

## Array.from

`Array.from()` 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。稀疏数组的空位会被转为 `undefined`。`Array.from.length === 1`。当我们有需要将对象转为数组的时候（比如需要使用数组方法而不想使用 `apply` 和 `call`），`Array.from` 是一个不错的选择。

`Array.from()` 的第一个参数可以类数组对象（拥有一个 `length` 属性和若干索引属性的任意对象，包括字符串）可迭代对象（可以获取对象中的元素,如 `Map` 和 `Set` 等）包括字符串。我的理解是可以用迭代器 `for ... of` 进行迭代的对象都可以。

`Array.from()` 可以接受第二，第三个参数，可以用这两个参数在新生成的数组上执行一次 `map`，`Array.from(obj, mapFn, thisArg)` 就相当于 `Array.from(obj).map(mapFn, thisArg)`, 除非创建的不是可用的中间数组。

```javascript
Array.from('clloz') //["c", "l", "l", "o", "z"]

//从Set生成数组
const set = new Set(['foo', 'bar', 'baz', 'foo'])
Array.from(set) // [ "foo", "bar", "baz" ]

//从Map生成数组
const map = new Map([
  [1, 2],
  [2, 4],
  [4, 8]
])
Array.from(map) // [[1, 2], [2, 4], [4, 8]]

Array.from(map.keys()) //[1, 2, 4]
Array.from(map.values()) //[2, 4, 8]

//从类数组对象生成数组
function f() {
  return Array.from(arguments)
}
f(1, 2, 3) //[ 1, 2, 3 ]

//使用map生成元素值为下标的数组
Array.from({ length: 5 }, (v, i) => i) // [0, 1, 2, 3, 4]
```

如果不考虑 `Array.from` 的 `map`，`Array.from` 做的事情类似如下函数

```javascript
Array.from = function (arrayLike) {
  let k = 0
  len = arrayLike.length
  let result = new Array(len)
  while (k < len) {
    result[k] = arrayLike[k]
    k++
  }
  return result
}
let c = Array.from('clloz')
console.log(c) // [ 'c', 'l', 'l', 'o', 'z' ]
```

我这个只是大致演示一下 `Array.from` 做的事情，完整的 `polyfill` 参考 [Array.from - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from 'Array.from - MDN')

## Array.isArray()

`Array.isArray()` 有几个容易忽略的点: 1. `Array.isArray(Array.prototype)` 返回 `true`。`Array.prototype` 本身也是一个数组，`length` 为 `0`。 2. `Array.isArray()` 能检测 `iframes` 中的 `Array`，`instanceof` 则不能。 3. `Array.isArray()` 的 `polyfill`。

```javascript
if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}
```

## Array.of()

`Array.of()` 就是没有 `Array(length)` 形式的 `Array`。也就是说他只支持 `Array.of(el1, el2, ...)` 这种形式。它是 `ES6` 中的新方法。

```javascript
//polyfill
if (!Array.of) {
  Array.of = function () {
    return Array.prototype.slice.call(arguments)
  }
}
```

## Array.prototype.concat()

`Array.prototype.concat()` 需要注意的一点就是它是浅拷贝，当我们的数组中有对象或者嵌套数组的时候，是无法进行深拷贝的。细节看下面的代码：

```javascript
let a = [[1], 2]
let b = [[3], 4, { name: 'clloz' }]

let c = a.concat(b)
console.log(c) //[ [ 1 ], 2, [ 3 ], 4, { name: 'clloz' } ]
b[2].name = 'clloz1992'
console.log(c)
a[0].push(100) //[ [ 1 ], 2, [ 3 ], 4, { name: 'clloz1992' } ]
console.log(c) //[ [ 1, 100 ], 2, [ 3 ], 4, { name: 'clloz1992' } ]
```

`concat` 除了接受数组作为参数，也可以接受其他值，如果值是引用类型则将引用添加到新的数组中，如果是值类型则将值添加到新数组中（`String`，`Number` 或者 `Boolean`，非包装类型）。

我自己实现的一个简单的 `concat` 的 `polyfill`：

```javascript
Array.prototype._concat = function () {
  if (Object.prototype.toString.call(this) !== '[object Array]') throw Error('this is not a Array!')
  let result = Array.prototype.slice.call(this)
  let args = Array.prototype.slice.call(arguments)

  for (let i = 0; i < args.length; i++) {
    if (Array.isArray(args[i])) {
      for (let j = 0; j < args[i].length; j++) {
        result.push(args[i][j])
      }
    }
  }
  return result
}
let a = [1, 2, 3, 4]
let b = [5, 6, 7]
let c = [8, 9, 10]
let d = a._concat(b, c)
console.log(d) //[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

## Array.prototype.every()

`Array.prototype.every()` 是 `ES5` 添加的数组方法，下面列出 `every` 的几个注意点：

- `every` 和数学中的"所有"类似，当所有的元素都符合条件才会返回 `true`。正因如此，若传入一个空数组，无论如何都会返回 `true`。
- 没有传入 `this` 值，`callback` 中的 `this` 在非严格模式下是全局对象，严格模式下为 `undefined`。
- 只要任何一次 `callback` 的执行返回 `false`，将直接返回 `false`（后面的元素讲不会再执行回调函数）。否则会执行到最后一个元素，返回 `true`。
- 不改变原数组。
- `every` 遍历的元素范围在第一次调用 `callback` 之前就已确定了。在调用 `every` 之后添加到数组中的元素不会被 `callback` 访问到。如果数组中存在的元素被更改，则他们传入 `callback` 的值是 `every` 访问到他们那一刻的值。那些被删除的元素或从来未被赋值的元素将不会被访问到（所以对于稀疏数组中的空位 `every` 是不会处理的）。

`polyfill` 实现参考 [Array.prototype.every() - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every 'Array.prototype.every() - MDN')

## Array.prototype.fill()

`Array.prototype.fill()` 是 `ES6` 添加的数组方法，接受三个参数 `value，start 和 end`，`start` 和 `end` 的默认值分别是 `0，this.length`，如果传入的值是个负数, 则开始索引会被自动计算成为 `length+start/end`，即从后往前数第 `start/end` 个，`-1` 就是倒数第一个。几个注意点:

- 会填充稀疏数组的空位 `Array(3).fill(4)` 返回 `[4,4,4]`。
- 若填充的值是对象，则填充的是对象的引用。`let a = Array(3).fill({}); console.log(a[0] === a[1])` 将返回 `true`。
- 原数组会改变，返回改变后的数组。

## Array.prototype.filter()

`Array.prototype.filter()` 是 `ES5` 添加的数组方法。`filter` 为数组中的每个元素调用一次 `callback` 函数，并利用所有使得 `callback` 返回 `true` 或等价于 `true` 的值的元素创建一个新数组。注意点如下：

- `filter` 的一个参数 `callback` 接受三个参数，**元素值**，**元素索引**，**数组本身**；第二个参数是 `callback` 执行时的 `this`，若没有传入则在非严格模式下为全局对象，严格模式下为 `undefined`。
- `callback` 只会在已经赋值的索引上被调用，对于那些已经被删除或者从未被赋值的索引不会被调用。稀疏数组中的空位不会被处理。
- `filter` 遍历的元素范围在第一次调用 `callback` 之前就已经确定了。在调用 `filter` 之后被添加到数组中的元素不会被 `filter` 遍历到（比如在遍历过程中）。如果已经存在的元素被改变了，则他们传入 `callback` 的值是 `filter` 遍历到它们那一刻的值。被删除或从来未被赋值的元素不会被遍历到。

## Array.prototype.find()

`Array.prototype.find()` 是 `ES6` 添加的数组方法，参数和注意点和 `filter` 类似，不同的是不会跳过稀疏数组的空位，找到立即返回元素值（只找第一个），否则返回 `undefined`。

## Array.prototype.findIndex()

和 `find` 几乎相同，不过返回值是元素索引，若没有找到则返回 `-1`。

## Array.prototype.flat()

`ES2019` 新增的数组扁平化 `API`，支持设定深度，不改变原数组，返回扁平化后的新数组。**该方法会移除稀疏数组中的空位**。

## Array.prototype.flatMap()

这个方法相当于先对数组执行 `map`，然后对 `map` 之后返回的数组执行 `flat(1)`。

```javascript
var arr1 = [1, 2, 3, 4]
JSON.stringify(arr1.map((x) => [[x * 2]])) // "[[[2]],[[4]],[[6]],[[8]]]"
JSON.stringify(arr1.map((x) => [[x * 2]]).flat(1)) //"[[2],[4],[6],[8]]"
JSON.stringify(arr1.map((x) => [[x * 2]]).flat(1)) ===
  JSON.stringify(arr1.flatMap((x) => [[x * 2]])) //true
```

## Array.prototype.forEach()

`forEach()` 方法按升序为数组中含有效值的每一项执行一次 `callback` 函数，稀疏数组上的空位被跳过。`forEach` 接受两个参数，第一个是 `callback` 回调函数，接受三个参数：当前元素值，当前元素索引，数组对象本身（后两个可选）；第二个是回调函数执行时的 `this`。该方法注意点总结：

- 稀疏数组的空位会被跳过。
- `this` 默认在严格模式下是 `undefined`，非严格模式下是全局对象。
- `forEach()` 遍历的范围在第一次调用 `callback` 前就会确定。调用 `forEach` 后添加到数组中的项不会被 `callback` 访问到。如果已经存在的值被改变，则传递给 `callback` 的值是 `forEach()` 遍历到他们那一刻的值。已删除的项不会被遍历到。如果已访问的元素在迭代时被删除了（例如使用 `shift()`），之后的元素将被跳过。
- `forEach()` 为每个数组元素执行一次 `callback` 函数，返回值始终是 `undefined`，所以不可被链式调用，一般会放在链式调用的最后。
- `forEach()` 本身不会改变原数组，但是在回调函数中由于我们可以传入原数组和当前元素索引，所以回调函数中可以修改原数组。
- 除了抛出异常以外，没有办法中止或跳出 `forEach()` 循环。如果你需要中止或跳出循环，`forEach()` 方法不是应当使用的工具。

```javascript
//回调函数改变原数组
let arr = [1, 2, 3]
arr.forEach((v, i, thisArr) => {
  thisArr[i] *= 2
})
console.log(arr) //[ 2, 4, 6 ]

//迭代过程中修改数组，有元素会被跳过，其他遍历方法类似
var words = ['one', 'two', 'three', 'four']
words.forEach(function (word) {
  console.log(word)
  if (word === 'two') {
    words.shift()
  }
})
// one
// two
// four
```

## Array.prototype.includes()

`Array.prototype.includes()` 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 `true`，否则返回 `false`。该方法接受两个参数，一个是要查找的值，另一个可选参数是从哪个索引开始查找。

`Array.prototype.includes()` 的注意点：

- 比较字符和字符串区分大小写。
- 稀疏数组的空位被当做 `undefined` 处理（当你想找的是 `undefined` 的时候会返回 `true`）
- 如果第二个参数大于等于数组长度，会直接返回 `false`，并且不会进行查找。
- 如果第二个参数 `fromIndex` 为负值，计算出的索引 `array.length + fromIndex` 将作为开始搜索的位置。如果计算出的索引仍然小于 `0`，则整个数组都会被搜索。
- 不仅可以用于数组，也可以用于类数组对象，需利用 `call` 和 `apply` 。

## Array.prototype.indexOf()

`indexOf()` 方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回 `-1`。接受两个参数，一个是要查找的值，另一个可选参数是从哪个索引开始查找。该方法和 `Array.prototype.includes()` 类似，只不过一个返回的是布尔值，一个返回的是索引。匹配是否和参数相等采用的是 `===` 严格相等。

## Array.prototype.join()

`join()` 方法将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串。如果数组只有一个项目，那么将返回该项目而不使用分隔符。接受一个可选参数作为连接数组元素时的分隔符。返回所有数组元素连接的字符串如果 `arr.length === 0`，则返回空字符串。该方法的注意点如下：

- 如果一个元素为 `undefined` 或 `null`，它会被转换为空字符串。
- 如果元素是 `Object` 或 `Function`，则会调用对应的 `toString()` 方法转为字符串。
- `Number(), String(), Boolean` 包装的对象也都会被当做基本类型处理。
- 利用 `call` 和 `apply` 可以用在其他可迭代对象上，比如 `arguments`，字符串。

```javascript
let a = { length: 10, name: 'clloz' }
let str = Array.prototype.join.call(a, ',')
console.log(str) //,,,,,,,,,
```

```javascript
function m() {}
let arr = [
  1,
  2,
  3,
  4,
  { name: 'clloz' },
  [2, [3, 4, 5]],
  m,
  Number(10),
  true,
  String('clloz'),
  Boolean(1)
]
console.log(arr.join(','))
//1,2,3,4,[object Object],2,3,4,5,function m() {},10,true,clloz,true
```

## Array.prototype.keys()

`ES6` 添加的数组方法.`keys()` 方法返回一个包含数组中每个索引键的 `Array Iterator` 对象。一个新的 `Array` 迭代器对象。

```javascript
var arr = ['a', , 'c']
var sparseKeys = Object.keys(arr)
var denseKeys = [...arr.keys()]
console.log(sparseKeys) // ['0', '2']
console.log(denseKeys) // [0, 1, 2]
```

## Array.prototype.lastIndexOf()

理解为反向的 `Array.prototype.indexOf()` 即可。

## Array.prototype.map()

`Array.prototype.map()` 是 `ES5` 提供的数组方法。`map()` 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。

和 `forEach()` 相同，接受两个参数，第一个是 `callback` 回调函数，接受三个参数：当前元素值，当前元素索引，数组对象本身（后两个可选）；第二个是回调函数执行时的 `this`。注意点如下：

- 稀疏数组的空位会被跳过并被保留在返回的数组中（根据规范中定义的算法，如果被 `map` 调用的数组是离散的，新数组将也是离散的保持相同的索引为空）。
- 只有在你需要返回数组或需要回调函数返回值的时候再使用 `map`，否则应该使用 `forEach` 或 `for ... of`。
- 和所有遍历方法一样，在回调中修改数组可能会让一些元素无法执行回调。
- 利用 `call` 和 `apply` 可以用在其他可迭代对象上，比如 `arguments`，字符串。
- 注意回调函数的参数个数和顺序，一个经典的问题就是 `["1", "2", "3"].map(parseInt);` 返回 `[1, NaN, NaN]`
- 回调函数没有返回值，生成的元素是 `undefined`。

## Array.prototype.pop()

`ES3` 就存在的数组方法。`pop()` 方法从数组中删除最后一个元素，并返回该元素的值(当数组为空时返回 `undefined`)。此方法更改数组的长度。可应用在类似数组的对象上。`pop` 方法根据 `length` 属性来确定最后一个元素的位置。如果不包含 `length` 属性或 `length` 属性不能被转成一个数值，会将 `length` 置为 `0`，并返回 `undefined`。

```javascript
//数组即对象
let a = { length: 10, name: 'clloz' }
Array.prototype.pop.call(a)
console.log(a) //{ length: 9 }

//length 为 0，下标 0 处本来就没有元素，不会有任何变化
var obj = {
  2: 3,
  3: 4,
  length: 0,
  pop: Array.prototype.pop
}

obj.pop()
console.log(obj) //{ '2': 3, '3': 4, length: 0, pop: [Function: pop] }

//length 为 3，下标为 2 的元素是 `3`，该元素奖杯删除，`length` 减一
var obj = {
  2: 3,
  3: 4,
  length: 0,
  pop: Array.prototype.pop
}

obj.pop()
console.log(obj) //{ '2': 3, '3': 4, length: 0, pop: [Function: pop] }

//没有 length 或 length不能转为数字，会添加 length属性，属性值为 0
var obj = {
  2: 3,
  3: 4,
  pop: Array.prototype.pop
}

obj.pop()
console.log(obj) //{ '2': 3, '3': 4, pop: [Function: pop], length: 0 }
```

## Array.prototype.push()

`ES3` 就存在的数组方法。`push()` 方法将一个或多个元素添加到数组的末尾，并返回该数组的新长度。

可以接受多个参数，作为添加到数组末尾的元素，返回值为新的 `length` 属性。和 `pop` 一样利用 `call` 和 `apply` 可以应用到非数组对象上。

push 方法根据 `length` 属性来决定从哪里开始插入给定的值。如果 `length` 不能被转成一个数值，则插入的元素索引为 `0`，包括 length 不存在时。当 `length` 不存在时，将会创建它。这一点非常重要，看下面的代码：

```javascript
var obj = {
  2: 3,
  3: 4,
  length: 2,
  splice: Array.prototype.splice,
  push: Array.prototype.push
}

obj.push(1)
obj.push(2)
console.log(obj)

//{
//  '2': 1,
//  '3': 2,
//  length: 4,
//  splice: [Function: splice],
//  push: [Function: push]
//}
```

因为对象中的 `length` 为 `2`，所以从下标 `2` 开始插入，并改变 `length` 的值，所以最后 `1` `2` 分别插入了下标 `2` 和 `3` 的报位置，取代了原来的值 `3` 和 `4`。而如果没有 `length` 则会创建 `length`，初始值为 `0`，并从 `0` 开始插入，最后结果如下：

```javascript
var obj = {
  2: 3,
  3: 4,
  splice: Array.prototype.splice,
  push: Array.prototype.push
}

obj.push(1)
obj.push(2)
console.log(obj)

//{
//  '0': 1,
//  '1': 2,
//  '2': 3,
//  '3': 4,
//  splice: [Function: splice],
//  push: [Function: push],
//  length: 2
//}
```

唯一的原生类数组（`array-like`）对象是 `String`，它们并不适用该方法，因为字符串是不可改变的。

```javascript
let a = { length: 10, name: 'clloz' }
Array.prototype.push.call(a, 1, 2, 3, 4)
console.log(a)
console.log(a[0])
```

## Array.prototype.reduce()

`Array.prototype.reduce()` 是 `ES5` 提供的数组方法。`reduce()` 方法对数组中的每个元素执行一个由您提供的 `reducer` 函数(升序执行)，将其结果汇总为单个返回值。

该方法接受两个参数，回调函数 `reducer` 和 初始值 `initialValue`。`reducer` 接受四个参数，`accumulator` 为上一次回调函数执行累积的值或者 `initialValue`，`currentValue` 当前正在处理的元素，`index` 当前处理元素的索引，`array` 调用 `reducer` 的数组，后两个参数可选。`initialValue` 作为第一次调用 `callback` 函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 `reduce` 将报错。返回值为累积处理的结果。

回调函数第一次执行时，`accumulator` 和 `currentValue` 的取值有两种情况：如果调用 `reduce()` 时提供了 `initialValue`，`accumulator` 取值为 `initialValue`，`currentValue` 取数组中的第一个值；如果没有提供 `initialValue`，那么 `accumulator` 取数组中的第一个值，`currentValue` 取数组中的第二个值。如果没有提供 `initialValue`，`reduce` 会从索引1的地方开始执行 `callback` 方法，跳过第一个索引。如果提供 `initialValue`，从索引 `0` 开始。

如果数组为空且没有提供 `initialValue`，会抛出 `TypeError` 。如果数组仅有一个元素（无论位置如何）并且没有提供 `initialValue`， 或者有提供 `initialValue` 但是数组为空，那么此唯一值将被返回并且 `callback` 不会被执行。

```javascript
//reduce 实现 map
if (!Array.prototype.mapUsingReduce) {
  Array.prototype.mapUsingReduce = function (callback, thisArg) {
    return this.reduce(function (mappedArray, currentValue, index, array) {
      mappedArray[index] = callback.call(thisArg, currentValue, index, array)
      return mappedArray
    }, [])
  }
}

;[1, 2, , 3].mapUsingReduce((currentValue, index, array) => currentValue + index + array.length) // [5, 7, , 10]

//多函数管道 将多个函数当做数组进行 reduce实现特定功能
// Building-blocks to use for composition
const double = (x) => x + x
const triple = (x) => 3 * x
const quadruple = (x) => 4 * x

// Function composition enabling pipe functionality
const pipe =
  (...functions) =>
  (input) =>
    functions.reduce((acc, fn) => fn(acc), input)

// Composed functions for multiplication of specific values
const multiply6 = pipe(double, triple)
const multiply9 = pipe(triple, triple)
const multiply16 = pipe(quadruple, quadruple)
const multiply24 = pipe(double, triple, quadruple)

// Usage
multiply6(6) // 36
multiply9(9) // 81
multiply16(16) // 256
multiply24(10) // 240
```

## Array.prototype.reduceRight()

`Array.prototype.reduceRight()` 是 `ES5` 提供的数组方法。从右向左进行遍历的 `reduce()`。

## Array.prototype.reverse()

`ES1` 就存在的数组方法。`reverse()` 方法将数组中元素的位置颠倒，并返回该数组。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。该方法会改变原数组。利用 `call` 和 `apply` 可以用在其他可迭代对象上，比如 `arguments`。唯一的原生类数组（`array-like`）对象是 `String`，它们并不适用该方法，因为字符串是不可改变的。

## Array.prototype.shift()

`ES3` 增加的数组方法。`shift()` 方法从数组中删除第一个元素，并返回该元素的值。此方法更改数组的长度。该方法移除索引为 `0` 的元素(即第一个元素)，并返回被移除的元素，其他元素的索引值随之减 `1`。如果 `length` 属性的值为 `0` (长度为 `0`)，则返回 `undefined`。该方法能够通过 `call` 或 `apply` 方法作用于类似数组的对象上，若对象没有 `length` 属性，调用该方法不会有其他操作，但是会添加 `length` 属性，属性值 `0`。

```javascript
//没有length会给对象添加值为 0 的 length 属性，不执行其他操作
var obj = {
  2: 3,
  3: 4,
  shift: Array.prototype.pop
}

obj.shift()
console.log(obj) //{ '2': 3, '3': 4, shift: [Function: pop], length: 0 }

//length 为 0 不进行任何操作，返回undefined
var obj = {
  2: 3,
  3: 4,
  length: 0,
  shift: Array.prototype.pop
}

obj.shift()
console.log(obj) //{ '2': 3, '3': 4, length: 0, shift: [Function: pop] }
```

其实就是一个反向的 `Array.prototype.pop()`。

## Array.prototype.slice()

`slice()` 方法返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的浅拷贝（包括 `begin`，`不包括end`）。原始数组不会被改变。

该方法接受两个可选参数 `begin` 和 `end`，表示提取元素的索引，`[begin, end)`，包括 `begin` 不包括 `end`。

若没有传入 `begin` 则从 `0` 开始提取；没有传入 `end`，提取到原数组末尾。若 `begin` 或 `end` 为负，则计算 `length + begin`，若计算值在数组的索引范围内则从计算值开始提取，若依然为负则从 `0` 开始。如果 `begin` 大于原数组的长度，则会返回空数组。如果 `end` 大于数组的长度，`slice` 也会一直提取到原数组末尾。

需要注意 `slice` 是浅拷贝，如果某个元素是对象引用，在返回的新数组中依然是相同的引用。对于字符串、数字及布尔值来说（不是 `String`、`Number` 或者 `Boolean` 对象），`slice` 会拷贝这些值到新的数组里。在别的数组里修改这些字符串或数字或是布尔值，将不会影响另一个数组。

可以使用 `apply` 或 `call` 将一个类数组（`Array-like`）对象/集合转换成一个新数组。

## Array.prototype.some()

`some()` 方法测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个 `Boolean` 类型的值。

该方法可以类比 `Array.prototype.every()`，`every()` 是找到一个 `callback` 返回值可转换为为 `false` 的就立即返回，否则遍历所有元素，最后返回 `true`。`some()` 是找到一个 `callback` 返回值可转换为为 `true` 的就立即返回，否则遍历所有元素，最后返回 `false`。其他机制基本相同。

## Array.prototype.sort()

`ES1` 就提供的数组方法。`sort()` 方法用**原地算法**对数组的元素进行排序，并返回数组。由于它取决于具体实现，因此无法保证排序的时间和空间复杂性。

该方法接受一个可选的 `compareFunction` 函数，如果没有指明该函数，那么元素会按照转换为的字符串的诸个字符的 `Unicode` 位点进行排序。

```javascript
//默认按Unicode进行排序，我们记住 ACSII 的顺序即可
let arr = [3, 15, 8, 29, 102, 22]
console.log(arr.sort())
//[ 102, 15, 22, 29, 3, 8 ]
```

如果指明了 `compareFunction` ，那么数组会按照调用该函数的返回值排序。即 `a` 和 `b` 是两个将要被比较的元素：

- 如果 `compareFunction(a, b)` 小于 `0` ，那么 `a` 会被排列到 `b` 之前；
- 如果 `compareFunction(a, b)` 等于 `0` ， `a` 和 `b` 的相对位置不变。备注： `ECMAScript` 标准并不保证这一行为，而且也不是所有浏览器都会遵守（例如 `Mozilla` 在 `2003` 年之前的版本）；
- 如果 `compareFunction(a, b)` 大于 `0` ， `b` 会被排列到 `a` 之前。
- `compareFunction(a, b)` 必须总是对相同的输入返回相同的比较结果，否则排序的结果将是不确定的。

## Array.prototype.splice()

`Array.prototype.splice()` 是 `ES3` 提供的数组方法。 `splice()` 方法通过删除或替换现有元素或者原地添加新的元素来修改数组,并以数组形式返回被修改的内容。此方法会改变原数组。

该方法的前两个参数 `start` 和 `deleteCount` 表示从哪个索引开始删除多少个元素，删除的元素包含 `start` 位置的元素。如果 `deleteCount` 被省略了，或者它的值大于等于`array.length - start`(也就是说，如果它大于或者等于 `start` 之后的所有元素的数量)，那么 `start` 之后数组的所有元素都会被删除。如果 `deleteCount` 是 `0` 或者负数，则不移除元素，这种情况下，至少应添加一个新元素，否则没有意义。

从第三个参数开始就是要天剑的新元素，添加的位置就是从 `start` 开始。如果添加进数组的元素个数不等于被删除的元素个数，数组的长度会发生相应的改变。

返回值是由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组。

## Array.prototype.unshift()

类比 `Array.prototype.push()`。

```javascript
//没有length属性的对象调用会添加值为 0 的length属性
var obj = {
  0: 3,
  1: 4,
  unshift: Array.prototype.unshift
}

obj.unshift()
console.log(obj) //{ '0': 3, '1': 4, unshift: [Function: unshift], length: 0 }

//从 length 处插入
var obj = {
  0: 3,
  1: 4,
  length: 0,
  unshift: Array.prototype.unshift
}

obj.unshift(1, 2)
console.log(obj) //{ '0': 1, '1': 2, length: 2, unshift: [Function: unshift] }
```

## Array.prototype.toString()

`toString()` 返回一个字符串，表示指定的数组及其元素。

`Array` 对象覆盖了 `Object` 的 `toString` 方法。对于数组对象，`toString` 方法连接数组并返回一个字符串，其中包含用逗号分隔的每个数组元素。

当一个数组被作为文本值或者进行字符串连接操作时，将会自动调用其 `toString` 方法。

## API 的几点共通点

1. 很多方法存在对应，比如 `some` 和 `every`，`pop` 和 `shift`，`push` 和 `unshift` 等，他们的机制基本相同。
2. 几乎所有 `callback` 的机制都相同，即在第一次 `callback` 执行之前元素遍历范围就已经确定，在 `callback` 执行过程中如果对原数组进行改动可能引起部分元素不会被遍历到。
3. 大多数 `API` 都可以使用 `call` 和 `apply` 拓展到任何带有 `length` 属性的对象（`javascript` 的数组本质就是这样一个对象）。部分方法不支持字符串调用，因为字符串不可被更改。
4. 大多数 `callback` 需要传入索引作为参数的方法，机制都相同。当索引为负的时候，会计算 `length + index`，若计算值是一个在数组范围内的值，则以这个值执行；若计算值依然是负值，则忽略该参数。
5. `push`, `pop`, `shift`, `unshift` 这几个添加删除元素的方法都是以 `length` 为基准进行操作，对于没有 `length` 的对象会添加一个值为 `0` 的 `length` 属性。以 `length` 为基准的意思举个例子就是，我们执行 `push(1,2)`，如果我们的对象 `length` 为 `2`，那么即使对象中索引 `2` 和 `3` 已经有元素值，那么也会用 `1` 和 `2` 进行覆盖。

## 查找数组

1. `Array.prototype.find()`
2. `Array.prototype.findIndex()`
3. `Array.prototype.includes()`
4. `Array.prototype.indexOf()`
5. `Array.prototype.lastIndexOf()`

## 遍历数组

1. `Array.prototype.every()`
2. `Array.prototype.filter()`
3. `Array.prototype.forEach()`
4. `Array.prototype.map()`
5. `Array.prototype.reduce()`
6. `Array.prototype.reduceRgiht()`
7. `Array.prototype.some()`

## Array Iterator

1. `Array.prototype.entries()`
2. `Array.prototype.keys()`
3. `Array.prototype.values`

## 复制数组

1. `Array.prototype.slice.call()`

2. `Array.from()`，和 `Array.prototype.slice.call()` 的区别就是 `Array.from()` 是 `ES6` 才有的方法。他们的性能存在差异，我只用了一个简单的数组进行了测试：结果就是当数组长度比较小的时候，`Array.from()` 速度更快一点，当数组长度越长，`Array.prototype.slice.call()` 速度更快，我只是用的一个 `flat` 的数组，没有测试嵌套数组和对象， `Set` `Map` 等情况。

```javascript
let a = Array.from({ length: 1000000 }, (v, i) => i)
console.time('slice')
for (let i = 0; i < 1000; i++) {
  Array.prototype.slice.call(a)
}
console.timeEnd('slice') //slice: 5995.096ms
console.time('from')
for (let i = 0; i < 1000; i++) {
  Array.from(a)
}
console.timeEnd('from') //from: 6668.785ms
```

## 创建元素值等于下标的数组

这个源于知乎上的一道题目，解法有如下几种：

```javascript
Object.keys(Array.apply(null, {length: 100}))

Array.from(Array(100).keys())

Array.from({length: 100}, (v, i) => i);

[...Array(100).keys()]

Array.apply(null, Array(100)).map(Function.prototype.call.bind(Number))

//自定义迭代器
Number.prototype[Symbol.iterator] = function() {
    return {
        v: 0,
        e: this,
        next() {
            return {
                value: this.v++,
                done: this.v > this.e
            }
        }
    }
}

[...100]
```

> 需要特别注意，在 `JavaScript` 中参数的个数是有上限的，`JavaScriptCore` 引擎中有被硬编码的 参数个数上限：`65536`。但是实际能接受多少参数取决于当前的系统和浏览器，并不确定。比如我用上面的用 `apply` 生成元素值为元素下标的数组，在 `safari` 中的上限是 `65536`，在 `chrome` 中是 `125382`。任何用到超大栈空间的行为都有可能出现这个现象，超出限制则会报错 `Uncaught RangeError: Maximum call stack size exceeded`。

## 去重

1. 利用 `Array.from` 和 `Set`。

   ```javascript
   function combine() {
     let arr = [].concat.apply([], arguments) //没有去重复的新数组
     return Array.from(new Set(arr))
   }

   var m = [1, 2, 2],
     n = [2, 3, 3]
   console.log(combine(m, n)) // [1, 2, 3]
   ```

2. `reduce`

   ```javascript
   let myArray = ['a', 'b', 'a', 'b', 'c', 'e', 'e', 'c', 'd', 'd', 'd', 'd']
   let myOrderedArray = myArray.reduce(function (accumulator, currentValue) {
     if (accumulator.indexOf(currentValue) === -1) {
       accumulator.push(currentValue)
     }
     return accumulator
   }, [])
   console.log(myOrderedArray)

   let arr = [1, 2, 1, 2, 3, 5, 4, 5, 3, 4, 4, 4, 4]
   let result = arr.sort().reduce((init, current) => {
     if (init.length === 0 || init[init.length - 1] !== current) {
       init.push(current)
     }
     return init
   }, [])
   console.log(result) //[1,2,3,4,5]
   ```

3. 两层循环比较

   ```javascript
   function unique(arr) {
     for (var i = 0; i < arr.length; i++) {
       for (var j = i + 1; j < arr.length; j++) {
         if (arr[i] == arr[j]) {
           //第一个等同于第二个，splice方法删除第二个
           arr.splice(j, 1)
           j--
         }
       }
     }
     return arr
   }
   ```

4. `filter + indexOf`

   ```javascript
   function unique(arr) {
     return arr.filter(function (item, index, arr) {
       //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
       return arr.indexOf(item, 0) === index
     })
   }
   ```

5. `forEach + includes`

```javascript
function unique(arr) {
  let result = []
  arr.forEach((v) => {
    if (!result.includes(v)) result.push(v)
  })
  return result
}
```

去重还有很多种实现，不过本质都是一样的，遍历数组比较去除重复（根据利用的 `API` 不同可能要创建一个中间数组）。或者利用像 `Set` 或者 `Object` 的键不可重复的特性。

## 扁平化

1. `Array.prototype.flat()`

2. reduce 与 concat

   ```javascript
   var flattened = [
     [0, 1],
     [2, 3],
     [4, 5]
   ].reduce(function (a, b) {
     return a.concat(b)
   }, [])
   // flattened is [0, 1, 2, 3, 4, 5]

   var flattened = [
     [0, 1],
     [2, 3],
     [4, 5]
   ].reduce((acc, cur) => acc.concat(cur), [])
   ```

3. `reduce + concat + isArray + recursivity`

   ```javascript
   // 使用 reduce、concat 和递归展开无限多层嵌套的数组
   var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]]

   function flatDeep(arr, d = 1) {
     return d > 0
       ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
       : arr.slice()
   }

   flatDeep(arr1, Infinity)
   // [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
   ```

4. `forEach+isArray+push+recursivity`

   ```javascript
   // forEach 遍历数组会自动跳过空元素
   const eachFlat = (arr = [], depth = 1) => {
     const result = [] // 缓存递归结果
     // 开始递归
     ;(function flat(arr, depth) {
       // forEach 会自动去除数组空位
       arr.forEach((item) => {
         // 控制递归深度
         if (Array.isArray(item) && depth > 0) {
           // 递归数组
           flat(item, depth - 1)
         } else {
           // 缓存元素
           result.push(item)
         }
       })
     })(arr, depth)
     // 返回递归结果
     return result
   }

   // for of 循环不能去除数组空位，需要手动去除
   const forFlat = (arr = [], depth = 1) => {
     const result = []
     ;(function flat(arr, depth) {
       for (let item of arr) {
         if (Array.isArray(item) && depth > 0) {
           flat(item, depth - 1)
         } else {
           // 去除空元素，添加非undefined元素
           item !== void 0 && result.push(item)
         }
       }
     })(arr, depth)
     return result
   }
   ```

5. 使用堆栈stack

   ```javascript
   // 无递归数组扁平化，使用堆栈
   // 注意：深度的控制比较低效，因为需要检查每一个值的深度
   // 也可能在 shift / unshift 上进行 w/o 反转，但是末端的数组 OPs 更快
   var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]]
   function flatten(input) {
     const stack = [...input]
     const res = []
     while (stack.length) {
       // 使用 pop 从 stack 中取出并移除值
       const next = stack.pop()
       if (Array.isArray(next)) {
         // 使用 push 送回内层数组中的元素，不会改动原始输入
         stack.push(...next)
       } else {
         res.push(next)
       }
     }
     // 反转恢复原数组的顺序
     return res.reverse()
   }
   flatten(arr1) // [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
   // 递归版本的反嵌套
   function flatten(array) {
     var flattend = []
     ;(function flat(array) {
       array.forEach(function (el) {
         if (Array.isArray(el)) flat(el)
         else flattend.push(el)
       })
     })(array)
     return flattend
   }
   ```

6. Generator

```javascript
function* flatten(array) {
  for (const item of array) {
    if (Array.isArray(item)) {
      yield* flatten(item)
    } else {
      yield item
    }
  }
}

var arr = [1, 2, [3, 4, [5, 6]]]
const flattened = [...flatten(arr)]
// [1, 2, 3, 4, 5, 6]
```

## 计算元素出现的次数

1. `reduce`

```javascript
var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice']

var countedNames = names.reduce(function (allNames, name) {
  if (name in allNames) {
    allNames[name]++
  } else {
    allNames[name] = 1
  }
  return allNames
}, {})
// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
```

## 清除

1. 设置数组的 `length` 为 `0`。

## 按属性分类对象

```javascript
var people = [
  { name: 'Alice', age: 21 },
  { name: 'Max', age: 20 },
  { name: 'Jane', age: 20 }
]

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}

var groupedPeople = groupBy(people, 'age')
// groupedPeople is:
// {
//   20: [
//     { name: 'Max', age: 20 },
//     { name: 'Jane', age: 20 }
//   ],
//   21: [{ name: 'Alice', age: 21 }]
// }
```

## 求两数组交集

```javascript
let arr1 = [0, 1, 2, 3, 4, 5, 4, 5]
let arr2 = [4, 5, 6, 7, 8, 9, 0]
let result = Array.from(new Set(arr1.filter((v) => arr2.includes(v))))
console.log(result) //[ 0, 4, 5 ]
```

## 参考文章

1. [JS 中的稀疏数组和密集数组](https://juejin.im/post/6844904050152964109 'JS 中的稀疏数组和密集数组')
2. [如何不使用loop循环，创建一个长度为100的数组，并且每个元素的值等于它的下标？ - Gaubee的回答 - 知乎](https://www.zhihu.com/question/41493194/answer/91224565 '如何不使用loop循环，创建一个长度为100的数组，并且每个元素的值等于它的下标？ - Gaubee的回答 - 知乎 ')
