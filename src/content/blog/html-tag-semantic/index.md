---
title: 'HTML标签语义化'
publishDate: '2020-08-25 12:00:00'
description: ''
tags:
  - html
  - 学习笔记
language: '中文'
heroImage: { 'src': './html-logo.png', 'color': '#B4C6DA' }
---

## 前言

在 `HTML5` 中推出了很多语义化的标签，所谓语义化就是标签能够对内容有所表达，比如 `p` 标签就是段落 `paragraph` 的意思。其实如果只是实现页面的效果，只使用 `div` 和 `span` 就可以做到。但是语义化的好处就是对开发者比较友好，文档的结构清晰，各部分功能一目了然，便于开发和维护。同时语义化的文档也能够对 `SEO` 起到更好的效果。本文来介绍一下 `HTML5` 中的标签。

## HTML5 标签

本文列出了所有标准化的 `HTML5` 元素，使用起始标签描述，按照功能分组。新网站应当只使用这里列出的元素。

符号 这个元素在 HTML5 中加入 代表该元素是在 `HTML5` 中新增的。另外注意，这里列出的其他元素可能在 `HTML5` 标准中得到了扩充或经过修改。

## 根元素

| Element  | Description                                                           |
| -------- | --------------------------------------------------------------------- |
| `<html>` | 代表 `HTML` 或 `XHTML` 文档的根。其他所有元素必须是这个元素的子节点。 |

## 文档元数据

| Element   | Description                                                                                  |
| --------- | -------------------------------------------------------------------------------------------- |
| `<head>`  | 代表关于文档元数据的一个集合，包括脚本或样式表的链接或内容。                                 |
| `<title>` | 定义文档的标题，将显示在浏览器的标题栏或标签页上。该元素只能包含文本，包含的标签不会被解释。 |
| `<base>`  | 定义页面上相对 `URL` 的基准 `URL`。                                                          |
| `<link>`  | 用于链接外部资源到该文档。                                                                   |
| `<meta>`  | 定义其他 `HTML` 元素无法描述的元数据。                                                       |
| `<style>` | 用于内联 `CSS`。                                                                             |

## 脚本

| Element      | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| `<script>`   | 定义一个内联脚本或链接到外部脚本。脚本语言是 `JavaScript`。             |
| `<noscript>` | 定义当浏览器不支持脚本时显示的替代文字。                                |
| `<template>` | 这个元素在 `HTML5` 中加入，通过 `JavaScript` 在运行时实例化内容的容器。 |

## 章节

| Element                         | Description                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `<body>`                        | 代表 `HTML` 文档的内容。在文档中只能有一个 `<body>` 元素。                                            |
| `<section>`                     | 这个元素在 `HTML5` 中加入，定义文档中的一个章节。                                                     |
| `<nav>`                         | 这个元素在 `HTML5` 中加入，定义只包含导航链接的章节。                                                 |
| `<article>`                     | 这个元素在 `HTML5` 中加入，定义可以独立于内容其余部分的完整独立内容块。                               |
| `<aside>`                       | 这个元素在 `HTML5` 中加入，定义和页面内容关联度较低的内容——如果被删除，剩下的内容仍然很合理。         |
| `<h1>,<h2>,<h3>,<h4>,<h5>,<h6>` | 标题元素实现了六层文档标题，`<h1>` 是最大的标题，`<h6>` 是最小的标题。标题元素简要地描述章节的主题。  |
| `<header>`                      | 这个元素在 `HTML5` 中加入，定义页面或章节的头部。它经常包含 logo、页面标题和导航性的目录。            |
| `<footer>`                      | 这个元素在 `HTML5` 中加入，定义页面或章节的尾部。它经常包含版权信息、法律信息链接和反馈建议用的地址。 |
| `<address>`                     | 定义包含联系信息的一个章节。                                                                          |
| `<main>`                        | 这个元素在 `HTML5` 中加入，定义文档中主要或重要的内容。                                               |

## 组织内容

