---
title: '解构赋值的一些细节'
publishDate: '2020-07-08 12:00:00'
description: ''
tags:
  - js
  - 实用技巧
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

解构赋值 `Destructuring assignment` 是 `ES6` 提供的新语法，通过解构赋值我们可以从对象或数组（类数组对象也可）中取出属性或值，赋值给其他变量。本文整理一下比较容易忽略和不太好理解的点。

## 知识点

## undefined 的确定

`ES6` 用严格相等运算符来判断一个位置是否有值。在解构赋值中只有一个位置的值严格等于 `undefined`，我们设置的默认值才会生效。

```javascript
let [x = 1] = [undefined]
x // 1

let [x = 1] = [null]
x // null
```

## 默认值表达式惰性求值

如果解构赋值中某个变量的默认值是个表达式，那么这个表达式是惰性求值的，也就是只有需要执行的时候才会求值。

```javascript
function f() {
  console.log('aaa')
}

let [x = f()] = [1] //f() 不会执行
```

## 对象解构机制

数组的解构赋值是根据变量的位置来确定其值的。由于对象不像数组一样是按次序排列的，所以对象的解构赋值只能根据变量的名称到对象中查找。但是需要注意的是，我们要区分好用于匹配的模式（可以理解为键值对中的键）和具体的对象，特别是在嵌套的对象解构中。我的理解就是解构表达式中的变量表示中不管嵌套多少层，有多少标识符，第一个无法在对象中找到的标识符就是变量的名称，如果每一个标识符都能找到，那么就是隐藏了一个和最后一个标识符同名的变量。

```javascript
let { foo: baz } = { foo: 'aaa', bar: 'bbb' }
baz // "aaa"
foo // error: foo is not defined
//foo是匹配的模式，baz才是变量，模式只是用来到对象中查找属性，而变量则是最后赋值的目标

let {
  foo: { bar }
} = { baz: 'baz' } //foo 无法在对象中找到，所以是 undefined，此时再想向下找属性就会报错

//对象的解构赋值可以找原型上的属性
const obj1 = {}
const obj2 = { foo: 'bar' }
Object.setPrototypeOf(obj1, obj2)

const { foo } = obj1
foo // "bar"

//数组是特殊的对象，所以可以对数组进行对象属性的解构
let arr = [1, 2, 3]
let { 0: first, [arr.length - 1]: last } = arr
first // 1
last // 3
```

解构赋值用引擎的内部方法 `toObject()`（我们无法在 `runtime` 访问到这个方法）强制将源数据转为对象。也就是说如果 `source` 是一个原始数据类型，会被转为对应的包装对象。由于 `null` 和 `undefined` 无法转为对象，所以会报错。

```javascript
let { length } = 'foobar'
console.log(length) // 6

let { constructor: c } = 4
console.log(c === Number) // true

let { _ } = null // TypeError

let { _ } = undefined // TypeError
```

如果解构赋值语句不是变量声明语句（前面没有 `var`，`let`，`const`），即对已经声明的变量进行进行解构赋值需要注意加上括号。

```javascript
let x;
{x} = {x: 1}; //Uncaught SyntaxError: Unexpected token '='  行首的大括号会被引擎认为是代码块
({x} = {x: 1}); //这是正确写法，但是和立即执行函数一样，该语句的前面一行最好加上分号，否则可能会被当做函数调用。
```

嵌套的对象的解构赋值可以用来复制对象属性。

```javascript
let person = {
  name: 'Matt',
  age: 27,
  job: {
    title: 'Software engineer'
  }
}
let personCopy = {}

;({ name: personCopy.name, age: personCopy.age, job: personCopy.job } = person)

// Because an object reference was assigned into personCopy, changing a property
// inside the person.job object will be propagated to personCopy:
person.job.title = 'Hacker'

console.log(person)
// { name: 'Matt', age: 27, job: { title: 'Hacker' } }

console.log(personCopy)
// { name: 'Matt', age: 27, job: { title: 'Hacker' } }
```

对于包含了多个属性赋值的解构赋值语句，多个属性的赋值是依次执行，相互独立的，也就是说如果第一个属性赋值成功，第二个失败报错的话，第一个赋值依然是成功的。

```javascript
let person = {
  name: 'Matt',
  age: 27
}

let personName, personBar, personAge

try {
  // person.foo is undefined, so this will throw an error
  ;({
    name: personName,
    foo: { bar: personBar },
    age: personAge
  } = person)
} catch (e) {
  console.log(e) //TypeError: Cannot read property 'bar' of undefined
}

console.log(personName, personBar, personAge)
// Matt, undefined, undefined
```

