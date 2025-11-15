# pnpm Workspace 本地测试指南

## 当前配置说明

你的项目使用 **pnpm workspace** 进行 monorepo 管理，主题包 `astro-pure-clloz` 在 `packages/theme` 目录。

### 配置文件

- `pnpm-workspace.yaml` - 定义了 `packages/*` 为 workspace 包
- `package.json` - 依赖中使用 `"astro-pure-clloz": "workspace:*"`
- `.npmrc` - 配置了 `link-workspace-packages=true`

## 🚀 本地测试步骤

### 方法一：使用 pnpm install（推荐）

这是最简单的方法，pnpm 会自动处理链接：

```bash
# 1. 在根目录安装所有依赖
pnpm install

# 2. 验证链接是否成功
pnpm list astro-pure-clloz --depth=0

# 3. 查看实际链接
ls -la node_modules/astro-pure-clloz
# 应该看到一个符号链接指向 packages/theme
```

运行后，`node_modules/astro-pure-clloz` 会自动链接到 `packages/theme`。

### 方法二：手动 link（如果自动链接失败）

如果自动链接有问题，可以手动 link：

```bash
# 1. 在主题包目录创建全局链接
cd packages/theme
pnpm link --global

# 2. 回到根目录，链接主题包
cd ../..
pnpm link --global astro-pure-clloz

# 3. 验证
pnpm list astro-pure-clloz
```

### 方法三：使用 pnpm link（推荐用于单独测试）

如果你想在其他项目中测试主题：

```bash
# 在主题目录
cd packages/theme
pnpm link --dir /path/to/test-project
```

## 📋 验证链接是否成功

### 1. 检查符号链接

```bash
# 查看 node_modules 中的链接
ls -la node_modules/astro-pure-clloz

# 应该看到类似这样的输出：
# lrwxr-xr-x astro-pure-clloz -> ../../packages/theme
```

### 2. 检查 pnpm list

```bash
pnpm list astro-pure-clloz --depth=0

# 应该看到：
# astro-pure-clloz link:packages/theme
```

### 3. 在代码中测试导入

创建一个测试文件：

```javascript
// test-import.mjs
import { version } from 'astro-pure-clloz'
console.log('Theme version:', version)
```

运行测试：

```bash
node test-import.mjs
```

## 🔧 常见问题排查

### 问题 1: pnpm install 后没有看到链接

**解决方案 1：清理后重装**

```bash
# 清理所有依赖
pnpm clean:all

# 重新安装
pnpm install
```

**解决方案 2：检查 .npmrc 配置**

确保 `.npmrc` 包含：

```
link-workspace-packages=true
prefer-workspace-packages=true
```

**解决方案 3：强制重建链接**

```bash
pnpm install --force
```

### 问题 2: 模块找不到

检查 `package.json` 中的包名是否匹配：

```bash
# 根目录 package.json
"astro-pure-clloz": "workspace:*"

# packages/theme/package.json
"name": "astro-pure-clloz"
```

### 问题 3: TypeScript 类型找不到

如果使用 TypeScript，确保 `tsconfig.json` 配置正确：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "astro-pure-clloz": ["./packages/theme/index.ts"],
      "astro-pure-clloz/*": ["./packages/theme/*"]
    }
  }
}
```

### 问题 4: Astro 无法识别主题

确保在 Astro 配置中正确导入：

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'
// 从本地主题导入
// import somePlugin from 'astro-pure-clloz/plugins/xxx';

export default defineConfig({
  // ...
})
```

## 💡 开发工作流

### 实时开发模式

```bash
# 终端 1: 启动博客开发服务器
pnpm dev

# 终端 2: 监听主题变化（可选）
cd packages/theme
# 如果有 watch 脚本的话
pnpm watch
```

修改 `packages/theme` 中的任何文件，Astro 会自动重新加载。

### 测试主题修改

1. **修改主题文件**

   ```bash
   # 编辑主题文件
   vim packages/theme/components/xxx.astro
   ```

2. **在博客中使用**

   ```astro
   ---
   // src/pages/xxx.astro
   import Component from 'astro-pure-clloz/components/xxx';
   ---
   <Component />
   ```

3. **查看效果**
   - 浏览器会自动刷新
   - 或访问 <http://localhost:4321>

### 构建测试

```bash
# 构建博客（会使用本地主题）
pnpm build

# 预览构建结果
pnpm preview
```

## 🎯 开发最佳实践

### 1. 保持依赖同步

