---
title: 'JS事件详解'
publishDate: '2020-10-14 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

`JS` 和 `HTML` 之间的交互是通过事件来实现的，在我们的页面加载完毕，所有的 `html，css，js` 文件都已经 `load` 的情况下，我们如何在文档或浏览器窗口发生变化时通过 `js` 来进行交互，这就是事件产生的原因。我们在 `js` 中预定一个事件的处理程序，然后浏览器的监听程序监听各种事件的发生，当事件发生的时候调用预定的事件处理程序来执行。这种观察员模式的模型让我们实现了 `js` 和 `html，css` 之间的松散耦合。

## 事件流

由于 `DOM` 结构是层层嵌套的，所以监听程序会遇到一个问题，就是当我们点击一个位置的时候，这个位置有多个 `DOM` 节点嵌套在一起，那么我们到底点击的谁呢？`Javascript高级程序设计` 给出了一个更形象的比喻，在纸上画一组同心圆，然后把手指指向圆心，此时你指向的不仅仅是一个圆，而是一串同心圆。同理当你点击一个 `DOM` 元素，你不仅点击了这个元素，也点击了所有父元素，包括页面本身。由于这个问题，才产生了事件流，也就是一个事件发生了，这个事件会在嵌套的 `DOM` 结构里面传播，而事件流就描述了这个传播的具体规则，嵌套的 `DOM` 元素是按照什么顺序接收事件的。

> 即使你没深入学习过事件，也应该听过事件捕获和事件冒泡，它们也只不过是浏览器大战中IE和网景对事件流的不同理解而产生的不同实现，IE选择了事件冒泡流，而网景选择了事件捕获流。

## 事件冒泡流

先来说一说IE的事件冒泡流，事件冒泡流的设计思路是事件最开始是由事件的目标事件（当前点击的位置所嵌套的DOM结构的嵌套最深的那个节点）接收，然后沿着 `DOM` 树逐级向上传播一直到根节点也就是 `document` 节点。一下面的 `HTML` 文档为例：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Test</title>
  </head>
  <body>
    <div class="btn">Click me!</div>
  </body>
