---
title: 'token 机制和实现方式'
publishDate: '2020-12-14 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
  - 项目实现
language: '中文'
heroImage: {"src":"./javascript-logo.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

之前在面试的时候被问到过刷新 `token` 的问题，其实我对 `token` 验证机制的细节一直不清楚。新项目和后端的同学商量后使用刷新 `token` 来实现。本文主要分享一下对 `token` 机制的理解和实现方式。

## 登录验证的方式

登录验证一般来说有两个目的，一个是为了安全，一个是为了用户方便。因为 `HTTP` 是无状态的，所以后端在接受到请求之后并不能知道请求是从哪里来的，但是很多时候我们有验证用户身份的需求，同时前端又有保存用户登录状态的需求。而如果将用户信息保存在前端，必然是非常危险的，很容易被获取，所以就有了在后端进行非对称加密的方式来实现登录的验证和保存。

目前主要的登录验证方式有 `cookie + session`，`token`，单点登录和 `OAuth 第三方登录`。本文我们主要讲一讲 `token` 登录验证。

## 什么是 token

`token` 直译就是令牌的意思，其实就是后端将用户信息进行非对称加密，然后将加密后的内容保存在前端，当发送请求的时候带上这个令牌来实现身份验证。大致的过程是第一次登录用户输入用户名和密码，服务器验证无误后会对用户的信息进行非对称加密生成一个令牌返回给前端，前端可以存入 `cookie` 或者 `localStorage` 等，以后每次发送请求带上这个令牌，后端通过对令牌的验证来识别用户的身份以及请求的合法性。

`token` 的优点是服务端不需要保存 `token`，只需要验证前端传过来的 `token` 即可，所以几遍是分布式部署也可以使用这种方式。`token` 的缺点就是，由于服务器不保存 `session` 状态，因此无法在使用过程中废止某个 `token`，或者更改 `token` 的权限。也就是说，一旦 `token` 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。

目前比较常用的 `token` 加密方式是 `JWT JSON Web Token`，关于 `JWT` 可以参考阮一峰老师的 [JSON Web Token 入门教程](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html "JSON Web Token 入门教程")

## token 刷新

按照上面的 `token` 逻辑，前端只要保存一个后端传过来的 `token`，每次请求附上即可。当令牌过期有两种选择，我们可以让用户冲洗你登录，或者后端生成一个新的令牌，前端保存新的令牌并重新发送请求。但是这两种方式都有问题，如果让用户重新登录，用户体验不是很好，频繁的重新登录并不是一种比较好的交互方式。而如果自动生成新的令牌则会出现安全问题，比如黑客获取了一个过期的令牌并向后端发送请求，则也可以获得一个更新的令牌。

为了权衡上面的问题，产生了一种刷新 `token` 的机制，当用户第一次登录成功，后端会返回两个 `token`，一个 `accessToken` 用来进行请求，也就是我们每次请求都附上 `accessToken`，而 `refreshToken` 则是用来在 `accessToken` 过期的时候进行 `accessToken` 的刷新。一般来说，`accessToken` 由于每次请求都会附上，所以安全风险比较高，所以过期时间较短，而 `refreshToken` 则只有在 `accessToken` 过期的时候才会发送到后端，所以安全风险相对较低，所以过期时间可以长一点。

当我们的 `accessToken` 过期之后，我们会向后端的 `token` 刷新接口请求并传入 `refreshToken`，后端验证梅雨问题之后会给我们一个新的 `accessToken`，我们保存后就可以保证访问的连续性。当然，这也并非绝对安全的，只是一种相对安全一点的做法。一般我们将两个 `token` 保存在 `localStorage` 中。

## 刷新 token 的实现

在项目中我主要使用的是 `axios`，所以 `token` 的刷新以及请求附带 `token` 都是使用的 `axios` 的拦截器完成的。这其中需要注意的地方有三点：

1. 不要重复刷新 `token`，即一个请求已经刷新 `token` 了，此时可能新的 `token` 还没有回来，其他请求不应该重复刷新。
2. 当新的 `token` 还没有回来的时候，其他的请求应该进行暂存，等新的 `token` 回来以后再一次进行请求。
3. 如果请求是由登录页面或者请求本身就是刷新 `token` 的请求则不需要拦截，否则会陷入死循环。

第一个问题用一个 `Boolean` 字段加锁即可，第二个问题将请求新 `token` 过程中发起的请求用状态为 `pendding` 的 `Promise` 进行暂存，放到一个数组中，当新的 `token` 回来的时候依次 `resolve` 每一个 `pendding` 的 `Promise` 即可。具体的代码细节我直接贴上项目上的源码：

```javascript
import axios, * as AxiosInterface from 'axios';

// Token 接口，访问 token，刷新 token 和过期时
const instance = axios.create({
    // baseURL: ''
    timeout: 300000,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

async function refreshAccessToken(): Promise<AxiosInterface.AxiosResponse<AxiosData>> {
    return await instance.post('api/refreshtoken');
}

let isRefreshing = false;
let requests: Array<Function> = []; // 若在 token 刷新过程中进来多个请求则存入 requests 中
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 设置请求拦截器，若 token 过期则刷新 token
axios.interceptors.request.use(config => {
    const tokenObj = JSON.parse(window.localStorage.getItem('token') as string);
    if (config.url === 'api/login' || config.url === 'api/refreshtoken') return config;
    let accessToken = tokenObj.accessToken;
    let expireTime = tokenObj.expireTime;
    const refreshToken = tokenObj.refreshToken;

    config.headers.Authorization = accessToken;

    let time = Date.now();
    console.log(time, expireTime);
    if (time > expireTime) {
        if (!isRefreshing) {
            isRefreshing = true;
            refreshAccessToken()
                .then(res => {
                    ({ accessToken, expireTime } = res.data.data);
                    time = Date.now();
                    const tokenStorage = {
                        accessToken,
                        refreshToken,
                        expireTime: Number(time) + Number(expireTime),
                    };
                    window.localStorage.setItem('token', JSON.stringify(tokenStorage));
                    isRefreshing = false;
                    return accessToken;
                })
                .then((accessToken: string) => {
                    requests.forEach(cb => {
                        cb(accessToken);
                    });
                    requests = [];
                })
                .catch((err: string) => {
                    throw new Error(`refresh token error: ${err}`);
                });
        }

        // 如果是在刷新 token 时进行的请求则暂存在 requests 数组中，这里需要使用一个 pendding 的 Promise 来确保拦截的成功
        const parallelRequest: Promise<AxiosInterface.AxiosRequestConfig> = new Promise(resolve => {
            requests.push((accessToken: string) => {
                config.headers.Authorization = accessToken;
                console.log(accessToken + Math.random() * 1000);
                resolve(config);
            });
        });

        return parallelRequest;
    }

    return config;
});

export default (vue: Function) => {
    vue.prototype.$http = axios;
};
```

## 总结

以上就是我对刷新 `token` 的实现，如果有什么错误之处欢迎指正交流。

## 参考文章

1. [JSON Web Token 入门教程](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html "JSON Web Token 入门教程")
2. [解决使用jwt刷新token带来的问题](https://segmentfault.com/a/1190000013151506 "解决使用jwt刷新token带来的问题")
3. [axios如何利用promise无痛刷新token（二）](https://juejin.cn/post/6844903993274007565#comment "axios如何利用promise无痛刷新token（二）")
4. [axios如何利用promise无痛刷新token](https://juejin.cn/post/6844903925078818829#heading-13 "axios如何利用promise无痛刷新token")