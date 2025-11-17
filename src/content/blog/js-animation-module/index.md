---
title: '实现一个 JS 动画模块'
publishDate: '2020-09-27 12:00:00'
description: ''
tags:
  - js
  - 项目实现
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

前端的动画可以用 `CSS` 来实现，但是如果我们希望管理多个元素的动画进行，支持暂停和继续。那么我们可以用 `JS` 来实现。

## 功能分析

用 `CSS` 实现动画是用 `keyframe` 定义关键帧，然后用 `animation` 属性对关键帧的过渡进行配置，其中比较常用的几个属性是 `animation-na'me, animation-delay, animation-duration, animation-timing-function`（详细内容参考[使用 CSS 动画 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations/Using_CSS_animations '使用 CSS 动画 - MDN')）。

使用 `JavaScript` 来实现动画就是根据时间计算出对应时间点的元素样式。用 `JavaScript` 的好处是我们能够将动画的逻辑抽象出来，能够同时管理各种需要进行动画元素，并且我们能够对元素的动画进行更精确的控制，精确到帧。

从分析中我们可以得出，我们用 `JavaScript` 实现动画的核心就是对时间的把控，我们要明确每一帧元素应该处于什么样的状态。浏览器中一帧是 `16ms` （一秒钟 `60` 帧），我们要实现对每一帧的控制可以使用的几个方法是 `setInterval`，`setTimeout` 和 `requestAnimationFrame`。本文我们用 `requestAnimationFrame` 来实现。`requestAnimationFrame` 的 `API` 参考 [window.requestAnimationRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame 'window.requestAnimationRequest')

## 动画类

首先要设计一个动画类，这个动画类主要是对元素和动画属性的对象进行初始化，同时根据时间计算当前元素的样式。代码如下：

```javascript
class Animation {
  constructor(obj, prop, startVal, endVal, duration, delay, timeFunc, template) {
    this.obj = obj
    this.prop = prop
    this.startVal = startVal
    this.endVal = endVal
    this.duration = duration
    this.delay = delay
    this.timeFunc = timeFunc
    this.template = template
  }
  trans(time) {
    console.log(time)
    let range = this.endVal - this.startVal
    let progress = this.timeFunc(time / this.duration)
    this.obj[this.prop] = this.template(this.startVal + range * progress)
  }
}
```

参数中的 `obj` 是表示要应用动画的元素，`prop` 是要进行动画的属性，`timeFunc` 是和 `css` 中的 `animation-timing-function` 类似，`template` 是为了应对不同的 `CSS` 属性的不同格式，比如 `transform` 属性。

## timeline类

我们要对动画实现 `start`，`pause`，`resume` 等功能，需要一个 `timeline` 对时间进行管理。我们的 `Animation` 是根据时间计算样式的，这个时间是一个相对时间。比如 `pause` 功能，我们可以在用户点击 `pause` 按钮后记录时间，然后在用户点击 `resume` 按钮后计算出暂停的时间，在返回给 `Animation.trans()` 方法的时间中减去这个暂停的时间就能够让元素继续暂停之前的状态进行动画。

对于不同的元素的动画我们用 `Set` 进行管理，当有新的需要动画的元素加入时我们将 `new` 的 `Animation` 对象存入 `Set`，当动画完成在从 `Set` 中删除。

整个的逻辑还是比较简单的，直接看代码吧.

