---
title: '在terminal中用daemon方式启动emacs'
publishDate: '2019-04-27 12:00:00'
description: ''
tags:
  - emacs-vim
  - 奇技淫巧
language: '中文'
heroImage: {"src":"./emacs-logo.png","color":"#B4C6DA"}
---

\[toc\]

## 前言

由于个人喜好，虽然 `emacs` 不像 `vim` 那样在 `Linux` 中默认安装，不过我在 `mac` 上还是习惯于用 `emacs` 作为默认的 `terminal` 编辑工具，不过 `emacs` 有个坏毛病就是配置挺繁琐，没有 `vim` 那么轻量，并且当配置越来越多，启动会比较慢，用 `emacs` 命令的话每次都得等 `emacs` 加载会很头疼，下面就分享以下让 `emacs` 在后台驻留的方式。

## 如何快速启动 emacs

`emacs` 提供了 `--daemon` 的后台驻留启动参数，不过我们可以配置以下，让启动更便捷，首先创建一个 `.emacs_client.sh` 文件，在其中加入如下内容：

```bash
#!/bin/bash
#filename: emacs_client.sh

if [ `ps axu | grep "Emacs.*app" | grep daemon | wc -l` -eq 1 ]
# if [ `ps axu | grep "Emacs"` -eq 1 ]
then
    echo "Ready."
else
    echo "Starting server."
    /usr/local/bin/emacs --daemon
fi

emacsclient -c "$@"
```

这段的主要功能就是检查进程中是否有 `emacs`，如果没有则用 `--daemon` 方式启动，如果有就直接打开。然后我们在环境变量给我们的命令起个别名，并且加入一个关闭进程的方法，打开 `.bash_profile`，在其中加入如下内容：

```bash
alias emacs="~/.emacs_client.sh -t"
alias em="emacs"
# alias emd="emacs -e '(kill-emacs)'"
alias emd="kill-emacs"

# add kill emacs function
function kill-emacs(){
    emacsclient -e "(kill-emacs)"
    emacs_pid=$( ps x | grep "Emacs.*app" | grep daemon | awk '{print $1}' )
    if [[ -n "${emacs_pid}" ]];then
        kill -9 "${emacs_pid}"
    fi
}
```

这一段的主要功能就是用 `em` 代替 `emacs` 指令，然后 `emd` 指令表示关掉 `emacs` 进程。

现在如果你要启动 `emacs` 只要键入 `em` 就可以了，第一次会加载 `emacs` 配置，然后进程会一直在后台驻留，当你下次再要进入的时候再键入 `em` 命令，`emacs` 就会秒开。如果你想关掉进程，就直接输入 `emd`，不过下次再启动就有需要加载配置了。