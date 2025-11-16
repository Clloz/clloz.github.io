---
title: '定时器的一些思考'
publishDate: '2020-07-15 12:00:00'
description: ''
tags:
  - js
  - 实用技巧
language: '中文'
heroImage: {"src":"./javascript-logo.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

`JavaScript` 中的定时器有两个 `setTimeout` 和 `setInterval`，在浏览器环境他们都是全局对象 `window` 的属性（在 `web worker` 中则是对应的 `WorkerGlobalScope`，本文主要讨论 `window` 其他的环境可以类推），他们不是 `JavaScript` 标准里的东西，是浏览器的 `API`，不过在 `nodejs` 中也模拟浏览器进行也实现，也是挂载在全局对象上的。定时器由于有自己的一些特殊行为，所以写一篇文章来总结一下。

> `nodejs` 中的定时器的第一个函数不能是字符串，只能是一个函数。`nodejs` 上的实现虽然是浏览器的翻版，但是还是略有不同，本文主要讨论浏览器环境，具体的 `nodejs` 中的不同参考 `nodejs` 文档。

## 标准

我们直接一步到位，从标准中看定时器的定义，定时器 `timer` 在[HTML标准](https://html.spec.whatwg.org/multipage/ "HTML标准")的第 `8.6` 章节。

## 语法

```javascript
handle = self . setTimeout( handler [, timeout [, arguments... ] ] )
//Schedules a timeout to run handler after timeout milliseconds. Any arguments are passed straight through to the handler.

handle = self . setTimeout( code [, timeout ] )
//Schedules a timeout to compile and run code after timeout milliseconds.

self . clearTimeout( handle )
//Cancels the timeout set with setTimeout() or setInterval() identified by handle.

handle = self . setInterval( handler [, timeout [, arguments... ] ] )
//Schedules a timeout to run handler every timeout milliseconds. Any arguments are passed straight through to the handler.

handle = self . setInterval( code [, timeout ] )
//Schedules a timeout to compile and run code every timeout milliseconds.

self . clearInterval( handle )
Cancels the timeout set with setInterval() or setTimeout() identified by handle.
```

`self` 就是 `window` 或者 `web worker` 的 `WorkerGlobalScope`，在 `window` 全局对象下我们可以直接写 `window` 也可以不写。`handle` 可以理解为定时器的编号，清除定时器的两个函数依靠 `handle` 在定时器列表中找到对应的定时器清除。`setTimeout` 和 `setInterval` 都至少接收一个参数作为回调函数，这个参数可以是一个函数也可以是一个字符串（不建议使用字符串，会有和 `eval` 一样的问题，在 `nodejs` 中默认不可以使用字符串）；第二个可选参数是回调函数的执行间隔，默认值为 `0`；从第三个参数开始就是回调函数执行的参数。

> `clearTimeout` 和 `clearInterval` 虽然命名不一样，但他们都是依靠 `handle` 来取消定时器的，所以他们都能够清除 `setTimeout` 和 `setIntervel` 设置的定时器。

## 两个提示

标准中给出了两个提示，一个是定时器可以嵌套，但是当嵌套超过 `5` 层的时候，最短间隔将被设为 `4ms`，这个我已经在 `chrome` 测试过，确实如此。但是在 `nodejs` 中不受影响。

```javascript
console.time('first')
setTimeout(function () {
    console.timeEnd('first')
    console.time('second')
    setTimeout(function () {
        console.timeEnd('second')
        console.time('third')
        setTimeout(function () {
            console.timeEnd('third')
            console.time('fourth')
            setTimeout(function () {
                console.timeEnd('fourth')
                console.time('fifth')
                setTimeout(function () {
                    console.timeEnd('fifth')
                    console.time('sixth')
                    setTimeout(function () {
                        console.timeEnd('sixth')
                    })
                })
            })
        })
    })
})
//chrome 输出
//first: 1.2001953125ms
//second: 1.420166015625ms
//third: 1.416259765625ms
//fourth: 1.527099609375ms
//fifth: 4.43798828125ms
//sixth: 5.159912109375ms

//nodejs输出
//first: 1.678ms
//second: 1.792ms
//third: 1.270ms
//fourth: 1.599ms
//fifth: 1.561ms
//sixth: 1.259ms
```

第二点就是我们设置的 `delay` 延迟时间并不是精确的，要根据 `CPU` 负载，其他的任务的执行时间。关于这一点要理解浏览器工作过程中非常重要的 `event loop` （`nodejs` 也有相同的设施），这个要详细说明比较复杂。大致可以这么理解，引擎只负责处理要执行的任务，但是异步任务的执行时不确定的，所以宿主环境都提供了一种设施来管理异步任务何时进入引擎的调用栈执行。引擎遇到一个异步的回调函数交给管理异步任务的模块，当这个回调函数触发了（比如我们的定时器时间到了，或者元素绑定事件触发了等），并不是直接把这个回调函数交给引擎执行（`JS` 是单线程的，任务只能一个一个执行），而是放进浏览器管理的一个任务队列，触发的回调函数会加入这个队列，等待引擎执行完再到队列里面来取任务（这也就是所谓的 `event loop`）。也就是我们设定的这个 `delay` 指的是我们的回调函数什么时候进入任务队列，而不是什么时候执行。这里讲的只是一个大概的过程，具体的内容可以看我的两篇文章：[JavaScript如何工作一：引擎，运行时和调用栈概述](clloz.com/programming/front-end/js/2019/05/13/how-javascript-works-1/#_The_Callback_Queue "JavaScript如何工作一：引擎，运行时和调用栈概述")和 [事件循环 Event Loop](https://www.clloz.com/programming/front-end/js/2020/11/01/event-loop/ "事件循环 Event Loop")

## 执行细节

`WindowOrWorkerGlobalScope` 的实例对象（即 `window` 或者 `WorkerGlobalScope`）都会管理一个 `list of active timers`，也就是活动的计时器的列表。列表中的每一个项都用一个唯一的数来标记。

`setTimeout()` 和 `setInterval()` 的执行过程类似，唯一不同的就是 `repeat flag`。关于执行的过程标准原文：`The setTimeout() method must return the value returned by the timer initialization steps, passing them the method's arguments, the object on which the method for which the algorithm is running is implemented (a Window or WorkerGlobalScope object) as the method context, and the repeat flag set to false.`大致意思是 `setTimeout()` 方法必须返回 `timer initialization steps` 的返回值，把方法的参数传递给 `timer initialization steps` ，`setTimeout`方法所处的对象（`window` 或者 `WorkerGlobalScope` 对象）作为方法的执行上下文，最后设置 `repeat flag`。从这里我们已经能看出方法的执行是在全局环境中，这也是为什么非严格模式下 `setTimeout` 中的函数内的 `this` 返回全局对象的原因。

`timer initialization steps` 的调用需要几个参数，方法参数（`setTimeout` 从第三个参数开始都是方法的参数），`a method context`（`window` 或者 `WorkerGlobalScope`对象），`a repeat flag` 和一个可选的 `previous handle`（用作 `setInterval` 的多次调用） 。

1. 设置方法的执行上下文 `method context` 为 `window` 或者 `WorkerGlobalScope`对象。
2. 如果传递了 `previous handle` 就用 `previous handle` 作为 `handle` ，否则就创建一个大于 `0` 的整数作为 `handle`。
3. 如果 `previous handle` 没有提供，那么就在 `list of active timers` 用生成的 `handle` 添加一项。
4. Let callerRealm be the current Realm Record, and calleeRealm be method context's JavaScript realm.
5. 将初始化脚本作为活动脚本
6. 断言：初始化脚本不为 `null`。
7. 运行下面的子步骤
    
    - 如果对应的 `handle` 在 `list of active timers` 中被清除了则终止这些步骤。
    - 如果方法的第一个参数是 `Function`，用后续的参数调用该方法，将 `method context proxy` 作为回调函数的 `this` 对象。
    - 如果 `repeat flag` 为 `true`，则再次调用 `timer initialization steps`，传递相同的参数，当前的 `handle` 作为 `previous handle`。
8. 方法的第二个参数作为 `timeout`
9. 如果当前正在运行的任务是相同的算法创建的（我的理解是都是 `setTimeout`，即当前的步骤是在一个 `setTimeout` 中或者是 `repeat flag` 为 `true` 的 `setInterval`），将嵌套层级设置为当前执行的定时器的其那套层级。否则嵌套层级为 `0`。
10. 如果 `timeout` 小于 `0`， 设 `timeout` 为 `0`。
11. 如果嵌套层级大于 `5`,并且 `timeout` 小于 `4` ， 设置 `timeout` 为 `4`。
12. 嵌套层级加一。
13. 设置任务的嵌套层级为上面计算出的嵌套层级。
14. 返回 `handle`，并行运行这个算法。
15. `fully avtive` 概念参考[标准](https://html.spec.whatwg.org/multipage/browsers.html#fully-active "标准")
16. 等待其他开始于本计时器之前，并且事件小于等于本计时器 `timeout` 的计时器执行完成。
17. 进入任务队列，等待 `event loop` 执行。

以上就是定时器的执行过程，内容完全是个人理解翻译，可能有理解错误，欢迎指正。

## 注意点

从标准我们可以看出，回调函数是在全局环境执行的，有一个特殊的地方就是，无论是否在严格模式下，回调函数的 `this`都返回 `window` 对象。想要获得 `setTimeout` 执行位置的词法作用域的 `this`，一个有效的方法就是箭头函数。

```javascript
function a () {
    setTimeout(() => {
        console.log(this)
    }, 0)
}

let obj = {
    fun: a
}

obj.fun() // { fun: [Function: a] }
```

* * *

`setTimeout` 回调函数也可以获得块级作用域闭包。

```javascript
{
    let a = 10;
    setTimeout(function () {
        console.log(a) //10
    })
}
let a = 20;
console.log(a) //20
```

* * *

我们上面说了 `delay` 的最短间隔问题，同时 `delay` 也是有上限的。`javascript` 规定 `delay` 是一个 `32` 位无符号整数，这意味着 `delay` 的上限是 $2^{32} - 1$ 即 `2147483647`。

* * *

想要清除定时器我们需要将 `setTimeout` 或者 `setInterval` 的返回值储存到一个变量中，当我们有嵌套的定时器或者管理的定时器较多时，如何命名和清除对应的定时器是一个要解决的问题。我今天就想到一个场景，两个嵌套的 `setInterval`，外层的 `delay` 比内层的 `delay` 要短的情况下，并且我们只希望内层的 `setInterval` 执行几次就停止，如何有效的清除对应的定时器。

我们将场景设置地具体一点，我们希望内层的每个定时器执行五次后被清除，我们要如何储存定时器 `id`，我们需要给每一个定时器不同的命名，同时需要确保我们使用的外部变量补鞥呢影响到其他定时器。我最终的解决方案是用一个对象 `timerPool`来保存所有的定时器，属性名用 ``timerPool[`timer${index}`]``，`index` 是一个自增的变量，外层的定时器每执行一次就自增，这样就能确保每个定时器 `id` 保存在不同的变量中。同时这个 `index` 是在变化的，当我们进行 ``clearIterval(timerPool[`timer${index}`])`` 的时候，`index` 已经不是我们要的那个 `index` 了，所以需要用一个立即执行函数将内层的定时器包裹起来，将 `index` 传递进去以保存，其他的可能会被影响的外部变量也可以参照处理。最后的代码如下：

```javascript
let outer = 0;
let timerPool = {}
setInterval(() => {
    (function(outer){
        let index = 0, inner = 0;
        timerPool[`timer${outer}`] = setInterval(() => {
                if (index >= 5) {
                    inner = 0;
                    console.log(outer)
                    clearInterval(timerPool[`timer${outer}`]);
                } else {
                    console.log(index, outer, inner);
                    index++
                    inner++;
                }
            }, 1000)
    })(outer)
    outer++;
}, 4000)
```

检验结果解释每一个 `outer` 都只执行了 `5` 次，比如 `outer` 为 `1` 的输出只有 `5` 次，分别对应 `inner` 为 `0, 1, 2, 3, 4` 的情况。

关于清除定时器还有一点需要注意的就是，如果我们在某个上下文内定义了一个定时器，同时想在该环境外部清除定时器，那我们需要将保存定时器 `id` 的变量在外部声明。

## requestAnimationFrame

在没有 `requestAnimationFrame` 之前，我们用 `JS` 实现动画都是用定时器实现的，但是定时器实现动画有很多问题。

先说 `setTimeout`，`setTimeout` 的逻辑是过一个指定长度的时间执行代码，当执行一次的时候，这不存在什么问题。当我们要实现一些递归的效果，比如每个 `1s` 将 `div` 换个颜色，我们就需要递归的调用 `setTimeout`。那么这个时候我们会发现，每次执行的时间间隔不是我们指定的 `1000ms`，而是 `1000ms` 加上函数执行的时间。

```javascript
let i = 0;
setTimeout(function fn() {
    console.log(i++);
    setTimeout(fn, 1000);
}, 0);
```

`setInterval` 是定时将函数推入任务队列（参考 [事件循环 Event Loop](https://www.clloz.com/programming/front-end/js/2020/11/01/event-loop/ "事件循环 Event Loop")），我们能确定的只是回调函数进入任务队列的时间间隔。而且如果 `js` 线程很忙碌，在我们下一个定时器要进去的时候发现上一个定时器的回调函数还没执行，那么这次插入任务队列就会失败。`setInterval` 会尝试在下一次间隔到了再次查看任务队列，只有任务队列没有来自同一个定时器的任务才会插入成功。此时还有一个问题就是我们会发现相邻的任务之间的时间间隔消失了，变成了连续执行。比如下面这段代码，我们会发现执行之间没有了间隔。

```javascript
console.time('log');
setInterval(() => {
    console.timeLog('log');
    let start = new Date().getTime();
    while (new Date().getTime() - start < 1000) {}
    console.timeLog('log');
}, 500);
```

> 注意，`NodeJS` 的 `setInterval` 的逻辑和浏览器不同。`NodeJS` 中是回调函数执行完毕之后才会尝试向任务队列插入新的任务。

从这个角度看 `setTimeout` 比 `setInterval` 要好一些，我们的执行不会被丢弃，并且我们可以在回调函数中对时间进行修正来改善 `setTimeout` 时间不准的问题。但是它们两个都有一个问题是无法跟浏览器的渲染同步。

我们都知道 `setTimeout` 和 `setInterval` 是宏任务，一个 `Event Loop` 执行一次。但是可能很多人不知道，并不是每一次 `Event Loop` 都会执行 `UI render` 的。浏览器会根据自己的分析决定在哪一个 `Event Loop` 渲染。比如下面的代码：

```javascript
setTimeout(() => {
  document.body.style.background = "red"
  setTimeout(() => {
    document.body.style.background = "blue"
  })
})
```

我们是希望页面先变成红色在变成蓝色，但是实际执行我们会发现很多时候浏览器并不会渲染红色，而是直接显示蓝色，有时候能够正常渲染出颜色的变化，这是为什么呢？其实道理也很简单，如果这两个 `setTimeout` 任务之间正好遇上了浏览器渲染，那么就能成功看到红色变蓝色。如果两次任务之间浏览器没有渲染，那么就只能看到蓝色。也就是说，丢帧了。如果我们用 `setTimeout` 或者 `setInterval` 做动画，很可能最后的效果不是很好，因为浏览器的渲染是不确定的。

> 如果是用定时器做动画，我们一般设置间隔为 `17ms`，因为一般情况下浏览器渲染是一秒钟 `60` 帧，也就是 `16.7ms` 渲染一次。但是根据具体的浏览器和机器，帧数不一定相同。细节参考 [事件循环 Event Loop](https://www.clloz.com/programming/front-end/js/2020/11/01/event-loop/ "事件循环 Event Loop")

为了能够实现平滑的动画，`HTML5` 提供了 `window.requestAnimationFrame()` 这个 `API`， 它的功能是告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。所以 `requestAnimationFrame` 能够和页面渲染同步，能够完美解决我们平滑执行动画的问题。

若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用 `window.requestAnimationFrame()`。返回值是一个 `long` 整数，请求 `ID` ，是回调列表中唯一的标识。是个非零值，没别的意义。你可以传这个值给 `window.cancelAnimationFrame()` 以取消回调函数。

使用 `requestAnimationFrame` 还有一些好处就是在页面被最小化或者我们切换到别的页面时，它是不会触发的，因为此时页面不会渲染，所以它能够节省 `CPU` 的开销。

## 参考文章

1. [浅谈 requestAnimationFrame](https://juejin.im/post/6844903877976981517 "浅谈 requestAnimationFrame")
2. [深入理解定时器系列第二篇——被誉为神器的requestAnimationFrame](https://www.cnblogs.com/xiaohuochai/p/5777186.html "深入理解定时器系列第二篇——被誉为神器的requestAnimationFrame")
3. [深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系](https://zhuanlan.zhihu.com/p/142742003 "深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系")