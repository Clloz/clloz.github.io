---
title: '事件循环 Event Loop'
publishDate: '2020-11-01 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

本文分析 `JavaScript` 的事件循环 `Event Loop` 的执行机制和细节。`Event Loop` 标准文档见 [Event Loop - whatwg](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops 'HTML5')

## 基础概念

为了协调事件、用户交互、脚本、`UI` 渲染、网络请求，用户代理必须使用 `Event Loop`。

`Event Loop` 是 `JS` 宿主环境的一个设施（浏览器和 `nodejs` 都实现了），它不是 `JS` 引擎的一部分。`JS` 引擎负责 `JS` 代码的执行，主要包括了一个内存堆和一个调用栈。而 `Event Loop` 的主要作用就是对异步任务何时进入引擎执行进行管理。

先了解三种数据结构

1. 栈( `stack` )：栈在计算机科学中是限定仅在表尾进行插入或删除操作的线性表。 栈是一种数据结构，它按照后进先出的原则存储数据，先进入的数据被压入栈底，最后的数据在栈顶，需要读数据的时候从栈顶开始弹出数据。栈是只能在某一端插入和删除的特殊线性表。
2. 堆( `heap` )：堆是一种数据结构，是利用完全二叉树维护的一组数据，堆分为两种，一种为最大堆，一种为最小堆，将根节点最大的堆叫做最大堆或大根堆，根节点最小的堆叫做最小堆或小根堆。堆是线性数据结构，相当于一维数组，有唯一后继。
3. 队列( `queue` )：特殊之处在于它只允许在表的前端（ `front` ）进行删除操作，而在表的后端（ `rear` ）进行插入操作，和栈一样，队列是一种操作受限制的线性表。进行插入操作的端称为队尾，进行删除操作的端称为队头。 队列中没有元素时，称为空队列。队列的数据元素又称为队列元素。在队列中插入一个队列元素称为入队，从队列中删除一个队列元素称为出队。因为队列只允许在一端插入，在另一端删除，所以只有最早进入队列的元素才能最先从队列中删除，故队列又称为先进先出（ `FIFO—first in first out` ）。

`javaScript` 是单线程，也就是说只有一个主线程，主线程有一个栈，每一个函数执行的时候，都会生成新的`execution context` （执行上下文），执行上下文会包含一些当前函数的参数、局部变量之类的信息，它会被推入栈中， `running execution context`（正在执行的上下文）始终处于栈的顶部。当函数执行完后，它的执行上下文会从栈弹出。把 `JS` 执行设施再细分有三个部分（`1` 和 `2` 为 `JS` 引擎中的）：

1. `Stack` ：主线程的函数执行都压在这个栈中。
2. `Heap` ：存放对象，数据。没有引用的对象会被垃圾回收。
3. `Task Queue` ：执行栈为空的时候从任务队列中取一个任务执行，再次为空时再次到任务队列中取任务执行，如此循环，所以称为 `Event Loop`。

