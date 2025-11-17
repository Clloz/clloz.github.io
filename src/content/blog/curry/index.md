---
title: '函数柯里化'
publishDate: '2020-10-12 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
  - 编程技巧
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

本文讲一讲面试经常出现但是实际编码中很少使用到 :laughing: 的函数柯里化的实现。

## 什么是函数柯里化

柯里化是一个函数式编程的概念，维基百科的定义时在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。大致的效果是这样，比如一个函数需要三个参数：

```javascript
function fu(a, b, c) {
  console.log(a, b, c)
}
```

一般我们调用这样的函数是一次性传入三个参数 `fn(1, 2, 3)`，但是经过柯里化之后，我们可以分次传入参数。

```javascript
function curry(fn) {
  //content ....
  return function () {
    //content ...
  }
}

let newFn = curry(fn)

newFn(1)(2)(3)
```

那么函数柯里化有什么用呢？一个比较明显的作用就是返回一个已经设定好参数的函数，当我们的函数参数有多种可能情况的时候，比如 `ajax` 我们可能需要传入 `type, url, data` 等数据，那我们可以用 `curry` 进行包装，得到预设好 `type` 的 `get` 和 `post` 函数，这样我们使用的时候更加方便。但其实这个功能用 `bing` 也能实现。

所以我觉得 `bind` 和 `curry` 是有一些相同的逻辑的。比如我在 [模拟实现call，apply 和 bind](https://www.clloz.com/programming/front-end/js/2020/10/07/simulation-of-call-apply-bind/ '模拟实现call，apply 和 bind') 一文中写的用 `bind` 可以将 `Array.prototype.slice.apply(arguments)` 简化成 `slice(arguments)` 的调用方式。`curry` 也有相同的作用。以我的理解就是函数柯里化是对函数的一种抽象和包装，让我们能够更好地定制函数，更简洁地调用函数。

虽然可能在实际编码中我们不太会用到这个，但是之所以经常有面试问到这个问题我觉得是考查你对于函数的理解。函数既可以作为一个参数，也可以作为一个返回值。也可以赋值给变量，所谓的一等公民。只要是函数式编程就可以实现柯里化，他也是函数式编程语言自带的一个特性。

## 实现

实现函数柯里化的主要逻辑： 1. 实现一个 `curry` 函数 `function curry() {}`，该函数接受一个函数`beCurry`作为参数，返回一个函数 `fn_judge`。这个返回的函数 `fn_judge` 才是我们后面分次接受参数执行的函数，也是我们的主要逻辑。 2. 给 `fn_judge` 传入参数，执行 `fn_judge`，按照柯里化的定义，每次只传入一个参数，实际可以根据自己的需求。 3. `fn_judge` 的主要逻辑就是用一个变量 `args` 保存传入的参数，判断传入的参数个数是否足够执行 `beCurry`，如果足够执行了。直接执行 `beCurry`；如果不够，则返回一个匿名函数 `fn_anonymous`。 4. 后面传入参数就是执行 `fu_anonymous`，`fn_anonymous` 的逻辑很简单，将传入 `fn_anonymous` 的参数拼接到 `args` 上，递归调用 `fn_judge`，然后回到第二步再依次执行。

其实说简单一点，就是我们在函数外面进行了一层逻辑包装：当前是否有足够参数执行函数？没有则将参数保存起来，返回一个函数继续接受参数，下次执行要将新传入的参数和保存的参数合并；如果有，则立即执行函数。最后其实我们要解决的就是如何保存和合并参数的问题，解决这个问题的方法很多，也大同小异。我的代码如下：

```javascript
function curry(fn) {
  let length = fn.length

  return function judge() {
    let args = Array.prototype.slice.call(arguments)

    if (args.length < length) {
      return function () {
        args = Array.prototype.concat.apply(args, arguments)
        return judge.apply(null, args)
      }
    } else {
      return fn.apply(null, args)
    }
  }
}

var fn = curry(function (a, b, c) {
  console.log([a, b, c])
})

fn('a', 'b', 'c') // ["a", "b", "c"]
fn('a', 'b')('c') // ["a", "b", "c"]
fn('a')('b')('c') // ["a", "b", "c"]
fn('a')('b', 'c') // ["a", "b", "c"]
```

当然如果你有需要可以设置 `judge` 只可以传入一个参数，一般来说不需要。

最后还有一个问题就是 `this` 的问题，比如如下这样的形式我们按上面的方式进行柯里化会丢失 `this`。

```javascript
let obj = {
  id: 'clloz',
  age: '28',
  func: function (a, b, c) {
    console.log(this.id, this.age)
    console.log([a, b, c])
  }
}
obj.func(1, 2, 3)
//clloz 28
//[1, 2, 3]

var fn = curry(obj.func, obj)
fn(1)(2)(3)
//undefined undefined
//[1, 2, 3]
```

我没想到特别好的解决办法，唯一就是在进行柯里化的时候传入需要的 `this` 在后面 `apply` 的时候传入这个 `this`。

```javascript
function curry(fn, thisArg) {
  let length = fn.length

  return function judge() {
    let args = Array.prototype.slice.call(arguments)

    if (args.length < length) {
      return function () {
        args = Array.prototype.concat.apply(args, arguments)
        return judge.apply(thisArg, args)
      }
    } else {
      return fn.apply(thisArg, args)
    }
  }
}

let obj = {
  name: 'clloz',
  age: '28',
  func: function (a, b, c) {
    console.log(this.name, this.age)
    console.log([a, b, c])
  }
}
var fn = curry(obj.func, obj)
fn(1)(2)(3)
//clloz 28
//[ 1, 2, 3 ]
```

## 其他实现

这里给大家贴上一些别人的实现，主要的逻辑是不变的，看能不能帮助理解。

## 冴羽的实现

冴羽大神的博客非常建议大家看，很多非常深入的知识，博客地址：[冴羽的博客](https://github.com/mqyqingfeng/Blog '的博客')。他的 [JavaScript专题之函数柯里化](https://github.com/mqyqingfeng/Blog/issues/42 'JavaScript专题之函数柯里化') 这篇博客里也贴出了几种实现。

1. 逻辑比较 **复杂** 的实现

```javascript
function sub_curry(fn) {
  var args = [].slice.call(arguments, 1)
  return function () {
    return fn.apply(this, args.concat([].slice.call(arguments)))
  }
}

function curry(fn, length) {
  length = length || fn.length

  var slice = Array.prototype.slice

  return function () {
    if (arguments.length < length) {
      var combined = [fn].concat(slice.call(arguments))
      return curry(sub_curry.apply(this, combined), length - arguments.length)
    } else {
      return fn.apply(this, arguments)
    }
  }
}
```

2. 和我上面的实现逻辑比较接近的实现

```javascript
function curry(fn, args) {
  var length = fn.length

  args = args || []

  return function () {
    var _args = args.slice(0),
      arg,
      i

    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i]

      _args.push(arg)
    }
    if (_args.length < length) {
      return curry.call(this, fn, _args)
    } else {
      return fn.apply(this, _args)
    }
  }
}
```

3. 可以改变参数顺序的实现

```javascript
function curry(fn, args, holes) {
  length = fn.length

  args = args || []

  holes = holes || []

  return function () {
    var _args = args.slice(0),
      _holes = holes.slice(0),
      argsLen = args.length,
      holesLen = holes.length,
      arg,
      i,
      index = 0

    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i]
      // 处理类似 fn(1, _, _, 4)(_, 3) 这种情况，index 需要指向 holes 正确的下标
      if (arg === _ && holesLen) {
        index++
        if (index > holesLen) {
          _args.push(arg)
          _holes.push(argsLen - 1 + index - holesLen)
        }
      }
      // 处理类似 fn(1)(_) 这种情况
      else if (arg === _) {
        _args.push(arg)
        _holes.push(argsLen + i)
      }
      // 处理类似 fn(_, 2)(1) 这种情况
      else if (holesLen) {
        // fn(_, 2)(_, 3)
        if (index >= holesLen) {
          _args.push(arg)
        }
        // fn(_, 2)(1) 用参数 1 替换占位符
        else {
          _args.splice(_holes[index], 1, arg)
          _holes.splice(index, 1)
        }
      } else {
        _args.push(arg)
      }
    }
    if (_holes.length || _args.length < length) {
      return curry.call(this, fn, _args, _holes)
    } else {
      return fn.apply(this, _args)
    }
  }
}
```

## 利用箭头函数一行实现

这个实现来自 `segmentfault` 的大笑平。

```javascript
var curry = (fn) =>
  (judge = (...args) => (args.length === fn.length ? fn(...args) : (arg) => judge(...args, arg)))

//分行
var curry = (fn) =>
  (judge = (...args) => (args.length === fn.length ? fn(...args) : (arg) => judge(...args, arg)))
```

看着很美，但是可读性很差，我把它转化成了比较好理解的方式：

```javascript
function curry(fn) {
  return function judge(...args) {
    if (args.length === fn.length) {
      return fn(...args)
    } else {
      return function (arg) {
        return judge(...args, arg)
      }
    }
  }
}
```

## 参考文章

1. [JavaScript专题之函数柯里化](https://github.com/mqyqingfeng/Blog/issues/42 'JavaScript专题之函数柯里化')
2. [【进阶 6-2 期】深入高阶函数应用之柯里化](https://github.com/yygmind/blog/issues/37 '【进阶 6-2 期】深入高阶函数应用之柯里化')
