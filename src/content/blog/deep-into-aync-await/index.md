---
title: '深入 aync/await'
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

`ES 2017` 引入了 `async` 函数，它使得异步操作更加便捷。`async` 是生成器函数的语法糖，我们可以理解成一个结合了 `Promise` 和 `Generator` 的自动执行的生成器。它让我们可以用一种更简洁的方式写出基于 `Promise` 的异步行为，而无需刻意地链式调用 `promise`。

## 语法

回忆一下 `co` 自动执行生成器函数的方式（[生成器 Generator 的异步应用](https://www.clloz.com/programming/front-end/js/2020/11/01/generator-async/#co "生成器 Generator 的异步应用")）：

```javascript
var gen = function* () {
    var f1 = yield readFile('/etc/fstab');
    var f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};
co(gen)
```

`async` 函数的使用方法类似：

```javascript
var asyncReadFile = async function () {
    var f1 = await readFile('/etc/fstab');
    var f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};
asyncReadFile()
```

可以看出 `async` 函数其实就是把 `*` 和 `yield` 换成了 `async` 和 `await`。`async` 对 `Generator` 函数的改进有以下几点：

1. 内置执行器：`Generator` 函数的执行必须依赖执行器（比如 `co`），否则需要手动调用 `next` 才能执行。`async` 函数则像一个普通函数一样执行即可。
2. 更好的语义：`async` 和 `await` 比 `*` 和 `yield` 语义更清楚。
3. 适用性更广：我们编写 `Generator` 的自动执行器需要将 `yield` 后的值包装成一个 `Thunk` 函数或者 `Promise`，`co` 模块就是包装成 `Promise`。`async` 则支持 `Promise` 和原始数据类型，不需要我们手动转换，开箱即用。
4. 和 `co` 模块一样，`async` 函数的返回值是一个 `Promise`，我们可以用 `then` 指定下一步操作。

`async` 函数完全可以看作多个异步操作，包装成的一个 `Promise` 对象，而 `await` 命令就是内部 `then` 命令的语法糖。

* * *

`async` 函数是 `AsyncFunction` 构造函数的实例，我们无法直接访问 `AsyncFunction`，因为它不是一个全局对象，但是我们可以通过 `Object.getPrototypeOf(async function(){}).constructor` 得到它，并且可以用它来构造 `async` 函数 `new AsyncFunction([arg1[, arg2[, ...argN]],] functionBody)`。

`async` 有很多使用形式，既可以用作函数声明，也可以用作函数表达式，还可以作为对象的方法。

```javascript
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {};

// 对象的方法
let obj = { async foo() {} };
obj.foo().then(val => val);

// Class 的方法
class Storage {
    constructor() {
        this.cachePromise = caches.open('avatars');
    }
    async getAvatar(name) {
        const cache = await this.cachePromise;
        return cache.match(`/avatars/${name}.jpg`);
    }
}
storage.getAvatar('jake').then(val => val);

// 箭头函数
const foo = async () => {};
```

`async` 函数返回一个 `Promise` 对象（如果一个 `async` 函数的返回值看起来不是 `promise`，那么它将会被隐式地包装在一个 `promise` 中)，可以使用 `then` 方法添加回调函数。当函数执行的时候，一旦遇到 `await` 就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。`async` 函数返回一个 `Promise` 对象。`async` 函数内部 `return` 语句返回的值，会成为 `then` 方法回调函数的参数。

`await` 操作符用于等待一个 `Promise` 对象。它只能在异步函数 `async function` 中使用。`await` 表达式会暂停当前 `async function` 的执行，等待 `Promise` 处理完成。若 `Promise` 正常处理(`fulfilled`)，其回调的 `resolve` 函数参数作为 `await` 表达式的值，继续执行 `async function`。若 `Promise` 处理异常(`rejected`)，`await` 表达式会把 `Promise` 的异常原因抛出。另外，如果 `await` 操作符后的表达式的值不是一个 `Promise`，`await` 会把该值转换为已 `resolve` 的 `Promise`，然后等待其处理结果。

使用 `async / await` 关键字就可以在异步代码中使用普通的 `try / catch` 代码块。因为同步或者异步代码出错都会将 `Promise` 进行 `reject` 返回。

`async/await` 的目的为了简化使用基于 `promise` 的 `API` 时所需的语法。`async/await` 的行为就好像搭配使用了生成器和 `promise`。

