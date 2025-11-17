---
title: '动态加载的样式/脚本对渲染的影响'
publishDate: '2019-04-26 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
---

## 前言

在[浏览器渲染过程和JS引擎浅析](https://www.clloz.com/programming/front-end/js/2019/04/25/how-browser-work/ '浏览器渲染过程和JS引擎浅析')这篇文章里，我提到了用同步脚本异步加载（脚本同步，但是请求是由渲染引擎的异步请求线程异步请求的）的外部资源会影响 `load` 事件发生的时候，如果外部资源加载时间过长，那么 `load` 时间发生的时间也会推迟。但其实在脚本中动态加载脚本或者异步请求外部资源还有一些细节可以挖掘。

## 异步请求样式表

在脚本中异步请求样式或脚本是不会阻塞DOM的解析和渲染，唯一影响的就是 `load` 事件发生的时间以及 `load` 事件发生之前的最后一次渲染。看下面这段代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Test</title>
    <script defer src="js/test.js"></script>
  </head>
  <body>
    <div id="test">test1</div>

    <script>
      let script = document.createElement('link')
      script.setAttribute('rel', 'stylesheet')
      script.setAttribute(
        'href',
        'https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.css'
      )

      var a = document.body.appendChild(script)
      console.log(123)

      window.onload = function () {
        console.log('window load...')
      }
    </script>
    <div>test2</div>
  </body>
</html>
```

```javascript
//test.js
console.log('domcontentloaded')
```

通过设置浏览器的 `network throttling`（选择 `slow 3g` 就可以，或者你可以自定义到更慢，能够区分出效果就可以），让异步请求的 `css` 的加载时间变长，然后观察之后的脚本是否执行，脚本之后的元素是否被渲染到页面上。通过结果的观察我们可以发现在 `css` 还没有加载完成的时候 `console.log(123)` 已经执行，并且 `test2` 元素也已经被渲染到页面上，`defer`标签中的代码也已经执行，说明 `DOMContentLoaded` 事件已经触发，说明文档解析已经完成。当异步的 `css` 请求到的时候，页面会对新的 `css` 进行解析，然后对页面进行 `load` 之前的最后一次渲染，此时我们看到 `test1` 和 `test2` 的字体变了，随后触发 `load` 事件。

## 同步添加内联样式表

如果我们用同步 `JS` 为文档添加 `style` 标签会怎么样呢，下面一段代码可以测试出结果：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Test</title>
    <script defer src="js/test.js"></script>
  </head>
  <body>
    <div id="test">test1</div>

    <script>
      var style = document.createElement('style')
      style.textContent = '*{ color: red }'

      document.body.appendChild(style)
      var el = document.getElementById('test')
      console.log(window.getComputedStyle(el, null).color)

      window.onload = function () {
        console.log('window load...')
      }
    </script>
    <div>test2</div>
  </body>
</html>
```

```javascript
//test.js
console.log('domcontentloaded')
```

输出如下

```plaintext
rgb(255, 0, 0)
domcontentloaded
window load...
```

我们可以看到在页面还没有解析完成的时候我们获取 `test1` 元素的 `computedstyle` 已经是 `rgb(255,0,0)` 了，说明我们添加的 `style` 标签已经解析并渲染成功。也就是说同步的内联样式表是会阻塞解析和渲染的，不过同步的内联样式表基本不会产生延迟，也就不会影响页面的性能。

## 异步请求外部脚本

在同步的 `JS` 中异步请求外部脚本也会在 `load` 事件之前加载完成，但是对页面解析和渲染的影响，我们看如下的代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Test</title>
    <script defer src="js/test.js"></script>
  </head>
  <body>
    <div id="test">test1</div>

    <script>
      var script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/react@15.4.0/dist/react.js'
      document.body.appendChild(script)
      console.log('after script: ', window.React)

      window.onload = function () {
        console.log('window load...')
        console.log('onload: ', window.React)
      }
    </script>
    <div>test2</div>
  </body>
</html>
```

```javascript
//test.js
console.log('domcontentloaded: ' + window.React)
```

输出结果：

```plaintext
after script:  undefined
domcontentloaded: undefined
window load...
onload:  {__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {…}, Children: {…}, Component: ƒ, PureComponent: ƒ, createElement: ƒ, …}
```

结果显而易见，和异步请求外部样式表的效果相似，请求外部脚本并不影响页面的解析和渲染，也没有阻塞后面的脚本执行， 这意味着动态插入一个外部脚本后不可立即使用其内容，需要等待加载完毕。在这段代码中，直到 `load` 事件发生后，我们在 `onload` 函数中才能调用外部脚本中的变量。同时也佐证了 `load` 事件发生之前会加载执行完所有的异步请求的外部资源。

## 在 DOM 中插入内联脚本

这个直接说结论通过 `DOM API` （ `appendChild()`、`append()`、`before()` 等等）插入的 `script` 元素，如果这个 `script` 元素没有 `src` 属性且 `type` 属性不是 `module`，则这个 `script` 元素的 `textContent` 就会像你所说的那样，立刻“同步”执行。关于这一点`whatwg`的`html`文档中有详细说明[4.12.1 The script element](https://html.spec.whatwg.org/multipage/scripting.html#script-processing-model:immediately-2 'https://html.spec.whatwg.org/multipage/scripting.html#script-processing-model:immediately-2')，按照文档的理解，这个内联的脚本会立即被压到执行栈的顶部立即执行，相当于包含脚本内的函数一样，具体看下面这段代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Test</title>
    <script defer src="js/test.js"></script>
  </head>
  <body>
    <div id="test">test1</div>

    <script>
      let script = document.createElement('script')
      script.text = 'console.log(1)'
      document.body.appendChild(script)
      console.log(2)

      window.onload = function () {
        console.log('window load...')
        console.log('onload: ', window.React)
      }
    </script>
    <div>test2</div>
  </body>
</html>
```

```javascript
//test.js
console.log('domcontentloaded')
```

输出如下：

```plaintext
1
2
domcontentloaded
window load...
```

从结果可以看书，添加的内联 `script` 立即执行了，比后面的 `console.log(1)` 还要更早执行，文档中说的是 `Immediately execute the script block, even if other scripts are already executing.`，这种感觉就像是包含脚本中的同步函数，执行到这里立即压栈执行。显而易见，动态添加的内联的脚本是会阻塞页面的解析和渲染的，和原本就在文档中的内联脚本并没有不同，如果把 `script.test` 换成如下代码：

```javascript
script.text = `
        var now = new Date().getTime();
        while(new Date().getTime() - now < 3000) {
          continue;
        }
      `
```

我们可以看到页面会白屏直到这段代码执行完成，后面的脚本才能执行，文档才能继续解析和渲染。

## 未连接的 CSS/JS 不会被载入

如果你创建了一个 `<link rel="stylesheet">` （或 `<script>` ）但并未连接到 `DOM` 树，那么它不会被加载。 这是标准行为与浏览器实现方式无关，因此你可以放心地利用该特性。 该特性很容易测试，只需创建一个 `<link rel="stylesheet">` （或 `<script>` ）标签并查看是否产生网络请求：

```javascript
var link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.css'
var script = document.createElement('script')
script.src = 'https://cdn.jsdelivr.net/npm/react@15.4.0/dist/react.js'
```

## 监听异步资源载入

我们可以利用 `document.onload` 事件来监听资源是否已经从外部加载完成，代码如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Test</title>
    <script defer src="js/test.js"></script>
  </head>
  <body>
    <div id="test">test1</div>

    <script>
      var link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.css'
      var script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/react@15.4.0/dist/react.js'
      document.body.appendChild(script)
      script.onload = function () {
        console.log('source loaded!')
      }

      window.onload = function () {
        console.log('window load...')
      }
    </script>
    <div>test2</div>
  </body>
</html>
```

```javascript
//test.js
console.log('domcontentloaded')
```

输出结果如下：

```plaintext
domcontentloaded
source loaded!
window load...
```

如果你想直到具体加载事件还可以用 `new Date().getTime()` 来查看具体的毫秒数。

## innerHTML

`innerHTML` 属性可用来设置 DOM 内容，但不可用来插入并执行 `<script>`。 下面的内联脚本和外部脚本都不会被执行：

```javascript
document.body.innerHTML = '<script src="foo.js"></script>'
document.body.innerHTML = '<script>console.log("foo")</script>'
```

在设置 `innerHTML` 时，浏览器会初始化一个新的 `HTML Parser` 来解析它。 只要与该 `Parser` 关联的 `DOM` 启用了 `JavaScript`（通常是启用的），脚本的 `scripting flag` 就为真， 但是即便如此，[HTML 片段的解析过程中，脚本是不会执行的](https://html.spec.whatwg.org/#other-parsing-state-flags 'HTML 片段的解析过程中，脚本是不会执行的')。

> Create a new HTML parser, and associate it with the just created Document node. – 12.4 Parsing HTML fragments, WHATWG The scripting flag can be enabled even when the parser was originally created for the HTML fragment parsing algorithm, even though script elements don’t execute in that case. – 12.2.3.5 Other parsing state flags, WHATWG

事实上，设置 `innerHTML` 和 `outerHTML` 都不执行脚本，但 `document.write()` 是会同步执行的。

> When inserted using the document.write() method, script elements execute (typically blocking further script execution or HTML parsing), but when inserted using innerHTML and outerHTML attributes, they do not execute at all. – 4.12.1 The script element WHATWG

## 总结

结合[浏览器渲染过程和JS引擎浅析](https://www.clloz.com/programming/front-end/js/2019/04/25/how-browser-work/ '浏览器渲染过程和JS引擎浅析')和这篇文章，对于整个浏览器的渲染过程，和我们的代码会在哪个阶段执行，是否会被阻塞应该都能有一个清晰的认识了，虽然扣了很多细节，不过这对于我们写出更好的代码还是有帮助的。

## 参考文章

1. [异步渲染的下载和阻塞行为](https://harttle.land/2016/11/26/dynamic-dom-render-blocking.html '异步渲染的下载和阻塞行为')
2. [在 DOM 中动态执行脚本](https://harttle.land/2017/01/16/dynamic-script-insertion.html '在 DOM 中动态执行脚本')
3. [在DOM中 append 一个 script 元素，该元素内的 JavaScript 为何同步执行？ - 紫云飞的回答 - 知乎](https://www.zhihu.com/question/65188909/answer/238020047 '在DOM中 append 一个 script 元素，该元素内的 JavaScript 为何同步执行？ - 紫云飞的回答 - 知乎 ')
