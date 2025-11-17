---
title: 'Mac的环境变量和nvm的使用'
publishDate: '2019-04-07 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
heroImage: { 'src': './macos.jpg', 'color': '#B4C6DA' }
---

## 命令和快捷键系列

1. [终端和chorme常用快捷键以及快捷键工具keycue](https://www.clloz.com/programming/assorted/2019/09/18/terminal-chrome-shortcurs/ '终端和chorme常用快捷键以及快捷键工具keycue')()
2. [emacs常用快捷键](https://www.clloz.com/programming/assorted/emacs/2019/04/14/emacs-keybinding/ 'emacs常用快捷键')
3. [常用Git命令](https://www.clloz.com/programming/assorted/2019/05/15/git-command/ '常用Git命令')
4. [Mac的环境变量和nvm的使用](https://www.clloz.com/programming/assorted/2019/04/07/mac-pathnvm/ 'Mac的环境变量和nvm的使用')
5. [Homebrew更换清华镜像以及常用命令](https://www.clloz.com/programming/assorted/2019/09/08/homebrew-tsinghua-mirror/ 'Homebrew更换清华镜像以及常用命令')

## 前言

今天在学习正则表达式，在测试 `零宽度正回顾后发断言` 的时候，我发现 `node` 提示我正则表达式错误，于是我去 `chrome` 上试了一下，没问题。之后 `google` 发现，`ES2019` 才开始支持 `零宽度正回顾后发断言`，但是既然 `chrome` 已经支持了，没道理 `nodejs` 不支持，而且我看文档里也说了 `v8` 已经支持。于是我猜测我的 `node` 版本应该是过低了。

## 更新 node

因为之前在家一直用的台式机，这台 `mac` 上的东西很久没更新了，`node` 的版本停留在 `8.11.0`，于是着手更新，先把 `nvm` 更新了一下，安装了最新的 `v11.13.0`，但是在 `nvm alias default v11.13.0` 之后，发现虽然 `default` 已经变成最新版本，但是指针依然指向 `system`。

`google` 之后在 `github` 的 `issue` 里发现有人提了同样的问题，最后得出的结论就是在 `nvm` 的环境变量之后，又把系统原来的 `node` 在环境变量中写了一遍，也就是 `nvm` 的 `default` 又被系统的覆盖了，我打开 `~/.bash_profile` 看了一下，果然 `nvm` 的 `source ~/.nvm/nvm.sh` 写在了最前面，后面紧跟着 `export PATH=/usr/local/bin:$PATH` 也就是我系统 `node` 的位置，把 `nvm` 的位置移动了一下就一切正常了。

## Mac 的环境变量

我们在系统中安装了某个程序，就可以使用这个程序对应的命令，之所以会这样是因为我们把该命令添加到了系统的环境变量中，也就是我们输入对应的命令，系统知道到哪个路径去找对应的文件执行。比如在 `Windows` 中我们在 `path` 中添加 `jdk` 和 `jre` 的 `bin` 路径，我们在命令行中就可以使用 `java` 和 `javac` 命令了。

`Mac` 中同样需要设置环境变量，但是情况要比 `Windows` 中复杂一些，`Mac` 中又多个环境变量文件，不同的环境变量文件的作用域和加载时间也不同。而且不同的 `Shell` 所对应的配置文件也不同。比如 `Mac` 默认的 `bash` 对应的配置文件就是 `.bash_profile`，而 `zsh` 对应的配置文件就是 `.zshrc`。

> `rc` 即为 `run command`，一般为脚本类文件的后缀，这些脚本通常在程序启动的时候被调用，比如 `.bashrc` 就会在 `bash shell` 启动时调用。

`Mac` 中环境变量配置文件的默认加载顺序如下：

```bash
/etc/profile
/etc/bashrc
/etc/paths
~/.bash_profile
~/.bash_login
~/.profile
~/.bashrc
```

其中 `/etc/profile` `/etc/bashrc` 和 `/etc/paths` 是系统级环境变量，对所有用户都有效。但它们的加载时机有所区别：

- `/etc/profile` 任何用户登陆时都会读取该文件
- `/etc/bashrc` `bash shell`执行时，不管是何种方式，读取此文件
- `/etc/paths` 任何用户登陆时都会读取该文件
- `.profile` 为系统的每个用户设置环境信息,当用户第一次登录时,该文件被执行.并从 `/etc/profile.d` 目录的配置文件中搜集`shell`的设置。 如果你有对 `/etc/profile` 有修改的话必须得重启你的修改才会生效，此修改对每个用户都生效。
- `./bashrc` 每一个运行 `bash shell` 的用户执行此文件。当b`ash shell`被打开时,该文件被读取。 对所有的使用 `bash` 的用户修改某个配置并在以后打开的 `bash` 都生效的话可以修改这个文件，修改这个文件不用重启，重新打开一个 `bash` 即可生效。
- `./bash_profile` 该文件包含专用于你的 `bash shell` 的 `bash` 信息,当登录时以及每次打开新的 `shell` 时,该文件被读取.

除了前三个，后面几个是当前用户级的环境变量。`macOS` 默认用户环境变量配置文件为 `~/.bash_profile`，`Linux` 为 `~/.bashrc`。

如果不存在 `~/.bash_profile`，则可以自己创建一个 `~/.bash_profile`。

如果 `~/.bash_profile` 文件存在，则后面的几个文件就会被忽略。 如果 `~/.bash_profile` 文件不存在，才会以此类推读取后面的文件。

> 如果使用的是 `shell` 类型是`zsh`，则还可能存在对应的 `/etc/zshrc` 和 `~/.zshrc`。任何用户登录`zsh` 的时候，都会读取该文件。某个用户登录的时候，会读取其对应的 `~/.zshrc`。

## 添加新的环境变量

添加环境变量的语法：`export PATH="$PATH:<PATH 1>:<PATH 2>:<PATH 3>:...:<PATH N>"`

`$PATH` 相当于原来的环境变量，后面的 `PATH 1`，`PATH2` 就是我们新添加的变量，不同于 `Windows` 用分号分隔，这里是用冒号分隔。`$PATH` 可以放在前面，也可以放在后面，放在前面相当于把新的环境变量加在了环境变量的末尾，而放在后面则相当于把新的环境变量加在了开头。比如我上面的`nvm`的问题，除了把 `nvm` 的配置放到后面，把 `export PATH=/usr/local/bin:$PATH` 改为 `export PATH=$PATH:/usr/local/bin` 应该也是可以解决的，不过 `/usr/local/bin` 中的文件较多，还是动 `nvm` 比较好。

查看 `path`：`echo $PATH`。

## nvm的常用命令

> `nvm` 安装的 `node` 路径为 `~/.nvm/versions/node`（`mac` 上）.

- `nvm ls-remote`：查看当前支持的版本，`LTS` 会特别标注，选择自己需要的版本安装。
- `nvm install v～`：安装对应版本的 `node`，`nvm instal node` 会安装最新版本。
- `nvm use <version>` : 切换当前环境使用的 `node` 版本，关闭当前的 `shell` 以后失效。
- `nvm current` ：查看当前环境正在使用的 `node` 版本。
- `nvm alias default v～` ：指定默认版本，关闭环境后仍然有效。
- `nvm use node` ：切换到当前安装的版本中最新的。
- `nvm alias <name> v～` ：为某个版本设置别名。
- `nvm unalias <name>` ：取消设置的别名。
- `nvm reinstall-packages <version>`：在当前版本 `node` 环境下，重新全局安装指定版本号的全局安装包
- `nvm uninstall <version>`：卸载指定的版本

## 总结

环境变量是每个操作系统关键的部分，搞清楚不同系统的环境变量规则在遇到软件出现异常时能够第一时间找出原因。`nvm` 的使用是相当方便的，多个版本之间互不影响，相当于在自己的沙盒中，我自己是认为比 `n` 好用的。之前一直在 `CentOS` 上，许久不用 `emacs`，已经快忘记怎么用了，`Mac` 上能够配置 `emacs client` 还是挺方便的，等过段时间有空闲了把 `emacs` 拿出来好好练一练。