</html>
```

如果我们点击了 `Click` 这个按钮以后按事件冒泡流的规则，事件会按照如下顺序传播 1. `<div>` 2. `<body>` 3. `<html>` 4. `document`

也就是 `click` 事件首先发生在 `div` 上，也就是我们单击的元素，然后 `click` 事件沿着 `DOM` 树向上传播，在每一级的 `DOM` 节点上都会发生，直到传播到 `DOM` 树的根节点 `document`。

![event-bubbling](./images/event-bubbling.png 'event-bubbling')

所有现代浏览器都支持事件冒泡，但在具体实现上还是有一些差别。`IE5.5` 及更早版本中的事件冒 泡会跳过`<html>`元素(从 `<body>` 直接跳到 `document`)。`IE9` 、 `Firefox` 、 `Chrome` 和 `Safari` 则将事件一直 冒泡到 `window` 对象。

> 目标事件，也就是我们后面提到的 `DOM2` 里面 `event` 对象的 `target` 属性，我看网上的很多解释都不清晰，其实直白的说就是事件触发的坐标所在位置 `DOM` 结构嵌套最深的那个节点，也即是在 `DOM` 树上最深的节点，这个节点也就是所谓的 `target` 。

## 事件捕获

网景对于事件流的实现和 `IE` 则是截然相反的，也就是目标节点最后接收事件， `DOM` 树上的上层节点则更早地接收事件。还以上面的 `HTML` 代码作为例子，在事件捕获流中，事件的传播顺序如下：

1. `document`
2. `<html>`
3. `<body>`
4. `<div>`

在事件捕获流中，`document` 对象首先接收到事件，然后沿着 `DOM` 树逐级向下传播，一直传播到目标节点 `div` 元素，如下图：

![event-capturing](./images/event-capturing.png 'event-capturing')

## DOM事件流

事件捕获只能在事件传播到目标元素之前截获，而事件冒泡只能在事件已经传播到目标元素之后进行截获，所以 `DOM二级事件` 把两者结合了起来，`DOM二级事件` 规定了事件传播的三个阶段：

1. 事件捕获阶段
2. 处于目标事件阶段
3. 事件冒泡阶段

还用上面的 `HTML` 例子来解释，在 `DOM` 事件流中，实际的目标( `<div>` 元素)在捕获阶段不会接收到事件。这意味着在捕获阶段，事件从 `document` 到 `<html>` 再到 `<body>` 后就停止了。下一个阶段是“处于目标”阶段，于是事件在 `<div>` 上发生，并在事件处理(后面将会讨论这个概念)中被看成冒泡阶段的一部分。然后，冒泡阶段发生， 事件又传播回文档。传播的顺序如下图：

![dom-event](./images/dom-event.png 'dom-event')

在[DOM Level 3 Events draft](https://www.w3.org/TR/DOM-Level-3-Events/#ui-events-intro 'DOM Level 3 Events draft ')中有一个更清晰的图表示三个阶段：

![dom3](./images/dom3.png 'dom3')

这里总结一下事件流的顺序 `window -> document -> documentElement -> document.body -> ... -> target -> ... -> document.body -> documentElement -> document -> window`。一个元素上绑定的多个事件的执行顺序首先是看事件处理程序是定义在哪个阶段，定义在同一个阶段的多个事件处理程序的执行顺序由代码中的顺序决定，先绑定的就先执行。比如给目标元素同时绑定捕获阶段和冒泡阶段两个事件，如果冒泡阶段的事件处理程序先绑定，那么先执行的就是冒泡阶段的事件监听程序先执行。

关于事件流写了两个简单的 `Demo`，点击查看 [Demo1](https://cdn.clloz.com/study/event/index.html 'Demo1') 和 [Demo2](https://cdn.clloz.com/study/event/event-flow.html 'Demo2')，打开控制台查看事件流的触发机制。

## 事件处理程序

也可以叫做事件侦听器，事件就是用户或浏览器自身执行的某种动作。诸如 `click、load 和 mouseover`，都是事件的名字。 而响应某个事件的函数就叫做事件处理程序(或事件侦听器)。事件处理程序的名字以 `on` 开头，因此 `click` 事件的事件处理程序就是 `onclick`，`load`事件的事件处理程序就是 `onload`。为事件指定处理程序的方式有好几种。

事件处理程序主要有以下几种：`HTML` 事件处理程序就是我们常见的用 `HTML` 元素 `attribute` 写在行内的事件，这种做法非常不推荐，效率低下难以维护。然后是 `DOM` 事件处理程序，`DOM` 处理程序有所谓的 `DOM0`，`DOM2` 和 `DOM3` 等，这里的数字指的就是 `DOM` 标准的版本，目前的主流浏览器基本都实现了 `DOM3` 标准，正在推行的的是 `DOM4`。至于为什么没有 `DOM1` 事件处理程序，因为 `DOM1` 中没有和事件相关的更新，所以在讨论事件处理程序的时候就没有 `DOM1`。

还有一点就是 `HTML` 的 `attribute` 和 `DOM` 的 `property` 的区别，我们发现 `DOM0` 级事件使用的也是 `onclick` 这样的属性，而 `HTML` 事件处理程序的属性名也是这个，但是不要混淆他们。可以简单的理解为多数情况 `attribute` 值仅用作初始 `DOM` 节点对象使用，而 `property` 更多用于页面交互，很多框架都是在与元素和指令的 `property` 和事件打交道。比如 `input` 标签有 `value` 属性，`input` 对应的 `DOM` 对象也有 `value` 属性，当在用户未输入数据，或设置 `property` 的值时，取的值是 `attribute` 的值。当用户输入值或者设置了 `property` 的值后，`property` 的值就不受 `attribute` 影响了。

当然也不是所有的 `HTML attribute` 都和 `DOM property` 同名，比如 `HTML` 的 `class` 属性和 `DOM` 的 `className`。

## HTML事件处理程序

当一个HTML元素支持某种事件，我们可以通过该元素的属性来指定事件处理程序，比如`click`事件就可以用 `onclick` 属性来指定事件处理程序，属性值应该是可执行的 `javascript` 代码，比如点击按钮弹出警告框：

```html
<input type="button" value="Click Me" onclick="alert('Clicked')" />
```

在`html`中定义的事件处理程序也可以调用别的地方定义的脚本，比如调用你在别的地方定义的函数，如下：

```html
<script type="text/javascript">
  function showMessage() {
    alert('Hello world!')
  }
</script>
<input type="button" value="Click Me" onclick="showMessage()" />
```

调用的函数可以是在当前 `html` 文件中的 `script` 标签中，也可以是在页面引用的其他 `js` 文件中，事件处理程序中的代码在执行时，有权访问全局作用域中的任何代码。

`HTML` 事件处理程序的特点：

1. 创建了一个封装着元素属性值的函数，通过函数中的局部变量 `event` 直接访问事件对象（后面会介绍），不需要定义这个参数，也不需要从参数列表中读取，可以直接使用。

   ```html
   <script type="text/javascript">
     function showMessage() {
       console.log(event.type)
       console.log(this.value)
     }
   </script>
   <input type="button" value="Click Me" onclick="showMessage()" /> /* 输出 click*/
   ```

2. `this` 的指向：如果是直接在`onclick`属性中执行的`javascript`代码，那么 `this` 指向当前的元素；如果是引用自其他标签或文件中的函数，那么 `this` 指向 `window` 对象。

````html
<script type="text/javascript">
  function showMessage() {
    console.log(event.type)
    console.log(this)
  }
</script>
<!-- 指向当前元素 -->
<input type="button" value="Click Me" onclick="console.log(this)" />
<!-- 指向window对象 -->
<input type="button" value="Click Me" onclick="showMessage()" />
```html 这里说一下内联的 `onclick` 引用其他地方的函数的理解方式，对于 `
<div onclick="fun()"></div>
` 我们应该这么理解 ```javascript div.onclick = function (this, event) { fun(this, event); } function
fun() { //code.... }
````

内联的 `onclick` 触发的时候相当于执行的上面这段代码，我们写在 `onclick` 属性中的代码其实是在一个匿名函数中执行的 `js` 代码，这也是为什么写成 `onclick="fun()"` 而不是写成 `onclick=fun` 的形式，这里不要理解成对 `fun` 函数的引用，而是在 `onclick` 触发的时候，执行双引号中的代码，此时我们的 `fun` 函数只是在匿名函数中执行的一个在全局中定义的函数，如果匿名函数没有把 `this` 传递给 `fun` 函数，那么 `fun` 的 `this` 应该是指向 `window` 对象的。看下面这段代码：

```html
<div onclick="obj.fun()">test</div>
<script>
  var obj = {
    a: 'test',
    fun: function () {
      console.log(this) //{a: "test", fun: ƒ}
      console.log(this === obj) //true
    }
  }
