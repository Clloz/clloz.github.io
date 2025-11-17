---
title: '网站的免费 https 证书申请和更新'
publishDate: '2021-03-21 12:00:00'
description: ''
tags:
  - server
  - 建站知识
language: '中文'
heroImage: { 'src': './nginx.png', 'color': '#B4C6DA' }
---

## 前言

网站的 `HTTPS` 现在基本已经是必须的了，不过对于个人网站而言，一年几百块的 `SSL` 证书显然是没有必要的，我们需要的是比较方便的免费证书。我之前一直是申请的阿里云的免费证书，不过阿里云的免费证书的有效期为一年，并且每次快过期了都要手动进行部署，修改 `nginx` 配置，比较麻烦。之前在 `V2Ray` 的配置中用了 `certbot` 来免费申请 `Let's Encrypt` 的证书，虽然有效期只要三个月，但是可以配置自动续签，所以还是比较方便的。本文就介绍以下配置过程。

## 配置

`Let's Encrypt` 是一家免费，开放，自动化的证书颁发机构，官方文档参考 [Let's Encrypt 快速入门](https://letsencrypt.org/zh-cn/getting-started/ "Let's Encrypt 快速入门")。`Let's Encrypt` 官方建议使用 `certbot` 来进行证书的获取。安装 `certbot` 需要先安装 `epel` 仓库，命令如下：

```bash
sudo yum install epel-release

sudo yum install certbot
```

安装完成后我们就可以运行 `certbot` 命令来获取证书了，`certbot` 命令的详细参数说明可以参考 [Certbot命令行工具使用说明](https://blog.ibaoger.com/2017/03/07/certbot-command-line-tool-usage-document/ 'Certbot命令行工具使用说明')。我们这里为我们的网站进行证书的申请主要是下面的命令：

```bash
certbot certonly --webroot -m youremail@email.com -w your-root-path -d your-domain.com
```

`certonly` 表示获取证书，但是不安装，我们手动进行配置。 `--webroot` 表示把身份认证文件放置在服务器的网页根目录下，这样可以让我们在更新证书的时候不用关闭 `nginx`。 `-m` 输入自己的邮箱用来接收 `Let's Encrypt` 的邮件，比如证书要过期了等。 `-d` 输入自己要申请帧数的域名，如果不输入会在命令执行后要你手动填，也可以选择跳过 `-w` 网站的根目录

生成好的证书文件路径如下：

```bash
/etc/letsencrypt/live/example.com/fullchain.pem
/etc/letsencrypt/live/example.com/privkey.pem
```

在我们的 `nginx` 配置文件中配置

```bash
ssl_certificate       /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key   /etc/letsencrypt/live/example.com/privkey.pem;
```

然后重启 `nginx` 就完成配置了。

你可以使用 `certbot certificates` 来查看你已经申请的证书信息，你也可以多次运行上面的命令为多个域名创建证书，如果要更新单个证书就重新运行创建证书的命令，如果要一次更新所有域名的证书可以使用 `certbot renew`。

## 自动更新证书

证书的自动更新需要安装 `crontabs`，安装命令如下

```bash
yum -y install vixie-cron

yum -y install crontabs
```

安装完成后 `service crond start` 启动 `crond` 服务，然后用 `crontab -e` 来创建自动更新的命令 `30 0 15 * * /usr/bin/certbot renew --post-hook "systemctl restart nginx" >> /var/log/le-renew.log`，该命令表示每个月 `15` 号的 `0:30` 执行 `certbot renew` 进行证书的更新，你也可以根据自己的需求写 `cron` 表达式，`--pre-hook` 和 `--post-hook` 则是证书更新前后的两个命令钩子，这里我们不需要像 [配置 v2ray 证书](https://www.clloz.com/programming/assorted/2019/11/24/v2ray-install-configuration/#_SSL '配置 v2ray 证书') 里面那样先停止自己的 `nginx`，因为那里我们没有一个真的 `web` 服务供 `Let's Encrypt` 进行检测，而是用 `certbot` `--standalone` 启动了一个独立的 `80` 端口服务来进行验证，这里我们有自己的 `nginx` 可以提供验证，所以不需要用 `--pre-hook` 先关闭 `nginx`。最好自己先执行以下 `certbot renew --dry-run` 来测试一下命令是否能正常运行。

还有一点需要注意的是，证书的默认有效期是 `90` 天，默认情况下只有有效期小于 `30` 天的时候才可以进行证书的更新，否则更新会失败。

## 遇到的问题

`2021-12-15` 收到 `Let's Encrypt` 的邮件说是证书还有一天就过期了，上服务器上执行 `certbot renew` 发现报错 `Failed to renew certificate with error: __str__ returned non-string`，在 `Let's Encrypt` [社区](https://community.letsencrypt.org/t/connection-error-on-acme-v02-api-letsencrypt-org/162393 '社区') 里找到类似的问题用 `pip` 安装 `urllib3` 和 `requests` 后由报了一个新的错误 `Failed to renew certificate with error: ("bad handshake: Error([('SSL routines', 'ssl3_get_server_certificate', 'certificate verify failed')],)",)`，没找到答案，最后只能按 [社区](https://community.letsencrypt.org/t/sslerror-ssl-certificate-verify-failed-certificate-verify-failed/162777/10 '社区') 里说的加上 `--no-verify-ssl` 参数，更新成功了。看情况应该是 `Let's Encrypt` 的什么证书过期了，暂时就先这么解决了。

尝试了如下这些方法，不过都没有效果： 1. [Old Let’s Encrypt Root Certificate Expiration and OpenSSL 1.0.2](https://www.openssl.org/blog/blog/2021/09/13/LetsEncryptRootCertExpire/ 'Old Let’s Encrypt Root Certificate Expiration and OpenSSL 1.0.2') 2. [Centos7 don't trust certificate issued by lets encrypt](https://serverfault.com/questions/791205/centos7-dont-trust-certificate-issued-by-lets-encrypt "Centos7 don't trust certificate issued by lets encrypt") 3. [Certbot 0.31.0 renew failed, peer’s certificate issuer not recognized](https://community.letsencrypt.org/t/certbot-0-31-0-renew-failed-peers-certificate-issuer-not-recognized/161771 'Certbot 0.31.0 renew failed, peer’s certificate issuer not recognized') 4. [Chain of Trust](https://letsencrypt.org/certificates/ 'Chain of Trust')

## 总结

以上就是配置 `Let's Encrypt` 证书并设置自动更新的方法了，如果有问题，欢迎留言讨论。
