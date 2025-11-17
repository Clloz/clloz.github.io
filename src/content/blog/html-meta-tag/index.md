---
title: 'HTML meta 标签'
publishDate: '2020-08-25 12:00:00'
description: ''
tags:
  - html
  - 学习笔记
  - 实用技巧
language: '中文'
heroImage: { 'src': './html-logo.png', 'color': '#B4C6DA' }
---

## 前言

本文讲一讲 `HTML` 的 `<meta>` 标签。

## 元数据

所谓元数据就是用来描述其他数据的数据 `data that provides information about other data` 或者说 `data about data`。

`<meta>` 元素表示那些不能由其它HTML元相关元素 (`<base>, <link>, <script>, <style>, <title>`) 之一表示的任何元数据信息。

`meta` 元素定义的元数据的类型包括以下几种：

- 如果设置了 `name` 属性，`meta` 元素提供的是文档级别（`document-level`）的元数据，应用于整个页面。
- 如果设置了 `http-equiv` 属性，`meta` 元素则是编译指令，提供的信息与类似命名的 `HTTP` 头部相同。
- 如果设置了 `charset` 属性，`meta` 元素是一个字符集声明，告诉文档使用哪种字符编码。
- 如果设置了 `itemprop` 属性，`meta` 元素提供用户定义的元数据。

## Referer 首部字段和 Referrer-policy 首部字段

关于 `HTTP` 请求头中的 `Referer` 字段，是可选的，客户端在发送请求的时候可以选择是否加上这个字段。这个字段的正确拼写是 `Referrer`，也就是推荐人的意思，但是在写入标准的时候少了一个 `r`，后来就将错就错沿用到现在。

浏览器向服务器请求资源的时候，如果用户在地址栏输入网址，或者选中浏览器书签，就不发送 `Referer` 字段。发送 `Referer` 字段的情况主要有三种：

- 用户点击网页上的链接。
- 用户发送表单。
- 网页加载静态资源，比如加载图片、脚本、样式。

浏览器都会将当前网址作为 `Referer` 字段，放在 `HTTP` 请求的头信息发送。浏览器的 `JavaScript` 引擎提供 `document.referrer` 属性，可以查看当前页面的引荐来源。

`Referer` 字段实际上告诉了服务器，用户在访问当前资源之前的位置。这往往可以用来用户跟踪。

比如你在阿里云服务器的 `OSS` 里面存着一些自己服务器上要用的图片之类的静态资源，你不希望别人随意访问这些资源（`cdn` 流量要花你的钱），那么你就可以在后台设置允许访问的 `referrer`。你甚至可以禁止空 `referrer` 的访问，也就是直接在浏览器输入地址访问也不行。

而且 `referrer` 有可能暴露隐私，因此有些情况不能使用。比如功能 `URL`，即有的 `URL` 不要登录，可以访问，就能直接完成密码重置、邮件退订等功能。或者是内网 `URL`，不希望外部用户知道内网有这样的地址。`Referer` 字段很可能把这些 `URL` 暴露出去。

