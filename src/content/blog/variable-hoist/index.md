---
title: 'var，let，const和变量提升（hoist）'
publishDate: '2020-07-01 12:00:00'
description: ''
tags:
  - js
  - 实用技巧
language: '中文'
---

\[toc\]

## 前言

在 `ES6` 以前，`JavaScript` 中是不存在块级作用域的，变量的作用域是靠执行环境来控制的，要么是在某个函数内要么是在全局作用于中。由于 `JS` 中的变量提升 `Hoist` 机制的存在，我们的定义的变量或者函数很可能发生命名冲突引发错误。所以在 `ES6` 中引入了 `let` 和 `const` 来应对这个问题，本文就讨论一下三个命令之间的区别，以及 `JS` 中的变量提升机制。

## block 块语句

上面我们已经说过，在 `ES5` 中，`JS` 的作用域只有两种可能，要么在某个函数中，要么在全局作用域。对于像 `if` 或者 `for` 这样的语句，虽然他们也有大括号，但因为他们不是函数，所以在这些语句中定义的变量一样可以在外部访问的。

在 `ES6` 中引入了块级作用域，用于组合零个或多个语句。块级作用域由一对大括号界定，可以添加 `label`。块级作用域的出现主要是为了配合 `let`，`const` 和 `class`。现在我们在块级作用域中的 `let`，`const` 和 `class` 声明将不能在块级作用域之外访问。并且块级作用域可以任意嵌套，每一对大括号都是一个独立的块级作用域。

> 注意，块级作用域只对 `let`，`const` 和 `class` 生效。`var` 声明的变量是没有块级作用域的，无论严格模式还是非严格模式。函数声明的行为则比较特别，我在下面介绍。

```javascript
{
    let m = 10;
    const n = 20;
}
console.log(m); //ReferenceError: m is not defined
console.log(n); //ReferenceError: n is not defined

var x = 1;
{
    var x = 2;
}
console.log(x); // 输出 2
```

没有块级作用域的情况下，结合变量提升机制，经常会产生一些奇怪的现象：

```javascript
var arr = []
for (var i = 0; i < 5; i++) {
    arr[i] = function () {
        return i;
    }
}
console.log(arr[0]()) //5
console.log(arr[1]()) //5
console.log(arr[2]()) //5
console.log(arr[3]()) //5
console.log(arr[4]()) //5


var tmp = new Date();
function f() {
  console.log(tmp); // 想打印外层的时间作用域
  if (false) {
    var tmp = 'hello world'; // 这里声明的作用域为整个函数
  }
}
f(); // undefined
```