| Element        | Description                                           |
| -------------- | ----------------------------------------------------- |
| `<p>`          | 定义一个段落。                                        |
| `<hr>`         | 代表章节、文章或其他长内容中段落之间的分隔符。        |
| `<pre>`        | 代表其内容已经预先排版过，格式应当保留 。             |
| `<blockquote>` | 代表引用自其他来源的内容。                            |
| `<ol>`         | 定义一个有序列表。                                    |
| `<ul>`         | 定义一个无序列表。                                    |
| `<li>`         | 定义列表中的一个列表项。                              |
| `<dl>`         | 定义一个定义列表（一系列术语和其定义）。              |
| `<dt>`         | 代表一个由下一个 `<dd>` 定义的术语。                  |
| `<dd>`         | 代表出现在它之前术语的定义。                          |
| `<figure>`     | 这个元素在 `HTML5` 中加入，代表一个和文档有关的图例。 |
| `<figcaption>` | 这个元素在 `HTML5` 中加入，代表一个图例的说明。       |
| `<div>`        | 代表一个通用的容器，没有特殊含义。                    |

## 文字形式

| Element       | Description                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `<a>`         | 代表一个链接到其他资源的超链接 。                                                                                                            |
| `<em>`        | 代表强调 文字。                                                                                                                              |
| `<strong>`    | 代表特别重要 文字。                                                                                                                          |
| `<small>`     | 代表注释 ，如免责声明、版权声明等，对理解文档不重要。                                                                                        |
| `<s>`         | 代表不准确或不相关 的内容。                                                                                                                  |
| `<cite>`      | 代表作品标题 。                                                                                                                              |
| `<q>`         | 代表内联的引用 。                                                                                                                            |
| `<dfn>`       | 代表一个术语包含在其最近祖先内容中的定义 。                                                                                                  |
| `<abbr>`      | 代表省略 或缩写 ，其完整内容在 title 属性中。                                                                                                |
| `<data>`      | 这个元素在 `HTML5` 中加入，关联一个内容的机器可读的等价形式 （该元素只在 `WHATWG` 版本的 `HTML` 标准中，不在 `W3C` 版本的 `HTML5` 标准中）。 |
| `<time>`      | 这个元素在 `HTML5` 中加入，代表日期 和时间 值；机器可读的等价形式通过 `datetime` 属性指定。                                                  |
| `<code>`      | 代表计算机代码 。                                                                                                                            |
| `<var>`       | 代表代码中的变量 。                                                                                                                          |
| `<samp>`      | 代表程序或电脑的输出 。                                                                                                                      |
| `<kbd>`       | 代表用户输入 ，一般从键盘输出，但也可以代表其他输入，如语音输入。                                                                            |
| `<sub>,<sup>` | 分别代表下标 和上标 。                                                                                                                       |
| `<i>`         | 代表一段不同性质 的文字，如技术术语、外文短语等。                                                                                            |
| `<b>`         | 代表一段需要被关注 的文字。                                                                                                                  |
| `<u>`         | 代表一段需要下划线呈现的文本注释，如标记出拼写错误的文字等。                                                                                 |
| `<mark>`      | 这个元素在 `HTML5` 中加入，代表一段需要被高亮的引用 文字。                                                                                   |
| `<ruby>`      | 这个元素在 `HTML5` 中加入，代表被ruby 注释 标记的文本，如中文汉字和它的拼音。                                                                |
| `<rt>`        | 这个元素在 `HTML5` 中加入，代表 `ruby` 注释 ，如中文拼音。                                                                                   |
| `<rp>`        | 这个元素在 `HTML5` 中加入，代表 `ruby` 注释两边的额外插入文本 ，用于在不支持 `ruby` 注释显示的浏览器中提供友好的注释显示。                   |
| `<bdi>`       | 这个元素在 `HTML5` 中加入，代表需要脱离父元素文本方向的一段文本。它允许嵌入一段不同或未知文本方向格式的文本。                                |
| `<bdo>`       | 指定子元素的文本方向 ，显式地覆盖默认的文本方向。                                                                                            |
| `<span>`      | 代表一段没有特殊含义的文本，当其他语义元素都不适合文本时候可以使用该元素。                                                                   |
| `<br>`        | 代表换行 。                                                                                                                                  |
| `<wbr>`       | 这个元素在 `HTML5` 中加入，代表建议换行 (`Word Break Opportunity`) ，当文本太长需要换行时将会在此处添加换行符。                              |

## 编辑

