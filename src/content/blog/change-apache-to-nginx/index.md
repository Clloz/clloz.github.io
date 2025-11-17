---
title: '更换 Apache 到 Nginx'
publishDate: '2020-09-10 12:00:00'
description: ''
tags:
  - server
  - 建站知识
language: '中文'
heroImage: { 'src': './nginx.png', 'color': '#B4C6DA' }
---

## 前言

将服务器上的 `Apache` 升级到 `2.4.46` 后，内充占用率飙涨，改了 `MaxConnectionPerChild` 配置到 `50` 也不见效。`2G` 的内存占用率已经超过 `90`，`Apache` 吃掉了差不多 `1G` 内存。`systemctl restart httpd` 以后，很快又把内存吃回去。虽然一直都遇到内存占用的问题，但之前没有这么严重，也就凑活着用了。每次想换 `nginx` 都觉得太折腾就作罢。现在这情况只能强行折腾了，服务器都卡的用不了了。下面分享一下更换 `web` 服务器的过程。

## 过程

其实过程也比较简单，停了 `apache`。

```bash
systemctl stop httpd
systemctl disable httpd
```

安装 `nginx`，直接用 `yum` 安装即可。启动并设置开机启动，同时确保 `php-fpm` 也启动了。

```bash
yum install nginx
systemctl start nginx
systemctl enable ninx
```

剩下的就是配置了，配置文件路径 `/etc/nginx/nginx.conf`。`nginx` 支持模块化的配置，你可以把不同功能的配置写到不同的文件里面，然后用 `include` 引入。单独的 `conf` 文件要放到 `/etc/nginx/conf.d` 文件夹里。如果你不想创建单独的文件，就把配置写在 `nginx.conf`文件夹里也可以，是一个 `server {}`。需要特别注意的是你的配置要写到 `include /etc/nginx/conf.d/*.conf` 这一句的 **前面**。我一开始就是看错成后面，白白乱折腾了一阵子。

然后 `nginx` 的配置其实还是比较好理解的，但是不支持 `.htaccess`。关于配置我这里就不细说了，我也就东拼西凑搞了个差不多的，目前看来基本能用了，有些问题可能后期使用中才能慢慢发现，这里就给大家贴一下我现在的配置。

```bash
server {
    #http重定向到https
    listen    80;
    listen [::]:80;
    server_name www.clloz.com clloz.com;
    return 301  https://$server_name$request_uri;
}
server {
    listen                  443 ssl http2;
    listen                  [::]:443 ssl http2;
    server_name             www.clloz.com clloz.com;

    #网站根目录
    root            /var/www/html;

    #https
    ssl_certificate         ssl/3793755_www.clloz.com.pem;
    ssl_certificate_key     ssl/3793755_www.clloz.com.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4; #使用此加密套件。
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #使用该协议进行配置。
    ssl_prefer_server_ciphers on;

    # 安全标头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-Xss-Protection 1;

    # 禁用目录列表
    autoindex off;

    # 限制请求次数
    #limit_req_zone $binary_remote_addr zone=WPRATELIMIT:10m rate=2r/s;
    #location ~ \wp-login.php$ {
    #    limit_req zone=WPRATELIMIT;
    #}

    #隐藏 nginx 版本.
    server_tokens off;

    #隐藏 PHP 版本
    fastcgi_hide_header X-Powered-By;
    proxy_hide_header X-Powered-By;

    # 禁止访问敏感文件
    location ~ /\.(svn|git)/* {
        deny all;
        access_log off;
        log_not_found off;
    }
    location ~ /\.ht {
        deny all;
        access_log off;
        log_not_found off;
    }
    location ~ /\.user.ini {
        deny all;
        access_log off;
        log_not_found off;
    }

    # 禁止直接访问php文件
#    location ~* /(?:uploads|files|wp-content|wp-includes|akismet)/.*.php$ {
#       deny all;
#       access_log off;
#       log_not_found off;
#    }

    #固定链接交给php-fpm处理
    location / {
        index index.php index.html index.htm;
        try_files $uri $uri/ /index.php?$args;
    }

    # 禁止访问指定类型文件
    location ~ \.(ini|conf)$ {
        deny all;
    }

    # 允许内部分  wp-includes 目录的 .php 文件
    location ~* ^/wp-includes/.*\.(php|phps)$ {
        internal;
    }

    #禁止访问 wp-config.php install.php 文件
    location = /wp-config.php {
        deny all;
    }
    location = /wp-admin/install.php {
        deny all;
    }


    # 禁止访问 /wp-content/ 目录的 php 格式文件 (包含子目录)
    location ~* ^/wp-content/.*.(php|phps)$ {
        deny all;
    }
    # 固定连接的php处理
    location ~* ^/s/.*.(php|phps)$ {
        #deny all;
    return 404;
    }
    location ~* ^/programming/.*.(php|phps)$ {
        #deny all;
    return 404;
    }
    location ~* ^/essay/.*.(php|phps)$ {
        #deny all;
    return 404;
    }
    location ~* ^/sweets/.*.(php|phps)$ {
        #deny all;
    return 404;
    }
    location ~* ^/links/.*.(php|phps)$ {
        #deny all;
    return 404;
    }
    location ~* ^/abouts/.*.(php|phps)$ {
        #deny all;
    return 404;
    }

    location ~* /(?:uploads|files|wp-content|wp-includes|akismet)/.*.php$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    # 错误页面设置
    error_page 403 /403.html;
    location = /403.html {
        root /etc/nginx/error_pages;
        internal;
    }
    error_page 404 /404.html;
    location = /404.html {
        root /etc/nginx/error_pages;
        internal;
    }
    error_page 500 /500.html;
    location = /500.html {
        root /etc/nginx/error_pages;
        internal;
    }
    error_page 503 /503.html;
    location = /503.html {
        root /etc/nginx/error_pages;
        internal;
    }


    location ~ .php$ {
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
}
```

