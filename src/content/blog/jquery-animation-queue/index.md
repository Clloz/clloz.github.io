---
title: 'jQuery动画队列'
publishDate: '2019-05-17 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
---

\[toc\]

## 前言

队列是 `jQuery` 内部的基础设施，`animate` 动画依赖的基础设施,整个 `jQuery` 中队列仅供给动画使用。

那么 `jQuery` 引入队列其实从一个角度上可以认为：允许一系列函数被异步地调用而不会阻塞程序。

```javascript
$(selector).slideUp().fadeIn()
```

这是 `jQuery` 的一组动画链式序列，它的内部其实就是一组队列 `Queue`， 当 `slideUp` 运行时，`fadeIn` 被放到 `fx` 队列中，当 `slideUp` 完成后，从队列中被取出运行。`queue` 函数允许 直接操作这个链式调用的行为。同时，`queue` 可以指定队列名称获得其他能力，而不局限于 `fx` 队列。

`jQuery` 提供了 `2` 组队列操作的 `API` ： - `jQuery.queue/dequeue` - `jQuery.fn.queue/dequeue`

## 队列方法

`$.queue` : 显示或操作匹配的元素上已经执行的函数列队。

这个方法有两个作用，它既是 `setter`，又是 `getter`。第一个参数 `elem` 是 `DOM` 元素，第二个参数 `type` 是字符串，第三个参数 `data` 可以是 `function` 或数组。`type` 默认是 `fx`，也就是默认是给 `fx`动画队列使用的。

```javascript
var body = $('body');
function cb1() {alert(1)}
function cb2() {alert(2)}

//set
$.queue(body, 'aa', cb1); // 第三个参数为function
$.queue(body, 'aa', cb2);

//get
$.queue(body, 'aa')  //[function ,function]
```

`Queue` 源码，用 `jquery` 内部的 `Data` 对象进行缓存：

```javascript
queue: function(elem, type, data) {
    var queue;
    if (elem) {
        type = (type || "fx") + "queue";
        queue = data_priv.get(elem, type);
        // Speed up dequeue by getting out quickly if this is just a lookup
        if (data) {
            if (!queue || jQuery.isArray(data)) {
                queue = data_priv.access(elem, type, jQuery.makeArray(data));
            } else {
                queue.push(data);
            }
        }
        return queue || [];
    }
},
```

`$.dequeue` : 匹配的元素上执行队列中的下一个函数。

```javascript
var body = $('body');
function cb1() {console.log(11)}
function cb2() {console.log(22)}

//set
$.queue(body, 'aa', cb1); // 第三个参数为function
$.queue(body, 'aa', cb2);


$.dequeue(body, 'aa')  //11
$.dequeue(body, 'aa')  //22
```

将回调函数出列执行，每调用一次仅出列一个，因此当回调有 `N` 个时，需要调用 `$.dequeue` 方法 `N` 次元素才全部出列。源码：

```javascript
var dequeue = jQuery.dequeue(elem, type),
    startLength = queue.length,
    fn = queue.shift(),
    hooks = jQuery._queueHooks(elem, type),
    next = function() {
        jQuery.dequeue(elem, type);
    };
```

## 动画队列

动画的链式调用就是用队列来实现的，当我们链式执行动画的时候，当前执行的动画在缓存中会变为 `inprogress` 状态，只有等这个状态结束了，后面的动画才能执行。当第一个动画执行完毕后，那么必须有一个回调通知这个去把队列中下一个执行给取出来，然后要删掉这个 `inprogress` 状态，依次循环。

参考文章 1. [动画队列](https://www.cnblogs.com/aaronjs/p/3813237.html "动画队列")