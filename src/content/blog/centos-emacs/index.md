---
title: 'CentOS安装emacs'
publishDate: '2018-09-02 12:00:00'
description: ''
tags:
  - emacs-vim
  - 实用技巧
language: '中文'
heroImage: {"src":"./emacs-logo.png","color":"#B4C6DA"}
---

\[toc\]

## 前言

因为自己用 `emacs` 已经习惯了，虽然 `vim` 用起来也不错而且比 `emacs` 方便，但是还是想在服务器上安装一下 `emacs` 方便要在上面修改代码的时候使用，本来以为自己也算个老司机了，在 `windows` 和 `mac` 上都已经受过 `emacs` 的洗礼，没想到在 `CentOS` 里面还是遇到了很多问题，在这里总结一下，方便下次查看。

## 安装步骤

可以参考官方的安装说明：[How do I install Emacs?](https://www.gnu.org/software/emacs/manual/html_node/efaq/Installing-Emacs.html "How do I install Emacs?")

`Linux` 上的大部分软件安装都是 `wget` ，`tar`，`./configure`，`make`，`make check`，`make install`，配置环境变量，按部就班来就行了。

## 依赖关系

在 `./configure` 的时候，第一个出现的问题是提示没有 `gnutls`，去 `google` 一下，`gnutls` 还需要另外三个依赖，`nettle`，`libasn1`，`gmp`，详见[gnutls安装](http://amon.org/gnutls-3-5-11 "gnutls安装")，因为我对 `linux` 环境变量的配置不太熟悉，这个地方卡了好久，终于装好之后，又来了一边`./configure` ,还是缺少各种各样的依赖，我放上在网上找的需要安装的依赖`sudo yum -y install libXpm-devel libjpeg-turbo-devel openjpeg-devel openjpeg2-devel turbojpeg-devel giflib-devel libtiff-devel gnutls-devel libxml2-devel GConf2-devel dbus-devel wxGTK-devel gtk3-devel libselinux-devel gpm-devel librsvg2-devel ImageMagick-devel`，安装好这些以后，`emacs` 终于安装上了，因为没有图形界面，不需要像在 `mac` 终端一样用 `emacs -nw` 启动了，直接 `emacs` 启动就可以了。

## alt 键无效

熟悉 `emacs` 的朋友都知道，`emacs` 的 `ctrl` 和 `alt` 都非常重要，是用来输入指令的，但是我安装完以后发现 `alt` 键无法使用，经过一番搜索，终于找到了解决方法，我用的 `xshell` 连接的阿里云，在 `xshell` 的属性里面有个键盘的选项，把 `将左alt键用作meta键` 选项勾上以后就可以使用 `M-x` 指令了。其实在 `emacs` 文档里面有写，`M-x`, `it means "press Alt/Esc/Option/Edit key and x together"`.在 `Linux` 下用 `esc+x` 是可以调用 `M-x` 的，不过我觉得 `esc+x` 还是没 `alt` 方便，建议大家还是设置一下 `alt` 键吧。

## 退格键变为 C-h

我在调试 `spacemacs` 的时候，发现在 `emacs` 里只要按退格键 `backspace` ，就会自动调用 `C-h` 帮助指令，百思不得其解，`google` 以后，在 `emacs` 的文档里找到这个问题的答案，[DEL-Does-Not-Delete - Emacs Manual](https://www.gnu.org/software/emacs/manual/html_node/emacs/DEL-Does-Not-Delete.html "DEL-Does-Not-Delete - Emacs Manual")，我在 `init.el` 里加上了 `(normal-erase-is-backspace-mode 1)`以后，退格键就可以使用了，至此，`emacs` 已经算基本可以使用了，如果是在服务器上使用我觉得这样就可以了，因为毕竟在服务器上使用的时候比较少，一般也是小改改代码什么的，没必要再花精力配置 `emacs` 了。不过我还是作死搞了一下 `spacemacs`。

## 设置环境变量

`Linux` 的环境变量有很多修改方式，我是将 `bin` 文件夹的位置放到了 `/etc/profile`中，然后 `source` 一下，这样就永久加入环境变量中，重启后依然能用 `emacs` 指令启动 `emacs` 。 注意 `bash` 中 `ctrl+s` 是锁屏，用 `ctrl+q` 解开。

> 安装的详细过程参考[这篇文章](https://blog.csdn.net/benzun_yinzi/article/details/80830410 "这篇文章")。