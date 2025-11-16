---
title: 'HTML character entity HTML字符实体'
publishDate: '2019-11-19 12:00:00'
description: ''
tags:
  - html
  - 实用技巧
  - 编程技巧
language: '中文'
heroImage: {"src":"./W3C®.png","color":"#B4C6DA"}
---

\[toc\]

## 前言

我在[搞懂字符编码](https://www.clloz.com/programming/assorted/2019/04/26/character-encoding/ "搞懂字符编码")这篇文章中对计算机字符编码的原理和常用的字符编码都进行了说明，编码的本质就是为了方便信息的传输，以及计算机对于信息的处理。

在文章中我也提到，而在 `HTML` 里面，我们的每一个字符其实也都是以 `unicode` 编码的形式保存和传递的。而 `HTML`，`CSS` 和 `JavaScript` 都给我们提供了对应的直接使用 `unicode` 的方法，具体使用方法可以看[搞懂字符编码](https://www.clloz.com/programming/assorted/2019/04/26/character-encoding/ "搞懂字符编码")这篇文章。

在 `HTML` 中的 `unicode` 使用一般被称为 `HTML character entity`，是用 `unicode` 的字符串来表示对应的字符，使用情况主要是应对一些 `reserved characters` （保留字符），比如在 `HTML` 中的 `<` `>`，他们出现在 `HTML` 文档中时会被浏览器识别为标签，为了显示这些保留字，我们需要使用 `entity`。还有一种情况是我们要显示一些无法用键盘输入的特殊字符。

## HTML entity 的使用

`character entity` 表示字符的方式有两种，一种是直接用 `unicode` 的形式表示字符，另一种是在 `HTML` 标准里面为了方便使用已经被命名的 `entity`，他们的使用方法如下：

1. `unicode`：`&#nnnn;` 或者 `&#xhhhh;`，前者是 `unicode` 编码的十进制，后者是十六进制。
2. `name`：`&name;`

两种方式并不冲突，他们可以用来表示同一个字符，`name` 的形式是 `HTML` 标准替一些常用的符号直接给出了命名，方便记忆。因为 `unicode` 需要使用的话每次都需要去查询，而命名的话比较方便记忆。比如 `©` 可以用 `# copy;` 也可以用 `&# 169;`

> 在 `JavaScript` 里面表示二进制用 `0bXXXXXXX`，八进制用 `0XXXXXX`，十六进制 `0xXXXXXXX`，`X` 表示数字。

想要查询字符和实体之间对应的编码和解码可以到[HTML entity encoder/decoder](https://mothereff.in/html-entities "HTML entity encoder/decoder")

最后在分享两个前端的标准制定协会[W3C - Wikipedia](https://en.wikipedia.org/wiki/World_Wide_Web_Consortium "W3C - Wikipedia") 和 [WHATWG - Wikipedia](https://en.wikipedia.org/wiki/WHATWG "WHATWG - Wikipedia")给出的 `HTML Named character references`，`WHATWG` 主要是维护 `HTML` 相关的标准，`W3C` 则是维护几乎所有跟 `Web` 有关的标准，目前他们已经开始合作推动 `web` 标准：[W3C AND WHATWG TO WORK TOGETHER TO ADVANCE THE OPEN WEB PLATFORM](https://www.w3.org/blog/2019/05/w3c-and-whatwg-to-work-together-to-advance-the-open-web-platform/ "W3C AND WHATWG TO WORK TOGETHER TO ADVANCE THE OPEN WEB PLATFORM")

- [HTML Named character references - WHATWG](https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references "HTML Named character references - WHATWG")
- [HTML Named character references- W3C](https://dev.w3.org/html5/html-author/charref "- W3C")

在使用 `markdown` 的时候有时候会遇到需要转义一些有特殊含义字符的需要比如 `$`，或者是在代码块里面要 加入转义的内容，可以用使用 `<code></code>` 中间加入 `character entity`。当你的 `markdown` 解析出现问题的时候可以看一看是不是某些有含义的字符解析出错导致的，如果是的话， 将这些字符换成字符实体即可。

* * *

`entity` 中使用最多的应该是 `< ;`（`lt`\>（`lt` 就是 `left tag`）的意思，当我们想在文档中插入标签结构的时候，如果直接使用 `<>` 会被解析成元素，此时我们可以将左标签用 `< ;` 来代替 `<`，就可以正常显示了。比如下面的代码用

```html
<pre>
    < ;html>
        < ;head>
            < ;title>this is a title</title>
        < ;/head>
        < ;body>this is a body</body>
    < ;/html>
</pre>
```

> 由于实体在 `markdown` 会解析成对应的字符，所以我在 `;` 前留一个空格。

## 参考文章

1. [Entity-MDN](https://developer.mozilla.org/en-US/docs/Glossary/Entity "Entity-MDN")
2. [HTML Document Representation](https://www.w3.org/TR/html4/charset.html#entities "HTML Document Representation")
3. [List of XML and HTML character entity references - Wikipedia](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references "List of XML and HTML character entity references - Wikipedia")