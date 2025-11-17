---
title: '获取文档中元素的宽高'
publishDate: '2019-04-27 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
---

## 前言

获取元素的尺寸和位置是我们经常需要遇到的问题，获取文档的高度有各种不同的方法，每个属性的作用各不相同。比如 `window` 对象的 `innerHeight` 和 `outerHeight` 就表示不一样的意思，元素的属性也一样。获取元素尺寸和位置的时间也很重要，如果我们在元素还没加载的时候获取肯定是得不到正确结果的。比较安全的方法当然是 `load` 事件触发以后获取。

## load 事件和 onload 属性

我们一般都是使用 `window` 对象的 `onload` 属性来监控 `load` 事件，但其实文档中所有异步加载的资源都可以用 `load` 事件监控是否加载完成（非内联的 `script`，`link` ，以及 `image` ），这些资源的加载成功都会触发 `load` 事件。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Test</title>
    <script defer src="js/test.js"></script>
    <link rel="stylesheet" href="css/test.css" />
    <style>
      div {
        height: 50px;
        width: 80px;
        background-color: lightblue;
      }
    </style>
    <script>
      console.log(123)
    </script>
  </head>
  <body>
    <img src="img/totoro.jpg" alt="" />
    <div>this is a div element!</div>
    <script>
      function get(selector) {
        return document.querySelector(selector)
      }

      function getAll(selector) {
        return document.querySelectorAll(selector)
      }
      var img = get('img')
      var link = get('link')
      var style = get('style')
      var script = get('script')
      var div = get('div')
      var inner = getAll('script')[1]

      img.onload = function () {
        console.log('img')
      }

      link.onload = function () {
        console.log('link')
      }

      style.onload = function () {
        console.log('style')
      }

      script.onload = function () {
        console.log('script')
      }

      inner.onload = function () {
        console.log('inner')
      }

      div.onload = function () {
        console.log('div')
      }
    </script>
  </body>
</html>
```

输出结果：

```plaintext
123
link
script
img
```

非内联的 `js，css，image` 的加载完毕都触发了 `load` 事件。

## 获取元素宽高

## 不要用 element.style.width

`element.style` 这个属性获取的是元素的内联样式，也就是写在标签中 `style` 属性里的样式，内联样式本来就不推介，如果你是用 `style` 标签或者外部样式表引入的样式，`element.style.width` 是无法获取值的。

```html
<div style="width: 300px">this is a div element!</div>
<script>
  function get(selector) {
    return document.querySelector(selector)
  }

  var div = get('div')

  window.onload = function () {
    console.log(div.style.width)
  }
</script>
```

如果去掉div中的 `style` 属性，`div.style.width` 将输出空字符串。

## offsetHeight, offsetWidth

`offsetHeight` 可以用来计算元素的物理空间，此空间包括内容，`padding` 和 `border`（还包括滚动条的宽度，但大多时候滚动条的宽度是计算到 `padding` 和内容中的）。

```html
<style>
  div {
    height: 50px;
    width: 80px;
    padding: 10px;
    margin: 10px;
    border: 3px solid;
    background-color: lightblue;
    overflow: scroll;
  }
</style>
<div>sdfdsfsfdsfsdfdsfsfsfdsffsfsdfasfasfasfsafasfsafsafsafsafs</div>
<script>
  function get(selector) {
    return document.querySelector(selector)
  }
  var div = get('div')

  window.onload = function () {
    console.log(div.offsetHeight, div.offsetWidth) //76, 106
  }
</script>
```

## scrollHeight,scrollWidth

`scrollHeight` 用来计算可滚动容器的大小，包括不可见的部分，比如一个 `300*300` 的容器放入一个 `600*600` 的图片，此时 `scrollHeight` 为 `600`，当然，`scrollHeight` 的值需要加上 `padding` 的值。

```html
<style>
  div {
    height: 50px;
    width: 80px;
    padding: 10px;
    margin: 10px;
    border: 3px solid;
    background-color: lightblue;
    overflow: scroll;
  }
</style>
<div>sdfdsfsfdsfsdfdsfsfsfdsffsfsdfasfasfasfsafasfsafsafsafsafs</div>
<script>
  function get(selector) {
    return document.querySelector(selector)
  }
  var div = get('div')

  window.onload = function () {
    console.log(div.scrollWidth) //382
  }
</script>
```

## clientHeight,clientWidth

`clientHeight` 表示可视区域，包括内容和 `padding` (不包括边框），如果有滚动条，还需要减去滚动条的宽度。

```html
<style>
  div {
    height: 50px;
    width: 80px;
    padding: 10px;
    margin: 10px;
    border: 3px solid;
    background-color: lightblue;
    overflow: scroll;
  }
</style>
<div>sdfdsfsfdsfsdfdsfsfsfdsffsfsdfasfasfasfsafasfsafsafsafsafs</div>
<script>
  function get(selector) {
    return document.querySelector(selector)
  }
  var div = get('div')

  window.onload = function () {
    console.log(div.clientWidth) //100
  }