| Element | Description             |
| ------- | ----------------------- |
| `<ins>` | 定义增加 到文档的内容。 |
| `<del>` | 定义从文档移除 的内容。 |

## 嵌入内容

| Element    | Description                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------ |
| `<img>`    | 代表一张图片 。                                                                                  |
| `<iframe>` | 代表一个内联的框架 。                                                                            |
| `<embed>`  | 这个元素在 `HTML5` 中加入，代表一个嵌入 的外部资源，如应用程序或交互内容。**不推荐使用**         |
| `<object>` | 代表一个外部资源 ，如图片、HTML 子文档、插件等。                                                 |
| `<param>`  | 代表 `<object>` 元素所指定的插件的参数 。                                                        |
| `<video>`  | 这个元素在 `HTML5` 中加入 ，表一段视频及其视频文件和字幕，并提供了播放视频的用户界面。           |
| `<audio>`  | 这个元素在 `HTML5` 中加入，代表一段声音 ，或音频流 。                                            |
| `<source>` | 这个元素在 `HTML5` 中加入，为 `<video>` 或 `<audio>` 这类媒体元素指定媒体源 。                   |
| `<track>`  | 这个元素在 `HTML5` 中加入，为 `<video>` 或 `<audio>` 这类媒体元素指定文本轨道（字幕） 。         |
| `<canvas>` | 这个元素在 `HTML5` 中加入，代表位图区域 ，可以通过脚本在它上面实时呈现图形，如图表、游戏绘图等。 |
| `<map>`    | 与 `<area>` 元素共同定义图像映射 区域。                                                          |
| `<area>`   | 与 `<map>` 元素共同定义图像映射 区域。                                                           |
| `<svg>`    | 这个元素在 `HTML5` 中加入，定义一个嵌入式矢量图 。                                               |
| `<math>`   | 这个元素在 `HTML5` 中加入，定义一段数学公式 。**大多数浏览器暂不支持**                           |

## 表格

| Element      | Description                           |
| ------------ | ------------------------------------- | --- | --- |
| `<table>`    | 定义多维数据 。                       |
| `<caption>`  | 代表表格的标题 。                     |
| `<colgroup>` | 代表表格中一组单列或多列 。           |
| `<col>`      | 代表表格中的列 。                     |
| `<tbody>`    | 代表表格中一块具体数据 （表格主体）。 |
| `<thead>`    | 代表表格中一块列标签 （表头）。       |
| `<tfoot>`    | 代表表格中一块列摘要 （表尾）。       |
| `<tr>`       | 代表表格中的行 。                     |
| `<td>`       | 代表表格中的单元格                    |     | 。  |
| `<th>`       | 代表表格中的头部单元格 。             |

## 表单

| Element      | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| `<form>`     | 代表一个表单 ，由控件组成。                                             |
| `<fieldset>` | 代表控件组 。                                                           |
| `<legend>`   | 代表 `<fieldset>` 控件组的标题 。                                       |
| `<label>`    | 代表表单控件的标题 。                                                   |
| `<input>`    | 代表允许用户编辑数据的数据区 （文本框、单选框、复选框等）。             |
| `<button>`   | 代表按钮 。                                                             |
| `<select>`   | 代表下拉框 。                                                           |
| `<datalist>` | 这个元素在 `HTML5` 中加入，代表提供给其他控件的一组预定义选项 。        |
| `<optgroup>` | 代表一个选项分组 。                                                     |
| `<option>`   | 代表一个 `<select>` 元素或 `<datalist>` 元素中的一个选项                |
| `<textarea>` | 代表多行文本框 。                                                       |
| `<keygen>`   | 这个元素在 `HTML5` 中加入，代表一个密钥对生成器控件。**已在标准中废弃** |
| `<output>`   | 这个元素在 `HTML5` 中加入，代表计算值 。                                |
| `<progress>` | 这个元素在 `HTML5` 中加入，代表进度条 。                                |
| `<meter>`    | 这个元素在 `HTML5` 中加入，代表滑动条 。                                |

## 交互元素

