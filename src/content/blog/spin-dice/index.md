---
title: '拖动旋转的 3D 骰子效果'
publishDate: '2020-10-28 12:00:00'
description: ''
tags:
  - css
  - 编程技巧
language: '中文'
heroImage: {"src":"./dice.png","color":"#B4C6DA"}
---

\[toc\]

## 前言

用 `CSS` 实现一个 `3d` 的骰子，然后实现用鼠标拖动旋转的效果。实现的效果如下，可以拖动这个骰子进行旋转。

<iframe width="100%" height="300px" style="border: none" src="https://cdn.clloz.com/study/spin-dice/spin-dice.html"></iframe>

## CSS 实现 3D 骰子

想要实现一个 `3d` 的骰子，肯定是要使用 `transform`。关于 `transform` 的细节本文就不多讲了，可以参考 `MDN` 和 [深入理解CSS变形transform(3d)](https://www.cnblogs.com/xiaohuochai/p/5351477.html "深入理解CSS变形transform(3d)")。我们主要讲讲如何实现效果。

`HTML` 的结构很简单，我们需要一个包含块（最后我们旋转的就是这个包含块），和 `6` 个子元素作为骰子的六个面。

```html
<ul id="dice">
    <li class="front">1</li>
    <li class="back">2</li>
    <li class="right">3</li>
    <li class="left">4</li>
    <li class="top">5</li>
    <li class="bottom">6</li>
</ul>
```

父元素的处理非常简单，主要的属性就是 `transform-style: preserve-3d`，因为我们的子元素是在 `3d` 空间中的。

```css
ul {
    display: block;
    width: 100px;
    height: 100px;
    margin: 100px auto;
    padding: 0;
    list-style: none;
    transform-style: preserve-3d;
}
```

## 六个面的 transform

在处理 `transform` 之前我们用绝对定位把六个面的元素都固定到父元素的 `top left` 位置，这样六个面的 `transform` 的坐标就都相同了。每个面的 `transform` 都不相同，我们需要在脑海中模拟一下从当前位置到目标位置的移动过程。这里需要注意两点，第一点是坐标轴的方向，`z` 轴是垂直屏幕向外的的，也就是向外移动是正，向内移动是负，同理 `x` 轴是左为正，`y` 轴是下为正；第二点就是元素拥有独立的坐标系，而不是共用同一个坐标自，当一个元素发生了旋转，他的坐标系也在旋转。比如我将一个元素以 `x` 轴为旋转轴旋转了 `180deg`，那么此时他的 `z` 轴就不在是**垂直屏幕向外**，而是**垂直屏幕向内**的，这一点要注意一下。根据这些规则我们来总结一下各个面需要如何移动，我们以骰子的边长为 `100px` 为例。

- `front`：沿着 `z` 轴向外移动 `50px`。
- `back`：沿着 `z` 轴向内移动 `50px`。
- `right`：以 `y` 轴为旋转轴顺时针旋转 `90deg`，然后向右移动 `50px`。
- `left`：以 `y` 轴为旋转轴逆时针旋转 `90deg`，然后向左移动 `50px`。
- `top`：以 `x` 轴为旋转轴顺时针旋转 `90deg`，然后向上移动 `50px`。
- `bottom`： 以 `x` 轴为旋转轴逆时针旋转 `90deg`，然后向下移动 `50px`。

这里的顺时针逆时针我个人总结就是从旋转轴的正方向向负方向看，比如 `x` 轴是从右往左看，`y` 轴是从下网上看，如果方向看反的话，顺时针逆时针也会搞反。这里的旋转需要一点空间想象力，特别是刚刚接触 `3d` 的 `transform`。

根据上面总结的各个面的移动方式，我们就可以写出我们的代码了。

```css
ul li {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 30px;
    color: white;
    line-height: 100px;
    text-align: center;
    backface-visibility: visible;
}
.front {
    background-color: rgba(90, 90, 90, 0.7);
    transform: translateZ(50px);
}
.back {
    background-color: rgba(0, 210, 0, 0.7);
    transform: rotateY(180deg) translateZ(50px);
}
.right {
    background-color: rgba(210, 0, 0, 0.7);
    transform: rotateY(90deg) translateZ(50px);
}
.left {
    background-color: rgba(0, 0, 210, 0.7);
    transform: rotateY(-90deg) translateZ(50px);
}
.top {
    background-color: rgba(210, 210, 0, 0.7);
    transform: rotateX(90deg) translateZ(50px);
}
.bottom {
    background-color: rgba(210, 0, 210, 0.7);
    transform: rotateX(-90deg) translateZ(50px);
}
```

此时我们就已经得到一个 `3d` 的骰子了。我们可以给它一个初始的角度或者加上透视，就能够看到 `3d` 的效果。

<iframe width="100%" height="350px" style="border: none" src="https://cdn.clloz.com/study/spin-dice/static-spin-dice.html"></iframe>

## 旋转动画

在实现拖动旋转之前，我们先做一个旋转动画来了解 `3d` 旋转。我们实现将这个骰子立起来，然后进行旋转，效果如下。

<iframe width="100%" height="350px" style="border: none" src="https://cdn.clloz.com/study/spin-dice/vertical-spin-dice.html"></iframe>

如何实现这样的效果呢，我们要做的就是先将筛子立起来。其实就是以 `z` 轴顺时针旋转 `45deg`，然后以 `x` 轴逆时针旋转 `45deg`。最后的旋转方向我们使用 `rotate3d(1, 1, 1, ndeg)` 来实现，这里的三个 `1` 可以理解成向量，我们的旋转轴就是原点到这个向量的连线，原点默认在中心，而 `1，1，1` 的位置就相当于在 `xyz` 的坐标系中取点 `(1, 1, 1)`（这里注意坐标轴的方向和我们平时数学题中的方向不同），他们的连线就是一个垂直穿过的对角的轴。最后的效果就是一个立起来的骰子沿着垂直方向旋转。

> `safari`，`firefox` 以及 `iOS` 上的 `chrome` 都不支持 `keyframe` 只写两帧（也就是 `from - to` 和 `0% - 100%` 的形式）我最终尝试只有 `0% 25% 50% 75% 100%` 这种形式能正常工作。

## 拖动旋转

把旋转的原理搞清楚了，实现拖动旋转就非常简单了。我们要做的就是触发 `mousemove` 的时候就重新计算我们的 `transform` 的值，这个值的计算就根据 `mousedown` 时候的 `clientX clientY` 和 `mousemove` 时候的 `clientX clientY` 的差值进行计算，比如移动 `10` 个像素就转动一度。这里需要注意的一点是，我们鼠标在垂直方向上移动的距离影响的是 `rotateX` 而不是 `rotateY`，因为初始方向移动相当于绕着 `X` 轴旋转。

最后就是当 `mouseup` 的时候记录当前的 `rotateX` 和 `rotateY` 的值，让下次点击事件发生的时候从上次结束的状态开始旋转而不是回到初始状态。最后的代码如下。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Spin Dice</title>
        <style>
            ul {
                display: block;
                width: 100px;
                height: 100px;
                margin: 100px auto;
                padding: 0;
                list-style: none;
                /* perspective: 550px; */
                transform-style: preserve-3d;
                /* transition: all 0.3s ease-in; */
                /* animation: spin 5s infinite linear; */
                transform: rotateX(13deg) rotateY(13deg);
            }
            ul li {
                position: absolute;
                display: block;
                width: 100%;
                height: 100%;
                font-size: 30px;
                color: white;
                line-height: 100px;
                text-align: center;
                backface-visibility: visible;
            }
            .front {
                background-color: rgba(90, 90, 90, 0.7);
                transform: translateZ(50px);
            }
            .back {
                background-color: rgba(0, 210, 0, 0.7);
                transform: rotateY(180deg) translateZ(50px);
            }
            .right {
                background-color: rgba(210, 0, 0, 0.7);
                transform: rotateY(90deg) translateZ(50px);
            }
            .left {
                background-color: rgba(0, 0, 210, 0.7);
                transform: rotateY(-90deg) translateZ(50px);
            }
            .top {
                background-color: rgba(210, 210, 0, 0.7);
                transform: rotateX(90deg) translateZ(50px);
            }
            .bottom {
                background-color: rgba(210, 0, 210, 0.7);
                transform: rotateX(-90deg) translateZ(50px);
            }
        </style>
    </head>
    <body>
        <ul id="dice">
            <li class="front">1</li>
            <li class="back">2</li>
            <li class="right">3</li>
            <li class="left">4</li>
            <li class="top">5</li>
            <li class="bottom">6</li>
        </ul>
        <script>
            let dice = document.getElementById('dice');
            let baseX = 13;
            let baseY = 13;
            dice.addEventListener('mousedown', e => {
                let rotateX = e.clientX;
                let rotateY = e.clientY;

                let move = e => {
                    // console.log(baseX, rotateX, e.clientX);
                    // console.log(baseY, rotateY, e.clientY);
                    dice.style.transform = `rotateX(${baseX - (((e.clientY - rotateY) / 10) % 360)}deg) rotateY(${
                        baseY + (((e.clientX - rotateX) / 10) % 360)
                    }deg)`;
                    // console.log(dice.style.transform);
                };
                let up = e => {
                    baseX = baseX - (((e.clientY - rotateY) / 10) % 360);
                    baseY = baseY + (((e.clientX - rotateX) / 10) % 360);
                    // console.log(baseX, baseY);
                    document.removeEventListener('mousemove', move);
                    document.removeEventListener('mouseup', up);
                };
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', up);
            });
            document.addEventListener('selectstart', e => e.preventDefault());
        </script>
    </body>
</html>

```

注意要把 `CSS` 代码中的 `transition` 注释掉，否则影响旋转效果。