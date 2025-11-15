# Astro Blog Monorepo 开发部署指南

## 项目结构

这是一个基于 pnpm workspace 的 monorepo 项目：

```
astro-blog/
├── packages/
│   └── theme/          # 可发布的主题包 (astro-pure)
├── src/                # 你的博客内容
├── public/             # 静态资源
└── package.json        # 博客项目配置
```

## 本地开发流程

### 1. 安装依赖

```bash
# 在根目录安装所有依赖（包括主题包）
pnpm install
```

### 2. 开发模式

```bash
# 开发你的博客（主题通过 workspace 协议自动链接）
pnpm dev

# 如果需要同时开发主题
pnpm theme:dev
```

### 3. 构建

```bash
# 构建博客
pnpm build

# 预览构建结果
pnpm preview
```

### 4. 清理

```bash
# 清理根项目
pnpm clean

# 清理所有项目（包括子包）
pnpm clean:all
```

## Monorepo 配置说明

### pnpm-workspace.yaml

定义了 workspace 包的位置：

```yaml
packages:
  - 'packages/*'
```

### package.json 依赖

根项目使用 `workspace:*` 协议引用本地主题：

```json
{
  "dependencies": {
    "astro-pure": "workspace:*"
  }
}
```

这样做的好处：

- 本地开发时直接使用 `packages/theme` 的代码
- 发布到生产时会自动替换为 npm 上的真实版本
- 无需手动 `pnpm link`

## 主题发布流程

### 1. 准备发布

```bash
cd packages/theme

# 更新版本号
pnpm version patch  # 或 minor, major

# 登录 npm（如果还没登录）
npm login
```

### 2. 发布到 npm

```bash
# 在 packages/theme 目录下
npm publish

# 如果是 scoped package
npm publish --access public
```

### 3. 更新博客依赖

发布后，如果要使用 npm 版本而不是本地版本：

```bash
# 在根目录
pnpm update astro-pure
```

或者手动修改 `package.json`：

```json
{
  "dependencies": {
    "astro-pure": "^1.3.6" // 使用具体版本号
  }
}
```

## GitHub Pages 部署

### 1. GitHub 仓库设置

1. 创建仓库：`clloz.github.io`（同名仓库）
2. 推送代码到 GitHub
3. 进入仓库设置 → Pages
4. Source 选择 "GitHub Actions"

### 2. 自定义域名（可选）

在 `public/` 目录创建 `CNAME` 文件：

```bash
echo "yourdomain.com" > public/CNAME
```

同时更新 `astro.config.mjs`：

```javascript
export default defineConfig({
  site: 'https://yourdomain.com',
  // ...
})
```

在域名提供商处添加 DNS 记录：

- A 记录指向 GitHub Pages IP
- 或 CNAME 记录指向 `clloz.github.io`

### 3. 自动部署

GitHub Actions 工作流已配置在 `.github/workflows/deploy.yml`：

- 推送到 `main` 分支自动触发构建和部署
- 也可以手动触发部署

部署流程：

1. 推送代码到 main 分支
2. GitHub Actions 自动运行
3. 安装依赖（使用 workspace 本地主题）
4. 构建站点
5. 部署到 GitHub Pages

## 常见问题

### Q: 如何在不同环境使用不同的主题版本？

A: 使用环境变量或配置文件：

```javascript
// astro.config.mjs
const isDev = process.env.NODE_ENV === 'development'
// 开发环境使用本地主题，生产环境会自动使用 npm 版本
```

### Q: 如何测试主题的 npm 发布版本？

A:

```bash
# 1. 在主题目录创建本地包
cd packages/theme
npm pack

# 2. 在根目录安装本地包
cd ../..
pnpm add ./packages/theme/astro-pure-1.3.6.tgz
```

### Q: monorepo 中的依赖冲突怎么处理？

A: 在 `.npmrc` 中添加：

```
shamefully-hoist=true
public-hoist-pattern[]=*astro*
public-hoist-pattern[]=*vite*
```

### Q: 如何只发布主题包，不包含示例代码？

A: 在 `packages/theme/package.json` 中配置 `files` 字段：

```json
{
  "files": [
    "components",
    "libs",
    "plugins",
    "schemas",
    "scripts",
    "types",
    "utils",
    "index.ts",
    "virtual.d.ts",
    "LICENSE",
    "README.md"
  ]
}
```

## 推荐的开发工作流

1. **功能开发**：在 `packages/theme` 中开发主题功能
2. **本地测试**：在根目录博客项目中测试主题
3. **版本发布**：测试通过后发布主题到 npm
4. **博客更新**：根据需要更新博客中的主题版本
5. **部署上线**：推送到 GitHub 自动部署

## 目录说明

- `packages/theme/`：主题包源码，可独立发布到 npm
- `src/`：你的博客内容和配置
- `public/`：静态资源（图片、字体等）
- `.github/workflows/`：GitHub Actions 配置

## 有用的命令

```bash
# 查看 workspace 结构
pnpm -r list

# 在特定包中运行命令
pnpm --filter astro-pure <command>

# 更新所有依赖
pnpm update -r

# 查看依赖树
pnpm list --depth=1
```
