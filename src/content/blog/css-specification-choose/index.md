---
title: 'CSS标准'
publishDate: '2020-08-28 12:00:00'
description: ''
tags:
  - css
  - 学习笔记
  - 实用技巧
language: '中文'
heroImage: { 'src': './css.jpg', 'color': '#B4C6DA' }
---

## 前言

`CSS` 的知识本身就是比较庞杂，难以成体系，而且标准化也不像 `ECMAScript` 和 `HTML` 有一份完整的标准。一般我们查询 `CSS` 的内容都是到 `MDN` 上进行查询，如果想要查询 `W3C` 的标准，除了一份[CSS2.2](https://www.w3.org/TR/CSS22/Overview.html#minitoc 'CSS2.2')，其他的标准一大片，不知道看哪个才好。在`W3C` 的 `ALL STANDARDS AND DRAFTS` 中以 `CSS` 为 `title` 搜索一共有 `94` 份文档。本文来总结一下如何查看自己需要的标准。

## MDN

对于我们日常的查询来说，`MDN` 是一个更合适的选择，如果遇到问题都去查标准效率太低了，`MDN` 的内容足够满足我们的大部分需求了。

使用 `MDN` 我们除了使用使用关键词查询之外，在 [CSS参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference 'CSS参考')页面给出了按字母索引 的所有标准 `CSS` 属性、伪类、伪元素、数据类型、以及 `@` 规则。 还按类型排列的 `CSS` 选择器 列表和 `CSS` 关键概念 列表。还有一份简短的 `DOM-CSS / CSSOM` 参考。

`MDN` 的使用大家都不陌生，这里再给大家推荐两个软件，一个是 `Dash for Mac`，他提供了大多数语言和工具的 `API`，前端的包括 `HTML`，`CSS`，`Javascript`，`NodeJS`，`React`，`Vue`，`Angular` 等的 `API`，并且也能和 `Alfred` 进行整合，非常方便的 `API` 查询工具。

另一个是 `CodeRunner`，他右侧的工具栏直接可以进行 `Google`，`StackOverflow` 以及 `MDN` 的检索，非常方便。如果你是写一些小的 `demo` 非常建议使用这个软件。

## 标准

下面就是稍微有些杂乱的标准，如果我们想要系统地了解规范的细节，那么只能去看标准了。不过那么多的标准我们应该看哪些。这份[CSS Working Group Editor Drafts](https://drafts.csswg.org/ 'CSS Working Group Editor Drafts')可以作为参考，它给出了各个 `CSS` 细分区域有几份标准，哪一份是 `Current Work` 的。

在这些标准中最重要的就是 [CSS2.2](https://www.w3.org/TR/CSS22/Overview.html#minitoc 'CSS2.2')，它是所有 `CSS` 的基础，其他的标准都要在学习了 `CSS2.2` 之后，其中最重要的是：

- 5 Selectors 选择器
- 6 Assigning property values, Cascading, and Inheritance 属性值赋值，层叠和继承
- 8 Box model 盒模型
- 9 Visual formatting model 视觉格式化模型
- 10 Visual formatting model details 视觉格式化模型细节

`CSS2.2`之后的茫茫多的标准就是按具体内容细分成了独立的标准，比较重要的有如下这些：

- Selectors Level 4
- CSS Box Model Module Level 3
- CSS Cascading and Inheritance Level 3
- CSS Values and Units Module Level 3
- CSS Pseudo-Elements Module Level 4
- CSS Animations Level 1
- CSS Transforms Module Level 1
- Media Queries Level 4
- CSS Flexible Box Layout Module Level 1
- CSS Regions Module Level 1
- CSS Multi-column Layout Module
- CSS Inline Layout Module Level 3

我还是建议在有确实需要的时候再阅读标准，因为标准的阅读需要花费大量的时间，并且有些非常新的标准不一定就会一直持续下去，把最重要的 `CSS2.2` 掌握，其他的略读一下即可。

---

关于 `CSS2.2` 之后的标准还可以参考 `MDN` 的[CSS3](https://developer.mozilla.org/zh-CN/docs/Archive/CSS3 'CSS3')。`CSS3` 是层叠样式表（`Cascading Style Sheets`）语言的最新版本，旨在扩展 `CSS2.1`。它带来了许多期待已久的新特性， 例如圆角、阴影、`gradients`(渐变) 、`transitions`(过渡) 与 `animations`(动画) 。以及新的布局方式，如 `multi-columns` 、 `flexible box` 与 `grid layouts`。

`CSS Level 2` 经历了 `9` 年的时间（从 2002 年 8 月到 2011 年 6 月）才达到 `Recommendation`（推荐） 状态，主要原因是被一些次要特性拖了后腿。为了加快那些已经确认没有问题的特性的标准化速度，`W3C` 的 `CSS Working Group`(`CSS` 工作组) 作出了一项被称为 `Beijing doctrine` 的决定，将 `CSS` 划分为许多小组件，称之为模块（也就是我们现在看到的非常多的不同标准）。这些模块彼此独立，按照各自的进度来进行标准化。其中一些已经是 `W3C Recommendation` 状态，也有一些仍是 `early Working Drafts`（早期工作草案）。当新的需求被肯定后， 新的模块也会同样地添加进来。

从形式上来说，`CSS3` 标准自身已经不存在了。每个模块都被独立的标准化，现在标准 `CSS` 包括了修订后的 `CSS2.1` 以及完整模块对它的扩充，模块的 `level`（级别）数并不一致。可以在每个时间点上为 `CSS` 标准定义一个 `snapshots`（快照），列出 `CSS 2.1` 和成熟的模块。`W3C` 会定期的发布这些 `snapshots`。

## 参考文章

1. [有哪些CSS标准是前端工程师很有必要研读的？ - 貘吃馍香的回答 - 知乎](https://www.zhihu.com/question/41191048/answer/90058208 '有哪些CSS标准是前端工程师很有必要研读的？ - 貘吃馍香的回答 - 知乎 ')
2. [有哪些CSS标准是前端工程师很有必要研读的？ - 贺师俊的回答 - 知乎](https://www.zhihu.com/question/41191048/answer/89996829 '有哪些CSS标准是前端工程师很有必要研读的？ - 贺师俊的回答 - 知乎')
