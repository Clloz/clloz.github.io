---
title: '理解CSS中的元素层叠中的细节'
publishDate: '2018-09-18 12:00:00'
description: ''
tags:
  - css
  - 编程技巧
language: '中文'
heroImage: { 'src': './css.jpg', 'color': '#B4C6DA' }
---

## 前言

我们经常用 `z-index` 来控制文档树中元素的堆叠顺序，不过这个属性有时候并不能工作地很好，可能你明明给两个元素分别设置了该属性，但是并没有如设想的一般按 `z-index` 的大小来堆叠，这是因为 `z-index` 只是堆叠渲染中的一个条件，下面我们来详细地说一下渲染树是怎么确定元素的层叠顺序的。

## 堆叠上下文

和我们的理解可能有点不同，在 `CSS2.2` 规范中，每一个盒子都是三维的，除了我们经常操纵的横向和纵向的位置，还有一条垂直于显示器的z轴，盒子沿着 `z` 轴按照一定的规则前后排列，当我们的元素在视觉上是重叠在一起的，那么元素在这个 `z` 轴上的位置就尤为重要，这也是我们经常遇到的需要调整元素在z轴上的前后关系，来达到我们预期的效果。`CSS2.2` 规范中是在[第九章](https://www.w3.org/TR/2016/WD-CSS22-20160412/visuren.html#layers '第九章')视觉格式化模型中对z-index的渲染规则进行说明的，首先要了解的一个概念就是堆叠上下文（`stacking context`），在 `css2` 的规范里面我们接触到了很多 `FC`（ `format context` ），都是很重要的渲染规则，这个堆叠上下文也不例外，元素的绘制顺序就是渲染树根据堆叠上下文确定的。堆叠上下文是能够互相嵌套的，而内部的堆叠上下文的堆叠等级是取决于他的父堆叠上下文的。从父堆叠上下文来看，内部的读堆叠上下文是原子的（ `atomic` ），任何其他堆叠上下文的盒不会出现在该堆叠上下文中，也就是说每一个盒都属于且仅属于一个堆叠上下文。`CSS2.2` 规范中并没有给出详细的形成层叠上下文的条件，不过[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context 'MDN')已经帮我们总结了：

- 文档根元素`<html>`
- `position` 值为 `absolute`（绝对定位）或 `relative`（相对定位）且 `z-index` 值不为 `auto` 的元素；
- `position` 值为 `fixed`（固定定位）或 `sticky`（粘滞定位）的元素（沾滞定位适配所有移动设备上的浏览器，但老的桌面浏览器不支持）；
- `flex` (`flexbox`) 容器的子元素，且 `z-index` 值不为 `auto`；
- `grid` (`grid`) 容器的子元素，且 `z-index` 值不为 `auto`；
- `opacity` 属性值小于 `1` 的元素；
- `mix-blend-mode` 属性值不为 `normal` 的元素；
- 以下任意属性值不为 `none` 的元素：
  - `transform`
  - `filter`
  - `perspective`
  - `clip-path`
  - `mask / mask-image / mask-border`

- `isolation` 属性值为 `isolate` 的元素；
- `-webkit-overflow-scrolling` 属性值为 `touch` 的元素；
- `will-change` 值设定了任一属性而该属性在 `non-initial` 值时会创建层叠上下文的元素（参考这篇文章）；
- `contain` 属性值为 `layout`、`paint` 或包含它们其中之一的合成值（比如 `contain`: `strict、contain: content`）的元素。

任何元素只要符合上述任一条件及形成一个心得层叠上下文。

> 虽然我们经常用 `z-index` 来控制元素的堆叠顺序，但是还是要强调 `z-index` 只是确定堆叠顺序中的一个条件，并不是全部，我们需要理解堆叠上下文，堆叠层级和堆叠顺序才能确定元素的渲染结果。

## 堆叠层级

在给定堆叠上下文中的定位元素（ `position` 不为 `static` ）都有一个堆叠层级（ `stack level` ）来确定他在z轴相对于该堆叠上下文中其他元素的位置，拥有更高层级的元素将更靠前。堆叠层级可以为负，同一个堆叠上下文中堆叠层级相同的盒按照文档树顺序从后向前堆叠，**同一个堆叠上下文中堆叠层级相同的盒按照文档树顺序从后向前堆叠**。前面我们也说了堆叠上下文是可以嵌套的，我们的子堆叠上下文的层叠等级是受制与父堆叠上下文的，而元素的堆叠等级也只在它所在层叠上下文是有意义的。我们经常会发现把一个元素的 `z-index`设置到很大但依然不能让他显示到某个元素的前面，那么很大的可能性是他和你所要比较的那个元素不在同一个堆叠上下文里面，也就是说，假设你的父堆叠上下文的堆叠等级是1，无论你怎么设置你当前元素的 `z-index`，他都不可能小于他的父堆叠上下文。

如果我们要比较两个元素在渲染上的先后顺序，我们就要先找到他们共有的父堆叠上下文，然后向下找到第一级的子堆叠上下文，比较他们的堆叠层级，就能够知道我们的目标元素的层叠顺序了。如下图 ![stack-level](./images/stack-level.png 'stack-level') 若我们要比较A和B的层叠顺序，那么我们首先要找到图中的公有父层叠上下文，然后找到A和B所在的子层叠上下文，比较他们的层叠等级，有两种情况：

1. 二者相同，那么遵循后来居上的原则，文档树中位于后面的元素将覆盖在前面元素之上
2. 二者不同，那么我们就可以直接确定A和B的层叠顺序了，因为子层叠上下文的层叠顺序首先是取决于父层叠上下文的，内部元素无论怎么设置都不可能突破父级的层叠等级。

## 堆叠顺序（stack order）

上面我们已经说了堆叠上下文是怎么形成的和堆叠上下文的一些特性以及堆叠层级的一些原则，那么一个堆叠上下文中的元素具体是按什么顺序排列的呢，`CSS2.2` 规范给出了具体的排列顺序。

1. the background and borders of the element forming the stacking context. 元素的background和border生成的堆叠上下文.
2. the child stacking contexts with negative stack levels (most negative first). 堆叠层级为负数的子级堆叠上下文（最负的优先）.
3. the in-flow, non-inline-level, non-positioned descendants. 流内的，非行内级，非定位（non-positioned ）后代.
4. the non-positioned floats. 非定位的浮动元素.
5. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks. 流内的，行内级，非定位后代，包括inline table和inline block.
6. the child stacking contexts with stack level 0 and the positioned descendants with stack level 0. 堆叠层级为0的子级堆叠上下文，以及堆叠层级为0的定位的后.
7. the child stacking contexts with positive stack levels (least positive first). 堆叠层级为正数的子级堆叠上下文（最小的优先）.

看下图（来源于张鑫旭博客）

![stack-order](./images/z-index.png 'stack-order') 这个绘制顺序被递归应用于每个堆叠上下文。

## z-index

`z-index` 属性只对定位元素有意义，只有在元素所在层叠上下文才有意义，`z-index` 属性的作用有两点:

1. 盒在当前堆叠上下文中的堆叠层级
2. 盒是否建立新的层叠上下文

关于 `z-index` 有两点要提一下，

1. `z-index` 只对定位元素有意义，如果你为一个非定位元素设置了 `z-index`，它不会生效。
2. `z-index: auto`和`z-index: 0`在渲染上都是位于第六层,但他们有个本质的区别，一个是堆叠层级为 `0`的子堆叠上下文，一个是堆叠层级为 `0` 的后代元素。

上面这两点如果没理解好的话会出很多问题，我写了一个例子帮助大家理解，[请点击](https://www.clloz.com/study/stack-context.html) 在例子中，我们有`ABC` 三个元素，其中 `BC` 是 `A` 的子元素

`A` 元素的 `CSS` 属性为

```css
.div1 {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 800px;
  height: 500px;
  margin: auto;
  background-color: lightblue;
  z-index: 0;
}
```

`B` 元素的属性为

```css
.div2 {
  width: 200px;
  height: 350px;
  background: lightgray;
  margin-left: 300px;
  margin-top: 75px;
  z-index: -2;
}
```

`C` 元素的属性为

```css
.div3 {
  width: 350px;
  height: 200px;
  background: lightcoral;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  z-index: -1;
}
```

我们可以看到 `A` 元素由于设置了 `position: absolute;` 已经是一个非定位元素，并且 `z-index: 0;` 已经形成了一个层叠上下文，而 `B` 元素只是一个普通的块级元素，`C` 元素是一个子层叠上下文，按我们的层叠顺序，`B` 元素位于第三层，而 `C` 元素位于第六层。

我们先来看之前说的第一点： `z-index` 只对定位元素有意义，如果你为一个非定位元素设置了 `z-index`，它不会生效。 我们设置 `C` 元素的 `z-index` 为 `-1`，这时候 `C` 的层叠顺序从第六层跑到了第二层，因为它现在成了堆叠层级为负的子堆叠上下文，而我们再设置 `B` 元素的 `z-index` 为 `-2` ，我们发现，`B` 元素依然在 `C` 元素的上面,并且我们打开开发者工具会发现 `z-index` 实际渲染值是 `auto`，我们可以发现这个 `z-index` 的值并没有影响元素的定位。

第二点： `z-index: auto`和`z-index: 0`在渲染上都是位于第 `六` 层,但他们有个本质的区别，一个是堆叠层级为 `0` 的子堆叠上下文，一个是堆叠层级为 `0` 的后代元素。 我们页面初始化时，设置了 `A` 元素的 `z-index` 为 `0` ，按照堆叠上下文的形成规则，此时 `A` 元素已经形成了一个堆叠上下文，也就是说，无论内部的元素如何改变，都不可能突破这个父元素的堆叠层级，我们也看到 `BC` 元素都在 `A` 元素的背景之上，此时我们点击下面的 `click` 按钮，会发现C元素跑到了 `A` 元素的后面去了，这里就是我们理解第二点的关键。当我们改变 `A` 元素的 `z-index` 的时候，它已经从一个堆叠上下文变为一个非堆叠上下文的普通元素，也就是说，他从堆叠顺序的第六层跑到了第三层（ `B` 元素此时也在第三层，`CSS2.2` 规范中已经说过，同一个堆叠上下文中的元素如果堆叠层级相同，文档流中后面的元素要更靠前），而我们的 `C` 元素此时是一个堆叠层级为负的子堆叠上下文，自然跑到了第二层，所以它出现在了 `A` 元素的后面。

## 总结

要很好地掌握这部分内容我觉得只要抓住三点就可以了：

1. 理解什么情况下元素会创建堆叠上下文
2. 堆叠上下文中的堆叠顺序细节
3. 嵌套的堆叠上下文的理解

掌握这三点我相信遇到元素堆叠的问题都能轻松地解决了。
