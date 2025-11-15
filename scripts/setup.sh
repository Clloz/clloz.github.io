#!/bin/bash

# Astro Blog 快速设置脚本

set -e

echo "🚀 开始设置 Astro Blog Monorepo..."

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo "❌ 未检测到 pnpm，正在安装..."
    npm install -g pnpm
fi

echo "✅ pnpm 已安装"

# 清理旧的依赖
echo "🧹 清理旧的依赖..."
rm -rf node_modules packages/*/node_modules
rm -rf .astro packages/*/.astro
rm -rf dist packages/*/dist

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 验证 workspace 配置
echo "🔍 验证 workspace 配置..."
pnpm list --depth=0

echo "
✨ 设置完成！

📝 接下来的步骤：

1. 开发博客：
   pnpm dev

2. 构建博客：
   pnpm build

3. 预览构建结果：
   pnpm preview

4. 发布主题到 npm：
   cd packages/theme
   pnpm version patch
   npm publish

5. 部署到 GitHub Pages：
   - 将代码推送到 GitHub
   - GitHub Actions 将自动部署

📚 查看完整文档：
   - DEVELOPMENT.md - 开发部署指南
   - NPM_PUBLISH.md - npm 发布指南

🎉 开始你的博客之旅吧！
"
