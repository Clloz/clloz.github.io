---
title: 'Proxy ，Reflect，代理和反射'
publishDate: '2020-10-19 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: {"src":"./javascript-logo.jpg","color":"#B4C6DA"}
---

\[toc\]

## 前言

本文主要说一说 `ES6` 添加的新内置对象，`Proxy` 和 `Reflect`，一般中文翻译为代理和反射。在编程语言中普遍存在的一个概念，`JavaScript` 在 `ES6` 中也引入了。

## Proxy

`Proxy` 是代理的意思，简单一点说就是我们用 `Proxy` 对对象进行一层包装，返回一个新的代理对象。通过这个代理对象，我们可以对原来我们操作 `Object` 对象的很多属性方法进行定制。比如普通的 `Object` 对象的属性访问，我们就用 `.` 操作符或者 `[]` 进行成员访问，但是我们没办法对这个访问进行定制，比如我希望访问对象的时候通知其他对象，这在没有 `Proxy` 的时候是非常不方便的，我们可以通过 `Object.definedProperty()` 设置访问器属性，但是每个属性都要单独设置，而 `Proxy` 是对属性访问这个行为进行定制。

从上面的描述我们可以看出，`Proxy` 是对 `JavaScript` 中的对象的一种增强，我们拥有了更强的对象定制功能。`Proxy` 能够修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”(`meta programming`)，即对编程语言进行编程。看一个最简单的例子：

```javascript
let o = {
    name: 'clloz',
    age: '28',
    site: 'clloz.com'
}

let p = new Proxy(o, {
    get: function (target, property, receiver) {
        console.log(target);
        console.log(property);
        console.log(receiver);
        return target[property]
    }
})

console.log(o.name) //clloz
console.log(p.name)
//{ name: 'clloz', age: '28', site: 'clloz.com' }
//name
//{ name: 'clloz', age: '28', site: 'clloz.com' }
//clloz
console.log(p) //{ name: 'clloz', age: '28', site: 'clloz.com' }
```

这是一个用 `Proxy` 代理 `Object` 的属性访问行为的例子，我们可以看到 `Proxy` 接受两个参数，一个是代理的目标对象，另一个是一个对象，其中放着我们定制的代理方法，`Proxy` 提供了非常丰富的方法，这里我只是使用了我们比较熟悉的属性访问。我们可以看到 `get` 方法传入了三个参数，分别对应目标对象，我们访问的属性，和 `Proxy` 对象。例子中 `receiver` 就是我们定义的 `p` 对象，`receiver === p` 将返回 `true`，但是 `receiver` 不一定是 `Proxy` 下面介绍 `handler` 会详细说明。

只有通过代理进行访问才能出发我们定制的行为，比如例子中我们直接访问 `o.name` 就只是访问对象属性。而我们打印 `Proxy` 对象，和普通的对象看上去也没有区别。我试了 `Objec.prototype.toString.call(p)`，得到的结果只是 `[object Object]`，所以目前应该没有方法直接能够判断一个对象是代理还是普通对象。

`Proxy` 是一个构造函数，并且不能直接调用，直接调用会报错：`TypeError: Constructor Proxy requires 'new'`。`Proxy` 没有 `prototype`，`Proxy.prototype` 将返回 `undefined`。`Proxy.[[prototype]]` 为 `Function.protoyep`，这一点和其他所有函数相同。

## 用法

`Proxy` 对象只有一种用法就是 `let proxy = new Proxy(target, handler)`，以构造函数的形式创建目标对象的代理，两个参数都是必须的，缺少参数将抛错 `TypeError: Cannot create proxy with a non-object as target or handler`。`target` 是要使用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。我们主要控制的就是 `handler`，所有的代理逻辑都在 `handler` 中。如果 `hanlder` 为空对象，那么就相当于我们没有任何代理逻辑，通过代理访问和访问源对象就没区别，不过这样做并没有什么实际意义。

```javascript
let o = {
    name: 'clloz',
    age: '28',
    site: 'clloz.com'
}

let p = new Proxy(o, {})

console.log(p.name) //clloz
```

有一个小技巧是我们可以将代理对象设置为目标对象的一个属性，这样我们可以在目标对象上直接访问到代理对象。`let object = { proxy: new Proxy(target, handler) };`

代理对象也可以作为其他对象的原型：

```javascript
let o = {
    name: 'clloz',
    age: '28',
    site: 'clloz.com'
}

let p = new Proxy(o, {})

let m = Object.create(p)
console.log(m.name) //clloz

console.log(p.__proto__ === Object.prototype)
```

上面我们说过，`Proxy.prototype` 是 `undefined`，按照通常的原型链规则推断，`p` 的 `[[prototype]]` 应该是指向其构造函数的 `prototype` 属性，但是在 `Proxy` 这里，`p` 的 `[[prototype]]` 指向的是 `Object.prototype`。

> 综合上面的一些结论，其实我们完全可以把代理理解为一个功能更强大的**“普通对象”**，只是他的一些行为可能不完全和普通对象一致，比如 `this` 的指向。

* * *

`Proxy` 代理的核心就是 `handler`，`handler` 对象是一个容纳一批特定属性的占位符对象。它包含有 `Proxy` 的各个捕获器（`trap`）。所有的捕捉器是可选的。如果没有定义某个捕捉器，那么就会保留源对象的默认行为。所以下面我们介绍一下 `Proxy` 都提供了哪些捕获器。

##### handler.get()

`handler.get(target, key, receiver)` 拦截属性读取操作。`target` 为代理的目标对象，`property` 为被读取的属性名。第三个参数 `receiver` 为最初被调用的对象，即让我们在 `getter` 知道是谁在访问。通常是 `proxy` 本身，但 `handler` 的 `get` 方法也有可能在原型链上，或以其他方式被间接地调用（因此不一定是 `proxy` 本身）看下面的例子：

```javascript
let o = {
    name: 'clloz',
    age: '28',
    site: 'clloz.com'
}

let p = new Proxy(o, {
    get: function(target, property, receiver) {
        console.log(receiver === m) //true
        return target[property];
    }
})

let m = Object.create(p)
console.log(m.name) //clloz
```