结构赋值还可以配合 `for ... of` 进行使用：

```javascript
var people = [
  {
    name: 'Mike Smith',
    family: {
      mother: 'Jane Smith',
      father: 'Harry Smith',
      sister: 'Samantha Smith'
    },
    age: 35
  },
  {
    name: 'Tom Jones',
    family: {
      mother: 'Norah Jones',
      father: 'Richard Jones',
      brother: 'Howard Jones'
    },
    age: 25
  }
]

for (var {
  name: n,
  family: { father: f }
} of people) {
  console.log('Name: ' + n + ', Father: ' + f)
}

// "Name: Mike Smith, Father: Harry Smith"
// "Name: Tom Jones, Father: Richard Jones"
```

解构赋值可以使用属性名表达式：

```javascript
let key = 'z'
let { [key]: foo } = { z: 'bar' }

console.log(foo) // "bar"
```

剩余参数也可以运用到对象的解构赋值中：

```javascript
let { a, b, ...rest } = { a: 10, b: 20, c: 30, d: 40 }
console.log(a) // 10
console.log(b) // 20
console.log(rest) // { c: 30, d: 40 }
```

解构赋值的属性查找会查找原型链上的属性：

```javascript
// 声明对象 和 自身 self 属性
var obj = { self: '123' }
// 在原型链中定义一个属性 prot
obj.__proto__.prot = '456'
// test
const { self, prot } = obj
// self "123"
// prot "456"（访问到了原型链）
```

## 数组的解构赋值

数组的解构赋值表达式的右值不是一个可遍历结构，则会报错。

```javascript
// 报错 Uncaught TypeError: xxx is not iterable
let [foo] = 1
let [foo] = false
let [foo] = NaN
let [foo] = undefined
let [foo] = null
let [foo] = {}
```

数组的解构赋值也可以这样使用 `let [,m] = [2,3]`。

数组的解构赋值还支持剩余模式：`var [a, ...b] = [1, 2, 3];`，但是要注意如果剩余元素右侧有逗号，会抛出 `SyntaxError`，因为剩余元素必须是数组的最后一个元素。

```javascript
var [a, ...b] = [1, 2, 3]
// SyntaxError: rest element may not have a trailing comma
```

## 数值、字符串和布尔型

解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象，字符串被转为类数组对象，数值和布尔型则转为包装对象。由于 `undefined` 和 `null` 无法转为对象，所以对它们进行解构赋值，都会报错。

```javascript
const [a, b, c, d, e] = 'hello'
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

//字符串转为的对象有length属性
let { length: len } = 'hello'
len // 5

let { toString: s } = 123
s === Number.prototype.toString // true

let { toString: s } = true
s === Boolean.prototype.toString // true

let { prop: x } = undefined // TypeError
let { prop: y } = null // TypeError
```

## 函数参数的解构赋值

函数参数的解构赋值如果是一个对象，不会影响 `arguments` 的 `length`，它只是允许你在函数签名中声明变量，并且能够立即在函数体中使用它。

一个函数签名 (或类型签名，或方法签名) 定义了函数或方法 的输入与输出。一个签名可以包括：

- 参数及参数的类型
- 一个返回值及其类型
- 可能会抛出或传回的异常
- 有关面向对象程序中方法可用性的信息 (例如关键字 `public`、`static` 或 `prototype`)。

```javascript
let person = {
  name: 'Matt',
  age: 27
}

function printPerson(foo, { name, age }, bar) {
  console.log(arguments)
  console.log(name, age)
}

function printPerson2(foo, { name: personName, age: personAge }, bar) {
  console.log(arguments)
  console.log(personName, personAge)
}

printPerson('1st', person, '2nd')
// ['1st', { name: 'Matt', age: 27 }, '2nd']
// 'Matt', 27

printPerson2('1st', person, '2nd')
// ['1st', { name: 'Matt', age: 27 }, '2nd']
// 'Matt', 27
```

函数参数的解构赋值需要注意的是默认参数设定的机制。

```javascript
//设置解构赋值的默认值
function move({ x = 0, y = 0 } = {}) {
  return [x, y]
}

move({ x: 3, y: 8 }) // [3, 8]
move({ x: 3 }) // [3, 0]
move({}) // [0, 0]
move() // [0, 0]
move({ x: undefined, y: undefined }) //[0, 0]

//设置参数默认值
function move({ x, y } = { x: 0, y: 0 }) {
  return [x, y]
}

move({ x: 3, y: 8 }) // [3, 8]
move({ x: 3 }) // [3, undefined]
move({}) // [undefined, undefined]
move() // [0, 0]
move({ x: undefined, y: undefined }) //[undefined, undefined]

//注意下面这种会直接报错
function move({ x = 0, y = 0 }) {
  return [x, y]
}
move() //Uncaught TypeError: Cannot read property 'x' of undefined
```

