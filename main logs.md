开始部署...
当前目录: /opt/lms
停止旧容器...
配置Docker镜像加速...
{
  "registry-mirrors": ["https://4w36ujeoko5joi-ghcr.xuanyuan.run"],
  "insecure-registries": ["4w36ujeoko5joi-ghcr.xuanyuan.run"]
}
拉取预构建镜像...
latest: Pulling from kbkun024/django-react-lms-backend
ce1261c6d567: Already exists
11b89692b208: Already exists
764e05fe66b6: Already exists
a4aefcec16c5: Already exists
ac0725fe20f7: Pulling fs layer
ed066a93a581: Pulling fs layer
46e00cc50596: Pulling fs layer
cbcc31761188: Pulling fs layer
a0fb3677c4af: Pulling fs layer
4f4fb700ef54: Pulling fs layer
c6ae9e0ebf15: Pulling fs layer
cbcc31761188: Waiting
a0fb3677c4af: Waiting
4f4fb700ef54: Waiting
c6ae9e0ebf15: Waiting
ac0725fe20f7: Verifying Checksum
ac0725fe20f7: Download complete
ac0725fe20f7: Pull complete
ed066a93a581: Verifying Checksum
ed066a93a581: Download complete
ed066a93a581: Pull complete
a0fb3677c4af: Download complete
4f4fb700ef54: Verifying Checksum
4f4fb700ef54: Download complete
cbcc31761188: Verifying Checksum
cbcc31761188: Download complete
c6ae9e0ebf15: Download complete
46e00cc50596: Verifying Checksum
46e00cc50596: Download complete
46e00cc50596: Pull complete
cbcc31761188: Pull complete
a0fb3677c4af: Pull complete
4f4fb700ef54: Pull complete
c6ae9e0ebf15: Pull complete
Digest: sha256:f49a05938bdfaad3be0c457c27520bf5395f6cdef016f13f0c46588363debf0f
Status: Downloaded newer image for 4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-backend:latest
4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-backend:latest
latest: Pulling from kbkun024/django-react-lms-frontend
9824c27679d3: Already exists
6bc572a340ec: Already exists
403e3f251637: Already exists
9adfbae99cb7: Already exists
7a8a46741e18: Already exists
c9ebe2ff2d2c: Already exists
a992fbc61ecc: Already exists
cb1ff4086f82: Already exists
ba51317b3cf5: Pulling fs layer
796ca8db6bc4: Pulling fs layer
6eb034d69391: Pulling fs layer
6eb034d69391: Verifying Checksum
6eb034d69391: Download complete
ba51317b3cf5: Verifying Checksum
ba51317b3cf5: Download complete
ba51317b3cf5: Pull complete
796ca8db6bc4: Download complete
796ca8db6bc4: Pull complete
6eb034d69391: Pull complete
Digest: sha256:23a964594276c3c25dc818c10b67a4877521d32ffe03f45d7992718b7380d2d1
Status: Downloaded newer image for 4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-frontend:latest
4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-frontend:latest
创建环境变量文件...
验证.env文件内容...
-rw-r--r-- 1 *** *** 3292 Sep 14 19:57 .env
前几行内容：
SECRET_KEY=***
DEBUG=False
DJANGO_DEV_MODE=True
DEFAULT_FROM_EMAIL=***
SERVER_EMAIL=***
检查容器内文件结构...
total 1168
drwxr-xr-x 1 *** ***    4096 Sep 14 11:53 .
drwxr-xr-x 1 *** ***    4096 Sep 14 11:57 ..
-rw-r--r-- 1 *** ***    6148 Sep 14 11:51 .DS_Store
-rw-r--r-- 1 *** ***      19 Sep 14 11:51 .gitignore
-rw-r--r-- 1 *** ***    2303 Sep 14 11:51 Dockerfile
-rw-r--r-- 1 *** ***     825 Sep 14 11:51 Dockerfile.dev
-rw-r--r-- 1 *** ***     845 Sep 14 11:51 Dockerfile.fast
-rw-r--r-- 1 *** ***    1082 Sep 14 11:51 Dockerfile.optimized
-rw-r--r-- 1 *** ***    2012 Sep 14 11:51 Dockerfile.server
drwxr-xr-x 2 *** ***    4096 Sep 14 11:51 __pycache__
drwxr-xr-x 4 *** ***    4096 Sep 14 11:51 api
drwxr-xr-x 3 *** ***    4096 Sep 14 11:51 backend
drwxr-xr-x 5 *** ***    4096 Sep 14 11:51 core
-rw-r--r-- 1 *** *** 1105920 Sep 14 11:51 db.sqlite3
drwxr-xr-x 4 *** ***    4096 Sep 14 11:51 media
-rw-r--r-- 1 *** ***    1206 Sep 14 11:51 requirements.txt
-rwxr-xr-x 1 *** ***     761 Sep 14 11:53 start.sh
drwxr-xr-x 2 *** ***    4096 Sep 14 11:53 static
drwxr-xr-x 2 *** ***    4096 Sep 14 11:53 staticfiles
drwxr-xr-x 3 *** ***    4096 Sep 14 11:51 templates
drwxr-xr-x 4 *** ***    4096 Sep 14 11:51 userauths
drwxr-xr-x 2 *** ***    4096 Sep 14 11:51 utils
total 52
drwxr-xr-x 3 *** ***  4096 Sep 14 11:51 .
drwxr-xr-x 1 *** ***  4096 Sep 14 11:53 ..
-rw-r--r-- 1 *** ***  6148 Sep 14 11:51 .DS_Store
-rw-r--r-- 1 *** ***     0 Sep 14 11:51 __init__.py
drwxr-xr-x 2 *** ***  4096 Sep 14 11:51 __pycache__
-rw-r--r-- 1 *** ***   391 Sep 14 11:51 asgi.py
-rw-r--r-- 1 *** *** 16748 Sep 14 11:51 settings.py
-rw-r--r-- 1 *** ***  2779 Sep 14 11:51 urls.py
-rw-r--r-- 1 *** ***   391 Sep 14 11:51 wsgi.py
测试.env文件挂载...
SECRET_KEY=***
DEBUG=False
DJANGO_DEV_MODE=True
启动后端服务...
 Network lms-network  Creating
 Network lms-network  Created
 Container lms-backend  Creating
 Container lms-backend  Created
 Container lms-backend  Starting
 Container lms-backend  Started
