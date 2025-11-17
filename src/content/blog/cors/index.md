---
title: '浏览器同源策略和跨域方法'
publishDate: '2019-05-08 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
heroImage: { 'src': './browser.jpg', 'color': '#B4C6DA' }
---

## 前言

了解浏览器的同源策略和各种跨域方式是所有前端都必须熟练掌握的知识，因为在开发的过程中遇到跨域请求是常有的事情，包括我们自己 `mock` 数据的时候也可能遇到跨域的问题，如果不能理解同源策略那么每次遇到跨域都可能不能快速解决。

## 同源策略

同源策略是一个重要的安全策略，它用于限制一个 `origin` 的文档或者它加载的脚本如何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介。

**同源策略是浏览器的策略，会在请求从服务返回的时候检查响应头中的 `Access-Control-Allow-Origin` 和请求头中的 `origin` 是否匹配，如果不匹配则报错。**

## 源 origin

我们使用浏览器浏览网页的时候，大多数情况都是通过 `http` 请求去访问对应主机（ `host` ）上的资源（ `resource` ），一般同一个主机同一个端口同一个协议就会被认为是一个源，一般我们会说同协议同域名同端口的请求浏览器会认为是同源的请求。可能很多人刚看到这个策略的时候跟我有一样的想法，为什么是同一个域名而不是同一个 `IP` 呢？在 `MDN` 的[英文文档](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy '英文文档')里面写的是 `host` 也就是主机，要更好的理解什么是源我们要从服务器的角度来理解。我们的服务器上用来处理 `http` 请求的一般是 `web` 服务器，比如 `apapce` 、 `nginx` 等，在 `web` 服务器的配置中我们会配置我们的网站域名和根目录一般默认绑定到 `80` 端口，比如 `/var/www/html` 当 `web` 服务器接收到 `http` 请求对应目录的资源的时候就会去我们绑定的目录搜索对应的资源。但是一个 `web` 服务器下面可以绑定多个主机，我们可以用虚拟主机来做域名和目录的映射，如下

```bash
<VirtualHost 127.0.0.1:80>
    ServerAdmin yourname@domain.com
    DocumentRoot "E:/server110.com/wordpress-latest"
    ServerName server110.com
    ServerAlias www.server110.com
    ErrorLog "logs/wplatest.com-error.log"
    CustomLog "logs/server110.com-access.log" combined
</VirtualHost>
<VirtualHost 127.0.0.2:80>
    ServerAdmin yourname@domain.com
    DocumentRoot "E:/server110.com/wordpress-2.9.2"
    ServerName server110.com
    ServerAlias www.server110.com
    ErrorLog "logs/server110.com-error.log"
    CustomLog "logs/server110.com-access.log" combined
</VirtualHost>
```

当 `web` 服务器接受到请求的时候会看看是请求头中的 `host` 参数，在根据配置文件到对应的目录寻找资源。正因为这个原因，同源的定义就是 `same-host`，同一个主机。而 `web` 配置目录的方法不止虚拟主机一种方式，还可以利用不同的端口进行映射，比如网站 `a` 的目录 `/var/www/a` 映射到 `80` 端口，而另一个网站 `b` 的目录 `/var/www/b` 的目录映射到 `8080` 端口，配置方法就是把上面的配置文件中的端口改成自己需要的。我们在往上购买的虚拟主机，大部分都是通过这种办法来配置多个网站的，也就是说这些网站的 `IP` 地址都是相同的，但是他们的拥有者不同，这也就是浏览器要对源之间的互动进行限制的原因。最后就是 `http` 和 `https`，这两者如果不同，那么通信的过程都是不相同的，浏览器自然是不允许的，而且一般网站配置了 `https` 那么所有的资源请求都会是 `https` ，一般不会出现混用。

根据上面的规则我们举个是否同源的例子，以我的域名 `https://www.clloz.com` 为例，我这个域名解析到了我阿里云主机的 `ip`，`web`服务器根据配置文件可以知道该 `host` 的请求去对应的文件夹取资源，比如有用户请求 `https://www.clloz.com/index.html`, 那么服务器就会返回这个页面。如果这个 `index.html` 中的脚本发送如下请求，我们可以判断是否同源：

| URL                                     | 结果 | 原因         |
| --------------------------------------- | ---- | ------------ |
| `https://www.clloz.com/study/test.html` | 成功 | 只有路径不同 |
| `http://www.clloz.com/test.json`        | 失败 | 协议不同     |
| `https://www.clloz.com:8080`            | 失败 | 端口不同     |
| `https://test.clloz.com/test.json`      | 失败 | 域名不同     |
| `https://clloz.com/test.json`           | 失败 | 域名不同     |

