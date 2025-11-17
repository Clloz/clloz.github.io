---
title: '搞懂字符编码'
publishDate: '2019-04-26 12:00:00'
description: ''
tags:
  - assorted
  - 计算机系统
language: '中文'
---

## 前言

我们经常听到 `ASCII`，`UTF-8`，`UTF-16`，这些都是字符的编码格式，它们之间有什么区别，为什么要搞这么多字符的编码格式，在写代码的过程中我们会遇到各种编码格式的字符，所以经常需要 `encode`，`decode`，如果不搞清楚字符编码到底是什么，每次遇到编码问题都会很头疼，搜索引擎都很难帮助你解决问题，久而久之对字符编码产生厌恶。所以还是一次性把这个问题搞清楚最好，免除后顾之忧。

## 给字符编码

我们的计算机只能处理数字，所有的信息无论是在硬盘还是内存里都是二进制字节流，8个二进制位 `bit` 组成一个字节 `byte`，每一个二进制位可以表示 `0` 和 `1` 两种状态，一个字节就可以表示$2^8$`256`种状态，从 `00000000` 到 `11111111`。但是我们生活中使用的不只有数字，还有各种各样的字符，我们怎么才能在计算机中使用和操作字符呢？所以我们就需要制定一种规则，把我们要使用的字符和计算机能识别的二进制数一一对应起来，这样计算机在解析到字符对应的二进制数就知道要显示哪个字符，再把这个字符渲染到显示器上就可以了。这样我们就把我们使用的字符转化为计算机能识别的数字，最后计算机再把这个数字渲染成我们认识的字符，就实现了我们在计算机中操作字符的需求。

现在还有一个问题是，我们要显示多少种字符，每一个字符对应一个状态，有多少字符我们就有多少种状态，从而知道我们要用多少位二进制数来显示全部字符。由于计算机最早是在美国发明的，上世纪60年代的时候，计算机科学家就根据当时的需求制定了一套字符编码，就是我们现在说的 `ASCII` 码，这套编码一直到今天还在使用。`ASCII` 码一共规定了 `128` 个字符的编码，包含常见的英语字符和一些控制符号，比如空格 `SPACE` 是 `32`（二进制 `00100000` ），大写的字母 `A` 是 `65`（二进制 `01000001` ）。这 `128` 个符号（包括 `32` 个不能打印出来的控制符号），只占用了一个字节的后面 `7` 位，最前面的一位统一规定为 `0` 。

![ascii](./images/ascii.png 'ascii')

## 编码扩展

由于当时计算机刚刚开始发展，使用的人还很少，在英语环境中，`ASCII` 码基本上也够用了。可是这个世界上语言众多，不是所有国家都是用英文的，当欧洲人开始使用计算机发现，我们的字母也需要编码使用呀，比如，在法语中，字母上方有注音符号，它就无法用 `ASCII` 码表示。不过一个字节表示 `ASCII` 码不是还空余一位嘛，用上这一位又可以表示 `128` 个字符了，于是欧洲国家纷纷用这一位闲置的位来表示新的符号，比如，法语中的 `é` 的编码为 `10000010`。这样一来，这些欧洲国家使用的编码体系，可以表示最多 `256` 个符号。

但是世界上的语言实在是太多了，就 `128`个编码空间实在是不够，于是各个国家用后 `128` 个二进制数表示自己的语言，比如，`10000010` 在法语编码中代表了 `é`，在希伯来语编码中却代表了字母 `Gimel (ג)`，在俄语编码中又会代表另一个符号。每个国家的字符编码都兼容 `ASCII` 码，也就是前 `128` 个编码都是 `ASCII`，后面的 `128` 个就根据自己国家的语言来。

而到了东亚这边，情况就更严重了，中文，日文，韩文等等东亚国家的文字都非常多，远不是一个字节能表示的。光是中文就好几千常用字，而且很多人的姓名里面有一些生僻字，总不能连自己的名字也打不出来把。一个字符明显不够，于是我们就加一个字节，设计出了 `GB2312` 字符集。一个字节功能表示`256`种状态，两个字节一共是 `16` 位二进制数，可以表示$2^{16}$共 `65546` 种状态。不过 `GB2312` 只收录了一些常用汉字 `7445` 个。由于这些常用字符还是不太够用，后来有扩展成 `21886` 个字符的 `GKB`，也就是现在最常用的中文字符集，windows的中文系统就用的 `GBK` 编码。

> 我们的 `GBK` 和 `GB2312` 同样是兼容 `ASCII` 码的。

## 字符集和字符编码

