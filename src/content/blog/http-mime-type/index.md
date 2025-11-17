---
title: 'HTTP MIME 类型'
publishDate: '2020-08-25 12:00:00'
description: ''
tags:
  - network
  - 实用技巧
  - 计算机网络
language: '中文'
heroImage: { 'src': './network.jpg', 'color': '#B4C6DA' }
---

## 前言

我们经常听到 `MIME type`，但是可能并不了解它是什么。我们如今的 `web` 内容非常丰富，有各种媒体资源在 `web` 上传播共享。那么浏览器如何分辨资源的类型而进行处理呢？就是通过 `HTTP` 响应报文实体首部中的 `Content-Type` 字段中的 `MIME type` 来确定的，比如常见的的 `Content-Type: text/html`，也就是描述报文实体主体内容的一些标准化名称。本文就来介绍以下 `MIME type` 相关的内容。

## MIME type 简介

因特网上有数千种不同的数据类型，`HTTP` 仔细地给每种要通过 `Web` 传输的对象都打上了名为 `MIME` 类型(`MIME type`)的数据格式标签。最初设计 `MIME`(`Multipurpose Internet Mail Extension`，多用途因特网邮件扩展)是为了解决在不同的电子邮件系统之间搬移报文时存在的问题。`MIME` 在电子邮件系统中工作得非常好，因此 `HTTP` 也采纳了它，用它来描述并标记多媒体内容。

`Web` 服务器会为所有 `HTTP` 对象数据附加一个 `MIME` 类型(见下图，`Content-Type` 字段在 `HTTP` 报文的实体首部中)。当 `Web` 浏览器从服务器中取回一个对象时，会去查看相关的 `MIME` 类型，看看它是否知道应该如何处理这个对象。大多数浏览器都可以处理数百种常见的对象类型:显示图片文件、解析并格式化 `HTML` 文件、通过计算机声卡播放音频文件，或者运行外部插件软件来处理特殊格式的数据。

![mime1](./images/mime1.png 'mime1')

`MIME` 类型是一种文本标记，表示一种主要的对象类型和一个特定的子类型，中间由一条斜杠来分隔。常见的 MIME 类型有数百个，实验性或用途有限的 MIME 类型则更多。

- `HTML` 格式的文本文档由 `text/html` 类型来标记。
- 普通的 `ASCII` 文本文档由 `text/plain` 类型来标记。
- `JPEG` 格式的图片为 `image/jpeg` 类型。
- `GIF` 格式的图片为 `image/gif` 类型。
- `Apple` 的 `QuickTime` 电影为 `video/quicktime` 类型。
- 微软的 `PowerPoint` 演示文件为 `application/vnd.ms-powerpoint` 类型。

## web 服务器如何确定 MIME 类型

当浏览器想服务器请求某个资源的时候，服务器要确定相应主体的 `MIME` 类型，并在响应报文首部的实体首部中。有很多配置服务器的方法可以将 `MIME` 类型与资源关联起来。

`MIME` 类型(`mime.types`) `Web` 服务器可以用文件的扩展名来说明 `MIME` 类型。`Web` 服务器会为每个资源 扫描一个包含了所有扩展名的 `MIME` 类型的文件，以确定其 `MIME` 类型。这种基于扩展名的类型相关是最常见的，见下图。

![mime2](./images/mime2.png 'mime2')

魔法分类(`Magic typing`) `Apache Web` 服务器可以扫描每个资源的内容，并将其与一个已知模式表(被称为魔法文件)进行匹配，以决定每个文件的 `MIME` 类型。这样做可能比较慢， 但很方便，尤其是文件没有标准扩展名的时候。

显式分类(`Explicit typing`) 可以对 `Web` 服务器进行配置，使其不考虑文件的扩展名或内容，强制特定文件 或目录内容拥有某个 `MIME` 类型。

类型协商 有些 `Web` 服务器经过配置，可以以多种文档格式来存储资源。在这种情况下， 可以配置 `Web` 服务器，使其可以通过与用户的协商来决定使用哪种格式(及相 关的 `MIME` 类型)“最好”。还可以通过配置 `Web` 服务器，将特定的文件与 `MIME` 类型相关联。

---

`Apache Web` 服务器 `httpd` 的配置文件 `/etc/httpd/conf/httpd.conf` 中就有两个配置是跟 `MIME type` 相关的：