> 主机和域名的区别：一般来说我们申请一个域名是一个二级域名比如 `clloz.com`（也有认为顶级域和二级域之间还有一级域，阿里云就是这样的方式），顶级域名就是就是域名最后的那个部分，比如我们常见的 `.com` `.cn` `.org` `.edu` 等，顶级域名前面一个就是二级域名比如我的域名中的 `clloz`，以此类推。当我们购买了一个域名以后，我们可以为其添加主机记录进行解析，比如我可以添加一个 `www` 的主机记录解析到我的服务器 `ip`，也可以添加一个 `test` 主机记录解析到 `http://www.clloz.com:8080`，这些添加了主机记录的能访问到服务器上具体文件的域名就称为 `host` 主机名，在我们发送请求的时候，二者可以混用。

## 为什么要有同源策略

其实上面解释源的时候就已经能够明白为什么浏览器要使用同源策略了，我们来看看文档和历史。`MDN` 的解释如下 `The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin. It helps isolate potentially malicious documents, reducing possible attack vectors.` 大概意思就是同源策略限制了一个源上的文档或者脚本和另一个源上的资源互动的方式。主要的目的是为用户的安全，隔离潜在恶意文件的重要安全机制。

同源策略最早有网景在1995年引入，现在所有的浏览器都实行这个策略。最早同源是为了针对客户端上保存状态的 `cookie`。为了解决 `http` 协议无状态带来的用户状态无法保存的情况引入了 `cookie`，如果不同源的网站能够共享 `cookie` 会带来非常严重的安全问题，比如我们登录了某个支付网站或者网上银行没有登出，这时候点进了一个危险的网页，这个网页可以利用我们的 `cookie` 去登录，这是非常危险的，所以最早的同源策略就是针对这样的情况，每个源之间的 `cookie` 都是独立的（父域子域可以共享，后面会说）。但是随着 `web` 的发展，网站提供的服务越来越多，越来越复杂，也出现了更多的攻击手段，所以为了安全，浏览器不得不提升同源策略覆盖的范围。

再举个例子比如钓鱼网站，有人给你发邮件引诱你点击支付宝链接 `alipay.com`，但实际你打开的链接是一个 `aliipay.com`，这个页面用 `iframe` 显示支付宝页面。如果没有同源策略，它完全可以获取你输入的用户名和密码。

```javascript
;<iframe name='alipay' src='www.alipay.com'></iframe>
// JS
// 由于没有同源策略的限制，钓鱼网站可以直接拿到别的网站的Dom
const iframe = window.frames['alipay']
const node = iframe.document.getElementById('你输入账号密码的Input')
console.log(`拿到了这个${node}，我还拿不到你刚刚输入的账号密码吗`)
```

## 安全和灵活的矛盾

同源策略确实提高了网站的安全性，让攻击者攻击网站的难度提高，用户也不会因为误点恶意链接而遭受损失，但是对于开发者来说，多个子系统之间的互动是必要的，浏览器一刀切的同源策略有时候会带来很大的麻烦，从这方面看安全性和交互的灵活性是一对矛盾。所以浏览器在同源策略的制定上还是对交互做了一定的妥协，比如我们都知道的直接用链接嵌入其他源中的 `css`，`js` 和 `image`，父域和子域之间可以共享 `cookie`等。

## 跨源交互细节

为了解决跨域导致的跨源交互不便，浏览器制定了跨源交互的规则，通常情况下： 1. 允许跨源写( `cross-origin write` )，例如链接(`links`)，重定向以及表单提交。特定少数的 `HTTP` 请求需要添加 `preflight`。经过测试，用 `XMLHttpRequest` 对象给后台发送文件也不会被同源策略拦截。 2. 允许跨域资源嵌入。 3. 不允许跨源读取资源，但常可以通过内嵌资源来巧妙的进行读取访问。例如，你可以读取嵌入图片的高度和宽度，调用内嵌脚本的方法。

> 之所以允许跨源写而不允许跨源读，我认为是跨源写的操作不会泄露关键信息，只是将信息发送到服务器。而跨源读操作则可能造成用户信息的泄露。

总的来说同源策略的影响是：

- `Cookie、LocalStorage 和 IndexDB 无法读取`
- `DOM和JS对象无法获得`
- `AJAX` 请求无法接受响应(请求成功发出，响应也返回浏览器，但浏览器抛错)

跨域嵌入的方式：

