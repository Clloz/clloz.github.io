# 配置完成总结 ✅

## 已完成的配置

### 1. pnpm Workspace 配置

#### 根目录配置

- ✅ `pnpm-workspace.yaml` - 定义 workspace 包路径
- ✅ `.npmrc` - pnpm 配置，启用 workspace 链接
- ✅ `package.json` - 添加主题依赖 `astro-pure: workspace:*`
- ✅ 添加便捷脚本：`theme:dev`, `theme:build`, `clean`, `clean:all`

#### 主题包配置

- ✅ 更新 `packages/theme/package.json` - 修正仓库信息
- ✅ 添加发布相关脚本
- ✅ 更新 `packages/theme/pnpm-workspace.yaml` - 添加说明

### 2. Astro 配置

- ✅ `astro.config.mjs` - 配置站点地址为 `https://clloz.github.io`
- ✅ 添加自定义域名配置说明

### 3. GitHub Actions 自动部署

#### 博客部署（`.github/workflows/deploy.yml`）

- ✅ 推送到 main 分支自动触发
- ✅ 使用 pnpm 10.21.0
- ✅ 构建并部署到 GitHub Pages
- ✅ 支持手动触发

#### 主题发布（`.github/workflows/publish-theme.yml`）

- ✅ 推送版本标签（theme-v*.*.\*）自动发布到 npm
- ✅ 支持手动触发
- ✅ 自动创建 GitHub Release
- ✅ 包含 npm provenance

### 4. 文档

- ✅ `DEVELOPMENT.md` - 完整的开发部署指南

  - Monorepo 结构说明
  - 本地开发流程
  - 主题发布流程
  - GitHub Pages 部署
  - 常见问题解答
  - 推荐工作流

- ✅ `NPM_PUBLISH.md` - 详细的 npm 发布指南

  - 前置准备
  - 包配置
  - 发布流程
  - 版本管理策略
  - CI/CD 集成
  - 常见问题
  - 发布检查清单

- ✅ `README.new.md` - 新的项目 README

  - 项目介绍
  - 快速开始
  - 使用场景
  - 部署说明
  - 常用命令

- ✅ `packages/theme/CHANGELOG.md` - 变更日志模板

### 5. 辅助文件

- ✅ `setup.sh` - 快速设置脚本
- ✅ `public/CNAME.example` - 自定义域名配置示例

## 项目结构

```
astro-blog/
├── .github/
│   └── workflows/
│       ├── deploy.yml           # 博客自动部署
│       └── publish-theme.yml    # 主题自动发布
├── packages/
│   └── theme/
│       ├── components/
│       ├── libs/
│       ├── plugins/
│       ├── types/
│       ├── utils/
│       ├── CHANGELOG.md         # ✅ 新增
│       ├── package.json         # ✅ 更新
│       └── pnpm-workspace.yaml  # ✅ 更新
├── public/
│   └── CNAME.example            # ✅ 新增
├── src/
├── .npmrc                       # ✅ 新增
├── astro.config.mjs             # ✅ 更新
├── DEVELOPMENT.md               # ✅ 新增
├── NPM_PUBLISH.md               # ✅ 新增
├── package.json                 # ✅ 更新
├── pnpm-workspace.yaml          # ✅ 新增
├── README.new.md                # ✅ 新增
└── setup.sh                     # ✅ 新增
```

## 下一步操作

### 1. 重新安装依赖

```bash
# 清理旧依赖
pnpm clean:all

# 重新安装
pnpm install
```

### 2. 测试本地开发

```bash
# 启动开发服务器
pnpm dev
```

访问 http://localhost:4321 查看博客

### 3. 准备 GitHub 部署

#### 3.1 更新 README（可选）

```bash
# 如果满意新的 README，替换旧的
mv README.md README.backup.md
mv README.new.md README.md
```

#### 3.2 初始化 Git（如果还没有）

```bash
git init
git add .
git commit -m "Initial monorepo setup with theme package"
```

#### 3.3 创建 GitHub 仓库

1. 在 GitHub 创建仓库：`clloz.github.io`
2. 推送代码：

```bash
git remote add origin https://github.com/Clloz/clloz.github.io.git
git branch -M main
git push -u origin main
```