| Element      | Description                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| `<details>`  | 这个元素在 `HTML5` 中加入，代表一个用户可以(点击)获取额外信息或控件的小部件 。 |
| `<summary>`  | 这个元素在 `HTML5` 中加入，代表 `<details>` 元素的综述 或标题 。               |
| `<menuitem>` | 这个元素在 `HTML5` 中加入，代表一个用户可以点击的菜单项。**已在标准中废弃**    |
| `<menu>`     | 这个元素在 `HTML5` 中加入，代表菜单。                                          |

## 新标签的应用

在 `HTML5` 中提供的新标签中有些特别的可以拿出来特别说一下。

## templete 内容模板元素

`HTML` 内容模板（`<template>`）元素是一种用于保存客户端内容机制，该内容在加载页面时不会呈现，但随后可以(原文为 `may be`)在运行时使用 `JavaScript` 实例化。将模板视为一个可存储在文档中以便后续使用的内容片段。虽然解析器在加载页面时确实会处理 `<template>` 元素的内容，但这样做只是为了确保这些内容有效；但元素内容不会被渲染。

<!-- <iframe height="100" width="100%" title="figure tag" src="https://cdn.clloz.com/study/html-tag-semantic/template.html" style="border: none"></iframe> -->

## figure 和 figurecaption

`HTML <figure>` 元素代表一段独立的内容, 经常与说明（`caption`） `<figcaption>` 配合使用, 并且作为一个独立的引用单元。当它属于主内容流（`main flow`）时，它的位置独立于主体。这个标签经常是在主文中引用的图片，插图，表格，代码段等等，当这部分转移到附录中或者其他页面时不会影响到主体。

<!-- <iframe height="200" width="100%" title="figure tag" src="https://cdn.clloz.com/study/html-tag-semantic/figure.html" style="border: none"></iframe> -->

## mark

`<mark>` 元素用来显示与用户当前活动相关的一部分文档内容。例如，它可能被用于显示匹配搜索结果中的单词。

## ruby>、rt 和 rp

`<ruby>` 元素被用来展示东亚文字注音或字符注释。 `<rt>` 代表 `ruby` 注释 ，如中文拼音，日语罗马音等。 `<rp>` 元素用于不支持 `<ruby>` 元素的情况。 `<rp>` 的内容提供了应该展示的东西，通常是圆括号，以便表示 `ruby` 注解的存在。

> `ruby` 这个单词来源于日语 `ルビ`，表示注音假名小铅字，即振り仮名。`ruby` 语言的名字也来源于此。

<!-- <iframe height="60" width="100%" title="figure tag" src="https://cdn.clloz.com/study/html-tag-semantic/ruby.html" style="border: none"></iframe> -->

## bdi 和 bdo

