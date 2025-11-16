# 博客迁移脚本使用说明

## 功能说明

`scripts/migrateBlog.mjs` 脚本用于将 WordPress 导出的 Markdown 文章批量转换为 Astro 博客格式。

### 主要功能

1. ✅ **自动扫描** - 递归扫描 `old-blog` 文件夹中的所有 `.md` 文件
2. ✅ **创建独立文件夹** - 为每篇文章创建独立文件夹（便于管理封面图等资源）
3. ✅ **转换 Frontmatter** - 将 WordPress frontmatter 转换为 Astro 格式
4. ✅ **标题层级转换** - 自动将 `###` 转为 `##`，`####` 转为 `###`
5. ✅ **移除 TOC 标记** - 删除 `[toc]` 标记（Astro 会自动生成目录）
6. ✅ **处理图片路径** - 自动复制 `images` 文件夹并修正图片路径
7. ✅ **提取日期** - 从文件路径或 frontmatter 中提取发布日期
8. ✅ **合并标签** - 合并 WordPress 的 categories 和 tags

## 使用方法

### 1. Dry Run（预览模式）

先运行预览模式，查看转换效果但不实际创建文件：

```bash
# 编辑脚本，设置 dryRun: true
# const CONFIG = {
#   ...
#   dryRun: true,
#   ...
# }

node scripts/migrateBlog.mjs
```

### 2. 正式迁移

确认预览效果无误后，执行正式迁移：

```bash
# 编辑脚本，设置 dryRun: false
node scripts/migrateBlog.mjs
```

### 3. 增量迁移

脚本默认会跳过已存在的文章（`skipExisting: true`），如果需要重新转换所有文章：

```bash
# 编辑脚本，设置 skipExisting: false
node scripts/migrateBlog.mjs
```

## 配置选项

在 `scripts/migrateBlog.mjs` 中可以修改以下配置：

```javascript
const CONFIG = {
  oldBlogDir: path.join(__dirname, '../old-blog'), // 源目录
  newBlogDir: path.join(__dirname, '../src/content/blog'), // 目标目录
  dryRun: false, // true: 只预览不创建文件
  skipExisting: true // true: 跳过已存在的文章
}
```

## 转换示例

### WordPress 格式

```markdown
---
title: 'Vue 2.0 源码分析（一）'
date: '2022-03-15'
categories:
  - '前端'
  - 'Vue'
tags:
  - '源码分析'
  - 'JavaScript'
coverImage: 'cover.jpg'
---

[toc]

### 前言

这是正文内容...

#### 小标题

更多内容...
```

### 转换后的 Astro 格式

```markdown
---
title: 'Vue 2.0 源码分析（一）'
publishDate: '2022-03-15 12:00:00'
description: ''
tags:
  - 前端
  - Vue
  - 源码分析
  - JavaScript
heroImage: { src: './cover.jpg', color: '#B4C6DA' }
language: '中文'
---

## 前言

这是正文内容...

### 小标题

更多内容...
```

## 转换规则

### Frontmatter 映射

| WordPress 字段        | Astro 字段      | 说明                     |
| --------------------- | --------------- | ------------------------ |
| `title`               | `title`         | 文章标题                 |
| `date`                | `publishDate`   | 发布日期（自动添加时间） |
| `categories` + `tags` | `tags`          | 合并为标签数组           |
| `coverImage`          | `heroImage.src` | 封面图路径               |
| -                     | `language`      | 固定为 '中文'            |

### 内容转换

1. **标题层级**
   - `###` → `##`（h3 → h2）
   - `####` → `###`（h4 → h3）

2. **TOC 标记**
   - 移除 `[toc]` 标记（Astro 自动生成）

3. **图片路径**
   - `![](images/pic.jpg)` → `![](./images/pic.jpg)`
   - 自动复制 `images` 文件夹到新位置

### 文件夹结构

**转换前：**

```
old-blog/
├── 2022/
│   └── 03/
│       ├── vue2-1.md
│       └── images/
│           └── pic.jpg
```

**转换后：**

```
src/content/blog/
└── vue2-1/
    ├── index.md
    └── images/
        └── pic.jpg
```

## 迁移后的工作

### 1. 检查转换结果

```bash
# 启动开发服务器
pnpm dev

# 浏览器访问
http://localhost:4321
```

### 2. 添加封面图

为每篇文章添加合适的封面图：

```bash
# 在文章文件夹中添加封面图
src/content/blog/article-name/
├── index.md
├── thumbnail.jpg  # 添加封面图
└── images/
```

然后更新 frontmatter：

```yaml
heroImage: { src: './thumbnail.jpg', color: '#B4C6DA' }
```

### 3. 检查特殊内容

- ✅ 代码块语法高亮
- ✅ 图片链接是否正确
- ✅ 内部链接是否需要更新
- ✅ HTML 标签是否需要转换
- ✅ 特殊字符是否正确显示

### 4. 批量操作

如果需要批量修改某些内容，可以使用：

```bash
# 批量替换某个字符串
find src/content/blog -name "index.md" -exec sed -i '' 's/old/new/g' {} +

# 批量添加 description
find src/content/blog -name "index.md" -exec sed -i '' "s/description: ''/description: 'TODO'/g" {} +
```

## 常见问题

### Q1: 转换后的文章没有显示？

A: 检查以下几点：

1. frontmatter 格式是否正确（YAML 语法）
2. `publishDate` 日期格式是否正确
3. 文章是否在 `src/content/blog` 目录下
4. 运行 `pnpm sync` 重新同步内容集合

### Q2: 图片无法显示？

A: 检查：

1. 图片路径是否正确（使用相对路径 `./images/xxx.jpg`）
2. `images` 文件夹是否已复制到文章目录
3. 图片文件名是否正确（注意大小写）

### Q3: 标题层级不对？

A: 脚本会自动转换标题层级：

- 如果原文从 `###` 开始，会转为 `##`
- 如果需要自定义转换规则，可以修改 `convertHeadings` 函数

### Q4: 想保留原有的标题层级？

A: 注释掉 `convertHeadings` 调用：

```javascript
// newContent = convertHeadings(newContent)
```

## 技术细节

### 依赖

脚本使用 Node.js 原生模块，无需额外安装依赖：

- `fs/promises` - 文件操作
- `path` - 路径处理

### 性能

- 处理速度：约 10-20 篇/秒（取决于文件大小和图片数量）
- 内存占用：约 50-100MB（取决于文章数量）

### 错误处理

- ✅ 自动跳过无效文件
- ✅ 记录失败的文章
- ✅ 不会覆盖已存在的文章（除非设置 `skipExisting: false`）

## 支持

如果遇到问题：

1. 查看控制台输出的错误信息
2. 检查脚本配置是否正确
3. 尝试 dry run 模式查看转换结果
4. 查看失败文章的原始格式是否特殊

## 更新日志

### v1.0.0 (2025-11-16)

- ✅ 初始版本
- ✅ 支持 WordPress frontmatter 转换
- ✅ 支持标题层级转换
- ✅ 支持图片自动复制
- ✅ 支持 dry run 模式
