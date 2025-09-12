# frontend/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/frontend/package.json frontend/frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY frontend/frontend/ /app/
RUN pnpm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80