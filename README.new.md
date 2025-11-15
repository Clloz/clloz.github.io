# Astro Blog - Monorepo 架构

个人 Astro 博客系统，使用 pnpm monorepo 管理主题和博客内容。

## ✨ 特性

- 🎨 可独立发布的主题包
- 📦 pnpm workspace 本地开发
- 🚀 GitHub Actions 自动部署
- 🌐 GitHub Pages + 自定义域名支持
- 🔧 TypeScript 全栈支持

## 📂 项目结构

```
astro-blog/
├── packages/
│   └── theme/              # 主题包（可发布到 npm）
│       ├── components/     # 主题组件
│       ├── libs/          # 工具库
│       ├── plugins/       # Astro 插件
│       ├── types/         # 类型定义
│       └── package.json   # 主题包配置
├── src/                   # 博客内容
│   ├── content/          # Markdown 文章
│   ├── pages/            # 页面
│   └── layouts/          # 布局
├── public/               # 静态资源
├── .github/
│   └── workflows/        # CI/CD 配置
│       ├── deploy.yml    # 博客部署
│       └── publish-theme.yml  # 主题发布
└── package.json          # 根项目配置
```

## 🚀 快速开始

### 安装依赖

```bash
# 使用快速设置脚本
chmod +x setup.sh
./setup.sh

# 或手动安装
pnpm install
```

### 本地开发

```bash
# 开发博客
pnpm dev

# 开发主题
pnpm theme:dev

# 构建
pnpm build

# 预览
pnpm preview
```

## 📖 文档

- [开发部署指南](./DEVELOPMENT.md) - 完整的开发工作流和部署流程
- [npm 发布指南](./NPM_PUBLISH.md) - 主题发布到 npm 的详细步骤

## 🎯 使用场景

### 场景一：本地开发（推荐）

使用 workspace 协议，直接引用本地主题：

```json
{
  "dependencies": {
    "astro-pure": "workspace:*"
  }
}
```

优点：实时预览主题修改，无需重新安装

### 场景二：使用 npm 版本

从 npm 安装主题：

```bash
pnpm add astro-pure
```

适合：只使用主题，不修改主题代码

## 🚢 部署

### GitHub Pages 自动部署

1. 推送代码到 GitHub
2. 在仓库设置中启用 GitHub Pages
3. 选择 Source: GitHub Actions
4. 推送到 main 分支即可自动部署

### 自定义域名

1. 创建 `public/CNAME` 文件：

```
yourdomain.com
```

2. 更新 `astro.config.mjs`：

```javascript
export default defineConfig({
  site: 'https://yourdomain.com',
})
```

3. 在域名提供商配置 DNS

## 📦 发布主题

### 快速发布

```bash
cd packages/theme
pnpm version patch
npm publish
```

### 自动发布（推荐）

推送版本标签触发自动发布：

```bash
git tag theme-v1.3.7
git push origin theme-v1.3.7
```

详见 [npm 发布指南](./NPM_PUBLISH.md)

## 🛠️ 常用命令

```bash
# 开发
pnpm dev                 # 启动开发服务器
pnpm build              # 构建生产版本
pnpm preview            # 预览构建结果

# 主题
pnpm theme:dev          # 开发主题
pnpm theme:build        # 构建主题

# 清理
pnpm clean              # 清理根项目
pnpm clean:all          # 清理所有项目

# Workspace
pnpm -r list            # 查看所有包
pnpm --filter <pkg>     # 在特定包中执行命令
```

## 🔧 配置文件说明

- `pnpm-workspace.yaml` - Workspace 配置
- `.npmrc` - pnpm 配置
- `astro.config.mjs` - Astro 配置
- `.github/workflows/` - CI/CD 配置

## 📝 开发工作流

1. 在 `packages/theme` 开发主题功能
2. 在根目录博客项目中实时测试
3. 测试通过后发布主题到 npm
4. 推送博客代码到 GitHub 自动部署

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

[Apache-2.0](./packages/theme/LICENSE)

## 🔗 链接

- [Astro 文档](https://docs.astro.build)
- [pnpm 文档](https://pnpm.io)
- [GitHub Pages 文档](https://docs.github.com/pages)

---

Made with ❤️ using Astro