```bash
# 在根目录更新所有依赖
pnpm update -r

# 只更新主题包的依赖
pnpm --filter astro-pure-clloz update
```

### 2. 使用 workspace 协议的优势

- **本地开发**: 直接使用 `packages/theme` 代码
- **实时更新**: 修改主题代码立即生效
- **构建时**: 自动解析为正确的依赖关系
- **发布时**: `workspace:*` 会被替换为实际版本号

### 3. 独立测试主题包

如果需要独立测试主题功能：

```bash
cd packages/theme

# 运行主题的测试脚本
pnpm test

# 构建主题
pnpm build

# 检查导出
pnpm pack
tar -tzf astro-pure-clloz-1.0.0.tgz
```

### 4. 调试技巧

```bash
# 查看 workspace 结构
pnpm -r list --depth=0

# 查看依赖树
pnpm list astro-pure-clloz

# 查看符号链接
find node_modules -maxdepth 1 -type l -ls

# 检查 pnpm 存储
pnpm store path
```

## 📦 发布前测试

在发布主题到 npm 之前，本地测试完整流程：

```bash
# 1. 创建本地 tarball
cd packages/theme
pnpm pack

# 2. 在根目录测试安装 tarball
cd ../..
pnpm add ./packages/theme/astro-pure-clloz-1.0.0.tgz --workspace-root=false

# 3. 测试
pnpm dev

# 4. 恢复 workspace 依赖
# 编辑 package.json 改回 "workspace:*"
pnpm install
```

## 🔄 切换本地/npm 版本

### 使用本地版本（开发中）

```json
// package.json
{
  "dependencies": {
    "astro-pure-clloz": "workspace:*"
  }
}
```

```bash
pnpm install
```

### 使用 npm 版本（测试发布版）

```json
// package.json
{
  "dependencies": {
    "astro-pure-clloz": "^1.0.0"
  }
}
```

```bash
pnpm install
```

### 快速切换脚本

创建一个切换脚本 `scripts/switch-theme.sh`:

```bash
#!/bin/bash
if [ "$1" = "local" ]; then
    echo "切换到本地版本..."
    # 使用 jq 或 sed 修改 package.json
    pnpm add astro-pure-clloz@workspace:*
elif [ "$1" = "npm" ]; then
    echo "切换到 npm 版本..."
    pnpm add astro-pure-clloz@latest
else
    echo "Usage: $0 {local|npm}"
fi
```

## 🎉 完整示例

从零开始的完整测试流程：

```bash
# 1. 清理环境
pnpm clean:all

# 2. 安装依赖（自动建立链接）
pnpm install

# 3. 验证链接
pnpm list astro-pure-clloz --depth=0
ls -la node_modules/astro-pure-clloz

# 4. 启动开发
pnpm dev

# 5. 在另一个终端修改主题
cd packages/theme
vim components/xxx.astro
# 保存后浏览器会自动刷新

# 6. 构建测试
pnpm build
pnpm preview

# 7. 发布前测试
cd packages/theme
pnpm pack
cd ../..
pnpm add ./packages/theme/astro-pure-clloz-*.tgz
pnpm build
```

## 📚 相关命令速查表

| 命令                   | 说明                          |
| ---------------------- | ----------------------------- |
| `pnpm install`         | 安装依赖并建立 workspace 链接 |
| `pnpm list <pkg>`      | 查看包的依赖信息              |
| `pnpm link --global`   | 创建全局链接                  |
| `pnpm unlink --global` | 移除全局链接                  |
| `pnpm -r list`         | 列出所有 workspace 包         |
| `pnpm --filter <pkg>`  | 在指定包中执行命令            |
| `pnpm pack`            | 创建 tarball 用于测试         |
| `pnpm install --force` | 强制重新安装                  |

## ⚠️ 注意事项

1. **不要手动删除 node_modules 中的链接**，使用 `pnpm install` 重建

2. **Git 忽略**: 确保 `.gitignore` 包含：

   ```
   node_modules/
   .pnpm-store/
   *.tgz
   ```

3. **TypeScript**: 如果遇到类型问题，重启 TypeScript 服务器（VS Code 中按 Cmd+Shift+P，选择 "TypeScript: Restart TS Server"）

4. **缓存问题**: 如果修改不生效，清理 Astro 缓存：

   ```bash
   rm -rf .astro
   pnpm dev
   ```

5. **发布时机**: 只在主题稳定后发布到 npm，开发过程中一直使用 workspace 链接

---

现在你可以开始本地测试了！运行 `pnpm install` 就会自动建立链接。
