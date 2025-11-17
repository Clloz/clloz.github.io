---
title: 'ignore文件语法'
publishDate: '2020-07-27 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
  - 软件工具
language: '中文'
heroImage: { 'src': './gitignore.png', 'color': '#B4C6DA' }
---

## 前言

在使用 `Github` 的时候我们有 `.gitignore` 文件来避免提交一些不需要提交的文件（比如 `node_modules`），在使用 `eslint` 和 `prettier` 时也有对应的 `.eslintignore` 和 `.prettierignore`，它们的功能都类似，语法也差不多，本文就总结一下 `ignore` 文件的常用语法。

## 语法

这里的语法主要是结合 [Git 官方文档](https://git-scm.com/docs/gitignore 'Git 官方文档') 和自己的理解写的。`pattern` 就是匹配的模式，我们每一条规则就是一个 `pattern`。`ignore` 文件的作用就是让程序不再跟踪 `track` 某些文件。根目录指的是跟 `ignore` 文件在同一层级的目录。

- 空行没有任何意义，可以用来分隔不同的规则增强可读性。
- 以 `#` 开头的行即注释行将被忽略，可用反斜杠转义。
- `pattern` 中的空格会被忽略除非用反斜杠转义
- `!` 用来否定 `pattern`，比如 `!pattern`，如果有一个文件被某一条规则排除了，这条文件又能匹配 `!` 之后的 `pattern`，那么它将被重新跟踪 `track`。如果一个文件的父级目录被排除跟踪，那么将没有办法重新将它包含进来。比如你的 `src` 文件夹被排除了，`src` 文件夹下有一个 `index.js`，此时即使你加上 `!/src/index.js` 也不能让这个文件恢复跟踪。这样做是问了性能考虑，即一个文件夹只要被排除了，和文件内相关的所有 `pattern` 都将被忽略。`!` 同样可以用反斜杠转义，比如 `\!important!.txt`，就是匹配 `!important!.txt` 这个文件。
- `/` 用来分隔目录，可以出现在一条 `pattern` 的任意位置。
- 如果没有使用 `/`，那么我们的 `pattern` 会递归到各个目录中去（沿着目录的嵌套一直向下寻找），比如你写了一个 `common` 不仅根目录中的 `common` 会被排除，你整个项目中所有的 `common` 都会被排除。如果 `common` 是一个目录，那么该目录就会被排除跟踪。
- 如果 `/` 在 `pattern` 中出现，就意味着找到 `/` 前的目录（必须是一个目录，因为 `/` 是目录分隔符），比如 `src/app`，就代表找到 `src` 目录，然后在这个目录下（不能递归，只能在目录下的第一层）找 `app`。
- 找到 `/` 前对应的目录之后，在目录的第一层寻找 `/` 之后对应的文件或者目录。注意这里不像没有 `/` 的情况可以一直像更深的层级递归寻找，因为 `/` 指定了目录，所以只能在目录的第一层寻找。
- 如果 `/` 出现在 `pattern` 的第一个字符，就代表在根目录下寻找。如果 `/` 出现在 `pattern` 的最后一个字符，表示你要找的是一个目录而不是文件。所以如果你要找根目录下的一个 `test` 的文件夹 `/test`，`/test/` 和 `test` 都能找到，但是只有 `/test/` 是确保找的根目录下的 `test` 文件夹，`/test` 有可能找到的是一个文件，而不是文件夹，而 `test` 则会往更深的嵌套目录去寻找 `test`，可能会匹配到其他 `test` 文件和文件夹。
- `*`用来匹配零个或多个字符（不包括 `/`)，如 `*.[oa]` 忽略所有以 `".o"` 或 `".a"` 结尾，`*~` 忽略所有以 `~` 结尾的文件（这种文件通常被许多编辑器标记为临时文件）；
- `[]` 用来匹配括号内的任一字符，如 `[abc]`，也可以在括号内加连接符，如 `[0-9]` 匹配0至9的数，类似正则表达式；
- `?` 用来匹配单个字符（不包括 `/`)。
- `**` ：与嵌套目录匹配，比如 `a/**/z` 与以下项匹配 `a/z`、`a/b/z`、a/b/c/z。
- 可以使用标准的 `glob` 模式匹配。所谓的 `glob` 模式是指 `shell` 所使用的简化了的正则表达式。

```plaintext
# 忽略 .a 文件
*.a

# 但否定忽略 lib.a, 尽管已经在前面忽略了 .a 文件
!lib.a

# 忽略 doc/notes.txt, 不包括 doc/server/arch.txt
doc/*.txt

# 忽略所有的 .pdf 文件 在 doc/ directory 下的
doc/**/*.pdf

# /dir 将匹配.gitignore所在层级一个文件，目录，链接，任何名为dir的内容
# /dir/  将只会匹配.gitignore所在层级一个名为dir的目录
# /dir/* 将匹配所有文件，目录和其他任何在名为dir的目录（也在.gitignore所在层级）里的内容（但是不包括这个目录本身）
# 如果你使用 !.gitkeep 并且有个 dir/.gitkeep 文件，对于 /dir 和 /dir/ 这两种匹配规则，你写的 !.gitkeep 不会生效，因为 Git不会去 dir 文件夹的内部检查；对于 /dir/*，Git会检查.gitkeep，并且dir文件夹会被提交，因为这条模式不会应用到文件夹，而是应用到文件夹里面的内容。
```

> 可以用 `git check-ignore` 来查看我们某个文件是否被忽略，命令的细节查看[官方文档](https://git-scm.com/docs/git-check-ignore '官方文档')。

在 `.gitingore` 文件中，每一行指定一个忽略规则，`Git` 检查忽略规则的时候有多个来源，它的优先级如下（由高到低）： 1、从命令行中读取可用的忽略规则 2、当前目录定义的规则 3、父级目录定义的规则，依次递推 4、`$GIT_DIR/info/exclude` 文件中定义的规则 5、`core.excludesfile` 中定义的全局规则

`git` 对于 `.gitignore` 配置文件是按行从上到下进行规则匹配的，意味着如果前面的规则匹配的范围更大，则后面的规则将不会生效；如果你不慎在创建 `.gitignore` 文件之前就 `push` 了项目，那么即使你在 `.gitignore` 文件中写入新的过滤规则，这些规则也不会起作用，`Git` 仍然会对所有文件进行版本管理。所以在项目创建时就设计好对应的 `.gitignore` 文件是一个好习惯。

`Github` 官方有一个仓库提供了各种语言的 `.gitignore` 模版，可以用来进行参考，仓库地址 [gitignore](https://github.com/github/gitignore 'gitignore')

> 本文虽然是以 `.gitignore` 进行语法说明，不过大多数的 `ignore` 文件语法都类似，可以直接套用。

## 参考文章

1. [git-scm document](https://git-scm.com/docs/gitignore 'git-scm document')
2. [Difference between .gitignore rules with and without trailing slash like /dir and /dir/](https://stackoverflow.com/questions/17888695/difference-between-gitignore-rules-with-and-without-trailing-slash-like-dir-an/38559600#38559600 'Difference between .gitignore rules with and without trailing slash like /dir and /dir/')