还有一个没有解决的问题就是，`php` 类型的 `url` 都交给 `php-fpm` 处理，当找不到 `url` 的时候，`php-fpm` 会直接返回一个 `file not found`。我们在 `nginx` 中设置的 `404` 页面也不会显示。我本来想看看 `php-fpm` 能不能设置默认 `404` 页面的，不过没找到方法。`nginx` 这边也没设么很好的处理方法，我最后的解决办法就是用 `location` 来过滤固定链接，只要检测到是固定链接，同时路径是以 `php` 结束的直接返回 `404`，固定链接一共也就几种(取决于你有几个一级分类目录)。这个方法有一个瑕疵就是根目录下的以 `php` 结尾的路径无法过滤，因为根目录下有些 `php` 是要访问的，我们没法一刀切。不过目前也没有找到其他的好办法，就先这样吧，问题也不大。

**更新**：根目录下路径下的 `php` 结尾的路径我用正则表达式 `^/(?!(wp-|xmlrpc))[^/]*php$` 进行了处理，把除了 `wp-` 开头的和 `index.php`，`xmlrpc.php` 以外的全部过滤了。除了 `wp-content`，`wp-includes`，`wp-admin` 路径下，其他的带 `/` 的路径访问 `php` 都直接返回 `404`，正则表达式为 `^/(?!wp-content|wp-includes|wp-admin|editormd).*/.*php$`。

这里顺便说一下 `location` 配置指令格式为：`location [ = | ~ | ~* | ^~ ] uri {...}`。这里的 `uri` 分为标准 `uri` 和正则 `uri`，两者的唯一区别是 `uri` 中是否包含正则表达式。`uri` 前面的方括号中的内容是可选项，解释如下：

- `=` ：用于标准 `uri` 前，要求请求字符串与 `uri` 严格匹配，一旦匹配成功则停止
- `~` ：用于正则 `uri` 前，并且区分大小写
- `~*` ：用于正则 `uri` 前，但不区分大小写
- `^~` ：用于标准 `uri` 前，要求 `Nginx` 找到标识 `uri` 和请求字符串匹配度最高的 `location` 后，立即使用此 `location` 处理请求，而不再使用 `location` 块中的正则 `uri` 和请求字符串做匹配

由于我只是更换 `web` 服务器，所以还算比较简单，如果你是从头安装，那么你可以看我之前的文章，或者参考腾讯云的这篇教程：[手动搭建 LNMP 环境（CentOS 7）](https://cloud.tencent.com/document/product/213/38056 '手动搭建 LNMP 环境（CentOS 7）')

**更新**内存占用的主要原因是 `php-fpm` 进程过多，配置一下 `/etc/php-fpm.d/www.conf`。

```bash
pm = dynamic #指定进程管理方式，有3种可供选择：static、dynamic和ondemand。
pm.max_children = 16 #static模式下创建的子进程数或dynamic模式下同一时刻允许最大的php-fpm子进程数量。
pm.start_servers = 10 #动态方式下的起始php-fpm进程数量。
pm.min_spare_servers = 8 #动态方式下服务器空闲时最小php-fpm进程数量。
pm.max_spare_servers = 16 #动态方式下服务器空闲时最大php-fpm进程数量。
pm.max_requests = 2000 #php-fpm子进程能处理的最大请求数。
pm.process_idle_timeout = 10s
request_terminate_timeout = 120
```

我是将 `max_spare_servers` 设置为 `10`，这样最多同时存在 `10` 个 `php-fpm`。
