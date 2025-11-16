---
title: 'ES6 的 Map Set WeakMap 和 WeakSet'
publishDate: '2020-07-29 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: {"src":"./javascript-logo.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

本文讲一讲 `ES6` 新增的两种数据结构，`Set` 和 `Map` 以及和它们相对应的 `WeakSet` 和 `WeakMap`。`Map` 和 `Set` 是两种非常中要的数据结构，在其他语言中都是一种预设机制。`JavaScript` 在 `ES6` 中也引入了这种数据结构。它们都有对应的数学概念，`Map` 表示的是映射，而 `Set` 表示的是集合，其实理清这两个概念也就大致了解了 `Map` 和 `Set` 是什么样的结构了，`Map` 是一种双射形式的映射，集合的概念就不同多接受了，三大特性：确定性，互异性，无序性。

在 `ES6` 之前，我们能使用的主要数据结构就是：

- 存储带键的数据（`keyed`）集合的对象。
- 存储有序集合的数组。

其实在底层的实现中，它们都是 `Map` 这种数据结构。下面我们来讲一讲这个新的 `Map` 和 `Set` 具体有哪些不同。

## Set

`Set` 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。`Set` 对象是值的集合，你可以按照插入的顺序迭代它的元素。 `Set` 中的元素只会出现一次，即 `Set` 中的元素是唯一的。

创建 `Set` 对象的方法是 `new Set([iterable])`，`new` 是必须的，`Set` 构造函数可以接受一个数组(或者具有 `iterable` 接口的其他数据结构)作为参数， 用来初始化，它的所有元素将不重复地被添加到新的 `Set` 中。如果不指定此参数或其值为 `null`，则新的 `Set` 为空。

向 `Set` 加入值的时候，不会发生类型转换，所以 `5` 和 `"5"` 是两个不同的值。`Set` 内部判断两个值是否不同，使用的算法叫做 `Same-value equality`，它类似于精确相等运算符( `===` )，主要的区别是 `NaN` 等于自身，而精确相等运算符认 为 `NaN` 不等于自身。

Set 结构的实例有以下属性。

- `Set.prototype.constructor`:构造函数，默认就是 `Set` 函数。
- `Set.prototype.size` ：返回实例的成员总数。
- `add(value)`:添加某个值，返回 `Set` 结构本身。支持链式添加
- `delete(value)`:删除某个值，返回一个布尔值，表示删除是否成功。
- `has(value)`:返回一个布尔值，表示该值是否为 Set 的成员。
- `clear()`:清除所有成员，没有返回值。
- `keys()`:返回键名的遍历器
- `value()`:返回键值的遍历器
- `entires()`:返回键值对的遍历器
- `forEach()`:使用回调函数遍历每个成员

`Array.from` 方法可以将 `Set` 结构转为数组。去除数组的重复成员 `[...new Set(array)]`.

`Set` 的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 `Set` 保存一个回调函数列表，调用时就能保证按照添加顺序调用。

`keys` 方法、 `values` 方法、 `entries` 方法返回的都是遍历器对象。由于 `Set` 结构没有键名，只有键值(或者说键名和键值 是同一个值)，所以 `keys` 方法和 `values` 方法的行为完全一致。`Set` 结构的实例默认可遍历，它的默认遍历器生成函数就是它的 `values` 方法。

`Set` 结构的实例的 `forEach` 方法，用于对每个成员执行某种操作，没有返回值。 `forEach` 方法的参数就是一个处理函数。该函数的参数依次为键 值、键名、集合本身。另外， `forEach` 方法还可以有第二个参数，表示绑定的 `this` 对象。

```javascript
let set = new Set([1, 2, 3]);
set.forEach((value, key) => console.log(value * 2) ) // 2
// 4
// 6
```

扩展运算符，数组的 `map`，`filter` 都可以用于 `Set`。

如果想在遍历操作中，同步改变原来的 `Set` 结构，目前没有直接的方法，但有两种 变通方法。一种是利用原 `Set` 结构映射出一个新的结构，然后赋值给原来的 `Set` 结 构;另一种是利用 `Array.from` 方法。

`Set` 转数组可以用 `Array.from()` 和 扩展运算符。

## WeakSet

`WeakSet` 结构与 `Set` 类似，也是不重复的值的集合。但是，它与 `Set` 有两个区 别。

