---
title: 'Vue 2.0 源码分析（一）'
publishDate: '2022-03-01 12:00:00'
description: ''
tags:
  - 未分类
language: '中文'
---

## 前言

`Vue` 作为在国内最热门的前端框架，网上的教程一堆，也有不少写的不错的，比如以前看的 《深入浅出 Vue.js》就讲的不错。不过和大部分上网浏览的知识一样，好讲的东西基本大家都讲到了，不好讲的或一些细节大家就都没讲到。而且大部分文章或源码解析都是将 `Vue` 中的几个比较重要的模块单独来讲了一下，比如数据响应式原理，虚拟 `DOM`，大家都能说上两句，但除了这些“通俗”的内容，其他的基本都没讲，看完这些教程你就知道了 `Vue` 中的一些模块，整个 `Vue` 是怎么工作的还是不清楚。我想写一个系列文章结合实际的例子讲清楚 `Vue` 的整个执行过程。

> **本文所使用的是 Vue2.0 的最新版本 2.6.14，我将 `Vue 2.6.14` 的代码 `fork` 了一份，在其中对核心代码进行详细的注释，地址是 [Vue 核心代码注释](https://github.com/Clloz/vue)。**

## 目录结构分析

~~~bash
```
├── benchmarks 一些特殊复杂场景的跑分 demo 比如大数据量表格或者大量元素的 svg 的渲染
├── dist rollup 的输出目录，不同环境的 vue 文件
├── examples 例子
├── flow     flow 的类型声明文件
├── packages 
├── scripts 脚本，对应 package.json 的 scripts
├── src
│   ├── compiler 模版编译相关
│   │   ├── codeframe.js
│   │   ├── codegen
│   │   ├── create-compiler.js
│   │   ├── directives
│   │   ├── error-detector.js
│   │   ├── helpers.js
│   │   ├── index.js
│   │   ├── optimizer.js
│   │   ├── parser
│   │   └── to-function.js
│   ├── core
│   │   ├── components 组件相关
│   │   ├── config.js 
│   │   ├── global-api 全局 API
│   │   ├── index.js
│   │   ├── instance 实例化
│   │   ├── observer 数据响应式
│   │   ├── util 工具方法
│   │   └── vdom 虚拟 dom
│   ├── platforms
│   │   ├── web
│   │   └── weex
│   ├── server
│   │   ├── bundle-renderer
│   │   ├── create-basic-renderer.js
│   │   ├── create-renderer.js
│   │   ├── optimizing-compiler
│   │   ├── render-context.js
│   │   ├── render-stream.js
│   │   ├── render.js
│   │   ├── template-renderer
│   │   ├── util.js
│   │   ├── webpack-plugin
│   │   └── write.js
│   ├── sfc
│   │   └── parser.js
│   └── shared
│       ├── constants.js
│       └── util.js
├── test
└── types
```
~~~

## 如何阅读源码

源码阅读肯定不能从上到下一个一个看，我的目的是了解 `Vue` 是如何工作的，`Vue` 说到底也就是一个大函数对象，我其实就是想搞清楚这个函数上有哪些属性，我们 `new Vue` 的时候函数内部执行了些什么。

那么怎么找到这个函数呢？刚开始看源码的时候我们就会开始迷茫，入口在哪里？因为 `Vue` 的这些源码最后会用 `rollup` 打包成一个文件（根据不同的环境会打包出很多文件，在 `dist` 目录中）。我们可以通过 `package.json` 中的脚本来找到入口文件，比如第一个脚本是 `"dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev"` ，虽然我们不懂 `rollup`，但是根据 `webpack` 的使用经验也能估计出来这行脚本的意思就是用 `scripts` 目录下的 `config.js` 文件作为配置文件执行 `rollup`。后面有个 `TARGET:web-full-dev` 我们到配置文件中一搜就有了下面这段：

```javascript
// Runtime+compiler development build (Browser)
'web-full-dev': {
  entry: resolve('web/entry-runtime-with-compiler.js'),
  dest: resolve('dist/vue.js'),
  format: 'umd',
  env: 'development',
  alias: { he: './entity-decoder' },
  banner
},
```

我们可以看到在配置文件的 `build` 对象中有很多配置，对应的就是 `TARGET`，这里的配置就是 `vue` 根据不同环境编写的，由于我们是阅读源码肯定是从 `dev` 来看，配置文件中的 `entry` 字段告诉了我们入口文件在 `web/entry-runtime-with-compiler.js`。

这里有一点需要提醒，我们在 `IDE` 可能会发现 `Vue` 源码中有些 `import` 的文件路径无法跳转，这是因为这些路径都是写给 `rollup` 的路径，在 `rollup` 的配置文件中有 `alias` 的配置

```javascript
const resolve = p => path.resolve(__dirname, '../', p)

module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  sfc: resolve('src/sfc')
}

const aliases = require('./alias')
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}
```

目前我没找到在 `webstorm` 或者 `VS Code` 里面解析 `rollup alias` 的方法，`webstorm` 中可以写个 `webpack` 的配置文件来达到这个目的，不过文件的解构不复杂，这点小问题也不影响我们分析。

## 找到 Vue 构造函数

我们回到上面的入口文件，在入口文件中我们能够看到有一个 `import Vue from './runtime/index'`，我们去 `src/platforms/web/runtime/index.js` 中发现第一行就是 `import Vue from 'core/index'`，`core` 和 `compiler` 两个文件夹是源码中最核心的。在 `src/core/index.js` 还是没有找到 `Vue` 构造函数，这次又是从 `src/core/instance/index.js` 中 `import` 的，不过在 `src/core/instance/index.js` 中我们最终找到了 `function Vue` 也就是 `Vue` 的构造函数。

我们梳理一下我们从入口文件到最终找到的 `Vue` 构造函数所造的文件一共有四个文件，我们来扫一扫这几个文件都做了什么，不用特别仔细。

`src/platforms/web/entry-runtime-with-compiler.js` 文件中主要就是编写了一个 `Vue.prototype.$mount` 方法，这里有个小细节我们在之后阅读源码的时候要注意的就是 `const mount = Vue.prototype.$mount` 这行代码。

`src/platforms/web/runtime/index.js` 文件中我们发现它也定义了 `Vue.prototype.$mount` 方法，看上去似乎是重复定义了，这里就可以看出上面说道的那行代码的作用了，由于这个文件是被 `entry-runtime-with-compiler.js` 引入的，所以先执行，这个文件中定义的 `Vue.prototype.$mount` 方法最后会被重新赋值到一个 `mount` 变量中。至于为什么要这么做，以及每个函数是做什么的我们后面再分析。该文件还定义了一些 `Vue.config` 的属性和 `Vue.prototype.__patch__`。

`src/core/index.js` 中最重要的就是 `initGlobalAPI` 方法的调用，从这个方法的名字我们就能知道它是初始化全局 `API` 的。同时还定义了四个属性，`Vue.prototype.$isServer`，`Vue.prototype.$ssrContext`，`Vue.functionalRenderContext` 和 `Vue.version`。

到了 `src/core/instance/index.js` 中就是我们实际的 `Vue` 构造函数了，我们看到最初的构造函数十分简单，就调用了一个 `_init` 方法，然后执行了一堆初始化的函数，这些函数也就是在我们的这个简单的 `Vue` 构造函数以及其 `prototype` 上增加属性和方法，来提供 `Vue` 的一些列功能。

## 如何对源码进行开发

光是看代码肯定不行，我们还需要对源码进行调整和测试来验证我们的想法，我们已经知道 `Vue` 是使用 `rollup` 进行打包的了，并且 `package.json` 中也写好了对应的打包代码了，所以我们完全可以复制一套自己的配置来进行开发。

`Vue` 打包的目标文件夹是 `dist`，于是我就创建了一个 `my-dist` 文件夹作为我们的输出文件夹。`rollup` 的配置文件主要是 `scripts/build.js` 和 `scripts/config.js` 这两个，我们将这两个文件也复制出两个 `my-build.js` 和 `my-config.js`，将配置分别复制到这两个文件夹中，并且将 `dist` 全部改成 `my-dist`。最后就是配置 `package.json` 中的 `scripts`，增加一条 `"mydev": "rollup -w -c scripts/my-config.js --environment TARGET:web-full-dev"`，这样我们执行 `npm run mydev` 就会在 `my-dist` 文件夹下生成开发版本的 `vue.js`，并且这个文件是热更新的，我们可以随时更改文件而不用重新打包。

最后我创建一个 `demo` 文件夹在其中创建一个 `index.html` 其中引入 `../my-dist/vue.js` 就可以开始进行调试了。

当然调试少不了要打断点，如果我们直接使用打包后的 `vue.js` 虽然也能调试，但是是一整个文件，无法看到原来的目录结构，我们需要 `sourcemap`，我们在 `rollup ` 的命令中加上 `--sourcemap` 参数即可。

> 注意 `scripts/config.js` 中有非常多的配置，我们使用的是 `web-full-dev` 包含完整的警告和调试模式。

## 总结

本文我分析了如何阅读 `Vue` 源码的一些经验以及找到了 `Vue` 的构造函数，其实最终我们使用的那个 `Vue` 也就是围绕这这个简单的 `Vue` 函数，其实例和其 `prototype` 提供的一系列方法和属性，把这几个文件在做了什么搞清楚我们也就知道 `Vue` 是如何工作的了。

按照 `import` 的文件先执行，我们就从最内部的 `src/core/instance/index.js` 开始分析，下一篇文章见。