#### 3.4 启用 GitHub Pages

1. 进入仓库设置 → Pages
2. Source 选择 "GitHub Actions"
3. 保存

### 4. 配置自定义域名（可选）

如果你有自定义域名：

```bash
# 1. 创建 CNAME 文件
echo "yourdomain.com" > public/CNAME

# 2. 更新 astro.config.mjs 中的 site
# site: 'https://yourdomain.com'

# 3. 在域名提供商配置 DNS
```

### 5. 发布主题到 npm

#### 5.1 检查包名是否可用

```bash
npm search astro-pure
```

#### 5.2 登录 npm

```bash
npm login
```

#### 5.3 发布

```bash
cd packages/theme
pnpm version patch
npm publish
```

#### 5.4 配置自动发布（推荐）

1. 在 npm 网站生成 Access Token
2. 在 GitHub 仓库设置中添加 Secret：`NPM_TOKEN`
3. 推送版本标签：

```bash
git tag theme-v1.3.7
git push origin theme-v1.3.7
```

## 关键配置说明

### Workspace 依赖管理

根目录 `package.json` 中：

```json
{
  "dependencies": {
    "astro-pure": "workspace:*"
  }
}
```

- **本地开发**：直接使用 `packages/theme` 的代码
- **生产构建**：pnpm 会查找已发布的 npm 版本
- **如果 npm 上没有**：使用本地版本（workspace 协议）

### GitHub Actions 权限

确保在 `.github/workflows/deploy.yml` 中配置了正确的权限：

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### npm 发布配置

在 `packages/theme/package.json` 中添加（如果需要）：

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
  ],
  "publishConfig": {
    "access": "public"
  }
}
```

## 常用命令速查

### 开发

```bash
pnpm dev              # 开发博客
pnpm build            # 构建博客
pnpm preview          # 预览构建
```

### 主题

```bash
pnpm theme:dev        # 开发主题
cd packages/theme     # 进入主题目录
npm publish           # 发布主题
```

### 清理

```bash
pnpm clean            # 清理根项目
pnpm clean:all        # 清理所有项目
```

### Workspace

```bash
pnpm -r list          # 列出所有包
pnpm --filter astro-pure <cmd>  # 在主题包中执行命令
```

## 推荐的开发流程

1. **功能开发**：在 `packages/theme` 中开发新功能
2. **本地测试**：`pnpm dev` 在博客中实时测试
3. **提交代码**：`git commit` 提交主题和博客更改
4. **发布主题**：`cd packages/theme && npm publish`
5. **部署博客**：`git push` 触发自动部署

## 需要注意的事项

1. **首次部署**：GitHub Pages 可能需要几分钟才能生效
2. **自定义域名**：需要在 DNS 提供商配置 A 记录或 CNAME 记录
3. **npm 发布**：首次发布需要登录 npm 账号
4. **包名冲突**：如果 `astro-pure` 已被占用，考虑使用 scoped package（如 `@clloz/astro-pure`）
5. **依赖更新**：定期运行 `pnpm update -r` 更新所有依赖

## 故障排查

### 问题：pnpm install 报错

```bash
# 尝试清理后重新安装
pnpm clean:all
pnpm install --frozen-lockfile=false
```

### 问题：GitHub Actions 部署失败

检查：

1. GitHub Pages 是否启用
2. 仓库是否公开
3. 权限配置是否正确

### 问题：workspace 链接不生效

```bash
# 检查 workspace 配置
pnpm list --depth=0

# 强制重新链接
rm -rf node_modules
pnpm install
```

### 问题：npm 发布失败

```bash
# 检查登录状态
npm whoami

# 重新登录
npm login

# 测试发布
npm publish --dry-run
```

## 参考文档

- [DEVELOPMENT.md](./DEVELOPMENT.md) - 详细的开发指南
- [NPM_PUBLISH.md](./NPM_PUBLISH.md) - npm 发布指南
- [pnpm workspace 文档](https://pnpm.io/workspaces)
- [Astro 文档](https://docs.astro.build)
- [GitHub Pages 文档](https://docs.github.com/pages)

---

🎉 配置已完成！祝你博客开发顺利！
