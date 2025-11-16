---
title: 'enca查看修改文件charset'
publishDate: '2020-08-09 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
---

\[toc\]

## 前言

`Mac` 的默认文本编辑器 `TextEdit` 不能查看和修改编码格式的，有时候打开一些 `GB2312` 的中文文本会有乱码。虽然 `vscode` 可以修改，但是比较麻烦。这里介绍一个可以查看、修改 `charset` 的工具 `enca`。

## 安装和使用

> 完整的使用教程查看[官方文档](https://linux.die.net/man/1/enca#:~:text=Charset%20is%20a%20set%20of,(bits)%20constituting%20the%20file. "官方文档")，本文只介绍一些基础的使用方法。

`Mac` 上的安装非常简单：`brew install enca`。

使用方法：

```bash
//帮助
enca --help
//查看语言列表
enca --list language
//查看编码
enca -L zh_CN filename
//修改编码，覆盖源文件
enca -L zh_CN -x UTF-8 filename
//修改编码，写入新文件
enca -L zh_CN -x UTF-8 source_filename target_filename
```