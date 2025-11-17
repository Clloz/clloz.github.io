---
title: 'flex布局学习笔记'
publishDate: '2018-10-08 12:00:00'
description: ''
tags:
  - css
  - 编程技巧
language: '中文'
heroImage: { 'src': './flexbox.png', 'color': '#B4C6DA' }
---

## 前言

`flexbox`（[CSS Flexible Box Layout Module](https://www.w3.org/TR/css-flexbox-1/ 'CSS Flexible Box Layout Module')）是 `CSS3` 新增的特性，是一种新的弹性盒模型布局，这是一种在二维层面上的布局模型，它不仅可以让我们方便的分配空间给盒子中的元素，甚至是分配给元素的周围，同时也提供了在二维方向上对齐元素的功能，弹性盒模型布局让我们在实现响应式的页面的时候能够更方便更自如的实现功能。

## CSS 中的布局模式

在[CSS2.2规范](https://www.w3.org/TR/2016/WD-CSS22-20160412/Overview.html#minitoc 'CSS2.2规范')里出现了四种布局模式（`layout mode`）：

- 块布局：用来布置文件。块布局包含以文档为中心的功能，例如 浮动元素或将其放置在多列上的功能。
- 行内布局：用来布置文本。
- 表格布局：用来布置表格。
- 定位布局：用来对那些与其他元素无交互的定位元素进行布置。

布局模式其实是一种基于盒子与其兄弟和祖辈盒子的交互方式来确定盒子的位置和大小的算法，浏览器根据文档中元素的 `CSS` 属性来确定用哪种布局。为了应对新的需求，在 `CSS3` 里面新增了两种新的布局： - 弹性盒子布局：用来布置那些可以顺利调整大小的复杂页面。 - 网格布局：用来布置那些与一个固定网格相关的元素。

> `flex` 布局已经进入 `Candidate Recommendation (CR)` 阶段，`grid` 布局目前还处在 `Working Draft (WD)` 工作草案阶段，属于实验性 `API`。

浮动，`display` 和 `position` 属性都会影响布局模式。

## 弹性布局模式

`CSS3` 引入新的布局模式自然是因为已有的布局模式不能适应页面的发展，`CSS2` 中的四种布局方式在目前的复杂页面上，尤其是大量页面需要响应式的适配各种设备，实现起来比较复杂，这样的需求自然引出了弹性布局的模式。弹性布局表面上看和块布局相似，但是失去了块布局中的一些属性，比如 `float`，`clear` 和 `vertical-align`，相对的，弹性布局获得了分配空间和设置对齐方式的极大灵活性。我们通过设置元素的 `display: flex` 或者 `diplay: inline-flex` 来初始化一个弹性容器（ `flex container` ），弹性容器中的流内（ `in-flow` ）子元素称之为弹性项目（ `flex items` ），在这个弹性容器中：

- 可以沿任何流动方向布置（向左，向右，向下，甚至向上！）
- 可以在样式层中反转或重新排列其显示顺序（即，视觉顺序可以独立于源和语音顺序）
- 可沿单个（主）轴线性布局或沿二级（交叉）轴包裹成多条线
- 可以“弯曲”它们的尺寸以响应可用空间
- 可以在二级（十字架）上相对于其容器或彼此对齐
- 可以沿主轴动态折叠或不折叠，同时保留容器的交叉大小

我们在 `CSS2` 中接触了 `IFC` 和 `BFC` ，`flex` 容器同样生成一个 `flex formatting context`，和 `BFC`相似，不过用弹性布局代替了块布局。在 `FFC` 中，容器的 `margin` 不会和内容的 `margin` 发生塌陷（ `collapse` ）；在 `FFC` 中，`float，clear`，`vertical-align`，`::first-line and` `::first-letter` 都是无效的。容器中的空白符不会显示，相当于添加了 `display: none` 的文本节点一样。

## flex布局

设置了 `display` 为 `flex` 或者 `inline-flex` 的元素就成为了一个弹性容器，理解 `flex` 布局就要理解 `flexible box` 的基本概念，在容器中有两根轴，水平的主轴（ `main axis` ）和垂直的交叉轴（ `cross axis` ）。主轴的开始位置（与边框的交叉点）叫做 `main start`，结束位置叫做 `main end` ；交叉轴的开始位置叫做 `cross start`，结束位置叫做 `cross end`。项目默认沿主轴排列。弹性容器活弹性项目主轴空间叫做 `main size`，占据的交叉轴空间叫做 `cross size`。

> 主轴和交叉轴不是绝对的，并不是水平的轴就是主轴，这取决于你的 `flex-direction` 属性。 当时设置 `flex` 布局之后，子元素的 `float`、`clear`、`vertical-align` 的属性将会失效。

![flex](https://img.clloz.com/blog/writing/flex-direction-terms.svg 'flex')

## 容器（flex container）

容器有6个属性：

- `flex-direction`
- `flex-wrap`
- `flex-flow`
- `justify-content`
- `align-items`
- `align-content`

## flex-direction

`flex-direction` 决定了容器主轴的方向，也就是决定了 `flex items` 在容器里如何排列，`flexbox` 是单向布局概念，可以理解为 `item` 在水平行或垂直列中排列。 `flex-direction` 可以取下面四个值：

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

![flex-direction](./images/flex2.png 'flex-direction')

- row（默认值）：主轴为水平方向，起点在左端。
- row-reverse：主轴为水平方向，起点在右端。
- column：主轴为垂直方向，起点在上沿。
- column-reverse：主轴为垂直方向，起点在下沿。

<!-- <iframe width="100%" height="250px" style="border: none" src="https://cdn.clloz.com/study/flexbox/flex-direction.html"></iframe> -->

> `container` 的 `direction` 属性会影响 `row` 和 `row-reverse` 的表现，当 `direction` 为 `ltr` 的时候表现为上述，当为 `rtl` 的时候则相反。

## flex-wrap

![flex-wrap](./images/flex3.png 'flex-wrap')

默认情况下 `flex items` 排在一条直线上，你可以通过 `flex-wrap` 属性来设置项目的换行方式。

```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

`flex-wrap` 有三个值： （1） `nowrap`（默认）：不换行。

![flex-wrap1](./images/flex4.png 'flex-wrap1')

（2） `wrap`：项目换行，按顺序从上到下排列。

![flex-wrap2](./images/flex5.jpg 'flex-wrap2')

（3） `wrap-reverse`：项目换行，按顺序从下到上排列。

![flex-wrap3](./images/flex6.jpg 'flex-wrap3')

<!-- <iframe width="100%" height="250px" style="border: none" src="https://cdn.clloz.com/study/flexbox/flex-wrap.html"></iframe> -->

## flex-flow

`flex-flow` 属性是 `flex-direction` 属性和 `flex-wrap` 属性的简写形式，默认值为 `row nowrap`。

```css
.container {
  flex-flow: <‘flex-direction’> || <‘flex-wrap’>;
}
```

## justify-content

该属性定义了项目在主轴上的对齐方式。

```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}
```

![justify-content](https://img.clloz.com/blog/writing/justify-content-2.svg 'justify-content')

该属性一共可以取6个值：

- `flex-start`( `default` ): 项目向 `start line` 对齐排列，首项与 `start line` 对齐
- `flex-end` : 项目向 `end line` 对齐排列，首项在与 `end line` 对齐
- `center` : 项目居中对齐
- `space-between` : 项目均匀分布在主轴上，首项与 `start line` 对齐，末项与 `end line` 对齐
- `space-around` : 项目均匀地分布在主轴上，每个项目的环绕空间相等。注意不是绝对的“平均”，由于每个项目两侧的空间相等，所以第一个项目的左边和最后一个项目右边的空间只有其他间隔的一半。
- `space-evenly` : 所有空白空间均匀地分布在项目之间，任意两个项目之间的间隔都相等（包括首尾与边缘的间隔）

<!-- <iframe width="100%" height="250px" style="border: none" src="https://cdn.clloz.com/study/flexbox/justify-content.html"></iframe> -->

> `start line` 和 `end line` 不是固定的，这取决于你的 `container` 的 `flex-direction` 和 `direction` 两个属性。

## align-items

这个属性定义了项目沿交叉轴布局的默认行为，类似于交叉轴上的 `justify-content` 属性。

![align-items](./images/flex8.png 'align-items')

```css
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

该属性可以取五个值：

- `flex-start` : 项目的 `croess-start` 方向的 `margin` 边缘对齐 `cross-start line`
- `flex-end` : 项目的 `croess-end` 方向的 `margin` 边缘对齐 `cross-end line`
- `center` : 项目在交叉轴上居中对齐
- `baseline` : 项目的 `content` 里的第一行文字的基线对齐
- `stretch` ( `default` ): 项目未设置高度或者高度为 `auto` 则 `items` 会占满整个容器的高度

<!-- <iframe width="100%" height="650px" style="border: none" src="https://cdn.clloz.com/study/flexbox/align-items.html"></iframe> -->

> `flex-start` 和 `flex-end` 依然不是绝对的，当我们的主轴为 `column` 的时候，`direction` 和 `flex-direction` 依然会影响 `align-items` 的表现。

## align-content

`align-items` 适用于当我们只有一行或者一列 `items` 的情况，当我们拥有多行或者多列 `items` 的时候就需要 `align-content` 属性，它相当于 `justify-content` 在交叉轴上的扩展，我们可以把每一行（每一列）想象成一个 `item`，他们在交叉轴上的排列就可以类比 `justify-content` 在主轴上的效果。

![align-content](./images/flex9.png 'align-content')

```css
.container {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

该属性可以取六个值：

- `flex-start` : 每一行向交叉轴起点对齐
- `flex-end` : 每一行向交叉轴终点对齐
- `center` : 在交叉轴居中对齐
- `space-between` : 行均匀的分布在交叉轴上，第一行位于交叉轴的起点，最后一行位于交叉轴的终点
- `space-around` : 空白空间均匀分布在行之间，首行和末行与边沿之间的空白是行与行之间空白的一半
- `stretch` ( `default` ): 所有的行占满全部交叉轴，第一行位于交叉轴起点，占满的方式是增加每一行与下一行或者边沿的空白空间，首行与边沿除外。

<!-- <iframe width="100%" height="650px" style="border: none" src="https://cdn.clloz.com/study/flexbox/align-content.html"></iframe> -->

> 依然要注意 `flex-start` 和 `flex-end` 不是绝对的。当 `flex items` 只有一行的时候，该属性无效。

## 项目（ flex item ）

容器内的每一个 `in-flow` 元素都是一个 `flex item`，每个项目都有六个属性：

- `order`
- `flex-grow`
- `flex-shrink`
- `flex-basis`
- `flex`
- `align-self`

## order

`order` 属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。

![order](./images/flex10.png 'order')

```css
.item {
  order: <integer>; /* default is 0 */
}
```

## flex-grow

该属性定义了 `flex item` 放大的能力，它接受一个无比的值作为一个比例。它规定了项目应占用的 `Flex` 容器内可用空间量。 如果所有项目都 `flex-grow` 设置为 `1`，则容器中的剩余空间将平均分配给所有子项。如果其中一个孩子的值为 `2` ，则剩余空间将占用其他空间的两倍（或者至少会尝试）。

![flex-grow](./images/flex11.png 'flex-grow')

```css
.item {
  flex-grow: <number>; /* default 0 */
}
```

> 负数无效。

## flex-shrink

该属性定义了 `flex item` 的缩小能力,默认为 `1` ，即如果空间不足，该项目将缩小。

![shrink](./images/flex12.jpg 'shrink')

```css
.item {
  flex-shrink: <number>; /* default 1 */
}
```

如果所有项目的 `flex-shrink` 属性都为 `1`，当空间不足时，都将等比例缩小。如果一个项目的 `flex-shrink` 属性为 `0`，其他项目都为 `1`，则空间不足时，前者不缩小。

> 负数无效。

## flex-basis

该属性定义了在分配空余空间之前一个项目的默认大小，当我们设置一个具体的值的时候（比如 `20%`，`5em`，`100px` 等），那么元素的默认大小就是这个值，如果没有设置具体的值，那么这个属性默认是 `auto` ，当属性为 `auto` 的时候，会根据元素的主轴长度属性来定义元素的默认大小，如果主轴长度属性也是 `auto` 的话，那么 `flex item` 就会根据 `content` 来设置大小。当主轴长度属性和 `flex-basis` 同时存在的时候，生效的是 `flex-basis`。`min-width` 和 `max-width` 能对 `flex-basis` 产生限制。

**当主轴为水平方向的时候，当设置了 `flex-basis`，项目的宽度设置值会失效，`flex-basis` 需要跟 `flex-grow` 和 `flex-shrink` 配合使用才能发挥效果。**

> 主轴长度属性指的是 `flex item` 在主轴方向上的大小，当横轴是主轴的时候指的是元素的 `width`，当主轴是纵轴的时候指的是元素的 `height`。

需要注意的是，当 `flex-grow` 不为 `0`，设置 `flex-basis` 为 `0` 和 `auto` 会产生不同的效果（当 `item` 中有 `content` 的时候），当 `flex-basis` 为 `0` 的时候，不会考虑环绕元素的空白，而是元素根据 `flex-grow` 全部分完所有空间。而 `flex-basis` 为 `auto` 的时候，会把空白的空间按照 `flex-grow` 的值分配给每个 `item`，此时 `item` 的实际宽度（或者高度）就是 `content` 的宽度 + 分配的空间。效果 `W3C` 文档给出如下图：

![flex-basis](https://img.clloz.com/blog/writing/rel-vs-abs-flex.svg 'flex-basis')

```css
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

> 经过测试，对 `item` 的大小起作用的优先级 `max-width = max-width > content > flex-basis > width`，`flex-basis` 只是一个默认值以便浏览器用以计算空白空间，实际项目的大小还要根据剩余的空间以及 `flex-grow` 或者 `flex-shrink` 来计算，如果空间不够了就会缩小，空间超过则会放大。

## flex

`flex` 属性是 `flex-grow`, `flex-shrink` 和 `flex-basis` 的简写，默认值为 `0 1 auto`。后两个属性可选。关键字 `none` 的计算值为 `0 0 auto`。当 `flex-grow` 被省略时取值为 `1`，`flex-shrink` 被省略时取值 `1`，`flex-basis` 被省略是取值 `0` 。这里的省略值与我们上面提到的三个属性的默认值是不同的，这样的设计是为了让这个简写属性能够更好的匹配我们的常用情景。

```css
.item {
  flex: none | [ < 'flex-grow' > < 'flex-shrink' >? || < 'flex-basis' >];
}
```

`flex` 的取值和规律总结：

- 「`flex: initial`」：元素会根据自身宽高设置尺寸。它会缩短自身以适应 `flex` 容器，但不会伸长并吸收 `flex` 容器中的额外自由空间来适应 `flex` 容器 。相当于将属性设置为`flex: 0 1 auto`。
- 「`flex: auto`」：元素会根据自身的宽度与高度来确定尺寸，但是会伸长并吸收 `flex` 容器中额外的自由空间，也会缩短自身来适应 `flex` 容器。这相当于将属性设置为 `flex: 1 1 auto`.
- 「`flex: none`」：元素会根据自身宽高来设置尺寸。它是完全非弹性的：既不会缩短，也不会伸长来适应 `flex` 容器。相当于将属性设置为 `flex: 0 0 auto`。
- 「`flex: positive-number`」：与「`flex: positive-number 1 0`」相同。该值使元素可伸缩，并将伸缩基准值设置为零，导致该项目会根据设置的比率占用伸缩容器的剩余空间。如果一个伸缩容器里的所有项目都使用此模式，则它们的尺寸会正比于指定的伸缩比率。
- 当 `flex` 取值为一个长度或百分比，则视为 `flex-basis` 值，`flex-grow` 取 `1`，`flex-shrink` 取 `1`，有如下等同情况（注意 `0%` 是一个百分比而不是一个非负数字）
- 当 `flex` 取值为 `0` 时，对应的三个值分别为 `0 1 0%`。
- 当 `flex` 取值为两个非负数字，则分别视为 `flex-grow` 和 `flex-shrink` 的值，`flex-basis` 取 `0%`。
- 当 `flex` 取值为一个非负数字和一个长度或百分比，则分别视为 `flex-grow` 和 `flex-basis` 的值，`flex-shrink` 取 `1`。
- 当 `flex-wrap` 为 `wrap | wrap-reverse`，且子项宽度和不及父容器宽度时，`flex-grow` 会起作用，子项会根据 `flex-grow` 设定的值放大（为 `0` 的项不放大）
- 当 `flex-wrap` 为 `wrap | wrap-reverse`，且子项宽度和超过父容器宽度时，首先一定会换行，换行后，每一行的右端都可能会有剩余空间（最后一行包含的子项可能比前几行少，所以剩余空间可能会更大），这时 `flex-grow` 会起作用，若当前行所有子项的 `flex-grow` 都为 `0`，则剩余空间保留，若当前行存在一个子项的 `flex-grow` 不为 `0`，则剩余空间会被 `flex-grow` 不为0的子项占据
- 当 `flex-wrap` 为 `nowrap`，且子项宽度和不及父容器宽度时，`flex-grow` 会起作用，子项会根据 `flex-grow` 设定的值放大（为`0`的项不放大）
- 当 `flex-wrap` 为 `nowrap`，且子项宽度和超过父容器宽度时，`flex-shrink` 会起作用，子项会根据 `flex-shrink` 设定的值进行缩小（为`0`的项不缩小）。但这里有一个较为特殊情况，就是当这一行所有子项 `flex-shrink` 都为0时，也就是说所有的子项都不能缩小，就会出现讨厌的横向滚动条
- 总结上面四点，可以看出不管在什么情况下，在同一时间，`flex-shrink` 和 `flex-grow` 只有一个能起作用，这其中的道理细想起来也很浅显：空间足够时，`flex-grow` 就有发挥的余地，而空间不足时，`flex-shrink` 就能起作用。当然，`flex-wrap` 的值为 `wrap | wrap-reverse` 时，表明可以换行，既然可以换行，一般情况下空间就总是足够的，`flex-shrink` 当然就不会起作用

<!-- <iframe width="100%" height="250px" style="border: none" src="https://cdn.clloz.com/study/flexbox/item-flex.html"></iframe> -->

打开开发者工具可以查看简写属性对应的完整属性。

## align-self

`align-self` 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖 `align-items` 属性。默认值为 `auto`，表示继承父元素的 `align-items` 属性，如果没有父元素，则等同于 `stretch`。

![align-self](./images/flex13.png 'align-self')

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

## 实战

## flex 骰子

<!-- <iframe width="100%" height="250px" style="border: none" src="https://cdn.clloz.com/study/flexbox/flex-dice.html"></iframe> -->

## 基本网格布局

用 `flex: auto` 我们可以轻松实现基本网格布局。

<!-- <iframe width="100%" height="250px" style="border: none" src="https://cdn.clloz.com/study/flexbox/auto-grid.html"></iframe> -->

## 自定义宽度布局

<!-- <iframe width="100%" height="250px" style="border: none" src="https://cdn.clloz.com/study/flexbox/custom-grid.html"></iframe> -->

## 圣杯布局

<!-- <iframe width="100%" height="800px" style="border: none" src="https://cdn.clloz.com/study/flexbox/holy-grail.html"></iframe> -->

## input 样式

<!-- <iframe width="100%" height="150px" style="border: none" src="https://cdn.clloz.com/study/flexbox/input.html"></iframe> -->

## 聊天室布局

<!-- <iframe width="100%" height="300px" style="border: none" src="https://cdn.clloz.com/study/flexbox/chat.html"></iframe> -->

## 一些问题

更新一些在使用 `flex` 布局中的问题。

## 一侧固定另一侧自适应的布局

在使用 `element ui` 的时候发现有时候 `flex` 的自适应不生效，主要是在侧边栏固定宽度，然后另一边用 `flex: 1` 来进行自适应的情况，无论 `flex-direction` 是 `column` 还是 `row` 都会遇到，最后发现是文字溢出的问题。如果没有对文字溢出进行处理，当文字过长的时候，似乎 `flex` 的自适应就失效了，加上对长文字的处理以后自适应就没有问题了。

同样的问题还出现在 `element ui` 的 `table` 上，同样是侧边宽度固定，另一侧进行自适应，但是如果自适应的内部有 `table` 组件则发现改变页面的大小的时候，自适应不生效，刷新页面则会变成正常大小。最后在 `segmentfault` 上找到一个解答，对自适应的那个容器加上 `overflow:hidden` 可以解决，不过不知道是什么原因导致的。

## flex-shrink 不生效

有时候我们会发现我们设置了 `shrink` 的元素并没有如我们想象的进行缩小，很大的可能是内部有一个确定高度的元素将它撑开了，我们的 `flex-shrink` 只能控制当前的元素，而无法缩小内部元素。

## 总结

`flex` 布局其实在我看来主要解决了我们原来的四种布局方式不灵活的地方，有时我们需要一些固定宽度的元素，但想保持元素间的间隔是自适应的，实现器来可能就比较麻烦，有了flex布局我们能够更灵活的安排空白空间，不仅能控制我们的元素，同时能控制包裹在元素周围的空白空间，flex布局的文档目前已经处在 `Candidate Recommendation` 候选建议书阶段了，应该说大部分功能都已经确定了，想要更好的掌握这种布局还有许多细节需要把握，想看文档的点击[这里](https://www.w3.org/TR/2017/CR-css-flexbox-1-20171019/ '这里')，有一个学习flex布局的游戏[FLEXBOX FROGGY](http://flexboxfroggy.com/#zh-cn 'FLEXBOX FROGGY')可以尝试一下。

参考文章： - [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/ 'A Complete Guide to Flexbox') - [\[翻译\]Flex Basis与Width的区别](https://www.jianshu.com/p/17b1b445ecd4 '[翻译]Flex Basis与Width的区别') - [flex设置成1和auto有什么区别](https://segmentfault.com/q/1010000004080910 'flex设置成1和auto有什么区别') - [30 分钟学会 flex 布局](https://zhuanlan.zhihu.com/p/25303493 '30 分钟学会 flex 布局')