```javascript
const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick handler')
const ANIMATIONS = Symbol('animations')
const MOVETIME = Symbol('movetime')
const PAUSE_START = Symbol('pause start')
const PAUSE_TIME = Symbol('pause time')

export class Timeline {
  constructor() {
    this.state = 'inited'
    this[ANIMATIONS] = new Set()
    this[MOVETIME] = new Map()
  }
  start() {
    if (this.state !== 'inited') return
    this.state = 'started'
    let startTime = Date.now()
    this[PAUSE_TIME] = 0
    console.log(startTime)
    this[TICK] = () => {
      let now = Date.now()
      for (let animation of this[ANIMATIONS]) {
        let t
        if (this[MOVETIME].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME] - animation.delay
        } else {
          t = now - this[MOVETIME].get(animation) - this[PAUSE_TIME] - animation.delay
        }
        if (t > animation.duration) {
          this[ANIMATIONS].delete(animation)
          t = animation.duration
        }
        if (t > 0) animation.trans(t)
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
    }
    this[TICK]()
  }
  pause() {
    if (this.state !== 'started') return
    this.state = 'paused'
    this[PAUSE_START] = Date.now()
    cancelAnimationFrame(this[TICK_HANDLER])
  }
  resume() {
    if (this.state !== 'paused') return
    this.state = 'started'
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
    this[TICK]()
  }
  reset() {
    this.pause()
    this.state = 'inited'
    // let startTime = Date.now();
    this[ANIMATIONS] = new Set()
    this[MOVETIME] = new Map()
    this[TICK_HANDLER] = null
    this[PAUSE_START] = 0
  }
  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now()
    }
    this[ANIMATIONS].add(animation)
    this[MOVETIME].set(animation, startTime)
  }
}
```

一些模块中私有的属性，我用 `Symbol` 来生成，这样在模块文件外这些属性是不会被访问到的（目前 `ES6` 的静态属性支持还不好）。对于 `delay` 的处理其实和 `pause` 的逻辑也一样，我们记录 `start` 开始的时间，只有等到时间超过 `delay` 才会调用。注意我们的时间计算是从 `start` 开始一直到结束的，所以每次的 `pause` 的时间都需要累加到 `pause time` 中。

时间的前进我们利用 `requestAnimationFrame` 的回调函数来递归调用我们封装的函数实现。

最后我们可以为动画加上贝塞尔曲线的支持。

```javascript
export function cubicBezier(p1x, p1y, p2x, p2y) {
  const ZERO_LIMIT = 1e-6
  const ax = 3 * p1x - 3 * p2x + 1
  const bx = 3 * p2x - 6 * p1x
  const cx = 3 * p1x

  const ay = 3 * p1y - 3 * p2y + 1
  const by = 3 * p2y - 6 * p1y
  const cy = 3 * p1y
  function sampleCurveDerivativeX(t) {
    return (3 * ax * t + 2 * bx) * t + cx
  }
  function sampleCurveX(t) {
    return ((ax * t + bx) * t + cx) * t
  }
  function sampleCurveY(t) {
    return ((ay * t + by) * t + cy) * t
  }
  function solveCurveX(x) {
    var t2 = x
    var derivative
    var x2
    for (let i = 0; i < 8; i++) {
      x2 = sampleCurveX(t2) - x
      if (Math.abs(x2) < ZERO_LIMIT) {
        return t2
      }
      derivative = sampleCurveDerivativeX(t2)
      if (Math.abs(derivative) < ZERO_LIMIT) {
        break
      }
      t2 -= x2 / derivative
    }
    var t1 = 1
    var t0 = 0
    t2 = x
    while (t1 > t0) {
      x2 = sampleCurveX(t2) - x
      if (Math.abs(x2) < ZERO_LIMIT) {
        return t2
      }
      if (x2 > 0) {
        t1 = t2
      } else {
        t0 = t2
      }
      t2 = (t1 + t0) / 2
    }
    return t2
  }
  function solve(x) {
    return sampleCurveY(solveCurveX(x))
  }
  return solve
}

export let ease = cubicBezier(0.25, 0.1, 0.25, 1)
export let easeIn = cubicBezier(0.42, 0, 1, 1)
export let easeOut = cubicBezier(0, 0, 0.58, 1)
export let easeInOut = cubicBezier(0.42, 0, 0.58, 1)
```

效果查看：[效果Demo](https://cdn.clloz.com/study/js-animation '效果Demo')

代码地址：[Github](https://github.com/Clloz/Frontend-02-Template/tree/master/week13/animation 'Github')
