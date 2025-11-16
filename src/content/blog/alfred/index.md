---
title: 'Alfred入门'
publishDate: '2020-08-28 12:00:00'
description: ''
tags:
  - assorted
  - 软件工具
language: '中文'
heroImage: {"src":"./alfred.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

`Mac` 系统本身提供了 `spotlight` 来供用户查询应用、文稿及其他文件等信息，但是我个人觉得不是很好用，一直都没怎么用过。`Alfred` 以前也听说过，但是没有详细了解，我一直也为很鸡肋。不过今天仔细研究了一下感觉确实是一个能提高 `Mac` 使用效率的工具。本文讲一下该软件的一些基础用法。

## 购买安装

软件有两个版本，`single license` 和 `mega supporter`，前者可以在两台设备上上使用当前版本（即小版本可以更新，大版本不能更新，你买的 `4.x` 版本就不能更新到 `5.x`），后者就是在以太设备上永久更新。现在绝大多数买断制的软件都是这种模式。价格分别是 `29£` 和 `49£`，真的是有点贵，我是在淘宝上买的那种授权版。

也可以使用免费版，那样的话你只能进行基础的文件查找。

## 功能

`Alfred` 提供了非常丰富的功能，所有功能的调用方式都是以命令的形式，和终端的感觉类似，只不过它能在任何环境下直接启动，比较方便。

## 基础设置

基础设置中主要就是设置开机启动和调用快捷键。我的快捷键设置为双击 ⌘ 启动 `Alfred`。

在默认的查找结果中（即没有给出任何执行的情况下），可以选择哪些文件类型或文件夹需要被检索。这里我就添加了两个文件夹到 `Search Scope` 中，一个是 `~` 文件夹，一个是我的 `SD` 卡的对应的 `Volume`。如果你查找某个文件夹没有找到，那么可以检查一下是否对应的文件夹不在软件的检索范围。

如果没有检查到任何结果，默认情况下会显示三个查询选项：在谷歌，亚马逊，维基中查找。

查询出的选项除了可以用 ⌘ 加上数字进行选择。

## 文件查找

文件查找分为两个部分，一个是基础的 `file search`；另一个是 `action`，即对查找到的文件夹进行一些操作。

`file search` 的部分主要有四个指令 `open`，`find`，`in` 和 `tags`。`open` 和 `find` 都非常简单，`in` 是用来查询文本内容是否包含某一串字符；`tags` 则是查询文件夹标记的（估计大部分人很少使用，除了默认的几个颜色标记还可以在 `Finder` 的 `Preferences` 中添加），比如你有一个 `tags` 是 `工作`，那么你用 `tags 工作` 就能找到打了这个 `tag` 的文件夹。

文件查询也支持导航，你可以用左右方向键进入或退出文件夹，`previous` 执行可以打开上次打开的文件夹的父文件夹。

`action` 则是和文件相关的一系列操作，我们用 `find` 指令找到对应文件夹选项后，点击 ⌃ （可以自己录制快捷键）就可以打开操作面板，选择你想要的操作。操作包括在 `finder` 中查看，复制文件，复制路径等。

## Web Search 和 Web Bookmarks

这两个功能就比较简单，`Web Search` 就是提供了一些常用网站的查询链接，直接可以输入关键词加查询内容直接在浏览器中打开查询页面，只是一个简化操作而已。软件自己提供了常用的一些网站，你也可以根据自己的需求添加，

`Web Bookmarks` 也很好理解，就是检索内容包括了浏览器的书签（只支持 `safari` 和 `chrome`），也就是你只要保存了一个书签，直接调出 `Alfred` 的查询框就可以进行模糊查询，这一功能还是非常方便的。

## 剪切板历史

这个功能也是比较好用的，它能够记录我们进行剪切复制操作的历史，包括了文本，图片和文件。只要输入关键词 `clipboard` 就能够进行查询（也可以录制快捷键）。

## 计算器和字典

这两个功能都不用说太多，比较简单也很好用。`Mac` 自带的字典不是很好用，也没有发音，建议使用下面插件部分介绍的有道词典。

## snippets

这个功能可以称为模板，有时候我们需要在一些地方填写自己的地址邮件等比较长的文本，我们可以预先在软件中写好模板，然后只要在任意文本框内输入指令就会直接转化成我们模版中的内容。比如你的地址用关键词 `\\address` 为名字记录成模版，然后在任意文本框中输入 `\\address` 会自动替换为你的地址。

## 系统指令

`Alfred` 还提供了丰富的 `Mac` 系统功能对应的指令，比如锁屏，重启，关机，清空回收站，音量调节，强制关闭等等。

## 终端

`Alfred` 也支持直接执行终端命令，指令为 `<`，默认调用的终端是 `terminal`。如果你跟我一样使用的是 `iTerm`，那么你就参考 [更换默认终端为iTerm2](https://github.com/vitorgalvao/custom-alfred-iterm-scripts "更换默认终端为iTerm2") 进行更换。不过根据我的实际使用情况，这个功能比较鸡肋，因为每次都还是在终端打开一个新的 `tab`，然后执行指令，不是很好用。

## 插件

目前没有一个专门管理插件的网站，如果你想寻找插件，可以到[官网](https://www.alfredapp.com/workflows/ "官网")以及[官方论坛](https://www.alfredforum.com/ "官方论坛")。其他的只能借助搜索引擎查询或者按照自己的需求写一个。下面放一下我尝试的插件的链接。

1. [颜色格式转换](http://www.packal.org/workflow/colors "颜色格式转换")
2. [Reddit浏览工具](https://github.com/deanishe/alfred-reddit "Reddit浏览工具")
3. [StackOverFlow问题查询工具](https://github.com/deanishe/alfred-stackexchange "StackOverFlow问题查询工具")
4. [搜索工具（支持谷歌，百度，知乎，微博等）](https://github.com/zqzten/alfred-web-search-suggest "搜索工具（支持谷歌，百度，知乎，微博等）")
5. [豆瓣书籍电影查询工具](https://github.com/h3l/douban-workflow "豆瓣书籍电影查询工具")
6. [github工具](https://github.com/gharlan/alfred-github-workflow "github工具")
7. [awesome-workflow](https://github.com/derimagia/awesome-alfred-workflows "awesome-workflow")
8. [有道翻译](https://github.com/wensonsmith/YoudaoTranslate "有道翻译")
9. [html字符实体查询](https://github.com/ajgon/alfred2-html-entity-lookup "html字符实体查询")
10. [font awesome 图标查询](https://github.com/ruedap/alfred-font-awesome-workflow "font awesome 图表查询")
11. [包查询](https://github.com/willfarrell/alfred-pkgman-workflow "包查询")
12. [对字符进行多种形式的编码解码](https://github.com/willfarrell/alfred-encode-decode-workflow "对字符进行多种形式的编码解码")
13. [ip信息查询](https://raw.githubusercontent.com/willfarrell/alfred-workflows/master/IPAddress.alfredworkflow "ip信息查询")
14. [强制结束进程](https://github.com/ngreenstein/alfred-process-killer "强制结束进程")
15. `Dash API` 查询集成，由 `Dash` 软件提供。

其实插件功能就类似于 `Mac` 的 `automator`，不过它提供了更多更人性化的支持。关于自己写 `workflow` 我还在研究，，给几篇文章大家参考一下。

1. [Alfred 3 天气预报workflow](https://zhuanlan.zhihu.com/p/66514693 "Alfred 3 天气预报workflow")
2. [如何去写一个第三方的workflow](https://allenwu.itscoder.com/how-to-write-a-workflow-for-mac "如何去写一个第三方的workflow")
3. [用NodeJS把玩一番workflow](https://juejin.im/post/6844903490406318093 "用NodeJS把玩一番workflow")

把自己日常的工作流形成 `workflow`，能够极大的提高我们在 `Mac` 上的使用效率，这也是 `Alfred` 最强大的功能，不过需要一点学习成本。

## 参考文章

1. [Alfred神器使用手册](https://louiszhai.github.io/2018/05/31/alfred/#alfred-workflow "Alfred神器使用手册")
2. [Alfred打磨之路](https://1991421.cn/2019/04/06/b908e228/ "Alfred打磨之路")