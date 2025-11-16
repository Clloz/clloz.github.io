#!/usr/bin/env node

/**
 * WordPress to Astro Blog Migration Script
 *
 * 这个脚本会：
 * 1. 扫描 old-blog 文件夹中的所有 markdown 文件
 * 2. 将每篇文章转换为 Astro 格式
 * 3. 创建独立的文件夹结构（便于添加封面图）
 * 4. 转换标题层级（### -> ##, #### -> ###）
 * 5. 转换 WordPress frontmatter 为 Astro frontmatter
 * 6. 处理图片路径
 * 7. 移除或转换 [toc] 标记
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const CONFIG = {
  oldBlogDir: path.join(__dirname, '../old-blog'),
  newBlogDir: path.join(__dirname, '../src/content/blog'),
  dryRun: false, // 设置为 true 只打印不实际创建文件
  skipExisting: true // 跳过已存在的文章
}

// 从 WordPress frontmatter 提取信息
function parseWordPressFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, content }
  }

  const frontmatterText = match[1]
  const bodyContent = content.slice(match[0].length).trim()

  const frontmatter = {}
  const lines = frontmatterText.split('\n')

  let currentKey = null
  let currentValue = []

  for (const line of lines) {
    // 检查是否是新的键
    if (line.match(/^[a-zA-Z_-]+:/)) {
      // 保存上一个键的值
      if (currentKey) {
        frontmatter[currentKey] = currentValue.join('\n').trim()
      }

      // 解析新键
      const colonIndex = line.indexOf(':')
      currentKey = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 1).trim()

      // 移除引号
      currentValue = [value.replace(/^["']|["']$/g, '')]
    } else if (currentKey) {
      // Multi-line value continuation
      currentValue.push(line.trim())
    }
  }

  // 保存最后一个键
  if (currentKey) {
    frontmatter[currentKey] = currentValue.join('\n').trim()
  }

  return { frontmatter, content: bodyContent }
}

// 转换标题层级
function convertHeadings(content) {
  // 先转换 #### 为 ###（必须先转换更多的#，避免重复转换）
  content = content.replace(/^####\s+/gm, '### ')

  // 再转换 ### 为 ##
  content = content.replace(/^###\s+/gm, '## ')

  return content
}

// 移除 [toc] 标记
function removeTocMarker(content) {
  return content.replace(/^\[toc\]\s*$/gim, '').trim()
}

// 处理图片路径
function processImagePaths(content, articleSlug) {
  // 将相对路径的图片转换为正确的路径
  // 例如：![](images/xxx.jpg) -> ![](./images/xxx.jpg)
  content = content.replace(/!\[([^\]]*)\]\(images\//g, '![$1](./images/')

  return content
}

// 清理和转换 categories/tags
function cleanArray(str) {
  if (!str) return []

  // 移除开头的 "- " 和引号
  return str
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'))
    .map((line) => line.replace(/^-\s*["']?|["']$/g, '').trim())
    .filter(Boolean)
}

// 生成 Astro frontmatter
function generateAstroFrontmatter(wpFrontmatter, publishDate) {
  const categories = cleanArray(wpFrontmatter.categories)
  const tags = cleanArray(wpFrontmatter.tags)

  // 合并 categories 和 tags
  const allTags = [...new Set([...categories, ...tags])]

  const frontmatter = {
    title: wpFrontmatter.title || 'Untitled',
    publishDate: publishDate || new Date().toISOString().split('T')[0] + ' 12:00:00',
    description: wpFrontmatter.description || '',
    tags: allTags.length > 0 ? allTags : ['未分类'],
    language: '中文'
  }

  // 如果有 coverImage，添加 heroImage
  if (wpFrontmatter.coverImage) {
    frontmatter.heroImage = {
      src: `./${wpFrontmatter.coverImage}`,
      color: '#B4C6DA'
    }
  }

  return frontmatter
}

// 生成 frontmatter 字符串
function stringifyFrontmatter(frontmatter) {
  let result = '---\n'

  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      result += `${key}:\n`
      value.forEach((item) => {
        result += `  - ${item}\n`
      })
    } else if (typeof value === 'object') {
      result += `${key}: ${JSON.stringify(value)}\n`
    } else {
      result += `${key}: '${value}'\n`
    }
  }

  result += '---\n\n'
  return result
}

// 生成 slug（文件夹名称）
function generateSlug(filename, publishDate) {
  // 移除 .md 扩展名
  const baseName = filename.replace(/\.md$/, '')

  // 如果文件名已经是合理的 slug，直接使用
  // 否则，可以使用日期+文件名的组合
  return baseName
}

// 处理单个文章
async function processArticle(filePath, relativePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const filename = path.basename(filePath)

    // 从路径中提取日期（如果存在）
    const dateMatch = relativePath.match(/(\d{4})\/(\d{2})/)
    let publishDate = null
    if (dateMatch) {
      publishDate = `${dateMatch[1]}-${dateMatch[2]}-01 12:00:00`
    }

    // 解析 WordPress frontmatter
    const { frontmatter: wpFrontmatter, content: bodyContent } = parseWordPressFrontmatter(content)

    // 如果 frontmatter 中有 date，使用它
    if (wpFrontmatter.date) {
      publishDate = wpFrontmatter.date.replace(/^["']|["']$/g, '') + ' 12:00:00'
    }

    // 生成 slug
    const slug = generateSlug(filename, publishDate)

    // 检查目标文件夹是否存在
    const targetDir = path.join(CONFIG.newBlogDir, slug)
    const targetFile = path.join(targetDir, 'index.md')

    if (CONFIG.skipExisting) {
      try {
        await fs.access(targetFile)
        console.log(`⏭️  跳过已存在: ${slug}`)
        return { success: true, skipped: true }
      } catch {
        // 文件不存在，继续处理
      }
    }

    // 转换内容
    let newContent = bodyContent
    newContent = removeTocMarker(newContent)
    newContent = convertHeadings(newContent)
    newContent = processImagePaths(newContent, slug)

    // 生成新的 frontmatter
    const astroFrontmatter = generateAstroFrontmatter(wpFrontmatter, publishDate)
    const frontmatterStr = stringifyFrontmatter(astroFrontmatter)

    // 组合最终内容
    const finalContent = frontmatterStr + newContent

    if (CONFIG.dryRun) {
      console.log(`\n📄 ${slug}`)
      console.log('---')
      console.log(frontmatterStr)
      console.log('Content preview:', newContent.slice(0, 100) + '...')
      return { success: true, dryRun: true }
    }

    // 创建目标文件夹
    await fs.mkdir(targetDir, { recursive: true })

    // 写入新文件
    await fs.writeFile(targetFile, finalContent, 'utf-8')

    // 如果原文件夹有 images 文件夹，复制它
    const sourceDir = path.dirname(filePath)
    const sourceImagesDir = path.join(sourceDir, 'images')

    try {
      await fs.access(sourceImagesDir)
      const targetImagesDir = path.join(targetDir, 'images')
      await fs.mkdir(targetImagesDir, { recursive: true })

      // 复制所有图片
      const imageFiles = await fs.readdir(sourceImagesDir)
      for (const imageFile of imageFiles) {
        const sourcePath = path.join(sourceImagesDir, imageFile)
        const targetPath = path.join(targetImagesDir, imageFile)
        await fs.copyFile(sourcePath, targetPath)
      }

      console.log(`✅ 已转换: ${slug} (含 ${imageFiles.length} 张图片)`)
    } catch {
      // 没有 images 文件夹
      console.log(`✅ 已转换: ${slug}`)
    }

    // 如果有 coverImage，也尝试复制
    if (wpFrontmatter.coverImage) {
      const coverImagePath = path.join(sourceDir, wpFrontmatter.coverImage)
      try {
        await fs.access(coverImagePath)
        const targetCoverPath = path.join(targetDir, wpFrontmatter.coverImage)
        await fs.copyFile(coverImagePath, targetCoverPath)
      } catch {
        // coverImage 文件不存在
      }
    }

    return { success: true, slug }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
    return { success: false, error: error.message }
  }
}

// 递归查找所有 markdown 文件
async function findMarkdownFiles(dir, baseDir = dir) {
  const files = []
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      // 跳过 images 文件夹
      if (entry.name === 'images') {
        continue
      }
      // 递归查找子目录
      const subFiles = await findMarkdownFiles(fullPath, baseDir)
      files.push(...subFiles)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const relativePath = path.relative(baseDir, fullPath)
      files.push({ fullPath, relativePath })
    }
  }

  return files
}

// 主函数
async function main() {
  console.log('🚀 开始迁移博客文章...\n')
  console.log(`📁 源目录: ${CONFIG.oldBlogDir}`)
  console.log(`📁 目标目录: ${CONFIG.newBlogDir}`)
  console.log(`🔧 Dry run: ${CONFIG.dryRun ? '是' : '否'}`)
  console.log(`⏭️  跳过已存在: ${CONFIG.skipExisting ? '是' : '否'}\n`)

  // 查找所有 markdown 文件
  console.log('🔍 正在扫描文件...')
  const markdownFiles = await findMarkdownFiles(CONFIG.oldBlogDir)
  console.log(`📊 找到 ${markdownFiles.length} 个文件\n`)

  if (markdownFiles.length === 0) {
    console.log('❌ 没有找到任何 markdown 文件')
    return
  }

  // 处理每个文件
  const results = {
    success: 0,
    failed: 0,
    skipped: 0
  }

  for (const { fullPath, relativePath } of markdownFiles) {
    const result = await processArticle(fullPath, relativePath)

    if (result.skipped) {
      results.skipped++
    } else if (result.success) {
      results.success++
    } else {
      results.failed++
    }
  }

  // 打印统计
  console.log('\n' + '='.repeat(50))
  console.log('📊 迁移完成！')
  console.log(`✅ 成功: ${results.success}`)
  console.log(`⏭️  跳过: ${results.skipped}`)
  console.log(`❌ 失败: ${results.failed}`)
  console.log(`📝 总计: ${markdownFiles.length}`)

  if (!CONFIG.dryRun && results.success > 0) {
    console.log('\n💡 提示:')
    console.log('1. 请检查转换后的文章格式是否正确')
    console.log('2. 为文章添加合适的封面图（heroImage）')
    console.log('3. 检查图片路径是否正确')
    console.log('4. 运行 pnpm dev 预览效果')
  }
}

// 运行脚本
main().catch(console.error)
