---
title: '零珠片玉'
publishDate: '2020-07-03 12:00:00'
description: ''
tags:
  - assorted
  - 学习笔记
  - 实用技巧
language: '中文'
heroImage: {"src":"./accumulate.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

在学习过程中经常会遇到一些当前没有时间去深入了解但又觉得很有价值（有兴趣）的知识点或问题，为了防止遗忘，找个地方记录下来。把这里当做一个储蓄罐，得闲就从中抽出一个感兴趣的研究一下，虽然希望这个储蓄罐越来越空，但问题堆积的速度应该远超问题解决的速度。吾生也有涯，而知也无涯，但是逐还是要逐一下的 :satisfied: ！

## JavaScript 相关

## 知识点

1. `JS` 中的语句和表达式：一个表达式会产生一个值,它可以放在任何需要一个值的地方,比如,作为一个函数调用的参数.。而语句则是组成我们程序的单元，每个语句通过一个或多个关键词完成指定的任务。单个语句可以跨多行。如果每个语句用分号隔开，那么多个语句可以在一行中出现。语句可以理解成一个行为。循环语句和if语句就是典型的语句。一个程序是由一系列语句组成的。`JavaScript` 中某些需要语句的地方，你可以使用一个表达式来代替。这样的语句称之为表达式语句。但反过来不可以：你不能在一个需要表达式的地方放一个语句。表达式类型如下：
    
    - 算数: 得出一个数字, 例如 `3.14159`. (通常使用 `arithmetic operators`.)
    - 字符串: 得出一个字符串, 例如, `"Fred"` 或 `"234"`. (通常使用 `string operators`.)
    - 逻辑值: 得出 `true` 或者 `false`. (经常涉及到 `logical operators`.)
    - 基本表达式: `javascript` 中基本的关键字和一般表达式。
    - 左值表达式: 分配给左值。

> 表达式和语句的区分并不是语言中一个必要的设计，也并不是一个非常好的设计，他们之间的关系比较模糊。参考《黑客与画家》

2. 字面量：用一个固定的值表示，比如 `{}`, `'123'`, `[1,2,3]`等，字面量只能作为右值。
    
3. 标识符：代码中用来标识变量、函数、函数的参数、或属性的字符序列，在 `JavaScript` 中，标识符只能包含字母或数字或下划线（`_`）或美元符号（`$`)，且不能以数字开头。标识符与字符串不同之处在于字符串是数据，而标识符是代码的一部分。在 `JavaScript` 中，无法将标识符转换为字符串，但有时可以将字符串解析为标识符。标识符中的字母也可以包含扩展的 `ASCII` 或 `Unicode` 字母字符(如 À 和 Æ)，但不推荐这样做。
    
4. `HTML5(包括4)` 大小写不敏感(`attribute` 名将强制转为转为小写，`attr` 的值则要区分大小写，因为主要是在 `JS` 和 `CSS` 中使用)，`CSS` 大小写不敏感，`JavaScript` 大小写敏感。不过 `HTML` 还是建议小写，因为更严格的 `XHTML` 标准是要求小写的。这里注意 `HTML` 的属性值还是区分大小写的，包括我们在 `CSS` 中使用选择器的时候，属性名可以不区分大小写，但是属性值需要区分大小写。
    
5. `setTimeout` 的第一个参数可以是 `function` 函数，也可以是一个字符串语句，是用字符串语句时，这里的 `this` 还是指向当前所在执行环境的 `this`，但如果是 `function`，需要注意的是所有函数直接调用，内部的 `this` 在非严格模式下都是指向全局对象的。字符串语句的模式不推荐，有安全风险，可以使用 `bind` 或者箭头函数。
    