`async` 函数的函数体可以被看作是由 `0` 个或者多个 `await` 表达式分割开来的。从第一行代码直到（并包括）第一个 `await` 表达式（如果有的话）都是同步运行的。这样的话，一个不含 `await` 表达式的 `async` 函数是会同步运行的。然而，如果函数体内有一个 `await` 表达式，`async` 函数就一定会异步执行。

```javascript
async function k() {
    console.log(123);
    let m = await 3;
    return m;
}

k().then(val => console.log(val));

console.log('end');
// 123
// end
// 3
```

`async` 函数内部抛出错误，会导致返回的 `Promise` 对象变为 `reject` 状态。抛出的错误对象会被 `catch` 方法回调函数接收到。

```javascript
async function f() {
    throw new Error('出错了');
}
f().then(
    v => console.log(v),
    e => console.log(e),
);
// Error: 出错了
```

`async` 函数返回的 `Promise` 对象，必须等到内部所有 `await` 命令后面的 `Promise` 对象执行完，才会发生状态改变，除非遇到 `return` 语句或者抛出错误。 也就是说，只有 `async` 函数内部的异步操作执行完，才会执行 `then` 方法指定的回调函数。

```javascript
async function getTitle(url) {
    let response = await fetch(url);
    let html = await response.text();
    return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}
getTitle('https://tc39.github.io/ecma262/').then(console.log); 
// "ECMAScript 2017 Language Specification"
```

上面代码中，函数 `getTitle` 内部有三个操作:抓取网页、取出文本、匹配页面标题。只有这三个操作全部完成，才会执行 `then` 方法里面的 `console.log`。

`await` 命令后面是一个 `Promise` 对象。如果不是，会被转成一个立即 `resolve` 的 `Promise` 对象。

```javascript
async function f() {
    return await 123;
}
f().then(v => console.log(v)); // 123
```

`await` 命令后面的 `Promise` 对象如果变为 `reject` 状态，则 `reject` 的参数会 被外部的 `catch` 方法的回调函数接收到。`reject` 的 `Promise` 不需要 `return`，`catch` 也能接收到 `reject` 的参数，在 `await` 前加上 `return` 效果一样。

```javascript
async function f() {
    await Promise.reject('出错了');
}
f()
    .then(v => console.log(v))
    .catch(e => console.log(e)); // 出错了
```

只要一个 `await` 语句后面的 `Promise` 变为 `reject` ，那么整个 `async` 函数都会中断执行。

```javascript
async function f() {
    await Promise.reject('出错了');
    await Promise.resolve('hello world'); // 不会执行
}
```

如果我们希望一个 `await` 即使 `reject` 了也不要中断执行，那么我们有两种解决办法，一种是将这个 `await` 包裹早一个 `try ... catch` 中。另一种方法是将 `await` 后面的 `Promise` 用一个链式的 `catch` 捕捉 `reject`。

```javascript
async function f() {
    try {
        await Promise.reject('出错了');
    } catch (e) {}
    return await Promise.resolve('hello world');
}
f().then(v => console.log(v)); // hello world

async function f() {
    await Promise.reject('出错了').catch(e => console.log(e));
    return await Promise.resolve('hello world');
}
f().then(v => console.log(v)); // 出错了
// hello world
```

如果 `await` 后面的异步操作抛错，那么等同于 `async` 函数返回的 `Promise` 对象被 `reject`。要防止 `async` 因为抛错而中断执行，解决方法依然和上面一样用 `try ... catch` 包裹，或者对 `await` 后面的 `Promise` 加上 `catch`。

```javascript
async function f() {
    await new Promise(function (resolve, reject) {
        throw new Error('出错了');
    });
}
f()
    .then(v => console.log(v))
    .catch(e => console.log(e)); // Error:出错了
```

还有一个注意要点就是 `await` 只能在 `async` 函数中使用，这里要注意嵌套关系。比如下面这种情况：

```javascript
async function dbFuc(db) {
    let docs = [{}, {}, {}];
    // 报错
    docs.forEach(function (doc) {
        await db.post(doc);
    });
}
```

`await` 实际上是写在 `forEach` 的回调函数中，虽然外层的函数是 `async`，但是 `forEach` 的回调函数并不是 `async` 函数。同时我们还要注意，上面的这种 `forEach` 写法最后所有的任务是并发执行的，而不是继发。因为 `forEach` 的每个回调函数都是立即执行的，是同步的，如果我们想要实现继发的效果，需要使用 `for` 循环。