</script>
```

这样是不是比较容易理解呢。

> 需要注意的是 `body` 中的 `onload="console.log(this);"` 会指向 `window` 对象，但是 `img` 中的 `onload="console.log(this);` 则还是指向当前元素的。

3. 在函数内部可以像访问局部变量一样访问 `document` 以及该元素本身的成员，需要注意的是引用的函数同样不可以（函数的作用域链取决于函数定义的位置，而不是执行的位置），函数的内部实现类似如下：

```javascript
function(){
    with(document){
        with(this){ //元素属性值
        }
    }
}
```

如果当前元素是一个表单输入元素，则作用域中还会包含访问表单元素(父元素)的入口，这样扩展作用域的方式，无非就是想让事件处理程序无需引用表单元素就能访问其他表单字段。

```html
<form method="post">
  <input type="text" name="username" value="" />
  <!-- 可以直接访问username的value -->
  <input type="button" value="Echo Username" onclick="alert(username.value)" />
</form>
```

4. 如果属性值采取的引用函数的方式，当元素已经渲染好，而 `js` 还没有加载完成，可能会造成触发事件而事件处理程序并没有执行，这样会报错，防止报错可以使用 `try-catch`：

```html
<input type="button" value="Click Me" onclick="try{showMessage();}catch(ex){}" />
```

5. 用 `HTML` 指定的事件处理程序造成 `html` 和 `javascript` 耦合，我们也无法同时给多个元素绑定事件，也无法给同一个事件绑定多个函数等等，由于这种方式的缺点非常明显，所以几乎已经消失了。

**再次强调，不要使用 `HTML` 内联事件处理程序，它是非常低效和难以维护的！**

> 由于属性值是 `javascript` 代码，因此不能在语句中使用未经转义的 `HTML` 语法字符，比如和号`&`，双引号`"`，大于号`>`，小于号`<`等，并且在 `HTML` 中转义不能使用反斜杠`\`，而要使用 `html` 实体（`entity`），比如双引号是`"`，如果你要查询某个字符的实体，在[w3.org](https://dev.w3.org/html5/html-author/charref 'w3.org')查询。

## DOM0级事件处理程序

页面上的每一个元素都有一个事件处理程序属性（包括 `window` 和`document` 对象），这些属性都是小写，比如代表 `click` 事件的`onclick`，将需要监听事件的元素的该属性的值设置为一个函数，就可以指定事件处理程序，当事件在元素上触发的时候会调用事件处理程序。

```javascript
var btn = document.getElementById('myBtn')
btn.onclick = function () {
  alert('Clicked')
}
```

> `DOM0` 级事件处理程序中的`this`指向绑定事件的元素，在事件处理程序中可以访问元素的所有属性和方法。这种方法绑定的事件处理程序会在事件流的冒泡阶段被执行。

想要删除绑定的 `DOM0` 级事件处理程序，只要将元素的`onclick`属性设置为`null`即可，在 `HTML` 标签中绑定的事件处理函数也可以用这个方法来删除绑定的事件处理程序，需要注意的是删除绑定的代码要在需要删除的标签之后。

## DOM2级事件处理程序

`DOM2` 级事件处理程序是我们目前最多使用的绑定事件处理程序的方法，包含了两个主要的方法用来绑定和删除事件处理函数`addEventListener()`和`removeEventListener()`。所有 `DOM` 节点都包含这两个方法。这两个方法都接受三个参数，第一个参数是要处理的事件类型（和 `DOM0` 级事件中的对象属性不同，这里的事件类型不需要加`on`），第二个参数是事件处理程序对应的函数，第三个参数是一个布尔值，如果是`true`表示在捕获阶段调用事件处理程序，如果是`false`表示在冒泡阶段调用事件处理程序，默认为`false`。具体细节可以看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener 'MDN')。第三个参数还可以是一个对象，有如下三个属性：

