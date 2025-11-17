---
title: '三栏布局'
publishDate: '2018-08-29 12:00:00'
description: ''
tags:
  - css
  - 编程技巧
language: '中文'
heroImage: { 'src': './css.jpg', 'color': '#B4C6DA' }
---

## 前言

三栏布局是应用最广泛的布局之一，一般是左右两侧固定宽度，中间自适应的方式。下面介绍几种三栏布局的解决方案和细节。

## 基础HTML结构和样式

不同的方法 `HTML` 结构顺序会有不同，但是基本都是 `左中右` 三个部分，能够提取的样式主要是背景色，字体，宽高，内边距，盒模型。样式如下：

```css
.wrap {
  height: 250px;
  margin-top: 30px;
  position: relative;
  font-size: 30px;
  color: white;
}
.wrap .left,
.wrap .right {
  width: 200px;
  height: 200px;
}
.wrap .left {
  background-color: pink;
}
.wrap .right {
  background-color: lightblue;
}
.wrap .middle {
  background-color: lightgreen;
  padding: 10px;
  box-sizing: border-box;
  height: 100%;
}
```

## float方案

左右侧元素 `float`，中间元素用 `margin` 给两侧元素预留空间。需要注意的是 `HTML` 结构需要是 `左右中` 的顺序，流内元素无法感知浮动元素，但是浮动元素可以感知流内元素，如果中间的流内元素先渲染好了，那么最后的浮动元素将会渲染在下一行，因为该行已经没有空间了。`HTML` 结构如下：

```html
<div class="wrap eg1">
  <div class="left"></div>
  <div class="right"></div>
  <div class="middle">例一：左右元素float，中间元素margin</div>
</div>
```

样式如下：

```css
/* eg1 */
.eg1 .left {
  float: left;
}
.eg1 .right {
  float: right;
}
.eg1 .middle {
  margin: 0 210px;
}
```

## 绝对定位方案

和 `float` 类似，最好也采取左右中的结构，如果采取其他结构，注意定位属性 `top：0` 要加上。另外由于绝对定位元素完全脱离文档流，需要给父元素加上 `position: relative`，并且限定高度。`HTML` 结构如下：

```html
<div class="wrap eg2">
  <div class="left"></div>
  <div class="right"></div>
  <div class="middle">例二：左右元素绝对定位，中间元素margin</div>
</div>
```

样式如下：

```css
/* eg2 */
.eg2 .left {
  position: absolute;
  left: 0;
}
.eg2 .right {
  position: absolute;
  right: 0;
  top: 0;
}
.eg2 .middle {
  margin: 0 210px;
}
```

## flex布局

flex布局是最简单也是代码量最少的，兼容性也还不错。唯一的问题就是 `CSS3` 的新特性 `ie6-9` 不支持。`HTML` 结构如下：

```html
<div class="wrap wrap-flex eg3">
  <div class="left"></div>
  <div class="middle">例三：中间元素flex-grow为1，自动放大</div>
  <div class="right"></div>
</div>
```

样式如下：

```css
/* eg3 */
.wrap-flex {
  display: flex;
}
.eg3 .middle {
  flex: 1;
  margin: 0 10px;
}
```

## table方案

用表格布局来实现该需求，三个部分相当于三个单元格，`display: table-cell`。使用表格布局会使得三个部分高度统一，三个部分之间的缝隙需要用属性 `border-collapse border-spacing` 来设置，每个单元格的左右都会预留。在浏览器窗口宽度变化的时候，适应性较好，不会出现结构改变的现象。`HTML` 结构如下：

```html
<div class="wrap wrap-table eg4">
  <div class="left"></div>
  <div class="middle">
    例四：table布局，三栏高度一致，元素之间的缝隙只能通过border-collapse和border-spacing属性设置
  </div>
  <div class="right"></div>
</div>
```

样式如下：

