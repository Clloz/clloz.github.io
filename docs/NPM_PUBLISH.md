# 发布主题到 npm 的详细步骤

## 前置准备

### 1. 注册 npm 账号

访问 <https://www.npmjs.com/> 注册账号

### 2. 本地登录

```bash
npm login
```

输入用户名、密码和邮箱

### 3. 检查包名是否可用

```bash
npm search astro-pure
```

如果已被占用，需要修改包名或使用 scoped package（如 `@clloz/astro-pure`）

## 配置主题包

### 1. 更新 package.json

在 `packages/theme/package.json` 中确保以下配置：

```json
{
  "name": "astro-pure", // 或 "@clloz/astro-pure"
  "version": "1.3.6",
  "type": "module",
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./user": "./components/user/index.ts",
    "./advanced": "./components/advanced/index.ts",
    "./components/pages": "./components/pages/index.ts",
    "./components/basic": "./components/basic/index.ts",
    "./utils": "./utils/index.ts",
    "./server": "./utils/server.ts",
    "./types": "./types/index.ts",
    "./libs": "./libs/index.ts"
  },
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
    "access": "public" // 如果是 scoped package 需要这个
  }
}
```

### 2. 创建 .npmignore（可选）

在 `packages/theme/` 创建 `.npmignore`：

```
node_modules
*.log
.DS_Store
.vscode
.idea
*.test.ts
*.spec.ts
coverage
.git
pnpm-lock.yaml
pnpm-workspace.yaml
```

## 发布流程

### 1. 更新版本号

```bash
cd packages/theme

# 补丁版本（1.3.6 -> 1.3.7）
pnpm version patch

# 次要版本（1.3.6 -> 1.4.0）
pnpm version minor

# 主要版本（1.3.6 -> 2.0.0）
pnpm version major
```

### 2. 测试打包

```bash
# 生成 tarball 测试
npm pack

# 检查打包内容
tar -tzf astro-pure-1.3.6.tgz

# 或者使用 npm
npm publish --dry-run
```

### 3. 正式发布

```bash
npm publish

# 如果是 scoped package 且首次发布
npm publish --access public
```

### 4. 验证发布

访问 <https://www.npmjs.com/package/astro-pure> 查看

或者：

```bash
npm info astro-pure
```

## 版本管理策略

### 语义化版本（SemVer）

- **主版本号（Major）**：不兼容的 API 修改
- **次版本号（Minor）**：向下兼容的功能新增
- **修订号（Patch）**：向下兼容的问题修正

### 版本标签

```bash
# 发布 beta 版本
pnpm version 1.4.0-beta.1
npm publish --tag beta

# 发布 alpha 版本
pnpm version 1.4.0-alpha.1
npm publish --tag alpha

# 发布 next 版本
npm publish --tag next
```

## 更新主题后的博客使用

### 方案一：使用 workspace 本地开发（推荐）

保持 `package.json` 中的配置：

```json
{
  "dependencies": {
    "astro-pure": "workspace:*"
  }
}
```

优点：

- 本地开发时直接使用最新代码
- 发布到 GitHub Pages 时，pnpm 会自动转换为 npm 版本

### 方案二：使用 npm 发布版本

修改 `package.json`：

```json
{
  "dependencies": {
    "astro-pure": "^1.3.6" // 指定版本
  }
}
```

更新：

```bash
pnpm update astro-pure
```

### 方案三：混合模式

开发环境用本地，生产环境用 npm：

在 GitHub Actions 中覆盖依赖：

```yaml
- name: Install dependencies
  run: |
    pnpm install --frozen-lockfile
    pnpm add astro-pure@latest  # 强制使用 npm 版本
```

## CI/CD 集成

### 自动发布到 npm

创建 `.github/workflows/publish.yml`：

```yaml
name: Publish Theme to npm

on:
  push:
    tags:
      - 'v*' # 推送 tag 时触发

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10.21.0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install --frozen-lockfile

      - name: Publish to npm
        working-directory: packages/theme
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 配置 NPM_TOKEN

1. 在 npm 网站生成 Access Token
2. 在 GitHub 仓库设置中添加 Secret：`NPM_TOKEN`

## 常见问题

### Q: 如何撤回已发布的版本？

```bash
# 24 小时内可以撤回
npm unpublish astro-pure@1.3.6

# 或者废弃某个版本
npm deprecate astro-pure@1.3.6 "This version has bugs, please use 1.3.7"
```

### Q: 如何更新包的描述或关键词？

修改 `package.json` 后重新发布一个新版本

### Q: 发布后如何查看下载量？

访问：<https://npm-stat.com/charts.html?package=astro-pure>

### Q: TypeScript 类型定义怎么发布？

当前配置已经包含了 TypeScript 文件，npm 会自动处理

如果需要构建：

```json
{
  "scripts": {
    "build": "tsc --emitDeclarationOnly"
  }
}
```

## 发布检查清单

- [ ] 更新 README.md 和文档
- [ ] 更新 CHANGELOG.md
- [ ] 运行测试（如果有）
- [ ] 更新版本号
- [ ] 检查 package.json 配置
- [ ] 测试打包内容 `npm pack`
- [ ] 提交代码到 Git
- [ ] 创建 Git tag
- [ ] 发布到 npm
- [ ] 验证发布成功
- [ ] 推送 tag 到 GitHub
- [ ] 创建 GitHub Release
