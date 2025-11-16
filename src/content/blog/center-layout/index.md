---
title: '水平垂直居中方案'
publishDate: '2020-10-05 12:00:00'
description: ''
tags:
  - css
  - 奇技淫巧
  - 编程技巧
language: '中文'
heroImage: {"src":"./css.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

本文总结一些水平和垂直居中的方案。

## 水平居中

## 行内元素

行内元素的水平居中设置父元素的 `text-aling: center` 即可。元素的 `display` 可以是 `inline`，`inline-block`，`inline-table` 和 `inline-flex`。

```html
<style>
    .wrap {
        text-align: center;
        margin-bottom: 30px;
    }
    .wrap > div {
        height: 200px;
        width: 200px;
        background-color: lightblue;
    }
</style>

<div class="wrap">this is a text.</div>
<div class="wrap">
    <div class="ib" style="display: inline-block"></div>
</div>
<div class="wrap">
    <div class="it" style="display: inline-table"></div>
</div>
<div class="wrap">
    <div class="if" style="display: inline-flex"></div>
</div>
```

<iframe width="100%" height="300px" style="border: none" src="https://cdn.clloz.com/study/center-layout/inline-center.html"></iframe>

## 块元素

使用 `margin: 0 auto`。`margin: 0 auto` 之所以能够进行居中，是在 [CSS2.2](https://www.w3.org/TR/CSS22/visudet.html#blockwidth "CSS2.2")中 进行了规定的。当元素的宽度不为 `auto` 并且 `margin-left` 和 `margin-right` 都为 `auto` 的时候，元素将在水平方向上居中。

```html
<style>
    .center {
        height: 200px;
        width: 200px;
        margin: 0 auto;
        background-color: lightblue;
    }
</style>

<div class="center"></div>
```

<iframe width="100%" height="230px" style="border: none" src="https://cdn.clloz.com/study/center-layout/block-center.html"></iframe>

## 多个元素

实现多个元素的水平居中比较常用的方法就是 `display: inline-block` 配合 `text-align: center` 来实现。

## 水平垂直居中

这里介绍的几种垂直居中的方法都可以应用到水平方向上，所以就放到一起来说

## 绝对定位 + 负 margin

在知道元素宽高的情况下可以利用这一方法。

```html
<style>
    .center {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 200px;
        height: 200px;
        margin: -100px 0 0 -100px;
        background-color: lightblue;
    }
</style>

<div class="center"></div>
```

<iframe width="100%" height="230px" style="border: none" src="https://cdn.clloz.com/study/center-layout/negative-margin.html"></iframe>

## 绝对定位 + calc

必须确定居中元素的宽高。

```html
<style>
    .center {
        position: absolute;
        top: calc(50% - 100px);
        left: calc(50% - 100px);
        height: 200px;
        width: 200px;
        background-color: lightblue;
    }
</style>
<div class="center"></div>
```

<iframe width="100%" height="230px" style="border: none" src="https://cdn.clloz.com/study/center-layout/absolute-calc.html"></iframe>

## 绝对定位 + margin

元素必须设置宽高，否则元素的宽高都会是 `100%`，不过宽高可以设置百分比而不一定非要像素。

```html
<style>
    .center {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 200px;
        height: 200px;
        margin: auto;
        background-color: lightblue;
    }
</style>

<div class="center"></div>
```

<iframe width="100%" height="230px" style="border: none" src="https://cdn.clloz.com/study/center-layout/absolute-margin.html"></iframe>

## 绝对定位 + transform

这个方法和 `绝对定位 + 负margin` 类似，但是我们可以不用固定宽高，因为 `transform` 支持百分比。

```javascript
<style>
    .center {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 200px;
        height: 200px;
        transform: translate(-50%, -50%);
        background-color: lightblue;
    }
</style>
<div class="center"></div>
```

<iframe width="100%" height="230px" style="border: none" src="https://cdn.clloz.com/study/center-layout/absolute-transform.html"></iframe>

## table-cell

将父元素的 `display` 设为 `table-cell`，然后利用 `text-align` 和 `vertical-align` 来实现元素的居中。不过要居中的元素需要是行内级元素。如果想相对于视口居中，可以在外面再套一层 `display: table;`。

```html
<style>
    .container {
        display: table;
        width: 100%;
        height: 500px;
    }
    .wrap {
        display: table-cell;
        height: 500px;
        width: 500px;
        border: 1px solid black;
        text-align: center;
        vertical-align: middle;
    }
    .center {
        display: inline-block;
        width: 200px;
        height: 200px;
        background-color: lightblue;
    }
</style>
<div class="container">
    <div class="wrap">
        <div class="center"></div>
    </div>
</div>
```

<iframe width="100%" height="530px" style="border: none" src="https://cdn.clloz.com/study/center-layout/table-cell.html"></iframe>

## flex布局

```html
<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        border: 1px solid;
    }

    .center {
        height: 100px;
        width: 100px;
        background-color: lightblue;
    }
</style>
<div class="container">
    <div class="center"></div>
</div>
```

<iframe width="100%" height="230px" style="border: none" src="https://cdn.clloz.com/study/center-layout/flex.html"></iframe>

## ::after 伪元素和 vertical-align

可以利用撑满父元素的 `::after` 伪元素和 `vertical-align` 实现行内元素的居中（不用伪元素，用 `line-height` 同样也可以实现，根据需求选择）

```html
<style>
    .wrap {
        width: 100%;
        height: 600px;
        /* line-height: 600px; */
        text-align: center;
        border: 1px solid;
        font-size: 0;
    }
    .wrap::after {
        content: '';
        display: inline-block;
        height: 100%;
        width: 1px;
        background-color: red;
        vertical-align: middle;
    }
    .center {
        display: inline-block;
        height: 200px;
        width: 200px;
        vertical-align: middle;
        background-color: lightblue;
    }
</style>
<div class="wrap">
    <div class="center"></div>
</div>
```

<iframe width="100%" height="230px" style="border: none" src="https://cdn.clloz.com/study/center-layout/pseudo.html"></iframe>

## 参考文章

1. [最全面的水平垂直居中方案](https://www.cnblogs.com/coco1s/p/4444383.html "最全面的水平垂直居中方案")
2. [CSS 拷问：水平垂直居中方法你会几种？](https://liuyib.github.io/2020/04/07/css-h-and-v-center/#table-cell-vertical-align "CSS 拷问：水平垂直居中方法你会几种？")