这两个元素在[HTML全局属性dir](https://www.clloz.com 'HTML全局属性dir')中进行详细介绍。

## wbr

`<wbr>` 是指 `Word Break Opportunity`，让浏览器在需要换行时从我们设定的位置进行换行。`<wbr>` 仅仅表示一个零宽的位置，不会对文本产生额外的影响。我们可以在我们期待浏览器换行的位置插入 `<wbr>` 标签，比如 `url` 的换行推荐在各个标点之前。比如如下的代码，当我们不断减小视口或元素的宽度，浏览器会从我们设置 `<wbr>` 的位置进行换行。

```html
<p>
  http://this<wbr />.is<wbr />.a<wbr />.really<wbr />.long<wbr />.example<wbr />.com/With<wbr />/deeper<wbr />/level<wbr />/pages<wbr />/deeper<wbr />/level<wbr />/pages<wbr />/deeper<wbr />/level<wbr />/pages<wbr />/deeper<wbr />/level<wbr />/pages<wbr />/deeper<wbr />/level<wbr />/pages
</p>
```

## embed

`<embed>` 元素将外部内容嵌入文档中的指定位置。此内容由外部应用程序或其他交互式内容源（如浏览器插件）提供。

大多数现代浏览器已经弃用并取消了对浏览器插件的支持，所以如果您希望您的网站可以在普通用户的浏览器上运行，那么依靠 `<embed>` 通常是不明智的。可以使用 `<img>、<iframe>、<video>、<audio>` 等标签代替。

## picture、video、audio、track 和 source

这四个标签都是用来在文档中嵌入媒体文件的。

`<picture>` 元素通过包含零或多个 `<source>` 元素和一个 `<img>` 元素来为不同的显示/设备场景提供图像版本。浏览器会选择最匹配的子 `<source>` 元素，如果没有匹配的，就选择 `<img>` 元素的 `src` 属性中的 `URL`。然后，所选图像呈现在 `<img>` 元素占据的空间中。

`<video>` 元素 用于在 `HTML` 或者 `XHTML` 文档中嵌入媒体播放器，用于支持文档内的视频播放。这些视频资源可以使用 `src` 属性或者 `<source>` 元素来进行描述：浏览器将会选择最合适的一个来使用。也可以将 `<video>` 标签用于音频内容，但是 `<audio>` 元素可能在用户体验上更合适。

`<audio>`元素用于在文档中嵌入音频内容。 `<audio>` 元素可以包含一个或多个音频资源， 这些音频资源可以使用 `src` 属性或者 `<source>` 元素来进行描述：浏览器将会选择最合适的一个来使用。也可以使用 `MediaStream` 将这个元素用于流式媒体。

`<track>` 元素被当作媒体元素 `<audio>` 和 `<video>` 的子元素来使用。它允许指定时序文本字幕（或者基于时间的数据），例如自动处理字幕。字幕格式有 `WebVTT` 格式（`.vtt` 格式文件）— `Web` 视频文本字幕格式，以及指时序文本标记语言（`TTML`）格式。

`<source>` 元素为 `<picture>`, `<audio>` 或者 `<video>` 元素指定多个媒体资源。这是一个空元素。它通常用于以不同浏览器支持的多种格式提供相同的媒体内容。要决定加载哪个 `URL`，`user agent` 检查每个 `<source>` 的 `srcset`、`media` 和 `type` 属性，来选择最匹配页面当前布局、显示设备特征等的兼容资源。

```html
<picture>
  <source media="(min-width: 650px)" srcset="demo1.jpg" />
  <source media="(min-width: 465px)" srcset="demo2.jpg" />
  <img src="img_girl.jpg" />
</picture>
```

> `<audio>` 和 `<video>` 都有很多属性和用法，本文不作详细介绍。

## canvas

`<canvas>`元素可被用来通过 `JavaScript`（`Canvas API` 或 `WebGL API`）绘制图形及图形动画。`<canvas>` 的内容也是非常丰富的，不在本文做详细介绍。

## svg

`SVG` 是一种基于 `XML` 语法的图像格式，全称是可缩放矢量图（`Scalable Vector Graphics`）。其他图像格式都是基于像素处理的，`SVG` 则是属于对图像的形状描述，所以它本质上是文本文件，体积较小，且不管放大多少倍都不会失真。

如果 `svg` 不是根元素，`svg` 元素可以用于在当前文档（比如说，一个 `HTML` 文档）内嵌套一个独立的 `svg` 片段 。 这个独立片段拥有独立的视口和坐标系统。

`svg` 的内容可以参考阮一峰老师的文章[SVG图像入门教程](https://www.ruanyifeng.com/blog/2018/08/svg.html 'SVG图像入门教程')

## math

`Mathematical Markup Language (MathML)` 是一个用于描述数学公式、符号的一种 `XML` 标记语言。`MathML` 的顶级元素是 `<math>`。所有有效的 `MathML` 实例必须被包括在 `<math>` 标记中。另外不可以在一个 `<math>` 元素中嵌套第二个 `<math>` 元素，但是 `<math>` 元素中可以有任意多的子元素 。

`MathML` 的内容可以参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/MathML 'MDN')，目前大多数浏览器都不支持 `<math>`，如果想使用数学公式有几个方案：

1. 用 `LaTex` 编译数学公式，默认输出 `PDF`，可以转为 `png` 再到页面使用。
2. 使用 [MathJax](https://github.com/mathjax/MathJax 'MathJax') 渲染。
3. 使用 [KaTeX](https://github.com/KaTeX/KaTeX 'KaTeX') 渲染。

## datalist

`<datalist>` 元素包含了一组 `<option>` 元素，这些元素表示其它表单控件可选值。

<!-- <iframe height="60" width="100%" title="figure tag" src="https://cdn.clloz.com/study/html-tag-semantic/datalist.html" style="border: none"></iframe> -->

## output

`<output>` 标签表示计算或用户操作的结果。可以用标签的 `form` 属性指定关联的 `form` 的 `id`，从而达到在文档任何位置使用 `<output>` 的目的。

<!-- <iframe height="60" width="100%" title="figure tag" src="https://cdn.clloz.com/study/html-tag-semantic/output.html" style="border: none"></iframe> -->

## progress

`<progress>` 元素用来显示一项任务的完成进度.虽然规范中没有规定该元素具体如何显示,浏览器开发商可以自己决定,但通常情况下,该元素都显示为一个进度条形式。

<!-- <iframe height="60" width="100%" title="figure tag" src="https://cdn.clloz.com/study/html-tag-semantic/progress.html" style="border: none"></iframe> -->

## meter

`<meter>`元素用来显示已知范围的标量值或者分数值。

<!-- <iframe height="60" width="100%" title="figure tag" src="https://cdn.clloz.com/study/html-tag-semantic/meter.html" style="border: none"></iframe> -->

## details

`<details>` 元素可创建一个挂件，仅在被切换成展开状态时，它才会显示内含的信息。`<summary>` 元素可为该部件提供概要或者标签。

<!-- <iframe height="60" width="100%" title="figure tag" src="https://cdn.clloz.com/study/html-tag-semantic/details.html" style="border: none"></iframe> -->

## 已废弃的标签

以下标签已经从 `HTML5` 中移除，应停止使用。

- `<acronym>`
- `<applet>`
- `<basefont>`
- `<big>`
- `<center>`
- `<dir>`
- `<font>`
- `<frame>`
- `<frameset>`
- `<noframes>`
- `<strike>`
- `<tt>`

## 语义化标签实例

上面我们已经介绍了所有的 `HTML5` 标签，`HTML5` 提供了非常丰富的语义化标签。我们如何用这些语义化的标签来重构我们的文档解构呢？我们就以 `MDN` 的[HTML5 标签列表](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML5/HTML5_element_list 'HTML5 标签列表 - MDN')页面为例子来看看它是怎么实现的。`MDN` 的页面基本都是用语义化的标签编写 `HTML` 文档的。

首先我们按功能将页面分为几个主要结构，所有内容都是这些主要结构的子结构。

```html
<body>
  <div>
    <header>页面头部，通常包含 logo、页面标题和导航性的目录。</header>
    <main>主内容：整个页面核心内容</main>
    <section>一个章节：显示一些与页面主要内容无关的部分</section>
    <footer>页面尾部，通常包含版权信息、法律信息链接和反馈建议用的地址。</footer>
  </div>
</body>
```

这样我们就已经确定了页面的结构，当我们要写入一个内容的时候也知道应该往哪个部分填充。

## header

`header` 部分的内容有页面的标题，搜索框，用户头像和一个导航。`MDN` 采用的是 `grid` 网格结构，导航用的是 `nav` 标签，其他都是用 `div` 实现。

```html
<header>
  页面头部，通常包含 logo、页面标题和导航性的目录。
  <div>MDN标题</div>
  <nav>
    导航
    <ul>
      列表
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </nav>
  <div>搜索框</div>
  <div>用户头像</div>
</header>
```

## main

核心内容部分是用户浏览页面最关注的部分，我们来 `MDN` 查阅资料主要就是看这部分内容，甚至可以说只看这部分内容。

```html
<main>
  主内容：整个页面核心内容
  <header>主内容头部：包括标题导航等内容</header>
  <div>
    <aside>
      <section>
        侧边导航栏
        <header>侧边导航栏标题</header>
        <ul>
          列表展示当前页面的导航目录，点击跳转到对应章节，此处也可以用一个nav嵌套
        </ul>
      </section>
    </aside>
    <div class="content">
      核心内容
      <article>content</article>
      <div>
        一个独立于content的section：metadata 修改时间
        <section></section>
      </div>
    </div>
  </div>
</main>
```

## section

一个用来填写邮箱，接收 `MDN` 邮件的章节，内部为一个 `form`。

## footer

最后是页面的尾部，包含了 `MDN` 网站的一些重要链接导航和版权信息、法律信息链接等。

## 参考文章

1. [HTML5 标签列表 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML5/HTML5_element_list 'HTML5 标签列表 - MDN')
