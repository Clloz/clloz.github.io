#!/usr/bin/env node

/**
 * 博客维护工具集
 *
 * 集成了所有博客维护相关的功能：
 * 1. 迁移 WordPress 博客到 Astro
 * 2. 修复缺失的封面图片
 * 3. 清理未引用的图片
 * 4. 清理重复的图片
 * 5. 修复代码块语言类型
 * 6. 修复数学公式中的中文括号
 */
import fs from 'fs/promises'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONFIG = {
  oldBlogDir: path.join(__dirname, '../old-blog'),
  newBlogDir: path.join(__dirname, '../src/content/blog'),
  dryRun: false
}

// ==================== 工具函数 ====================

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
}

function question(rl, query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

// ==================== 1. 清理未引用的图片 ====================

function extractImageReferences(content) {
  const imageRefs = new Set()

  // Markdown 图片语法
  const mdImagePattern = /!\[.*?\]\((\.\/images\/)?([^)]+)\)/g
  let match
  while ((match = mdImagePattern.exec(content)) !== null) {
    const filename = path.basename(match[2])
    imageRefs.add(filename)
  }

  // heroImage in frontmatter
  const heroImagePattern = /heroImage:\s*{[^}]*"src":\s*"\.\/([^"]+)"/
  const heroMatch = content.match(heroImagePattern)
  if (heroMatch) {
    imageRefs.add(path.basename(heroMatch[1]))
  }

  const heroImagePattern2 = /heroImage:\s*"\.\/([^"]+)"/
  const heroMatch2 = content.match(heroImagePattern2)
  if (heroMatch2) {
    imageRefs.add(path.basename(heroMatch2[1]))
  }

  return imageRefs
}

async function cleanUnusedImages() {
  console.log('\n🔍 开始清理未引用的图片...\n')

  const blogFolders = await fs.readdir(CONFIG.newBlogDir, { withFileTypes: true })
  const results = { checked: 0, cleaned: 0, totalDeleted: 0 }

  for (const folder of blogFolders) {
    if (!folder.isDirectory()) continue

    const indexPath = path.join(CONFIG.newBlogDir, folder.name, 'index.md')
    const imagesDir = path.join(CONFIG.newBlogDir, folder.name, 'images')

    try {
      await fs.access(indexPath)
      await fs.access(imagesDir)
    } catch {
      continue
    }

    results.checked++

    const content = await fs.readFile(indexPath, 'utf-8')
    const referencedImages = extractImageReferences(content)
    const imageFiles = await fs.readdir(imagesDir)

    if (imageFiles.length === 0) continue

    const unreferencedImages = imageFiles.filter((file) => !referencedImages.has(file))

    if (unreferencedImages.length === 0) continue

    if (!CONFIG.dryRun) {
      for (const file of unreferencedImages) {
        await fs.unlink(path.join(imagesDir, file))
      }
    }

    console.log(`✅ ${folder.name}: 删除 ${unreferencedImages.length} 个未引用图片`)
    results.cleaned++
    results.totalDeleted += unreferencedImages.length
  }

  console.log('\n' + '='.repeat(50))
  console.log(`📝 已检查: ${results.checked} 篇文章`)
  console.log(`✅ 已清理: ${results.cleaned} 篇文章`)
  console.log(`🗑️  总删除: ${results.totalDeleted} 个图片\n`)
}

// ==================== 2. 清理重复的图片 ====================