- `<script src="..."></script>` `标签嵌入跨域脚本`
- `<link rel="stylesheet" href="...">` 标签嵌入`CSS`
- `<img>`嵌入图片
- `<video>` 和 `<audio>` 嵌入多媒体资源
- `<object>`, `<embed>` 和 `<applet>`的插件。
- `@font-face` 引入的字体。一些浏览器允许跨域字体( `cross-origin fonts`)，一些需要同源字体(`same-origin fonts`)
- `<frame>` 和 `<iframe>` 载入的任何资源。站点可以使用 `X-Frame-Options` 消息头来阻止这种形式的跨域交互。

浏览器的具体同源策略没有找到标准的文档，不过大致的思路就是我们可以向不同源的发送信息，不可以从不同的源接收信息，我把上面的内容和查到的规则整理如下：

1. 对于嵌入到页面的 `ifram` (如果 `X-Frame-Options` 允许)，无法访问 `iframe` 的文档，也就是不能操作 `DOM` 对象。
2. `css` 文件可以通过 `link` 标签嵌入或者 `@import` 方式引入，可能需要 `Content-type` 支持。
3. `form` 表单，`action` 可以使用跨源 `URL`，利用表单的提交可以将表单中的数据写入跨源目标。
4. 可以用 `img` 标签嵌入图像，但是无法读取图像的数据(例如 `canvas` 使用 `JavaScript` 将跨源图像加载到元素中)，如果需要读取图像，需要为图片所在服务器开启 `cors`，并且为图片加上属性 `crossOrigin=anonymous`，其实是和开启 `cors` 的 `ajax` 请求没有区别。[CORS_enabled_image](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image 'CORS_enabled_image')
5. 可以使用 `video` 和 `audio` 元素嵌入跨源视频和音频。
6. 可以嵌入跨源脚本; 但是，可能会阻止对某些API的访问，例如跨源的 `ajax` 或者 `fetch` 请求。根据我的测试，用 `ajax` 对跨源接口发送文件并不会触发同源策略，能够成功发送。
7. 存储在浏览器中的数据，如 `localStorage` 和 `IndexedDB`，以源进行分割。每个源都拥有自己单独的存储空间，一个源中的 `Javascript` 脚本不能对属于其它源的数据进行读写操作。
8. 一个页面可以为本域和任何父域设置 `cookie`，只要是父域不是公共后缀( `public suffix` )即可。

对于嵌入图片的读取可以测试如下代码：

```html
<!-- 嵌入一张跨域的google logo -->
<img
  crossorigin="anonymous"
  src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
  alt=""
/>
<script>
  function main() {
    var img = document.querySelector('img')
    img.onload = function () {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      // Copy the image contents to the canvas
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      var dataURL = canvas.toDataURL('image/png')

      var data = dataURL.replace(/^data:image\/(png|jpg);base64,/, '')
      console.log(data)
    }
  }
  main()
</script>
```

执行这个 `HTML` 浏览器会告诉你跨域了，解决的方式就是给图片加上 `crossorigin="anonymous"` 属性，并且图片所在服务器要开启 `cors`。

对于 `ajax` 发送的文件，大家可以用 `nodejs` 写一个简单的服务端，前端用 `formdata` 发送即可，并不会被浏览器拦击。

## CSRF 跨站请求伪造

由于同源策略允许跨源写操作，所以攻击者可以利用这一点来攻击，这种攻击称为跨站请求伪造 `Cross Site Request Forgery`，它通常发音为 `sea-surf`，也经常被称为 `XSRF`。

跨站点请求伪造(`CSRF`)迫使最终用户在当前已通过身份验证的Web应用程序上执行不需要的操作。在社会工程学的一点帮助下(例如通过电子邮件或聊天发送链接)，攻击者可能会诱骗 `Web` 应用程序的用户执行攻击者选择的操作。如果受害者是普通用户，则成功的 `CSRF` 攻击会迫使用户执行状态更改请求，例如转移资金，更改其电子邮件地址等。如果受害者是管理帐户，`CSRF` 可能会破坏整个 `Web` 应用程序。

当我们登录了一个网站，会将登录信息保存在 `cookie` 中，当我们下次发送请求的时候就连同 `cookie` 一起发送来验证身份，而不需要重新登录。跨站请求伪造就是利用这种机制，向你已经登录的网站再次发起请求，并带上自己的参数，这是一个跨源写操作，所以能够正常发送。

比如你登录了银行账户给别人转账，链接`https://your-bank.com/transfer/xxx`，此时如果攻击者给你发了个链接是一个表单：

```html
<form action="https://your-bank.com/transfer" method="POST" id="stealMoney">
  <input type="hidden" name="to" value="attacker_account" />
  <input type="hidden" name="account" value="your_account" />
  <input type="hidden" name="amount" value="$1,000" />
</form>
```

