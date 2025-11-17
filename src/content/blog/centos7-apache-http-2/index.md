---
title: 'CentOS7 Apache 开启 HTTP/2 支持'
publishDate: '2020-09-07 12:00:00'
description: ''
tags:
  - server
  - 建站知识
language: '中文'
heroImage: { 'src': './apache.png', 'color': '#B4C6DA' }
---

## 前言

`Apache Httpd` 从 `2.4.17` 开始支持 `mod_http2`，不过 `CentOS 7` 的 `httpd` 版本一直停留在 `2.4.6`。今天详细说明一下如何安装升级 `Apache` 的最新版本和开启 `HTTP/2` 的支持。

## 关于 HTTP/2

`HTTP/2` 简称为 `h2`（基于 `TLS/1.2` 或以上版本的加密连接）或 `h2c`（非加密连接），是 `HTTP` 协议的的第二个主要版本。是 `HTTP协` 议自 `1999` 年 `HTTP 1.1` 发布后的首个更新，主要基于 `SPDY` 协议。

`HTTP/2` 标准于 `2015年5月` 以 `RFC 7540` 正式发表。`HTTP/2` 的标准化工作由 `Chrome`、`Opera`、`Firefox`、`Internet Explorer 11`、`Safari`、`Amazon Silk`及 `Edge` 等浏览器提供支持。

多数主流浏览器已经在 `2015` 年底支持了该协议。此外，根据 `W3Techs` 的数据，截至 `2019年6月`，全球有 `36.5%` 的网站支持了 `HTTP/2`。

关于 `HTTP/2` 这里就不再详细介绍了，想要了解的可以参考 [HTTP/2 - Wikipedia](https://zh.wikipedia.org/wiki/HTTP/2 'HTTP/2 - Wikipedia') 和我的另一篇文章 [前端网络基础和HTTP](https://www.clloz.com/programming/network/2019/05/02/http/#HTTP2 '前端网络基础和HTTP')。

`HTTP/2` 的优势可以看这篇知乎上的文章： [怎样把网站升级到http/2](https://zhuanlan.zhihu.com/p/29609078 '怎样把网站升级到http/2')

## 升级 Apache

首先是要升级 `Apache` 的版本，你可以用 `yum info httpd` 查看一下 `CeontOS 7` 软件库中的 `Apache` 版本，不出意外是 `2.4.6`。

`CodeIT` 提供了一个很好的自定义库。这个库提供了最新版本的服务器软件(`Apache & Nginx`)。在安装 `CodeIT` 库之前，你需要开启 `EPEL` 。`EPEL` 提供了 `CodeIT` 库需要的依赖。

```bash
sudo yum install -y epel-release

cd /etc/yum.repos.d && wget https://repo.codeit.guru/codeit.el`rpm -q --qf "%{VERSION}" $(rpm -q --whatprovides redhat-release)`.repo
```

此时我们再用 `yum info httpd` 查看 `Apache` 版本会发现已经到最新的版本了(我今天安装的是 `2.4.46`)。

## 安装依赖

需要安装的依赖主要是 `openssl` 和 `nghttp2`，其中 `openssl` 版本要大于 `1.0.2`，不过这两个依赖在 `CentOS 7` 软件库中都是有的，直接用 `yum` 安装即可。

```bash
yum install openssl nghttp2
```

## 配置 httpd.conf

这里参考 `Apache` 的 [官方文档](https://httpd.apache.org/docs/2.4/howto/http2.html '官方文档') 即可，文档也有 [中文版](https://www.docs4dev.com/docs/zh/apache/2.4/reference/howto-http2.html '中文版')。

根据文档中的说明，我们需要加载 `mod_http2` 模块，这个模块是依赖于上面安装的 `nghttp2` 的。然后就是添加一行配置即可。

```bash
# 加载 mod_http2
LoadModule http2_module modules/mod_http2.so

# 配置文件中添加指令，该指令允许h2协议，并让其成为服务器连接上的首选协议
Protocols h2 http/1.1

# 要启用所有 HTTP/2 变体时，使用如下指令
Protocols h2 h2c http/1.1

# 根据放置此指令的位置，它会影响所有连接或仅影响到某个虚拟主机的连接。比如下面的配置仅允许使用 HTTP/1 进行连接，但与提供 HTTP/2 的test.example.org的 SSL 连接除外。
Protocols http/1.1
<VirtualHost ...>
    ServerName test.example.org
    Protocols h2 http/1.1
</VirtualHost>
```

到这里就已经完成全部配置，`systemctl restart httpd` 即可。此时打开浏览器的开发者工具访问自己的网站会发现 `HTTP/2` 已经生效。除了通过开发者工具，这个 [http2-test](https://tools.keycdn.com/http2-test 'http2 - test网站') 网站也可以帮助你检测网站是否开启 `HTTP/2` 的支持。$

## 内存占用

如果 `Apache` 出现内存占用过高，那么修改 `httpd-mpm.conf` 中的 `prefork` 工作模式的参数，将 `MaxConnectionPerChild` 改为 `50`。文件位置用命令 `find / -name httpd-mpm.conf` 查找。更多内容参考文章 [Apache内存溢出的分析与解决](https://abc-ziv.github.io/2018/06/13/2018-06-27-OutOfMemory/ 'Apache内存溢出的分析与解决')

## 参考文章

1. [如何在Centos7下升级Apache至最新版本](https://www.cnblogs.com/ihuangjianxin/p/9036646.html '如何在Centos7下升级Apache至最新版本')
2. [Apache Httpd 开启 HTTPS 和 HTTP/2](https://www.mf8.biz/apache-httpd-%E5%BC%80%E5%90%AF-https-%E5%92%8C-http2/ 'Apache Httpd 开启 HTTPS 和 HTTP/2')
3. [详解为新版Apache服务器开启HTTP/2支持的方法](https://www.jb51.net/article/76432.htm '详解为新版Apache服务器开启HTTP/2支持的方法')
4. [Apache如何启用HTTP/2](https://my.oschina.net/u/3495789/blog/4346276 'Apache如何开启HTTP/2')
