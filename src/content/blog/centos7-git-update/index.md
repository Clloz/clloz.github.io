---
title: 'CentOS7更新git版本'
publishDate: '2019-05-03 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
---

## 前言

今天在服务器上部署代码的时候，发现服务器上的 `git` 版本非常老，是 `git 1.8.0`，于是就把 `git` 的版本更新到了最新的 `2.21.0`。

## 更新步骤

## 卸载旧版本

```bash
yum remove git -y
```

## 安装依赖

```bash
yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel asciidoc gcc perl-ExtUtils-MakeMaker -y
```

## 编译安装libiconv

```bash
wget http://ftp.gnu.org/pub/gnu/libiconv/libiconv-1.15.tar.gz
tar zxvf libiconv-1.15.tar.gz
cd libiconv-1.15
./configure --prefix=/usr/local/libiconv
make && make install
```

## 下载安装最新版本git

下载地址：[release](https://github.com/git/git/releases 'release')

```bash
wget https://github.com/git/git/archive/v2.21.0.tar.gz
tar xzvf v2.17.0.tar.gz
cd git-2.17.0
make configure
./configure --prefix=/usr/local/git --with-iconv=/usr/local/libiconv
make install
```

## 配置环境变量

```bash
echo "export PATH=$PATH:/usr/local/git/bin" >> /etc/profile
source /etc/profile

echo "export PATH=$PATH:/usr/local/git/bin" >> /etc/bashrc
source /etc/bashrc
```

完成上面的步骤就已经可以用 `git --version` 看到最新版本的 `git` 安装好了。
