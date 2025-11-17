---
title: '动手实现一个 WebSocket 服务器'
publishDate: '2021-12-21 12:00:00'
description: '实现一个 websocket 服务理解协议的封装'
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

现在在开发一些前后端频繁需要通信，或者需要后端主动推送消息到前端的功能时，我们一般会使用 `WebSocket`，基本每次项目搭建的时候都会要重新封装一个 `Socket` 类来创建前后端通信用的 `websocket` 对象。不过每次使用的时候我都要到 `MDN` 上看一看 `WebSocket` 对象的属性和方法，到网上找一找别人的封装赋值粘贴一下，可见对 `websocket` 协议的理解和浏览器的 `WebSocket` 对象的缺乏理解。并且由于前端的 `WebSocket` 对象比较简单，隐藏了非常多的细节，所以我决定用 `NodeJS` 的 `Net` 模块提供的 `TCP` 来实现一个 `WebSocket` 服务端来加深对 `WebSocket` 的理解。

> 实现代码在 [Github](https://github.com/Clloz/network-note/tree/master/WebSocket 'Github')，打开 `index.html`, 并且用 `node websocket.js` 启动服务端，即可进行通信。

## WebSocket 简介

首先来说一说 `WebSocket` 协议，`WebSocket` 是一个在 `TCP` 连接上提供的一个全双工通信通道。`WebSocket` 协议于 `2011` 年被 `IETF` 标准化为 [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455 'RFC 6455')，后由 [RFC 7936](https://datatracker.ietf.org/doc/html/rfc7936 'RFC 7936') 补充。`Web IDL` 中的 `WebSocket API` 由 `W3C` 进行标准化。

> `RFC` 指的是 `Request for Comments` 是一系列出版物，来自互联网的主要技术开发和标准制定机构，其中最著名的是互联网工程任务组 (`IETF`)。可以理解为网络相关的标准文档。 `Web IDL` 是指 `Web interface description language`，即 `Web` 接口描述语言，用来描述将要在浏览器中实现的 `API`。

`WebSocket` 是一个全新的协议，`WebSocket` 和 `HTTP` 是不同的，虽说他们是有交集的。他们都在网络 `OSI model` 的第七层应用层，都依赖于第四层传输层的 `TCP`。虽然两者是不同的协议，但是 `RFC 6455` 指出 `WebSocket` 被设计为工作在 `HTTP` 的 `443` 和 `80` 端口上，并支持 `HTTP` 代理和中介，使其与 `HTTP` 兼容。为了实现兼容性，`WebSocket` 的握手使用 `HTTP Upgrade header` 改变 `HTTP` 协议为 `WebSocket` 协议。一般我们在使用 `WebSocket` 的时候我们可以在 `Request Header` 中看到 `Connection: upgrade`，在 `Response Header` 中看到 `Connection: upgrade` 和 `Upgrade: websocket`。一般我们在 `nginx` 中要配置 `WebSocket` 代理有如下配置（字段解释可以参考 [Nginx如何配置Http、Https、WS、WSS](https://segmentfault.com/a/1190000039977023 'Nginx如何配置Http、Https、WS、WSS')）。

```bash
map $http_upgrade $connection_upgrade {
  default upgrade;
  '' close;
}
server {
  listen 8000;
  location / {
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
  }
}
```

`WebSocket` 协议让我们能够以比 `HTTP` 轮询等方式更低的开销在 `web client` 和 `web server` 进行实时数据传输。`WebSocket` 使得我们能以一种标准化的方式实现服务端主动向客户端发送内容，并且允许在保持同一个连接打开的状态下来回传递数据。

在没有 `WebSocket` 之前，我们都是用 `HTTP` 进行客户端和服务端的通信，这种通信方式只能由服务端发起请求，简历连接，客户端收到请求后进行处理，将数据返回给客户端然后连接即被关闭。在很多场景下，这种通信方式并不科学，比如实时通信，我们的请求建立非常频繁，由于 `HTTP` 请求的建立和销毁开销是挺大的，并且请求和响应都包含比较长的头部，真正有效的数据只是整个请求中很小的一部分，会多消耗很多资源。再比如有时候我们想要实时刷新一些数据，但是客户端是不知道数据什么时候发生了更新，我们就只能以轮询的方式定时向服务器发送请求。

## 轮询 pooling

这里我们详细说一说轮询的方式，即轮询和长轮询。网络通信有两种方式，一种叫 `push technology` 或者叫 `server push`，就是请求由发布者或者服务器发起。与之相对的就称为 `pull coding` 或者 `client pull`，即请求由客户端发起，然后由服务端进行响应，我们的 `HTTP` 即是一种广泛应用的 `pull technology`。

在我们实际开发中，绝大多数时候我们都是用的 `pull` 模式的 `HTTP`。`Push` 的使用场景一般就是即时信息，因为一般信息的产生是在服务端，如果我们想在客户端第一时间显示信息的变更就需要服务端在信息发生变化的时候推送到客户端。这也是发布订阅模型的一种实现，客户端订阅了一系列服务端提供的信息频道，当某个频道有新的内容产生的时候，服务器就将这个新消息推送到客户端。

我们的轮询就是一种用 `pull` 来模拟 `push` 的技术，分为常规轮询 `pooling` 和 长轮询 `long pooling`。

常规轮询非常简单，即客户端定时向服务端发出请求，时间间隔由客户端决定。常规轮询的问题在于，消息存在延迟（延迟取决于你的请求发送频率），并且我们发送了很多无用的信息，且每个客户端都在定时发送，对于服务器和网路来说这都是一个很大的负担。它的优点就是不需要额外进行支持，我们用 `HTTP` 即可实现。只有在我们的服务非常小，用户很少的情况这才是一个勉强可行的办法。

长轮询其实也很简单，就是服务器收到请求后在没有产生新的消息前不会关闭连接而是将连接挂起 `pending`，等新的连接产生时才返回给前端并关闭连接。前端收到新消息后立即发出一个新的请求，如此循环，如下图。

![long-pooling](https://img.clloz.com/blog/writing/long-pooling.svg 'long-pooling')

长轮询的缺点就是需要挂起很多连接，有些服务器架构是一个连接对应一个进程，连接数多了会消耗相当多的内存。长轮询的 `demo` 可以参考 [长轮询聊天 - JAVASCRIPT.INFO](https://zh.javascript.info/long-polling#shi-li-liao-tian '长轮询聊天 - JAVASCRIPT.INFO')

> 服务端的 `TCP` 连接数不是问题，客户端的 `TCP` 连接数受限于端口最多只能有 `2 ^ 16 - 1` 个，但是服务端监听在固定端口，所以不会有这个限制。参考 [服务器最大TCP连接数及调优汇总](https://blog.csdn.net/OiteBody/article/details/111640298 '服务器最大TCP连接数及调优汇总')

这也就是所谓的 `comet` 技术，在没有 `WebSocket` 之前基本都是通过这两种方式来服务器消息的推送，一般都是为了即时消息的展示。[维基百科](<https://en.wikipedia.org/wiki/Comet_(programming)#Script_tag_long_polling> '维基百科')上还介绍了一种 `script tag long pooling` 来解决跨域情况下的长轮询，其实就是将 `ajax` 替换成 `JSONP`。

> `comet` 还有 `iframe` 流和 `flash socket` 等实现方式，参考 [维基百科](<https://en.wikipedia.org/wiki/Comet_(programming)> '维基百科')

本着尽量搞懂每一个遇到的知识点，我这里写了个例子试了试 `iframe` 流。

```html
<iframe src="http://localhost:8080/iframe"></iframe>
<script>
  const xhr = new XMLHttpRequest()
  xhr.open('GET', 'http://localhost:8080/normal')
  xhr.send()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText)
    }
  }
</script>
```

```javascript
const http = require('http')
const url = require('url')

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url)
    if (pathname === '/favicon.ico') return false
    console.log(`visit: ${pathname}`)

    if (pathname === '/iframe') {
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      setInterval(() => {
        res.write(`<script>console.log('${new Date()}')</script>`)
      }, 1000)
    }

    if (pathname === '/normal') {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.write('hello world')
      res.end()
    }
  })
  .listen(8080)
```

其实说简单点就是 `iframe` 可以不用 `response.end()` 来完成响应。所以我们可以一直持续发送消息，并且这个处理也不是那么灵活，基本上也只能是一个定时器持续执行一个函数（比如查询数据并返回）。（这里如有理解错误，欢迎指出）

> 还有个以前经常出现的概念是**长连接**，我一直没找到一个具体的定义，只有在维基百科上找到 `HTTP keep-alive`，其实本质就是传输层的 `TCP` 不断开，在一个 `TCP` 连接上进行持续的通信。[HTTP持久连接](https://zh.wikipedia.org/wiki/HTTP%E6%8C%81%E4%B9%85%E8%BF%9E%E6%8E%A5 'HTTP持久连接')

由于轮询的缺点，所以最终有了 `WebSocket` 和 `EventSource`。

在进入 `WebSocket` 协议细节和实现之前，我们先看一看比较简单的浏览器提供的 `WebSocket API`，也是我们平常接触比较多比较熟悉的对象。

## 浏览器端的 `WebSocket`

浏览器端的 `WebSocket` 对象是非常简单的，基本我们只要 `new` 一个 `WebSocket` 对象然后调用一些方法即可使用，在实现之前我们先介绍一下浏览器提供的 `WebSocket API`。

##### 构造函数

一般我们使用 `WebSocket` 就直接 `new WebSocket(url)` 就可以构造出 `WebSocket` 对象了，不过 `WebSocket` 还接受一个可选参数 `protocols`，可以是一个字符串，或者字符串数组。所谓子协议其实就是在建立连接的时候多加了一个 `header` 叫做 `sec-websocket-protocol`，实际上就是我们可以自己商量一些解析内容的方式，看到对应的头就用对应的解析方式，一般是不需要使用的。

## WebSocket.prototype.binaryType

`WebSocket` 可以发送两种数据，一种是 `USVString`，另一种是二进制数据（包括 `ArrayBuffer`，`TypedArray`，`DataView` 和 `Blob`）。

> `USVString` 概念参考 [搞懂字符编码](https://www.clloz.com/programming/assorted/2019/04/26/character-encoding/#USVStringDOMStringCSSOMString '搞懂字符编码')

这个属性是用来控制浏览器收到二进制数据如何处理的，该属性可以设置为 `blob` 和 `arraybuffer`，`blob` 是默认值。这个值不会传递给服务端，它的功能只是告诉浏览器在拿到服务器的二进制数据之后处理为哪个对象。如果你需要 `blob` 就默认就可以，如果你希望要读写拿到的二进制数据那么就应该使用 `arraybuffer`。如果对于前端的二进制处理不清楚，欢迎移步到我的另一篇博客 [JS 中的二进制数据的操作](https://www.clloz.com/programming/front-end/js/2021/12/06/js-binary-data-manipulate/# 'JS 中的二进制数据的操作')

## WebSocket.prototype.bufferedAmount

这个**只读**属性返回已经调用 `send()` 方法发送但还没有实际发送到网络上去的字节数，发送出去后这个值会清零。如果连接已经关闭，继续调用 `send` 方法，这个值会一直增长。一般来说不会使用。

## WebSocket.prototype.extensions

这个**只读**属性返回服务器选择的 `WebSocket` 扩展。所谓的扩展就是对 `WebSocket` 协议的一种增强，比如 `deflate-frame` 就是告诉服务器浏览器支持数据压缩。一般来说这个值是空字符串，前端可以通过建立连接时用 `Sec-Websocket-Extensions` 来告诉服务器哪些扩展是被支持的，这个 `header` 是每次连接建立时浏览器自动生成的，告诉服务器该浏览器支持哪些扩展，服务器会选择它需要使用的扩展在 `Response` 的 `Sec-Websocket-Extensions` 头中，我们的这个只读属性就是获取的服务端返回的这个 `header`。

## WebSocket.prototype.protocol

这个**只读**属性返回服务器选择的子协议，比如 `soap` 和 `wamp`。前端在建立请求的时候可以用 `WebSocket` 构造函数的第二个参数（本质就是添加 `Sec-Websocket-Protocol` 头） 来告诉服务器前端支持哪些子协议，服务器会返回它决定使用的子协议并放在 `Response` 的 `Sec-Websocket-Protocol` 中来告诉客户端，我们的这个只读属性就是获取的服务端返回的这个 `header`。可以使用通用的[子协议](https://www.iana.org/assignments/websocket/websocket.xml '子协议')，也可以自定义子协议。所谓的子协议其实就是客户端和服务端商量一种通信使用的数据结构。

关于扩展和子协议我们可以举个例子：

```bash
# Request
GET /chat
Host: javascript.info
Upgrade: websocket
Connection: Upgrade
Origin: https://javascript.info
Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
Sec-WebSocket-Version: 13
Sec-WebSocket-Extensions: deflate-frame
Sec-WebSocket-Protocol: soap, wamp

# Response
101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: hsBlbuDTkk24srzEOTBUlZAlC2g=
Sec-WebSocket-Extensions: deflate-frame
Sec-WebSocket-Protocol: soap
```

## WebSocket.prototype.url

这个**只读**属性返回 `WebSocket` 连接的绝对地址。

## WebSocket.prototype.readyState

这个**只读**属性返回 `WebSocket` 连接的当前状态，返回值是一个`unsigned short`。

| Value | State      | Description                                              |
| ----- | ---------- | -------------------------------------------------------- |
| 0     | CONNECTING | Socket has been created. The connection is not yet open. |
| 1     | OPEN       | The connection is open and ready to communicate.         |
| 2     | CLOSING    | The connection is in the process of closing.             |
| 3     | CLOSED     | The connection is closed or couldn't be opened.          |

## WebSocket.prototype.send(data)

`send` 是我们用来发送消息的方法。`send` 方法将要发送给 `server` 的数据排入队列，同时增大 `bufferedAmount`。如果数据无法被发送（比如缓冲区已满），`socket` 会自动关闭。如果 `readyState` 是 `CONNECTING` 时调用 `send` 方法，浏览器会抛出一个 `INVALID_STATE_ERR` 异常。如果在 `readyState` 为 `CLOSING` 或者 `CLOSED`，浏览器会静默丢弃要发送的数据。

我们可发送的数据类型有 `USVString`，`ArrayBuffer`，`Blob`，`TypedArray` 和 `DataView`。简单点说我们可以发送字符串和二进制数据。`USVString` 会被转为 `UTF-8` 放入缓冲，`bufferedAmount` 也会按照 `UTF-8` 的大小增长。需要注意的是如果我们使用单个的代理平面的码点，或者错误顺序的代理平面码点都会被替换成 `�`，比如 `ws.send('\uDC00\uD800')` 我们会在后端接收到 `��`，`ws.send('\uDC00')` 或者 `ws.send('\uD800')` 则都会收到 `�`。具体就是因为 `USVString` 的概念即浏览器的处理，参考 [搞懂字符编码](https://www.clloz.com/programming/assorted/2019/04/26/character-encoding/#USVStringDOMStringCSSOMString '搞懂字符编码')

## WebSocket.prototype.close

这个方法是关闭 `WebSocket` 连接的，可以传递两个可选参数，一个 `code`，表示连接关闭的状态码，默认值是 `1005`，其他状态码参考 [CloseEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code 'CloseEvent.code') 。另一个是 `reason`，是一个人类刻度的表示连接关闭原因的字符串，长度不能超过 `123` 字节的 `UTF-8` 文本。

## Event

剩下的就是四个事件和事件监听函数，分别是 `close`，`error`，`open` 和 `message`。分别对应连接的关闭，连接报错，连接打开和信息的接受。事件监听可以用 `addEventListener` 或者 `onEvent`。

进本上前端的 `WebSocket` 内容就这么多，并不是很复杂。有了这个为基础我们可以开始进入 `WebSocket server` 实现。我们可以利用前端建立连接，发送不同的数据类型，以及用浏览器的开发者工具查看请求的 `header` 和 `message`。

## 实现 `WebSocket` 服务器

要用 `TCP` 处理连接，我们必须知道 `WebSocket` 连接是如何建立，以及发送的帧格式，如果你有耐心，可以去阅读 [RFC6455](https://tools.ietf.org/html/rfc6455 'RFC6455')，我在这里做一个简单的梳理。

## 握手

建立 `WebSocket` 连接客户端需要发送一个握手请求，服务端返回握手请求后连接即被建立，之后客户端和服务端就可以进行全双工通信了。`WebSocket` 是通过 `HTTP/1.1` 协议的 `101` 状态码进行握手。我们的请求头如下：

```bash
GET ws://localhost:3000/ HTTP/1.1
Host: localhost:3000
Connection: Upgrade
Pragma: no-cache
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36
Upgrade: websocket
Origin: http://localhost:63342
Sec-WebSocket-Version: 13
Accept-Encoding: gzip, deflate, br
Accept-Language: en,ja;q=0.9,zh;q=0.8,zh-CN;q=0.7
Sec-WebSocket-Key: hFP3hhcWJNLBqU+rCnHPng==
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
```

这其中比较关键的就是： 1. `Connection: Upgrade` 和 `Upgrade: websocket`：噶偶速服务端升级到 `websocket` 协议 2. `Sec-WebSocket-Version`： 表示支持的 `WebSocket` 版本。`RFC6455` 要求使用的版本是 `13`，之前草案的版本均应当弃用。 3. `Sec-WebSocket-Key` 是随机 `base64` 编码的字符串，`RFC6455` 要其这个值必须是用一个临时创建的 `16` 字节的值经过 `base64` 编码后生成的 `24` 字节的值（最后两位为 `==`）如果不符合这个要求，绝大多数现代 `HTTP server` 会拒绝请求并返回一个错误 `invalid Sec-WebSocket-Key header`。服务器端会用这些数据来构造出一个 `SHA-1` 的信息摘要。把 `Sec-WebSocket-Key` 加上一个特殊字符串 `258EAFA5-E914-47DA-95CA-C5AB0DC85B11`，然后计算 `SHA-1` 摘要，之后进行 `Base64` 编码，将结果做为 `Sec-WebSocket-Accept` 头的值，返回给客户端。如此操作，可以尽量避免普通 `HTTP` 请求被误认为 `WebSocket` 协议，所以这个 `header` 不是为了安全性考虑的，只是防止非 `websocket` 的客户端误发 `WebSocket` 请求。**注意这个头是由客户端（一般是浏览器）自动添加的，我们无法通过 XMLHttpRequest.setRequestHeader() 添加** 4. Sec-WebSocket-Extensions 和 Sec-Websocket-Protocol 参考上文的浏览器中的 `WebSocket` 对象

服务端的返回如下：

```bash
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: 8XodYgYF1B62DPQYUIi5VJu/vCI=
```

`Sec-WebSocket-Accept` 就是根据客户端的 `Sec-WebSocket-Key` 计算得到的值。服务端也会带上 `Upgrade` 和 `Connection`，客户端收到服务端的返回，即完成握手，连接建立成功，我们可以通过这个连接进行全双工通信，直至连接关闭。

握手中我们要处理的就是生成 `Sec-WebSocket-Accept`，监听 `socket` 的 `data` 事件，解析请求头，判断是否是合法的 `WebSocket` 请求，然后闹到 `Sec-WebSocket-Key`，利用 `NodeJS` 的 `Crypto` 模块可以很轻松计算出 `Sec-WebSocket-Accept`。

```javascript
const net = require('net') // net 模块提供一个异步的网络 API 用来创建基于流的 TCP 或者 IPC(Inter Process Communication) 的服务端或者客户端 https://blog.csdn.net/manhua253/article/details/4219655
const crypto = require('crypto') // crypto 模块提供了一些加密和解密的方法
const { Buffer } = require('buffer')

// 解析请求头
function parseHeader(data) {
  const header = {}
  const lines = data.split('\r\n').filter((line) => line)
  lines.shift() // 去除第一行请求行
  lines.forEach((line) => {
    const [key, value] = line.split(': ')
    header[key.toLowerCase()] = value
  })
  return header
}

const server = net.createServer((socket) => {
  // console.log(socket);
  socket.once('data', (buffer) => {
    console.log(Object.prototype.toString.call(buffer)) // 确定 buffer 的类型 Uint8Array
    const str = buffer.toString()
    const headers = parseHeader(str) // 解析请求头
    console.log(headers) // 观察一下请求头

    if (headers.upgrade !== 'websocket') {
      console.log('不是 websocket 请求')
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    } else if (headers['sec-websocket-version'] !== '13') {
      console.log('不支持的 websocket 版本')
      socket.end('HTTP/1.1 426 Upgrade Required\r\nSec-WebSocket-Version: 13\r\n\r\n')
    } else {
      const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
      const key = headers['sec-websocket-key']
      const acceptKey = crypto
        .createHash('sha1') // 创建 sha1 hash 对象
        .update(key + GUID) // 更新 hash 对象内容
        .digest('base64') // 生成摘要
      const response = `HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${acceptKey}\r\n\r\n`
      socket.write(response)
      console.log(response)

      let maskingKey = []

      socket.on('data', (msgBuffer) => {
        // 监听前端发来的数据
      })

      console.log(maskingKey)
    }
  })
})
server.listen(3000) // 监听端口
```

## 解析消息帧

连接建立完成后我们就要处理消息的接收和发送了，这其中最重要的就是要理解 `WebSocket` 的消息帧了，对照[Base Framing Protocol - RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455#section-5.2 'Base Framing Protocol - RFC 6455') 可以看到详细说明，我这里做一个简单的说明，如果要了解细节还是参考规范文档。

> 一条 `WebSocket message` 是可以分多帧发送的，可能我们在客户端调用的 `websocket.send()` 被浏览器分成了多帧发送，所以我们在实现 `WebSocket` 服务器的时候需要考虑多帧的问题。

![websocket-frame](./images/websocket-frame.png 'websocket-frame')

这个帧格式最上面的数字表示 `bit`，一行一共是 `32 bits`，也就是 `4` 个字节。下面我们分别介绍各个位的含义。 1. `FIN`：占 `1 bit`，表示这是不是一条 `message` 的最后一个 `fragment`，`1` 就表示是最后一个片段。如果一条消息只有一个片段，那么第一个片段就是最后一个片段。 2. 连续的三个 `RSV`，每个都是 `1 bit`，除非我们使用的扩展对 `RSV` 的非 `0` 值进行了定义，否则这三个值都是 `0`。一般来说这三个值都是 `0`，如果没有使用上述扩展，并且发送了任意 `RSV` 非 `0` 的帧，那么接收端会关闭连接并且会报错。 3. `Opcode`： `4 bits`，定义帧类型 `%x0` 表示一个连续帧（接续上一个帧）， `%x1` 为文本帧， `%x2` 为二进制帧， `%x3-7` 为未来的帧类型保留， `%x8` 表示连接关闭， `%x9` 为 `ping` 帧， `%xA` 为 `pong` 帧， `%xB-F` 保留。如果任意端（客户端或者服务端）发送了一个未知的 `opcode`，另一端会关闭连接。 4. `MASK`：`1 bit`，表示是否对 `Payload data` 使用了掩码，为 `1` 则表示了使用掩码，并且后面会有四个字节的掩码。 6. `Payload length`：可以是 `7 bits`，`7 + 16 bits` 或者是 `7 + 64 bits`。表示的是 `payload data` 的字节数，如果前 `7 bit` 为 `0 - 125` 之间，则这 `7 bits` 表示的数字就是 `payload data` 的字节数。如果前 `7 bits` 为 `126`，那么后面 `2` 个字节表示的 `Extended payload length` 表示的数作为 `payload` 的字节数。如果前 `7 bits` 的值为 `127`，那么后面 `8` 个字节表示的 `Extended payload length` 表示的数作为 `payload` 的字节数。所以 `payload length` 这里具体有多少 `bits` 取决于我们的 `payload data` 的长度。 7. `Masking-key`：如果前面我们的 `MASK` 那一位为 `1`，那么这里会有四个字节用来表示掩码，如果`MASK` 为 `0`，则这四个字节不存在。 8. `Payload data`：最后就是我们的实际数据，如果有 `MASK`，那么这个数据是经过掩码处理后的。`Payload data` 包含两个部分，`Extension data` 和 `Application data`，前者只有在我们 `Extension` 的时候会有，后者就是我们实际要发送的数据。

> 所谓 `payload` 英文翻译为有效荷载，其实就是指我们发送的内容中实际要发送的数据，或者我们程序中实际有意义的数据，因为一个帧里面除了我们要发的数据还要带很多其他信息。

`socket` 收到的所有消息都是 `Uint8Array` 类型的，如果是字符串就是 `UTF-8` 的，所以我们要先写一些工具函数，`UTF-8` 和 `String` 的相互转换，以及 `mask` 的算法。

这里单独说一下 `mask` 的算法，`mask` 的加解密算法是一样的，就是遍历 `payload` 的每个字节，然后依次和 `Masking-Key` 数组中的每一个进行按位异或就得到了掩码后或掩码前的值。**特别需要注意的一点是，客户端给服务端发的消息是强制要掩码的，服务端给客户端发消息虽然没有强制规定，但很多客户端不支持，比如 chrome，所以我们给客户端发的时候不要加掩码（我在代码中的发送分别处理加掩码和不加掩码两种情况）** 标准中给出的说明[如下](https://datatracker.ietf.org/doc/html/rfc6455#section-5.3 '如下')：

```bash
j = i MOD 4
transformed-octet-i = original-octet-i XOR masking-key-octet-j
```

`UTF-8` 和 `String` 的互转就不另外说明了，大家直接看代码和注释。

```javascript
// utf-8 转字符串
function utf8ToString(buffer) {
  console.log(buffer)
  let result = ''
  for (let i = 0; i < buffer.length; i += 1) {
    if (buffer[i] >> 7 === 0) {
      result += String.fromCodePoint(buffer[i])
    }
    if (buffer[i] >> 5 === 0b110) {
      const codePoint = ((buffer[i] & 0x1f) << 6) | (buffer[i + 1] & 0x3f)
      result += String.fromCodePoint(codePoint)
      i += 1
    }
    if (buffer[i] >> 4 === 0b1110) {
      const codePoint =
        ((buffer[i] & 0xf) << 12) | ((buffer[i + 1] & 0x3f) << 6) | (buffer[i + 2] & 0x3f)
      result += String.fromCodePoint(codePoint)
      i += 2
    }
    if (buffer[i] >> 3 === 0b11110) {
      const codePoint =
        ((buffer[i] & 0xf) << 18) |
        ((buffer[i + 1] & 0x3f) << 12) |
        ((buffer[i + 2] & 0x3f) << 6) |
        (buffer[i + 3] & 0x3f)
      try {
        result += String.fromCodePoint(codePoint)
      } catch (e) {
        console.log(buffer[i], buffer[i + 1], buffer[i + 2], buffer[i + 3])
      }
      i += 3
    }
  }
  return result
}

// 字符串转 utf-8
function stringToUtf8(str) {
  const { length } = str
  const result = []
  for (let i = 0; i < length; i += 1) {
    const codePoint = str.codePointAt(i)
    if (codePoint <= 0x7f) {
      result.push(codePoint & 0x7f)
    } else if (codePoint >= 0x80 && codePoint <= 0x7ff) {
      result.push(((codePoint >> 6) & 0x1f) | 0xc0)
      result.push((codePoint & 0x3f) | 0x80)
    } else if (codePoint >= 0x800 && codePoint <= 0xffff) {
      result.push(((codePoint >> 12) & 0xf) | 0xe0)
      result.push(((codePoint >> 6) & 0x3f) | 0x80)
      result.push((codePoint & 0x3f) | 0x80)
    } else if (codePoint >= 0x10000 && codePoint <= 0x10ffff) {
      result.push(((codePoint >> 18) & 0x7) | 0xf0)
      result.push(((codePoint >> 12) & 0x3f) | 0x80)
      result.push(((codePoint >> 6) & 0x3f) | 0x80)
      result.push((codePoint & 0x3f) | 0x80)
      i += 1
    }
  }
  return Uint8Array.from(result)
}

// 带掩码的数据的编解码，编解码的方式都一样的
function maskCodec(data, mask) {
  if (mask.length !== 4) return data
  const { length } = data
  const result = new Uint8Array(length)
  for (let i = 0; i < length; i += 1) {
    result[i] = data[i] ^ mask[i % 4]
  }
  return result
}
```

有了这些基础的方法之后就是按照帧的格式进行封装和解封了，直接上代码。

```javascript
/**
 * @description: 解封数据帧，主要是根据 payloadLength 和 maskingKey 将 payload 解码为对应的 utf-8 编码或者二进制数据 TODO: 此处只是一个简单的实现，没有处理连续帧的情况
 * @param data (数据帧)
 * @return: utf-8 对应的字符串或者二进制数据
 */
function decodeWebSocketFrame(data) {
  const frame = {
    isFinal: (data[0] >> 7) & 1, // 是否为最后一帧
    rsv1: (data[0] >> 6) & 1, // 必须为0 除非扩展了非 0 值的含义的扩展
    rsv2: (data[0] >> 5) & 1, // 同上
    rsv3: (data[0] >> 4) & 1, // 同上
    opcode: data[0] & 0xf, // 帧类型 %x0 表示一个连续帧（接续上一个帧） %x1 为文本帧 %x2 为二进制帧 %x3-7 保留 %x8 表示连接关闭 %x9 为ping帧 %xA 为pong帧 %xB-F 保留
    mask: (data[1] >> 7) & 1, // 是否有掩码
    payloadLength: data[1] & 0x7f, // 帧长度 0-125 则为精确长度，如果为126 则后面两个字节为长度 如果为127 则后面8个字节为长度
    extendedPayloadLength:
      // eslint-disable-next-line no-nested-ternary
      data[1] === 0x7f ? data.readUIntBE(2, 2) : data[1] === 0xff ? data.readUIntBE(2, 8) : 0, // 扩展长度
    maskingKey: [data[2], data[3], data[4], data[5]], // 掩码
    maskedPayload: data.slice(6) // 掩码后的数据
  }

  // payloadLength 为 126 则后面 2 字节的 16 位无符号整数为 payloadLength
  if (frame.payloadLength === 0x7e) {
    frame.payloadLength = data.readUIntBE(2, 2)
    frame.maskingKey = [data[4], data[5], data[6], data[7]]
    frame.maskedPayload = data.slice(8)
  }

  // payloadLength 为 127 则后面 8 字节的 64 位无符号整数(最高位必须为 0)为 payloadLength
  if (frame.payloadLength === 0x7f) {
    frame.payloadLength = data.readUIntBE(2, 8)
    frame.maskingKey = [data[10], data[11], data[12], data[13]]
    frame.maskedPayload = data.slice(14)
  }

  frame.unMaskedPayload = maskCodec(frame.maskedPayload, frame.maskingKey) // 解码
  console.log(frame)
  return frame
}

/**
 * @description: 这里的分别测试了发送单帧和连续帧的两种情况
 * 这里我设置了封装帧的时候可以设置掩码，实际服务端向客服端发送的数据的时候浏览器不一定支持用掩码
 * 比如 chrome，如果你用掩码就会报错 `A server must not mask any frames that it sends to the client.` 参考 https://stackoverflow.com/a/16935108/8854649
 * @param maskingKey: 掩码，如果不需要用掩码则传入 [] 即可
 * @param data1: 第一帧的数据
 * @param data2: 第二帧的数据（optional）
 * @return result 封装好的帧数据
 */
function encodeWebsocketFrame(maskingKey, data1, data2) {
  let result
  const mask = maskingKey && maskingKey.length === 4 ? maskingKey : []
  if (data2) {
    const dataBuf1 = stringToUtf8(data1)
    const dataBuf2 = stringToUtf8(data2)
    const frame1 = Buffer.concat(
      [
        Buffer.from([0b00000001, dataBuf1.length + (mask.length ? 0b10000000 : 0), ...mask]),
        maskCodec(dataBuf1, mask)
      ],
      2 + mask.length + dataBuf1.length
    )
    const frame2 = Buffer.concat(
      [
        Buffer.from([0b10000000, dataBuf2.length + (mask.length ? 0b10000000 : 0), ...mask]),
        maskCodec(dataBuf2, mask)
      ],
      2 + mask.length + dataBuf2.length
    )
    result = [frame1, frame2]
  } else {
    const dataBuf = stringToUtf8(data1)
    result = Buffer.concat(
      [
        Buffer.from([0b10000001, dataBuf.length + (mask.length ? 0b10000000 : 0), ...mask]),
        maskCodec(dataBuf, mask)
      ],
      2 + mask.length + dataBuf.length
    )
  }
  console.log(result)
  return result
}
```

完整的代码在 [Github](https://github.com/Clloz/network-note/tree/master/WebSocket 'github')

## WebSocket 的安全

由于 `WebSocket` 客户端并不是局限在浏览端，所以和常规的 `HTTP` 请求不一样，`WebSocket` 没有同源策略的限制。因此，`WebSocket` 服务器在建立连接时必须根据预期的来源验证 `Origin` 头，以避免跨站点 `WebSocket` 劫持攻击（类似于跨站点请求伪造），当连接使用 `cookie` 或 `HTTP` 进行身份验证时可能会发生这种情况验证。当敏感（私人）数据通过 `WebSocket` 传输时，最好使用令牌或类似的保护机制来验证 `WebSocket` 连接。

## 参考文档

1. [WebSocket - wikipedia](https://en.wikipedia.org/wiki/WebSocket 'WebSocket - wikipedia')
2. [你不知道的 WebSocket](https://segmentfault.com/a/1190000023402628 '你不知道的 WebSocket')
3. [长轮询 - JAVASCRIPT.INFO](https://zh.javascript.info/long-polling#chang-gui-lun-xun '长轮询 - JAVASCRIPT.INFO')
4. [原生实现 WebSocket 应用](https://blog.csdn.net/chencl1986/article/details/88411056 '原生实现 WebSocket 应用')
5. [websocket - JAVASCRIPT-INFO](https://javascript.info/websocket 'websocket - JAVASCRIPT-INFO')
6. [WebSocket 安全问题分析](https://security.tencent.com/index.php/blog/msg/119 'WebSocket 安全问题分析')
