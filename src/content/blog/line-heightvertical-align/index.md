---
title: '对line-height和vertical-align的一些理解'
publishDate: '2018-08-29 12:00:00'
description: ''
tags:
  - css
  - 编程技巧
language: '中文'
heroImage: {"src":"./css.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

最近遇到了很多关于 `line-height` 和 `vertical-align` 等行盒模型相关问题，决定单独写一篇彻底搞清楚原理。行内元素的排列是一个很特殊的东西，不同的浏览器的表现很可能不一样。

## 深入理解line-height

`line-height` 翻译成行高，指的是一行的基线到下一行基线的距离，具体的细节如图![行高细节](./images/line-height1.jpg) 任何一个行内框中的结构都如图所示，顶线和底线之间显示文字，他们的距离就等于font-size，中线的位置是基线向上 `1/2` 个 `x` 的高度，我们可以近似的看做 `x` 的那个交叉点。

`line-height` 不允许负值，为 `font` 的上下间距 `normal` 的情况为默认值，浏览器会计算出“合适”的行高，多数浏览器（ `Georgia` 字体下）取值为 `1.14` ，即为 `font-size` 的 `1.14` 倍，如果未设定`font-size`，那既是基准值 `16px` 的 `1.14` 倍, `normal` 和具体的数值相比，会因为字体的不同而不同。

解释一下关于上图的几个概念，

1. `content area` ：就是顶线和底线之间包裹的区域，高度只和 `font` 有关,宽度就和字数有关，就理解为包裹文字的一个区域。

> The height of the content area should be based on the font, but this specification does not specify how.

2. 行高、行距：行高就是相邻的文本行之间的基线的距离，这个高度包括了 `content area` 和行距。 行距就是行高减去 `content area` 的高度。
    
3. `inline box` (行内框)：所有的行内元素都会生成看不见的行内框，就是标准中的 `inline box` ，我们无法看到他，它是在浏览器渲染中使用的，在不设置其他样式的情况下， `inline box` 的高度和 `content area` 高度是一样的。我们理解 `inline box` 的时候,其实可以不必太刻意，他也有高度。为了排版行内元素，`inline box` 和 `line box` 都是 `css` 来规定的，`inline box` 水平方向排列在 `line box` 里。`inline box` 的高度并不会受内部元素的影响，我们只要设置了 `line-height` ，那么这个行内框的高度就已经确定了，就像 `div` 一样，我们只要设置了一个 `div` 的高度，不管里面的内容多长，`div` 的高度也不会产生变化，内容超出了那就溢出了，`line box` 也是一样，当 `line-height` 小于内部的文字的高度，内部的文字就会溢出了，见例 `5` ,我们可以看到红色背景的 `span` 超出了父元素的范围，这里的红色背景其实是 `content area` 的，不是 `inline box` 的，父元素的高度为`span` 的 `line-height` 。这里要注意的是，父元素要设置 `font-size` 为 `0` ，因为浏览器默认字体为 `16px` ，如果不设置 `font-size` 为 `0` 的话，父元素的高度就会为 `16+2(border)px`，还有就是要设置 `span` 的 `vertical-align` 为 `top` ，不然也会引起高度变化，原因下面讲。
    
4. `line box` 刚刚在 `inline box` 哪里我们就提到了行框 `line box` 的概念，`css` 规定了，所有的`inline box` 排列在`line box` 中，这个 `line box` 的高度就是非常关键的跟我们的 `vertical-align` 还有 `line-height` 相关的，`line box` 的高度怎么计算呢？网上大多的说法是 `line box` 中高度最高的那个 `inline box` 决定了 `line box` 的高度，我一直觉得这种说法不严谨，应该是以 `inline box` 最高的上边界线和最低的下边界构成 `line box` 的边界，不过我没有找到例子来证明这一点，`css` 的渲染是以 `line box` 的高度尽量小为目的，所以我想最高的 `inline box` 来决定高度也是有道理的，如果下次找到反例我会来补充。 `line-height` 决定了 `inline box` 的高度，而 `vertical-align` 则决定了 `inline box` 在 `line box` 中的位置。`line box` 的高度由行内最高的 `inline box` 决定，但同时也可以直接用 `line-height` 来决定，给父元素设置 `line-height` 就可以给 `line box` 设定高度，而我们知道浏览器有默认字体大小，也就有默认的 `line-height` ，所以行内元素一旦确定了高度和 `vertical-align` 我们就能确定它在行内的位置。
    

> `line box` 的高度和`inline box` 的`vertical-align` 是互相依赖的，他们两者的确定都要知道对方的值。

  字母 `x` 在 `line-height` 中有很重要的作用，这里单独说一说，首先基线是以字母 `x` 的下边界为基准的，在 `css` 中有一个 `x-height` 的概念，就是用来形容 `x` 的高度，我们在 `css` 中描述大小可以用 `px`，`em`，百分比，还可以用 `ex`，这个 `ex` 就是 `x` 的高度，不过很多浏览器用 `0.5em` ，也就是字体大小的一半来渲染。

![x-height示意图](./images/line-height2.png)

1. `ascender height` : 上下线高度
2. `cap height` : 大写字母高度
3. `median` : 中线
4. `descender height` : 下行线高度

比如例子中的第三块的代码，图片高度是 `200px`；父元素的 `line-height：240px`，在给图片设置 `vertical-align` 的情况下，在 `chrome` 下，父元素的高度为 `312px` ，这个 `312px` 是怎么来的呢，我们给父元素里面添加一些文字，他们会生成匿名 `inline box` ， `line-height` 为 `240px` ，图片的默认对齐方式为 `baseline`，也就是基线和父元素基线对齐，图片没有基线，就按照 `bottom margin` 来计算。也就是我们图片的下边缘要和文字中的 `x` 的下边缘对齐，图片的下面的空间的是由基线到底线的距离加上 `1/2` 行距构成的，行距很好计算，`line-height` 减去字体大小就得到行距，不过这个基线到底线的距离是不好计算的，目前还不知道方法。这个例子中，`1/2` 行距为 `(240 - 20)/2 = 110px`；图片下面的高度应该为 `110+x` ( `x` 为基线到底线的距离)，父元素的高度为 `200+110+x`，在 `chrome` 中为 `312px`, `firefox` 中为 `312.5px`，而且在我们微调字体的时候，有时候发现`div` 的高度不会发生变化，比如设置字体为 `21,22` 等，我认为是这样的，字体增大或减小的时候，`x` 也会随之增大和减小，字体越大，行距越小，`x` 越大，行距和 `x` 的变化是相反的，在一定程度内，会抵消，所以微调字体的时候，不会发生变化。当我们将字体设置为 `0` 的时候，各个浏览器的表现基本一致，高度都是 `320`。 注：以上高度均没有就算 `border`。

> Align the baseline of the box with the baseline of the parent box. If the box does not have a baseline, align the bottom margin edge with the parent's baseline.

[查看文中实例](https://www.clloz.com/study/line-height.html)