---
title: 'Vue 响应式原理'
publishDate: '2020-11-22 12:00:00'
description: ''
tags:
  - js
  - vue
  - 学习笔记
language: '中文'
heroImage: { 'src': './vuelogo.png', 'color': '#B4C6DA' }
---

## 前言

`Vue3` 将双向数据绑定的实现由 `Object.defineProperty()` 换成了 `Proxy`。本文我们来深入研究一下这两种方法分别如何实现双向数据绑定，并且他们的区别和优劣在哪里。

> 本文所有代码均在 [clloz-vue - Github](https://github.com/Clloz/clloz-vue/tree/dev 'clloz-vue - Github')

## 双向数据绑定原理

双向数据绑定的概念其实很简单，比如你在页面上有一个 `input`，你将这个 `input` 的 `value` 和你在 `JavaScript` 中的一个值打个比方，你声明了一个对象 `obj`，用其中的 `getVal` 属性来保存这个 `input` 的 `value`，通过一段代码进行了绑定。达到的效果就是，当你在页面上的 `input` 进行输入的时候（即改变了 `input` 的 `value`），此时你 `JavaScript` 中的 `getVal` 这个属性就自动发生变化了。同样当你在 `JavaScript` 中修改了 `getVal` 的值的时候，页面上的 `input` 中的 `value` 也会自动改变。

想一想如何用最简单的方法实现这个功能，用 `Object.defineProperty` 将 `obj` 的 `getVal` 属性的 `set` 和 `get` 进行重写，在 `set` 中我们将 `set` 的值也设置到 `input` 的 `value` 中去，这样就打到了修改数据，页面上的元素自动改变的效果。而修改元素改变数据，只要给 `input` 添加一个事件即可。实现效果如下：

<iframe width="100%" height="100px" style="border: none" src="https://cdn.clloz.com/study/reactive/example1.html"></iframe>

代码如下：

```html
<body>
  <input id="be-watch" type="text" />
  <p id="show"></p>
</body>
<script>
  let obj = {
    getVal: 0
  }

  let cache = obj.getVal

  let input = document.getElementById('be-watch')
  let p = document.getElementById('show')
  input.addEventListener('input', (e) => {
    obj.getVal = e.target.value
  })

  Object.defineProperty(obj, 'getVal', {
    enumerable: true,
    configurable: true,
    get() {
      return cache
    },
    set(val) {
      cache = val
      input.value = val
      p.innerHTML = val
    }
  })
</script>
```

这里我们可以发现 `Object.defineProperty` 的一个问题，由于我们使用这个方法监听属性，相当于把属性从数据属性变成了访问器属性，此时我们就无法用这个访问器属性来保存 `value` 了。为了保证对象的正常访问，我们需要找另一个地方将变量保存起来，当执行 `get` 的时候我们会返回那个保存的变量，也就是上面代码中的 `cache`。注意，这里的 `get` 和 `set` 方法中不要使用 `obj.getValue` 保存 `value`，此时他们是访问器属性，如果你这么做会报栈溢出，因为你 `set` 的时候执行 `obj.getValue = val`，此时相当于执行了 `getter`，而 `getter` 返回的又是 `obj.getValue`，然后又会执行 `getter`，一直递归下去，自然就栈溢出了。

## 优化和应用

上面的代码是最简单的双向数据绑定，也是其核心原理。但是在实际的项目中我们不可能这么使用，因为实际的项目中要监听的对象和属性非常多，元素也各不相同，事件也各不相同，如果用上面的这种方法实现每一个属性和对应的元素事件我们都要单独绑定太麻烦了，而且所有的代码都耦合在一起，肯定是非常难以维护的。所以要把这个技术真的应用的到工程中去我们必须抽象出它的一套可行的逻辑。这其中最主要的就是发布订阅模式，不太清楚发布订阅模式的同学可以参考我的文章 [深入发布订阅模式](https://www.clloz.com/programming/front-end/js/2020/10/18/observer-pub-sub-pattern/ '深入发布订阅模式')。

我们来重新理一下需求，我们希望我们声明的对象和某些方法关联起来。在上面的例子中，我们是希望对象属性变化的的时候能够改变 `input` 的 `value`，并显示到一个 `p` 标签中，其实就是执行了一个简单的方法，虽然这个方法只有两行代码。即我希望对象的属性变化的时候，让用到这个属性的方法能够执行。最简单的做法就是像上面的例子中，将这个方法的代码直接放到 `setter` 中，那么在属性改变的时候自然就会执行对应的代码。

但是上面这种实现在项目中肯定是无法实现的，我们每有一个地方用到了某个属性就要去它对应的 `Object.defineProperty` 的位置加上变更的代码，而且每个属性都要有一个不一样的 `defineProperty` 的代码，肯定是没法实现的。

这个时候就要用到发布订阅模式了，我们把调用属性的方法放一边，单独抽象出对象属性的逻辑。我们对对象的包装就两件事，设置 `setter` 和 `getter`，在 `setter` 中通知变化，至于通知给谁，这里我们就要通知给发布订阅模式的事件中心，这里我们称为依赖中心 `Dep`，我们为每一个属性单独建立一个 `Dep`，当属性变化我们就告诉 `Dep` 就可以了，至于 `Dep` 要怎么做我们后面再讨论。这样我们就将把普通 `object` 变为一个可侦测监听的 `object` 这个逻辑分离成一个可以复用的逻辑，我们将这个逻辑抽象出一个 `Observer` 类，它通过 `setter` 发布变化给事件中心 `Dep`，也就是发布订阅模式中 **发布者**。下面给出一个 `Observer` 类的简单骨架：

```javascript
import Dep from './dep.mjs'

export class Observer {
  constructor(data) {
    this.data = data
    if (!Array.isArray(data)) {
      this.walk(data)
    }
  }

  /* eslint-disable */
  walk(obj) {
    Object.keys(obj).forEach((key) => {
      let dep = new Dep()
      let val = obj[key]

      observe(val)
      Object.defineProperty(obj, key, {
        enumreable: true,
        configurable: true,
        get() {
          if (Dep.target) {
            dep.depend()
          }
          return val
        },
        set(newValue) {
          if (val === newValue) return
          val = newValue
          dep.notify()
        }
      })
    })
  }
}

export function observe(val) {
  if (!val || typeof val !== 'object') {
    return
  }
  return new Observer(val)
}
```

我们再去思考调用到属性的方法那边，我们要解决的一个主要问题就是知道方法用了哪些属性，这些属性变化后我们要做些什么。这一步我们自然是要对代码进行分析，我们这里暂时不讨论模版解析的问题，我们就以一个简单的场景来看这个问题，比如我们在 `vue` 中常用的 `$watch`，我们需要在属性 `a` 变化的时候执行某个方法就是 `vm.$watch('a', function(newVal, oldVal){ ... }`，这是最简单的监听需求。其实无论什么样复杂的代码，简化到最后的逻辑都是这样，就是上面的例子是修改一个 `input` 的 `value`，或者改变一个元素的样式，它也只是想在某个属性变化的时候执行一个回调函数，它就是我们发布订阅模式中的 **订阅者**。那我们可以将这个逻辑抽象成一个 `Watcher` 类，每一个监听和回调都是一个 `Watcher` 实例。

`Watcher` 实例主要做什么呢？分析要访问的属性（比如上面的 `a`，这里路径可能有嵌套表达式等情况），访问该属性触发 `getter`，我们将会在 `getter` 中进行依赖的收集。提供一个 `update` 函数，当依赖的属性发出变化通知的时候（`setter` 中的逻辑），外部会调用实例内部的 `update` 方法，执行回调函数。下面给出一个简单的 `Watcher` 骨架：

```javascript
import Dep from './dep.mjs'

export default class Watcher {
  constructor(gb, exp, cb) {
    this.gb = gb
    this.data = this.gb.data
    this.exp = exp
    this.cb = cb
    this.value = this.get()
  }

  // 访问属性，添加订阅
  get() {
    Dep.target = this // 设置 Dep.target 为当前 watcher，让 Dep 知道添加谁
    let value = this.data[this.exp]
    Dep.target = null // getter 触发结束成功添加注册后设置 Dep.target 为 null，防止非 watcher 的属性访问也添加订阅
    return value
  }

  addDep(dep) {
    dep.addSub(this) // 进行订阅
  }

  // 给 Dep 调用的更新方法
  update() {
    const oldVal = this.value
    const newVal = this.get()
    if (oldVal !== newVal) {
      this.cb.call(this.gb, this.newVal, oldVal)
    }
  }
}
```

总结一下 `Observer` 和 `Wathcer` 两个类，`Observer` 是用来将属性用 `Object.defineProperty` 进行重写的，让每一个属性都有 `getter` 和 `setter`，在 `getter` 和 `setter` 中分别完成依赖的收集和属性变更的发布，即通过 `Observer` 我们将一个普通的 `object` 变成了一个可以被侦测监听的 `object` 了。

而 `Watcher` 就是我们将想要订阅属性变更的一些方法的抽象，即每一个方法都是一个 `Watcher` 实例，它通过访问对应的属性触发 `getter` 来实现依赖的注入（注入到 `Dep` 中），同时提供一个 `update()`，让 `Dep` 能在属性变化的时候调用从而执行回调函数。在实际的 `Vue` 代码中，`Watcher` 是在模版的解析过程中生成的，这个我们在后面讨论。

---

剩下的就是依赖调度中心 `Dep` 了，每一个被侦测的属性都会有一个 `Dep` 实例，`Dep` 的主要任务管理该属性依赖，即将收集到的依赖保存，当该属性变化的时候调用对应 `Watcher` 的 `update` 执行回调函数。

依赖的收集是依靠 `Watcher` 访问属性触发 `getter` 来实现的，也就是我们在 `getter` 中要将对应的 `Watcher` 实例写入 `Dep` 实例中去，这里就有一个问题了，`getter` 只知道属性被调用的，但是无法确定是谁调用了属性，我们怎么将 `Watcher` 传递进去呢？这个当然只能依赖一个 `Observer` 类和 `Watcher` 类都能访问到的外部属性了，`Vue` 的做法是用一个 `Dep` 上的静态属性 `target`。也就是当 `Watcher` 进行属性访问之前会先设置这个 `Dep.target` 为自己这个 `Watcher` 实例，然后出发 `getter` 的时候 `getter` 内部会告诉 `Dep` 实例需要添加依赖的。最后当然 `Dep` 当中还有有一个 `notify` 方法通知保存的每个依赖 `Watcher` 实例执行实例中的 `update` 方法。下面是一个 `Dep` 的示例：

```javascript
function remove(arr, item) {
  if (arr.length) {
    let index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
  return false
}

export default class Dep {
  constructor() {
    this.subs = []
  }

  // 调用订阅者 Watcher 的 addDep 方法添加订阅，实际内部调用的就是下面的 addSub
  depend() {
    Dep.target.addDep(this)
  }

  // 添加订阅
  addSub(sub) {
    this.subs.push(sub)
  }

  // 移除订阅
  removeSub(sub) {
    remove(this.subs, sub)
  }

  // 接收到来自 setter 的属性变化的消息则执行所有订阅者的 update 方法
  notify() {
    this.subs.forEach((sub) => sub.update())
  }
}

Dep.target = null
```

这张图来自 《深入浅出 vue.js》，可以帮助大家理解这里的逻辑：

![binding1](./images/vue-two-ways-binding1.png 'binding1')

最后我们写一个例子来测试上面的逻辑是否能够运行：

```javascript
import { observe } from './observer.mjs'
import Watcher from './watcher.mjs'

let obj = {
  data: {
    name: 'clloz',
    age: '28'
  }
}

observe(obj)

/* eslint-disable */
new Watcher(obj, 'name', function () {
  console.log('reactive successful')
})

obj.data.name = 'clloz1992' // reactive successful
console.log(obj.data.name) // clloz1992
```

在例子中我们用 `observe` 方法来对 `obj` 对象进行改造，然后用一个 `watcher` 示例来注册 `name` 属性，当我们给 `name` 属性赋值的时候，我们发现 `reactive successful` 成功输出了。

## Vue 的双向绑定

上面我们已经基本实现了一个还算不错的双向绑定，但是在 `Vue` 中要还需要处理的更加细致，比如 `Watcher` 中的 `exp`，它可能是一个函数，函数不需要特别处理，执行就可以了。也有可能是 `a.b.c` 这样的嵌套形式，我们必须得对这个字符串进行解析，将它的访问层级区分开来。`Vue` 的处理如下：

```javascript
export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
export function parsePath (path: string): any {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```

这个 `ParsePath` 就是用来处理 `exp` 的，在我上面写的例子中，我是直接访问 `this.data[exp]`，如果是有嵌套的对象这样肯定行不通。通过上面的函数。用 `.` 将嵌套的访问进行分割，然后沿着 `obj` 一层一层向下访问即可。添加了这个逻辑之后我们就可以访问嵌套的逻辑了。当然了我们的属性访问还可以通过 `[]` 运算符，如果使用了 `[]` 就必须要转换成 `.` 的访问形式。

`Vue` 还为 `Watcher` 和 `Dep` 实例添加了 `id` 和 `hash`，防止重复的订阅添加。以及在 `Observer` 的 `setter` 中对新添加的属性执行了 `observe`，应该是为了处理设置的属性是一个对象的情况。想要详细了解可以去看 `Vue` 的源码 [Vue Souce Code](https://github.com/vuejs/vue/tree/70f497e2e1651f78c5189a05144ed8b1659a1826/src/core/observer 'Vue Souce Code')。

`vue` 的双向绑定原理图（来自 [vue双向数据绑定原理图(简易) - zhangjinpei](https://segmentfault.com/a/1190000022600105 'vue双向数据绑定原理图(简易) - zhangjinpei')，可以帮助大家理解整个执行过程。

![binding2](./images/vue-two-ways-binding2.png 'binding2')

## Object.defineProperty 的局限

使用 `Object.defineProperty` 实现双向绑定大致就这些内容，但是 `Object.defineProperty` 有一些局限。比如我们是通过改写对象的属性，添加 `getter` 和 `setter` 实现属性监听的。如果我们是在对象已经用 `observe` 包装完成后再向其中添加属性，这些属性由于没有进行 `getter` 和 `setter` 的设置，自然是无法追踪的。而且 `Object.defineProperty` 也无法侦测到对象的删除。

总的来说 `Object.defineProperty` 只能通过将数据属性转换为访问器属性来实现数据变化的追踪，它只能监听数据的变化，而不是对对象进行监听，属性的增加删除它是不知道的。`Vue2` 的解决方式主要是通过 `vm.$set` 和 `vm.$delete` 解决的，这里不讨论。

`Object.defineProperty` 的另一个缺陷就是无法监听数组的变化，这里的不能监听主要是不能监听 `Array.prototype` 上的方法，数组元素的变化还是能监听的，比如一个数组 `[1,2,3]`，我们还是能通过 `arr.0` 监听数组元素的变化。但是像 `push`，`pop` 等方法就无能为了。因为这些方法不需要经过 `getter` 和 `setter`，而是数组原型上的方法。

虽然数组的元素是能够实现监听的，但是实际上 `vue2` 中并没有对数组的元素进行监听，即我们直接对数组元素修改是不会有任何响应式的行为，因为在 `JavaScript` 中数组的操作非常频繁，不像对象一样只有 `key-value` 的变化，如果对每一个元素都进行响应式的绑定在数组非常大并且操作非常频繁的的时候是很可能影响性能，所以 `vue2` 采取的是比较折中的方法，只是对数组的 `7` 中操作进行了监听：

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

主要的方法就是在 `Array` 实例和 `Array.prototype` 之间添加了一个拦截器，当我们访问这些方法的时候，实际上访问的是拦截器上的方法。依赖的收集和 `Object` 一样，都是在 `Observer` 中的 `getter` 中进行收集，在拦截器中触发依赖（这部分等以后有时间展开）

## Vue 3.0 的 Proxy 实现

关于 `Proxy` 的响应式，可以先看一个 `Proxy` 实现的调色器的例子：

<!-- <iframe width="100%" height="230px" style="border: none" src="https://cdn.clloz.com/study/reactive/palette"></iframe> -->

代码在 [调色盘 - Proxy](https://github.com/Clloz/clloz-vue/tree/dev/src/reactive/simplify '调色盘 - Proxy')，具体如何进行绑定的参考代码。

`Vue 3` 的源码阅读中，有时间补上。

## 参考文章

1. [面试官: 实现双向绑定Proxy比defineproperty优劣如何?](https://juejin.cn/post/6844903601416978439#heading-14 '面试官: 实现双向绑定Proxy比defineproperty优劣如何?')
2. 《深入浅出 vue.js》
3. [vue双向数据绑定原理图(简易)](https://segmentfault.com/a/1190000022600105 'vue双向数据绑定原理图(简易)')
4. [vue 的双向绑定原理及实现](https://juejin.cn/entry/6844903479044112391 'vue 的双向绑定原理及实现')
5. [Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/v2/prepare/ 'Vue.js 技术揭秘')
