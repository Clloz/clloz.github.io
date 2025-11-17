---
title: 'CSS 实现文字颜色渐变'
publishDate: '2020-08-25 12:00:00'
description: ''
tags:
  - css
  - 奇技淫巧
language: '中文'
heroImage: { 'src': './css.jpg', 'color': '#B4C6DA' }
---

## 前言

我经常将自己的一些突发奇想的设计到自己的博客上尝试。博客首页右侧的热门文章的小工具上的文本颜色一直没找到满意的，于是想试试渐变色的文本会不会有不错的效果。

## 文本渐变色实现

## background-clip

这种实现的主要思路就是对 `background` 进行裁剪。`background-clip` 提供了一个 `text` 属性，可以将背景裁剪成文本的前景色（即只有文本覆盖的部分有背景色），然后我们再将文本颜色设置为 `transparent` 即可以实现文本颜色的渐变。`background-clip` 的 `text` 属性目前仍然是实验功能，需要使用 `-webkit-background-clip` 才能生效。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>text-color-gradient</title>
    <style>
      .text-color-gradient {
        display: inline-block;
        font-size: 10em;
        font-weight: 700;
        background: linear-gradient(0.25turn, #c21500, #ffc500);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
    </style>
  </head>
  <body>
    <div style="text-align: center;">
      <div class="text-color-gradient">Clloz</div>
    </div>
  </body>
</html>
```

<!-- <iframe width="100%" height="200" src="https://www.clloz.com/study/text-color-gradient/background-clip.html" style="border: none;"></iframe> -->

## mask-image

第二种方法是使用 `mask-image` 配合伪元素做一个渐变遮罩层。如果我们的渐变是 `color A` 到 `color B`，我们可以将文本颜色设为 `A`，然后用伪元素（`content` 与元素文本相同）配合 `mask-image` 做一个渐变的遮罩层，渐变是从 `transparent` 到 `color B`，然后我们将伪元素覆盖到原来的文本上，就能得到想要的渐变。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>text-color-gradient</title>
    <style>
      .text-color-gradient {
        display: inline-block;
        font-size: 10em;
        position: relative;
        color: #ffc500;
      }

      .text-color-gradient[data-text]::after {
        content: attr(data-text);
        color: #c21500;
        position: absolute;
        left: 0;
        z-index: 2;
        -webkit-mask-image: linear-gradient(0.25turn, #c21500, transparent);
      }
    </style>
  </head>
  <body>
    <div style="text-align: center;">
      <div class="text-color-gradient" data-text="Clloz">Clloz</div>
    </div>
  </body>
</html>
```

<!-- <iframe width="100%" height="200" src="https://cdn.clloz.com/study/text-color-gradient/mask-image.html" style="border: none;"></iframe> -->

## 关于渐变色

关于渐变色推荐一个网站：[uigradients](https://uigradients.com/ 'uigradients')，该网站有很多不错的渐变色搭配。另外还有一个软件[aquarelo](https://www.macstories.net/reviews/aquarelo-a-beautifully-designed-mac-color-utility/ 'aquarelo')，可以查看渐变色，也支持导出。

## 总结

这就是我实现渐变的两种方法，总的来说还是第一种方法比较简单好用，并且可以设置两种以上颜色的渐变。`mask-image` 的 `linear-gradient` 取值似乎必须要一个 `transparent` ，并且只能有两个颜色。综合而言还是使用第一个方式比较好。

## 参考文章

1. [CSS3下的渐变文字效果实现](https://www.zhangxinxu.com/wordpress/2011/04/%E5%B0%8Ftipcss3%E4%B8%8B%E7%9A%84%E6%B8%90%E5%8F%98%E6%96%87%E5%AD%97%E6%95%88%E6%9E%9C%E5%AE%9E%E7%8E%B0/http:// 'CSS3下的渐变文字效果实现')
