======CMD======
set -e
echo "开始部署..."

# 进入项目目录
cd /opt/lms
echo "当前目录: $(pwd)"

# 停止旧容器
echo "停止旧容器..."
docker-compose -f docker-compose.yml down || true

# 配置Docker使用加速镜像源
echo "配置Docker镜像加速..."
sudo mkdir -p /etc/docker
echo '{
  "registry-mirrors": ["https://4w36ujeoko5joi-ghcr.xuanyuan.run"],
  "insecure-registries": ["4w36ujeoko5joi-ghcr.xuanyuan.run"]
}' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker || true

# 拉取预构建镜像（优先使用加速域名）
echo "拉取预构建镜像..."
docker pull 4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-backend:latest && \
docker tag 4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-backend:latest lms-backend:latest || {
  echo "加速域名拉取失败，尝试直接拉取..."
  docker pull ghcr.io/kbkun024/django-react-lms-backend:latest && \
  docker tag ghcr.io/kbkun024/django-react-lms-backend:latest lms-backend:latest || {
    echo "镜像拉取失败，使用本地构建..."
    docker build --progress=plain -t lms-backend:latest -f backend/Dockerfile.server .
  }
}

docker pull 4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-frontend:latest && \
docker tag 4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-frontend:latest lms-frontend:latest || {
  echo "加速域名拉取失败，尝试直接拉取..."
  docker pull ghcr.io/kbkun024/django-react-lms-frontend:latest && \
  docker tag ghcr.io/kbkun024/django-react-lms-frontend:latest lms-frontend:latest || {
    echo "镜像拉取失败，使用本地构建..."
    docker build --progress=plain -t lms-frontend:latest -f frontend/frontend/Dockerfile.server .
  }
}

# 创建环境变量文件
echo "创建环境变量文件..."
cat > .env << EOF
SECRET_KEY=***
DEBUG=False
DJANGO_DEV_MODE=True
DEFAULT_FROM_EMAIL=***
SERVER_EMAIL=***
EMAIL_HOST=***
EMAIL_PORT=465
EMAIL_USE_SSL=True
EMAIL_HOST_USER=***
EMAIL_HOST_PASSWORD=***
BREVO_API_KEY = ***
FRONTEND_SITE_URL=https://lms.tyuan21081.top
SITE_URL=https://lms.tyuan21081.top
ALIPAY_SERVER_URL=https://openapi-sandbox.dl.alipaydev.com/gateway.do
ALIPAY_APP_ID=***
ALIPAY_APP_PRIVATE_KEY=***
ALIPAY_PUBLIC_KEY=***
ALIPAY_RETURN_URL=https://lms.tyuan21081.top/payment/return
ALIPAY_NOTIFY_URL=https://lms.tyuan21081.top/payment/notify
ALIPAY_SELLER_Id=***
STRIPE_SECRET_KEY=***
STRIPE_PUBLIC_KEY=***
PAYPAL_CLIENT_ID=***
PAYPAL_SECRET_ID=***
PAYPAL_RECEIVER_EMAIL=***
PAYPAL_TEST=True
EOF

# 验证.env文件创建
echo "验证.env文件内容..."
ls -la .env
echo "前几行内容："
head -5 .env

# 检查容器内文件结构
echo "检查容器内文件结构..."
docker run --rm lms-backend:latest ls -la /app/
docker run --rm lms-backend:latest ls -la /app/backend/ || echo "backend目录不存在"

# 检查.env文件是否能被容器读取
echo "测试.env文件挂载..."
docker run --rm -v $(pwd)/.env:/opt/lms/.env lms-backend:latest cat /opt/lms/.env | head -3 || echo ".env文件挂载失败"

# 只启动后端服务
echo "启动后端服务..."
docker-compose -f docker-compose.yml up -d backend

# 等待容器启动并初始化
echo "等待容器启动和初始化..."
sleep 15

# 立即检查后端容器日志
echo "检查后端启动日志..."
docker-compose -f docker-compose.yml logs backend --tail=30

# 检查后端是否正在运行
echo "检查后端容器状态..."
docker ps -a | grep lms-backend

# 检查后端容器是否正在运行
echo "检查后端容器运行状态..."
backend_running=false
for i in {1..3}; do
  if docker ps | grep -q "lms-backend.*Up"; then
    echo "后端容器正在运行！"
    backend_running=true
    break
  else
    echo "等待后端容器启动... ($i/3)"
    sleep 10
  fi
done

