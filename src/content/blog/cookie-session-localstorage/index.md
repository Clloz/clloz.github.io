---
title: '浏览器存储方案'
publishDate: '2019-05-02 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
heroImage: {"src":"./browser.jpg","color":"#B4C6DA"}
---

## 前言

浏览器有多种存储数据的办法，包括 `Cookie`，`web storage`（ `localStorage` 和 `sessionStorage` ），`indexedDB`。它们的主要目的都是快速访问数据而不需要建立请求去服务器获取。它们有着不一样的大小，生命周期和作用域，所以需要在合适的场景选择合适的数据存储办法。

## Cookie

`cookie` 是为了解决 `HTTP` 协议的无状态而引入的技术。`HTTP Cookie`（也叫 `Web Cookie` 或浏览器 `Cookie`）是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器，如保持用户的登录状态。`Cookie` 使基于无状态的 `HTTP` 协议记录稳定的状态信息成为了可能。

`Cookie`主要用于以下三个方面：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

`Cookie` 曾一度用于客户端数据的存储，因当时并没有其它合适的存储办法而作为唯一的存储手段，但现在随着现代浏览器开始支持各种各样的存储方式，`Cookie` 渐渐被淘汰。由于服务器指定 `Cookie` 后，浏览器的每次请求都会携带 `Cookie` 数据，会带来额外的性能开销（尤其是在移动环境下）。新的浏览器API已经允许开发者直接将数据存储到本地，如使用 `Web storage API`（本地存储和会话存储）或 `IndexedDB` 。

## 创建Cookie

当服务器收到HTTP请求时，服务器可以在响应头里面添加一个 `Set-Cookie` 选项。浏览器收到响应后通常会保存下 `Cookie`，之后对该服务器每一次请求中都通过 `Cookie` 请求头部将 `Cookie` 信息发送给服务器。另外，`Cookie` 的过期时间、域、路径、有效期、适用站点都可以根据需要来指定。

服务器使用 `Set-Cookie` 响应头部向用户代理（一般是浏览器）发送Cookie信息，比如 `Set-Cookie: status=enable; expires=Tue, 05 Jul 2011 07:26:31 GMT; path=/; domain=clloz.com;`，服务器通过该头部告知客户端保存 `Cookie` 信息。

如果不对 `Cookie` 设置 `expires` 则该 `Cookie` 被认为是会话期 `Cookie`，会话期 `Cookie` 是最简单的 `Cookie`：浏览器关闭之后它会被自动删除，也就是说它仅在会话期内有效。会话期`Cookie`不需要指定过期时间（ `Expires` ）或者有效期（ `Max-Age` ）。需要注意的是，有些浏览器提供了会话恢复功能，这种情况下即使关闭了浏览器，会话期 `Cookie` 也会被保留下来，就好像浏览器从来没有关闭一样。而设置了 `expires` 的 `Cookie` 则被认为是持久性的 `Cookie`，规定了 `Cookie` 的过期时间，而 `max-age` 参数则规定了 `Cookie` 过期的相对时间。

## Cookie的安全

标记为 `Secure` 的 `Cookie` 只应通过被 `HTTPS` 协议加密过的请求发送给服务端。但即便设置了 `Secure` 标记，敏感信息也不应该通过 `Cookie` 传输，因为 `Cookie` 有其固有的不安全性，`Secure` 标记也无法提供确实的安全保障。从 `Chrome 52` 和 `Firefox 52` 开始，不安全的站点（ `http:` ）无法使用 `Cookie` 的 `Secure` 标记。

为避免跨域脚本 ( `XSS` ) 攻击，通过 `JavaScript` 的 `Document.cookie` API无法访问带有 `HttpOnly` 标记的 `Cookie`，它们只应该发送给服务端。如果包含服务端 `Session` 信息的 `Cookie` 不想被客户端 `JavaScript` 脚本调用，那么就应该为其设置 `HttpOnly` 标记。

## Cookie的作用域

`Domain`和 `Path` 标识定义了 `Cookie` 的作用域：即 `Cookie` 应该发送给哪些 `URL`。

`Domain` 标识指定了哪些主机可以接受 `Cookie`。如果不指定，默认为当前文档的主机（不包含子域名）。如果指定了 `Domain`，则一般包含子域名。

例如，如果设置 `Domain=mozilla.org`，则Cookie也包含在子域名中（如 `developer.mozilla.org` ）。

`Path` 标识指定了主机下的哪些路径可以接受 `Cookie`（该 `URL` 路径必须存在于请求 `URL` 中）。以字符 `%x2F ("/")` 作为路径分隔符，子路径也会被匹配。

例如，设置 `Path=/docs`，则以下地址都会匹配：`/docs`，`/docs/Web/`，`/docs/Web/HTTP`

## JS操作Cookie

通过 `Document.cookie` 属性可创建新的 `Cookie`，也可通过该属性访问非 `HttpOnly` 标记的 `Cookie` 。由于 `document.cookie` 属性只给出了 `cookie` 字符串，而没有给出操作 `cookie` 的方法，所以 `cookie` 的读写删需要自己写方法封装。

`JS` 设置 `cookie`：`document.cookie="age=12; expires=Thu, 26 Feb 2116 11:50:25 GMT; domain=sankuai.com; path=/";` 设置多个 `cookie`：

