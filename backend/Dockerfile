# backend/Dockerfile - 生产环境优化版本
FROM 4w36ujeoko5joi-ghcr.xuanyuan.run/python:3.13-slim AS base
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

EXPOSE 8000

# 使用更轻量的启动配置
CMD ["gunicorn", "backend.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "2", \
     "--worker-class", "sync", \
     "--max-requests", "1000", \
     "--timeout", "30", \
     "--keep-alive", "2"]