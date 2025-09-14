#!/bin/bash

# 续期Let's Encrypt证书脚本

echo "### 续期证书 ..."
docker-compose run --rm certbot renew

echo "### 重新加载nginx ..."
docker-compose exec frontend nginx -s reload

echo "### 证书续期完成！"
