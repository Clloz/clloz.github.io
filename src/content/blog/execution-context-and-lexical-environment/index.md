---
title: '执行上下文和词法环境'
publishDate: '2021-11-27 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

我之前曾经写过 [JS 中的执行环境和作用域链](https://www.clloz.com/programming/front-end/js/2019/03/24/execution-contextscope-chain/ 'JS 中的执行环境和作用域链') 和 [var，let，const和变量提升（hoist）](https://www.clloz.com/programming/front-end/js/2020/07/01/variable-hoist/ 'var，let，const和变量提升（hoist）') 两篇文章来总结 `JavaScript` 中代码执行和作用域的一些知识点，最近在读 [JavaScript 忍者秘籍（第二版）](https://book.douban.com/subject/30143702/ 'JavaScript 忍者秘籍（第二版）') 的第五章的时候结合 [最新版的 Spec](https://262.ecma-international.org/12.0/#sec-environment-records '最新版的 Spec') 将这部分知识又复习梳理了一遍，进行一个新的总结。

> ECMAScript 的标准只是一份文档，具体的引擎实现并不完全参照标准，我们只是借助标准来理解引擎的一些行为，除非翻引擎的源码，否则我们很难确定底层的实现细节，首要的目的还是理解行为和机制。对绝大多数前端程序员来说，并没有了解底层实现的必要，如果确有需要并且有实力可以去阅读源码，否则只要大致理解机制即可，不必花费过多时间钻牛角尖。本文所讨论的 ECMAScript 规范的版本范围从 2011 年的 5.1 版本到最新的 2021版本，其他版本不在讨论范围内

## 环境记录 Environment Record 和 词法环境 Lexical Environment

这两个概念联系很紧密，它们都是标准中核心章节 `Executable Code and Execution Contexts` 中的重要概念。这两个概念一直都是存在的，从 [ES 5.1](https://262.ecma-international.org/5.1/#sec-10.2.1 'ES 5.1') 的 `10.2` 小节可以看出此时的 `Environment Records` 只是 `Lexical Environment` 下的一个概念，或者说是 `Lexical Environment` 中的一个组成部分，基本到 [ES2020](https://262.ecma-international.org/10.0/#sec-executable-code-and-execution-contexts 'ES2020')之前，这两个概念在标准中都没什么变化，最新的 [ES 2021](https://262.ecma-international.org/5.1/#sec-10.2.1 'ES 2021') 我们会发现 `Lexical Environment` 已经放到了 `Execution Contexts` 中，成了执行上下文中的一个概念，而 `Environment Records` 则是和执行上下文同级的一个小节，不过它们两个概念依然有很紧密的联系。

> 注意：规范中也明确说了 `Lexical Environments` 和 `Environment Record` 是纯粹的规范内的机制并没有对应某个特定的实现，我们无法在程序中对这些值进行访问。

在 `2020` 之前的版本中对 `Environment Record` 和 `Lexical Environment` 的描述就是一个 `Specification Tpyes` 就是规范中的类型，规范类型对应于在算法中使用的元值，用于描述 `ECMAScript` 语言构造和 `ECMAScript` 语言类型的语义。

`Lexical Environment` 和 `Environment Record` 类型是用来解释嵌套的方法和代码块的标识符解析的行为的。`Lexical Environment` 的作用是根据代码的词法嵌套结构来定义标识符和特定的变量或方法的关联。`Lexical Environment` 由 `Environment Record` 和一个可能为空的外层 `Lexical Environment` 组成。通常 `Lexical Environment` 和特定的语法结构相关联，比如函数声明，块语句，`Try` 语句的 `Catch` 子句，每次这些代码执行都会创建一个新的 `Lexical Environment`。`Lexical Environment` 由该环境的 `Environment Record` 和一个可能为 `null` 的指向其外部 `Lexical Environment` 的引用组成（我们下面称这个引用为 `OuterEnv`）。

> 这里有两个比较疑惑的点，一个是这里说的是 `FunctionDeclaration`，在规范中 `FunctionDeclaration` 和 `FunctionExpression` 也是不同的，按理说函数声明和函数表达式的执行应该是没本质区别的（虽然有提升的区别）但对于代码的执行应该是一样的，不过标准中在说特定的语法结构用的是 `such as` 姑且认为只是列出了部分。另一个是为什么要单独说 `Catch` 子句，根据规范的定义，`Catch` 子句已经是 `Block` 了，有没有必要单独列出来。

而一个 `Environment Record` 用来记录其所在的 `Lexical Environment` 的作用域中创建的标识符绑定。根据规范，`Environment Records` 有两种主要的类型 `declarative Environment Records` 和 `object Environment Records`，前者就是我们常见的函数声明，便令声明等，包括了 `variable`，`constant`，`let`，`class`，`module`，`import` 和 `function declarations`，后者则是主要用来关联 `WithStatement`。

> 关于 `Environment Records` 在规范中还介绍了抽象类和实体子类的细节，这里就不展开了，不影响我们理解，有兴趣可以阅读规范。

`Lexical Environment` 的嵌套自然就和我们上面说道的会产生 `Lexical Environment` 的结构的嵌套紧密相关，当我们定义了嵌套的函数或者 `BlockStatement`，自然会发生 `Lexical Environment` 的嵌套，所以 `Lexical Environment` 就有一个 `Outer Environment` 引用指向其**定义**时所在的 `Lexical Environment`。

**下面的这部分内容都是我根据标准还有一些资料对引擎实现的一些猜想和推测，我对编译原理是一点不了解，只是把自己的一些想法记录一下**

这里有一个点需要注意，`Lexical Environment` 是由代码的执行产生的，但是产生的 `Lexical Records` 其内部的 `Outer Environment` 确是由定义的位置确定的。至于引擎是如何实现这种定位位置的跟踪，我是比较好奇内部的实现的，我猜想应该是预编译的时候再任何函数对象产生的时候，比如说声明提升或者是函数表达式赋值的时候，给内存中产生的函数对象加上一个内部属性 `[[OuterEnv]]` 指向当前所在的 `Lexical Environment`。

在学习这部分内容的时候我还有一个疑问就是闭包和 `with`的问题，`Lexical Environment` 是在函数执行的时候创建的，那如果我们的函数是从某个内部函数返回的，当这个函数执行的时候，其定义时所在的环境的闭包以及其 `Lexical Environment` 是如何保存的，是所有的标识符解析都保存着还是说只保留了这个函数引用的部分，我个人倾向于是值保留了还需要使用的那部分，毕竟内存的消耗肯定是越小越好，当然这就需要预编译的时候引擎做更多事情。我们可以找一段简单的闭包代码来分析一下。

```javascript
outerVar = 1
function outerFn() {
  const uselessVar = 'useless'
  const innerVar = 10
  return function inner() {
    console.log(innerVar)
  }
}
const innerFn = outerFn()
innerFn()
```

在分析之前我还是先说一下我对闭包 `closure` 的理解，其实并不是一个复杂的概念，主要是用在函数式编程语言中的一个概念，由于函数式编程中的函数是 `first-class object`，可以作为一个普通对象使用（作为参数，返回值等），所以其**作用域**的工作方式产生了闭包。在 `JavaScript` 中我们定义的函数可以在任何地方调用，如果按照调用的位置确定作用域，那么其作用域会变得不确定，所以函数式编程语言的作用域采用的是函数内定义的参数，变量，方法在函数外不可访问，只有内部定义的方法可以访问（隐藏状态是实现 `OOP` 的一个重要特性），一个函数能访问的作用域由其定义的位置确定，所以我们可以说闭包就是函数和其能访问的作用域构成的。我们可以看出无论是 `Lexical Environment`，`Environment Record` 还是 `Closure` 的概念都是在解释函数式编程语言的标识符绑定也就是作用域的问题。

> 维基百科的解释：闭包在实现上是一个结构体，它存储了一个函数（通常是其入口地址）和一个关联的环境（相当于一个符号查找表）。环境里是若干对符号和值的对应关系，它既要包括约束变量（该函数内部绑定的符号），也要包括自由变量（在函数外部定义但在函数内被引用），有些函数也可能没有自由变量。闭包跟函数最大的不同在于，当捕捉闭包的时候，它的自由变量会在捕捉时被确定，这样即便脱离了捕捉时的上下文，它也能照常运行。捕捉时对于值的处理可以是值拷贝，也可以是名称引用，这通常由语言设计者决定，也可能由用户自行指定（如C++）。

继续分析上面的代码，我们假设 `outer` 函数定义在全局中，并且全局环境中只有这段代码，我们分三个时间点来分析代码，第一个时间点是全局环境装载的时候，第二个时间点是 `outerFn` 执行的时候，第三个时间点是 `innerFn` 执行的时候。

![lexical-environment-1](./images/lexical-environment.png 'lexical-environment-1')

我们先来看全局环境装载，也就是我们代码开始执行的时候，此时的执行上下文栈只有一个全局执行上下文，全局代码的执行也会创建全局的 `Lexical Environment`，`Global Lexical Environment` 的 `OuterEnv` 是 `null`，`Environment Record` 则记录了全局环境中的标识符绑定，在这段代码中有两个 `constant`：`outerVar` 和 `innerFn`，还有一个 `FunctionDeclaration`：`OuterFn`。从上面我作的这个图可以看出全局的 `Lexcial Environment` 和 `Environment Record` 的关系。这里我有个推测就是当全局环境或者函数进行预编译的时候，检测到函数声明的时候会给函数加上一个 `[[Environment]]` 字段，后面函数执行的时候就是用这个字段作为新生成的 `Lexical Environment` 的 `OuterEnv`。如果是函数表达式，这个操作应该是在执行到函数表达式赋值的时候进行的。有了这个 `[[Environment]]` 属性之后，无论之后的函数在哪里执行，我们都知道其 `OunterEnv` 是哪个，逻辑上没什么问题。`这里也只是个人的想法，引擎的具体实现不一定是这样，但整个思路应该是没有问题的`

![lexical-environment-2](./images/lexical-environment2.png 'lexical-environment-2')

下面我们进入第二个时间点，就是 `outerFn` 执行的时候。如上图所示，`outerFn` 的执行创建了一个新的 `Lexical Environment`，这个新的 `Lexical Environment` 的 `outerEnv` 就会拿我们放在函数上的 `[[Environemnt]]` 属性，也就是 `GlobalLexicalEnvironment`。`outerFn Lexical Environmet` 的 `Environment Record` 中就放着函数中的标识符绑定，`uselessVar`，`innerVar` 和一个函数声明 `innerFn`。和全局环境装在时一样，我们会在 `outerFn` 预编译的时候给 `innerFn` 上加一个 `[[Environment]]` 属性指向 `outerFn Lexical Envrionment`。

![lexical-environment-3](./images/lexical-environment3.png 'lexical-environment-3')

最后一个时间点是全局的 `innerFn` 的执行，此时的 `outerFn Execution Context` 已经执行完毕出栈销毁了，但是由于其内部定义的 `innerFn` 仍然在全局环境中有引用，该 `innerFn` 可以通过闭包访问到 `outerFn` 中定义的变量，现在这些内部变量只有 `innerFn` 能够访问到了。所以我们可以看到 `outerFn Lexical Environment` 并不会销毁，当 `innerFn` 执行过程中进行标识符检索的时候会现在当前的 `innerFn Lexical Environment` 中的 `Environment Record` 中进行检索，找不到会到 `innerFn Lexical Environment` 中的 `OuterEnv` 指向的 `outerFn Lexical Environment` 中进行检索，如果还找不到就继续按相同的规则向上找，直到到达 `Global Lexical Environment`，这也就是以前一个比较流行的概念**作用域链**的本质。

> 这里我又一个疑问就是 `outerFn Lexical Environment` 中的之后不会用到的变量比如图中我用虚线标出来的 `uselessVar` 是否会在执行上下文销毁的时候被销毁，毕竟这能节省不必要浪费的内存，也就是闭包中是否只保存会被再次用到的变量，我个人认为不会再次被使用的变量是会销毁的。

## ES2021

在 `ES 2021` 中，标准有了一个较大的变动，`Environment Record` 的概念被升级，而 `LexicalEnvironment` 则放到了 `Execution Contexts` 中和 `VariableEnvironment` 同级，并且标准中说了 `The LexicalEnvironment and VariableEnvironment components of an execution context are always Environment Records.`，我个人认为相当于把 `Lexical Environment` 和 `Environment Record` 两个概念合并了，相当于把我们上面图中的 `Lexical Environment` 换成 `Environment Record`，然后 `Environment Record` 引用的内容直接放到当前的 `Environment Record` 下，`OuterEnv` 不变。其实他们的本质没什么变化，只是表述上有些不同，毕竟 `JavaScript` 引擎已经比较稳定，像作用域这种底层核心设施应该不会有什么颠覆性的变化。

## 忍者秘籍

虽然忍者秘籍也是 `18` 年的书了，可能有些人觉得有些过时，但我觉得 `JavaScript` 的基础内容都还是值得一看的，特别是对有一定基础，想继续夯实的并且能够自己区分哪些内容是不需要看的同学，看一看没什么坏处。第五章的内容我个人觉得讲的还是挺不错的，一些例子（比如那个定时器的例子）和图都能很好的帮助理解。不过我强烈建议有英文阅读能力的去读英文，中文版我真不知道说啥，看到 `in a nutshell` 被翻译成 `在果壳之下` 我也是醉了。

对于书籍的阅读我一直建议的是自己去看一看再说有没有用，这东西很主观，有些人说一些东西过时了，那可能是他掌握的很好，未必对你没用，更何况还有很多跟风的。具体到自己的情况，还是自己去读一下才能确定，如果读个几页发现确实没用，也浪费不了什么时间，而且很多书温故而知新，在不同的阶段再去读一读也能有不少收获。总之我还是建议大家多自己看，少听人说。

## 总结

本文就是根据标准对 `Lexical Environment` 和 `Environment Record` 以及闭包的一些解读，如有错漏，欢迎指正和交流。
