---
title: 'Vue-Cli + TypeScript 项目搭建笔记'
publishDate: '2020-12-14 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: {"src":"./typescript.jpeg","color":"#B4C6DA"}
---

\[toc\]

## 前言

在新公司的新项目我决定直接上 `TypeScript`，反正总归是要学的，想到就立马去做。，`Vue` 和 `TypeScript` 我都是第一次在项目中使用，万事开头难，配置环境就是一个问题，所以我用一篇文章把我遇到的一些问题记录下来。

## TypeScript 在 Vue-Cli

其实 `Vue-Cli` 已经能够自动化帮我们配置很多东西，不过我个人不太喜欢自动化的东西，没什么安全感。一方面是出了 `bug` 你不知道是哪里的问题，另一方面换个环境你可能又得来一遍，所以我觉得还是要把原理掌握住。

不过 `Vue-Cli` 的内容我们放到别的文章去讨论，因为可能篇幅也会比较长，这里我们主要讨论 `TypeScript` 和 `Vue-Cli` 的结合配置。

对于 `TypeScript` 我们需要理解它并不是一个执行的语言，我们写的 `TypeScript` 最终还是把 `TypeScript` 的语法去掉，变成 `JavaScript` 去执行。`TypeScript` 的作用只是让我们在编写代码的时候让 `IDE` 和其他一些工具比如 `Webpack` 来进行类型检查等。

在 `Vue-Cli` 中如果在创建项目的时候选择了 `TypeScript`支持，那么生成的项目中会有默认的 `TS` 支持。比如有 `tsconfig.json`，在 `src` 目录下有两个 `TS` 的声明文件 `shims.vue.d.ts` 和 `shims.jsx.d.ts`。此时我们已经可以进行 `TS` 的编码了。

## @babel/preset-typescript

`Vue-Cli` 默认使用的是 `ts-loader` 作为处理 `ts` 和 `tsx` 的工具，`ts-loader` 的问题就是在进行生产环境打包，也就是 `npm run build` 的时候会非常慢，一个解决办法就是用 `@babel/preset-typescript` 来替换 `ts-loader`。`@babel/preset-typescript` 这个预设其实只包含一个插件 `@babel/plugin-transform-typescript`，它的作用就是把代码中所有的 `typescript` 语法全部去掉，所以打包非常快。

使用了这个 `preset` 之后，虽然打包速度变快了，但是我们无法在打包的时候对 `ts` 进行类型检查，`ts-loader` 则会在打包的时候进行类型检查，所以使用这个预设我们需要配合 `eslint` 来进行类型检查，或者依靠 `tsc --watch` 来进行检测。

使用 `@babel/plugin-transform-typescript` 我们需要先去掉 `Vue-Cli` 中的 `Webpack` 中的 `ts-loader` 的配置。方法也很简单，在 `vue.config.js` 中配置 `chainWebpack` 即可：

```javascript
chainWebpack: config => {
        config.module.rule('ts').uses.delete('ts-loader');
        config.module.rule('tsx').uses.delete('ts-loader');
    },
```

然后我们需要安装 `@babel/preset-typescript`，并在 `babel.config.js` 中配置即可。通常来说我们这样配置就可以正常进行 `ts` 的打包了，但是在 `Vue-Cli` 的环境中，一直报错。最后我发现只有直接配置 `@babel/plugin-transform-typescript` 插件才可以，没有找到是什么原因。替换成功后我们会发现打包速度提高非常多。

> 特别注意一点，不用混用 `ts-loader` 和 `preset-typescript`，否则可能会出现一些意想不到的错误。

## Eslint

替换了 `ts-loader` 后我们需要用 `eslint` 来进行 `TS` 的类型检查，配合 `IDE` 使用时比较方便的（也可以使用 `tsc --watch`）。主要安装的就是 `typescript`，`@typescript-eslint/parser` 和 `@typescript-eslint/eslint-plugin` 这三个包，我们需要将 `eslint` 的 `parserOptions` 中的 `parser` 设置为 `@typescript-eslint/parser`，在没有用 `typescript` 之前我们一般使用的是 `babel-eslint`。`plugins` 中需要加上 `@typescript-eslint`，`extends` 中则是使用 `@typescript-eslint/recommended`。

