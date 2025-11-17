---
title: 'Linux和Mac系统目录结构'
publishDate: '2019-10-08 12:00:00'
description: ''
tags:
  - operating-system
  - 实用技巧
language: '中文'
heroImage: { 'src': './macos.jpg', 'color': '#B4C6DA' }
---

## 前言

介绍一下 `Linux` 系统的目录结构，`MacOS` 的目录结构也类似。

## 目录结构

`/bin`：`bin` 是 `Binary` 的缩写, 这个目录存放着最经常使用的命令。

`/boot`：这里存放的是启动 `Linux` 时使用的一些核心文件，包括一些连接文件以及镜像文件。

`/dev` ：`dev` 是 `Device` (设备)的缩写, 该目录下存放的是 `Linux` 的外部设备，在 `Linux` 中访问设备的方式和访问文件的方式是相同的。

`/etc`：这个目录用来存放所有的系统管理所需要的配置文件和子目录。

`/home`：用户的主目录，在 `Linux` 中，每个用户都有一个自己的目录，一般该目录名是以用户的账号命名的。

`/lib`：这个目录里存放着系统最基本的动态连接共享库，其作用类似于 `Windows` 里的 `DLL` 文件。几乎所有的应用程序都需要用到这些共享库。

`/lost+found` ：这个目录一般情况下是空的，当系统非法关机后，这里就存放了一些文件。

`/media`：`linux`系统会自动识别一些设备，例如 `U` 盘、光驱等等，当识别后，`linux` 会把识别的设备挂载到这个目录下。

`/mnt`：系统提供该目录是为了让用户临时挂载别的文件系统的，我们可以将光驱挂载在 `/mnt/` 上，然后进入该目录就可以查看光驱里的内容了。

`/opt`：这是给主机额外安装软件所摆放的目录。比如你安装一个 `ORACLE` 数据库则就可以放到这个目录下。默认是空的。

`/proc`：这个目录是一个虚拟的目录，它是系统内存的映射，我们可以通过直接访问这个目录来获取系统信息。这个目录的内容不在硬盘上而是在内存里，我们也可以直接修改里面的某些文件，比如可以通过下面的命令来屏蔽主机的 `ping` 命令，使别人无法 `ping` 你的机器：`echo 1 >/proc/sys/net/ipv4/icmp_echo_ignore_all`

`/root` ：该目录为系统管理员，也称作超级权限者的用户主目录。

`/sbin`：`s` 就是 `Super User` 的意思，这里存放的是系统管理员使用的系统管理程序。

`/selinux`： 这个目录是 `Redhat/CentOS` 所特有的目录，`Selinux` 是一个安全机制，类似于`windows` 的防火墙，但是这套机制比较复杂，这个目录就是存放 `selinux` 相关的文件的。

`/srv`：该目录存放一些服务启动之后需要提取的数据。

`/sys`：这是 `linux2.6` 内核的一个很大的变化。该目录下安装了 `2.6` 内核中新出现的一个文件系统 `sysfs`。

`sysfs` 文件系统集成了下面 `3` 种文件系统的信息：针对进程信息的 `proc` 文件系统、针对设备的 `devfs` 文件系统以及针对伪终端的 `devpts` 文件系统。 该文件系统是内核设备树的一个直观反映。

当一个内核对象被创建的时候，对应的文件和目录也在内核对象子系统中被创建。

`/tmp`：这个目录是用来存放一些临时文件的。

`/usr`：这是一个非常重要的目录，用户的很多应用程序和文件都放在这个目录下，类似于 `windows` 下的 `program files` 目录。

`/usr/bin`：系统用户使用的应用程序。

`/usr/sbin`：超级用户使用的比较高级的管理程序和系统守护程序。

`/usr/src`：内核源代码默认的放置目录。

`/var`：这个目录中存放着在不断扩充着的东西，我们习惯将那些经常被修改的目录放在这个目录下。包括各种日志文件。

`/run`：是一个临时文件系统，存储系统启动以来的信息。当系统重启时，这个目录下的文件应该被删掉或清除。如果你的系统上有 `/var/run` 目录，应该让它指向 `run`。

## Mac 文件系统结构

查看 `Mac` 的文件系统结构很简单，在终端输入 `man hier` 查看即可。

```bash
     /             #root directory of the filesystem

     /bin/        # user utilities fundamental to both single-user and multi-user environments

     /dev/         #block and character device files

                   fd/  #file descriptor files; see fd(4)

     /etc/         #system configuration files and scripts

     /mach_kernel  #kernel executable (the operating system loaded into memory at boot time).

     /sbin/        #system programs and administration utilities fundamental to both single-user and multi-user environments

     /tmp/         #temporary files

     /usr/         #contains the majority of user utilities and applications

                   bin/     # common utilities, programming tools, and applications
                   include/  #standard C include files

                             arpa/       #C include files for Internet service protocols
                             hfs/        #C include files for HFS
                             machine/    #machine specific C include files
                             net/        #misc network C include files
                             netinet/   # C include files for Internet standard protocols; see inet(4)
                             nfs/        #C include files for NFS (Network File System)
                             objc/       #C include files for Objective-C
                             protocols/  #C include files for Berkeley service protocols
                             sys/        #system C include files (kernel data structures)
                             ufs/        #C include files for UFS

                   lib/      #archive libraries
                   libexec/  #system daemons & system utilities (executed by other programs)
                   local/   #executables, libraries, etc. not included by the basic operating system
                   sbin/     #system daemons & system utilities (executed by users)
                   share/    #architecture-independent data files
```

> 如果要从终端进入 `U` 盘或者移动硬盘的存储设备，可以进入 `/volumes` 目录。

## 总结

以上就是 `Liunx` 和 `Mac` 文件系统的目录结构。
