---
title: 'MacOS 12 brew 安装 httpd 配置 php8'
publishDate: '2021-12-22 12:00:00'
description: ''
tags:
  - php
  - 实用技巧
language: '中文'
heroImage: {"src":"./apache-http-server.png","color":"#B4C6DA"}
---

\[toc\]

## 前言

今天在学习 `EventSource` 的时候想跑一跑 `MDN` 上的 `php demo`，虽然 `Mac` 上早就装了 `nginx`，不过跑 `php` 还是想用老朋友 `Apache HTTP Server`，正好想起来新的 `Mac` 上没有安装 `httpd` 就装了一下，不过遇到不少问题，这里记录一下。

## 自带的 Apache HTTP Server 的问题

`Mac` 有自己自带的 `Apache HTTP Server`，在 `Mac` 上我们是用 `httpd（HTTP Daemon 超文本传输协议守护程序）` 来启动 `Apache HTTP Server`，`Mac` 还提供了 `apachectl` 这个前端程序帮助我们管理 `httpd` 守护进程。所以一般我们在 `Mac` 上用 `apachectl` 命令来启动和关闭 `Apache HTTP Server`。

```bash
# 启动服务
sudo apachectl start

# 重启服务
sudo apachectl stop

# 关闭服务
sudo apachectl restart

# 关闭开机自动启动
sudo launchctl unload -w /System/Library/LaunchDaemons/org.apache.httpd.plist

# 开启开机自动启动
sudo launchctl load -w /System/Library/LaunchDaemons/org.apache.httpd.plist
```

配置文件的路径默认为 `/etc/apache2/httpd.conf`，默认的站点根目录为 `/Library/WebServer/Documents/`，默认的日志路径为 `/var/log/apache2`。

`Mac` 自带的 `Apache HTTP Server` 只有在系统更新的时候才会更新版本，我看了一下当前版本是 `2.4.51`，`built` 时间为 `11` 月份，只比最新版本 `2.4.52` 稍早一个版本就决定直接用自带的了。一般来说 `Apache HTTP Server` 默认是不开启 `PHP` 支持的，我就进配置文件准备开启一下 `PHP` 支持，不过在 `/etc/apache2/httpd.conf` 中搜 `PHP` 发现下面这句话。

```bash
#PHP was deprecated in macOS 11 and removed from macOS 12
```

也就是 `Mac` 自带的这个 `Apache HTTP Server` 已经不支持 `PHP` 了，我试了试把 `PHP` 的配置手动粘贴进去重启 `Apache HTTP Server` 发现连 `index.html` 都无法显示了。没办法只能选择用 `homebrew` 安装最新的 `Apache HTTP Server` 再试试了。

> 之前在 `MacOS 10.14 catalina` 系统中 `Apache HTTP Server` 是开机默认启动的，如果要使用 `homebrew` 安装 `httpd` 需要先用上面说的命令关闭自带的 `Apache HTTP Server` 并关闭开机启动。不过新的 `MacOS 12 monterey` 取消了 `Apache HTTP Server` 的开机启动，默认是关闭的。

## homebrew 安装 httpd

用 `homebrew` 安装 `httpd` 非常简单 `brew install httpd` 即可，不过我安装后用 `brwe services list` 查看服务发现一直是 `error`。

```bash
Name    Status  User  File
httpd   started Clloz ~/Library/LaunchAgents/homebrew.mxcl.httpd.plist
mysql   none
nginx   none
php     none
unbound none
```

并且我用 `which` 命令查看 `httpd` 和 `apachectl` 看到当前的命令还是系统自带的。

```bash
which httpd
/usr/sbin/apachectl

which apachectl
/usr/sbin/httpd

where apachectl
/opt/homebrew/bin/apachectl
/usr/sbin/apachectl

where httpd
/opt/homebrew/bin/httpd
/usr/sbin/httpd
```

这个时候试一试重启终端，是在不行重启一下电脑，新的环境变量应该就生效了，也就是 `homebrew` 安装的 `httpd`。

不过在启动 `httpd` 服务的时候又遇到了新的报错：

```bash
Symbol not found: _apr_bucket_file_set_buf_size
```

在 `Google` 上一番搜索后在 [stackoverflow](https://stackoverflow.com/questions/69892715/installing-httpd-and-php-in-mac-os-12?noredirect=1 "stackoverflow") 上找到了答案，就是冲洗男装一下 `apr-util` 即可，执行 `brew reinstall apr-util`。然后在重装一下 `httpd` 就能正常用 `brew services` 启动 `httpd` 了。

`homebrew` 安装的 `httpd` 的默认配置文件路径为 `/opt/homebrew/etc/httpd/httpd.conf`，默认站点根目录为 `/opt/homebrew/var/www`（和 `homebrew` 安装 `nginx` 为同一目录），默认日志目录为 `/opt/homebrew/var/log/httpd`。我们要开启 `Apache HTTP Server` 的 `PHP` 支持我们需要在配置文件中加入如下内容（该内容来自 `brew info php`，我的 `php` 是用 `homebrew` 安装，版本为 `8.1.1`）：

```bash
LoadModule php_module /opt/homebrew/opt/php/lib/httpd/modules/libphp.so

<FilesMatch \.php$>
    SetHandler application/x-httpd-php
</FilesMatch>
```

现在我们就完成配置了，可以在根目录中加入 `php` 文件进行访问了。

## 参考

1. [Installing & Configuring Apache on macOS using Homebrew and use Sites folder](https://wpbeaches.com/installing-configuring-apache-on-macos-using-homebrew/ "Installing & Configuring Apache on macOS using Homebrew and use Sites folder")
2. [Installing httpd and php in Mac OS 12](https://stackoverflow.com/questions/69892715/installing-httpd-and-php-in-mac-os-12 "Installing httpd and php in Mac OS 12")