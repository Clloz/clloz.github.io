---
title: '一道有趣的JS基础题'
publishDate: '2020-06-30 12:00:00'
description: ''
tags:
  - js
  - 奇技淫巧
language: '中文'
---

\[toc\]

## 前言

在查阅资料的时候，看到一道考差 `JavaScript` 基础知识的题目，其中还是考查到一些自己掌握的不好的知识。

## 题目

```javascript
function Foo() {
    getName = function () {
        console.log(1);
    };
    return this;
};
Foo.getName = function () {
    console.log(2);
};
Foo.prototype.getName = function () {
    console.log(3);
};
var getName = function () {
    console.log(4);
};
function getName() {
    console.log(5);
};

Foo.getName(); //2
getName(); //4
Foo().getName(); //1
getName(); //1
new Foo.getName(); //2
new Foo().getName(); //3
new new Foo().getName(); //3

```

需要注意的一点是这段代码因为牵扯到全局作用于下定义的对象是绑定在全局对象上的属性，所以这段代码使要运行在全局作用域，否则会报错。

## 第一问

第一问很简单，执行 `Foo` 函数上的 `getName` 属性上引用的匿名函数。每一个函数也同时是对象，也可以添加属性。很显然输出结果是 `2`。

## 第二问

第二问考查的是函数声明提升和变量声明提升之间的关系。最后的两个 `getName` 函数分别是函数表达式和函数声明，它们之间的覆盖关系是这一问的关键。

变量和函数声明的提升主要有这两点： 1. 变量和函数声明都会提升到函数顶部。 2. 初始化不会被提升。 3. 函数声明的提升优先级是高于变量的提升，且不会被变量的提升所覆盖，但是后面变量的初始化会覆盖函数声明提升。

所以最后两个同名的函数可以等同于下面的代码。

```javascript
function getName() {
    console.log(5);
}
var getName;

getName = function () {
    console.log(4);
}
```

可以看到最终变量的初始化覆盖了函数声明，所以这一问的结果就是 `4`。

## 第三问

这一问主要考察的是对 `this` 的理解，直接调用的函数在非严格模式下，其 `this` 是指向全局对象的（详细的 `this` 指向分析请看[JavaScript中的this指向](https://www.clloz.com/programming/front-end/js/2020/06/30/js-this/ "JavaScript中的this指向")。

`Foo` 函数做了两件事，首先将全局作用域下定义的 `getName` 变量重新赋值（一个新的匿名函数引用），然后返回全局对象。所以 `Foo().getName()` 相当于 `window.getName()`，此时的全局对象上的 `getName` 函数已经在 `Foo` 函数中被重写，所以最后的结果是 `1`。

## 第四问

第四问是直接执行全局作用域下的 `getName` 函数，因为第三问中重新给 `getName` 重新赋值了，所以结果跟第三问是相同的。

## 第五~七问

其实最后三问的核心问题是相同的，就是 `new` 运算符的优先级问题，我在[new操作符的解析和实现](https://www.clloz.com/programming/front-end/js/2020/06/29/new-operator/ "new操作符的解析和实现")中最后也提到了，带参数的 `new` 运算符的优先级是高于不带参数的 `new` 运算符的。比带参数 `new` 优先级高的运算符只有圆括号和成员访问的两种方式 `.` 和 `[]`。在带参数和不带参数 `new` 之间还有一个就是函数调用运算符 `()`。

所以第五问的 `new Foo.getName();` 可以理解为 `new (Foo.getName)()` ，把 `Foo.getName` 看做是一个整体，然后执行 `new` 运算符。最后的结果就是以 `Foo.getName` 作为构造函数实例化了一个对象，在实例化过程中会执行构造函数，所以返回 `2`。

第六问 `new Foo().getName()`中优先级最高的是 `.`，然后是 `new ()`，那么可以这么理解 `(new Foo()).getName()`，`new Foo()` 相当于以 `Foo` 为构造函数创建了一个新对象，对象的 `[[ptototype]]` 指向 `Foo.prototype`，新对象本身没有 `getName` 属性，但是 `Foo.prototype` 上有，所以相当于执行 `Foo.prototype.getName()`，结果为 `3`。

> 理论上 `.` 的优先级是高于带参数 `new` 的，这一问结果是先执行带参数 `new` 了。左边要么两种可能 `Foo().` 或者 `new Foo().`，单参数 `new` 的优先级是高于函数调用的，所以在执行 `.` 的时候是把左边看做一个整体的。

第七问 `new new Foo().getName()` 可以理解为 `new ((new Foo()).getName)()` 就相当于 `new Foo.prototype.getName()`，最终结果也是 `3`，生成一个以 `Foo.prototype.getName` 为构造函数的实例。

> 运算符的优先级可以查看 `mdn` 或者是我的文章[运算符优先级](https://www.clloz.com/programming/front-end/js/2019/04/05/operator-precedence/ "运算符优先级")

## 总结

以上就是我对这道题目的分析，可能有错漏之处，欢迎指正。这样的题目虽然在看上去没什么实际意义，有点刁钻，但是一些背后的知识点还是有用的，比如 `this` 指向，命名冲突的变量和函数的表现等等。