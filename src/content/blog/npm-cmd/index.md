---
title: 'npm常用命令'
publishDate: '2020-09-02 12:00:00'
description: ''
tags:
  - js
  - 实用技巧
language: '中文'
heroImage: {"src":"./npm.png","color":"#B4C6DA"}
---

\[toc\]

## 前言

整理 `npm` 常用的一些命令，方便查看。

## 通用命令

## 帮助命令

```bash
npm <command> -h  #快速查看某条命令的简单使用帮助，包括语法和别名。
npm -l            #显示所有可用命令和说明
npm help <term>   #查看命令的详细帮助
```

## 初始化

```bash
npm init    #在命令行所在的文件夹初始化一个项目（创建 package.json 文件）
npm init --yes    #跳过配置，强制yes
```

## 模块

## 通用命令

```bash
npm root    #查看本地安装的目录

npm root -g    #查看全局安装的目录

npm info package    #查看包信息

npm info "package@latest" peerDependencies #查看包依赖

npm ls    #查看本地安装包

npm ls -g    #查看全局安装包，包含依赖

npm ls -g --depth 0    #查看全局安装包，不包含依赖

npm outdated    #列出所有不是最新版的包，可以带参数

npm cache clean    #清除本地缓存

npm config ls -l    #查看npm配置

npm view package versions    #查看包的所有版本

npm publish     #发布包

npm access    #设置发布包的访问级别

npm search    #搜索registry
```

## 安装模块

我们经常在 `package.json` 看到包的版本号之前有 `~ ^ * x` 等符号，这些符号是 `semantic-versioning` 语义化版本控制。版本号形如 `major.minor.patch`，分别表示 `主版本号.次版本号.修补版本号`。

没有任何修饰符的版本号表示必须匹配某个具体版本号。

`< <= > >=` 即字面上的意思。

`~` 波浪线表示如果 `minor` 版本号指定了，那么 `minor` 版本号不变，而 `patch` 版本号任意，如果 `minor` 和 `patch` 版本号未指定，那么 `minor` 和 `patch` 版本号任意，如果 `patch` 版本号也制定了，则从指定的数字为范围的下限。下面是 `npm` 官方文档的一些例子。

```bash
~1.2.3 := >=1.2.3 <1.(2+1).0 := >=1.2.3 <1.3.0
~1.2 := >=1.2.0 <1.(2+1).0 := >=1.2.0 <1.3.0 (Same as 1.2.x)
~1 := >=1.0.0 <(1+1).0.0 := >=1.0.0 <2.0.0 (Same as 1.x)
~0.2.3 := >=0.2.3 <0.(2+1).0 := >=0.2.3 <0.3.0
~0.2 := >=0.2.0 <0.(2+1).0 := >=0.2.0 <0.3.0 (Same as 0.2.x)
~0 := >=0.0.0 <(0+1).0.0 := >=0.0.0 <1.0.0 (Same as 0.x)
```

`^` 尖括号表示版本号中最左边的非 `0` 数字的右侧可以任意。

```bash
^1.2.3 := >=1.2.3 <2.0.0
^0.2.3 := >=0.2.3 <0.3.0
^0.0.3 := >=0.0.3 <0.0.4
```

`x` 表示该位置任意，`*` 和 `""` 则表示任意版本。

