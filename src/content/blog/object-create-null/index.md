---
title: 'Object.create(null) 和 {...}'
publishDate: '2020-09-10 12:00:00'
description: ''
tags:
  - js
  - 实用技巧
  - 编程技巧
language: '中文'
heroImage: {"src":"./javascript-logo.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

我们会在一些框架的源码中看到作者用 `Object.create(null)` 来初始化一个新的对象，和我们平常使用的对象字面量 `{}` 不同。本文讲解一下这两者的区别。

## 对象初始化

在 `JavaScript` 中初始化对象的方法有三种：`Object.create()`，`new Object()` 和字面量标记。我们分别来讲一讲三者的区别。

## Object.create()

`Object.create()` 方法接受两个参数，一个是新对象的原型对象，一个是要添加到新对象的属性（可选，是一个对象，添加的属性默认不可枚举，属性的形式参考 `Object.defineProperty()`）。返回值一个新对象，带着指定的原型对象和属性。

`Object.create()` 内部的原理参考 `MDN` 的实现：

```javascript
//请注意，尽管在 ES5 中 Object.create支持设置为[[Prototype]]为null，但因为那些ECMAScript5以前版本限制，此 polyfill 无法支持该特性。
if (typeof Object.create !== "function") {
    Object.create = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }

        if (typeof propertiesObject !== 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");

        function F() {}
        F.prototype = proto;

        return new F();
    };
}
```

`Object.create()` 可以帮我们实现继承，并且配置属性特性。也可以结合 `Object.assign()` 来实现多继承。

```javascript
function MyClass() {
     SuperClass.call(this);
     OtherSuperClass.call(this);
}

// 继承一个类
MyClass.prototype = Object.create(SuperClass.prototype);
// 混合其它
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// 重新指定constructor
MyClass.prototype.constructor = MyClass;

MyClass.prototype.myMethod = function() {
     // do a thing
};
```

## new Object()

在 `JavaScript` 中，几乎所有的对象都是 `Object` 类型的实例，它们都会从 `Object.prototype` 继承属性和方法。`Object` 构造函数为给定值创建一个对象包装器。用 `Object` 构造函数创建新的对象，参数接收任何值，但是根据值的不同会产生不同的对象。

- 如果给定值是 `null` 或 `undefined`，将会创建并返回一个空对象（没有给定值也可以认为是 `undefined`）
- 如果传进去的是一个基本类型的值，则会构造其包装类型的对象
- 如果传进去的是引用类型的值，仍然会返回这个值，经他们复制的变量保有和源对象相同的引用地址
- 当以非构造函数形式被调用时，`Object` 的行为等同于 `new Object()`。

在实际编码中我们很少用到这种方式初始化对象。

## 对象字面量

一个对象初始化器，由花括号`{}` 包含的一个由零个或多个对象属性名和其关联值组成的一个逗号分隔的列表构成。这是我们最常使用的一种初始化对象的方式。之所以使用最频繁，是因为他是最方便的一种创建对象的方式。我们可以在创建对象的时候同时创建属性，并且在 `ES6` 之后，字面量方式创建对象添加了更多支持，包括扩展运算符，计算属性名等。

定义属性为 `__proto__:` 值 或 `"__proto__":` 值 时，不会创建名为 `__proto__` 属性。如果给出的值是对象或者 `null`，那么对象的 `[[Prototype]]` 会被设置为给出的值。注意的是一定要使用冒号的方式定义，不使用冒号标记的属性定义，不会变更对象的原型；而是和其他具有不同名字的属性一样是普通属性定义。下面这些形式都不可以。

```javascript
var __proto__ = "variable";

var obj1 = { __proto__ };
console.log(Object.getPrototypeOf(obj1) === Object.prototype); //true
console.log(obj1.hasOwnProperty("__proto__")); //true
console.log(obj1.__proto__ === "variable"); //true

var obj2 = { __proto__() { return "hello"; } };
console.log(obj2.__proto__() === "hello"); //true

var obj3 = { ["__prot" + "o__"]: 17 };
console.log(obj3.__proto__ === 17); //true
```

还有一点就是对象字面量虽然和 `JSON` 很像，但他们不是同一个东西，主要不同点有以下：

- `JSON` 只允许 `"property": value syntax` 形式的属性定义。属性名必须用双引号括起来。且属性定义不允许使用简便写法。
- `JSON` 中，属性的值仅允许字符串，数字，数组，`true`，`false`，`null` 或其他（`JSON`）对象。
- `JSON` 中，不允许将值设置为函数。
- `Date` 等对象，经 `JSON.parse()` 处理后，会变成字符串。
- `JSON.parse()` 不会处理计算的属性名，会当做错误抛出。

## Object.create(null) 和 {...}

最后来说一说 `Object.create(null)` 和 `{...}` 的区别。

其实很简单，`{}` 是一个继承自 `Object.prototype` 的空对象，它能够使用 `Object.prototype` 上定义的一些方法，比如 `hasOwnProperty()`，`toString()` 等。他的结果和 `new Object()`（可以传 `null` 或者 `undefined` 做参数） 或者 `Object.create(Object.prototype)` 是一样的。

而 `Object.create(null)` 是以继承自 `null` 的对象，它是一个没有任何属性，包括 `[[prototype]]`，包括原型的非常**“干净”** 的对象，和 `{__porot__: null}` 是一样的（不建议用这种方式设置原型）。在 `chrome` 中打印这个对象然后展开会显示 `No properties`。

所以他们唯一的区别就是一个有 `[[prototype]]`，另一个没有。不过我个人认为这是没什么影响的，定义和原型上同名的方法会覆盖原型的方法，而且 `Object.prototype` 上的所有属性和方法都是不可枚举的，所以 `for ... in` 也是不会访问到多原型上的属性。两者之间应该也没有很大的性能差异。我也是在想不出有什么不得不用 `Object.create(null)` 的场景，除非你不希望自己的对象上有除了自己定义以外的能访问的属性🤔。

所以我觉得日常编码中使用哪个都可以，对象字面量肯定更方便。`Object.create(null)` 可以创建一个更干净的对象，但是由于 `Object.prototpye` 上的属性都不可枚举，其实也不会产生影响，可以放心使用。

## 参考文章

1. [Object - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object "Object - MDN")
2. [对象字面量](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer "对象字面量")
3. [Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create "Object.create()")
4. [详解 Object.create(null)](https://juejin.im/post/6844903589815517192 "详解 Object.create(null)")