---
title: '块元素居中和扇形'
publishDate: '2018-08-29 12:00:00'
description: ''
tags:
  - css
  - 编程技巧
language: '中文'
heroImage: {"src":"./css.jpg","color":"#B4C6DA"}
---

\[toc\]

## 块元素居中的方法

## 绝对定位居中

关于绝对定位，绝对定位的 `top,right,bottom,left` 属性相当于给该元素的包含元素( `position` 为 `relative` 的父元素或者 `body` )限定一个新的该元素的活动边界(见下面原文)。绝对定位的元素脱离文档流。如不指定定位的属性，则该元素的起点为该元素在文档中的对应位置。`absolute` 和 `float` 一样脱离文档流，所以相对于文档流他们都没有高度，但是 `absolute` 与 `float` 不同的地方是相对文档流来说他也没有宽度，所以它能够产生覆盖效果，而 `float` 不可以。具体可以参考这篇文章 [absolute绝对定位的非绝对定位用法](http://www.zhangxinxu.com/wordpress/2010/01/absolute%E7%BB%9D%E5%AF%B9%E5%AE%9A%E4%BD%8D%E7%9A%84%E9%9D%9E%E7%BB%9D%E5%AF%B9%E5%AE%9A%E4%BD%8D%E7%94%A8%E6%B3%95/)，[CSS 相对|绝对(relative/absolute)定位系列（一）](http://www.zhangxinxu.com/wordpress/2010/12/css-%E7%9B%B8%E5%AF%B9%E7%BB%9D%E5%AF%B9%E5%AE%9A%E4%BD%8D%E7%B3%BB%E5%88%97%EF%BC%88%E4%B8%80%EF%BC%89/)

> For absolutely positioned elements, the top, right, bottom, and left properties specify offsets from the edge of the element's containing block (what the element is positioned relative to)

设置元素的宽高可以是 `pixel` 也可以是百分比，设置百分比的话有自适应效果，然后对定位属性都设置为 `0`，`margin auto` 就可以看到对应的元素已经实现居中定位，如果想要该元素有偏移量，就根据自己的需要修改定位属性，该元素的居中是相当于定位属性给出的边界框的居中。

该方法的优点: 1. 兼容 `ie8-ie10` 2. 一个标签，代码量少 3. 支持百分比和 `max|min` 属性 4. 内容可以重绘 ? 5. 对于图片居中有效

缺点: 1. 必须设置元素的高度宽度(图片例外)，否则元素将填满包含框

还有一些注意点，可以给元素添加 `resize:auto` 让用户可改变大小.( `overflow:auto` )

对于内容高度大于元素或容器高度的情况，建议使用 `overflow:auto`，否则会出现溢出的情况.也可以使用 `display：table`，不管文本多长元素会自动适应长度，不会溢出或者出现滚动条。

图片可以使用 `hight：auto` 其他元素不可以

## 负边距居中( Negative margins )

负边距居中比较简单,绝对定位后设置 `top left` 均为 `50%`，然后 `margin-left` 为负的宽度的一半， `margin-top` 为负的高度的一半。

这个方法理解起来很简单，代码量也比较少，并且兼容 `ie6，ie7`，但是不能自适应，内容也会溢出，要根据情况设置 `overflow`，计算 `margin` 要根据自己的 `padding` 和 `box-sizing` 来计算。

## transform

`transform` 居中和负边距居中原理一致，不过他不是用 `margin` 而是用 `translate: (-50%, -50%)`,这样的好处是能够支持可变高度了，自适应比较好，但是ie8不支持 `translate`，还有该属性要加上浏览器厂商的前缀。

## 表格单元格

```html
 <div class="Center-Container is-Table">
        <div class="Table-Cell">
            <div class="Center-Block">
                <!-- CONTENT -->
            </div>
        </div>
    </div>
    <style>
        .Center-Container.is-Table { display: table; }
        .is-Table .Table-Cell {
            display: table-cell;
            vertical-align: middle;
        }
        .is-Table .Center-Block {
            width: 50%;
            margin: 0 auto;
        }
    </style>
```

总的说来这可能是最好的居中实现方法，因为内容块高度会随着实际内容的高度变化，浏览器对此的兼容性也好。最大的缺点是需要大量额外的标记，需要三层元素让最内层的元素居中。

优点： 1. 高度可变 2. 内容溢出会将父元素撑开。 3. 跨浏览器兼容性好。

## inline-block 详解

> `vertical-aligin` 是对于 `inline` 元素所在的 `line box` 来说的，父元素的 `line box` 的高度取决于该 `line box` 中的 `inline box` 中最高的一个(在不设定 `line-height` 的情况下)

对于 `inline-block` 的居中定位方法着实花了一点时间,现在总结一下。 对于我们所看到的 `html` 的文档流，除开独占一行的块级元素，任何行内元素构成的行，都有一个 `line box`，`line box` 由内部的一个或者多个 `inline box` 组成，他的高度可以直接由 `line-height` 限定，如果不限定 `line-height` 那么就由内部最高的 `inline box` 决定。`inline box` 的高度由 `line-height` 决定。

##### inline box、line box、line-height、vertical-align 的关联

1. 对于纯文字的 `inline box` 来说，外面会包裹一层 `content area`，他的高度和 `font-size` 以及 `font-family` 有关，与 `line-height` 无关，比如一个 `span` 标签，设置他的 `fonts-size 14px` 那么他的 `content area` 高度是 `19px` (不同的浏览器可能不同，`chrome` 中是 `19px` )，`css2.1` 规范中只说明了跟字体有关，但是没有说是怎么计算的。
    
    > The 'height' property does not apply. The height of the content area should be based on the font, but this specification does not specify how.A UA may, e.g., use the em-box or the maximum ascender and descender of the font.
    
2. 看下面的图 ![行高细节](./images/inlinebox.png)
    

`line box` 的高度由 `line-height` 决定，`line-height` 的定义时从第一行基线到下一行基线的距离，一半的 `line-height` 在 `content area` 的上面，另一半在下面。`line-height` 从 `content area` 的水平中垂线开始计算。想得到 `inline` 元素的 `inline box` 高度，把 `inline` 元素改变成 `inline-block` (不手动设置高度)元素看看。`content area` 中垂线和 `middle line` 是有误差的，这也是导致有时候 `vertical-align` 有误差的原因。

如果直接用设置 `line-height` 的方法来设置高度的话，那么这个方法就没有办法做到自适应，修改容器的高度就又不居中了，所以有一个变形的方法，就是用一个 `display` 为 `inline-block` 的 `after` 或者 `before` 伪元素撑满容器，这样就不需要设置容器的 `line-height`，我们需要居中的元素和这个伪元素所构成的 `line box` 高度就是容器的高度，而我们前面也说过，元素的 `vertical-align` 属性是相对于它所在的 `line-box` 的，现在由于伪元素的存在，`line box` 的高度就是父元素的高度，所以能够实现居中。还有一点就是水平居中就给父元素添加 `text-align` 属性就可以了。

> 对于没有标签包裹的文字来说，就是匿名 `inline-boxes`

```html
<div style="background: lavender;font-size: 0;">
    <span style="line-height: 300px; font-size: 15px;word-break: break-all; line-height: 19px;">
        test
    </span>
</div>
```

这段代码如果把 `span` 的 `font-size` 设置为0会发现 `div` 还是有高度，因为 `div` 有个默认的 `fontsize`，各个浏览器不同。当元素内部有内联元素的时候，这个 `font-size` 会自动生效，如果把 `span` 注释掉或者 `display:none` 就不会出现。

综合上面几点，`font-size` 决定了 `content area` 的高度，`content area` 或者 `line-height` 来决定 `inline box` 的高度，最高的 `inline box` 或者父元素的 `line-height` 决定了 `line box` 的高度，而 `vertical-align` 这个属性只对 `inline` 或 `inline-block` ( `tabel-cell` 在这里理解为 `inline-block` )有效，原理就是内部的 `inline box` 对于父元素的 `line box` 的高度垂直居中，但是要注意的是 `vertical-align` 的 `middle` 属性是指的上图中的中线，中线的位置和 `content area` 的水平中垂线位置是不同，所以会产生一定的误差，可以对父元素用 `font-size 0` 来解决这个误差。

## flex 布局

flexible box弹性布局，css3新特性，具体参考阮一峰的博文[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

## 参考文章：

1. [我对CSS vertical-align的一些理解与认识（一）](http://www.zhangxinxu.com/wordpress/2010/05/%E6%88%91%E5%AF%B9css-vertical-align%E7%9A%84%E4%B8%80%E4%BA%9B%E7%90%86%E8%A7%A3%E4%B8%8E%E8%AE%A4%E8%AF%86%EF%BC%88%E4%B8%80%EF%BC%89/)
2. [CSS深入理解vertical-align和line-height的基友关系](http://www.zhangxinxu.com/wordpress/2015/08/css-deep-understand-vertical-align-and-line-height/)
3. [字母’x’在CSS世界中的角色和故事](http://www.zhangxinxu.com/wordpress/2015/06/about-letter-x-of-css/)
4. [CSS float浮动的深入研究、详解及拓展(一)](http://www.zhangxinxu.com/wordpress/2010/01/css-float%E6%B5%AE%E5%8A%A8%E7%9A%84%E6%B7%B1%E5%85%A5%E7%A0%94%E7%A9%B6%E3%80%81%E8%AF%A6%E8%A7%A3%E5%8F%8A%E6%8B%93%E5%B1%95%E4%B8%80/)
5. [关于line box，inline box，line-height，vertical-align之间的关系](http://www.cnblogs.com/samwu/p/3936271.html)

## 扇形

1. 在左上角和右下角绝对定位两个宽高都为50px的元素，然后设置`border-radius`为`0 0 100% 0`和`100% 0 0 0`两种，当`border-radius`超过`50%`的时候，依然可以正常显示，但是如果两个相邻的角的`border-radius`半径和超过两个角所在边的长度的时候，浏览器会重新计算让`border-radius`适应当前的状况。
    
2. 在左上角和右下角绝对定位两个宽高都为`100px`的元素，`border-radius`都为`50%`，就形成了两个半径为50px的圆，讲圆心分别定位到左上角和右下角，设置居中的父元素的`overflow`为`hidden`就可以将超出的部分隐藏起来，实现需要的效果
    

应该还有很多其他的方法，目前就想到这两种比较简单的，后面如果学习到新的会来补充。任务四基本完成了。