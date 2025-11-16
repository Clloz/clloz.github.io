---
title: 'Shell脚本语法'
publishDate: '2019-11-01 12:00:00'
description: ''
tags:
  - operating-system
  - 实用技巧
  - 计算机系统
language: '中文'
heroImage: {"src":"./linux-logo.png","color":"#B4C6DA"}
---

\[toc\]

## 前言

`Shell` 是一个用 `C` 语言编写的程序，一般是一个命令行界面，是 `UNIX` 操作系统下传统的用户和计算机的交互界面。之所以称为 `Shell`，即壳，是和内核相对应，因为它隐藏了操作系统底层的细节，用户通过这个界面访问操作系统内核的服务，`Ken Thompson` 的 `sh` 是第一种 `Unix Shell`，`Windows Explorer` 是一个典型的图形界面 `Shell`。`Shell` 既是一种命令语言，又是一种程序设计语言。`Shell` 编程跟 `JavaScript`、`php` 编程一样，只要有一个能编写代码的文本编辑器和一个能解释执行的脚本解释器就可以了。常见的 `Shell` 程序有：

- Bourne Shell（/usr/bin/sh或/bin/sh）
- Bourne Again Shell（/bin/bash）
- C Shell（/usr/bin/csh）
- K Shell（/usr/bin/ksh）
- Shell for Root（/sbin/sh）

等，其中 `bash` 是大部分 `Linux` 系统默认的 `Shell`。本文整理一下 `linux` 下常用的的 `shell` 命令，方便查询。在一般情况下，人们并不区分 `Bourne Shell` 和 `Bourne Again Shell`，所以，像 `#!/bin/sh`，它同样也可以改为 `#!/bin/bash`。



**注意 `Shell Script` 都是在一个子 `Shell` 中运行，所以如果像执行 `cd` 这样的命令会发现不生效，因为在子 `Shell` 中完成后又退出了，像这样的命令应该用 `alias` 或者函数**

## shell 中的一些操作符和规则

## 首行 `#!/bin/bash`

`Shell` 脚本的第一行 `#!` 告诉系统其后路径所指定的程序即是解释此脚本文件的 `Shell` 程序。`Shell` 脚本的后缀名并不影响其执行，不过一般是使用 `sh`，以免引起误解。

## 执行脚本的方法

运行 Shell 脚本有两种方式。 1. 作为解释器参数：直接调用对应的 `Shell` 解释并执行脚本，比如 `sh test.sh`，`/bin/sh test.sh`，用这种执行方法在脚本的第一行就不用指定 `Shell` 程序了，指定也会被忽略。 2. 作为可执行程序：需要先给对应的脚本文件添加执行权限 `chmod +x ./test.sh`，然后直接执行 `./test.sh`。需要注意的是，不能够直接用 `test.sh`，必须加上 `./`，因为如果直接用 `test.sh` 的话系统会去 `PATH` 里寻找有没有叫 `test.sh`，加上 `./` 就是告诉 `Shell` 在当前目录下找。

## shell 中的变量

变量名和等号之间不能有空格，命名只能使用英文字母，数字和下划线，首个字符不能以数字开头。中间不能有空格，不能使用标点符号，不能使用bash里的关键字。使用一个定义过的变量，只要在变量名前面加美元符号即可，变量名外面的花括号是可选的，加不加都行，加花括号是为了帮助解释器识别变量的边界。

运行 `shell` 时，会同时存在三种变量： 1. 局部变量 局部变量在脚本或命令中定义，仅在当前 `shell` 实例中有效，其他 `shell` 启动的程序不能访问局部变量。 2. 环境变量 所有的程序，包括 `shell` 启动的程序，都能访问环境变量，有些程序需要环境变量来保证其正常运行。必要的时候 `shell` 脚本也可以定义环境变量。 3. `shell` 变量 `shell` 变量是由 `shell` 程序设置的特殊变量。`shell` 变量中有一部分是环境变量，有一部分是局部变量，这些变量保证了 `shell` 的正常运行

```bash
your_name="clloz"
echo $your_name
echo ${your_name}

for skill in Ada Coffe Action Java; do
    echo "I am good at ${skill}Script"
done

# 重新定义已定义的变量
your_name="tom"
echo $your_name
your_name="alibaba"
echo $your_name

# 用readonly命令将变量变为只读
#!/bin/bash
myUrl="http://www.clloz.com"
readonly myUrl
myUrl="http://www.clloz1992.com" #This variable is read only.

#删除变量，unset不能删除只读变量
unset variable_name
```

## 字符串

