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

# 创建非root用户
RUN adduser --disabled-password --gecos '' --uid 1000 appuser

# 从builder复制Python依赖
COPY --from=builder /root/.local /home/appuser/.local
ENV PATH=/home/appuser/.local/bin:$PATH

# 复制应用代码
COPY backend/ /app/

# 设置环境变量
ENV DJANGO_SETTINGS_MODULE=backend.settings \
    PYTHONPATH=/app

# 创建必需目录并设置权限
RUN mkdir -p /app/static /app/media /app/staticfiles /app/templates && \
    chown -R appuser:appuser /app

# 切换到非root用户
USER appuser

# 收集静态文件
RUN python manage.py collectstatic --noinput --clear || true

# 创建启动脚本，确保每次启动都收集静态文件
RUN echo '#!/bin/bash\n\
set -e\n\
echo "收集静态文件..."\n\
python manage.py collectstatic --noinput --clear || true\n\
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