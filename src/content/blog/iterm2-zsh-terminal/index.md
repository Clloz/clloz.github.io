---
title: 'iTerm2+zsh实现好用美观的Mac终端'
publishDate: '2019-09-07 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
heroImage: { 'src': './iterm2-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

我在 `Mac` 上一直都是使用的默认的终端 `terminal`，`shell` 也是使用的默认的 `bash`，一直也看到别人对于 `iterm2+zsh` 的推崇，不过觉得麻烦一直觉得没折腾。今天看到了一篇写的比较明了的文章，发现其实安装起来也不是很麻烦，于是就折腾了一下，确实很不错，不过对于 `item2` 和 `zsh` 我都还不是太熟悉，具体的使用要慢慢体会了。

## 安装 iTerm2

```bash
#第一次使用brew cask 命令
brew tap caskroom/cask

#cask安装iTerm2
brew cask install iterm2
```

安装成功后在 `Launchpad` 中可以看到有一个新图标出现，打开 `iTerm2`。如果你想用快捷键快速启动程序而不是点击图标，参考我的[这篇文章](https://www.clloz.com/programming/assorted/2018/10/23/terminal-shortcut/ '这篇文章')。

## 快捷键修改

在自带的 `terminal` 中 `⌥ + 左右方向键` 可以用来定位光标到前一个或后一个单词，不过在 `iterm2` 中这两个快捷键被用作其他功能，我们可以手动改回来。按 `⌘ + O` 打开 `profile` 然后选择 `edit profile`，在 `profile` 中选择 `keys` 选项卡，找到 `⌥→` 和 `⌘←` 选项，双击修改 `Action` 为 `Send Escape Sequence`，`ESC+` 改为 `b`（左箭头）和 `f` （右箭头）。

## 选择配色方案

我们可以根据自己的喜好来选择 `iTerm2` 的配色方案，先检查下终端颜色配置为 `xterm-256color`，位置在 `iTerm2 -> Preferences -> Profiles -> Terminal`。

![xterm256](./images/xterm256.png 'xterm256')

然后我们可以在 `iTerm2 -> Preferences -> Profiles -> Colors` 中选择我们的配色方案，不过自带的配色方案比较少，我们可以自己导入配色方案。

有人就开源了一款叫 `iTerm2-Color-Schemes` 的配色合集，里面有各种经典、常用的配色方案，来使用 `Git`下载到本地。

```bash
#克隆到自己想要的位置
git clone https://github.com/mbadolato/iTerm2-Color-Schemes
```

[![iterm-color-import](./images/iterm-color-import.png 'iterm-color-import')](https://cdn1.clloz.com/blog/writing/iterm-color-import.png 'iterm-color-import')

然后点击图中红框位置的下拉框选择其中的 `import` 然后选择刚刚克隆的 `iTerm2-Color-Schemes` 中的 `schemes` 文件夹中的全部文件导入，我们就有非常多的配色方案可用了， 大家可以选择自己喜欢的，我使用的是 `Dracula`。

## 安装字体

想要让 `iTerm2` 显示图标我们就得用一些特别的字体，图标字体并不是 `ASCII` 码字体，在 `iTerm2` 中可以进行配置，所以先要安装这个字体。这款字体叫 `nerd-fonts`，它支持下面这么多种图标。

[![nerd-font](./images/nerd-font.png 'nerd-font')](https://cdn1.clloz.com/blog/writing/nerd-font.png 'nerd-font')

```bash
brew tap caskroom/fonts
brew cask install font-hack-nerd-font
```

> 安装的时候会去 Github 下载字体，现在 `github` 安装似乎非常慢，最好还是用梯子或者代理，否则可能安装失败。

安装成功后需要在 `iTerm2` 中配置一下，在 `iTerm2 -> Preferences -> Profiles -> Text -> Font -> Change Font` 栏位中，`Text` 下面勾选 `Use a different font for non-ASCII text`，然后再选择字体以及设置字体大小，需要注意的是 `Font` 和 `Non-ASCII Font` 所选择的字体和字体大小必须一致，否则会出现显示异常。

[![iterm-font](./images/iterm-font.png 'iterm-font')](https://cdn1.clloz.com/blog/writing/iterm-font.png 'iterm-font')

## 安装 zsh

我印象中我的 `Mac` 是没有手动安装 `zsh` 的，系统是 `mojave 10.14.5`，应该是现在的系统自带的，不过默认 `shell` 还是 `bash`。

```bash
#查看系统支持的shell
cat  /etc/shells

#如果没有zsh，则用brew安装
brew install zsh

#查看当前使用shell
echo $SHELL

#设置zsh为默认shell
chsh -s /bin/zsh

#设置bash为默认shell
chsh -s /bin/bash
```

## 更新 zsh 到最新版本

`Mac` 现在自带 `zsh`，据说下个 `MacOS` 版本 `Catalina` 会将 `zsh` 作为默认 `shell`。`Mac` 自带的 `zsh` 并不是最新版本的，想要安装最新版本的可以使用 `Homebrew`。

```bash
# check the zsh info
brew info zsh

# install zsh
brew install zsh

# add shell path
sudo vim /etc/shells

# add the following line into the very end of the file(/etc/shells)
/usr/local/bin/zsh

# change default shell
chsh -s /usr/local/bin/zsh
```

## CentOS7 更新 zsh

`CentOS7` 的通过 `yum` 安装的 `zsh` 版本为 `5.0.2`，但是很多主题需要更高的版本。比如我使用的`Powerlevel9k` 主题，在使用 `git init` 的时候就经常会报错，每次都只能把主题换了再操作，很麻烦。这里给大家说一下如何通过源码安装最新的 `zsh`。

最新版 `zsh` 下载地址 [zsh-5.8.tar.xz](http://zsh.sourceforge.net/Arc/source.html 'zsh-5.8.tar.xz')，下载速度可能比较慢，不过还好文件不大，耐心等待。

下载好 `zsh-5.8.tar.xz` 后用 `scp` 上传到服务器，然后执行以下操作。

```bash
yum -y install gcc perl-ExtUtils-MakeMaker
yum -y install ncurses-devel
# 编译安装
tar xvf zsh-5.8.tar.xz
cd zsh-5.8
./configure
make && make install
# 将zsh加入/etc/shells
vim /etc/shells # 添加：/usr/local/bin/zsh
#设置zsh为默认shell
chsh -s /usr/local/bin/zsh
```

我没有指定安装路径，默认的安装路径就是 `/usr/local/bin/zsh`，我们将这个路径添加到 `/etc/shells` 中然后设置为默认的 `shell` 即可。重启终端我们就可以看到版本已经变为最新的了。

## 安装 oh-my-zsh

```bash
 sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

安装完成后 `iTerm2` 已经产生了明显的变化了，同时我们的用户文件夹 `~` 中生成了一个 `.zshrc` 的 `oh-my-zsh` 的配置文件。到这一步基本已经大功告成了，下面我们要做的就是对这个配置文件进行改动来达到我们的目标。

## 关联 .bash_profile

需要注意的是当前我们使用的 `shell` 换成了 `zsh`，我们原来在 `.bash_profile` 中的配置不会被读取，所以我们要在 `.zshrc` 中加上一句 `source ~/.bash_profile`，这样我们原来的配置也会生效。

## 配置主题

`oh-my-zsh` 默认的主题是 `robbyrussell`，并不是很好看，我们可以使用 [powerlevel10k](https://github.com/romkatv/powerlevel10k) 主题，让我们的 `powerline` 更酷炫。

```bash
#安装主题
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
# 或者 gitee 这个版本安装
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

#修改.zshrc中的ZSH_THEME参数
vim ~/.zshrc
ZSH_THEME="powerlevel10k/powerlevel10k"

#用source命令让配置立即生效
source ~/.zshrc
# 后面会出来 p10k 的配置向导，跟着配置即可。如果后面想要修改配置，一种方法是直接修改 ~/.p10k.zsh 文件，另一种方法是执行 p10k configure 命令
```

`p10k` 不需要像 `p9k` 那样自己进行复杂的定制，设置向导中已经囊括了比较常用的配置，如果你还是要自己定制可以参考 [p10k - README](https://github.com/romkatv/powerlevel10k 'p10k - README')

## 插件

`oh-my-zsh` 有很多非常好用的插件，下面是一些推荐的插件已经安装方法，安装好的插件只要在 `~/.zshrc` 中的 `plugins=(git autojump cp extract sudo z zsh-syntax-highlighting zsh-autosuggestions)` 依次写入用空格分开即可。

## autojump

能够记忆我们之前去过的目录，不需要多次 `cd` ，直接 `j 目录名` 就可以直接进入。

```bash
#安装
brew install autojump

#在 ~/.zshrc 中加入如下配置
[[ -s $(brew --prefix)/etc/profile.d/autojump.sh ]] && . $(brew --prefix)/etc/profile.d/autojump.sh
source $ZSH/oh-my-zsh.sh
```

## zsh-autosuggestion

如图所示，输入命令时可提示自动补全(灰色部分)，然后按键盘 `→` 即可补全([详细介绍](https://github.com/zsh-users/zsh-autosuggestions '详细介绍'))

```bash
#安装
$ git clone git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
```

## zsh-syntax-highlighting

日常用的命令会高亮显示，命令错误显示红色，如下图([详细介绍](https://github.com/zsh-users/zsh-syntax-highlighting '详细介绍'))

```bash
#安装
$ git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

## colorls

`colorls` 是一个 `Ruby` 实现的脚本，它可以配合 `powerlevel9k` 显示电脑上的文件图标(应该是通过后缀判断的)，效果如下

[![colorls](./images/colorls.png 'colorls')](https://cdn1.clloz.com/blog/writing/colorls.png 'colorls')

```bash
#安装
sudo gem install colorls
```

我在 `CentOS` 中安装 `colorls` 的时候提示 `ruby` 版本太低，用 `rvm` 安装高版本 `ruby`，但是重启后 `rvm` 加载有问题。`google` 后发现，要在 `.zshrc` 中加上 `[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"`。

## 一些小技巧

- 连续按两次 `tab` 会补全列表，补全项可以使用 `ctrl+n/p/f/b` 上下左右切换
- 输入目录名即可进入，不用 `cd` 了，输入 `..` 即可到上级目录，返回上次目录输入 `-`
- 输入 d 即可看到目录列表
- 智能的命令纠错功能（需开启 ENABLE_CORRECTION 配置）
- `Cmd + Shift + H` 可以查看剪切板的历史记录
- `Cmd + Option + B` 可以利用时间轴来查看之前输入的命令

## vscode 的配置

为了能够在 `vscode` 中能够正常使用新的终端，我们需要在 `vscode` 的 `setting.json` 中加入如下配置。

```bash
"terminal.external.osxExec": "iTerm.app",
"terminal.integrated.shell.osx": "/bin/zsh",
"terminal.integrated.fontFamily": "Hack Nerd Font",
"terminal.integrated.fontSize": 14,
```

[![iterm-vscode](./images/iterm-vscode.png 'iterm-vscode')](https://cdn1.clloz.com/blog/writing/iterm-vscode.png 'iterm-vscode')

## Linux 配置

`zsh` 和 `oh-my-zsh` 也是可以在 `Linux` 上配置的，我在自己的阿里云服务器上也配置了和 `mac` 上相同的效果，包括了上面所用到的插件，现在远程的服务器和本地的 `Mac` 操作上没什么差别，都非常好用。关于 `nerd` 字体的问题，如果是 `ssh` 远程连接自己的服务器，那么在远程的服务器上没有安装也没有关系，本地只要安装了就可以正常显示，比如我是用的 `iTerm2` 来连接阿里云的服务器，显示没有什么问题，而如果你用阿里云网站上给的在线远程连接即使安装了字体也无法正常显示。

## 参考文章

1. [打造 Mac 下高颜值好用的终端环境](https://blog.biezhi.me/2018/11/build-a-beautiful-mac-terminal-environment.html)
2. [oh-my-zsh插件推荐](https://www.zrahh.com/archives/167.html)
3. [那些我希望在一开始使用 Zsh(oh-my-zsh) 时就知道的](https://segmentfault.com/a/1190000002658335)
4. [iTerm2 快捷键集锦](https://yugasun.com/post/iterm2-shortcut-key.html)
