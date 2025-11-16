---
title: '前端在线代码编辑器'
publishDate: '2020-08-17 12:00:00'
description: ''
tags:
  - front-end
language: '中文'
heroImage: {"src":"./front-end.jpeg","color":"#B4C6DA"}
---

\[toc\]

## 前言

在学习过程中有时候有一些小想法或者小测试想要验证的时候，觉得创建环境很麻烦的时候我们可以选择在线编辑器。在线编辑器使用方便，并且能够实时预览。我们不用创建文件，打开编辑器，直接在浏览器中就能验证自己的一些想法。特别是有些情况我们需要创建环境的时候在本地操作就更麻烦了，现在在线编辑器大部分都与时俱进功能很强大，可以直接设定环境，引入依赖，可以解决我们上面说的问题。本文比较一下几个常用的在线编辑器的差别。

## JSBin

`JSBin`: [http://jsbin.com/](http://jsbin.com/ "http://jsbin.com/")

## 基础功能

- 将代码集保存到 `GitHub Gist`
- 将代码集保存为模板
- 自动保存，可设置自动运行
- 可打开单独窗口运行代码集
- `⌃ S` 保存快照，相当于历史版本，通过 `Open bin...` 来选择
- 支持展示 `Console` 窗口
- `HTML` 支持 `Markdown`，`Jade`，并提供转换为 `HTML` 功能
- `CSS` 支持 `Less`，`Myth`，`Sass`，`SCSS`，`Stylus`，并提供转换为 `CSS` 功能
- `JS` 支持 `ES6 / Babel`，`JSX`，`CoffeeScript`，`Traceur`，`TypeScript`，`Processing`，`LiveScript`，`ClojureScript`，并提供转换为原生 `JavaScript` 功能
- `JS` 内置可选的常用框架与扩展
- 支持页面嵌入，可选择快照还是最新版本，可选择编辑视图或只有结果界面
- 支持键盘快捷键，支持部分 `Sublime` 快捷键

## 升级特性（付费）

- 上传本地资源
- 创建私有代码集
- 自定义嵌入样式
- 同步到 `Dropbox`
- 个性域名

## JSFiddle

`JSFiddle`：[https://jsfiddle.net/](https://jsfiddle.net/ "https://jsfiddle.net/")

> `JSFiddle` 国内访问需要代理。

## 基础功能

- 支持从预置模板生成代码集，快速开始
- 支持实时合作
- 支持页面嵌入，可设置黑白主题色或自定义颜色
- 每次保存都会产生历史版本
- `CSS` 支持 `SCSS`，`Sass`，`PostCSS`，样式重置可选择使用 `Normalize.css`
- `JS` 支持 `CoffeeScript`，`Babel JSX`，`TypeScript`，`Vue`，`React`，`Preact`
- `JS` 内置可选的常用框架与扩展，可定义加载时机，设置 `<script>` 标签属性 `attribute`
- 外链支持从 `CDNJS` 搜索名称来加入对应资源
- 支持模拟异步请求
- 可设置界面布局、代码提示（`beta`）、自动运行、自动保存、高亮匹配标签、快捷键映射方案（`Sublime、vim、Emacs`）

## 高级特性（付费）

- 分组管理你的内容
- 建立私有 `fiddle` 和 `group`
- `console` 调试
- 无广告

## CodePen

`CodePen`：[https://codepen.io/](https://codepen.io/ "https://codepen.io/")

## 基础功能

- 支持用 `markdown` 语法创建文章，文章可嵌入代码集
- 免费用户可创建 `1` 个项目，包含 `10` 个文件
- 支持创建专辑
- 将代码集保存为模板
- 将代码集保存到 `GitHub Gist`
- 将代码集导出到 `zip` 包
- 可打开单独窗口运行代码
- 提供一些开箱即用的样式资源
- 可对代码集进行 评论
- 可设置自动保存、自动运行
- 支持页面嵌入，可设置黑白主题色、点击后加载，升级付费用户后可设置代码可编辑
- 保存不产生历史版本，每次访问都是最新代码
- `HTML` 支持 `Haml`，`Markdown`，`Slim`，`Pug`
- `CSS` 支持 `Less`，`PostCSS`，`Sass`，`SCSS`，`Stylus`，样式重置可选择使用 `Normalize.css`，`Reset.css`，前缀生成可选择 `Autoprefixer`，`Prefixfree`
- `JS` 支持 `Babel`，`TypeScript`，`CoffeeScript`，`LiveScript`
- 支持键盘快捷键

## 高级特性（付费）

- 创建私有代码集
- 自定义嵌入主题样式
- 更多项目更多文件
- 项目可部署
- 合作模式
- 专家模式
- 资源文件托管

## CodeSandbox

`CodeSandbox`：[https://codesandbox.io/](https://codesandbox.io/ "https://codesandbox.io/")

`CodeSandbox` 可以说是一个真正的在线 `IDE`，使用感觉就和 `IDE` 没有区别，提供多种环境选择，可配置首选项，`与GitHub`、`ZEIT集成`，以项目为单位，免费用户可创建50个项目，也可以分享，部署项目。如果你只是要写一个简单的页面或者 `JavaScript` 调试一下没有必要使用它。由于它就是一个 `IDE`，这里只介绍以下代码分享相关的一些功能。

## 基础特性

- 支持从预置模板生成项目，快速开始
- 支持添加 `npm` 依赖包
- 支持上传文件
- 支持编写配置文件 `package.json`，`.babelrc`，`.prettierrc`，`sandbox.config.json`
- 支持实时合作
- 将项目导出到 `zip` 包
- 可打开单独窗口运行代码
- 支持项目分享
- 保存不产生历史版本，每次访问都是最新代码

## 高级特性（付费）

- 创建私有代码集
- `github` 私有仓库

## 总结

如果只是写一些简单的 `demo` 那么前面三者我觉得都可以，根据自己的喜好来选择，我个人比较喜欢 `CodePen` 和 `JSFiddle`。如果你是需要比较复杂的环境配置，那么 `CodeSandbox` 是最好的选择，它几乎就是一个 `IDE`。

> 功能介绍可能有误，以官网的信息为准。

## 参考文章

1. [支持分享的前端在线代码编辑器(JSFiddle、JS Bin、codepen、codesandbox)](https://github.com/kiinlam/blog/issues/10 "支持分享的前端在线代码编辑器(JSFiddle、JS Bin、codepen、codesandbox)")