- `WeakSet` 的成员只能是对象，而不能是其他类型的值，`null` 也不是一个合法的值。
- `WeakSet` 中的对象都是弱引用，即垃圾回收机制不考虑 `WeakSet` 对该对象 的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 `WeakSet` 之中。这也意味着 `WeakSet` 中没有存储当前对象的列表。 正因为这样，`WeakSet` 是不可枚举的（没有方法能给出所有的值）。

因此，`WeakSet` 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 `WeakSet` 里面的引用就会自动消失。由于上面这个特点，`WeakSet` 的成员是不适合引用的，因为它会随时消失。另外， 由于 `WeakSet` 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 `ES6` 规定 `WeakSet` 不可遍历。

创建一个 `WeakMap` 使用 `new WeakMap(value)`，`new` 不可以省略。如果传入一个可迭代对象作为参数, 则该对象的所有迭代值都会被自动添加进生成的 `WeakSet` 对象中。`null` 会被当做 `undefined`，即和没有传入参数一样，创建一个空的 `WeakSet`。

WeakSet 结构有以下三个方法。

- WeakSet.prototype.add(value):向 WeakSet 实例添加一个新成员。
- WeakSet.prototype.delete(value):清除 WeakSet 实例的指定成员。
- WeakSet.prototype.has(value):返回一个布尔值，表示某个值是否在 WeakSet 实例之中。

`WeakMap` 一个简单用法：

```javascript
const foos = new WeakSet()
class Foo {
    constructor() { 
        foos.add(this)
    }
    method () {
        if (!foos.has(this)) {
            throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用!');
        }
    }
}
```

`WeakSet` 的一个应用是可以用来检测对象的循环引用。

```javascript
// 对 传入的subject对象 内部存储的所有内容执行回调
function execRecursively(fn, subject, _refs = null) {
    if (!_refs) _refs = new WeakSet();

    // 避免无限递归
    if (_refs.has(subject)) return;

    fn(subject);
    if ('object' === typeof subject) {
        _refs.add(subject);
        for (let key in subject) execRecursively(fn, subject[key], _refs);
    }
}

const foo = {
    foo: 'Foo',
    bar: {
        bar: 'Bar',
    },
};

foo.bar.baz = foo; // 循环引用!
execRecursively(obj => console.log(obj), foo);
// { foo: 'Foo', bar: { bar: 'Bar', baz: [Circular] } }
// Foo
// { bar: 'Bar', baz: { foo: 'Foo', bar: [Circular] } }
// Bar
```

## Map

`JavaScript` 的对象(`Object`)，本质上是键值对的集合(`Hash` 结构)，但是传统上只能用字符串（现在加入了 `Symbol`）当作键。这给它的使用带来了很大的限制。为了解决这个问题，`ES6` 提供了 `Map` 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串或者 `Symbol`，各种类型的值(包括对象)都可以当作键。也就是说，`Object` 结构提供了“字符串为 `key` 的映射，`Map` 结构提供了任意值为 `key` 的映射，是一种更完善的 `Hash` 结构实现。如果你需要**键值对**的数据结构，`Map` 比 `Object` 更合适。`Map` 对象能够记住键的原始插入顺序。

`Map` 和 `Object` 的区别如下：

|  | `Map` | `Object` |
| --- | --- | --- |
| 意外的键 | `Map 默认情况不包含任何键。只包含显式插入的键。` | 一个 `Object` 有一个原型, 原型链上的键名有可能和你自己在对象上的设置的键名产生冲突。（也可以使用 `Object.create(null)` 创建一个没有原型的对象 |
| 键的类型 | 一个 `Map` 的键可以是任意值，包括函数、对象或任意基本类型。 | 一个 `Object` 的键必须是一个 `String` `或是Symbol`。 |
| 键的顺序 | `Map` 中的 `key` 是有序的。因此，当迭代的时候，一个 `Map` 对象以插入的顺序返回键值。 | 自 `ECMAScript 2015` 规范以来，对象保留了字符串和 `Symbol` 键的创建顺序； 因此，在只有字符串键的对象上进行迭代将按插入顺序产生键。 |
| `Size` | `Map` 的键值对个数可以轻易地通过 `size` 属性获取 | `Object` 的键值对个数只能手动计算 |
| 迭代 | `Map` 是 `iterable` 的，所以可以直接被迭代。 | 迭代一个 `Object` 需要以某种方式获取它的键然后才能迭代。 |
| 性能 | 在频繁增删键值对的场景下表现更好。 | 在频繁添加和删除键值对的场景下未作出优化。 |

Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞(`clash`)的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。

