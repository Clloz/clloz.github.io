---
title: 'JavaScript 各异步方式比较'
publishDate: '2020-11-02 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: {"src":"./javascript-logo.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

学习完了 `Promise`，`Generator` 和 `async` 之后，用法基本都掌握了，也都理解了他们是如何实现的，但是对于为什么要有它们，在什么时候使用等问题似乎还是云里雾里，本文写一写我对几个异步处理方法的理解。

如果你对 `ES6` 的异步解决方案还不熟悉，请看之前的几篇文章：

- [深入 Promise](https://www.clloz.com/programming/front-end/js/2020/10/28/deep-into-promise/ "深入 Promise")
- [ES6 迭代器 Iterator](https://www.clloz.com/programming/front-end/js/2020/10/31/es6-iterator/ "ES6 迭代器 Iterator")
- [ES6 生成器 Generator](https://www.clloz.com/programming/front-end/js/2020/10/31/es6-generator/ "ES6 生成器 Generator")
- [生成器 Generator 的异步应用](https://www.clloz.com/programming/front-end/js/2020/11/01/generator-async/ "生成器 Generator 的异步应用")
- [深入 aync/await](https://www.clloz.com/programming/front-end/js/2020/11/02/deep-into-aync-await/ "深入 aync/await")

## 异步处理的方式

在 `JS` 中异步是非常重要的概念，因为 `JS` 的执行时单线程的，所以有些需要等待的任务必须要异步。比如我们请求一个文件，如果是同步的情况下，我们在等待请求这段时间线程是卡死的，我们什么也不能做，并且我们不确定什么时候请求成功。这就必须要异步，异步就是将执行分为两个阶段，第一个阶段同步执行，然后等第一个阶段的代码出结果了，在执行第二个阶段。在等待的这段时间，我们可以先处理其他任务。

## 回调函数

最早的异步处理方式自然是回调函数，我们将一个函数作为参数，当某个事件触发了，再执行这个函数。这是最简单的异步方式。包括浏览器的时间，定时器，`AJAX` 请求都是这个思路。

回调函数有很多问题，比较有名的就是回调地狱。当多个异步任务存在依赖关系的时候，我们只能等一个异步任务完成了，然后在回调函数中发起下一个异步任务。如果嵌套的任务非常多的话就会变成如下情况：

```javascript
ajax('XXX1', () => {
    // callback 函数体
    ajax('XXX2', () => {
        // callback 函数体
        ajax('XXX3', () => {
            // callback 函数体
        })
    })
})
```

由于我们写代码的缩进关系，代码变成了横向发展，而不是纵向发展。最关键的是，这段代码可读性很差，非常难以维护，耦合度非常高，一旦这段逻辑要进行修改，就会牵一发而动全身。

但是在我看来回调函数还有一些其他问题，就是我们必须在回调函数内处理逻辑。使用回调函数的异步任务没有返回值，异步任务的处理结果是作为回调函数的参数传入的，而回调函数也是异步任务的一个参数。我们想要到外部处理异步任务的结果，只能在外部申请变量，然后将异步任务的结果赋值给变量。换言之，我们是“配合”回调函数来写自己的业务逻辑。

并且使用回调函数的异步任务，无法使用 `try ... catch` 来进行错误处理，回调函数不会将错误向外层抛出，我们只能将错误处理写到回调函数中。

```javascript
// try catch 无法捕获到内部的错误
try {
    setTimeout(() => {
        console.log(aa);
    }, 1000);
} catch (error) {
    console.log(error);
}
```

## Promise

`Promise` 是 `ES6` 引入的一个新的内置对象，它本质是对回调函数的一个封装。`Promise` 的每一个方法返回的都还是一个 `Promise` 对象，所以它能实现链式调用，这样就解决了回调地狱的问题。

对于错误处理，`Promise` 中测错误必须要用 `.catch` 来捕获，它也不会抛到外层。

我认为 `Promise` 还有一点对回调函数的优化就是它将异步任务的状态和结果保存在了 `Promise` 对象中，我们不再像回调函数一样，异步任务已完成就要执行对应的逻辑。只要有 `Promise` 对象，我们随时都可以用 `.then`，`.catch` 来执行后面的逻辑。

`Promise` 也有自己的缺点，我们无法中断一个 `Promise` 的执行，一个 `Promise` 一旦开就无法取消。换言之我们无法介入一个已经开始执行的 `Promise` 进行交互。还有一个问题就是上面说道的错误处理，和回调函数一样，`Promise` 也不能通过外层的 `try ... catch` 捕获错误，必须用 `.catch` 来捕获内部的 `reject`（抛错在 `Promise` 中和 `reject` 是一样的）。

还有一个小问题就是 `Promise` 的语义并不是很明确，我们的代码逻辑被隐藏在了 `Promise` 的 `API` 之后，并不是很容易阅读。

## Generator

`Generator` 函数是 `ES6` 对协程的实现，但属于不完全实现。`Generator` 函数被称 为“半协程”(`semi-coroutine`)，意思是只有 `Generator` 函数的调用者，才能将程序的执行权还给 `Generator` 函数。如果是完全执行的协程，任何函数都可以让暂停的 协程继续执行。

如果将 `Generator` 函数当作协程，完全可以将多个需要互相协作的任务写成 `Generator` 函数，它们之间使用 `yield` 表示式交换控制权。协程的过程可以模拟如下：

- 第一步，协程 `A` 开始执行。
- 第二步，协程 `A` 执行到一半，进入暂停，执行权转移到协程 `B` 。
- 第三步，(一段时间后)协程 `B` 交还执行权。
- 第四步，协程 `A` 恢复执行。

在有生成器之前，我们处理异步主要依靠的就是回调函数和 `Promise`。不同的环境提供了不同的异步功能，比如 `node` 的文件操作，浏览器的 `DOM` 事件，以及网络请求等，都提供了异步的支持。我们在执行代码的时候声明一个 `callback`，引擎会在事件完成的时候调用我们的回调函数。

当然也有不依赖系统 `API` 的异步方式，比如发布订阅模式，我们将我们要执行代码交给一个事件管理中心（可能是存在一个数组中），这个过程称为订阅。当我们想要执行某段回电函数的时候就通知事件管理中心，让它执行对应的函数，这叫做发布。实际上 `Promise` 的实现也用到了这个模式。

生成器可以说完全是一种全新的机制，它让我们能够让一个函数分段执行，并且函数内外能够在暂停和恢复的时候进行数据交换。内部的错误可以被外部捕获，也提供了从外部向内部跑错的 `throw` 方法。

虽然 `Generator` 不是只能用来进行异步处理，但是它在异步处理上是进行了革新的，提供了一种全新的形式，也就是协程的概念，我们可以堆函数的执行流程进行控制。

生成器的缺点就是需要手动执行，我们必须手动调用 `next`。所以需要我们自己写自动执行器，也就是 `co` 模块，并且需要 `yield` 后面的表达式返回一个 `Promise` 对象（`co` 模块还能够接受函数，生成器，数组和对象，数组和对象是为了并发执行）。

> 生成器还有一些其他作用，比如将普通对象变为可迭代对象，惰性求值等。

## async/await

`async` 函数是生成器的语法糖，其实它就是自动执行的生成器和 `Promise` 的结合。不过它比 `co` 更好的地方是 `await` 后面可以跟原始数据类型。

其实 `async` 函数和用 `co` 包装过的生成器没有什么区别，不过它的语义化更好，`async` 和 `await` 非常容易理解，我们可以把我们一步任务像写同步任务一样用 `await` 继发执行。`Async` 函数的实现最简洁，最符合语义，几乎没有语义不相关的代码。它将 `Generator` 写法中的自动执行器，改在语言层面提供，不暴露给用户，因此代码量最少。如果使用 `Generator` 写法，自动执行器需要用户自己提供。

`async` 有一个问题就是我们需要理清楚自己异步任务之间的依赖，如果你将两个不互相依赖的异步任务写在同一个 `async` 的连续 `await` 中，他们将会继发执行，降低效率。我们需要的是并发执行，可以用 `Promise.all` 实现。

## 错误处理机制

`Promise` 的错误只能用 `.catch` 捕获，如果没有 `.catch`，那么错误不会冒泡到外层，代码也不会中断执行。

```javascript
var someAsyncThing = function () {
    return new Promise(function (resolve, reject) {
        // 下面一行会报错，因为x没有声明
        console.log('throw error');
        resolve(x + 2);
    });
};
try {
    someAsyncThing()
        .then(function () {
            console.log('everything is great');
        })
        .catch(e => {
            console.log('promise catch: ' + e); //promise catch: ReferenceError: x is not defined
        });

    console.log(123123); //123123
} catch (e) {
    console.log('outer: ' + e);
}
```

`Generator` 内层抛错可以被外层接受（如果内层没有写 `catch`），外层抛错可以用 `Generator.prototype.throw` 方法传递给内层。一旦抛错被外层接收处理，则生成器的执行立即结束，`done` 变为 `true`。

```javascript
function* gen() {
    yield 1;
    try {
        throw new Error('error1');
    } catch (e) {
        console.log('inner: ' + e);
    }
    yield 2;
    throw new Error('error2');
}
let g = gen();
try {
    console.log(g.next());
    console.log(g.next());
    console.log(g.next());
} catch (e) {
    console.log('outer: ' + e);
}
// { value: 1, done: false }
// inner: Error: error1
// { value: 2, done: false }
// outer: Error: error2
```

`async` 函数返回的是一个 `Promise`，所以内部一旦抛错，这个 `Promise` 的状态就立即变为 `rejected`，错误信息会被传递给 `.catch`。这就让我们能够在 `async` 中使用普通的 `try ... catch`。因为同步和异步的代码出错都会 `rejected`。

```javascript
async function test() {
    console.log(x);
}
test()
    .then(val => console.log(val))
    .catch(reason => {
        console.log('reason: ' + reason); //reason: ReferenceError: x is not defined
    });


async function test() {
    console.log(1);
    await new Promise(resolve => {
        throw new Error('promise error');
    });
}
test()
    .then(val => console.log(val))
    .catch(reason => {
        console.log('reason: ' + reason); //reason: Error: promise error
    });
```

## 读取最大文件实现

有两个异步操作 `fs.readdir` 和 `fs.stat`，看看四种方式最后实现的结构如何。

## 回调函数实现

```javascript
var fs = require('fs');
var path = require('path');

function findLargest(dir, cb) {
    // 读取目录下的所有文件
    fs.readdir(dir, function (er, files) {
        if (er) return cb(er);

        var counter = files.length;
        var errored = false;
        var stats = [];

        files.forEach(function (file, index) {
            // 读取文件信息
            fs.stat(path.join(dir, file), function (er, stat) {
                if (errored) return;

                if (er) {
                    errored = true;
                    return cb(er);
                }

                stats[index] = stat;

                // 事先算好有多少个文件，读完 1 个文件信息，计数减 1，当为 0 时，说明读取完毕，此时执行最终的比较操作
                if (--counter == 0) {
                    var largest = stats
                        .filter(function (stat) {
                            return stat.isFile();
                        })
                        .reduce(function (prev, next) {
                            if (prev.size > next.size) return prev;
                            return next;
                        });

                    cb(null, files[stats.indexOf(largest)]);
                }
            });
        });
    });
}
// 查找当前目录最大的文件
findLargest('./', function (er, filename) {
    if (er) return console.error(er);
    console.log('largest file was:', filename);
});
```

## Promise 实现

```javascript
var fs = require('fs');
var path = require('path');

var readDir = function (dir) {
    return new Promise(function (resolve, reject) {
        fs.readdir(dir, function (err, files) {
            if (err) reject(err);
            resolve(files);
        });
    });
};

var stat = function (path) {
    return new Promise(function (resolve, reject) {
        fs.stat(path, function (err, stat) {
            if (err) reject(err);
            resolve(stat);
        });
    });
};

function findLargest(dir) {
    return readDir(dir)
        .then(function (files) {
            let promises = files.map(file => stat(path.join(dir, file)));
            return Promise.all(promises).then(function (stats) {
                return { stats, files };
            });
        })
        .then(data => {
            let largest = data.stats
                .filter(function (stat) {
                    return stat.isFile();
                })
                .reduce((prev, next) => {
                    if (prev.size > next.size) return prev;
                    return next;
                });

            return data.files[data.stats.indexOf(largest)];
        });
}

findLargest('./')
    .then(function (filename) {
        console.log('largest file was:', filename);
    })
    .catch(function (error) {
        console.log(error);
    });
```

## Generator 实现

```javascript
var fs = require('fs');
var path = require('path');

var co = require('./co');

var readDir = function (dir) {
    return new Promise(function (resolve, reject) {
        fs.readdir(dir, function (err, files) {
            if (err) reject(err);
            resolve(files);
        });
    });
};

var stat = function (path) {
    return new Promise(function (resolve, reject) {
        fs.stat(path, function (err, stat) {
            if (err) reject(err);
            resolve(stat);
        });
    });
};

function* findLargest(dir) {
    var files = yield readDir(dir);
    var stats = yield files.map(function (file) {
        return stat(path.join(dir, file));
    });

    let largest = stats
        .filter(function (stat) {
            return stat.isFile();
        })
        .reduce((prev, next) => {
            if (prev.size > next.size) return prev;
            return next;
        });

    return files[stats.indexOf(largest)];
}

co(findLargest, './')
    .then(function (filename) {
        console.log('largest file was:', filename);
    })
    .catch(function (error) {
        console.log(error);
    });
```

```javascript
var fs = require('fs');
var path = require('path');

var readDir = function (dir) {
    return new Promise(function (resolve, reject) {
        fs.readdir(dir, function (err, files) {
            if (err) reject(err);
            resolve(files);
        });
    });
};

var stat = function (path) {
    return new Promise(function (resolve, reject) {
        fs.stat(path, function (err, stat) {
            if (err) reject(err);
            resolve(stat);
        });
    });
};

async function findLargest(dir) {
    var files = await readDir(dir);

    let promises = files.map(file => stat(path.join(dir, file)));
    var stats = await Promise.all(promises);

    let largest = stats
        .filter(function (stat) {
            return stat.isFile();
        })
        .reduce((prev, next) => {
            if (prev.size > next.size) return prev;
            return next;
        });

    return files[stats.indexOf(largest)];
}

findLargest('./')
    .then(function (filename) {
        console.log('largest file was:', filename);
    })
    .catch(function (error) {
        console.log(error);
    });

```