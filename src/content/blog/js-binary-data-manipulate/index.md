---
title: 'JS 中的二进制数据的操作'
publishDate: '2021-12-06 12:00:00'
description: ''
tags:
  - js
  - 学习笔记
language: '中文'
heroImage: { 'src': './javascript-logo.jpg', 'color': '#B4C6DA' }
---

## 前言

在 `JavaScript` 设计的初期，没有预计到这个语言会得到如此广泛的应用和发展，也没有想过会处理如此复杂的业务，所以也没有添加对二进制数据处理的支持。但是现在很多场景需要我们处理二进制数据，比如 `canvas` 的图像处理，`WebGL` 与显卡的通信，一些音视频文件的处理（比如语音对讲的功能实现），`ajax` 的二进制输出传输，文件处理（创建，上传，下载）等。需求的改变必然推动 `JavaScript` 对二进制数据处理的支持，目前我们在 `JavaScript` 中处理二进制主要依赖几个对象 `ArrayBuffer`，`TypedArray`， `DataView`， `Blob` 和 `File`等。本文详细探索一下前端二进制处理相关的内容。

## 为什么用二进制

首先说两个计算机中常见的概念 `stream` 流和 `buffer` 缓冲。

## stream 流

我们经常听到的字节流，视频流，文件流，这个流要怎么理解。首先这个 `stream` 肯定就是借用我们现实世界的流的概念来形象化地表示计算机中的抽象概念，比如世界的流入水流气流，所以抽象到计算机中其表示的就是一段连续的数据。比如水龙头，当我们打开开关（开始产生数据），流就产生了，这些数据没有绝对位置，也没有确定的开头和结尾，只是不断产生，并随着时间向前流动，你可以随时截取流中的一段数据进行处理。

## buffer 缓冲

比如我们做音视频处理一般会涉及到 `buffer` 的设置，其实就是我们开辟了一块空间叫做 `buffer`，当数据流装满这个空间的时候我们在一次处理整个 `buffer` 中的数据。因为很多时候我们的 `stream` 的速度不是确定的，为了保证数据的生产和消费的速度相匹配，保证一个稳定的输出。

说完了两个概念我们来说一说为什么要使用二进制数据，可以确定的是这肯定是为了性能。因为二进制就是我们的数据在内存中的形式，直接操作内存的效率肯定是最高的。平时我们开发 `web` 应用基本不需要考虑性能问题，因为 `Web` 应用基本都是 `IO` 密集型的，以如今的个人电脑和移动设备的性能，绝大多数的 `web` 应用的数据量和数据处理都不是瓶颈，即使我们用了比较糟糕的数据结构和算法基本也不存在问题 :laughing:。但是在涉及到像是 `canvas` 和 `webgl` 这样每一帧都需要渲染大量像素的场景下，性能就非常重要，比如 `webgl` 我们就需要连续的内存交给底层的 `C` 的 `API` 去处理。再比如像是前端录制音频和传输，本身就是连续采样的大量的模拟转数字的数据，自然用二进制来处理是最合适的。你可以想象一下上面的这些场景如果我们把数据都存放到数组中我们需要遍历数组额外做很多操作，这样性能肯定大受影响，在这样的 `CPU` 密集型工作显然要优先以性能为第一优先级。

