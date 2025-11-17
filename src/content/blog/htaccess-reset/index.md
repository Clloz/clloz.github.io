---
title: 'WordPress重置.htaccess文件'
publishDate: '2018-10-23 12:00:00'
description: ''
tags:
  - wordpress
  - 实用技巧
  - 建站知识
language: '中文'
heroImage: { 'src': './apache.png', 'color': '#B4C6DA' }
---

## 前言

在博客启用 `https` 协议以及设置 `errorpages` 完成后，遇到过多次 `https` 强制跳转不生效，`errorpages` 不跳转的情况，一开始以为是自己的 `rewrite` 配置有问题，后来发现是 `wordpress` 重置了我的 `.htaccess` 文件。

## 解决方法

只要在 `wordpress` 后台点击了`Settings`中的固定链接菜单， `Wordpress` 就会重置服务器根目录下的`.htaccess`文件中的 `wordpress` 部分，如下：

```bash
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

如果把自己的配置写在`BEGIN WordPress`和`END WordPress`之间的话每次点击固定链接，都会被重置，所以解决方法就是吧我们自定的配置写到 `Wordpress` 之外即可，如下：

```bash
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteCond %{SERVER_PORT} 80
RewriteRule ^(.*)$ https://www.clloz.com/$1 [R=301,L]
RewriteRule . /index.php [L]
ErrorDocument 403 /403.html
ErrorDocument 404 /404.html
</IfModule>

# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```
