# Django React LMS 部署优化指南

## 🚀 当前部署问题分析

### 问题1：环境变量缺失
**现象：** 大量环境变量警告
```
The "SECRET_KEY" variable is not set. Defaulting to a blank string.
```

**解决方案：** 已优化部署脚本，自动创建 `.env` 文件

### 问题2：构建速度慢
**现象：** 安装 `build-essential` 包耗时很长

**原因：** 
- 服务器网络较慢
- 需要安装大量编译依赖

**解决方案：**
1. 使用优化的Dockerfile
2. 启用Docker构建缓存
3. 使用多阶段构建

## 🔧 优化后的部署流程

### 1. 环境变量配置

**在服务器上创建 `.env` 文件：**
```bash
# 进入项目目录
cd /opt/lms

# 创建环境变量文件
cat > .env << EOF
SECRET_KEY=your-actual-secret-key-here
DEBUG=False
ALLOWED_HOSTS=lms.tyuan21081.top,localhost,127.0.0.1
DEFAULT_FROM_EMAIL=noreply@tyuan21081.top
SERVER_EMAIL=noreply@tyuan21081.top
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_SSL=False
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
FRONTEND_SITE_URL=https://lms.tyuan21081.top
EOF
```

### 2. 使用优化的Dockerfile

**替换当前Dockerfile：**
```bash
# 备份原文件
cp backend/Dockerfile backend/Dockerfile.backup

# 使用优化版本
cp backend/Dockerfile.optimized backend/Dockerfile
```

### 3. 优化构建过程

**使用Docker构建缓存：**
```bash
# 构建时启用缓存
docker-compose build --parallel

# 或者使用BuildKit（更快）
DOCKER_BUILDKIT=1 docker-compose build
```

## 📋 部署检查清单

### 部署前检查
- [ ] 确保服务器有足够磁盘空间（至少2GB）
- [ ] 检查Docker和Docker Compose版本
- [ ] 配置正确的环境变量
- [ ] 确保域名DNS解析正确

### 部署后检查
- [ ] 容器状态：`docker-compose ps`
- [ ] 服务日志：`docker-compose logs`
- [ ] 端口访问：`curl http://localhost`
- [ ] 数据库迁移：`docker-compose exec backend python manage.py migrate`

## ⚡ 加速构建的技巧

### 1. 使用多阶段构建
```dockerfile
# 构建阶段
FROM python:3.13-slim AS builder
# ... 安装依赖

# 运行阶段
FROM python:3.13-slim AS runtime
# ... 复制必要文件
```

### 2. 利用Docker缓存
```dockerfile
# 先复制requirements.txt（变化较少）
COPY requirements.txt .
RUN pip install -r requirements.txt

# 再复制应用代码（变化较多）
COPY . .
```

### 3. 使用.dockerignore
```dockerignore
node_modules
.git
*.md
.env
__pycache__
*.pyc
```

## 🛠 故障排除

### 构建失败
```bash
# 查看详细构建日志
docker-compose build --no-cache --progress=plain

# 清理Docker缓存
docker system prune -f
```

### 容器启动失败
```bash
# 查看容器日志
docker-compose logs backend
docker-compose logs frontend

# 进入容器调试
docker-compose exec backend bash
```

### 网络问题
```bash
# 检查容器网络
docker network ls
docker network inspect lms-network

# 测试容器间通信
docker-compose exec frontend ping backend
```

## 📊 性能监控

### 资源使用情况
```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
docker system df
```

### 日志监控
```bash
# 实时查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
```

## 🔄 持续部署优化

### 1. 使用GitHub Actions缓存
```yaml
- name: Cache Docker layers
  uses: actions/cache@v3
  with:
    path: /tmp/.buildx-cache
    key: ${{ runner.os }}-buildx-${{ github.sha }}
```

### 2. 并行构建
```yaml
- name: Build images in parallel
  run: |
    docker-compose build --parallel
```

### 3. 健康检查
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health/"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 📝 最佳实践

1. **环境分离**：开发、测试、生产使用不同配置
2. **安全配置**：敏感信息使用环境变量
3. **监控告警**：设置服务状态监控
4. **备份策略**：定期备份数据库和媒体文件
5. **更新策略**：使用蓝绿部署或滚动更新

## 🚨 紧急情况处理

### 服务不可用
```bash
# 快速回滚到上一版本
docker-compose down
docker-compose up -d

# 或者使用备份镜像
docker run -d --name lms-backup your-backup-image
```

### 数据库问题
```bash
# 备份数据库
docker-compose exec backend python manage.py dumpdata > backup.json

# 恢复数据库
docker-compose exec backend python manage.py loaddata backup.json
```