如果 `Map` 的键是一个简单类型的值(数字、字符串、布尔值)，则只要两个值严格相等，`Map` 将其视为一个键，比如 `0` 和 `-0` 就是一个键，布尔值 `true` 和字符串 `'true'` 则是两个不同的键。另外， `undefined` 和 `null` 也是两个不同的键。虽然 `NaN` 不严格相等于自身，但 `Map` 将其视为同一个键。

Map 的属性和方法：

- `size`：返回 Map 结构的成员总数。
- `set(key, value)`:设置键名 key 对应的键值为 value ，然后返回整个 Map 结构。如 果 已经有值，则键值会被更新，否则就新生成该键。
- `get(key)`:读取 key 对应的键值，如果找不到 key ，返回 undefined 。
- `has(key)`:返回一个布尔值，表示某个键是否在当前 Map 对象之中。
- `delete(key)`:删除某个键，返回 true 。如果删除失败，返回 false 。
- `clear()`:清除所有成员，没有返回值。
- `key()`:返回键名的遍历器。
- `value()`:返回键值的遍历器。
- `entries()`:返回所有成员的遍历器。
- `forEach()`:遍历 Map 的所有成员。

`Map` 的遍历顺序就是插入顺序。`map[Symbol.iterator] === map.entries`, `Map` 结构的默认遍历器接口 ( `Symbol.iterator`属性)，就是 `entries` 方法。一个 `Map` 对象在迭代时会根据对象中元素的插入顺序来进行， 一个 `for...of` 循环在每次迭代后会返回一个形式为 `[key，value]` 的数组。

`Map` 结构转为数组结构，比较快速的方法是使用扩展运算符。结合数组的 `map` 方法、`filter` 方法，可以实现 `Map` 的遍历和过滤(`Map` 本身没有 `map` 和 `filter` 方法)。

```javascript
const myMap = new Map().set(true, 7).set({ foo: 3 }, ['abc']);
[...myMap];
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]

//数组转为Map
new Map([
    [true, 7],
    [{ foo: 3 }, ['abc']],
]);
// Map {
// true => 7,
//   Object {foo: 3} => ['abc']
// }
```

如果所有 `Map` 的键都是字符串，它可以转为对象。

```javascript
function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
        obj[k] = v;
    }
    return obj;
}
const myMap = new Map().set('yes', true).set('no', false);
strMapToObj(myMap);
// { yes: true, no: false }

```

`Map` 转为 `JSON` 要区分两种情况。一种情况是，`Map` 的键名都是字符串，这时可以选择转为对象 `JSON`。

```javascript
function strMapToJson(strMap) {
    return JSON.stringify(strMapToObj(strMap));
}
let myMap = new Map().set('yes', true).set('no', false); 
strMapToJson(myMap)
// '{"yes":true,"no":false}'
```

另一种情况是，`Map` 的键名有非字符串，这时可以选择转为数组 `JSON`。

```javascript
function mapToArrayJson(map) { 
    return JSON.stringify([...map]);
}
let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']); 
mapToArrayJson(myMap)
// '[[true,7],[{"foo":3},["abc"]]]'
```

`Map` 的迭代：

```javascript
let myMap = new Map();
myMap.set(0, "zero");
myMap.set(1, "one");
for (let [key, value] of myMap) { //解构
  console.log(key + " = " + value);
}
// 将会显示两个log。一个是"0 = zero"另一个是"1 = one"

for (let key of myMap.keys()) {
  console.log(key);
}
// 将会显示两个log。 一个是 "0" 另一个是 "1"

for (let value of myMap.values()) {
  console.log(value);
}
// 将会显示两个log。 一个是 "zero" 另一个是 "one"

for (let [key, value] of myMap.entries()) {
  console.log(key + " = " + value);
}
// 将会显示两个log。 一个是 "0 = zero" 另一个是 "1 = one"

myMap.forEach(function(value, key) {
  console.log(key + " = " + value);
})
// 将会显示两个logs。 一个是 "0 = zero" 另一个是 "1 = one"
```

合并 `Map`:

