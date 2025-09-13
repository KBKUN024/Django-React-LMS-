# frontend/Dockerfile - 生产环境优化版本
FROM node:20-alpine AS build
WORKDIR /app

# 只复制依赖文件，利用Docker缓存
COPY frontend/frontend/package.json frontend/frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile --production=false

# 复制源码并构建
COPY frontend/frontend/ /app/
RUN pnpm run build && \
    rm -rf node_modules && \
    pnpm install --frozen-lockfile --production=true

# 生产运行时 - 最小化镜像
FROM nginx:alpine AS runtime
RUN rm -rf /usr/share/nginx/html/*

# 只复制构建产物
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf

# 跳过nginx配置测试（构建时无法解析容器主机名）
# nginx配置将在容器启动时验证

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]