对安装的几个包进行一下解释：

1. `@typescript-eslint/parser` 主要的作用是让 `eslint` 用我们安装的这个解析器作为 `parser` 对代码进行解析，只有这样 `eslint` 才能明白 `typescript` 的语法，从而对我们的代码进行检查，否则我们的代码则会被当做普通的 `JavaScript` 进行检查。
2. `@typescript-eslint/eslint-plugin` 则是一套规则，注意插件中的规则并没有进行配置，只是提供，我们需要在 `rules` 中配置对应的规则才能让 `eslint` 对该条规则进行检查，或者我们使用插件提供的 `extends`。
3. `@typescript-eslint/recommended` 是 `@typescript-eslint/eslint-plugin` 提供的一套推荐规则，我们不需要对规则进行一条一条的配置，只需要将推荐规则中不符合开发需求的进行修改即可。`eslint` 的多个 `extends` 后面的应该会覆盖前面的配置。如果像使用 `airbnb` 的配置则可以安装 `eslint-config-airbnb-typescript`，然后替换 `plugin:@typescript-eslint/eslint-plugin` 即可，我的测试下使用 `airbnb` 需要单独配置一些规则，比如 `indent`，目前我还是使用 `typescript-eslint` 的官方推荐 `extend`。

有些规则我们可能需要关闭 `eslint` 中的规则，然后开启 `typescript-eslint` 中的同名规则，比如 `no-unused-vars`。

## 声明文件

对于 `src` 中的声明文件，我们直接可以使用，因为 `Vue-Cli` 生成的 `tsconfig.json` 已经为我们配置了 `src` 文件夹，如果我们需要在其他地方添加声明文件，比如我在用来进行 `mock` 数据的 `mock` 文件夹中的声明文件就需要自己在 `tsconfig.json` 中进行配置。在 `includes` 字段的数组中添加形如 `"mock/**/*.ts"` 这样的配置。

