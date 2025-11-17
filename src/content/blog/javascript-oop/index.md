---
title: 'JavaScript 面向对象'
publishDate: '2020-11-08 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

想写这篇文章很久了，虽然现在都 `ES6` 已经相当普及了，大家都已经开始用 `class` 来定义类了。不过 `class` 关键字也可以看做是一个语法糖（`Syntactic sugar`），它的绝大部分功能，`ES5` 都可以做到，新的 `class` 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。不过我认为对于整个 `javascript` 的继承机制还是应该更加深入了解比较好。

> 语法糖（英语：`Syntactic sugar`）是由英国计算机科学家彼得·兰丁发明的一个术语，指计算机语言中添加的某种语法，这种语法对语言的功能没有影响，但是更方便程序员使用。语法糖让程序更加简洁，有更高的可读性。

## 什么是面向对象

<https://www.zhihu.com/question/305042684> 面向对象这个名词从大学开始就一直接触，它的核心似乎很简单，但又模模糊糊。我个人觉得产生这种感觉的原因就是面向对象不是一个数学或物理概念，不是一个定理。它是一种设计模式，没有一个确定的描述，它是从实践中总结出的一种比较优秀的设计程序的模式，所以要学会它，只能不断的从实践中去验证，采坑。

我个人的理解面向对象就是对问题的抽象，将问题抽象成一个个小的模块分而治之，模块之间的关系尽量单一清晰，这样代码在扩展和维护的时候所花费的精力最小，也就是所谓的高内聚，低耦合。之所以它并不容易掌握，就是这个抽象能力是需要通过各种复杂的问题不断训练的。很多时候我们只是想着将写出来的代码进行复用，不要写出重复的代码，但其实最重要的是对问题的抽象，划分出合理的模块和设计模块之间的耦合关系，代码复用只是这个过程中自然而然产生的现象，我们应该明白问题的本质。

## 面向对象设计原则

| 缩写  | 英文名称                                        | 中文名称                                                       | 概念                                                                     |
| ----- | ----------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `SRP` | `Single Responsibility Principle`               | 单一职责原则                                                   | 对象应该仅具有一种单一功能                                               |
| `OCP` | `Open Close Principle`                          | 开闭原则                                                       | 软件体应该是对于扩展开放的，但是对于修改封闭的                           |
| `LSP` | `Liskov Substitution Principle`                 | 里氏替换原则                                                   | 程序中的对象应该是可以在不改变程序正确性的前提下被它的子类所替换的       |
| `LoD` | `Law of Demeter （ Least Knowledge Principle）` | 迪米特法则（最少知道原则）                                     | 一个对象应该对尽可能少的对象有接触，也就是只接触那些真正需要接触的对象。 |
| `ISP` | `Interface Segregation Principle`               | 接口分离原则                                                   | 多个特定客户端接口要好于一个宽泛用途的接口                               |
| `DIP` | `Dependency Inversion Principle`依赖倒置原则    | 一个方法应该遵从依赖于抽象而不是一个实例依赖注入是一种实现方式 |                                                                          |

