#!/usr/bin/env node

/**
 * 修复缺失的 heroImage 文件
 *
 * 这个脚本会：
 * 1. 扫描所有博客文章
 * 2. 检查 heroImage 引用的文件是否存在
 * 3. 尝试从原始 old-blog 中复制缺失的图片
 * 4. 如果找不到，从 frontmatter 中移除 heroImage
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONFIG = {
  blogDir: path.join(__dirname, '../src/content/blog'),
  oldBlogDir: path.join(__dirname, '../old-blog')
}

async function fixHeroImages() {
  console.log('🔍 开始检查 heroImage 问题...\n')

  const blogFolders = await fs.readdir(CONFIG.blogDir, { withFileTypes: true })
  const results = {
    checked: 0,
    fixed: 0,
    removed: 0,
    failed: 0
  }

  for (const folder of blogFolders) {
    if (!folder.isDirectory()) continue

    const indexPath = path.join(CONFIG.blogDir, folder.name, 'index.md')

    try {
      await fs.access(indexPath)
    } catch {
      continue // 没有 index.md，跳过
    }

    results.checked++

    try {
      const content = await fs.readFile(indexPath, 'utf-8')

      // 提取 heroImage
      const heroImageMatch = content.match(/heroImage:\s*\{\s*src:\s*["']([^"']+)["']/)

      if (!heroImageMatch) continue // 没有 heroImage

      const heroImageSrc = heroImageMatch[1]
      const heroImagePath = path.join(CONFIG.blogDir, folder.name, heroImageSrc.replace('./', ''))

      // 检查文件是否存在
      try {
        await fs.access(heroImagePath)
        // 文件存在，继续
        continue
      } catch {
        // 文件不存在，尝试修复
        console.log(`❌ 缺失: ${folder.name}/${heroImageSrc}`)

        // 尝试从 old-blog 中查找
        const imageName = path.basename(heroImageSrc)
        let found = false

        // 搜索 old-blog 中的所有 images 文件夹
        const searchDirs = await findImagesDirs(CONFIG.oldBlogDir)

        for (const imagesDir of searchDirs) {
          const sourcePath = path.join(imagesDir, imageName)

          try {
            await fs.access(sourcePath)
            // 找到了！复制它
            await fs.copyFile(sourcePath, heroImagePath)
            console.log(`✅ 已修复: 从 ${imagesDir} 复制`)
            results.fixed++
            found = true
            break
          } catch {
            // 继续搜索
          }
        }

        if (!found) {
          // 实在找不到，从 frontmatter 中移除
          console.log(`⚠️  无法找到图片，移除 heroImage 引用`)
          const newContent = content.replace(/heroImage:\s*\{[^}]+\}\n?/g, '')
          await fs.writeFile(indexPath, newContent, 'utf-8')
          results.removed++
        }
      }
    } catch (error) {
      console.error(`❌ 处理失败: ${folder.name}`, error.message)
      results.failed++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 检查完成！')
  console.log(`📝 已检查: ${results.checked}`)
  console.log(`✅ 已修复: ${results.fixed}`)
  console.log(`⚠️  已移除: ${results.removed}`)
  console.log(`❌ 失败: ${results.failed}`)
}

async function findImagesDirs(dir) {
  const dirs = []
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (entry.name === 'images') {
        dirs.push(fullPath)
      } else {
        // 递归搜索
        const subDirs = await findImagesDirs(fullPath)
        dirs.push(...subDirs)
      }
    }
  }

  return dirs
}

fixHeroImages().catch(console.error)
