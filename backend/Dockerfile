# backend/Dockerfile - 生产环境优化版本
FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# build stage
FROM base AS builder
WORKDIR /app

# 安装系统依赖（最小化）
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential curl && \
    rm -rf /var/lib/apt/lists/*

# 安装Python依赖
COPY backend/requirements.txt ./
RUN pip install --upgrade pip && \
    pip install --user -r requirements.txt

# runtime stage - 最小化生产镜像
FROM base AS runtime
WORKDIR /app

# 安装runtime必需的工具（curl用于健康检查）
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# 直接使用root用户（解决数据库权限问题）
# 从builder复制Python依赖
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# 复制应用代码
COPY backend/ /app/

# 设置环境变量
ENV DJANGO_SETTINGS_MODULE=backend.settings \
    PYTHONPATH=/app

# 创建必需目录
RUN mkdir -p /app/static /app/media /app/staticfiles /app/templates

# 收集静态文件
RUN python manage.py collectstatic --noinput --clear || true

# 创建启动脚本，确保每次启动都收集静态文件和检查数据库权限
RUN echo '#!/bin/bash\n\
set -e\n\
cd /app\n\
echo "当前目录: $(pwd)"\n\
echo "检查管理脚本: $(ls -la manage.py 2>/dev/null || echo "manage.py不存在")"\n\
echo "检查数据库权限..."\n\
if [ -f "/app/db.sqlite3" ]; then\n\
    echo "数据库文件已存在，设置权限为666..."\n\
    chmod 666 /app/db.sqlite3\n\
    echo "数据库权限设置完成: $(ls -la /app/db.sqlite3)"\n\
else\n\
    echo "数据库文件不存在，运行迁移..."\n\
    python manage.py migrate\n\
fi\n\
echo "收集静态文件..."\n\
python manage.py collectstatic --noinput --clear\n\
echo "启动Gunicorn..."\n\
exec gunicorn backend.wsgi:application \\\n\
    --bind 0.0.0.0:8000 \\\n\
    --workers 1 \\\n\
    --worker-class sync \\\n\
    --timeout 60 \\\n\
    --log-level debug \\\n\
    --access-logfile - \\\n\
    --error-logfile -\n\
' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 8000

# 使用启动脚本
CMD ["/app/start.sh"]