![js-engine](https://img.clloz.com/blog/writing/js-engine.svg 'js-engine')

## 理解事件循环

理解事件循环机制首先要理解浏览器的组成，可以参考我的另一片文章：[浏览器渲染过程](https://www.clloz.com/programming/front-end/js/2019/04/25/how-browser-work-2/ '浏览器渲染过程')，这里我就做一个简短的说明。

以 `Chorme` 为例，每一个页面（一个 `tab`）都是一个独立的进程，我们的浏览器内核也就是渲染引擎就在其中工作。渲染引擎包括了如下一些部分：`GUI` 渲染线程，`JavaScript` 引擎，事件触发线程，定时器触发线程，异步请求线程等。我们的 `JavaScript` 引擎是工作在渲染引擎之下的。事件循环就可以理解为渲染引擎和 `JavaScript` 引擎之间为了协调工作而创造的一种模式。

首先在浏览器中，我们的 `JavaScript` 脚本最终运行的目标都是改变页面，无论是改变页面的效果还是改变页面上的数据，所有的改动（不管是复杂的还是简单的）都会直接或间接的为页面上的某个或某些元素服务的。`JavaScript` 和渲染引擎的交互主要是依靠浏览器提供的一系列 `Web APIs`（可以参考 [Web API 接口参考 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API 'Web API - MDN')），而渲染引擎和 `JavaScript` 引擎的交互就是依靠事件循环。

用实际的例子来说明，我们打开一个 `tab`，输入一个网址回车。网络进程像服务器发起请求。获得请求的内容之后开一个新的渲染进程，渲染引擎开始工作。`GUI` 渲染线程进行 `HTML`，`CSS` 的解析，解析到 `<script>` 交给 `JavaScript` 引擎处理。`JavaScript` 创建全局环境，全局环境压入执行栈开始执行代码，当遇到 `setTimeout` 等定时器代码，交给定时器触发线程，遇到 `ajax` 请求交给异步请求线程，遇到事件绑定交给事件触发线程。按照这个逻辑，一直执行下去。我们可以看到，我们写的 `JavaScript` 代码利用浏览器提供的 `Web API` 把很多异步任务交给渲染引擎的其他线程进行处理。

当这些异步任务完成之后，渲染引擎的其他线程需要通知 `JavaScript` 引擎执行回调函数。异步任务的完成事件是不确定的，可能同时有很多任务完成了，而 `JavaScript` 引擎是单线程的，所以必然要有一个机制让引擎能够依次执行异步任务的回调函数。这就是要有任务队列的原因。

所以事件循环本质是渲染引擎和 `JavaScript` 引擎为了处理异步任务而设计的一种有效率的模式。

可以借助下图理解：

![event-loop](./images/event-loop.png 'event-loop')

## 规范

[Event Loop - whatwg](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops 'HTML5') 规范对 `Event Loop` 进行了严格的定义。我们从规范来解读 `Event Loop` 的细节。这里我们直接把最关键的几步列出来（翻译来自[深入探究 eventloop 与浏览器渲染的时序问题](https://juejin.im/entry/6844903487700992007 '深入探究 eventloop 与浏览器渲染的时序问题')）：

- `1-5` 条：从 `task` 队列（一个或多个）中选出最老的一个 `task`，执行它。
- 第 `6` 条：执行 `microtask` 检查点。简单说，会执行 `microtask` 队列中的所有 `microtask`，直到队列为空。如果 `microtask` 中又添加了新的 `microtask`，直接放进本队列末尾。
- `7`： 执行 `UI render` 操作：
  - `7.1-7.4`：判断 `document` 在此时间点渲染是否会『获益』。浏览器只需保证 `60Hz` 的刷新率即可（在机器负荷重时还会降低刷新率），若 `eventloop` 频率过高，即使渲染了浏览器也无法及时展示。所以并不是每轮 `eventloop` 都会执行 `UI Render`。
  - `7.5-7.9`： 执行各种渲染所需工作，如 触发 `resize、scroll` 事件、建立媒体查询、运行 `CSS` 动画等等
  - `7.10`： 执行 `animation frame callbacks`
  - `7.11`： 执行 `IntersectionObserver callback`
  - `7.12`： 渲染 `UI`

## 任务队列

从标准中我们看出，一共有两种任务 `task` 和 `microtask`，`task` 很多时候也被称为 `macrotask`。关于 `task` 标准中有详细 [定义](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task '定义')。

> An event loop has one or more task queues. For example, a user agent could have one task queue for mouse and key events (to which the user interaction task source is associated), and another to which all other task sources are associated. Then, using the freedom granted in the initial step of the event loop processing model, it could give keyboard and mouse events preference over other tasks three-quarters of the time, keeping the interface responsive but not starving other task queues. Note that in this setup, the processing model still enforces that the user agent would never process events from any one task source out of order.

一个 `eventloop` 有一或多个 `task` 队列。每个 `task` 由一个确定的 `task` 源提供。从不同 `task` 源而来的 `task` 可能会放到不同的 `task` 队列中。例如，浏览器可能单独为鼠标键盘事件维护一个 `task` 队列，所有其他 `task` 都放到另一个 `task` 队列。通过区分 `task` 队列的优先级，使高优先级的 `task` 优先执行，保证更好的交互体验。

`task` 源包括（ [generic-task-sources](https://html.spec.whatwg.org/multipage/webappapis.html#generic-task-sources 'generic-task-sources')）：

- `DOM` 操作任务源：如元素以非阻塞方式插入文档
- 用户交互任务源：如鼠标键盘事件。用户输入事件（如 `click`） 必须使用 `task` 队列
- 网络任务源：如 `XHR` 回调
- `history` 回溯任务源：使用 `history.back()` 或者类似 `API`
- `setTimeout`、`setInterval`、`IndexDB`

所以常见的 `task` 任务包括：

- `script` 代码
- 事件回调
- `XHR` 回调
- `IndexDB` 数据库操作等 `I/O`
- `setTimeout` / `setInterval`
- `history.back`
- `postMessage`

下面讲一讲微任务 `microtask`，每一个 `eventloop` 都有一个 `microtask` 队列。`microtask` 会排在 `microtask` 队列而非 `task` 队列中。一般微任务包括：

- `Promise.then`，`Promise.catch`，`Promise.finally`
- `MutationObserver`
- `process.nextTick`

目前浏览器暴露了一个 [WindowOrWorkerGlobalScope.queueMicrotask()](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask 'WindowOrWorkerGlobalScope.queueMicrotask()') 让我们能够用微任务执行我们的代码。

### 为什么有宏任务和微任务

其实网上关于宏任务微任务的讲解非常多，基本都是讲一讲哪些属于宏任务，哪些属于微任务，然后执行顺序。但是几乎没有人说为什么要设计成这两种模式。

其实如果我们仔细想一想，为什么需要宏任务和微任务？任何设计都是有原因的，浏览器内核发展了这么多年，有这种设计必然就有需求，比如我上面讲的事件循环解决的问题，那么微任务也必然有其解决的问题。

我这里先说我的结论，宏任务和微任务的区分主要还是为了给任务一个优先级的区分，让一些有优先级要求或者连续执行需求的任务优先执行。

我们来看一看 `MDN` 上对于宏任务和微任务的说明：

- 一个微任务（`microtask`）就是一个简短的函数，当创建该函数的函数执行之后，并且只有当 `Javascript` 调用栈为空，而控制权尚未返还给被 `user agent` 用来驱动脚本执行环境的事件循环之前，该微任务才会被执行。 事件循环既可能是浏览器的主事件循环也可能是被一个 `web worker` 所驱动的事件循环。这使得给定的函数在没有其他脚本执行干扰的情况下运行，也保证了微任务能在用户代理有机会对该微任务带来的行为做出反应之前运行。`JavaScript` 中的 `promises` 和 `Mutation Observer API` 都使用微任务队列去运行它们的回调函数，但当能够推迟工作直到当前事件循环过程完结时，也是可以执行微任务的时机。
- 一个任务就是由执行诸如从头执行一段程序、执行一个事件回调或一个 `interval/timeout` 被触发之类的标准机制而被调度的任意 `JavaScript` 代码。这些都在任务队列（`task queue`）上被调度。在以下时机，任务会被添加到任务队列：
  - 一段新程序或子程序被直接执行时（比如从一个控制台，或在一个 `<script>` 元素中运行代码）。
  - 触发了一个事件，将其回调函数添加到任务队列时。
  - 执行到一个由 `setTimeout()` 或 `setInterval()` 创建的 `timeout` 或 `interval`，以致相应的回调函数被添加到任务队列时。

`MDN` 也给出了使用微任务的建议：因为微任务自身可以入列更多的微任务，且事件循环会持续处理微任务直至队列为空，那么就存在一种使得事件循环无尽处理微任务的真实风险。如何处理递归增加微任务是要谨慎而行的。如果可能的话，大部分开发者并不应该过多的使用微任务。在基于现代浏览器的 `JavaScript` 开发中有一个高度专业化的特性，那就是允许你调度代码跳转到其他事情之前，而那些事情原本是处于用户计算机中一大堆等待发生的事情集合之中的。滥用这种能力将带来性能问题。

所以微任务的处理方式本质还是提供了一个优先执行任务的通道，让一些有需要的任务优先执行，不过我们需要正确地使用。

这里属于我个人的理解，如果有错误或者意见，欢迎讨论。

## 事件循环过程

简化标准中的执行流程如下：

1. 取一个宏任务来执行。执行完毕或没有宏任务，进入下一步。执行过程中触发的微任务会直接放入微任务队列，会在本轮执行。
2. 取一个微任务来执行，执行完毕后，再取一个微任务来执行。直到微任务队列为空，执行下一步。执行过程中遇到的微任务也会放到队列后在本轮执行。
3. 更新UI渲染。

`Event Loop` 会无限循环执行上面3步，这就是 `Event Loop` 的主要控制逻辑。其中第三部 `UI` 渲染不是每次事件循环都进行的。

> 这个[可视化 JS 执行过程](http://latentflip.com/loupe/?code=ZnVuY3Rpb24gYygpIHt9CmZ1bmN0aW9uIGIoKSB7CgljKCk7Cn0KZnVuY3Rpb24gYSgpIHsKCXNldFRpbWVvdXQoYiwgMjAwMCkKfQphKCk7!!! '可视化 JS 执行过程')可以帮助你理解。

从逻辑上来看，浏览器倾向于尽可能快地执行完微任务，当全局任务（其实是全局函数中的同步任务）执行完之后，会立即执行微任务队列，即使微任务队列执行完了，在每次执行完一个宏任务之后都会检查微任务队列，如果就微任务就一直执行到微任务队列为空才会执行宏任务。

```javascript
console.log('script start');

// 微任务
Promise.resolve().then(() => {
    console.log('p 1');
});

// 宏任务
setTimeout(() => {
    console.log('setTimeout');
}, 0);

var s = new Date();
while(new Date() - s < 50); // 阻塞50ms

// 微任务
Promise.resolve().then(() => {
    console.log('p 2');
});

console.log('script ent');

/*** output ***/
// one macro task
script start
script ent

// all micro tasks
p 1
p 2

// one macro task again
setTimeout
```

## 什么时候触发 UI render

按照标准中的说明：如果浏览器试图实现 `60Hz` 的刷新率，那么 `UI Render` 只需要每秒执行 `60` 次（每 `16.7 ms`）。如果浏览器发现『顶层浏览器上下文』无法维持住这个频率，可能会下调到可维持的 `30Hz`，而不是掉帧。（本规范并不对何时进行 `render` 做任何规定。）类似的，如果一个顶层浏览器上下文在后台运行，用户代理可能决定将该页面的刷新率降到 `4Hz`，甚至更低。

如果满足以下条件，也会跳过渲染：浏览器判断更新渲染不会带来视觉上的改变。`map of animation frame callbacks` 为空，也就是帧动画回调为空，可以通过 `requestAnimationFrame` 来请求帧动画。

这里要说一说 `requestAnimationFrame`，`window.requestAnimationFrame()` 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。根据标准中的定义 `requestAnimationFrame` 也是 `UI Render` 的其中一步，所以 `requestAnimationFrame` 的回调函数的执行时跟 `UI render` 是同步的。但是我们上面说了，`UI render` 的频率是不确定的，所以我们不能明确知道 `requestAnimationFrame` 会在哪一次 `Event Loop` 执行。既有可能出现每一轮 `eventloop` 后都 `render` 的现象，也有可能出现几十轮 `eventloop` 都不 `render` 的情况，根据浏览器的实现不同和使用的电脑状况不同都有可能出现差异。比如下面这个题目：

```javascript
setTimeout(function () {
  console.log(1)
}, 1)
setTimeout(function () {
  console.log(2)
}, 2)
setTimeout(function () {
  console.log(3)
}, 3)
requestAnimationFrame(function () {
  console.log(4)
})
```

这道题的输出可能是 `4123`，`1423`，`1243` 或者 `1234`，主要愿意就是我们不知道浏览器在哪一次 `Event Loop` 进行渲染，所以 `requestAnimationFrame` 可能在任意一个 `setTimeout` 后面执行。

再比如下面这题求输出：

```javascript
console.log('1')

setTimeout(function () {
  console.log('2')
  process.nextTick(function () {
    console.log('3')
  })
  new Promise(function (resolve) {
    console.log('4')
    resolve()
  }).then(function () {
    console.log('5')
  })
})
process.nextTick(function () {
  console.log('6')
})
new Promise(function (resolve) {
  console.log('7')
  resolve()
}).then(function () {
  console.log('8')
})

setTimeout(function () {
  console.log('9')
  process.nextTick(function () {
    console.log('10')
  })
  new Promise(function (resolve) {
    console.log('11')
    resolve()
  }).then(function () {
    console.log('12')
  })
})
//1，7，6，8，2，4，3，5，9，11，10，12
```

## NodeJs 的 Event Loop

`Node` 端事件循环中的异步队列也是这两种：`macro`（宏任务）队列和 `micro`（微任务）队列。

常见的 `macro-task` 比如：`setTimeout`、`setInterval`、 `setImmediate`、`script`（整体代码）、 `I/O` 操作等。 常见的 `micro-task` 比如: `process.nextTick`、`new Promise().then`(回调)等。

在 `Event Loop` 之前会先做这些工作： 1. 初始化 `Event Loop` 2. 执行主代码。这里同样，遇到异步处理，就会分配给对应的队列。直到主代码执行完毕。 3. 执行主代码中出现的所有微任务：先执行完所有nextTick()，然后在执行其它所有微任务。 4. 开始 `Event Loop`

`Event Loop`分为`6`个阶段： 1. `timers` : 这个阶段执行 `setTimeout()` 和 `setInterval()` 设定的回调。 2. `pending callbacks` : 上一轮循环中有少数的 `I/O callback` 会被延迟到这一轮的这一阶段执行。 3. `idle` , `prepare` : 仅内部使用。 4. `poll` : 执行 `I/O callback`，在适当的条件下会阻塞在这个阶段 5. `check` : 执行 `setImmediate()`设定的回调。 6. `close callbacks` : 执行比如 `socket.on('close', ...)` 的回调。

在 `Node 11` 之前每个阶段执行完毕后，才会执行所有微任务（先 `nextTick`，后其它），然后再进入下一个阶段。在 `Node 11` 之后，就和浏览器一样，在每一个宏任务执行之后，执行所有微任务队列中的微任务。

## 总结

关于事件循环，网络上的文章都差不多，不过今天看了两篇文章：[深入探究 eventloop 与浏览器渲染的时序问题](https://juejin.im/entry/6844903487700992007 '深入探究 eventloop 与浏览器渲染的时序问题') 和 [深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系](https://zhuanlan.zhihu.com/p/142742003 '深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系') 发现自己懂得并不是很透彻。从标准的角度看，事件循环的逻辑也还是挺复杂的，其中还有很多细节没有掌握。当然，这也可能是事件循环还没有一个确定的标准导致的，各个浏览器的实现还不完全一致，包括 `ECMAScript` 关于 `Job` 的一些规定和 `HTML5` 标准对于时间循环的定义都是有冲突的，`Node` 的实现也和浏览器不同，还是要继续摸索。

## 参考文章

1. [JavaScript 异步、栈、事件循环、任务队列](https://segmentfault.com/a/1190000011198232 'https://segmentfault.com/a/1190000011198232')
2. [一次弄懂Event Loop](https://juejin.im/post/5c3d8956e51d4511dc72c200#heading-15 '一次弄懂Event Loop')
3. [深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系](https://zhuanlan.zhihu.com/p/142742003 '深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系')
4. [深入探究 eventloop 与浏览器渲染的时序问题](https://juejin.im/entry/6844903487700992007 '深入探究 eventloop 与浏览器渲染的时序问题')
5. [requestAnimationFrame是一个宏任务么](https://ginobilee.github.io/blog/2019/02/01/requestAnimationFrame%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AE%8F%E4%BB%BB%E5%8A%A1%E4%B9%88/ 'requestAnimationFrame是一个宏任务么')
6. [浏览器与Node的事件循环(Event Loop)有何区别?](https://juejin.im/post/6844903761949753352 '浏览器与Node的事件循环(Event Loop)有何区别?')
7. [浏览器和Node 事件循环的区别](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/26 '浏览器和Node 事件循环的区别')