我们可以看到，我们以 `Proxy` 为原型创建了一个对象 `m`，当访问 `m` 上没有的属性的时候就会到原型链上查找，就触发了 `get` 捕捉器，我们在其中的 `receiver === m` 将返回 `true`。这里要特别注意，不要直接执行 `console.log(receiver)`，否则将会出现栈溢出的状况。其中原因就是，`receiver` 是一个对象，我们输出这个对象，又会执行对象的 `get` 操作，进入无限的循环。不过如果我们直接输出 `p.name` 则不会有这个错误，可能是因为 `Proxy` 本身没有 `get` 操作。从这个例子中我们也可以看到，`get` 方法是可以继承的。

`get` 方法会拦截目标对象的以下操作:

- 访问属性: `proxy[foo]`和 `proxy.bar`
- 访问原型链上的属性: `Object.create(proxy)[foo]`
- `Reflect.get()`

如果违背了以下的约束，`proxy` 会抛出 `TypeError`:

- 如果要访问的目标属性是不可写以及不可配置的，则返回的值必须与该目标属性的值相同。
- 如果要访问的目标属性没有配置访问方法，即 `get` 方法是 `undefined` 的，则返回值必须为 `undefined`。

利用代理的 `get` 捕捉器我们可以实现很多有趣的功能，比如用负数索引读取数组：

```javascript
function createArray(...elements) { let handler = {
    get(target, propKey, receiver) {
        let index = Number(propKey);
        if (index < 0) {
            propKey = String(target.length + index);
        }
        return Reflect.get(target, propKey, receiver); }
    };
    let target = []; target.push(...elements);
    return new Proxy(target, handler);
}
let arr = createArray('a', 'b', 'c');
console.log(arr[-1]) // c
```

利用 `Proxy`，可以将读取属性的操作( `get` )，转变为执行某个函数，从而实现属性的链式操作。

```javascript
var pipe = (function () {
    return function (value) {
        var funcStack = [];
        var oproxy = new Proxy({} , {
            get : function (pipeObject, fnName) {
                if (fnName === 'get') {
                    return funcStack.reduce(function (val, fn) { 
                        return fn(val);
                    },value); 
                }
                funcStack.push(window[fnName]);
                return oproxy;
            }
        });
        return oproxy;
    }
}());
var double = n => n * 2;
var pow = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;
pipe(3).double.pow.reverseInt.get; // 63
```

如果一个属性不可配置(`configurable`)和不可写(`writable`)，则该属性不能被代理，通过 `Proxy` 对象访问该属性会报错。

```javascript
const target = Object.defineProperties({}, { 
    foo: {
        value: 123,
        writable: false,
        configurable: false
    }, 
});
const handler = {
    get(target, propKey) {
        return 'abc';
    }
};
const proxy = new Proxy(target, handler);
proxy.foo // TypeError: Invariant check failed
```

##### handler.set()

`handler.set(target, key, value, receiver)` 属性设置操作的捕捉器，返回一个布尔值。返回 `true` 代表属性设置成功。在严格模式下，如果 `set()` 方法返回 `false`，那么会抛出一个 `TypeError` 异常。

该方法会拦截目标对象的以下操作:

- 指定属性值：`proxy[foo] = bar` 和 `proxy.foo = bar`
- 指定继承者的属性值：`Object.create(proxy)[foo] = bar`
- `Reflect.set()`

如果违背以下的约束条件，`proxy` 会抛出一个 `TypeError` 异常：

- 若目标属性是一个不可写及不可配置的数据属性，则不能改变它的值。
- 如果目标属性没有配置存储方法，即 `[[Set]]` 属性的是 `undefined`，则不能设置它的值。
- 在严格模式下，如果 `set()` 方法返回 `false`，那么也会抛出一个 `TypeError` 异常。

利用 `set` 可以进行数据验证，还可以进行数据绑定，即每当对象发生变化时，会自动更新 `DOM`。有时，我们会在对象上面设置内部属性，属性名的第一个字符使用下划线开头，表示这些属性不应该被外部使用。结合 `get` 和 `set` 方法，就可以做到防止这些内部 属性被外部读写。

```javascript
var handler = {
    get (target, key) {
        invariant(key, 'get');
        return target[key];
    },
    set (target, key, value) {
        invariant(key, 'set');
        target[key] = value;
        return true;
} };
function invariant (key, action) {
    if (key[0] === '_') {
        throw new Error(`Invalid attempt to ${action} private "${key} " property`);
    }
}
var target = {};
var proxy = new Proxy(target, handler);
proxy._prop
// Error: Invalid attempt to get private "_prop" property 
proxy._prop = 'c'
// Error: Invalid attempt to set private "_prop" property
```

`set` 可以监听数组的变化，包括一些 `Array.prototype` 上的方法，这也是 `vue3.0` 要使用 `Proxy` 来替换 `Object.defineProperty` 来实现响应式的原因之一。看下面的代码：

```javascript
let a = [1,2,3];
let p = new Proxy(a, {
    get(target, key, receiver) {
        console.log('this is getter ' + key)
        return Reflect.get(target, key);
    },
    set(target, key, val, receiver) {
        console.log('this is setter ' + key)
        return Reflect.set(target, key, val, receiver)
    }
})
p.push(10)
//this is getter push
//this is getter length
//this is setter 3
//this is setter length

console.log(p)
//[ 1, 2, 3, 10 ]

console.log(p[0])
//this is getter 0
//1

console.log(p.length)
//this is getter length
//3

p.length = 0 // this is setter length
```

可以看到我们调用 `push` 方法，访问了两次 `getter`，第一次访问的 `key` 是 `push`，第二次则是 `length`。我们访问 `p` 从外部看到的效果和访问 `a` 没有区别，甚至我们直接访问和操作 `length` 也能够触发 `getter` 和 `setter`，因为 `push` 方法和 `length` 也是数组的属性和方法（虽然方法是在原型上的，但依然是通过该数组访问的），这就是 `Proxy` 提供的元编程的强大能力。

##### handler.apply()

`handler.apply(target, thisArg, argumentsList)` 方法用于拦截函数的调用。该捕捉器接受三个参数：`target` 目标对象，`thisArg` 被调用时的 `this` 上下文，`argumentsList` 被调用时的参数数组。

该方法会拦截目标对象的以下操作:

- `proxy(...args)`
- `Function.prototype.apply()` 和 `Function.prototype.call()`
- `Reflect.apply()`

如果违反了以下约束，代理将抛出一个 `TypeError`：`target` 必须是可被调用的。也就是说，它必须是一个函数对象。

