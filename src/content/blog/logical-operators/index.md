---
title: 'JavaScript逻辑运算符'
publishDate: '2020-09-03 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
heroImage: {"src":"./javascript-logo.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

关于 `JavaScript` 中的逻辑运算符，我们经常使用却可能不知道它的一些机制和用法。

## 机制

首先我们需要知道几种逻辑运算符的优先级是不同的（关于完整的运算符优先级，看[运算符优先级](https://www.clloz.com/programming/front-end/js/2019/04/05/operator-precedence/ "运算符优先级")），**逻辑非>逻辑与>逻辑或>条件运算符（三目运算符）**。运算顺序条件运算符是从右向左，而逻辑与和逻辑或都是从左向右。

```javascript
//表达式的优先级导致结果不同
false &&  true || true      // 结果为 true
false && (true || true)     // 结果为 false
```

逻辑运算表达式返回的是字表达式的值，而不是一个 `Boolean`，只不过很多时候我们使用逻辑表达式的地方帮我们强制转换了，比如 `if` 语句等。

逻辑运算符通常用于布尔型（逻辑）值。这种情况下，它们返回一个布尔值。然而， `&&` 和 `||` 运算符会返回一个指定操作数的值，因此，这些运算符也用于非布尔值。这时，它们也就会返回一个非布尔型值。

逻辑与 `expression1 && expression2` 的机制是，如果 `expression1` 能够转换为 `true` 那么返回 `expression2` ，否则返回 `expression1`。

逻辑或 `expression1 || expression2` 的机制是，如果 `expression1` 能够转化为 `true` 那么返回 `expression1`，否则返回 `expression2`。

逻辑非 `!expression` ，若 `expression` 能够转化为 `true` 则返回 `false`，否则返回 `true`。

> `expression` 可能是任何一种类型, 不一定是布尔值。

会被转化为 `false` 的表达式有：

- `null`
- `NaN`
- `0`
- 空字符串（`""` or `''` or ` `` `）
- `undefined`

> 需要特别注意的是 `undefined`，有些表达式返回的是 `undefined` ，比如没有设置 `return` 的函数执行的返回值就是 `undefined`。

尽管 `&&` 和 `||` 运算符能够使用非布尔值的操作数, 但它们依然可以被看作是布尔操作符，因为它们的返回值总是能够被转换为布尔值。如果要显式地将它们的返回值（或者表达式）转换为布尔值，请使用双重非运算符（即`!!`）或者 `Boolean` 构造函数。

> 双重非运算符 `!!` 可以将任意值强制转换为布尔值，在需要条件判断的地方经常使用。

## 短路计算

逻辑运算的机制还存在短路计算：

- `(some falsy expression1) && (expression2)` 短路计算的结果为假。
- `(some truthy expression1) || (expression2)` 短路计算的结果为真。

短路意味着上述表达式中的 `expression2` 部分不会被执行，因此 `expression2` 的任何副作用都不会生效（举个例子，如果 `expression` 是一次函数调用，这次调用就不会发生）。造成这种现象的原因是，整个表达式的值在第一个操作数被计算后已经确定了。

## 用法

利用 `javascript` 中逻辑运算符支持任意类型和短路计算的特性我们可以将逻辑运算符运用到一些特殊的地方。

## 逻辑与

逻辑与可以用来获得第一个假值，比如 `expr1 && expr2 && expr3`，当其中存在假值的时候会被返回。也可以类推至前面的表达式都为真的时候执行最后一个表达式来简化判断逻辑的代码，比如 `x > 0 && a()`，这可以代替 `if` 语句。

## 逻辑或

逻辑或可以用来设置默认值，比如你的函数需要用户输入一个参数，如果用户没有输入则给定一个默认值。`this.a = param || {}`。