如果我们使用了一些第三方包，并且第三方包不是用 `ts` 实现的（也就是包中没有声明文件），那么我们需要额外引入声明文件，比如 `mockjs`。一般来说大多数常用的包都有现成的声明文件，安装方式为 `npm i -D @type/xxx`。如果这个第三方包没有对应的声明文件，那么就需要自己编写，具体可以参考 [声明文件 - typescript 入门教程](https://ts.xcatliu.com/basics/declaration-files.html#npm-%E5%8C%85 "声明文件 - typescript 入门教程")。

有一些第三方的包自己在包根目录提供了 `index.d.ts` 声明文件，我们在使用 `TS` 的时候默认 `import` 的就是这个文件，比如 `axios`：

```javascript
export interface AxiosTransformer {
  (data: any, headers?: any): any;
}

export interface AxiosAdapter {
  (config: AxiosRequestConfig): AxiosPromise<any>;
}

export interface AxiosBasicCredentials {
  username: string;
  password: string;
}

export interface AxiosProxyConfig {
  host: string;
  port: number;
  auth?: {
    username: string;
    password:string;
  };
  protocol?: string;
}

export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK'

export type ResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream'

export interface AxiosRequestConfig {
  url?: string;
  method?: Method;
  baseURL?: string;
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
  headers?: any;
  params?: any;
  paramsSerializer?: (params: any) => string;
  data?: any;
  timeout?: number;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  adapter?: AxiosAdapter;
  auth?: AxiosBasicCredentials;
  responseType?: ResponseType;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  maxRedirects?: number;
  socketPath?: string | null;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: AxiosProxyConfig | false;
  cancelToken?: CancelToken;
  decompress?: boolean;
}

export interface AxiosResponse<T = any>  {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}

export interface AxiosError<T = any> extends Error {
  config: AxiosRequestConfig;
  code?: string;
  request?: any;
  response?: AxiosResponse<T>;
  isAxiosError: boolean;
  toJSON: () => object;
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {
}

export interface CancelStatic {
  new (message?: string): Cancel;
}

export interface Cancel {
  message: string;
}

export interface Canceler {
  (message?: string): void;
}

export interface CancelTokenStatic {
  new (executor: (cancel: Canceler) => void): CancelToken;
  source(): CancelTokenSource;
}

export interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;
  throwIfRequested(): void;
}

export interface CancelTokenSource {
  token: CancelToken;
  cancel: Canceler;
}

export interface AxiosInterceptorManager<V> {
  use(onFulfilled?: (value: V) => V | Promise<V>, onRejected?: (error: any) => any): number;
  eject(id: number): void;
}

export interface AxiosInstance {
  (config: AxiosRequestConfig): AxiosPromise;
  (url: string, config?: AxiosRequestConfig): AxiosPromise;
  defaults: AxiosRequestConfig;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  getUri(config?: AxiosRequestConfig): string;
  request<T = any, R = AxiosResponse<T>> (config: AxiosRequestConfig): Promise<R>;
  get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
  delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
  head<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
  options<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
  post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
  put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
  patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance;
  Cancel: CancelStatic;
  CancelToken: CancelTokenStatic;
  isCancel(value: any): boolean;
  all<T>(values: (T | Promise<T>)[]): Promise<T[]>;
  spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R;
}

declare const Axios: AxiosStatic;

export default Axios;
```

我们可以看到除了 `default` 的 `Axios` 还有许多`type` 和 `interface`，由于 `default` 中没有输出这些接口和类型，所以如果我们要在代码中使用这些接口和类型，需要单独引入。比如我在处理刷新 `token` 的时候对 `request` 拦截器进行了稍微复杂一点的封装，在返回的 `promise` 泛型中需要指定 `AxiosRequestConfig` 类型，这里就必须单独引入，否则会报 `ts2304` 的错：`can not find name AxiosRequestConfig`。如果要引入多个 `type` 和 `interface` 则可以用 `* as AxiosInterface` 来进行一个全部导入，然后在需要进行类型指定的地方使用 `AxiosInterface.AxiosRequestConfig` 即可。

## 一些小问题

在项目的开发过程中还遇到一些小问题，这里进行一下整理：

1. 使用动态 `import` 并且 `impport` 的参数是一个变量的话，webpack 和 typescript 都会有警告
2. 要熟悉内置对象，比如 `Element`，`MouseEvent` 等，特别是和 `DOM` 相关的对象，本身没那么熟悉并且数量比较多
3. 对于获取 `DOM` 对象，由于都有可能存在取不到即值为 `null` 的情况，所以一般来说会报错，这种情况下我们可以对取的元素进行判断是否为 `null`，或者在我们确定我们一定能取到元素的情况下可以使用类似 `element!.getAttribute('name')` 这样的语法，用感叹号来进行 `non-null assertion`。
4. 修改 element ui 的样式可以通过在组件的根元素上添加一个类名，然后通过不带 `scoped` 的 `style` 来写样式即可，这样即可以覆盖 `element ui` 的样式，也不会对全局产生污染。

## 多页应用开发配置

`Vue-Cli` 的默认是单页应用的配置，如果你要开发多页应用配置也很简单，在 `vue.config.js` 中增加一个 `pages` 配置即可，不过为了方便我们应该进行动态的配置，用 `glob` 动态解析 `pages` 文件夹中的目录生成 `pages` 字段，这里我直接放上我的代码：

```javascript
const glob = require('glob'); // eslint-disable-line
const path = require('path'); // eslint-disable-line

function resolve(dir) {
    return path.join(__dirname, dir);
}

// 自动化多页面配置，glob 检测 pages 文件夹
function getEntry(url) {
    const entrys = {};
    glob.sync(url).forEach(item => {
        const match = item.match(/src\/pages\/(.*)\/index\.html/);
        const pageName = match && match[1];
        entrys[pageName] = {
            entry: `src/pages/${pageName}/index.ts`,
            template: `src/pages/${pageName}/index.html`,
            filename: `${pageName}.html`,
            title: `${pageName}`,
        };
    });
    return entrys;
}

const pages = getEntry('./src/pages/*/index.html');
```

多页应用还有一个注意点就是一些全局变量的配置，因为单页应用我们所有的组件共享一个父级的 `Vue` 实例，所以我们可以在 `index.js` 中将全局对象挂载到这个 `Vue` 实例上，但是对于多页应用我们每个页面的 `Vue` 实例是不同的，所以不能这样挂载。我的策略是将全局对象的挂载写成一个函数，接受一个 `Vue` 实例作为参数，在函数执行的时候我们就会将对应的属性或者方法挂载到该 `Vue` 实例上即可。比如 `axios` 可以进行如下的挂载：

```javascript
export default (vue: Function) => {
    vue.prototype.$http = axios;
};
```

## CSS 预处理器自动化导入

在使用单文件组件的时候，我们会发现我们在 `scss` 或者 `less` 文件中声明的全局变量不能访问，这里 `Vue-Cli` 的文档中已经给出了解答 [自动化导入](https://cli.vuejs.org/zh/guide/css.html#%E8%87%AA%E5%8A%A8%E5%8C%96%E5%AF%BC%E5%85%A5 "自动化导入")，其实原理就是自动帮我们在打包的时候 `import` 一些全局的 `CSS` 预处理器文件。

不过我在使用官方文档的配置发现并不能生效（后面测试是自己的配置问题，官方文档的配置可以使用），最后还是使用的 `vue-cli-plugin-style-resources-loader`，在 `vue.config.js` 中添加如下配置：

```javascript
pluginOptions: {
    // CSS 预处理器文件的自动化导入, 详细参考 Vue Cli 文档
    'style-resources-loader': {
        preProcessor: 'less',
            patterns: [path.resolve(__dirname, './src/assets/styles/base.less')], // less所在文件路径
    },
},
```

## 路径别名的配置

我们经常会看到一些 `vue` 项目的路径中有 `~` 和 `@` 这样的路径符号，这里其实都是对路径的别名配置。因为有时候我们的相对路径中会出现 `../../` 这样的路径，可读性很差，我们需要到目录中寻找层级，文件多的时候很容易看花眼，所以我们可以在 `webpack` 的配置中添加 `alias` 配置。

`@` 是 `Vue-Cli` 默认添加的一个路径别名，指向 `src` 文件夹。而 `~` 则是在 `CSS` 或者其预处理器文件中使用的，告诉解析器后面的标识符是一个路径别名，比如 `~@/xxx` 就是告诉解析器 `@` 是一个路径别名，应该到 `webpack` 的 `resolve` 配置中找对应的路径。一般来说路径别名在 `js` 中可以直接使用，在 `CSS` 中需要加上 `~`，在 `HTML` 中则两者都可以使用，详细参考 [vue-cli项目中使用别名：“@”和“~”的坑](https://blog.csdn.net/weixin_42060658/article/details/103654249 "vue-cli项目中使用别名：“@”和“~”的坑")

所以如果我们的路径层级比较多的时候我们可以自己配置别名，配置方式如下：

```javascript
chainWebpack: config => {
    config.resolve.alias.set('mock', resolve('mock'));
},
```

## 添加单元测试支持

可能你在创建项目的时候没有添加一些模块的支持，可以在创建完项目后手动进行依赖的安装以及配置，对于一些 `vue-cli` 已经集成好的插件，我们可以直接用 `vue-add` 来进行添加，比如 `jest` 我们可以用 `vue add @vue/unit-jest` 来添加，不过要注意，你的 `tsconfig.json` 不能有语法错误（比如多了逗号或者添加了注释，要严格遵循 `JSON` 的语法，因为 `jest` 安装的时候会对该文件进行 `JSON.parse`），否则会报错。

## 分析打包模块大小

我们在使用 `webpack` 的时候会使用 `webpack-bundle-analyzer` 来帮助我们分析 `bundle` 的组成部分从而进行优化，在使用 `vue-cli` 的时候我们可以直接在 `npm run build` 的时候加上 `--report`，会在 `dist` 目录下生成一个 `report.html` 文件，打开后就是 `webpack-bundle-analyzer` 生成的图。

## 总结

这是目前遇到的一些问题和解决方案，后期遇到的问题会继续进行补充。

## 参考文章

1. [Vue + TypeScript + Element 项目实践(简洁时尚博客网站)及踩坑记](https://segmentfault.com/a/1190000018720570 "Vue + TypeScript + Element 项目实践(简洁时尚博客网站)及踩坑记")