- `useCapture`: `Boolean`，`true` 表示 `listener` 会在该类型的事件捕获阶段传播到该 `EventTarget` 时触发。
- `once`: `Boolean`，表示 `listener` 在添加之后最多只调用一次。如果是 `true`， `listener` 会在其被调用之后自动移除。
- `passive`: `Boolean`，设置为 `true` 时，表示 `listener` 永远不会调用 `preventDefault()`。如果 `listener` 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。

如果我们要在一个元素上添加click事件的事件处理程序，就可以使用如下代码：

```javascript
var btn = document.querySelector('.btn')
btn.addEventListener(
  'click',
  function () {
    console.log(this)
  },
  false
)
```

其中的`click`就是要处理的事件类型，匿名函数就是我们指定的事件处理函数，最后的`false`就是指定事件触发是在冒泡阶段。当事件监听程序监听到符合要求的事件发生时，就会调用事件处理程序来执行。

`DOM2` 级事件处理程序的特点：

1. 可以为同一个元素的同一类型的事件绑定多个事件处理程序，他们会按照添加顺序执行。如：

```javascript
var btn = document.getElementById('myBtn')
btn.addEventListener(
  'click',
  function () {
    console.log(this.id)
  },
  false
)
btn.addEventListener(
  'click',
  function () {
    console.log('Hello world!')
  },
  false
)
```

这段代码为 `btn` 的 `click` 类型的事件指定了两个事件处理程序，当我们触发 `btn` 的 `click` 事件的时候，这两个事件处理程序会按顺序执行，也就是先输出`this.id`然后输出`Hello world!`。

2. 由于可以指定事件触发的阶段以及 `event` 对象的存在我们可以用 `DOM2` 级事件进行事件委托，达到对性能的提升和同类型元素绑定事件的简化，后面会详细讨论。

3. 因为可以为同一元素和同一类型的事件绑定多个事件处理程序，所以要删除这些事件只能通过 `removeEventListener()` 来删除，并且移除时传入的参数必须与绑定时传入的参数相同，如果在绑定的时候如果用的是匿名函数，那么这个事件处理程序将无法删除，因为两个不同的匿名函数指向的是不同的空间，如：

```javascript
var btn = document.getElementById('myBtn')
btn.addEventListener(
  'click',
  function () {
    alert(this.id)
  },
  false
)
btn.removeEventListener(
  'click',
  function () {
    //无效
    alert(this.id)
  },
  false
)
```

如果要实现事件处理函数的删除需要将第二个参数换成函数的引用：

```javascript
var btn = document.getElementById('myBtn')
var handler = function () {
  alert(this.id)
}
btn.addEventListener('click', handler, false)
//这里省略了其他代码
btn.removeEventListener('click', handler, false) //有效!
```

> `IE9` 、`Firefox` 、`Safari` 、`Chrome` 和 `Opera` 支持 `DOM2` 级事件处理程序。如果不是特别的事件如`mouseenter`不支持事件冒泡，一般就默认在冒泡阶段触发即可，事件捕获可以当我们需要在事件传播到目标之前截获的时候使用。

## IE事件处理程序

在 `IE9` 之前的版本使用的是 `IE` 独特的事件处理程序，它只支持冒泡，有两个方法 `attachEvent()` 和 `detachEvent()` 两个方法，接收两个参数：事件类型（和 `DOM0` 一样需要加上 `on`）和事件处理程序函数，由于现在很少需要兼容 `IE9` 之前的版本，就不过多讨论了，放上一个跨浏览器的事件处理程序：

```javascript
/* 若支持DOM2级事件处理程序则用DOM2级，若支持IE的事件处理程序则用IE，否则用DOM0级事件处理程序 */
var EventUtil = {
  addHandler: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  },
  removeHandler: function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false)
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler)
    } else {
      element['on' + type] = null
    }
  }
}
```

## 事件对象

在上面的事件处理程序中多次提到了 `event` 对象，我们在上面的代码中输出过 `event` 对象的 `type` 属性，这个属性表示当前指定的事件处理成熟的事件类型。事实上，每当某个 `DOM` 元素触发了某个事件，都会产生一个 `event` 事件对象，这个对象中包含着所有与事件有关的信息。包括触发事件的元素、事件的类型以及其他与特定事件相关的信息。例如，鼠标操作导致的事件 对象中，会包含鼠标位置的信息，而键盘操作导致的事件对象中，会包含与按下的键有关的信息。所有 浏览器都支持 `event` 对象，但支持方式不同。

在 `DOM0` 级和 `DOM2` 级事件处理程序中，浏览器会将一个 `event` 对象传入我们定义的事件处理程序的函数中，即使我们没有在函数的参数列表中加入 `event` 形参，我们也可以在函数内部使用，应该是浏览器替我加上了参数 `event` ：

```html
<button id="myBtn">btn</button>
<script type="text/javascript">
  var btn = document.getElementById('myBtn')
  btn.onclick = function () {
    console.log(event.type) //可以输出
  }
</script>
```

