---
title: '终端设置代理'
publishDate: '2020-09-15 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
heroImage: { 'src': './shadowsocks.jpg', 'color': '#B4C6DA' }
---

## 前言

配置了 `V2ray` 或者 `Shadowsocks` 以后，一般来说，只有浏览器（包括内嵌在各种软件中的浏览器，比如 `WeGame`、优酷、迅雷等软件中的内嵌浏览器）会走代理，其他的应用默认是不走代理的，需要我们手动配置。当需要在终端中使用 `brew`，`git` 或者 `npm` 等安装 `package` 或应用的时候，如果连接比较吃力的时候启动代理是一个解决方案。本文介绍以下如何在终端中配置代理。

## 全局代理模式

我们使用 `V2ray` 或者 `Shadowsocks` 会进行全局代理模式的选择，一般来说有三种 `PAC`，`Global` 和 `Manual`。

- `PAC`：`Proxy auto-config`，根据配置文件来确定当前的连接是否需要代理，一般来说这个配置文件是 `GFW List` 加上我们自己配置的 `user rules`。关于 `user rules` 如何配置可以参考我的另一片文章：[V2ray安装配置教程](https://www.clloz.com/programming/assorted/2019/11/24/v2ray-install-configuration/#user-rules 'V2ray安装配置教程')
- `Global`: 全局模式，所有连接都走代理。
- `Manual`：手动模式，不会设置系统级代理，需要使用代理的应用（比如浏览器）都需要手动配置代理。

一般来说我们使用前两个模式比较多，大多数情况下 `PAC` 模式都足够了，如果发现某个我们经常访问的网站不在 `PAC` 的规则之中，则手动添加到 `user rules` 里面即可。

![proxy-rules](./images/proxy-rules.png 'proxy-rules')

虽然 `PAC` 和 `Global` 都设置了系统级代理，但是一般只有浏览器（包括内嵌在各种软件中的浏览器，比如 `WeGame`、优酷、迅雷等软件中的内嵌浏览器）才会使用这个系统级代理，其他应用一般还是需要手动配置。大部分应用不太需要使用这个需求，但是对于经常使用的终端配置一下代理能让我们使用 `homebrew`，`git` 和 `npm` 下载的时候效率高很多。

## 终端配置

终端中使用有两种方式，一种是临时配置，重启终端后就失效了；另一种是写入到配置文件中去，每次启动终端都可以使用。我们还需要知道 `V2ray` 和 `Shadowsocks` 的客户端给我们提供了三种代理配置类型，`HTTP`，`socks5` 和 `PAC`，对应的端口都不同。

## 临时配置

```bash
# 默认一般address是127.0.0.1，http默认port是1087，socks5默认port是1086，PAC默认port是1089
export http_proxy=http://proxyAddress:port
export https_proxy="http://localhost:port"
export all_proxy=socks5://127.0.0.1:1086
```

## 写入配置文件

在终端配置文件中（`.zshrc` 或者 `.bash_profile`）将配置写入。

```bash
alias proxy='export all_proxy=socks5://127.0.0.1:1086'
alias unproxy='unset all_proxy'
```

使用 `proxy` 命令开启代理，使用 `unproxy` 关闭代理。如何检测我们的代理是否开启了，可以使用命令 `curl cip.cc`，你可以看到你当前的 `IP`，位置和运营商。如果代理成功开启，那么你可以看到你的 `IP` 位置等信息都编程了你的代理服务器。

这里补充一下，用 `curl cip.cc` 进行测试，其实这个测试结果完全就是看你 `curl` 这个地址是否走了代理，如果在代理工具中配置了这个地址直连，那么得到的结果肯定还是真实的 `IP` 而不是代理服务器 `IP`，可以参考 [请问clashx怎么设置终端代理呢？](https://github.com/Dreamacro/clash/issues/592) 这个 `issue`，用 `curl -vv https://www.google.com` 来进行测试。

最后还需要注意的一点是，如果你设置了 `brew` 或者 `npm` 的国内镜像，那么开启了代理以后，这些镜像的访问也会走代理，可能影响访问速度。

## 参考文章

1. [Shadowsocks(R)设置：系统代理模式、PAC、代理规则](<https://vimcaw.github.io/blog/2018/03/12/Shadowsocks(R)%E8%AE%BE%E7%BD%AE%EF%BC%9A%E7%B3%BB%E7%BB%9F%E4%BB%A3%E7%90%86%E6%A8%A1%E5%BC%8F%E3%80%81PAC%E3%80%81%E4%BB%A3%E7%90%86%E8%A7%84%E5%88%99/> 'Shadowsocks(R)设置：系统代理模式、PAC、代理规则')
