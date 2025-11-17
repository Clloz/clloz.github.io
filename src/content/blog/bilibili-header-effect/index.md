---
title: '实现 B 站首页头部效果'
publishDate: '2020-10-11 12:00:00'
description: ''
tags:
  - js
  - 项目实现
language: '中文'
heroImage: { 'src': './project.png', 'color': '#B4C6DA' }
---

## 前言

今天偶然发现 `B` 站首页的头部有一个移动鼠标，背景移动并且透明度变化，也带有一点视差滚动的效果。同时小人的眼睛隔一段时间眨一下。我觉得挺有趣就自己实现了一下。

实现效果：点击查看 [Demo](https://clloz.com/study/bilibili-header-effect/dist/ 'Demo')

## 实现思路

分析一下这个效果大概就是两个部分。第一个部分是人物的眨眼，这个我用的嵌套的定时器实现。第二个部分就是鼠标移动改变图片的位置和透明度，这个用鼠标事件解决。

## 眨眼效果

眨眼效果的其实就是几张图片的连续播放。但是需要注意的是，眨眼的动作是非常快的，整个动作要三个状态，睁眼，半睁眼，闭眼，我们需要四张图片循环即可。

由于眨眼的帧之间的间隔和两次眨眼之间的间隔是不同的，我们需要嵌套定时器。外部的就是控制多久眨眼一次，内部的就是眨眼的几个帧的切换。对于定时器的嵌套中的一些细节可以看我的另一篇文章：[定时器的一些思考](https://clloz.com/blog/settimeout/ '定时器的一些思考')。最后的代码大致如下：

```javascript
let img = this.layers[anime.index].querySelector('img')

setInterval(() => {
  let index = 0

  let blink = setInterval(() => {
    img.src = `./images/${anime.path}/${index % anime.length}.png`
    index++
    if (index === anime.length + 1) clearInterval(blink)
  }, 100)
}, 5000)
```

这里有一个我没有解决的问题，我的图片切换是用改变 `img` 的 `src` 来实现的。这样会出现一个问题，每次改变 `src` 浏览器都会发送新的请求。而且由于我们的这种行为在浏览器看来很怪异，可能会被 `cancel` 掉（关于浏览器请求的 `cancel` 可以参考这篇文章 [浏览器你为什么要干掉我的请求？](https://segmentfault.com/a/1190000008492105 '浏览器你为什么要干掉我的请求？')。这就导致了我们本地运行可能没问题，但是到线上访问动画就时灵时不灵了。我看 `B` 站的实现似乎是将 `img` 这个元素替换了，源码混淆过，看着着实吃力，放弃了。这里应该是一个知识盲区，我尝试了替换元素，但是并没有效果 :dizzy_face: 。这里暂时只能留个坑，等以后知道怎么解决了再来填。

---

在 `segmentfault` 上提问后，[Fractal](https://segmentfault.com/u/fractal_5a0bfbf5bc7e7 'Fractal') 给出的回答是预先生成好 `img` 元素，放到一个数组中，然后定时器内替换即可。我是用 `cloneNode` 和 `replaceChild` 两个方法进行创建和切换的。这样就基本实现了原先要的效果了。以后遇到这种加载切换问题应该也可以用同样的逻辑解决。

## 鼠标事件

第二个效果就是移动鼠标图片会跟着移动，然后透明度变化，最后的效果就是感觉随着鼠标的移动，我们的视角也发生变化的感觉。这部分的实现就是用三个鼠标事件，`mouseover, mousemove, mouseout`。然后改变元素的 `style` 对象中的属性即可，并没有什么复杂的逻辑。需要注意的是，`mouseout` 之后我们要将元素的状态还原，同时解绑 `mousemove` 和 `mouseout` 事件。

## 总结

完整的代码在 [Github](https://github.com/Clloz/bilibili-header-effect 'Github')。运行方法为 `npm install` 之后运行 `npx webpack-dev-server` 然后打开 `index.html` 即可。
