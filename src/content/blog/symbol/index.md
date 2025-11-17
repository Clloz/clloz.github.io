---
title: 'Symbol'
publishDate: '2020-09-10 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

本文主要讲一讲 `ES6` 引入的原始数据类型 `Symbol`。

## 概念

`Symbol` 本身的概念并不复杂，就一个独一无二的值。在 `ES6` 之前，我们只能用字符串作为对象的属性名，这很容易造成属性名冲突。`Symbol` 就是为了解决这种问题而产生的。

注意 `Symbol` 函数不是一个构造函数，不能用 `new` 操作符。`Symbol()` 函数会返回 `symbol` 类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的 `symbol` 注册，且类似于内建对象类。

创建一个 `Symbol` 的语法是 `Symbol([description])`，参数是可选的，字符串类型，是对 `symbol` 的描述，可用于调试但不是访问 `symbol` 本身。每个从 `Symbol()` 返回的 `symbol` 值都是唯一的。一个 `symbol` 值能作为对象属性的标识符；这是该数据类型仅有的目的。

> 注意，`Symbol` 函数的参数只是表示对当前 `Symbol` 值的描述，因此相同参数的 `Symbol` 函数的返回值是不相等的。

如果 `Symbol` 函数的参数是一个对象，就会调用该对象的 `toString` 方法，将其转为字 符串，然后才生成一个 `Symbol` 值。

```javascript
const obj = {
  toString() {
    return 'abc'
  }
}
const sym = Symbol(obj)
sym // Symbol(abc)
```

虽然不能用 `new` 创建一个 `Symbol` 对象，但是可以通过 `Object` 方法获得一个包装对象。

```javascript
var sym = Symbol('foo')
typeof sym // "symbol"
var symObj = Object(sym)
typeof symObj // "object"
```

`Symbol` 作为属性名，该属性不会出现在 `for ... in`、`for ... of` 循环中，也不会被被 `Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.toStringify()` 返回。但是，它也不是私有属性，有一个 `Object.getOwnPropertySymbols()` 放法，可以获取指定对象的所有 `Symbol` 属性名。另一个新的 `API`， `Reflect.ownKeys` 方法可以返回所有类型的键名，包括常规键名和 `Symbol` 键名。由于以 `Symbol` 值作为名称的属性，不会被常规方法遍历得到。我们可以利用这个 特性，为对象定义一些非私有的、但又希望只用于内部的方法。

对于用了 `Symbol` 作为键名的对象，我们可以用 `Object.getOwnPropertySymbols()` 方法查找对象的符号属性。该返回一个 `symbol` 类型的数组。注意，每个初始化的对象都是没有自己的symbol属性的，因此这个数组可能为空，除非你已经在对象上设置了 `symbol` 属性。

```javascript
let obj = {
  [Symbol('clloz')]: 'clloz'
}
console.log(Object.getOwnPropertySymbols(obj)) //[ Symbol(clloz) ]
```

