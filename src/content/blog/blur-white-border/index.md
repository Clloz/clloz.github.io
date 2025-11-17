---
title: '去掉模糊背景或图片的白边'
publishDate: '2019-05-23 12:00:00'
description: ''
tags:
  - css
  - 编程技巧
language: '中文'
heroImage: { 'src': './blur2.png', 'color': '#B4C6DA' }
---

## 前言

有时候我们会对页面的背景或者某个图片使用 `blur` 属性来达到模糊的毛玻璃效果，这样会让我们的内容更突出，不会被背景图片而干扰。但是使用模糊背景的一个问题是，在模糊的图片边缘，由于模糊效果会让底层的颜色露出来，比如我们对我们页面的背景进行模糊的时候会把 `body` 的背景色透出来，一般我们的 `body` 是白色的，所以会有一圈模糊的白边，下面来分享几种解决问题的方法。

![blur1](./images/blur1.png 'blur1')

查看代码点击[页面](https://www.clloz.com/study/blur/blur1.html)

## 小图片

铺满全屏的背景和页面上的小图片的处理方法的不同的，对于页面上的小图片我们只需要给它的包含元素添加一个 `overflow: hidden` 就可以。

```html
<style>
  html,
  body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .wrap {
    height: 300px;
    width: 450px;
    margin: 20px auto;
  }
  .wrap.s2 {
    overflow: hidden;
  }
  .wrap img {
    height: 300px;
    width: 450px;
    filter: blur(5px);
  }
</style>
<div class="wrap s1"><img src="https://img.clloz.com/blog/writing/totoro.jpg" alt="" /></div>
<div class="wrap s2"><img src="https://img.clloz.com/blog/writing/totoro.jpg" alt="" /></div>
```

我们可以明显的看出第一个图片的边缘也是模糊效果，`body` 的白色透出，而第二张图片虽然也是模糊的，但是边缘却很清晰。

![blur2](./images/blur2.png 'blur2')

查看代码点击[页面](https://www.clloz.com/study/blur/blur2.html)

## 全屏背景处理

处理小图片的方式非常简单，但是这个方法在页面背景上却不生效，至于为什么我也不太清楚，不过我尝试了多次，只使用 `overflow: hidden` 并不能让页面的背景边缘变清晰。

只能另辟蹊径了，大家的解决方法虽然代码有所不同，不过手段都差不多，都是通过扩大背景所在元素的大小来实现的，也就是说把模糊的那部分移动到可视范围之外，具体有如下几种做法。

## transform: scale() 扩大

既然要改变大小，自然会想到 `transform` 属性，使用这个属性需要注意的是，扩大的比例。如果你的图片不需要考虑细节，那么你可以把比例调大一点。如果图片细节比较重要，那么就要选择适当的比例，还要考虑在不同大小的屏幕上的效果。

```html
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html,
  body {
    height: 100%;
    width: 100%;
  }
  .cover {
    height: 100%;
    width: 100%;
    background: url('https://img.clloz.com/blog/writing/totoro.jpg');
    background-size: cover;
    filter: blur(5px) brightness(0.5);
    transform: scale(1.02);
  }
</style>
<div class="cover"></div>
```

![blur3](./images/blur3.png 'blur3')

查看代码点击[页面](https://www.clloz.com/study/blur/blur3.html)

## 绝对定位

不设置背景所在元素的大小，用绝对定位的定位属性来设置图片的大小也可以达到效果。

```html
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html,
  body {
    height: 100%;
    width: 100%;
  }
  .cover {
    position: absolute;
    top: -8px;
    right: -8px;
    bottom: -8px;
    left: -8px;
    background: url('https://img.clloz.com/blog/writing/totoro.jpg');
    background-size: cover;
    filter: blur(5px) brightness(0.5);
  }
</style>
<div class="cover"></div>
```

查看代码点击[页面](https://www.clloz.com/study/blur/blur4.html)

## 总结

可能还有其他更好的方法，这几个方法都需要设置 `body` 的 `overflow` 为 `hideen`，不过这也不算什么问题，需要滚动的话再包一层就可以了。如果你有更好的办法欢迎回复。

## 参考文章

1. [知乎回答：大漠](https://www.zhihu.com/question/43602522/answer/113510488 '知乎回答：大漠')

2. [CSS Background Image Blur without blurry edges](http://volkerotto.net/2014/07/03/css-background-image-blur-without-blury-edges/ 'CSS Background Image Blur without blurry edges')