这两个词容易引起误解，要清楚地解释它们的区别不太容易，特别是因为大家对 `ASCII` 的概念比较深就容易混淆，因为 `ASCII` 因为字符较少可以直接把字符集中的元素按自然数排列拿来做编码。因为 `ASCII` 中每一个字符都在一个字节里面，我们直接就用这种最简单的方式实现就可以了，不会引起计算机的误解。但是中文是两个字节表示，英文是一个字节表示，如果这两种字符混合在一起，计算机该怎么分辨呢？可能你会觉得英文也用两个字节不就可以了，但是这回造成空间的浪费，如果一篇全是英文的文章，用这样的方法大小就会是原来的两倍。那么混合的编码怎么处理呢？在 `GB2312` 里面，当一个字节的第一位是 `0`，那么就代表这是一个 `ASCII` 码，而其他字符都是第一位为 `1` 的两个字节组成。这样计算机在解码的时候就知道，遇到字节是以 `0` 开头的，就知道这一个字节就表示了一个字符；遇到字节是以1开头的，就知道要加上下一个字节合起来表示一个字符。这样就在 `GB2312` 中既把 `ASCII` 的字符包含了进来，又能将它们区分出来，能达到兼容的效果了。

比如用 `GB2312` 来写 `我叫ABC` ，那么二进制编码是 `11001110 11010010 10111101 11010000 01000001 01000002 01000003`，解码的时候，当遇到 `1` 开头的字节，就把两个字节合起来解释为一个字符，于是 `11001110 11010010` 会被解释为我；遇到 `0` 开头的字节，就只把这个字节解释为一个字符，于是 `01000001` 就会被解释为 `A` 了。

我认为可以这么理解， 字符集就是我们所有要用的字符的集合，集合的三大特性相信大家都学过 `确定性，无序性，互异性` （实际操作不会是无序的，会有一个最简单的映射，比如自然数排列），而字符编码用二进制数对集合中的字符进行一一映射，这种一一映射可以有无数种，比如我有 `100` 个字符，我可以是从 `0～99` 的自然数，我也可以是从 `0～198` 的偶数，甚至如果我高兴，我可以是从 `1000～901` 的倒序数，对于集合中的元素也是，比如 `啊` 这个字，我可以把它放在映射的第一个，也可以把它放在最后一个，最重要的是，我们选择的这种映射能够最有效率地利用字节空间同时让计算机能够轻松地识别每一组映射，这因为这个需求我们的 `GB2312` 字符编码才选择了上述的映射方式，因为这是比较有效率，计算机也能轻松识别的。而 `ASCII` 选择的映射就是最简单的从 `0` 开始按自然数排列，因为它的字符少也不需要考虑兼容，这中方式就是最有效率最合适的，但是对于一些字符数量非常多还要考虑兼容其他字符的字符集来说，就需要考虑更好的实现方案。理解这两者的却别对于后面的 `Unicode` 字符集和它的多种编码方式有帮助。

