---
title: 'CSS中的字体图标'
publishDate: '2018-12-10 12:00:00'
description: ''
tags:
  - css
  - 编程技巧
language: '中文'
---

## 前言

我们在前端开发当中经常使用 `font-awesome` 和`iconfont` 等字体图标，今天来说一说字体图标的原理。

## 浏览器是如何渲染字体的

当浏览器接受 `HTML` 文件开始渲染的时候，文档树中的文本都会被转化成对应的 `unicode` 编码，然后根据我们设置的 `font-family` 到系统中找到对应的字体，再将 `unicode` 码渲染成对应的字体样式。如果没有找到或者我们没有设置 `font-family` ，那么浏览器就会选择自己默认的字体来渲染。比如我们把`前端开发`四个字转成 `unicode` 是 `0x524D 0x7AEF 0x5F00 0x53D1`，在 `HTML` 中表示 `Unicode` 编码用`&#x hexadecimal;`的形式 (或者是 `&# decimal;` 的形式)，我们把前面的四个 `Unicode` 转成该形式写入 `html` 文件中，可以发现依然可以解析的。

## 字体图标原理

有了上面的渲染过程，字体图标的制作就很简单了。 1. 制作字体文件 2. `font-face` 引入字体文件（可以使用本地连接和第三方链接） 3. 使用 `font-family`（`HTML` 实体或者伪元素`:before`)

我们目前接触的字体图标包括 `iconfont` `fontAwesom`都是这样的原理，用 `font-face` 引入自定义的字体文件，然后对要应用字体的元素约束自定义的 `font-family`，最后用伪元素 `:before` 的 `content` 来给定元素的 `unicode` 码来设置对应的图标，其实如果我们不用伪元素，直接在元素中输入字符 `unicode` 码对应的HTML实体（ `HTML entity` ）也可以实现效果，`<span class="iconfont icon-alipay"></span>` 也可以写成 `<span class="iconfont"></span>`,效果一样。

```css
@font-face {
  font-family: 'iconfont';
  src: url('//at.alicdn.com/t/font_958524_6v80ih0o45k.eot?t=1544418917327'); /* IE9*/
  src:
    url('//at.alicdn.com/t/font_958524_6v80ih0o45k.eot?t=1544418917327#iefix')
      format('embedded-opentype'),
    /* IE6-IE8 */ url('//at.alicdn.com/t/font_958524_6v80ih0o45k.ttf?t=1544418917327')
      format('truetype'),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
      url('//at.alicdn.com/t/font_958524_6v80ih0o45k.svg?t=1544418917327#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-alipay:before {
  content: '\e63b';
}

.icon-wechat:before {
  content: '\e658';
}

.icon-qq:before {
  content: '\e603';
}
```

## 其他实现方法

实现图标的还有其他的方法： 1. `image` ：在最早接触 `css` 相信大家还不知道 `iconfont` 等，都是用图标来实现的，使用很不方便，并且会增加请求数量（一个图标一个请求），不推荐 2. `CSS sprites` ： 精灵图，即将多个图标放到一个图片上，用 `background-position` 来控制图片的位置来显示图标，缺点是不能缩放，并且添加图标麻烦 3. `CSS icon` ：纯 `CSS` 写的 `icon` ，不是很好，不推荐。 4. `SVG` ：比较流行的方法，矢量图，可以任意缩放添加样式，多个图标也可以放大一个 `svg` 文件中。
