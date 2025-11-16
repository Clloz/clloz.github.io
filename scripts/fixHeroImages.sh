#!/bin/bash

# 批量修复缺失的 heroImage 文件

cd "$(dirname "$0")/.."

echo "🔍 查找所有缺失的 heroImage..."

fixed=0
notfound=0

for dir in src/content/blog/*/; do
    file="$dir/index.md"
    
    if [ ! -f "$file" ]; then
        continue
    fi
    
    # 提取 heroImage 路径
    hero=$(grep -o 'heroImage.*src.*"\./[^"]*"' "$file" 2>/dev/null | grep -o '"\./[^"]*"' | tr -d '"' | sed 's|^\./||')
    
    if [ -z "$hero" ]; then
        continue
    fi
    
    # 检查文件是否存在
    if [ ! -f "$dir/$hero" ]; then
        echo "❌ 缺失: $(basename "$dir")/$hero"
        
        # 在 old-blog 中查找
        imageName=$(basename "$hero")
        found=$(find old-blog -name "$imageName" | head -1)
        
        if [ ! -z "$found" ]; then
            cp "$found" "$dir/$hero"
            echo "✅ 已修复: 从 $found 复制"
            ((fixed++))
        else
            echo "⚠️  找不到图片: $imageName"
            # 从 frontmatter 中移除 heroImage
            sed -i '' '/heroImage:/d' "$file"
            echo "✅ 已移除 heroImage 引用"
            ((notfound++))
        fi
    fi
done

echo ""
echo "=================================================="
echo "📊 修复完成！"
echo "✅ 已修复: $fixed"
echo "⚠️  已移除: $notfound"
