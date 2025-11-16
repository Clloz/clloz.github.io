---
title: 'AJAX和XMLHttpRequest对象'
publishDate: '2019-05-02 12:00:00'
description: ''
tags:
  - js
  - 编程技巧
language: '中文'
---

\[toc\]

## 前言

在 `web` 发展的早期，页面上的交互元素（比如表单的提交按钮）的工作模式是用户点击，浏览器发起请求，用户等待，服务器返回新的页面，浏览器刷新页面，如果网速比较差，那么用户需要等待很长的事件。虽然 `web` 的发展，网页上的元素越来越多，也不局限于文本，越来越多的图片出现在网页上，原来的这种点击，等待，刷新的机制让用户体验非常糟糕。顺应着这种需求，`ajax` 诞生了。

## AJAX

`AJAX` 是一种技术方案，让浏览器能够异步向服务器请求数据而不用刷新页面，`AJAX` 的核心就是浏览器的 `XMLHttpRequest` 对象，这个对象最早由微软实现，后来各大浏览器都提供了对 `XMLHttpRequest` 对象的支持。其实在 `XMLHttpRequest` 出现之前，很多开发人员就在尝试这种模式的通信了，当时都是使用一些hack的手段。`XMLHttpRequest` 对象的出现为向服务器发送 `HTTP` 请求和接收 `HTTP` 响应提供了流畅的接口，让开发人员能够方便地用异步的方法于服务器进行交互，这种异步的通信方法在2005年正式被命名为 `ajax`。正是 `ajax` 技术极大的提高了 `web` 应用的用户体验和性能，是 `web` 飞速发展的一个起点。

## XHR标准

