---
title: 'Emacs常用快捷键'
publishDate: '2019-04-13 12:00:00'
description: ''
tags:
  - emacs-vim
  - 实用技巧
language: '中文'
heroImage: {"src":"./emacs-logo.png","color":"#B4C6DA"}
---

\[toc\]

## 命令和快捷键系列

1. [终端和chorme常用快捷键以及快捷键工具keycue](https://www.clloz.com/programming/assorted/2019/09/18/terminal-chrome-shortcurs/ "终端和chorme常用快捷键以及快捷键工具keycue")()
2. [emacs常用快捷键](https://www.clloz.com/programming/assorted/emacs/2019/04/14/emacs-keybinding/ "emacs常用快捷键")
3. [常用Git命令](https://www.clloz.com/programming/assorted/2019/05/15/git-command/ "常用Git命令")
4. [Mac的环境变量和nvm的使用](https://www.clloz.com/programming/assorted/2019/04/07/mac-pathnvm/ "Mac的环境变量和nvm的使用")
5. [Homebrew更换清华镜像以及常用命令](https://www.clloz.com/programming/assorted/2019/09/08/homebrew-tsinghua-mirror/ "Homebrew更换清华镜像以及常用命令")

## 前言

回到mac上又开始用Emacs了，可能是先入为主，相较于`Vim`我还是比较喜欢用`Emacs`，虽然在大部分系统中都是默认装`Vim`而没有`Emacs`并且`Emacs`用起来似乎更麻烦，不过我还是更喜欢`Emacs`的风格。如果要把`Emacs`作为一个日常工作中的主力工具，确实是非常折腾，特别是我对`Lisp`不太了解，有时候为了解决一个小问题，可能要花半天，有可能还解决不了。

`Emacs`算是一个比较小众的编辑器，虽然很多人对这种极客感觉的编辑器有点憧憬，但是实际的使用过程中，你想让它达到IDE的效果，是需要费相当大的功夫的，并且由于各种插件，软件以及系统的版本并不是由同一批人维护的，很可能你更新了其中一个部分，另一部分就报错了。而且`Emacs`的社区并不算活跃，特别是中文，你很难在网上找到有用的文档，并且同样的问题可能每个人的原因并不相同，解决方法也不同。在不了解`elisp`的情况下，你想要很好的驯服`Emacs`是相当难的，不过`Emacs`的现在的魅力也可能源于此把。其实`Emacs`的配置说起来也简单，就一份`.emacs.d`就可以，如果你真的只是当一个编辑器来使用可以像`Vim`一样，只进行简单的配置就可以，或者你可以直接用别人的配置，但是虽然你用别人的插件或者配置，但是你的`Emacs`配置维护者其实只有你，要像真的学好`Emacs`是需要花费相当大的精力的，如果不是学习`Lisp`我觉得并不适合把`Emacs`作为主力开发工具。

## Emacs主要快捷键

在`mode line`中第一个字符表示字符集，`c`代表`chinese-gbk`，后面那个`\`符号表示换行类型，`\`是指`DOS`的`CRLF`换行，另外还有`Unix`的`LF`换行和`Mac`的`CR`换行。然后一个字符，表示打开的文件是否可写（先称为文件便于理解，实际上是buffer），`%`表示只读，`-`和 `*` 表示可写。再一个字符表示文件是否已写，`%` 或 `-` 表示还没动，`*` 表示已经更改。这两个字符组合起来有四个状态。

## 基本操作

| 命令 | 功能 |
| --- | --- |
| C-x C-f | 打开/新建文件 |
| C-x C-s | 保存当前缓冲区 |
| C-x C-w | 当前缓冲区另存为 |
| C-x C-v | 关闭当前Buffer并打开新文件 |
| C-x i | 光标处插入文件 |
| C-x b | 切换Buffer |
| C-x C-b | 显示Buffer列表 |
| C-x k | 关闭当前Buffer |
| C-x C-c | 关闭Emacs |
| C-c C-z | 终止shell中的进程 |

## 光标移动

| 按键 | 命令 | 功能 |
| --- | --- | --- |
| C-q tab / M-i |  | 输入制表符 |
| C-f | forward-char | 向前一个字符 |
| C-b | backward-char | 向后一个字符 |
| C-p | previous-line | 上移一行 |
| C-n | next-line | 下移一行 |
| M-f | forward-word | 向前一个单词 |
| M-b | backward-word | 向后一个单词 |
| C-a | beginning-of-line | 移到行首 |
| C-e | end-of-line | 移到行尾 |
| M-e | forward-sentence | 移到句首 |
| M-a | backward-sentence | 移到句尾 |
| M-} | forward-paragraph | 下移一段 |
| M-{ | backward-paragraph | 上移一段 |
| C-v | scroll-up | 下移一屏 |
| M-v | scroll-down | 上移一屏 |
| C-x \] | forward-page | 下移一页 |
| C-x \[ | backward-page | 上移一页 |
| M-< | beginning-of-buffer | 移到文档头 |
| M-> | end-of-buffer | 移到文档尾 |
| M-g g num | goto-line | 移到第n行 |
| (none) | goto-char | 移到第n个字符 |
| C-l | recenter | 将当前位置放到页面中间(Emacs最喜欢的地方) |
| M-num | digit-argument | 重复下个命令n次 |
| C-u num | universal-argument | 重复下个命令n次，n默认为4 |

> 在mac上多个emacs的快捷键是全局绑定的，在任何地方都可以使用。

## 文本操作

| 按键 | 命令 | 功能 |
| --- | --- | --- |
| C-x C-f | find-file | 打开文件 |
| C-x C-v | find-alternate-file | 打开另一个文件 |
| C-x C-s | save-buffer | 保存文件 |
| C-x C-w | write-file | 另存文件 |
| C-q (n) | quoted-insert | 插入字符，n表示字符的八进制ASCII码 |
| C-x 8 | ucs-insert | 插入Unicode字符 |
| C-d | delete-char | 删除光标处字符 |
| Backspace | delete-backward-char | 删除光标前字符 |
| M-d | kill-word | 删除光标起单词 |
| M-Backspace | backward-kill-word | 删除光标前单词 |
| C-k | kill-line | 删除光标起当前行 |
| M-k | kill-sentence | 删除光标起句子 |
| C-x Backspace | backward-kill-sentence | 删除光标前句子 |
| (none) | kill-paragraph | 删除光标起段落 |
| (none) | backward-kill-paragraph | 删除光标前段落 |
| C-/ | undo | 撤销 |
| C-\_ | undo | 撤销 |
| C-x u | undo | 撤销 |
| C-g | keyboard-quit | 撤销命令 |
| C-h t | help-with-tutorial | 调出Emacs Tutorial |
| C-h r | info-emacs-manual | 调出Emacs Manual |
| C-h k (command) | describe-key | 查看对应command帮助 |
| C-o | open-line | 插入空行 |
| C-x C-o | delete-blank-line | 删除空行 |
| C-x z | repeat | 重复前个命令 |
| C-@ | set-mark-command | 设定标记 |
| C-x C-x | exchange-point-and-mark | 交换标记和光标位置 |
| C-w | kill-region | 删除区域中内容 |
| C-x C-u | upcase-region | 将区域中字母改为大写 |
| C-x C-l | upcase-region | 将区域中字母改为小写 |
| C-x h | mark-whole-buffer | 全选 |
| C-x C-p | mark-page | 选取一页 |
| M-h | mark-paragraph | 选取一段 |
| M-@ | mark-word | 选取一个单词 |
| C-@ C-@ |  | 加入点到标记环 |
| C-u C-@ |  | 在标记环中跳跃 |
| C-x C-@ | pop-global-mark | 在全局标记环中跳跃 |
| (none) | transient-mark-mode | 非持久化标记模式 |
| M-|delete-horizontal-space | 删除光标处的所有空格和Tab字符 |  |
| M-SPC | just-one-space | 删除光标处的所有空格和Tab字符，但留下一个 |
| C-x C-o | delete-blank-lines | 删除光标周围的空白行，保留当前行 |
| M-^ | delete-indentation | 将两行合为一行，删除之间的空白和缩进 |
| C-S-Backspace | kill-whole-line | 删除整行 |
| C-w | kill-region | 删除区域 |
| M-w | kill-ring-save | 复制到kill 环，而不删除 |
| M-z char | zap-to-char | 删至字符char为止 |
| C-y | yank | 召回 |
| M-y | yank-pop | 召回前一个 |
| C-M-w | append-next-kill | 下一个删掉内容和上次删除合并 |
| C-h v | describe-variable | 显示变量内容 |
| (none) | append-to-buffer | 将区域中内容加入到一个buffer中 |
| (none) | prepend-to-buffer | 将区域中内容加入到一个buffer光标前 |
| (none) | copy-to-buffer | 区域中内容加入到一个buffer中，删除该buffer原有内容 |
| (none) | insert-buffer | 在该位置插入指定的buffer中所有内容 |
| (none) | append-to-file | 将区域中内容复制到一个文件中 |
| (none) | cua-mode | 启用/停用CUA绑定 |
|  | kill-read-only-ok | 是否在只读文件启用kill 命令 |
|  | kill-ring | kill环 |
|  | kill-ring-max | kill环容量 |

> 除了`Del`和`C-d`其他的删除命令都会按顺序保存起来，用`C-y`或者`M-y`来取出，如果想更好的使用`undo`功能，可以了解`undo tree`，在`Emacs`中一切皆可`undo`，包括`undo`本身也可以被`undo`。

## 查找替换操作

| 按键 | 命令 | 功能 |
| --- | --- | --- |
| C-s | isearch-forward | 向前进行增量查找 |
| C-r | isearch-backward | 向后进行增量查找 |
| M-c |  | (查找状态)切换大写敏感 |
| C-j |  | newline-and-indent|(查找状态)输入换行符 |
| M-Tab | isearch-complete | (查找状态)自动匹配 |
| C-h C-h |  | (查找状态)进入查找帮助 |
| C-w |  | (查找状态)将光标处单词复制到查找区域 |
| C-y |  | (查找状态)将光标处直到行尾内容复制到查找区域 |
| M-y |  | (查找状态)把kill 环中最后一项复制到查找区域 |
| C-M-w |  | (查找状态)删除查找区域最后一个字符 |
| C-M-y |  | (查找状态)将光标处字符复制到查找区域最后 |
| C-f |  | (查找状态)将光标处字符复制到查找区域最后 |
| C-s RET | search-forward | 向前进行简单查找 |
| C-r RET | search-backward | 向后进行简单查找 |
| M-s w | isearch-forward-word | 向前进行词组查找 |
| M-s w RET | word-search-forward | 向前进行词组查找（非增量方式） |
| M-s w C-r RET | word-search-backward | 向后进行词组查找（非增量方式） |
| C-M-s | isearch-forward-regexp | 向前进行正则查找 |
| C-M-r | isearch-backward-regexp | 向后进行正则查找 |
|  | replace-string | 全文替换 |
|  | replace-regexp | 全文正则替换 |
| M-% | query-replace | 查找替换 |
|  | recursive-edit | 进入递归编辑 |
|  | abort-recursive-edit | 退出递归编辑 |
|  | top-level | 退出递归编辑 |

## M-%的回答

| 输入 | 响应 |
| --- | --- |
| SPC 或者 y | 替换当前匹配并前进到下一个匹配处 |
| DEL 或者 n | 忽略此次匹配并前进到下一个匹配处 |
| . | 替换当前匹配并退出 |
| , | 替换当前匹配并停在此处，再按y后前进 |
| ! | 替换所有剩余匹配 |
| ^ | 回到前一个匹配处 |
| RET 或者 q | 直接退出 |
| e | 修改新字符串 |
| C-r | 进入递归编辑状态 |
| C-w | 删除当前匹配并进入递归编辑状态 |
| C-M-c | 退出递归编辑状态，返回查找替换 |
| C-\] | 退出递归编辑状态，同时退出查找替换 |
| C-h | 显示帮助 |

## 窗口操作

| 按键 | 命令 | 功能 |
| --- | --- | --- |
| C-x 2 | split-window-vertically | 垂直拆分窗口 |
| C-x 3 | split-window-horizontally | 水平拆分窗口 |
| C-x o | other-window | 选择下一个窗口 |
| C-M-v | scroll-other-window | 滚动下一个窗口 |
| C-x 4 b | switch-to-buffer-other-window | 在另一个窗口打开缓冲 |
| C-x 4 C-o | display-buffer | 在另一个窗口打开缓冲，但不选中 |
| C-x 4 f | find-file-other-window | 在另一个窗口打开文件 |
| C-x 4 d | dired-other-window | 在另一个窗口打开文件夹 |
| C-x 4 m | mail-other-window | 在另一个窗口写邮件 |
| C-x 4 r | find-file-read-only-other-window | 在另一个窗口以只读方式打开文件 |
| C-x 0 | delete-window | 关闭当前窗口 |
| C-x 1 | delete-other-windows | 关闭其它窗口 |
| C-x 4 0 | kill-buffer-and-window | 关闭当前窗口和缓冲 |
| C-x ^ | enlarge-window | 增高当前窗口 |
| C-x { | shrink-window-horizontally | 将当前窗口变窄 |
| C-x } | enlarge-window-horizontally | 将当前窗口变宽 |
| C-x - | shrink-window-if-larger-than-buffer | 如果窗口比缓冲大就缩小 |
| C-x + | balance-windows | 所有窗口一样高 |
|  | windmove-right | 切换到右边的窗口(类似：up, down, left) |

## buffer操作

| 按键 | 命令 | 功能 |
| --- | --- | --- |
| C-x b | switch-to-buffer | 打开或新建一个缓冲 |
| C-x 4 b | switch-to-buffer-other-window | 在另一个window中打开或新建一个缓冲 |
| C-x 5 b | switch-to-buffer-other-frame | 在另一个frame中打开或新建一个缓冲 |
| C-x LEFT | next-buffer | 移动到下一个缓冲 |
| C-x RIGHT | previous-buffer | 移动到前一个缓冲 |
| C-x C-b | list-buffers | 显示所有缓冲 |
| C-u C-x C-b |  | 显示映射到文件的缓冲 |
| C-x k | kill-buffer | 关闭缓冲 |
|  | kill-some-buffers | 关闭多个缓冲 |
|  | clean-buffer-list | 关闭三天未使用的缓冲 |
| C-x C-q | toggle-read-only | 切换缓冲只读属性 |
| C-u M-g M-g num |  | 跳至前一缓冲num行 |
|  | rename-buffer | 重命名缓冲 |
|  | rename-uniquely | 重命名缓冲，在其名后加数字 |
|  | view-buffer | 只读方式打开缓冲 |
|  | buffer-menu | 打开Buffer Menu |
|  | make-indirect-buffer | 建立间接缓冲 |
|  | clone-indirect-buffer | 建立当前缓冲的间接缓冲 |

输入`M-x buffer-menu`进入`buffer menu`对`buffer`进行管理，操作方式如下：

| 按键 | 功能 | 备注 |
| --- | --- | --- |
| SPC, n | 移动到下一项 |  |
| p | 移动到上一项 |  |
| d, k | 标记删除缓冲，并移动到下一项 | 按x后生效 |
| C-d | 标记删除缓冲，并移动到上一项 | 按x后生效 |
| s | 标记保存缓冲 | 按x后生效 |
| x执行标记删除或保存的缓冲 |  |  |
| u | 取消当前缓冲的标记，并移动到下一项 |  |
| Backspace | 取消当前缓冲的标记，并移动到上一项 |  |
| ~ | 设置缓冲为未修改 |  |
| % | 切换缓冲的只读属性 |  |
| 1 | 将选中缓冲满窗口显示 |  |
| 2 | 将选中缓冲显示在一半窗口中 |  |
| t | 缓冲用tags table 方式显示 |  |
| f, RET | 显示选择缓冲 |  |
| o | 缓冲在新窗口显示，并选中该窗口 |  |
| C-o | 缓冲在新窗口显示，但不选中该窗口 |  |
| b | 将选中缓冲移动到最后一行 |  |
| m | 标记缓冲在新窗口显示 | 按v后生效 |
| v | 显示标记的缓冲 |  |
| g | 刷新buffer menu |  |
| T | 切换显示文件关联缓冲 |  |
| q | 退出Buffer Menu |  |

> 需要注意的是大部分功能是立即生效的，但像d,s,m这些只会起标记作用，在确认之后才会执行，而且按了这三个键后对应会在缓冲名前显示"D", "S", ">" 三个符号用作提示。

## 注释的使用

`Emacs 25` 引入了一个新的命令 `comment-line` 就是注释当前行，默认快捷键是 `C-x C-;`，在之前版本的 `Emacs` 中只有一个 `comment-dwim （M-;）`用来在当前行后面加上注释。我通常使用 `emacs` 是在终端中使用，终端里面似乎类似 `C-; C-: C-'`这类的命令都无效，具体原因没查到，所以只能修改命令了，用 `(global-set-key (kbd "C-;") 'comment-line)` 来设置快捷键，可以对同一个命令设置多个快捷键，我对 `comment-line` 设置了两个快捷键，分别是 `C-;` 和 `C-c C-c`，这样前面一个在 `GUI` 中使用，后面一个在 `shell` 中使用。

## 一点看法

其实我开始使用`Emacs`是纯属好奇，觉得这样一个工具很极客，估计大部分人也是这样的，刚开始用一些大神的配置，但其实每个人对开发工具的需求不同，别人的配置很多东西是你用不到的，使用`Emacs`应该尽量精简到日常要用的东西，装上太多用不到的东西难以维护，经常一个错误需要查半天，而且真的想要用好`Emacs`，`Lisp`是个绕不过去要学的东西，只有真的理解了`Emacs`才能用好它，否则还是仅仅当个玩具来看把。

## 参考文章

[Emacs学习教程](https://www.cnblogs.com/robertzml/archive/2010/03/24/1692737.html "Emacs学习教程")