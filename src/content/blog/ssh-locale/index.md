---
title: 'ssh登陆服务器locale警告'
publishDate: '2019-04-09 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
---

## 前言

`Mac` 上 `ssh` 登陆服务器一直有一个 `warning: setlocale: LC_CTYPE: cannot change locale (en_US.UTF-8): No such file or directory.` 警告，看着很不舒服，来解决一下。

## 解决方法

在 `/etc/etc/environment` 中加入如下内容：

```bash
LANG=en_US.utf-8
LC_ALL=en_US.utf-8
```

## 参考文章

[CentOS 下解决ssh登录 locale 警告](https://segmentfault.com/a/1190000004378075 'CentOS 下解决ssh登录 locale 警告')
