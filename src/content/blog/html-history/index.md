---
title: 'HTML 发展'
publishDate: '2020-08-24 12:00:00'
description: ''
tags:
  - html
  - 学习笔记
language: '中文'
heroImage: { 'src': './html-logo.png', 'color': '#B4C6DA' }
---

## 前言

`HTML` 的全称是 `HyperText Markup Language` 超文本标记语言，是一种用于创建网页的标准标记语言。所谓标记语言，就是一种将文本 `text` 以及文本相关的其他信息结合起来，展现出关于文档结构和数据处理细节的计算机编码，用标记进行标识。常见的标记语言有 `SGML` `HTML`、`XML` 和 `XHTML` 等。

## HTML 历史

其实关于早期的 `HTML` 版本我们并没有太多的了解必要，我们主要关注的是，`HTML4.01` 和 `HTML5` 之间的差别，以及 `SGML`、`XML` 和 `XHTML` 与 `HTML` 之间的区别。这里先简要介绍以下 `HTML` 的发展历史，作为了解即可。

首先介绍以下 `SGML`，标准通用标记语言（`Standard Generalized Markup Language`）是现时常用的超文本格式的最高层次标准，是可以定义标记语言的元语言，甚至可以定义不必采用`< >`的常规方式。由于它的复杂，因而难以普及。`HTML` 和 `XML` 同样派生于它：`XML` 可以被认为是它的一个子集，而 `HTML` 是它的一个应用。`XML` 的产生就是为了简化它，以便用于更加通用的目的，比如语义 `Web`。它已经应用于大量的场合，比较著名的有 `XHTML`、`RSS`、`XML-RPC` 和 `SOAP`。

`HTML` 是蒂姆·伯纳斯-李在发明万维网的过程中根据 `SGML` 创造的，它描述 `18` 个元素，包括 `HTML` 初始的、相对简单的设计。除了超链接之外，其他标签都是以 `SGML` 为基础的。这些标签中有 `11` 个到 `HTML4` 都仍然存在。

