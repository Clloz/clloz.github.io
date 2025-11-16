---
title: '终端不区分大小写'
publishDate: '2019-06-10 12:00:00'
description: ''
tags:
  - assorted
  - 奇技淫巧
language: '中文'
heroImage: {"src":"./terminal.png","color":"#B4C6DA"}
---

\[toc\]

## 前言

在使用 `Linux` 或者 `Mac` 的时候，有时候会遇到路径需要区分大小写并且 `tab` 不能自动补全的情况，非常不方便。其实只要稍微配置一下即可。

## 配置方法

在用户目录 `~` 中新建 `.inputrc` 文件输入如下内容：

```bash
set completion-ignore-case on
set show-all-if-ambiguous on
TAB: menu-complete
```

> 在 `mac` 中该文件可能需要 `sudo` 才能又权限编辑。