---
title: 'ES6 迭代器 Iterator'
publishDate: '2020-08-18 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: {"src":"./javascript-logo.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

在 `ES6` 中我们可以用 `for ... of` 对很多对象进行遍历操作，包括数组，`Map`，`Set`，甚至是类数组对象和字符串都可以。之所以能够进行这样的操作是因为 `ES6` 引入了迭代器 `Iterator` 的机制，来为不同的数据结构提供一种统一的访问机制。本文就来讨论一下迭代器的机制。

## 概念

`ES6` 之前，我们遍历数组一般是使用 `for` 或者 `map`，`forEach` 等这样的 `API`。`for` 循环使用太麻烦，我们有时仅仅是需要数组中元素的值，但是我们需要提前知道数组的长度，并且声明一个索引变量，当出现嵌套的循环的时候，代码更复杂。而 `map` 和 `forEach` 等 `API` 则是 `Array` 对象特有的，使用起来也不够方便，比如无法中途跳出 `forEach` 循环， `break` 命令或 `return` 命令都不能奏效。。

所以 `ES6` 引入了迭代器和 `for ... of` 来统一和简化我们对对象的遍历。

* * *

要对对象进行遍历，首先要确定对象是否可遍历，以及如何进行遍历。`ES6` 就有两个协议：**可迭代协议** 和 **迭代器协议**。前者用来确定一个对象是可遍历的，后者告诉 `for ... of` 遍历对象的规则。

要确定一个对象是不是可迭代的，只要看看它有没有实现 `Symbol.iterator` 方法。`Symbol.iterator` 是一个内置 `Symbol`，它指向一个方法（即它是一个方法名），是专门供 `for ... of` 遍历使用的，当用 `for ... of` 对一个对象进行遍历的时候，就会首先寻找这个对象的 `Symbol.iterator` 方法。一个对象可遍历，就表示它自身或者其原型链上的某个对象实现了 `Symbol.iterator` 方法，这个方法是一个无参数的方法，其返回值为一个符合迭代器协议的对象。。这一些规则就是所谓的 **可迭代协议**。

`Symbol.iterator` 方法并不是没有要求的，这个方法必须要返回一个对象，这个对象必须实现了一个 `next` 方法。`next()` 方法必须返回一个对象，该对象应当有两个属性： `done` 和 `value`，如果返回了一个非对象值（比如 `false` 或 `undefined`），则会抛出一个 `TypeError` 异常（`iterator.next() returned a non-object value`）。这里的 `done` 是一个布尔值，表示迭代器是否还有下一个值。当迭代器还有下一个值，`done` 为 `false`，此时可省略；当迭代器已经遍历完毕，则此时 `done` 为 `true`。`value` 则表示迭代器的返回值，可以是任意 `javascript` 值，当 `done` 为 `true` 时刻省略。这就是 **迭代器协议**。

当一个对象满足上面两个协议的时候，就表示这个对象是可迭代对象，可以用 `for ... of` 对它进行遍历。当你将一个可迭代对象放入 `for ... of` 进行遍历的时候，会先调用这个对象的 `Symbol.iterator` 方法，然后用返回对象中的 `next` 方法不断对对象进行迭代，直到 `done` 为 `true`。

一个可迭代对象的实现如下：

```javascript
let obj = {
    num: 0,
    [Symbol.iterator]() {
        let num = this.num; //在 Symbol.iterator 中我们可以用 this 访问可迭代对象的属性，传递给 next，最后由 next 方法返回出去
        return {
            next() {
                if (num < 10) {
                    return {
                        value: num++,
                        done: false,
                    };
                } else {
                    return {
                        value: undefined,
                        done: true,
                    };
                }
            },
        };
    },
};

for (let c of obj) {
    console.log(c);
}
//输出：0 1 2 3 4 5 6 7 8 9
```

我们可以看到只要满足了可迭代协议和迭代协议，任何对象都能够用 `for ... of` 进行遍历，并且遍历行为是我们自定义的。其实 `for ... of` 的实现也很简单，就是一个 `while` 循环：

```javascript
function forOf(obj, cb) {
    if (!obj[Symbol.iterator]) throw new TypeError(typeof obj + ' is not iterable');
    if (typeof obj[Symbol.iterator] !== 'function')
        throw new TypeError('Result of the Symbol.iterator method is not an object');
    if (typeof cb !== 'function') throw new TypeError('cb must be callable');

    let iterator = obj[Symbol.iterator]();
    let result = iterator.next();
    while (!result.done) {
        cb(result.value);
        result = iterator.next();
    }
}

forOf(obj, function (val) {
    console.log(val);
});
```

但是这样将 `next` 写在 `Symbol.iterator` 方法的返回对象中我们没法直接用 `this` 访问 `obj` 的属性所以我们可以改成如下形式：

```javascript
let obj = {
    num: 0,
    [Symbol.iterator]() {
        return this;
    },
    next() {
        if (this.num < 10) {
            return {
                value: this.num++,
                done: false,
            };
        } else {
            return {
                value: undefined,
                done: true,
            };
        }
    },
};

for (let c of obj) {
    console.log(c);
}
```

