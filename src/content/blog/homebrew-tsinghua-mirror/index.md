---
title: 'Homebrew更换源以及常用命令'
publishDate: '2019-09-07 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
heroImage: {"src":"./homebrew.png","color":"#B4C6DA"}
---

\[toc\]

## 命令和快捷键系列

1. [终端和chorme常用快捷键以及快捷键工具keycue](https://www.clloz.com/programming/assorted/2019/09/18/terminal-chrome-shortcurs/ "终端和chorme常用快捷键以及快捷键工具keycue")()
2. [emacs常用快捷键](https://www.clloz.com/programming/assorted/emacs/2019/04/14/emacs-keybinding/ "emacs常用快捷键")
3. [常用Git命令](https://www.clloz.com/programming/assorted/2019/05/15/git-command/ "常用Git命令")
4. [Mac的环境变量和nvm的使用](https://www.clloz.com/programming/assorted/2019/04/07/mac-pathnvm/ "Mac的环境变量和nvm的使用")
5. [Homebrew更换清华镜像以及常用命令](https://www.clloz.com/programming/assorted/2019/09/08/homebrew-tsinghua-mirror/ "Homebrew更换清华镜像以及常用命令")

## 前言

`Homebrew` 有时候更新会卡很久，换成国内的源会改善，更换和恢复的方法如下。

## 中科大源

官方文档：[Homebrew 源使用帮助](https://mirrors.ustc.edu.cn/help/brew.git.html "Homebrew 源使用帮助")

```bash
# 替换 Homebrew
cd "$(brew --repo)"
git remote set-url origin https://mirrors.ustc.edu.cn/brew.git

# 替换 Homebrew Core
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git

# 替换 Homebrew Cask
cd "$(brew --repo)"/Library/Taps/homebrew/homebrew-cask
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-cask.git

# 替换 Homebrew-bottles
# 对于 bash 用户：
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.bash_profile
source ~/.bash_profile
# 对于 zsh 用户：
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.zshrc
source ~/.zshrc
```

## 重设官方地址

```bash
cd "$(brew --repo)"
git remote set-url origin https://github.com/Homebrew/brew.git

cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://github.com/Homebrew/homebrew-core

cd "$(brew --repo)"/Library/Taps/homebrew/homebrew-cask
git remote set-url origin https://github.com/Homebrew/homebrew-cask

#注释掉bash或zsh配置文件里的有关Homebrew Bottles即可恢复官方源。 重启bash或让bash重读配置文件。

#如果出现问题可以使用以下命令
brew doctor
brew update-reset

```

## 常用命令

```bash
#安装依赖工具
xcode-select --install
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

#查看帮助
brew help

#查看版本
brew -v

#更新homebrew
brew update

#显示更新信息
brew update -v

#安装软件包
brew install [包名]

#查询可更新的包
brew outdated

#更新所有
brew upgrade

#更新指定包
brew upgrade [包名]

#清理所有包的旧版本
brew cleanup

#清理指定包的旧版本
brew cleanup [包名]

#查看可清理的旧版本包，不执行实际操作
brew cleanup -n

#锁定某个包
brew pin $FORMULA
#取消锁定
brew unpin $FORMULA

#卸载软件包
brew uninstall [包名]

#查看包信息
brew info [包名]

#查看已经安装软件列表
brew list

#查询可用包
brew search [包名]

#卸载homebrew
cd `brew --prefix`
rm -rf Cellar
brew prune
rm `git ls-files`
rm -r Library/Homebrew Library/Aliases Library/Formula Library/Contributions
rm -rf .git
rm -rf ~/Library/Caches/Homebrew
```

## 安装位置

`brew` 安装软件后，

- 配置文件在 `/usr/local/etc` 中
- 软件安装在 `/usr/local/Cellar` 中
- 二进制可执行程序的软连接在 `/usr/local/bin` 中

目前比较新的 `MacOS 12` 中：

- 配置文件在 `/opt/homebrew/etc` 中
- 软件安装路径 `/opt/homebrew/Cellar` 中
- 二进制可执行程序的软连接在 `/opt/homebrew/bin` 中
- 日志文件在 `/opt/homebrew/var/log` 中

## keg-only 的意思

我们在用 `homebrew` 安装一些软件特别是系统中本来就有的软件时，比如 `llvm`，`flex`，`bison` 等，都会看到安装日志中有 `keg-only` 的说明，然后有配置环境变量的命令。这个 `key-only` 的意思就是 `homebrew` 不会帮我们做符号链接，避免和系统中原有的软件冲突，如果我们需要使用 `homebrew` 安装的这个就需要自己手动配置环境变量。

## 参考文章

1. [MAC上Homebrew常用命令](https://juejin.im/post/5a561685f265da3e2b164fe7)
2. [有趣的Homebrew 命名及 keg-only 的意思](https://zhuanlan.zhihu.com/p/196667957)