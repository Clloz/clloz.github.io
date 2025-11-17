---
title: '前端数据Mock'
publishDate: '2019-05-10 12:00:00'
description: ''
tags:
  - js
  - 实用技巧
  - 编程技巧
language: '中文'
---

## 前言

对于前后端分离的开发，两边的开发进度不同是常有的事情，对于已经开发的功能，如何快速有效地模拟接口的请求是提高开发效率的关键，下面来讲讲几种数据 `mock` 的方法。

## http-server

如果我们只是测试一段 `JS` 代码在对应数据下是否能够跑通，那么我们可以直接使用 `nodejs` 提供的静态服务器 `http-server`，将我们需要的数据保存到一个 `json` 文件中，然后通过请求获取。需要注意的是我们访问请求发起的页面的时候必须也通过静态服务器访问，否则会因为同源策略禁止访问对应文件。

```html
<!-- 前端 代码 index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>test</title>
    <link rel="stylesheet" href="test.css" />
  </head>
  <body>
    this is a test page.
    <script>
      var xhr = new XMLHttpRequest()
      xhr.open('GET', './test.json', true)
      xhr.onload = function () {
        console.log(xhr.responseText)
      }
      xhr.send()
    </script>
  </body>
</html>
```

这样的话，我们只要在 `index.html` 的同级目录下创建对应的数据 `json` 文件，就可以模拟 `GET` 请求了。当我们访问 `localhost:8080/index.html` 的时候，对应文件夹的静态资源我们都能够请求到。

## Mock.js

`mock.js` 是一个用于拦截前端 `ajax` 请求并生成随机数据响应的工具，可以用来模拟服务器响应。使用非常简单方便，不需要更改任何代码就可以直接拦截 `ajax` 请求并返回随机数据，支持多种数据类型，也支持正则表达式。

使用方法：

## npm安装

安装：`npm install mockjs`

```javascript
// 使用 Mock
var Mock = require('mockjs')
var data = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'list|1-10': [
    {
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1
    }
  ]
})
// 输出结果
console.log(JSON.stringify(data, null, 4))
```

## bower

安装：`npm install -g bower bower install --save mockjs` 使用：`<script type="text/javascript" src="./bower_components/mockjs/dist/mock.js"></script>`

或者直接在页面引入 `<script src="http://mockjs.com/dist/mock.js"></script>`

> `mock.js` 还可以用可视化工具 `ease-mock`，在线就可以添加接口和数据，使用也很方便

## 搭建后台

最好的 `mock` 数据的方法其实还是自己用 `nodejs` 写一个简单的后端来通信，这样可以自己制定各种数据，各种请求，实现起来也不是非常麻烦，接收请求，做好路由，返回数据就可以了，对于需要跨域的请求也可以更好的处理，比如：

```javascript
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

## 参考文章

1. [mock.js使用](https://segmentfault.com/a/1190000008839142 'mock.js使用')