从这个修改我们可以看出来，可迭代对象也可以是一个迭代器，这在后面还会应用到，生成器对象 `Generator` 其实是这种实现。

其实不止 `for ... of`，还有很多其他操作也是调用的迭代器进行遍历，包括对数组和 `Set` 的解构赋值，扩展运算符，`yield*`，以及任何接受数组作为参数的场景。而且很多内置的对象默认就是可迭代的，目前所有的内置可迭代对象如下：`String`、`Array`、`TypedArray`、`Map` 和 `Set`，它们的原型对象都实现了 `@@iterator` 方法。

```javascript
console.log(typeof 'clloz'[Symbol.iterator]); //function

let iterator = 'clloz'[Symbol.iterator]();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

// { value: 'c', done: false }
// { value: 'l', done: false }
// { value: 'l', done: false }
// { value: 'o', done: false }
// { value: 'z', done: false }
// { value: undefined, done: true }
```

* * *

很多 `API` 可以接受一个可迭代对象作为参数：

- `new Map([iterable])`
- `new WeakMap([iterable])`
- `new Set([iterable])`
- `new WeakSet([iterable])`
- `Promise.all(iterable)`
- `Promise.race(iterable)`
- `Array.from(iterable)`

## 内建迭代器

`for ... of` 调用的迭代器只能返回键值，但有时候我们希望能够返回键名，或者两者都需求。针对这种情况，`ES6` 为数组，`Map` 和 `Set` （其实 `Object` 也有这三个方法，不过不是返回迭代器）提供了三种不同的方法返回不同的迭代器：

- `entries()` 返回一个遍历器对象，用来遍历 `[键名, 键值]` 组成的数组。对于数组，键名就是索引值。
- `keys()` 返回一个遍历器对象，用来遍历所有的键名。
- `values()` 返回一个遍历器对象，用来遍历所有的键值。

对于数组，`for ... of` 依次返回数组的元素值，`keys()` 返回每个元素的索引，`values()` 返回每个元素的值，`entries()` 返回每个元素所以和值组成的数组。

对于 `Map`，`for ... of` 按插入顺序返回每个键值对组成的数组，`keys()` 按插入顺序返回每个键名，`values()` 按插入顺序返回每个键值，`entries()` 和 `for ... of` 相同。

```javascript
let m = new Map();
m.set(1, 'a');
m.set(2, 'b');
m.set(3, 'c');
m.set(4, 'd');

for (let c of m) {
    console.log(c);
}
// [ 1, 'a' ]
// [ 2, 'b' ]
// [ 3, 'c' ]
// [ 4, 'd' ]
for (let c of m.keys()) {
    console.log(c);
}
//1 2 3 4
for (let c of m.values()) {
    console.log(c);
}
//a b c d
for (let c of m.entries()) {
    console.log(c);
}
// [ 1, 'a' ]
// [ 2, 'b' ]
// [ 3, 'c' ]
// [ 4, 'd' ]
```

对于 `Set`，`for ... of`，`keys()` 和 `values()` 返回相同，说明 `Set` 结构的键名和键值是相同的， `entries()` 则和 `Map` 一样返回键名和键值组成的数组，只不过键名和键值相同。

```javascript
let s = new Set();
s.add('a');
s.add('b');
s.add('c');

for (let c of s) {
    console.log(c);
}
// a b c
for (let c of s.keys()) {
    console.log(c);
}
// a b c
for (let c of s.values()) {
    console.log(c);
}
//a b c
for (let c of s.entries()) {
    console.log(c);
}
// [ 'a', 'a' ]
// [ 'b', 'b' ]
// [ 'c', 'c' ]
```

其实我们可以看出，对于 `Set` 来说，默认调用的是 `values()` 来获得迭代器，而 `Map` 默认是调用 `entries()` 来获得默认迭代器。

这里一定要注意数组，`Map` 和 `Set` 的 `keys`，`values` 和 `entries` 方法返回的是一个迭代器，而 `Object` 的对应方法返回的是一个数组。我们可以利用这些方法返回的迭代器来设置对象的 `Symbol.iterator` 方法让对象变为可迭代对象。

```javascript
let obj = {
    nicknames: ['Jack', 'Jake', 'J-Dog'],
    [Symbol.iterator]() {
        console.log(Array.isArray(this.nicknames.entries()));
        return this.nicknames.entries();
    },
};

for (let c of obj) {
    console.log(c);
}
```

## 应用

迭代器的知识其实并不多也不复杂，上面的两个协议掌握即可，下面我来说一说一些应用。

## 实现链表

```javascript
function List(value) {
    this.value = value;
    this.next = null;
}

List.prototype[Symbol.iterator] = function () {
    let current = this;
    return {
        next() {
            if (current.next) {
                let value = current.value;
                current = current.next;
                return {
                    value: value,
                    done: false,
                };
            } else {
                return {
                    value: current.value,
                    done: true,
                };
            }
        },
    };
};
let a = new List('a');
let b = new List('b');
let c = new List('c');

a.next = b;
b.next = c;

for (let val of a) {
    console.log(val);
}

```