```javascript
let original = new Map([
  [1, 'one']
]);

let clone = new Map(original);

console.log(clone.get(1)); // one
console.log(original === clone); // false. 浅比较 不为同一个对象的引用

//合并的 Map 中存在重复的键名，后面的会覆盖前者
let first = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let second = new Map([
  [1, 'uno'],
  [2, 'dos']
]);

// 合并两个Map对象时，如果有重复的键值，则后面的会覆盖前面的。
// 展开运算符本质上是将Map对象转换成数组。
let merged = new Map([...first, ...second]);

console.log(merged.get(1)); // uno
console.log(merged.get(2)); // dos
console.log(merged.get(3)); // three

//也可以与数组合并
let first = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let second = new Map([
  [1, 'uno'],
  [2, 'dos']
]);

// Map对象同数组进行合并时，如果有重复的键值，则后面的会覆盖前面的。
let merged = new Map([...first, ...second, [1, 'eins']]);

console.log(merged.get(1)); // eins
console.log(merged.get(2)); // dos
console.log(merged.get(3)); // three
```

## WeakMap

`WeakMap` 结构与 `Map` 结构类似，也是用于生成键值对的集合，其中的键是弱引用的。`WeakMap` 与 `Map` 的区别有两点。首先， `WeakMap` 只接受对象作为键名( `null` 除外)，不接受其他类型的值作为键名。其次，`WeakMap` 的键名所指向的对象，不计入垃圾回收机制。`WeakMap` 的 `key` 是不可枚举的 (没有方法能给出所有的 `key`)。

创建 `WeakMap` 的语法 `new WeakMap([iterable])`，`Iterable` 是一个数组（二元数组）或者其他可迭代的且其元素是键值对的对象。每个键值对会被加到新的 `WeakMap` 里。`null` 会被当做 `undefined`，即和没有传入参数一样，创建一个空的 `WeakMap`。

`WeakMap` 的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。请看下面的例子。

```javascript
const e1 = document.getElementById('foo');
const e2 = document.getElementById('bar');
const arr = [[e1, 'foo 元素'],[e2, 'bar 元素'], ];
```

上面代码中， `e1` 和 `e2` 是两个对象，我们通过 `arr` 数组对这两个对象添加一些 文字说明。这就形成了 `arr` 对 `e1` 和 `e2` 的引用。一旦不再需要这两个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放 `e1` 和 `e2` 占用的内存。

```javascript
// 不需要 e1 和 e2 的时候 // 必须手动删除引用
arr [0] = null;
arr [1] = null;
```

上面这样的写法显然很不方便。一旦忘了写，就会造成内存泄露。`WeakMap` 就是为了解决这个问题而诞生的，它的键名所引用的对象都是弱引用， 即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清 除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，`WeakMap` 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 `WeakMap`。

一个典型应用场景是，在网页的 `DOM` 元素上添加数据，就可以使 用 `WeakMap` 结构。当该 `DOM` 元素被清除，其所对应的 `WeakMap` 记录就会自动移除。

```javascript
const wm = new WeakMap();
const element = document.getElementById('example');
wm.set(element, 'some information'); 
wm.get(element) // "some information"
```

总之，`WeakMap` 的专用场合就是，它的键所对应的对象，可能会在将来消失。该数据结构有助于防止内存泄漏。注意，`WeakMap` 弱引用的只是键名，而不是键值。键值依然是正常引用。

`WeakMap` 只有四个方法可用: `get()、set() 、has() 、 delete()` 。

`WeakMap` 的一个例子： `myElement` 是一个 `DOM` 节点，每当发生 `click` 事件，就更新一 下状态。我们将这个状态作为键值放在 `WeakMap` 里，对应的键名就是 `myElement` 。一旦这个 `DOM` 节点删除，该状态就会自动消失，不存在内存泄漏风险。

```javascript
let myElement = document.getElementById('logo'); 
let myWeakmap = new WeakMap();

myWeakmap.set(myElement, {timesClicked: 0});

myElement.addEventListener('click', function() { 
    let logoData = myWeakmap.get(myElement); 
    logoData.timesClicked++;
}, false);
```

实现一个带有 `clear()` 方法的 `WeakMap` 类：

```javascript
class ClearableWeakMap {
    constructor(init) {
        this._wm = new WeakMap(init);
    }
    clear() {
        this._wm = new WeakMap();
    }
    delete(k) {
        return this._wm.delete(k);
    }
    get(k) {
        return this._wm.get(k);
    }
    has(k) {
        return this._wm.has(k);
    }
    set(k, v) {
        this._wm.set(k, v);
        return this;
    }
}
```

## 参考文章

1. 《ES6 标准入门》 —— 阮一峰
2. MDN
3. [深入理解 Set Map WeakSet WeakMap](https://github.com/frontend9/fe9-library/issues/275 "深入理解 Set")