---
title: 'tmux的基础用法'
publishDate: '2019-11-27 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
  - 软件工具
language: '中文'
heroImage: {"src":"./tmux.png","color":"#B4C6DA"}
---

\[toc\]

## 前言

在用 `ssh` 远程登录服务器的时候，长时间不操作，或不小心按了 `ctrl + d`，连接就断开了，在重连上去，一切又恢复到初始状态，想要查看之前的命令和一些操作都无法找到记录了。

命令行的典型使用方式是，打开一个终端窗口在里面输入命令。用户与计算机的这种临时的交互，称为一次"会话"（`session`） 。会话的一个重要特点是，窗口与其中启动的进程是连在一起的。打开窗口，会话开始；关闭窗口，会话结束，会话内部的进程也会随之终止，不管有没有运行完。

`tmux` 就是为了解决这个问题，把窗口和会话分开，即使我们关闭窗口，会话也还在，我们在下次需要的时候又可以打开，继续上次的内容。

## 安装

```bash
# Ubuntu 或 Debian
$ sudo apt-get install tmux

# CentOS 或 Fedora
$ sudo yum install tmux

# Mac
$ brew install tmux
```

## 会话管理

```bash
# 新建会话
$ tmux new -s <session-name>

# 分离会话，关闭当前窗口，保留会话
$ tmux detach #或者用快捷键 ctrl+b d

# 查看所有会话
$ tmux ls

# 重新进入会话
$ tmux attach -t 0     # 使用会话编号，第一个启动的 tmux 窗口，编号是0，第二个窗口的编号是1，以此类推。
$ tmux attach -t <session-name>    # 使用会话名称

# 结束会话，关闭窗口也关闭会话
$ tmux kill-session -t 0    # 使用会话编号
$ tmux kill-session -t <session-name> # 使用会话名称 也可以直接使用快捷键 ctrl+d，和退出远程登录的ssh一样

# 切换会话
$ tmux switch -t 0    # 使用会话编号
$ tmux switch -t <session-name> # 使用会话名称

# 重命名会话
$ tmux rename-session -t 0 <new-name>

# 快捷键
Ctrl+b d：分离当前会话。
Ctrl+b s：列出所有会话。
Ctrl+b $：重命名当前会话。
```

## 窗格操作

`tmux` 可以将窗口分成多个窗格（`pane`），每个窗格运行不同的命令。以下命令都是在 `Tmux` 窗口中执行。

```bash
# 划分上下两个窗格
$ tmux split-window

# 划分左右两个窗格
$ tmux split-window -h

# 光标切换到上方窗格
$ tmux select-pane -U

# 光标切换到下方窗格
$ tmux select-pane -D

# 光标切换到左边窗格
$ tmux select-pane -L

# 光标切换到右边窗格
$ tmux select-pane -R

# 当前窗格上移
$ tmux swap-pane -U

# 当前窗格下移
$ tmux swap-pane -D
```

窗口操作快捷键

- `Ctrl+b %`：划分左右两个窗格。
- `Ctrl+b "`：划分上下两个窗格。
- `Ctrl+b <arrow key>`：光标切换到其他窗格。`<arrow key>` 是指向要切换到的窗格的方向键，比如切换到下方窗格，就按方向键 `↓`。
- `Ctrl+b ;`：光标切换到上一个窗格。
- `Ctrl+b o`：光标切换到下一个窗格。
- `Ctrl+b {`：当前窗格左移。
- `Ctrl+b }`：当前窗格右移。
- `Ctrl+b Ctrl+o`：当前窗格上移。
- `Ctrl+b Alt+o`：当前窗格下移。
- `Ctrl+b x`：关闭当前窗格。
- `Ctrl+b !`：将当前窗格拆分为一个独立窗口。
- `Ctrl+b z`：当前窗格全屏显示，再使用一次会变回原来大小。
- `Ctrl+b Ctrl+<arrow key>`：按箭头方向调整窗格大小。
- `Ctrl+b q`：显示窗格编号。

## 窗口操作

```bash
# 创建新的窗口
$ tmux new-window

# 新建一个指定名称的窗口
$ tmux new-window -n <window-name>

# 切换到指定编号的窗口
$ tmux select-window -t <window-number>

# 切换到指定名称的窗口
$ tmux select-window -t <window-name>

# 重命名当前窗口
$ tmux rename-window <new-name>
```

窗口操作快捷键

- `Ctrl+b c`：创建一个新窗口，状态栏会显示多个窗口的信息。
- `Ctrl+b p`：切换到上一个窗口(按照状态栏上的顺序)。
- `Ctrl+b n`：切换到下一个窗口。
- `Ctrl+b <number>`：切换到指定编号的窗口，其中的 `<number>` 是状态栏上的窗口编号。
- `Ctrl+b w`：从列表中选择窗口。
- `Ctrl+b ,`：窗口重命名。

## 其他命令

```bash
# 列出所有快捷键，及其对应的 Tmux 命令
$ tmux list-keys

# 列出所有 Tmux 命令及其参数
$ tmux list-commands

# 列出当前所有 Tmux 会话的信息
$ tmux info

# 重新加载当前的 Tmux 配置
$ tmux source-file ~/.tmux.conf
```

## 参考文件

1. [Tmux 使用教程](https://www.ruanyifeng.com/blog/2019/10/tmux.html "Tmux 使用教程")