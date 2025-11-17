---
title: 'Mac无法写入文件到/usr'
publishDate: '2019-04-09 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
heroImage: { 'src': './automator.png', 'color': '#B4C6DA' }
---

## 前言

今天在 `Mac` 上安装 `php` 的环境，在安装 `Xdebug` 的时候，复制文件到 `/usr/local` 的时候，一直提示我 `permission denied`，去手动创建文件夹也不行，到 `google` 上看了一下才了解了 `System Integrity Protection`。

## System Integrity Protection

`Mac OS X` 从 `10.11` 以上开始默认开启 `SIP`（ `System Integrity Protection` ，系统完整性保护），即使是 `root` 用户也没有权限修改 `/System /bin /usr /sbin`，但是安装一些程序的时候我们不得不在这些文件夹中写入内容，解决的方法是关闭 `SIP`，关闭方法如下： 1. 重启 `Mac`，按住 `Command + R`，进入 `recovery` 模式;（不要等 `apple` 图标亮了再按） 2. 选择打开 `Utilities` 下的终端; 3. 输入 `csrutil disable` 并回车; 4. 最后重启 `Mac` 即可。

我在修改了这个属性之后，还是不能写入，这时候修改一下文件夹的权限：`sudo chown -R $(whoami) /usr/local`就可以了。 如果安装完软件之后你想重新打开 `SIP`，按上面的1，2步骤重新进入安全模式，然后在terminal里面输入 `csrutil enable`，在重启电脑就可以了，不过我重启了两次才说生效。

## 总结

我想 `apple` 设计这个功能肯定是又目的的，如果是开发人员，经常需要在这几个文件夹内操作，一直开着也无妨，如果不是就开着把。

## 参考文章

[How to Disable System Integrity Protection on a Mac (and Why You Shouldn’t)](https://www.howtogeek.com/230424/how-to-disable-system-integrity-protection-on-a-mac-and-why-you-shouldnt/ 'How to Disable System Integrity Protection on a Mac (and Why You Shouldn’t)') [Mac 更改/usr/bin 目录权限失败](https://segmentfault.com/q/1010000003095378?_ea=301917 'Mac 更改/usr/bin 目录权限失败')
