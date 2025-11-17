---
title: '函数节流和函数防抖'
publishDate: '2019-05-21 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
---

## 前言

本文介绍函数节流 `throttle` 和 函数防抖 `debounce` 的实现方法。

## 函数节流 throttle

函数节流就是高频触发事件，指定时间内只执行一次。

我们来想象一下需要函数节流的场景，比如典型的监听页面滚动触发回调函数，我们写一段测试代码，然后来看看多次触发的情况：

```html
<style>
  div {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 200px;
    width: 200px;
    padding: 0 10px;
    transform: translate(-50%, -50%);
    border: 1px solid black;
    overflow: auto;
  }

  .content {
    width: 100%;
    height: 500px;
    background: lightblue;
  }
</style>
<div class="wrap">
  <div class="content"></div>
</div>
<script>
  var wrap = document.querySelector('.wrap')
  var content = document.querySelector('.content')
  wrap.addEventListener('scroll', function () {
    console.log('dispatch')
  })
</script>
```

我们为 `wrap` 绑定了一个滚动事件的监听，这种需求是经常用到的，比如我们需要根据用户的滚动显示不同的内容，但是很明显的是我们并不需要如此频繁地执行回调函数，我们需要让这个监听的回调函数执行的次数少一点，这时候就需要用到函数节流。

浏览器的监控肯定是固定频率持续发生的，这是我们无法控制的，我们能做的就是在执行流进入到回调函数的时候进行判断，如果不符合条件我们就不执行，这就是函数节流的原理。如何设计这个逻辑呢，我们可以利用 `JavaScript` 的定时器配合一个表示状态的锁来达到目的，代码如下：

```javascript
wrap.addEventListener(
  'scroll',
  throttle(function () {
    console.log('dispatch: ' + new Date().getTime())
  }, 300)
)

function throttle(fn, interval) {
  var executing = false
  return function () {
    if (executing) return
    executing = true
    setTimeout(() => {
      fn.apply(this, arguments)
      executing = false
    }, interval)
  }
}
```

现在我们的回调函数在 `executing` 为 `true` 的时候会直接返回，而我们的功能代码也就是 `fn` 每隔 `300ms` 才会执行一次，效果如下:

> 需要注意的是 `setTimeout` 的回调函数中的 `this` 默认指向 `window`，因为 `setTimeout` 是 `window` 对象上的一个方法，调用 `setTimeout` 实际上是 `window.setTimeout`，而我们的 `fn` 中的 `this` 需要指向绑定事件的 `DOM` 元素，所以需要 `bind` ，箭头函数或者中间变量。这里我使用的箭头函数，用 `apply` 来设置函数执行的 `this` 和参数。

## 函数防抖 debounce

防抖 `debounce` 的概念其实是从机械开关和继电器的“去弹跳”（`debounce`）衍生出来的，基本思路就是把多个信号合并为一个信号。

编程中的函数防抖就是在事件被触发 `n` 秒后再执行回调，如果在这 `n` 秒内又被触发，则重新计时，也就是把一些高频触发事件的多次触发信号合并成一个，达到 `debounce` 的效果。主要针对的是回调只需要执行一次，但是事件却频繁触发，如果每次触发我们都执行回调，会造成性能的浪费。这在生活中也很常见，比如电梯门打开后默认 `3s` 后关闭，如果在这段时间中有人又按了按钮，会从头开始计算 `3s`。

这里我们用一个最常见的例子来说明，用户修改输入框输入后向后台发请求，如果用户每次修改输入我们都发请求，那么是很浪费的。我们可以设置一个 `500ms` 的延迟，`500ms` 内用户又进行了输入则重新计时，如果 `500ms` 内用户都没有输入则发送请求。

主要的实现思路就是用 `setTimeout` 和 `clearTimeout`，我们将待执行函数用一个 `debounce` 函数进行包装。当事件触发的时候我们首先进行 `clearTimeout` 删除之前设置的定时器，然后重新用 `setTimeout` 设置一个定时器。只有当事件在指定时间内没有触发了，`setTimeout` 的回调函数才会执行。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>debounce</title>
  </head>
  <body>
    <input id="inp" type="text" />
    <script>
      function debounce(fn, interval) {
        let timeout = null
        return function () {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            fn.apply(this, arguments)
          }, interval)
        }
      }
      function sayHi() {
        console.log('debounce success!')
      }
      var inp = document.getElementById('inp')
      inp.addEventListener('input', debounce(sayHi, 500)) // 防抖
    </script>
  </body>
</html>
```

## 总结

函数节流和函数防抖主要是应用在一些高频触发事件上，当我们的事件不需要那么高的触发频率的时候，可以用节流或者防抖处理。

想要查看文章中的示例请[点击](https://www.clloz.com/study/throttle-debounce.html)

## 参考文章

1. [什么是防抖和节流？有什么区别？如何实现？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/5 '什么是防抖和节流？有什么区别？如何实现？')
2. [函数防抖与函数节流](https://zhuanlan.zhihu.com/p/38313717 '函数防抖与函数节流')