对于面向对象设计原则的解读可以参考 [面向对象设计的六大设计原则](https://juejin.im/post/6844903673672237063#heading-42 '面向对象设计的六大设计原则')

## 创建对象

在 `ES6` 之前，语言的标准中没有一个正式的面向对象的构造和继承的支持，我们的对象继承机制都是基于原型的。在 `ES6` 之后，标准中引进了更类似传统面向对象于洋的 `class` 和继承方式，如今已经得到广泛的支持。也许你觉得只要学会 `class` 的用法就可以了，但其实 `class` 也只是对原型继承的一个语法层面的包装，搞清楚 `class` 背后的原型继承的整个机制，我们才能写出更好的代码。

我们知道在 `JavaScript` 创建一个普通的对象可以使用 `Object` 构造函数，对象字面量 `{}` 。但是如果我们想要批量创建一些具有相同属性的对象，这些方法就不太适合了，我们会写出许多重复的代码。这当然是面向对象中一个很重要的问题，即如何封装对象属性方法，用一个比较高效的方式创建对象。在 `JavaScript` 的发展过程中，有很多种创建对象的方式，有些可能现在不会使用了，但还是了解一下。

**由于 JavaScript 的面向对象是基于原型的，所以如果你对 JavaScript 的原型还不是很了解，建议你先看一下 [JavaScript 原型机制](https://www.clloz.com/programming/front-end/js/2020/09/11/javascript-prototype/ 'JavaScript 原型')**

## 工厂模式

工厂模式是在软件工程中非常有名的设计模式，它将创建对象的具体过程抽象了出来。将创建对象，添加属性的过程封装为一个函数，属性值作为函数的参数传入，当我们想要一个对象的时候，就执行这个函数即可。

```javascript
function createPerson(name, age, job) {
  let o = new Object()
  o.name = name
  o.age = age
  o.job = job
  o.sayName = function () {
    console.log(this.name)
  }
  return o
}

let person1 = createPerson('Nicholas', 29, 'Software Engineer')
let person2 = createPerson('Greg', 27, 'Doctor')
```

工厂模式创建的对象有很多问题，一个最基本的就是不同的工厂模式函数创建出来的对象都是 `Object` 构造的，我们没有办法区分它们。

## 构造函数模式

在 `JavaScript` 中，构造函数用来创建特定类型的对象。`JavaScript` 引擎给我们提供了非常多的内置构造函数，比如 `Array` 和 `Object` 等等。我们也可以通过 `function` 定义自己的构造函数，在构造函数中我们可以定义我们的对象需要的属性和方法。

比如上面的那个 `createPerson` 的例子我们可以用构造函数进行如下改写：

```javascript
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function () {
    console.log(this.name)
  }
}

let person1 = new Person('Nicholas', 29, 'Software Engineer')
let person2 = new Person('Greg', 27, 'Doctor')

person1.sayName() // Nicholas
person2.sayName() // Greg
```

使用构造函数和上面的工厂模式的区别是，我们不在需要手动创建一个对象，所有的属性和对象都赋值到了 `this` 对象上，我们也不需要返回语句。还有一个小区别就是，我们创建构造函数一般首字母会大写，这是一个大多数面向对象语言的一个规定，用来区分普通函数和构造函数，特别是在 `JavaScript` 中构造函数其实就是一个普通的函数。

之所以有上面这些区别，是因为 `new` 操作符帮我们做了很多事情，关于 `new` 操作符我在另一片文章 [JavaScript中new操作符的解析和实现](https://www.clloz.com/programming/front-end/js/2020/06/29/new-operator/ 'JavaScript中new操作符的解析和实现')

构造函数可以是函数声明，也可以是函数表达式。相比于工厂模式，构造函数模式让我们能够以一个固定的类型创建对象，并且所有对象都会是 `Object` 构造函数的实例。实例化的时候，`new` 后面的函数名可以带括号也可以不带括号，如果你不需要传入参数，可以省略括号。

需要注意的是，构造函数和其他的函数没有本质的不同，唯一的区别就是调用方式。任何函数通过 `new` 操作符调用就是作为一个构造函数，没有用 `new` 进行调用就是作为一个普通的函数。当然还有一个区别就是我们会将构造函数的首字母大写，但这不是强制性的，只是一种约定。

构造函数模式创建对象也有自己的缺点，那就是构造函数中的方法会在每个实例上都创建一遍，比如例子中的 `sayName` 方法，但是实际上我们并不需要在每个实例上都创建这个方法，特别是在我们有 `this` 对象的情况下。我们需要有一种方式让我们的实例能够共用某些方法。

> 这里提一点，我在 [JavaScript中的this指向](https://www.clloz.com/programming/front-end/js/2020/06/30/js-this/ 'JavaScript中的this指向') 一文中曾经说过不要将箭头函数使用在对象的方法或者构造函数原型的方法上，因为它没有自己的 `this`。但是在构造函数中定义的实例的方法（绑定在 `this` 上的）可以使用箭头函数，`this` 能正确返回。

## 原型模式

**如果你对 JavaScript 的原型还不是很了解，请先看 [JavaScript 原型机制](https://www.clloz.com/programming/front-end/js/2020/09/11/javascript-prototype/ 'JavaScript 原型')。**

原型机制是整个 `JavaScript` 继承的核心。每一个函数创建的时候就会有一个 `prototype` 属性指向一个对象，用该构造函数创建的每一个对象都可以共享这个 `prototype` 上的属性和方法，一般我们就称 `prototype` 对应的对象为实例的原型对象。

有了原型机制，我们可以把那些每个实例都通用的属性和方法放到原型对象中去，而不必在每个实例上都创建。

```javascript
function Person() {}

Person.prototype.name = 'Nicholas'
Person.prototype.age = 29
Person.prototype.job = 'Software Engineer'
Person.prototype.sayName = function () {
  console.log(this.name)
}

let person1 = new Person()
person1.sayName() // "Nicholas"

let person2 = new Person()
person2.sayName() // "Nicholas"

console.log(person1.sayName == person2.sayName) // true
```

原型机制是贯穿整个 `JavaScript` 核心的一个机制，所有内置对象都基于这个机制创建，我们之所以能在自己创建的对象，数组字符串上使用内置的 `API`，就是因为原型机制的存在，所以一定要搞清楚这个机制的细节。当然，不建议直接修改内置对象的原型，除非你确定不会引发命名冲突和兼容性问题。

尽管原型模式非常有用，但是如果只是单纯使用原型模式还是存在问题。在构造函数模式中，我们可以通过向构造函数传入参数，让最后生成的对象的属性值是由我们自定义的，每个实例都可以通过参数直接设定属性值。而在原型模式中，访问每个实例的同一个属性返回值都是相同的。

但是这还是个小问题，最关键的问题是所有实例共享属性。对于函数的共享来说，这当然是一个理想的解决方案。对于一个原型类型的值也还说得过去。但是如果对象的属性是一个引用类型，那么问题就出现了，我在 `A` 实例中修改了这个引用类型的值，当 `B` 实例去取这个引用类型中的属性的时候，这个引用类型已经发生了变化。

```javascript
function Person() {}

Person.prototype = {
  constructor: Person,
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  friends: ['Shelby', 'Court'],
  sayName() {
    console.log(this.name)
  }
}

let person1 = new Person()
let person2 = new Person()

person1.friends.push('Van')

console.log(person1.friends) // "Shelby,Court,Van"
console.log(person2.friends) // "Shelby,Court,Van"
console.log(person1.friends === person2.friends) // true
```

上面的例子我们可以看到，实例 `person1` 修改了原型上的 `friends` 属性，该属性是个引用类型。当 `person2` 去取这个属性的时候，这个变化也出现了。这是因为引用类型保存的只是一个指向对象的指针。如果我们确实希望 `person1` 的修改反映到 `person2` 中，这样做没有问题，但是大部分时候我们希望实例化对象的时候，它们的属性都是独立的。所以我们很少单独使用原型模式创建对象。

## 继承

继承是面向语言中的一个最为人津津乐道的概念。许多面向对象语言都支持两种继承方式: 接口继承和 实现继承。接口继承只继承方法签名，而实现继承则继承实际的方法。如前所述，由于函数没有签名， 在 `ECMAScript` 中无法实现接口继承。`ECMAScript` 只支持实现继承，而且其实现继承主要是依靠原型链 来实现的。

一个函数签名 (或类型签名，或方法签名) 定义了 函数 或 方法 的输入与输出。一个签名可以包括：

- 参数 及参数的 类型
- 一个返回值及其类型
- 可能会抛出或传回的 异常
- 有关 面向对象 程序中方法可用性的信息 (例如关键字 public、static 或 prototype)。

原型链的内容这里不重复讲了，还是看上面说的那篇文章，讲的很详细了。这里说一说原型链继承方式的问题。上面的小结已经介绍了一个问题，就是原型中共享的引用类型的修改会反映到每个实例中，这也就是为什么大部分属性我们都是在构造函数中定义。并且在实际的编码中，我们的构造函数的原型常常是另一个构造函数的实例，即使我们原先是用构造函数创建的实例属性，也成了另一个实例的原型属性。可以看一看下面的原型继承的例子：

```javascript
function SuperType() {
  this.colors = ['red', 'blue', 'green']
}

function SubType() {}

// inherit from SuperType
SubType.prototype = new SuperType()

let instance1 = new SubType()
instance1.colors.push('black')
console.log(instance1.colors) // "red,blue,green,black"

let instance2 = new SubType()
console.log(instance2.colors) // "red,blue,green,black"
```

`SubType.prototype` 是 `SuperType` 的一个实例，`SuperType` 构造函数中定义的 `colors` 属性也就成了 `SubType` 实例的原型属性而被每个实例共享，最后的问题就还是和上面一样，每个实例对该属性的修改都会反映在其他实例上。原型继承还有个问题就是我们在实例化 `SubType` 的时候没法向 `SuperType` 构造函数传递参数。

原型继承的所有问题的根源就是所有实例共享属性，属性的变化会反映到每个实例中，这在实践中是非常糟糕的，所以我们很少单独使用原型链来实现继承。为了解决这个问题，实现一个比较好用又稳定的继承，有很多种继承方式被提出来。

## 借用构造函数

借用构造函数 `constructor stealing`，也被称为对象伪造 `object masquerading` 或者经典继承 `classical inheritance`。它的实现原理很简单，在子类型 `SubType` 的构造函数中调用超类型 `SuperType` 的构造函数。这种思想的本质就是实例化的过程即 `new` 的过程还是指定 `this` 执行构造函数，如果我们希望超类型的属性也被实例创建，在子类型构造函数中通过 `apply` 或者 `call` 指定 `this`执行超类型即可。

```javascript
function SuperType() {
  this.colors = ['red', 'blue', 'green']
}

function SubType() {
  // inherit from SuperType
  SuperType.call(this)
}

let instance1 = new SubType()
instance1.colors.push('black')
console.log(instance1.colors) // "red,blue,green,black"

let instance2 = new SubType()
console.log(instance2.colors) // "red,blue,green"
```

上面的代码就是接用构造函数的一种实现，你甚至可以简单的理解为，把 `SuperType` 中的代码移到 `SubType` 中执行，就像把它的代码 **“借”** 过来一样，所以取名叫借用构造函数，本质上相当于将构造函数中可以复用的属性定义提取成一个函数，方便复用。比如你的需求中有很多构造函数都需要 `name`，`age` 和 `sex` 属性，你不需要在每个构造函数中都写上 `this.name = xxx`，`this.age = xxx` 等，把他们提取出来写成一个函数，然后在构造函数中调用即可。

这样 `SuperType` 中定义的属性，`SubType` 的每一个实例都有自己的副本而不是指向同一个对象。并且我们可以直接在 `SubType` 的构造过程中传递参数给 `SuperType`。

借用构造函数本质还是构造函数，只是优化了构造函数的结构而已，并没有什么革新。所以构造函数的问题它自然也没有解决，那就是定义的属性和方法没法复用。而且我们在子类构造的时候虽然调用了 `SuperType`，但是 `SuperType` 中的属性和方法对 `SubType` 完全是不可见的，我们也没法操作这些方法和属性，这样灵活性就大打折扣。

## 组合继承

组合继承 `combination inheritance` 有时也称为伪经典继承 `pseudoclassical inheritance`，它的思路就是将借用构造函数和原型链结合起来（由于借用构造函数本质就是构造函数，可以理解为构造函数和原型链的结合），使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，又能够保证每个实例都有它自己的属性。

```javascript
function SuperType(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

SuperType.prototype.sayName = function () {
  console.log(this.name)
}

function SubType(name, age) {
  // inherit properties
  SuperType.call(this, name)

  this.age = age
}

// inherit methods
SubType.prototype = new SuperType()

SubType.prototype.sayAge = function () {
  console.log(this.age)
}

let instance1 = new SubType('Nicholas', 29)
instance1.colors.push('black')
console.log(instance1.colors) // "red,blue,green,black"
instance1.sayName() // "Nicholas";
instance1.sayAge() // 29

let instance2 = new SubType('Greg', 27)
console.log(instance2.colors) // "red,blue,green"
instance2.sayName() // "Greg";
instance2.sayAge() // 27
```

上面的例子中我们将共用的方法写在 `SuperType.prototype` 上通过原型链实现继承，不需要共用的属性如 `name` 和 `colors` 则放到构造函数中，让每一个实例都有独立的副本。组合模式结合了借用构造函数和原型链的优点而避开了它们的缺点，是比较常用的实现继承的方式。这种实现方式也能够使用 `instanceof` 和 `isPrototypeOf()` 来进行继承关系的判断。

组合式继承的一个缺点就是它调用了两次构造函数，一次在子类的构造函数中借用父类的构造函数。一次是在创建子类的 `prototype` 的时候是用实例化父类来实现的，这样创建的 `prototype` 里面可能会有一些没用的实例属性，而且如果构造函数很复杂，也会影响一些性能，这完全是可以规避的，用我们下面介绍的两种继承方式。

```javascript
function SuperType(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

SuperType.prototype.sayName = function () {
  console.log(this.name)
}

function SubType(name, age) {
  SuperType.call(this, name)

  this.age = age
}
SubType.prototype = new SuperType()

SubType.prototype.sayAge = function () {
  console.log(this.age)
}

let instance1 = new SubType('Nicholas', 29)
console.log(instance1.__proto__) // SuperType {name: undefined, colors: [ 'red', 'blue', 'green' ], sayAge: [Function]}
```

## 原型式继承

原型式继承 `prototypal inheritance` 是 `Douglas Crockford`（《JavaScript语言精粹》作者，`JSON` 的创建者）提出的一种继承方式，他的思路是通过一个中间函数来实现继承：

```javascript
function object(o) {
  function F() {}
  F.prototype = o
  return new F()
}
```

在 `object` 函数中塔创建了一个临时的函数，将这个函数的 `prototype` 指向要继承的对象，然后用这个函数作为构造函数生成一个新的实例对象并返回。如果熟悉 `Object.create()` 的话，你会发现这就是 `Object.create()` 方法的 `polyfill` 实现中的核心代码，它相当于对传入的对象实现了一个浅复制。

```javascript
let person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van']
}

let anotherPerson = object(person)
anotherPerson.name = 'Greg'
anotherPerson.friends.push('Rob')

let yetAnotherPerson = object(person)
yetAnotherPerson.name = 'Linda'
yetAnotherPerson.friends.push('Barbie')

console.log(person.friends) // "Shelby,Court,Van,Rob,Barbie"
```

我们可以发现，原型式继承从语法上相当于直接指定某个对象作为新对象的原型，但是本质上只是它内部帮我们把构造函数这一步做了（只不过这个构造函数是个空函数），我需要我们再创建对象。当我们只是想实现对某个对象的属性方法继承的时候，这是一个非常实用并且方便的方法，所以 `ES5` 中也提供了 `Object.create()` 方法，其核心就是原型式继承，只不过 `Object.create()` 方法还能传递第二个参数，为新对象添加独立的属性。

一般来说，我们在实际编码中想要继承的只是一个对象的属性和方法，而该对象并没有对应的构造函数，这个时候原型式继承就是最合适的方式。

需要注意的是一个原型创建的多个对象，原型上的引用类型属性还是共享的，一个实例的对引用类型的修改会反映到另一个实例中（他们本质就是同一个对象），不过实际编码中不太会出现这样的情况，一般一个原型进行 `create` 只会使用一次。

> `Object.create()` 方法参考 `MDN` 和 [Object.create(null) 和 {…}](https://www.clloz.com/programming/front-end/js/2020/09/10/object-create-null/ 'Object.create(null) 和 {…}')

## 寄生式继承

寄生式继承 `parasitic inheritance` 其实就是对原型式继承的一个包装，因为我们用原型式继承生成对象以后可能还要为这个新对象添加一些新的属性或者方法，寄生式继承就是将这些过程进行一个封装而已，没有什么特别的内容，是原型式继承和工厂模式的一种结合。之所以叫寄生式继承，可以理解为它将继承的过程寄生在了一个函数里面。

```javascript
function createAnother(original) {
  let clone = Object.create(original) // create a new object by calling a function
  clone.sayHi = function () {
    // augment the object in some way
    console.log('hi')
  }
  return clone // return the object
}
let person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van']
}

let anotherPerson = createAnother(person)
anotherPerson.sayHi() // "hi"
```

## 寄生组合式继承

组合式继承已经是一种比较不错的继承实现方式，但是它有一个问题就是父类 `SuperType` 的构造函数调用了两次，一次是创建子类 `SubType` 的原型 `prototype` 时，一次是在子类的构造函数中借用构造时。为了优化这个过程，就有了寄生组合式继承 `parasitic combination inheritance`。

寄生组合式继承其实就是把创建子类原型 `SubType.prototype` 从 `new SuperType` 换成了原型式继承的方式，现在我们一般就是使用 `Object.create()`。

```javascript
function SuperType(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

SuperType.prototype.sayName = function () {
  console.log(this.name)
}

function SubType(name, age) {
  SuperType.call(this, name)

  this.age = age
}

SubType.prototype = Object.create(SuperType.prototype)
SubType.prototype.constructor = SubType

SubType.prototype.sayAge = function () {
  console.log(this.age)
}
```

## ES5 面向对象总结

上面我们介绍了几乎关于 `ES5` 的全部面向对象内容，主要是基于 《JavaScript 高级程序设计》第四版来写的。说实话，我个人认为用这样的方式区分继承的模式是非常不合理的，既不符合使用习惯，也很难记忆，特别是对于初学者（如果不是初学者，也不会看这些内容，瞄一下就行了）。之所以我还是按照书上的内容来介绍，是因为你可能在面试的时候被问到，比如如何实现寄生组合式继承。

我这里说一下我自己的理解，关于 `ES5` 的对象创建和继承方式，我们只要记住三个，构造函数，原型链和 `Object.create()`（它的本质就是构造函数和原型链的结合）。上面提到的所有创建对象和继承对象的方式都是这三种的方法的排列组合以及包装。比如组合继承，就是构造函数和原型链的组合，原型式继承已经通过 `Object.create()` 写入标准。寄生组合式继承则是构造函数，原型链和 `Object.create()` 三者的继承。借用构造函数则只是构造函数的一个变体而已，本质没有区别。

我们在实际的工作中根据我们的需要进行三者的组合，完全没有必要用一个个模式进行束缚。它们三者的功能我进行一个简单的归纳：

- 构造函数：为实例创建独立的属性和方法。
- 原型链：为实例创建共享的属性和方法。
- `Object.create()`：本质就是构造函数和原型链的一个封装，当我们不需要构造函数希望直接继承某个对象的属性和方法时，使用这个方法最便捷。

> 弄懂原型机制是搞懂 `JavaScript` 面向对象的关键。

## ES6 面向对象

在 `ES6` 之前，我们用原型链和构造函数来模拟 `class` 风格的面向对象。但是显而易见，这样的实现方式有很多问题，也必须进行一些折衷，因为没有语法层面的支持，我们要实现面向对象只能这么做。最重要的是，这样的实现是非常不优雅的，逻辑混乱，代码冗长。特别是如果你使用过其他面向对象语言。

为了解决这个问题，`ES6` 标准正式引入了 `class` 关键字让我们能够定义 **类**。`class` 的是 `ECMAScript` 引入的一个全新语法，目的就是为了拥有和传统面向对象语言相似的使用方式。虽然它看上去和传统的面向对象编程的语法很相似，但是其实在底层，依然是使用的构造函数和原型，`class` 只是一个语法层面的包装，也就是一个语法糖（当然还是有一些不一样的东西），它的绝大部分功能，用 `ES5` 完全可以做到，新的 `class` 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

## class 基础定义

`class` 的定义非常简单，和函数类似，可以使用声明也可以使用表达式。

```javascript
// class declaration
class Person {}

// class expression
const Animal = class {}
```

其实 `class` 本质就是一个构造函数，看下面的代码：

```javascript
class Point {}
console.log(typeof Point) // "function"
console.log(Object.prototype.toString.call(Point)) //[object Function]
console.log(Point === Point.prototype.constructor) // true
```

但是它又和函数有些不同，普通的函数无论是函数声明还是函数表达式，都会在所在执行环境进行提升 `hoist`，而类不存在提升行为，必须在声明之后调用。函数声明会在提升时同时用函数体赋值，函数表达式则和普通的变量提升表现一致（只提升不赋值，如果在赋值之前使用该变量，则返回 `undefined`。关于变量和函数的提升，参考我的另一篇文章 [var，let，const和变量提升（hoist）](https://www.clloz.com/programming/front-end/js/2020/07/01/variable-hoist/ 'var，let，const和变量提升（hoist）')

`class` 和函数的首先一点不同就是类声明没有提升行为，不能在声明前使用，会报错。当然类表达式的提升和变量一样。另一个不同就是类只能作为构造函数进行 `new` 调用，直接调用将会报错。

```javascript
console.log(FunctionExpression) // undefined
var FunctionExpression = function () {}
console.log(FunctionExpression) // function() {}

console.log(FunctionDeclaration) // FunctionDeclaration() {}
function FunctionDeclaration() {}
console.log(FunctionDeclaration) // FunctionDeclaration() {}

console.log(ClassExpression) // undefined
var ClassExpression = class {}
console.log(ClassExpression) // class {}

// console.log(ClassDeclaration); // ReferenceError: ClassDeclaration is not defined
class ClassDeclaration {}
console.log(ClassDeclaration) // class ClassDeclaration {}

ClassDeclaration() //TypeError: Class constructor ClassDeclaration cannot be invoked without 'new'
```

当然了，普通函数也可以处理成只只能用 `new` 进行调用：

```javascript
function Constructor() {
  if (!(this instanceof Constructor)) {
    throw new TypeError('Constructor cannot be invoked without "new"')
  }
}
Constructor() //TypeError: Constructor cannot be invoked without "new"
```

还有一个不同就是函数声明和类声明在块级作用域中的表现不同，非严格模式下，函数声明在块级作用域中会被同时提升到当前块的顶部和当前执行环境的顶部，在当前执行环境中使用，其值是 `undefined`，在当前块级作用域中则整个函数声明会被提升到顶部。 `class` 则遵循块级作用域。具体提升行为参考 [var，let，const和变量提升（hoist）](https://www.clloz.com/programming/front-end/js/2020/07/01/variable-hoist/#block 'var，let，const和变量提升（hoist）')

```javascript
{
  function FunctionDeclaration() {}
  class ClassDeclaration {}
}

console.log(FunctionDeclaration) // FunctionDeclaration() {}
console.log(ClassDeclaration) // ReferenceError: ClassDeclaration is not defined

//函数声明在块级作用域中的奇特行为，类似于函数声明变成了用 `var` 定义的函数表达式
function test() {
  console.log(a) //undefined
  {
    console.log(a) //undefined
    function a() {
      console.log('a')
    }
  }
  console.log(a) //[Function a]
  a() //a
}
test()
console.log(a) //ReferenceError: a is not defined
```

### class 的组成

`class` 中可以包含构造函数，实例继承的方法，`getter` 和 `setter` 以及静态方法。这些组成部分都不是必须的，即使是一个空的 `class` 声明在语法上也是没有错误的。`class` 中的所有方法都是在严格模式下执行。和构造函数一样，一般我们将类的首字母大写，用来和实例作区分（比如一个 `class Foo{}` 可能有一个实例 `foo`）。

```javascript
// Valid empty class definition
class Foo {}

// Valid class definition with constructor
class Bar {
  constructor() {}
}

// Valid class definition with getter
class Baz {
  get myBaz() {}
}

// Valid class definition with static method
class Qux {
  static myQux() {}
}
```

和函数表达是一样，类表达式可以匿名也可以命名，如果命名，该标识符的仅在类的作用域内可访问。

```javascript
let Person = class PersonName {
  identify() {
    console.log(Person.name, PersonName.name)
  }
}

let p = new Person()

p.identify() // PersonName, PersonName

console.log(Person.name) // PersonName
console.log(PersonName) // ReferenceError: PersonName is not defined
```

### constructor

`constructor` 关键字在 `class` 定义块中使用，用来表示 `class` 的构造函数。当使用 `new` 进行实例化的时候，就会调用这个 `constructor` 方法。一个类必须有 `constructor` 方法，如果没有显式定义，一个空的 `constructor` 方法会被默认添加。实例化一个 `class` 和一个普通的构造函数没有区别，只是把构造函数中的语句挪到 `class` 中的 `constructor` 方法中而已，`new` 的过程还是一样。如果你不了解 `new` 的行为，请看我的另一篇文章 [JavaScript中new操作符的解析和实现](https://www.clloz.com/programming/front-end/js/2020/06/29/new-operator/ 'JavaScript中new操作符的解析和实现')。

类的 `constructor` 和普通构造函数不同的是，在实例化之后，它可以作为实例的一个属性访问，我们可以用它来创建新的对象。实际上这是通过类的原型 `prototype` 进行访问的，因为类的 `prototype` 上有 `constructor` 指向类。这与 `ES5` 的行为是一致的。

```javascript
class Person {}

// Create a new instance using the class
let p1 = new Person()

p1.constructor()
// TypeError: Class constructor Person cannot be invoked without 'new'

// Create a new instance using the reference to the class constructor
let p2 = new p1.constructor()
```

`constructor` 中用 `this` 定义的实例属性还有另一种写法，就是写到 `class` 的顶部。

```javascript
class foo {
  bar = 'hello'
  baz = 'world'
}

let a = new foo()
console.log(a) //foo { bar: 'hello', baz: 'world' }
```

### 理解 class 是一个特殊函数

我上面已经说过 `class` 本质是一个构造函数，那么它自然也有 `prototype` 属性指向一个对象，该 `prototype` 对象的 `constructor` 属性指向 `class`。

```javascript
class Person {}

console.log(Person.prototype) // { constructor: f() }
console.log(Person === Person.prototype.constructor) // true
```

和普通的构造函数一样，我们可以用 `instanceof` 操作符来检测对象是否是某个 `class` 的实例。

```javascript
class Person {}

let p = new Person()

console.log(p instanceof Person) // true
```

`class` 内部的 `constructor` 方法可以被当做实例的一个方法调用，但是如果你用这种方式创建对象，这个对象的构造函数是 `class` 内部的那个 `constructor` 方法，而不是 `class`，`class` 的 `prototype` 不会在这个实例的原型链上。也就是如果你使用 `class`，那么 `class` 才是构造函数，而不是内部的 `constructor` 方法（虽然 `new` 的时候确实是执行的 `constructor` 方法内的内容），这一点非常重要。

```javascript
class Person {}

let p1 = new Person()

console.log(p1.constructor === Person) // true
console.log(p1 instanceof Person) // true
console.log(p1 instanceof Person.constructor) // false

let p2 = new Person.constructor()

console.log(p2.constructor === Person) // false
console.log(p2 instanceof Person) // false
console.log(p2 instanceof Person.constructor) // true
```

`class` 和对象一样是 `JavaScript` 中的一等公民，意味着它可以作为对象的属性和函数的参数。

```javascript
// Classes may be defined anywhere a function would, such as inside an array:
let classList = [
  class {
    constructor(id) {
      this.id_ = id
      console.log('instance ${this.id_}')
    }
  }
]

function createInstance(classDefinition, id) {
  return new classDefinition(id)
}

let foo = createInstance(classList[0], 3141) // instance 3141
```

和函数表达式一样我们可以对类表达式进行立即调用来生成对象：

```javascript
let a = new (function (name) {
  this.name = name
})('clloz')
console.log(a) //{ name: 'clloz' }

// Because it is a class expression, the class name is optional
let p = new (class Foo {
  constructor(x) {
    console.log(x)
  }
})('bar') // bar

console.log(p) // Foo {}
```

类是一个特殊的函数还体现在它也有 `name` 属性，和函数一样，`name` 属性返回的是紧跟在 `class` 后面的标识符的名称。

```javascript
let a = class B {}
console.log(a.name) //B
new B() //ReferenceError: B is not defined

let fn = function func() {}
console.log(fn.name)
func() //func is no defined
```

### 类的 prototype

为了能让实例间共享属性和方法，`class` 自然也提供了在 `prototype` 上添加方法和属性的功能。我们可以在 `class` 中定义方法和 `getter`，`setter` 属性访问器，注意，不能定义对象或者原始数据类型。也就是 `class` 中定义的方法除了 `constructor`，其他非静态方法都相当于定义在了 `prototype` 上(实际上 `constructor` 也能从 `prototype` 上访问到)，并且所有方法都可以使用 `String`，`Symbol` 和计算属性作为方法名。虽然不能直接定义原始数据类型或者对象作为属性，但是我们可以用 `getter` 和 `setter` 进行属性设定。

> **注意：**和 `ES5` 不同的是，类内部定义的所有方法，默认都是不可枚举的。

```javascript
class Person {
    constructor() {
        // Everything added to 'this' will exist on each individual instance
        this.locate = () => console.log('instance');
    }

    // Everything defined in the class body is defined on the class prototype object
    locate() {
        console.log('prototype');
    }
}

let p = new Person();

p.locate(); // instance
Person.prototype.locate(); // prototype

//不能定义原始数据类型和对象
class Person {
    // name: 'Jake', //SyntaxError: Unexpected identifier
    test: {}; //SyntaxError: Unexpected identifier
    test: {};
}

//方法名可以使用 String Symbol 和 计算属性
const symbolKey = Symbol('symbolKey');
class Person {
 stringKey() {
  console.log('invoked stringKey');
 }
 [symbolKey]() {
  console.log('invoked symbolKey');
 }
 ['computed' + 'Key']() {
  console.log('invoked computedKey');
 }
}
let p = new Person();
p.stringKey();   // invoked stringKey
p[symbolKey]();  // invoked symbolKey
p.computedKey(); // invoked computedKey

//访问器属性
class Person {
    set name(newName) {
        this.name_ = newName;
    }
    get name() {
        return this.name_;
    }
}
let p = new Person();
p.name = 'Jake';
console.log(p.name); // Jake
```

> 注意，`class` 中的方法间不能有逗号，否则会报错。

我们也可以在 `class` 之外为 `class` 或者 `prototype` 添加属性，但这是不推荐的，实例的属性应该统一由 `this` 引用，而 `prototype` 上的共享方法也统一在 `class` 中定义时比较好的实践。这是一种反模式，在类外进行变量或者方法的声明很容易被忽略，也不易维护。

```javascript
class Person {
  sayName() {
    console.log('${Person.greeting} ${this.name}')
  }
}

// Define data member on class
Person.greeting = 'My name is'

// Define data member on prototype
Person.prototype.name = 'Jake'

let p = new Person()
p.sayName() // My name is Jake
```

类中的方法也可以使用简写，和对象的方法一样，简写的方法不能作为构造函数调用，简写方法没有内部 `[[construct]]` 方法。当然我们一般不需要对静态方法或者原型上的方法使用 `new`，所以直接使用简写即可。

```javascript
class Parent {
  constructor(a, b) {
    this.a = a
    this.b = b
  }
  pFn1 = function () {} //能够作为构造函数
  pFn2() {} //TypeError: p.pFn2 is not a constructor
}

let p = new Parent()
new p.pFn1()
new p.pFn2()
```

### 静态方法和访问器属性

静态方法是所有面向对象都提供的一种设施。为什么需要这种设施，是有些方法并不需要创建实例使用，比如我们熟悉的 `Math` 对象的方法，我们希望能够直接使用，于是就有了静态方法这种机制，它们不属于实例，而是属于类，我们不需要实例化就能直接使用。静态方法与非静态方法的本质区别：静态方法在程序初始化后会一直贮存在内存中，不会被垃圾回收器回收，非静态方法只在该类初始化后贮存在内存中，当该类调用完毕后会被垃圾回收器收集释放。

在 `class` 中定义静态方法和其他面向对象语言类似，使用 `static` 关键字，和 `prototype` 上的方法一样，他们只会创建一次。看看下面的例子可以看到构造函数中的方法，`prototype` 上的方法和静态方法的区别。

```javascript
class Person {
  constructor() {
    // Everything added to 'this' will exist on each individual instance
    this.locate = () => console.log('instance', this)
  }

  // Defined on the class prototype object
  locate() {
    console.log('prototype', this)
  }

  // Defined on the class
  static locate() {
    console.log('class', this)
  }
}

let p = new Person()

p.locate() // instance, Person {}
Person.prototype.locate() // prototype, {constructor: … }
Person.locate() // class, class Person {}
```

### 静态属性

静态属性指的是 `Class` 本身的属性，即 `Class.propName`，而不是定义在实例对象（`this`）上的属性。使用方法和静态方法一样，就是用 `static` 关键字。它不需要像实例属性一样写在顶部，可以在类里面的任何位置。

```javascript
class foo {
  static bar = 'hello'
  baz = 'world'
  test() {
    console.log('haha')
  }
  static m = 'm'
}

let a = new foo()
console.log(a) //foo { bar: 'hello', baz: 'world' }
console.log(foo.bar, foo.m)
```

### 私有方法和属性

私有方法和私有属性，是只能在类的内部访问的方法和属性，外部不能访问。这是常见需求，有利于代码的封装，但 `ES6` 目前还不支持，只能通过变通方法模拟实现。

一种实现方式是用命名区分，在私有方法和属性前面加上下划线，当然这只是一个约定，在类的外部依然可以调用对应的方法和属性。

另一种是将方法移出类外，然后在类内部用 `call` 或者 `apply` 进行调用。

```javascript
class Widget {
  foo(baz) {
    bar.call(this, baz)
  }
}

function bar(baz) {
  return (this.snaf = baz)
}
```

最后还有一种就是利用 `Symbol` 的唯一性来做变量名，降低属性或者方法被外部访问的可能，但是要注意 `Reflect.ownKeys()` 方法或者 `Object.getOwnPropertySymbols` 方法都可以遍历到 `Symbol` 属性。

`ES2020` 的草案已经正式提出了私有属性和方法的支持，使用方式就是在属性或者方法之前加上 `#`，当然目前支持的只有高版本的 `edge`，`chrome` 和 `opera` 浏览器。所以在得到普遍的支持之前，我们还是要使用不安全的模拟私有属性。

### new.target

`new.target` 属性允许你检测函数或构造方法是否是通过 `new` 运算符被调用的。在通过 `new` 运算符被初始化的函数或构造方法中，`new.target` 返回一个指向构造方法或函数的引用。在普通的函数调用中，`new.target` 的值是 `undefined`。

`new.target` 语法由一个关键字 `new`，一个点，和一个属性名 `target` 组成。通常 `new.` 的作用是提供属性访问的上下文，但这里 `new.` 其实不是一个真正的对象。不过在构造方法调用中，`new.target` 指向被 `new` 调用的构造函数，所以 `new.` 成为了一个虚拟上下文。

在 `arrow functions` 中，`new.target` 指向最近的外层函数的 `new.target`，箭头函数没有自己的 `new.target`。

`new.target` 可以用在任何函数中，函数不是通过 `new` 或者 `Reflect.construct()` 调用的则返回 `undefined`。如果是通过 `new` 调用的则返回该函数，注意函数表达式的如果不是匿名函数则返回的函数名称是函数表达式定义的函数名。

```javascript
function Target() {
  console.log(new.target)
}
Target() //undefined
new Target() //[Function: Target]

//函数表达式
let Target = function targetName() {
  console.log(new.target)
}
Target() //undefined
new Target() //[Function: targetName]
```

在类的 `constructor` 中使用则返回该类（类只能通过 `new` 调用），子类继承父类的时候，`super()` 会执行父类的 `constructor`，如果内部有 `new.target` 返回的是子类而不是父类。如果是在类的其他函数中使用（如果不是通过 `new` 调用的话，一般不是）则和普通函数一样返回 `undefined`。

```javascript
class Rectangle {
  constructor() {
    console.log(new.target === Rectangle)
  }
}
class Square extends Rectangle {}
var obj = new Square() // 输出 false
```

我们可以利用 `new.target` 让类必须继承后才能创建实例。

```javascript
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化')
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super()
  }
}

var x = new Shape() // Error: 本类不能实例化
var y = new Rectangle(3, 4) // 正确
```

## ES6 继承

上面我们介绍了 `ES5` 的继承，基本都是需要些很长的原型和构造函数逻辑，并不是很方便。在 `ES6` 有了 `class` 之后，也原生提供了继承的语法，当然这个继承与法的背后还是原型继承。

`ES6` 的继承是使用 `extends` 关键词，我们可以用 `extends` 关键词继承任何有 `[[constructor]]`（这是一个内部属性，表示可以作为一个构造函数） 属性和 `prototype` 的对象，这种形式保证了向后兼容，让 `ES5` 的构造函数也能使用这种语法继承。

```javascript
class Vehicle {}

// Inherit from class
class Bus extends Vehicle {}

let b = new Bus()
console.log(b instanceof Bus) // true
console.log(b instanceof Vehicle) // true

function Person() {}

// Inherit from function constructor
class Engineer extends Person {}

let e = new Engineer()
console.log(e instanceof Engineer) // true
console.log(e instanceof Person) // true
```

派生类可以继承父类的所有方法，包括类本身的静态方法和 `prototype` 上的方法。

```javascript
class Vehicle {
  identifyPrototype(id) {
    console.log(id, this)
  }

  static identifyClass(id) {
    console.log(id, this)
  }
}

class Bus extends Vehicle {}

let v = new Vehicle()
let b = new Bus()

b.identifyPrototype('bus') // bus, Bus {}
v.identifyPrototype('vehicle') // vehicle, Vehicle {}

Bus.identifyClass('bus') // bus, class Bus {}
Vehicle.identifyClass('vehicle') // vehicle, class Vehicle {}
```

> `extends` 也可以用在类表达式中，`let Bar = class extends Foo {}` 是一个合法的语句。

其实我们仔细分析一下 `ES6` 的继承，和寄生组合式继承只有一些细节不同，只是对寄生组合式继承的一种包装，把原来我们要写的逻辑帮我们封装好了而已。

```javascript
class Parent {
  constructor(a, b) {
    this.a = a
    this.b = b
  }
  pFn() {}
}
class Child extends Parent {
  constructor(a, b) {
    super(a, b)
  }
  cFn() {}
}

let c = new Child(1, 2)
console.log(c) //Child { a: 1, b: 2 }
console.log(Reflect.ownKeys(c.__proto__)) //[ 'constructor', 'cFn' ]
console.log(Reflect.ownKeys(c.__proto__.__proto__)) //[ 'constructor', 'pFn' ]
```

我们可以看到，子类的构造函数中调用 `super()` 就有点借用构造函数的感觉，只不过这里细节有所不同。在 `ES5` 中我们是直接在调用子类构造函数的时候创建一个新的对象作为 `this`，而 `ES6` 中是在 `super()` 中创建 `this`，然后用这个 `this` 执行 `super()`，所以我们在子类中只有执行完了 `super()` 才有 `this`。

`prototype` 的机制和 `ES5` 的原型式继承没什么不同，看下面的代码：

```javascript
class Parent {
  constructor(a, b) {
    this.a = a
    this.b = b
  }
  pFn() {}
}
class Child extends Parent {
  constructor(a, b) {
    super(a, b)
  }
  cFn() {}
}

let c = new Child(1, 2)
console.log(c) //Child { a: 1, b: 2 }
console.log(Reflect.ownKeys(c.__proto__)) //[ 'constructor', 'cFn' ]
console.log(Reflect.ownKeys(c.__proto__.__proto__)) //[ 'constructor', 'pFn' ]
```

我们可以看到子类实例的 `[[prototype]]` 有 `constructor` 和 `cFn` 两个属性，也就是 `Child.prototype`。而我们看到原型的原型，有两个属性 `constructor` 和 `pFn`，也就是 `Parent.prototype`，这就跟我们上面原型式继承 `Object.create(Parent.prototype)` 效果相同。所以我们通过访问子类实例的原型的原型是可以修改父类实例的原型的。

上面的例子是说的 `class` 的实例的原型链，其实 `class` 本身的 `[[prototype]]` 也和 `ES5` 中的构造函数有些不同。在 `ES5` 中，每个函数都是 `Function` 的实例，所以自然其 `[[prototype]]` 指向的是 `Function.prototype`。在 `ES6` 中，如果 `class` 没有继承其他类，那么他的 `[[prototype]]` 也是指向 `Function.prototype`，但是如果 `class` 是一个子类，那么它的 `[[prototype]]` 指向的是其父类。

```javascript
class Parent {
  constructor(a, b) {
    this.a = a
    this.b = b
  }
  pFn() {}
}
console.log(Parent.__proto__ === Function.prototype) //true
console.log(Parent.prototype) //{constructor: ƒ, pFn: ƒ}

class Child extends Parent {
  constructor(a, b) {
    super(a, b)
  }
  cFn() {}
}
console.log(Child.__proto__) //class Parent {}
console.log(Child.prototype) //Parent {constructor: ƒ, cFn: ƒ}
```

结合类和实例的继承关系，我们可以将 `class` 的继承进行如下理解：

```javascript
class A {}

class B {}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype)

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A)

const b = new B()
```

所以被继承的基类不一定是一个类，只要是一个有 `prototype` 的函数就可以被继承，由于函数都有 `prototype` 属性（除了 `Function.prototype`函数），因此任意函数都可以作为基类被继承。

### super

想要在派生类中访问父类，`ES6` 提供了 `super` 关键字。`super` 关键字有多种不同的用法，还是比较复杂的，总结一下如下：

- 只有派生类中能使用 `super`（即使用了 `extends` 的类或者设置了 `[[prototype]]` 的对象的方法中）。
- 当 `super` 作为方法调用时，只能是在派生类的构造函数中。
- 在派生类的构造函数中，如果没有定义 `constructor` 方法，会有一个默认的 `constructor` 方法被创建，内部会执行 `super()`。
- 派生类的构造函数中的 `super()` 会创建子类构造函数的 `this`，然后用这个 `this` 执行 `super()`。所以在执行 `super()` 之前派生类的构造函数中没有 `this`，所有用到 `this` 的语句都要写在 `super()` 之后。
- 派生类如果显示的定义了一个 `constructor` 则必须在其中调用 `super` 或者返回一个对象。
- `super` 还可以作为对象，在普通的方法中（包括 `constructor`），这个对象指向父类的 `prototype`，在静态方法中指向父类。注意，父类 `constructor` 中定义的实例的属性和方法是无法访问的，只能访问在 `constructor` 之外定义的静态方法或者 `prototype` 上的方法和访问器属性。
- 在派生类的普通方法中使用 `super` 对象中的方法时，其中的 `this` 指向子类实例。
- 在派生类的静态方法中使用 `super` 对象中的方法时，方法内部的 `this` 指向当前的派生类而不是父类。
- 在派生类的普通方法或静态方法中使用 `super` 时，必须调用 `super` 的某个属性或者方法，不能直接使用 `super`。
- 你不能使用 `delete` 操作符 加 `super.prop` 或者 `super[expr]` 去删除父类的属性，这样做会抛出 `ReferenceError`。
- `super` 作为对象使用时我们只能对其进行读操作，当对 `super` 进行写操作时，所有的操作都发生在 `this` 上。

```javascript
class A {
  fn() {
    console.log('A')
  }
}
A.prototype.x = 10

class B extends A {
  constructor() {
    super()
    //super 在赋值的时候相当于 this，在读取的时候则是指向父类的 prototype
    this.x = 2
    console.log(this.x)
    console.log(super.x)
    super.x = 3
    console.log(this.x)
    console.log(super.x)

    //父类 prototype 上的方法和属性的行为一样，读操作时指向是父类的 prototype，写操作则是写在 this 上
    this.fn() //A
    super.fn() //A
    console.log(this.hasOwnProperty('fn')) //false
    super.fn = function () {
      console.log('B')
    }
    this.fn() //B
    super.fn() //A
    console.log(this.hasOwnProperty('fn')) //true
  }
}

let b = new B()
```

`super` 的规则非常复杂，网络上的相关内容也不多，这里的主要规则来源于 《JavaScript 高级程序设计 第四版》和 《ES6 标准入门》。当然你也可以看 [标准](https://tc39.es/ecma262/#sec-super-keyword '标准')，看起来比较吃力，而且我没有找到 `static` 相关的规定。不过记住这些总结的规则基本上就没有问题了。

### 原生构造函数的继承

在 `ES5` 中我们无法继承原生构造函数，因为原生构造函数无法像普通函数一样用借用构造函数的方法传入 `this` 执行，原生构造函数会忽略 `apply` 或者 `call` 设置的 `this`。比如下面的 `ES5` 尝试继承 `Array` 的代码，它的表现和数组并不相同。

```javascript
function MyArray() {
  Array.apply(this, arguments)
}

MyArray.prototype = Object.create(Array.prototype, {
  constructor: {
    value: MyArray,
    writable: true,
    configurable: true,
    enumerable: true
  }
})

var colors = new MyArray()
colors[0] = 'red'
colors.length // 0

colors.length = 0
colors[0] // "red"
```

`ES5` 是先新建子类的实例对象 `this`，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。比如，`Array` 构造函数有一个内部属性 `[[DefineOwnProperty]]`，用来定义新属性时，更新 `length` 属性，这个内部属性无法在子类获取，导致子类的 `length` 属性行为不正常。

`ES6` 的 `class` 让我们能够实现对原生构造函数的继承，主要原因就是 `class` 的 `super()` 让子类能够用自己的的 `this` 执行构造函数，也支持原生构造函数。

```javascript
class MyArray extends Array {
  constructor(...args) {
    super(...args)
  }
}

var arr = new MyArray()
arr[0] = 12
arr.length // 1

arr.length = 0
arr[0] // undefined
```

有了这个功能之后，`JavaScript` 变得更灵活，我们可以在原生数据结构的基础上定义自己的数据结构。比如下面实现了一个带版本功能的数组：

```javascript
class VersionedArray extends Array {
  constructor() {
    super()
    this.history = [[]]
  }
  commit() {
    this.history.push(this.slice())
  }
  revert() {
    this.splice(0, this.length, ...this.history[this.history.length - 1])
  }
}

var x = new VersionedArray()

x.push(1)
x.push(2)
x // [1, 2]
x.history // [[]]

x.commit()
x.history // [[], [1, 2]]

x.push(3)
x // [1, 2, 3]
x.history // [[], [1, 2]]

x.revert()
x // [1, 2]
```

再来看一自定义 `Error` 的例子：

```javascript
class ExtendableError extends Error {
  constructor(message) {
    super()
    this.message = message
    this.stack = new Error().stack
    this.name = this.constructor.name
  }
}

class MyError extends ExtendableError {
  constructor(m) {
    super(m)
  }
}

var myerror = new MyError('ll')
console.log(myerror.message) // "ll"
console.log(myerror instanceof Error) // true
console.log(myerror.name) // "MyError"
console.log(myerror.stack)
// Error
//     at MyError.ExtendableError
//     ...
```

需要注意的是 `Object` 构造函数和其他内置构造函数的行为不同：

```javascript
class NewObj extends Object {
  constructor() {
    super(...arguments)
  }
}
var o = new NewObj({ attr: true })
o.attr === true // false
```

上面代码中，`NewObj` 继承了 `Object`，但是无法通过 `super` 方法向父类 `Object` 传参。这是因为 `ES6` 改变了 `Object` 构造函数的行为，一旦发现 `Object` 方法不是通过 `new Object()` 这种形式调用，`ES6` 规定 `Object` 构造函数会忽略参数。

有些内置类型的构造函数（比如 `Array`）的方法会返回一个新的实例（比如 `Array` 的 `map` 和 `filter` 等方法），如果我们用的是 `Array` 的派生类创建的实例再调用 `map` 等方法返回的新实例其原型是派生类而不是 `Array`。

```javascript
class SuperArray extends Array {}

let a1 = new SuperArray(1, 2, 3, 4, 5)
let a2 = a1.filter((x) => !!(x % 2))

console.log(a1) // [1, 2, 3, 4, 5]
console.log(a2) // [1, 3, 5]
console.log(a1 instanceof SuperArray) // true
console.log(a2 instanceof SuperArray) // true
```

如果你不希望方法调用返回的对象是派生类的实例，希望是 `Array` 的实例，你需要重写内置的 `Symbol.species` 访问器，这个内置 `Symbol` 就是用来确定返回实例的构造函数的。

```javascript
class SuperArray extends Array {
  get [Symbol.species]() {
    return Array
  }
}

let a1 = new SuperArray(1, 2, 3, 4, 5)
let a2 = a1.filter((x) => !!(x % 2))

console.log(a1) // [1, 2, 3, 4, 5]
console.log(a2) // [1, 3, 5]
console.log(a1 instanceof SuperArray) // true
console.log(a2 instanceof SuperArray) // false
```

## 总结

本文主要是讲了 `ES5` 和 `ES6` 的对象和继承，以及其中的一些细节，面向对象的学习需要在实践中不断的探索和练习。

## 参考文章

1. 《ES6 标准入门》 —— 阮一峰
2. 《JavaScript 高级程序司机 4th Edition》