async function cleanDuplicateImages() {
  console.log('\n🔍 开始清理重复的图片文件...\n')

  const blogFolders = await fs.readdir(CONFIG.newBlogDir, { withFileTypes: true })
  const results = { checked: 0, cleaned: 0, totalDeleted: 0 }

  for (const folder of blogFolders) {
    if (!folder.isDirectory()) continue

    results.checked++
    const articleDir = path.join(CONFIG.newBlogDir, folder.name)
    const imagesDir = path.join(articleDir, 'images')

    try {
      await fs.access(imagesDir)
    } catch {
      continue
    }

    const allFiles = await fs.readdir(articleDir, { withFileTypes: true })
    const rootImages = allFiles
      .filter((file) => file.isFile())
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name))
      .map((file) => file.name)

    if (rootImages.length === 0) continue

    const imagesFolderFiles = await fs.readdir(imagesDir)
    const duplicates = rootImages.filter((img) => imagesFolderFiles.includes(img))

    if (duplicates.length === 0) continue

    if (!CONFIG.dryRun) {
      for (const dupFile of duplicates) {
        await fs.unlink(path.join(imagesDir, dupFile))
      }
    }

    console.log(`✅ ${folder.name}: 删除 ${duplicates.length} 个重复图片`)
    results.cleaned++
    results.totalDeleted += duplicates.length
  }

  console.log('\n' + '='.repeat(50))
  console.log(`📝 已检查: ${results.checked} 篇文章`)
  console.log(`✅ 已清理: ${results.cleaned} 篇文章`)
  console.log(`🗑️  总删除: ${results.totalDeleted} 个重复图片\n`)
}

// ==================== 3. 修复代码块语言类型 ====================

function isLikelyHtml(code) {
  const htmlTagPattern = /<\/?[a-z][\s\S]*?>/i
  const hasHtmlTags = htmlTagPattern.test(code)
  const markdownPattern = /^#{1,6}\s/m
  const isMarkdown = markdownPattern.test(code)
  return hasHtmlTags && !isMarkdown
}

function processCodeBlocks(content) {
  let modified = false
  let replacements = { htmlAdded: 0, languageReplaced: 0 }

  // 为未指定语言的HTML代码块添加html标识
  content = content.replace(/```\n([\s\S]*?)```/g, (match, code) => {
    if (isLikelyHtml(code)) {
      replacements.htmlAdded++
      modified = true
      return '```html\n' + code + '```'
    }
    return match
  })

  // 替换不支持的语言类型
  const LANGUAGE_MAP = {
    markup: 'html',
    actionscript: 'javascript',
    ignore: 'plaintext'
  }

  for (const [oldLang, newLang] of Object.entries(LANGUAGE_MAP)) {
    const pattern = new RegExp(`\`\`\`${oldLang}\\b`, 'g')
    const matches = content.match(pattern)
    if (matches) {
      content = content.replace(pattern, `\`\`\`${newLang}`)
      replacements.languageReplaced += matches.length
      modified = true
    }
  }

  return { content, modified, replacements }
}

