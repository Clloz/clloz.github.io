---
title: '深入 JavaScript 类型转换'
publishDate: '2020-10-13 12:00:00'
description: ''
tags:
  - js
  - 实用技巧
  - 编程技巧
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

`JavaScript` 中的类型转换是一个非常让人头大的内容，其实我们平时的编码一般会尽量避免让自己陷入不确定的类型转换中。但是很多时候面试会考查这方面的知识，并且搞清楚类型转换的机制能够让我们在遇到一些奇葩问题的时候知道发生了什么。我们不一定要记住所有的类型转换的可能性，只要记住一些常用的，以及如何进行查询即可。

## 装箱拆箱

在讨论具体的类型转换场景之前，我们先来说一下装箱拆箱操作。在这之前你应该复习一下 `JavaScript` 中关于数据类型的知识，你可以看我的这一篇文章：[JS数据类型和判断方法](https://www.clloz.com/programming/front-end/js/2020/06/30/data-type-indicate/ 'JS数据类型和判断方法')。

## 装箱 wrapper

在 `JavaScript` 中目前共有八种数据类型 `Undefined, Null, Number, String, Boolean, BigInt, Symbol, Object`。除了 `Object` 其他都是基本数据类型（`primitive values`，也称原始值，原始类型）。所谓基本数据类型就是它们是一种即非对象也没有属性和方法的数据，基本类型直接代表了最底层的语言实现。

所有基本类型的值都是不可改变的。但需要注意的是，基本类型本身和一个赋值为基本类型的变量的区别。变量会被赋予一个新值，而原值不能像数组、对象以及函数那样被改变。即基本类型值可以被替换，但不能被改变。比如，`JavaScript` 中对字符串的操作一定返回了一个新字符串，原始字符串并没有被改变。

既然如此，为什么我们还能在 `Number` 或者 `String` 上使用方法呢？这就引出了 `JavaScript` 中的基本包装类型（`primitive wrapper types`，也成为原始包装类型），因为我们有在基本类型上频繁操作的需求（比如 `String` 的截取，`Number` 的格式转换等），所以 `JavaScript` 也为基本类型内置了一系列的 `API`。但是只有对象才能使用方法，所以 `JavaScript` 就用基本包装类型来让基本类型能够拥有属性和方法。除了 `null` 和 `undefined` 之外，所有基本类型都有其对应的包装对象：

- `String` 为字符串基本类型。
- `Number` 为数值基本类型。
- `BigInt` 为大整数基本类型。
- `Boolean` 为布尔基本类型。
- `Symbol` 为字面量基本类型。

其中最重要的就是 `String`，`Number` 和 `Boolean` 三种原始包装类型，也是我们本文重点讨论的内容。

这些类型与其他引用类型相似，但同时也具有与各自的基本类型相应的特殊行为。 实际上，每当读取一个基本类型值的时候，后台就会创建一个对应的基本包装类型的对象，从而让我们 能够调用一些方法来操作这些数据。看下面的例子：

```javascript
let str1 = 'clloz'
let str2 = str1.substring(2)
```

上面的代码中我们创建了一个基本类型的字符串 `str1`，然后我们调用了 `str1` 的 `substring` 方法，从逻辑上来讲基本类型不应该有方法的。实际上 `JavaScript` 在背后为我们创建了一个基本包装类型，大致过程如下：

```javascript
let temp = new String('clloz')
let str2 = temp.substring(2)
temp = null
```

引用类型与基本包装类型的主要区别就是对象的生存期。使用 new 操作符创建的引用类型的实例， 在执行流离开当前作用域之前都一直保存在内存中。而自动创建的基本包装类型的对象，则只存在于一 行代码的执行瞬间，然后立即被销毁。这意味着我们不能在运行时为基本类型值添加属性和方法。

```javascript
let str1 = 'clloz'
str1.color = 'red'
console.log(str1.color) // undefined
```

一般情况下，我们不需要手动进行装箱操作，因为装箱后的基本类型就变成了一个对象，`typeof` 将返回 `object`，在转换为 `Boolean` 的时候也会转换成 `true`，比如 `Boolean(new Boolean(false))` 将返回 `true`。我们只需要根据自己的需求来创建基本类型即可，将是否需要装箱的判断交给引擎，一般来说我们能在代码中优化的内容，引擎一定会帮我们进行优化。

最后说一说进行装箱的几种方法，这些方法对除了 `null` 和 `undefined` 的基本类型都有效（`null` 和 `undefined` 没有原生构造函数，因为它们并不需要 `API`）：

1. 用 `new` 操作符调用对应类型的构造函数。
2. 使用 `Object` 函数，带不带 `new` 都可以。`Object()` 构造函数将会根据参数的不同做以下操作：
   - 如果给定值是 `null` 或 `undefined`，将会创建并返回一个空对象
   - 如果传进去的是一个基本类型的值，则会构造其包装类型的对象
   - 如果传进去的是引用类型的值，仍然会返回这个值，经他们复制的变量保有和源对象相同的引用地址
   - 当以非构造函数形式被调用时，`Object` 的行为等同于 `new Object()`。

3. 利用 `call`。

```javascript
let a = 2
console.log(typeof a) //number
let t = function () {
  return this
}.call(a)
console.log(typeof t) //object
```

## 拆箱 toPrimitive

装箱的操作是为了让我们能够使用一些为基本类型内置的 `API`。但有时我们也需要对对象进行拆箱操作，比如当我们进行四则运算，进行比较等逻辑运算，等等。

在 `JavaScript` 标准中，规定了 `ToPrimitive` 函数，它是对象类型到基本类型的转换（即，拆箱转换）。拆箱转换会尝试调用 `valueOf` 和 `toString` 来获得拆箱后的基本类型。如果 `valueOf` 和 `toString` 都不存在，或者没有返回基本类型，则会产生类型错误 `TypeError`。`String` 的拆箱转换会优先调用 `toString`。在 `ES6` 之后，还允许对象通过显式指定 `@@toPrimitive` `Symbol` 来覆盖原有的行为。

这里为了让大家彻底明白拆箱的机制，我们直接把 [ECMAScript2021](https://tc39.es/ecma262/#sec-toprimitive 'ECMAScript2021') 标准中的定义拿过来解读一下：

![type-conversion0](./images/type-conversion.png 'type-conversion0')

我主要讲一下 `2` 中的步骤：

- `a`：获取 `input` 的 `@@toPrimitive` 方法，`input` 是一个对象。
- `b`：如果 `@@toPrimitive` 不是 `undefined`，然后
  - `i`：如果 `@@toPrimitive` 方法中没有指定第二个参数，那么 `hint` 设为 `default`。
  - `ii`：如果第二个参数是 `string`，那么 `hint` 设为 `string`。
  - `iii`：如果第二个参数是 `number`，那么 `hint` 设为 `number`。
  - `iv`：以 `input` 和 `hint` 为参数调用 `@@toPrimitive` 方法。
  - `v`：如果执行结果不是一个对象，那么返回结果。
  - `vi`：如果执行结果是一个对象，抛出 `TypeError`。

- `c`：如果没有定义 `@@toPrimitive` 方法，并且没有指定 `preferredType`，那么 `preferredType` 设为 `number`。
- `d`：返回 `OrdinaryToPrimitive(input, preferredType)`

所以当我们没有指定 `@@toPrimitive` 方法的时候，就是执行 `OrdinaryToPrimitive(input, preferredType)`，该函数定义如下：

![type-conversion1](./images/type-conversion1.png 'type-conversion1')

它接受两个参数 `O` 和 `hint`，也就是我们上面 `d` 步骤中的 `input` 和 `preferredType`。主要步骤如下：

- `hint` 必须是 `string` 或者 `number` 的一种。
- 如果 `hint` 是 `string`，就按顺序调用对象的 `toString` 和 `valueOf` 方法，如果调用后结果不是对象则返回。
- 如果 `hint` 是 `number`，就按顺序调用对象的 `valueOf` 和 `toString` 方法，如果调用后结果不是对象则返回。

其实逻辑还是比较清晰，并没有很复杂，最后在说一说 `toPrimitive` 中的 `b` 情况。`@@toPrimitive` 方法就是让我们自定义拆箱的规则，而不是根据标准的规则进行，我们可以根据自己的需求定制拆箱的规则。`@@` 开头的名字是标准中的 [Well-Known Symbols](https://tc39.es/ecma262/#sec-well-known-symbols 'Well-Known Symbols')，他们是内置的 `Symbol`，作为属性的 `key`。在 `ES2016` 引入 `Symbol` 后我们已经可以访问这些 `Symbol`，比如 `@@match`，`@@matchAll` 等等，我们在编码中可以直接使用 `String.prototype.match` 和 `String.prototype.matchAll` 来调用，他们在引擎内部即调用的 `Symbol` 对应的方法。`@@` 是在标准文档中的名字，我们在 `JavaScript` 编码中使用的名字是将 `@@` 替换为 `Symbol.`，所以我们给对象添加 `@@toPrimitive` 属性就是添加一个 `Symbol.toPrimitive` 属性。当引擎调用 `@@toPrimitive` 的时候就会找到我们定义的方法。

```javascript
// 一个没有提供 Symbol.toPrimitive 属性的对象，参与运算时的输出结果
var obj1 = {}
console.log(+obj1) // NaN
console.log(`${obj1}`) // "[object Object]"
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
console.log(`${obj2}`) // "hello" -- hint 参数值是 "string"
console.log(obj2 + '') // "true"  -- hint 参数值是 "default"
```

内置 `Symbol` 参考 [Symbol - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol 'Symbol - MDN')

## 类型转换

现在我们已经知道装箱和拆箱的规则，也就是掌握了类型转换的工具，剩下的只要搞清楚哪个场景用哪个工具进行转换即可。

## 显式强制类型转换

在讨论隐式强制类型转换之前，我们先讨论一下显式强制类型转换。

所谓 **显式强制类型转换** 指的就是我们直接调用 `Number()`， `String()` 和 `Boolean()` 构造函数（不带 `new`）对一个值进行类型转换。我们还是来解读标准文档。

> 注意一点，标准文档中的蓝色的方法前面的 `!` 不是取反的意思，你可以无视掉，就当做执行后面的方法就可以。

### Number

![type-conversion2](./images/type-conversion2.png 'type-conversion2')

上面的截图就是对 `Number` 构造函数的定义，内容很简单：

- 如果不是用 `new` 调用的，则返回 `ToNumeric(value)` 的值，`value` 是我们传入的值，如果没有传入 `value`，那么就返回 `+0`。
- 如果是用 `new` 调用，则生成基本包装类型对象。

`ToNumeric` 的定义如下：

![type-conversion3](./images/type-conversion3.png 'type-conversion3')

表格十分清晰，我就不解读了。表格中没有说的是 `String`，`String` 转 `Number` 在标准中定义了非常长的内容，我个人理解就是不符合 `JavaScript` 格式的 `string` 返回 `NaN`，其他返回对应的数字。所谓的符合格式就包括 `0o` 或 `0` 开头的八进制，`0x` 开头的十六进制，`0b` 开头的二进制，科学计数法等。

### String

还是从标准解读：

![type-conversion4](./images/type-conversion4.png 'type-conversion4')

- 如果不是 `new` 调用 `String` 构造函数，返回 `ToString(value)`。
- 如果是以 `new` 调用 `String` 构造函数，返回基本包装类型对象。

`ToStrong` 定义如下：

![type-conversion5](./images/type-conversion5.png 'type-conversion5')

这当中 `Number::String` 在标准中定义比较复杂，应该是进行了严格的数学定义，我们按我们正常的理解就可以了。`-0，-0` 都是 `0`，`NaN` 返回 `"NaN"`。

### Boolean

![type-conversion6](./images/type-conversion6.png 'type-conversion6')

- 如果不是 `new` 调用 `Boolean` 构造函数，返回 `ToBoolean(value)`。
- 如果是以 `new` 调用 `Boolean` 构造函数，返回基本包装类型对象。

![type-conversion7](./images/type-conversion7.png 'type-conversion7')

## 隐式强制类型转换

隐式强制类型转换可能是更让人头疼的一部分，其实只要搞清楚标准，隐式的转换也是用的我们上面看到的那些方法进行转换的，我们也不必记清楚每一个规则，只要知道到哪里去查，还有编码中避免一些会出问题的转换。我这里就找出一些我们比较常见的隐式转换的场景对标准进行解读。

### 算数运算符

在标准中所有的算数运算符最后都是由下面这个方法执行的 `lval` 即操作符左边的值，`opText` 即操作符，`rval` 即操作符右边的值：

![type-conversion8](./images/type-conversion8.png 'type-conversion8')

- 如果操作符是 `+`
  - 计算 `ToPrimitive(lval)` 赋值给 `lprim`
  - 计算 `ToPrimitive(rval)` 赋值给 `rprim`
  - 如果 `lprim` 或 `rprim` 中有一个类型是 `String`
    - 计算 `ToString(lprim)` 赋值给 `lstr`
    - 计算 `ToString(rprim)` 赋值给 `rstr`
    - 拼接 `lstr` 和 `rstr` 并返回

  - 将 `lprim` 赋值给 `lval`
  - 将 `rprim` 赋值给 `rval`

- 计算 `ToNumeric(lval)`，赋值给 `lnum`
- 计算 `ToNumeric(rval)`，赋值给 `rnum`
- 如果 `Type(lnum)` 和 `Type(rnum)` 不同，抛出一个 `TypeError`
- 进行算数运算

我们可以看到这段定义中的方法都是我们在上面显示转换中介绍过的方法。在算数操作符中 `ToPrimitive()` 是并没有传入 `hint` 的，所以就用默认 `number`，所以在算术运算的类型转换中，总是先调用 `valueOf`，后调用 `toString()`。

### 一元操作符

一元操作符的定义都非常简单，这里就不贴图了，直接给一个总结，如果你想看相关定义点击[ECMAScript 2021 - Unary Operators](https://tc39.es/ecma262/#sec-unary-operators 'ECMAScript 2021 - Unary Operators')

- `++` -> `ToNumeric`
- `--` -> `ToNumeric`
- `+` -> `ToNumeric`
- `-` -> `ToNumeric`
- `~` -> `ToNumeric`
- `!` -> `ToBoolean`

这里再给大家举个例子 `'a' + + 'a'` （注意两个加号不能相连）得到的结果是 `aNaN`，因为第二个 `+` 作为一元操作符，调用 `ToNumber()` 最后的结果是 `NaN`。然后执行 `'a' + NaN`，就是回到算术运算符的定义，有一个是 `String` 两个都转成 `String` 然后返回拼接的字符串，所以最后的结果是 `aNaN`。你也可以找一些例子进行验证。

### 关系运算符

所有的关系运算符（`<, >, <=, >=`）的结果都是根据 `Abstract Relational Comparison` 的返回值计算，所以我们先着重分析这个方法，看下图。由于在标准中统一用小于号，所以用 `leftFirst` 表示是大于操作符还是小于操作符，`true` 则为小于关系符，`false` 则为大于关系符。

![type-conversion9](./images/type-conversion9.png 'type-conversion9')

我们可以看到第一部就是进行拆箱操作，`hint` 为 `number`，也就是先调用 `valueOf`，在调用 `toString`。

当两个操作数 `operand` 都是字符串的时候，会调用一个方法 `IsStringPrefix(a, b)` 来计算结果。这个方法的意思就是：比如判断 `a<b` 的结果，就是判断 `a` 是不是 `b` 的一个前缀，就是 `a` 加上另一个字符串能构成 `b`，如果能，则返回 `true` ；如果 `b` 是 `a` 的前缀，则返回 `false`，所以 `'cl' < 'clloz'` 会返回 `true`。如果不存在前缀关系，则进行 `code unit` 比较，在 `JavaScript` 中是 `UTF-16` 编码，从最低位开始进行码点比较相同则进入下一位，如果能找到一位是 `a` 的码点小于 `b` 则返回 `true` 否则返回 `false`。一般的字符串我们只要根据扩展 `ASCII` 进行比较即可。

```javascript
console.log('cllob' < 'clloc') //true
console.log('cllob' < 'clloa') //false
console.log('clloba' < 'cllob') / false
```

`bigInt` 我们就跳过，因为运用不是很多。我们直接进入下面的 `ToNumeric`，将两个操作数都进行 `ToNumeric`，如果得到的结果类型相同，则调用对应类型的 `T::lessThan`. `ToNumeric` 的结果要么是 `Number` 要么是 `BigInt`，要么抛错，所以我们只要看 `Number::lessThan(x, y)` 的定义即可：

- 如果 `x` 是 `NaN`，返回 `undefined`。
- 如果 `y` 是 `NaN`，返回 `undefined`。
- 如果 `x` 和 `y` 是相同的数值，返回 `false`。
- 如果 `x` 和 `y` 一个是 `+0` 一个是 `-0` 返回 `false`。
- 如果 `x` 和 `y` 任意一个为 $\pm \infty$，返回 `false`。
- 其他情况进行数值比较（非零并且不是无穷），`x < y` 返回 `true`，否则返回 `false`。

**注意，得到的 `Abstract Relational Comparison` 的返回值不是最终的结果**。对于 `<, >` 来说，如果 `Abstract Relational Comparison` 返回值是 `undefined`，则则返回 `false`，否则直接返回 `Abstract Relational Comparison` 的返回值。对于 `<=, >=`，如果 `Abstract Relational Comparison` 的返回值是 `true` 或 `undefined`，则返回 `false`，否则返回 `true`。

这里可能有同学疑惑 `<=` 和 `>=` 的逻辑是不是错了，`Abstract Relational Comparison` 的返回值是 `true` 应该返回 `true`，这里标准里面是将 `<=, >=` 的 `leftFirst` 相对于 `<, >` 去了一个相反，这样能保持 `lessThan` 中的逻辑最简单，即 `<, >` 为 `false` 的时候 `<=, >=` 为 `true`；`<, >` 为 `true` 的时候 `<=, >=` 为 `false`。否则因为有第三条相等规则在，逻辑会比较复杂。具体的定义看 [Relation-Operators -ECMAScript](https://tc39.es/ecma262/#sec-relational-operators-runtime-semantics-evaluation 'Relation-Operators -ECMAScript')

下面来几个例子：

```javascript
console.log(null < -0) //false null被转为 +0，和 -0 进行lessThan 返回false，所以最终结果为 false

console.log(NaN < 10) //false 只要有 NaN，lessThan的结果就是 undefined，对于 < 和 > 来说 undefined最后返回 false

console.log(NaN <= 10) //false 对于 <= 和 >= 来说，undefined就是 false
```

### 相等操作符

相等操作符有四个 `==, !=, ===, !==`，定义在 [Equality-Operators - ECMAScript](https://tc39.es/ecma262/#sec-equality-operators 'Equality-Operators - ECMAScript')，其中最关键的就是两个方法：`Abstract Equality Comparison` 和 `Strict Equality Comparison`，前者是双等号的方法，后者是全等号的方法。定义间下图：

![type-conversion10](./images/type-conversion10.png 'type-conversion10')

我们可以看到两个方法的定义长度完全不同 :joy: 。双等号可以算作是 `JavaScript` 中的一个设计失误，非常不建议使用。这里我就说一说全等好的定义。

- 如果两个操作数的类型不同，返回 `false`。
- 如果两个操作数的类型都是 `Number`，调用 `Number::equal(x, y)` 方法，返回方法的返回值（`BigInt` 不讨论）。该方法定义在 [Number::equal - ECMAScript](https://tc39.es/ecma262/#sec-numeric-types-number-equal 'Number::equal - ECMAScript')
  - 两个操作数有一个是 `NaN`，返回 `false`。
  - 两个操作数是同一个数值，返回 `true`。
  - 两个操作数分别是 `+0` 和 `-0`，返回 `true`。
  - 上面的条件都不满足，返回 `false`。

- 如果类型不是 `Number` 或 `BigInt`，则返回 `SameValueNonNumeric(x, y)` 的返回值。
  - 断言：两者不是 `Number` 和 `BigInt`
  - 断言：两者类型相同
  - 如果 `x` 类型是 `Undefined`，返回 `true`。
  - 如果 `x` 类型是 `Null`，返回 `true`。
  - 如果 `x` 类型是 `String`，则必须 `x` 和 `y` 的所有码点序列完全一致才返回 `true`，否则返回 `false`。
  - 如果 `x` 类型是 `Boolean`，则必须 `x` 和 `y` 同为 `true` 或 `false` 才返回 `true`，否则返回 `false`。
  - 如果 `x` 类型是 `Symbol`，则必须 `x` 和 `y` 是同一个 `Symbol` 才返回 `true`，否则返回 `false`。
  - 如果 `x` 和 `y` 是同一个对象，返回 `true`，否则返回 `false`。

相等操作符到这里就讲完了，双等号我没有仔细看，因为我从来不用，也不建议大家使用。如果你有兴趣可以仔细阅读一下图片中的标准定义。

## valueOf 和 toString

上面从标准的角度讲了类型转换，`toPrimitive` 最后会尝试调用 `valueOf` 或者 `toString`。

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

每个对象都有一个 `toString()` 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，`toString()` 方法被每个 `Object` 对象继承。如果此方法在自定义对象中未被覆盖，`toString()` 返回 `[object type]`，其中 `type` 是对象的类型。

所以 `valueOf` 就是返回这个对象本来的“面目”，比如一个被包装过的 `Number`；而 `toString` 则是把对象转化成一个字符串。不同的对象有不同的处理方式，内置对象几乎都实现了自己的对应方法覆盖 `Object.prototype` 上的方法。这两个方法主要就是为了应对不同的类型在进行某些操作是需要进行类型转换的情况。

## 总结

这篇文章应该将双等号以外的绝大多数类型转换的情况都说清楚了，而且是根据标准来讲的，还是比较清晰的。其实整个思路理下来也不是非常的复杂，所以有时候就是 `Just Do It!` :punch: 。希望这篇文章给你带来帮助，如果有错误的地方，欢迎指正。
