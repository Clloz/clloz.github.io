---
title: '一台设备添加多个 Github 账号'
publishDate: '2020-09-25 12:00:00'
description: ''
tags:
  - assorted
  - 实用技巧
language: '中文'
heroImage: { 'src': './github.png', 'color': '#B4C6DA' }
---

## 前言

想要深入学习 `Git` 肯定要模拟多人操作同一个仓库，最好的方法就是自己创建两个账号进行模拟。`Github` 的账号注册很简单，但是一般我们在一台设备上只配置一个 `ssh` 公私钥，多个账号的 `ssh` 该如何配置呢。在谷歌上找的文章没有一个讲的特别清楚的，不过经过我的尝试，已经把配置和使用过程搞清楚了，本文和大家分享一下。

## 准备

准备工作就是两个 `Github` 账号和两对 `ssh` 公私钥。`Github` 的账号注册就不说了，`ssh` 的公私钥的创建可以参考[ssh的简介和使用](https://www.clloz.com/programming/assorted/2019/10/02/ssh-rsa/ 'ssh的简介和使用')。这里特别提一下，`ssh` 默认创建的公私钥文件名分别是 `id_rsa` 和 `id_rsa.pub`，为了清楚的区分我们是为 `Github` 创建的公私钥我们可以加上 `-f location` 参数来指定生成的文件的路径和名字，比如 `-f ~/.ssh/github1` 就会生成 `github1` 和 `github1.pub` 这一对公私钥。

然后将两个公钥分别放到自己注册的两个 `Gihub` 账号的 `Settings -> SSH and GPG keys` 中。

> 注册账号的时候如果 `verify` 页面报错 `Unable to verify your captcha response`，很可能是连不上 `https://octocaptcha.com/`，需要代理。

## 设置过程

现在我们已经生成两对公私钥，并且公钥也配置到对应的账户中去了，下面就是对机器的配置。

我们通过 `ssh` 访问 `Github` 的项目。比如 `git clone`，`Github` 会给我们一个项目链接形如 `git@github.com:username/repository_name.git`，这个 `git@github.com` 就是我们连接 `Github` 的关键。当我们的设备中只有一对默认公私钥 `id_rsa` 的时候，`ssh` 请求默认就会认为私钥是 `id_rsa`，从而进行匹配。

但是当我们的 `.ssh` 文件夹中有两对甚至更多的公私钥的时候，并且我们进行了自定义的命名，此时我们就要对公私钥进行配置，告诉 `ssh` 如何寻找对应的私钥。

配置文件位于 `~/.ssh/config`，如何配置看下面的例子。更多 `ssh config` 的配置字段参考 [SSH Config 那些你所知道和不知道的事](https://deepzz.com/post/how-to-setup-ssh-config.html 'SSH Config 那些你所知道和不知道的事')

```bash
#Github clloz@outlook.com
host github.com
    hostname github.com
    User Clloz
    IdentityFile /Users/clloz/.ssh/Clloz_Github

#Github clloz1992@gmail.com
host clloz1992
    hostname github.com
    User Clloz1992
    IdentityFile /Users/clloz/.ssh/Clloz1992_Github
```

这几个字段意思如下:

- `Host`: 我们上面说过 `Github` 的链接是 `git@github.com`，这个 `host` 就是我们自定义的，下面的 `hostname` 别名。
- `hostname`：`Github` 域名，其实 `IP` 也可以，我们和 `git` 进行 `ssh` 通信的时候，请求从这个地址来。
- `user`：我们在 `Github` 上注册的用户名（好像邮箱也可以）。
- `IdentityFile`：对应的**私钥**的路径。

这里特别提一下 `Host` 这个字段，理论上这个字段可以自定义，但是我建议你常用的那个 `GIthub` 账号这个字段就使用 `github.com`。首先我们说一下配置生效的原理，所有的 `Github` 的仓库的地址默认都是 `git@github.com` 开头，无论是来自哪个用户，也就是说 `hostname` 都是 `github.com`。现在我们在 `config` 文件中，为 `github.com` 指定了两个别名 `allias1` 和 `alias2`，现在我们设置 `remote` 或者 `git clone` 的时候不再是使用 `git@github.com`，而是换成 `git@alias1` 和 `git@alias2`。这样配置以后，每次用 `ssh` 通信的时候我们用别名做 `host`，而每个别名对应的私钥都在 `identityfile` 字段中配置了，自然能够成功的按账号进行区分。简单的说，**就是原本我们的公私钥是按照 `hostname` 来匹配的，但是由于 `github` 的所有仓库 `hostname` 都一样，无法对用户进行区分，我们就用别名来设置 `host` 进行区分，别名的作用就类似于用户名**，

而由于 `Github` 上复制地址的时候默认就是 `git@github.com`，如果你将 `host` 自定义成其他的，每次 `git clone` 都要手动改一下 `host`，非常麻烦。如果不改的话将无法对仓库进行任何操作，因为此时 `github.com` 这个 `host` 在我们本地的 `ssh` 中是找不到对应的私钥的。而且如果你的本地本来就有很多原来 `clone` 的项目，他们的 `host` 都是 `github.com`，此时你也不能对他们进行任何操作，`git pull` 都不可以，你必须将 `remote` 修改为你配置后的 `host` 才能正常操作，如果本地仓库非常多的话，这将非常麻烦。关于报错可以参考下面的我将 `host` 改为一个自定义的值之后，对原来的 `github.com` 的仓库进行 `git pull` 报错如下：

```bash
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

都设置完成后我们可以用 `ssh -T host_alias` 来进行测试，如果 `host` 和返回的用户名匹配成功则说明我们的设置生效了。

```bash
ssh -T git@clloz1992
#Hi Clloz1992! You've successfully authenticated, but GitHub does not provide shell access.

ssh -T git@github.com 
#Hi Clloz! You've successfully authenticated, but GitHub does not provide shell access.
```

---

经过上面的配置以后，我们已经能够正常的进行两个 `github` 账号的仓库管理了。需要注意的是分清楚当前仓库是属于哪个用户的。比如 `account1` 对应的 `host` 是 `allias1`，`accout2` 对应的 `host` 是 `alias2`，那么你 `clone` 或者设置 `remote` 的时候地址就要将 `github.com` 改为对应的 `alias`。如果你在 `accout2` 下面创建了一个仓库，然后 `clone` 的时候用的是 `git clone git@alias1:username/repository_name.git`。那么你会发现，当你进行 `push` 的时候会报如下的错误：

```bash
ERROR: Permission to Clloz/git_learning.git denied to Clloz1992.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

因为这是 `alias1` 的仓库，我们自然没有权限对其进行操作。不过我们可以登录 `alias1` 的 `Github` 账户，在对应的 `repository` 的 `Settings -> Manage Access` 中将 `allias2` 对应的用户添加到 `Collaborator` 中，我们就能对这个仓库进行操作了。

---

还有一点需要注意的，在 `git config --global` 中的 `user.name` 和 `user.email` 我们可以设置为常用账户的，在 `alias2` 的本地仓库中我们可以用 `git config --local` 进行单独的设置。我们在 `Github` 中看到的 `commit` 就是根据 `config` 来确定是哪个 `github` 用户提交的。比如我在 `alias2` 的仓库中设置 `config` 的 `user.name` 和 `user.email` 为 `alias1` 对应的用户信息然后进行 `commit push`，那么在 `github` 上看到的提交就是由 `alias1` 对用的用户完成的，`contributor` 中也多了 `alias1` 对应的用户，虽然我们并没有把他加入到 `Collaborator` 中。

所以如果我们只是要模拟多人提交，我们也不必在本地配置两个 `github` 账户的 `ssh`，我们可以用同一个账号 `clone` 将 `repository` 克隆到两个不同的文件夹，然后两个文件夹的 `.git/config` 中的 `user.name` 和 `user.email` 配置成我们对应的 `github` 账号的就可以。因为 `github` 分辨 `commit` 的来源是根据 `config` 中的 `user` 信息的。

所以我们总结一下：`ssh` 的公私钥只是根据 `host` 确定了当前的设备是否有权限访问某个 `Github` 下的仓库；而 `config` 中的 `user` 信息确定了当前在操作仓库的是谁。

## ssh-agent

最后再说一下 `ssh-agent`。关于 `ssh-agent` 的详细内容还是看[ssh的简介和使用](https://www.clloz.com/programming/assorted/2019/10/02/ssh-rsa/ 'ssh的简介和使用')，我这里主要要说的是，如果你为私钥设置了 `passphrase`，想要使用 `ssh-agent`，那么你**必须把两个账号的私钥都交给 `ssh-agent` 来代理**，否则会出错。

## 参考文章

1. [同一台电脑配置多个git账号](https://github.com/jawil/notes/issues/2 '同一台电脑配置多个git账号')
2. [一台电脑，两个及多个git账号配置](https://www.cnblogs.com/fanbi/p/7825746.html '一台电脑，两个及多个git账号配置')
3. [多个密钥ssh-key的生成与管理](https://me.chjiyun.com/2017/08/28/%E5%A4%9A%E4%B8%AA%E5%AF%86%E9%92%A5ssh-key%E7%9A%84%E7%94%9F%E6%88%90%E4%B8%8E%E7%AE%A1%E7%90%86/ '多个密钥ssh-key的生成与管理')