```javascript
var p = new Proxy(function() {}, {
    apply: function(target, thisArg, argumentsList) {
        console.log('called: ' + argumentsList.join(', '));// "called: 1, 2, 3"
        return argumentsList[0] + argumentsList[1] + argumentsList[2];
    }
});

console.log(p(1, 2, 3)); // 6
```

##### handler.has()

`handler.has(target, prop)` 该方法用来拦截 `HasProperty` 操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是 `in` 运算符。`handler.has` 方法可以看作是针对 `in` 操作的钩子。

这个钩子可以拦截下面这些操作:

- 属性查询: `foo in proxy`
- 继承属性查询: `foo in Object.create(proxy)`
- `with` 检查: `with(proxy) { (foo); }`
- `Reflect.has()`

如果违反了下面这些规则, `proxy` 将会抛出 `TypeError`:

- 如果目标对象的某一属性本身不可被配置，则该属性不能够被代理隐藏.
- 如果目标对象为不可扩展对象，则该对象的属性不能够被代理隐藏

```javascript
var p = new Proxy({}, {
    has: function(target, prop) {
        console.log('called: ' + prop); // "called: a"
        return true;
    }
});

console.log('a' in p); // true
console.log(Reflect.has(p, 'a')) //和上一句代码一样被拦截
```

对象不可扩展或属性不可配置拦截 `has` 将抛错，所以如果我们不希望抛错可能需要对属性或者对象进行判断：

```javascript
var obj = { a: 10 };
Object.preventExtensions(obj);
var p = new Proxy(obj, {
    has: function(target, prop) {
        return false;
    }
});

'a' in p; // TypeError: 'has' on proxy: trap returned falsish for property 'a' but the proxy target is not extensible
```

注意的是 `has` 方法拦截的是 `hasProperty`，而不是 `hasOwnProperty`，也就是说原型上的属性访问也会拦截。还有一点就是虽然 `for ... in` 虽然也用到了 `in` 运算符，但是 `has` 方法不会拦截 `for ... in` 循环。

##### handler.construct()

`handler.construct(target, argumentsList, newTarget)` 方法用于拦截 `new` 操作符. 为了使 `new` 操作符在生成的 `Proxy` 对象上生效，用于初始化代理的目标对象自身必须具有 `[[Construct]]` 内部方法（即 `new target` 必须是有效的）。

三个参数将被传入 `construct` 方法：`target` 目标对象，`argumentsList` 构造函数的参数列表，`newTarget` 最初被调用的构造函数。

该拦截器可以拦截以下操作:

- `new proxy(...args)`
- `Reflect.construct()`

如果违反以下约定，代理将会抛出错误 `TypeError`: 必须返回一个对象。`target` 必须由一个有效的 `constructor` 供 `new` 调用，一般情况下，目标对象要是一个函数。

两个简单的示例，演示拦截 `new` 操作以及违反约定的情况：

```javascript
//拦截new操作
var p = new Proxy(function() {}, {
  construct: function(target, argumentsList, newTarget) {
    console.log('called: ' + argumentsList.join(', '));// "called: 1"
    return { value: argumentsList[0] * 10 };
  }
});

console.log(new p(1).value); // 10

//违反约定，没有返回对象将抛错
var p = new Proxy(function() {}, {
  construct: function(target, argumentsList, newTarget) {
    return 1;
  }
});

new p(); // TypeError is thrown

//目标对象不能new
var p = new Proxy({}, {
  construct: function(target, argumentsList, newTarget) {
    return {};
  }
});

new p(); // TypeError is thrown, "p" is not a constructor
```

##### handler.deleteProperty()

`handler.deleteProperty(target, property)` 方法用于拦截对对象属性的 `delete` 操作。`deleteProperty` 必须返回一个 `Boolean` 类型的值，表示了该属性是否被成功删除。如果这个方法抛出错误或者返回 `false` ，当前属性就无法被 `delete` 命令删除。

该方法会拦截以下操作:

- 删除属性: `delete proxy[foo]` 和 `delete proxy.foo`
- `Reflect.deleteProperty()`

如果违背了以下不变量，`proxy` 将会抛出一个 `TypeError`: 如果目标对象的属性是不可配置的，那么该属性不能被删除。

```javascript
var p = new Proxy({}, {
  deleteProperty: function(target, prop) {
    console.log('called: ' + prop);
    return true;
  }
});

delete p.a; // "called: a"
```

##### handler.defineProperty()

`handler.defineProperty(target, property, descriptor)` 该方法用于拦截对对象的 `Object.defineProperty()` 操作。该方法接受三个参数：`target` 目标对象，`prop` 待检索其描述符的属性名，`descriptor` 属性描述符。`defineProperty` 方法必须以一个 `Boolean` 返回，表示定义该属性的操作成功与否。

该方法会拦截目标对象的以下操作 :

- `Object.defineProperty()`
- `Reflect.defineProperty()`
- `proxy.property='value'`

如果违背了以下的不变量，`proxy` 会抛出 `TypeError`:

- 如果目标对象不可扩展， 将不能添加属性。
- 不能添加或者修改一个属性为不可配置的，如果它不作为一个目标对象的不可配置的属性存在的话。
- 如果目标对象存在一个对应的可配置属性，这个属性可能不会是不可配置的。
- 如果一个属性在目标对象中存在对应的属性，那么 `Object.defineProperty(target, prop, descriptor)` 将不会抛出异常。
- 在严格模式下， `false` 作为 `handler.defineProperty` 方法的返回值的话将会抛出 `TypeError` 异常。

```javascript
var p = new Proxy({}, {
    defineProperty: function(target, prop, descriptor) {
        console.log('called: ' + prop);
        descriptor.value = 'clloz' //修改数据属性值
        descriptor.configurable = true; //如果该属性不可配置，则这一句将抛错
        return Reflect.defineProperty(target, prop, descriptor);
    }
});

var desc = { configurable: true, enumerable: true, value: 10, writable: true };
Object.defineProperty(p, 'a', desc); // "called: a"

console.log(p.a)
```

当调用 `Object.defineProperty()` 或者 `Reflect.defineProperty()`，传递给 `defineProperty` 的 `descriptor` 有一个限制 - 只有以下属性才有用，非标准的属性将会被无视 :

- `enumerable`
- `configurable`
- `writable`
- `value`
- `get`
- `set`

##### handler.getOwnPropertyDescriptor()

