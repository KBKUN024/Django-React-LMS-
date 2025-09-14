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
97bafc3404e5: Pulling fs layer
0d61cb776836: Pulling fs layer
54510473759b: Pulling fs layer
d41ee723b0d2: Pulling fs layer
03b3e22f64d3: Pulling fs layer
4f4fb700ef54: Pulling fs layer
3f1a51c43aba: Pulling fs layer
d41ee723b0d2: Waiting
03b3e22f64d3: Waiting
4f4fb700ef54: Waiting
3f1a51c43aba: Waiting
97bafc3404e5: Verifying Checksum
97bafc3404e5: Download complete
97bafc3404e5: Pull complete
0d61cb776836: Verifying Checksum
0d61cb776836: Download complete
0d61cb776836: Pull complete
03b3e22f64d3: Verifying Checksum
03b3e22f64d3: Download complete
4f4fb700ef54: Verifying Checksum
4f4fb700ef54: Download complete
d41ee723b0d2: Verifying Checksum
d41ee723b0d2: Download complete
3f1a51c43aba: Verifying Checksum
3f1a51c43aba: Download complete
54510473759b: Verifying Checksum
54510473759b: Download complete
54510473759b: Pull complete
d41ee723b0d2: Pull complete
03b3e22f64d3: Pull complete
4f4fb700ef54: Pull complete
3f1a51c43aba: Pull complete
Digest: sha256:35fb980114c1f18e6948b0bf95be68c02c9075a240d00495d11b4e9f9abae36a
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
d0bca371a29f: Pulling fs layer
96d47a0cc6b2: Pulling fs layer
d38ebd49d5dc: Pulling fs layer
d38ebd49d5dc: Verifying Checksum
d38ebd49d5dc: Download complete
d0bca371a29f: Verifying Checksum
d0bca371a29f: Download complete
d0bca371a29f: Pull complete
96d47a0cc6b2: Verifying Checksum
96d47a0cc6b2: Download complete
96d47a0cc6b2: Pull complete
d38ebd49d5dc: Pull complete
Digest: sha256:f185cd94f24473140bdb0e73355ab6d52de2e67f5e58536817d9a292787fa961
Status: Downloaded newer image for 4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-frontend:latest
4w36ujeoko5joi-ghcr.xuanyuan.run/kbkun024/django-react-lms-frontend:latest
创建环境变量文件...
验证.env文件内容...
-rw-r--r-- 1 *** *** 3292 Sep 14 19:07 .env
前几行内容：
SECRET_KEY=***
DEBUG=False
DJANGO_DEV_MODE=True
DEFAULT_FROM_EMAIL=***
SERVER_EMAIL=***
检查容器内文件结构...
total 1168
drwxr-xr-x 1 *** ***    4096 Sep 14 11:04 .
drwxr-xr-x 1 *** ***    4096 Sep 14 11:07 ..
-rw-r--r-- 1 *** ***    6148 Sep 14 11:03 .DS_Store
-rw-r--r-- 1 *** ***      19 Sep 14 11:03 .gitignore
-rw-r--r-- 1 *** ***    2303 Sep 14 11:03 Dockerfile
-rw-r--r-- 1 *** ***     825 Sep 14 11:03 Dockerfile.dev
-rw-r--r-- 1 *** ***     845 Sep 14 11:03 Dockerfile.fast
-rw-r--r-- 1 *** ***    1082 Sep 14 11:03 Dockerfile.optimized
-rw-r--r-- 1 *** ***    2012 Sep 14 11:03 Dockerfile.server
drwxr-xr-x 2 *** ***    4096 Sep 14 11:03 __pycache__
drwxr-xr-x 4 *** ***    4096 Sep 14 11:03 api
drwxr-xr-x 3 *** ***    4096 Sep 14 11:03 backend
drwxr-xr-x 5 *** ***    4096 Sep 14 11:03 core
-rw-r--r-- 1 *** *** 1105920 Sep 14 11:03 db.sqlite3
drwxr-xr-x 4 *** ***    4096 Sep 14 11:03 media
-rw-r--r-- 1 *** ***    1206 Sep 14 11:03 requirements.txt
-rwxr-xr-x 1 *** ***     761 Sep 14 11:04 start.sh
drwxr-xr-x 2 *** ***    4096 Sep 14 11:04 static
drwxr-xr-x 2 *** ***    4096 Sep 14 11:04 staticfiles
drwxr-xr-x 3 *** ***    4096 Sep 14 11:03 templates
drwxr-xr-x 4 *** ***    4096 Sep 14 11:03 userauths
drwxr-xr-x 2 *** ***    4096 Sep 14 11:03 utils
total 52
drwxr-xr-x 3 *** ***  4096 Sep 14 11:03 .
drwxr-xr-x 1 *** ***  4096 Sep 14 11:04 ..
-rw-r--r-- 1 *** ***  6148 Sep 14 11:03 .DS_Store
-rw-r--r-- 1 *** ***     0 Sep 14 11:03 __init__.py
drwxr-xr-x 2 *** ***  4096 Sep 14 11:03 __pycache__
-rw-r--r-- 1 *** ***   391 Sep 14 11:03 asgi.py
-rw-r--r-- 1 *** *** 16748 Sep 14 11:03 settings.py
-rw-r--r-- 1 *** ***  2779 Sep 14 11:03 urls.py
-rw-r--r-- 1 *** ***   391 Sep 14 11:03 wsgi.py
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
4b2ff1c03e95   lms-backend:latest   "/app/start.sh"   16 seconds ago   Restarting (2) Less than a second ago             lms-backend
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
#2 transferring dockerfile: 30B
#2 transferring dockerfile: 1.71kB done
#2 DONE 0.0s
#3 [internal] load metadata for docker.io/library/python:3.13-slim
#3 ERROR: docker.io/library/python:3.13-slim: not found
------
 > [internal] load metadata for docker.io/library/python:3.13-slim:
------
Dockerfile:2
--------------------
   1 |     # backend/Dockerfile - 生产环境优化版本
   2 | >>> FROM python:3.13-slim AS base
   3 |     ENV PYTHONDONTWRITEBYTECODE=1 \
   4 |         PYTHONUNBUFFERED=1 \
--------------------
failed to solve: python:3.13-slim: failed to resolve source metadata for docker.io/library/python:3.13-slim: docker.io/library/python:3.13-slim: not found
117207 v0.26.1 /usr/libexec/docker/cli-plugins/docker-buildx bake --file - --progress rawjson --metadata-file /tmp/compose-build-metadataFile-706354534.json --allow fs.read=/opt/lms
google.golang.org/grpc.(*ClientConn).Invoke
	google.golang.org/grpc@v1.72.2/call.go:35
github.com/moby/buildkit/frontend/gateway/pb.(*lLBBridgeClient).Solve
	github.com/moby/buildkit@v0.23.0-rc1.0.20250618182037-9b91d20367db/frontend/gateway/pb/gateway_grpc.pb.go:98
github.com/moby/buildkit/client.(*gatewayClientForBuild).Solve
	github.com/moby/buildkit@v0.23.0-rc1.0.20250618182037-9b91d20367db/client/build.go:98
github.com/moby/buildkit/frontend/gateway/grpcclient.(*grpcClient).Solve
	github.com/moby/buildkit@v0.23.0-rc1.0.20250618182037-9b91d20367db/frontend/gateway/grpcclient/client.go:412
github.com/docker/buildx/build.solve
	github.com/docker/buildx/build/build.go:1202
github.com/docker/buildx/build.BuildWithResultHandler.func1.4.2
	github.com/docker/buildx/build/build.go:504
github.com/moby/buildkit/frontend/gateway/grpcclient.(*grpcClient).Run
	github.com/moby/buildkit@v0.23.0-rc1.0.20250618182037-9b91d20367db/frontend/gateway/grpcclient/client.go:215
github.com/moby/buildkit/client.(*Client).Build.func2
	github.com/moby/buildkit@v0.23.0-rc1.0.20250618182037-9b91d20367db/client/build.go:59
github.com/moby/buildkit/client.(*Client).solve.func3
	github.com/moby/buildkit@v0.23.0-rc1.0.20250618182037-9b91d20367db/client/solve.go:295
golang.org/x/sync/errgroup.(*Group).add.func1
	golang.org/x/sync@v0.14.0/errgroup/errgroup.go:130
runtime.goexit
	runtime/asm_amd64.s:1700
114936  /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
github.com/moby/buildkit/frontend/gateway.(*llbBridgeForwarder).Return
	/***/build-deb/engine/vendor/github.com/moby/buildkit/frontend/gateway/gateway.go:1035
github.com/moby/buildkit/control/gateway.(*GatewayForwarder).Return
	/***/build-deb/engine/vendor/github.com/moby/buildkit/control/gateway/gateway.go:146
github.com/moby/buildkit/frontend/gateway/pb._LLBBridge_Return_Handler.func1
	/***/build-deb/engine/vendor/github.com/moby/buildkit/frontend/gateway/pb/gateway_grpc.pb.go:473
google.golang.org/grpc.getChainUnaryHandler.func1
	/***/build-deb/engine/vendor/google.golang.org/grpc/server.go:1217