一般为了代码便于理解，我们在事件处理程序的回调函数中给出参数 `event`。

即使我们通过HTML内联的方式执行事件处理程序，在其中我们也可以使用一个指向 `event` 对象的变量 `event` ：

```html
<input type="button" value="Click Me" onclick="alert(event.type)" />
```

`event` 对象包含与创建它的特定事件有关的属性和方法。触发的事件类型不一样，可用的属性和方法也不一样。不过，所有事件都会有下表列出的成员。

| 属性/方法           | 类型       | 读/写 | 说明                                                                                                                                                                                                            |
| ------------------- | ---------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Event()`           | 构造函数   |       | `Event()` 构造函数, 创建一个新的事件对象 `Event`。语法 `event = new Event(typeArg, eventInit);`，`typeArg` 是必选参数，为一个字符串，表示创建的事件名称。第二个参数是一个对象，用来定义事件是否冒泡和可以取消。 |
| `bubbles`           | `Boolean`  | 只读  | 事件是否冒泡                                                                                                                                                                                                    |
| `cancelBubble`      | `Boolean`  | 可写  | `Event.stopPropagation()` 的历史别名。在事件处理器函数返回之前，将此属性的值设置为 `true`，亦可阻止事件继续冒泡。                                                                                               |
| `cancelable`        | `Boolean`  | 只读  | 是否可以取消事件的默认行为，如果为 `false` 则事件发生时无法在事件监听回调中用 `preventDefault()` 停止事件                                                                                                       |
| `composed`          | `Boolean`  | 只读  | 一个布尔值，表示事件是否可以穿过 `Shadow DOM` 和常规 `DOM` 之间的隔阂进行冒泡。                                                                                                                                 |
| `currentTarget`     | `Element`  | 只读  | 事件处理程序当前处理元素                                                                                                                                                                                        |
| `defaultPrevented`  | `Boolean`  | 只读  | 为 true表示已经调用了 `preventDefault()` ( `DOM3` 级事件中新增)                                                                                                                                                 |
| `detail`            | `Integer`  | 只读  | 与事件相关细节信息                                                                                                                                                                                              |
| `eventPhase`        | `Integer`  | 只读  | 事件处理程序阶段：`1` 捕获阶段，`2` 处于目标阶段，`3` 冒泡阶段                                                                                                                                                  |
| `preventDefault()`  | `Function` |       | 取消事件默认行为                                                                                                                                                                                                |
| `stopPropagation()` | `Function` |       | 取消事件进一步捕获或冒泡                                                                                                                                                                                        |
| `target`            | `Element`  | 只读  | 事件的目标元素                                                                                                                                                                                                  |
| `timeStamp`         |            | 只读  | 事件创建时的时间戳（精度为毫秒）。按照规范，这个时间戳是 `Unix` 纪元起经过的毫秒数，但实际上，在不同的浏览器中，对此时间戳的定义也有所不同。另外，规范正在将其修改为 `DOMHighResTimeStamp`                      |
| `isTrusted`         | `Boolean`  | 只读  | 为 `true` 表示事件是浏览器生成的。为 `false` 表 示事件是由开发人员通过 `JavaScript` 创建的(`DOM3` 级事件中新增)                                                                                                 |
| `type`              | `String`   | 只读  | 被触发的事件类型                                                                                                                                                                                                |
| `composedPath`      | `Function` |       | 返回事件的路径（将在该对象上调用监听器）。如果阴影根节点 (`shadow root`) 创建时 `ShadowRoot.mode` 值为 `closed`，那么路径不会包括该根节点下阴影树 (`shadow tree`) 的节点。                                      |

关于 `currentTarget` 和 `target` 只要记住一点，不管事件传播处于什么阶段，`target` 都是不变的，指向目标元素，所以我们在实现事件委托的时候会用到 `target`。而 `currentTarget` 则是随着事件传播处于不同的阶段而指向不同的元素。具体细节点击[实现页面](https://www.clloz.com/study/event-target.html)，打开控制台点击不同的元素查看细节。

> 在事件处理程序内部，对象 `this` 始终等于 `currentTarget` 的值，而 `target` 则只包含事件的实际目标。如果直接将事件处理程序指定给了目标元素，则 `this`、`currentTarget` 和 `target` 包含相同 的值。来看下面的例子。

我们可以利用 `event` 对象的 `type` 属性来用一个函数处理多种事件：

```javascript
var handler = function (event) {
  switch (event.type) {
    case 'click':
      alert('Clicked')
      break
    case 'mouseover':
      event.target.style.backgroundColor = 'red'
      break
    case 'mouseout':
      event.target.style.backgroundColor = ''
      break
  }
}
```

有时我们会需要阻止某些事件的默认行为，比如点击表单的 `submit` 跳转，以及点击 `a标签` 的跳转，如果我们不希望这些行为发生，那么我们可以利用 `event对象` 的 `preventDefault()` 方法，只有 `cancelable` 属性设置为 `true` 的事件，才可以使用 `preventDefault()` 来取消其默认行为。

`event对象` 还有一个重要的方法是 `stopPropagation()`，这个方法用来停止事件在 `DOM` 树上的传播，不管在哪个传播阶段，都会停止事件的传播。比如我们在按钮和 `body` 上都注册了一个事件，当用户点击按钮，我们不希望注册在 `body` 上的事件被触发，此时我们就需要用到这个方法：

```javascript
var btn = document.getElementById('myBtn')
btn.onclick = function (event) {
  alert('Clicked')
  event.stopPropagation()
}
document.body.onclick = function (event) {
  alert('Body clicked')
}
```

事件对象的 `eventPhase` 属性，可以用来确定事件当前正位于事件流的哪个阶段。如果是在捕获阶 段调用的事件处理程序，那么 `eventPhase` 等于 `1`;如果事件处理程序处于目标对象上，则 `event- Phase` 等于 `2`;如果是在冒泡阶段调用的事件处理程序，`eventPhase` 等于 `3`。这里要注意的是，尽管“处于目标”发生在冒泡阶段，但 `eventPhase` 仍然一直等于 2。来看下面的例子。

```javascript
var btn = document.getElementById('myBtn')
btn.onclick = function (event) {
  alert(event.eventPhase) //2
}
document.body.addEventListener(
  'click',
  function (event) {
    alert(event.eventPhase) //1
  },
  true
)
document.body.onclick = function (event) {
  alert(event.eventPhase) //3
}
```

还有一个要注意的点是，很多同学学习事件传播顺序的知识会容易混淆到单个元素的事件处理程序的执行顺序上，对于单个元素，无论你是绑定在捕获阶段还是冒泡阶段，都是先绑定的事件处理程序先执行，事件传播只在嵌套中的不同 `DOM` 元素之间有效，比如如下代码，就是先执行冒泡在执行捕获。

```html
<div id="el">element</div>
<script type="text/javascript">
  var el = document.getElementById('el')
  //冒泡
  el.addEventListener(
    'click',
    function () {
      console.log('el冒泡')
    },
    false
  )
  //捕获
  el.addEventListener(
    'click',
    function () {
      console.log('el捕获')
    },
    true
  )