等待容器启动和初始化...
检查后端启动日志...
lms-backend  | 收集静态文件...
lms-backend  | python: can't open file '/app/manage.py': [Errno 2] No such file or directory
lms-backend  | 当前目录: /app
lms-backend  | 检查管理脚本: manage.py不存在
lms-backend  | 检查数据库权限...
lms-backend  | 数据库文件已存在，设置权限为666...
lms-backend  | 数据库权限设置完成: -rw-rw-rw- 1 *** *** 1105920 Sep 13 11:52 /app/db.sqlite3
lms-backend  | 收集静态文件...
lms-backend  | python: can't open file '/app/manage.py': [Errno 2] No such file or directory
lms-backend  | 当前目录: /app
lms-backend  | 检查管理脚本: manage.py不存在
lms-backend  | 检查数据库权限...
lms-backend  | 数据库文件已存在，设置权限为666...
lms-backend  | 数据库权限设置完成: -rw-rw-rw- 1 *** *** 1105920 Sep 13 11:52 /app/db.sqlite3
lms-backend  | 收集静态文件...
lms-backend  | python: can't open file '/app/manage.py': [Errno 2] No such file or directory
lms-backend  | 当前目录: /app
lms-backend  | 检查管理脚本: manage.py不存在
lms-backend  | 检查数据库权限...
lms-backend  | 数据库文件已存在，设置权限为666...
lms-backend  | 数据库权限设置完成: -rw-rw-rw- 1 *** *** 1105920 Sep 13 11:52 /app/db.sqlite3
lms-backend  | 收集静态文件...
lms-backend  | python: can't open file '/app/manage.py': [Errno 2] No such file or directory
lms-backend  | 当前目录: /app
lms-backend  | 检查管理脚本: manage.py不存在
lms-backend  | 检查数据库权限...
lms-backend  | 数据库文件已存在，设置权限为666...
lms-backend  | 数据库权限设置完成: -rw-rw-rw- 1 *** *** 1105920 Sep 13 11:52 /app/db.sqlite3
lms-backend  | 收集静态文件...
lms-backend  | python: can't open file '/app/manage.py': [Errno 2] No such file or directory
检查后端容器状态...
d0ee3a28b1ca   lms-backend:latest   "/app/start.sh"   15 seconds ago   Restarting (2) Less than a second ago             lms-backend
检查后端容器运行状态...
等待后端容器启动... (1/3)
等待后端容器启动... (2/3)
等待后端容器启动... (3/3)
预构建镜像启动失败，停止容器并使用本地构建...
 Container lms-backend  Stopping
 Container lms-backend  Stopped
 Container lms-backend  Removing
 Container lms-backend  Removed
 Network lms-network  Removing
 Network lms-network  Removed
Untagged: lms-backend:latest
使用本地Dockerfile构建后端...
#1 [internal] load local bake definitions
#1 reading from stdin 480B done
#1 DONE 0.0s
#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 1.71kB done
#2 DONE 0.0s
#3 [internal] load metadata for docker.io/library/python:3.13-slim