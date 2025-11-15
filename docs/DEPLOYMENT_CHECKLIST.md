# 部署前检查清单

在部署到 GitHub Pages 或发布主题到 npm 之前，请确保完成以下检查：

## 🔍 基础配置检查

### 1. Git 配置

- [ ] 初始化 Git 仓库 (`git init`)
- [ ] 添加 .gitignore 文件
- [ ] 配置 Git 用户信息
  ```bash
  git config user.name "Your Name"
  git config user.email "your.email@example.com"
  ```

### 2. GitHub 仓库

- [ ] 在 GitHub 创建仓库：`clloz.github.io`
- [ ] 将本地仓库关联到 GitHub
  ```bash
  git remote add origin https://github.com/Clloz/clloz.github.io.git
  ```
- [ ] 推送代码到 GitHub
  ```bash
  git add .
  git commit -m "Initial commit"
  git push -u origin main
  ```

### 3. Astro 配置

- [ ] 更新 `astro.config.mjs` 中的 `site` 为你的域名
  - 如果使用 GitHub Pages: `https://clloz.github.io`
  - 如果使用自定义域名: `https://yourdomain.com`
- [ ] 如果部署在子路径，设置 `base` 配置

### 4. 自定义域名（如果需要）

- [ ] 创建 `public/CNAME` 文件，内容为你的域名
- [ ] 在域名提供商配置 DNS 记录
  - A 记录指向 GitHub Pages IP（185.199.108.153 等）
  - 或 CNAME 记录指向 `clloz.github.io`
- [ ] 等待 DNS 生效（可能需要几小时）

## 📦 依赖检查

### 5. pnpm Workspace

- [ ] 确认 `pnpm-workspace.yaml` 存在
- [ ] 确认根目录 `package.json` 中有 `"astro-pure": "workspace:*"`
- [ ] 运行 `pnpm install` 确保依赖安装成功
- [ ] 运行 `pnpm list --depth=0` 验证 workspace 链接

### 6. 主题包配置

- [ ] 更新 `packages/theme/package.json` 中的信息
  - [ ] `name` - 包名（检查是否与 npm 上的包冲突）
  - [ ] `version` - 版本号
  - [ ] `repository` - 仓库地址
  - [ ] `bugs` - Issue 地址
  - [ ] `homepage` - 主页地址
- [ ] 确认 `files` 字段包含所有需要发布的文件
- [ ] 添加 `publishConfig.access: "public"` (如果是 scoped package)

## 🧪 本地测试

### 7. 开发模式测试

- [ ] 运行 `pnpm dev` 启动开发服务器
- [ ] 访问 http://localhost:4321 验证页面正常
- [ ] 检查所有页面链接是否正常
- [ ] 验证主题组件是否正常工作

### 8. 构建测试

- [ ] 运行 `pnpm build` 构建生产版本
- [ ] 检查是否有构建错误
- [ ] 运行 `pnpm preview` 预览构建结果
- [ ] 验证生产版本是否正常

### 9. 主题测试

- [ ] 测试主题的所有组件
- [ ] 验证响应式设计
- [ ] 检查暗色模式（如果有）
- [ ] 测试不同浏览器的兼容性

## 🚀 GitHub Pages 部署

### 10. GitHub Actions 配置

- [ ] 确认 `.github/workflows/deploy.yml` 存在
- [ ] 检查 workflow 配置是否正确
- [ ] 确认 Node 和 pnpm 版本配置正确

### 11. GitHub Pages 设置

- [ ] 进入仓库 Settings → Pages
- [ ] Source 选择 "GitHub Actions"
- [ ] 保存设置

### 12. 部署验证

- [ ] 推送代码到 main 分支
  ```bash
  git push origin main
  ```
- [ ] 在 GitHub 上查看 Actions 运行状态
- [ ] 等待部署完成（首次可能需要几分钟）
- [ ] 访问 `https://clloz.github.io` 验证部署成功

## 📮 npm 发布（主题）

### 13. npm 账号配置

