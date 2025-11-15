#!/bin/bash

# 快速启动指南
# 这个脚本会帮助你验证配置并启动项目

echo "======================================"
echo "  Astro Blog Monorepo 快速启动"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 pnpm
echo -e "${BLUE}[1/5] 检查 pnpm...${NC}"
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm 未安装${NC}"
    echo "请运行: npm install -g pnpm"
    exit 1
fi
echo -e "${GREEN}✅ pnpm 已安装: $(pnpm --version)${NC}"
echo ""

# 检查 workspace 配置
echo -e "${BLUE}[2/5] 检查 workspace 配置...${NC}"
if [ ! -f "pnpm-workspace.yaml" ]; then
    echo -e "${RED}❌ pnpm-workspace.yaml 不存在${NC}"
    exit 1
fi
echo -e "${GREEN}✅ pnpm-workspace.yaml 存在${NC}"
echo ""

# 检查依赖
echo -e "${BLUE}[3/5] 检查依赖...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules 不存在，正在安装依赖...${NC}"
    pnpm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 依赖安装失败${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ 依赖已就绪${NC}"
echo ""

# 验证 workspace 链接
echo -e "${BLUE}[4/5] 验证 workspace 链接...${NC}"
pnpm list --depth=0 | grep "astro-pure"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ astro-pure 主题已正确链接${NC}"
else
    echo -e "${YELLOW}⚠️  主题链接可能有问题${NC}"
fi
echo ""

# 显示可用命令
echo -e "${BLUE}[5/5] 可用命令:${NC}"
echo ""
echo -e "${GREEN}开发命令:${NC}"
echo "  pnpm dev              - 启动开发服务器"
echo "  pnpm build            - 构建生产版本"
echo "  pnpm preview          - 预览构建结果"
echo ""
echo -e "${GREEN}主题命令:${NC}"
echo "  pnpm theme:dev        - 开发主题"
echo "  pnpm theme:build      - 构建主题"
echo ""
echo -e "${GREEN}清理命令:${NC}"
echo "  pnpm clean            - 清理根项目"
echo "  pnpm clean:all        - 清理所有项目"
echo ""
echo -e "${GREEN}Workspace 命令:${NC}"
echo "  pnpm -r list          - 列出所有包"
echo "  pnpm --filter <pkg>   - 在特定包中执行命令"
echo ""

# 提示下一步
echo "======================================"
echo -e "${BLUE}📚 文档指南:${NC}"
echo "  - SETUP_COMPLETE.md   - 配置完成总结"
echo "  - DEVELOPMENT.md      - 开发部署指南"
echo "  - NPM_PUBLISH.md      - npm 发布指南"
echo ""
echo -e "${BLUE}🚀 开始开发:${NC}"
echo "  pnpm dev"
echo ""
echo "======================================"
