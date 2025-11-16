---
title: '实现一个 lazyman'
publishDate: '2022-05-01 12:00:00'
description: ''
tags:
  - 未分类
language: '中文'
---

## 前言

开门见山，今天朋友问了我一道面试题。

实现一个 LazyMan，可以按照以下方式调用：

`LazyMan('Hank')`，输出：

> Hi, This is Hank!

`LazyMan('Hank').sleep(5).eat('dinner')`，输出：

> Hi, This is Hank!
> // 等待5秒
> Weak up after 10
> Eat dinner ~

`LazyMan('Hank').eat('dinner').eat('supper')`，输出

> Hi, this is Hank!
> Eat dinner ~
> Eat supper ~

`LazyMan('Hank').sleepFirst(5).eat('supper')`，输出

> // 等待5秒
> Wake up after 5
> Hi, this is Hank!
> Eat supper

## 思路

看到这个题目首先看到链式调用，那么自然想到的是构造函数，原型方法，每个方法调用后再返回调用对象，这样可以实现链式调用，LazyMan 可以直接调用那么我们可以检测一下是否是 new 调用，不是则返回 new 调用。基本结构如下

``````javascript
function LazyMan(name) {
    if (!(this instanceof LazyMan)) {
        return new LazyMan(name);
    }
}

LazyMan.prototype.sleep = function (time) {
  return this
};

LazyMan.prototype.eat = function (food) {
  return this;
};

LazyMan.prototype.sleepFirst = function (time) {
  return this;
};

``````

实现链式调用之后我们继续看题目，可以看到需要有等待，自然想到 setTimeout，但是这里 setTimeout 无法满足我们的要求，因为 setTimeout 本身也是同步执行的，其回调函数是异步，并且 setTimeout 没法返回 this 对象。那么我们自然想到了 Promise，async/await。

使用 Promise 或 async/await 有一个和 setTimeout 一样的问题，就是他们的返回值都是 Promise，没法返回对象。同时我们注意题目中的最后一个调用，sleepFirst 方法最后调用但是却先执行，这给了一些提示。链式调用中肯定是前面的执行完了才执行后面，sleepFirst 看上去好像先执行，只有一种可能就是前面的函数执行没有执行 console，只是将 console 放到了某个地方等待执行。

所以我们需要在对象上增加一个 tasks 队列来存放任务，每个函数执行只是将要执行的任务放到 tasks 队列中，sleepFirst 的任务则放到队列最前面。

那么这个队列怎么执行呢，我们需要一个执行函数，这里我第一时间想到的是防抖函数，在 eat，sleep 和 sleepFirst 里面都执行这个执行函数，利用防抖的机制在链式调用结束才会真正执行这个执行函数。

根据上面的思路我写了下面的代码

```javascript
function LazyMan(name) {
    if (!(this instanceof LazyMan)) {
        return new LazyMan(name);
    }
    this.name = name;
    console.log(`this is ${this.name}`);
    this.firstSleepTime = 0;
    this.tasks = [];
    // this.execute();
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function debounce(fn, interval) {
    let timeout = null;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, interval);
    };
}

LazyMan.prototype.execute = debounce(function () {
    sleep(this.firstSleepTime).then(async () => {
        for (let i = 0; i < this.tasks.length; i++) {
            if (typeof this.tasks[i] === 'string') {
                console.log(`Eat ${this.tasks[i]}`);
            } else {
                await sleep(this.tasks[i]);
            }
        }
    });
}, 0);

LazyMan.prototype.sleep = function (time) {
    this.tasks.push(time);
    this.execute();
    return this;
};

LazyMan.prototype.eat = function (food) {
    this.tasks.push(food);
    this.execute();
    return this;
};

LazyMan.prototype.sleepFirst = function (time) {
    this.firstSleepTime += time;
    this.execute();
    return this;
};

LazyMan('clloz').eat('orange').sleep(5000).eat('apple').sleepFirst(3000);
```

效果是达到了，不过有点投机取巧，我这里 tasks 存的不是任务，并且 sleepFirst 也是特殊处理。后来我去网上看了看别人的实现，将所有任务逻辑统一。修改后的实现如下

```javascript
function LazyMan(name) {
    if (!(this instanceof LazyMan)) {
        return new LazyMan(name);
    }
    this.name = name;
    this.sayName();
    this.tasks = [];
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function debounce(fn, interval = 0) {
    let timeout = null;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, interval);
    };
}

LazyMan.prototype.sayName = function () {
    console.log(`this is ${this.name}`);
};

LazyMan.prototype.execute = debounce(async function () {
    for (const task of this.tasks) {
        await task();
    }
});

LazyMan.prototype.sleep = function (time) {
    this.tasks.push(async () => {
        console.log(`sleep ${time}ms`);
        await sleep(time);
    });
    this.execute();
    return this;
};

LazyMan.prototype.eat = function (food) {
    this.tasks.push(async () => {
        console.log(`Eat ${food}`);
    });
    this.execute();
    return this;
};

LazyMan.prototype.sleepFirst = function (time) {
    this.tasks.unshift(async () => {
        console.log(`first sleep ${time}ms`);
        await sleep(time);
    });
    this.execute();
    return this;
};

LazyMan('clloz').eat('orange').sleep(5000).eat('apple').sleepFirst(3000);
```

## 总结

这个题目考察了构造函数，原型，Promise，防抖等知识点，是一道不错的题目，希望本文对你有所帮助

## 参考文章

1. [如何实现一个 LazyMan](https://www.cnblogs.com/ensnail/p/9866130.html)