- [ ] 注册 npm 账号（如果还没有）
- [ ] 本地登录 npm
  ```bash
  npm login
  ```
- [ ] 验证登录状态
  ```bash
  npm whoami
  ```

### 14. 包名检查

- [ ] 搜索包名是否已被占用
  ```bash
  npm search astro-pure
  ```
- [ ] 如果已占用，考虑使用 scoped package (如 `@clloz/astro-pure`)

### 15. 发布准备

- [ ] 更新 `packages/theme/CHANGELOG.md`
- [ ] 更新 `packages/theme/README.md`
- [ ] 更新版本号
  ```bash
  cd packages/theme
  pnpm version patch  # 或 minor, major
  ```
- [ ] 测试打包
  ```bash
  npm pack
  tar -tzf astro-pure-*.tgz
  ```

### 16. 正式发布

- [ ] 发布到 npm
  ```bash
  npm publish
  # 如果是 scoped package
  npm publish --access public
  ```
- [ ] 验证发布成功
  ```bash
  npm info astro-pure
  ```
- [ ] 访问 npmjs.com 查看包页面

### 17. 自动发布配置（可选但推荐）

- [ ] 在 npm 网站生成 Access Token
- [ ] 在 GitHub 仓库添加 Secret: `NPM_TOKEN`
- [ ] 测试自动发布
  ```bash
  git tag theme-v1.3.7
  git push origin theme-v1.3.7
  ```
- [ ] 检查 GitHub Actions 是否成功发布

## 📝 文档完善

### 18. 更新文档

- [ ] 更新根目录 `README.md`
  ```bash
  mv README.new.md README.md
  ```
- [ ] 确保 `DEVELOPMENT.md` 信息准确
- [ ] 确保 `NPM_PUBLISH.md` 信息准确
- [ ] 添加项目截图或 demo（可选）

### 19. 创建 GitHub Release（可选）

- [ ] 在 GitHub 创建 Release
- [ ] 添加 Release Notes
- [ ] 附加重要文件（如果需要）

## 🔒 安全检查

### 20. 敏感信息

- [ ] 确保没有提交 `.env` 文件
- [ ] 检查没有硬编码的密钥或令牌
- [ ] 验证 `.gitignore` 正确配置
- [ ] 确认 npm token 不在代码中

### 21. 依赖安全

- [ ] 运行 `pnpm audit` 检查依赖漏洞
- [ ] 更新有安全问题的依赖
  ```bash
  pnpm update -r
  ```

## 🎯 性能优化

### 22. 构建优化

- [ ] 检查构建产物大小
- [ ] 优化图片资源
- [ ] 启用代码分割（如果需要）
- [ ] 配置 CDN（如果需要）

### 23. SEO 优化

- [ ] 配置 sitemap
- [ ] 添加 robots.txt（如果需要）
- [ ] 配置 meta 标签
- [ ] 测试页面加载速度

## ✅ 最终检查

### 24. 全面测试

- [ ] 在不同设备上测试
- [ ] 测试所有链接
- [ ] 验证表单功能（如果有）
- [ ] 检查控制台是否有错误

### 25. 备份

- [ ] 导出重要数据
- [ ] 备份配置文件
- [ ] 记录部署配置

### 26. 监控

- [ ] 设置 GitHub Pages 监控
- [ ] 配置 npm 包下载统计
- [ ] 添加 Google Analytics（可选）

## 🎉 部署完成！

恭喜！你已经完成了所有检查。现在可以：

1. 访问你的博客：`https://clloz.github.io`
2. 查看主题包：`https://www.npmjs.com/package/astro-pure`
3. 继续开发新功能

## 📞 遇到问题？

参考文档：

- [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - 配置总结
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发指南
- [NPM_PUBLISH.md](./NPM_PUBLISH.md) - 发布指南

或者：

- 查看 [GitHub Discussions](https://github.com/Clloz/astro-blog/discussions)
- 提交 [Issue](https://github.com/Clloz/astro-blog/issues)

---

最后更新：2024-11-15
