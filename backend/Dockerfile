# backend/Dockerfile
FROM python:3.13-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1
WORKDIR /app

# build stage
FROM base AS builder
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY backend/ /app/

# runtime
FROM base AS runtime
RUN adduser --disabled-password --gecos '' appuser
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.13 /usr/local/lib/python3.13
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app /app
# 注意：你的项目 STATIC_ROOT 是 templates/，需确保生产环境正确配置
ENV DJANGO_SETTINGS_MODULE=backend.settings \
    PYTHONPATH=/app
# 创建必需目录
RUN mkdir -p /app/static /app/media /app/templates
# 切换到非root用户
USER appuser
# 收集静态文件
RUN python manage.py collectstatic --noinput || true
EXPOSE 8000
CMD ["gunicorn", "backend.wsgi:application", "-b", "0.0.0.0:8000", "--workers", "3", "--timeout", "60"]