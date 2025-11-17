---
title: '如何使用IRC'
publishDate: '2019-09-26 12:00:00'
description: ''
tags:
  - emacs-vim
  - 奇技淫巧
language: '中文'
heroImage: { 'src': './irssi.png', 'color': '#B4C6DA' }
---

## 前言

在 `lazycat` 的博客看到他对 `emacs` 学习的建议，了解到了 `IRC` 也就是 `Internet Relay Chat`，于是便做了了解，这篇文章告诉大家如何使用 `IRC`。关于 `IRC` 的介绍请看[维基百科](https://zh.wikipedia.org/wiki/IRC '维基百科')

## 安装

`IRC` 的使用形式有多种，可以有 `GUI` 程序，也可以在 `shell` 中使用，在 `emacs` 里也有相应的插件，这里我介绍两个客户端软件，一个是 `GUI` 软件 `LimeChat`，另一个是我在终端使用的 `irssi`。

`LimeChat` 可以直接在 `app store` 下载，是免费的。 `irssi` 的安装也很简单 `brew install irssi`。

## 注册

要进入目标频道聊天，我们先要连接服务器，比如`freenode` 的服务器。

```bash
/connect irc.freenode.net 6667
```

然后我们需要注册一个我们的 `ID`，注册方法（可以查看 `freenode` 的[网站](https://freenode.net/kb/answer/registration '网站')具体了解）

```bash
#设置昵称
/nick xxxx
#进行注册
/msg NickServ REGISTER password youremail@example.com
# 收到邮件后，执行邮件中收到的命令
/msg NickServ VERIFY REGISTER yourname xxxxxxx
# 如果不想公开邮箱可以设置隐藏:
/msg NickServ SET HIDEMAIL ON
# 登录
/msg NickServ IDENTIFY password
```

然后我们就可以用 `join` 命令加入我们想要加入的频道了，比如你想要加入 `emacs` 频道就执行如下命令。

```bash
/join #emacs
```

现在我们就可以在自己喜欢的频道聊天了。

## 使用

不管是用 `GUI` 软件还是在终端使用，基本都是用命令来控制，关于命令可以查看维基百科的页面[List of Internet Relay Chat commands](https://en.wikipedia.org/wiki/List_of_Internet_Relay_Chat_commands 'List of Internet Relay Chat commands')以及 这个[页面](https://kiwiirc.com/docs/client/commands '页面')

常用的一些命令有：

```bash
/join ubuntu-cn # 中文频道  ubuntu-cn；linuxba
/list # 频道列表
/names [#聊天室] # 列出当前服务器或指定聊天室下的所有人员名称（无法列出隐藏人员）
/who # 查看频道的所有人
/whois [name] # 查看某人的基本资料
/ison <name1> <name2> … # 查询指定别名是否在线
/info # 查询服务器信息
/admin # 查询当前服务器上的Admin
/lusers # 查询当前服务器上的统计信息
/motd # 查询当前服务器今日的统计信息
/links # 查询当前的服务器，解析当前的有几个服务器
/msg <name> <msg> # 向某人发私消息（会打开新窗口）
/query <name> <msg> # 向某人发私消息（新开窗口且转换到这个窗口）
/say <name> <msg> # 向某人说话（不新开窗口）
/notice <name> <msg> # 向指定人发出注意消息
/me <动作>，在当前聊天室窗口中做出动作。 如做出晕倒动作：/me 晕倒
/away <auto reply msg> # 留下信息说明暂时离开，别人向你发出私聊时将会返回此消息，再重新输入 /away（不指定参数）则解除离开状
/ignore <name> # 忽略某人的聊天内容
/set autolog on # 自动保存聊天记录
/part <channel> <msg> # 退出一个频道，不加频道名退出当前频道，后面可以跟退出原因。
/disconnect #退出服务器
```

## 发送代码和图片

发送代码使用代码粘贴网站来发送，不要直接发送大段代码，代码粘贴网站可以使用 [paste.ubuntu.com](https://paste.ubuntu.com/ 'paste.ubuntu.com')，发送图片可以使用[img.vim-cn.com](http://img.vim-cn.com/ 'img.vim-cn.com')，当然也可以搜索其他可用的 `paste` 网站。

## 参考文章

1. [IRC基本概念](https://wiki.ubuntu.com.cn/IRC%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5 'IRC基本概念')
2. [IRC快速发图](http://www.lenky.info/archives/2013/09/2341?utm_source=tuicool&utm_medium=referral 'IRC快速发图')