6. 立即执行函数表达式 `IIFE (immediately invoked function expression)` 的原理就是利用运算符让函数声明被引擎识别为函数表达式从而能够立即进行调用，`function` 这个关键字即可以当作语句，也可以当作表达式，为了避免解析上的歧义，JavaScript 引擎规定，如果function关键字出现在行首，一律解释成语句。通常我们使用的形式有 `(function () {})()` 和 `!function () {}()`。但其实还有很多种运算符都能打到同样的效果。不过一般来说还是使用括号，关于性能可以看这篇[文章](https://swordair.com/function-and-exclamation-mark/ "文章")，感兴趣也可以自己去 `jsperf` 测试一下。
    
    ```javascript
    var i = function(){ /* code */ }();        // undefined
    1 && function(){ /* code */ }();        // true
    1, function(){ /* code */ }();        // undefined
    !function(){ /* code */ }()        // true
    +function(){ /* code */ }()        // NaN
    -function(){ /* code */ }()        // NaN
    ~function(){ /* code */ }()        // -1
    void function(){ /* code */ }()        // undefined
    new function(){ /* code */ }()        // Object
    delete function(){ /* code */ }()        // true
    (function(){ /* code */ })()        // undefined
    (function(){ /* code */ }())        // undefined
    
    // 这种形式要加分号，否则第二行会被引擎解释为第一行的参数
    (function(){ /* code */ }())
    (function(){ /* code */ }())
    
    (function(){ return function(a) {console.log(a)} }())
    (function(){ return 'test iife' }()) //test iife
    ```
    
7. 闭包：函数和对其周围状态(`lexical environment`，词法环境)的引用捆绑在一起构成闭包(`closure`)。也就是说，闭包可以让你从内部函数访问外部函数作用域。在 JavaScript 中，每当函数被创建，就会在函数生成时生成闭包。即每一个函数会主动维护在其内部使用的外部的变量。
    
8. 在 `JavaScript` 的社区里,有两个词经常被提到，`shim` 和 `polyfill`。一个`shim`是一个库,它将一个新的 `API` 引入到一个旧的环境中,而且仅靠旧环境中已有的手段实现一个 `polyfill` 就是一个用在浏览器 `API` 上的 `shim`.我们通常的做法是先检查当前浏览器是否支持某个 `API`,如果不支持的话就加载对应的 `polyfill`。然后新旧浏览器就都可以使用这个 `API` 了.
    
9. 赋值表达式返回的是右值，`return a = b` 返回的值是 `b` 不是 `a`。
    
10. 大括号在行首会被引擎理解为一个代码块，所以在使用对象解构赋值的时候如果行首是大括号可以用一个圆括号包在外围来执行。使用圆括号需要注意的点就是上一行个的代码要加上分号，否则可能引发错误。
    
11. map可以理解为映射
    
12. 指定的属性在指定的对象或其原型链中，则 `in` 运算符返回 `true`。
    
13. 原始类型在调用对应包装类型方法的时候是用一个临时变量来存放包装对象的，使用过后立即销毁。需要注意的是，这种创建临时对象的行为是引擎的处理，不会改变我们定义的原始类型变量(他们不会变为 `Object`)。只有我们用 `new` 手动创建的基本包装类型才会执行 `typeof` 的时候返回 `object`，手动创建还会引起其他的错误，尽量避免使用。
    
    ```javascript
    //一段JS代码
    var name = "clloz";
    var  firstChar = name.charAt(0);
    console.log(firstChar); //c
    
    // JS引擎的处理过程
    var name = "clloz";
    var temp = new String(name);
    var firstChar = temp.charAt(0);
    temp = null;
    console.log(firstChar); //c
    
    //另一端JS代码
    var name = "clloz";
    name.last = "Zhang";
    console.log(name.last) //undefined
    
    //JS引擎的处理过程
    var name = "clloz";
    var temp = new String(name);
    temp.last = "Zhang";
    temp = null; //这个临时对象立刻被销毁
    
    var temp = new String(name);
    console.log(temp.last); //undefined 再次创造一个临时对象，但这个对象和上一个是没有关系的，自然也没有last属性
    temp = null;
    
    ```
    
14. 所谓的一等公民就是：一等公民可以作为函数参数，可以作为函数返回值，也可以赋值给变量。出自[Programming Language Pragmatics](https://www.cs.rochester.edu/~scott/pragmatics/ "Programming Language Pragmatics")：In general, a value in a programming language is said to have ﬁrst-class status if it can be passed as a parameter, returned from a subroutine, or assigned into a variable.在 `JS` 中，几乎所有可以使用其他引用值得地方我们都可以使用函数。
    
15. 访问器属性只需要 `getter` 和 `setter` 中的一个，不能一个都没有。如果你试图创建一个同时具有数据特征和访问其特征的属性，会报错。访问器属性也可以用字面量形式在对象中定义，但是这只能发生在对象创建的时候，如果要为已经存在的对象添加访问器属性，只能通过 `Object.defineProperty` 或 `Object.defineProperties` 方法。在严格模式下访问未定义属性会报错。
    
16. `Object.defineProperty` 方法定义的数据属性和访问器属性，特性默认值都是 `false` 和 `undefined`(布尔型的为 `false`，其他为 `undefined`)，一个属性一旦被设置为不可配置就不能再变为可配置了。在严格模式对一个不可配置属性执行 `delete` 操作将会报错，在非严格模式下返回 `false` 且操作不生效。通过字面量定义的数据属性的特征值都是 `true`。
    
17. `left-hand-side expression` 左手表达式并不一定要出现赋值符号，比如 `++` 和 `--`，他们在执行的过程中实际是有赋值行为的，这也就是为什么 `++a++` 报错的原因。所以区分左手还是右手关键是看有没有赋值行为发生(赋值行为不一定需要赋值操作符，可以有其他形式)，`LHS` 可以理解为 `找到要赋值的目标`，而 `RHS` 可以理解为 `找到某个已经被赋值的结果`。
    
18. `console.time` 和 `console.timeEnd` 的使用
    
19. `JavaScript` 中的标识符第一个字符必须是一个字母、下划线(`_`)或一个美元符号(`$`);其他字符可以是字母、下划线、美元符号或数字。标识符中的字母也可以包含扩展的 `ASCII` 或 `Unicode` 字母字符(如 `À` 和 `Æ`)，但我们不推荐这样做。
    
20. 标准中的词汇翻译
    
    - `Assert`：断言，对算法中的某种情况进行判断（比如判断 `xxx` 是否为 `Object`）
    - `filed`：字段
    - `explicit`：显式的
    - `implicit`：隐式的
    - `clarify`：阐明
    - `notaion`：符号
    - `convention`：约定，惯例
    - `lexical`：词法
    - `syntax`：语法，句法（关注句子的组成部分的任务和句子结构）
    - `grammar`：文法（syntax是grammar的子集）
    - `context`：上下文
    - `Context-Free Grammars`：上下文无关文法
    - `production`：产生式
    - `nonterminal`：非终结符
    - `terminal`：终结符
    - `specified`：指定的
    - `goal symbol`：目标符
    - `ambiguity`：歧义
    - `parameterized`：参数化
    - `shorthand`：缩写
    - `subscript`：下标
    - `annotation`：注释
    - `suffix`：后缀
    - `alternative`：可选值（多个值里的情况）
    - `prefix`：前缀
    - `intrinsic`：内置的
    - `Conceptually`：概念上来说
    - `a set of`：一套，一组
    - `codebase`：代码库，一般就是指你写的源码
21. `JavaScript` 中字符串最大长度限制为 $2^{53}-1$，这个长度是受下标限制，下标的最大值就是 `JS` 中能表示的最大安全整数。实际引擎是不可能允许分配那么大的字符串的，电脑也没有这么大的存储。`V8` 的 `heap` 上限只有 `2GB` 不到，允许分配的单个字符串大小上限更只有大约是 `512MB` 不到。JS字符串是 `UTF16` 编码保存，所以也就是 `2.68` 亿个字符（按基础平面中的两字节计算）。
    
22. 基本包装类型作为函数直接调用的作用是对参数进行强制类型转换，`Object` 作为函数直接调用相当于对参数进行装箱操作，具体内容参考[标准](https://www.ecma-international.org/ecma-262/11.0/index.html#sec-toobject "标准")，装箱机制会频繁产生临时对象，对性能有有要求的场景应避免使用。除了直接用 `new` 调用基本包装类型的构造函数来进行装箱操作之外，还有其他的方法可以达到装箱效果。
    
    ```javascript
    var symbolObject = Object("a"); 
    console.log(typeof symbolObject); //object 
    console.log(symbolObject instanceof Symbol); //true 
    console.log(symbolObject.constructor == Symbol); //true
    
    var a = '123'
    console.log(typeof a) //string
    var t = (function () {return this}).call(a)
    console.log(typeof t) //object
    ```
    
23. 在 `JavaScript` 标准中，规定了 `ToPrimitive` 函数，它是对象类型到基本类型的转换（即，拆箱转换）。拆箱转换会尝试调用 `valueOf` 和 `toString` 来获得拆箱后的基本类型。如果 valueOf 和 toString 都不存在，或者没有返回基本类型，则会产生类型错误 `TypeError`。`String` 的拆箱转换会优先调用 `toString`。在 `ES6` 之后，还允许对象通过显式指定 `@@toPrimitive Symbol` 来覆盖原有的行为。
    
    ```javascript
    //覆盖对象的valueOf和toString方法
    var o = {
        valueOf : () => {console.log("valueOf"); return {}},
        toString : () => {console.log("toString"); return {}}
    }
    
    o * 2
    // valueOf
    // toString
    // TypeError
    
    //ES6 Symbol.toPrimitive
    var o = {
        valueOf : () => {console.log("valueOf"); return {}},
        toString : () => {console.log("toString"); return {}}
    }
    
    o[Symbol.toPrimitive] = () => {console.log("toPrimitive"); return "hello"}
    
    
    console.log(o + "")
    // toPrimitive
    // hello
    ```
    
24. `defineProperty` 可以创建函数属性。
    
    ```javascript
    var o = {
        a: 10,
        fun: function test() {
            console.log(123);
        }
    }
    Object.defineProperty(o, 't', {
        value: function clloz() {
            console.log(456)
        },
        enumrable: true,
        configurable: true
    })
    o.t()
    console.log(Object.getOwnPropertyDescriptor(o, 't'))
    ```
    
25. `Object.create()` 可以创建原型为 `null` 的对象，但是新创建的对象没有 `[[prototype]]` 属性，以新对象作为 `prototype` 的函数其构造的实例也没有 `[[prototype]]` 属性，处于这条原型链上的所有对象都没有 `[[prototype]]` 属性，不知道这样处理的实际意义是什么。
    
    ```javascript
    function a() {}
    a.prototype = Object.create(null)
    console.log(a.prototype.__proto__) //undefined
    let at = new a
    console.log(at.__proto__) //undefined
    
    function b() {}
    b.prototype = Object.create(a.prototype)
    console.log(b.prototype.__proto__) //undefined
    let bt = new b
    console.log(bt.__proto__) //undefined
    ```
    
26. `Object.prototype.toString` 访问的是对象的 `[[class]]` 属性。`ES5` 之后可以用 `Symbol.toStringTag` 属性的值覆盖默认结果。
    
    ```javascript
    var o = new Object;
    var n = new Number;
    var s = new String;
    var b = new Boolean;
    var d = new Date;
    var arg = function(){ return arguments }();
    var r = new RegExp;
    var f = new Function;
    var arr = new Array;
    var e = new Error;
    console.log([o, n, s, b, d, arg, r, f, arr, e].map(v => Object.prototype.toString.call(v))); 
    [
        '[object Object]',
        '[object Number]',
        '[object String]',
        '[object Boolean]',
        '[object Date]',
        '[object Arguments]',
        '[object RegExp]',
        '[object Function]',
        '[object Array]',
        '[object Error]'
    ]
    ```
    
27. `ES6` 新特性，方括号 `[]` 不仅可以用在属性访问时的表达式，在属性定义时也可以使用（不可以用括号代替）。
    
28. 浏览器目标就是从 `url` 请求到最后渲染出 `bitmap`，然后交给显卡渲染出最后我们人眼能识别的光信号。
    
29. `new Array(length)` 创建的确定长度的数组无法用 `map` 进行每一项的初始化。此时将返回一个 `length` 的值等于 `arrayLength` 的数组对象（言外之意就是该数组此时并没有包含任何实际的元素，不能理所当然地认为它包含 `arrayLength` 个值为 `undefined` 的元素）。
    
30. 数组的 `fill` 方法如果传递的参数是对象，填充的将是对象的引用。
    
31. 没有引用外部变量的函数可以被系统优化为非闭包函数。
    
32. `ifram` 的 `realm` 和当前页面是不同的，所以我们对 `ifram` 里面的对象执行 `object instanceof Object` 返回的 `false`。
    
33. `TypeError: Converting circular structure to JSON` 循环引用报错，用 `JSON.stringify` 方法将对象转字符串，如果对象中有循环引用将报错。
    
    ```javascript
    let a = {
        children: {}
    }
    a.children.parent = a;
    JSON.stringify(a); //Uncaught TypeError: Converting circular structure to JSON
    ```
    
34. `nodejs` 打开浏览器可以用 `open` 库。
    
35. 编码规范 `airbnb` ，`standard`。
    
36. `label` 用来给 `continue` 和 `break` 跳出多层循环使用。
    
37. 要使用 `vue devtools` 要使用开发版本的 `vue`，重启一下 `chrome` 的开发者工具。
    
38. `npm` 安装的包前面的 `@` 是范围包。可以理解为由某些官方发布的包。比如 `@vue/cli` 就是 `vue` 官方发布的 `cli` 包，`vue` 官方发布的其他包也都会在 `@vue` 下。范围包也可以发布重名的包，比如 `http` 这个包已经存在，但是还是可以用 `@angular/http` 安装 `angular` 的 `http` 包。
    
39. 函数的参数会先计算。
    
40. `for` 语句的三个表达式都是可选的。
    
41. `JavaScript` 中的关键字和保留字不能用作变量名，函数名和 `label` 但是可以用作对象的属性名，但因该避免。还有内置对象以及其属性方法的名称也应该避免使用，具体参考[JavaScript保留关键字](https://www.runoob.com/js/js-reserved.html "JavaScript保留关键字")
    
42. `throw` 语句用来抛出一个用户自定义的异常。当前函数的执行将被停止（`throw` 之后的语句将不会执行），并且控制将被传递到调用堆栈中的第一个 `catch` 块。如果调用者函数中没有 `catch` 块，程序将会终止。该语句接受一个表达式作为参数，当我们传递一个对象作为参数，可以在 `catch` 中使用该对象。
    
43. `try...catch` 语句标记要尝试的语句块，并指定一个出现异常时抛出的响应。`try` 语句包含了由一个或者多个语句组成的 `try` 块, 和至少一个 `catch` 块或者一个 `finally` 块的其中一个，或者两个兼有。`catch` 子句包含 try 块中抛出异常时要执行的语句。也就是，你想让try语句中的内容成功， 如果没成功，你想控制接下来发生的事情，这时你可以在catch语句中实现。 如果在try块中有任何一个语句（或者从try块中调用的函数）抛出异常，控制立即转向catch子句。如果在try块中没有异常抛出，会跳过catch子句。finally子句在try块和catch块之后执行但是在下一个try声明之前执行。无论是否有异常抛出或捕获它总是执行。你可以嵌套一个或者更多的try语句。如果内部的try语句没有catch子句，那么将会进入包裹它的try语句的catch子句。
    
44. 扩展运算符有几个用法，作为函数调用时的参数，构造数组字面量时展开数组或字符串，创建字面量对象时展开对象以进行浅拷贝（一层深拷贝）。
    

```javascript
let obj = {
    name: 'clloz',
    age: 28,
    inner: {
        test: 123,
    },
};

let newObj = { ...obj };

console.log(newObj); // name: 'clloz', age: 28, inner: { test: 123 } }
obj.name = 'clloz1992';
console.log(newObj); // name: 'clloz', age: 28, inner: { test: 123 } }
obj.inner.test = 345;
console.log(newObj); // name: 'clloz', age: 28, inner: { test: 345 } }
```

45. 嵌套函数的 `return` 要注意，当前层级的返回必须自己 `return`，调用函数的 `return` 只返回到当前层级，不会再向上返回。函数的 `return` 只返回给它的调用者，不会冒泡。
    
46. [句首分号](https://www.tangshuang.net/3486.html "句首分号")
    
47. 如果出现页面的资源发生重复请求的情况，检查是否打开了浏览器开发者工具的 `disable cache`。
    

## 问题

1. 函数柯里化的作用和场景
    
2. 原型链中最让人不解的地方就是 `Function` 是自己的构造函数，也就是 `Function.prototype === Function.__proto__` 返回 `true`，正是这个实例和构造函数为同一对象让 `Object instanceof Function` 和 `Function instanceof Object` 都返回 `true`。我的猜想是：并不是 `Function` 自己构造了自己，实例和构造函数在引擎中是同一个对象，只不过为了保持每个对象的 `instance --> [[prototype]] --> constructor` 这个模型。每个函数都是 `Function` 的实例，所有的内置引用类型的构造函数都是 `Function` 的实例，所以 `Function` 就是顶部的构造函数，他不再被其他函数构造，给了它一个 `[[prototype]]` 属性只是为了保持那个模型。
    
3. 类型化数组 类数组对象，填充数组的是这个对象的引用。
    
4. 函数柯里化
    
5. `es6` 绑定函数 `bind` 创建 `mdn-bind`
    
6. `JS` 性能测试 [benchmark.js](https://github.com/bestiejs/benchmark.js "benchmark.js") 和 [jsperf](https://jsperf.com/ "jsperf")
    
7. [lodash](https://github.com/lodash/lodash "lodash")
    
8. `map` 的概念，在其他语言和 `JS` 中的区别，`map` 的应用
    
9. 通过访问器属性实现双向数据绑定 [JavaScript对象的数据属性与访问器属性](https://juejin.im/post/5cbac7fff265da0378759399 "JavaScript对象的数据属性与访问器属性")
    
10. `Function.name` 细节
    
11. `ES6` 子类有没有自己的 `this`。
    
12. `throw` 和 `Error` 对象
    
13. 为什么 `arguments.callee` 严格模式下不可用 [mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments/callee "mdn")
    
14. 在浏览器开发者工具里面执行 `Array.prototype.push(123)` 后点击页面和敲键盘都会报错
    
15. 严格模式的细节
    
16. `JavaScriptCore` 和 `V8` 的区别
    
17. `devtools` 的使用教程 `chrome://flag`
    
18. `glob patterns` 的细节，命令行通配符教程
    
19. 自动化测试，jest等
    
20. webassembly了解
    
21. [编程范式](https://www.bilibili.com/video/BV1Us411h7aU/?spm_id_from=333.788.videocard.1 "编程范式")
    
22. 理解 `RegExp.$1-$9`。
    
23. `csrf` 、`xss` 和 `iframe` ，前端安全的三个模块
    
24. `javascript` 的混淆和压缩，构建工具
    
25. `Web Component` 的[使用](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components "使用")
    
26. `nodejs` 子进程 `child_process` 调用其他程序或者系统命令。
    

## Vue

## 知识点

1. 三种命名方式，`camelCase`，`PascalCase` 和 `kebab-case` 在标签名和组件名之间能相互转化，`vue` 官方推荐的做法是单文件组件文件名 和 `JS/JSX` 中使用 `PascalCase`，`DOM` 标签中使用 `kebab-case`。

## CSS 相关

## 知识点

1. 数学公式展示的几种方式：`LaTex` 发行版（`TeXlive`、`CTex`套装、`MiKTeX` 等，`mac` 使用[maxtex](https://tug.org/mactex/ "maxtex")）默认输出为 `pdf`，转为 `png` 再在文档中展示；`MathJax`；`KaTex`；`MathQuill`。详情参考[LaTex数理化公式展示方案](https://imweb.io/topic/5a23ecf8a192c3b460fce272 "LaTex数理化公式展示方案")
    
2. [CSS为什么难学和正交概念](https://zhuanlan.zhihu.com/p/29888231 "CSS为什么难学和正交概念")
    
3. 限制文本行数单行或多行，超出本分用省略号。
    
    ```css
    /*单行文本溢出用省略号显示：*/
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    
    /*多行文本溢出用省略号显示：*/
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    ```
    

## 问题

1. `PostCSS`
    
2. `JavaScript` 引入新的 `CSS` 样式 [js改变css的几种方法](https://www.cnblogs.com/LiuWeiLong/p/6058059.html "js改变css的几种方法")
    
3. `padding-top` 和 `padding-left` 的关系（`margin` 同理）
    
4. 动画卡顿研究 [总结之优化动画卡顿：卡顿原因分析及优化方案](https://juejin.im/post/6844903796817002504 "总结之优化动画卡顿：卡顿原因分析及优化方案")
    

## HTML 相关

## 知识点

1. `Emmet` (前身为 `Zen Coding`) 是一个能大幅度提高前端开发效率的工具，能够实现 `HTML`、`CSS` 的快速编写。`emmet` [语法](https://code.z01.com/Emmet/ "语法")。
    
2. `espresso` 的使用
    
3. `strong` 标签表示句子中的重点，`em` 标签表示重音。
    
4. `HTMLImageElement.srcset`：一个字符串，用来定义一个或多个图像候选地址，以 ,分割，每个候选地址将在特定条件下得以使用。
    
5. `a` 标签的 `rel="noreferrer"` 可以让请求不发送 `referrer`。
    
6. 验证 `HTML` 文档是否符合标准可以使用 [validator.nu](https://validator.nu/ "validator.nu") 或者 [Markup Validation Service - MDN](https://validator.w3.org/ "Markup Validation Service - MDN")。
    

## 问题

1. `HTML` 命名空间。

## Music & Game

1. `vaporwave`：2010年兴起电子音乐，这类作品侧重于 `20` 世纪 `80` 年代、`90` 年代的美国、日本流行文化元素，包括城市生活、购物中心、商业广告、电子游戏、科技和早期互联网等，也受到赛博朋克科幻的影响。
    
2. `Punk`：反乌托邦，无政府主义
    
3. `cyberpunk`：低级生活和高级科技的结合，信息技术为主体。一般背景为后工业时代的反乌托邦，先进的科学技术和失序的社会构成鲜明的对比。
    

## 版本控制

## 问题

1. 持续集成 `CI` 和持续交付 `CD`

## 其他

## 知识点

1. Nginx可以在前面做一个反向代理和缓存服务器，提供静态文件的服务，后台有多个nodejs服务，提供系统的可用性
    
2. `git config --global core.editor emacs/vim` 修改 `git` 默认编辑器。
    
3. `mac` 自带 `apache` 关闭命令 `sudo launchctl unload -w /System/Library/LaunchDaemons/org.apache.httpd.plist`，在启动命令 `sudo launchctl load -w /System/Library/LaunchDaemons/org.apache.httpd.plist`，配置文件 `/etc/apache2/httpd.conf`，网站根目录 `/Library/WebServer/Documents`，查看`httpd` 的一些配置参数 `httpd -V`。根据目前的测试，`apachectl` 命令无法控制系统自带的 `apache`，`which` 和 `where` 命令也找不到。根据从网络上搜索到的一些资料，现在的 `mac` 系统（具体版本位置，我的是最新版本的 `10.15`）中内置的 `apache` 自动启动并且无法删除，端口默认为 `80`，并且配置文件和根目录下的 `index.html` 都是只读的，不太清楚这样设定的原因是什么。参考文章看[解决mac系统下自带apache开启关闭问题](https://blog.csdn.net/Mazi1994/article/details/80452478 "解决mac系统下自带apache开启关闭问题")
    
4. `mac`上 `nginx` 启动命令 `nginx`，关闭命令 `nginx -s stop`。
    
5. `macOS Catalina` 预装了 `Ruby (2.6.3)`、`PHP (7.3.9)`、`Perl (5.18.4)`、`Python (2.7.16)`，对环境的改造可以看这篇文章[在 macOS Catalina 10.15 搭建 PHP 开发环境](https://learnku.com/articles/35981 "在 macOS Catalina 10.15 搭建 PHP 开发环境")
    
6. `mac` 系统里面没有 `systemctl` 和 `service` 这两个管理服务的命令，有一个类似的 `launchctl` 的命令来管理服务。
    
7. 在使用 `brew services` 命令的时候如果提示 `services` 未找到，并且 `brew update` 以后还是没用，可以试一试 `brew update-reset` 命令。
    
8. 面向对象只是一种编程思想，说某种语言是面向对象语言是不合适的，只能说实现面向对象更容易。
    
9. 编程语言的分类不是非此即彼的，很多时候是我中有你，你中有我，特别是用在工程上的语言，都是吸纳了各种思想。能分类的不是语言，而是编程思想。
    
10. 图灵完备的理解 [什么是图灵完备](什么是图灵https://www.zhihu.com/question/20115374/answer/288346717 "什么是图灵完备")
    
11. 所谓 `流` 就是没有明显分割单位的事物，唯一能够确定的就是先后顺序，比如水流，字节流。
    
12. `HTTP` 报文首部的所有换行都是 `CRLF`。`Dos` 和 `Windows` 采用 `CR/LF` 表示下一行，而 `UNIX/Linux` 采用换行符LF表示下一行，`MAC OS` 则采用回车符 `CR` 表示下一行
    
13. 用 `automator` 创建一个新建文件的 `application` 并放到 `finder` 的 `toolbar` 上。参考\[之乎回答\](为什么 macOS 在 Finder 里不可以新建文本文件？ - fantouch的回答 - 知乎 https://www.zhihu.com/question/20883777/answer/81780928 "之乎回答")，图标自己找。
    
14. `mac` 的 `launchpad` 出现重复图标的时候可以先把对应的软件删除到 `Trash`，然后删除 `launchpad` 中多余的图标，在将软件从 `Trash` 中还原即可。
    
15. 要查看 `Chrome Extension` 的网络请求，需要进入 `extension` 的 `background page`，进入方法就是到 `chrome://extensions` 页面找到对应的插件，点击 `background page` 链接。
    
16. 3C是对电脑（`Computer`）及其周边、通讯（`Communications`，多半是手机）和消费电子（`Consumer-Electronics`）三种家用电器产品的代称。
    
17. `IC` 是指集成电路`integrated circuit`，或称微电路（`microcircuit`）、微芯片（`microchip`）、芯片（`chip`）在电子学中是一种将电路（主要包括半导体设备，也包括被动组件等）集中制造在半导体晶圆表面上的小型化方式。
    
18. [什么是.NET](https://www.cnblogs.com/1996v/p/9037603.html#net23 "什么是.NET")
    
19. `extension` 不仅表示扩展（插件），也表示文件扩展名（后缀名）
    
20. 使用 `brew install enca` 来查看修改文件的编码格式。
    
21. `default` 有时也翻译为 `缺省`，和默认值没有本质区别。
    
22. `WSL(Windows Subsystem for Linux)` 无法连接 `usb` 设备，如果想要用 `adb` 调试安卓设备，需要在 `windows` 和 `WSL` 都安装相同版本的 `adb` 即可在 `WSL` 中找到 `usb` 连接的设备进行调试。`windows` 的安装直接下载解压添加环境变量即可，`ubuntu` 中的则需要先通过 `apt` 安装，默认安装路径为 `/usr/lib/android-sdk/platform-tools`，然后用 `wget https://dl.google.com/android/repository/platform-tools-latest-linux.zip` 现在最新版本，用 `unzip` 解压 `platform-tools` 文件夹，然后替换默认安装路径中的内容 `sudo cp -r platform-tools /usr/lib/android-sdk`。
    
23. `KOL` 表示 `Key Opinion Leader` 关键意见领袖
    
24. `sudo spctl --master-disable` 解除 `system policy control` 系统策略控制，允许安装非信任第三方软件。
    
25. [渗透测试](https://github.com/Mr-xn/Penetration_Testing_POC "渗透测试")
    
26. `markdown` 中使用 `katex` 有三种插入方法，一种行内插入用单个美元符号包裹，一种插入单行用两个美元符号包裹，最后一种是像插入代码块一样用 ` ``` `，语言选择 `math`。当前使用的 `markdown` 编辑器解析存在问题，当 `katex` 表达式中存在大括号并且使用前两种表达方式会报错，只能选择第三种，或者将大括号用其他括号代替。
    
27. 在 `Windows` 应用商店安装 `ubuntu` 系统，报错 `WslRegisterDistribution failed with error: 0x8007019e` 原因是未安装 `Windows` 子系统支持。解决方法是在 `PowerShell` 中执行命令 `Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux`。
    
28. 日语 `々` 可以在输入法中用 `おなじ` 或者 `くりかえし` 来选择输入。
    
29. `wordpress` 显示图片上传失败（提示修改图片 `2500` 像素以下），可能是命名的问题，去掉图片名字中的数字。
    
30. 在线流程图[processon](https://processon.com/ "processon")
    
31. 查文档也可以到 `MSDN` 和 `IBM developer`
    
32. 使用 `tar` 和 `openssl` 对文件进行加密压缩。
    
    ```bash
    # encode
    tar -zcf  - filename  |openssl des3 -salt -k password | dd of=filename.des3
    
    # decode
    dd if=filename.des3 |openssl des3 -d -k password | tar zxf -
    ```
    
33. `Mac` 创建指定大小文件命令 `mkfile -n size[b|k|m|g] filename`
    
34. [sdk和open api有什么区别？ - aaaron7的回答 - 知乎](https://www.zhihu.com/question/20225153/answer/82373708 "sdk和open api有什么区别？ - aaaron7的回答 - 知乎 ")
    

## 问题

1. 大型网站是如何架构的，多个系统是如何协同工作的，项目如何部署，`web` 服务器如何配置使用。
    
2. `docker` 的原理和使用，[docker入门教程](https://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html "docker入门教程")
    
3. 反向代理是否能用 `443` 端口转发两个端口，只用一个 `ssl` 证书就保证两个端口的访问都是 `https`
    
4. 如何快速部署服务器环境，如何复制当前服务器环境，docker
    
5. 编程语言的分类，乔姆斯基范式，`bnf`产生式
    
6. `hash` 算法
    
7. 高级长期威胁（英语：`advanced persistent threat`，缩写：`APT`）
    
8. `vscode` 的 `prettier` ，`eslint` 和 `tslint` 的配置。
    
9. `wordpress` 的前后端分离，[wordpress的前后端分离](https://www.zhihu.com/question/30436366/answer/606673813 "wordpress的前后端分离")
    
10. [编译原理-程序设计语言及其文法【笔记】](https://zhuanlan.zhihu.com/p/133989861 "编译原理-程序设计语言及其文法【笔记】")
    
11. LCD的显示原理：[TFT LCD显示原理详解](https://www.cnblogs.com/big-devil/p/982c07ae-c79e-478d-b23e-225c34db1a2d.html "TFT LCD显示原理详解")，液晶面板 `IPS`，`VA` 和 `TN` 的区别。`LED` 和 `LCD` 的概念：[LED和LCD液晶显示器有什么区别](http://www.58display.com/article/zixun/383.html "LED和LCD液晶显示器有什么区别")
    
12. `Mac` 修改默认图标[教程](https://sspai.com/post/54101 "教程")
    
13. [First Order Motion Model for Image Animation 论文解读 刘锦](https://zhuanlan.zhihu.com/p/136606648 "First Order Motion Model for Image Animation 论文解读 刘锦")， [first-order-model](https://github.com/AliaksandrSiarohin/first-order-model "first-order-model")
    
14. [Google CoLab](https://colab.research.google.com/ "Google CoLab")
    
15. [Windows包管理工具scoop](https://www.cnblogs.com/suihang/p/10449722.html "Windows包管理工具scoop")
    
16. [macOS -jdk 安装](https://blog.favorstack.io/Java/jdk-openjdk-11-config-on-macos.html "macOS")
    
17. 服务器带宽占用排查 [iftop 和 lsof 排查服务器网络请求](https://cloud.tencent.com/document/product/213/10334 "iftop 和 lsof 排查服务器网络请求")