字符串是 `Shell` 编程中最常用最有用的数据类型(除了数字和字符串，也没啥其它类型好用了)，字符串可以用单引号，也可以用双引号，也可以不用引号。单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的，单引号必须成对出现。双引号中除了 美元符号、`\`、 反引号有特殊含义外，其余字符(`如IFS`、换行符、回车符等)没有特殊含义，所以双引号里面可以引用变量，并且可以转义特殊字符。

```bash
your_name="clloz"
# 使用双引号拼接
greeting="hello, "$your_name" !"
greeting_1="hello, ${your_name} !"
echo $greeting  $greeting_1 #hello, clloz ! hello, clloz !
# 使用单引号拼接
greeting_2='hello, '$your_name' !'
greeting_3='hello, ${your_name} !'
echo $greeting_2  $greeting_3 #hello, clloz ! hello ${your_name} !

# 获取字符串长度
string="abcd"
echo ${#string} #输出 4

# 提取字符串
string="clloz.com"
echo ${string:1:5}  # 输出 lloz.
```

## 数组

```bash
# 定义数组
array_name=(value0 value1 value2 value3)

array_name=(
value0
value1
value2
value3
)

# 单独定义数组分量，下标可以不连续，且下标的
array_name[0]=value0
array_name[1]=value1
array_name[n]=valuen

# 读取数组
valuen=${array_name[n]}
echo ${array_name[@]} #输出所有数组元素

# 取得数组元素的个数
length=${#array_name[@]}
# 或者
length=${#array_name[*]}
# 取得数组单个元素的长度
lengthn=${#array_name[n]}
```

## `|`

竖线 `|`，在 `shell` 中是作为管道符的，将 `|` 前面命令的输出作为 `|` 后面的输入。

## `||`

用双竖线 `||` 分割的多条命令，执行的时候遵循如下规则，如果前一条命令为真，则后面的命令不会执行，如果前一条命令为假，则继续执行后面的命令。比如判断文件是否存在，不存在则创建，存在就什么都不执行。

## `&`

`&` 同时执行多条命令，不管命令是否执行成功。

## `&&`

`&&` 可同时执行多条命令，当碰到执行错误的命令时，将不再执行后面的命令。如果一直没有错误的，则执行完毕。

## `.`

一个 `dot` 代表当前目录，两个 `dot` 代表上层目录。`dot` 如果位于文件或目录的第一个字符，该档案就属特殊档案，用 `ls` 指令必须加上 `-a` 选项才会显示。

## `~`

`~`代表使用者的 `home` 目录：`cd ~`；也可以直接在符号后加上某帐户的名称：`cd ~user`或者当成是路径的一部份。`~+` 表示当前工作目录，和 `pwd` 相同；`~-` 表示上次工作目录。

## `;`

在 `shell` 中，担任"连续指令"功能的符号就是"分号"。譬如以下的例子：`cd ~/backup ; mkdir startup ;cp ~/.* startup/`。

## `` ` `` 倒引号 backticks

倒引号中的字符串会被当做命令执行。

## `[]` 方括号

常出现在流程控制中，扮演括住判断式的作用。

```bash
 if [ "$?" != 0 ] then echo "Executes error" exit 1 fi
```

## `[[]]`

与 `[]` 基本上作用相同，但允许在其中直接使用 `||` 与`&&` 逻辑等符号。

## `()` 指令群组

用括号将一串连续指令括起来，这种用法对 `shell` 来说，称为指令群组。如下面的例子:

```bash
(cd ~ ; vcgh=`pwd` ;echo $vcgh)
```

指令群组有一个特性，`shell` 会以产生 `subshell` 来执行这组指令。因此，在其中所定义的变数，仅作用于指令群组本身。

## `(())`

这组符号的作用与 `let` 指令相似，用在算数运算上，是 `bash` 的内建功能。所以，在执行效率上会比使用 `let` 指令要好许多。

## 美元符号

```bash
$0  表示shell的命令本身，包括完整路径，$0 是脚本本身的名字
$1 - $9 表示shell 的第几个参数
$# 表示传递到脚本的参数个数
$* 表示以一个单字符串显示所有向脚本传递的参数
双$ 表示脚本运行的ID号
$! 表示后台运行的最后一个进程的ID号
$@ 与$*相同。
$- 显示shell使用的当前选项。
$? 显示最后命令的执行状况。0表示没有错误。
```

## 文件描述符

在 `Linux` 系统中一切皆可以看成是文件，文件又可分为：普通文件、目录文件、链接文件和设备文件。文件描述符（`file descriptor`）是内核为了高效管理已被打开的文件所创建的索引，其是一个非负整数（通常是小整数），用于指代被打开的文件，所有执行 `I/O` 操作的系统调用都通过文件描述符。程序刚刚启动的时候，`0` 是标准输入 `stdin`，`1`是标准输出 `stdout`，`2`是标准错误 `stderr`。如果此时去打开一个新的文件，它的文件描述符会是 `3`。`POSIX` 标准要求每次打开文件时（含 `socket`）必须使用当前进程中最小可用的文件描述符号码。

## 重定向 `<` `>`

大多数 `UNIX` 系统命令从你的终端接受输入并将所产生的输出发送回到终端。一个命令通常从一个叫标准输入的地方读取输入，默认情况下，这恰好是你的终端。同样，一个命令通常将其输出写入到标准输出，默认情况下，这也是你的终端。

- `command > file`：将输出重定向到 `file`。
- `command < file`：将输入重定向到 `file`。
- `command >> file`：将输出以追加的方式重定向到 `file`。
- `n > file`：将文件描述符为 `n` 的文件重定向到 `file`。
- `n` >> `file` 将文件描述符为 `n` 的文件以追加的方式重定向到 `file`。
- `n` >& `m` 将输出文件 `m` 和 `n` 合并。
- `n` <& `m` 将输入文件 `m` 和 `n` 合并。
- `<< tag` 将开始标记 `tag` 和结束标记 `tag` 之间的内容作为输入。

在输出重定向中，`>` 代表的是覆盖，`>>` 代表的是追加。

```bash
# 实例
command >file #以覆盖的方式，把 command 的正确输出结果输出到 file 文件中。
command >>file #以追加的方式，把 command 的正确输出结果输出到 file 文件中。
command 2>file #以覆盖的方式，把 command 的错误信息输出到 file 文件中。
command 2>>file #以追加的方式，把 command 的错误信息输出到 file 文件中。
command >file 2>&1 #以覆盖的方式，把正确输出和错误信息同时保存到同一个文件（file）中。
command >>file 2>&1 #以追加的方式，把正确输出和错误信息同时保存到同一个文件（file）中。
command >file1 2>file2 #以覆盖的方式，把正确的输出结果输出到 file1 文件中，把错误信息输出到 file2 文件中。
command >>file1  2>>file2 #以追加的方式，把正确的输出结果输出到 file1 文件中，把错误信息输出到 file2 文件中。
command <file #将 file 文件中的内容作为 command 的输入。
command <<END #从标准输入（键盘）中读取数据，直到遇见分界符 END 才停止（分界符可以是任意的字符串，用户自己定义）。
command <file1 >file2 #将 file1 作为 command 的输入，并将 command 的处理结果输出到 file2。
```

> 关于 `shell` 中的单引号和双引号的用法请看我的另一篇文章[shell中的引号和转义](https://www.clloz.com/programming/computer-science/operating-system/2019/04/12/shell-quote-escape/ "shell中的引号和转义")

## 常用命令

在 `Linux` 中，可执行的文件也进行了分类：

内置命令：出于效率的考虑，将一些常用命令的解释程序构造在 `Shell` 内部。 外置命令：存放在 `/bin`、`/sbin` 目录下的命令 实用程序：存放在 `/usr/bin`、`/usr/sbin`、`/usr/share`、`/usr/local/bin` 等目录下的实用程序 用户程序：用户程序经过编译生成可执行文件后，可作为 `Shell` 命令运行 `Shell` 脚本：由 `Shell` 语言编写的批处理文件，可作为 `Shell` 命令运行

关于 `Linux` 常用命令已经在另一篇文章[Linux常用命令](https://www.clloz.com/programming/computer-science/operating-system/2020/08/18/linux-command/ "Linux常用命令")中进行了详细的介绍。

## 参考文章

1. [linux中竖线'|'，双竖线‘||’，&和&&的意思](https://www.cnblogs.com/jpfss/p/10077390.html "linux中竖线'|'，双竖线‘||’，&和&&的意思")
2. [看完这篇Linux基本的操作就会了 - 知乎](https://zhuanlan.zhihu.com/p/36801617 "看完这篇Linux基本的操作就会了 - 知乎")
3. [Shell教程 - 菜鸟教程](https://www.runoob.com/linux/linux-shell.html "Shell教程 - 菜鸟教程")
4. [Shell中的美元符号](https://blog.csdn.net/MiltonZhong/article/details/10344163#:~:text=Linux%20Shell%E4%B8%AD%E7%9A%84%E7%BE%8E%E5%85%83,%E5%88%B0%249%20%E6%95%B0%E5%AD%97%E8%A1%A8%E7%A4%BAshell "Shell中的美元符号")
5. [Linux特殊符号大全](https://www.cnblogs.com/balaamwe/archive/2012/03/15/2397998.html "Linux特殊符号大全")
6. [Shell输入/输出重定向](https://www.runoob.com/linux/linux-shell-io-redirections.html "Shell输入/输出重定向")