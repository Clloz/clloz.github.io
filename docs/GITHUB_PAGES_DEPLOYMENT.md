# GitHub Pages 部署完整指南

## 📋 部署概览

本指南将帮助你将 Astro 博客部署到 GitHub Pages，并配置自定义域名 `clloz.com`。

## 🚀 部署步骤

### 1. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com) 并登录你的账号
2. 点击右上角的 `+` 号，选择 `New repository`
3. **重要**: 仓库名称必须是 `clloz.github.io`（你的用户名.github.io）
4. 设置为 **Public**（GitHub Pages 免费版需要公开仓库）
5. **不要**勾选 "Initialize this repository with a README"
6. 点击 `Create repository`

### 2. 配置本地仓库并推送代码

打开终端，在你的项目根目录执行：

```bash
# 如果还没有初始化 git（查看是否有 .git 目录）
git init

# 添加远程仓库
git remote add origin https://github.com/clloz/clloz.github.io.git

# 或使用 SSH（推荐）
git remote add origin git@github.com:clloz/clloz.github.io.git

# 查看当前分支名称
git branch

# 如果不是 main，重命名为 main
git branch -M main

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Astro blog setup"

# 推送到 GitHub
git push -u origin main
```

### 3. 配置 GitHub Pages

1. 进入仓库页面：`https://github.com/clloz/clloz.github.io`
2. 点击 `Settings` 标签
3. 在左侧菜单找到 `Pages`
4. 在 `Build and deployment` 部分：
   - **Source**: 选择 `GitHub Actions`
   - 这会让 GitHub 使用你的 `.github/workflows/deploy.yml` 文件进行部署

### 4. 等待首次部署完成

1. 点击仓库顶部的 `Actions` 标签
2. 你应该能看到 "Deploy to GitHub Pages" 工作流正在运行
3. 等待构建完成（通常需要 2-5 分钟）
4. 部署成功后，访问 `https://clloz.github.io` 验证网站是否正常

## 🌐 配置自定义域名

### 域名证书说明

**好消息**: 你**不需要**自己申请 SSL 证书！

GitHub Pages 会自动为你的自定义域名提供免费的 HTTPS 证书（通过 Let's Encrypt）。你只需要：

1. 正确配置 DNS 解析
2. 在 GitHub Pages 设置中启用 HTTPS（默认开启）

GitHub 会自动：

- 申请证书
- 定期续期证书
- 处理所有证书管理

### 步骤 1: 创建 CNAME 文件

在项目的 `public` 目录下创建 `CNAME` 文件（已为你准备好）：

```bash
# 文件内容就是你的域名
clloz.com
```

**注意**:

- CNAME 文件不需要扩展名
- 只包含域名，不需要 `https://` 或 `http://`
- 可以使用顶级域名（如 `clloz.com`）或子域名（如 `blog.clloz.com`）

### 步骤 2: 配置 DNS 解析

登录你的域名提供商（如阿里云、腾讯云、Cloudflare 等），添加以下 DNS 记录：

#### 选项 A: 使用顶级域名 (clloz.com) - 推荐

添加以下 A 记录：

```
类型    名称    值
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
```

同时添加 CNAME 记录（用于 www 子域名）：

```
类型      名称    值
CNAME     www     clloz.github.io
```

#### 选项 B: 使用子域名 (blog.clloz.com)

只需添加一条 CNAME 记录：

```
类型      名称    值
CNAME     blog    clloz.github.io
```

**注意**: DNS 记录生效可能需要 5 分钟到 48 小时不等，通常在 1 小时内生效。

### 步骤 3: 在 GitHub Pages 中配置自定义域名

1. 回到 GitHub 仓库的 `Settings` > `Pages`
2. 在 `Custom domain` 输入框中填写：`clloz.com`
3. 点击 `Save`
4. 等待 DNS 检查通过（可能需要几分钟）
5. 确保 `Enforce HTTPS` 已勾选（这会强制使用 HTTPS）

### 步骤 4: 验证部署

DNS 生效后，访问：

- `https://clloz.com` - 你的主域名
- `https://www.clloz.com` - www 子域名（会自动跳转）
- `https://clloz.github.io` - GitHub Pages 默认域名（会重定向到你的自定义域名）

## 🔄 更新网站内容

每次更新博客内容后：

```bash
# 添加更改
git add .

# 提交更改
git commit -m "Add new blog post"

# 推送到 GitHub
git push

# GitHub Actions 会自动触发构建和部署
```

你可以在仓库的 `Actions` 标签中查看部署进度。

## ✅ 当前 deploy.yml 配置检查

你当前的 `deploy.yml` 配置**完全正确**，不需要修改。它已经包含了：

✅ 正确的构建步骤（pnpm + Node 20）  
✅ 静态文件上传（`./dist` 目录）  
✅ GitHub Pages 部署  
✅ 适当的权限设置  
✅ 并发控制

## 🔍 常见问题

### Q: 为什么访问域名显示 404？

A: 可能的原因：

1. DNS 记录还未生效（等待更长时间）
2. CNAME 文件配置错误（检查文件内容和位置）
3. GitHub Pages 构建失败（查看 Actions 日志）

### Q: 如何查看部署日志？

A: 访问 `https://github.com/clloz/clloz.github.io/actions`

### Q: 为什么 HTTPS 证书不可用？

A:

1. 首次配置域名后，证书申请需要几分钟到几小时
2. 确保 DNS 记录正确且已生效
3. 在 GitHub Pages 设置中点击 `Enforce HTTPS` 下方的刷新按钮

### Q: 我需要修改 astro.config.ts 吗？

A: 你的 `site: 'https://clloz.com'` 配置已经正确，不需要修改。

### Q: 如何使用子域名？

A:

1. 修改 `public/CNAME` 为 `blog.clloz.com`
2. 配置 CNAME DNS 记录指向 `clloz.github.io`
3. 在 GitHub Pages 设置中填写 `blog.clloz.com`
4. 修改 `astro.config.ts` 中的 `site` 为 `https://blog.clloz.com`

### Q: GitHub Pages 有访问限制吗？

A:

- 每月 100GB 流量
- 仓库大小建议不超过 1GB
- 构建时间不超过 10 分钟
- 每小时最多 10 次构建

## 📚 相关文档

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [配置自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Astro 部署指南](https://docs.astro.build/en/guides/deploy/github/)

## 🎉 部署完成检查清单

完成部署后，检查以下项目：

- [ ] GitHub 仓库创建成功 (`clloz/clloz.github.io`)
- [ ] 代码已推送到 `main` 分支
- [ ] GitHub Actions 构建成功
- [ ] `https://clloz.github.io` 可以访问
- [ ] `public/CNAME` 文件已创建
- [ ] DNS 记录已配置
- [ ] GitHub Pages 设置中已配置自定义域名
- [ ] `https://clloz.com` 可以访问
- [ ] HTTPS 证书已生效（地址栏显示锁图标）
- [ ] RSS 订阅、sitemap 等功能正常
- [ ] 图片、CSS、JS 等资源加载正常

---

祝部署顺利！🚀