> 关于 `JS` 中为什么使用二进制和引擎的一些细节可以参考 [Are the advantages of Typed Arrays in JavaScript is that they work the same or similar in C?](https://stackoverflow.com/questions/13328658/are-the-advantages-of-typed-arrays-in-javascript-is-that-they-work-the-same-or-s 'Are the advantages of Typed Arrays in JavaScript is that they work the same or similar in C?')

## JS 中的二进制相关对象

`JavaScript` 中的二进制相关对象主要是 `ArrayBuffer`，`TypedArray`（只是一个统称，没有一个叫 `TypedArray` 的对象），`DataView`，`Blob` 和 `File`。其中前三个可以算是真正的二进制操作，后面两个是二进制大对象的操作，不能进行内部的修改。下面我们详细说一说这些对象。

## ArrayBuffer

`ArrayBuffer` 是 `JavaScript` 中基础的二进制对象，是一个固定长度连续内存区域的引用，我们可以用 `ArrayBuffer` 构造函数来创建一个新的 `ArrayBuffer`。

```javascript
const buffer = new ArrayBuffer(16) // 开辟了一个 16 字节的内存
```

注意 `ArrayBuffer` 虽然名字里面有 `Array` ，但是和 `Array` 没有任何关系。该构造函数只是创建一个通用的固定长度的原始二进制数据缓冲区，

`ArrayBuffer` 并没有暴露太多方法和属性，构造函数本身有一个静态方法，`isView` 用来判断所给参数是否是一个 `ArrayBuffer` 的视图，其实就是判断是否是一个 `TypedArray` 或者 `DataView` 的实例。

`ArrayBuffer.prototype` 上暴露了一个属性 `byteLength` 和一个方法 `slice`，前者很简单就是二进制缓冲区的字节数，后者是用来复制这个缓冲区的内容到一个新的 `ArrayBuffer` 中，接受两个参数，一个是开始的字节索引，另一个是结束的字节索引，不包括结束的这个字节。

> 数据的处理速度当然是越高越好的，但是此消彼长，直接操作内存当然效率很高，但是开发过程就要复杂的多，如果只是处理比较简单或者少量的数据就完全没必要，所以实际写程序实际是根据具体的场景选择合适的工具和技术。

## TypedArray

`ArrayBuffer` 帮我们开辟了一块缓冲区，我们是不能直接对这块缓冲区进行操作，需要借助视图，也就是 `TypedArray` 或者 `DataView`，先来介绍以下 `TypedArray`。

首先要说的是并没有一个叫 `TypedArray` 的可访问对象，他是对类型化数组的一个统称，实际上标准中定义了 `TypedArray` 的构造函数，不过这个构造函数并没有暴露出来，不过可以通 `Object.getPrototypeOf(Int8Array)` 来访问到。所有我们能访问的十一种 `TypedArray` 构造函数比如 `Int8Array` 的 `[[prototype]]` 都指向标准中的 `TypedArray` 构造函数，而 `Int8Array.prototype` 的 `[[prototype]]` 则又指向标准中的 `TypedArray.prototype`，所以表达式 `Object.getPrototypeOf(Int8Array).prototype === Int8Array.prototype.__proto__` 的结果为 `true`，它们的关系如下图。

![typedarray2](./images/typedarray2.png 'typedarray2')

一共有 `11` 种不同的 `TypedArray`，见下图。

![typedarray](./images/typedarray.png 'typedarray')

> two's complement 是补码的意思，octet 是八位字节

这 `11` 种 `TypedArray` 就是用来创建操作底层二进制缓冲区的视图的，为了处理不同数据类型的数据而被区分成了不同 `size` 不同含义的类型。**`TypedeArray` 必须使用 `new` 来创建，直接调用会报错！**每个 `TypedArray` 构造函数有多种参数搭配： 1. 无参数，相当于传入 `0` 作为 `length`

```javascript
const initNoArg = new Int8Array()
console.log(initNoArg.byteLength) // 0
```

2. 只传入一个 `length` 的时候就会创建一个 `length` 字节的 `array buffer`

```javascript
const initWithLength = new Int8Array(3)
for (const byte of initWithLength) {
  console.log(byte)
}
/*
 * 0
 * 0
 * 0
 */
```

3. 可以传入一个 `TypedArray` 的实例作为参数，新创建的 `array buffer` 的长度（**注意是 length ，不是 byteLength**）和参数是相同的，会先把参数 `TypedArray` 中的每一个值转为新的 `TypedArray` 所对应的类型然后再赋值。

```javascript
const typedArray = new Int8Array(3)
for (let i = 0; i < typedArray.length; i += 1) {
  typedArray[i] = i
}
const initWithTypedArray = new Int16Array(typedArray)
for (let i = 0; i < initWithTypedArray.length; i += 1) {
  console.log(initWithTypedArray[i])
}
/*
 * 0
 * 1
 * 2
 */
console.log(typedArray.length, initWithTypedArray.length) // 3 3
console.log(typedArray.byteLength, initWithTypedArray.byteLength) // 3 6
```

4. 可以传入一个对象作为参数，该对象必须为类数组对象或者可迭代对象，和 `TypedArray.from` 相似的结果。注意这个作为参数的对象中的迭代值如果是非数字和 `BigInt` 请参考下面的**注意**。

```javascript
const obj = { length: 3 }
const initWithObj = new Int8Array(obj)
for (let i = 0; i < initWithObj.length; i += 1) {
  console.log(initWithObj[i])
}
/*
 * 0
 * 0
 * 0
 */
```

5. 上面的几个都是创建新的 `array buffer`，我们也可以传入一个 `array buffer`，这样就直接生成了这个指定 `array buffer` 视图，还有两个可选的参数 `byteOffset` 和 `length`，我们可以用这两个参数选择 `ArrayBuffer` 的指定区域建立视图。这样我们就可以在一段 `ArrayBuffer` 上使用不同类型的 `TypedArray`，因为很多时候我们的 `ArrayBuffer` 中不都是相同类型的数据。

> **注意：**如果我们给 `TypedArray` 赋值的时候使用的不是数字，比如构造函数传入类数组对象，比如 `TypedArray.from`，根据 [标准](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-settypedarrayfromarraylike '标准')，这些值会先转为数字或者 `BigInt`，然后用 [NumericToRawBytes](https://tc39.es/ecma262/multipage/structured-data.html#sec-numerictorawbytes ' NumericToRawBytes') 方法转为 `RowBypte`，这里不同的 `RowByte` 类型的处理可能略有不同，比如 `Int8` 类型将 `NaN, +0, -0, +∞, or -∞` 全部处理为 `+0`，具体细节参考 [标准](https://tc39.es/ecma262/multipage/indexed-collections.html#table-the-typedarray-constructors '标准')

我们可以像数组一样直接用 `index` 索引访问 `TypedArray`，也可以对其进行赋值。正常情况下我们使用 `Number` 和 `BigInt` 来赋值，`BigInt` 主要是为了处理 `BigInt64Array` 和 `BigUnit64Array`，他们都是 `8` 字节 `64` 位的，超出了 `JavaScript` 能表示的最大安全整数 `2 ^ 53 - 1`，所以要使用 `BigInt` 类型。使用除了这两个类型的其他类型并没有实际意义，如果你对其他类型的行为感兴趣，还是参考上面的 `注意` 中给出的标准中的链接。

`TypedArray` 有两个静态属性，`BYTES_PER_ELEMENT` 和 `name`，前者就是每个索引对应的字节数，参考上面的那张表，第二个就是实例对应的构造函数的名字。还有两个静态方法，`TypedArray.from` 和 `TypedArray.of` 可以类比 `Array.from` 和 `Array.of`。

关于挂载在 `TypedArray` 上的属性和方法我就不一一介绍了，很多都可以和数组进行类比，详细内容查阅 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray 'MDN')，我这里主要介绍两个普通数组中没有的方法。

> 其实 `TypedArray` 就是给了我们一个在 `JavaScript` 中以类似数组的方式来查看和操作二进制数据（也可以理解为我们在操作 `C` 语言中的数据类型），所以才被称为类型化数组 `TypedArray`。

##### TypedArray.prototype.set()

这个方法是用数组或者 `TypedArray` 作为参数来设置 `TypedArray` 的值，语法如下：

```javascript
set(array)
set(array, offset)

set(typedarray)
set(typedarray, offset)

const buffer = new ArrayBuffer(8)
const uint8 = new Uint8Array(buffer)
uint8.set([1, 2, 3], 3)
console.log(uint8)
// Uint8Array(8) [
//     0, 0, 0, 1,
//    2, 3, 0, 0
// ]
```

第一个参数就是我们的复制源，第二个参数表示复制的目标 `TypedArray` 的起始位置。如果复制源（参数）的长度加上 `offset` 已经超出了复制目标的长度，则会抛出错误。

浏览器没有提供像 `NodeJS` 的 `Buffer` 类一样的对 `TypedArray` 类的扩展，所以操作起来比较麻烦的，主要是前端一般使用 `TypedArray` 的场景并不多，比如 `concat` 这样的操作都得要借助 `set` 方法。

##### TypedArray.prototype.subarray()

这个方法是赋值 `TypedArray` 的一部分，和被复制的 `TypedArray` 所对应的 `ArrayBuffer` 是同一个，所以我们通过任意一个视图修改 `ArrayBuffer` 也会影响到另一个视图，因为我们修改的是同一个 `ArrayBuffer`。**需要特别注意的是**和 `TypedArray.prototype.slice` 的区别，他们都是通过 `begin` 和 `end` 索引（左闭右开）生成新视图，但是 `slice` 生成的视图会同时生成一个新的 `ArrayBuffer`，而 `subarray` 不会。

```javascript
const uint8 = new Uint8Array([10, 20, 30, 40, 50])
const array1 = uint8.slice(1)
const array2 = uint8.subarray(1)
uint8[1] = 100
console.log(array1)
console.log(array2)
```

##### 字节序的影响

平时我们编写 `JavaScript` 代码不会关心 `endianness` **字节**顺序，但是在进行操作二进制数据的时候字节顺序就非常重要了。字节顺序分为两种: 1. `Big-Endian` 大端序：数据的低位字节存放在内存的高位地址，高位字节存放在内存的低位地址。 2. `Little-Endian` 小端序：数据的低位存放在内存的低位地址处，高位存放在内存的高位地址。

> 注意是字节顺序，而不是 `bit` 顺序，也就是对于字节内的位的排列还是按照正常的右侧为低位，左侧为高位，因为字节才是计算机寻址的最小单位。

大端序比较符合我们人类的阅读习惯，简单来说就是把数据按照我们的书写方式依次存入内存中，但是这不符合计算机的读取方式，因为计算机的计算都是从低位开始的，而内存的读取肯定是从低到高的，所以把低位存放到内存的低位肯定是更高效的，所以现在的计算机 `CPU` 一般都采取的小端序存入内存，但是在网络传输则使用大端序。关于字节顺序参考 [什么是大端序和小端序，为什么要有字节序](https://cloud.tencent.com/developer/article/1802637 '什么是大端序和小端序，为什么要有字节序') 和 [字节序 - wikipedia](https://zh.wikipedia.org/wiki/%E5%AD%97%E8%8A%82%E5%BA%8F '字节序 - wikipedia')

我们现在使用的 `CPU` 基本都是 `x86` 或者 `ARM` 架构的，`x86` 使用的小端序，`ARM` 是可以配置的，所以我们一般认为 `TypedArray` 工作在小端序下即可，看下面这段代码。

```javascript
const buffer = new ArrayBuffer(8)
const int8Array = new Int8Array(buffer)
int8Array[0] = 30
int8Array[1] = 41
const int16Array = new Int16Array(buffer)
console.log(int16Array[0])
```

我们创建了一个 `8` 字节的 `ArrayBuffer`，然后用一个 `Int8Array` 的视图将 `ArrayBuffer` 的第一和第二字节分别写入了 `30` 和 `41`，也就是分别是二进制的 `00011110` 和 `00101001`，如果按照我们人类的思维模式，也就是大端序，此时 `ArrayBuffer` 的前两个字节也就是 `0001111000101001`，也就是 `7721`。但是我们用一个 `Int16Array` 一次读取两个字节，可以发现得到的结果是 `10526`。其实这就是因为计算机是用小端序来进行处理的，也就是实际上 `ArrayBuffer` 中的前两字节是 `01111000` 和 `10010100`，合并为 `0111100010010100`，然后我们读取的时候最右侧才是最高位，也就是取反一下，得到 `0010100100011110`，结果正好就是 `10526`。

> 这里顺便说一下 `NodeJS` 中的 `Buffer` 类就是继承自 `Uint8Array`，提供了一些浏览器端没有的 `API`，比如读写多字节 `readUIntBE` `writeUIntBe` 等，`NodeJS` 虽然也支持 `Uint8Array`，但是可以使用更好用的 `Buffer` 子类。

## DataView

`DataView` 是另一种形式的视图，它相当于把我们的 `TypedArray` 中的各个类型变成方法，我们可以在一个视图中读取和写入各种类型的二进制数据。并且在 `DataView` 中我们可以自己配置字节序。

和 `TypedArray` 一样，`DataView` 必须通过 `new` 操作符作为构造函数来调用，直接调用会报错。和 `TypedArray` 不同的是，`new DataVIew` 必须有一个 `ArrayBuffer` 作为参数，如果第一个参数不是 `ArrayBuffer` 同样会报错。另外还有两个可选参数，`byteOffset` 表示从 `ArrayBuffer` 的第几个字节开始建立 `DataView` 视图（如果没传则从第一个字节开始），`ByteLength` 表示 `DataView` 的字节数（如果没有传则和 `ArrayBuffer` 相同，`byteOffset` 和 `byteLength` 之和不能超过 `ArrayBuffer` 的 `byteLength`）

```javascript
const buffer = new ArrayBuffer(16)
const view1 = new DataView(buffer)
const view2 = new DataView(buffer, 5)
const view3 = new DataView(buffer, 8, 2)
const view4 = new DataView(buffer, 8, 9) // 报错
console.log(view1)
console.log(view2)
console.log(view3)
// DataView {
//     byteLength: 16,
//     byteOffset: 0,
//     buffer: ArrayBuffer {
//     [Uint8Contents]: <00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>,
//         byteLength: 16
//     }
// }
// DataView {
//     byteLength: 11,
//     byteOffset: 5,
//     buffer: ArrayBuffer {
//     [Uint8Contents]: <00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>,
//         byteLength: 16
//     }
// }
// DataView {
//     byteLength: 2,
//     byteOffset: 8,
//     buffer: ArrayBuffer {
//     [Uint8Contents]: <00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>,
//         byteLength: 16
//     }
// }
```

从上面的输出我们也可以看到 `DataView` 有三个属性 `buffer`，`byteLength` 和 `byteOffset`，对应的就是我们构造函数中的三个参数，这三个属性都是在 `DataView.prototype` 上。

`DataView.prototype` 上共有十对用来读写的 `get` 和 `set` 方法，`get` 方法接受一个 `byteOffset` 作为参数，`set` 方法接受 `byteOffset` 和 `value` 作为参数，`get` 和 `set` 都能传一个可选的 `littleEndian` 参数，如果为 `true` 则为小端序，如果为 `false` 或者 `undefined` 则为大端序，见下表。

| 方法名       | 功能                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| getInt8      | 在指定的 `byteOffset` 读取一个字节，返回该字节表示的 `8` 位有符号整数                      |
| getUint8     | 在指定的 `byteOffset` 读取一个字节，返回该字节表示的 `8` 为无符号整数                      |
| getInt16     | 在指定的 `byteOffset` 读取两个字节，返回该字节表示的 `16` 位有符号整数                     |
| getUint16    | 在指定的 `byteOffset` 读取两个字节，返回该字节表示的 `16` 位无符号整数                     |
| getInt32     | 在指定的 `byteOffset` 读取四个字节，返回该字节表示的 `32` 位有符号整数                     |
| getInt32     | 在指定的 `byteOffset` 读取四个字节，返回该字节表示的 `32` 位无符号整数                     |
| getFloat32   | 在指定的 `byteOffset` 读取四个字节，返回该字节表示的 `32` 位有符号`IEEE-754` 浮点数        |
| getFloat64   | 在指定的 `byteOffset` 读取八个字节，返回该字节表示的 `64` 位有符号`IEEE-754`浮点数         |
| getBigInt64  | 在指定的 `byteOffset` 读取八个字节，返回该字节表示的 `64` 位有符号整数                     |
| getBigUint64 | 在指定的 `byteOffset` 读取八个字节，返回该字节表示的 `64` 位无符号整数                     |
| setInt8      | 在指定的 `byteOffset` 写入一个字节，写入值为 `value` 转换的 `8` 位有符号整数               |
| setUint8     | 在指定的 `byteOffset` 写入一个字节，写入值为 `value` 转换的 `8` 为无符号整数               |
| setInt16     | 在指定的 `byteOffset` 写入两个字节，写入值为 `value` 转换的 `16` 位有符号整数              |
| setUint16    | 在指定的 `byteOffset` 写入两个字节，写入值为 `value` 转换的 `16` 位无符号整数              |
| setInt32     | 在指定的 `byteOffset` 写入四个字节，写入值为 `value` 转换的 `32` 位有符号整数              |
| setInt32     | 在指定的 `byteOffset` 写入四个字节，写入值为 `value` 转换的 `32` 位无符号整数              |
| setFloat32   | 在指定的 `byteOffset` 写入四个字节，写入值为 `value` 转换的 `32` 位有符号`IEEE-754` 浮点数 |
| setFloat64   | 在指定的 `byteOffset` 写入八个字节，写入值为 `value` 转换的 `64` 位有符号`IEEE-754`浮点数  |
| setBigInt64  | 在指定的 `byteOffset` 写入八个字节，写入值为 `value` 转换的 `64` 位有符号整数              |
| setBigUint64 | 在指定的 `byteOffset` 写入八个字节，写入值为 `value` 转换的 `64` 位无符号整数              |

> 在读取或者写入超过一个字节的时候，字节序是非常重要的，如果字节序搞错了很可能导致非常离谱的结果，例子可以看上面的 `TypedArray` 讲字节序时举的例子。

对于不支持 `BigInt` 的[浏览器](https://caniuse.com/?search=bigint '浏览器')，`getBigInt64`, `getBigUint64`，`setBigInt64` 和 `setBigUint64` 无法使用，具体的兼容办法参考 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView#64-bit_integer_values 'MDN')

## Blob

上面介绍的操作二进制的对象你可能没有接触过，但是只要你处理过和文件相关的 `API`，比如上传下载文件，你肯定接触过 `Blob` 对象。

> 注意 `Blob` 是只有浏览器中才有的对象，在 `NodeJS` 中是没有这个对象的。

`blob` 的全称是 `Binary Large Object`，也就是二进制大对象的意思（作为单个实体存储的二进制数据的集合），最早是用在数据库管理系统中，一般是用来存储音频视频和其他多媒体文件，也有一些二进制可执行代码被存储为一个 `blob`。

在 `JavaScript` 中，`Blob` 对象代表一个 `blob`, 它是一个类似文件的不可变原始数据对象；它们可以作为文本或二进制数据读取，或转换为 `ReadableStream` 以便其方法可用于处理数据。`Blobs` 可以用来表示没有采用 `JavaScript` 原生格式的数据，`File` 接口就是继承自 `Blob` 并进行了扩展来支持用户系统中的文件。

从上面的描述我们可以看出，`Blob` 对象也是二进制数据的集合，但是它是一个不可变的对象，我们不能像 `ArrayBuffer` 一样利用视图对其进行读写。

我们可以用 `Blob` 构造函数创建一个新的 `Blob` 对象，这个构造函数接受一个 `array` 作为必选参数，可以理解为构建 `Blob` 的数据源，这个数据源的格式必须是数组，数组中的元素必须是 `ArrayBuffer`，`TypedArray`，`Blob`，`USVString` 对象。另一个可选参数是 `options`，是一个独享，其中比较重要的一个属性就是 `type`，默认值是 `""`，这个值是表名这个 `blob` 数据的 `MIME type`。

> `USVString` 的概念可以参考 [搞懂字符编码](https://www.clloz.com/programming/assorted/2019/04/26/character-encoding/#USVStringDOMStringCSSOMString '搞懂字符编码')

```javascript
const text = new Blob(['clloz'], { type: 'text/plain' })
console.log(text)
//Blob {size: 5, type: 'text/plain'}
//size: 5
//type: "text/plain"
```

我们可以看到 `Blob` 有两个属性 `size` 和 `type`，这两个属性都是在 `Blob.prototype` 上，分别表示 `Blob` 对象中的数据的字节数和 `Blob` 对象的 `MIME type`。

原型上还有几个方法

### Blob.prototype.arrayBuffer()

该方法返回一个 `Promise`，这个 `Promise` 的状态是 `resolve`，`resolve` 的值是一个包含 `blob` 中的二进制数据的 `ArrayBuffer`。

```javascript
const blob = new Blob(['123'])
const bufferPromise = blob.arrayBuffer()
const buffer = await blob.arrayBuffer()
const view = new Int8Array(buffer)
for (const item of view) {
  console.log(item)
}
// 49
// 50
// 51
```

字符串中的 `123` 被保存为 `unicode` 中的 `codepoint`，对应的就是 `49， 50，51`。

##### Blob.prototype.slice()

看到 `slice` 自然明白就是切片，接受三个可选参数 `start`，`end` 和 `contentType`。`start` 和 `end` 是左闭右开的截取范围，默认截取全部，如果 `start` 大于 `blob` 的 `size` 则返回一个 `size` 为 `0` 的 `blob`。`start` 或者 `end` 如果为负值则从最后一个字节向前计算。`contentType` 默认为 `""`。

```javascript
const blob = new Blob(['123'])
const newBlob = blob.slice(1)
const bufferPromise = newBlob.arrayBuffer()
const buffer = await newBlob.arrayBuffer()
const view = new Int8Array(buffer)
for (const item of view) {
  console.log(item)
}
// 50
// 51
```

##### Blob.prototype.stream()

这个方法返回一个 `ReadableStream` 来读取 `Blob` 对象中的内容，[ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream 'ReadableStream') 的相关内容可以参考文档，是 `Fetch API` 在 `Response` 中提供的一个对象，这里给大家一个例子。

```javascript
const blob = new Blob(['123'])
blob
  .stream()
  .getReader()
  .read()
  .then(({ done, value }) => {
    console.log(done)
    console.log(value)
  })
// Uint8Array(3) [49, 50, 51, buffer: ArrayBuffer(3), byteLength: 3, byteOffset: 0, length: 3]
```

##### Blob.prototype.text()

这个方法返回一个 `Promise`，将 `Blob` 对象中的内容转为 `UTF-8` 返回。

```javascript
const view = new Int8Array([67, 108, 108, 111, 122])
const blob = new Blob([view])
blob.text().then((val) => console.log(val))
// Clloz
```

## 应用

## 字符串和 ArrayBuffer 的转换

在能够确定字符的编码的时候（确定了编码我们就知道字符串在内存中的存储形式），我们可以在字符串和 `ArrayBuffer` 之间进行互相转换，比如 `UTF-16` 可以用如下代码转换：

```javascript
// ArrayBuffer转为字符串，参数为ArrayBuffer对象
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf))
}

// 字符串转为ArrayBuffer对象，参数为字符串
function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2) // 每个字符占用2个字节
  var bufView = new Uint16Array(buf)
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}
```

## 播放 PCM

之前做过一个语音对讲的需求，一般来说录音设备直接录制的音频是未经压缩的音频采样数据裸流 `PCM（Pulse Code Modulation）`，这个 `PCM` 格式是不能直接在前端播放的，我采用的方式是添加一个 `wav` 的 `header` 转成 `wav` 后进行播放，大致的做法如下。

```javascript
// 将后端传递的 PCM 字符串转为 buffer 并添加 wav header UTF-16格式字符串
export function addWavHeader(str) {
  const WAV_HEAD_SIZE = 44
  const buffer = new ArrayBuffer(str.length * 2 + WAV_HEAD_SIZE)
  const view = new DataView(buffer)

  // 为 PCM 添加 wav header 转为 wav
  // RIFF chunk descriptor/identifier
  writeUTFBytes(view, 0, 'RIFF')
  // RIFF chunk length
  view.setUint32(4, 44 + str.length * 2, true)
  // RIFF type
  writeUTFBytes(view, 8, 'WAVE')
  // format chunk identifier
  // FMT sub-chunk
  writeUTFBytes(view, 12, 'fmt ')
  // format chunk length
  view.setUint32(16, 16, true)
  // sample format (raw)
  view.setUint16(20, 1, true)
  // stereo (2 channels)
  view.setUint16(22, 1, true)
  // sample rate
  view.setUint32(24, 8000, true)
  // byte rate (sample rate * block align)
  view.setUint32(28, 8000 * 2, true)
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true)
  // bits per sample
  view.setUint16(34, 16, true)
  // data sub-chunk
  // data chunk identifier
  writeUTFBytes(view, 36, 'data')
  // data chunk length
  view.setUint32(40, str.length * 2, true)

  const length = str.length
  let index = 44
  for (let i = 0; i < length; i++) {
    view.setInt16(index, str.charCodeAt(i), true)
    index += 2
  }
  return buffer
}

// 生成 wav 并用 audio 播放
export function genWavAndPlay(buffer) {
  const blob = new Blob([new Uint8Array(buffer)])
  const blobUrl = URL.createObjectURL(blob)
  if (!blobUrlList.length) {
    audioEl.src = blobUrl
    audioEl.play()
  } else {
    blobUrlList.push(blobUrl)
  }
}
```

## 发送接收二进制数据

[JavaScript 接收发送二进制数据](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data 'JavaScript 接收发送二进制数据')

## 参考资料

1. [ecma-262](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/ 'ecma-262')
2. [如何理解编程语言中流的概念](https://www.zhihu.com/question/27996269 '如何理解编程语言中流的概念')
3. [cache 和 buffer 都是缓存，主要区别是什么](https://www.zhihu.com/question/26190832 'cache 和 buffer 都是缓存，主要区别是什么')
4. [ArrayBuffer, binary arrays](https://javascript.info/arraybuffer-binary-arrays 'ArrayBuffer, binary arrays')
5. [ArrayBuffer - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer 'ArrayBuffer - MDN')
6. [TypedArray - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray 'TypedArray - MDN')
7. [DataView - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView 'DataView - MDN')
8. [jsmpeg系列一 基础知识 字符处理 ArrayBuffer TypedArray](https://www.jianshu.com/p/b9a77b1891a7 'jsmpeg系列一 基础知识 字符处理 ArrayBuffer TypedArray')
