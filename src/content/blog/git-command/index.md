---
title: '常用Git命令'
publishDate: '2019-05-15 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
heroImage: { 'src': './git-logo.png', 'color': '#B4C6DA' }
---

## 命令和快捷键系列

1. [终端和chorme常用快捷键以及快捷键工具keycue](https://www.clloz.com/programming/assorted/2019/09/18/terminal-chrome-shortcurs/ '终端和chorme常用快捷键以及快捷键工具keycue')()
2. [emacs常用快捷键](https://www.clloz.com/programming/assorted/emacs/2019/04/14/emacs-keybinding/ 'emacs常用快捷键')
3. [常用Git命令](https://www.clloz.com/programming/assorted/2019/05/15/git-command/ '常用Git命令')
4. [Mac的环境变量和nvm的使用](https://www.clloz.com/programming/assorted/2019/04/07/mac-pathnvm/ 'Mac的环境变量和nvm的使用')
5. [Homebrew更换清华镜像以及常用命令](https://www.clloz.com/programming/assorted/2019/09/08/homebrew-tsinghua-mirror/ 'Homebrew更换清华镜像以及常用命令')

## 前言

不知道是不是年纪大了记忆力衰退，学的知识一段时间不用就忘了。各种各样的命令也是，之前用过不少 `Linux` 的命令，然后一段时间一直在用 `windows`，再回到 `mac` 上的时候，命令忘了大半，又得翻搜索引擎。前端的知识也是，早起我是特别专注于 `CSS` 的学习，翻标准，做测试，感觉 `CSS` 的知识学了个盆满钵满，后来一段时间专注于 `JS`，再回过头好多知识点又不清晰了。这也就是所谓的要 `拳不离手，曲不离口`把，想要达到 `我亦无他，唯手熟尔` 的境界还有好远的路要走。不过把知识形成体系对于记忆是有帮助的，写博客是个不错的方法，有些知识你以为自己学会了，真要下笔写的时候发现不知道从何写起，写博客的过程也是构建知识体系，查漏补缺的过程。`Git` 的命令是我曾经花时间好好学习过，`Pro Git` 都读了不止一遍，不过一段时间不用，有些命令又忘记了，就记得 `add commit pull push` 了。今天把常用的 `Git` 命令整理一下。

![git](./images/git.png 'git')

## 新建代码库

```bash
# 在当前目录新建一个Git代码库
$ git init

# 新建一个目录，将其初始化为Git代码库
$ git init [project-name]

# 下载一个项目和它的整个代码历史
$ git clone [url]
```

## 文件操作

```bash
# 添加指定文件到暂存区
$ git add [file1] [file2] ...

# 添加指定目录到暂存区，包括子目录
$ git add [dir]

# 添加当前目录的所有文件到暂存区
$ git add .

# 添加每个变化前，都会要求确认
# 对于同一个文件的多处变化，可以实现分次提交
$ git add -p

# 删除工作区文件，并且将这次删除放入暂存区
$ git rm [file1] [file2] ...

# 停止追踪指定文件，但该文件会保留在工作区
$ git rm --cached [file]

# 改名文件，并且将这个改名放入暂存区
$ git mv [file-original] [file-renamed]
```

## commit

```bash
# 提交暂存区到仓库区
$ git commit -m [message]

# 提交暂存区的指定文件到仓库区
$ git commit [file1] [file2] ... -m [message]

# 提交工作区自上次commit之后的变化，直接到仓库区
$ git commit -a

# 提交时显示所有diff信息
$ git commit -v

# 使用一次新的commit，替代上一次提交
# 如果代码没有任何新变化，则用来改写上一次commit的提交信息
$ git commit --amend -m [message]

# 重做上一次commit，并包括指定文件的新变化
$ git commit --amend [file1] [file2] ...
```

## 分支

```bash
# 列出所有本地分支
$ git branch

# 列出所有远程分支
$ git branch -r

# 列出所有本地分支和远程分支
$ git branch -a

# 新建一个分支，但依然停留在当前分支
$ git branch [branch-name]

# 新建一个分支，并切换到该分支
$ git checkout -b [branch]

# 新建一个分支，指向指定commit
$ git branch [branch] [commit]

# 新建一个分支，与指定的远程分支建立追踪关系
$ git branch --track [branch] [remote-branch]

# 切换到指定分支，并更新工作区
$ git checkout [branch-name]

# 切换到上一个分支
$ git checkout -

# 建立追踪关系，在现有分支与指定的远程分支之间
$ git branch --set-upstream [branch] [remote-branch]

# 合并指定分支到当前分支
$ git merge [branch]

# 选择一个commit，合并进当前分支
$ git cherry-pick [commit]

# 删除分支
$ git branch -d [branch-name]

# 删除远程分支
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]
```

## 标签

```bash
# 列出所有tag
$ git tag

# 新建一个tag在当前commit
$ git tag [tag]

# 新建一个tag在指定commit
$ git tag [tag] [commit]

# 删除本地tag
$ git tag -d [tag]

# 删除远程tag
$ git push origin :refs/tags/[tagName]

# 查看tag信息
$ git show [tag]

# 提交指定tag
$ git push [remote] [tag]

# 提交所有tag
$ git push [remote] --tags

# 新建一个分支，指向某个tag
$ git checkout -b [branch] [tag]
```

## 查看信息

```bash
# 显示有变更的文件
$ git status

# 显示当前分支的版本历史
$ git log

# 显示commit历史，以及每次commit发生变更的文件
$ git log --stat

# 搜索提交历史，根据关键词
$ git log -S [keyword]

# 显示某个commit之后的所有变动，每个commit占据一行
$ git log [tag] HEAD --pretty=format:%s

# 显示某个commit之后的所有变动，其"提交说明"必须符合搜索条件
$ git log [tag] HEAD --grep feature

# 显示某个文件的版本历史，包括文件改名
$ git log --follow [file]
$ git whatchanged [file]

# 显示指定文件相关的每一次diff
$ git log -p [file]

# 显示过去5次提交
$ git log -5 --pretty --oneline

# 显示所有提交过的用户，按提交次数排序
$ git shortlog -sn

# 显示指定文件是什么人在什么时间修改过
$ git blame [file]

# 显示暂存区和工作区的差异
$ git diff

# 显示暂存区和上一个commit的差异
$ git diff --cached [file]

# 显示工作区与当前分支最新commit之间的差异
$ git diff HEAD

# 显示两次提交之间的差异
$ git diff [first-branch]...[second-branch]

# 显示今天你写了多少行代码
$ git diff --shortstat "@{0 day ago}"

# 显示某次提交的元数据和内容变化
$ git show [commit]

# 显示某次提交发生变化的文件
$ git show --name-only [commit]

# 显示某次提交时，某个文件的内容
$ git show [commit]:[filename]

# 显示当前分支的最近几次提交
$ git reflog
```

## 远程同步

```bash
# 下载远程仓库的所有变动
$ git fetch [remote]

# 显示所有远程仓库
$ git remote -v

# 显示某个远程仓库的信息
$ git remote show [remote]

# 增加一个新的远程仓库，并命名
$ git remote add [shortname] [url]

# 取回远程仓库的变化，并与本地分支合并
$ git pull [remote] [branch]

# 上传本地指定分支到远程仓库
$ git push [remote] [branch]

# 强行推送当前分支到远程仓库，即使有冲突
$ git push [remote] --force

# 推送所有分支到远程仓库
$ git push [remote] --all
```

## 撤销

```bash
# 恢复暂存区的指定文件到工作区
$ git checkout [file]

# 恢复某个commit的指定文件到暂存区和工作区
$ git checkout [commit] [file]

# 恢复暂存区的所有文件到工作区
$ git checkout .

# 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变
$ git reset [file]

# 重置暂存区与工作区，与上一次commit保持一致
$ git reset --hard

# 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变
$ git reset [commit]

# 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
$ git reset --hard [commit]

# 重置当前HEAD为指定commit，但保持暂存区和工作区不变
$ git reset --keep [commit]

# 新建一个commit，用来撤销指定commit
# 后者的所有变化都将被前者抵消，并且应用到当前分支
$ git revert [commit]

# 暂时将未提交的变化移除，稍后再移入
$ git stash
$ git stash pop
```

## .gitignore

文件 `.gitignore` 的格式规范如下:

- 所有空行或者以 `#` 开头的行都会被 `Git` 忽略。 `•` 可以使用标准的 `glob` 模式匹配。
- 匹配模式可以以( `/` )开头防止递归。
- 匹配模式可以以( `/` )结尾指定目录。
- 要忽略指定模式以外的文件或目录，可以在模式前加上惊叹号( `!` )取反。

所谓的 `glob` 模式是指 `shell` 所使用的简化了的正则表达式。 星号( `*` )匹配零个或多个任意字符；`[abc]` 匹配任何一个列在方括号中的字符(这个例子要么匹配一个 `a`，要么匹配一个 `b`，要么匹配一个 `c` )；问号( `?` )只匹配一个任意字符；如果在方括号中使用短划线分隔两个字符，表示所有在这两个字符范围内的都可以匹配 (比如 `[0-9]` 表示匹配所有 `0` 到 `9` 的数字)。 使用两个星号( `*` ) 表示匹配任意中间目录，比如 `a/**/z` 可以匹 配 `a/z` , `a/b/z` 或 `a/b/c/z` 等。

比如下面的例子：

```bash
# no .a files
*.a
# but do track lib.a, even though you're ignoring .a files above
!lib.a
# only ignore the TODO file in the current directory, not subdir/TODO
/TODO
# ignore all files in the build/ directory
build/
# ignore doc/notes.txt, but not doc/server/arch.txt
doc/*.txt
# ignore all .pdf files in the doc/ directory
doc/**/*.pdf
```

## 参考文章

[常用Git命令清单](https://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html '常用Git命令清单')