`W3C` 制定了一个[referrer-policy](https://w3c.github.io/webappsec-referrer-policy/ 'referrer-policy')标准来控制文档的 `Referer` 策略。`referrer-policy` 一共有 `8` 个值，和 `name` 为 `referrer` 的 `<meta>` 的 `content` 取值是相同的（各个取值和含义参考下面的属性章节的 `name` 部分）。改变浏览器默认 `referrer-policy` 的方法大概有三种`referrer-policy` 集成到 `HTML` 的方法有三种：

1. 用一个 `name` 为 `referrer` 的 `<meta>` 元素为整个文档设置 `referrer` 策略。

   ````html
   <meta name="referrer" content="origin" />
   ```html
   ````

2. 用 `<a>`、`<area>`、`<img>`、`<iframe>`、`<script>` 或者 `<link>` 元素上的 `referrerpolicy` 属性为其设置独立的请求策略。

   ````html
   <a href="http://example.com" referrerpolicy="origin"> ```html </a>
   ````

3. 在 `<a>`、`<area>` 或者 `<link>` 元素上将 `rel` 属性设置为 `noreferrer`。

   ```html
   <a href="http://example.com" rel="noreferrer"></a>
   ```

`CSS` 可以从样式表获取引用的资源，这些资源也可以遵从 `referrer` 策略：外部 `CSS` 样式表使用默认策略 (`no-referrer-when-downgrade`)，除非 `CSS` 样式表的响应消息通过 `Referrer-Policy` 首部覆盖该策略。对于 `<style>` 元素或 `style` 属性，则遵从文档的 `referrer` 策略。

| `Policy`                          | `Document`                      | `Navigation to`                      | `Referrer`                      |
| --------------------------------- | ------------------------------- | ------------------------------------ | ------------------------------- |
| `no-referrer`                     | `https://example.com/page.html` | `any domain or path`                 | `no referrer`                   |
| `no-referrer-when-downgrade`      | `https://example.com/page.html` | `https://example.com/otherpage.html` | `https://example.com/page.html` |
| `no-referrer-when-downgrade`      | `https://example.com/page.html` | `https://mozilla.org`                | `https://example.com/page.html` |
| `no-referrer-when-downgrade`      | `https://example.com/page.html` | `http://example.org`                 | `no referrer`                   |
| `origin`                          | `https://example.com/page.html` | `any domain or path`                 | `https://example.com/`          |
| `origin-when-cross-origin`        | `https://example.com/page.html` | `https://example.com/otherpage.html` | `https://example.com/page.html` |
| `origin-when-cross-origin`        | `https://example.com/page.html` | `https://mozilla.org`                | `https://example.com/`          |
| `origin-when-cross-origin`        | `https://example.com/page.html` | `http://example.com/page.html`       | `https://example.com/`          |
| `same-origin`                     | `https://example.com/page.html` | `https://example.com/otherpage.html` | `https://example.com/page.html` |
| `same-origin`                     | `https://example.com/page.html` | `https://mozilla.org`                | `no referrer`                   |
| `strict-origin`                   | `https://example.com/page.html` | `https://mozilla.org`                | `https://example.com/`          |
| `strict-origin`                   | `https://example.com/page.html` | `http://example.org`                 | `no referrer`                   |
| `strict-origin`                   | `http://example.com/page.html`  | `any domain or path`                 | `http://example.com/`           |
| `strict-origin-when-cross-origin` | `https://example.com/page.html` | `https://example.com/otherpage.html` | `https://example.com/page.html` |
| `strict-origin-when-cross-origin` | `https://example.com/page.html` | `https://mozilla.org`                | `https://example.com/`          |
| `strict-origin-when-cross-origin` | `https://example.com/page.html` | `http://example.org`                 | `no referrer`                   |
| `unsafe-url`                      | `https://example.com/page.html` | `any domain or path`                 | `https://example.com/page.html` |

对于 `Referer` 和 `Referrer-Policy` 这里做一下总结。`Referer` 就是我们在向服务器请求的时候，告诉服务器我们是来自哪里，服务器根据我们的这个位置决定是否要返回我们所请求的资源。而 `Referrer-Policy` 则是一个策略，确定我们在当前文档中的发生的请求要如何发送 `Referer` 首部字段。

## 属性

> 全局属性 `name` 在 `<meta>` 元素中具有特殊的语义; 在同一个 `<meta>` 标签中，`name`, `http-equiv` 或者 `charset` 三者中任何一个属性存在时，`itemprop` 属性不能被使用。

## charset

这个属性声明了文档的字符编码。如果使用了这个属性，其值必须是与 `ASCII` 大小写无关（`ASCII case-insensitive`）的 `utf-8`。

## content

此属性包含 `http-equiv` 或 `name` 属性的值，具体取决于所使用的值。

## http-equiv

此属性定义了一个编译指示指令。这个属性叫做 `http-equiv(alent)`是因为所有允许的值都是特定 `HTTP` 头部的名称，如下：

- `content-security-policy`：允许页面作者定义当前页的内容策略。内容策略主要指定允许的服务器源和脚本端点，这有助于防止跨站点脚本攻击。
- `content-type`：如果使用这个属性，其值必须是 `text/html; charset=utf-8`。该属性只能用于 `MIME type` 为 `text/html` 的文档，不能用于 `MIME` 类型为 `XML` 的文档。
- `default-style`：设置默认CSS样式表组的名称。
- `x-ua-compatible`：如果使用了该属性，那么 `content` 属性必须包含 `IE=edge`，用户代理必须忽略此编译指示。
- `refresh`：这个属性指定:
  - 如果 `content` 只包含一个正整数,则是重新载入页面的时间间隔(秒);
  - 如果 `content` 包含一个正整数并且跟着一个字符串 `;url=` 和一个合法的 `URL`，则是重定向到指定链接的时间间隔(秒)

## name

`name` 和 `content` 属性可以一起使用，以`key - value` 对的方式给文档提供元数据，其中 `name` 作为元数据的名称，`content` 作为元数据的值。

`HTML` 标准中定义的 `name` 取值如下：

- `author`：文档作者。
- `description`：一个简短精确的页面内容概要，`firefox` 和 `Opera` 用这个元数据作为书签页面的默认描述。
- `generator`：生成页面的软件的标识符。
- `keyword`：用逗号分隔开的页面相关的关键词。
- `referrer`：控制文档发送的 `HTTP request` 的请求首部字段 `Referer` 的值。首部字段 `Referer` 会告知服务器请求的原始资源的 `URI`，通俗点说就是当前请求页面的来源页面的地址，即表示当前页面是通过此来源页面里的链接进入的。`Referer` 的正确的拼写应该是 `Referrer 推荐人`，但不知为何，大家一 直沿用这个错误的拼写。`referrer` 对应的 `content` 取值有如下这些（即[referrer-policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referrer-Policy 'referrer-policy')）：
  - `no-referrer`：整个 `Referer` 首部会被移除。访问来源信息不随着请求一起发送。
  - `origin`：`Referer` 字段一律只发送源信息（协议+域名+端口），不管是否跨域。`https://example.com/page.html` 会将 `https://example.com/` 作为引用地址。
  - `no-referrer-when-downgrade`(默认值): 如果从 `HTTPS` 网址链接到 `HTTP` 网址，不发送 `Referer` 字段，其他情况发送（包括 `HTTP` 网址链接到 `HTTP` 网址）。这是浏览器的默认行为。
  - `origin-when-cross-origin`：对于同源的请求，会发送完整的 `URL` 作为引用地址，但是对于非同源请求仅发送文件的源。
  - `same-origin`：对于同源（协议+域名+端口 都相同）的请求会发送引用地址，但是对于非同源请求则不发送引用地址信息。
  - `strict-origin`：在同等安全级别的情况下，发送文件的源作为引用地址(`HTTPS->HTTPS`)，但是在降级的情况下不会发送 (`HTTPS->HTTP`)。
  - `strict-origin-when-cross-origin`：对于同源的请求，会发送完整的 `URL` 作为引用地址；在同等安全级别的情况下，发送文件的源作为引用地址(`HTTPS->HTTPS`)；在降级的情况下不发送此首部 (`HTTPS->HTTP`)。
  - `unsafe-url`：无论是同源请求还是非同源请求（包含源信息、路径和查询字符串，不包含锚点、用户名和密码），都发送完整的 URL（移除参数信息之后）作为引用地址。这项设置会将受 `TLS` 安全协议保护的资源的源和路径信息泄露给非安全的源服务器。进行此项设置的时候要慎重考虑。

```html
<!-- 实例 -->
<meta name="keywords" content="HTML, CSS, XML, XHTML, JavaScript" />
<meta name="description" content="Free Web tutorials on HTML and CSS" />
<meta name="author" content="Hege Refsnes" />
<meta http-equiv="refresh" content="30" />
```

---

非标准的 `name` 只要记住一个 `viewport` 即可，该 `name` 提示移动设备如何初始化视口大小，只对移动设备有效。该 `name` 对应多个 `content`，并且 `content` 还有取值，可以在一个 `meta` 标签中同时设置多个 `content`，用逗号隔开。

`<meta name="viewport">` 的 `content` 取值：

| `Value`         | `Description & Subvalue`                                                                                                                                                                                                                                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `width`         | 以 `pixels`（像素）为单位， 定义 `viewport`（视口）的宽度。。值为一个正整数，或字符串 `width-device`                                                                                                                                                                                                                                   |
| `initial-scale` | 设置页面的初始缩放值（`device-width` 和 `viewport size` 的比例）。值为一个正数，取值范围为 `0.0 ~ 10.0`                                                                                                                                                                                                                                |
| `minimum-scale` | 定义最小缩放值，值为一个正数，取值范围为 `0.0 ~ 10.0`。取值必须小于等于 `maximum-scale`，不然会导致不确定的行为发生。浏览器设定可以忽略这条规则，`iOS10+` 默认忽略这条规则                                                                                                                                                             |
| `maximum-scale` | 定义最大缩放值，值为一个正数，取值范围为 `0.0 ~ 10.0`。取值必须大于等于 `minimum-scale`，不然会导致不确定的行为发生。浏览器设定可以忽略这条规则，`iOS10+` 默认忽略这条规则                                                                                                                                                             |
| `height`        | 以 `pixels`（像素）为单位， 定义 `viewport`（视口）的高度，取值为一个正整数或者字符串 `device-height`。很多浏览器不支持，很少使用                                                                                                                                                                                                      |
| `user-scalable` | 是否允许用户进行缩放，值为 `no` 或 `yes`, `no` 代表不允许，`yes` 代表允许，默认值为 `yes`，浏览器设定可以忽略这条规则，`iOS10+` 默认忽略这条规则                                                                                                                                                                                       |
| `viewport-fit`  | 取值为 `auto`、`contain` 或 `cover`。取值为 `auto` 不会影响 `layout viewport`，整个页面都会显示。`contain` 值表示 `viewport` 已缩放以适合显示在显示屏上的最大矩形。 `cover` 表示视口已缩放至填充设备显示。强烈建议用 `CSS` 的[env()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/env 'env()')来确保重要内容没有被截断在屏幕之外。 |

我们经常使用的 `viewport` 取值为 `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">。`

关于 `viewport` 的更多相关内容，请参考这篇文章[移动前端开发之viewport的深入理解](https://www.cnblogs.com/2050/p/3877280.html#!comments '移动前端开发之viewport的深入理解')

## 参考文章

1. [Referrer-Policy - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referrer-Policy 'Referrer-Policy - MDN')
2. [HTTP Referer 教程 - 阮一峰](https://www.ruanyifeng.com/blog/2019/06/http-referer.html 'HTTP Referer 教程 - 阮一峰')
3. [meta标签 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)