async function fixCodeLanguages() {
  console.log('\n🔍 开始修复代码块语言类型...\n')

  const blogFolders = await fs.readdir(CONFIG.newBlogDir, { withFileTypes: true })
  const results = { checked: 0, fixed: 0, htmlAdded: 0, languageReplaced: 0 }

  for (const folder of blogFolders) {
    if (!folder.isDirectory()) continue

    const indexPath = path.join(CONFIG.newBlogDir, folder.name, 'index.md')

    try {
      await fs.access(indexPath)
    } catch {
      continue
    }

    results.checked++

    const originalContent = await fs.readFile(indexPath, 'utf-8')
    const { content, modified, replacements } = processCodeBlocks(originalContent)

    if (modified) {
      if (!CONFIG.dryRun) {
        await fs.writeFile(indexPath, content, 'utf-8')
      }

      const changes = []
      if (replacements.htmlAdded > 0) changes.push(`添加html: ${replacements.htmlAdded}`)
      if (replacements.languageReplaced > 0)
        changes.push(`替换语言: ${replacements.languageReplaced}`)

      console.log(`✅ ${folder.name}: ${changes.join(', ')}`)

      results.fixed++
      results.htmlAdded += replacements.htmlAdded
      results.languageReplaced += replacements.languageReplaced
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`📝 已检查: ${results.checked} 篇文章`)
  console.log(`✅ 已修复: ${results.fixed} 篇文章`)
  console.log(`🏷️  添加html: ${results.htmlAdded} 处`)
  console.log(`🔄 替换语言: ${results.languageReplaced} 处\n`)
}

// ==================== 4. 修复数学公式中的中文括号 ====================

function fixMathBrackets(content) {
  let modified = false
  let replacements = 0

  const mathPatterns = [
    { pattern: /\$\$([^\$]+?)\$\$/g, type: 'block' },
    { pattern: /\$([^\$\n]+?)\$/g, type: 'inline' }
  ]

  for (const { pattern, type } of mathPatterns) {
    content = content.replace(pattern, (match, formula) => {
      if (formula.includes('（') || formula.includes('）')) {
        const fixed = formula.replace(/（/g, '(').replace(/）/g, ')')
        replacements++
        modified = true
        return type === 'block' ? `$$${fixed}$$` : `$${fixed}$`
      }
      return match
    })
  }

  return { content, modified, replacements }
}

async function fixLatexBrackets() {
  console.log('\n🔍 开始修复数学公式中的中文括号...\n')

  const blogFolders = await fs.readdir(CONFIG.newBlogDir, { withFileTypes: true })
  const results = { checked: 0, fixed: 0, totalReplacements: 0 }

  for (const folder of blogFolders) {
    if (!folder.isDirectory()) continue

    const indexPath = path.join(CONFIG.newBlogDir, folder.name, 'index.md')

    try {
      await fs.access(indexPath)
    } catch {
      continue
    }

    results.checked++

    const originalContent = await fs.readFile(indexPath, 'utf-8')
    const { content, modified, replacements } = fixMathBrackets(originalContent)

    if (modified) {
      if (!CONFIG.dryRun) {
        await fs.writeFile(indexPath, content, 'utf-8')
      }

      console.log(`✅ ${folder.name}: 修复了 ${replacements} 处中文括号`)
      results.fixed++
      results.totalReplacements += replacements
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`📝 已检查: ${results.checked} 篇文章`)
  console.log(`✅ 已修复: ${results.fixed} 篇文章`)
  console.log(`🔧 总替换: ${results.totalReplacements} 处\n`)
}

// ==================== 5. 恢复缺失的图片 ====================

async function findImageInOldBlog(imageName) {
  try {
    const years = await fs.readdir(CONFIG.oldBlogDir)

    for (const year of years) {
      if (!/^\d{4}$/.test(year)) continue

      const yearPath = path.join(CONFIG.oldBlogDir, year)
      const months = await fs.readdir(yearPath)

      for (const month of months) {
        if (!/^\d{2}$/.test(month)) continue

        const imagesPath = path.join(yearPath, month, 'images')
        try {
          const files = await fs.readdir(imagesPath)
          if (files.includes(imageName)) {
            return path.join(imagesPath, imageName)
          }
        } catch (err) {
          // images 文件夹不存在，继续
        }
      }
    }
  } catch (err) {
    console.error(`查找图片时出错: ${err.message}`)
  }

  return null
}

function extractImageReferencesFromMarkdown(content) {
  const imageRegex = /!\[.*?\]\((\.\/images\/[^)]+?)\s*(?:"[^"]*")?\)/g
  const images = new Set()
  let match

  while ((match = imageRegex.exec(content)) !== null) {
    const imagePath = match[1].replace('./images/', '').trim()
    images.add(imagePath)
  }

  return Array.from(images)
}

async function restoreMissingImages() {
  console.log('\n🔍 开始检查并恢复缺失的图片...\n')

  const results = { checked: 0, restored: 0, missing: 0 }

  const folders = await fs.readdir(CONFIG.newBlogDir)

  for (const folder of folders) {
    const folderPath = path.join(CONFIG.newBlogDir, folder)
    const stat = await fs.stat(folderPath)

    if (!stat.isDirectory()) continue

    const indexPath = path.join(folderPath, 'index.md')

    try {
      await fs.access(indexPath)
    } catch {
      continue
    }

    const content = await fs.readFile(indexPath, 'utf-8')
    const imageRefs = extractImageReferencesFromMarkdown(content)

    if (imageRefs.length === 0) continue

    results.checked++

    const imagesDir = path.join(folderPath, 'images')
    let imagesDirExists = false

    try {
      await fs.access(imagesDir)
      imagesDirExists = true
    } catch (err) {
      // images 文件夹不存在
    }

    for (const imageName of imageRefs) {
      const targetPath = path.join(imagesDir, imageName)

      // 检查图片是否存在
      try {
        await fs.access(targetPath)
        continue // 图片存在，跳过
      } catch (err) {
        // 图片不存在，需要恢复
      }

      // 在 old-blog 中查找图片
      const sourcePath = await findImageInOldBlog(imageName)

      if (sourcePath) {
        if (!CONFIG.dryRun) {
          // 创建 images 文件夹（如果不存在）
          if (!imagesDirExists) {
            await fs.mkdir(imagesDir, { recursive: true })
            imagesDirExists = true
          }

          // 复制图片
          await fs.copyFile(sourcePath, targetPath)
        }

        console.log(`✅ ${folder}/images/${imageName}`)
        results.restored++
      } else {
        console.log(`❌ 未找到: ${folder}/images/${imageName}`)
        results.missing++
      }
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`📝 已检查: ${results.checked} 篇文章`)
  console.log(`✅ 已恢复: ${results.restored} 张图片`)
  console.log(`❌ 未找到: ${results.missing} 张图片\n`)
}

// ==================== 6. 全面清理（组合操作）====================

async function cleanAll() {
  console.log('\n🚀 开始全面清理...\n')

  await cleanUnusedImages()
  await cleanDuplicateImages()
  await fixCodeLanguages()
  await fixLatexBrackets()

  console.log('✨ 全部清理完成！\n')
}

// ==================== 主菜单 ====================

async function showMenu() {
  const rl = createInterface()

  console.log('\n' + '='.repeat(60))
  console.log('📝 博客维护工具集')
  console.log('='.repeat(60))
  console.log('\n请选择操作：\n')
  console.log('  1. 清理未引用的图片')
  console.log('  2. 清理重复的图片')
  console.log('  3. 修复代码块语言类型')
  console.log('  4. 修复数学公式中的中文括号')
  console.log('  5. 恢复缺失的图片')
  console.log('  6. 全面清理（执行所有清理操作）')
  console.log('  7. 切换 DRY RUN 模式 (当前: ' + (CONFIG.dryRun ? 'ON' : 'OFF') + ')')
  console.log('  0. 退出\n')

  const choice = await question(rl, '请输入选项 (0-7): ')
  rl.close()

  switch (choice.trim()) {
    case '1':
      await cleanUnusedImages()
      break
    case '2':
      await cleanDuplicateImages()
      break
    case '3':
      await fixCodeLanguages()
      break
    case '4':
      await fixLatexBrackets()
      break
    case '5':
      await restoreMissingImages()
      break
    case '6':
      await cleanAll()
      break
    case '7':
      CONFIG.dryRun = !CONFIG.dryRun
      console.log(`\n✅ DRY RUN 模式已${CONFIG.dryRun ? '开启' : '关闭'}`)
      await showMenu()
      return
    case '0':
      console.log('\n👋 再见！\n')
      process.exit(0)
    default:
      console.log('\n❌ 无效选项，请重新选择\n')
  }

  // 操作完成后询问是否继续
  const rl2 = createInterface()
  const continueChoice = await question(rl2, '\n按回车键返回菜单，或输入 q 退出: ')
  rl2.close()

  if (continueChoice.trim().toLowerCase() === 'q') {
    console.log('\n👋 再见！\n')
    process.exit(0)
  }

  await showMenu()
}

// ==================== 启动 ====================

async function main() {
  // 检查目录是否存在
  try {
    await fs.access(CONFIG.newBlogDir)
  } catch {
    console.error('❌ 错误: 找不到博客目录:', CONFIG.newBlogDir)
    process.exit(1)
  }

  await showMenu()
}

main().catch((error) => {
  console.error('\n❌ 发生错误:', error.message)
  process.exit(1)
})