```css
/* eg4 */
.wrap-table {
  display: table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 10px 0px;
}
.eg4 .left,
.eg4 .middle,
.eg4 .right {
  display: table-cell;
}
```

## inline-block和calc函数

和两栏布局时一样，`inline-block` 和 `calc函数` 也是一种解决方案，设置三个部分的 `display: inline-block`，中间元素的宽度用 `calc` 函数计算。同样需要注意 `inline-block` 的缝隙问题，设置父元素的 `font-size: 0`，因为三个部分的字体大小以及内边距可能有所不同，所以最好用 `vertical-align` 来确保三个元素的顶端对齐。`HTML` 结构如下：

```html
<div class="wrap wrap-inline eg5">
  <div class="left"></div>
  <div class="middle">例五： inline-block+calc函数和负margin</div>
  <div class="right"></div>
</div>
```

样式如下：

```css
/* eg5 */
.wrap-inline {
  margin-left: -10px;
  font-size: 0;
}
.wrap-inline div {
  display: inline-block;
  margin-left: 10px;
  vertical-align: top;
  font-size: 30px;
}
.wrap-inline .middle {
  width: calc(100% - 430px);
}
```

## 圣杯布局

圣杯布局的原理其实就是利用的 `float` 元素生成的 `BFC` 从左到右依次排列，利用宽度、负 `margin` 和定位来解决该问题。对于 `wrap` 元素，用 `padding` 预留出左右两个元素的空间，`middle元素` 第一个渲染，占满父元素，`left和right` 元素依次排在第二行。`left` 设置 `margin: -100%` 则左边界和 `middle` 的左边界对齐，再利用 `position: relative` 的定位属性 `left` 在确定 `left` 元素的位置。 `right` 元素用同样的原理，设置 `margin: -(自身宽度)`，再利用定位属性确定位置。圣杯布局有一个问题就是当 `middle` 的宽度小于左边元素的宽度时，就没有足够的空间排列三个元素，`left和right` 会被渲染到下一行。`HTML` 结构如下：

```html
<div class="wrap eg6">
  <div class="middle">例六： 圣杯布局</div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

样式如下：

```css
/* eg6 */
.eg6 {
  padding: 0 210px;
}
.eg6 div {
  float: left;
}
.eg6 .middle {
  width: 100%;
}
.eg6 .left {
  margin-left: -100%;
  position: relative;
  left: -210px;
}
.eg6 .right {
  margin-left: -200px;
  position: relative;
  left: 210px;
}
```

## 双飞翼布局

双飞翼布局是为了解决圣杯布局中 `middle` 宽度过小排列不下结构发生变化的问题。圣杯布局之所以会产生这种问题，本质上是因为我们在父元素上用 `padding` 给两边的元素预留空间，导致父元素的 `content` 区域变小，如果我们两侧的元素宽度比较大，那么父元素的 `padding` 就比较大，留下的空间自然就很小，可能无法排列三个元素了。双飞翼布局不再用 `padding` 来改变父元素内容的宽度，而是在 `middle` 中嵌套一层 `div.content`，这层 `div` 用 `margin` 来给左右元素预留空间，这样的话父元素和 `middle` 元素都有整个 `body` 的宽度，不会发生因为宽度不够而导致的结构改变的问题。同时因为父元素宽度未被限制，`left` 和 `right` 元素不再需要用定位属性来修改相对位置。`HTML` 结构如下：

```html
<div class="wrap eg7">
  <div class="middle">
    <div class="content">例七： 双飞翼布局</div>
  </div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

样式如下：

```css
/* eg7 */
.eg7 > div {
  float: left;
}
.eg7 .middle {
  width: 100%;
  padding: 0;
  background-color: transparent;
}
.eg7 .middle .content {
  margin: 0 210px;
  background-color: lightgreen;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.eg7 .left {
  margin-left: -100%;
}
.eg7 .right {
  margin-left: -200px;
}
```

> 本文示例代码查看[页面](https://www.clloz.com/study/3-colum.html)