攻击者将收款账户改为自己的，此时提交表单，由于发送给 `https://your-bank.com/` 的请求会带上你刚刚登录的 `cookie`，验证成功，你的钱就打到了攻击者的账户。当然这只是一个例子，说明了攻击的可能性。在你没有登录的情况下，这种攻击是无效的。所以攻击者一般会利用社会工程学，诱骗你先登录银行账户，然后在诱骗你点击攻击用的链接。一般有两种情况：

- 发送带有 `HTML` 内容的未经请求的电子邮件
- 在受害者也进行在线银行业务时可能会访问的页面上植入漏洞利用 `URL` 或脚本，甚至可能只是一张图片。

关于跨站请求伪造攻击可以参考：[跨站请求伪造（CSRF）](https://owasp.org/www-community/attacks/csrfhttps://owasp.org/www-community/attacks/csrf '跨站请求伪造（CSRF）')

要避免跨站请求伪造可以在服务端检查 `origin` 和 `referer`，当然这也不是绝对安全的。

还可以通过将一个称为 `CSRF` 令牌的令牌发送到网页。每次发出新请求时，都会发送并验证此令牌。因此，向服务器发出的恶意请求将通过 `cookie` 身份验证，但 `CSRF` 验证会失败。大多数 `Web` 框架为防止 `CSRF` 攻击提供了开箱即用的支持，而 `CSRF` 攻击现在并不像以前那样常见。

## 跨域方法

同源策略我们已经掌握，但是浏览器的这种一刀切的做法有时候会为开发带来不便。特别是在有多个子系统的网站中，需要跨域通信的情况肯定会多，我们会把各个子系统布置在不同的主机上，所以如何饶考同源策略进行跨域请求，是每个前端必须熟练掌握的。

## JSONP

`JSONP`就是利用同源策略中允许跨域资源嵌入的这条规定来进行跨域请求的，`script` 标签请求的脚本会立即执行，那么只要请求中传给后端一个函数名，后端将函数名和数据拼接成执行函数的字符串返回给前端，浏览器解析的时候就相当于直接执行这个带参数的函数。 前端代码：

```html
<body>
  <script>
    function success(data) {
      console.log(data)
    }
  </script>

  <script src="http://localhost:8080/test?callback=success"></script>
</body>
```

后端代码：

```javascript
var http = require('http')
var url = require('url')

var routes = {
  '/test': function (req, res) {
    var cb_str = url.parse(req.url, true).search
    res.writeHead(200, 'Ok')
    var cb = cb_str.split('=')[1]
    console.log(cb)
    res.write(cb + `({result: "success"})`)
    res.end()
  }
}

var server = http.createServer(function (req, res) {
  var pathObj = url.parse(req.url, true)
  var handleFn = routes[pathObj.pathname]
  if (handleFn) {
    console.log(pathObj)
    handleFn(req, res)
  }
})

server.listen(8080)
console.log('server on 8080...')
```

前端嵌入的 `script` 标签在请求的时候带上了函数名 `success` 作为请求参数，后端接收到请求后将前端需要的数据 `{result: "success"}` 连带函数名拼接成 `success({result: "success"})` 返回给浏览器，浏览器会直接将返回的字符串当作 `js` 执行，由于我们前面已经定义了 `success` 函数，所以这段代码会直接给 `success` 函数带上参数执行，这样就实现了跨域请求。

> `JSONP` 只能发送 `GET` 请求

## 利用 form 提交跨域请求

由于 `form` 表单的功能是把数据发送给对应 `action`，所以并没有被同源策略限制，所以我们可以用在脚本中创建 `form` 并提交的方法来和跨域接口进行通信，用这种方法我们可以发送 `GET` 和 `POST` 请求，但是我们没法接收服务器返回的数据，不过可以利用设置 `form` 的 `target` 到一个空的 `iframe` 并监听 `iframe` 的 `load` 事件来确定请求是否发送成功。

## CORS

跨域资源共享(`CORS`) 是一种机制，它是 `HTTP` 的一部分，它使用额外的 `HTTP` 头来告诉浏览器 让运行在一个 `origin`(domain) 上的 `Web`应用被准许访问来自不同源服务器上的指定的资源。`cors` 的标准参考 [Fetch - whatwg](https://fetch.spec.whatwg.org/#http-cors-protocol 'Fetch - whatwg')

`CORS` 需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于 `IE10`。

整个 `CORS` 通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，`CORS` 通信与同源的AJAX通信没有差别，代码完全一样。浏览器一旦发现`AJAX` 请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。

因此，实现 `CORS` 通信的关键是服务器。只要服务器实现了 `CORS` 接口，就可以跨源通信。

跨源域资源共享（ `CORS` ）机制允许 `Web` 应用服务器进行跨源访问控制，从而使跨源数据传输得以安全进行。现代浏览器支持在 `API` 容器中（例如 `XMLHttpRequest` 或 `Fetch` ）使用 `CORS`，以降低跨源 `HTTP` 请求所带来的风险。

在哪些情况下需要使用 `cors` 呢：

- 由 `XMLHttpRequest` 或 `Fetch` 发起的跨源 `HTTP` 请求。
- `Web` 字体 (`CSS` 中通过 `@font-face` 使用跨源字体资源)，因此，网站就可以发布 `TrueType` 字体资源，并只允许已授权网站进行跨站调用。
- `WebGL` 贴图
- 使用 `drawImage` 将 `Images/video` 画面绘制到 `canvas`

浏览器将 `CORS` 请求分成两类：简单请求（ `simple request` ）和非简单请求（ `not-so-simple request` ）。只要同时满足以下两大条件，就属于简单请求。

1. 请求方法是以下三种方法之一：
   - `HEAD`
   - `GET`
   - `POST`

2. 除了被用户代理自动设置的首部字段（例如 `Connection` ，`User-Agent`）和在 `Fetch` 规范中定义为禁用首部名称的其他首部，允许人为设置的字段为 `Fetch` 规范定义的对 `CORS` 安全的首部字段集合。该集合为：
   - `Accept`
   - `Accept-Language`
   - `Content-Language`
   - `Last-Event-ID`
   - `Content-Type`：只限于三个值 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`
   - `DPR`
   - `Downlink`
   - `Save-Data`
   - `Viewport-Width`
   - `Width`

3. 请求中的任意 `XMLHttpRequestUpload` 对象均没有注册任何事件监听器；`XMLHttpRequestUpload` 对象可以使用 `XMLHttpRequest.upload` 属性访问。

4. 请求中没有使用 `ReadableStream` 对象。

> 注意: 这些跨站点请求与浏览器发出的其他跨站点请求并无二致。如果服务器未返回正确的响应首部，则请求方不会收到任何数据。因此，那些不允许跨站点请求的网站无需为这一新的 `HTTP` 访问控制特性担心。

### 简单请求

对于简单请求，前端什么都不需要做，浏览器会自动在我们的请求头中加一个字段 `origin` 向后端说明我们的源，服务器根据这个字段来决定是否同意该请求，如果 `Origin` 指定的源，不在许可范围内，服务器会返回一个正常的 `HTTP` 回应。浏览器发现，这个回应的头信息没有包含 `Access-Control-Allow-Origin` 字段，就知道出错了，从而抛出一个错误，被 `XMLHttpRequest` 的 `onerror` 回调函数捕获。注意，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是 `200`。

如果服务器同意该次跨域请求，那么在响应头中会多出以下字段

1. `Access-Control-Allow-Origin` ：指定了允许访问该资源的外域 URI。对于不需要携带身份凭证的请求，服务器可以指定该字段的值为通配符，表示允许来自所有域的请求。
2. `Access-Control-Allow-Credentials` ： 该字段可选。它的值是一个布尔值，表示是否允许发送 `Cookie`。默认情况下，`Cookie` 不包括在 `CORS` 请求之中。设为 `true`，即表示服务器明确许可， `Cookie` 可以包含在请求中，一起发给服务器。这个值也只能设为 `true`，如果服务器不要浏览器发送 `Cookie`，删除该字段即可。该字段为 `true` 的时候，`Access-Control-Allow-Origin` 必须为一个具体的值，不能设为通配符，并且需要前端配合设置 `xhr.withCredentials = true;`
3. `Access-Control-Expose-Headers`： 该字段可选。`CORS` 请求时，`XMLHttpRequest` 对象的 `getResponseHeader()` 方法只能拿到6个基本字段：`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`。如果想拿到其他字段，就必须在`Access-Control-Expose-Headers`里面指定。如 `Access-Control-Expose-Headers: X-My-Custom-Header, X-Another-Custom-Header`。

简单请求的前后端示例代码如下：

```javascript
//前端请求
document.cookie = 'name=clloz'
var xhr = new XMLHttpRequest()
xhr.open('get', 'http://localhost:8080/test', true)
xhr.withCredentials = true //请求想要发送cookie必须设置withCreadentials
xhr.onload = function () {
  console.log(xhr.responseText)
}
xhr.send()

//后端代码
var http = require('http')
var url = require('url')
var querystring = require('querystring')
var util = require('util')

var routes = {
  '/test': function (req, res) {
    console.log(req.method)
    if (req.method === 'GET') {
      console.log(req.headers.cookie)
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081')
      res.setHeader('Access-Control-Allow-Credentials', true) //允许前端发送cookie
      res.writeHead(200, 'Ok')
      res.write(`success`)
      res.end()
    }
  }
}

var server = http.createServer(function (req, res) {
  var pathObj = url.parse(req.url, true)
  var handleFn = routes[pathObj.pathname]
  if (handleFn) {
    handleFn(req, res)
  }
})

server.listen(8080)
console.log('server on 8080...')
```

### 非简单请求

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 `PUT` 或 `DELETE`，或者 `Content-Type` 字段的类型是 `application/json`。

非简单请求的 `CORS`请求，会在正式通信之前，增加一次 `HTTP` 查询请求，称为"预检"请求（ `preflight request` ）。浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 `HTTP` 方法和头信息字段。只有得到肯定答复，浏览器才会发出正式的 `XMLHttpRequest` 请求，否则就报错。看一个预检请求报文和响应报文：

```javascript
var invocation = new XMLHttpRequest()
var url = 'http://bar.other/resources/post-here/'
var body = '<?xml version="1.0"?><person><name>Arun</name></person>'

function callOtherDomain() {
  if (invocation) {
    invocation.open('POST', url, true)
    invocation.setRequestHeader('X-PINGOTHER', 'pingpong')
    invocation.setRequestHeader('Content-Type', 'application/xml')
    invocation.onreadystatechange = handler
    invocation.send(body)
  }
}
```

```bash
OPTIONS /resources/post-here/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1b3pre) Gecko/20081130 Minefield/3.1b3pre
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Connection: keep-alive
Origin: http://foo.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type


HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
Vary: Accept-Encoding, Origin
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

"预检"请求用的请求方法是 `OPTIONS`，表示这个请求是用来询问的。头信息里面，关键字段是 `Origin`，表示请求来自哪个源。除了 `Origin` 字段，"预检"请求的头信息包括两个特殊字段。

1. `Access-Control-Request-Method`：该字段是必须的，用来列出浏览器的 `CORS` 请求会用到哪些 `HTTP` 方法
2. `Access-Control-Request-Headers`：该字段是一个逗号分隔的字符串，指定浏览器 `CORS` 请求会额外发送的头信息字段

服务器收到"预检"请求以后，检查了`Origin`、`Access-Control-Request-Method` 和`Access-Control-Request-Headers` 字段以后，确认允许跨源请求，就可以做出回应。如果服务器否定了"预检"请求，会返回一个正常的 `HTTP` 回应，但是没有任何 `CORS` 相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被 `XMLHttpRequest` 对象的 `onerror` 回调函数捕获。控制台会打印出如下的报错信息。通过的预检请求，服务器响应头中会有如下字段：

1. `Access-Control-Allow-Methods`：该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。
2. `Access-Control-Allow-Headers`：如果浏览器请求包括 `Access-Control-Request-Headers` 字段，则 `Access-Control-Allow-Headers` 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。
3. `Access-Control-Allow-Credentials`： 和简单请求中相同。
4. `Access-Control-Max-Age` : 该字段可选，用来指定本次预检请求的有效期，单位为秒。

如果服务器通过了预检请求，在有效期内的正常的`CORS`请求，就都跟简单请求一样，会有一个 `Origin` 头信息字段。服务器的回应，也都会有一个 `Access-Control-Allow-Origin` 头信息字段。

非简单请求的示例代码如下：

```javascript
//前端代码
var json = {
  name: 'clloz',
  age: '27',
  sex: 'male'
}
document.cookie = 'name=clloz'
var xhr = new XMLHttpRequest()
xhr.open('post', 'http://localhost:8080/test', true)
xhr.setRequestHeader('content-type', 'application/json')
xhr.withCredentials = true
xhr.onload = function () {
  console.log(xhr.responseText)
}
xhr.send(json)

//后端代码
var http = require('http')
var url = require('url')
var querystring = require('querystring')
var util = require('util')

var routes = {
  '/test': function (req, res) {
    console.log(req.method)
    if (req.method === 'GET') {
      console.log(req.headers.cookie)
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081')
      res.setHeader('Access-Control-Allow-Credentials', true)
      res.writeHead(200, 'Ok')
      res.write(`success`)
      res.end()
    } else {
      var post = ''
      req.on('data', function (chunk) {
        post += chunk
      })
      req.on('end', function () {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081')
        res.setHeader('Access-Control-Allow-Credentials', true)
        res.setHeader('Access-Control-Request-Method', 'PUT,POST,GET,DELETE,OPTIONS')
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, t'
        )
        res.end('success')
      })
    }
  }
}

var server = http.createServer(function (req, res) {
  var pathObj = url.parse(req.url, true)
  var handleFn = routes[pathObj.pathname]
  if (handleFn) {
    handleFn(req, res)
  }
})

server.listen(8080)
console.log('server on 8080...')
```

大多数浏览器不支持针对于预检请求的重定向。如果一个预检请求发生了重定向，浏览器将报告错误。

---

`XMLHttpRequest` 或 `Fetch` 与 `CORS` 的一个有趣的特性是，可以基于 `HTTP cookies` 和 `HTTP` 认证信息发送身份凭证。一般而言，对于跨源 `XMLHttpRequest` 或 `Fetch` 请求，浏览器不会发送身份凭证信息。如果要发送凭证信息，需要设置 `XMLHttpRequest` 的某个特殊标志位 `withCredentials` 为 `true`。如果服务器端的响应中未携带 `Access-Control-Allow-Credentials: true` ，浏览器将不会把响应内容返回给请求的发送者。

对于附带身份凭证的请求，服务器不得设置 `Access-Control-Allow-Origin` 的值为 `*`（会有安全风险）。请求的首部中携带了 `Cookie` 信息，如果 `Access-Control-Allow-Origin` 的值为`*`，请求将会失败。而将 `Access-Control-Allow-Origin` 的值设置为请求的源，则请求将成功执行。

另外，响应首部中也携带了 `Set-Cookie` 字段，尝试对 `Cookie` 进行修改。如果操作失败，将会抛出异常。

## 代理

同源策略只是浏览器的限制，对于服务器上的 `web` 服务器是没有影响的，所以当我们需要请求跨域资源的时候，可以先向同源的 `web` 服务器提交请求，由 `web` 服务器再向对应的服务器请求到数据后返回给前端。

## postMessage

`window.postMessage()` 方法可以安全地实现跨源通信。使用方法是获得对另一个窗口的引用（比如`targetWindow = window.opener`），然后在窗口上调用 `targetWindow.postMessage()` 方法分发一个 `MessageEvent` 消息。接收消息的窗口可以根据需要自由处理此事件。传递给 `window.postMessage()` 的参数（比如 `message` ）将通过消息事件对象暴露给接收消息的窗口。

`postMessage` 的语法是 `otherWindow.postMessage(message, targetOrigin, [transfer]);`，`otherWindow` 是其他窗口的引用，将要发送到其他 `window` 的数据。它将会被结构化克隆算法序列化。这意味着你可以不受什么限制的将数据对象安全的传送给目标窗口而无需自己序列化。

`targetOrigin` 指定哪些窗口能接收到消息事件，其值可以是字符串 `*`（表示无限制）或者一个 `URI` 。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配 `targetOrigin` 提供的值，那么消息就不会被发送，有三者完全匹配，消息才会被发送。

这个机制用来控制消息可以发送到哪些窗口；例如，当用 `postMessage` 传送密码时，这个参数就显得尤为重要，必须保证它的值与这条包含密码的信息的预期接受者的 `origin` 属性完全一致，来防止密码被恶意的第三方截获。如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的 `targetOrigin`，而不是 `*`。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。

`transfer` 是一个可选参数，是一串和 `message` 同时传递的 `Transferable` 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

以上是发送发的 `API` 使用发放，接收方的使用方法如下：

```javascript
window.addEventListener('message', receiveMessage, false)

function receiveMessage(event) {
  // For Chrome, the origin property is in the event.originalEvent
  // object.
  // 这里不准确，chrome没有这个属性
  // var origin = event.origin || event.originalEvent.origin;
  var origin = event.origin
  if (origin !== 'http://example.org:8080') return

  // ...
}
```

接收方监听 `message` 事件，回到函数 `receiveMessage` 的 `event` 中可以取到 `data`，发送过来的数据；`origin`，发送方的源，由协议，域名和端口组成（`http` 默认为 `80` 端口，`https` 默认为 `443` 端口）；`source` 是对发送消息的窗口对象的引用，可以使用此来在具有不同 `origin` 的两个窗口之间建立双向通信。

下面是一个例子：用 `http-server` 启动两个服务来测试，分别为 `localhost:8080` 和 `localhost:8081`:

```html
<!-- localhost:8080 -->
<body>
  <button>btn</button>
  <iframe name="myframe" src="http://localhost:8081" frameborder="1"></iframe>
  <script>
    window.addEventListener('message', function (e) {
      if (e.origin === 'http://localhost:8081') {
        console.log(e.data)
      }
    })

    var iframe = window.frames['myframe']

    var btn = document.querySelector('button')
    btn.addEventListener('click', function () {
      iframe.postMessage('this is 8080', 'http://localhost:8081')
    })
  </script>
</body>

<!-- localhost:8081 -->
<body>
  this is frame!
  <script>
    window.addEventListener('message', function (e) {
      if (e.origin === 'http://localhost:8080') {
        console.log(e.data)
        e.source.postMessage('this is 8081', e.origin)
      }
    })
  </script>
</body>
```

点击第一个页面的按钮，会向第二页面发送消息，第二个页面收到消息会立即返回。

## document.domain

这种方式只适合主域名相同，但子域名不同的 `iframe` 跨域。比如主域名是`http://clloz.com`，子域名是`http://test.crossdomain.com`，这种情况下给两个页面指定一下`document.domain`即`document.domain = clloz.com`就可以访问各自的`window`对象了。

## location.hash + iframe跨域

实现原理： `a` 欲与 `b` 跨域相互通信，通过中间页 `c` 来实现。 三个页面，不同域之间利用 `iframe` 的 `location.hash` 传值，相同域之间直接 `js` 访问来通信。具体实现：`A`域：`a.html` -> `B` 域：`b.html` -> `A` 域：`c.html`，`a` 与 `b` 不同域只能通过 `hash` 值单向通信，`b` 与 `c` 也不同域也只能单向通信，但 `c` 与 `a` 同域，所以 `c` 可通过 `parent.parent` 访问a页面所有对象。

```html
<!-- a.html -->
<iframe id="iframe" src="http://www.domain2.com/b.html" style="display:none;"></iframe>
<script>
  var iframe = document.getElementById('iframe')

  // 向b.html传hash值
  setTimeout(function () {
    iframe.src = iframe.src + '#user=admin'
  }, 1000)

  // 开放给同域c.html的回调方法
  function onCallback(res) {
    alert('data from c.html ---> ' + res)
  }
</script>

<!-- b.html -->
<iframe id="iframe" src="http://www.domain1.com/c.html" style="display:none;"></iframe>
<script>
  var iframe = document.getElementById('iframe')

  // 监听a.html传来的hash值，再传给c.html
  window.onhashchange = function () {
    iframe.src = iframe.src + location.hash
  }
</script>

<!-- c.html -->
<iframe id="iframe" src="http://www.domain1.com/c.html" style="display:none;"></iframe>
<script>
  var iframe = document.getElementById('iframe')

  // 监听a.html传来的hash值，再传给c.html
  window.onhashchange = function () {
    iframe.src = iframe.src + location.hash
  }
</script>
```

## WebScoket

`WebSocket protocol` 是 `HTML5` 一种新的协议。它实现了浏览器与服务器全双工通信，同时允许跨域通讯，是 `server push` 技术的一种很好的实现。 原生 `WebSocket API` 使用起来不太方便，可以使用 `Socket.io`，它很好地封装了 `WebSocket` 接口，提供了更简单、灵活的接口，也对不支持 `WebSocket` 的浏览器提供了向下兼容。

## window.name

`window.name` 有一个奇妙的性质，页面如果设置了`window.name`，那么在不关闭页面的情况下，即使进行了页面跳转 `location.href=...`，这个 `window.name` 还是会保留。

所以我们可以利用这一点，和跨域页面通信。当我们在 `a.html` 要访问一个跨域页面 `b.html`，此时我们可以在 `a.html` 中用一个 `iframe` 加载 `b.html`。`b.html` 加载时要自动设置 `window.name`，存放我们要传递的信息，然后进行跳转，跳转到一个和 `a.html` 同源的页面 `c.html`，此时由于 `c.html` 和 `a.html` 同源，我们可以拿到 `iframe` 的 `$('iframe').contentWindow`，这就是 `iframe` 的 `window` 对象，此时我们就取到了 `b` 中设置的 `window.name`。实际操作中，我们一般使用一个隐藏的 `iframe`，然后监听它第二次 `onload` 事件，就知道该 `iframe` 已经跳到同域页面了，然后使用 `$('iframe').contentWindow.name` 即可。

## 参考文章

1. [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy 'same-origin policy')
2. [浏览器同源策略](https://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html '浏览器同源策略')
3. [CORS-MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS 'CORS-MDN')
4. [CORS-阮一峰](https://www.ruanyifeng.com/blog/2016/04/cors.html 'CORS-阮一峰')
5. [不要再问我跨域的问题了](https://segmentfault.com/a/1190000015597029 '不要再问我跨域的问题了')
6. [9种常见的前端跨域解决方案（详解）](https://juejin.im/post/6844903882083024910 '9种常见的前端跨域解决方案（详解）')
