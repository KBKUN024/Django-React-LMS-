/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: /etc/nginx/conf.d/default.conf differs from the packaged version
/docker-entrypoint.sh: Sourcing /docker-entrypoint.d/15-local-resolvers.envsh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
/docker-entrypoint.sh: Configuration complete; ready for start up
2025/09/14 09:13:22 [notice] 1#1: using the "epoll" event method
2025/09/14 09:13:22 [notice] 1#1: nginx/1.29.1
2025/09/14 09:13:22 [notice] 1#1: built by gcc 14.2.0 (Alpine 14.2.0) 
2025/09/14 09:13:22 [notice] 1#1: OS: Linux 6.8.0-63-generic
2025/09/14 09:13:22 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2025/09/14 09:13:22 [notice] 1#1: start worker processes
2025/09/14 09:13:22 [notice] 1#1: start worker process 29
2025/09/14 09:13:22 [notice] 1#1: start worker process 30
172.19.0.1 - - [14/Sep/2025:09:13:51 +0000] "GET / HTTP/1.1" 200 464 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:13:52 +0000] "GET /vite.svg HTTP/1.1" 200 1497 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:13:52 +0000] "GET /assets/images/svg/playstore.svg HTTP/1.1" 404 555 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:13:52 +0000] "GET /assets/images/avatar/avatar-1.jpg HTTP/1.1" 404 555 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:13:52 +0000] "GET /assets/images/svg/appstore.svg HTTP/1.1" 404 555 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:13:52 +0000] "GET /api/v1/course/course-list/ HTTP/1.1" 200 88053 "https://lms.tyuan21081.top/login/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:13:54 +0000] "GET /assets/images/avatar/avatar-1.jpg HTTP/1.1" 404 555 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:13:54 +0000] "GET /api/v1/course/course-list/ HTTP/1.1" 200 88053 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:13:54 +0000] "GET /media/course-file/django.png HTTP/1.1" 404 179 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:13:54 +0000] "GET /media/course-file/python.jpeg HTTP/1.1" 404 179 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:13:54 +0000] "GET /media/course-file/react-native-1024x631.png HTTP/1.1" 404 179 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:13:58 +0000] "GET / HTTP/1.1" 200 464 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:14:00 +0000] "GET /vite.svg HTTP/1.1" 200 1497 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:14:00 +0000] "GET /assets/images/svg/appstore.svg HTTP/1.1" 404 555 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:14:00 +0000] "GET /assets/images/avatar/avatar-1.jpg HTTP/1.1" 404 555 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:14:00 +0000] "GET /assets/images/svg/playstore.svg HTTP/1.1" 404 555 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:14:00 +0000] "GET /api/v1/course/course-list/ HTTP/1.1" 200 88053 "https://lms.tyuan21081.top/login/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:14:02 +0000] "GET /assets/images/avatar/avatar-1.jpg HTTP/1.1" 404 555 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:14:02 +0000] "GET /api/v1/course/course-list/ HTTP/1.1" 200 88053 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:14:02 +0000] "GET /media/course-file/react-native-1024x631.png HTTP/1.1" 404 179 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:14:02 +0000] "GET /media/course-file/python.jpeg HTTP/1.1" 404 179 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:14:02 +0000] "GET /media/course-file/django.png HTTP/1.1" 404 179 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:14:19 +0000] "POST /api/v1/user/token/ HTTP/1.1" 500 145 "https://lms.tyuan21081.top/login/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:14:27 +0000] "POST /api/v1/user/token/ HTTP/1.1" 500 145 "https://lms.tyuan21081.top/login/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"
172.19.0.1 - - [14/Sep/2025:09:15:41 +0000] "GET /vite.svg HTTP/1.1" 200 1497 "https://lms.tyuan21081.top/login/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" "110.82.237.8"