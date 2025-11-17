---
title: '选择器匹配元素'
publishDate: '2020-08-09 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
heroImage: { 'src': './browser.jpg', 'color': '#B4C6DA' }
---

## 前言

用原生的 `JavaScript` 实现给定一个选择器（复合选择器和子选择器，不考虑逗号），和一个元素，判断该元素是否与该选择器匹配。

## 实现

对于一个选择器比如 `div #myid .class1.class2`，我们应该是从后向前匹配。我们用 `String.prototype.split()` 方法将嵌套的选择器放入一个数组，然后从后向前依次进行匹配。最内层的选择器如果匹配失败则直接返回 `false`，其他父层级选择器则要依次向上遍历匹配。

## 复合选择器的匹配

解决了基本的逻辑，我们需要处理的就是如何将一个复合选择器和元素进行匹配。比如 `div#myid.class1.class2` 这样的复合选择器。我的思路是用正则表达式将复合选择器分解为简单选择器，然后和元素的属性进行对比。

```javascript
function specificity(selector) {
  let reg = /(?<tagname>(\w+)?)(?<id>(#\w+)?)(?<classname>(.[\w.]+)?)/
  let result = selector.match(reg)
  return result.groups
}
console.log(specificity('div#myid.class1.class2'))
//[Object: null prototype] {
//  tagname: 'div',
//  id: '#myid',
//  classname: '.class1.class2'
//}
```

我们利用正则表达式中的分组提取出 `tagname`，`id` 和 `class`。关于正则表达式可以看我的另一篇文章[正则表达式的入门和JavaScript中的应用](https://www.clloz.com/programming/front-end/js/2020/08/05/regex-javascript-apply/ '正则表达式的入门和JavaScript中的应用')。

---

将复合选择器转化为简单选择器后，我们要做的就是取得元素的简单选择器然后进行比较。元素的几个对应属性很简单，`tagName` 可以用 `element.tagName` 直接获得；`id` 和 `class` 可以通过 `element.getAttribute()` 方法获得（形式略有不同，需要处理）

```javascript
function compare(result, element) {
  if (result.tagname !== '' && element.tagName.toLowerCase() !== result.tagname) {
    return false
  }
  if (result.id !== '' && element.getAttribute('id') !== result.id.slice(1)) {
    return false
  }
  if (result.classname !== '') {
    let classnames = result.classname.split('.').filter((val) => !!val)
    let el_classnames = element.getAttribute('class').split(' ')
    let isContain = classnames.every((x) => el_classnames.includes(x))
    if (!isContain) return false
  }
  return true
}
```

---

最后我们要做的就是循环选择器数组，与当前元素匹配。元素用 `while` 向上回溯，直到 `element.parentElement` 为 `null`。

```javascript
function match(selector, element) {
  let selectors = selector.split(' ')
  for (let i = selectors.length - 1; i >= 0; i--) {
    let result = specificity(selectors[i])

    if (i === selectors.length - 1) {
      if (!compare(result, element)) return false
    } else {
      let isMatch = false
      element = element.parentElement
      console.log(element)

      while (element !== null && isMatch === false) {
        console.log(result, element)
        if (compare(result, element)) isMatch = true
        element = element.parentElement
      }
      console.log(isMatch)
      if (!isMatch) return false
    }
  }
  return true
}
```

> 完整代码可以查看[选择器元素匹配](https://www.clloz.com/study/selector_match_element/index.html)，打开开发者工具查看，

## 匹配机制

我们上面说过，元素和选择器的匹配是从后往前（从右往左），这里来简单解释一下为什么。当我们要知道当前的元素是否和某个选择器匹配的时候，比如选择器 `#id .class1 .class2`。如果我们从左往右匹配，当我们遇到 `#id` 的元素的时候，我们需要检查所有的子元素来寻找 `.class1`，这在复杂的文档解构中是非常低效率的。而如果我们从后往前匹配，当我们遇到一个 `.class2` 的元素，我们只需要看他的父元素（有些选择器也要看兄弟元素）是否you 匹配 `.class1` ，依次向上追溯就可以了。并且如果 `.class2` 没有匹配成功我们就可以直接确定这个元素不符合。

浏览器中的 `CSS` 是如何计算的可以参考这篇文章[从Chrome源码看浏览器如何计算CSS](https://zhuanlan.zhihu.com/p/25380611 '从Chrome源码看浏览器如何计算CSS')