</script>
```

> `event对象` 在事件触发的时候生成，当事件处理程序执行结束后，`event对象` 即被销毁，也就是说只有在事件处理程序执行期间，`event对象` 才会存在。

## 事件类型

浏览器中发生的事件类型很多，详情查询[事件参考 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/Events 'MDN')，[GlobalEventHandlers - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers 'GlobalEventHandlers - MDN')，每种事件对应的元素，行为都不尽相同。

## 内存和性能

在 `JS` 中，添加到页面上的事件处理程序的数量会影响的页面的整体性能，因为每一个事件处理函数也都是对象，都保存在内存中，事件处理程序多了自然对内存的开销会增大。其次，在 `JS` 的渲染过程中，指定事件处理程序需要访问 `DOM` ，没绑定一个事件处理程序都需要访问一次DOM，如果事件处理程序过多，会影响页面渲染完成的时间。如果我们能够更好地处理事件，对提升页面的性能是有一定的帮助的。

## 事件委托

事件委托其实很好理解，利用事件流传播的特性，利用事件冒泡，我们可以对多个需要绑定事件的同类型元素的上级 `DOM` 节点绑定一个事件处理程序，用这个上层节点的事件处理程序来同一管理那些同一类型的事件。举个例子：

```html
<ul id="myLinks">
  <li id="goSomewhere">Go somewhere</li>
  <li id="doSomething">Do something</li>
  <li id="sayHi">Say hi</li>
</ul>
```

如果我们要实现点击每个 `li` 都输出其中的文本，那么按照传统的做法，我们会为每个 `li` 绑定一个事件，如果同样类型的元素特别多，那么我们一个一个绑定事件显然是不现实的，而且这样页面的性能也不佳。如果我们事件委托，我们就可以把事件处理程序绑定到 `ul` 上，利用事件冒泡的特性来统一管理点击 `li` 的事件。

```javascript
var list = document.querySelector('myLinks')
ul.addEventListener('click', function (e) {
  if (e.target.tagName.toLowerCase() === 'li') {
    console.log(e.target.innerText)
  }
})
```

当我们点击 `li` 的时候，由于事件冒泡传播，所以当事件传播到 `ul` 的时候，会被我们绑定在 `ul` 上的事件处理程序捕获，然后在函数内部我们利用 `event.target` 会指向目标元素的特点来判断用户点击的是否是 `li`，然后在执行对应的逻辑需求。

上面只是最简单的事件委托情况，有时候我们的 `DOM` 结构嵌套更多，我们不仅要处理绑定元素内的元素的委托，还有可能要在触发内部元素的事件之后修改外部的 `DOM` 节点，这时候我们就需要将 `currentTarget` 和 `target` 结合起来用，比如下面这种场景: 当我们点击上面的按钮的时候，下面的 `panel` 要进行切换，一共有四个 `panel` 点击第几个按钮，显示第一个 `panel`， 用 `display: none` 来设置。并且这样的模块有两个。

![tab-select](./images/tab-select.png 'tab-select')

DOM结构如下 ：

```html
<div class="mod_tab">
  <div class="header">
    <div class="tab active">1</div>
    <div class="tab">2</div>
    <div class="tab">3</div>
    <div class="tab">4</div>
  </div>
  <div class="content">
    <div class="panel active">panel1</div>
    <div class="panel">panel2</div>
    <div class="panel">panel3</div>
    <div class="panel">panel4</div>
  </div>
