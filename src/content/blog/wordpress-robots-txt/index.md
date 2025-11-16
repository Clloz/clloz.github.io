---
title: 'Wordpress的robots.txt配置'
publishDate: '2019-10-31 12:00:00'
description: ''
tags:
  - wordpress
  - 建站知识
language: '中文'
heroImage: {"src":"./wordpress.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

最近 `Google` 的英文检索一直找不到我的网站首页，不知道是出了什么问题，偶尔检索到也是在第五第六位，有时候又突然不见了，`Google Search Console` 上也没看出有什么问题。之前一直是用的 `XML-Sitemap` 这个插件来管理网站的 `sitemap`，其中又关于 `robots.txt` 的内容也没仔细看，这两天在 `Google Search Console` 上看到了 `robots.txt` 的相关内容，就去了解并自己配置了一下。

## 什么是 robots.txt

`robots.txt` 搜索引擎爬虫程序抓取网页时要访问的第一个文件，`robots.txt` 文件规定了搜索引擎抓取工具可以/无法请求抓取您网站上的哪些网页或文件。此文件主要用于使您的网站避免收到过多请求；它并不是一种用于阻止搜索引擎访问某个网页的机制。 通过 `robots.txt` 文件，可以和各大搜索引擎很友好的对话，引导搜索引擎爬虫程序抓取你推荐的网页，避免一些意义不大或无用网页，例如网站后台、会员交互功能等，这在一定程度上也节省服务器网络资源。另外，`robots.txt` 文件对SEO的意义也很重要，可以很好的避免重复、相似网页，以及一些关键字权重流失；写好 `robots.txt` 文件，是每个 `SEOer` 必做的功课之一。

## 如何写 robots.txt

`Wordpress` 默认有一个虚拟的 `robots.txt`，当你的网站根目录不存在 `robots.txt` 这个文件的时候，这个虚拟文件就会生效，它大概是这样的：

```bash
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
```

在 `robots.txt` 中只有三个配置参数：`User-agent`、`Disallow` 和 `Allow`。 1. `User-agent`：该项的值用于描述搜索引擎 `Robot` 的名称，至少要有一条 `User-agent` 记录；如果 `User-agent` 的值为 `*`，则表示该协议对所有搜索引擎Robot都有效； 2. `Disallow`： 该项的值用于描述不希望被爬虫程序访问到的一个 `URL`，这个 `URL` 可以是一条完整的路径，也可以是部分的，任何以 `Disallow` 开头的URL均不会被 爬虫程序访问到； 3. `Allow`：该项和 `Disallow` 对立，表示允许搜索引擎 `Robot` 访问指定内容。

常见的搜索引擎爬虫程序名称：

- `Baiduspider` http://www.baidu.com
- `ia_archiver` http://www.alexa.com
- `Googlebot` http://www.google.com
- `Scooter` http://www.altavista.com
- `FAST-WebCrawler` http://www.alltheweb.com
- `Slurp` http://www.inktomi.com
- `MSNBOT` http://search.msn.com

> 注意 `Disallow: /test` 和 `Disallow: /test/` 的区别，虽说只区别于一个反斜杠 `/`，不过意义完全不同。`Disallow: /test` 表示可以禁止的 `URL` 包括：`/test`、`/testabc.html`、`/test/abc`这三种形式；`Disallow: /test/` 则允许爬虫访问 `/test`、`/testabc.html`，禁止访问 `/test/abc` 这种形式。如果 `Disallow` 记录的值为空，即 `Disallow:`格式，则说明该网站的所有内容可以被任何搜索引擎爬虫抓取；在 `robots.txt` 文件，如果有声明 `User-agent`，至少要有一条 `Disallow` 记录。

在 `robots.txt` 中还可以向搜索引擎提交自己的站点地图，只要在其中添加一条记录 `https://yourdomain/sitemap.xml`。

我当前的 `robots.txt` 的内容如下：

```bash
User-agent: *
Disallow: /wp-admin/
Disallow: /wp-includes/
Disallow: /wp-content/
Disallow: /feed
Disallow: /editormd
Disallow: /page
Disallow: /xmlrpc.php
Disallow: /wp-*.php
Disallow: /?s=*
Disallow: /s/*/page
Disallow: /s/*/*/page
Disallow: /*/*/page
Disallow: /wp-*.php
Disallow: /author/clloz/page
Disallow: /tags/*/page
Allow: /wp-admin/admin-ajax.php

Sitemap: https://www.clloz.com/sitemap.xml
```

## 总结

`robots.txt` 也存在一些限制，下面是 `Google` 给出的建议： - 并非所有搜索引擎都支持 `robots.txt` 指令 `robots.txt` 文件中的命令并不能强制抓取工具对您的网站采取的行为；是否遵循这些命令由抓取工具自行决定。`Googlebot` 和其他正规的网页抓取工具都会遵循 `robots.txt` 文件中的命令，但其他抓取工具未必也会如此。因此，如果您想确保自己网站上的特定信息不会被网页抓取工具抓取，需要采用其他屏蔽方法（如为服务器上的隐私文件提供密码保护）。 - 不同的抓取工具对语法的解析各不相同 虽然正规的网页抓取工具会遵循 `robots.txt` 文件中的指令，但这些抓取工具可能会以不同的方式来解析这些指令。 - 如果其他网站上有链接指向被 `robots.txt` 文件屏蔽的网页，则此网页仍可能会被编入索引 尽管 `Google` 不会抓取被 `robots.txt` 屏蔽的内容或将其编入索引，但如果网络上的其他位置有链接指向被禁止访问的网址，我们仍可能会找到该网址并将其编入索引。因此，相关网址和其他公开显示的信息（如相关页面链接中的定位文字）仍可能会出现在 `Google` 搜索结果中。要正确阻止您的网址出现在 `Google` 搜索结果中，您应为您服务器上的文件设置密码保护，或者使用 `noindex` 元标记或响应标头（或者彻底移除网页）。

## 参考文章

1. [robots.txt文件配置和使用方法详解](https://www.cnblogs.com/Gbeniot/p/4088980.html "robots.txt文件配置和使用方法详解")
2. [为WordPress设置最佳的Robots.txt规则](https://zhangzifan.com/wordpress-robots.html "为WordPress设置最佳的Robots.txt规则")
3. [关于 robots.txt - Google](https://support.google.com/webmasters/answer/6062608?hl=zh-Hans "关于 robots.txt - Google")