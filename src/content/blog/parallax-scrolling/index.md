---
title: 'CSS实现视差滚动 Parallax Scrolling'
publishDate: '2020-09-24 12:00:00'
description: ''
tags:
  - css
  - 实用技巧
language: '中文'
heroImage: {"src":"./css.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

在博客首页的头部背景图本来是用 `JavaScript` 实现的视差滚动，但是觉得性能不是很好。于是尝试用 `CSS` 来实现视差滚动的效果。

## 原理

用 `CSS` 实现视差滚动的原理就是利用 `3d` 空间的 `z` 轴距离产生的近大远小，让元素之间的滚动距离产生差距。`perspective` 的属性值确定观察的 `z` 轴坐标，比如我们设 `perspective: 1px`，最后所有的透视效果都是以和 `z = 1px` 的位置观察的效果是相同的。`z` 轴的原点就是我们的屏幕，所有的最后显示效果，都是投影在屏幕上的效果。如果以人眼作为比喻的话，`perspective` 就是我们的眼睛位置，而屏幕就是视网膜的位置。

如果我们以 `z = -1px` 为观察点，在z `z = 0` 和 `z= -1px` 的位置放两个相同长度的元素，那么实际的成像效果就后面的元素只有前面的元素的长度的一半。如果我们想要让位于 `z = -1px` 位置的元素看上去和 `z = 0` 的元素一样大，那么我们就需要将它的边长放大到两倍，可以用 `scale(2)` 实现。放大后，从我们的 `perspective` 位置看上去就和 `z = 0` 的元素是一样的，但是如果我们对屏幕进行滚动，可以理解为我们将我们的观察点沿着 `y` 轴上下移动，这个位移对于 `z = 0` 和 `z = -1px` 的元素是相同的，但是由于 `z = -1px` 的元素的边长是 `z = 0` 位置元素的两倍，所以视觉上，我们觉得 `z = -1px` 的元素的位移好像更短，这就是视差效果。

详细的研究和推理过程可以参考 [Tour of a Performant and Responsive CSS Only Site](https://css-tricks.com/tour-performant-responsive-css-site/ "Tour of a Performant and Responsive CSS Only Site")

## 实现

有了原理之后，实现就简单了。我们将要进行视差移动的元素放到 `-1px` 的位置，同时放大两倍，将 `perspective` 设置到 `1px` 即可。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>parallax</title>
        <style>
            html,
            body {
                height: 100%;
                margin: 0;
            }
            .container {
                position: relative;
                height: 100%;
                overflow: auto;
                perspective: 1px;
                perspective-origin: 0 0;
            }
            .bg {
                /* position: absolute; */
                width: 100%;
                height: 600px;
                background-image: url('bg.jpg');
                background-size: cover;
                transform-origin: 0 0;
                transform: translateZ(-1px) scale(2);
            }
            .content {
                height: 3000px;
                background: pink;
                margin: -60px 15px 0;
                position: relative;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="bg"></div>
            <div class="content"></div>
        </div>
    </body>
</html>
```

`Demo` 效果可以查看：[视差滚动效果demo](https://cdn.clloz.com/study/parallax_scroll.html "视差滚动效果demo")

## 总结

这种 `CSS` 实现的视差滚动效果在手机上没法达到效果，手机上可以实现透视的效果，但是滚动的效果出不来。最终我也没有应用到博客上。几种视差滚动的实现方式，包括 `js`，`background-attachment` 和 透视，都没有一个十分满意的方法，因为性能都不是非常好，而且改动也非常多，最后我干脆就把把这个效果拿掉了，