关于 `Symbol` 的类型转换可以参考我的另一片文章 [深入 JavaScript 类型转换](https://www.clloz.com/programming/front-end/js/2020/10/13/type-conversion/ '深入 JavaScript 类型转换')，这里做一个简单的总结：

- 尝试将一个 `symbol` 值转换为一个 `number` 值时，会抛出一个 `TypeError` 错误 (`e.g. +sym or sym | 0`).
- 使用宽松相等时， `Object(sym) == sym` 返回 `true`。
- `Symbol` 值不能与其他类型的值进行运算，会报错，这会阻止你从一个 `symbol` 值隐式地创建一个新的 `string` 类型的属性名。例如，`Symbol("foo") + "bar"` 将抛出一个`TypeError can't convert symbol to string`。
- `Symbol` 值可以显式转为字符串，用 `String()` 强制转换或者使用 `Symbol.prototype.toString()`
- `Symbol` 值也可以转为布尔值，但是不能转为数值。

## 方法

`Symbol` 的静态方法有两个 `Symbol.for()` 和 `Symbol.keyFor()`。

使用 `Symbol()` 函数创建的 `Symbol`，不会在你的整个代码库中创建一个可用的全局的 `symbol` 类型。 要创建跨文件可用的 `symbol`，甚至跨域（每个都有它自己的全局作用域） , 使用 `Symbol.for()` 方法和 `Symbol.keyFor()` 方法从全局的 `symbol` 注册表设置和取得 `symbol`。

`Symbol.for()` 方法会根据给定的键 `key`，来从运行时的 `symbol` 注册表中找到对应的 `symbol`，如果找到了，则返回它，否则，新建一个与该键关联的 `symbol`，并放入全局 `symbol` 注册表中。注意，`Symbol.for()` 只能找到用 `Symbol.for()` 创建的 `Symbol`，不能找到用 `Symbol()` 创建的 `Symbol`。

`Symbol.for()` 和 `Symbol()` 的区别是，`Symbol.for()` 创建的 `Symbol` 会被登记在全局环境中共搜索。`Symbol.fo()` 不会每次都创建一个新的 `Symbol`，只会在搜索不到的时候创建。

```javascript
Symbol.for('foo') // 创建一个 symbol 并放入 symbol 注册表中，键为 "foo"
Symbol.for('foo') // 从 symbol 注册表中读取键为"foo"的 symbol

Symbol.for('bar') === Symbol.for('bar') // true，证明了上面说的
Symbol('bar') === Symbol('bar') // false，Symbol() 函数每次都会返回新的一个 symbol

var sym = Symbol.for('mario')
sym.toString()
// "Symbol(mario)"，mario 既是该 symbol 在 symbol 注册表中的键名，又是该 symbol 自身的描述字符串

//为了防止冲突，最好为键名设置前缀
Symbol.for('mdn.foo')
Symbol.for('mdn.bar')
```

`Symbol.keyFor(sym)` 方法用来获取全局 `symbol` 注册表中与某个 `symbol` 关联的键。即参数是一个 `Symbol`，如果这个 `Symbol` 是用 `Symbol.for()` 在全局注册的，则返回这个 `Symbol` 的描述符，一个字符串。若没找到则返回 `undefined`。

```javascript
let symbol1 = Symbol('clloz')
let symbol2 = Symbol.for('clloz')
console.log(Symbol.keyFor(symbol1)) //undefined
console.log(Symbol.keyFor(symbol2)) //clloz
```

---

`Symbol()` 有原型 `Symbol.prototype`，你可以使用构造函数的原型对象来给所有 `Symbol` 实例添加属性或者方法。`Symbol.prototype` 默认有一个数姓 `Symbol.prototype.description`，返回对应 `Symbol` 的描述符。

`Symbol.prototype` 有几个方法，`Symbol.prototype.valueOf()`，`Symbol.Prototype.toString()` 和 `Symbol.prototype[Symbol.toPrimitive](hint)`。

`toString()` 方法返回当前 `symbol` 对象的字符串表示。`symbol` 原始值不能转换为字符串，所以只能先转换成它的包装对象，再调用 `toString()` 方法。

```javascript
Symbol('foo') + 'bar'
// TypeError: Can't convert symbol to string
Symbol('foo').toString() + 'bar'
// "Symbol(foo)bar"，就相当于下面的:
Object(Symbol('foo')).toString() + 'bar'
// "Symbol(foo)bar"
```

`valueOf()` 方法返回当前 `symbol` 对象所包含的 `symbol` 原始值。在 `JavaScript` 中，虽然大多数类型的对象在某些操作下都会自动的隐式调用自身的 `valueOf()` 方法或者 `toString()` 方法来将自己转换成一个原始值，但 `symbol` 对象不会这么干，`symbol` 对象无法隐式转换成对应的原始值。

```javascript
Object(Symbol('foo')) + 'bar'
// TypeError: can't convert symbol object to primitive
// 无法隐式的调用 valueOf() 方法

Object(Symbol('foo')).valueOf() + 'bar'
// TypeError:  can't convert symbol to string
// 手动调用 valueOf() 方法，虽然转换成了原始值，但 symbol 原始值不能转换为字符串

Object(Symbol('foo')).toString() + 'bar'
// "Symbol(foo)bar"，需要手动调用 toString() 方法才行
```

关于 `Symbol.prototype[Symbol.toPrimitive](hint)` 参考 [深入 JavaScript 类型转换](https://www.clloz.com/programming/front-end/js/2020/10/13/type-conversion/ '深入 JavaScript 类型转换')

## 属性

除了我们自己创建的 `Symbol`，`JavaScript` 还内建了一些在 `ECMAScript 5` 之前没有暴露给开发者的 `symbol`，它们代表了内部语言行为。在标准中他们以 `@@` 开头替代 `Symbol`，被称为 [Well-Known Symbols](https://tc39.es/ecma262/#sec-well-known-symbols 'Well-Known Symbols')。

- `Symbol.iterator`：一个返回一个对象默认迭代器的方法。被 `for...of` 使用。
- `Symbol.asyncIterator`: 一个返回对象默认的异步迭代器的方法。被 `for await of` 使用。**试验性API**
- `Symbol.match`: 一个用于对字符串进行匹配的方法，也用于确定一个对象是否可以作为正则表达式使用。被 `String.prototype.match()` 使用。
- `Symbol.replace`: 一个替换匹配字符串的子串的方法. 被 `String.prototype.replace()` 使用。
- `Symbol.search`: 一个返回一个字符串中与正则表达式相匹配的索引的方法。被 `String.prototype.search()` 使用。
- `Symbol.split`: 一个在匹配正则表达式的索引处拆分一个字符串的方法.。被 `String.prototype.split()` 使用。
- `Symbol.hasInstance`: 一个确定一个构造器对象识别的对象是否为它的实例的方法。被 `instanceof` 使用。
- `Symbol.isConcatSpreadable`: 一个布尔值，表明一个对象是否应该 `flattened` 为它的数组元素。被 `Array.prototype.concat()` 使用。简单说就是表示该对象用于 `Array.prototype.concat()` 时，是否可以展开。
- `Symbol.unscopables`: 拥有和继承属性名的一个对象的值被排除在与环境绑定的相关对象外。
- `Symbol.species`: 一个用于创建派生对象的构造器函数。
- `Symbol.toPrimitive`: 一个将对象转化为基本数据类型的方法。
- `Symbol.toStringTag`: 用于对象的默认描述的字符串值。被 `Object.prototype.toString()` 使用。

我们可以看到我们原来使用的一些方法其实就是调用的这些 `Symbol` 对应的方法。现在 `JavaScript` 将这些 `Symbol` 暴露出来我们可以自己配置这些 `Symbol`。在 `ES6` 之前，当我们执行这些 `Symbol` 对应的操作的时候，调用的是引擎内部的默认方法，现在这些 `Symbol` 暴露出来以后，我们可以自己配置这些 `Symbol` 对应的一些行为。

## Symbol.hasInstance

当我们执行 `A instanceof B` 的时候其实就是调用的 `B` 内部的 `Symbol.hasInstance` 方法。我们可以自己定义对象内部的这个方法，改变对象的行为。

```javascript
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array
  }
}
console.log([1, 2, 3] instanceof new MyClass()) // true
```

## Symbol.isConcatSpreadable

对象的 `Symbol.isConcatSpreadable` 属性等于一个布尔值，表示该对象用于 `Array.prototype.concat()` 时，是否可以展开。

```javascript
let arr1 = ['c', 'd']
console.log(['a', 'b'].concat(arr1, 'e')) // ['a', 'b', 'c', 'd', 'e']
console.log(arr1[Symbol.isConcatSpreadable]) // undefined

let arr2 = ['c', 'd']
arr2[Symbol.isConcatSpreadable] = false
console.log(['a', 'b'].concat(arr2, 'e'))
//['a', 'b', ['c', 'd', ([Symbol(Symbol.isConcatSpreadable)]: false)], 'e'];
```

上面代码说明，数组的默认行为是可以展开，`Symbol.isConcatSpreadable` 默认等于 `undefined` 。该属性等于 `true` 时，也有展开的效果。当我们把数组的 `Symbol.isConcatSpreadable` 设置为 `false`，在调用 `cancat` 发现没有展开。

```javascript
let obj = { length: 2, 0: 'c', 1: 'd' }
console.log(['a', 'b'].concat(obj, 'e')) // [ 'a', 'b', { '0': 'c', '1': 'd', length: 2 }, 'e' ]

obj[Symbol.isConcatSpreadable] = true
console.log(['a', 'b'].concat(obj, 'e')) // ['a', 'b', 'c', 'd', 'e']
```

类似数组的对象正好相反，默认不展开。将它的 `Symbol.isConcatSpreadable` 属性设为 `true` ，就可以展开。

---

```javascript
class A1 extends Array {
  constructor(args) {
    super(args)
    this[Symbol.isConcatSpreadable] = true
  }
}
class A2 extends Array {
  constructor(args) {
    super(args)
  }
  get [Symbol.isConcatSpreadable]() {
    return false
  }
}
let a1 = new A1()
a1[0] = 3
a1[1] = 4
let a2 = new A2()
a2[0] = 5
a2[1] = 6
console.log([1, 2].concat(a1).concat(a2)) // [ 1, 2, 3, 4, A2(2) [ 5, 6 ] ]
```

也可以在类中设置这个属性，可以在构造函数中设置，也可以直接作为原型的访问器属性。

## Symbol.species

`JavaScript` 有个特性，当我们用一个 `MyArray` 继承 `Array` 的时候，用 `MyArray` 创建一个数组，然后用 `map` 生成一个新的数组。这个新数组的创建调用的是 `MyArray` 构造函数，而不是 `Array` 构造函数。这是非常有用的，因为新数组还可以用我们在 `MyArray` 上定义的方法。但是如果我们希望新数组是以 `Array` 为构造函数创建的话，就需要用到 `Symbol.species` 这个访问器属性，它能够修改派生对象的构造函数。**注意，使用 `new` 操作符的时候依然是创建 `MyArray` 的实例。**

```javascript
class MyArray extends Array {
  // 覆盖 species 到父级的 Array 构造函数上
  static get [Symbol.species]() {
    return Array
  }
}

const a = new MyArray(1, 2, 3)
console.log(a instanceof MyArray) //true
console.log(a instanceof Array) //true

const mapped = a.map((x) => x * x)

console.log(mapped instanceof MyArray)
// expected output: false

console.log(mapped instanceof Array)
// expected output: true
```

上面代码中，子类 `MyArray` 继承了父类 `Array` 。用 `new` 操作符创建的实例 `a` 是 `MyArray` 的实例。但是用 `map` 创建的实例却不是 `MyArray` 的实例，而是 `Array` 的实例。这个例子也说明，定义 `Symbol.species` 属性要采用 `get` 读取器。默认 的 `Symbol.species` 属性等同于下面的写法。

```javascript
class MyArray extends Array {
  static get [Symbol.species]() {
    return this
  }
}
```

## Symbol.match

对象的 `Symbol.match` 属性，指向一个函数。当执行 `str.match(RegExp)` 时，如果该属性存在，会调用它，返回该方法的返回值。这个方法用于确定一个对象是否可以作为正则表达式使用，`String.prototype.match()` 默认就是找参数的这个方法。

有了这个属性之后，即使不是正则对象，我们也可以让 `String.prototype.match()` 正常执行。

```javascript
String.prototype.match(regexp)
// 等同于
regexp[Symbol.match](this)

class MyMatcher {
  [Symbol.match](string) {
    return 'hello world'.indexOf(string)
  }
}
'e'.match(new MyMatcher()) // 1
```

## Symbol.replace

`Symbol.replace` 一个替换匹配字符串的子串的方法。当对象被 `String.prototype.replace()` 方法调用时，会调用对象上的 `Symbol.replace` 方法。

```javascript
String.prototype.replace(searchValue, replaceValue)
// 等同于
searchValue[Symbol.replace](this, replaceValue) // this 就是调用 replace 的字符串
```

有了这个属性，即使不是正则对象，`String.prototype.replace()` 也能正常执行。

```javascript
const x = {}
x[Symbol.replace] = (...s) => console.log(s)
'Hello'.replace(x, 'World') // ["Hello", "World"]
```

## Symbol.search

`Symbol.search` 指向一个返回一个字符串中与正则表达式相匹配的索引的方法。被 `String.prototype.search()` 使用。当对象被 `String.prototype.search()` 方法调用时，会调用对象的这个方法。

```javascript
String.prototype.search(regexp) // 等同于 regexp[Symbol.search](this)
class MySearch {
  constructor(value) {
    this.value = value
  }
  [Symbol.search](string) {
    return string.indexOf(this.value)
  }
}
'foobar'.search(new MySearch('foo')) // 0
```

## Symbol.split

`Symbol.split` 指向一个在匹配正则表达式的索引处拆分一个字符串的方法.。被 `String.prototype.split()` 使用。当对象被 `String.prototype.split()` 方法调用时，会调用对象的这个方法。`split` 的第一个参数可以是字符串也可以是正则表达式。

```javascript
String.prototype.split(separator, limit)
// 等同于
separator[Symbol.split](this, limit)
```

有了这个属性，我们可以定制 `split` 的行为：

```javascript
class MySplitter {
  constructor(value) {
    this.value = value
  }
  [Symbol.split](string) {
    var index = string.indexOf(this.value)
    if (index === -1) {
      return string
    }
    return [string.substr(0, index), string.substr(index + this.value.length)]
  }
}
'foobar'.split(new MySplitter('foo'))
// ['', 'bar']
'foobar'.split(new MySplitter('bar')) // ['foo', '']
'foobar'.split(new MySplitter('baz')) // 'foobar'
```

## Symbol.Iterator

这应该是最重要的一个内置 `Symbol`，我会在别的文章单独讨论，这里简单说一下。该属性指向一个返回一个对象默认迭代器的方法。被 `for...of` 和扩展运算符等需要进行迭代是使用。很多内置类型都有默认的 `@@iterator` 方法：

- `Array.prototype[@@iterator]()`
- `TypedArray.prototype[@@iterator]()`
- `String.prototype[@@iterator]()`
- `Map.prototype[@@iterator]()`
- `Set.prototype[@@iterator]()`

自定义迭代器：

```javascript
var myIterable = {}
myIterable[Symbol.iterator] = function* () {
  yield 1
  yield 2
  yield 3
}
;[...myIterable] // [1, 2, 3]
```

## Symbol.toPrimitive

`Symbol.toPrimitive` 指向一个将对象转化为基本数据类型的方法，当一个对象转换为对应的原始值时，会调用此函数。这个方法我在 [深入 JavaScript 类型转换](https://www.clloz.com/programming/front-end/js/2020/10/13/type-conversion/ '深入 JavaScript 类型转换') 中已经详细介绍过了。

`Symbol.toPrimitive` 被调用时，一个对象可被转换为原始值。该函数被调用时，会被传递一个字符串参数 `hint` ，表示要转换到的原始值的预期类型。 `hint` 参数的取值是 `number`、`string` 和 `default` 中的任意一个。详细的解析参考上面的那篇文章，这里放一个例子：

```javascript
// 一个没有提供 Symbol.toPrimitive 属性的对象，参与运算时的输出结果
var obj1 = {}
console.log(+obj1) // NaN
console.log(`{obj1}`) // "[object Object]"
console.log(obj1 + '') // "[object Object]"

// 接下面声明一个对象，手动赋予了 Symbol.toPrimitive 属性，再来查看输出结果
var obj2 = {
  [Symbol.toPrimitive](hint) {
    if (hint == 'number') {
      return 10
    }
    if (hint == 'string') {
      return 'hello'
    }
    return true
  }
}
console.log(+obj2) // 10      -- hint 参数值是 "number"
console.log(`{obj2}`) // "hello" -- hint 参数值是 "string"
console.log(obj2 + '') // "true"  -- hint 参数值是 "default"
```

## Symbol.toStringTag

`Symbol.toStringTag` 是一个内置 `symbol`，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签，通常只有内置的 `Object.prototype.toString()` 方法会去读取这个标签并把它包含在自己的返回值里。

许多内置的 `JavaScript` 对象类型即便没有 `toStringTag` 属性，也能被 `toString()` 方法识别并返回特定的类型标签，比如：

```javascript
Object.prototype.toString.call('foo') // "[object String]"
Object.prototype.toString.call([1, 2]) // "[object Array]"
Object.prototype.toString.call(3) // "[object Number]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(null) // "[object Null]"
// ... and more
```

另外一些对象类型则不然，`toString()` 方法能识别它们是因为引擎为它们设置好了 `toStringTag` 标签：

```javascript
Object.prototype.toString.call(new Map()) // "[object Map]"
Object.prototype.toString.call(function* () {}) // "[object GeneratorFunction]"
Object.prototype.toString.call(Promise.resolve()) // "[object Promise]"
// ... and more
```

但你自己创建的类不会有这份特殊待遇，`toString()` 找不到 `toStringTag` 属性时只好返回默认的 `Object` 标签：

```javascript
class ValidatorClass {}

Object.prototype.toString.call(new ValidatorClass()) // "[object Object]"
```

加上 `toStringTag` 属性，你的类也会有自定义的类型标签了：

```javascript
class ValidatorClass {
  get [Symbol.toStringTag]() {
    return 'Validator'
  }
}

Object.prototype.toString.call(new ValidatorClass()) // "[object Validator]"
```

## Symbol.unscopables

`Symbol.unscopables` 指向一个对象。该对象指定了使用 `with` 关 键字时，哪些属性会被 `with` 环境排除。

```javascript
console.log(Array.prototype[Symbol.unscopables])
// [Object: null prototype] {
//     copyWithin: true,
//     entries: true,
//     fill: true,
//     find: true,
//     findIndex: true,
//     flat: true,
//     flatMap: true,
//     includes: true,
//     keys: true,
//     values: true
//   }
console.log(Object.keys(Array.prototype[Symbol.unscopables]))
// [
//     'copyWithin', 'entries',
//     'fill',       'find',
//     'findIndex',  'flat',
//     'flatMap',    'includes',
//     'keys',       'values'
//   ]
```

上面代码说明，数组有 `7` 个属性，会被 `with` 命令排除。

```javascript
// 没有 unscopables 时
class MyClass {
  foo() {
    return 1
  }
}
var foo = function () {
  return 2
}
with (MyClass.prototype) {
  console.log(foo()) // 1
}

// 有 unscopables 时
class MyClass {
  foo() {
    return 1
  }
  get [Symbol.unscopables]() {
    return { foo: true }
  }
}
var foo = function () {
  return 2
}
with (MyClass.prototype) {
  console.log(foo()) // 2
}
```