这里说实话不是很好理解，阮一峰老师的书里也没有讲的非常清楚，是一笔带过。最后我说一下自己的理解。

`ES6标准入门` 中关于函数的解构赋值的例子中关于默认值的设定都是非对象的，比如 `let {x = 10, y = 20} = {x: 3}` 。但是在函数参数的情况里面并不是这样。函数参数中的例子是 `function move({x = 0, y = 0} = {}){}` 这样的形式，用之前的那种理解无法解释这种行为。

函数的参数是一个 `arguments`，一个迭代器，类数组对象，所以上面的函数可以类比为这样的一个式子:

```javascript
function move({ x = 0, y = 0 } = {}) {}
;[{ x = 10, y = 20 } = {}] = arguments[({ x = 10, y = 20 } = {})] = []
```

经过这种转化之后似乎清晰一些，但是如何理解呢。我们把 `{x = 10, y = 20}` 看做一个整体，上面的式子变为 `[obj = {}] = []`，也就是我们设置 `obj` 的默认值为 `{}`（也可以理解为设置参数默认值，是另一种思路，不过本质也没有区别），只要我们传入的 `arguments` 中有参数的话，就不会用这个默认值 `{}`，只有当我们的 `arguments` 的索引为 `0` 的元素严格等于 `undefined` 的时候才会用到默认值 `{}`，使用默认值就相当于执行 `{x = 10, y = 20} = {}` 的解构赋值。当 `arguments` 的索引为 `0` 的元素不严格等于 `undefined` 的时候则会把这个元素转为一个对象 `object`，执行 `{x = 10, y = 20} = object` 的解构赋值，如果找不到，则使用默认值 `10 ，20`，不管传入的是数字还是字符串等，都能正常执行；唯一会报错的就是 `null`。

有了这个逻辑，我们分析其他的两种情况就很简单了。比如 `function move({x, y} = {x:0, y:0}){}` 这种情况，就可以理解为 `[obj = {x:0, y:0}] = []`，只有当 `arguments` 索引为 `0` 的元素严格等于 `undefined` 的时候才会变成执行 `{x, y} = {x:0, y:0}`，否则就是把索引为 `0` 的元素转为对象 `object` 执行 `{x, y} = object`，这也是为什么只有 `move()` 不传参的时候才能输出 `[0, 0]`。

`function move({x = 0, y = 0}){}` 为什么在不传参的时候报错，它相当于执行 `[{x = 0, y = 0}] = []`，要在 `arguments` 索引为 `0` 的元素转为的对象上找 `x` 和 `y` 属性，但这个值是 `undefined`，所以最终报错。

逻辑可能有点绕，最后我总结一下比较重要的规则：

- 对于有嵌套结构（且嵌套的数组或对象没有设置初始值）的解构赋值，等号左右两边嵌套结构必须相同。属于模式匹配，所以等号两边模式要相同。
- 对对象或数组设置初始值（也必须是一个对象或数组），则该对象和数组被看做一个整体，在完成第一步结构赋值以后才能确定目标进行第二次解构赋值。比如 `[{x = 10, y = 20} = {}] = [{x: 1}]` 先进行 `[obj = {}] = [{x: 1}]`，确定了 `obj` 的解构赋值目标是 `{x: 1}` 之后进行第二步的解构赋值 `{x = 10, y = 20} = {x: 1}`，最后的结果是 `x: 1, y: 20`。
- 对于嵌套结构中的对象，如果设置了初始值（也是对应的对象），则等号右边结构的对应位置可以是除 `null` 以外的任何值，因为 `undefined` 会将目标设置为初始值，而其他值都能转为对象。
- 对于嵌套结构中的数组，如果设置了初始值（应是一个 `Iterator`），则等号右边结构对应位置必须是一个 `Iterator`，否则报错。比如 `[[a = 1, b = 2]] = [1]` 会报错，而 `[[a = 1, b = 2]] = ['ab']` 则能正确解构赋值，结果为 `a: 'a', b: 'b'`。
- 多层的嵌套每一层都可以给任意结构设定初始值，逻辑和上面相同，不顾一般不会使用。

> 函数默认参数的使用也和解构赋值的默认值的生效类似，当传入的参数严格等于 `undefined` 即使用默认参数，`[1, undefined, 3].map((x = 'yes') => x); // [ 1, 'yes', 3 ]`

