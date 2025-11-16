# 博客脚本工具说明

本目录包含用于博客维护和内容迁移的实用脚本工具。

## 📋 脚本列表

### 1. blogMaintenance.mjs - 博客维护工具集

**用途**：日常博客维护的综合工具，提供交互式菜单进行各种清理和修复操作。

**功能**：

- 🖼️ 清理未引用的图片：删除 `images` 文件夹中未被文章引用的图片
- 🔄 清理重复的图片：删除同时存在于根目录和 `images` 文件夹的重复图片
- 💬 修复代码块语言类型：
  - 为未指定语言的 HTML 代码块添加 `html` 标识
  - 替换不支持的语言类型（`markup` → `html`, `actionscript` → `javascript`, `ignore` → `plaintext`）
- 🔢 修复数学公式中的中文括号：将 LaTeX 公式中的中文括号 `（）` 替换为英文括号 `()`
- 🔧 恢复缺失的图片：从 `old-blog` 中恢复被误删的图片文件
- ⚡ 全面清理：一键执行所有清理操作（不含恢复图片）
- 🧪 DRY RUN 模式：测试模式，不实际修改文件

**使用方法**：

```bash
node scripts/blogMaintenance.mjs
```

**交互式菜单**：

```
📝 博客维护工具集
===========================================================

请选择操作：

  1. 清理未引用的图片
  2. 清理重复的图片
  3. 修复代码块语言类型
  4. 修复数学公式中的中文括号
  5. 恢复缺失的图片
  6. 全面清理（执行所有清理操作）
  7. 切换 DRY RUN 模式 (当前: OFF)
  0. 退出

请输入选项 (0-7):
```

**使用场景**：

- 定期清理不再使用的图片资源
- 修复内容格式问题
- 优化项目体积

---

### 2. migrateBlog.mjs - WordPress 博客迁移工具

**用途**：将 WordPress 博客文章从 `old-blog` 目录迁移到 Astro 格式的 `src/content/blog` 目录。

**功能**：

- 📝 转换 WordPress frontmatter 到 Astro 格式
- 🔄 标题级别转换：`###` → `##`, `####` → `###`
- 🗑️ 移除 `[toc]` 标记（Astro 会自动生成目录）
- 🖼️ 复制文章的封面图片（coverImage）到文章目录
- 📁 复制 images 文件夹（如果存在）
- 🏷️ 合并 categories 和 tags
- 📅 保留发布日期

**目录结构转换**：

```
old-blog/2018/10/article-name.md
                 /images/photo.jpg
                        /cover.jpg
↓
src/content/blog/article-name/
                          index.md
                          cover.jpg
                          images/
                              photo.jpg
```

**使用方法**：

```bash
node scripts/migrateBlog.mjs
```

**配置选项**（在脚本中）：

```javascript
const CONFIG = {
  oldBlogDir: path.join(__dirname, '../old-blog'),
  newBlogDir: path.join(__dirname, '../src/content/blog'),
  dryRun: false, // 设为 true 进行测试运行
  skipExisting: true // 跳过已存在的文章
}
```

**使用场景**：

- 首次从 WordPress 迁移到 Astro
- 批量导入历史文章

---

### 3. fixHeroImages.mjs - 封面图片修复工具

**用途**：查找并修复文章中缺失的封面图片（heroImage）。

**功能**：

- 🔍 扫描所有文章，检查 frontmatter 中定义的 heroImage 是否存在
- 🔎 在 `old-blog` 目录中搜索缺失的图片
- 📋 自动复制找到的图片到对应文章目录
- 📊 生成修复报告

**使用方法**：

```bash
node scripts/fixHeroImages.mjs
```

**输出示例**：

```
🔍 开始检查 heroImage 问题...

❌ 缺失: article-name/cover.jpg
✅ 已修复: article-name/cover.jpg (从 old-blog/2020/09/images 复制)

==================================================
📊 检查完成！
📝 已检查: 215 篇文章
✅ 已修复: 42 篇文章
❌ 修复失败: 0 篇文章
```

**使用场景**：

- 迁移后发现封面图片缺失
- 批量恢复历史文章的封面图片

---

## 🚀 常见工作流

### 首次迁移博客

```bash
# 1. 迁移文章
node scripts/migrateBlog.mjs

# 2. 修复缺失的封面图片
node scripts/fixHeroImages.mjs

# 3. 清理和优化
node scripts/blogMaintenance.mjs
# 选择 "5. 全面清理"
```

### 日常维护

```bash
# 运行维护工具
node scripts/blogMaintenance.mjs

# 根据需要选择具体操作
```

### 测试运行（不实际修改文件）

1. 运行 `blogMaintenance.mjs`
2. 选择 "6. 切换 DRY RUN 模式" 开启测试模式
3. 执行需要测试的操作
4. 确认无误后，关闭 DRY RUN 模式再次执行

---

## 📊 脚本执行结果

所有脚本执行后都会显示详细的统计信息：

```
==================================================
📊 清理完成！
📝 已检查: 216 篇文章
✅ 已清理: 184 篇文章
🗑️  总删除: 4446 个图片
```

---

## ⚠️ 注意事项

1. **备份重要**：执行任何批量操作前，建议先提交 git 或创建备份
2. **测试先行**：首次使用建议开启 DRY RUN 模式测试
3. **逐步执行**：大规模清理建议分步骤执行，便于排查问题
4. **检查结果**：执行后检查几篇文章，确认效果符合预期

---

## 🛠️ 技术细节

### 文件格式要求

- 文章使用 Markdown 格式（`.md`）
- 文章必须包含 YAML frontmatter
- 图片支持格式：`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

### 目录结构

```
src/content/blog/
  article-name/
    index.md          # 文章内容
    cover.jpg         # 封面图（heroImage）
    images/           # 文章中的其他图片
      photo1.jpg
      photo2.png
```

### Frontmatter 示例

```yaml
---
title: '文章标题'
publishDate: '2024-01-01 12:00:00'
description: '文章描述'
tags:
  - JavaScript
  - Web
language: '中文'
heroImage: { 'src': './cover.jpg', 'color': '#B4C6DA' }
---
```

---

## 📝 维护历史

### 已完成的清理工作

- ✅ 迁移 212 篇 WordPress 文章
- ✅ 修复 170 个缺失的封面图片
- ✅ 删除 5,337 张无用或重复的图片
- ✅ 修复所有代码块语言类型问题
- ✅ 修复数学公式中的中文括号

### 当前状态（2025-11-16）

- 📝 216 篇文章
- 🖼️ 195 张图片（全部被使用）
  - 根目录封面图：176 张
  - images 文件夹图片：19 张
- 📦 项目体积：优化完成

---

## 🤝 贡献

如果需要添加新功能或修复 bug，请：

1. 修改对应脚本
2. 更新此文档
3. 测试功能正常运行
4. 提交更改

---

## 📮 问题反馈

如遇到问题或有改进建议，请在项目中提出 issue。