```javascript
document.cookie = "name=Jonh";
document.cookie = "age=12";
document.cookie = "class=111";
```

要想修改一个 `cookie`，只需要重新赋值就行，旧的值会被新的值覆盖。但要注意一点，在设置新 `cookie` 时，`path/domain` 这几个选项一定要旧 `cookie` 保持一样。否则不会修改旧值，而是添加了一个新的 `cookie`。

删除一个 `cookie` 也挺简单，也是重新赋值，只要将这个新 `cookie` 的 `expires` 选项设置为一个过去的时间点就行了。但同样要注意，`path/domain` /这几个选项一定要旧 `cookie` 保持一样。

`cookie` 其实是个字符串，但这个字符串中逗号、分号、空格被当做了特殊符号。所以当 `cookie` 的 `key` 和 `value` 中含有这3个特殊字符时，需要对其进行额外编码，一般会用 `escape` 进行编码，读取时用 `unescape` 进行解码；当然也可以用 `encodeURIComponent/decodeURIComponent` 或者 `encodeURI/decodeURI`。

## Web Storage

`Web Storage` 包含如下两种机制： 

1. `sessionStorage` ：为每一个给定的源（ `given origin` ）维持一个独立的存储区域，该存储区域在页面会话期间可用（即只要浏览器处于打开状态，包括页面重新加载和恢复）。 
2. `localStorage` ：同样的功能，但是在浏览器关闭，然后重新打开后数据仍然存在。一般我们会在用户登出后清除 `localStorage`。

这两种机制是通过 `Window.sessionStorage` 和 `Window.localStorage` 属性使用（更确切的说，在支持的浏览器中 `Window` 对象实现了 `WindowLocalStorage` 和 `WindowSessionStorage` 对象并挂在其 `localStorage` 和 `sessionStorage` 属性下）—— 调用其中任一对象会创建 `Storage` 对象，通过`Storage`对象，可以设置、获取和移除数据项。对于每个源 `（origin）sessionStorage` 和 `localStorage` 使用不同的 `Storage` 对象——独立运行和控制。

## sessionStorage

`sessionStorage` 属性允许你访问一个 `session Storage` 对象。它与 `localStorage` 相似，不同之处在于 `localStorage` 里面存储的数据没有过期时间设置，而存储在 `sessionStorage` 里面的数据在页面会话结束（`tag` 关闭）时会被清除。页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面（浏览器以外关闭下次再打开会有恢复按钮）仍会保持原来的页面会话。在新标签或窗口打开一个页面时会在顶级浏览上下文（`browsing context` 指的就是 `window`， `iframe` 或者 `tab`）中初始化一个新的会话，这点和`session cookies` 的运行方式不同。用同一个 `URL` 打开的多个 `tab` 或者 `window` 中都会创建独立的 `sessionStorage`。复制 `duplicate` 一个 `tab` 会同时复制这个 `tab` 的 `seesionStorage` 到新的 `tab` 中。关闭 `tab` 或者 `window` 会结束会话并清除 `sessionStorage` 中的对象。

我们用 `window.open` 打开的新页面如果和原页面**同源**也能继承原 `tag` 的 `sessionStorage`，注意要同源，如果协议、域名或者端口不同则不可以继承。

`sessionStorage` 的 `key` 和 `value` 都是用 `UTF-16` 的形式存储的。和对象一样，`integer` 的 `key` 会自动转换为字符串。

```javascript
// 保存数据到 sessionStorage
sessionStorage.setItem('key', 'value');

// 从 sessionStorage 获取数据
let data = sessionStorage.getItem('key');

// 从 sessionStorage 删除保存的数据
sessionStorage.removeItem('key');

// 从 sessionStorage 删除所有保存的数据
sessionStorage.clear();
```

## localStorage

只读的`localStorage` 属性允许你访问一个`Document` 源（`origin`）的对象 `Storage`；其存储的数据能在跨浏览器会话保留。`localStorage` 类似 `sessionStorage`，但其区别在于：存储在 `localStorage` 的数据可以长期保留；而当页面会话结束——也就是说，当页面被关闭时，存储在`sessionStorage`的数据会被清除 。

> `incognito` 页面，也就是隐身窗口的 `localStorage` 是不和非隐身窗口的共享的，隐身窗口中的同源页面会共享 `localStorage`，在隐身窗口中的所有 `tag` 被关闭的时候即隐身窗口关闭的时候这个隐身窗口中的所有 `localStorage` 都会销毁。

`localStorage` 的 `key` 和 `value` 都是用 `UTF-16` 的形式存储的。和对象一样，`integer` 的 `key` 会自动转换为字符串。

对于 `file:` 协议的 `URL` 没有给出 `localStorage` 的定义，所以各个浏览器的实现可能不同。我在 `Chrome` 中的测试是各个 `file:` `URL` 共享一个 `localStorage`。

```javascript
//增加了一个数据项目。
localStorage.setItem('myCat', 'Tom');

//读取 localStorage 项
let cat = localStorage.getItem('myCat');

//移除 localStorage 项
localStorage.removeItem('myCat');

// 移除所有
localStorage.clear();
```

## 参考文章

1. [聊一聊Cookie](https://segmentfault.com/a/1190000004556040 "聊一聊Cookie")