`handler.getOwnPropertyDescriptor(target, prop)` 方法是 `Object.getOwnPropertyDescriptor()` 的钩子。`getOwnPropertyDescriptor` 方法必须返回一个 `object` 或 `undefined`。

这个捕捉器可以拦截这些操作：

- `Object.getOwnPropertyDescriptor()`
- `Reflect.getOwnPropertyDescriptor()`

如果下列不变量被违反，代理将抛出一个 TypeError：

- `getOwnPropertyDescriptor` 必须返回一个 `object` 或 `undefined`。
- 如果属性作为目标对象的不可配置的属性存在，则该属性无法报告为不存在。
- 如果属性作为目标对象的属性存在，并且目标对象不可扩展，则该属性无法报告为不存在。
- 如果属性不存在作为目标对象的属性，并且目标对象不可扩展，则不能将其报告为存在。
- 属性不能被报告为不可配置，如果它不作为目标对象的自身属性存在，或者作为目标对象的可配置的属性存在。
- `Object.getOwnPropertyDescriptor(target)`的结果可以使用 `Object.defineProperty` 应用于目标对象，也不会抛出异常。

```javascript
var p = new Proxy({ a: 20}, {
  getOwnPropertyDescriptor: function(target, prop) {
    console.log('called: ' + prop); // "called: a"
    return { configurable: true, enumerable: true, value: 10 };
  }
});

console.log(Object.getOwnPropertyDescriptor(p, 'a').value); // 10

//属性存在，不能返回 undefined
var obj = { a: 10 };
Object.preventExtensions(obj);
var p = new Proxy(obj, {
  getOwnPropertyDescriptor: function(target, prop) {
    return undefined;
  }
});

Object.getOwnPropertyDescriptor(p, 'a'); // TypeError is thrown
```

##### handler.getPrototypeOf()

`handler.getPrototypeOf(target)` 该方法当读取代理对象的原型时，该方法就会被调用。`getPrototypeOf` 方法的返回值必须是一个对象或者 `null`。

在 `JavaScript` 中，下面这五种操作（方法/属性/运算符）可以触发 `JS` 引擎读取一个对象的原型，也就是可以触发 `getPrototypeOf()` 代理方法的运行：

- `Object.getPrototypeOf()`
- `Reflect.getPrototypeOf()`
- `__proto__`
- `Object.prototype.isPrototypeOf()`
- `instanceof`

如果遇到了下面两种情况，`JS` 引擎会抛出 `TypeError` 异常：

- `getPrototypeOf()` 方法返回的不是对象也不是 `null`。
- 目标对象是不可扩展的，且 `getPrototypeOf()` 方法返回的原型不是目标对象本身的原型。

```javascript
//五种触发 getPrototypeOf() 的方式
var obj = {};
var p = new Proxy(obj, {
    getPrototypeOf(target) {
        return Array.prototype;
    }
});
console.log(
    Object.getPrototypeOf(p) === Array.prototype,  // true
    Reflect.getPrototypeOf(p) === Array.prototype, // true
    p.__proto__ === Array.prototype,               // true
    Array.prototype.isPrototypeOf(p),              // true
    p instanceof Array                             // true
);

//异常情况
var obj = {};
var p = new Proxy(obj, {
    getPrototypeOf(target) {
        return "foo";
    }
});
Object.getPrototypeOf(p); // TypeError: "foo" is not an object or null

var obj = Object.preventExtensions({});
var p = new Proxy(obj, {
    getPrototypeOf(target) {
        return {}; // 想要正确返回这里应该是 Object.prototype
    }
});
Object.getPrototypeOf(p); // TypeError: 'getPrototypeOf' on proxy: proxy target is non-extensible but the trap did not return its actual prototype
```

##### handler.isExtensible()

`handler.isExtensible(target)` 该方法用于拦截对对象的 `Object.isExtensible()`。`isExtensible` 方法必须返回一个 `Boolean` 值或可转换成 `Boolean` 的值。

该方法会拦截目标对象的以下操作:

- `Object.isExtensible()`
- `Reflect.isExtensible()`

如果违背了以下的约束，`proxy` 会抛出 `TypeError`: `Object.isExtensible(proxy)` 必须同 `Object.isExtensible(target)`返回相同值。也就是必须返回 `true` 或者为 `true` 的值,返回 `false` 和为 `false` 的值都会报错。

```javascript
var p = new Proxy({}, {
  isExtensible: function(target) {
    console.log('called'); // "called"
    return true;//也可以return 1;等表示为true的值
  }
});

console.log(Object.isExtensible(p)); // true

//违反约束
var p = new Proxy({}, {
  isExtensible: function(target) {
    return false;//return 0;return NaN等都会报错
  }
});

Object.isExtensible(p); // TypeError is thrown
```

##### handler.ownKeys()

`handler.ownKeys(target)` 方法用来拦截对象自身属性的读取操作。`this` 被绑定在 `handler` 上。`ownKeys` 方法必须返回一个可枚举对象。

该拦截器可以拦截以下操作::

- `Object.getOwnPropertyNames()`
- `Object.getOwnPropertySymbols()`
- `Object.keys()`
- `Reflect.ownKeys()`

如果违反了下面的约束，`proxy` 将抛出错误 `TypeError`:

- `ownKeys` 的结果必须是一个数组.
- 数组的元素类型要么是一个 `String` ，要么是一个 `Symbol`.
- 结果列表必须包含目标对象的所有不可配置（`non-configurable` ）、自有（`own`）属性的 `key`.
- 如果目标对象不可扩展，那么结果列表必须包含目标对象的所有自有（`own`）属性的 `key`，不能有其它值.

使用 `Object.keys` 方法时，有三类属性会被 `ownKeys` 方法自动过滤，不会返回。

- 目标对象上不存在的属性
- 属性名为 `Symbol` 值
- 不可遍历( `enumerable` )的属性

```javascript
let target = {
    a: 1,
    b: 2,
    c: 3, 
    [Symbol.for('secret')]: '4',
};
Object.defineProperty(target, 'key', { 
    enumerable: false,
    configurable: true,
    writable: true,
    value: 'static'
});
let handler = {
    ownKeys(target) {
    return ['a', 'd', Symbol.for('secret'), 'key']; }
};
let proxy = new Proxy(target, handler);
console.log(Object.keys(proxy)) // ['a']
```