# 如果后端容器启动失败，尝试本地构建
if [ "$backend_running" = false ]; then
  echo "预构建镜像启动失败，停止容器并使用本地构建..."
  docker-compose -f docker-compose.yml down
  docker rmi lms-backend:latest || true
  echo "使用本地Dockerfile构建后端..."
  docker-compose -f docker-compose.yml build backend
  echo "重新启动后端服务..."
  docker-compose -f docker-compose.yml up -d backend
  sleep 20
  echo "检查本地构建的后端状态..."
  docker-compose -f docker-compose.yml logs backend --tail=20
fi

# 检查Django配置和环境变量
echo "检查Django配置..."
docker exec lms-backend sh -c "cd backend && python manage.py check" || echo "Django配置检查失败"
echo "检查容器内.env文件..."
docker exec lms-backend ls -la /app/backend/.env || echo ".env文件不存在"
docker exec lms-backend head -3 /app/backend/.env || echo "无法读取.env文件"

# 启动前端容器（确保后端已准备好）
echo "启动前端容器..."
docker-compose -f docker-compose.yml up -d frontend

# 检查启动状态
echo "检查容器状态..."
docker-compose -f docker-compose.yml ps

# 检查后端容器日志
echo "检查后端容器日志..."
docker-compose -f docker-compose.yml logs backend --tail=20

# 测试后端API是否可访问
echo "测试后端API..."
docker exec lms-backend curl -f http://localhost:8000/ || echo "API暂时不可访问，但容器正在运行"

# 检查所有容器日志
echo "检查所有容器日志..."
docker-compose -f docker-compose.yml logs --tail=10

echo "部署完成！"

