---
title: 'Github markdown 锚点'
publishDate: '2019-06-04 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
heroImage: { 'src': './github.png', 'color': '#B4C6DA' }
---

## 前言

一般的 `HTML` 锚点都是通过 `url` 中的 `hash` 来让浏览器知道要滚动到哪个元素。这里说的 `hash` 就是 `location.hash` 可以简单理解为 `url` 中 `#` 后面的内容。如果我们的页面中有元素的 `id` 和 `hash` 相同，并且它处在一个可滚动的容器中，那么浏览器会在页面加载的时候直接滚动到该元素。

这个功能很有用，通常是用在一个很长的页面中的目录上，比如我们经常看到的 `HTML`，`CSS`，`ECMAScript` 等标准一般都会给目录加上锚点，方便我们直接跳转到对应内容，否则靠滚动的话太不方便。`markdown` 自然也有需要锚点的场景，不过不同的 `markdown` 实现可能不相同，今天我在整理书单的时候想把书单也同步到 `Github` 上，`README.md` 中就需要用到锚点，这里说一下 `Github` 的锚点使用。

## 锚点使用

## 标题的锚点链接

在 `markdown` 中我们使用一个或多个 `#` 来创建段落标题，在 `Github` 上显示的 `markdown` 的标题默认会加上与标题名称相同的锚点标记也就是 `id`。所以我们可以使用如下方法来使用锚点。

```markdown
[标题1](#标题1)
[标题2](#标题2)
[标题3](#标题3)

# 标题1

## 标题2

## 标题3
```

> 需要注意的是，我们经常使用中文标题，中文标题的锚点会进行 `url` 的编码操作，`url` 编码细节可以看[这篇文章](https://www.clloz.com/programming/front-end/js/2019/05/09/url-encode-decode/ '这篇文章')

## 锚点名称小写

```markdown
[Github标题1](#github标题1)

## Github标题1
```

## 空格用 - 代替

```markdown
[Github 标题2 Test](#github-标题2-test)

## Github 标题2 Test
```