上面代码中，`ownKeys` 方法之中，显式返回不存在的属性( `d` )、`Symbol` 值 (`Symbol.for('secret')`)、不可遍历的属性( `key` )，结果都被自动过滤掉。

```javascript
//拦截 Object.getOwnPropertyNames()
var p = new Proxy({}, {
  ownKeys: function(target) {
    console.log('called'); // "called"
    return ['a', 'b', 'c'];
  }
});

console.log(Object.getOwnPropertyNames(p)); // [ 'a', 'b', 'c' ]

//违反约定
var obj = {};
Object.defineProperty(obj, 'a', { 
  configurable: false, 
  enumerable: true, 
  value: 10 }
);

var p = new Proxy(obj, {
  ownKeys: function(target) {
    return [123, 12.5, true, false, undefined, null, {}, []];
  }
});

console.log(Object.getOwnPropertyNames(p)); 

// TypeError: proxy [[OwnPropertyKeys]] 必须返回一个数组 
// 数组元素类型只能是String或Symbol

//必须包含目标对象的所有不可配置属性
var obj = {}; Object.defineProperty(obj, 'a', {
    configurable: false,
    enumerable: true,
    value: 10 }
);
var p = new Proxy(obj, {
    ownKeys: function(target) {
        return ['b'];
    }
});
Object.getOwnPropertyNames(p)
// Uncaught TypeError: 'ownKeys' on proxy: trap result did not i nclude 'a'

//若对象不可配置，ownKeys 方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余的属性，否则报错
var obj = { a: 1};
Object.preventExtensions(obj);
var p = new Proxy(obj, {
    ownKeys: function(target) {
        return ['a', 'b'];
    }
});
Object.getOwnPropertyNames(p)
// Uncaught TypeError: 'ownKeys' on proxy: trap returned extra k eys but proxy target is non-extensible
```

##### handler.preventExtensions()

`handler.preventExtensions(target)` 方法用于设置对 `Object.preventExtensions()` 的拦截.该方法必须返 回一个布尔值，否则会被自动转为布尔值。

这个捕捉器可以拦截这些操作:

- `Object.preventExtensions()`
- `Reflect.preventExtensions()`

如果违反了下列规则, `proxy` 则会抛出一个 `TypeError`: 如果目标对象是可扩展的，那么只能返回 `false`。

```javascript
var p = new Proxy({}, {
  preventExtensions: function(target) {
    console.log('called'); // "called"
    Object.preventExtensions(target);
    return true;
  }
});

console.log(Object.preventExtensions(p)); // false

//违反约定
var p = new Proxy({}, {
  preventExtensions: function(target) {
    return true;
  }
});

Object.preventExtensions(p); // 抛出类型错误
```

##### handler.setPrototypeOf()

`handler.setPrototypeOf(target, prototype)` 方法主要用来拦截 `Object.setPrototypeOf()`。如果成功修改了`[[Prototype]]`, `setPrototypeOf` 方法返回 `true`,否则返回 `false`。

这个方法可以拦截以下操作:

- `Object.setPrototypeOf()`
- `Reflect.setPrototypeOf()`

如果违反了下列规则，则 `proxy` 将抛出一个 `TypeError`: 如果 `target` 不可扩展, 原型参数必须与 `Object.getPrototypeOf(target)` 的值相同.

##### Proxy.revocable()

`Proxy.revocable()` 方法可以用来创建一个可撤销的代理对象。该方法的返回值是一个对象，其结构为： `{"proxy": proxy, "revoke": revoke}`，`proxy` 表示新生成的代理对象本身，和用一般方式 `new Proxy(target, handler)` 创建的代理对象没什么不同，只是它可以被撤销掉。`revoke` 表示撤销方法，调用的时候不需要加任何参数，就可以撤销掉和它一起生成的那个代理对象。

一旦某个代理对象被撤销，它将变得几乎完全不可调用，在它身上执行任何的可代理操作都会抛出 `TypeError` 异常（注意，可代理操作一共有 `13` 种，执行这 `13` 种操作以外的操作不会抛出异常）。一旦被撤销，这个代理对象便不可能被直接恢复到原来的状态，同时和它关联的目标对象以及处理器对象都有可能被垃圾回收掉。再次调用撤销方法 `revoke()` 则不会有任何效果，但也不会报错。

`Proxy.revocable` 的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

```javascript
var revocable = Proxy.revocable({}, {
  get(target, name) {
    return "[[" + name + "]]";
  }
});
var proxy = revocable.proxy;
proxy.foo;              // "[[foo]]"

revocable.revoke();

console.log(proxy.foo); // 抛出 TypeError
proxy.foo = 1           // 还是 TypeError
delete proxy.foo;       // 又是 TypeError
typeof proxy            // "object"，因为 typeof 不属于可代理操作
```

## this 问题

在 `let p = new Proxy(target, handler)` 中，我们上面介绍的 `handler` 中的捕捉器中的 `this` 都是指向 `handler` 对象。而通过代理访问的 `target` 中的的方法如果有 `this`，指向的则是生成的 `Proxy` 对象。

```javascript
const target = {
    m: function () {
    console.log(this === proxy); }
};
const handler = {};
const proxy = new Proxy(target, handler);
target.m() // false 
proxy.m() // true
```

所以虽然 `Proxy` 可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致。主要原因就是在 `Proxy` 代理的情况下，目标对象内部的 `this` 关键字会指向 `Proxy` 代理。

```javascript
const _name = new WeakMap();
class Person {
    constructor(name) {
        _name.set(this, name);
    }
    get name() {
        return _name.get(this);
    }
}
const jane = new Person('Jane');
jane.name // 'Jane'
const proxy = new Proxy(jane, {});
proxy.name // undefined

console.log(Object.getOwnPropertyDescriptor(jane.__proto__, 'name'))
//{
//  get: [Function: get name],
//  set: undefined,
//  enumerable: false,
//  configurable: true
//}
```

上面代码中，目标对象 `jane` 的 `name` 属性，实际保存在外部对象 `_name` 上面，通过 `this` 键区分。由于通过 `proxy.name` 访问时，`this` 指向 `proxy`，导致无法取到值，所以返回 `undefined`。

所以当我们使用代理的时候需要注意源对象方法中的 `this`。此外，有些原生对象的内部属性，只有通过正确的 `this` 才能拿到，所以 `Proxy` 也 无法代理这些原生对象的属性。

