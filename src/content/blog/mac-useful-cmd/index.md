---
title: '几个有用的 Mac 命令'
publishDate: '2020-08-30 12:00:00'
description: ''
tags:
  - assorted
  - 软件工具
language: '中文'
heroImage: {"src":"./macos.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

在 [Linux常用命令](https://www.clloz.com/programming/computer-science/operating-system/2020/08/18/linux-command/ "Linux常用命令") 中介绍了一些在 `Linux` 中的常用命令。虽然 `Mac OS X` 和 `Linux` 都是基于 `Unix` 的，但是有些系统命令并不是通用的，本文就介绍一些只有 `Mac` 上可以使用的比较有用的命令。

## pbcopy 和 pbpaste

原来我想复制一个文件中的内容，都是用 `cat` 命令打印出来然后复制，或者直接在软件中打开文件后再全选复制。在 `Mac` 中其实有命令可以直接实现这个功能，就是 `pbcopy` 和 `pbpaste`。这两个命令打通了终端和剪贴板。它们不仅可以复制文件，也可以结合其他命令进行使用。

```bash
#将主目录的文件列表复制到剪贴板
ls ~ | pbcopy

#将任意文件的内容复制到剪贴板
pbcopy < filename.txt
```

## mdfind

`mdfind` 是 `Mac` 上更强大的文件搜索命令，可以理解为命令行版的 `spotlight`。

```bash
#按文件名关键字查找文件：
mdfind -name keyword

#查找文件内容中包含关键字的文件
mdfind "key string"

#-onlyin 参数指定搜索范围
mdfind -onlyin ~/Library txt
```

## launchctl

`Mac` 上没有 `systemctl` 和 `services` 命令。管理服务的命令是 `launchctl`，我个人觉得不是很好用，如果你有使用 `homebrew` 也可以使用 `homebrew` 的 `services` 管理命令 `brew services`。

```bash
#加载一个服务到启动列表
sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist
#卸载一个服务
sudo launchctl unload  /System/Library/LaunchDaemons/ssh.plist
#查看服务
sudo launchctl list | grep <<Service Name>>
#停止
sudo launchctl stop <<Service Name>>
#开始
sudo launchctl start <<Service Name>>
#kill
sudo launchctl kill <<Service Name>> 
```

## say

`say` 命令使用 `VoiceOver` 给你朗读文本，比较特别的是你可以选择语言和发音（需要安装 `System Preferences -> Accessibility -> Speech`）。

## 参考文章

1. [8个不可不知的Mac OS X专用命令行工具](https://segmentfault.com/a/1190000000509514 "8个不可不知的Mac OS X专用命令行工具")