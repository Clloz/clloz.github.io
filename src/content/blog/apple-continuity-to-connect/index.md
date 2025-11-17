---
title: 'mac和iphone之间传输文件'
publishDate: '2019-11-11 12:00:00'
description: ''
tags:
  - hardware
  - 实用技巧
  - 硬件设备
language: '中文'
heroImage: { 'src': './macos.jpg', 'color': '#B4C6DA' }
---

## 前言

以前我在 `mac` 和 `iphone` 之间传输文件都是用 `icloud`，如果是一些链接我则是通过微信的文件传输助手。不过这两天研究了一下 `apple` 产品的文件传输功能，在官方的文档中找到了很多原来不知道的功能，本文整理和总结一下比较实用的交互方法。

> 本文主要介绍使用方法，具体的版本要求和使用条件请参阅下方的 `apple` 官方文档。

## Handoff 接力

接力的意思就是对支持接力的 `apple` 应用或者第三方应用可以跨设备继承之前的应用状态，比如你正在手机上用 `Chrome` 浏览一个网页，这个网页的移动端支持不是很好，这时候可以在 `mac` 的 `dock` 栏直接看到一个如下图的图标，点击以后会直接打开你当前正在手机上浏览的网页。

![connect1](./images/continuity-to-connect1.png 'connect1')

同样，在 `mac` 上使用的应用只要支持 `handoff` 同样可以在手机上打开。见下图中的红框，点击最下方的横条，就可以打开当前在 `mac` 上浏览的网页，不过奇怪的是我在 `mac` 上是使用 `Chrome` 浏览的，在 `iphone` 上却是用 `Safari` 打开。

![connect2](./images/continuity-to-connect2.jpeg 'connect2')

## 通用剪贴板

只要你在设备上开启了 `Handoff`（开启方式看参考文档中的链接），那么通用剪贴板功能自动就开启了，这个功能我觉的是非常有用的，借助通用剪贴板，可以在一台 `Apple` 设备上拷贝文本、图像、照片和视频等内容，然后在另一台 `Apple` 设备上粘贴该内容。

原来我要发送链接的时候都是通过微信上的文件传输助手，但其实只要 `mac` 和 `iphone` 上的接力功能都开启（也可以是其他 `apple` 设备，比如 `ipad` 和 `touch`），然后两台设备都打开蓝牙，在同一个 `wifi` 下，我们就能够像在同一个设备上一样使用剪贴板，比如我在 `iphone` 的浏览器里面复制了一个网页的链接，或者在微信里面复制了一段话， 这时候我在 `mac` 上直接使用 `⌘ + v` 就会粘贴上我们在 `iphone` 上复制的内容。而且这个内容不限于文本，图片和其他类型的文件都可以，不过经过我的测试，照片里的图片复制后是不能粘贴的，必须是在 `文件` 应用中复制的文件才能够直接粘贴，不管是图片或者音频。

## 用 mac 接听和拨打电话

这个功能我一直都在使用，具体的使用条件查阅[在 Mac、iPad 或 iPod touch 上拨打和接听电话](https://support.apple.com/zh-cn/HT209456 '在 Mac、iPad 或 iPod touch 上拨打和接听电话')。

> 利用 `mac` 收发短信的方式也和电话类似。智能热点的使用方法也类似。

## 连续互通相机

在 `mac` 上可以直接开启 `iphone` 或者 `ipad` 的相机，并且直接将拍摄的照片传到指定的位置或应用，也可以用相机扫描文稿，然后传递到指定的位置或应用。

使用方法就是在指定的应用需要插入图片或扫描文稿的地方右键，然后选择 `import from iphone`，然后选择 `take photo` 或者 `scan documents`，在一些第三方应用（比如 `outlook`）没有 `import from iphone` 而是菜单栏直接显示 `take photo` 和 `scan documents` 选项，选中之后会打开 `iphone` 或 `ipad` 上的相机，然后拍摄或者扫描，最后保存即可。`apple` 自带应用支持连续互通相机的有：

- 访达
- Keynote 讲演 8.2 或更高版本
- 邮件
- 信息
- 备忘录
- Numbers 表格 5.2 或更高版本
- Pages 文稿 7.2 或更高版本
- 文本编辑

第三方应用是否支持可以实际进行测试。

## 速绘和标记

借助速绘连续互通和标记连续互通功能，您可以使用 `iPad`、`iPhone` 或 `iPod touch` 将速绘轻松插入 `Mac` 文稿中，或在 `Mac` 上对 `PDF` 和图像进行实时标记。

在支持的应用中右键选择 `import from iphone`，然后选择 `add sketch` 就会在你的 `iphone` 或者 `ipad` 上打开速绘页面，绘制好后点击完成，这个速绘的内容就会添加到 `mac` 上对应的应用中。

借助标记连续互通，还可以使用 `Mac` 请求从 `iPad`、`iPhone` 或 `iPod touch` 来标记文稿。在设备上添加标记时，您会在 `Mac` 上实时看到这一过程。这是签署文稿、改考卷或圈出重要详情的绝佳方式。

使用方法就是找到要标记的图片或 `pdf`，然后按下空格键以打开预览窗口。点按窗口顶部的标记按钮 。 然后从预览窗口顶部的标记工具栏中，点按注解按钮。此时`iphone` 或 `ipad` 上将打开标记窗口。然后我们就可以利用 `Apple Pencil` 或手指与速绘工具搭配使用，或点按加号 并使用标记工具添加文本、签名、放大镜或形状和箭头。

![connect3](./images/continuity-to-connect3.png 'connect3')

## 隔空投送 Airdrop

在 `mac` 上有一个 `airdrop` 文件夹，在 `iphone` 的文件共享选项中第一个就是 `airdrop` 的图标，当我们的设备靠近时就能够在 `airdrop` 中发现其他设备从而进行文件的互传。

## 在 iPhone 和电脑之间传输文件

`Catalina` 已经取消了 `itunes`，现在 `iphone` 直接显示在 `finder` 测侧边栏中，我们要在电脑和 `iphone` 间传输文件，可以选择用 `usb连接`，也可以选择通过无线局域网同步，后者显然更方便，只要在 `finder` 的 `iphone` 中钩上如下选项即可。然后我们就可以在上方的 `file` 选项中进行文件的传输。

![connect4](./images/continuity-to-connect4.png 'connect4')

## 参考文章

1. [使用“连续互通”连接 Mac、iPhone、iPad、iPod touch 和 Apple Watch](https://support.apple.com/zh-cn/HT204681 '使用“连续互通”连接 Mac、iPhone、iPad、iPod touch 和 Apple Watch')
2. [在 iPhone 和电脑之间传输文件](https://support.apple.com/zh-cn/guide/iphone/iphf2d851b9/ios '在 iPhone 和电脑之间传输文件')
3. [将 iPhone 与电脑同步](https://support.apple.com/zh-cn/guide/iphone/iph875319a3a/13.0/ios/13.0#ipha85600a9b '将 iPhone 与电脑同步')