```javascript
const target = new Date();
const handler = {};
const proxy = new Proxy(target, handler);
proxy.getDate();
// TypeError: this is not a Date object.

const target = new Date('2015-01-01'); const handler = {
    get(target, prop) {
        if (prop === 'getDate') {
            return target.getDate.bind(target); 
        }
        return Reflect.get(target, prop); 
    }
};
const proxy = new Proxy(target, handler);
proxy.getDate() // 1
```

## Reflect 反射

所谓的 `Reflect` 反射，一般是用在静态语言中的概念。在计算机学中，反射（英语：`reflection`）是指计算机程序在运行时（`runtime`）可以访问、检测和修改它本身状态或行为的一种能力。用比喻来说，反射就是程序在运行的时候能够“观察”并且修改自己的行为。这是维基百科给出的定义。

比如我们经常使用的 `Object.getOwnPropertyDescriptor`，`Object.keys()` 在其他语言中都会被归类于反射的范畴。那么为什么 `ES6` 要推出一个 `Reflect` 对象呢，而且这个对象的方法也都是一些原本就存在的方法。我个人认为是早期的 `JavaScript` 标准设计没有想到这个问题，在逐步推出一些比较重要的静态方法的过程中就直接通过 `Object`，`Function` 等内置对象暴露出来（为什么是它们，因为他们在所有对象和函数的原型链上，几乎所有对象都能通过原型链访问到他们的方法），在 `API` 逐渐增多的过程中，让这些原本功能比较明确的对象越来越冗余，`API` 结构也非常不清晰，甚至有些混乱。

所以到了 `ES6` 大概制定委员会决定解决这个问题，把一些应该归类于反射机制的方法单独用一个对象来暴露，于是就有了 `Reflect`。以下是阮一峰老师的 《ES6标准入门》总结的 `Reflect` 的设计目的：

1. 将 `Object` 对象的一些明显属于语言内部的方法（比如 `Object.defineProperty`），放到 `Reflect` 对象上。目前，因为兼容性的问题，很多方法在 `Object` 和 `Reflect` 上同时存在，但是以后还会推出新的方法，到时候只会在 `Reflect` 对象上添加。
2. 修改某些不合理的 `API`，比如 `Object.defineProperty(obj, name, desc)`，在无法定义属性时，会抛出一个错误，而 `Reflect.defineProperty(obj, name, desc)` 则会返回 `false`。
3. 让 `Object` 操作都变成函数行为。某些 `Object` 操作是命令式，比如 `name in obj` 和 `delete obj[name]`，而 `Reflect.has(obj, prop)` 和 `Reflect.deleteProperty(obj, prop)` 是函数行为。
4. `Reflect` 的方法和 `Proxy` 的方法一一对应，它们将成为我们进行元编程修改默认行为的固定搭档。无论我在在 `Proxy` 内部如何设计逻辑，我们总能通过 `Reflect` 获取默认行为。

我个人进行一个总结就是，让 `JavaScript` 的 `API` 设计更规范，保持风格的统一，让每个对象都更纯粹，各司其职，更好记更好用。

## 用法

与大多数全局对象不同 `Reflect` 并非一个构造函数，所以不能通过new运算符对其进行调用，或者将 `Reflect` 对象作为一个函数来调用。`Reflect` 的所有属性和方法都是静态的（就像 `Math` 对象）。

`Reflect` 对象提供了 `13` 种静态方法，这些方法与 `proxy handler methods` 的命名相同.其中的一些方法与 `Object` 相同, 尽管二者之间存在某些细微上的差别 ，差别可以参考 [比较 Reflect 和 Object 方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/%E6%AF%94%E8%BE%83_Reflect_%E5%92%8C_Object_%E6%96%B9%E6%B3%95 "比较 Reflect 和 Object 方法")

- `Reflect.apply(target, thisArg, args)`
- `Reflect.construct(target, args)`
- `Reflect.get(target, name, receiver)`
- `Reflect.set(target, name, value, receiver)`
- `Reflect.defineProperty(target, name, desc)`
- `Reflect.deleteProperty(target, name)`
- `Reflect.has(target, name)`
- `Reflect.ownKeys(target)`
- `Reflect.isExtensible(target)`
- `Reflect.preventExtensions(target)`
- `Reflect.getOwnPropertyDescriptor(target, name)`
- `Reflect.getPrototypeOf(target)`
- `Reflect.setPrototypeOf(target, prototype)`

##### Reflect.get()

`Reflect.get(target, propertyKey[, receiver])` 方法与从 对象 (`target[propertyKey]`) 中读取属性类似，但它是通过一个函数执行来操作的。第三个可选参数表示如果 `target` 对象中指定了 `getter`，`receiver` 则为 `getter` 调用时的 `this` 值。该方法查找并返回 `target` 对象的 `name` 属性，如果没有该属性，则返回 `undefined` 。如果目标值类型不是 `Object`，则抛出一个 `TypeError`。

```javascript
// Object
var obj = { x: 1, y: 2 };
Reflect.get(obj, "x"); // 1

// Array
Reflect.get(["zero", "one"], 1); // "one"

// Proxy with a get handler
var x = {p: 1};
var obj = new Proxy(x, {
  get(t, k, r) { return k + "bar"; }
});
Reflect.get(obj, "foo"); // "foobar"
```

关于第三个参数 `receiver`，我们需要注意，如果 `target` 是一个 `Proxy` 并且拦截了 `get` 方法，那么这里的 `receiver` 是不会生效的，`Proxy` 中的 `get` 还是指向 `handler` 对象。其实只要属性是通过 `Proxy` 的 `get` 访问到的都是一样的效果，`Proxy` 是可以被继承的。

```javascript
let thisObj = {a: 1, b:2}
let a = {
    get name() {
        console.log(this);
    }
};
let p = new Proxy(a, {
    get(target, key, receiver) {
        console.log(this);
    }
})

let b = Object.create(p)

Reflect.get(a, 'name', thisObj); // { a: 1, b: 2 }
Reflect.get(p, 'name', thisObj); // { get: [Function: get] }
Reflect.get(b, 'name', thisObj); // { get: [Function: get] }
```

##### Reflect.set()

静态方法 `Reflect.set(target, propertyKey, value[, receiver])` 工作方式就像在一个对象上设置一个属性。最后一个可选参数表示如果遇到 `setter`，`receiver` 则为 `setter` 调用时的 `this` 值。返回一个 `Boolean` 值表明是否成功设置属性。如果目标值类型不是 `Object`，则抛出一个 `TypeError`。它的作用和属性访问器形式的赋值一样，但是是以函数的形式。