从微软在 `IE5` 上引入 `XHR` 对象以后，其他浏览器也都增加了对 `XHR` 对象的支持，如今 `XHR` 已经有了通用的[标准](https://xhr.spec.whatwg.org/ "标准")，最新版的标准是 `XHR level 2`，`level1`的用法如下：

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', 'example.php');
xhr.send();
xhr.onreadystatechange = function(){
    if ( xhr.readyState == 4 && xhr.status == 200 ) {
        alert( xhr.responseText );
    } else {
        alert( xhr.statusText );
    }
};
```

`level1` 的主要属性如下：

- xhr.readyState：XMLHttpRequest对象的状态，等于4表示数据已经接收完毕。
- xhr.status：服务器返回的状态码，等于200表示一切正常。
- xhr.responseText：服务器返回的文本数据
- xhr.responseXML：服务器返回的XML格式的数据
- xhr.statusText：服务器返回的状态文本。

`level1` 有以下几个缺点：

- 受同源策略的限制，不能发送跨域请求；
- 不能发送二进制文件（如图片、视频、音频等），只能发送纯文本数据；
- 在发送和获取数据的过程中，无法实时获取进度信息，只能判断是否完成；

`level2` 对 `level1` 进行了改进，增加了以下特性：

- 可以发送跨域请求，在服务端允许的情况下；
- 支持发送和接收二进制数据；
- 新增formData对象，支持发送表单数据；
- 发送和获取数据时，可以获取进度信息；
- 可以设置请求的超时时间；

## XHR的使用

## 设置请求首部

`HTTP` 请求报文有很多首部信息，首部中会提供请求的许多信息，比如优先的字符集，编码等，`XHR`对象提供了让我们设置请求首部的方法 `setRequestHeader()`。

> `XMLHttpRequest.setRequestHeader(header, value)`

`setRequestHeader()` 方法有几点需要注意：

1. `setRequestHeader` 必须在 `open()` 方法之后，`send()` 方法之前调用，否则会抛错；
2. `setRequestHeader` 可以调用多次，最终的值不会采用覆盖 `override` 的方式，而是采用追加 `append` 的方式。下面是一个示例代码：
3. 并不是所有首部字段都可以设置，参照[禁止修改的首部列表](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name "禁止修改的首部列表")

```javascript
// The following script:
var client = new XMLHttpRequest();
client.open('GET', 'demo.cgi');
client.setRequestHeader('X-Test', 'one');
client.setRequestHeader('X-Test', 'two');
client.send();

// …results in the following header being sent:
// X-Test: one, two
```

## 获取Response Header

`xhr` 提供了 `2` 个用来获取响应头部的方法：`getAllResponseHeaders()` 和 `getResponseHeader()`。前者是获取 `response` 中的所有 `header` 字段，后者只是获取某个指定 `header` 字段的值。另外`getResponseHeader(header)` 的 `header` 参数不区分大小写。

> `var headers = XMLHttpRequest.getAllResponseHeaders();` `var myHeader = XMLHttpRequest.getResponseHeader(headerName);` 这两个方法对于获取 `Response Header` 还是有一定的限制：

1. 无法获取 `response` 中的 `Set-Cookie`、`Set-Cookie2` 这2个字段，无论是同域还是跨域请求；
2. 对于跨域请求，客户端允许获取的 `response header` 字段只限于 `simple response header` 和 `Access-Control-Expose-Headers`

> `simple response header` 包括的 header 字段有：`Cache-Control`,`Content-Language`,`Content-Type`,`Expires`,`Last-Modified`,`Pragma`; `Access-Control-Expose-Headers`：首先得注意是 `Access-Control-Expose-Headers` 进行跨域请求时响应头部中的一个字段，对于同域请求，响应头部是没有这个字段的。这个字段中列举的 header 字段就是服务器允许暴露给客户端访问的字段。

## 重写响应的 MIME 类型

##### MIME 类型

媒体类型（通常称为 `Multipurpose Internet Mail Extensions` 或 `MIME` 类型 ）是一种标准，用来表示文档、文件或字节流的性质和格式。它在 `IETF RFC 6838` 中进行了定义和标准化。详见\[MDN\](媒体类型（通常称为 Multipurpose Internet Mail Extensions 或 MIME 类型 ）是一种标准，用来表示文档、文件或字节流的性质和格式。它在IETF RFC 6838中进行了定义和标准化。 "MDN")

| 类型 | 描述 | 典型示例 |
| --- | --- | --- |
| text | 表明文件是普通文本，理论上是人类可读 | text/plain, text/html, text/css, text/javascript |
| image | 表明是某种图像。不包括视频，但是动态图（比如动态gif）也使用image类型 | image/gif, image/png, image/jpeg, image/bmp, image/webp, image/x-icon, image/vnd.microsoft.icon |
| audio | 表明是某种音频文件 | audio/midi, audio/mpeg, audio/webm, audio/ogg, audio/wav |
| video | 表明是某种视频文件 | video/webm, video/ogg |
| application | 表明是某种二进制数据 | application/octet-stream, application/pkcs12, application/vnd.mspowerpoint, application/xhtml+xml, application/xml, application/pdf |

> 浏览器通常使用 `MIME` 类型（而不是文件扩展名）来确定如何处理 `URL`，因此 `Web` 服务器在响应头中添加正确的 `MIME` 类型非常重要。如果配置不正确，浏览器可能会曲解文件内容，网站将无法正常工作，并且下载的文件也会被错误处理。

对于服务器返回的内容，可能由于响应报文中的 `content-type` 和实际内容不符而导致浏览器对数据的处理出现问题，有时候需要告诉浏览器返回的内容按什么媒体类型处理。XHR给出的方法有两个： `xhr.overrideMimeType()` 方法和 `xhr.responseType` 属性。

##### xhr.overrideMimeType()

`XMLHttpRequest` 的 `overrideMimeType` 方法是指定一个 `MIME` 类型用于替代服务器指定的类型，使服务端响应信息中传输的数据按照该指定 `MIME` 类型处理。例如强制使流方式处理为 `text/xml` 类型处理时会被使用到，即使服务器在响应头中并没有这样指定。此方法必须在 `send` 方法之前调用方为有效。

如果服务器没有指定一个 `Content-Type` 头, `XMLHttpRequest` 默认MIME类型为 `text/xml` . 如果接受的数据不是有效的 `XML`，将会出现格”格式不正确“的错误。你能够通过调用 `overrideMimeType()`指定各种类型来避免这种情况。

```javascript
req = new XMLHttpRequest();
req.overrideMimeType("text/plain");
req.addEventListener("load", callback, false);
req.open("get", url);
req.send();
```

##### xhr.responseType

`XMLHttpRequest.responseType` 属性是一个枚举类型的属性，返回响应数据的类型。它允许我们手动的设置返回数据的类型。如果我们将它设置为一个空字符串，它将使用默认的 `text` 类型。

当将 `responseType` 设置为一个特定的类型时，你需要确保服务器所返回的类型和你所设置的返回值类型是兼容的。那么如果两者类型不兼容,服务器返回的数据会变成 `null`，即使服务器返回了数据。还有一个要注意的是，给一个同步请求设置 `responseType` 会抛出一个 `InvalidAccessError` 的异常。

`responseType`支持以下几种类型：

| 值 | 描述 |
| --- | --- |
| "" | 将 responseType 设为空字符串与设置为"text"相同， 是默认类型 （实际上是 DOMString）。 |
| "arraybuffer" | response 是一个包含二进制数据的 JavaScript ArrayBuffer 。 |
| "blob" | response 是一个包含二进制数据的 Blob 对象 。 |
| "document" | response 是一个 HTML Document 或 XML XMLDocument ，这取决于接收到的数据的 MIME |类型。请参阅 HTML in XMLHttpRequest 以了解使用 XHR 获取 HTML 内容的更多信息。 |
| "json" | response 是一个 JavaScript 对象。这个对象是通过将接收到的数据类型视为 JSON 解析得到的。 |
| "text" | response 是包含在 DOMString 对象中的文本。 |

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
//可以将`xhr.responseType`设置为`"blob"`也可以设置为`" arrayBuffer"`
//xhr.responseType = 'arrayBuffer';
xhr.responseType = 'blob';

xhr.onload = function(e) {
  if (this.status == 200) {
    var blob = this.response;
    ...
  }
};

xhr.send();
```

## 获取 Response 数据

`xhr` 提供了3个属性来获取请求返回的数据，分别是：`xhr.response`、`xhr.responseText`、`xhr.responseXML`。

- `xhr.response`
  
    - 默认值：空字符串 `""`
      
    - 当请求完成时，此属性才有正确的值
      
    - 请求未完成时，此属性的值可能是 `""` 或者 `null`，具体与 `xhr.responseType` 有关：当 `responseType` 为`""`或 `text` 时，值为`""`；`responseType` 为其他值时，值为 `null`
    
- `xhr.responseText`
  
    - 默认值为空字符串`""`
      
    - 只有当 `responseType` 为 `text`、`""` 时，`xhr` 对象上才有此属性，此时才能调用 `xhr.responseText`，否则抛错
      
    - 只有当请求成功时，才能拿到正确值。以下2种情况下值都为空字符串 `""`：请求未完成、请求失败
    
- `xhr.responseXML`
  
    - 默认值为 `null`
      
    - 只有当 `responseType` 为 `text`、`""`、`document` 时，`xhr` 对象上才有此属性，此时才能调用 `xhr.responseXML`，否则抛错
      
    - 只有当请求成功且返回数据被正确解析时，才能拿到正确值。以下3种情况下值都为 `null` ：请求未完成、请求失败、请求成功但返回数据无法被正确解析时
      

## 获取请求状态

用 `xhr.readyState` 这个属性可以获取当前请求的状态。这个属性是只读属性，总共有5种可能值，分别对应 `xhr` 不同的不同阶段。每次 `xhr.readyState` 的值发生变化时，都会触发 `xhr.onreadystatechange` 事件，我们可以在这个事件中进行相关状态判断。

| 值 | 状态 | 描述 |
| --- | --- | --- |
| 0 | UNSENT (初始状态，未打开) | 此时xhr对象被成功构造，open()方法还未被调用 |
| 1 | OPENED (已打开，未发送) | open()方法已被成功调用，send()方法还未被调用。注意：只有xhr处于OPENED状态，才能调用xhr.setRequestHeader()和xhr.send(),否则会报错 |
| 2 | HEADERS\_RECEIVED (已获取响应头) | send()方法已经被调用, 响应头和响应状态已经返回 |
| 3 | LOADING (正在下载响应体) | 响应体(response entity body)正在下载中，此状态下通过xhr.response可能已经有了响应数据 |
| 4 | DONE (整个数据传输过程结束) | 整个数据传输过程结束，不管本次请求是成功还是失败 |

```javascript
  xhr.onreadystatechange = function () {
    switch(xhr.readyState){
      case 1://OPENED
        //do something
            break;
      case 2://HEADERS_RECEIVED
        //do something
        break;
      case 3://LOADING
        //do something
        break;
      case 4://DONE
        //do something
        break;
    }
```

## 设置请求超时时间

如果请求过了很久还没有成功，为了不会白白占用的网络资源，我们一般会主动终止请求。 `XMLHttpRequest` 提供了 `timeout` 属性来允许设置请求的超时时间。

`XMLHttpRequest.timeout` 是一个无符号长整型数，代表着一个请求在被自动终止前所消耗的毫秒数。默认值为 `0`，意味着没有超时。超时并不应该用在一个 同步 `XMLHttpRequests` 请求中，否则将会抛出一个 `InvalidAccessError` 类型的错误。当超时发生，`timeout` 事件将会被触发。

`xhr.onloadstart` 事件触发的时候开始计时，也就是你调用 `xhr.send()` 方法的时候。

> 可以在 `send()` 之后再设置此 `xhr.timeout`，但计时起始点仍为调用 `xhr.send()` 方法的时刻。

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', '/server', true);

xhr.timeout = 2000; // 超时时间，单位是毫秒

xhr.onload = function () {
  // 请求完成。在此进行处理。
};

xhr.ontimeout = function (e) {
  // XMLHttpRequest 超时。在此做某事。
};

xhr.send(null);
```

## 同步请求

`xhr` 默认发的是异步请求，但也支持发同步请求（当然实际开发中应该尽量避免使用）。到底是异步还是同步请求，由 `xhr.open()` 传入的 `async` 参数决定。

> `open(method, url [, async = true [, username = null [, password = null]]])`

- `method` : 请求的方式，如 `GET/POST/HEADER` 等，这个参数不区分大小写;
  
- `url` : 请求的地址，可以是相对地址如 `example.php`，这个相对是相对于当前网页的 `url` 路径；也可以是绝对地址如 `http://www.example.com/example.php`
  
- `async` : 默认值为 `true`，即为异步请求，若 `async=false`，则为同步请求.
  

当 `xhr` 为同步请求时，有如下限制：

- `xhr.timeout`必须为 `0`
- `xhr.withCredentials` 必须为 `false`
- `xhr.responseType`必须为 `""`（注意置为 `text` 也不允许）

> 在 chrome中，当 `xhr` 为同步请求时，在 `xhr.readyState` 由 `2` 变成 `3` 时，并不会触发 `onreadystatechange` 事件，`xhr.upload.onprogress` 和 `xhr.onprogress` 事件也不会触发。

## 获取上传、下载的进度

我们可以通过 `onprogress` 事件来实时显示进度，默认情况下这个事件每 `50ms` 触发一次。需要注意的是，上传过程和下载过程触发的是不同对象的 `onprogress` 事件：

- 上传触发的是 `xhr.upload` 对象的 `onprogress` 事件
- 下载触发的是 `xhr` 对象的 `onprogress` 事件

```javascript
xhr.onprogress = updateProgress;
xhr.upload.onprogress = updateProgress;
function updateProgress(event) {
    if (event.lengthComputable) {
      var completedPercent = event.loaded / event.total;
    }
 }
```

## 发送的数据类型

`xhr.send(data)` 的参数 `data` 可以是以下几种类型：

- `ArrayBuffer`
- `Blob`
- `Document`
- `DOMString`
- `FormData`
- `null`

如果是 `GET/HEAD` 请求，`send()` 方法一般不传参或传 `null`。不过即使你真传入了参数，参数也最终被忽略，`xhr.send(data)` 中的 `data` 会被置为 `null`.

`xhr.send(data)` 中 `data` 参数的数据类型会影响请求头部 `content-type` 的默认值：

- 如果 `data` 是 `Document` 类型，同时也是 `HTML Document` 类型，则 `content-type` 默认值为`text/html;charset=UTF-8;` 否则为 `application/xml;charset=UTF-8`；
- 如果 `data` 是 `DOMString` 类型，`content-type` 默认值为 `text/plain;charset=UTF-8`；
- 如果 `data` 是 `FormData` 类型，`content-type` 默认值为 `multipart/form-data; boundary=[xxx]`
- 如果 `data` 是其他类型，则不会设置 `content-type` 的默认值

当然这些只是 `content-type` 的默认值，但如果用 `xhr.setRequestHeader()` 手动设置了中 `content-type` 的值，以上默认值就会被覆盖。

## FormData 对象

`ajax` 操作往往用来传递表单数据。为了方便表单处理，`HTML 5` 新增了一个 `FormData` 对象，可以模拟表单。

```javascript
var formData = new FormData();
formData.append('username', '张三');
formData.append('id', 123456);
xhr.send(formData);

//FormData对象也可以用来获取网页表单的值。
var form = document.getElementById('myform');
var formData = new FormData(form);
formData.append('secret', '123456'); // 添加一个表单项
xhr.open('POST', form.action);
xhr.send(formData);
```

## 上传文件

假定 `files` 是一个"选择文件"的表单元素（ `input[type="file"]` ），我们将它装入 `FormData`对象。

```javascript
var formData = new FormData();
for (var i = 0; i < files.length;i++) {
    formData.append('files[]', files[i]);
}
xhr.send(formData);
```

## xhr.withCredentials

我们都知道，在发同域请求时，浏览器会将 `cookie` 自动加在 `request header` 中。但大家是否遇到过这样的场景：在发送跨域请求时，`cookie` 并没有自动加在 `request header` 中。

造成这个问题的原因是：在 `CORS` 标准中做了规定，默认情况下，浏览器在发送跨域请求时，不能发送任何认证信息（ `credentials` ）如 `cookies` 和 `HTTP authentication schemes`。除非 `xhr.withCredentials` 为 `true`（ `xhr`对象有一个属性叫 `withCredentials`，默认值为 `false` ）。

所以根本原因是 `cookies` 也是一种认证信息，在跨域请求中，`client` 端必须手动设置 `xhr.withCredentials=true`，且 `server` 端也必须允许request能携带认证信息（即 `response header` 中包含 `Access-Control-Allow-Credentials:true` ），这样浏览器才会自动将 `cookie` 加在 `request header` 中。

另外，要特别注意一点，一旦跨域 `request` 能够携带认证信息，`server` 端一定不能将 `Access-Control-Allow-Origin` 设置为 `*`，而必须设置为请求页面的域名。

## XMLHttpRequest 事件

`XMLHttpRequestEventTarget` 接口定义了7个事件：

- `onloadstart`：获取开始
- `onprogress`：数据传输进行中
- `onabort`：获取操作终止
- `ontimeout`：获取操作在用户规定时间内未完成
- `onerror`：获取失败
- `onload`：获取成功
- `onloadend`：获取完成（不论成功与否）

> 1. 每一个 `XMLHttpRequest` 里面都有一个 `upload` 属性，而 `upload` 是一个`XMLHttpRequestUpload` (表示上传进度）对象
> 2. `XMLHttpRequest` 和 `XMLHttpRequestUpload` 都继承了同一个 `XMLHttpRequestEventTarget` 接口，所以 `xhr` 和 `xhr.upload` 都有第一条列举的7个事件
> 3. `onreadystatechange` 是 `XMLHttpRequest` 独有的事件

| 事件 | 触发条件 |
| --- | --- |
| `onreadystatechange` | 每当`xhr.readyState`改变时触发；但`xhr.readyState`由非0值变为0时不触发。 |
| `onloadstart` | 调用`xhr.send()`方法后立即触发，若`xhr.send()`未被调用则不会触发此事件。 |
| `onprogress` | `xhr.upload.onprogress`在上传阶段(即`xhr.send()`之后，`xhr.readystate=2`之前)触发，每50ms触发一次；`xhr.onprogress`在下载阶段（即`xhr.readystate=3`时）触发，每`50ms`触发一次。 |
| `onload` | 当请求成功完成时触发，此时`xhr.readystate=4` |
| `onloadend` | 当请求结束（包括请求成功和请求失败）时触发 |
| `onabort` | 当调用`xhr.abort()`后触发 |
| `ontimeout` | `xhr.timeout`不等于0，由请求开始即`onloadstart`开始算起，当到达`xhr.timeout`所设置时间请求还未结束即onloadend，则触发此事件。 |
| `onerror` | 在请求过程中，若发生`Network error`则会触发此事件（若发生`Network error`时，上传还没有结束，则会先触发`xhr.upload.onerror`，再触发`xhr.onerror`；若发生`Network error`时，上传已经结束，则只会触发`xhr.onerror`）。注意，只有发生了网络层级别的异常才会触发此事件，对于应用层级别的异常，如响应返回的`xhr.status`是`4xx`时，并不属于`Network error`，所以不会触发`onerror`事件，而是会触发`onload`事件。 |

## 事件触发顺序

1. 触发 `xhr.onreadystatechange` (之后每次 `readyState变化` 时，都会触发一次)
2. 触发 `xhr.onloadstart` //上传阶段开始：
3. 触发 `xhr.upload.onloadstart`
4. 触发 `xhr.upload.onprogress`
5. 触发 `xhr.upload.onload`
6. 触发 `xhr.upload.onloadend` //上传结束，下载阶段开始：
7. 触发 `xhr.onprogress`
8. 触发 `xhr.onload`
9. 触发 `xhr.onloadend`

## 异常处理

在请求的过程中，有可能发生 `abort/timeout/error` 这3种异常。

1. 一旦发生 `abort` 或 `timeout` 或 `error` 异常，先立即中止当前请求
2. 将 `readystate` 置为 `4`，并触发 `xhr.onreadystatechange` 事件
3. 如果上传阶段还没有结束，则依次触发以下事件：
   
    - `xhr.upload.onprogress`
    - `xhr.upload.[onabort或ontimeout或onerror]`
    - `xhr.upload.onloadend`
4. 触发 `xhr.onprogress` 事件
5. 触发 `xhr.[onabort或ontimeout或onerror]` 事件
6. 触发 `xhr.onloadend` 事件

## 参考文章

1. [你真的会使用XMLHttpRequest吗？](https://segmentfault.com/a/1190000004322487 "你真的会使用XMLHttpRequest吗？")
2. [XMLHttpRequest Living Standard](https://xhr.spec.whatwg.org/#dom-xmlhttprequest-overridemimetype "XMLHttpRequest Living Standard ")
3. [XMLHttpRequest Level 2 使用指南](https://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html "XMLHttpRequest Level 2 使用指南")
4. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest "MDN")