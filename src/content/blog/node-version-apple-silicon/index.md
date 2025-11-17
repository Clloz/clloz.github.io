---
title: 'm1 芯片的 node 版本问题'
publishDate: '2021-10-27 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './nodejs-logo.jpeg', 'color': '#B4C6DA' }
---

## 前言

昨天早上新的 `MBP` 到了，花了一天的时间差不多把开发环境部署的差不多了，今天开始把公司的项目拉下来跑了跑，结果还是遇到了一些问题，总结一下。

## node 版本

关于 `M1` 芯片的支持情况可以参考这个网站 [doesitarm](https://doesitarm.com/app/nodejs/ 'doesitarm')，从网站给出的 [Github issue](https://github.com/nodejs/TSC/issues/886 'Github issue') 和 [version support](https://github.com/ThatGuySam/doesitarm/issues/299#issuecomment-733210648 'version support')，我们可以知道 `v15.3.0` 之后都是原生支持 `M1` 的，之前的版本则需要通过 `Rosetta 2` 将 `x86` 指令翻译成 `ARM` 指令。

我是用的 `NVM` 来进行 `node` 的版本管理，`NVM` 的安装和之前并没有什么太大的差别。我第一个安装的版本是一个 `v15` 的版本，装了非常长的时间，并且 `CPU` 满负荷在运行，不过最后还是装好了。但是安装 `v16` 之后的版本就和原来非 `M1` 的安装差不多，非常迅速。根据 [Node.js 16 introduces Apple Silicon support](https://www.infoworld.com/article/3615673/nodejs-16-introduces-apple-silicon-support.html 'Node.js 16 introduces Apple Silicon support') 和上面的兼容性网站，我估计是 `v15` 的版本还是兼容性不太好的，`v16` 是第一个为 `M1` 提供预构建的二进制的版本。

我目前安装了三个版本： 1. 14.16.0：这是我之前一直使用的版本，原来的项目都是在这个版本下构建和运行的 2. 16.13.0：该版本是目前原生支持 `M1` 的版本中唯一的 `LTS` 版本 3. 17.0.1: 最新版本，我用 `brew` 安装 `yarn` 的时候 `brew` 还安装了一个最新版的 `node`，导致我的 `NVM` 版本切换无效了，之后我卸载了 `brew` 的，用 `NVM` 重装了一个

如果你原本使用的就是 `v16` 版本，那么就建议无缝切换到 `v16.13.0`。如果和我一样原来使用的是比较低的版本，就需要在 `Rosetta 2` 的终端中安装低版本 `node`。

## 安装低版本

参考 [install node under v15](https://github.com/nvm-sh/nvm/issues/2350#issuecomment-734132550 'install node under v15')，简单来说就是在终端执行 `arch -x86_64 zsh` 让当前终端运行在 `Rosetta 2` 下，然后就可以用 `nvm` 安装低版本 `node` 了，之后我们可以在非 `Rosetta 2` 的终端下任意切换和使用任意版本的 `nodejs`。

> 如果你使用 `homebrew` 安装了最新的 `zsh`，那么这个 `zsh` 的版本是 `zsh 5.8 (arm-apple-darwin21.1.0)`，而 `mac` 自带的 `zsh` 版本是 `zsh 5.8 (x86_64-apple-darwin21.1.0)`。这是如果我们执行 `arch x86_64 zsh` 会报错 `arch: posix_spawnp: zsh: Bad CPU type in executable`，因为我们的 `zsh` 此时已经是 `arm` 架构了，不能切换。如果是这种情况要安装老版本的 `nodejs` 就需要在启动 `iTerm` 或者 `terminal` 之前在 `get info`（⌘ + I）勾选上 `open using Rosetta`，之后启动终端就能正常安装老版本的 `node` 了。

## 高版本遇到的问题

我一开始不想安装低版本的需要 `Rosetta 2` 的 `node`， 但是在给几个项目安装依赖的时候发现出了很多问题，还是装了原来的 `14.16.0` 的版本。

## canvas 包安装不上

首先遇到的是 `canvas` 包装不上，最后在 `Google` 上找到的解决方案就是 `brew install pkg-config cairo pango libpng jpeg giflib librsvg`， 参考 [解决m1的mac 无法安装 canvas 包](https://jialidun.vip/2021/08/21/54.html '解决m1的mac 无法安装 canvas 包')

## node-sass 问题

接下来就是 `node-sass` 的问题，首先我们要明确自己的 `node` 版本和所需的 `node-sass` 的版本，参考 [node-sass - Github](https://github.com/sass/node-sass 'node-sass - Github')，这里我使用的是 `v16`，所以我需要的 `node-sass` 版本是 `6.0+`，但是 `6.0+` 的 `node-sass` 又需要 `11.0+` 的 `sass-loader`，而 `vue 2.6` 又不支持这么高版本的 `sass-loader`，这变成一个无解的问题了，所以最后我只能选择切换成一个低版本。

> 关于 `node-sass` 的讨论可以参考 [node-sass - issue](https://github.com/sass/node-sass/issues/3103 'node-sass - issue')

不过在我用 `v15` 版本的时候似乎 `npm i` 成功并且项目成功跑起来过，在我切换到 `v16` 安装好依赖 `npm run serve` 后一直提示 `Error: vue-loader requires @vue/compiler-sfc to be present in the dependency tree.`，目前我还没搞清楚什么问题。安装 `@vue/compiler-sfc` 能够把项目跑起来，不过 `package.json` 和 `package-lock.json` 都发生变化了。

## 总结

目前遇到的问题就这些，后面会持续更新遇到的问题和解决方法。
