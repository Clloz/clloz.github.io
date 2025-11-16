---
title: 'githubusercontent curl 无法连接的解决办法'
publishDate: '2020-11-20 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
heroImage: {"src":"./macos.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

今天在安装 `wakatime` 的 `Xcode` 插件的时候发现 `curl` 返回 `Failed to connect to raw.githubusercontent.com port 443: Connection refused`。相信也有小伙伴遇到过这种情况，并且开启了代理也依然无法访问。这主要原因是 `raw.githubusercontent.com` 的 `DNS` 被污染了，也就是 `DNS` 服务器没有解析正确的 `IP` 给我们，所以结果自然是访问失败 😏 。

## 解决办法

解决办法就是修改 `hosts` 文件，直接在本地完成 `DNS` 的解析就不需要去访问上层的 `DNS` 服务器了。`DNS` 解析一般是先查看本机的 `hosts`，然后是查看路由器，如果都没查到就要访问 `DNS` 服务器了。

我们先去 [IP Address](https://www.ipaddress.com/ "IP Address") 查询一下域名定义的 `IP`，然后在 `hosts` 中添加一条解析记录即可。最后查询到的 `IP` 是 `199.232.96.133`，所以我们用 `sudo vim /etc/hosts` 编辑 `hosts` 文件，然后添加一条 `199.232.68.133 raw.githubusercontent.com` 解析记录即可。