github.com/docker/docker/api/server/router/grpc.unaryInterceptor
	/***/build-deb/engine/api/server/router/grpc/grpc.go:71
google.golang.org/grpc.NewServer.chainUnaryServerInterceptors.chainUnaryInterceptors.func1
	/***/build-deb/engine/vendor/google.golang.org/grpc/server.go:1208
github.com/moby/buildkit/frontend/gateway/pb._LLBBridge_Return_Handler
	/***/build-deb/engine/vendor/github.com/moby/buildkit/frontend/gateway/pb/gateway_grpc.pb.go:475
google.golang.org/grpc.(*Server).processUnaryRPC
	/***/build-deb/engine/vendor/google.golang.org/grpc/server.go:1405
google.golang.org/grpc.(*Server).handleStream
	/***/build-deb/engine/vendor/google.golang.org/grpc/server.go:1815
google.golang.org/grpc.(*Server).serveStreams.func2.1
	/***/build-deb/engine/vendor/google.golang.org/grpc/server.go:1035
runtime.goexit
	/usr/local/go/src/runtime/asm_amd64.s:1700
114936  /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
github.com/moby/buildkit/client/llb/sourceresolver.(*imageMetaResolver).ResolveImageConfig
	/***/build-deb/engine/vendor/github.com/moby/buildkit/client/llb/sourceresolver/imageresolver.go:51
github.com/moby/buildkit/frontend/gateway/forwarder.(*BridgeClient).ResolveImageConfig
	/***/build-deb/engine/vendor/github.com/moby/buildkit/frontend/gateway/forwarder/forward.go:93
github.com/moby/buildkit/frontend/dockerfile/builder.(*withResolveCache).ResolveImageConfig.func1
	/***/build-deb/engine/vendor/github.com/moby/buildkit/frontend/dockerfile/builder/resolvecache.go:37
github.com/moby/buildkit/util/flightcontrol.(*CachedGroup[...]).Do.func1
	/***/build-deb/engine/vendor/github.com/moby/buildkit/util/flightcontrol/cached.go:43
github.com/moby/buildkit/util/flightcontrol.(*call[...]).run
	/***/build-deb/engine/vendor/github.com/moby/buildkit/util/flightcontrol/flightcontrol.go:122
sync.(*Once).doSlow
	/usr/local/go/src/sync/once.go:78
sync.(*Once).Do
	/usr/local/go/src/sync/once.go:69
runtime.goexit
	/usr/local/go/src/runtime/asm_amd64.s:1700
117207 v0.26.1 /usr/libexec/docker/cli-plugins/docker-buildx bake --file - --progress rawjson --metadata-file /tmp/compose-build-metadataFile-706354534.json --allow fs.read=/opt/lms
google.golang.org/grpc.(*ClientConn).Invoke
	google.golang.org/grpc@v1.72.2/call.go:35
github.com/moby/buildkit/api/services/control.(*controlClient).Solve
	github.com/moby/buildkit@v0.23.0-rc1.0.20250618182037-9b91d20367db/api/services/control/control_grpc.pb.go:88
github.com/moby/buildkit/client.(*Client).solve.func2
	github.com/moby/buildkit@v0.23.0-rc1.0.20250618182037-9b91d20367db/client/solve.go:268
golang.org/x/sync/errgroup.(*Group).add.func1
	golang.org/x/sync@v0.14.0/errgroup/errgroup.go:130
114936  /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
github.com/moby/buildkit/frontend/dockerfile/dockerfile2llb.toDispatchState.toDispatchState.func2.toDispatchState.toDispatchState.func2.func3.func6
	/***/build-deb/engine/vendor/github.com/moby/buildkit/frontend/dockerfile/dockerfile2llb/convert.go:542
golang.org/x/sync/errgroup.(*Group).add.func1
	/***/build-deb/engine/vendor/golang.org/x/sync/errgroup/errgroup.go:130
runtime.goexit
	/usr/local/go/src/runtime/asm_amd64.s:1700
117207 v0.26.1 /usr/libexec/docker/cli-plugins/docker-buildx bake --file - --progress rawjson --metadata-file /tmp/compose-build-metadataFile-706354534.json --allow fs.read=/opt/lms
github.com/moby/buildkit/client.(*Client).solve.func2
	github.com/moby/buildkit@v0.23.0-rc1.0.20250618182037-9b91d20367db/client/solve.go:285
golang.org/x/sync/errgroup.(*Group).add.func1
	golang.org/x/sync@v0.14.0/errgroup/errgroup.go:130
2025/09/14 11:09:20 Process exited with status 1
Error: Process completed with exit code 1.