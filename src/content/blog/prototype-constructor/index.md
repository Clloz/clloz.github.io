---
title: '关于prototype和constructor的思考'
publishDate: '2019-05-31 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
---

## 前言

今天在看 `get` 和 `set` 语法的时候在知乎上看到一个提问，具体内容看下面的代码

```javascript
function Dog() {
  this.tail = true
}
Dog.prototype.say = function () {
  return 'Woof'
}
var dog = new Dog()
dog.say() // "Woof"
dog.constructor // Dog()
Dog.prototype = {
  paws: 4
}
var newDog = new Dog()

newDog.constructor // ƒ Object() { [native code] }
typeof newDog.constructor.prototype.paws // "undefined"
typeof dog.constructor.prototype.paws // "number"
```

题主对这几个输出的结果比较疑惑，我也来分析一下这几个结果，看看自己对原型这部分知识掌握得如何。

## 分析图

要搞清楚这些对象之间的关系，我们来画一画这些对象的关系图

![prototype-issue](./images/prototype-issue1.png 'prototype-issue')

图中不同类型的连线我已经用不同颜色标注出来，还是可以清楚的看出我们的各个对象之间的关系的。对象被我分成了三行，下面的分析中有时我会用第几行来说名对象的位置。

## 细节

## 问题 1

第一个问题 `newDog.constructor`，我们先来看看 `new` 做了几件事

1. 创建一个新的空对象
2. 把新对象的 `__proto__` 链接到构造函数的 `prototype` 对象（每一个函数都有一个 `prototype` 属性指向一个对象，该对象有一个 `constructor` 属性指向该函数）
3. 将第一步创建的新的对象作为 `this`的上下文
4. 执行构造函数，如果构造函数没有返回值或者返回值不是一个对象，则返回 `this`

通过上面的步骤我们可以知道我们的 `newDog` 对象有一个 `__proto__` 属性指向代码中的 `{paws: 4}` 这个对象，因为在代码中我们人为地将构造函数的 `prototype` 引用改变了，它现在指向了一个我们自定义的对象。需要注意的是，我们上面的步骤中说函数的 `prototype` 指向的对象有一个 `constructor` 属性指向函数，这种情况只限于引擎自动生成的 `prototype` 对象，对于我们自己创建的对象是没有该属性的。

可能有些同学有个疑问就是通过构造函数实例化的对象（比如代码中的 `dog` 和 `newDog` ）是否有 `constructor` 属性呢？答案是没有，虽然我们经常看到有这样的用法，但是其实访问的是原型链上的某个 `prototype` 对象中的 `constructor` 属性。那么我们代码中的 `newDog.constructor` 是哪一个呢？

从图中我们可以看出 `newDog` 对象的 `__proto__` 指向了自定义的 `prototype` 对象（第二行第三个），我们的 `newDog` 和这个自定义的对象中都没有 `constructor` 的属性，那么引擎自然会沿着原型链继续寻找。自定义对象的构造函数是 `Object` 对象（也就是`ƒ Object() { [native code] }`，这是引擎底层函数，用 `C++` 编写），是函数自然就有 `prototype` 属性，这个属性指向的对象也是 `newDog` 原型链上的一个对象，并且它有 `constructor` 属性，指向 `Object` 对象，结果出来了，`newDog.constructor` 就是 `ƒ Object() { [native code] }`

> 实例化对象中没有 `constructor` 属性很好验证，用 `hasOwnProperty` 方法即可。另外提一点就是引擎沿着原型链搜索属性，`Object.prototype` 是最后一环，这里就是原型链的终点，`Object.prototype.__proto__ === null`。

## 问题 2

其实解决了问题 `1`，问题 `2` 也就迎刃而解了，`typeof newDog.constructor.prototype.paws` 等价于 `Object.prototype.paws`，显然这个属性是不存在的。

## 问题 3

问题 `3` 的核心是当我们手动改变了构造函数的 `prototype` 指向，之前实例化的对象的 `__proto__` 指向会改变吗？从图中的对象关系和代码运行结果我们可以得出否定的结论。`dog.__proto__` 此时依然指向 `prototype` 改变之前由引擎自动生成的对象，该对象中的 `constructor` 属性指向 `Dog` 构造函数，`dog.constructor.prototype.paws` 此时等价与 `Dog.prototype.paws`，`Dog.prototype` 此时指向 `{paws: 4}`，自然能够获取该属性。

## 总结

我们在构造函数原型上添加方法的时候尽量使用 `Obj.prototype.xxx` 的方式，而不要覆盖原型对象，这样会导致很多问题。即使在需要覆盖的时候，也要给新对象加上 `constructor` 属性。