> 维基百科上有[现代编码模型](https://zh.wikipedia.org/wiki/%E5%AD%97%E7%AC%A6%E7%BC%96%E7%A0%81#%E7%8E%B0%E4%BB%A3%E7%BC%96%E7%A0%81%E6%A8%A1%E5%9E%8B '现代编码模型')，整体我的理解还是没问题的。

## Unicode

在早期，网路还不是那么发达的时候，大家基本都在自己同语言范围内的网络进行活动，大家的系统以及软件的字符编码方式几乎都是差不多的，所以并不会引起什么大问题。但是随着网络越来越发达，各个国家之间的交流越来越频繁，不同字符编码导致的乱码问题让出现一个同一的编码的需求越来越强烈，这也就是现在大家所知的 `Unicode`。

`Unicode` 对世界上大部分的文字系统进行了整理、编码，使得计算机可以用更为简单的方式来呈现和处理文字。`Unicode` 有两种格式：`UCS-2` 和 `UCS-4`。`UCS-2` 就是用两个字节编码，一共 `16` 个比特位，这样理论上最多可以表示 `65536` 个字符，不过要表示全世界所有的字符显示 `65536` 个数字还远远不过，因为光汉字就有近 `10` 万个，因此 `Unicode4.0`规范定义了一组附加的字符编码，`UCS-4` 就是用`4` 个字节（实际上只用了 `31` 位，最高位必须为 `0` ）。理论上完全可以涵盖一切语言所用的符号。世界上任何一个字符都可以用一个 `Unicode` 编码来表示，一旦字符的 `Unicode` 编码确定下来后，就不会再改变了。

这样的大型字符集在实现的时候就需要解决我们上面说的两个问题：

- 对于不需要多个字节表示的字符，怎么避免存储空间的浪费。
- 对于多个字节，比如两个字节，到底是一个两字节字符还是两个单字节字符。

`Unicode` 字符集有一套自己的字符和编码的映射（即下面说的码点），但是具体到计算机上的实现（即编码方式）需要考虑上述两个问题。如 `汉` 字的 `Unicode` 编码是 `6C49`，我们可以直接按这个编码传输，也可以用 `utf-8` 编码的3个连续的字节 `E6 B1 89` 来表示它，`Unicode` 编码有不同的实现方式，比如：`UTF-8`、`UTF-16` 和 `UTF-32`等等，具体使用哪一种要根据我们的需求和使用场景，有时候也有一些历史因素。

几个重要的概念：

- `Character`：字符，这里可以理解成用户实际看到的实体，比如：`A`、`好` 等等；
- `Code Point`：码点/码位，对应 `Unicode` 字符集中每个 `Character` 的数字编号，比如 `好` 的码点是：`U+597D`；
- `Code Unit`：编码方案对码点进行编码后的结果，比如 `好` 的 `UTF-16`编码结果为：`Ox597D`，`UTF-8` 编码结果为：`E5A5BD`；
- `Normalization`：字符标识标准化，有时候，一个字符看起来是多个字符的组成，比如 `ö`，可以看成一个字符，也可以看成由字符 `o` 和 `¨` 组合而成，而在 `Unicode` 通过对每个字符对应一个码点而达到标准化字符标识的目的；
- `BMP`：`Basic Multilingual Plane`，基本平面，也称零号平面，`Unicode Code Point` 处于 `U+0000 - U+FFFF`之间的字符；
- `SMP`：`supplementary planes` 或 `astral planes`，辅助平面，`Unicode Code Point` 处于 `U+10000 - U+10FFFF` 之间的字符；
- `UTF` 即是 `Unicode` 转换格式（`Unicode (or UCS) Transformation Format`）

我们来看看 `Unicode` 的码点范围，现在 `Unicode` 标准的表示范围为 `U+0000~U+10FFFF`，共有 `110000` 个状态，十进制为 `1114112` 个码点。其中我们最常用的字符都集中在 `U+0000 - U+FFFF` 共 $2^{16}$ `65536` 个码点，我们称之为基础平面。基础平面的分布看下图。每一个方块中都是 `256` 个码点，葛优 `FF(256)` 个方格，不同颜色的方格用来表示不同的类型的字符，比如图中间一大块粉色的区域 `CJK characters` 就是我们比较熟悉的 `Chinese, Japanese, and Korean` 中日韩文字的 `Unicode` 码点区。

![零号平面](https://img.clloz.com/blog/writing/Roadmap_to_Unicode_BMP.svg '零号平面')

以`U+0000 - U+FFFF` 为一个平面，`U+0000~U+10FFFF` 的全部码点就可以分为 `17` 个平面，由于基本平面已经能满足我们的使用的，所以后面的平面成为 `辅助平面`。基础平面的码点范围在 `0 ~ 65535`，在计算机中可以用 `16` 个二进制位表示，也就是两个字节，而所有辅助平面都已经不能只用两个字节来表示了。需要注意的是，`Unicode` 目前虽然定义了 `1114112` 个码点，但其实很多是空的，还未填充，目前大概只定义了十多万。这么多的码点只是预先规划的，因为我们生活的世界字符是在不断增加的，目前的看来一百多万是完全够用了。`Unicode` 自版本 `2.0`开始保持了向后兼容，即新的版本仅仅增加字符，原有字符不会被删除或更名。从下面的平面分布图可以看出 `unicode` 还预留了两个私有平面，是用来自定义字符的。

![平面分布图](./images/unicode-supp-chars.png '平面分布图')

`GNU Unifont` 制作了一张基本平面的全部字符的图，全图大小 `4000 x 4000`，点击[基本平面字符图](https://www.clloz.com/study/unifont/unifont.html)查看（由于图片比较大，打开可能有点慢）。

## UTF-8

`UTF-8` （ `Unicode Transformation Format` ）作为 `Unicode` 的一种实现方式，广泛应用于互联网，它是一种变长的字符编码，可以根据具体情况用 `1-4`个字节来表示一个字符。比如英文字符这些原本就可以用 `ASCII` 码表示的字符用`UTF-8`表示时就只需要一个字节的空间，和 `ASCII` 是一样的。对于多字节（ `n` 个字节）的字符，第一个字节的前 `n` 为都设为 `1` ，第 `n+1`位设为 `0`，后面字节的前两位都设为10。剩下的二进制位全部用该字符的 `unicode`码填充。

| Unicode符号范围 (十六进制) | UTF-8编码方式（二进制）             | 十进制表示                 |
| -------------------------- | ----------------------------------- | -------------------------- |
| U+0000 0000 - U+0000 007F  | 0xxxxxxx                            | 0 - 127                    |
| U+0000 0080 - U+0000 07FF  | 110xxxxx 10xxxxxx                   | 128 - 2047                 |
| U+0000 0800 - U+0000 FFFF  | 1110xxxx 10xxxxxx 10xxxxxx          | 2048 - 65535               |
| U+0001 0000 - U+0010 FFFF  | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx | 65536 - 1114111（2097152） |

比如 `严` 的 Unicode 是 `4E25(100111000100101`，根据上表，可以发现 `4E25` 处在第三行的范围内 `(0000 0800 - 0000 FFFF)`，因此严的 `UTF-8` 编码需要三个字节，即格式是 `1110xxxx 10xxxxxx 10xxxxxx`。然后，从严的最后一个二进制位开始，依次从后向前填入格式中的 `x`，多出的位补 `0`。这样就得到了，严的 `UTF-8` 编码是 `11100100 10111000 10100101`，转换成十六进制就是 `E4B8A5`。

## 乱码

由于字符编码多种多样，不同的字符编码之间互相不能兼容就会造成乱码现象。首先要明确的一点是，我们在显示器上看到的字符都是经过计算机用对应的字符编码解码以后渲染给我们的，在计算机存储设备上保存的，以及在网络上传输的，都是字符经过编码后的二进制字节流。打个简单的比方，你在一个网页复制了一段文本到你的 `word` 或者 `txt` 里面去，在计算机内部，你也不过是复制了这个字符对应的编码值过去，比如我在 `vscode` 里面创建了一个 `GBK` 格式的文本，然后在用 `UTF-8` 的格式打开，那么就会出现乱码。但是如果我们直接复制文本到其他 `utf-8` 的文本中去，不会乱码，这应该是软件自动帮你转码过了。

![encode-gkb](./images/encode-gbk.png 'encode-gkb')

![encode-utf-8](./images/encode-utf-8.png 'encode-utf-8')

不同的系统，不同的编辑器，不同的程序编译器解释器，默认支持的编码可能都是不同的，我们复制或者从浏览器获取的字符，都只是一段二进制字符编码，如果我们所在的环境的字符编码中没有我们所要显示的这段字符的映射，自然就会出现乱码。比如 `windows` 的中文系统默认编码是 `GBK`，那么在 `windows` 的命令行运行的程序如果输出的是 `utf-8` 的字符，将会出现乱码。不过现在大部分系统和环境都是支持`Unicode`的，比如windows系统就能够把Unicode映射到 `GBK`，映射表见[Unicode 12.0 Character Code Charts](https://www.unicode.org/charts/ 'Unicode 12.0 Character Code Charts')，那么如果你的环境能够帮你把你的字符编码转换成 `Unicode` 编码，那么大部分的程序和系统都能够识别了。所以在写代码的过程中如果遇到乱码，检查我们的字符的编码格式和环境的编码格式是否一直，如果不一致可以利用语言提供的转码工具转成 `Unicode` 来解决乱码问题。比如 `python` 中的 `encode` 和 `decode`。

> `UTF-8` --> `decode` 解码 --> `Unicode`，`Unicode` --> `encode` 编码 --> `GBK` / `UTF-8`

## 编程语言中的字符编码

我们经常会看到某某语言默认用的什么编码，这种说法让人很疑惑，因为我们把编程语言的默认编码和我们使用的编辑器支持的编码当成了同一个东西，我们的编辑器可以支持各种编码，但当我们写好程序，要用进行程序的编译或者解释运行的时候，编译器或解释器对变量在内存中的处理使用的字符编码就是程序的默认编码。比如 `python2` 默认编码就是 `ascii`，也就是说当我们的程序被 `python` 解释器装载到内存运行的时候，解释器会把编辑器中保存的编码识别成 `ascii`，比如我们在编辑器中用了 `utf-8`，而我们保存了一个字符 `严`，它的 `utf-8` 编码是 `11100100 10111000 10100101` 三个字节，可是 `python2` 的解释器会把它当作三个 `ascii` 来处理，这必然会出错，所以要在程序文件的开头声明文档的编码格式，这样解释器才知道怎么转码。不过 `python3` 已经会自动把我们的编码转成 `unicode`，`Unicode` 是能够被各种环境识别的。如果你还想更多地了解，可以看这篇文章：[Unicode之痛](https://pycoders-weekly-chinese.readthedocs.io/en/latest/issue5/unipain.html 'Unicode之痛')

## UTF-16

`UTF-16`是一种变长的 `2` 或 `4` 字节编码模式。对于BMP内的字符使用 `2` 字节编码，其它的则使用 `4` 字节组成所谓的代理对来编码。对于 `BMP` 内的字符两个字节能够完全表示，很容易理解，关键问题是如何理解 `UTF-16` 是如何用代理吗来表示辅助平面上的码点的。

在上面基础平面表示的那张方格图上，有一块灰色区域，也就是 `D8 - DF`，右边的实例图表给出的说明是 `UTF-16 surrogates`，也就是 `UTF-16代理`。如果你还打开了上面基本平面字符图你就会发现这块区域是空白的。为什么要留这么一块空白呢，不是造成浪费么。这块空白就是 `UTF-16` 表示辅助平面字符的关键。

从 `D8 - DF` 被分成两块，`D8 - DB` 和 `DC - DF`，分别叫做`搞代理区 High Surrogate Area` 和 `低代理区 Low Surrogate Area`。上面我们说过每一个方格里有 `256` 个码点，也就是说搞代理区和低代理区分别有 `1024` 个状态。通过排列组合我们可以知道，两者结合一共可以表示 $2^{10} \* 2 ^{10} = 2^ {20}$个状态。而我们的辅助平面一共有多少个码点呢？`16 * 65536` 也就是$2^4 \* 2^{16}=2^{20}$，两者是相等的。这正是 `UTF-16` 的代理码的原理。

> **_下面这一段落数字全部为十六进制_**

辅助平面的范围是从 `10000 - 10FFFF`，去除掉基础平面的 `10000` 个状态，也就是代理码要表示 `0000 - 9FFFF`。具体的数学计算就很简单了，用辅助平面的码点先减去基础平面的 `10000`，然后用除法计算出高代理区的值，用取余得出低代理区的值。

- 高代理区：`(码点值 - 10000) / 400 + D800`
- 低代理区：`(码点值 - 10000) % 400 + DC00`

以 `Unicode Character “𝌆” (U+1D306)` 来计算，高代理区为 `(1D306 - 10000) / 400 + D800 = D834`，低代理区为 `(1D306 - 10000) % 400 + DC00 = DF06`，关于不同编码模式的值得查询可以参考[Unicode编码查询](https://www.compart.com/en/unicode/ 'Unicode编码查询')

## 前端使用 Unicode

字符 `unicode` 编码查询点击[查询链接](http://www.mytju.com/classcode/tools/encode_utf8.asp '查询链接')

## CSS 中的使用

比如在伪元素的 `content` 中使用 `unicode`，使用方法是 `\` 后加上 `unicode` 编码的 `16` 进制的表示，比如`你` 的 `unicode` 编码的 `16` 进制的表示是 `4F60`，我们可以这样使用：

```css
h4::after {
  content: '\4F60';
  font-size: 20px;
  color: red;
}
```

## HTML 中的使用

`HTML` 中我们经常使用的 `HTML entity` 实体 比如 `&`，`unicode` 的使用方法也与这个相同就是在 `&` 后加上 `#` 和 `unicode` 对应的十进制表示或者是 `&#x`加上十六进制码点值表示，最后要接分号。比如 `𝌆` 就用如下方法表示：

```html
<h4>𝌆 𝌆  </h4>
```

## JavaScript 中的使用

- 只使用到 `Unicode` 基本平面时（`\u<码点>`）
- 有使用到 `Unicode` 辅助平面时（`\u{ <码点> }`）
- 只使用到 `ASCII` 字符时（`\x<码点>`）

```javascript
// 使用 2 位的十六进制
console.log('\u{41}\u{42}\u{43}') // 'ABC'

// 使用 4 位的十六进制
console.log('\u{0041}\u{0042}\u{0043}') // ABC

// 使用超过 4 位以上的十六进制
console.log('\u{1F4A9}') // '💩' U+1F4A9
console.log('\u{1F923}') // '🤣' U+1F923
console.log('\u{1F436}') // '🐶' U+1F436
```

关于 `JavaScript` 中使用哪种编码有几个不同的方面。

### 对 JS 文件解码

这个其实跟 `“JavaScript”` 没什么关系，只是文件传输过来用什么编码来解码文件，类似于上面的乱码章节，编码和解码必须要统一，所以必须要有标记告诉解码方，我是用的哪种模式编码的。大致的优先级规则如下：

1. 如果文件有 `BOM` 标记，则会使用对应的 `Unicode` 编码，比如`FFFE`、`FEFF` 就会使用 `UTF-16`，详见[字节顺序标记](https://zh.wikipedia.org/wiki/%E4%BD%8D%E5%85%83%E7%B5%84%E9%A0%86%E5%BA%8F%E8%A8%98%E8%99%9F '字节顺序标记')；
2. 由 `HTTP(S)` 请求的相应头来决定，比如：`Content-Type: application/javascript; charset=utf-8`；
3. 由 `<script>` 标签的 `charset` 属性决定，比如：`<script charset="utf-8" src="./main.js"></script>`；
4. 由 `html` 本身的 `charset` 决定，比如：；

### 引擎解析执行源码时

> ECMAScript source text is represented as a sequence of characters in the Unicode character encoding, version 3.0 or later. ……ECMAScript source text is assumed to be a sequence of 16-bit code units for the purposes of this specification. Such a source text may include sequences of 16-bit code units that are not valid UTF-16 character encodings. If an actual source text is encoded in a form other than 16-bit code units it must be processed as if it was first converted to UTF-16. 上面是 `ECMAScript` 标准对编码的一些说明，可以看到 `Javascipt` 源码支持 `UTF-16` 编码。更实用点的理解是：`Javascript` 引擎总会尝试把源码转成 `UTF-16` 编码的文本。

对于标识符，正则表达式，字符串字面量有如下一些规则：

- 字符串字面量、正则表达式对象字面量、变量名支持使用\\u加四位十六进制数值来表示 `UTF-16` 编码的字符，比如：`\u0061`表示英文字母小写 `a`；
- 在注释中会忽略转义序列；
- 字符串字面量、正则表达式对象字面量中一个转义序列对应一个字符；
- 变量名中一个转义序列对应一个字符；

由于 `JavaScript` 的设计完成是在 `1995` 年，当时还没有 `UTF-16` 的标准，也没有辅助平面的概念，所以设计之初就没有考虑到代理码这种模式。这就导致了在 `ES6` 标准之前的 `JS` 在处理辅助平面上的 `UTF-16` 编码会出问题，因为 `UTF-16` 的代理码都是四字节的，`JS` 会当做两个字符来处理。比如上面也有提到的 `𝌆` 字符，他的码点是 `0x1D306`，`UTF-8` 编码是 `0xF0 0x9D 0x8C 0x86`，`UTF-16` 编码是 `0xD834 0xDF06`，用 `JavaScript` 来处理就会出现如下问题。

```javascript
'𝌆'.length
//2
'𝌆' === '\u1D306'
//false
'𝌆'.charCodeAt(0)
//55348 0xD834
'𝌆'.charCodeAt(1)
//57094 0xDF06
'𝌆'.codePointAt(0)
//119558 0x1D306
'𝌆'.codePointAt(1)
//57094
```

可以看出字符的长度被解析为 `2`，因为 `JS` 无法正确识别代理码，这种现象会出现在几乎所有 `JS` 的字符处理函数中。不过 `String.prototype.codePointAt()` 函数还是能正确返回码点值的，当然我们除了用 `/u{码点}` 的方式可以正确解码以外，还可以将 `UTF-16` 代理码写在同一个字符串里也是可以解析的，比如 `\uD834\uDF06` 来表示 `𝌆`，`"𝌆" === "\uD834\uDF06"` 的结果为 `true`。所以即使我们不能使用 `ES6` 的方法也是能解析代理码的 `UTF-16` 字符的，方法就是用 `String.prototype.charCodeAt()` 对字符的编码进行检测，如果发现有编码位于高代理区 `D800 ~ DBFF` 的字符就手动将他和后面一个字符的编码连结起来解析。

这里说一下几个关于编码的 `JS` 函数。

1. `String.prototype.codePointAt()` 返回一个 `Unicode` 编码点值的非负整数。如果在指定的位置没有元素则返回 `undefined` 。如果在索引处开始没有 `UTF-16` 代理对，将直接返回在那个索引处的编码单元。
2. `String.fromCodePoint()` 返回指定码点序列的创建字符串。
3. `String.prototype.charCodeAt()` 方法返回 `0` 到 `65535` 之间的整数，表示给定索引处的 `UTF-16` 代码单元 (在 `Unicode` 编码单元表示一个单一的 `UTF-16` 编码单元的情况下，`UTF-16` 编码单元匹配 `Unicode` 编码单元。但在——例如 `Unicode` 编码单元 > `0x10000` 的这种——不能被一个 `UTF-16` 编码单元单独表示的情况下，只能匹配 `Unicode` 代理对的第一个编码单元)
4. `String.fromCharCode()` 方法返回由指定的UTF-16代码单元序列创建的字符串，参数范围介于 `0` 到 `65535`（`0xFFFF`）之间。 大于 `0xFFFF` 的数字将被截断。 不进行有效性检查。
5. `String.prototype.charAt()` 方法根据索引从一个字符串中返回指定的字符。参数为一个介于 `0` 和字符串长度减 `1`之间的整数。如果没有提供索引，参数默认为 `0`。

### ECMAScript 6

`ES6` 基本解决了代理码无法识别的问题。 `ES6` 可以自动识别4字节的码点。因此，遍历字符串就简单多了。也有方法可以正确返回代理码表示的字符的长度。上面的 `JS` 码点表示法用大括号表示辅助平面也是 `ES6` 的新特性。`String.prototype.codePointAt()` 和 `String.fromCodePoint()` 也都是 `ES6` 中新的方法。也对正则表达式添加了四字节码点的支持。

```javascript
for (let s of string) {
  // ...
}

Array.from('𝌆').length //1
```

```javascript
//String.prototype.codePointAt()
'ABC'.codePointAt(1);          // 66
'\uD800\uDC00'.codePointAt(0); // 65536
'XYZ'.codePointAt(42); // undefined

//String.fromCodePoint()
console.log(String.fromCodePoint(9731, 9733, 9842, 0x2F804));
// expected output: "☃★♲你"

//String.prototype.charCodeAt()
const sentence = 'The quick brown fox jumps over the lazy dog.';
const index = 4;
console.log(`The character code ${sentence.charCodeAt(index)} is equal to ${sentence.charAt(index)}`);
//  "The character code 113 is equal to q"

//String.fromCharCode()
console.log(String.fromCharCode(189, 43, 190, 61));
// expected output: "½+¾="

//String.prototype.charAt()
var anyString = "Brave new world";
console.log("The character at index 0   is '" + anyString.charAt(0)   + "'");
console.log("The character at index 999 is '" + anyString.charAt(999) + "'");
//The character at index 0 is 'B'
//The character at index 999 is ''

/^.$/u.test('𝌆')
//true
/^.$/.test('𝌆')
//false
```

另外一个特别的地方就是有些字符除了字母以外，还有附加符号。比如，汉语拼音的 `Ǒ`，字母上面的声调就是附加符号。对于许多欧洲语言来说，声调符号是非常重要的。`Unicode` 提供了两种表示方法。一种是带附加符号的单个字符，即一个码点表示一个字符，比如 `Ǒ` 的码点是 `U+01D1`；另一种是将附加符号单独作为一个码点，与主体字符复合显示，即两个码点表示一个字符，比如 `Ǒ` 可以写成 `O（U+004F） + ˇ（U+030C）`。这两种表示方法是等价的，但是在 `JS` 中他们严格相等判断返回的是 `false`。在 `ES6` 中提供了一个 `normalize` 方法对那些等价的 `Unicode` 序列进行判断。关于 `Unicode` 的等价性可以参考[Unicode等价性](https://zh.wikipedia.org/wiki/Unicode%E7%AD%89%E5%83%B9%E6%80%A7 'Unicode等价性')

```javascript
// 方法一
'\u01D1'
// 'Ǒ'

// 方法二
'\u004F\u030C'
// 'Ǒ'

'\u01D1' === '\u004F\u030C'
//false

'\u01D1'.normalize() === '\u004F\u030C'.normalize()
// true
```

综合上面的内容，现在的 `ES6` 标准下公有 `6` 种用字符串字面量表示同一个字符的方法：

```javascript
'\z' === 'z' // true //一些特殊意义的字符不能这么表示，见下方正则表达式部分
'\172' === 'z' // true //8进制
'\x7A' === 'z' // true //16进制，代理码需要高低代理码合并解析
'\u007A' === 'z' // true //码点
'\u{7A}' === 'z' // true //码点
```

### 将 String 转换为 UTF-8 编码

这里写了一个小函数，实现将 `String` 转换为其对应的 `UTF-8` 编码，加深自己的理解。

```javascript
function utf8_encoding1(str) {
  const code = encodeURIComponent(str)
  const byte = []
  for (let i = 0; i < code.length; i++) {
    const c = code.charAt(i)
    if (c === '%') {
      const hex = code.charAt(i + 1) + code.charAt(i + 2)
      const hexVal = parseInt(hex, 16)
      byte.push(hexVal)
      i += 2
    } else byte.push(c.charCodeAt(0))
  }
  return '0x' + byte.map((c) => c.toString(16)).join('')
}
console.log(utf8_encoding1('𝌆')) //0xf09d8c86

function utf8_encoding2(str) {
  const length = str.length
  let arr = []
  for (let i = 0; i < length; i++) {
    let cp = str.codePointAt(i)
    let result = '0x'
    if (cp <= 0x7f) {
      result += cp & 0x7f
    } else if (cp >= 0x80 && cp <= 0x7ff) {
      result += (((cp >> 6) & 0x1f) | 0xc0).toString(16)
      result += ((cp & 0x3f) | 0x80).toString(16)
    } else if (cp >= 0x800 && cp <= 0xffff) {
      result += (((cp >> 12) & 0xf) | 0xe0).toString(16)
      result += (((cp >> 6) & 0x3f) | 0x80).toString(16)
      result += ((cp & 0x3f) | 0x80).toString(16)
    } else if (cp >= 0x10000 && cp <= 0x10ffff) {
      result += (((cp >> 18) & 0x7) | 0xf0).toString(16)
      result += (((cp >> 12) & 0x3f) | 0x80).toString(16)
      result += (((cp >> 6) & 0x3f) | 0x80).toString(16)
      result += ((cp & 0x3f) | 0x80).toString(16)
    }
    arr.push(result)
  }
  return arr
}

console.log(utf8_encoding2('𝌆')) //[ '0xf09d8c86', '0xedbc86' ]
```

第一个方法是用 `encodeURIComponent`，最开始我还觉得这个方法行不通，因为 `encodeURIComponent` 有些字符是不转义的，但后来发现不转义的都是 `ASCII` 码范围内的字符，也非常好处理。第二个方法则是比较容易理解的用 `codePointAt()` 方法获取码点然后用位运算转码，需要注意的就是码点超过 `0xFFFF` 的字符可能长度是 `2`， 返回两个码点。

## 字符串的正则表达式

`winter` 给出的 `ES5` 中的字符串的正则表达式。

```javascript
const str_reg_sq =
  /"(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"/

const str_reg_dq =
  /'(?:[^'\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*'/
```

几个特殊的字符都是 `ASCII` 中的早期计算机中就有存在的，正则表达式中也有对应的元字符。

- `\b` 通常是单词分界位置，但如果在字符类里使用代表退格
- `\t` 制表符，Tab
- `\r` 回车
- `\v` 竖向制表符
- `\f` 换页符
- `\n` 换行符
- `\u2028` 行分隔符
- `\u2029` 段落分隔符

## JavaScript字符的转义

除了普通的可打印字符以外，一些有特殊功能的字符可以通过转义字符的形式放入字符串中：

`\0`：空字符 `\'`：单引号 `\"`：双引号 `\\`：反斜杠 `\n`：换行 `\r`：回车 `\v`：垂直制表符 `\t`：水平制表符 `\b`：退格 `\f`：换页 `\uXXXX`：`unicode` 码（基础平面的码点） `\u{X} ... \u{XXXXXX}`：`unicode codepoint`（包括辅助平面的码点） `\xXX`：`Latin-1` 字符(`x`小写) （扩展 `ASCII` 码对应的码点，`2` 个 `16` 进制数，共 `256` 个）

> 和其他语言不同，`javascript` 的字符串不区分单引号和双引号，所以不论是单引号还是双引号的字符串，上面的转义字符都能运行。

## USVString，DOMString，CSSOMString

在看 `MDN` 文档的时候我们经常会看到 `USVString`，`DOMString`，`CSSOMString` 和 `JavaScript Binary String` 等概念。这里补充说明一下这些概念的区别。

## USVString

`USVString` 指的是 [Unicode Scalar Value](https://www.unicode.org/glossary/#unicode_scalar_value 'Unicode Scalar Value')，`Unicode` 标量值序列，即除了 `high-surrogate` 和 `low-surrogate` 的 `code points`。即从 `U+0000 - U+D7FF` 和 `U+E000 - U+10FFFF` 的 `Unicode` 码点。**这里的一个理解关键就是不要理解为 `UTF-16`，这里指的是 `Unicode` 码点。**

所以一个 `USVString` 中全是原始 `Unicode` 码点，不包括给 `UTF-16` 用的代理区。一般 `USVString` 一般用在执行文本处理的 `API` 中。因为 `Unicode` 是统一的，在任何平台都能识别，所以使用文本处理的 `API` 使用 `Unicode` 可以确保兼容性。

在 `JavaScript` 中使用 `USVString` 的时候，它会被映射到用 `UTF-16` 编码的 `JavaScript` 原始 `String` 类型。也就是说 `USVString` 会被编码成 `UTF-16`。

如果我们在接受 `USVString` 作为参数的 `API` 中使用了代理区的编码，这个代理区编码会被替换成 `repalcement character` 也就是 `U+FFFD`，对应的字符是 `�`。

这里有一点容易误解的就是我们不要用 `UTF-16` 的思维来理解 `USVString`，虽然我们前面说过 `JavaScript` 引擎总是尝试把源码转成 `UTF-16` 编码，但是在处理 `USVString` 时则不能这么理解。比如 `WebSocket.prototype.send` 接受的字符串就是 `USVString`，如果我们传入一个代理平面的 `𝌆`，应该处理成 `U+1D306` 的 `Unicode code point` 而不是 `UTF-16` 编码。至于引擎之后如何映射处理我们则不用考虑，在 `WebSocket` 这里应该是先映射到 `UTF-16`，然后在转 `UTF-8` 传递。

如果我们使用单个的代理平面的码点，或者错误顺序的代理平面码点都会被替换成 `�`，比如 `ws.send('\uDC00\uD800')` 我们会在后端接收到 `��`，`ws.send('\uDC00')` 或者 `ws.send('\uD800')` 则都会收到 `�`。

## DOMString

`DOMString` 是 `16` 位无符号整数序列，通常被解释为 `UTF-16` 编码单元。这就是 `JavaScript` 中最常用的 `String` 类型。有些 `API` 会把 `null` 字符串化为空字符串而不是 `'null'`。根据我的测试，当我们在 `DOMString` 中使用单个代理区的码点的时候，就会直接返回，比如 `'\ud800'` 就会直接返回我们输入的这个，也不会报错。

## CSSOMString

`CSSOMString` 就是在 `CSSOM` 规范中出现的字符串类型，根据浏览器不同，代指 `DOMString` 或者 `USVString`。根据 `MDN` 给出的表格，目前所有的浏览器都是 `USVString`。

这里我总结一下，其实我并不清楚目前的浏览器引擎将字符串存储到内存中用的是什么形式，可能是 `Unicode`，也可能是 `UTF-16`。不过我们认为我们可以简单理解 `USVString` 就是 `Unicode`，而 `DOMString` 就是 `UTF-16`。字符串编码本质也就是为了用一套标准解析二进制对应的字符，我们在内存中存的可能是一种形式，引擎处理的时候可能是另一种编码格式，到网络上传播的时候可能又是另一种格式，重要的就是我们知道我们当前处理的是什么编码格式。

## 总结

任何技术的产生都是有历史原因的，也都是为了解决问题的。所以我们学习知识要带着问题去学，知道这个技术是为了解决什么问题而产生的，自然能把知识形成体系，而不容易遗忘，并且运用到合适的地方。如果不知道问题只是背了个答案，那么可能你并没有真的“学会”这个知识。

如果你也和我一样对字符是如何从键盘敲击到渲染到屏幕上的过程很感兴趣，你可以看看知乎答主乌鸦给出的答案：[计算机系统是如何显示一个字符的？](https://www.zhihu.com/question/24340504/answer/28902204 '计算机系统是如何显示一个字符的？')。

## 参考文章

1. [The Unicode Consortium](https://unicode.org/ 'Unicode Consortium')
2. [Unicode in JavaScript](https://flaviocopes.com/javascript-unicode/ 'Unicode in JavaScript')
3. [Python 编码为什么那么蛋疼？](https://www.zhihu.com/question/31833164/answer/381137073 'Python 编码为什么那么蛋疼？')
4. [Javascript 与字符编码](https://github.com/SamHwang1990/blog/issues/2 'Javascript 与字符编码')
5. [Unicode与javascript详解](https://www.ruanyifeng.com/blog/2014/12/unicode.html 'Unicode与javascript详解')
6. [Unicode在javascript中的使用](https://pjchender.blogspot.com/2018/06/guide-unicode-javascript.html 'Unicode在javascript中的使用')
7. [字符集与编码](https://my.oschina.net/goldenshaw/blog/310331 '字符集与编码')
