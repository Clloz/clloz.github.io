---
title: 'JavaScript 大数相加相乘实现'
publishDate: '2020-10-18 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

`JavaScript` 中的最大安全整数是 $2 ^{53} - 1$，即 `9007199254740991`，当我们进行超出这个范围的数值计算的时候就无法得到精确的值，而是一个近似值，比如我们计算 `9007199254740991 + 10` 得到的结果是 `9007199254741000`。本文讲一下如何利用字符串在 `JavaScript` 中实现大数相加相乘。

## 相加

用字符串实现相加相乘基本思路就是按照我们在纸上进行竖式运算一样。对于加法，我们需要将两个数 `num1` 和 `num2` 上下对齐，然后从个位开始计算两个数对应位的和，循环到最高位，将每一次运算的结果保存到一个数组 `result` 中去，最终用 `Array.prototype.join()` 方法还原成一个数组。

这里为了保持循环的正常进行，我们需要保证两个字符串位数相等，所以我们要用 `String.prototpye.padStart()` 方法将位数比较小的那一个字符串的前面用 `'0'` 补齐。

按位相加有个问题就是进位如何保存，我的思路是这样的。当我们相加 `num1[i]` 和 `num2[i]` 的时候，得到的最多是一个两位数，它将影响 `result` 的两位，即当前的 `result[0]` 位置和即将 `unshift` 到 `result` 中的一位。当前的 `result[0]` 位置的数就是计算 `[i -1]` 是得到的数的高位（即进位），我们将我们计算的值加上进位，得到的数在分成两位分别放到 `result` 中。

所以总结一下就是我们计算 `num1[i] + num2[i]` 得到一个两位数，这个两位数要先和 `num1[i-1] + num2[i-1]` 的结果的进位（即 `result[0]` 相加，然后在分成 `high` 和 `low` 两位，将 `result[0]` 的值用 `low` 位替换，然后将 `high` 位 `unshift` 到 `result` 最前面。可以参考下图理解。

![bignumber1](./images/bignumber1.png 'bignumber1')

所以我们每次计算都是确定一位和下一位的进位。最后代码如下：

```javascript
let add = function (num1, num2) {
  if (isNaN(num1) || isNaN(num2)) return ''
  if (num1 === '0' || num2 === '0') return num1 === '0' ? num2 : num1

  let len = Math.max(num1.length, num2.length)
  num1 = num1.padStart(len, '0')
  num2 = num2.padStart(len, '0')

  let result = []

  for (let i = len - 1; i >= 0; i--) {
    let sum = Number(num1[i]) + Number(num2[i]) + (result[0] || 0)
    let low = sum % 10
    let high = Math.floor(sum / 10)

    result[0] = low
    result.unshift(high)
  }
  return result.join('')
}

console.log(add('10', '9007199254740991')) //09007199254741001
```

代码中我们加了两个判断，判断两个参数是否是合法数字格式，以及如果一个数是 `'0'` 则直接返回另一个数。

## 相乘

相乘的逻辑要比相加复杂一点，但是总体思路还是根据竖式来实现算法，我画了一张图，我们借助图来说明。

![bignumber2](./images/bignumber2.png 'bignumber2')

相乘是一个两层循环，我们要循环一个数的位，每一位再与另一个数循环的每一位相乘。我们每次相乘的结果最多是一个两位数。但是与相加不同的是，相加的 `high` 每次都是 `unshift` 进去即可，而相乘的高位也要与 `result` 的位进行运算。

我们来看一看相乘的规律，当我们用 `num1[i] * num2[j]` 的时候，可能得到两位数，也可能得到一位数，我们都统一算作两位数，高位没有的就用 `0` 补齐，那么最后我们得到的结果将是一个 `i + j` 位的数（开头可能存在补齐的 `0`）。而我们每次计算 `num1[i] * num2[j]` 的结果影响到的都是 `result` 中的 `i + j` 和 `i + j + 1` 位。

和加法中逻辑一样，我们将 `num1[i] * num2[j]` 的结果和 `result[i + j + 1]` 相加，得到的结果分为 `low` 和 `high` 分别存入 `reslut` 的 `[i + j +1]` 和 `[i +j]` 中。但是这里要注意，和加法不同，加法的高位直接存入就可以，我们这里的 `high` 对应的 `result[i + j]` 可能已经有值了，我们需要将已经存在的值加上。

`high` 和 `result[i +j]` 的相加可能存在进位怎么办呢，看上图中右边的当前 `result` 值中我们可以看到有些位存了不止一位数，我们将 `high + result[i +j]` 的值直接连进位一起保存到 `result[i + j]` 中。为什么能这样做呢，因为下次计算 `num1[i] * num2[j - 1]` 的时候（注意我们是从后往前遍历），会把 `result[i + j]`和 `low` 相加，进位自然能被处理，这也是这个算法比较重要的地方。

最后的代码：

```javascript
let multiply = function (num1, num2) {
  if (isNaN(num1) || isNaN(num2)) return ''
  if (num1 === '0' || num2 === '0') return '0'

  let l1 = num1.length,
    l2 = num2.length

  let result = []

  for (let i = l1 - 1; i >= 0; i--) {
    for (let j = l2 - 1; j >= 0; j--) {
      let index1 = i + j
      let index2 = i + j + 1

      let product = num1[i] * num2[j] + (result[index2] || 0)
      result[index2] = product % 10
      result[index1] = Math.floor(product / 10) + (result[index1] || 0)
    }
  }
  return result.join('').replace(/^0+/, '')
}

console.log(multiply('123', '234')) //28782
```

代码中加了两个判断：是否是合法数字，如果有一个值为 `0` 则直接返回 `0`。注意最后要判断得到的结果是否开头有 `0`，如果有则要去掉，这里用的正则表达式。
