---
title: 'ffmpeg的安装和使用和gyao视频下载'
publishDate: '2019-10-01 12:00:00'
description: ''
tags:
  - assorted
  - 学习资源
  - 实用技巧
language: '中文'
heroImage: { 'src': './ffmpeg.png', 'color': '#B4C6DA' }
---

## 前言

`ffmpeg` 是大名鼎鼎的开源免费跨平台的视频和音频流方案，提供了录制、转换以及流化音视频的完整解决方案。我以前用过来转视频格式，后来一直就没用过了。十月的日剧新番，暌违13年的经典日剧 `結婚できない男` 要出续作了，作为特别喜欢这部剧的忠实粉丝，我一直关注这关西电视台的 `まだ結婚できない男` 的主页，`20` 号的时候推出了 `チェインストーリー　#0.5　中川家の人々`，不过 `gyao` 上的视频似乎锁了 `IP`，而且我挂日本的 `vpn` 也无济于事，看不了。这时候 `ffmpeg` 就派上用场了。本文就介绍一下关于 `ffmpeg` 的安装和使用。

## 安装

`Mac` 上的安装十分简单，直接用 `homebrew` 就可以了，其他平台的自己 `google` 一下，应该也很容易。[这里](https://github.com/FFmpeg/FFmpeg '这里')是 `ffmpeg` 的 `GitHub` 地址。

```bash
brew install ffmpeg
```

## 常用命令

`ffmpeg Document` 链接：[https://ffmpeg.org/ffmpeg.html](https://ffmpeg.org/ffmpeg.html 'https://ffmpeg.org/ffmpeg.html')

## 常用命令参数

```bash
ffmpeg [global_options] {[input_file_options] -i input_url} ... {[output_file_options] output_url} ...

ffmpeg -i [输入文件名] [参数选项] -f [格式] [输出文件]

#主要参数
-i #设定输入流
-f #设定输出格式
-ss #开始时间

#视频参数
-b #设定视频流量(码率)，默认为200Kbit/s
-r #设定帧速率，默认为25
-s #设定画面的宽与高
-aspect #设定画面的比例
-vn #不处理视频
-vcodec #设定视频编解码器，未设定时则使用与输入流相同的编解码器

#音频参数
-ar #设定采样率
-ac #设定声音的Channel数
-acodec #设定声音编解码器，未设定时则使用与输入流相同的编解码器
-an #不处理音频
```

参数选项： 1. -an: 去掉音频 2. -vn: 去掉视频 3. -acodec: 设定音频的编码器，未设定时则使用与输入流相同的编解码器。音频解复用在一般后面加copy表示拷贝 4. -vcodec: 设定视频的编码器，未设定时则使用与输入流相同的编解码器，视频解复用一般后面加copy表示拷贝 5. –f: 输出格式（视频转码） 6. -bf: B帧数目控制 7. -g: 关键帧间隔控制(视频跳转需要关键帧) 8. -s: 设定画面的宽和高，分辨率控制(352\*278) 9. -i: 设定输入流 10. -ss: 指定开始时间（0:0:05） 11. -t: 指定持续时间（0:05） 12. -b: 设定视频流量，默认是200Kbit/s 13. -aspect: 设定画面的比例 14. -ar: 设定音频采样率 15. -ac: 设定声音的Channel数 16. -r: 提取图像频率（用于视频截图） 17. -c:v: 输出视频格式 18. -c:a: 输出音频格式 19. -y: 输出时覆盖输出目录已存在的同名文件

## 查看媒体文件信息

```bash
ffmpeg -i video.mp4
ffmpeg -i video.mp4 -hide_banner
```

## 视频格式转换

```bash
ffmpeg -i input.avi output.mp4
ffmpeg -i input.mp4 output.ts
ffmpeg -i input.webm -qscale 0 output.mp4 #维持源视频文件的质量
ffmpeg -formats #检查支持的格式
```

一般我们在网站上看到的视频，都能够用 `ffmpeg` 下载下来，打开控制台，找到形如 `https://vdn.vzuu.com/Act-ss-m3u8......` 的请求，然后用 `ffmpeg -i "https://vdn.vzuu.com/SD/49c8..." output.mp4` 即可下载下来。

## 提取音频和视频

```bash
ffmpeg -i input.mp4 -acodec copy -vn output.aac #提取音频
ffmpeg -i input.mp4 -vcodec copy -an output.mp4 #提取视频
```

## 剪切视频

```bash
ffmpeg -ss 00:00:15 -t 00:00:05 -i input.mp4 -vcodec copy -acodec copy output.mp4 #-ss表示开始切割的时间，-t表示要切多少
```

## 码率控制

码率 `bitrate` 就是单位时间内传输的位数。我们的视频音频传输的时候也是二进制流，我们说的视频音频大小就是一个媒体文件的总位数，比如一个 `20M` 的文件，它的总位数就是 `20 * 1024 * 1024 * 8 = 167772160bit`，如果这个视频的时常是 `60s`，那么它的码率就是 `167772160 / 60 = 2796 kbps`，所以码率的计算公式就为 `bitrate = file size / duration`，媒体文件越大，一般码率就越高，因为单位时间内要传输的内容更多。

```bash
ffmpeg -i input.mp4 -b:v 2000k output.mp4 #不破坏分辨率压缩码率
ffmpeg -i input.mp4 -b:v 2000k -bufsize 2000k output.mp4 #减少码率波动
ffmpeg -i input.mp4 -b:v 2000k -bufsize 2000k -maxrate 2500k output.mp4 #设置码率波动的阈值
```

## 编码格式转换

```bash
ffmpeg -i input.mp4 -vcodec h264 output.mp4
ffmpeg -i input.mp4 -vcodec mpeg4 output.mp4
#调用外部的x265或者X264编码器
ffmpeg -i input.mp4 -c:v libx265 output.mp4
ffmpeg -i input.mp4 -c:v libx264 output.mp4
```

## 滤镜 filter

```bash
ffmpeg -i input.mp4 -vf scale=960:540 output.mp4 #将输入的1920x1080缩小到960x540输出
ffmpeg -i input.mp4 -i logo.png -filter_complex overlay output.mp4 #为视频添加logo
```

## 抓去视频帧保存为图片

```bash
#-r 表示每一秒几帧
#-q:v表示存储jpeg的图像质量，一般2是高质量。
#-ss 表示开始时间
#-t表示共要多少时间。
ffmpeg -i input.mp4 -ss 00:00:20 -t 10 -r 1 -q:v 2 -f image2 pic-%03d.jpeg
```

## 提取 gyao 的视频

有了上面的内容，提取 `gyao` 上的视频就很简单了，只要找到文件的请求路径就可以了，我们可以到这个网站[Gyao MMS URL](http://kmake.net/gyaommsurl/?url= 'Gyao MMS URL')来提取，进入网站直接输入就能得到不同分辨率的文件地址，得到地址后我们直接用 `ffmpeg` 下载到本地即可。不过下载的时候最好还是挂着梯子，文件很大的时候由于网络问题很难下载成功，我下 `720p` 的时候就失败了，最后只能下载低清晰度的。

趁着日本节点的网络环境比较好，顺利把 `720p` 的下载下来了，已经上传到百度云了，下载地址和提取码`https://pan.baidu.com/s/1MlC7kHXHJXGyqH50e3SBgg jzaq`

## 关于视音频技术

学习就像不断的画圆，自己掌握的知识越多，自己的半径就越大，面积也越大，不过同时增长的是自己未知的东西，并且增长更快，也就是所谓的知道的越多，不知道的就越多。`ffmpeg` 是视音频技术的基础和入门，如果想学习这方面技术的可以看： 1. [雷霄骅的专栏](https://blog.csdn.net/leixiaohua1020 '雷霄骅的专栏') 2. [FFMPEG视音频编解码零基础学习方法](https://blog.csdn.net/leixiaohua1020/article/details/15811977 'FFMPEG视音频编解码零基础学习方法') 人的一生太短暂了，知识的汪洋能取一勺就不简单了，只能抓紧有限的时间尽量多的学习。

## 参考文章

1. [ffmpeg基础使用 合肥懒皮](https://www.jianshu.com/p/ddafe46827b7 'ffmpeg基础使用  合肥懒皮')
2. [GyaO（ギャオ）をFFmpegで完全攻略](https://koukokutou-club.com/gyao/ffmpeg.html 'GyaO（ギャオ）をFFmpegで完全攻略')
3. [FFMPEG常用命令-慕课网知乎](https://zhuanlan.zhihu.com/p/46903150 'FFMPEG常用命令-慕课网知乎')