======END======
out: 开始部署...
out: 当前目录: /opt/lms
out: 停止旧容器...
err:  Container lms-frontend  Stopping
err:  Container lms-frontend  Stopped
err:  Container lms-frontend  Removing
err:  Container lms-frontend  Removed
err:  Container lms-backend  Stopping
err:  Container lms-backend  Stopped
err:  Container lms-backend  Removing
err:  Container lms-backend  Removed
err:  Network lms-network  Removing
err:  Network lms-network  Removed
out: 配置Docker镜像加速...
out: {
out:   "registry-mirrors": ["https://4w36ujeoko5joi-ghcr.xuanyuan.run"],
out:   "insecure-registries": ["4w36ujeoko5joi-ghcr.xuanyuan.run"]
out: }
out: 拉取预构建镜像...
out: latest: Pulling from kbkun024/django-react-lms-backend
out: ce1261c6d567: Already exists
out: 11b89692b208: Already exists
out: 764e05fe66b6: Already exists
out: a4aefcec16c5: Already exists
out: d05adfb70ad0: Pulling fs layer
out: a34e0a800316: Pulling fs layer
out: df66ffda895a: Pulling fs layer
out: 26953c442622: Pulling fs layer
out: dee2479c73a4: Pulling fs layer
out: 161ce40f806e: Pulling fs layer
out: 4f4fb700ef54: Pulling fs layer
out: dee2479c73a4: Waiting
out: 161ce40f806e: Waiting
out: 4f4fb700ef54: Waiting
out: 26953c442622: Waiting
out: a34e0a800316: Verifying Checksum
out: a34e0a800316: Download complete
out: d05adfb70ad0: Verifying Checksum
out: d05adfb70ad0: Download complete
out: d05adfb70ad0: Pull complete
out: df66ffda895a: Verifying Checksum
out: df66ffda895a: Download complete
out: a34e0a800316: Pull complete
out: df66ffda895a: Pull complete
out: dee2479c73a4: Verifying Checksum
out: dee2479c73a4: Download complete
out: 4f4fb700ef54: Verifying Checksum
out: 4f4fb700ef54: Download complete
out: 161ce40f806e: Verifying Checksum
out: 161ce40f806e: Download complete
out: 26953c442622: Verifying Checksum
out: 26953c442622: Download complete
out: 26953c442622: Pull complete
out: dee2479c73a4: Pull complete
out: 161ce40f806e: Pull complete
out: 4f4fb700ef54: Pull complete
out: Digest: sha256:33b2e1f4111f1e6618b8efc3a33b215b2ad67095a83f9bfd9fabaace542795c4
out: Status: Downloaded newer image for 4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-backend:latest
out: 4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-backend:latest
out: latest: Pulling from kbkun024/django-react-lms-frontend
out: 9824c27679d3: Already exists
out: 6bc572a340ec: Already exists
out: 403e3f251637: Already exists
out: 9adfbae99cb7: Already exists
out: 7a8a46741e18: Already exists
out: c9ebe2ff2d2c: Already exists
out: a992fbc61ecc: Already exists
out: cb1ff4086f82: Already exists
out: 8f1415090435: Pulling fs layer
out: 884a9ba64188: Pulling fs layer
out: 6c4bfb59f374: Pulling fs layer
out: 884a9ba64188: Download complete
out: 6c4bfb59f374: Verifying Checksum
out: 8f1415090435: Verifying Checksum
out: 8f1415090435: Download complete
out: 8f1415090435: Pull complete
out: 884a9ba64188: Pull complete
out: 6c4bfb59f374: Pull complete
out: Digest: sha256:2c3fcef36f8f808d4a6efecb65bccf4bef826cd338946853e8fbcb57c15e2ba5
out: Status: Downloaded newer image for 4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-frontend:latest
out: 4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-frontend:latest
out: 创建环境变量文件...
out: 验证.env文件内容...
out: -rw-r--r-- 1 *** *** 3294 Sep 14 12:26 .env
out: 前几行内容：
out: SECRET_KEY=***
out: DEBUG=False
out: DJANGO_DEV_MODE=True
out: DEFAULT_FROM_EMAIL=***
out: SERVER_EMAIL=***
out: 检查容器内文件结构...
out: total 1164
out: drwxr-xr-x 1 appuser appuser    4096 Sep 14 04:23 .
out: drwxr-xr-x 1 ***    ***       4096 Sep 14 04:26 ..
out: -rw-r--r-- 1 appuser appuser    6148 Sep 14 04:21 .DS_Store
out: -rw-r--r-- 1 appuser appuser      19 Sep 14 04:21 .gitignore
out: -rw-r--r-- 1 appuser appuser    1706 Sep 14 04:21 Dockerfile
out: -rw-r--r-- 1 appuser appuser     825 Sep 14 04:21 Dockerfile.dev
out: -rw-r--r-- 1 appuser appuser     845 Sep 14 04:21 Dockerfile.fast
out: -rw-r--r-- 1 appuser appuser    1082 Sep 14 04:21 Dockerfile.optimized
out: -rw-r--r-- 1 appuser appuser    1730 Sep 14 04:21 Dockerfile.server
out: drwxr-xr-x 1 appuser appuser    4096 Sep 14 04:21 __pycache__
out: drwxr-xr-x 1 appuser appuser    4096 Sep 14 04:21 api
out: drwxr-xr-x 1 appuser appuser    4096 Sep 14 04:21 backend
out: drwxr-xr-x 1 appuser appuser    4096 Sep 14 04:21 core
out: -rw-r--r-- 1 appuser appuser 1105920 Sep 14 04:21 db.sqlite3
out: drwxr-xr-x 1 appuser appuser    4096 Sep 14 04:21 media
out: -rw-r--r-- 1 appuser appuser    1206 Sep 14 04:21 requirements.txt
out: drwxr-xr-x 2 appuser appuser    4096 Sep 14 04:23 static
out: drwxr-xr-x 2 appuser appuser    4096 Sep 14 04:23 staticfiles
out: drwxr-xr-x 1 appuser appuser    4096 Sep 14 04:21 templates
out: drwxr-xr-x 1 appuser appuser    4096 Sep 14 04:21 userauths
out: drwxr-xr-x 1 appuser appuser    4096 Sep 14 04:21 utils
out: total 48
out: drwxr-xr-x 1 appuser appuser  4096 Sep 14 04:21 .
out: drwxr-xr-x 1 appuser appuser  4096 Sep 14 04:23 ..
out: -rw-r--r-- 1 appuser appuser  6148 Sep 14 04:21 .DS_Store
out: -rw-r--r-- 1 appuser appuser     0 Sep 14 04:21 __init__.py
out: drwxr-xr-x 1 appuser appuser  4096 Sep 14 04:21 __pycache__
out: -rw-r--r-- 1 appuser appuser   391 Sep 14 04:21 asgi.py
out: -rw-r--r-- 1 appuser appuser 13168 Sep 14 04:21 settings.py
out: -rw-r--r-- 1 appuser appuser  2839 Sep 14 04:21 urls.py
out: -rw-r--r-- 1 appuser appuser   391 Sep 14 04:21 wsgi.py
out: 测试.env文件挂载...
out: SECRET_KEY=***
out: DEBUG=False
out: DJANGO_DEV_MODE=True
out: 启动后端服务...
err:  Network lms-network  Creating
err:  Network lms-network  Created
err:  Container lms-backend  Creating
err:  Container lms-backend  Created
err:  Container lms-backend  Starting
err:  Container lms-backend  Started
out: 等待容器启动和初始化...
out: 检查后端启动日志...
out: lms-backend  |   File "/home/appuser/.local/lib/python3.11/site-packages/django/__init__.py", line 19, in setup
out: lms-backend  |     configure_logging(settings.LOGGING_CONFIG, settings.LOGGING)
out: lms-backend  |                       ^^^^^^^^^^^^^^^^^^^^^^^
out: lms-backend  |   File "/home/appuser/.local/lib/python3.11/site-packages/django/conf/__init__.py", line 81, in __getattr__
out: lms-backend  |     self._setup(name)
out: lms-backend  |   File "/home/appuser/.local/lib/python3.11/site-packages/django/conf/__init__.py", line 68, in _setup
out: lms-backend  |     self._wrapped = Settings(settings_module)
out: lms-backend  |                     ^^^^^^^^^^^^^^^^^^^^^^^^^
out: lms-backend  |   File "/home/appuser/.local/lib/python3.11/site-packages/django/conf/__init__.py", line 166, in __init__
out: lms-backend  |     mod = importlib.import_module(self.SETTINGS_MODULE)
out: lms-backend  |           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
out: lms-backend  |   File "/usr/local/lib/python3.11/importlib/__init__.py", line 126, in import_module
out: lms-backend  |     return _bootstrap._gcd_import(name[level:], package, level)
out: lms-backend  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
out: lms-backend  |   File "<frozen importlib._bootstrap>", line 1204, in _gcd_import
out: lms-backend  |   File "<frozen importlib._bootstrap>", line 1176, in _find_and_load
out: lms-backend  |   File "<frozen importlib._bootstrap>", line 1147, in _find_and_load_unlocked
out: lms-backend  |   File "<frozen importlib._bootstrap>", line 690, in _load_unlocked
out: lms-backend  |   File "<frozen importlib._bootstrap_external>", line 940, in exec_module
out: lms-backend  |   File "<frozen importlib._bootstrap>", line 241, in _call_with_frames_removed
out: lms-backend  |   File "/app/backend/settings.py", line 359, in <module>
out: lms-backend  |     ALIPAY_SERVER_URL = env("ALIPAY_SERVER_URL")
out: lms-backend  |                         ^^^^^^^^^^^^^^^^^^^^^^^^
out: lms-backend  |   File "/home/appuser/.local/lib/python3.11/site-packages/environs/__init__.py", line 116, in method
out: lms-backend  |     raise EnvError(f'Environment variable "{proxied_key or parsed_key}" not set')
out: lms-backend  | environs.EnvError: Environment variable "ALIPAY_SERVER_URL" not set
out: lms-backend  | [2025-09-14 04:27:11 +0000] [7] [INFO] Worker exiting (pid: 7)
Error: s-backend  | [2025-09-14 04:27:11 +0000] [1] [ERROR] Worker (pid:7) exited with code 3
Error: s-backend  | [2025-09-14 04:27:11 +0000] [1] [ERROR] Shutting down: Master
Error: s-backend  | [2025-09-14 04:27:11 +0000] [1] [ERROR] Reason: Worker failed to boot.
out: 检查后端容器状态...
out: 375764d2d87f   lms-backend:latest   "gunicorn backend.ws…"   16 seconds ago   Restarting (3) Less than a second ago             lms-backend
out: 检查后端容器运行状态...
out: 等待后端容器启动... (1/3)
out: 等待后端容器启动... (2/3)
out: 等待后端容器启动... (3/3)
out: 预构建镜像启动失败，停止容器并使用本地构建...
err:  Container lms-backend  Stopping
err:  Container lms-backend  Stopped
err:  Container lms-backend  Removing
err:  Container lms-backend  Removed
err:  Network lms-network  Removing
err:  Network lms-network  Removed
out: Untagged: lms-backend:latest
out: 使用本地Dockerfile构建后端...
out: #1 [internal] load local bake definitions
out: #1 reading from stdin 480B done
out: #1 DONE 0.0s
out: #2 [internal] load build definition from Dockerfile
out: #2 transferring dockerfile: 1.71kB done
out: #2 DONE 0.0s
out: #3 [internal] load metadata for docker.io/library/python:3.13-slim