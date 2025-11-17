---
title: '2021 VPS 配置 v2ray + WebSocket + TLS 梯子教程'
publishDate: '2021-11-15 12:00:00'
description: ''
tags:
  - assorted
  - 软件工具
language: '中文'
heroImage: { 'src': './v2ray.png', 'color': '#B4C6DA' }
draft: true
---

## 前言

`19` 年的时候写过一篇 [v2ray 的安装配置教程](https://www.clloz.com/programming/assorted/2019/11/24/v2ray-install-configuration/ 'v2ray 的安装配置教程')，今年在部署几台新服务器的时候发现里面有些内容已经不适用了，所以决定整理出一套新的教程。

> 本教程使用的是 `CentOS 7` 系统，使用其他系统的同学请自行修改对应的命令。

## 购买域名和 VPS 并添加域名解析

由于要开启 `TLS` 进行加密，所以我们需要注册一个域名并且解析到我们的 `VPS`，我们可以到 [万网 - 阿里云](https://wanwang.aliyun.com/domain/searchresult#/?keyword=&suffix=com '万网') 选一个自己喜欢的域名购买。注意的是阿里云的域名购买后想要添加解析需要**实名认证**才能使用，如果没有实名认证，即使你添加了解析也是不生效的。

有了域名我们还需要一个海外的 `VPS`，我已经使用了三四年的搬瓦工了，还是比较稳定的，也推荐大家使用，最便宜的配置是一年 `50$`(以前有 `20$` 的配置，现在取消了，我用的就是这个，只要一直续费就可以一直用），搬瓦工的网站是 [bandwagonhost](https://bandwagonhost.com/ 'bandwagonhost')。

购买好 `VPS` 并且认证好域名之后就是添加域名的解析了，这里我们添加一个 `A` 记录，记录值为 `VPS` 的 `IP` 即可。

[![vps-2021-resolve](./images/vps-2021-resolve.png 'vps-2021-resolve')](https://img.clloz.com/blog/writing/vps-2021-resolve.png 'vps-2021-resolve')

此时我们已经完成外部的工作，需要连接到 `VPS` 进行安装配置了，使用 `ssh root@vps-ip -p port`，`VPS` 的 `IP` 可以登录到你购买 `VPS` 的网站后台查看，注意的是 `bandwagon` 的 `VPS` 的 `ssh` 端口不是默认的 `22` 而是随机生成的一个端口，如果是默认的 `22` 则命令的 `-p port` 就不需要输入。

## 安装配置 v2ray

`v2ray` 的安装很简单，安装脚本来自 [fhs-install-v2ray](https://github.com/v2fly/fhs-install-v2ray 'fhs-install-v2ray')，如要移除，请参考 `README`。

```bash
// 安裝執行檔和 .dat 資料檔
# bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
```

安装好之后我们可以用 `systemctl start v2ray` 和 `systemctl stop v2ray` 来开启和关闭 `v2ray`。

该脚本安装的 `v2ray` 的配置文件路径是 `/usr/local/etc/v2ray/config.json`，如果忘记了可以用 `systemctl status v2ray` 来查看。下面我们编写配置文件

```bash
{
  "inbounds": [
    {
      "port": 10000, # 该端口需要与后面 nginx 配置的端口一致
      "listen":"127.0.0.1", # 只监听 127.0.0.1，避免除本机外的机器探测到开放了 10000 端口
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "b831381d-6324-4d53-ad4f-8cda48b30811", # 此处填写生成的 uuid
            "alterId": 64
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
        "path": "/ray"
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

直接赋值这个内容粘贴到 `v2ray` 的配置文件中即可，只有两个地方时要修改的，一个的端口（也可以不修改），一个是 `id`。`id` 的生成可以到 [https://www.uuidgenerator.net](https://www.uuidgenerator.net 'https://www.uuidgenerator.net')

## 证书的生成和自动续签

`TLS` 是需要证书的，这里我们使用 `certbot` 来帮我们申请免费的 `Let's Encrypt` 证书，`Let's Encrypt` 是一家免费，开放，自动化的证书颁发机构，官方文档参考 [Let’s Encrypt 快速入门](https://letsencrypt.org/zh-cn/getting-started/ 'Let’s Encrypt 快速入门')。`Let's Encrypt` 官方建议使用 `certbot` 来进行证书的获取。安装 `certbot` 需要先安装 `epel` 仓库，命令如下：

```bash
sudo yum install epel-release

sudo yum install certbot
```

由于我们的 `VPS` 上并没有一个真实运行的网站（只是用来进行流量的伪装），所以我们需要用 `certbot` 的 `standalone` 参数来运行一个独立的网页服务器进行身份验证（`certbot` 需要确定你拥有域名指向的服务器的所有权），该网页服务器会使用 `VPS` 的 `80` 端口，所以你需要关闭 `VPS` 上的 `web` 服务器（比如 `nginx`）。申请证书的命令如下

```bash
# 添加免费SSL证书，example.com改为你购买的域名
certbot certonly --standalone -d example.com # 生成证书的时候会让你填一个邮箱，在证书快到期的时候会发邮件给你

# 安装成功后的证书路径
/etc/letsencrypt/live/example.com/fullchain.pem
/etc/letsencrypt/live/example.com/privkey.pem

# 查看已经生成的证书
certbot certificates
```

这里注意，如果出现红字说生成失败，那么要检查一下域名解析填的 `IP` 是否正确，也可以在 `VPS` 中 `ping` 一下你的域名看看能不能 `ping` 通，并且指向的 `IP` 是不是当前 `VPS` 的 `IP`。

[![vps-2021-certbot](./images/vps-2021-certbot.png 'vps-2021-certbot')](https://img.clloz.com/blog/writing/vps-2021-certbot.png 'vps-2021-certbot')

如果你的域名解析正确并且能够在 `VPS` 上 `ping` 通，但是还是一直红字提示失败，那么你需要检查一下 `VPS` 的防火墙，可以用 `systemctl status firewalld` 来查看是否开启了防火墙。一般来说出现这种情况都是因为防火墙的开启，比较简单的解决方法就是关闭防火墙：

```bash
systemctl stop firewalld
systemctl disable firewalld
```

如果你不想关闭防火墙可以试一试让防火墙开放指定端口（**我是直接关闭防火墙的，该方法没有实际测试**），以下命令均来自 [Linux CentOS7 开启80，443端口外网访问权限](https://blog.csdn.net/u011477914/article/details/88862041 'Linux CentOS7 开启80，443端口外网访问权限')

```bash
# 检查防火墙状态
firewall-cmd --state # running 表示启动 not running 表示未启动

# 开启端口外网访问 返回 success 表示开启成功 --permanent 表示永久生效，不加该参数则重启后失效
firewall-cmd --zone=public --add-port=80/tcp --permanent
firewall-cmd --zone=public --add-port=443/tcp --permanent

# 开放多个端口
firewall-cmd --zone=public --add-port=80-85/tcp --permanent

# 关闭端口 返回 success 代表成功
firewall-cmd --zone=public --remove-port=80/tcp --permanent

# 重新载入 返回 success 代表成功
firewall-cmd --reload

# 查看端口是否成功开启 返回 yes 代表开启成功
firewall-cmd --zone=public --query-port=80/tcp
```

`Let's Encrypt` 的证书是免费的，但是每次证书的有效期只有 `90` 天，也就是我们至少在 `90` 天以内更新一次我们的证书，你可以到 `VPS` 上手动更新，命令时 `certbot renew`，还是要注意更新证书的时候需要关闭 `nginx`，否则会报 `80` 端口被占用。你用可以先用 `certbot renew --dry-run` 来检验是否能够成功更新，该命令只是检测，不会真的生成证书。

> 还有一个需要注意的点就是默认情况下只有证书有效期小于 `30` 天的时候才能进行更新，如果有效期超过 `30` 天则会更新失败。

如果每次手动更新太麻烦了，我们可以使用 `crond` 帮我们定期执行更新命令，首先进行安装并启动（`vultr` 的 `VPS` 默认已经安装了）

```bash
yum -y install vixie-cron
yum -y install crontabs
service crond start
```

`crontab` 可以用 `cron` 表达式帮我们定期执行一些命令，输入 `crontab -e` 就可以输入我们要定期执行的表达式了：

```bash
1 0 15 * * /usr/bin/certbot renew --pre-hook "systemctl stop nginx" --post-hook "systemctl start nginx"
```

表达式的前五个 `*` 或者数字是 `cron` 表达式，分别代表 `分 时 日 月 年`，`*` 就代表 `每` 的意思，比如上面的 `1 0 15 * *` 表示每年每月的 `15` 号的 `00 : 01` 执行后面的命令。`--pre-hook 和 --post-hook` 则是 `certbot` 的两个参数表示在执行 `renew` 之前和之后的两个命令钩子，此处表示我们先关闭 `nginx` 在执行 `renew`，`renew` 完成后再启动 `nginx`。

## 安装配置 nginx

配置了 `TLS` 需要一个 `web` 服务器，这里可以选择 `nginx`，`apache` 或者 `caddy`，我使用的是 `nginx`。

```bash
# 安装 nginx
yum -y install nginx

# 设置nginx的开机启动
systemctl enable nginx
```

`nginx` 的配置文件默认是 `/etc/nginx/nginx.conf`，不过我建议是在 `/etc/nginx/conf.d` 中创建一个独立的配置文件 `v2ray.conf`，方便管理。`nginx.conf` 会读取 `conf.d` 中的所有 `conf` 文件。创建好配置文件后写入如下配置

```bash
server {
  listen 443 ssl;
  listen [::]:443 ssl;

  ssl_certificate       /etc/letsencrypt/live/example.com/fullchain.pem; # 此处的路径写你生成的证书路径
  ssl_certificate_key   /etc/letsencrypt/live/example.com/privkey.pem; # 此处的路径写你生成的证书路径
  ssl_session_timeout 1d;
  ssl_session_cache shared:MozSSL:10m;
  ssl_session_tickets off;

  ssl_protocols         TLSv1.1 TLSv1.2 TLSv1.3;
  ssl_ciphers           ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
  ssl_prefer_server_ciphers off;

  server_name           your.domain; # 你的域名
    location /ray { # 与 V2Ray 配置中的 path 保持一致
      if ($http_upgrade != "websocket") { # WebSocket协商失败时返回404
          return 404;
      }
      proxy_redirect off;
      proxy_pass http://127.0.0.1:14400; # 这里的端口写你在 v2ray 中配置的端口
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
      # Show real IP in v2ray access.log
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

需要修改的地方我已经在注释中表名，请仔细修改，**注意分号**。编写完成后我们用 `nginx -t` 来测试配置文件是否有语法错误，一般如果显示如下命令则表示语法没问题，我们可以重启 `nginx`

```bash
nginx: the configuration file /opt/homebrew/etc/nginx/nginx.conf syntax is ok
nginx: configuration file /opt/homebrew/etc/nginx/nginx.conf test is successful

systemctl restart nginx
```

> `caddy` 是一个比较新的用 `golang` 实现的 `web` 服务器，我不是很熟悉，不过它可以自动签发 `https` 证书，这一点来说比较方便，如果你不想自己配置证书可以使用 `caddy`。`caddy` 的配置参考 [新 V2Ray 白话文指南](https://guide.v2fly.org/advanced/wss_and_web.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE '新 V2Ray 白话文指南')

## SELinux

上面的步骤都执行完了，一般来说我们的配置就已经完成了，此时在客户端上正确配置就能够访问 `Google` 了。如果此时你的 `v2ray` 客户端显示服务器连接正常，但是你还是不能访问 `Google`，很可能是 `SELinux` 的问题，此时我们只要去 `/var/log/nginx/` 查看 `access.log` 可以看到很多的 `Permission Denied`，说明 `VPS` 收到了我们的请求但是由于 `SELinux` 无法转发给 `v2ray`，此时我们可以关闭 `SELinux`，也可以直接执行 `setsebool -P httpd_can_network_connect 1` 来开启内网转发的权限。

> 关于 `SELinux` 的介绍可以参考 [阿里云](https://help.aliyun.com/document_detail/157022.html '阿里云')

## clash

我原来在 `Mac` 上一直用的是 `V2rayU` 作为客户端的图形界面代理工具，这个工具一直都用的挺好。最近看了看 `clash` 相关的图形界面代理工具，包括 `Clash for Windows`，`ClashX` 和 `ClashX Pro`，其中 `ClashX` 是开源的，其他都是闭源的，`clash` 有个 `premium-core` 也是闭源的。我当时就是觉得界面比较好看所以试了试 `ClashX Pro`，不过使用后遇到了不少问题，首先是没有文档，全部靠 `clash` 自身的文档，`ClashX` 的 `Github` 仓库也不能提 `issue`，`ClashX Pro` 更是仓库都没有，只是在微软的 `App Center` 里面有下载和 `release note`，遇到问题只能到 `Github` 仓库中提一个 `discussion` 里面提一个，大概率没人管。

`ClashX Pro` 支持 `clash premium-core`，主要是支持一个 `tun` mode，可以代理电脑中所有的 `tcp` 和 `udp` 流量。这个我使用需求不大，需要代理的软件单独设置就可以。另一个功能就是支持一个 `rule provider` 功能，这个比较有用，之前用 `V2rayU` 的时候有 `pac` 模式，有一个默认的 `GFW list` ，基本上我们配置完 `vmess` 就可以使用了。在 `clash` 这里基本每个规则都得自己配置，`rule provider` 让我们可以用一些别人配置好的 `rule-set`，这样就比较方便，有些 `rule-set` 是可以自己更新的（[SS-Rule-Snippet](https://github.com/Hackl0us/SS-Rule-Snippet) 和 [clash rules](https://github.com/Loyalsoldier/clash-rules) 是两个比较好的 `rule` 配置）。但是在使用 `ClashX Pro` 的时候还遇到两个比较严重的问题，一个就是切换有线和无限会由于 `fake id` 的原因无法上网，还有就是内存占用非常高，刚开就 `180m` 的内存占用，后面还会一直增加，不知道为什么一个代理工具这么高的内存你占用。使用 `ClashX` 则相对较低只有几十兆，`V2rayU` 只有十几兆。目前我使用的是 `ClashX` ，比较麻烦的就是 `rule`，得自己手填一堆。`M1` 芯片的电脑还有个方法就是安装手机上用的 `shadowrocket`，必须用美服 `apple id` 才能下载。

最后就是配置终端代理，原来我都是用 `curl cip.cc` 进行测试，其实这个测试结果完全就是看你 `curl` 这个地址是否走了代理，如果在代理工具中配置了这个地址直连，那么得到的结果肯定还是真实的 `IP` 而不是代理服务器 `IP`，可以参考 [请问clashx怎么设置终端代理呢？](https://github.com/Dreamacro/clash/issues/592) 这个 `issue`，用 `curl -vv https://www.google.com` 来进行测试。

## 总结

这个新版本的 `v2ray` 的配置总结了我最近配置时候遇到的一些问题，按照这一套走下来应该是没有什么问题，如果你还有其他疑问，欢迎评论或者给我邮件。

## 参考文章

1. [新 V2Ray 白话文指南](https://guide.v2fly.org/advanced/wss_and_web.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%85%8D%E7%BD%AE '新 V2Ray 白话文指南')
2. [Linux CentOS7 开启80，443端口外网访问权限](https://blog.csdn.net/u011477914/article/details/88862041 'Linux CentOS7 开启80，443端口外网访问权限')
3. [开启或关闭SELinux](https://help.aliyun.com/document_detail/157022.html '开启或关闭SELinux')
