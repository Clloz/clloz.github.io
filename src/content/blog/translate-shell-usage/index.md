---
title: 'translate-shell 常用命令'
publishDate: '2019-11-18 12:00:00'
description: ''
tags:
  - assorted
  - 奇技淫巧
  - 实用技巧
language: '中文'
heroImage: { 'src': './terminal.png', 'color': '#B4C6DA' }
---

## 前言

我在 `Mac` 的命令行里面使用的翻译工具是[fanyi](https://www.npmjs.com/package/fanyi 'fanyi')，安装方法为 `npm install -g fanyi`，这个工具只能进行中英文翻译，翻译的来源是[金山词霸](http://www.iciba.com/ '金山词霸')和[有道词典](http://fanyi.youdao.com/ '有道词典')，如果只是要翻译英文的话其实挺好用的。不过我日常经常需要查询日语，`Mac` 自带的 `dictionary` 里面的日语字典只有 `大辞林` 和 `日英字典`，所以对我来说翻译日语经常需要用 `Google`。

今天给大家介绍另一个功能更强的命令行翻译工具，叫做[Translate Shell](https://github.com/soimort/translate-shell 'Translate Shell')，它的翻译来源主要是 `Google Translate (default)`, `Bing Translator`, `Yandex.Translate`, 和 `Apertium`。它的功能要比 `fanyi` 强很多，它能够在多种语言之间进行翻译，也能翻译句子。

```bash
$ trans 'Saluton, Mondo!'
Saluton, Mondo!

Hello, World!

Translations of Saluton, Mondo!
[ Esperanto -> English ]
Saluton ,
    Hello,
Mondo !
    World!
```

可以进行简要翻译，不限时那么多结果

```bash
$ trans -brief 'Saluton, Mondo!'
Hello, World!
```

可以在命令行进入翻译交互的状态，不用每次都输入命令，在阅读文章或资料的时候很有用

```bash
$ trans -shell -brief
> Rien ne réussit comme le succès.
Nothing succeeds like success.
> Was mich nicht umbringt, macht mich stärker.
What does not kill me makes me stronger.
> Юмор есть остроумие глубокого чувства.
Humor has a deep sense of wit.
> 學而不思則罔，思而不學則殆。
Learning without thought is labor lost, thought without learning is perilous.
> 幸福になるためには、人から愛されるのが一番の近道。
In order to be happy, the best way is to be loved by people.
```

## Translate Shell 的安装和使用

## 安装

官方提供了三种安装方法

1. 下载[the self-contained executable](http://git.io/trans 'the self-contained executable')，然后放置到 `path` 对应的位置。

```bash
wget git.io/trans
chmod +x ./trans
sudo mv trans /usr/bin/
```

2. 通过 `Git` 安装，克隆 `Translate Shell` 的 `GitHub` 仓库然后手工编译。

```bash
$ git clone https://github.com/soimort/translate-shell
$ cd translate-shell/
$ make
$ [sudo] make install
# In case you have only zsh but not bash in your system, build with:
$ make TARGET=zsh
# The default PREFIX of installation is /usr/local. To install the program to somewhere else (e.g. /usr, ~/.local), use:
$ [sudo] make PREFIX=/usr install
```

3. 通过包管理工具安装，有些发行版的官方仓库中包含了 `Translate Shell`，可以通过包管理器来安装。在 `Mac` 上直接通过 `homebrew` 安装即可。

```bash
brew install translate-shell
```

## Translate Shell 的使用

`Google Translate` 能够自动识别待翻译文本，`Translate Shell` 会将系统 `locale` 中的语言作为目标语言。所以如果你可以根据你的日常翻译需求来设置 `locale`，一般来说就设为英语就可以了。当然不设置也可以，在使用 `Translate Shell` 的时候加上目标语言参数就可以了

这里科普一下 `locale`，区域设置（`locale`），也称作“本地化策略集”、“本地环境”，是表达程序用户地区方面的软件设定。通常一个区域设置标识符至少包括一个语言标识符和一个区域标识符。在`UNIX` 和 `Windows` 中，区域设置的控制是不同的。在 `UNIX` 下，通常通过环境变量来控制区域设置。这些环境变量包括：`LC_ALL`, `LC_CTYPE`, `LC_TIME`, 等等。你可以通过改变这些环境变量来控制你的程序或者命令所表现出来的区域设置，前提是这些程序或者命令必须是已经被国际化的和本地化的。在 `Windows` 下，你可以通过改变控制面板上的“语言/区域”中的区域的值来设定 `Windows` 的当前用户的区域设置。

在 `Mac` 中设置英文 `locale` 的方法如下，在 `.bash_profile` 中加入如下内容

```bash
$ vim ~/.bash_profile
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

$ source ~/.bash_profile
# 再次查看locale
$ locale
LANG="en_US.UTF-8"
LC_COLLATE="en_US.UTF-8"
LC_CTYPE="en_US.UTF-8"
LC_MESSAGES="en_US.UTF-8"
LC_MONETARY="en_US.UTF-8"
LC_NUMERIC="en_US.UTF-8"
LC_TIME="en_US.UTF-8"
LC_ALL="en_US.UTF-8"
```

##### 查看语言代码

想要翻译到对应的非 `locale` 语言，需要加入对应语言的参数，查看参数的方法如下

```bash
$ trans -R
┌───────────────────────┬───────────────────────┬───────────────────────┐
│ Afrikaans      - af │ Hebrew         - he │ Portuguese     - pt │
│ Albanian       - sq │ Hill Mari      - mrj │ Punjabi        - pa │
│ Amharic        - am │ Hindi          - hi │ Querétaro Otomi- otq │
│ Arabic         - ar │ Hmong          - hmn │ Romanian       - ro │
│ Armenian       - hy │ Hmong Daw      - mww │ Russian        - ru │
│ Azerbaijani    - az │ Hungarian      - hu │ Samoan         - sm │
│ Bashkir        - ba │ Icelandic      - is │ Scots Gaelic   - gd │
│ Basque         - eu │ Igbo           - ig │ Serbian (Cyr...-sr-Cyrl
│ Belarusian     - be │ Indonesian     - id │ Serbian (Latin)-sr-Latn
│ Bengali        - bn │ Irish          - ga │ Sesotho        - st │
│ Bosnian        - bs │ Italian        - it │ Shona          - sn │
│ Bulgarian      - bg │ Japanese       - ja │ Sindhi         - sd │
│ Cantonese      - yue │ Javanese       - jv │ Sinhala        - si │
│ Catalan        - ca │ Kannada        - kn │ Slovak         - sk │
│ Cebuano        - ceb │ Kazakh         - kk │ Slovenian      - sl │
│ Chichewa       - ny │ Khmer          - km │ Somali         - so │
│ Chinese Simp...- zh-CN│ Klingon        - tlh │ Spanish        - es │
│ Chinese Trad...- zh-TW│ Klingon (pIqaD)tlh-Qaak Sundanese      - su │
│ Corsican       - co │ Korean         - ko │ Swahili        - sw │
│ Croatian       - hr │ Kurdish        - ku │ Swedish        - sv │
│ Czech          - cs │ Kyrgyz         - ky │ Tahitian       - ty │
│ Danish         - da │ Lao            - lo │ Tajik          - tg │
│ Dutch          - nl │ Latin          - la │ Tamil          - ta │
│ Eastern Mari   - mhr │ Latvian        - lv │ Tatar          - tt │
│ Emoji          - emj │ Lithuanian     - lt │ Telugu         - te │
│ English        - en │ Luxembourgish  - lb │ Thai           - th │
│ Esperanto      - eo │ Macedonian     - mk │ Tongan         - to │
│ Estonian       - et │ Malagasy       - mg │ Turkish        - tr │
│ Fijian         - fj │ Malay          - ms │ Udmurt         - udm │
│ Filipino       - tl │ Malayalam      - ml │ Ukrainian      - uk │
│ Finnish        - fi │ Maltese        - mt │ Urdu           - ur │
│ French         - fr │ Maori          - mi │ Uzbek          - uz │
│ Frisian        - fy │ Marathi        - mr │ Vietnamese     - vi │
│ Galician       - gl │ Mongolian      - mn │ Welsh          - cy │
│ Georgian       - ka │ Myanmar        - my │ Xhosa          - xh │
│ German         - de │ Nepali         - ne │ Yiddish        - yi │
│ Greek          - el │ Norwegian      - no │ Yoruba         - yo │
│ Gujarati       - gu │ Papiamento     - pap │ Yucatec Maya   - yua │
│ Haitian Creole - ht │ Pashto         - ps │ Zulu           - zu │
│ Hausa          - ha │ Persian        - fa │                       │
│ Hawaiian       - haw │ Polish         - pl │                       │
└───────────────────────┴───────────────────────┴───────────────────────┘
```

也可以通过 `trans -T` 来查询，不过语言名称显示的就不是英语了，而是对应的文字，比如 `Japanese` 显示的就是 `日本語`。

##### 基础用法

```bash
# 翻译到locale语言
$ trans [Words]

# 翻译到指定语言
$ trans :zh [word]

# 翻译到多种目标语言
$ trans :zh+ja word

# :可用=代替，但是在zsh中=是有特殊含义的，需要用引号或{}转义。:也可以用参数-t代替
$ trans {=zh+ja} word
$ trans '=zh+ja' word
$ trans -t zh+ja word
$ trans -t japanese word
$ trans -t 日本語 word

# Google Translate 可能无法准确分辨你的待翻译文本的语言，最好用后置冒号指定，也可以使用参数-s。
$ trans ja: 手紙
$ trans zh: 手紙
$ trans -s ja 手紙

# 翻译句子和短语
$ trans en:zh "word processor"
$ trans :zh "To-morrow, and to-morrow, and to-morrow,"

# 简洁模式：默认情况下，Translate Shell 尽可能多的显示翻译信息。如果你希望只显示简要信息，只需要加上 -b选项。
$ trans -b :fr "Saluton, Mondo"
$ trans -b :@ja "Saluton, Mondo" #显示发音符号，如果有的话，如日语罗马音，汉语拼音

# 字典模式：当待翻译文本和目标语言一致的时候进入字典模式，或者使用-d参数，不是每种语言都支持
$ trans :en word
$ trans -d fr: mot

# 识别源文本的语言，用-id参数
$ trans -id 言葉

# 听取翻译结果或源文本的发音
$ trans -b -p :ja "Saluton, Mondo"
$ trans -sp "你好，世界"

# 翻译文件或网页
$ trans :fr file://input.txt
$ trans :fr http://www.w3.org/

# 查看语言的详情
$ trans -L fr
$ trans -L de+en

# 进入交互模式
$ trans -shell
$ trans -shell en:fr
```

## 总结

跟 `fanyi` 比起来，`Translate Shell` 功能更强大，不过美中不足的是，它的英语翻译没有音标，`fanyi` 有英音和美音的音标，具体的使用可以根据自己的需求来调整。

## 参考文章

1. [Translate Shell](https://github.com/soimort/translate-shell 'Translate Shell')
2. [Translate Shell ：一款在 Linux 命令行中使用谷歌翻译的工具](https://linux.cn/article-9107-1.html 'Translate Shell ：一款在 Linux 命令行中使用谷歌翻译的工具')
