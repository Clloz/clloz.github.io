---
title: 'Less 学习笔记'
publishDate: '2020-10-25 12:00:00'
description: ''
tags:
  - css
  - 学习笔记
language: '中文'
heroImage: {"src":"./sass-less.png","color":"#B4C6DA"}
---

\[toc\]

## 前言

本文讲解 `CSS` 预处理器 `Less` 的用法。

## 为什么要使用预处理器

早期的 `CSS` 几乎很难算作一门编程语言，没有变量，没有函数，只是一个静态的文本。所以它的功能是很弱的，我们没法复用配置，想要编写可维护的 `CSS` 并不容易。而且由于 `CSS` 的属性之间非正交，经常发现我们改了这个影响了那个，很多时候我们修改某个属性不知道结果会如何。

`CSS` 预处理器就是对 `CSS` 的一种增强，我们可以用编程语言的方式来写 `CSS`，然后在用工具帮我们转化为浏览器能识别的 `CSS`。它们在 `CSS` 原本的语法格式基础上，增加了编程语言的特性，如变量的使用、逻辑语句的支持、函数等。让 `CSS` 代码更容易维护和复用。

当然目前 `CSS` 的标准推进也在不断吸收预处理器的优点，比如 `calc()` 函数，`CSS varibale` 等，相信在不久的将来我们原生的 `CSS` 就能够直接支持预处理器的特性。

## Sass 和 Less

`Less` （`Leaner Style Sheets` 的缩写） 是一门向后兼容的 `CSS` 扩展语言。因为 `Less` 和 `CSS` 非常像，`Less` 仅对 `CSS` 语言增加了少许方便的扩展，学习很容易。

`SASS`，作为”世界上最成熟、最稳定、最强大的专业级 `CSS` 扩展语言”。兼容所有版本的 `CSS`，且有无数框架使用 `SASS` 构建，如 `Compass`，`Bourbon`，和 `Susy`。`SASS 3.0` 版本之前的后缀名为 `.sass`，而版本 `3.0` 之后的后缀名 `.scss`。

`Less` 和 `Sass` 在语法上有些共性，比如下面这些：

- 混入(`Mixins`)： `class` 中的 `class`；
- 参数混入：可以传递参数的 `class`，就像函数一样；
- 嵌套规则：`Class` 中嵌套 `class`，从而减少重复的代码；
- 运算—：CSS\` 中用上数学；
- 颜色功能：可以编辑颜色；
- 名字空间(`namespace`)：分组样式，从而可以被调用；
- 作用域：局部修改样式；
- `JavaScript` 赋值：在 `CSS` 中使用 `JavaScript` 表达式赋值。

他们的不同之处：

| 类别 | Sass | less |
| --- | --- | --- |
| 环境 | `dart` 或其他 | 基于 `javascript`，可以运行在 `Node` 或浏览器端 |
| 使用 | 复杂 | 简单(相对而言) |
| 功能 | 复杂 | 简单(相对而言) |
| 处理机制 | 服务端处理 | 可以运行在 `Node` 或浏览器端 |
| 变量 | 以 `$` 开头 | 以 `@` 开头 |
| 文件后缀 | `.sass` 或 `.scss` | `.less` |

至于要选择哪个肯定是根据团队来决定，都是要学习的。总的来说就是 `less` 更 “简单” 一些，`Sass` 功能更强大一些。本文主要讨论 `Less`。

## 安装配置

## 在浏览器使用

先引入 `.less` 文件，然后引入 `less.min.js`，注意 `less` 文件一定要在 `less.min.js` 之前。看了 `less.js` 的源码后，它在浏览器运行的原理大致是扫描页面上的 `link` 标签，找到 `rel` 为 `stylesheet/less` 或者 `rel` 为 `stylesheet` 并且 `type` 能匹配到 `less` 的 `link` 放到一个数组中。然后请求这个文本(所以必须开 `web` 服务器访问，并且会有跨域问题)，对文本进行解析。当然，这种方式不是很推荐。

## 命令行

直接全局安装 `less`，然后使用 `lessc` 命令转为 `css` 文件即可。

```javascript
npm install -g less
lessc styles.less styles.css
```

## webpack

如果每个文件都手动用命令转码很是麻烦，现在一般开发都会使用 `webpack` 作为打包工具，我科以使用 `webpack` 进行 `less` 的配置，打包过程自动转码。需要安装 `less` 和 `less-loader`。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
      },
    ],
  },
};

```