关于版本号的语法参考[官方文档](https://docs.npmjs.com/cli/v6/using-npm/semver "官方文档")。

可以用连字符表示版本号范围，比如 `1.2.3 - 2.3.4` 等价于 `>=1.2.3 <=2.3.4`，可以用空格来表示逻辑与，`||` 表示逻辑或，如：`<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0`，表示满足这 `3` 个范围的版本都可以。

`~`

```bash
npm install package    #局部安装模块，安装在命令行所在的文件夹；并将模块依赖写入到 package.json 文件的 dependencies 中（生产环境）
#简写
npm i package

npx install-peerdeps  package #安装包的同时安装所有依赖

npm install --save-prod package    #局部安装时将模块依赖写入到 package.json 文件的 dependencies 中（生产环境），这是默认值，除非指定其他值，所以一般不需要输入这个参数
#简写
npm install -P package

npm install --save-dev package    #局部安装时将模块依赖写入到 package.json 文件的 devDependencies 中（开发环境）
#简写
npm install -D package

npm install --save-optional package #局部安装时将模块依赖写入到 package.json 文件的 optionalDependencies 中.
#简写
npm install -O package

npm install --no-save package #局部安装时阻止模块依赖写入到 package.json 文件的 devDependencies 中.

npm install -g package    #全局安装模块

#从github仓库安装
npm install git://github.com/package/path.git
npm install git://github.com/package/path.git#0.1.0

npm install <packageName> --force    #强制重新安装

#安装指定版本
npm install sax@latest
npm install sax@0.1.1
npm install sax@">=0.1.0 <0.2.0"

#安装beta版
npm install <module-name>@beta (latest beta)
npm install <module-name>@1.3.1-beta.3

#只安装package.json中的dependencies字段的模块
npm install --production
NODE_ENV=production npm install
```

这里讲一讲 `dependencies`，`devDependencies`，`optionalDependencies` 的区别，在 `npm 5.0.0` 之前，局部安装的包是默认不写入 `package.json` 中的，那时候需要将模块依赖手动加入 `package.json`，后来有个命令就是 `npm install --save package` 或者 `npm install -S package`，会将模块依赖写入到 `dependencies` 中，不过在 `5.0.0` 之后模块依赖默认写入到 `dependencies` 中，我们已经不需要为 `npm install` 添加额外的参数了，现在的缺省参数是 `npm install --save-prod package` 或者 `npm install -P package`。所以就我们现在的使用来说，生产环境的的包安装直接 `npm install` 即可，开发环境的包 `npm install -D` 即可。

那么这几种依赖有什么区别呢？大致总结如下：

- `dependencies`：应用依赖，或者叫做业务依赖，它用于指定应用依赖的外部包，这些依赖是应用发布后正常执行时所需要的，但不包含测试时或者开发时所使用的包，比如打包工具之类。
- `devDependencies`：开发环境依赖，它的对象定义和 `dependencies` 一样，只不过它里面的包只用于开发环境，不用于生产环境，这些包通常是单元测试或者打包工具等，例如 `gulp, grunt, webpack, moca, coffee` 等。
- `optionalDependencies`：可选依赖，如果有一些依赖包即使安装失败，项目仍然能够运行或者希望 `npm` 继续运行，就可以使用 `optionalDependencies`。另外 `optionalDependencies` 会覆盖 `dependencies` 中的同名依赖包，所以不要在两个地方都写。举个栗子，可选依赖包就像程序的插件一样，如果存在就执行存在的逻辑，不存在就执行另一个逻辑。
- `peerDependencies`：可以理解为子依赖，有时我们安装的包会依赖于其他的包。关于这一点可以参考[官方文档](https://nodejs.org/es/blog/npm/peer-dependencies/ "官方文档")以及[探讨npm依赖管理之peerDependencies](https://www.cnblogs.com/wonyun/p/9692476.html "探讨npm依赖管理之peerDependencies")

## 卸载模块

```bash
npm uninstall package    #卸载局部模块

npm uninstall -g package    #卸载全局模块
```

## 更新模块

```bash
npm update package    #更新局部模块

npm update -g package    #更新全局模块

npm update -g package@version   #更新全局模块 package-name 到 x.x.x 版本

```

## npm 镜像

```bash
npm install express --registry https://registry.npm.taobao.org    #临时使用

npm config set registry https://registry.npm.taobao.org    #永久更换 可以用 npm config get registry或npm info

npm config set registry https://registry.npmjs.org    #设置为默认镜像
```

也可以安装 `nrm` 管理 `npm` 源，安装命令 `npm install -g nrm`，它内置了如下源：

- `npm ---- https://registry.npmjs.org/`
- `cnpm --- http://r.cnpmjs.org/`
- `taobao - https://registry.npm.taobao.org/`
- `nj ----- https://registry.nodejitsu.com/`
- `rednpm - http://registry.mirror.cqupt.edu.cn/`
- `npmMirror https://skimdb.npmjs.com/registry/`
- `edunpm - http://registry.enpmjs.org/`

主要有如下几个命令：

- `ls`：列出所有可用 `registries`
- `current`：列出当前使用的 `registry`
- `use <registry>`：切换源
- `add <registry> <url> [home]`：添加一个自定义的源
- `del <registry>`：删除一个自定义源
- `home <registry> [browser]`：打开指定源的主页
- `test [registry]`：查看指定源的连接情况（响应时间）
- `help`：查看帮助

## npm的包管理机制

关于 `package.json` 的详细剖析和实际工作中的包管理实践，参考抖音前端整理的[npm的包管理机制](https://juejin.cn/post/6844904022080667661 "npm的包管理机制")

## 参考文章

1. [npm模块管理器](https://javascript.ruanyifeng.com/nodejs/npm.html#toc2 "npm模块管理器")