---
title: '购买 Bandwagon 的 VPS 并配置 Shadowsocks'
publishDate: '2018-09-06 12:00:00'
description: ''
tags:
  - assorted
  - 奇技淫巧
language: '中文'
heroImage: { 'src': './shadowsocks.jpg', 'color': '#B4C6DA' }
draft: true
---

> **_目前 `bandwagon` 已经下架了 `19.9` 刀 的 `VPS` 了，最便宜的 `49.9` 刀，这么高的价格不如直接买比较好的 `VPN` 了，想买的同学只能等等有没有活动了。_**

## 2019.10.29更新

国庆前一个星期，两台服务器的 `IP` 都被封了，这两天终于解封了，不过用了两三天，发现有一台服务器又不能使用了，不过这次用下面的链接查询，`IP` 并没有被封，于是上[站长之家-ping检测](http://ping.chinaz.com/ '站长之家-ping检测')检测了一下 `IP` 发现 `ping` 通没问题，`ssh` 连接服务器也没问题，遇到这种情况一般就是 `ss` 的端口被封了，就是写在 `shadowsocks.json` 中的端口配置，这时候只要把配置中的端口换一个，然后重启一下服务 `systemctl restart shadowsocks` 就可以用了。最后还是希望上面的网稍微松一点，不然大家都没得玩，虽然 `VPN` 一直都可以用，不过还是代理方便。

## 2019.9.17更新

为了减少 `IP` 被墙的风险，最好是选择 `aes-256-gcm` 的加密方式，这就要安装最新的 `ss` 版本，安装方法如下：

```bash
# 可以直接覆盖原来的版本，不需要手动卸载
pip install https://github.com/shadowsocks/shadowsocks/archive/master.zip -U
```

另外有一点需要注意的是，在执行 `systemctl enable shadowsocks.service` 的时候可能会遇到 `bad message` 的报错，这时候大概率是因为 `/etc/systemd/system/shadowsocks.service` 文件有问题，在复制粘贴的时候，在 `vim` 中很可能会掉几个字符，检查一下。

最后在提醒一句的是，如果发现 `IP` 被墙了，不要急着去换 `IP` 这也是 `bandwagonHost` 建议的，等几天看看，`GFW` 的 `blocklist` 会更新的，现在已经没有免费换 `IP` 的服务了。如果发现 `ss` 一直连接不上，想知道自己的 `IP` 是不是被 `ban` 了，登录自己的 `KiwiVM` 控制台，然后打开这个链接 [GFW-blacklistcheck](https://kiwivm.64clouds.com/main-exec.php?mode=blacklistcheck 'GFW-banlistcheck')。

## 前言

我之前科学上网都是通过直接购买 `VPN` 服务提供商的产品来做了，虽然也知道可以买境外的 `VPS` 来搭建 `SS`，但是一方面是觉得麻烦，一方面是觉得没必要，`SS` 的成本比较低，但是我一直觉得没有免费的午餐，`VPN` 供应商也不是傻子，能卖出价格肯定是有道理的。当然还有个主要的原因是我用的 `VPN` 这么久没出现过任何问题，体验也非常好（除了在十八大的时候偶尔会连不上），全平台支持，现在在对应的路由器上也能安装了，价格是贵了点，不过我觉得还是物有所值的，想了解的朋友可以点击[ExpressVPN](https://www.expressvpn.com/ 'ExpressVPN')。话题扯远了，今天我尝试了一下 `SS`，速度还可以，服务端安装好之后就可以在客户端访问了，安装过程也很简单，下面就来和大家分享一下。

## 购买境外 VPS 搭建 SS Server 端

关于SS的原理就不过多赘述了，如果感兴趣的同学可以看[这里](http://www.chinagfw.org/2016/01/shadowsocks_26.html '这里')，想让你能够通过SS客户端绕过 `GFW` 访问墙外的世界，那么你首先要做的就是购买一台境外的 `VPS`，然后部署好 `SS` 的服务端。关于购买 `VPS` 的问题，我购买的是 `BandwagonHost` 的 `VPS`，一年 `19.9` 刀，每个月 `500G` 的流量，基本够用了，用优惠码的话可以打 `9.35` 折，优惠码 `google` 就可以，购买的细节就不多说了，`Bandwagon` 是支持 `alipay` 和 `paypal` 的，对国内的用户还是蛮友好的。购买成功后点击 `service`，见图：

![vps](./images/VPS.png 'vps')

然后点击 `KiwiVM Control Panel` 进入 `VPS` 的控制台，在 `Main Controls` 页面看到 `VPS` 的基本状态，默认安装的系统是 `centos6_x86_bbr`，如果你想更换系统，就先 `stop` 你的 `VPS` 然后进入 `install new OS` 选择自己喜欢的系统安装，速度很快，注意重新安装好系统后会更改 `VPS` 的端口。下面就是远程链接 `VPS` 了，默认的 `root` 用户的密码是随机生成的，在 `root password modification` 中可以重新生成，有了密码后我们就可以登录，`windows` 下用 `Xshell`，`mac` 或者 `linux` 直接 `ssh` 登录依旧可以了，输入 `IP`，端口，用户名密码。连接上 `VPS` 以后如果你觉得随机生成的密码难记，那么你可以在命令行中输入`passwd`来设置自己的密码。

![panel](./images/panel.png 'panel')

下面开始安装 `SS`，由于本文使用的 `python` 版本的 `SS`，所以要先安装 `python` 的包管理工具 `pip`：

```bash
curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
python get-pip.py
```

安装 `SS`：

```bash
pip install --upgrade pip
pip install shadowsocks
```

安装完成后，我们需要创建 `SS` 的配置文件 `/etc/shadowsocks.json`：

```json
{
  "server": "0.0.0.0",
  "server_port": 8388,
  "password": "uzon57jd0v869t7w",
  "method": "aes-256-cfb"
}
```

参数说明：

- `method`：加密方式，可取值非常多，包括不限于（`aes-128-cfb`, `aes-192-cfb`, `aes-256-cfb`, `aes-128-gcm`, `aes-192-gcm`, `aes-256-gcm`，`bf-cfb`，`cast5-cfb`, `des-cfb`, `rc4-md5`, `chacha20`, `salsa20`, `rc4`, `table`）至于那种加密方式好我也不太清楚，比较推荐的是 `aes-256-gcm` 、`chacha20-ietf-poly1305`、`aes-128-gcm`、`aes-192-gcm`，不过要注意的是 `gcm` 和 `chacha20` 的加密方式很多`SS` 实现不支持，根据实际情况自己选择。
- `server_port` : 服务器监听端口，自己设置。
- `password` ：`Client` 连接 `Server` 的密码。

配置 `SS` 的自启动 新建启动脚本文件`/etc/systemd/system/shadowsocks.service`：

```bash
[Unit]
Description=Shadowsocks
[Service]
TimeoutStartSec=0
ExecStart=/usr/bin/ssserver -c /etc/shadowsocks.json
[Install]
WantedBy=multi-user.target
```

启动 `SS` 服务并设置开机启动：

```bash
systemctl enable shadowsocks.service #设置开机启动
systemctl start shadowsocks.service  #启动服务
systemctl status shadowsocks.service #检查服务状态
```

若看到绿色的`Active: active (running)`则表示服务启动成功。

若觉得麻烦，还可以使用一键安装脚本（已测试过，没问题）

```bash
wget — no-check-certificate -O shadowsocks.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks.sh
chmod +x shadowsocks.sh
./shadowsocks.sh 2>&1 | tee shadowsocks.log
```

## 安装 Shadowsocks 客户端

`SS` 客户端全平台都有，这里跟大家说一下，`windows`，`mac`，`iphone` 的经过我测试可用的客户端。

- `windows10` ： [shadowsocks-windows](https://github.com/shadowsocks/shadowsocks-windows/releases 'shadowsocks-windows')
- `mac`： [shadowsocksX-NG](https://github.com/shadowsocks/ShadowsocksX-NG/releases 'shadowsocksX-NG')
- `iphone` ：`shadowrocket`（在 `app store`下载即可，付费 `12￥`）

最后说一下 `centos`，目前[Shadowsocks](https://github.com/shadowsocks/shadowsocks/releases 'Shadowsocks')在 `github` 上提供的最新的正式版本是 `2.9.1`，但是这个版本有个问题就是不支持 `gcm` 的加密方式，有一个非正式的 `3.0.0` 版本，我试了一下，虽然支持了 `gcm` 但是在安装完成后进行 `curl` 测试的时候一直返回错误，所以我就放弃了。也有建议使用[shadowsocks-libev](https://github.com/shadowsocks/shadowsocks-libev 'shadowsocks-libev')的，我没有尝试，后面有时间会试一下，有兴趣的同学自己试试。

## 更新 Linux 安装 SS 客户端

上面提到由于目前 `Github` 上正式上线的 `2.9.1` 版本不支持gcm的加密方式，我们需要先安装 `3.0.0` 版本

```bash
pip install --upgrade git+https://github.com/shadowsocks/shadowsocks.git@master
```

安装成功后添加 `SS` 的配置文件

```bash
sudo mkdir /etc/shadowsocks
sudo vi /etc/shadowsocks/shadowsocks.json
```

具体配置如下

```json
{
    "server":"1.1.1.1", #SS服务端的IP地址
    "server_port":1035, #SS服务端的端口
    "local_address": "127.0.0.1", #本地IP
    "local_port":1080, #本地端口
    "password":"password", #你设置的服务端密码
    "timeout":300,
    "method":"aes-256-cfb", #服务端加密方式
    "fast_open": false, 开启fast_open以降低延迟，但要求Linux内核在3.7+。开启方法 echo 3 > /proc/sys/net/ipv4/tcp_fastopen
    "workers": 1 线程数
}
```

在系统中添加 `SS` 服务，文件位置为`/etc/systemd/system/shadowsocks.service`

```bash
[Unit]
Description=Shadowsocks
[Service]
TimeoutStartSec=0
ExecStart=/usr/bin/sslocal -c /etc/shadowsocks/shadowsocks.json
[Install]
WantedBy=multi-user.target
```

启动服务并设置开机启动

```bash
systemctl enable shadowsocks.service
systemctl start shadowsocks.service
systemctl status shadowsocks.service
```

启动服务后验证客户端是否运行正常： `curl --socks5 127.0.0.1:1080 http://httpbin.org/ip`

如果客户端正常运行将显示如下信息

```json
{
  "origin": "x.x.x.x"       #你的Shadowsock服务器IP
}
```

现在我们安装的SS客户端已经能够正常工作但它是 `socks5` 代理，我门在 `shell` 里执行的命令，发起的网络请求现在还不支持 `socks5` 代理，只支持 `http／https` 代理。为了我门需要安装 `privoxy` 代理，它能把电脑上所有 `http` 请求转发给 `shadowsocks`。

安装 `privoxy`： `sudo yum -y install privoxy`

启动 `privoxy` 并设置开机启动

```bash
systemctl enable privoxy
systemctl start privoxy
systemctl status privoxy
```

修改 `privoxy` 配置文件 `/etc/privoxy/config` ： `vim /etc/privoxy/config`，在其中搜索如下两行，第二行需要把注释去掉并改为上面设置的端口

```bash
listen-address 127.0.0.1:8118 # 8118 是默认端口，不用改
forward-socks5t / 127.0.0.1:1080 . #转发到本地端口
```

设置 `http/https` 代理，修改 `/etc/profile`，添加如下两行

```bash
export http_proxy=http://127.0.0.1:8118 #端口要与刚刚设置的privoxy的配置文件中的端口一致
export https_proxy=http://127.0.0.1:8118
```

让修改的环境变量生效： `source /etc/profile`

测试是否成功

```bash
[root@aniu-k8s ~]# curl -I www.google.com
HTTP/1.1 200 OK
Date: Fri, 26 Jan 2018 05:32:37 GMT
Expires: -1
Cache-Control: private, max-age=0
Content-Type: text/html; charset=ISO-8859-1
P3P: CP="This is not a P3P policy! See g.co/p3phelp for more info."
Server: gws
X-XSS-Protection: 1; mode=block
X-Frame-Options: SAMEORIGIN
Set-Cookie: 1P_JAR=2018-01-26-05; expires=Sun, 25-Feb-2018 05:32:37 GMT; path=/; domain=.google.com
Set-Cookie: NID=122=PIiGck3gwvrrJSaiwkSKJ5UrfO4WtAO80T4yipOx4R4O0zcgOEdvsKRePWN1DFM66g8PPF4aouhY4JIs7tENdRm7H9hkq5xm4y1yNJ-sZzwVJCLY_OK37sfI5LnSBtb7; expires=Sat, 28-Jul-2018 05:32:37 GMT; path=/; domain=.google.com; HttpOnly
Transfer-Encoding: chunked
Accept-Ranges: none
Vary: Accept-Encoding
Proxy-Connection: keep-alive
```

需要注意的是，`ss` 代理是基于 `tcp` 或者 `udp` 协议，而 `ping` 是走的 `icmp` 协议，因此在 `ss` 下不能 `ping` 通 `google`。

再补充一点，目前 `linux` 上的客户端不能开启 `PAC` 模式，只能是全局模式，我在阿里云遇到过开启 `SS` 后 `yum` 连不上阿里云的 `mirrors` 的情况，不过大部分时候正常，我是一直开着代理的，如果你想要关闭代理，只要把刚刚加在 `/etc/profile` 中的配置注释掉就可以了。

## 总结

总的来说配置 `SS` 的过程还是很流畅的，也很简单，基本没遇到什么问题，`VPS` 价格也很便宜，我试了一下，看 `youtube` 的 `1080p` 完全没压力，一个月 `500G` 的流量完全够用了，不过我发现开了 `SS` 以后打不开，开 `VPN` 可以，不知道什么原因。另外再提一点，我是个人使用所以没有配置多用户的 `SS`，如果想配置多用户的同学可以自己去 `google` 一下，我看了一下，也很简单。
