---
title: 'Mac用scp上传或下载文件'
publishDate: '2019-04-09 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
---

## 前言

由于 `Mac` 上没有像 `windows` 上的 `xftp` 一样的软件，我搜索了一下也没什么好用的同类型软件，所以上传文件到服务器和下载都不是很方便，`Mac` 自带了一个 `ftp` 工具但是只能上传不能下载，新的 `Mac` 系统也把 `telnet` 和 `ftp` 都移除了，我安装了个 `gnu` 的 `Inetutils` 来使用 `ftp`，不过最后还是选择 `scp` 了。因为 `scp` 也是基于 `ssh` 的，传输是加密的，不需要额外安装其他软件，这也许就是 `ftp` 被新系统抛弃的原因把。

## scp 的使用

## 传输本地文件到服务器

```bash
#scp 文件名 用户名@服务器ip:目标路径
scp /file-path/ root@server-ip:/file-path/
```

## 传输本地文件夹到服务器

```bash
scp -r 文件夹目录 用户名@服务器ip:目标路径
scp -r /path/folder root@server-ip:/path/
```

## 下载服务器文件到本地

```bash
scp 用户名@服务器ip:文件路径 目标路径
scp root@server-ip:/file-path/ /file-path/
```

## 下载服务器文件夹到本地

```bash
scp -r 用户名@服务器ip:文件路径 目标路径
scp -r root@server-ip:/path/folder /path/
```

## 如果服务器指定了端口

```bash
scp -P 端口号 文件路径 用户名@服务器ip:文件保存路径
scp -P port /file/path root@server-ip:/path/
```