```javascript
// Object
var obj = {};
Reflect.set(obj, "prop", "value"); // true
obj.prop; // "value"

// Array
var arr = ["duck", "duck", "duck"];
Reflect.set(arr, 2, "goose"); // true
arr[2]; // "goose"

// It can truncate an array.
Reflect.set(arr, "length", 1); // true
arr; // ["duck"];

// With just one argument, propertyKey and value are "undefined".
var obj = {};
Reflect.set(obj); // true
Reflect.getOwnPropertyDescriptor(obj, "undefined");
// { value: undefined, writable: true, enumerable: true, configurable: true }
```

> `receiver` 的处理和 `Reflect.get()` 类似。

##### Reflect.has()

`Reflect.has(target, propertyKey)` 的功能和 `in` 操作符完全相同，如果指定的属性在指定的对象或其原型链中，返回 `true`。如果第一个参数不是对象， `Reflect.has` 和 `in` 运算符都会报错。返回值是一个 `Boolean` 指示是否存在此属性。

```javascript
Reflect.has({x: 0}, "x"); // true
Reflect.has({x: 0}, "y"); // false

// 如果该属性存在于原型链中，返回true 
Reflect.has({x: 0}, "toString");

// Proxy 对象的 .has() 句柄方法
obj = new Proxy({}, {
  has(t, k) { return k.startsWith("door"); }
});
Reflect.has(obj, "doorbell"); // true
Reflect.has(obj, "dormitory"); // false
```

##### Reflect.deleteProperty()

`Reflect.deleteProperty(target, propertyKey)` 方法等同于 `delete obj[name]` ，用于删除对象的属性，区别就是该方法是一个函数。返回值是一个 `Boolean` 值表明该属性是否被成功删除，如果删除成功，或者被删除的属性不存在，返回 `true`，删除失败，被删除的属性依然存在，返回 `false`。如果目标值类型不是 `Object`，则抛出一个 `TypeError`。

```javascript
Reflect.getPrototypeOf({}); // Object.prototype
Reflect.getPrototypeOf(Object.prototype); // null
Reflect.getPrototypeOf(Object.create(null)); // null

// 如果参数为 Object，返回结果相同
Object.getPrototypeOf({})   // Object.prototype
Reflect.getPrototypeOf({})  // Object.prototype

// 在 ES5 规范下，对于非 Object，抛异常
Object.getPrototypeOf('foo')   // Throws TypeError
Reflect.getPrototypeOf('foo')  // Throws TypeError

// 在 ES2015 规范下，Reflect 抛异常, Object 强制转换非 Object
Object.getPrototypeOf('foo')   // String.prototype
Reflect.getPrototypeOf('foo')  // Throws TypeError

// 如果想要模拟 Object 在 ES2015 规范下的表现，需要强制类型转换
Reflect.getPrototypeOf(Object('foo'))  // String.prototype


```

```javascript
var obj = { x: 1, y: 2 };
Reflect.deleteProperty(obj, "x"); // true
obj; // { y: 2 }

var arr = [1, 2, 3, 4, 5];
Reflect.deleteProperty(arr, "3"); // true
arr; // [1, 2, 3, , 5]

// 如果属性不存在，返回 true
Reflect.deleteProperty({}, "foo"); // true

// 如果属性不可配置，返回 false
Reflect.deleteProperty(Object.freeze({foo: 1}), "foo"); // false
```

##### Reflect.construct()

`Reflect.construct(target, argumentsList[, newTarget])` 方法的行为有点像 `new` 操作符构造函数 ， 相当于运行 `new target(...args)`，这提供了一种不使 用 ，来调用构造函数的方法。`target` 是被运行的目标构造函数，`argumentsList` 是目标构造函数调用时的参数，第三个可选参数 `newTarget`，作为新创建对象的原型对象的 `constructor` 属性， 参考 `new.target` 操作符，默认值为 `target`。

返回值是以 `target`（如果 `newTarget` 存在，则为 `newTarget`）函数为构造函数，`argumentList` 为其初始化参数的对象实例。如果 `target` 或者 `newTarget` 不是构造函数，抛出 `TypeError` 异常。

使用 `Reflect.construct` 和 `Object.create()` 创建对象有如下不同：当使用 `Object.create()` 和 `Function.prototype.apply()` 时，如果不使用 `new` 操作符调用构造函数，构造函数内部的`new.target` 值会指向 `undefined`。当调用 `Reflect.construct()` 来创建对象，`new.target` 值会自动指定到 `target`（或者 `newTarget`，前提是 `newTarget` 指定了）。

##### Reflect.getPrototypeOf()

静态方法 `Reflect.getPrototypeOf(target)` 与 `Object.getPrototypeOf()` 方法几乎是一样的。都是返回指定对象的原型（即内部的 `[[Prototype]]` 属性的值）。返回值为给定对象的原型。如果给定对象没有继承的属性，则返回 `null`。如果目标值类型不是 `Object`，则抛出一个 `TypeError`。

```javascript
Reflect.getPrototypeOf({}); // Object.prototype
Reflect.getPrototypeOf(Object.prototype); // null
Reflect.getPrototypeOf(Object.create(null)); // null

// 如果参数为 Object，返回结果相同
Object.getPrototypeOf({})   // Object.prototype
Reflect.getPrototypeOf({})  // Object.prototype

// 在 ES5 规范下，对于非 Object，抛异常
Object.getPrototypeOf('foo')   // Throws TypeError
Reflect.getPrototypeOf('foo')  // Throws TypeError

// 在 ES2015 规范下，Reflect 抛异常, Object 强制转换非 Object
Object.getPrototypeOf('foo')   // String.prototype
Reflect.getPrototypeOf('foo')  // Throws TypeError

// 如果想要模拟 Object 在 ES2015 规范下的表现，需要强制类型转换
Reflect.getPrototypeOf(Object('foo'))  // String.prototype
```

##### Reflect.setPrototypeOf()

除了返回类型以外，静态方法 `Reflect.setPrototypeOf()` 与 `Object.setPrototypeOf()` 方法是一样的。它可设置对象的原型（即内部的 `[[Prototype]]` 属性）为另一个对象或 `null`，如果操作成功返回 `true`，否则返回 `false`。

