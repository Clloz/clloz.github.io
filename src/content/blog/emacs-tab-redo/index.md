---
title: 'Emacs的小技巧，注释，tab，undo和lsp补全'
publishDate: '2019-12-03 12:00:00'
description: ''
tags:
  - emacs-vim
  - 实用技巧
language: '中文'
heroImage: { 'src': './emacs-logo.png', 'color': '#B4C6DA' }
---

## 前言

在使用 `emacs` 的 `tab` 和 `undo`、`redo` 的时候，`emacs` 的反应和我们平常使用的一些编辑器或者 `IDE` 很不一样，有时候按 `tab` 缩进是 `4` 格，有时候缩进是 `2` 格，有时候不管怎么按都没反应。`undo` 一般大家都知道，一般有几个快捷键可用：`C-_`，`C-x u` 和 `C-/`，但是 `redo` 的操作新手可能不太了解。最后还有注释和 `lsp` 补全的使用，以及在命令行中用 `emacs` 的一些注意点。

> 本文的内容是在 `spacemacs` 的基础上的一些配置，可能有些内容需要单独在进行一些配置。

## alt 问题

在 `mac` 的终端上会出现 `alt` 无法使用的情况，因为 `mac` 的 `option` 默认是用来输入特殊符号的，所以我们要禁用掉特殊符号这个功能，在 `iTerm2` 里面直接在 `Profiles` 里面的 `keys` 选项卡中的 `left option` 选择为 `+ESC` 即可。如果是 `terminal` 则直接在 `preferences->Profiles->keyboard` 的最下面勾选上 `用 option 键作为 meta 键`。如果是在 `windows` 中一般不会在终端使用 `emacs`，如果是通过 `ssh` 链接服务器，那么也可以在 `xshell` 中设置 `将左alt键用作meta键`。其实 `emacs` 中的 `M-x` 中的 `M` 就是 `meta` 键的意思，它在不同的系统代表不同的键，`emacs` 中的文档也说了 `M-x, it means "press Alt/Esc/Option/Edit key and x together"`，所以在 `linux` 中其实用 `esc` 也可以代替 `meta` 但是比较麻烦，所以我们还是对终端进行配置，一般是将 `alt` 或者 `alt` 设置为 `meta`。

## tab 的使用

上面说到 `emacs` 中的 `tab` 并不像大家平时用的 `IDE` 或者编辑器的表现，刚开始很不习惯。其实你可以把 `emacs` 中的 `tab` 理解为格式化代码，对选中区域或光标所在行进行代码的格式化，类似在 `vscode` 中的快捷键 `Shift + Alt + f` 的作用，在有些插件里面，补全也会用到 `tab` 键。那么如果我们需要输入正常的 `tab` 要怎么做呢，`emacs` 默认提供了一个 `quoted insert` 方法来让你输入一些特殊的键或者字符的八进制编码，比如 `<del>` 或者 `<tab>` 等，所以要输入 `tab` 就用快捷键 `C+q tab` 就可以了，如果你觉得这很麻烦，也可以自己绑定快捷键。`emacs` 提供的一个方法 `tab-to-tab-stop` 来输入 `tab`，快捷键是 `M + i`。