</script>
```

## window.getComputedStyle

`Window.getComputedStyle()` 方法返回一个对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有 `CSS` 属性的值。 私有的 `CSS` 属性值可以通过对象提供的 `API` 或通过简单地使用 `CSS` 属性名称进行索引来访问。这个方法是最推荐的，因为它是浏览器渲染引擎对外开放的接口，返回对象中的属性都是浏览器最终渲染计算的结果。需要注意的是，返回的宽高是跟你的 `box-sizing属性有关的`。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Test</title>
    <script defer src="js/test.js"></script>
    <link rel="stylesheet" href="css/test.css" />
    <style>
      div {
        height: 50px;
        /* width: 80px; */
        padding: 10px;
        margin: 10px;
        border: 3px solid;
        background-color: lightblue;
        overflow: scroll;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <img src="img/totoro.jpg" alt="" />
    <div>sdfdsfsfdsfsdfdsfsfsfdsffsfsdfasfasfasfsafasfsafsafsafsafs</div>
    <script>
      function get(selector) {
        return document.querySelector(selector)
      }
      var div = get('div')

      window.onload = function () {
        console.log(
          window.getComputedStyle(div, null).padding,
          window.getComputedStyle(div, null).border,
          window.getComputedStyle(div, null).width
        )
      }
    </script>
  </body>
</html>
```

返回结果： 1. `box-sizing: border-box;`:`10px 3px solid rgb(0, 0, 0) 1003px` 2. `box-sizng: content-box`:`10px 3px solid rgb(0, 0, 0) 977px`

## div.getBoundingClientRect()

`Element.getBoundingClientRect()` 方法返回元素的大小及其相对于视口的位置。 返回值是一个 `DOMRect` 对象，这个对象是由该元素的 `getClientRects()` 方法返回的一组矩形的集合, 即：是与该元素相关的 `CSS` 边框集合 。

`DOMRect` 对象包含了一组用于描述边框的只读属性——`left`、`top`、`right`和`bottom`，单位为像素。除了 `width` 和 `height` 外的属性都是相对于视口的左上角位置而言的。 ![getBoundingClinetRect](./images/getBoundingClientRect.png 'getBoundingClinetRect')

空边框盒（译者注：没有内容的边框）会被忽略。如果所有的元素边框都是空边框，那么这个矩形给该元素返回的 `width、height` 值为 `0`，`left、top` 值为第一个 `css` 盒子（按内容顺序）的 `top-left`值。

当计算边界矩形时，会考虑视口区域（或其他可滚动元素）内的滚动操作，也就是说，当滚动位置发生了改变，`top` 和 `left` 属性值就会随之立即发生变化（因此，它们的值是相对于视口的，而不是绝对的）。如果你需要获得相对于整个网页左上角定位的属性值，那么只要给 `top、left` 属性值加上当前的滚动位置（通过 `window.scrollX` 和 `window.scrollY` ），这样就可以获取与当前的滚动位置无关的值。

## offsetTop,offsetLeft

`offsetTop` 和 `offsetLeft` 表示该元素的左上角（边框外边缘）与已定位的父容器（ `offsetParent` 对象）左上角的距离.

`HTMLElement.offsetParent` 是一个只读属性，返回一个指向最近的（ `closest`，指包含层级上的最近）包含该元素的定位元素。如果没有定位的元素，则 `offsetParent` 为最近的 `table`, `table cell` 或`根元素`（标准模式下为 `html`；`quirks` 模式下为 `body` ）。当元素的 `style.display` 设置为 `none` 时，offsetParent 返回 null。`offsetParent` 很有用，因为 `offsetTop` 和 `offsetLeft` 都是相对于其内边距边界的。

> 在 `Webkit` 中，如果元素为隐藏的（ `display: none;` ）（该元素或其祖先元素的 `style.display` 为 `none`），或者该元素的 `style.position` 被设为 `fixed`，则该属性返回 `null`。在 `IE 9` 中，如果该元素的 ˚ 被设置为 `fixed`，则该属性返回 `null`。（ `display:none` 无影响。）

## clientLeft,clientTop

`clientTop` 和 `clientLeft` 返回内边距的边缘和边框的外边缘之间的水平和垂直距离，也就是左，上边框宽度

## 获取图片的原始大小

我们在js中获取的图片的 `width` 和 `height` 是被 `css` 修改过的大小，如果我们想在 `JS` 中获取图片的原始大小来操作 `DOM` 的话，我们有两个方法可以选择： 1. 新建一个 `img` 对象，把文档中的 `img` 对象的 `src` 赋值给新的对象，然后获取这个新的对象的宽高，不需要把新的对象添加到文档中。

```html
<img src="img/totoro.jpg" alt="" />
<script>
  function $(selector) {
    return document.querySelector(selector)
  }
  var img = $('img')
  img.onload = function () {
    var image = document.createElement('img')
    image.src = img.src
    console.log(image.width, image.height)
  }
</script>
```

2. `HTML5` 提供了一个新属性 `naturalWidth/naturalHeight` 可以直接获取图片的原始宽高。这两个属性在 `Firefox/Chrome/Safari/Opera` 及 `IE9` 里已经实现。

```html
<img src="img/totoro.jpg" alt="" />
<script>
  function $(selector) {
    return document.querySelector(selector)
  }
  var img = $('img')
  img.onload = function () {
    console.log(img.naturalHeight, img.naturalWidth)
  }
</script>
```

## 参考文档

1. [原生 JS 获取元素的尺寸和位置](https://segmentfault.com/a/1190000007687940 '原生 JS 获取元素的尺寸和位置')
2. [JavaScript获取图片的原始尺寸](https://www.cnblogs.com/snandy/p/3704218.html 'JavaScript获取图片的原始尺寸')
