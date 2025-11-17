---
title: 'YDNJS学习笔记-上卷-第一部分'
publishDate: '2020-07-16 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
  - 编程技巧
language: '中文'
heroImage: { 'src': './ydnjs.jpg', 'color': '#B4C6DA' }
---

## YDNJS 学习笔记

1. [YDNJS上卷第一部分](https://www.clloz.com/programming/front-end/js/2020/07/16/ydnjs-note/ 'YDNJS上卷第一部分')

## 前言

本文整理阅读 `YDNJS` 过程中的一些自己没有掌握的知识点，查漏补缺。

## 作用域

所谓 `作用域` 就是由引擎管理的一套严格的规则，管理引擎如何在当前作用于以及嵌套的子作用域中根据标识符名称进行变量的查找。（任何语言有作用域的机制，`JS` 中的作用域机制比较特别）

## LHS 和 RHS

`LHS` 就是 `left-hand-side expression`，`RHS` 就是 `right-hand-side expression`，在[ecma-262](https://www.ecma-international.org/ecma-262/11.0/index.html#sec-intro 'ecma-262')的第 `12` 章有对 `LHS` 的详细定义，所有 `LHS` 都可以作为 `RHS`，非 `LHS` 的合法表达式都是 `RHS`。标准主要讲的是哪些是合法的左值表达式。这里的 `left` 和 `right` 指的是在赋值操作符的左边和右边，但语句中并不一定要出现赋值符号，比如 `++` 和 `--`，他们在执行的过程中实际是有赋值行为的，这也就是为什么 `++a++` 报错的原因。所以区分左手还是右手关键是看有没有赋值行为发生（赋值行为不一定需要赋值操作符，可以有其他形式），`LHS` 可以理解为 `找到要赋值的目标`，而 `RHS` 可以理解为 `找到某个已经被赋值的结果`。

回到作用域中，在引擎查找变量的时候，如果查找的目的是对变量进行赋值，就是用 `LHS` 查询，如果目的是获取变量的值，就是用 `RHS` 查询。引擎在处理未声明的 `LHS` 和 `RHS` 是不同的，`RHS` 如果在作用域链中查询不到引擎会抛出 `ReferenceError` 异常。而 `LHS` 如果沿着作用域链查询到顶层（全局作用域）中都没有查询到的话，在非严格模式下就会在全局作用域中创建一个该名称变量，返回给引擎，如果是在严格模式下，会和 `RHS` 一样抛出一个 `ReferenceError` 异常。

如果在作用域链中查询到 `RHS` 对应变量，但是尝试对这个变量进行不合理的操作，比如一个非函数类型的值进行函数调用，或者引用 `null` 或 `undefined` 的属性，引擎会抛出 `TypeError`。`ReferenceError` 异常和作用域判别失败相关，而 `TypeError` 则表示作用域判别成功了，但是对结果的操作是非法或不合理的。

## 词法作用域

编译的三个阶段： 1. 分词/词法分析（`Tokenizing/Lexing`），将代码分解成对编程语言来说不可再分的此法单元（`token`）。此法单元的识别是有状态的成为词法分析，无状态则成为分词。 2. 解析/语法分析（`Parsing`），将词法单元流（数组）转换成一个由元素逐级嵌套所著称的代表了程序与法结构的树，成为抽象语法树（`Abstract Syntax Tree AST`)。 3. 代码生成：将 `AST` 装换为可执行代码（机器指令）的过程成为代码生成。

作用域共有两种主要的工作模型。第一种是最为普遍的，被大多数编程语言所采用的词法 作用域，我们会对这种作用域进行深入讨论。另外一种叫作动态作用域，仍有一些编程语言在使用(比如 `Bash` 脚本、`Perl` 中的一些模式等)。我们在 `JavaScript` 中使用的作用域模型也是比较普遍的词法作用域。

词法作用域顾名思义就是发生在上面编译三个阶段的第一阶段（由引擎的专门负责作用域的部分来管理），词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的。这种机制能够保证代码在词法分析阶段的作用域保持不变（大部分情况下）。词法作用域某种意义上是一种静态的作用域，而另一种对应的模式被称为 `动态作用域`。结论：无论函数在哪里被调用，也无论他如何被调用，他的词法作用域都只由函数被声明时所处的位置决定。作用域查找会在找到第一个匹配的标识符时停止。

---

关于引擎对代码的处理可以看一个简单的例子 `var a = 2;`,事实上编译器会进行如下处理。

1. 遇到 `var a`，编译器会询问作用域是否已经有一个该名称的变量存在于同一个作用域的 集合中。如果是，编译器会忽略该声明，继续进行编译;否则它会要求作用域在当前作 用域的集合中声明一个新的变量，并命名为 `a`。
2. 接下来编译器会为引擎生成运行时所需的代码，这些代码被用来处理 `a = 2` 这个赋值 操作。引擎运行时会首先询问作用域，在当前的作用域集合中是否存在一个叫作 `a` 的 变量。如果是，引擎就会使用这个变量；如果否，引擎会继续查找该变量。

## 改变词法作用域

有两个方法可以改变我们静态的词法作用域，`with` 和 `eval`。两个方法都不推荐使用。

`with` 的作用是扩展作用域链。一般情况下我们的词法作用域是静态的，由我们的语句在代码中的位置决定的。引擎根据嵌套的作用域链来寻找变量，但是当使用 `with` 语句以后，我们的作用域链的第一层不再是当前所处的执行上下文的变量对象，而是 `with` 语句的参数，而执行上下文的变量对象则变为第二层。也就是 `with` 语句中的变量搜索会现在参数所给的对象中进行，找不到才会进入我们一般语句的搜索模式。

```javascript
function a(obj) {
  with (obj) {
    a = 10
    var b = 20
  }
  console.log(b)
}
obj = {
  a: 1,
  b: 2
}
a(obj) //undefined 如果obj中没有b属性则此处输出20
console.log(obj) //{a:1,b:20}
```

因为 `with` 总是先在指定的对象中查找属性，如果我们在 `with` 语句中使用不是指定对象中的变量，查找起来就会变慢。还有如果我们在 `with` 语句中操作的变量不是指定对象的属性（比如上面代码中 `obj` 对象没有 `a` 属性），那么这个变量会被泄露到全局作用域上。如果是用 `var` 声明的变量在指定对象上不存在，这个变量相当于生命在 `with` 语句所处的执行上下文中。

> 严格模式不可以使用 `with`语句。

`eval` 函数是全局对象的一个方法，接收表达式或语句的字符串作为参数，把该参数当做 `js` 代码来执行，如果参数不是字符串，参数会被直接返回。

直接调用 `eval`，那么代码执行的执行环境就是当前环境（就好像我们把参数中的代码卸载当前位置一样），而如果间接调用（比如将 `eval` 引用赋值给其他变量让后通过赋值后的变量调用，或者类似 `(0, eval)('x + y');` 的表达式计算也算间接调用），那么代码执行的执行环境就是全局作用域。在严格模式中，`eval` 在运行时有自己的词法作用域，所以无法修改内部声明的作用域。

`eval` 强烈不建议使用主要有以下几个问题：

1. `eval` 的可读性非常差，而且也不容易调试。
2. 安全风险：`eval` 的参数是一个字符串，自然也可以拼接，如果我们的拼接字符串中有来自用户的输入（比如 `input`），那么就是一个非常危险的行为，并且 `eval` 会暴露自己的作用域。当然这种情况一般不太会发生
3. `eval` 的性能问题，`eval` 必须调用解释器来解释执行，而且现代 `JavaScript` 解释器会将 `javascript` 转换为机器代码，而在执行过程中才解析的 `eval` 中的代码很可能需要诉诸环境重新执行已经生成的机器码来应对，这必然造成性能的损失。引擎在编译阶段的各种优化方式也是依赖于词法的静态分析，预先确定变量和函数的位置，让代码在执行的时候能够快速找到对应的变量和函数，而 `eval` 函数中接受的代码使不确定的，所以很多优化是无法进行的。
4. 由于 `eval` 中的代码相当于执行 `eval` 的位置，所以其内部的声明会影响到当前环境的词法作用域作用域。

   ```javascript
   function foo(str, a) {
     eval(str) // 此处执行的代码声明了一个新的变量，改变了当前环境的词法作用域
     console.log(a, b)
   }
   var b = 2
   foo('var b = 3;', 1) // 1, 3
   ```

`Function` 函数也可以像 `eval` 一样把字符串当做代码执行，`Function` 可以使用 `new` 也可以不用，它们的效果是一样的，最后一个参数会被当做函数体，前面的参数是参数名，必须要要用 `javascript` 中合法的标识符字符串，所有被传递到构造函数中的参数，都将被视为将被创建的函数的参数，并且是相同的标示符名称和传递顺序，可以是 `Function('a', 'b', functionBody)` 的形式，也可以是 `Function('a, b', functionBody)` 的形式，`functionBody` 是一个含有包括函数定义的 JavaScript 语句的字符串。由 `Function` 构造器创建的函数不会创建当前环境的闭包，它们总是被创建于全局环境，因此在运行时它们只能访问全局变量和自己的局部变量，不能访问 `Function` 构造器创建时所在的作用域的变量。这一点与使用 eval 执行创建函数的代码不同。这种方式要比 `eval` 安全很多，但是依然不推荐使用，使用 `Function` 构造器生成的 `Function` 对象是在函数创建时解析的。这比你使用函数声明或者函数表达式并在你的代码中调用更为低效，因为使用后者创建的函数是跟其他代码一起解析的。

```javascript
function foo(str, a) {
  Function(str)() //3
  console.log(a, b)
}
var b = 2
foo('var b = 3;console.log(b)', 1) // 1, 2
```

## 作用域

最小暴露原则：在软件设计中，应该最小限度地暴露必 要内容，而将其他内容都“隐藏”起来，比如某个模块或对象的 `API` 设计。我认为有几点好处：

1. 代码按功能分隔开来，可读性更强，更容易维护。对于模块和对象的使用完全不用关心内部的细节，只要知道对应的接口即可。
2. 避免了变量名的冲突。特别是我们加载各种第三方库的时候很容易发生这样的情况。

> 区别函数声明和函数表达式的方法就是看函数声明的语句中 `function` 关键字是不是在语句的第一个词。如果是第一个词那么这就是一个函数声明，否则就是一个函数表达式（只要这是一个合法的语句）。另外就是函数表达式可以匿名，而函数声明则不可以。

## 匿名函数和 IIFE

函数表达式中可以使用匿名函数，但是匿名函数有几个缺点

1. 匿名函数在栈追踪中不会显示出有意义的函数名，调试困难
2. 匿名函数没有函数名，当函数需要调用自身的时候（比如递归中），就只能用已经不推荐使用的（`arguments.callee`）。另一个函数需要引用自身的例子，是在事件触发后事件监听器需要解绑自身。
3. 函数名可以增加代码可读性，一个好的函数名能够让函数的功能一目了然。

所以，一个好的习惯是我们始终给函数表达式命名。

立即执行函数的独立词法作用域有个小技巧就是 `undefined` 在局部环境被赋值的情况，我们可以设置立即执行函数的形参为 `undefined` 但是不传入任何参数，在函数体内 `undefined` 就不会受外部的影响。当然最好是不要随便给 `undefined` 赋值，使用 `undefined` 的地方尽量用 `void 0` 代替。

立即执行函数有一种特殊的写法，将需要执行的内容当做参数传递进去，叫做 `UMD(Universal Module Definition)`

```javascript
var a = 2
;(function IIFE(def) {
  def(window)
})(function def(global) {
  var a = 3
  console.log(a) // 3
  console.log(global.a) // 2
})
```

## try...catch 语句

`try...catch` 语句是用来监测一段语句的执行是否抛出异常。如果try代码块中的语句（或者 `try` 代码块中调用的方法）一旦抛出了异常（也可以是我们主动 `throw`），那么执行流程会立即进入 `catch` 代码块。如果 `try` 代码块没有抛出异常，`catch` 代码块就会被跳过。`finally` 代码块总会紧跟在 `try` 和 `catch` 代码块之后执行，但会在 `try` 和 `catch` 代码块之后的其他代码之前执行。

`try...catch` 语句至少有一个 `try` 块（由要尝试执行的语句组成），一个 `catch` 块或者一个 `finally` 块，`catch` 和 `finally` 块可以两者都有，所以一共有三种形式：

1. `try...catch`
2. `try...finally`
3. `try...catch...finally`

你可以嵌套一个或者更多的 `try` 语句。如果内部的 `try` 语句没有 `catch` 子句，那么将会进入包裹它的 `try` 语句的 `catch` 子句（可以理解为离自己最近的 `catch` 语句）。`try` 块中抛出的异常会作为 `catch` 块的参数，这个参数只在 `catch` 内能够访问。无论是否抛出异常 `finally` 子句都会执行。如果抛出异常，即使没有 `catch` 子句处理异常，`finally` 子句中的语句也会执行。最后要注意的就是 `try...catch` 语句的返回值（语句只有在函数内返回值才有意义），三种块都能用 `return` 返回，但是有一定的规则，大致如下：

1. 只要存在 `finally` 块的 `return`，无论是否抛出异常，也无论 `try` 和 `catch` 是否有 `return` ，最后的返回值都是 `finnaly` 块的 `return`。
2. 如果没有 `finally` 块不存在，那么如果抛出异常就输出 `catch` 块的 `return`。
3. 如果没有 `finally` 块不存在，如果没有抛出异常，那么输出 `try` 块的 `return`。

这里我们可以发现 `return` 的行为在 `try...catch` 里面是不同的。一般情况下 `return` 会中指当前函数的执行并返回值，但是在 `try...catch` 中并不会。

`try...catch` 语句中的 `catch` 块的参数是有独立的词法作用域的，也就是他无法在语句外访问，利用这一点我们可以在没有 `let` , `const` 的情况下（`ES6` 之前）实现块级作用域，因为 `try...catch` 语句在 `ES3` 就有了，并且一直都是这么工作的。比如 `Google` 的 `Traceur` （类似于 `babel`，将 `ES6` 代码转换成兼容 `ES6` 之前 的环境）就是这样实现块级作用域的。

```javascript
{
  try {
    throw undefined
  } catch (a) {
    a = 2
    console.log(a) //2
  }
}
console.log(a) //ReferenceError: a is not defined
```

> 大括号 `{}` 在 `ES6` 中可以作为块级作用域的（配合 `let`，`const` 和 `class`，函数声明也因为兼容性保持特殊行为），在 `ES6` 之前他只是一种组织代码的方式。

## let 和 const

`YDKJS` 建议为块作用域进行显式的创建，能够让变量的附属关系更清晰。因为 `{}` 本身就是分隔代码块的一种方式，一般不会改变语义。

```javascript
var foo = true
if (foo) {
  {
    // <-- 显式的块
    let bar = foo * 2
    bar = something(bar)
    console.log(bar)
  }
}
console.log(bar) // ReferenceError
```

`let` 在循环中的使用看似和 `var` 没太大区别，其实 `for` 循环头部的 `let` 不仅将 `i` 绑定到了 `for` 循环的块中，事实上它将其重新绑定到了循环 的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值。所以 `for` 循环小括号和大括号并不是同一个词法作用域，小括号在大括号的上层。下面两段代码分别问一般的 `for` 循环和实际的迭代过程模拟。

```javascript
//for 循环
for (let i = 0; i < 10; i++) {
  console.log(i)
}
console.log(i) // ReferenceError

//迭代过程模拟
{
  let j
  for (j = 0; j < 10; j++) {
    let i = j // 每个迭代重新绑定!
    console.log(i)
  }
}
```

> 函数作用域我个人认为也属于一个单独的块级作用域，所以他们在作用域的行为上是一致的，任何声明在 某个作用域内的变量，都将附属于这个作用域。

## 垃圾回收问题

这个问题也是我一直思考的问题，当一个函数 `a` 内部返回了一个函数 `b`，那么即使 `a` 执行完了其内部变量也无法释放，因为 `b` 的闭包覆盖 `a` 的环境。当然我想现在的 `JS` 引擎应该有一定的优化，但是这个问题应该是无法彻底解决的，因为我们无法确定这个被返回的 `b` 函数何时会执行，也不知道他内部是否要访问在 `a` 内部定义的变量或者方法。`YDNJS` 也给出了一个类似的例子，不过不是用的返回函数，而是用的 `DOM` 事件监听。

```javascript
function process(data) {
// 在这里做点有趣的事情
}

var someReallyBigData = { .. };

process( someReallyBigData );

var btn = document.getElementById( "my_button" );

btn.addEventListener( "click", function click(evt) {
    console.log("button clicked");
}, /*capturingPhase=*/false );
```

这个例子中事件监听函数的回调并不需要用到所在环境的其他变量或者方法，但是因为他的闭包覆盖了自己所在的环境，所以会导致那些已经 `不需要` 的变量或者方法不能被释放（取决于具体的引擎实现）。使用块作用域可以解决这个问题。

```javascript
function process(data) {
// 在这里做点有趣的事情
}

// 在这个块中定义的内容完事可以销毁!
{
    let someReallyBigData = { .. };
    process( someReallyBigData );
}

var btn = document.getElementById( "my_button" );

btn.addEventListener( "click", function click(evt){
     console.log("button clicked");
}, /*capturingPhase=*/false );
```

## 提升

引擎会在执行代码前对代码进行编译，这里除了编译器的工作，还有一个重要的工作就是作用域。这些工作都为了提升代码的执行效率，编译成机器码让计算机能快速执行，而作用域的存在可以让引擎在运行时对变量的查找更加快速和有效率。当然中间还有很多其他的优化，在引擎的发展过程中不断进步（比如 `JIT` 可以延迟编译甚至实施重编译）。而对变量和函数声明的处理也是其中的重要一环。

关于变量和函数的提升，我已经在另一篇[文章](https://www.clloz.com/programming/front-end/js/2020/07/01/variable-hoist/#let-2 '文章')里面详细写过了，这里就不在重复了。

由于 `YDNJS` 第一版（第二版英文版在 `github` 上已经可以看了，只有 `scope and closure` 一本）已经是 `2015` 版本了，所以有些内容已经不适合现在的 `JS`，比如 `提升` 这个章节小结前的最后一段代码，在现在的 `JS` 宿主环境执行就会报 `TypeError`，具体原因就是函数声明在块级作用域中的行为发生了改变，后面随便版本的更新可能还会改变，现在的行为也是为了兼容以前的老代码而做的妥协，因为函数声明是很早就有的概念，而块作用域则是 `ES6` 才出现的，如果把函数声明也全部变成块作用域的话，很多以前的代码将无法运行。函数声明在块级作用域的具体行为查看上面链接的文章中的 `let -> 没有变量提升` 这一小节。

> 虽然我们要清楚引擎是如何处理变量和函数的提升的，但是在实际编码中还是要避免重复的声明，保持好的编码习惯。

## 作用域闭包

我个人对闭包的理解就是一个函数和函数对它定义时的词法环境的引用一起够成一个闭包，所以每一个函数都有自己的闭包。理解闭包就是理解词法作用域，也就是理解 `JavaScript` 中的变量和方法的访问机制。

```javascript
function foo() {
  var a = 2
  function bar() {
    console.log(a)
  }
  return bar
}
var baz = foo()
baz() // 2 bar在定义时的词法作用域以外执行

function foo() {
  var a = 2
  function baz() {
    console.log(a) // 2
  }
  bar(baz)
}
function bar(fn) {
  fn() // baz在定义时的词法作用域以外执行
}
```

上面的例子中 `foo` 函数执行的结果被赋值给 `baz`（实际只是将 `foo` 内部函数 `bar` 的引用赋值给 `baz`，最后执行的也是 `bar`） 。在 `foo()` 执行后，通常会期待 `foo()` 的整个内部作用域都被销毁，因为我们知道引擎有垃圾回收器用来释放不再使用的内存空间。由于看上去 `foo()` 的内容不会再被使用，所以很 自然地会考虑对其进行回收。而事实上因为 `bar` 对 `foo()` 内部作用域的引用还存在，所以闭包会阻止 `foo()` 内部作用域的销毁，并且会一直存在，因为随时有可能再次执行 `bar()`。`bar` 函数和他对 `foo()` 的内部作用域的引用就是闭包（事实上整个作用域链都是可以访问的，只是对我们有意义的是已经执行完成的函数内部的作用域）。这个函数在定义时的词法作用域以外的地方被调用。闭包使得函数可以继续访问定义时的词法作用域。

事件绑定很多时候也是闭包：

```javascript
function setupBot(name, selector) {
  $(selector).click(function activator() {
    console.log('Activating: ' + name)
  })
}
setupBot('Closure Bot 1', '#bot_1')
setupBot('Closure Bot 2', '#bot_2')
//setupBot函数执行完后为 #bot_1 和 #bot_2绑定了 click 事件，但是当事件触发时，我们依然可以访问name和selector
```

> 无论通过何种手段将内部函数传递到所在的词法作用域以外，它都会持有对原始定义作用 域的引用，无论在何处执行这个函数都会使用闭包。

闭包在 `JavaScript` 中最重要的应用就是当我们把函数作为值到处传递的时候，这些函数在定义时的词法作用域之外执行，保持对定义时的词法作用域的引用，让我们还能访问到内部的变量或者方法。在定时器、事件监听器、 `Ajax` 请求、跨窗口通信、`Web Workers` 或者任何其他的异步(或者同步)任务中，只要使 用了回调函数，实际上就是在使用闭包!

> `YDNJS` 中的看法是函数在定义的词法作用域以外执行才算闭包，但我觉得每个函数都是闭包，都有对自己所在词法作用域的引用，只不过让函数在定义的词法环境以外执行时符合我们需求的一种重要应用。

## 模块

书中介绍了两种模块化方式，一种是利用立即执行函数进行包装，通过返回的函数闭包来访问立即执行函数内部的作用域，返回的函数就作为模块的 `API`。而模块的管理则一般利用模块加载器，书中给出了一个简单的实现。

```javascript
var MyModules = (function Manager() {
    var modules = {};
    function define(name, deps, impl) {
        for (var i=0; i<deps.length; i++) {
            deps[i] = modules[deps[i]];
        }
        modules[name] = impl.apply( impl, deps );
        console.log(modules)
    }

    function get(name) {
        return modules[name];
    }
    return {
        define: define,
        get: get
    };
})();

MyModules.define( "bar", [], function() {
    function hello(who) {
        return "Let me introduce: " + who;
    }
    return {
        hello: hello
    };
});
MyModules.define( "foo", ["bar"], function(bar) {
    var hungry = "hippo";
    function awesome() {
        console.log( bar.hello( hungry ).toUpperCase() );
    }
    return {
        awesome: awesome
    };
});

var bar = MyModules.get( "bar" );  //{ bar: { hello: [Function: hello] } }
var foo = MyModules.get( "foo" );  //{bar: { hello: [Function: hello] },foo: { awesome: [Function: awesome] }}
console.log(bar.hello( "hippo" ));  //Let me introduce: hippo
foo.awesome(); //LET ME INTRODUCE: HIPPO
console.log(bar.hello()) Let me introduce: undefined
```

第二种则是 `ES6` 中的 `import` 和 `export`。`ES6` 为模块添加了语法支持，文件被当做单独的模块来处理，每个模块都可以导入其他模块或特定的 `API` 成员，同样也可以导出自己的 `API` 成员。`ES6` 的模块没有“行内”格式，必须被定义在独立的文件中(一个文件一个模块)。浏览器或引擎有一个默认的模块加载器，可以在导入模块时同步地加载模块文件。与基于函数的模块不同的是，`ES6` 的模块是静态的，`API` 不能再运行时改变，所以可以在编译时就检查模块是否存在，不存在则报错，模块文件中的内容会被当作好像包含在作用域闭包中一样来处理，就和前面介绍的函数闭包模块一样。。而基于函数的模块则是在运行时才能知道 `API`，并且我们可以随时改变（事实上我觉得基于函数的模块只是利用闭包的一种代码包装，本质还是函数）

> 关于模块化的内容书中并没有介绍太多，我认为模块化的内容还是非常重要的，需要单独拿出来学习一下。

## 附录

## 动态作用域

`javascript` 和大多数语言一样，作用域为词法作用域。词法作用域就是根据定义的位置来寻找变量和方法，可以理解为静态的，在编译的时候就已经确定变量的位置了，之后运行时引擎也根据这套规则寻找变量。而动态作用域则是根据调用的位置来确定变量。我们可以用下面的代码说明。

```javascript
//静态
function foo() {
  console.log(a) // 2
}
function bar() {
  var a = 3
  foo()
}
var a = 2
bar()

//动态
function foo() {
  console.log(a) // 3
}
function bar() {
  var a = 3
  foo()
}
var a = 2
bar()
```

> 简单一点说就是词法作用域根据定义的位置寻找变量（在写代码或者说定义时确定的），而动态作用域则是根据调用的位置来寻找变量（在运行时确定的）。虽然 `JavaScript` 中并没有动态作用域，但是 `this` 关键字的机制却和动态作用域很类似。
