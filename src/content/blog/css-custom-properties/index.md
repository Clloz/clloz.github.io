---
title: 'CSS自定义属性'
publishDate: '2020-08-11 12:00:00'
description: ''
tags:
  - css
  - 奇技淫巧
  - 编程技巧
language: '中文'
heroImage: {"src":"./css.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

`CSS` 自定义属性也被称为 `CSS` 变量。一直以来，在 `CSS` 中使用变量和函数都是很多人的期待，没有变量和函数的 `CSS` 不够灵活。目前的 `CSS` 依然是依靠层叠和继承来实现元素之间的样式关联，但实际上一些在结构上“不相关”的元素之间的样式并不是完全不相关的，比如我们整个页面的风格，色调等。目前的 `CSS` 更像是一个标记语言，一份对 `DOM` 文档的配置表，是静态的。引入变量和函数是 `CSS` 的一个发展方向，今天这篇文章就介绍一下目前已经被绝大多数浏览器支持的 `CSS` 自定义属性。

## 兼容性

我们可以在[Can I use](https://caniuse.com/#feat=css-variables "Can I use")上查看到目前的 `CSS variable` 的兼容性，除了 `IE`、 `QQ` 和 `baidu`，其他的主流浏览器都已经支持该特性。该特性目前处于[CR](https://www.clloz.com/programming/front-end/2018/10/03/w3c-standard-drafts/ "CR")状态。

## 使用方法

带有前缀 `--` 的属性名，比如 `--example`、`--name`，表示的是带有值的自定义属性，其可以通过 `var` 函数在全文档范围内复用的。

> 自定义属性名是**大小写敏感**的，`--my-color` 和 `--My-color` 会被认为是两个不同的自定义属性。

自定义属性的值可以是任何合法的 `CSS` 属性值。自定义属性也可以像别的 `CSS` 属性指定选择器。但是一般情况下我们是定义全局变量，选择器为 `:root`，`:root` 这个 `CSS` 伪类匹配文档树的根元素。对于 `HTML` 来说，`:root` 表示 `<html>`元素，除了优先级更高之外，与 `html` 选择器相同。。（我们也可以在非常复杂的选择器中比如 `#wrap .container li.active` 中定义变量，但一般不会有这种需求）

自定义属性的使用也非常简单，像函数调用一样 `var()`。`var()` 函数可以代替元素中任何属性中的值的任何部分。`var()` 函数不能作为属性名、选择器或者其他除了属性值之外的值。（这样做通常会产生无效的语法或者一个没有关联到变量的值。）语法 `var( <custom-property-name> , <declaration-value>? )`，方法的第一个参数是要替换的自定义属性的名称。函数的可选第二个参数用作回退值。如果第一个参数引用的自定义属性无效，则该函数将使用第二个值。

```css
/* 只要合法的CSS属性值就可以作为变量值 */
--somekeyword: left;
--somecolor: #0000ff;
--somecomplexvalue: 3px 6px rgb(20, 32, 54);

/* 只能在选择器内使用 */
selector {
  --theme-color: gray;
}

/* 设置全局变量 */
:root {
    --theme-color: gray;
}

/* 使用变量 */
.button {
  background-color: var(--theme-color);
}

.title {
  color: var(--theme-color);
}

.image-grid > .image {
  border-color: var(--theme-color);
}
```

自定义属性并不是你在其他编程语言中遇到的实际的变量。这些值仅当需要的时候才会计算，而并不会按其他规则进行保存。比如，你不能为元素设置一个属性，然后让它从兄弟或旁支子孙规则上获取值。属性仅用于匹配当前选择器及其子孙，这和通常的 `CSS` 是一样的。

* * *

自定义属性的回退值允许使用逗号。例如， `var(--foo, red, blue)` 将 `red, blue` 同时指定为回退值；即是说任何在第一个逗号之后到函数结尾前的值都会被考虑为回退值。

实际上回退值可以包含任何字符，但是部分有特殊含义的字符除外，例如换行符、不匹配的右括号（如 `)`、`]` 或 `}`）、感叹号以及顶层分号（不被任何非 `var()` 的括号包裹的分号，例如`var(--bg-color, --bs;color)`是不合法的，而 `var(--bg-color, --value(bs;color))` 是合法的）。

`var()` 的第二个参数也可以用 `var()` 嵌套。但是不建议这样使用，性能会有影响。

```css
.two {
  color: var(--my-var, red); /* Red if --my-var is not defined */
}

.three {
  background-color: var(--my-var, var(--my-background, pink)); /* pink if --my-var and --my-background are not defined */
}

.three {
  background-color: var(--my-var, --my-background, pink); /* Invalid: "--my-background, pink" */
}
```

* * *

当浏览器遇到无效的 `var()` 时（比如变量未设定并且没给出缺省值，或者当前元素不支持该属性），会使用继承值或初始值代替。

```css
/*若为一个p元素设置如下的CSS*/
:root { --text-color: 16px; }
p { color: blue; }
p { color: var(--text-color); }
```

浏览器会将 `--text-color` 的值替换给了 `var(--text-color)`，但是 `16px` 并不是 `color` 的合法属性值。代换之后，该属性不会产生任何作用。当遇到一个无效的 `var()` 时，浏览器会先看父元素有没有设置对应的属性，有则继承；如果没有则使用该属性的默认值。

* * *

自定义属性还可以和 `calc()` 结合实现更强大的功能。

```css
:root {
  --base-size: 4px;
}
.title {
  text-size: calc(5 * var(--base-size));
}
.body {
  text-size: calc(3 * var(--base-size));
}
:root {
  --base-size: 4px;
  --title-multiplier: 5;
  --body-multiplier: 3;
}
.title {
  text-size: calc(var(--title-multiplier) * var(--base-size));
}
.body {
  text-size: calc(var(--body-multiplier) * var(--base-size));
}
```

* * *

在 `JavaScript` 中获取或者修改 `CSS` 变量和操作普通 `CSS` 属性是一样的，并且有了自定义属性后我们也可以更抽象地用 `JavaScript` 控制 `CSS` 了，一定程度上实现 `JavaScript` 和 `CSS` 的解耦，将一些需要用 `JavaScript` 操作的 `CSS` 属性用变量代替，我们只要操作这个变量即可，而不用管在哪些元素中使用了这个变量。

```javascript
// 获取一个 Dom 节点上的 CSS 变量
element.style.getPropertyValue("--my-var");

// 获取任意 Dom 节点上的 CSS 变量
getComputedStyle(element).getPropertyValue("--my-var");

// 修改一个 Dom 节点上的 CSS 变量
element.style.setProperty("--my-var", jsVar + 4);
```

## 作用

我在前言中已经提到过自定义属性的作用，虽然我们在 `CSS` 中利用级联和继承来实现属性的复用，但是一些在 `DOM` 结构上并不相关的元素可能也有要复用的属性。复杂的网站都会有大量的 `CSS` 代码，通常也会有许多重复的值，比如同一个颜色值可能在很多地方被使用，如果这个值发生了变化，需要全局搜索并且一个一个替换。自定义属性很好的解决了这个问题。另一个好处是语义化的标识。比如，`--main-text-color` 会比 `#00ff00` 更易理解，尤其是这个颜色值在其他上下文中也被使用到。

```css
/*不用自定义属性的实现*/
.image-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
}

.image-grid > .image {
  margin: 8px;
  width: calc(100% - 16px);
}

@media (min-size: 600px) {
  /* 3 images per line */
  .image-grid > .image {
    width: calc(100% / 3 - 16px);
  }
}

@media (min-size: 1024px) {
  /* 6 images per line */
  .image-grid > .image {
    width: calc(100% / 6 - 16px);
  }
}

/*用自定义属性的实现*/
:root {
  --grid-spacing: 16px;
  --grid-columns: 1;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  padding: calc(var(--grid-spacing) / 2);
}

.image-grid > .image {
  margin: calc(var(--grid-spacing) / 2);
  width: calc(100% / var(--grid-columns) - var(--grid-spacing));
}

@media (min-size: 600px) {
  :root {
    --grid-columns: 3;
  }
}

@media (min-size: 1024px) {
  :root {
    --grid-columns: 6;
  }
}
```

## 参考文章

1. [使用CSS自定义属性（变量）](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties "使用CSS自定义属性（变量）")
2. [CSS自定义属性（变量）](https://developer.mozilla.org/zh-CN/docs/Web/CSS/--* "CSS自定义属性（变量）")
3. [CSS自定义属性](https://zhuanlan.zhihu.com/p/25714131 "CSS自定义属性")