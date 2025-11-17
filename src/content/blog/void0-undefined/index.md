---
title: 'void(0)和undefined'
publishDate: '2019-06-03 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
---

## 前言

我们经常看到在一些框架中用 `void(0)` 来代替 `undefined`，这篇文章来说一说这种做法的原因。

## 关键字和保留字

每种语言都有自己的关键字和保留字（ `reserved words` ），`JavaScript` 自然也不例外。在[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Reserved_words 'MDN')可以查看保留字。值得注意的是我们经常使用的 `window`， `undefined`，都不是标准中的保留字，也就是说 `window`，`undefined` 都可以作为变量名或者属性名。虽然在浏览器实现中，我们在全局作用域中无法声明或改变这些变量，但是在函数作用域中我们可以使用 `window` 或者 `undefined` 作为变量名或者属性名。

```javascript
function a() {
  var window = 'aaa'
  var undefined = 'bbb'
  console.log(window, undefined)
}
a() //aaa bbb

function b() {
  var window = {
    undefined: 'ccc'
  }
  console.log(window.undefined)
}
b() //ccc
```

从代码中可以看出我们在函数内可以重新声明并赋值，和我们声明的普通的标识符并没有什么区别，所以使用 `undefined` 或者 `window.undefined` 都是不可靠的。

> 在 `nodejs` 环境中，`global` 同样也不是保留字，可以赋值。

## void 运算符

[ECMA-262](https://www.ecma-international.org/publications/standards/Ecma-262.htm 'ECMA-262')规范中对 `void` 运算符的定义

> The void Operator The production UnaryExpression : void UnaryExpression is evaluated as follows: - Let expr be the result of evaluating UnaryExpression. - Call GetValue(expr). - Return undefined. NOTE: GetValue must be called even though its value is not used because it may have observable side-effects.

`void` 运算符的执行分为三步，先执行运算符后的表达式，对表达式的返回值执行 `GetValue`，返回 `undefined`。

`GetValue` 是规范内部的 `Reference Specification Type` 的一个方法，它将返回 `Reference` 的具体值。这个 `Reference` 和 `js` 中的引用不是同一个东西，这里的 `Reference` 是标准中的一个抽象类型，由三个部分组成：`base`， `reference name`，`stict mode flag`。比如 `a.b`，`a` 对应 `base`， `b` 对应 `reference name`。具体细节参考规范

由于 `void` 的底层实现是返回 `undefined`，所以用 `void expr` 来表示 `undefined` 是可靠的，通常我们用 `void 0` 或者 `void (0)` 来表示 `undefined`。

`void` 和其他运算符一样，可以让 `JavaScript` 引擎把一个 `function` 关键字识别成函数表达式而不是函数声明（语句）。
