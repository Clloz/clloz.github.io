---
title: 'Mac安装php环境'
publishDate: '2019-04-09 12:00:00'
description: ''
tags:
  - php
  - 实用技巧
language: '中文'
heroImage: {"src":"./php.jpeg","color":"#B4C6DA"}
---

\[toc\]

## 前言

`wordpress` 有一个音乐插件，直接把结果字符串返回到页面上，导致 `Google Console Search` 报错，说该页面在移动端显示不正常，虽然我把 `wp-content` 里的大部分文件禁止访问了，但是这个 `php` 文件如果禁止访问的话，这个插件就无法获取歌曲列表。所以只能从另一个角度解决了，就是看看能不能修改一下文件，虽然我对 `php` 一窍不通，不过试试也无妨，这个插件应该也不复杂，先来装一下 `mac` 的 `php` 环境。

## apache，php，mysql

`apache` 和 `php` `mac` 系统都自带了，我们只要进行相应的配置就可以了。 `apache` 的配置文件路径在 `/etc/Apache2/http.conf`，默认端口号为 `80`，默认部署路径在 `/Library/WebServer/Documents`，修改或添加路径的方法后面再写，现在直接启动 `apache`：

> `sudo apachectl start`

要开启php的功能，在 `apache` 的配置文件中将 `#LoadModule php5_module libexec/apache2/libphp7.so` 前面的 `#` 去掉，默认应该就是去掉的。

现在你只要在部署目录中新建一个 `index.php`:

```php
<?php
    phpinfo();
?>
```

然后在浏览器中访问 `localhost` 就可以看到你的 `php-info`了。

## mysql

`Mac` 没有内置 `mysql`，用 `homebrew` 安装：

> `brew install mysql`

`mysql` 服务的开启，关闭与重启：

```bash
mysql.server start
mysql.server stop
mysql.server restart
```

因为 `brew` 安装有很多默认配置，你要初始化一下设置一下自己的初始设置： `mysql_secure_installation` 根据提示输入就可以了，设置完成后就可以 `mysql -u root -p` 登录了。

## 修改或者配置 apache 目录

## 修改网站根目录

直接修改 `/etc/apache2/httpd.conf` 中的对应路径到你需要的路径

```bash
DocumentRoot "/Library/WebServer/Documents"
<Directory "/Library/WebServer/Documents">
```

## 添加个人目录

- 创建个人目录 > `mkdir ~/Sites`
- 修改user.conf配置 > `sudu vim /etc/apache2/users/username.conf` 此处的username是你的用户名，没有该文件就自己创建，在其中输入如下内容

```php
<Directory "/Users/username/Sites/">
    Options Indexes MultiViews
    AllowOverride All
    Order allow,deny
    Allow from all
</Directory>
```

- 修改`httpd.conf` > `sudo vim /etc/apache2/httpd.conf` ,找到下面这些内容，去掉前面的注释 `#`。

```php
LoadModulephp5_module libexec/apache2/libphp5.so
LoadModule authz_core_module libexec/apache2/mod_authz_core.so
LoadModule authz_host_module libexec/apache2/mod_authz_host.so
LoadModule userdir_module libexec/apache2/mod_userdir.so
Include /private/etc/apache2/extra/httpd-userdir.conf
```

- 修改`sudo vim /etc/apache2/extra/httpd-userdir.conf`
    
    > 去掉 `Include /private/etc/apache2/users/*.conf` 前面的注释 `#`。
    
- 修改`/etc/apache2/httpd.conf`
    

```php
<Directory />
    AllowOverride none
    Require all denied
</Directory>
#修改为：
<Directory />
    AllowOverride none
    Require all granted
</Directory>
```

现在重启 `apache` `sudo apachectl restart`,然后在浏览器访问 `localhots/~username`，看到页面显示 `It works!` 说明配置成功。

## 配置 Xdebug

`Xdebug` 是 `php` 的一个扩展，可以用来调试 `php` ，如果你不知道安装哪个版本，可以复制自己的 `php-info` 到 `Xdebug` 的网站[https://xdebug.org/wizard.php](https://xdebug.org/wizard.php "https://xdebug.org/wizard.php")，它会告诉你安装哪个版本以及安装步骤。 1. Download `xdebug-2.7.1.tgz` 2. Install the pre-requisites for compiling PHP extensions. These packages are often called `php-dev`, or `php-devel`, `automake` and `autoconf`. 3. Unpack the downloaded file with `tar -xvzf xdebug-2.7.1.tgz` 4. Run: `cd xdebug-2.7.1` 5. Run: `phpize`

```bash
As part of its output it should show:

Configuring for:
...
Zend Module Api No:      20160303
Zend Extension Api No:   320160303
If it does not, you are using the wrong phpize. Please follow this FAQ entry and skip the next step.
```

6. Run: `./configure`
7. Run: `make`
8. Run: `cp modules/xdebug.so /usr/lib/php/extensions/no-debug-non-zts-20160303`
9. Update `/etc/php.ini` and change the line `zend_extension = /usr/lib/php/extensions/no-debug-non-zts-20160303/xdebug.so`
10. Restart the webserver

## 安装过程中的问题

1. `/usr` 的权限问题，也就是一直报错 `permission denied`，请看这篇[mac无法写入到/usr](https://www.clloz.com/programming/assorted/2019/04/09/sip/ "mac无法写入到/usr")
2. 第二点要提前安装的扩展要安装，另外还要安装 `command line tool`，安装指令 `xcode-select --install`，如果提示 `ln: /usr/include: Operation not permitted`，可以在安装好后 `command line tool`输入以下命令 `sudo installer -pkg /Library/Developer/CommandLineTools/Packages/macOS_SDK_headers_for_macOS_10.14.pkg -target /`
3. `php.ini` 需要添加 `xdebug.remote_enable = 1 xdebug.remote_autostart = 1` 两项配置才能远程调试，在 `vscode` 中配合 `php-debug` 来实现断点调试。

## 总结

环境的搭建很少能够遇到一路到底什么问题都没有的，因为每台机器状况都不同，多多少少总会遇到点问题，不过只要用好 `Google`，找好关键词，学好英语，不急不躁，问题都很好解决，无非就是多花点时间。