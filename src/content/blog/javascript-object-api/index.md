---
title: 'JavaScript 中 Object 相关知识点整理'
publishDate: '2020-07-04 12:00:00'
description: ''
tags:
  - js
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

本文介绍 `JavaScript` 中 `Object` 相关的知识点。

## JavaScript 中的对象

`ECMA-262` 把对象定义为:“无序属性的集合，其属性可以包含基本值、对象或者函数。”严格来讲，这就相当于说对象是一组没有特定顺序的值。对象的每个属性或方法都有一个名字，而每个名字都映射到一个值。我们可以把 `ECMAScript` 的对象想象成散列表: 无非就是一组名值对，其中值可以是数据或函数。

我们创建对象有三种方法：`new Object()`，`Object.create()` 和字面量标记 `{}`。关于三者的区别，参考我的文章 [Object.create(null) 和 {…}](https://www.clloz.com/programming/front-end/js/2020/09/10/object-create-null/ 'Object.create(null) 和 {…}')

下面介绍一些 `Object` 相关的知识点和 `API`，包括 `ES5` 和 `ES6` 之后的。

## 属性类型

在 `JavaScript` 中属性有两种，数据属性 `data property` 和访问器属性 `accessor property`。关于两种属性类型我在 [JavaScript对象属性类型和赋值细节](https://www.clloz.com/programming/front-end/js/2020/09/09/javascript-object-prop-assign/#i-4 'JavaScript对象属性类型和赋值细节') 中已经详细介绍，想要了解可以去看一下。要对属性特性进行定义和修改，必须使用 `ES6` 给出的方法：`Object.defineProperty` 和 `Object.defineProperties()`，要读取属性特性则可以使用 `Object.getOwnProperty` 或者 `Object.getOwnProperties()`。

当我们尝试访问一个对象的属性时，会调用其 `[[get]]`，而当我们尝试修改一个对象的属性时，会调用其 `[[set]]`。对于数据属性而言，他们都是使用内置的 `[[set]]` 和 `[[get]]`。

## 合并对象

有时候我们需要将多个对象进行合并，这一般是为了实现多继承。很多时候这种操作也被称为混入 `mixin`，我们通过将源对象的属性 `mixin` 到目标对象上而实现对目标对象的增强。

`ES6` 为我们提供了一个 `Object.assign()` 的方法让我们合并对象的属性，它会将一个或多个源对象的可枚举属性复制到目标对象，键名为 `String` 类型或 `Symbol` 类型的属性都会被拷贝，返回合并后的对象（注意，目标对象也会改变）。如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。该方法拷贝时无法拷贝属性的特性，而且访问器属性会被转换成数据属性（返回值为访问器属性的 `getter` 的返回值，如果访问器属性没有设置 `getter`，那么值为 `undefined`）。`Object.assign` 不会在那些 `source` 对象值为 `null` 或 `undefined` 的时候抛出错误。

`Object.assign()` 可以用于浅拷贝，参考我的文章 [JavaScript浅拷贝和深拷贝](https://www.clloz.com/programming/front-end/js/2020/09/09/javascript-shallow-deep-copy/#Objectassingn 'JavaScript浅拷贝和深拷贝')

实现一个 `Object.assign()`:

```javascript
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign(target) {
      // .length of function is 2
      'use strict'
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object')
      }

      var to = Object(target)

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index]

        if (nextSource !== null && nextSource !== undefined) {
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    },
    writable: true,
    configurable: true
  })
}
```

`Object.assign()` 常用来为对象添加属性方法，克隆对象，合并多个对象，为对象的属性指定默认值（`source` 会覆盖 `target` 上的同名属性）

## Object.create()

参考文章 [Object.create(null) 和 {…}](https://www.clloz.com/programming/front-end/js/2020/09/10/object-create-null/ 'Object.create(null) 和 {…}')。

## 判断恒等

`===` 恒等比较有两个问题，一个是 `+0` 和 `-0` 视为相等，而 `NaN === NaN` 则返回 `false`。`ES6` 的 `Object` 对象新增了一个静态方法就是 `Object.is()`，用来判断两个值是否相等，你可以理解为它是处理了上面了个情况的恒等。

实现一个 `Object.is()`

```javascript
if (!Object.is) {
  Object.is = function (x, y) {
    if (x === y) {
      //如果 x !== 0 直接返回 `true`，如果 `x === 0`，判断 1 / x 和 `1 / y` 是否相等，1 / -0 返回 -Infinity，1 / 0 或者 1 / +0 都返回 Infinity
      return x !== 0 || 1 / x === 1 / y
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y //利用 NaN === NaN 返回 false，判断x和y是不是都为 NaN
    }
  }
}
```

## 属性方法简写

`ES6` 提供了属性值的简写，我们在给对象创建属性的时候，经常会设置变量名为属性为，变量值为属性值。为了简化这种情况 `ES6` 提供了一种简写属性的方式。属性的赋值器(`setter`)和取值器(`getter`)，事实上也是采用这种写法。

```javascript
var foo = 'bar'
var baz = { foo }
baz // {foo: "bar"}
// 等同于
var baz = { foo: foo }

//方法也可以简写
var o = {
  method() {
    return 'Hello!'
  }
}
// 等同于
var o = {
  method: function () {
    return 'Hello!'
  }
}

//Generator函数前要加 *
var obj = {
  *m() {
    yield 'hello world'
  }
}
```

这种简写的方式用在函数返回多个值，以及模块的输出都非常方便。

```javascript
function getPoint() {
  var x = 1
  var y = 10
  return { x, y }
}
console.log(getPoint()) // {x:1, y:10}

module.exports = { getItem, setItem, clear } // 等同于
module.exports = {
  getItem: getItem,
  setItem: setItem,
  clear: clear
}
```

**注意：**简写的方法不能作为构造函数，会报错。大概是简写方法没有内部 `[[construct]]` 方法。

```javascript
var obj = {
  method: function () {}
}
new obj.method() // 正确

var obj = {
  method() {}
}
new obj.method() // TypeError: obj.method is not a constructor
```

## 属性名表达式

在 `ES6` 之前，对象字面量的属性值只能是字符串，想要使用表达式作为变量的属性，只能使用 `[]` 成员访问运算符。`ES6` 允许字面量定义对象时，用表达式作为对象的属性名或方法名，即把表达式放在方括号内。属性名表达式与简洁表示法，不能同时使用，会报错（简洁表示法就是对象属性直接写一个变量，不用写键值对，表示键名就用这个变量的标识符）。

```javascript
let propKey = 'foo'
let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
}

//方法名也可以
let obj = {
  ['h' + 'ello']() {
    return 'hi'
  }
}
obj.hello() // hi
```

属性名表达式和属性的简写不能同时使用，属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串 `[object Object]` 。

```javascript
const keyA = { a: 1 }
const keyB = { b: 2 }
const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB'
}
myObject // Object {[object Object]: "valueB"}
```

## 对象的解构赋值

解构赋值 `destructuring` 参考我的文章 [解构赋值的一些细节](https://www.clloz.com/programming/front-end/js/2020/07/08/destructure-details/ '解构赋值的一些细节')

## 对象的遍历

`JavaScript` 提供了很多遍历对象的方法，我们先来看看它们有什么不同，方便我们在对应的场景选择合适的遍历方法。

- `for ... in`：遍历对象自身可其原型链上的可枚举属性，不包括 `Symbol` 属性。
- `Object.keys()`：返回一个数组，包括对象自身的(不含原型链上的)所有可枚举属性 (不含 `Symbol` 属性)。
- `Object.getOwnPropertyNames()`：返回一个数组，包含对象自身的所有属性(不含 `Symbol` 属性，但是包括不可枚举属性)
- `Object.getOwnPropertySymbols()`：返回一个数组，包含对象自身的所有 `Symbol` 属性。
- `Reflect.ownKeys()`：返回一个数组，包含对象自身的所有属性，不管属性名是 `Symbol` 或字符串，也不管是否可枚举。
- `Object.values()`：返回一个给定对象自身的所有可枚举属性值的数组(不含 `Symbol` 属性)。
- `Object.entries()`：返回一个给定对象自身可枚举属性的键值对数组（不含 `Symbol` 属性）。

他们遍历属性的顺序都遵循以下几点：

- 首先遍历所有属性名为数值的属性，按照数字排序。
- 其次遍历所有属性名为字符串的属性，按照生成时间排序。
- 最后遍历所有属性名为 `Symbol` 值的属性，按照生成时间排序。

## 深浅拷贝的实现

对象的深浅拷贝参考文章 [JavaScript浅拷贝和深拷贝](https://www.clloz.com/programming/front-end/js/2020/09/09/javascript-shallow-deep-copy/#Objectassingn 'JavaScript浅拷贝和深拷贝')。

## Object.getOwnPropertyDescriptors() 用法

`Object.getOwnPropertyDescriptors()` 可以用来获取所有自身属性的的描述对象（包括 `Symbol` 属性，不可枚举属性，不包括继承的属性）。这个属性有一些比较有用的用法这里列出来。

由于 `Object.assign()` 方法不能复制访问器属性（访问器属性会被调用 `[[get]]` 转为数据属性），所以 `Object.getOwnPropertyDescriptors()` 可以配合 `Object.defineProperties()` 成功拷贝访问器属性。

```javascript
const source = {
  set foo(value) {
    console.log(value)
  }
}
const target2 = {}
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source))
Object.getOwnPropertyDescriptor(target2, 'foo')
// { get: undefined,
//   set: [Function: foo],
//   enumerable: true,
//   configurable: true }
```

`Object.getOwnPropertyDescriptors()` 的另一个用法就是方法的另一个用处，是配合 `Object.create()` 方法，将对象属性克隆到一个新对象，属于浅拷贝。

```javascript
const clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj))
// 或者
const shallowClone = (obj) =>
  Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj))
```

## 获取和设置对象原型

我们都知道可以通过 `__proto__` 属性访问到对象的原型，该属性没有写入 `ES6` 的正文，而是写入了附录，原因是 `__proto__` 前后的双下划线，说明它本质上是一个内部属性 `[[prototype]]`，而不是一个正式的对外的 `API`，只是由于浏览 器广泛支持，才被加入了 `ES6`。标准明确规定，只有浏览器必须部署这个属性，其他运行环境不一定需要部署，而且新的代码最好认为这个属性是不存在的。因此， 无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，而是使用下面 的 `Object.setPrototype()` (写操作)、 `Object.getPrototypeOf()` (读 操作)、`Object.create()` (生成操作)代替。

`Object.setPrototypeOf(object, prototype)` 用来设置对象的原型，返回被设置的对象。如果第一个参数不是对象，会自动转为对象。但是由于返回的还是第一个参数，所 以这个操作不会产生任何效果。`null` 和 `undefined` 无法转为对象，所以第一个参数是 `null` 或者 `undefined` 会报错。

```javascript
Object.setPrototypeOf(1, {}) === 1 // true
Object.setPrototypeOf('foo', {}) === 'foo' // true
Object.setPrototypeOf(true, {}) === true // true
```

`Object.getPrototypeOf(obj)` 用于读取一个对象的原型，如果参数不是对象，会被自动转为对象。同样 `null` 和 `undefined` 同样会报错。

```javascript
// 等同于 Object.getPrototypeOf(new Number(1))
console.log(Object.getPrototypeOf(1)) // Number {[[PrimitiveValue]]: 0}
// 等同于 Object.getPrototypeOf(new String('foo'))
Object.getPrototypeOf('foo') // String {length: 0, [[PrimitiveValue]]: ""}
// 等同于 Object.getPrototypeOf(new Boolean(true))
Object.getPrototypeOf(true) // Boolean {[[PrimitiveValue]]: false}

Object.getPrototypeOf(1) === Number.prototype // true
Object.getPrototypeOf('foo') === String.prototype // true
Object.getPrototypeOf(true) === Boolean.prototype // true
```

**警告**: 由于现代 `JavaScript` 引擎优化属性访问所带来的特性的关系，更改对象的 `[[Prototype]]` 在各个浏览器和 `JavaScript` 引擎上都是一个很慢的操作。其在更改继承的性能上的影响是微妙而又广泛的，这不仅仅限于 `obj.__proto__ = ...` 语句上的时间花费，而且可能会延伸到任何代码，那些可以访问任何 `[[Prototype]]` 已被更改的对象的代码。如果你关心性能，你应该避免设置一个对象的 `[[Prototype]]`。相反，你应该使用 `Object.create()` 来创建带有你想要的 `[[Prototype]]` 的新对象。

## Object.prototype.toString()

我在 [JS数据类型和判断方法](https://www.clloz.com/programming/front-end/js/2020/06/30/data-type-indicate/#ObjectprototypetoStringcall 'JS数据类型和判断方法') 和 [Symbol](https://www.clloz.com/programming/front-end/js/2020/10/29/symbol/ 'Symbol') 中都介绍过`Object.prototype.toString()` 方法。当我们调用 `Object.prototype.toString()` 时，本质就是访问对象的 `Symbol.toStringTag` 属性。

每个对象都有一个 `toString()` 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，`toString()` 方法被每个 `Object` 对象继承。如果此方法在自定义对象中未被覆盖，`toString()` 返回 `[object type]`，其中 `type` 是对象的类型。

当然，许多内置对象并没有 `Symbol.toStringTag` 属性，但是依然能够通过 `toString()` 获得其类型，这是引擎的内置。当然要注意，虽然 `Object.prototype` 在绝大多数对象的原型链上，不过内置对象大部分都重写了 `toString()` 方法。所以需要使用 `call` 或者 `apply` 来调用。内置对象的 `toString()` 结果如下：

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

另外一些对象类型则不然，`toString()` 方法能识别它们是因为引擎为它们设置好了 `toStringTag` 标签，我们能够通过 `Symbol.toStringTag` 来访问到对应的值：

```javascript
Object.prototype.toString.call(new Map()) // "[object Map]"
Object.prototype.toString.call(function* () {}) // "[object GeneratorFunction]"
Object.prototype.toString.call(Promise.resolve()) // "[object Promise]"
// ... and more
```

如果是我们创建的对象如果想要有一个自定义的 `toString()` 效果，则需要自己手动设置对象的 `Symbol.toStringTag` 属性。

这里顺带说一下内置对象自己的 `toString` 方法的返回值，所有的返回值类型都是 `String`。

```javascript
console.log((10).toString()) //10
console.log('clloz'.toString()) //clloz
console.log(true.toString()) //true
console.log([1, 2, 3].toString()) //1,2,3
console.log(function a() {}.toString()) //function a() {}
console.log(/abc/.toString()) // /abc/
console.log(new Date().toString()) //Thu Nov 05 2020 12:59:46 GMT+0800 (China Standard Time)
console.log(Symbol('a').toString()) //Symbol(a)
console.log(BigInt(10).toString()) //10
```

## Object.prototype.valueOf()

`valueOf` 就是返回对象的原始值，这个方法是在 `Object.prototype` 上。`JavaScript` 调用 `valueOf` 方法将对象转换为原始值。你很少需要自己调用 `valueOf` 方法；当遇到要预期的原始值的对象时，`JavaScript` 会自动调用它。

默认情况下，`valueOf` 方法由 `Object` 后面的每个对象继承。 每个内置的核心对象都会覆盖此方法以返回适当的值。如果对象没有原始值，则 `valueOf` 将返回对象本身。`JavaScript` 的许多内置对象都重写了该函数，以实现更适合自身的功能需要。因此，不同类型对象的 `valueOf()` 方法的返回值和返回值类型均可能不同。不同类型对象的 `valueOf()` 方法的返回值如下：

- `Array`：返回数组对象本身。
- `Boolean`：返回布尔值。
- `Date`：存储的时间从 `1970 年 1 月 1 日` 午夜开始计的毫秒数 `UTC`。
- `Function`：函数本身。
- `Number`：数字值。
- `Object`：对象本身。这是默认情况。
- `String`：字符串值。
- `Math` 和 `Error` 对象没有 `valueOf` 方法。

你可以在自己的代码中使用 `valueOf` 将内置对象转换为原始值。 创建自定义对象时，可以覆盖 `Object.prototype.valueOf()` 来调用自定义方法，而不是默认 `Object` 方法。

> `toString()` 和 `valueOf()` 会在类型转换时使用，参考 [深入 JavaScript 类型转换](https://www.clloz.com/programming/front-end/js/2020/10/13/type-conversion/#valueOf_toString '深入 JavaScript 类型转换')

## 对象的冻结、封闭

`Object` 构造函数提供了三组静态方法，设置对象的可扩展性和可配置性。

`Object.preventExtensions()`：方法让一个对象变的不可扩展，也就是永远不能再添加新的属性。一般来说，不可扩展对象的属性可能仍然可被删除。尝试将新属性添加到不可扩展对象将静默失败或抛出 `TypeError`（最常见的情况是 `strict mode`中，但不排除其他情况）。`Object.preventExtensions()` 仅阻止添加自身的属性。但其对象类型的原型依然可以添加新的属性。

数组作为一个对象，如果变成不可扩展就不能添加新的元素。并且如果你删除了一个元素，将不能再添加回去，数组长度变短是不可逆的，只能删不能加，元素值可以修改。如果属性是一个对象，该嵌套对象不受影响。

```javascript
let arr = [1, 2, 3]

Object.preventExtensions(arr)
arr[3] = 10
console.log(arr) //[ 1, 2, 3 ]
arr.push(10)
console.log(arr) //TypeError: Cannot add property 3, object is not extensible
arr.pop()
console.log(arr) //[1, 2]
arr.push(10)
console.log(arr) //TypeError: Cannot add property 2, object is not extensible
arr[0] = 100
console.log(arr) //[100, 2]

let obj = {
  a: {
    name: 'clloz'
  }
}

Object.preventExtensions(obj)
obj.a.age = 28
console.log(obj.a) //{ name: 'clloz', age: 28 }
```

该方法使得目标对象的 `[[prototype]]` 不可变；任何重新赋值 `[[prototype]]` 操作都会抛出 `TypeError` 。这种行为只针对内部的 `[[prototype]]` 属性， 目标对象的其它属性将保持可变。一旦将对象变为不可扩展的对象，就再也不能使其可扩展。

在 `ES5` 中，如果参数不是一个对象类型（而是原始类型），将抛出一个 `TypeError` 异常。在 `ES2015` 中，非对象参数将被视为一个不可扩展的普通对象，因此会被直接返回。

`Object.isExtensible()` 方法判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）。在 `ES5` 中，如果参数不是一个对象类型，将抛出一个 `TypeError` 异常。在 `ES6` 中， `non-object` 参数将被视为一个不可扩展的普通对象，因此会返回 `false` 。

---

`Object.seal()` 方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变。一旦将对象变为封闭，就再也不能变为非封闭状态。

封闭一个对象会让这个对象变的不能添加新属性，且所有已有属性会变的不可配置。属性不可配置的效果就是属性变的不可删除，以及一个数据属性不能被重新定义成为访问器属性，或者反之，即不能修改属性描述符。但属性 `writeable` 为 `true` 的值仍然可以修改。尝试删除一个密封对象的属性或者将某个密封对象的属性从数据属性转换成访问器属性，结果会静默失败或抛出 `TypeError`（在严格模式中最常见的，但不唯一）。

数组作为一个对象，如果变成封闭就不能添加新的元素并且元素不可配置，并且不能删除元素，元素值可以修改。如果属性是一个对象，该嵌套对象不受影响。

```javascript
let arr = [1, 2, 3]

Object.seal(arr)

arr[0] = 100
console.log(arr) //[ 100, 2, 3 ]

arr.pop() //TypeError: Cannot delete property '2' of [object Array]
```

不会影响从原型链上继承的属性。该方法使得目标对象的 `[[prototype]]` 不可变。

`Object.isSealed()` 方法判断一个对象是否被密封。在 `ES5` 中，如果这个方法的参数不是一个对象（一个原始类型），那么它会导致 `TypeError`。在 `ES2015` 中，非对象参数将被视为是一个密封的普通对象，只返回 `true`。

---

`Object.freeze()` 方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。`freeze()` 返回和传入的参数相同的对象。

被冻结对象自身的所有属性都不可能以任何方式被修改。任何修改尝试都会失败，无论是静默地还是通过抛出 `TypeError` 异常（最常见但不仅限于 `strict mode`）。

数据属性的值不可更改，访问器属性（有 `getter` 和 `setter`）也同样（但由于是函数调用，给人的错觉是还是可以修改这个属性）。如果一个属性的值是个对象，则这个对象中的属性是可以修改的，除非它也是个冻结对象。数组作为一种对象，被冻结，其元素不能被修改，也不能添加或者删除元素。这个方法返回传递的对象，而不是创建一个被冻结的副本。

在 `ES5` 中，如果这个方法的参数不是一个对象（一个原始值），那么它会导致 `TypeError`。在 `ES2015` 中，非对象参数将被视为要被冻结的普通对象，并被简单地返回。

`Object.isFrozen()` 方法判断一个对象是否被冻结。在 `ES5` 中，如果参数不是一个对象类型，将抛出一个 `TypeError` 异常。在 `ES2015` 中，非对象参数将被视为一个冻结的普通对象，因此会返回 `true`。

我们可以看到从 `preventExtensions()` 到 `seal()` 再到 `freeze()`，对对象属性的限制越来越多，从不能扩展，到不可配置不能删除，在到不能修改。我们可以再需要的时候使用对应的功能（`vue` 中就使用到了 `freeze()`）

## Object.fromEntries()

该方法把键值对列表转换为一个对象。`Object.fromEntries()` 方法接收一个键值对的列表参数，并返回一个带有这些键值对的新对象。这个迭代参数应该是一个能够实现 `@@iterator` 方法的的对象，返回一个迭代器对象。它生成一个具有两个元素的类数组的对象，第一个元素是将用作属性键的值，第二个元素是与该属性键关联的值。

`Object.fromEntries()` 执行与 `Object.entries()` 互逆的操作。

```javascript
//Map -> Object
const map = new Map([
  ['foo', 'bar'],
  ['baz', 42]
])
const obj = Object.fromEntries(map)
console.log(obj) // { foo: "bar", baz: 42 }

//Array -> Object
const arr = [
  ['0', 'a'],
  ['1', 'b'],
  ['2', 'c']
]
const obj = Object.fromEntries(arr)
console.log(obj) // { 0: "a", 1: "b", 2: "c" }

//对象转换
const object1 = { a: 1, b: 2, c: 3 }

const object2 = Object.fromEntries(Object.entries(object1).map(([key, val]) => [key, val * 2]))

console.log(object2)
// { a: 2, b: 4, c: 6 }
```

## in 和 delete

`delete` 操作符用于删除对象的某个属性；如果没有指向这个属性的引用，那它最终会被释放，即不会起任何作用，并返回 `true`。对于所有情况都是 `true`，除非属性是一个自身的不可配置的属性，在这种情况下，非严格模式返回 `false`。在严格模式下，会抛出 `TypeError`。

几个注意点：

- 如果你试图删除的属性不存在，那么 `delete` 将不会起任何作用，但仍会返回 `true`
- 如果对象的原型链上有一个与待删除属性同名的属性，那么删除属性之后，对象会使用原型链上的那个属性（也就是说， `delete` 操作只会在自身的属性上起作用）
- 任何使用 `var` 声明的属性不能从全局作用域或函数的作用域中删除。
  - 这样的话，`delete` 操作不能删除任何在全局作用域中的函数（无论这个函数是来自于函数声明或函数表达式）
  - 除了在全局作用域中的函数不能被删除，在对象(`object`)中的函数是能够用 `delete` 操作删除的。

- 任何用 `let` 或 `const` 声明的属性不能够从它被声明的作用域中删除。
- 不可设置的(`Non-configurable`)属性不能被移除。这意味着像 `Math, Array, Object` 内置对象的属性以及使用 `Object.defineProperty()` 方法设置为不可设置的属性不能被删除。
- 封闭和冻结的属性不能被删除。
- 对变量使用 `delete` 在非严格模式下返回 `false`，严格模式下报错。
- 删除数组元素不会改变数组长度，该数组会变成一个稀疏数组，被删除的元素位置变为 `empty`。

---

如果指定的属性在指定的对象或其原型链中，则 `in` 运算符返回 `true`。`in` 右操作数必须是一个对象值。例如，你可以指定使用 `String` 构造函数创建的字符串，但不能指定字符串文字。

如果你使用 `delete` 运算符删除了一个属性，则 `in` 运算符对所删除属性返回 `false`。如果你只是将一个属性的值赋值为 `undefined`，而没有删除它，则 `in` 运算仍然会返回true。

如果一个属性是从原型链上继承来的，`in` 运算符也会返回 `true`。

> 其实我们平时遍历对象时使用的 `for ... in` 也是 `in` 操作符的一种使用方式。

## Reflect

`ES6` 新增了一个新的内置对象 `Reflect`，也就是新增了反射对象。主要是将一些原来放在 `Object` 或 `Function` 上的应该属于语言内部的方法集中起来，这样 `API` 的设计更合理更清晰。主要有如下 `API`：

- `Reflect.apply(target, thisArg, args)`
- `Reflect.construct(target, args)`
- `Reflect.get(target, name, receiver)`
- `Reflect.set(target, name, value, receiver)`
- `Reflect.defineProperty(target, name, desc)`
- `Reflect.deleteProperty(target, name)`
- `Reflect.has(target, name)`
- `Reflect.ownKeys(target)`
- `Reflect.isExtensible(target)`
- `Reflect.preventExtensions(target)`
- `Reflect.getOwnPropertyDescriptor(target, name)`
- `Reflect.getPrototypeOf(target)`
- `Reflect.setPrototypeOf(target, prototype)`

关于 `Reflect` 的详细内容看另一篇文章 [代理和反射](https://www.clloz.com/programming/front-end/js/2020/10/19/javascript-reflect-proxy/#ReflectdeleteProperty '代理和反射')

## 参考文章

1. 《Professional JavaScript for Web Developers, 4th Edition》
2. MDN
3. 《ES6 标准入门》
