---
title: 'JavaScript Function 的知识点整理'
publishDate: '2020-08-05 12:00:00'
description: ''
tags:
  - essay
  - 学习笔记
language: '中文'
heroImage: {"src":"./javascript-logo.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

本文对 `JavaScript` 中的 `Function` 的一些比较容易忽略的知识点和新特性做一个整理。

## new Function()

`Function` 构造函数创建一个新的 `Function` 对象。直接调用此构造函数可用动态创建函数，但会遇到和 `eval` 类似的的安全问题和(相对较小的)性能问题。然而，与 `eval` 不同的是，`Function` 创建的函数只能在全局作用域中运行。它的用法如下：

```javascript
const sum = new Function('a', 'b', 'return a + b'); //注意，无论是参数标识符还是函数体，都是字符串，new 可以省略

console.log(sum(2, 6));
// expected output: 8
```

当然一般我们不太会使用这种方式来构建函数，不过还是需要了解一下，很多框架都有使用 `new Function` 或者 `eval` 来实现一些功能。关于 `eval` 和 `new Function()`，我在 [YDNJS学习笔记-上卷-第一部分](https://www.clloz.com/programming/front-end/js/2020/07/16/ydnjs-note-1/#i-4 "YDNJS学习笔记-上卷-第一部分") 有做详细的阐述。

`Function` 构造函数和 `eval` 最重要的区别是由 `Function` 构造器创建的函数不会创建当前环境的闭包，它们总是被创建于全局环境，因此在运行时它们只能访问全局变量和自己的局部变量，不能访问 `Function` 构造器创建时所在的作用域的变量。这一点与使用 `eval` 执行创建函数的代码不同。在平时的编码中不建议使用，它无法享受引擎的基于词法的静态分析带来的优化，并且有影响性能的可能性。

```javascript
function foo(str, a) {
    Function(str)(); //3
    console.log( a, b );
}
var b = 2;
foo( "var b = 3;console.log(b)", 1 ); // 1, 2

function foo(str, a) {
    eval( str ); // 此处执行的代码声明了一个新的变量，改变了当前环境的词法作用域
    console.log( a, b );
}
var b = 2;
foo( "var b = 3;", 1 ); // 1, 3
```

## Function.name

`Function.name` 在 `ES6` 被写入标准。它的主要功能就是返回函数名，在 `ES6` 之前该属性就存在，不过在 `ES6` 才加入标准。在非标准的 `ES2015` 之前的实现中，该属性的 `configurable` 属性也是 `false` ，现在为 `true`，也就意味着这是一个可配置属性。

针对不同方式声明的函数，这个属性会返回同的值。

```javascript
// 函数声明
function doSomething() {}
doSomething.name; // "doSomething"

//Function 构造函数
new Function().name; // "anonymous"

//变量和方法可以从句法位置推断匿名函数的名称（ECMAScript 2015中新增），在 ES6 之前匿名函数返回值为空字符串
var f = function () {};
var object = {
    someMethod: function () {},
};
console.log(f.name); // "f"
console.log(object.someMethod.name); // "someMethod"

//简写的对象方法
var o = {
    foo() {},
};
o.foo.name; // "foo";

//绑定函数
function foo() {}
foo.bind({}).name; // "bound foo"

//getter 和 setter
var o = {
    get foo() {},
    set foo(x) {},
};

var descriptor = Object.getOwnPropertyDescriptor(o, 'foo');
descriptor.get.name; // "get foo"
descriptor.set.name; // "set foo";
```

我们可以在函数表达式中为后面的函数命名，但是这个名称是无法直接使用的，它只是改变了 `Function.name` 的值。

```javascript
let someMethod = function object_someMethod() {};

console.log(someMethod.name); // "object_someMethod"

console.log(object_someMethod); //ReferenceError: object_someMethod is not defined
```

`Function.name` 是只读的，不可修改，要更改它只能通过 `Object.defineProperty()`。

```javascript
var object = {
    // anonymous
    someMethod: function () {},
};

object.someMethod.name = 'otherMethod';
console.log(object.someMethod.name); // someMethod
```

**注意，解释器只有在函数没有设置 name 属性的时候才会设置内置的 Function.name，并且 ES2015 规定静态方法也被认为是类的属性。**

我们能取到一个函数的函数名 `Function.name`，前提是我们没有手动为这个函数设置 `name` 属性。由于类本质就是一个构造函数，所以我们也可以取到类的 `name`，我们可以通过实例获取构造函数的 `name`，方法就是 `instance.constructor.name`。但是如果我没在类里面定义了一个名叫 `name` 的静态方法，那么我们访问 `Function.name` 得到的就是这个方法。

如果函数名是 `Symbol`，那么 `Function.name` 将返回 `Symbol` 的描述符。

```javascript
var sym1 = Symbol('foo');
var sym2 = Symbol();
var o = {
    [sym1]: function () {},
    [sym2]: function () {},
};

o[sym1].name; // "[foo]"
o[sym2].name; // ""
```

还有一点需要注意的是，代码压缩的过程中，我们的函数名很可能被改写，所以如果你使用了 `Function.name` 要确保函数名没有被构建工具修改。

## Function.length

`length` 属性指明函数的形参个数。形参的数量不包括剩余参数个数，仅包括第一个具有默认值之前的参数个数。与之对比的是， `arguments.length` 是函数被调用时实际传参的个数。

```javascript
function a(m, n = 'a', b) {
    console.log(a.length); //1
    console.log(arguments.length); //3
    console.log(m, n, b); //1 a 2
}

a(1, undefined, 2);
```

> 小知识：`Function` 构造器本身也是个 `Function`。他的 `length` 属性值为 `1` 。该属性 `Writable: false, Enumerable: false, Configurable: true`。`Function.prototype` 对象也是一个函数，它的 `length` 属性值为 `0`。

## call，apply 和 bind

这部分内容参考 [模拟实现call，apply 和 bind](https://www.clloz.com/programming/front-end/js/2020/10/07/simulation-of-call-apply-bind/#_bind "模拟实现call，apply 和 bind")

## 箭头函数

箭头函数表达式的语法比函数表达式更简洁，并且没有自己的 `this`，`arguments`，`prototype`，`super` 或 `new.target`。箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数，也不能用作生成器函数。引入箭头函数有两个方面的作用：更简短的函数并且不绑定 `this`。

箭头函数不会创建自己的 `this`,它只会从自己的作用域链的上一层继承 `this`。下面列出一些箭头函数注意点，更多关于箭头函数的内容可以参考 [JavaScript 中的 this 指向](https://www.clloz.com/programming/front-end/js/2020/06/30/js-this/#i-5 "JavaScript 中的 this 指向")

1. 对象的方法：对象的方法如果使用箭头函数则箭头函数中的 `this` 指向的是对象所在环境的 `this`。如果是在全局环境中创建的对象，`this` 指向全局对象 `window`。如果实在 `node` 模块中则指向 `module.exports` 对象。
2. 原型上的方法逻辑也和上面一样，不过要注意一点，在 `class` 中定义方法如果使用箭头函数的话，这个函数会被 `babel` 转换到构造函数中。结合上面一点，不要在对象的方法或类方法中使用箭头函数。
3. 箭头函数的 `this` 并不是不会变的，只是它确定指向它所在环境的 `this`，这个环境可能会变化。
4. 箭头函数不能作为构造函数。
5. 箭头函数没有自己的 `this`，`arguments`，`super` 或 `new.target`。
6. 箭头函数不能作为生成器函数。
7. 由于箭头函数没有自己的 `this` 指针，通过 `bind()`，`call()` 或 `apply()` 方法调用一个函数时，只能传递参数（不能绑定 `this`），他们的第一个参数会被忽略。
8. 箭头函数没有 `prototype` 属性。
9. 箭头函数在参数和箭头之间不能换行。
10. 箭头函数中的箭头不是运算符，但箭头函数具有与常规函数不同的特殊运算符优先级解析规则。
11. 严格模式下函数中的 `this` 不能指向全局对象，如果箭头函数的 `this` 指向全局对象，会返回 `undefined`。

## 函数参数的逗号

`ES2017` 允许函数的最后一个参数有尾逗号（`trailing comma`）。这样主要是为了以后添加参数或者修改参数的顺序提供方便，和数组对象的逗号行为保持一致。

## Funtion.prototype.toString()

`ES2019` 对函数实例的 `toString()` 方法做出了修改。`toString()` 方法返回函数代码本身，以前会省略注释和空格。修改后的 `toString()` 方法，明确要求返回一模一样的原始代码。

```javascript
function /* foo comment */ foo() {}

foo.toString();
// "function /* foo comment */ foo () {}"
```

## catch 可省略参数

`JavaScript` 语言的 `try...catch` 结构，以前明确要求 `catch` 命令后面必须跟参数，接受 `try` 代码块抛出的错误对象。 很多时候，`catch` 代码块可能用不到这个参数。但是，为了保证语法正确，还是必须写。`ES2019` 做出了改变，允许 `catch` 语句省略参数。