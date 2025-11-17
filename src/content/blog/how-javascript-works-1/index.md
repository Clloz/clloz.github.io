---
title: '【翻译】JavaScript如何工作一：引擎，运行时和调用栈概述'
publishDate: '2019-05-12 12:00:00'
description: ''
tags:
  - js
  - 技术文章翻译
  - 编程技巧
language: '中文'
---

## 前言

这是一篇翻译，在查 `setInterval` 的浏览器如何处理的过程中看到这一系列文章，感觉对自己理解 `JS引擎` 以及运行时 `runtime` 的工作细节有很大的帮助，决定翻译一下这一系列文章。英文水平非常烂，只能作为自己的一项练习了，虽然之前也写了浏览器渲染过程和 `JS` 引擎浅析，但是对很多细节理解的还不够，翻译这个系列文章应该能让我的理解更透彻和全面。

> 原文地址[How JavaScript works: an overview of the engine, the runtime, and the call stack](https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf 'How JavaScript works: an overview of the engine, the runtime, and the call stack')

随着 `JavaScript` 变得越来越流行，很多团队开始把它运用到不同的层级的技术栈中，前端，后端，混合式应用，嵌入式系统等。

这篇文章是系列中的第一篇，旨在深度挖掘 `JavaScript` 和它的工作原理：我们认为通过了解 `JavaScript` 的构建模块和它们如何协同工作能够帮助你写出更好的代码和应用。我们也将分享一些我们在开发 `SessionStack` 中的经验法则，为了保持竞争力而开发的健壮的高性能的轻量 `JavaScript` 应用。

如 [Githut Stats](http://githut.info/) 所示，`JavaScript` 拥有 `GitHub` 上最高的活跃仓库数和最高的总提交数，在其他方面也没有落后太多。

![githut](./images/js-githut.png 'githut')

越来越多的项目开始依赖 `JavaScript`，也就意味着想要开发出惊艳的软件就必须深入理解这门语言和 `JavaScript` 生态圈提供的一切。

事实证明，虽然有大量的开发者每天用 `JavaScript` 作为工作但是并不理解内部的工作原理。

## 概述

几乎所有人都听说过 `V8` 引擎的概念，并且大部分人都知道 `JavaScript` 是单线程的以及它会用到一个回调队列。

在这篇文章中，我们将详细介绍这些概念并且说明 `JavaScript` 内部的运行机制。通过了解这些细节，你讲能够正确地运用提供的 `API` 写出更好的非阻塞的应用。

如果你是一个 `JavaScript` 新手，这篇文章能够帮助你理解 `JavaScript` 相比于其他编程语言的“奇怪”行为。

如果你是个有经验的 `JavaScript` 程序员，相信我，这篇文章会让你对于 `JavaScript` 运行时 `runtime` 如何工作有全新的理解。

## JavaScript 引擎

最流行的 `JavaScript` 引擎是谷歌的 `V8` 引擎，他被用在 `Chrome` 和 `Node.js` 中，他的样子如下图所示：

![js-engine](./images/js-engine.png 'js-engine')

这个引擎由两个主要部分组成： 1. 内存堆：用来分配内存。 2. 调用栈：代码执行栈帧所在位置。

## 运行时 runtime

浏览器提供了许多 `API` 供开发者使用（比如 `setTimeout` ），这些 `API` 并不是由引擎所提供。那么这些 `API` 到底是哪来的呢？想要说清楚这个有点复杂。

![js-engine-detail](./images/js-engine-detail.png 'js-engine-detail')

除了引擎我们还有很多其他东西。浏览器提供了很多叫做 `Web APIs` 的内容，比如 `DOM`，`AJAX`，`setTimeout` 等。

之后，我们还有非常受欢迎的事件循环（`Event Loop`）和回调队列 （`Callback Queue`）。

## 调用栈 The Callback Queue

`JavaScript` 是一个单线程语言，这意味着它只有一个调用栈，同一时间只能做一件事。

调用栈是一种数据结构，它记录了我们在程序中的实际位置。当执行流进入一个函数，我们将这个函数压入调用栈顶，当这个函数执行完毕返回，我们将它从栈顶弹出。这就是调用栈所做的事情。

我们来看一个例子。看看下面这段代码：

```javascript
function multiply(x, y) {
  return x * y
}
function printSquare(x) {
  var s = multiply(x, x)
  console.log(s)
}
printSquare(5)
```

当引擎开始执行这段代码的时候，调用栈是空的，然后执行步骤如下图所示：

![call-stack-step](./images/call-stack-step.png 'call-stack-step')

每一进栈的函数都称为一个栈帧（ `Stack Frame` ）。

当一个异常被抛出的时候，栈轨迹（ `Stack Traces` ）被创建，从本质上来说这是调用栈的状态。看下面这段代码：

```javascript
function foo() {
  throw new Error('SessionStack will help you resolve crashes :)')
}
function bar() {
  foo()
}
function start() {
  bar()
}
start()
```

如果这段代码在 `Chrome` 中运行（假定代码在一个叫做 `foo.js` 的文件中），将产生下面的栈轨迹。

![stack-traces](./images/stack-traces.png 'stack-traces')

`Blowing the stack` ——当你到达栈容量的上限就会发生。这非常容易发生，特别是当你使用递归而没有详细测试你的代码。看看下面这个例子：

```javascript
function foo() {
  foo()
}
foo()
```

当引擎开始执行这段代码的时候，它先调用函数 `foo` ，但是这个函数会无限的调用它自身，所以每执行一次，同样的函数就会被添加到调用栈，一直添加到触发 `Blowing the stack`。具体情况大概如下图：

![over-stack](./images/over-stack.png 'over-stack')

但是，当调用栈中的函数调用的数量超过调用栈的容量的时候，浏览器会抛出一个错误，像下图这样：

![blow-stack](./images/blow-stack.png 'blow-stack')

在单个线程下运行代码是一件很容易的事情，因为你不需要处理多线程环境下的复杂情况，比如死锁。

但是在单线程下运行也相当有局限，因为 `JavaScript` 只有一个调用栈，如果有一个任务执行的非常慢该怎么办？

## 并行和事件队列

如果在调用栈中有函数调用需要花费大量的时间会发生什么呢？举个例子，当你想用 `JavaScript` 在浏览器上实现复杂的图片变形。

你可能会问：这算是一个问题码？真正的问题是当调用栈的函数在执行的时候，浏览器什么也做不了——它被锁死了。这意味着浏览器无法渲染，也无法执行其他代码，它卡住了。如果你想让你的应用拥有流畅的 `UI` 这将是一个大问题。

而且这不是唯一的问题。如果你的浏览器开始处理非常多的调用栈任务，浏览器将开始陷入长时间的未响应状态。大部分的浏览器会采取抛出错误的解决办法，询问你是否要终止这个页面。这将会毁了你产品的用户体验。

那么我们如何执行复杂的代码但是不会令 `UI` 卡死，浏览器未响应呢？解决办法是异步回调。

关于异步回调的内容会在下一片文章详细介绍。
