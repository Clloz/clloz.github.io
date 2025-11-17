---
title: '从URL输入到页面展现'
publishDate: '2018-12-05 12:00:00'
description: ''
tags:
  - front-end
  - 编程技巧
  - 计算机系统
  - 计算机网络
language: '中文'
heroImage: { 'src': './browser.jpg', 'color': '#B4C6DA' }
---

## 前言

这是一个经典的前端面试题，理解从`URL`到页面展现的过程能够对于前端的工作以及前后端的配合有更透彻的理解，让我们在解决一些需求以及沟通的时候能够有更加清晰的思路。

本文只是简单介绍以下，详细的内容可以参考另外两篇文章： 1. 网络：[前端网络基础和HTTP](https://clloz.com/blog/http/ '前端网络基础和HTTP') 2. 浏览器：[浏览器渲染过程及Event Loop浅析](https://clloz.com/blog/how-browser-work-2/ '浏览器渲染过程及Event Loop浅析')

## URI、URL 和域名

## URI & URL

在说这个问题之前，先来说一说 `URI` 和 `URL` 以及域名。我们经常看到这两个名称，但是不知道绝体有什么区别，好像两者可以互相替换，其实并不是。`URI`（`Uniform Resource Identifier`）统一资源标识符，[RFC 2396](https://www.ietf.org/rfc/rfc2396.txt 'RFC 2396')对这三个单词分别做了定义：

1. `Uniform`：规定统一的格式可方便处理多种不同类型的资源，而不用根据上下文环境来识别资源指定的访问方式。另外，加入新增的协议方案（如 `http`: 或 `ftp`:）也更容易。
2. `Resource`：资源的定义是“可标识的任何东西”。不仅是文档文件，图像或服务（例如当天的天气预报）等能够区别于其他类型的，全都可作为资源。另外，资源不仅可以是单一的，也可以是多数的集合体。
3. `Identifier`：表示可标识的对象。也称为标识符。

`URI` 说简单点就是在一个统一的规则下唯一标志资源的方法。比如每个人身份证号都不一样，那身份证号就是一个 `URI`，他能唯一标志每一个人而且没有重复。在网络上我们是以协议来统一格式的，也就是我们熟悉的`http https ftp`等（标准的 `URI` 协议有 `30` 种左右），也就是\[scheme:\] `scheme-specific-part` 的形式，比如我们前面用身份证标记一个人就可以表示为`ID：12345678XXX`。而 `URL` 在唯一标志资源的前提下加了一个约束条件，就是必须用位置来唯一标志一个资源，刚刚我们用身份证号唯一标志一个人，现在我们相当于用住址来表示`address：China/Shanghai/Yangpu/XX street/XX`，从这里我们可以看出URL其实是 `URI` 的一个子集，每一个 `URL` 同时也是一个 `URI`。

`RFC3986`（`URI` 通用语法）中列举了几种 `URI` 例子，如下所示，其中有一些也是 `URL`）。

- ftp://ftp.is.co.za/rfc/rfc1808.txt (also a URL because of the protocol)
- <http://www.ietf.org/rfc/rfc2396.txt> (also a URL because of the protocol)
- ldap://\[2001: db8::7\]/c=GB?objectClass?one (also a URL because of the protocol)
- mailto:John.Doe@example.com (also a URL because of the protocol)
- news:comp.infosystems.www.servers.unix (also a URL because of the protocol)
- tel:+1-816-555-1212
- telnet://192.0.2.16:80/ (also a URL because of the protocol)
- urn: oasis: names: specification: docbook: dtd: xml:4.1.2

## 域名

每台设备在网络上都有自己的 `IP` 地址来定位自己的位置，但是由于 `IP` 地址记忆复杂后来就引入了语义化的域名，用户输入域名即可访问网站，这中间其实有 `DNS` 服务器在工作，把我们的域名翻译成 `IP` 在进行定位。 我们的 `URL` 可以写作以下形式`协议://主机名.域名：端口号/文件（资源）路径`，比如`https://www.baidu.com/xxx`，其中`baidu.com`就是域名。

## 具体流程

## 域名解析

在浏览器接收到 `URL` 的时候他的首要任务是通过 `URL` 中的域名找到该域名对应的 `IP` 地址，找 `IP` 地址的过程可以分为一下几个阶段： 1. 查看浏览器缓存，如果刚刚访问过该域名，缓存中仍然有该域名的 `dns` 信息则直接从浏览器缓存中获取，各浏览器缓存 `DNS` 信息的时间不同，`chrome` 为一分钟（`chrome` 查看缓存 `url`：[chrome://net-internals#dns](chrome://net-internals#dns； 'chrome://net-internals#dns')）。 2. 浏览器缓存中没有该域名的 `dns` 信息则搜索系统缓存，读取本地 `hosts` 文件 3. `hosts` 文件中也没有对应的 `dns` 信息则会搜索路由器缓存 4. 浏览器发起 `dns` 系统调用（向宽带运营商发起 `dns` 解析请求）； a. 宽带运营商（`ISP`）服务器查看本地缓存 b. 运营商服务器发起一个迭代 `dns` 解析请求（根域-com域-所属域，拿到后返回给操作系统内核同时缓存起来，操作系统内核返回给浏览器）

![dns](./images/dns.jpg 'dns')

## TCP/IP 连接建立

浏览器获得对应的 `IP` 地址后，就可以向服务器发送 `TCP` 请求了，为了方便传输，`TCP` 协议大块数据被分割成了以报文段（`sgment`）为单位的数据包，同时为了准确无误地将数据送达目标，`TCP` 协议采用了三次握手策略（`three-way handshaking`），用 `TCP` 协议把数据包送出去后，`TCP` 不会对传送后的情况置之不理，它一定会向对方确认是否成功送达。握手过程中使用了 `TCP` 的标志（`flag`）——`SYN`（`synchronize`）和 `ACK`（`acknowledgement`）。发送端首先发送一个带 `SYN` 标志的数据包给对方。接收端收到后，回传一个带有 `SYN/ACK` 标志的数据包以示传达确认信息。最后，发送 端再回传一个带 `ACK` 标志的数据包，代表“握手”结束。若在握手过程中某个阶段莫名中断，`TCP` 协议会再次以相同的顺序发送相同的数据包。（图片来自图解 `HTTP`） ![tcp](./images/tcp.jpg 'tcp')

## 发起 HTTP 请求

`TCP/IP` 连接建立起来以后，浏览器就可以向服务器发送 `http` 请求了；

## web 服务器处理请求

服务器上的 `web` 服务器负责接收用户发出的请求，在收到请求后把请求内容交给网站的代码或者是转发给对应的 `web` 服务器。收到请求后对应的后台模块根据请求的资源和参数开始工作，处理完成后将对应的数据或者是 `HTML` 页面交给 `web` 服务器，再由 `web` 服务器按上述的路径返回给浏览器。

## 浏览器渲染

浏览器收到返回结果以后进行解析和渲染，对于 `html` `文件的css`，`js`，图片等静态资源都是 `http` 请求都需要经过上述步骤。浏览器把完整的页面展示出来。

完整的请求过程如下图（图来自《图解HTTP》） ![http](./images/http.jpg 'http')
