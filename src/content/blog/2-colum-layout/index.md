---
title: '左侧固定，右侧自适应的布局方案'
publishDate: '2018-12-24 12:00:00'
description: ''
tags:
  - css
  - 编程技巧
language: '中文'
---

## 前言

两栏布局是我们经常遇到的一种布局方式，实现两栏布局一般的需求是左侧固定宽度，右侧自适应，解决方法也多种多样，可以用 `float`，`inline-block`，配合 `calc` 来设置宽度，也可以用 `CSS3` 的新布局方法 `flex grid`，其实核心问题就是如何让两个元素在同一行并且合理分配他们的宽度。下面来总结一下不同的方法以及其中的细节和注意点。

## 基本布局和基本样式

虽然解决的方法各不相同，但是整个 `HTML` 的结构和一些必要的样式是一样，所以我们先把这个骨架搭好，后面只要给这个骨架一些小的装饰就可以完成功能了，这样对于我们的扩展和维护都比较有利。

两栏布局的结构非常简单，我们需要一个 `wrap` 和一左一右两个div就可以了，所以 `HTML` 结构如下：

```html
<div class="wrap">
  <div class="left"></div>
  <div class="right"></div>
</div>
```

然后我们要把一些在各种实现方式下都统一的样式提取出来，比如左侧的宽度，两个块之间的间距，字体，背景色，内边距等，本文我们设置左侧 `div` 宽度为 `200px`，两个 `div` 间距 `10px`，如果设置左右不同的 `border` 或者 `padding` 需要设置 `box-sizing： border-box`：

```css
.wrap {
  height: 200px;
  margin-top: 30px;
  position: relative;
}

.wrap .left,
.wrap .right {
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  color: white;
  font-size: 30px;
  line-height: 1.5;
}

.wrap .left {
  background-color: pink;
  width: 200px;
}

.wrap .right {
  background-color: #32afd8;
}
```

完成了基本框架我们就可以开始尝试各种不同的实现方法了。

## float+margin-left方案

要让两个元素在同一行我们首先想到的就是 `float`，宽度自适应是块级元素的特性。这个方案是设置左侧的div浮动，给右侧的 `div` 一个 `margin-left` 来实现的。块级元素有默认独占一行，并且填满父容器，随着父元素的宽度自适应的流动特性。而 `float` 元素会脱离 `normal flow`，后面的块级元素的布局会无视浮动元素的存在来渲染。所以我们只要让左侧的元素浮动，就能让两个块级元素存在在同一行，但是为了不让元素重叠，我们需要给左边的元素预留足够的距离以便两个元素都能完全展示出来，所以我们要为右边的元素设置 `margin-left`，值为左侧元素的宽度加上两个元素之间的距离。代码如下：

```css
.eg1 .left {
  float: left;
}

.eg1 .right {
  margin-left: 210px;
}
```

> 需要注意的是如果父元素没有设置高度，那么由于浮动的存在会发生高度塌陷，需要清除浮动。

## 双 float 方案

单个 `float` 可以，那么我们设置两个元素都是 `float` 自然也没问题，两个元素会在同一行，唯一的问题是元素浮动以后宽度是根据内容决定的，我们需要为右边的元素设置一个宽度，`calc` 函数可以帮我们解决这个问题。

```css
.eg3 .left,
.eg3 .right {
  float: left;
}

.eg3 .right {
  width: calc(100% - 210px);
  margin-left: 10px;
}

.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
```

> 这种方式同样需要注意父元素的清除浮动

方案缺点：

- 需要知道左侧元素的宽度和两个元素之间的距离，并且要设置 `box-sizing`
- 需要清除浮动

## inline-block 方案

`float` 和 `inline-block` 是非常相似的，一般用 `float` 可以解决的问题，`inline-block` 也一样可以，两栏布局同样可以用 `inline-block` 来解决。我们设置左右两个元素 `display： inline-block`，由于 `inline-block` 的特性，我们需要设置父元素的 `font-size： 0;` 以避免两个元素间的空格，同时因为两个元素的字体大小以及 `padding` 不同等原因，我们需要用 `vertical-align` 属性来对其两个元素。代码如下：

```css
.eg2 .left,
.eg2 .right {
  display: inline-block;
  vertical-align: top;
}

.eg2 .left {
  width: 200px;
}

.eg2 .right {
  width: calc(100% - 210px);
  margin-left: 10px;
}
```

> 对于vertical-align的细节不理解的可以看这篇[文章](https://www.clloz.com/programming/front-end/css/2018/08/29/line-heightvertical-align/ 'vertical-align')。

方案缺点：

- 需要知道左侧元素的宽度和两个元素之间的距离
- 需要解决 `inline-block` 缝隙问题
- 需要用 `vertical-aling` 来对齐元素

## absolute+margin-left方案

用绝对定位同样可以让两个块级元素在同一行排列，和 `float+margin-left` 的使用方法相似，浮动和绝对定位的区别是绝对定位完全脱离了文档流，而浮动依然保留了一些流动性。我们需要设置父元素的 `position` 为非 `static`，同时由于没有清除浮动类似的机制，我们必须为父元素限定 `min-height`，否则左侧元素的高度超出右侧元素的话，就会溢出。代码如下：

```css
.eg4 .left {
  position: absolute;
}

.eg4 .right {
  margin-left: 210px;
}
```

方案缺点：

- 需要设置父元素的 `position` 为非 `static`
- 需要限定高度

## float+BFC方案

`BFC` 有一个特性是不会和 `float` 元素重叠，利用这一特性，我们可以让左边的元素浮动，右边的元素生成一个新的 `BFC`，在给一个边距就实现了需求。代码如下：

```css
.eg5 .left {
  float: left;
  margin-right: 10px;
}

.eg5 .right {
  overflow: hidden;
}
```

> 需要注意，如果是用 `overflow` 来生成的 `BFC` 并使用 `margin-left` 来预留编剧必须加上左边元素的宽度。

## flex 布局方案

`flex` 可以说是最好的方案了，代码少，使用简单。有朝一日，大家都改用现代浏览器，就可以使用了。 需要注意的是，`flex` 容器的一个默认属性值 `align-items: stretch;` 。这个属性导致了列等高的效果。 为了让两个盒子高度自动，需要设置`align-items: flex-start;`代码如下：

```css
.wrap.wrap-flex {
  display: flex;
  align-items: flex-start;
}

.wrap.wrap-flex .left {
  flex: 0 0 auto;
}

.wrap.wrap-flex .right {
  flex: 1 1 auto;
  margin-left: 10px;
}
```

## 当父容器宽度放不下两个元素的情况

1. 双 `float` 和双 `inline-block` 方案右侧元素会移动到下一行，并根据 `calc` 函数计算宽度
2. 采用了 `margin-left` 的方案右侧元素会不可见，宽度为 `0`
3. `BFC` 方案右侧元素也会掉到下一行。
4. `flex` 方案依然会按照原来的布局显示

文中示例查看[页面](https://www.clloz.com/study/2-colum.html) 更直观的示例查看[页面](https://www.clloz.com/study/2-colum-layout.html)

## 参考文章

[七种实现左侧固定，右侧自适应两栏布局的方法](https://segmentfault.com/a/1190000010698609 '七种实现左侧固定，右侧自适应两栏布局的方法')