返回一个 `Boolean` 值表明是否原型已经成功设置。如果 `target` 不是 `Object` ，或 `prototype` 既不是对象也不是 `null`，抛出一个 `TypeError` 异常。

```javascript
Reflect.setPrototypeOf({}, Object.prototype); // true

// It can change an object's [[Prototype]] to null.
Reflect.setPrototypeOf({}, null); // true

// Returns false if target is not extensible.
Reflect.setPrototypeOf(Object.freeze({}), null); // false

// Returns false if it cause a prototype chain cycle.
var target = {};
var proto = Object.create(target);
Reflect.setPrototypeOf(target, proto); // false
```

##### Reflect.apply()

`Reflect.apply(target, thisArgument, argumentsList)` 方法等同于 `Function.prototype.apply.call(func, thisArg, args)`,用于绑定 `this` 对象后执行给定函数。返回值是调用完带着指定参数和 `this` 值的给定的函数后返回的结果。如果 `target` 对象不可调用，抛出 `TypeError`。

原来我们要指定 `this` 执行函数，需要 `fn.apply(thisArg, args)`， 如果函数重写了 `apply` 方法，就需要这样 `Function.prototype.apply.call(fn, thisArg, args)`，使用 `Reflect.apply` 方法会使代码更加简洁易懂。

```javascript
Reflect.apply(Math.floor, undefined, [1.75]); 
// 1;

Reflect.apply(String.fromCharCode, undefined, [104, 101, 108, 108, 111]);
// "hello"

Reflect.apply(RegExp.prototype.exec, /ab/, ["confabulation"]).index;
// 4

Reflect.apply("".charAt, "ponies", [3]);
// "i"
```

##### Reflect.defineProperty()

`Reflect.defineProperty(target, propertyKey, attributes)` 基本等同于 `Object.defineProperty()` 方法，唯一不同是返回 `Boolean` 值。未来，后者会被逐渐废除，请从现在开始就使用 `Reflect.defineProperty` 代替它。返回值是一个 `Boolean` 值指示了属性是否被成功定义。如果 `target` 不是 `Object`，抛出一个 `TypeError`。

##### Reflect.getOwnPropertyDescriptor()

该方法与 `Object.getOwnPropertyDescriptor()` 方法相似，用于得到指定属性的描述对象，将来 会替代掉后者。。如果属性在对象中存在，则返回给定的属性的属性描述符。否则返回 `undefined`。该方法和 `Object.getOwnPropertyDescriptor()` 的区别是如果第一个参数不是对象，`Object.getOwnPropertyDescriptor()` 返回 `undefined`，而 `Reflect.getOwnPropertyDescriptor` 会抛出错误。

```javascript
Reflect.getOwnPropertyDescriptor({x: "hello"}, "x");
// {value: "hello", writable: true, enumerable: true, configurable: true}

Reflect.getOwnPropertyDescriptor({x: "hello"}, "y");
// undefined

Reflect.getOwnPropertyDescriptor([], "length");
// {value: 0, writable: true, enumerable: false, configurable: false}
```

##### Reflect.isExtensible()

`Reflect.isExtensible(target)` 判断一个对象是否可扩展 （即是否能够添加新的属性）。与它 `Object.isExtensible()` 方法相似，但有一些不同，如果对象是可扩展的，则 `Object.isExtensible()` 返回 `true`，否则返回 `false`。如果第一个参数不是对象（原始值），则在 `ES5` 中抛出 `TypeError`。在 `ES2015` 中，它将被强制为不可扩展的普通对象并返回 `false`。如果对象是可扩展的，则 `Reflect.isExtensible()` 返回 `true`，否则返回 `false`。如果第一个参数不是对象（原始值），则抛出 `TypeError`。

```javascript
// New objects are extensible. 
var empty = {};
Reflect.isExtensible(empty); // === true 

// ...but that can be changed. 
Reflect.preventExtensions(empty); 
Reflect.isExtensible(empty); // === false 

// Sealed objects are by definition non-extensible. 
var sealed = Object.seal({}); 
Reflect.isExtensible(sealed); // === false 

// Frozen objects are also by definition non-extensible. 
var frozen = Object.freeze({}); 
Reflect.isExtensible(frozen); // === false
```

##### Reflect.preventExtensions()

静态方法 `Reflect.preventExtensions(target)` 方法阻止新属性添加到对象 (例如：防止将来对对象的扩展被添加到对象中)。该方法与 `Object.preventExtensions()` 相似，但有一些不同点。返回一个 `Boolean` 值表明目标对象是否成功被设置为不可扩展。抛出一个 `TypeError` 错误，如果 `target` 不是 `Object`。

```javascript
// Objects are extensible by default.
var empty = {};
Reflect.isExtensible(empty); // === true

// ...but that can be changed.
Reflect.preventExtensions(empty);
Reflect.isExtensible(empty); // === false
```

##### Reflect.ownKeys()

方法用于返回对象的所有属性，基本等同于 `Object.getOwnPropertyNames()` 与 `Object.getOwnPropertySymbols` 之和。由目标对象的自身属性键组成的 `Array`，它的返回值等同于`Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))`。如果目标不是 `Object`，抛出一个 `TypeError`。

```javascript
Reflect.ownKeys({z: 3, y: 2, x: 1}); // [ "z", "y", "x" ]
Reflect.ownKeys([]); // ["length"]

var sym = Symbol.for("comet");
var sym2 = Symbol.for("meteor");
var obj = {[sym]: 0, "str": 0, "773": 0, "0": 0,
           [sym2]: 0, "-1": 0, "8": 0, "second str": 0};
Reflect.ownKeys(obj);
// [ "0", "8", "773", "str", "-1", "second str", Symbol(comet), Symbol(meteor) ]
// Indexes in numeric order, 
// strings in insertion order, 
// symbols in insertion order
```

## 总结

`Proxy` 在我们的日常编码中使用不是很多，由于他提供的功能能够让我们对语言的行为进行定制，所以很多框架和底层库都会使用，比如 `Vue3` 就把双向数据绑定从 `Object.defineProperty` 改成了用 `Proxy` 实现，理解代理行为有助于我们理解这些框架和库。而 `Reflect` 中的很多方法将会逐步取代 `Object`，所以我们应该尽量使用。

## 参考文章

1. 《ES6标准入门》 —— 阮一峰
2. MDN