```javascript
async function dbFuc(db) {
    let docs = [{}, {}, {}];
    for (let doc of docs) {
        await db.post(doc);
    }
}
```

想要实现并发，还是像上面一样同步执行异步任务，`await` 异步任务返回的 `Promise` 或者直接使用 `Promise.all`。

## async/await 原理

我们已经可以很明显的看出，`async` 是结合了 `Promise` 和生成器的一个语法糖，它的目的就是为了优化 `Promise` 的使用方法。`async` 函数的实现原理，就是将 `Generator` 函数和自动执行器，包装在一个函数里。

```javascript
async function fn(args) {
    // ...
}
// 等同于
function fn(args) {
    return spawn(function* () {
        // ...
    });
}

function spawn(genF) {
    return new Promise(function (resolve, reject) {
        var gen = genF();
        function step(nextF) {
            try {
                var next = nextF();
            } catch (e) {
                return reject(e);
            }
            if (next.done) {
                return resolve(next.value);
            }
            Promise.resolve(next.value).then(
                function (v) {
                    step(function () {
                        return gen.next(v);
                    });
                },
                function (e) {
                    step(function () {
                        return gen.throw(e);
                    });
                },
            );
        }
        step(function () {
            return gen.next(undefined);
        });
    });
}
```

这个 `spawn` 就是一个自动执行器，它是对 `co` 的一个简化，关于 `co` 的源码分析可以看 [生成器 Generator 的异步应用](https://www.clloz.com/programming/front-end/js/2020/11/01/generator-async/#co "生成器 Generator 的异步应用")。所有的 `async` 函数都可以写成上面的第二种形式，其中的 `spawn` 函数就是自动执行器。

## 继发和并发问题

我在上文已经说了一些继发和并发的例子和处理方式，这里在详细说一下这个比较重要的问题。

由于 `await` 是有先后执行顺序的，也就是继发的。但我们的业务逻辑并不会是简单的继发或者并发，很可能是比较混杂的，我们需要自己分析好依赖关系然后再用 `async` 函数处理。比如如下的例子：

```javascript
(async () => {
    const listData = await getList();
    const anotherListData = await getAnotherList();

    // do something

    await submit(listData);
    await submit(anotherListData);
})();
```

`getList` 和 `getAnotherList` 是没有依赖关系的，但是 `submit` 需要依赖两者返回的数据，这种情况我们需要像如下处理：

```javascript
async function handleList() {
    const listPromise = await getList();
    // ...
    await submit(listData);
}

async function handleAnotherList() {
    const anotherListPromise = await getAnotherList();
    // ...
    await submit(anotherListData);
}

// 方法一
(async () => {
    const handleListPromise = handleList();
    const handleAnotherListPromise = handleAnotherList();
    await handleListPromise;
    await handleAnotherListPromise;
})()(
    // 方法二
    async () => {
        Promise.all([handleList(), handleAnotherList()]).then();
    },
)();
```

也就是分析清除依赖关系，把不相关的逻辑分开，并发执行。只有互相依赖的异步任务采用 `await` 进行继发执行。

一把来说，实现继发我们就依次写 `await` 就行了。并发则是直接执行或者用 `Promise.all`。比如给定一个 `url` 数组如何实现继发和并发的请求。

```javascript
// 继发一
async function loadData() {
    var res1 = await fetch(url1);
    var res2 = await fetch(url2);
    var res3 = await fetch(url3);
    return 'whew all done';
}

// 继发二
async function loadData(urls) {
    for (const url of urls) {
        const response = await fetch(url);
        console.log(await response.text());
    }
}
```

```javascript
// 并发一
async function loadData() {
    var res = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]);
    return 'whew all done';
}
// 并发二
async function loadData(urls) {
    // 并发读取 url
    const promises = urls.map(url => {
        return fetch(url);
    });

    // 按次序输出
    for (const promise of promises) {
        console.log(await promise);
    }
}
```

## 异步遍历器

未完待续...

## 参考文章

1. [我们来聊聊 async](https://github.com/mqyqingfeng/Blog/issues/100 "我们来聊聊 async")
2. 《ES6 标准入门》—— 阮一峰
3. MDN