</div>
<div class="mod_tab">
  <div class="header">
    <div class="tab active">1</div>
    <div class="tab">2</div>
    <div class="tab">3</div>
    <div class="tab">4</div>
  </div>
  <div class="content">
    <div class="panel active">panel1</div>
    <div class="panel">panel2</div>
    <div class="panel">panel3</div>
    <div class="panel">panel4</div>
  </div>
</div>
```

我们可以把事件绑定到 `header` 上，当点击按钮的时候用 `event.target` 来操作按钮的样式，同时利用 `event.currentTarget` 找到 `header` 然后找到 `header` 的兄弟元素 `content` 来操作 `panel` 的显示。具体代码查看[页面](https://www.clloz.com/study/tab-select/jquery-select.html)

使用事件委托还有一个优点就是当我们动态向我们绑定了事件处理程序的上册元素中添加新的元素时，事件处理程序对这个新的元素也会生效，而传统的绑定事件方法则不行。

> 最适合采用事件委托技术的事件包括 `click`、`mousedown`、`mouseup`、`keydown`、`keyup` 和 `keypress`。 虽然 `mouseover` 和 `mouseout` 事件也冒泡，但要适当处理它们并不容易，而且经常需要计算元素的位置。(因为当鼠标从一个元素移到其子节点时，或者当鼠标移出该元素时，都会触发 `mouseout` 事件。)

## 移除事件处理程序

移除事件处理程序更像一个程序员来维护的垃圾回收方式。每当将事件处理程序指定给元素时，运行中的浏览器代码与支持页面交互的 `JavaScript` 代码之间就 会建立一个连接。这种连接越多，页面执行起来就越慢。采用事件委托的方式能有效的减少连接的数量，但是一些残留在内存中的未被回收的空事件处理程序也是影响页面性能的一个原因。

如果我们绑定了事件处理程序的元素被 `removeChild(), replaceChild()或者innerHTML` 方法删除或替换的时候，原来添加到元素中的事件处理程序很可能没有被当作垃圾回收，这时候用 `removeEventListener()` 或者 `element.onclick = null` 来手动移除事件处理程序是个不错的选择。

> 在事件处理程序中删除按钮也能阻止事件冒泡。目标元素在文档中是事件冒泡的前提。

## 自定义事件

自定义事件与浏览器定义的事件并没有什么不同，一样能够传播，能够指定事件处理程序。有了自定义事件以后，我们可以在任意时刻触发特定的事件。对于复杂页面不同功能模块之间的解耦有很大的帮助。同时自定义事件能够实现对全局的广播，这在复杂的应用中有很大的作用。

## 创建自定义事件

Events 可以使用 Event 构造函数创建如下：

```javascript
var event = new Event('build');

// Listen for the event.
elem.addEventListener('build', function (e) { ... }, false);

// Dispatch the event.
elem.dispatchEvent(event);
```

注意的是如果要模拟内置事件需要使用内置事件自己的对应接口，比如鼠标事件用 `new MouseEvent()`，焦点相关事件用 `new FocusEvent()`，和键盘事件相关的 `new KeyboardEvent()`。如果是用 `new Event()` 的话，很可能会出问题，比如你想模拟复选框的点击事件，如果用 `new Event('click')`，虽然事件流都触发了，但是最后复选框的勾没打上，用 `MouseEvent` 就没有问题。但是 `MouseEvent` 无法配置 `bubbles` 和 `cancelable` 字段。内置事件的详情查看 [Web API 接口参考 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API 'Web API 接口参考 - MDN')

最早定义事件使用 `event = document.createEvent(MouseEvents)`，`event.initEvent()` 和 `event.initMouseEvent()` 等方法，如今这些方法董聪标准中移除，不推荐使用。现在要模拟内置事件，就用内置事件的构造函数（不再支持 `bubbles` 和 `cancelable` 参数，内置事件的冒泡和取消默认行为都要在绑定事件时设定）创建内置事件，想要自定义事件则使用 `Event()` 或者 `customEvent()` 构造函数。

自定义事件通常称为合成事件，而不是浏览器本身触发的事件。如果我们用 `new Event()`，创建了和内置事件同名的事件，不会影响浏览器的默认行为。

## 派发事件

使用 `EventTarget.dispatchEvent` 方法进行事件的派发，语法是 `cancelled = !target.dispatchEvent(event)`，`event` 是要被派发的 **事件对象**，注意这里必须是事件对象，而不是事件类型的字符串。比如你想派发一个内置 `click` 事件，需要 `element.dispatchEvent(new MouseEvent('click'))`，而不是 `e'le'ment.dispatchEvent('click')`。

该方法的返回值是一个布尔值，当该事件是可取消的(`cancelable` 为 `true`)并且**至少一个**该事件的事件处理方法调用了`Event.preventDefault()`，则返回值为 `false`；否则返回 `true`。

如果该被派发的事件的事件类型(`event's type`)在方法调用之前没有被经过初始化被指定，就会抛出一个 `UNSPECIFIED_EVENT_TYPE_ERR` 异常，或者如果事件类型是 `null` 或一个空字符串。 `event handler` 就会抛出未捕获的异常； 这些 `event handlers` 运行在一个嵌套的调用栈中： 他们会阻塞调用直到他们处理完毕，但是异常不会冒泡。

