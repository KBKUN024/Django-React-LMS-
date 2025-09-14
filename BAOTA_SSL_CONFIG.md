# 宝塔面板HTTPS配置说明

## 🔧 配置步骤

### 1. 创建网站
1. 登录宝塔面板
2. 点击"网站" → "添加站点"
3. 域名：`lms.tyuan21081.top`
4. 根目录：任意（不重要，因为我们使用反向代理）
5. PHP版本：纯静态

### 2. 配置反向代理
1. 进入网站设置 → 反向代理
2. 添加反向代理：
   - **代理名称**: LMS Application
   - **目标URL**: `http://127.0.0.1:8080`
   - **发送域名**: `$host`

### 3. 高级反向代理配置
在反向代理的"配置内容"中，替换为以下内容：

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    
    # WebSocket支持
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    
    # 超时设置
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}

# API请求直接转发到后端
location /api/ {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
}

# Django admin
location /admin/ {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
}

# 静态文件和媒体文件 - 直接代理到后端
location /static/ {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # 添加缓存头
    expires 30d;
    add_header Cache-Control "public, immutable";
    
    # 添加CORS头
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
    add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range";
    
    # 确保静态文件能够正确加载
    try_files $uri $uri/ @django_static;
}

# 如果静态文件不存在，回退到Django后端
location @django_static {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /media/ {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # 添加缓存头
    expires 7d;
    add_header Cache-Control "public";
    
    # 添加CORS头
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
    add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range";
}
```

### 4. 申请SSL证书
1. 在网站设置中点击"SSL"
2. 选择"Let's Encrypt"
3. 填写邮箱：`944412796@qq.com`
4. 勾选域名：`lms.tyuan21081.top`
5. 点击"申请"
6. 申请成功后，开启"强制HTTPS"

### 5. 验证配置
配置完成后，访问以下URL验证：
- ✅ `https://lms.tyuan21081.top/` → React前端应用
- ✅ `https://lms.tyuan21081.top/api/v1/course/category/` → API数据
- ✅ `https://lms.tyuan21081.top/admin/` → Django管理界面

## 🔍 故障排除

### 问题1：502 Bad Gateway
- 检查Docker容器是否正在运行：`docker ps`
- 检查端口是否正确：前端8080，后端8000

### 问题2：SSL证书申请失败
- 确保域名已正确解析到服务器IP
- 检查防火墙是否开放80和443端口
- 暂时关闭其他占用80端口的服务

### 问题3：API请求失败
- 检查反向代理配置是否正确
- 确保后端容器在运行并监听8000端口

## 📝 维护说明

1. **证书自动续期**：宝塔面板会自动续期Let's Encrypt证书
2. **容器重启**：如果服务器重启，需要重新启动Docker容器
3. **日志查看**：可以通过 `docker-compose logs` 查看容器日志
