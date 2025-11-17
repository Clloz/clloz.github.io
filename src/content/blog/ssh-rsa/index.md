---
title: 'SSH简介和使用'
publishDate: '2019-10-02 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
heroImage: { 'src': './ssh.png', 'color': '#B4C6DA' }
---

## 前言

`ssh` 是 `Secure Shell` 的缩写，是应用层上的协议，主要是保证远程登录的安全。我们使用 `GitHub` 以及登录远程服务器都经常需要使用 `ssh`，这篇文章简单介绍一下 `ssh` 和使用方法。`ssh` 有多种实现，一般我们使用的是免费开源的 `openssh`。

## ssh 基本原理

传统的网络服务程序，如FTP、Pop和Telnet其本质上都是不安全的；因为它们在网络上用明文传送数据、用户帐号和用户口令，很容易受到中间人（`man-in-the-middle`）攻击方式的攻击。就是存在另一个人或者一台机器冒充真正的服务器接收用户传给服务器的数据，然后再冒充用户把数据传给真正的服务器。为了解决这个问题，`ssh` 协议提供了两种身份验证方式，都是使用非对称加密，关于非对称加密的内容可以看我的这篇文章[HTTPS](https://www.clloz.com/programming/network/2019/05/02/https 'HTTPS')。一般我们把被登录的服务器称为服务端，而请求登录的机器称为客户端。

1. 基于口令的安全验证：只要你知道自己帐号和口令，就可以登录到远程主机。所有传输的数据都会被加密，但是不能保证你正在连接的服务器就是你想连接的服务器。可能会有别的服务器在冒充真正的服务器，也就是受到“中间人”这种方式的攻击。
2. 在客户端生成公钥和私钥，然后将公钥储存到服务端。当客服端请求连接到SSH服务器时，客户端软件就会向服务器发出请求，请求用你的密匙进行安全验证。服务器收到请求之后，先在该服务器上你的主目录下寻找你的公用密匙，然后把它和你发送过来的公用密匙进行比较。如果两个密匙一致，服务器就用公用密匙加密“质询”（`challenge`）并把它发送给客户端软件。客户端软件收到“质询”之后就可以用你的私人密匙解密再把它发送给服务器。

口令登录的过程大概如下：

- 远程 `Server` 收到 `Client` 端用户的登录请求，`Server` 把自己的公钥发给用户。
- `Client` 使用这个公钥，将密码进行加密。
- `Client` 将加密的密码发送给 `Server` 端。
- 远程 `Server` 用自己的私钥，解密登录密码，然后验证其合法性。
- 若验证结果，给 `Client` 相应的响应。

这种登录方式的风险是我们不知道现在响应我们的是不是目标服务器，如果一个攻击者中途拦截 `Client` 的登录请求，向其发送自己的公钥，`Client` 端用攻击者的公钥进行数据加密。攻击者接收到加密信息后再用自己的私钥进行解密，不就窃取了 `Client` 的登录信息了吗？这就是所谓的中间人攻击。所以我们使用口令登录的方式第一次登录的时候客户端会出现如下提醒：

```bash
The authenticity of host 'ssh-server.example.com (12.18.429.21)' can't be established.
RSA key fingerprint is 98:2e:d7:e0:de:9f:ac:67:28:c2:42:2d:37:16:58:4d.
Are you sure you want to continue connecting (yes/no)?
```

当你输入 `yes` 的时候，就会出现如下信息：

```bash
Warning: Permanently added 'ssh-server.example.com,12.18.429.21' (RSA) to the list of known hosts. Password: (enter password)
```

告诉你该 `host` 已被确认，并被追加到文件 `known_hosts` 中，以后你就可以正常使用口令登录了。

公钥登录的过程大概如下：

- `Client` 将自己的公钥存放在 `Server` 上，追加在文件 `authorized_keys` 中。
- `Server` 端接收到 `Client` 的连接请求后，会在 `authorized_keys` 中匹配到 `Client` 的公钥 `pubKey`，并生成随机数 `R`，用 `Client` 的公钥对该随机数进行加密得到 `pubKey(R)`，然后将加密后信息发送给 `Client`。
- `Client` 端通过私钥进行解密得到随机数 `R` ，然后对随机数R和本次会话的 `SessionKey` 利用 `MD5` 生成摘要 `Digest1`，发送给 `Server` 端。
- `Server` 端会也会对`R` 和 `SessionKey` 利用同样摘要算法生成 `Digest2`。
- `Server`端会最后比较 `Digest1` 和 `Digest2` 是否相同，完成认证过程。

这个过程看起来有点复杂，还是建议线看一下文章[HTTPS](https://www.clloz.com/programming/network/2019/05/02/https 'HTTPS')中的非对称加密的知识。这种方式在网络上传递的只有公钥，所以是相对来说安全很多的。并且免去了我们每次登录都要输入密码的麻烦，也很方便。

在 `~/.ssh` 文件夹中一般会出现四种文件

1. `id_rsa`：保存私钥
2. `id_rsa.pub`：保存公钥
3. `authorized_keys`：保存已授权的客户端公钥 **注意，该文件在服务器的 .ssh 文件夹中默认没有，需要自己创建，需要给该文件 600 的权限，否则可能出现 ssh 无法登录的情况**
4. `known_hosts`：存储是已认证的远程主机 `host key`，每个 `SSH Server` 都有一个 `secret`, `unique ID`, 叫做 `host key`。

每次 `Client` 向 `Server` 发起连接的时候，不仅仅 `Server` 要验证 `Client` 的合法性，`Client` 同样也需要验证 `Server` 的身份，`SSH client` 就是通过 `known_hosts` 中的 `host key` 来验证`Server` 的身份的。

## 安装使用

## 安装 ssh

`Mac` 默认就安装了 `ssh` 的客户端和服务端，不过服务端默认是关闭的，开启和关闭的命令如下，不过一般我们是不需要开启的。

```bash
#启动服务：
sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist

#停止服务：
sudo launchctl unload -w /System/Library/LaunchDaemons/ssh.plist

#查看服务器状态：
sudo launchctl list | grep sshd
#0   com.openssh.sshd 开启成功
```

其他的环境安装都大同小异，我就用 `CentOS` 举个例子。

```bash
#查看是否已经安装ssh-server
rpm -qa | grep ssh #看看有没有openssh-server

#安装
yum install -y openssl openssh-server

#开启PermitRootLogin，RSAAuthentication，PubkeyAuthentication
vim /etc/ssh/sshd_config

#启动ssh的服务：
systemctl start sshd.service

#设置开机自动启动ssh服务
systemctl enable sshd.service

#查看ssh服务是否开启
ps -e | grep sshd

#设置文件夹访问权限
$ cd ~
$ chmod 700 .ssh
$ chmod 600 .ssh/*
```

## 使用

`Mac` 默认已经安装了 `ssh-keygen` 和 `ssh-copy-id`，如果这两个命令不能使用，请安装。

```bash
#在客户端生成密钥对
ssh-keygen -t rsa -C "your_email@example.com" #一路回车即可，中间有一个设置私钥口令passphrase，直接回车设置为空即可

#将公钥复制到远程主机
ssh-copy-id root@1.1.1.1 #填入服务器的用户名和ip，当然你也可以手动复制文件到服务器
ssh user@remote -p port 'mkdir -p .ssh && cat >> .ssh/authorized_keys' < ~/.ssh/id_rsa.pub #没有安装ssh-copy-id的话这条命令也可以

#远程登录服务器
ssh root@1.1.1.1 #如果修改了默认的22端口，可以加入 -P 参数来指定端口
ssh 192.168.1.100      # 默认利用当前宿主用户的用户名登录
ssh omd@192.168.1.100  # 利用远程机的用户登录
ssh omd@192.168.1.100  -o stricthostkeychecking=no # 首次登陆免输yes登录
ssh omd@192.168.1.100 "ls /home/omd"  # 当前服务器A远程登录服务器B后执行某个命令
ssh omd@192.168.1.100 -t "sh /home/omd/ftl.sh"  # 当前服务器A远程登录服务器B后执行某个脚本

```

`ssh-keygen` 参数说明：

1. `-t`: 密钥类型, 可以选择 `dsa` | `ecdsa` | `ed25519` | `rsa`;
2. `-f`: 密钥目录位置, 默认为当前用户 `home` 路径下的 `.ssh` 隐藏目录, 也就是 `~/.ssh/`, 同时默认密钥文件名以 `id_rsa` 开头. 如果是 `root` 用户, 则在 `/root/.ssh/id_rsa`, 若为其他用户, 则在 `/home/username/.ssh/id_rsa`;
3. `-C`: 指定此密钥的备注信息, 需要配置多个免密登录时, 建议携带;
4. `-N`: 指定此密钥对应的密码, 如果指定此参数, 则命令执行过程中就不会出现交互确认密码的信息了.

在配置好 `ssh` 以后我们也可以用 `scp` 来传输文件了，具体的使用方法看这篇文章[Mac用scp上传或下载文件](https://www.clloz.com/programming/assorted/2019/04/09/mac-scp/ 'Mac用scp上传或下载文件')

## 总结

以上就是 `ssh` 的基础知识和使用方法了，对于 `GitHub` 的配置基本是一样的，将公钥复制到 `GitHub` 的设置中去即可。如果 `.ssh` 中有超过一对密钥，可以用 `config` 文件来配置，形式如下：

```bash
# --- Sourcetree Generated ---
Host Clloz-GitHub
    HostName github.com
    User Clloz
    PreferredAuthentications publickey
    IdentityFile /Users/clloz/.ssh/Clloz-GitHub
    UseKeychain yes
    AddKeysToAgent yes
# ----------------------------
```

## ssh 配置文件

`ssh` 的配置文件的位置是 `/etc/ssh/sshd_config`，其中有几个会用到的配置

```bash
# 是否允许用密码登录
PasswordAuthentication yes

#启用密钥验证
RSAAuthentication yes
PubkeyAuthentication yes
#指定公钥数据库文件
AuthorsizedKeysFile.ssh/authorized_keys
```

配置文件修改后要重启 `ssh` 服务后才能生效 `systemctl restart sshd`。

## ssh-agent

最后说一说 `ssh-agent`。一般我们在用 `ssh-keygen` 生成密钥的时候默认不给私钥设置 `passphrase`。如果你有安全需求，担心私钥泄露的风险，那么你可以为私钥设置密码，在创建密钥的时候可以使用 `-N passphrase` 来给生成的私钥设置密码，也可以用 `ssh-keygen -p` 来为已经生成的私钥设置或修改密码，如果你要取消密码也可以用这个命令，输入旧密码后新密码直接回车即可。

给私钥设置密码后，安全性是提高了，但是每次我们要用私钥进行登录的时候都需要手动输入一次密码，非常麻烦。`ssh-agent` 就能帮我们解决这个问题。它相当于一个代理，跟踪我们的私钥和私钥对应的 `passphrase`，当服务器请求私钥的时候，它会帮我们处理，我们也不用重复输入我们的密码了。

> `ssh-agent` 在 `mac` 和 `linux` 中默认是开机自动启动的，你可以用 `ps -ef | grep ssh-agent` 查看，如果没有可以使用 `eval "$(ssh-agent -s)"` 启动。

要让 `ssh-agent` 处理对应的私钥要用 `ssh-add` 将私钥加入。我们可以先用 `ssh-add -l` 先查看是否已经加入 `ssh-agent` 的管理，如果没有则使用 `ssh-add -K key_location` 来加入。`ssh-add` 有如下一下参数：

```bash
-D #删除ssh-agent中所有私钥(指纹)

-d key_file #删除指定私钥

-L #列出agent当前主机上所有公钥参数，即公钥文件中的内容

-l #列出agent当前已保存的指纹信息
```

在 `mac` 上我们还要为对应的私钥添加配置，配置文件的路径是 `~/.ssh/config`。

```bash
Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_rsa
```

如果你为你的私钥进行了独立的命名，将上面的 `id_rsa` 换成对应的名字即可。

---

`ssh-agent` 还有一个比较好用的功能，就是 `forwarding`。如果你有服务器 `a` 和 `b`，你用自己的电脑登录上了 `a`，现在又想到 `b` 上进行某个操作，你不想退出 `a` 也不想把密钥放到 `a` 上，那么你知道配置 `forwarding` 就能够在 `a` 上直接登录 `b`。只要在 `client， a， b` 上的 `~/.ssh/config` 里都加上如下配置即可。

```bash
Host *
　　ForwardAgent yes
```

关于 `ssh-agent` 的配置可以参考 [Github 帮助文档](https://docs.github.com/cn/free-pro-team@latest/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent 'Github 帮助文档') 还有 [配置SSH agent 和 SSH agent forwarding转发](https://www.fythonfang.com/blog/2017/12/27/ssh-agent-and-ssh-agent-forwarding '配置SSH agent 和 SSH agent forwarding转发')

## 参考文章

1. [图解ssh](https://www.cnblogs.com/diffx/p/9553587.html '图解ssh')
2. [Mac 启动 SSH](https://blog.csdn.net/wanglemao/article/details/88413573 'Mac 启动 SSH')
3. [CentOS7安装和配置SSH](https://www.cnblogs.com/liuhouhou/p/8975812.html 'CentOS7安装和配置SSH')
4. [Linux - 配置SSH免密通信 - “ssh-keygen”的基本用法](https://www.cnblogs.com/shoufeng/p/11022258.html 'Linux - 配置SSH免密通信 - “ssh-keygen”的基本用法')
5. [ssh的基本用法](https://zhuanlan.zhihu.com/p/21999778 'ssh的基本用法')