- [AddType](https://httpd.apache.org/docs/2.2/mod/mod_mime.html#addtype 'AddType')：用于返回 `HTTP` 响应给浏览器，将给定的文件扩展名映射到指定的内容类型（设置 `Content-Type`）。`AddType image/gif .gif`
- [AddHandler](https://httpd.apache.org/docs/2.2/mod/mod_mime.html#addhandler 'AddHandler'): 用于处理接收到的浏览器请求，将文件扩展名映射到指定的处理程序（用指定的程序处理某种类型的文件）。`AddHandler cgi-script .cgi`

> 浏览器通常使用 `MIME` 类型（而不是文件扩展名）来确定如何处理 `URL`，因此 `Web` 服务器在响应头中添加正确的 `MIME` 类型非常重要。如果配置不正确，浏览器可能会曲解文件内容，网站将无法正常工作，并且下载的文件也会被错误处理。

## MIME type 语法

MIME 主要由下列 5 份文档定义。

- `RFC 2045`，`MIME: Format of Internet Message Bodies` (`MIME`: 因特网报文主体的格式)：描述了 `MIME` 报文结构的概况，并介绍了 `HTTP` 借用的 `Content-Type` 首部。
- `RFC 2046`，`MIME: Media Types` (`MIME`:媒体类型)：介绍了 `MIME` 类型及其结构。
- `RFC 2047`，`MIME: Message Header Extensions for Non-ASCII Text` (`MIME`: 非 `ASCII` 文本的报文首部扩展)：定义了一些在首部包含非 `ASCII` 字符的方式。
- `RFC 2048`，`MIME: Registration Procedures` (`MIME`:注册过程)：定义了如何向因特网号码分配机构(`Internet Assigned Numbers Authority`，`IA- NA`)注册 `MIME` 值。
- `RFC 2049`，`MIME: Conformance Criteria and Examples`(`MIME`:一致性标准及实例)：详细介绍了一致性规则，并提供了一些实例。

> `IANA` 是 `MIME` 媒体类型的官方注册机构，并维护了 [list of all the official MIME types](https://www.iana.org/assignments/media-types/media-types.xhtml 'list of all the official MIME types')。

## MIME 类型结构

每种 `MIME` 媒体类型都包含主类型、子类型和可选参数的列表。类型和子类型由一个 斜杠分隔，如果有可选参数的话，则以分号开始，`MIME` 类型对大小写不敏感，但是传统写法都是小写。在 `HTTP` 中，`MIME` 媒体类型被 广泛用于 `Content-Type` 和 `Accept` 首部。下面是几个例子:

```bash
Content-Type: video/quicktime
Content-Type: text/html; charset="iso-8859-6"
Content-Type: multipart/mixed; boundary=gc0p4Jq0M2Yt08j34c0p
Accept: image/gif
```

`MIME type` 可以分为离散类型、复合类型和多部分类型：

- 离散类型：`MIME` 类型可以直接用于描述对象类型，也可以用于描述其他对象类型的集合或类 型包。如果直接用 `MIME` 类型来描述某个对象类型，它就是一种离散类型(`discrete type`)。其中包括文本文件、视频和应用程序特有的文件格式。
- 复合类型：如果 `MIME` 类型描述的是其他内容的集合或封装包，这种 `MIME` 类型就被称为复合 类型(`composite type`)。复合类型描述的是封装包的格式。将封装包打开时，其中包含的每个对象都会有其各自的类型。
- 多部分类型：多部分媒体类型是复合类型。多部分对象包含多个组件类型。

---

`MIME` 类型由主类型、子类型和可选参数的列表组成。 主类型可以是预定义类型、[IETF](https://www.ietf.org/ 'IETF ')（互联网工程任务组 `Internet Engineering Task Forc`）定义的扩展标记，或者(以`x-`开头的)实验性标记。常见的主类型见下表：

| 类型          | 描述                               | 典型示例                                                                                                                              |
| ------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `application` | 应用程序特有的内容格式(离散类型)   | `application/octet-stream, application/pkcs12, application/vnd.mspowerpoint, application/xhtml+xml, application/xml, application/pdf` |
| `audio`       | 音频格式(离散类型)                 | `audio/midi, audio/mpeg, audio/webm, audio/ogg, audio/wav`                                                                            |
| `chemical`    | 化学数据集(离散 `IETF` 扩展类型)   |                                                                                                                                       |
| `image`       | 图片格式(离散类型)                 | `image/gif, image/png, image/jpeg, image/bmp, image/webp, image/x-icon, image/vnd.microsoft.icon`                                     |
| `message`     | 报文格式(复合类型)                 |                                                                                                                                       |
| `model`       | 三维模型格式(离散 `IETF` 扩展类型) |                                                                                                                                       |
| `multipart`   | 多部分对象集合(复合类型)           | `multipart/form-data,multipart/byteranges`                                                                                            |
| `text`        | 文本格式(离散类型)                 | `text/plain, text/html, text/css, text/javascript`                                                                                    |
| `video`       | 视频电影格式(离散类型)             | `video/webm, video/ogg`                                                                                                               |

子类型可以是主类型(比如，`text/text`)、`IANA` 注册的子类型，或者是(以 `x-` 开头的)实验性扩展标记。类型和子类型都是由 `US-ASCII` 字符的一个子集构成的。空格和某些保留分组以及标点符号称为 `tspecials`，它们是控制字符，不能用于类型和子类型名。

## 重要的 MIME type

常用 `MIME type` 可以查看`MDN`：[常用MIME类型列表](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types '常用MIME类型列表')，完整的 `MIME type` 列表查看 `IANA` 的[list of all the official MIME types](https://www.iana.org/assignments/media-types/media-types.xhtml 'list of all the official MIME types')。

## application/octet-stream

这是应用程序文件的默认值。意思是未知的应用程序文件 ，浏览器一般不会自动执行或询问执行。`浏览器会像对待设置了HTTP` 头 `Content-Disposition` 值为 `attachment` 的文件一样来对待这类文件。

## text/plain

文本文件默认值。即使它意味着未知的文本文件，但浏览器认为是可以直接展示的。

`text/plain` 并不是意味着某种文本数据。如果浏览器想要一个文本文件的明确类型，浏览器并不会考虑他们是否匹配。比如说，如果通过一个表明是下载 `CSS` 文件的 `<link>` 链接下载了一个 `text/plain` 文件。如果提供的信息是 `text/plain`，浏览器并不会认出这是有效的 `CSS` 文件。`CSS` 类型需要使用 `text/css`。

## text/css

在网页中要被解析为 `CSS` 的任何 `CSS` 文件必须指定 `MIME` 为 `text/css`。通常，服务器不识别以 `.css` 为后缀的文件的 `MIME` 类型，而是将其以 `MIME` 为 `text/plain` 或 `application/octet-stream` 来发送给浏览器：在这种情况下，大多数浏览器不识别其为 `CSS` 文件，直接忽略掉。特别要注意为 `CSS` 文件提供正确的 `MIME` 类型。我们在使用 `<link>` 标签的时候也会设置 `type` 属性为 `text/css`。

## text/html

所有的 `HTML` 内容都应该使用这种类型。`XHTML` 的其他 `MIME` 类型（如 `application/xml+html`）现在基本不再使用（`HTML5` 统一了这些格式）。如果你要使用严格的 `XML` 解析规则，你仍然要使用 `application/xml` 或者 `application/xhtml+xml`。

## JavaScript types

据 `MIME` 嗅探标准，`application/javascript`，`application/ecmascript`是有效的 `JavaScript MIME` 类型。所有的 `text JavaScript` 类型已经被 `RFC 4329` 废弃。

## 图片类型

只有一小部分图片类型是被广泛支持的，`Web` 安全的，可随时在 `Web` 页面中使用的：

| `MIME` 类型       | 图片类型                                   |
| ----------------- | ------------------------------------------ |
| `image/gif`       | `GIF` 图片 (无损耗压缩方面被 `PNG` 所替代) |
| `image/jpeg`      | `JPEG` 图片                                |
| `image/png`       | `PNG` 图片                                 |
| `image`/`svg+xml` | `SVG` 图片 (矢量图)                        |

另外的一些图片种类可以在 `Web` 文档中找到。比如很多浏览器支持 `icon` 类型的图标作为 `favicons` 或者类似的图标，并且浏览器在 `MIME` 类型中的 `image/x-icon` 支持 `ICO` 图像。尽管 i`mage/vnd.microsoft.icon` 在 `IANA` 注册, 它仍然不被广泛支持，`image/x-icon` 被作为替代品使用。

## 音频与视频

`HTML` 并没有明确定义被用于 `<audio>` 和 `<video>` 元素所支持的文件类型，所以在 `web` 上使用的只有相对较小的一组类型。`Web` 中最常见的音频视频格式见下表。

| MIME 类型                                         | 音频或视频类型                                                                                                           |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `audio/wave,audio/wav,audio/x-wav,audio/x-pn-wav` | 音频流媒体文件。一般支持 `PCM` 音频编码 (`WAVE codec 1`) ，其他解码器有限支持（如果有的话）。                            |
| `audio/webm`                                      | `WebM` 音频文件格式。`Vorbis` 和 `Opus` 是其最常用的解码器。                                                             |
| `video/webm`                                      | 采用 `WebM` 视频文件格式的音视频文件。`VP8` 和 `VP9` 是其最常用的视频解码器。`Vorbis` 和 `Opus` 是其最常用的音频解码器。 |
| `audio/ogg`                                       | 采用 `OGG` 多媒体文件格式的音频文件。 `Vorbis` 是这个多媒体文件格式最常用的音频解码器。                                  |
| `video/ogg`                                       | 采用 `OGG` 多媒体文件格式的音视频文件。常用的视频解码器是 `Theora`；音频解码器为 `Vorbis` 。                             |
| `application/ogg`                                 | 采用 `OGG` 多媒体文件格式的音视频文件。常用的视频解码器是 `Theora`；音频解码器为 `Vorbis` 。                             |

## multipart/form-data

`multipart/form-data` 可用于 `HTML` 表单从浏览器发送信息给服务器。作为多部分文档格式，它由边界线（一个由 `--` 开始的字符串）划分出的不同部分组成。每一部分有自己的实体，以及自己的 `HTTP` 请求头，`Content-Disposition`和 `Content-Type` 用于文件上传领域，最常用的 (`Content-Length` 因为边界线作为分隔符而被忽略）。

```html
<form action="http://localhost:8000/" method="post" enctype="multipart/form-data">
  <input type="text" name="myTextField">
  <input type="checkbox" name="myCheckBox">Check</input>
  <input type="file" name="myFile">
  <button>Send the file</button>
</form>
```

上面的表单会发送如下请求：

```bash
POST / HTTP/1.1
Host: localhost:8000
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
Upgrade-Insecure-Requests: 1
Content-Type: multipart/form-data; boundary=---------------------------8721656041911415653955004498
Content-Length: 465

-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myTextField"

Test
-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myCheckBox"

on
-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myFile"; filename="test.txt"
Content-Type: text/plain

Simple file.
-----------------------------8721656041911415653955004498--

```

## multipart/byteranges

`multipart/byteranges` 用于把部分的响应报文发送回浏览器。当发送状态码 `206 Partial Content` 时，这个 `MIME` 类型用于指出这个文件由若干部分组成，每一个都有其请求范围。就像其他很多类型 `Content-Type` 使用分隔符来制定分界线。每一个不同的部分都有 `Content-Type` 这样的HTTP头来说明文件的实际类型，以及 `Content-Range` 来说明其范围。

```bash
HTTP/1.1 206 Partial Content
Accept-Ranges: bytes
Content-Type: multipart/byteranges; boundary=3d6b6a416f9b5
Content-Length: 385

--3d6b6a416f9b5
Content-Type: text/html
Content-Range: bytes 100-200/1270

eta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="vieport" content
--3d6b6a416f9b5
Content-Type: text/html
Content-Range: bytes 300-400/1270

-color: #f0f0f2;
        margin: 0;
        padding: 0;
        font-family: "Open Sans", "Helvetica
--3d6b6a416f9b5--
```

## 浏览器和 MIME type

很多 `web` 服务器使用默认的 `application/octet-stream` 来发送未知类型。出于一些安全原因，对于这些资源浏览器不允许设置一些自定义默认操作，导致用户必须存储到本地以使用。常见的导致服务器配置错误的文件类型如下所示：

- `RAR` 编码文件。在这种情况，理想状态是，设置真实的编码文件类型；但这通常不可能（可能是服务器所未知的类型或者这个文件包含许多其他的不同的文件类型）。这这种情况服务器将发送 `application/x-rar-compressed` 作为 `MIME` 类型，用户不会将其定义为有用的默认操作。
- 音频或视频文件。只有正确设置了MIME类型的文件才能被 `<video>` 或 `<audio>` 识别和播放。
- 专有文件类型。是专有文件时需要特别注意。使用 `application/octet-stream` 作为特殊处理是不被允许的：对于一般的 `MIME` 类型浏览器不允许定义默认行为（比如 `在Word中打开` ）

在缺失 `MIME` 类型或客户端认为文件设置了错误的 `MIME` 类型时，浏览器可能会通过查看资源来进行 `MIME` 嗅探。每一个浏览器在不同的情况下会执行不同的操作。因为这个操作会有一些安全问题，有的 `MIME` 类型表示可执行内容而有些是不可执行内容。浏览器可以通过请求头`Content-Type` 来设置 `X-Content-Type-Options` 以阻止 `MIME` 嗅探。

## 参考文档

1. `HTTP` 权威指南
2. [MIME类型 -MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types 'MIME类型 -MDN')
