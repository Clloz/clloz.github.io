# Clloz's Personal Blog

> **Notice:** This project is forked and heavily modified from [astro-theme-pure](https://github.com/cworld1/astro-theme-pure). The `packages/theme` folder in this repository corresponds to the original theme's `packages/pure` folder. Please note that this project has undergone significant customizations and **cannot guarantee compatibility** with the upstream theme.

A modern, fast, and customizable personal blog built with [Astro](https://astro.build), featuring a clean design and powerful content management capabilities.

## ✨ Features

- 🚀 **Lightning Fast**: Built on Astro for optimal performance
- 📝 **MDX Support**: Write content with Markdown and JSX components
- 🎨 **UnoCSS**: Utility-first CSS framework for rapid styling
- 🌙 **Dark Mode**: Automatic theme switching support
- 📱 **Responsive Design**: Mobile-first responsive layout
- 🔍 **SEO Friendly**: Optimized metadata and sitemap generation
- 📊 **RSS Feed**: Auto-generated RSS feed for subscribers
- 💬 **Waline Comments**: Integrated commenting system
- 🏷️ **Tag System**: Organize posts with tags and categories
- 📄 **Multiple Content Types**: Support for blog posts, docs, and pages
- 🎯 **Table of Contents**: Auto-generated TOC for long articles
- 🔧 **Extensible**: Easy to customize and extend

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) 5.x
- **CSS**: [UnoCSS](https://unocss.dev)
- **Markdown**: MDX with custom plugins
- **Syntax Highlighting**: [Shiki](https://shiki.matsu.io)
- **Math Rendering**: KaTeX
- **Comments**: [Waline](https://waline.js.org)
- **Package Manager**: pnpm

## 📦 Project Structure

```
astro-blog/
├── packages/
│   └── theme/              # Custom theme package (modified from astro-theme-pure)
│       ├── components/     # Reusable Astro components
│       ├── libs/           # Utility libraries
│       ├── plugins/        # Custom plugins (TOC, rehype, etc.)
│       ├── schemas/        # Content collection schemas
│       └── types/          # TypeScript type definitions
├── preset/                 # Preset components and configurations
├── public/                 # Static assets
│   ├── favicon/
│   ├── fonts/
│   ├── icons/
│   └── images/
├── src/
│   ├── assets/             # Source assets (processed by Astro)
│   ├── components/         # Page-specific components
│   ├── content/            # Content collections
│   │   ├── blog/           # Blog posts
│   │   └── docs/           # Documentation pages
│   ├── layouts/            # Layout components
│   ├── pages/              # Page routes
│   ├── plugins/            # Additional plugins
│   └── site.config.ts      # Site configuration
├── scripts/                # Build and utility scripts
├── astro.config.ts         # Astro configuration
├── uno.config.ts           # UnoCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/astro-blog.git
cd astro-blog
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser and visit `http://localhost:4321`

### Configuration

Edit `src/site.config.ts` to customize your site:

```typescript
export const theme: ThemeUserConfig = {
  title: 'Your Blog Title',
  author: 'Your Name',
  description: 'Your blog description'
  // ... more configurations
}
```

## 📝 Writing Content

### Create a New Blog Post

Create a new folder under `src/content/blog/` with an `index.md` file:

```markdown
---
title: Your Post Title
publishDate: 2025-01-01 12:00:00
description: 'Post description'
tags:
  - Tag1
  - Tag2
heroImage: { src: './thumbnail.jpg', color: '#B4C6DA' }
language: 'en'
---

## Your content here

Write your post content using Markdown...
```

### Supported Frontmatter Fields

- `title`: Post title (required)
- `publishDate`: Publication date (required)
- `description`: Post description
- `tags`: Array of tags
- `heroImage`: Hero image configuration
- `language`: Content language
- `draft`: Set to `true` to hide from production

## 🎨 Customization

### Theme Customization

The theme is highly customizable through `src/site.config.ts`:

- **Colors**: Modify UnoCSS theme colors in `uno.config.ts`
- **Components**: Extend or override components in `src/components/`
- **Layouts**: Customize page layouts in `src/layouts/`
- **Styles**: Add custom CSS in `public/styles/global.css`

### Adding Custom Components

Place custom components in `preset/components/` to keep them separate from the core theme.

## 📜 Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm dev:check        # Start dev server with type checking
pnpm dev:fresh        # Clean cache and start fresh

# Build
pnpm build            # Build for production
pnpm preview          # Preview production build

# Maintenance
pnpm check            # Run Astro checks
pnpm sync             # Sync content collections
pnpm format           # Format code with Prettier
pnpm lint             # Lint code with ESLint
pnpm clean            # Clean build artifacts
pnpm clean:all        # Clean all node_modules
pnpm clean:cache      # Clean Astro cache

# Content
pnpm new              # Create new post (if available)
pnpm cache:avatars    # Cache Waline avatars
```

## 🔧 Advanced Features

### Custom Plugins

The project includes several custom plugins:

- **TOC Generator**: Automatically generates table of contents
- **Rehype Plugins**: Custom heading links and transformers
- **Shiki Transformers**: Enhanced code highlighting

### Content Collections

Organize content using Astro's content collections:

- `blog`: Blog posts
- `docs`: Documentation pages

### Image Optimization

Images in `src/assets/` are automatically optimized by Astro during build.

## 🚢 Deployment

### Build

```bash
pnpm build
```

The built site will be in the `dist/` directory.

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will auto-detect Astro and configure the build settings

### Deploy to Netlify

1. Push your code to GitHub
2. Create a new site on [Netlify](https://www.netlify.com)
3. Configure build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`

### Deploy to GitHub Pages

See [Astro's GitHub Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/).

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original theme: [astro-theme-pure](https://github.com/cworld1/astro-theme-pure) by [cworld1](https://github.com/cworld1)
- Framework: [Astro](https://astro.build)
- Styling: [UnoCSS](https://unocss.dev)
- Deployment: [Vercel](https://vercel.com)

## 📧 Contact

- Blog: [Your Blog URL]
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: <your.email@example.com>

---

Built with ❤️ using Astro
