---
title: '理解浏览器对文本溢出的处理'
publishDate: '2018-12-09 12:00:00'
description: ''
tags:
  - css
  - 编程技巧
language: '中文'
heroImage: {"src":"./css.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

最早遇到文本溢出是因为有些链接内容太长，需要缺省展示，就要截断一部分文本用省略号代替，最早对 `CSS` 还不是很懂的时候以为是手动写的，后来知道了一些文本溢出的相关属性开始使用，不过也都是看了个大致就直接拿来用了，没有细想那些属性的具体作用和使用场景，今天来谈一谈文本溢出的处理。

## 什么是文本溢出

首先说一说什么是文本溢出，就是父元素限定了宽度，而文本内容的长度超过了父元素的宽度且不能换行的时候就发了文本溢出，跟这个场景相关的几个属性`overflow，text-overflow，white-space，word-break，overflow-wrap`。上面我们说到了文本溢出必须是文本所在元素的宽度被限定了，所以文本所在元素必须是一个块级元素，因为行内元素的宽度是由其中的文本内容决定的，并不能用`width`来进行约束。我们仙来单独理解上面说到的五个属性。

## overflow

`overflow` 是溢出的意思，该属性定义了一个元素太大而无法适应块级格式上下文时的渲染方式。他是`overflow-x`和`overflow-y`的简写属性，一共有四个属性值：

1. `visible`（`default`）：溢出内容不会被修剪，会呈现在元素框外。这就是我们最常看到的我们的元素超出父元素的边界，显示到了父元素外面。
2. `hidden`：溢出的内容会被修建，让元素能够适应元素框，不提供滚动条。
3. `scroll`：内容会被修剪来适应元素框,浏览器会提供滚动条让用户来查看被修剪的内容，用打印机打印文档的时候，被修剪的内容也会被打印。
4. `auto`：由UA决定，当内容不溢出就正常显示，溢出则修剪并显示滚动条。
5. `inherit`：从父元素继承该属性。

> `auto` 和 `scroll` 的区别就是：`scroll` 无论当前是否需要滚动条，都会显示，只是当内容不需要滚动的时候，滚动条是不可用的。而 `auto` 则会根据是否有内容被裁剪而选择是否显示滚动条。不过如果你使用的是 `mac`，那么你没法看出两者的区别，`mac` 上默认是隐藏不需要的滚动条。

我们的文本要溢出至少要保证两个条件，就是文本所在元素的宽度要小于文本的宽度并且`overflow`为`visible|hidden`,而如果我们要用省略号代替截取文本则属性值只能选择`hidden`。

## text-overflow

`text-overflow` 属性指导浏览器如何渲染溢出内容。该属性职工有四个值：

1. `clip`（`default`）：该属性告诉浏览器在内容区域的极限处进行截断，也就是内容只能显示到元素框的边界，因此有可能发生一个字符出现一半就被截断的情况，如果要避免这种情况就要在截断处添加空字符串。
2. `ellipsis`：该属性值告诉浏览器用一个省略号`...`来代替被截断的文本，省略号被添加到可见区的末尾，因此可见的文本要缩短一些，如果元素框小到省略号也放不下，那么省略号也会被截断。
3. `string`：用任意自定义字符串来表示被截断内容。该属性目前只是个实验性功能，绝大多数浏览器都没有实现该功能，无法使用。

> 需要注意的一点是，如果文本没有发生溢出并且没有截断，那么该属性是不会生效的，也就是说要使用该属性必须是在文本溢出，并且`overflow: hidden;`才能起作用，`overflow: scroll;`虽然也能显示该属性，出现省略号或者截断，但是当`text-overflow: ellipsis`是，溢出的文本将无法展示，省略号后面的内容被空白符代替。

## white-space

在说 `white-space` 之前我们先说一说什么是空白符 `whitespace`，一般来说我们在编程语言中使用空白符都是分隔 `token`，但是在不同的语言中对空白符的定义并不相同。在 `HTML` 中规定了五种空白符：`U+0009 TAB, U+000A LF (line feed), U+000C FF (form feed), U+000D CR (carriage return), and U+0020 SPACE`，他们分别对应 `ASCII` 中的 `9，10，12，13，32` 位的控制符。

`white-space` 属性告诉浏览器如何处理元素中的空白符。该属性有五个值: 1. `normal`：多个连续空白符会被合并，换行符也会被当作一个空白符来处理。文本会适应包含元素进行换行。 2. `nowrap`：会像 `normal` 属性一样合并多个连续空白符，但是文本内的换行无效。 3. `pre`: 连续空白符会被保留，只有遇到换行符或者`<br>`才会进行换行。 4. `pre-wrap`: 连续空白符会被保留，遇到换行符或者`<br>`会换行，同时在包含元素边界也会换行。 5. `pre-line`：连续空白符会被合并，遇到换行符或者`<br>`以及包含元素边界会换行。 6. `break-spaces`: 与 `pre-wrap` 的行为相同，除了：任何保留的空白序列总是占用空间，包括在行尾。每个保留的空格字符后都存在换行机会，包括空格字符之间。这样保留的空间占用空间而不会挂起，从而影响盒子的固有尺寸（最小内容大小和最大内容大小）。

`MDN` 整理了这几个值的区别

|  | 换行符 | 空格和制表符 | 文字换行 | 行尾空格 |
| --- | --- | --- | --- | --- |
| `normal` | 合并 | 合并 | 换行 | 删除 |
| `nowrap` | 合并 | 合并 | 不换 | 删除 |
| `pre` | 保留 | 保留 | 不换行 | 保留 |
| `pre-wrap` | 保留 | 保留 | 换行 | 挂起 |
| `pre-line` | 保留 | 合并 | 换行 | 删除 |
| `break-spaces` | 保留 | 保留 | 换行 | 换行 |

空白符的合并其实比较好理解，比较难理解的是文字的换行。我个人的理解是，`normal` 空格和换行符一样，都可以进行换行（换行符被当做空格一样，但是每个空格处都可以换行）；`nowrap` 中任何换行符无效；`pre` 只有在遇到换行符和 `br` 标签的时候会换行；`pre-wrap` 空格和换行符 `br` 都可以进行换行；`pre-line` 和 `pre-wrap` 换行机制一致（它们的不同在于是否合并空格和制表符）；`break-spaces` 和 `pre-wrap` 的机制大致相同，不同的是行尾出现大段连续空白的时候，`break-spaces` 会将这些空白符全部输出，并且他能在任何空格处换行。

所以会在水平方向上超出父元素的只有 `nowrap` 和 `pre` 两个属性。几个属性最后的效果可以查看：[white-space 效果Demo](https://cdn.clloz.com/study/white-space.html "white-space 效果Demo")

> 正常情况下，我们需要文本溢出的时候我们会希望文本显示在同一行，因为默认情况下我们的文本到达元素框边界的时候是会自动换行的，所以我们需要`white-space: nowrap`来约束文本显示在一行。

## word-break

`word-break` 属性指定浏览器怎样在单词内断行。该属性有四个值： 1. `normal`：按默认规则进行换行，对于CJK（中文/日语/韩文）在每个字符之间都可以换行，而对于非CJK则需要在单词结束换行，如果一个单词的长度超过了元素框的宽度，那么该文本将溢出 2. `break-all`：在任意字符之间都可以换行。 3. `keep-all`： 对于非 `CJK` 语言，按 `normal` 规则，对于 `CJK` 不换行。

几个属性的最后效果可以查看：[word-break 效果 Demo](https://cdn.clloz.com/study/word-break.html "word-break 效果 Demo")

> 当`white-space: nowrap`文本不换行的时候，该属性无效。

## overflow-wrap

`word-wrap` 属性原本属于微软的一个私有属性，在 `CSS3` 现在的文本规范草案中已经被重名为 `overflow-wrap`。 `word-wrap` 现在被当作 `overflow-wrap` 的 “别名”。 稳定的谷歌 `Chrome` 和 `Opera` 浏览器版本支持这种新语法。

`overflow-wrap` 属性指导浏览器对于特别长的超出元素框宽度的单词是否可以从中间断开换行。有两个属性： 1. `normal`：不允许断开单词。 2. `break-word`：当单词过长，元素的宽度不能容纳单词则会在单词内部断开强制换行。 3. `anywhere`：目前支持不是很好。

几个属性的最后效果可以查看：[overflow-wrap 效果 Demo](https://cdn.clloz.com/study/overflow-wrap.html "overflow-wrap 效果 Demo")

与 `word-break` 相比，`overflow-wrap` 仅在无法将整个单词放在自己的行而不会溢出的情况下才会产生中断。所以我们可以看到 `word-break: break-all` 会在任意地方进行中断，文本当中不会留下很多空白；而 `overflow-wrap: break-word` 只会在不得不断的地方（整行都放不下一个单词）进行中断，所以会出现很多空白。

> 当`overflow-wrap: break-word`时，`word-break: keep-all`将不会生效，元素依然会从中间断开。可以理解为`overflow-wrap`的优先级是比`word-break`高的，再加上`white-space: nowrap;`属性，优先级为`white-space > overflow-wrap > word-break`。

## 多行文本的溢出处理

需要注意几个属性的兼容性。

```css
/*单行文本溢出用省略号显示：*/
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;

/*多行文本溢出用省略号显示：*/
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
overflow: hidden;
```

## 总结

当我们需要显示缩略文本时，我们要做到这几件事：文本保持在一行，文本长度超出元素宽度，元素不支持滚动条，用省略号代替溢出文本。依次实现代码如下：

```css
.style {
    white-sapce: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```