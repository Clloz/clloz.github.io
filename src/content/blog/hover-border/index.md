---
title: '解决hover生成border造成的元素移动'
publishDate: '2019-05-27 12:00:00'
description: ''
tags:
  - css
  - 编程技巧
language: '中文'
---

## 前言

我们有时候会遇到 `hover` 伪类给元素添加边框的时候，元素中的内容发生位移，虽然我们设置了 `box-sizing: border-box`并且规定了元素的宽高，但是内容依然被边框挤开了。如下面这种情况：

```html
<style type="text/css" media="screen">
  .test {
    height: 30vmin;
    width: 30vmin;
    background: lightblue;
    box-sizing: border-box;
  }
  .test:hover {
    border: 5px solid black;
  }
</style>
<div class="test">this is a div.</div>
```

![hover-border](./images/hover-border.gif 'hover-border')

这里的原因很明显，我们的元素大小并没有变（如果没有设置元素宽高或者 `box-sizing: border-box` 则元素大小会改变），`box-sizing: border-box` 是生效的，但是元素中的内容因为突然添加的边框而被挤开了，我们的盒模型从外到内依次是`margin`，`border`，`padding`，`content`，所以新加入的 `border` 必然将 `content` 压缩的更小，并且 `content` 的边界坐标也变了，因为导致视觉上的内容移动。所以解决问题的办法就是让边框的添加不影响 `content` 的位置。

## 为元素添加边框

贸然出现的边框改变了原有的布局，让内容移动了，既然如此，我们可以在之前的布局中就让边框存在就可以了。

```css
.test {
  height: 30vmin;
  width: 30vmin;
  background: lightblue;
  border: 5px solid transparent;
  box-sizing: border-box;
}
.test:hover {
  border: 5px solid black;
}
```

## 使用 box-shadow

使用不占用盒模型空间的 `box-shadow` 或者 `outline` 也是一种选择，

```css
.test:hover {
  /* border: 5px solid black; */
  box-shadow: 0 0 0 5px black;
  outline: 5px solid black;
}
```

## 用 padding

我们可以通过改变 `padding` 大小来给 `border` 预留空间。

```css
.test {
  height: 30vmin;
  width: 30vmin;
  background: lightblue;
  box-sizing: border-box;
  padding: 5px;
}
.test:hover {
  padding: 0;
  border: 5px solid black;
}
```
