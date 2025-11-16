---
title: 'HTML attribute 和 DOM property 的区别'
publishDate: '2019-05-11 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
---

\[toc\]

## 前言

`jQuery` 对象有两个方法 `$(selector).prop()` 和 `$(selector).attr()`，这两个方法分别对应 `DOM` 对象的 `property` 属性和 `HTML` 标签的 `attribute`。那么 `property` 和 `attribute` 之间有什么区别呢，一般为了区分我们把 `property` 翻译为属性，而把 `attribute` 翻译为特性。在 `JS` 中这两者还是存在一定的差异的。

## 语意

`property` 我们可以理解为事物本身的属性，与身俱来的，比如我们的头发是蛋白质构成的，那么蛋白质可以称为一个属性，这不可改变，改变了头发就不是头发了。

`attribute` 可以认为是附加在物体上的一些特性，比如我们可以改变头发的物理形状，烫卷拉直，或者改变头发的颜色，这样头发还是头发，但是外观变了。

在前端领域，我们可以认为 `property` 是一个 `DOM` 对象创建的时候就会初始化在对象中的一些属性（我们也可以自定义属性），而 `attribute` 是附在 `HTML` 文档中的某个元素上的特性，我们可以改变删除自定义一个特性，但是对 `property` 不可以，对于 `DOM` 内置的属性我们无法删除，也只能按照规定类型赋值，并且内置属性会在每次 `DOM` 对象初始化的时候产生，比如 `name` 属性，无论我们设置什么类型的值，最后返回的都是字符类型。但是对于我们自定义的 `DOM` 属性，则可以是任何 `JS` 支持的数据类型，而 `attribute` 的数据类型只能是字符串。

> `node.getAttribute(attr)` 中的参数 `attr` 是大小写不敏感的。

## 两者之间的关系

对于非自定义的 `attribute` 特性，它和 `property` 之间有一一对应的关系，比如：`id`，`class`，`title等`。

```html
<div id="test" class="button" foo="1"></div>
<script>
    document.getElementById('test').id; // return string: "test"
    document.getElementById('test').className; // return string: "button"
    document.getElementById('test').foo; // return undefined 因为foo是一个自定义的attr特性
</script>
```

> 当我们通过 `property` 属性进行设置或获取 `class` 时，我们需要使用 `className` ，因为在 `js` 中 `class` 是关键字。

`DOM` 对象内置的 `property` 改变的时候通常对应的 `attribute` 也会改变。

```html
<div id="test" class="button"></div>
<script>
    var div = document.getElementById('test');
    div.className = 'red-input';
    div.getAttribute('class'); // return string: "red-input"
    div.setAttribute('class','green-input');
    div.className; // return string: "green-input"
</script>
```

## 一些特殊情况

## href

当我们在 `HTML` 中设置元素的 `href` 属性的时候，`getAttribute()` 方法返回的是我们设置的字符串，不管这是一个相对路径还是绝对路径，而 `node.href` 属性则是获得的能够访问的绝对路径。

## input 的 value

当我们在 `HTML` 中设置 `input` 的 `value` 的时候，这个 `value` 只是给了 `input` 一个初始化的值，`property` 也被这个值初始化，但当我们改变 `property` 的时候，元素内的文本会被改变，但是 `attribute` 的 `value` 是不变的，它相当于保存这这个元素的初始化状态。

## 布尔型属性

因为 `attribute` 的值只能是字符串，当我们设置的 `attribute` 默认是一个布尔型的值的时候，不论我们是否设置值以及设置什么值，他的初始化值都是 `true`，比如 `disabled` 和 `checked`。并且我们只能通过 `property` 来修改他们。

## 如何使用

对于非自定义 `attribute` 使用 `property` 是一种比较安全并且有效率的做法，虽然对于 `id`， `class` 等会跟随 `property` 一起变化的属性我们也可以用 `getAttribute()` 或者 `setAttribute()` ，不过显然 `property` 是更好的选择。对于自定义属性，我们只能选择用 `attribtue` 的方法。

## 参考文章

1. [\[译\]HTML attribute与DOM property之间的区别？](https://segmentfault.com/a/1190000008781121 "[译]HTML attribute与DOM property之间的区别？")
2. [DOM 中 Property 和 Attribute 的区别](https://www.cnblogs.com/elcarim5efil/p/4698980.html "DOM 中 Property 和 Attribute 的区别")