`ES6` 引入了块级作用域，明确允许在块级作用域之中声明函数（`ES5` 中是不允许函数声明在块级作用域中）。`ES6` 规定，块级作用域之中，函数声明语句的行为类似于 `let`，在块级作用域之外不可引用。但是实际上各个浏览器并没有遵循标准进行实现，因为如果按标准进行实现的话对老代码的影响会非常大。具体规定参考标准：[https://tc39.es/ecma262/#sec-block-level-function-declarations-web-legacy-compatibility-semantics](https://tc39.es/ecma262/#sec-block-level-function-declarations-web-legacy-compatibility-semantics "https://tc39.es/ecma262/#sec-block-level-function-declarations-web-legacy-compatibility-semantics")

对于支持 `ES6` 的浏览器，块级作用域中的函数声明表现如下：

- 允许在块级作用域内声明函数。
- 在非严格模式中，函数声明类似于 `var`，即会提升到全局作用域或函数作用域的头部。同时，函数声明还会提升到所在的块级作用域的头部。
- 在严格模式中函数声明则只会提升到所在块级作用域的头部。

其他环境的 `JavaScript` 实现不用遵守这个规定，还是将块级作用域的函数声明当作 `let` 处理。可以看下面两个例子。

```javascript
//非严格模式
// 'use strict';
function test() {
    console.log(a); //undefined
    {
        console.log(a); //[Function: a]
        function a() {
            console.log('a');
        }
    }
    a(); //a
}
test();

//严格模式
'use strict';
function test() {
    // console.log(a); //ReferenceError: a is not defined
    {
        console.log(a); //[Function: a]
        function a() {
            console.log('a');
        }
    }
}
test();
```

考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。

有了块级作用域，原来一些为了防止全局环境被污染的立即执行函数 `IIFE` 不在必要。

```javascript
// IIFE 写法
(function () {
    var tmp = ...;
    ...
}());

// 块级作用域写法
{
    let tmp = ...;
    ...
}
```

> 补充：`block` 块语句有一个用法就是我们可以在函数内部用花括号把函数分成一个个独立的小结，我们在小结内部可以放心地用 `let` 和 `const` 定义变量常量和方法。这也是现在框架发展的一个功能。

块语句还可以使用 `label` 标记，在块语句内进行 `break`。

```javascript
test: {
    console.log(1);
    break test;
    console.log(2) //这一句不会执行
}
```

## var

`var` 语句会声明一个函数作用域或者全局作用域的变量，取决于声明所处的执行环境。当重复声明一个变量时，变量的值不会丢失。当赋值给未声明的变量, 则执行赋值后, 该变量会被隐式地创建为全局变量（它将成为全局对象的属性）。声明变量在任何代码执行前创建，而非声明变量只有在执行赋值操作的时候才会被创建。声明变量是它所在上下文环境的不可配置属性，非声明变量是可配置的（如非声明变量可以被删除）。在严格模式下，使用未声明变量时不合法的。

变量的声明有多种形式，特别是声明多个变量的时候。

```javascript
var a = 0, b = 0;

var a = "A";
var b = a;

// 等效于：
var a, b = a = "A";

var x = y, y = 'A';
console.log(x + y); // undefinedA

var x = 0;

function f(){
  var x = y = 1; // x在函数内部声明，y不是！
}
f();

console.log(x, y); // 0, 1
// x 是全局变量。
// y 是隐式声明的全局变量。
//JS在执行语句之前会先检查是否有未声明的变量，如果有则将其声明提升到全局作用域
```

需要注意的是，`var` 语句中的逗号不是逗号操作符，因为它不是存在于一个表达式中。尽管从实际效果来看，那个逗号同逗号运算符的表现很相似。但确切地说，它是 `var` 语句中的一个特殊符号，用于把多个变量声明结合成一个。

## let

`let` 和 `var` 的不同主要有以下几点。

## let 只在代码块内有效

```javascript
{
  let a = 10;
  var b = 1;
}
a // ReferenceError: a is not defined. b // 1
```

上面 `for` 循环的问题也可以用 `let` 解决

```javascript
var arr = []
for (let i = 0; i < 5; i++) {
    arr[i] = function () {
        return i;
    }
}
console.log(arr[0]()) //0
console.log(arr[1]()) //1
console.log(arr[2]()) //2
console.log(arr[3]()) //3
console.log(arr[4]()) //4
```

需要注意的是，`for` 语句的作用域是比较特殊的，小括号内是一个父级块作用域，而大括号内是一个子级块作用域。

```javascript
for (let i = 0; i < 3; i++) {
    let i = 'abc';
    console.log(i);
}
// abc
// abc
// abc
```

`for` 循环头部的 `let` 不仅将 `i` 绑定到了 `for` 循环的块中，事实上它将其重新绑定到了循环的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值。真实的执行过程如下：

```javascript
{
    let j;
    for (j=0; j<10; j++) {
        let i = j; // 每次迭代重新绑定
        console.log( i );
    }
}
```

## 没有变量提升

当使用 `var` 语句声明的变量会发生变量提升，也就是进入执行环境的时候，引擎最先做的就是扫描所有的 `var` 语句，把这些变量声明提到执行环境顶部并赋值为 `undefined`。这样即使我们在变量声明之前使用变量也不会报错，因为引擎已经把变量提升到执行环境顶部，但是初始化依然要到执行到对应语句才会执行。

由于这种行为是有点违反逻辑的，所以 `let` 就修复了这个问题，我们必须在 `let` 语句执行之后才能使用对应的变量，否则会报错。

```javascript
// var 的情况
console.log(foo); // 输出undefined var foo = 2;
// let 的情况
console.log(bar); // 报错ReferenceError let bar = 2;
```

## 暂时性死区

只要在一个块级作用域能用 `let` 语句声明了一个变量，那么在该块级作用域内，将只有一个该变量，外部的同名变量将无法被访问。可以理解为 `let` 语句创建的变量与所在的语句块绑定了。

```javascript
var tmp = 123;
if (true) {
  tmp = 'abc'; // Uncaught ReferenceError: Cannot access 'tmp' before initialization
  let tmp;
}
```

这个地方和上面的没有变量提升似乎是有冲突的，我们在块语句内的 `let` 语句声明 `tmp` 之前使用该变量，报错是 `无法在tmp初始化之前访问`，说明在声明语句之前就引擎就已经知道这个变量的存在了。我的理解是还是存在某种形式的变量提升，只不过这种提升并没有像 `var` 那样给变量一个个初始的 `undefined`，并且变量的使用在初始化之前是被拒绝的。也就是所谓的暂时性死区 `temporal dead zone，简称 TDZ`。

> 暂时性死区机制也意味着 `typeof` 不再是一个百分之百安全的操作，在 `let` 语句前对变量进行 `typeof` 操作一样会报错。

使用 `let` 声明变量时，只要变量在还没有 声明完成前使用，就会报错。

```javascript
var x = x; //undefined

let x = x; //Uncaught SyntaxError: Identifier 'x' has already been declared
```

另外还有一点就是函数参数似乎也有和 `let` 的相似的行为，我们不能再函数内部用 `let` 或 `const`给参数重新赋值，也不能像 `x = x` 这样给函数初始值。但是与 `let` 不同的是，用 `var` 可以给参数赋值。具体的过程可能需要查看标准。

```javascript
function foo(x = 5) {
  var x = 1;
  console.log(x) //1
}

function foo(x = 5) {
  let x = 1; // Uncaught SyntaxError: Identifier 'x' has already been declared
}

function a(x = x) {
} //Uncaught ReferenceError: Cannot access 'x' before initialization
```

## 不允许重复声明

`let` 不可以在同一个块级作用域内重复声明。

```javascript
// 报错
function () {
    let a = 10;
    var a = 1;
}

// 报错
function () {
    let a = 10;
    let a = 1; 
}
```

> 全局环境下用 `let` 或 `const` 声明的变量不会作为属性挂载在全局对象上。

## const

`const` 的大部分行为和 `let` 是保持一致的，不同的地方时，`const` 声明的是一个只读的常量，声明的时候必须进行初始化，且不能更改。

```javascript
const PI = 3.1415;
PI = 3; //Uncaught TypeError: Assignment to constant variable.

const foo;  // SyntaxError: Missing initializer in const declaration
```

但其实 `const` 并不是绝对安全的，因为当 `const` 声明的变量保存的是一个引用类型的时候，他保存的只是一个指向引用类型的指针，他能保证的是这个指针不变，但如果指针指向的的引用类型的内容发生变化，它是无法控制的。

```javascript
const foo = {};
// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123
// 将 foo 指向另一个对象，就会报错
foo = {}; // Uncaught SyntaxError: Identifier 'foo' has already been declared
```

## class

`class` 关键字也是有块作用域的，即使在非严格模式下。

```javascript
{
    class A {}
    let a = new A()
    console.log(a) //A {}
}
let a = new A() //ReferenceError: A is not defined
```

## 变量提升

从概念的字面意义上说，“变量提升”意味着变量和函数的声明会在物理层面移动到代码的最前面，但这么说并不准确。变量和函数声明在代码结构里的位置是不会动的，而是在编译阶段被放入内存中。实际上变量提升行为是 `JavaScript` 预编译机制中的一种行为，搞懂预编译过程中发生了什么，我们自然就知道变量提升是如何进行的了。

引擎在接收到 `JavaScript` 文件到执行中间大概分为三步：

1. 词法分析
2. 预编译
3. 解释执行

这里我们主要说一下第二步 `预编译`，全局环境的预编译和函数执行环境的预编译的略有不同的。全局预编译发生在页面加载完成时执行，而局部预编译发生在函数执行的前一刻。预编译阶段发生变量声明和函数声明的提升行为，但没有初始化行为（赋值），匿名函数不参与预编译，未声明的变量也不会参与提升（虽然未声明变量也是作为全局变量，但是未声明变量在预编译阶段是不会处理的，只有到解释执行阶段才会进行处理，严格模式下不可以使用未声明变量） 。只有在解释执行阶段才会进行变量初始化 。

```javascript
//未声明变量只有在解释执行阶段才会处理，没有提升行为
console.log(b)
var a = b = 110 //Uncaught ReferenceError: b is not defined

console.log(b)
b = 110 //Uncaught ReferenceError: b is not defined

b = 110
console.log(b) //110

//严格模式下不可以使用未声明变量
'use strict'
m = 10;
console.log(window.m)  //Uncaught ReferenceError: m is not defined

//未声明的对象属性也会在解释执行之前提前创建
var a = {n:1};
var b = a;
a.x = a = {n:2}; //a.x 在执行完 a = {n:2} 表达式之后依然能正确赋值是因为执行之前已经县创建了 {n:1} 对象的 x属性，这一行语句可以等价为 {n:1}.x = a = {n:2}
console.log(a.x); //undefined
console.log(b.x); //{n:2} 
```

对于全局环境，预编译大概分为如下几步：

1. 创建 `GO` 对象（ `Global Object` ）全局对象。
2. 找到用 `var` 语句进行的变量声明，将变量名作为 `GO` 属性名，值为 `undefined`
3. 查找函数声明，作为 `GO` 属性，属性名为函数名，值为函数体（如果函数名与上一步的变量名冲突，那么上一步值为 `undefined` 的变量提升将被函数声明的提升所覆盖）

> 需要注意的是只有函数声明被提升，函数表达式和变量是没有区别的，因为引擎是扫描 `var` 语句来寻找变量，他在预编译阶段只关心 `var` 语句声明的变量名，而不关心初始化的值。

函数的执行环境是当引擎解释执行到函数调用的地方才会创建，预编译也是在这时进行，预编译完成后才会解释执行函数。函数执行上下文的预编译整体步骤和全局环境是差不多的，不同的地方就是在多了形参和实参的加入。

1. 创建执行上下文的活动对象 `AO（Activation Object）`。
2. 找形参和 `var` 语句进行的变量声明，将变量和形参名作为 `AO` 属性名，值为 `undefined`
3. 将实参值和形参统一。
4. 在函数体里面找函数声明，值赋予函数体。

> 在同一个执行环境中出现的形参，变量声明，函数声明，只要出现重名，在预编译中我们可以完全看做同一个东西，即 `AO` 对象中的一个属性。我们需要注意的是他们发生的先后顺序。

下面来分析几个例子

## 例一

```javascript
function s () {
    m() //123
    var m = 10;
    function m() {
        console.log(123);
    }
    m() //m is not a function
}
s()
```

这个例子比较简单，在进入 `s` 函数的执行环境，创建活动对象后，先是 `var` 语句声明的 `m` 变量被提升（在 `AO` 中创建一个属性 `m`，然后是 `function m(){}` 被提升，由于和 `m` 对象重名，直接覆盖变量的声明（即修改 `AO.m` 的值为函数体），所以第一个 `m()` 就是执行的 `function m`。但是之后出现的 `m` 变量的初始化语句再次将 `AO.m` 修改为初始化语句中的 `10`，所以当再次想要执行 `m()` 时，此时 `m` 已经不是一个函数。

> 函数声明的提升也就是为什么我们能够在函数声明之前调用函数的原因。在代码结构上我们好像是在函数声明之前调用了函数，其实对于引擎来说，我们还是在函数声明之后进行的调用。而且函数声明在预编译阶段被提前后，我们在解释执行阶段就可以无视它了。

## 例二

```javascript
function fn(a){
     console.log(a); //function a() {}
    // 变量声明+变量赋值（只提升变量声明，不提升变量赋值）
    var a = 123;
    console.log(a); //123
    // 函数声明
    function a(){};
    console.log(a);//123
    // 函数表达式
    var b = function(){};
    console.log(b); //function () {}
    // 函数
     function d(){};
}
//调用函数
fn(1);
```

这个例子我们按照上面的局部环境预编译的四步来分析：

1. 创建执行上下文的活动对象 `AO（Activation Object）`。
    
    ```javascript
    AO{
    
    }
    ```
    
2. 找形参和 `var` 语句进行的变量声明，将变量和形参名作为 `AO` 属性名，值为 `undefined`
    
    ```javascript
    AO{
         a : undefined,
         b : undefined
    }
    ```
    
3. 将实参值和形参统一。
    
    ```javascript
    AO{
         a : 1,
         b : function(){...}
    }
    ```
    
4. 在函数体里面找函数声明，值赋予函数体。
    
    ```javascript
    AO{
         a : function a(){...},
         b : undefined,
         d : function d(){...}
    }
    ```
    

所以显然第一个 `console.log(a)` 输出的是 `AO` 中的 `a`，为 `function a() {}`，然后 `a` 被初始化语句修改为 `123` ，所以第二个 `console.log(a)` 的结果为 `123`。下面的函数声明在解释执行阶段可以忽略，所以第三个 `console.log(a)` 依然输出 `123`。接下来是对 `b` 进行初始化，值为一个匿名函数的引用，所以 `b` 的值输出该匿名函数。

## 例三

```javascript
var foo={n:1};

(function (foo) {
    console.log(foo.n); //1
    foo.n = 3;
    var foo = {n:2};
    console.log(foo.n); //2
})(foo);

console.log(foo.n); //3
```

这个例子跟上面两个不一样的地方时这一题不再是单纯的变量，而是引用类型。在立即执行函数内部，预编译后的活动对象就是 `{foo: {n:1}}`，所以第一个输出结果为 `1`。然后改 `foo.n` 为 `3`。这里需要注意的是引用类型并不是值传递，所以我们此时的 `foo` 和全局那个 `foo` 指向同一个对象，也就是全局 `foo` 指向的对象也被修改了，所以最后一行的 `foo.n` 就是输出修改后的值 `3`。回到函数内部，`var foo = {n:2}` 这一句直接将 `AO.foo` 指向了一个新的对象 `{n:2}`，这个新对象已经跟全局的那个 `foo` 指向的对象没有关系了，所以函数内部的最后一个输出结果为 `2`。

## 参考文章

1. 《ECMAScript6 入门》
2. [我花了两个月的时间才理解let](https://zhuanlan.zhihu.com/p/28140450 "我花了两个月的时间才理解let")
3. [JavaScript预编译](https://zhuanlan.zhihu.com/p/50236805 "JavaScript预编译")