不存在 `HTML 1.0`，只在 `1993` 年中期由 [IETF互联网工程任务组](https://zh.wikipedia.org/zh/%E4%BA%92%E8%81%94%E7%BD%91%E5%B7%A5%E7%A8%8B%E4%BB%BB%E5%8A%A1%E7%BB%84 'IETF互联网工程任务组')提出了一个[超文本标记语言（HTML）互联网草案](https://www.w3.org/MarkUp/draft-ietf-iiir-html-01.txt '超文本标记语言（HTML）互联网草案')。`HTML` 第一个正式的规范是由 `IETF` 的 `HTML` 工作小组创建的 `HTML 2.0`。

在 `IETF` 的主持下，`HTML` 标准的进一步发展因竞争利益而遭受停滞。自 `1996` 年起，`HTML` 规范一直由万维网联盟（`W3C`）维护，并由商业软件厂商出资。不过在 `2000` 年，`HTML` 也成为国际标准（`ISO/ IEC15445：2000`）。`HTML 4.01` 于 `1999` 年末发布，进一步的勘误版本于 `2001` 年发布。`2004` 年，网页超文本应用技术工作小组（`WHATWG`）开始开发 `HTML5`，并在 `2008` 年与 `W3C` 共同交付，`2014年10月28日` 完成标准化。

> `whatwg` 是在 `W3C` 强推 `XHTML2.0` 后从 `W3C` 分裂出去的组织，如今两边已经是高度合作推动标准化。`W3C` 的 `HTML5` 是 `whatwg` 的一个 `snapshot`。`whatwg` 的标准是 `living standard`，也就是只有一个最新版本，不像 `w3c` 有各个阶段的版本。

## HTML 语法

![html-syntax](./images/html-syntax.jpg 'html-syntax')

## 标签

标签语法产生元素，我们从语法的角度讲，就用“标签”这个术语，我们从运行时的角度讲，就用“元素”这个术语。`HTML` 中，用于描述一个元素的标签分为开始标签、结束标签和自闭合标签。开始标签和自闭合标签中，又可以有属性。开始标签的标签名称只能使用英文字母。

- 开始标签：`<tagname>`
- 带属性的开始标签：`<tagname attributename="attributevalue">`
- 结束标签：`</tagname>`
- 自闭合标签：`<tagname />`

属性可以使用单引号、双引号或者完全不用引号，这三种情况下，需要转义的部分都不太一样。属性中可以使用字符实体（参考另一篇文章[HTML character entity HTML字符实体](https://www.clloz.com/programming/front-end/2019/11/19/html-character-entity/ 'HTML character entity HTML字符实体')）来做转义，属性中，一定需要转义的有下面几种。

- 无引号属性：`<tab> <LF> <FF> <SPACE> &`五种字符。
- 单引号属性：`' &`两种字符。
- 双引号属性：`" &`两种字符。

一般来说，灵活运用属性的形式，是不太用到文本实体转义的。

## 文本

在 `HTML` 中，规定了两种文本语法，一种是普通的文本节点，另一种是 `CDATA` 文本节点。注意，`CDATA` 片段不应该在 `HTML` 中被使用；它只在 `XML` 中有效。

## 注释

`HTML` 注释语法以 `<!--开头，以-->` 结尾，注释的内容非常自由，除了 `-->` 都没有问题。如果注释的内容一定要出现 `-->`，我们可以拆成多个注释节点。

## DTD 文档类型定义

`SGML` 的 `DTD` 语法十分复杂，但是对 `HTML` 来说，其实 `DTD` 的选项是有限的，浏览器在解析 `DTD` 时，把它当做几种字符串之一，关于 `DTD`，我在本篇文章的后面会详细讲解。

## ProcessingInstruction 语法（处理信息）

`ProcessingInstruction` 多数情况下，是给机器看的。`HTML` 中规定了可以有 `ProcessingInstruction`，但是并没有规定它的具体内容，所以可以把它视为一种保留的扩展机制。对浏览器而言，`ProcessingInstruction` 的作用类似于注释。`ProcessingInstruction` 包含两个部分，紧挨着第一个问号后，空格前的部分被称为“目标”，这个目标一般表示处理 `ProcessingInstruction` 的程序名。剩余部分是它的文本信息，没有任何格式上的约定，完全由文档编写者和处理程序的编写者约定。

## DTD

`DTD` 的全称是 `Document Type Defination`，也就是文档类型定义。`DTD` 是一套用来定义文档类型的标记声明，主要的对象是 `SGML` 家族的标记语言：`GML, SGML, XML, HTML`。在 `DTD` 中可以定义文档中的元素、元素的属性、元素的排列方式、元素包含的内容等等。`DTD` 有四个组成如下：

- 元素（`Elements`）
- 属性（`Attribute`）
- 实体（`Entities`）
- 注释（`Comments`）

```html
<!--元素声明语法-->
<!ELEMENT 元素名称　元素內容>
<!--属性声明语法-->
<!ATTLIST 元素名称、属性名称、属性值数据类型、属性默认值>
<!--实体声明语法-->
<!ENTITY 是名称　实体内容>
<!--注释语法-->
<!-- 注释内容 -->
```

---

在 `HTML5` 之后，由于这些 `DTD` 过于复杂的写法没啥实际用途，加之浏览器也不会使用 `SGML` 去解析他们，干脆放弃了 `SGML` 子集的的支持，规定了一个简单易记住的类似 `DTD` 的声明 `<!DOCTYPE html>`。`XML` 也逐渐用 `XML Schema` 来代替 `DTD`。但是因为我们的互联网上仍然存在大量的 `HTML4.01` 和 `xhtml1.0` 的网页，所以新的标准都是向前兼容的（比较激进的不向前兼容的 `xhtml2.0` 已经废弃）。常用的 `DOCTYPE` 声明有如下几种。

```html
<!--HTML 5-->
<!DOCTYPE html>

<!--HTML 4.01 Strict 这个 DTD 包含所有 HTML 元素和属性，但不包括表象或过时的元素（如 font ）。框架集是不允许的。-->
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<!--HTML 4.01 Transitional 这个 DTD 包含所有 HTML 元素和属性，包括表象或过时的元素（如 font ）。框架集是不允许的。-->
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<!--HTML 4.01 Frameset 这个 DTD 与 HTML 4.01 Transitional 相同，但是允许使用框架集内容。-->
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">

<!--XHTML 1.0 Strict 这个 DTD 包含所有 HTML 元素和属性，但不包括表象或过时的元素（如 font ）。框架集是不允许的。结构必须按标准格式的 XML 进行书写。-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<!--XHTML 1.0 Transitional 这个 DTD 包含所有 HTML 元素和属性，包括表象或过时的元素（如 font ）。框架集是不允许的。结构必须按标准格式的 XML 进行书写。-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!--XHTML 1.0 Frameset 这个 DTD 与 XHTML 1.0 Transitional 相同，但是允许使用框架集内容。-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">

<!--XHTML 1.1 这个 DTD 与 XHTML 1.0 Strict 相同，但是允许您添加模块（例如为东亚语言提供 ruby 支持）。-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
```

> `doctype` 声明开头的 `!DOCTYPE` 大小写不敏感。文档开头必须声明 `doctype` 否则浏览器无法判断文档类型，也无法正确解析。

## XML

可扩展标记语言（`Extensible Markup Language`）是从标准通用标记语言（`SGML`）中简化修改出来的。之所以成为可扩展是因为它的标记 `markup` 是可以由开发者自由定义的，而不像 `HTML` 是由标准制定者来定义一个通用的标准。

`XML` 用于描绘封装数据，而 `HTML` 超文本标记语言用于展示数据，`XHTML` 就是用 `XML` 规则规范的 `HTML`。`XML` 语法更加严格。`XML` 与 `HTML` 的区别主要有如下一些点：

- `XML` 大小写敏感，`HTML` 大小写不敏感。
- `XML` 是严格的树状结构，不能省略掉结束标记。
- 在 `XML` 中，拥有单个标记而没有匹配的结束标记的元素必须用一个`/` 字符作为结尾。这样分析器就知道不用查找结束标记了。
- 在 `XML` 中，属性值必须分装在引号中。在 `HTML` 中，引号是可用可不用的。
- 在 `HTML` 中，可以拥有不带值的属性名。在 `XML` 中，所有的属性都必须带有相应的值。
- 在 `XML` 文档中，空白部分不会被解析器自动删除；但是 `HTML` 是过滤掉空格的。
- `HTML` 使用固有的标记；而 `XML` 没有固有的标记。
- `HTML` 标签是预定义的；`XML` 标签是自定义的、可扩展的。
- `HTML` 是用来显示数据的；`XML` 是用来描述数据、存放数据的，所以可以作为持久化的介质。`HTML` 将数据和显示结合在一起，在页面中把这数据显示出来；`XML` 则将数据和显示分开。 `XML` 被设计用来描述数据，其焦点是数据的内容。`HTML` 被设计用来显示数据，其焦点是数据的外观。
- `XML` 不是 HTML 的替代品，`XML` 和 `HTML` 是两种不同用途的语言。 `XML` 不是要替换 `HTML`；`XML` 和 `HTML` 的目标不同 `HTML` 的设计目标是显示数据并集中于数据外观，而 `XML` 的设计目标是描述数据并集中于数据的内容。
- 没有任何行为的 `XML`。与 `HTML` 相似，`XML` 不进行任何操作。（共同点）
- 对于 `XML` 最好的形容可能是: `XML` 是一种跨平台的，与软、硬件无关的，处理与传输信息的工具。
- `XML` 未来将会无所不在。`XML` 将成为最普遍的数据处理和数据传输的工具。

## XHTML

可扩展超文本标记语言（`eXtensible HyperText Markup Language`），是一种标记语言，表现方式与超文本标记语言（`HTML`）类似，不过语法上更加严格。从继承关系上讲，`HTML` 是一种基于标准通用标记语言（`SGML`）的应用（`HTML5` 之前），是一种非常灵活的置标语言，而 `XHTML` 则基于可扩展标记语言（`XML`），`XML` 是 `SGML` 的一个子集。`XHTML 1.0` 在 `2000年1月26日` 成为 `W3C` 的推荐标准。

`XHTML1.1` 为 `XHTML` 最后的独立标准，`2.0` 止于草案阶段。`XHTML5` 则是属于 `HTML5` 标准的一部分，且名称已改为 `以XML序列化的HTML5 XML-serialized HTML5`，而非 `可扩展的HTML eXtensible HyperText Markup Language`。`XHTML5` 是对 `HTML5` 的 `XML` 序列化。`XML` 文档必须被设置为 `XML` 互联网文件类型，像 `application/xhtml+xml` 或者 `application/xml`。`XHTML5` 要求像 `XML` 一样严格的格式化的语法。在 `XHTML5` 中，`HTML5` 的`<!DOCTYPE HTML>` 可有可无的。

```html
Content-Type: text/html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>HTML</title>
  </head>
  <body>
    <p>I am a HTML document</p>
  </body>
</html>
```

```html
Content-Type: application/xhtml+xml <?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
  <head>
    <title>XHTML</title>
  </head>
  <body>
    <p>I am a XHTML document</p>
  </body>
</html>
```

`XHTML` 曾经是作为 `HTML` 的继承者推出的,由于 `HTML` 的语法较为松散,因此就出现了由 `DTD` 定义规则,语法要求更加严格的 `XHTML`。`XHTML` 与 `HTML` 的主要区别是：

- `XHTML` 与 `HTML` 的最大的变化在于所有标签必须闭合。
- `XHTML` 中所有的标签必须小写。
- `XHTML` 元素必须被正确地嵌套。
- `XHTML` 文档必须拥有根元素。

## HTML、XHTML、XML 和 SGML 的关系

- `SGML` 定义电子文档和内容描述的标准。`DTD` 标准是 `SGML` 的一部分。
- `XML` 是 `SGML` 的子集，优化版。
- `HTML` 是遵循了 `DTD` 标准的 `SGML` 的文档，也可以说是 `SGML` 的一个实例。
- `XHTML` 是遵循了 `XML` 标准的 `HTML` 文档。
- `HTML5` 是最新的 `HTML` 标准。但不基于 `SGML`，所以不遵循 `DTD` 标准。

## HTML5

`HTML5` 提供了一些新的元素和属性，反映典型的现代用法网站。其中有些是技术上类似 `<div>` 和 `<span>` 标签，但有一定含义，例如 `<nav>`（网站导航块）和 `<footer>`。这种标签将有利于搜索引擎的索引整理、小屏幕设备和视障人士使用。同时为其他浏览要素提供了新的功能，通过一个标准接口，如 `<audio>` 和 `<video>` 标记。一些过时的 `HTML 4.01` 标记将取消，其中包括纯粹用作显示效果的标记，如 `<font>` 和 `<center>`，因为它们已经被 `CSS` 取代。还有一些通过 `DOM` 的网络行为。

尽管和 `SGML` 在标记上的相似性，`HTML5` 的句法并不再基于它了，而是被设计成向后兼容对老版本的 `HTML` 的解析。它有一个新的开始列看起来就像 `SGML` 的文档类型声明，`<!DOCTYPE HTML>`，这会触发和标准兼容的渲染模式。

`HTML5` 与 `HTML4.01` 和 `XHTML1.x` 的差异

- 不再基于 `SGML` 所以也不再需要 `DTD`，文件类型声明仅有一型：`<!DOCTYPE HTML>`。
- 新的解析顺序：不再基于 `SGML`。
- 新的语义化标签：`section, video, progress, nav, meter, time, aside, canvas, command, datalist, details, embed, figcaption, figure, footer, header, hgroup, keygen, mark, output, rp, rt, ruby, source, summary, wbr`。
- `input` 元素的新类型：`date`, `email`, `url` 等等。
- 新的属性：`ping`（用于 `a` 与 `area`）, `charset`（用于 `meta`）, `async`（用于 `script`）。
- 全局属性：`id, tabindex, repeat`。
- 新的全局属性：`contenteditable, contextmenu, draggable, dropzone, hidden, spellcheck`。
- 移除标签：`acronym, applet, basefont, big, center, dir, font, frame, frameset, isindex, noframes, strike, tt`。

---

除了原先的 `DOM` 接口，`HTML5` 增加了更多样化的 `API`。

- Canvas
- Timed Media Playback
- Offline
- Editable content
- Drag and drop
- History
- MIME type and protocol handler registration
- Microdata
- Web Messaging
- Web Storage – a key-value pair storage framework that provides behaviour similar to cookies but with larger storage capacity and improved API.

关于 `HTML5` 的新特性，参考 `MDN` 的[HTML5](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML5 'HTML5')

## 总结

本文介绍了一些和 `HTML` 相关的概念，这些概念其实并不清晰甚至有些混乱，主要就是 `HTML` 的标准化本身就走的比较磕磕绊绊，有些标准已经消失在历史中。不过现在我们只要专注于掌握 `HTML5` 标准即可。用来描述数据的 `XML` 也需要掌握。

## 参考文章

1. [HTML、XML、XHTML 有什么区别 (SGML、DTD 标准 )](https://blog.csdn.net/weixin_41796631/article/details/89371356 'HTML、XML、XHTML 有什么区别 (SGML、DTD 标准 )')
2. [HTML5 - 维基百科](https://zh.wikipedia.org/wiki/HTML5#XHTML5%EF%BC%88XML-serialized_HTML5%EF%BC%89 'HTML5 - 维基百科')
