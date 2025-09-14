#!/bin/bash
# 部署修复脚本

echo "🔧 开始部署修复..."

# 1. 提交更改到Git
echo "📝 提交代码更改..."
git add .
git commit -m "Fix database permission, static files, and JWT issues

- Use root user in Docker container for database write access
- Fix static file collection path issues
- Disable JWT token blacklist to avoid database writes
- Improve container startup script with better error handling

🛠️ Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 2. 推送到远程仓库
echo "🚀 推送到远程仓库..."
git push origin main

echo "✅ 修复已完成，GitHub Actions将自动部署"
echo ""
echo "🔍 部署后请验证："
echo "- 访问 https://lms.tyuan21081.top/"
echo "- 测试登录功能"
echo "- 检查图片是否正常显示"
echo "- 测试Django admin: https://lms.tyuan21081.top/admin/"