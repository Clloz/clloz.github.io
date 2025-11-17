---
title: '拖动时禁止选中文字和元素'
publishDate: '2022-01-10 12:00:00'
description: ''
tags:
  - javascript
  - 学习笔记
language: '中文'
---

## 前言

在做一些和拖动相关的功能的时候，比如用到 `mousedown` 和 `mousemove` 的时候，会发现拖动会选中页面中的不相关的文字和图片，文字还好，就是难看一点，但是图片的选中可能会影响到我们的拖动功能。本文分享一下对于拖动时禁止选中文字和元素的方法。

## Demo

可以看一下我写的这个 [Demo](https://cdn.clloz.com/study/drag-selection.html)，红色方块是用来拖动的，你可以多触发几次 `mousedown`，`mousemove` 和 `mouseup`，拖动几次方块穿过右边的图片，有时候会发现右侧的图片被你拖走然后红色方块就一直跟着鼠标移动，即使你已经松开鼠标。

如果页面上有文本的话你会发现拖动的时候会随着鼠标的移动选择文本，这在显示效果上也不是很好，虽然不会像上面的图片一样影响到我们的功能。

## preventDefault

一个比较简单的办法就是在 `mousedown` 的回调函数中调用 `e.preventDefault()`，这样能够禁用 `mousedown` 的默认行为，我们的拖动不再会选中文本或者页面上的元素。

但是这个方法有一个问题，就是会导致我们的目标元素中的 `input` 或者 `textarea` 无法触发 `focus`，你点击输入框输入框中也不会出现光标，也就无法输入。因为输入框的 `focus` 就是通过 `mousedown` 触发的，而 `mousedown` 的默认行为被我们禁用了。

这当然不是一个常见的需求，一般我们拖动的元素中不太会出现输入框（不过我今天刚好就遇到了 :joy: ）。如果你需要在拖动元素中使用输入框，那么你就没法使用这个比较方便的方法了。

> 这里我没有找到合适的解决方案，如果你有好的解决方案，欢迎指教。

## CSS

还有一种实现方式就是使用 `CSS` 的 `user-select` 属性。

```css
* {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
  -webkit-user-select: none;
}
```

但是这样会导致文本始终不可选，我们比较想要的效果应该是拖动的时候不会选中，但在其他时候应该是可以选中的。我们可在 `mousedown` 触发的时候给 `body` 加上对应的样式，在 `mouseup` 触发的时候再去掉这个样式。

还有一个比较麻烦的点在于图片的可拖拽（点击图片并拖动会出现一张透明的图片）。有时我们的拖动会触发到图片的拖拽，会导致我们绑定的 `mouseup` 没有执行，在松开鼠标后拖动的元素还是会跟着我们的鼠标移动。`-webkit-user-select` 这个 `css` 属性可以帮我们禁止图片拖拽，但是这个属性的兼容性很不好，移动端是都不支持的。如果有兼容性要求可以使用 `img` 的 `draggable` 属性。

## 总结

目前测试能够使用的就这两种方法，都不够完美，如果你有好的解决方案欢迎讨论。

## 参考文章

1. [H5拖拽禁止选中文字](https://juejin.cn/post/6854573217021952008)
2. [How can I prevent text/element selection with cursor drag](https://stackoverflow.com/questions/5429827/how-can-i-prevent-text-element-selection-with-cursor-drag)