上面的函数用的是对象作为参数，其实数组作为参数的情形也是一样的。但是注意数组解构赋值的右值必须是一个可遍历结构。

```javascript
//设置默认参数
function a([x, y] = [5, 6]) {
  console.log(x, y)
}
a() //5, 6
a([1]) //1, undefined
a('asdf') // a, s
a(1) //VM1241:1 Uncaught TypeError: undefined is not a function(不知道为什么不是not iterable的报错)

//设置默认值
function a([x = 5, y = 6] = []) {
  console.log(x, y)
}
a() // 5, 6
a([1]) //1, 6
a('asdf') // a, s
a(1) //VM1241:1 Uncaught TypeError: undefined is not a function
```

如果你希望能够在不提供任何参数的情况下调用该函数，就使用默认值模式。如果你只是想用解构赋值给函数一个默认参数则使用另一种。

## 解构赋值中的括号

解构赋值虽然很方便，但是解析起来并不容易。对于编译器来说，一个式子到底是模式，还是表达式，没有办法从一开始就知道，必须解析到（或解析不到）等号才能知道。由此带来的问题是，如果模式中出现圆括号怎么处理。`ES6` 的规则是，只要有可能导致解构的歧义，就不得使用圆括号。但是，这条规则实际上不那么容易辨别，处理起来相当麻烦。因此，建议只要有可能，就不要在模式中放置圆括号。

总结起来就是两个规则： 1. 变量声明语句中不可以使用（函数参数也属于变量声明） 2. 不可以把模式（键）包含在小括号中（数组的模式是按位置匹配，所以把数组元素括起来可以）

```javascript
// 变量声明 报错
let [(a)] = [1];

let {x: (c)} = {};
let ({x: c}) = {};
let {(x: c)} = {};
let {(x): c} = {};

let { o: ({ p: p }) } = { o: { p: 2 } };

//函数参数 报错
function f([(z)]) { return z; }
function f([z,(x)]) { return x; }

//模式括号 报错
({ p: a }) = { p: 42 };
([a]) = [5];

[({ p: a }), { x: c }] = [{}, {}];

//正确
[(b)] = [3]; // 正确
({ p: (d) } = {}); // 正确
[(parseInt.prop)] = [3]; // 正确
```

> 除了大括号在行首用括号将表达式括起来，其他情况尽量不要使用

## 用途

1. 将对象的方法赋值给某个变量

   ```javascript
   // 例一
   let { log, sin, cos } = Math

   // 例二
   const { log } = console
   log('hello') // hello
   ```

2. 交换变量的值

   ```javascript
   let x = 1
   let y = 2

   ;[x, y] = [y, x]
   ```

3. 函数返回多个值

   ```javascript
   // 返回一个数组

   function example() {
     return [1, 2, 3]
   }
   let [a, b, c] = example()

   // 返回一个对象

   function example() {
     return {
       foo: 1,
       bar: 2
     }
   }
   let { foo, bar } = example()
   ```

4. 函数参数定义

   ```javascript
   // 参数是一组有次序的值
   function f([x, y, z]) { ... }
   f([1, 2, 3]);

   // 参数是一组无次序的值
   function f({x, y, z}) { ... }
   f({z: 3, y: 2, x: 1});
   ```

5. 提取 `JSON` 数据

   ```javascript
   let jsonData = {
     id: 42,
     status: 'OK',
     data: [867, 5309]
   }

   let { id, status, data: number } = jsonData

   console.log(id, status, number)
   // 42, "OK", [867, 5309]
   ```

6. 函数参数默认值

   ```javascript
   jQuery.ajax = function (
     url,
     {
       async = true,
       beforeSend = function () {},
       cache = true,
       complete = function () {},
       crossDomain = false,
       global = true
       // ... more config
     } = {}
   ) {
     // ... do stuff
   }
   ```

7. 遍历 `Map` 解构

   ```javascript
   jQuery.ajax = function (
     url,
     {
       async = true,
       beforeSend = function () {},
       cache = true,
       complete = function () {},
       crossDomain = false,
       global = true
       // ... more config
     } = {}
   ) {
     // ... do stuff
   }

   // 获取键名
   for (let [key] of map) {
     // ...
   }

   // 获取键值
   for (let [, value] of map) {
     // ...
   }
   ```

8. 输入模块的指定方法

   ```javascript
   const { SourceMapConsumer, SourceNode } = require('source-map')
   ```

## 参考文章

1. 《ECMAScript6入门》 —— 阮一峰
2. MDN