> 关于 `quoted insert` 的内容可以查看官方文档 [Insert Text](https://www.gnu.org/software/emacs/manual/html_node/emacs/Inserting-Text.html 'Insert Text')，或者用 `C-h k` 来查看快捷键对应的用法。

另外关于 `tab` 的缩进 `indent`，不同的语言可以设置不同的缩进，如果你使用的是别人的配置那么可能你需要改多个地方的配置，可以用 `M-x customize-variable` 来查看 `indent` 相关的配置，比如 `js` 的 `indent` 设置在 `js-indent-level` 这个变量里面，而 `html` 的设置在 `web-mode-code-indent-offset` 这个变量里面，具体要更改哪个，要看你的语言对应的模式然后查找对应的变量。

最后再提一点就是 `backtab` 就是我们在其他编辑器常用的 `Shift + tab`，这个我是使用的一个自定义函数来实现的：

```lisp
(defun un-indent-by-removing-4-spaces ()
    "remove 4 spaces from beginning of of line"
    (interactive)
    (save-excursion
      (save-match-data
        (beginning-of-line)
        ;; get rid of tabs at beginning of line
        (when (looking-at "^\\s-+")
          (untabify (match-beginning 0) (match-end 0)))
        (when (looking-at (concat "^" (make-string tab-width ?\ )))
          (replace-match "")))))

(global-set-key (kbd "<backtab>") 'un-indent-by-removing-4-spaces)
```

## undo 和 redo

在 `emacs` 中提供了好几种 `undo` 的快捷键 `C-_`，`C-x u` 和 `C-/`，其中在命令行中 `C-x u` 可能无效，我一般是使用 `C-_`。`redo` 操作一般我们在其他编辑器中用 `Ctrl + Shift + z` 来操作，在 `emacs` 上显然不可以这样。其实在 `emacs` 中，每个缓冲区都有一个 `undo` 记录，每次更改缓冲区都会放入这个 `undo` 记录中，我们可以通过连续的 `c-_` 进行 `undo`，如果在连续的 `undo` 命令序列中插入其他命令比如文档中提到的 `C-f` 或者是 `C-g`，那么前面的连续的 `undo` 操作都会被作为单独的修改集合放入 `undo` 记录中，从而可以重新应用刚才被 `undo` 的操作。

也就是说，比如你进行了 `操作1 操作2 操作3`，此时你是用 `undo` 回到了 `操作2` 执行后的状态，这时候你想要 `redo` 回到`操作3` 执行后的状态，就先输入一个非 `undo` 命令，比如 `C-g`，然后在输入 `undo` 就编程 `redo` 操作了，具体的说明请看官方文档：[Undoing Changes](https://ftp.gnu.org/old-gnu/Manuals/emacs-20.7/html_node/emacs_19.html 'Undoing Changes')。

当然更好的做法是使用 `undo tree` 这个插件，安装好插件后 `C-x u` 就称为打开`undo-tree-visualizer-mode` 这个 `buffer` 的快捷键，打开后我们能在一个新的 `buffer` 里面看到我们所有的历史操作，并且细分出了各个分支。`undo tree` 的操作方式有如下几种，`p，n` 在节点上上下移动，`b，f` 来选择分支（选中的分支会显示黑色），`t` 显示时间戳，`q` 退出。`undo tree` 同时提供了一个 `undo tree redo` 的方法，我们可以直接进行 `redo` 不在需要那么复杂的逻辑，比价符合我们正常的思维。

## 注释 comment\`

`emacs` 提供的注释默认快捷键是 `C-;`，但是在命令行里面几乎所有和标点符号有关的快捷键都不能生效，这种情况下我们可以给 `comment-line` 这个函数定义两组快捷键，这样我们可以在命令行和 `GUI` 都能够使用注释的功能。

```lisp
(global-set-key (kbd "C-c C-k") 'comment-line)
(global-set-key (kbd "C-;") 'comment-line)
```

## lsp 自动补全

[LSP](https://github.com/emacs-lsp/lsp-mode 'LSP') (`Language Server Protocol`) 是微软领导开发的编程语言语法补全和代码分析框架，`Emacs` 的 `lsp-mode` 是 `LSP` 协议在 `Emacs` 的客户端实现. `lsp-mode` 现在能够很好的支持 `C++, Python, Ruby, Golang, Haskell, OCamel, Rust, PHP` 等语言. 当然也包括 `JavaScript`。

`spacemacs` 已经默认集成了 `lsp`，不过想要实现补全还需要安装对应语言的对应服务，比如补全 `js` 需要安装 `typescript-language-server;`，其他语言参考[lsp-supported-languages](https://github.com/emacs-lsp/lsp-mode#supported-languages 'lsp-supported-languages')。在 `spacemacs` 中要给对应的 `mode` 开启 `lsp`，加入如下内容

```lisp
(use-package lsp-mode
  :hook (XXX-mode . lsp)
  :commands lsp)
```

也可以在 `dotspacemacs-configuration-layers` 对应的模块中直接设置，比如 `(javascript :variables javascript-backend 'lsp)`。需要注意的是，如果是手动启用，不是启动 `lsp-mode`，而是启动 `lsp`，如果出现 `spacemacs-jump-handlers-xxx-mode` 报错的话，在 `user-config` 里面加上 `(defvar spacemacs-jump-handlers-xxx-mode nil)`。

如果不小心将文件加入到 `lsp` 的 `blacklist` 中，可以用 `lsp-workspace-blacklist-remove` 方法来移除。

## 参考文章

1. [Emacs的Tab键](https://www.cnblogs.com/gamesun/archive/2012/12/23/2830184.html 'Emacs的Tab键')