## Less功能

## 变量

目前 `CSS` 也支持设置变量了，可以参考我的另一篇文章：[css自定义属性](https://www.clloz.com/programming/front-end/css/2020/08/12/css-custom-properties/ "css自定义属性")

因为很多 `css` 属性其实是有复用需求的，比如整个页面的配色，和一些边框样式，这样的场景使用变量将会提高复用率，并且更加方便维护，比如我们改变页面的配色，只需要更改变量就可以了，而不需要在所有使用了颜色属性的地方一个一个去更改。

`less` 中的变量使用是 `@name` 的形式，变量是一个常量，所以不能重复定义。

```less
/* Less */
@color: #999;
@bgColor: skyblue;//不要添加引号
@width: 50%;
#wrap {
  color: @color;
  background: @bgColor;
  width: @width;
}

/* 生成后的 CSS */
#wrap {
  color: #999;
  background: skyblue;
  width: 50%;
}
```

在平时工作中我们可以把变量统一封装到一个文件中：

```less
@lightPrimaryColor: #c5cae9;
@textPrimaryColor: #fff;
@accentColor: rgb(99, 137, 185);
@primaryTextColor: #646464;
@secondaryTextColor: #000;
@dividerColor: #b6b6b6;
@borderColor: #dadada;
```

变量可以运用到选择器上，需要注意，选择器使用变量的时候，变量名要用大括号包裹。

```less
/* Less */
@mySelector: #wrap;
@Wrap: wrap;
@{mySelector}{ //变量名 必须使用大括号包裹
  color: #999;
  width: 50%;
}
.@{Wrap}{
  color:#ccc;
}
#@{Wrap}{
  color:#666;
}

/* 生成的 CSS */
#wrap{
  color: #999;
  width: 50%;
}
.wrap{
  color:#ccc;
}
#wrap{
  color:#666;
}
```

变量也可以运用在属性名上，同样需要大括号：

```less
/* Less */
@borderStyle: border-style;
@Soild:solid;
#wrap{
  @{borderStyle}: @Soild;//变量名 必须使用大括号包裹
}

/* 生成的 CSS */
#wrap{
  border-style:solid;
}
```

变量也可以运用在 `url` 上，使用方法是将 `@{name}` 写到 `url` 中。注意 `css` 的 `url()` 中的参数是一个字符串，可以使用单引号也可以使用双引号，也可以不使用。如果 `url` 中有括号，空格或者引号，则必须使用引号。一般使用场景如下：

```css
background-image: url("https://mdn.mozillademos.org/files/16761/star.gif");
list-style-image: url('../images/bullet.jpg');
content: url("pdficon.jpg");
cursor: url(mycursor.cur);
border-image-source: url(/media/diamonds.png);
src: url('fantasticfont.woff');
offset-path: url(#path);
mask-image: url("masks.svg#mask1");
@font-face {
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
       url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
}
@import: url() //可以不使用 url 函数，直接写字符串
```

使用 `less` 的例子如下：

```less
/* Less */
@images: "../img";//需要加引号
body {
  background: url("@{images}/dog.png");//变量名 必须使用大括号包裹
}

/* 生成的 CSS */
body {
  background: url("../img/dog.png");
}
```

##### 声明属性

上面都是定义一个值，我们还可以定义一条属性，方式是 `@name: {key: value}`，使用方式是 `@name()`。

```less
/* Less */
@background: {background:red;};
#main{
    @background();
}
@Rules:{
    width: 200px;
    height: 200px;
    border: solid 1px red;
};
#con{
  @Rules();
}

/* 生成的 CSS */
#main{
  background:red;
}
#con{
  width: 200px;
  height: 200px;
  border: solid 1px red;
}
```

##### import 语句

```less
// Variables
@themes: "../../src/themes";

// Usage
@import "@{themes}/tidal-wave.less";
```

##### 变量命名变量

可以用变量命名变量

```less
@primary:  green;
@secondary: blue;

.section {
  @color: primary;

  .element {
    color: @@color;
  }
}

//生成
.section .element {
  color: green;
}
```

##### 惰性求值

变量是惰性求值的，所以不需要在使用前声明。

```less
//写法一
.lazy-eval {
  width: @var;
}

@var: @a;
@a: 9%;

//写法二
.lazy-eval {
  width: @var;
  @a: 9%;
}

@var: @a;
@a: 100%;

//编译结果
.lazy-eval {
  width: 9%;
}
```

如果重复声明一个变量，在同一作用域的后一个会生效，本质上变量的行为和 `css` 的自定义属性是一致的。

```less
@var: 0;
.class {
  @var: 1;
  .brass {
    @var: 2;
    three: @var;
    @var: 3;
  }
  one: @var;
}

//编译成
.class {
  one: 1;
}
.class .brass {
  three: 3;
}
```

##### 把属性当做变量

可以用 `$` 符号引用一个属性，把这个属性的值当做变量来用。看例子：

```less
.widget {
  color: #efefef;
  background-color: $color;
}

//Compiles to:
.widget {
  color: #efefef;
  background-color: #efefef;
}
```

和其他变量一样，有多个重复定义的属性时，生效的是最后一个。

```less
.block {
  color: red; 
  .inner {
    background-color: $color; 
  }
  color: blue;  
} 

//Compiles to:
.block {
  color: red; 
  color: blue;  
} 
.block .inner {
  background-color: blue; 
}
```

##### 变量运算

变量之间可以进行四则运算，注意单位的统一。加减法时，以前一个变量的单位为基准，乘除法必须统一单位。注意的是减号左右要留空格，否则有可能被认为是标识符。颜色会转为六位。

```javascript
/* Less */
@width:300px;
@color:#222;
#wrap{
  width:@width - 20;
  height:@width - 20 * 5;
  margin:(@width - 20) * 5;
  color:@color * 2;
  background-color:@color + #111;
}

/* 生成的 CSS */
#wrap{
  width:280px;
  height:200px;
  margin:1400px;
  color:#444444;
  background-color:#333333;
}
```

## 嵌套

在 `less` 中可以利用大括号的属性嵌套来表示后代关系。

```javascript
p {
    a {
        color: #000;
    }
}

//outpu
p a {
    color: #000;
}
```

这样直接使用时没有什么意义的，所以后面引入了 `&` 来扩展功能。

##### 父选择器 &

使用 `&` 表示嵌套规则中的父选择器，一般使用在改变状态的 `class` 上或者伪类选择器上。

```less
a {
  color: blue;
  &:hover {
    color: green;
  }
}

//results in:
a {
  color: blue;
}

a:hover {
  color: green;
}
```

`&` 还可以用来产生相同前缀的选择器

```less
.button {
  &-ok {
    background-image: url("ok.png");
  }
  &-cancel {
    background-image: url("cancel.png");
  }

  &-custom {
    background-image: url("custom.png");
  }
}

//output:
.button-ok {
  background-image: url("ok.png");
}
.button-cancel {
  background-image: url("cancel.png");
}
.button-custom {
  background-image: url("custom.png");
}
```

多个 `&` 可以一起使用：

```less
.link {
  & + & {
    color: red;
  }

  & & {
    color: green;
  }

  && {
    color: blue;
  }

  &, &ish {
    color: cyan;
  }
}

//will output:
.link + .link {
  color: red;
}
.link .link {
  color: green;
}
.link.link {
  color: blue;
}
.link, .linkish {
  color: cyan;
}
```

需要注意的是，`&` 表示的不是最近的一个父元素，而是同一条规则中的全部父元素组成的选择器：

```less
.grand {
  .parent {
    & > & {
      color: red;
    }

    & & {
      color: green;
    }

    && {
      color: blue;
    }

    &, &ish {
      color: cyan;
    }
  }
}

//results in:
.grand .parent > .grand .parent {
  color: red;
}
.grand .parent .grand .parent {
  color: green;
}
.grand .parent.grand .parent {
  color: blue;
}
.grand .parent,
.grand .parentish {
  color: cyan;
}
```

我们还可以定义规则的父元素，方法就是把 `&` 放到后面：

```less
.header {
  .menu {
    border-radius: 5px;
    .no-borderradius & {
      background-image: url('images/button-background.png');
    }
  }
}

//output
.header .menu {
  border-radius: 5px;
}
.no-borderradius .header .menu {
  background-image: url('images/button-background.png');
}
```

`&` 还可以用来展开复合选择器的排列组合：

```less
p, a, ul, li {
  border-top: 2px dotted #366;
  & + & {
    border-top: 0;
  }
}

//output
p,
a,
ul,
li {
  border-top: 2px dotted #366;
}
p + p,
p + a,
p + ul,
p + li,
a + p,
a + a,
a + ul,
a + li,
ul + p,
ul + a,
ul + ul,
ul + li,
li + p,
li + a,
li + ul,
li + li {
  border-top: 0;
}
```

## 继承 extend

继承或者说扩展是 `less` 的一个伪类（形如伪类的一个语法）。它可继承所匹配声明中的全部样式。基础语法是 `selectorA:extend(selectorB)`，`selectorA` 将获得 `selectorB` 的全部样式，可以看一看下面的例子。

```less
nav ul {
  &:extend(.inline);
  background: blue;
}
.inline {
  color: red;
}

//output
nav ul {
  background: blue;
}
.inline,
nav ul {
  color: red;
}
```

下面两种形式等价：

```less
.a:extend(.b) {}

// the above block does the same thing as the below block
.a {
  &:extend(.b);
}
```

继承语法还支持一个关键字 `all`，它表示出了继承 `selectorB` 的所有样式之外，包含 `selectorB` 的复合选择器或者复杂选择器都会被继承，看下面的例子。

```less
.child:extend(.parent all) {
    color: #000;
    // extends all instances of ".d" e.g. ".x.d" or ".d.x"
}

.sib.parent {
    background: lightbule;
}

.ancestor .parent {
    font-size: 20px;
}

.parent > .children {
    border: 2px solid;
}

// output
.child {
  color: #000;
}
.sib.parent,
.sib.child {
  background: lightbule;
}
.ancestor .parent,
.ancestor .child {
  font-size: 20px;
}
.parent > .children,
.child > .children {
  border: 2px solid;
}
```

`extend` 有几条规则：

- 选择器和扩展之间是允许有空格的：`pre:hover :extend(div pre)`.
- 可以有多个扩展: `pre:hover:extend(div pre):extend(.bucket tr)`， 注意这与 `pre:hover:extend(div pre, .bucket tr)`一样。
- 扩展必须在最后 : `pre:hover:extend(div pre).nth-child(odd)` 这种用法就是错误的。
- 如果一个规则集包含多个选择器，所有选择器都可以使用 `extend` 关键字。
- 伪类选择器顺序必须相同。比如 `.selector:extend(link:visited:hover)` 是无法匹配 `link:hover:visited` 的。
- `*.class` 和 `.class` 不能匹配
- 使用 `nth` 表达式的时候，参数必须完全相等，比如 `1n + 3` 和 `n + 3` 不能匹配。
- 属性选择器的属性值是否使用引号，以及使用的是单引号还是双引号，不影响匹配。
- 继承不会在任何使用变量的规则上生效，使用变量的规则会被继承忽略。
- 在 `@media` 中的 `extend` 只会匹配相同媒体查询的规则。比如 `@media print` 和 `@media screen` 不会相互匹配。嵌套的媒体查询也不会匹配。
- 最外层的选择器会匹配到媒体查询内部的规则。
- 继承没有重复检测机制，比如下面的例子会产生两个相同的值。

```less
.alert-info,
.widget {
  /* declarations */
}

.alert:extend(.alert-info, .widget) {}

//output
.alert-info,
.widget,
.alert,
.alert {
  /* declarations */
}
```

##### 继承的使用场景

1. 避免添加多余的 `class`。看下面的例子：

```html
<a class="animal bear">Bear</a>
.animal {
  background-color: black;
  color: white;
}
.bear {
  background-color: brown;
}

//use extend
<a class="bear">Bear</a>
.animal {
  background-color: black;
  color: white;
}
.bear {
  &:extend(.animal);
  background-color: brown;
}
```

2. 合并多条规则到一条，减小 `css` 的大小。

```less
.my-inline-block {
  display: inline-block;
  font-size: 0;
}
.thing1 {
  &:extend(.my-inline-block);
}
.thing2 {
  &:extend(.my-inline-block);
}

//Outputs
.my-inline-block,
.thing1,
.thing2 {
  display: inline-block;
  font-size: 0;
}
```

## 合并 merge

简写属性会被合并，根绝不同的情况使用逗号或者空格。不过为了防止以外的合并，想要合并的属性后面必须显式地加上 `+` 或者 `+_`，前者表示用逗号合并，后者表示用空格合并。

```less
.mixin() {
  box-shadow+: inset 0 0 10px #555;
}
.myclass {
  .mixin();
  box-shadow+: 0 0 20px black;
}

//Outputs
.myclass {
  box-shadow: inset 0 0 10px #555, 0 0 20px black;
}
```

```less
.mixin() {
  transform+_: scale(2);
}
.myclass {
  .mixin();
  transform+_: rotate(15deg);
}

//Outputs
.myclass {
  transform: scale(2) rotate(15deg);
}
```

## 混入 mixin

混入 `mix-in` 就是将已经存在的样式混入到目标规则中。你可以混入类选择器和 `id` 选择器。

```less
.a, #b {
  color: red;
}
.mixin-class {
  .a();
}
.mixin-id {
  #b();
}

//which results in:
.a, #b {
  color: red;
}
.mixin-class {
  color: red;
}
.mixin-id {
  color: red;
}
```

混入的样式后面的括号可以省略，不过在未来的版本将是必须的，所以尽量保留括号。

如果你想创建一个待混入的样式，但是你不希望这个样式出现在编译后的 `css` 中，你可以在样式后面加上括号。

```less
.my-mixin {
  color: black;
}
.my-other-mixin() {
  background: white;
}
.class {
  .my-mixin();
  .my-other-mixin();
}

//outputs
.my-mixin {
  color: black;
}
.class {
  color: black;
  background: white;
}
```

我们不仅可以混入 `css` 属性，也可以混入 `less` 的选择器：

```less
.my-hover-mixin() {
  &:hover {
    border: 1px solid red;
  }
}
button {
  .my-hover-mixin();
}

//Outputs
button:hover {
  border: 1px solid red;
}
```

如果声明的混入函数有嵌套结构，你可以把这个混入当做命名空间来使用，使用复合选择器来进行混入。调用只能在最后一层加括号。

```less
#outer() {
  .inner {
    color: red;
  }
}

.c {
  #outer.inner();
}

//output
.c {
    color: red
}

//另一个例子
#my-library {
  .my-mixin() {
    color: black;
  }
}
// which can be used like this
.class {
  #my-library.my-mixin();
}

//下面这些语法会被移除，请使用最后一种
#outer > .inner(); // deprecated
#outer .inner();   // deprecated
#outer.inner();    // preferred
```

如果在一个混入函数调用后面加上 `!important`，那么所有混入的样式都会加上 `!important`:

```less
.foo (@bg: #f5f5f5; @color: #900) {
  background: @bg;
  color: @color;
}
.unimportant {
  .foo();
}
.important {
  .foo() !important;
}

//Results in:
.unimportant {
  background: #f5f5f5;
  color: #900;
}
.important {
  background: #f5f5f5 !important;
  color: #900 !important;
}
```

混入函数可以使用参数，参数也可以设置默认值，如果没有传入参数则使用默认值。如果没有传入参数并且也没有默认值则报错。参数必须带单位。这里的参数可以是多个空格或逗号隔开的简写属性的值。

```less
.border-radius(@radius) {
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    border-radius: @radius;
}
#header {
    .border-radius(4px);
}
.button {
    .border-radius(6px);
}

//result
#header {
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
.button {
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
}

```

支持多个参数，分隔符可以是分号或者逗号，文档建议使用分号，因为有些简写属性使用的是逗号分隔符。混入函数支持函数重载，即相同的混入函数接收不同的参数，会根据传入的参数选择合适的函数进行编译。

```less
.mixin(@color) {
  color-1: @color;
}
.mixin(@color; @padding: 2) {
  color-2: @color;
  padding-2: @padding;
}
.mixin(@color; @padding; @margin: 2) {
  color-3: @color;
  padding-3: @padding;
  margin: @margin @margin @margin @margin;
}
.some .selector div {
  .mixin(#008000);
}

//compiles into:
.some .selector div {
  color-1: #008000;
  color-2: #008000;
  padding-2: 2;
}
```

在调用混入函数的时候，我们可以同时传入属性名和属性值，这样就能够用和函数声明时不同的顺序传入参数：

```less
.mixin(@color: black; @margin: 10px; @padding: 20px) {
  color: @color;
  margin: @margin;
  padding: @padding;
}
.class1 {
  .mixin(@margin: 20px; @color: #33acfe);
}
.class2 {
  .mixin(#efca44; @padding: 40px);
}

//compiles into:
.class1 {
  color: #33acfe;
  margin: 20px;
  padding: 20px;
}
.class2 {
  color: #efca44;
  margin: 10px;
  padding: 40px;
}
```

混入函数还支持一个 `@arguments` 变量，它表示传入函数的所有参数，包括分号隔开的。

```less
.box-shadow(@x: 0; @y: 0; @blur: 1px; @color: #000) {
  -webkit-box-shadow: @arguments;
     -moz-box-shadow: @arguments;
          box-shadow: @arguments;
}
.big-block {
  .box-shadow(2px; 5px);
}

//Which results in:
.big-block {
  -webkit-box-shadow: 2px 5px 1px #000;
     -moz-box-shadow: 2px 5px 1px #000;
          box-shadow: 2px 5px 1px #000;
}
```

混入函数支持动态参数个数，使用方式是 `...` 扩展运算符和 `@rest` 变量。

```less
.mixin(...) {        // matches 0-N arguments
.mixin() {           // matches exactly 0 arguments
.mixin(@a: 1) {      // matches 0-1 arguments
.mixin(@a: 1; ...) { // matches 0-N arguments
.mixin(@a; ...) {    // matches 1-N arguments
.mixin(@a; @rest...) {
   // @rest is bound to arguments after @a
   // @arguments is bound to all arguments
}
```

混入函数支持模式匹配，将参数设为常量作为模式，变量会匹配所有。

```less
.mixin(dark; @color) {
    color: darken(@color, 10%);
}
.mixin(light; @color) {
    color: lighten(@color, 10%);
}
.mixin(@clloz; @color) {
    display: block;
}

@switch: light;

.class {
    .mixin(@switch; #888);
}

//output
.class {
  color: #a2a2a2;
  display: block;
}
```

## Function 方法

`less` 提供了寻找混入函数中指定属性或值的用法。

```less
.average(@x, @y) {
    @result: ((@x + @y) / 2);
    font-size: 25px;
}

div {
    // call a mixin and look up its "@result" value
    padding: .average(16px, 50px) [ @result];
    font-size: .average(16px, 50px) [font-size];
}


//output
div {
  padding: 33px;
  font-size: 25px;
}
```

如果有多个混入函数匹配，他们都会被计算，只有最后一个匹配值会返回：

```less
// library.less
#library() {
  .mixin() {
    prop: foo;
  }
}

// customize.less
@import "library";
#library() {
  .mixin() {
    prop: bar;
  }
}

.box {
  my-value: #library.mixin[prop];
}

//output
.box {
  my-value: bar;
}
```

如果你没有在方括号中指定要查找的值，那么会返回混入函数的最后一个值：

```less
.average(@x, @y) {
    @result: ((@x + @y) / 2);
    font-size: 12px;
}

div {
    // call a mixin and look up its final value
    padding: .average(16px, 50px) [];
}

//output
div {
  padding: 12px;
}
```

混入方法支持递归：

```less
.loop(@counter) when (@counter > 0) {
  .loop((@counter - 1));    // next iteration
  width: (10px * @counter); // code for each iteration
}

div {
  .loop(5); // launch the loop
}

//Output:
div {
  width: 10px;
  width: 20px;
  width: 30px;
  width: 40px;
  width: 50px;
}

//递归生成 css 网格布局样式
.generate-columns(4);

.generate-columns(@n, @i: 1) when (@i =< @n) {
  .column-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}

//Output:
.column-1 {
  width: 25%;
}
.column-2 {
  width: 50%;
}
.column-3 {
  width: 75%;
}
.column-4 {
  width: 100%;
}
```

* * *

混入函数支持条件判断，关键词是 `when`。

```less
.mixin(@a) when (lightness(@a) >= 50%) {
    background-color: black;
}
.mixin(@a) when (lightness(@a) < 50%) {
    background-color: white;
}
.mixin(@a) {
    color: @a;
}

.class1 {
    .mixin(#ddd);
}
.class2 {
    .mixin(#555);
}

/output
.class1 {
  background-color: black;
  color: #ddd;
}
.class2 {
  background-color: white;
  color: #555;
}
```

在 `less` 的条件判断中比较运算符有 `>, >=, =, =<, <`，除了关键字 `true` 以外的值都被视为 `false`。你也可以对参数进行对比，或者不传入参数。

```less
.truth(@a) when (@a) { ... }
.truth(@a) when (@a = true) { ... }

.class {
  .truth(40); // Will not match any of the above definitions.
}

//参数对比
@media: mobile;

.mixin(@a) when (@media = mobile) { ... }
.mixin(@a) when (@media = desktop) { ... }

.max(@a; @b) when (@a > @b) { width: @a }
.max(@a; @b) when (@a < @b) { width: @b }
```

你还可以对判断语句进行逻辑运算，`and` 表示两个判断语句的**与运算**，逗号表示**或运算**，`not` 表示非运算。

```less
.mixin(@a) when (isnumber(@a)) and (@a > 0) { ... }

.mixin(@a) when (@a > 10), (@a < -10) { ... }

.mixin(@b) when not (@b > 0) { ... }

```

混入参数还提供了判断值类型的函数，一共有如下这些判断函数：

- `iscolor`
- `isnumber`
- `isstring`
- `iskeyword`
- `isurl`
- `ispixel`
- `ispercentage`
- `isem`
- `isunit`

```less
.mixin(@a; @b: 0) when (isnumber(@b)) { ... }
.mixin(@a; @b: black) when (iscolor(@b)) { ... }
```

混入方法还可以用赋值给变量的方式设置别名，也可以传入参数后赋值给变量，这个变量可以当做查找内部属性的 `map`。注意的是，设置别名的时候一定要带括号，即使没有参数。不带括号将报错。

```less
#theme.dark.navbar {
  .colors(light) {
    primary: purple;
  }
  .colors(dark) {
    primary: black;
    secondary: grey;
  }
}

.navbar {
  @colors: #theme.dark.navbar.colors(dark);
  background: @colors[primary];
  border: 1px solid @colors[secondary];
}

//output
.navbar {
  background: black;
  border: 1px solid grey;
}

//设置别名
#library() {
  .rules() {
    background: green;
  }
}
.box {
  @alias: #library.rules();
  @alias();
}

//output
.box {
  background: green;
}
```

我们也可以直接怼 `css` 选择器进行条件判断：

```less
button when (@my-option = true) {
  color: white;
}
```

还有一种特殊的 `if` 用法：

```less
@dr: if(@my-option = true, {
  button {
    color: white;
  }
  a {
    color: blue;
  }
});
@dr();
```

## 变量属性访问器

在 `less3.5` 之后你可以直接在一个变量或分离规则集中用中括号访问其中的属性。如果访问器访问的还是一个规则集，那么可以链式访问。中括号中还可以使用变量的变量 `@@` 形式。

```less
@config: {
  option1: true;
  option2: false;
}

.mixin() when (@config[option1] = true) {
  selected: value;
}

.box {
  .mixin();
}

//output
.box {
  selected: value;
}

//链式访问
@config: {
  @colors: {
    primary: blue;
  }
}

.box {
  color: @config[@colors][primary];
}

//@@
@config: {
  @dark: {
    primary: darkblue;
  }
  @light: {
    primary: lightblue;
  }
}

.box {
  @lookup: dark;
  color: @config[@@lookup][primary];
}
```

## import 导入

在 `css` 中，我们必须在头部进行 `import` ，在 `less` 中，我们可以在任意位置 `import`。如果 `import` 的是一个 `less` 文件，后缀可以省略。

`less` 提供了多种引入方式，语法是 `@import (keyword) "filename";`，`keyword` 有如下可选项：

- reference: 引入一个 `less` 文件，但是不会编译它，只是使用。
- inline: 引入文件，但是不会编译，只会输出。一般用在 `less` 不支持的 `css` 特性，你可以单独写一个 `css` 然后引入，`less` 不会对它做任何事，只是会在最后输出它。
- less: 把文件当做一个 `less`，无论它的扩展名是什么。
- css: 把文件当做一个 `css` 无论它的扩展名是什么。
- once: `@import` 语句的默认行为。这表明相同的文件只会被导入一次，而随后的导入文件的重复代码都不会解析。
- multiple: 允许导入同名文件多次。
- optional: 如果文件没有找到就继续编译。如果没有这个选项，当找不到文件的时候会终止编译并且抛错。

## 参考文章

1. [学习Less-看这篇就够了](https://juejin.im/post/6844903520441729037 "学习Less-看这篇就够了")
2. [Sass.vs.Less | 简介与比较](https://juejin.im/post/6844904169313140749 "Sass.vs.Less | 简介与比较")
3. [2019年，你是否可以抛弃 CSS 预处理器](https://aotu.io/notes/2019/10/29/css-preprocessor/index.html "2019年，你是否可以抛弃 CSS 预处理器")
4. [Less官方文档](http://lesscss.org/features/ "Less官方文档")