---
title: '文字跑马灯效果'
publishDate: '2019-05-29 12:00:00'
description: ''
tags:
  - front-end
  - 编程技巧
language: '中文'
---

\[toc\]

## 前言

在前面制作音乐播放器的时候想要实现歌曲名称的跑马灯效果，因为有些歌曲的名字特别长，不能现实完全，大部分播放器都是在歌曲名称超过长度的时候滚动显示。但是跑马灯的效果一直无法做到完美衔接。因为整个页面是响应式的，所以歌曲名称所在的元素的长度也是不固定的，完美衔接的跑马灯是用两个相同的文本来进行动画滚动，如果长度无法固定那么效果肯定不好，这篇文章来研究一下如何实现比较流畅的跑马灯效果。

## CSS 实现

用 `CSS` 来实现文字的滚动效果是可以的，不过有很多局限，特别是在文字和元素的宽度不确定的情况下。因为在动画的每个状态节点我们给出的属性必须是确定的属性而不能是一个动态的。可以很容易的分析出来，滚动的元素的长度必须是包含元素的整数倍才能够实现无缝的滚动，否则就会出现动画跳帧的情况，实现代码如下：

```html
<style>
    .wrap {
        margin: 0 auto;
        width: 200px;
        border: 1px solid;
        white-space: nowrap;
        overflow: hidden;
    }

    .wrap .content {
        height: 20px;
        font-size: 0;
    }

    .wrap p {
        position: relative;
        display: inline-block;
        left: 0;
        margin: 0;
        width: 200%;
        font-size: 16px;
        line-height: 20px;
        background: lightblue;
        animation: scroll 6s infinite linear;
        overflow: hidden;
        white-space: nowrap;
    }

    .wrap .content:hover p {
        animation-play-state: paused;
    }

    @keyframes scroll {
        0% {
            left: 0;
        }
        100% {
            left: -200%;
        }
    }
</style>
<div class="wrap eg1">
    <div class="content">
        <p><span>1.当文字超出范围的时候开始滚动</span></p>
        <p><span>2.当文字超出范围的时候开始滚动</span></p>
    </div>
</div>
```

![css-scroll](./images/css-text-scroll.gif "css-scroll")

这样看上去效果尚可，不过用 `CSS` 实现是很容易出问题的，比如文字的长度超出了规定的长度（上面的代码中是 `200%` ）。不过如果我们只是需要一个简单的滚动效果，选择 `CSS` 是一个比较便捷的方式。

## JS 实现

## 利用 transition

是用 `JS` 实现又两种思路，一种是结合 `transition` 属性来调节 对应的`CSS` 属性。我的思路是两个相同的文本，`inline-block` 排列，改变第一个的 `left`，监听 `transitioned` 事件，当滚动结束后，将 `left` 归零然后重复上述步骤。需要注意的是，在归零的时候，比如去掉元素样式中的 `transition` 属性，否则归零的过程也是一个动画，就不符合我们的效果了。代码如下：

```html
<style>
    .wrap {
        margin: 0 auto;
        width: 200px;
        border: 1px solid;
        white-space: nowrap;
        overflow: hidden;
    }

    .wrap .content {
        height: 20px;
    }

    .wrap p {
        position: relative;
        left: 0;
        display: inline-block;
        margin: 0;
        padding-right: 15px;
        font-size: 16px;
        line-height: 20px;
        background: lightblue;
        box-sizing: border-box;
    }

    .wrap p.transitioned {
        transition: left linear 3s;
    }
</style>
<div class="wrap eg1">
    <div class="content">
        <p>1.当文字超出范围的时候开始滚动 </p><p>1.当文字超出范围的时候开始滚动</p>
    </div>
</div>
```

```javascript
var $text = $(".wrap p");
var $wrap = $(".wrap");
var t_w = $text.outerWidth();
console.log(t_w)
var wrap_w = $wrap.width();

function textScroll() {
    if (t_w > wrap_w) {
        $text.addClass("transitioned");
        $text.css("left", -t_w + "px");
    }
}

$(document).ready(function() {
    textScroll();
});

$text.on("transitionend webkitTransitionEnd oTransitionEnd", function() {
    console.log("end");
    $(this).removeClass("transitioned");
    $(this).css("left", 0);
    setTimeout(() => {
        $text.addClass("transitioned");
        $text.css("left", -t_w + "px");
    }, 4);
});
```

需要注意的是在归零后再次调用滚动方法的时候我用了 `setTimeout` 来延迟触发，这是因为如果不实用异步的话，浏览器会把这多个渲染步骤优化为一个，动画不会触发，具体大家可以去测试一下。还有一个问题就是想要作出效果比较好的暂停不是很容易，因为 `transition` 的时间是固定的，而我们鼠标移动到元素上的时间是不确定的，当我们移开鼠标的时候，`transition` 的时间又重新计算了。

[点击](https://www.clloz.com/study/text-scroll.html)查看效果。

## 纯 JS 实现

最后一种方法是纯 `JS` 的方法，利用定时器来实现动画。实现代码如下

```html
<style>
    .wrap {
        margin: 0 auto;
        width: 200px;
        border: 1px solid;
        white-space: nowrap;
        overflow: hidden;
    }

    .wrap .content {
        height: 20px;
    }

    .wrap p {
        position: relative;
        left: 0;
        display: inline-block;
        margin: 0;
        padding-right: 15px;
        font-size: 16px;
        line-height: 20px;
        background: lightblue;
        box-sizing: border-box;
    }
</style>
<div class="wrap eg1">
    <div class="content">
        <p>1.当文字超出范围的时候开始滚动当文字超出范围的时候开始滚动</p><p>1.当文字超出范围的时候开始滚动当文字超出范围的时候开始滚动</p>
    </div>
</div>
```

```javascript
var $text = $(".wrap p");
var $wrap = $(".wrap");
var t_w = $text.outerWidth();
var wrap_w = $wrap.width();
var mouse = false
var timer = null

function init() {
    animation()
}

function animation() {
    timer = setInterval(() => {
        scroll()
    }, 10)
}

function scroll() {
    var left = parseInt($text.css('left'))
    if (left > -t_w) {
        //   console.log(left)
        $text.css('left', left - 1 + 'px')
    } else {
        $text.css('left', '0')
    }
}

$('.content').on('mouseenter', function (e) {
    e.stopPropagation()
    console.log(1)
    clearInterval(timer)
})
$('.content').on('mouseout', function (e) {
    console.log(2)
    e.stopPropagation()
    animation()
})

init()
```

使用 `JS` 我们能够非常容易的完成鼠标移动到文字上暂停滚动的效果。

[点击](https://www.clloz.com/study/text-scroll2.html)查看效果。