最后一点需要注意的是，事件派发必须在事件绑定完成之后，否则不会有任何效果。

---

关于 `cancelable` 和 `preventDefault()` 添加一点理解，我觉得 `cancelable` 对自定义事件来说意义不是很大，因为自定义事件本来就没有任何默认行为，`cancelable` 唯一的作用就是确定自定义事件中的 `event.preventDefault()` 是否执行了。而这种状态的传递是完全可以依靠其他的方式来做，不是必须的。有默认行为的内置事件已经不支持设置 `cancelable` 和 `bubbles`。下面这个例子是 [现代 JavaScript 教程](https://zh.javascript.info/dispatch-events '现代 JavaScript 教程') 中的一个例子，可以在 `dispatchEvent` 的位置根据返回值进行逻辑判断，不过我依然觉得这个功能不是很有用，除非以后能让我们添加自定义函数的默认行为，这才会比较有用。

```html
<pre id="rabbit">
  |\   /|
   \|_|/
   /. .\
  =\_Y_/=
   {>o<}
</pre>
<button onclick="hide()">Hide()</button>

<script>
  // hide() 将在 2 秒后被自动调用
  function hide() {
    let event = new CustomEvent('hide', {
      cancelable: true // 没有这个标志，preventDefault 将不起作用
    })
    if (!rabbit.dispatchEvent(event)) {
      alert('The action was prevented by a handler')
    } else {
      rabbit.hidden = true
    }
  }

  rabbit.addEventListener('hide', function (event) {
    if (confirm('Call preventDefault?')) {
      event.preventDefault()
    }
  })
</script>
```

## 添加自定义数据

要向事件对象添加更多数据，可以使用 `CustomEvent`，该接口继承自 `Event` 所以 `Event` 的方法和属性它都继承了。他自己本身只有一个静态属性，就是初始化时传入的自定义数据 `detail`。它的第二个参数是一个对象接受三个参数：`bubbles`，`cancelable` 和 `detail`。其中 `detail` 就是我们初始化的时候传给事件的数据，当派发的时间出发的时候，我们可以在回调函数中取得该值。

`CustomEvent` 接口可以为 `event` 对象添加更多的数据。例如，`event` 可以创建如下：

```javascript
var event = new CustomEvent('build', { detail: elem.dataset.time })
```

访问自定义数据，在事件处理程序中的回调函数中使用：

```javascript
function eventHandler(e) {
  log('The time is: ' + e.detail)
}
```

元素可以侦听尚未创建的事件：

```html
<form>
  <textarea></textarea>
</form>

<script>
  const form = document.querySelector('form')
  const textarea = document.querySelector('textarea')

  form.addEventListener('awesome', (e) => console.log(e.detail.text()))

  textarea.addEventListener('input', function () {
    // Create and dispatch/trigger an event on the fly
    // Note: Optionally, we've also leveraged the "function expression" (instead of the "arrow function expression") so "this" will represent the element
    this.dispatchEvent(
      new CustomEvent('awesome', { bubbles: true, detail: { text: () => textarea.value } })
    )
  })
</script>
```

> `javascript`高级程序设计中的模拟事件章节中的方法都已经废弃，想要了解自定义事件的查看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Events/Creating_and_triggering_events 'MDN')

通常事件是在队列中处理的。也就是说：如果浏览器正在处理 `onclick`，这时发生了一个新的事件，例如鼠标移动了，那么它会被排入队列，相应的 `mousemove` 处理程序将在 `onclick` 事件处理完成后被调用。

值得注意的例外情况就是，一个事件是在另一个事件中发起的。例如使用 `dispatchEvent`。这类事件将会被立即处理，即在新的事件处理程序被调用之后，恢复到当前的事件处理程序。

## 参考文章

1. 《JavaScript 高级程序设计 3rd Edition》
2. MDN
