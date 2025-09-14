检查数据库权限...
数据库文件已存在，检查权限...
chmod: changing permissions of '/app/db.sqlite3': Operation not permitted
警告：无法更改数据库权限
收集静态文件...
python: can't open file '/app/manage.py': [Errno 2] No such file or directory
启动Gunicorn...
[2025-09-14 09:13:07 +0000] [1] [DEBUG] Current configuration:
  config: ./gunicorn.conf.py
  wsgi_app: None
  bind: ['0.0.0.0:8000']
  backlog: 2048
  workers: 1
  worker_class: sync
  threads: 1
  worker_connections: 1000
  max_requests: 0
  max_requests_jitter: 0
  timeout: 60
  graceful_timeout: 30
  keepalive: 2
  limit_request_line: 4094
  limit_request_fields: 100
  limit_request_field_size: 8190
  reload: False
  reload_engine: auto
  reload_extra_files: []
  spew: False
  check_config: False
  print_config: False
  preload_app: False
  sendfile: None
  reuse_port: False
  chdir: /app
  daemon: False
  raw_env: []
  pidfile: None
  worker_tmp_dir: None
  user: 1000
  group: 1000
  umask: 0
  initgroups: False
  tmp_upload_dir: None
  secure_scheme_headers: {'X-FORWARDED-PROTOCOL': 'ssl', 'X-FORWARDED-PROTO': 'https', 'X-FORWARDED-SSL': 'on'}
  forwarded_allow_ips: ['127.0.0.1']
  accesslog: -
  disable_redirect_access_to_syslog: False
  access_log_format: %(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"
  errorlog: -
  loglevel: debug
  capture_output: False
  logger_class: gunicorn.glogging.Logger
  logconfig: None
  logconfig_dict: {}
  logconfig_json: None
  syslog_addr: udp://localhost:514
  syslog: False
  syslog_prefix: None
  syslog_facility: user
  enable_stdio_inheritance: False
  statsd_host: None
  dogstatsd_tags: 
  statsd_prefix: 
  proc_name: None
  default_proc_name: backend.wsgi:application
  pythonpath: None
  paste: None
  on_starting: <function OnStarting.on_starting at 0x733ce54a0fe0>
  on_reload: <function OnReload.on_reload at 0x733ce54a1120>
  when_ready: <function WhenReady.when_ready at 0x733ce54a1260>
  pre_fork: <function Prefork.pre_fork at 0x733ce54a13a0>
  post_fork: <function Postfork.post_fork at 0x733ce54a14e0>
  post_worker_init: <function PostWorkerInit.post_worker_init at 0x733ce54a1620>
  worker_int: <function WorkerInt.worker_int at 0x733ce54a1760>
  worker_abort: <function WorkerAbort.worker_abort at 0x733ce54a18a0>
  pre_exec: <function PreExec.pre_exec at 0x733ce54a19e0>
  pre_request: <function PreRequest.pre_request at 0x733ce54a1b20>
  post_request: <function PostRequest.post_request at 0x733ce54a1bc0>
  child_exit: <function ChildExit.child_exit at 0x733ce54a1d00>
  worker_exit: <function WorkerExit.worker_exit at 0x733ce54a1e40>
  nworkers_changed: <function NumWorkersChanged.nworkers_changed at 0x733ce54a1f80>
  on_exit: <function OnExit.on_exit at 0x733ce54a20c0>
  ssl_context: <function NewSSLContext.ssl_context at 0x733ce54a22a0>
  proxy_protocol: False
  proxy_allow_ips: ['127.0.0.1']
  keyfile: None
  certfile: None
  ssl_version: 2
  cert_reqs: 0
  ca_certs: None
  suppress_ragged_eofs: True
  do_handshake_on_connect: False
  ciphers: None
  raw_paste_global_conf: []
  strip_header_spaces: False
[2025-09-14 09:13:07 +0000] [1] [INFO] Starting gunicorn 21.2.0
[2025-09-14 09:13:07 +0000] [1] [DEBUG] Arbiter booted
[2025-09-14 09:13:07 +0000] [1] [INFO] Listening at: http://0.0.0.0:8000 (1)
[2025-09-14 09:13:07 +0000] [1] [INFO] Using worker: sync
[2025-09-14 09:13:07 +0000] [8] [INFO] Booting worker with pid: 8
[2025-09-14 09:13:07 +0000] [1] [DEBUG] 1 workers
DEBUG: .env file does not exist at: /.env
DEBUG: .env file does not exist at: /app/.env
DEBUG: Failed to load .env from .env: 'str' object has no attribute 'exists'
Warning: No .env file found, using system environment variables only
DEBUG: Current working directory: /app
DEBUG: BASE_DIR: /app
DEBUG: Checked env paths: [PosixPath('/.env'), PosixPath('/app/.env'), '.env']
/home/appuser/.local/lib/python3.11/site-packages/drf_yasg/__init__.py:2: UserWarning: pkg_resources is deprecated as an API. See https://setuptools.pypa.io/en/latest/pkg_resources.html. The pkg_resources package is slated for removal as early as 2025-11-30. Refrain from using this package or pin to Setuptools<81.
  from pkg_resources import DistributionNotFound, get_distribution
[2025-09-14 17:13:11 +0800] [8] [DEBUG] GET /api/v1/course/category/
127.0.0.1 - - [14/Sep/2025:17:13:12 +0800] "GET /api/v1/course/category/ HTTP/1.1" 200 3645 "-" "curl/8.14.1"
[2025-09-14 17:13:23 +0800] [8] [DEBUG] GET /
127.0.0.1 - - [14/Sep/2025:17:13:23 +0800] "GET / HTTP/1.1" 200 1633 "-" "curl/8.14.1"
[2025-09-14 17:13:42 +0800] [8] [DEBUG] GET /api/v1/course/category/
127.0.0.1 - - [14/Sep/2025:17:13:42 +0800] "GET /api/v1/course/category/ HTTP/1.1" 200 3645 "-" "curl/8.14.1"
[2025-09-14 17:13:52 +0800] [8] [DEBUG] GET /api/v1/course/course-list/
172.19.0.3 - - [14/Sep/2025:17:13:52 +0800] "GET /api/v1/course/course-list/ HTTP/1.0" 200 88053 "https://lms.tyuan21081.top/login/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
[2025-09-14 17:13:54 +0800] [8] [DEBUG] GET /api/v1/course/course-list/
172.19.0.3 - - [14/Sep/2025:17:13:54 +0800] "GET /api/v1/course/course-list/ HTTP/1.0" 200 88053 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
[2025-09-14 17:13:54 +0800] [8] [DEBUG] GET /media/course-file/django.png
WARNING 2025-09-14 17:13:54,505 log 8 126705401088896 Not Found: /media/course-file/django.png
172.19.0.3 - - [14/Sep/2025:17:13:54 +0800] "GET /media/course-file/django.png HTTP/1.0" 404 179 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
[2025-09-14 17:13:54 +0800] [8] [DEBUG] GET /media/course-file/python.jpeg
WARNING 2025-09-14 17:13:54,507 log 8 126705401088896 Not Found: /media/course-file/python.jpeg
172.19.0.3 - - [14/Sep/2025:17:13:54 +0800] "GET /media/course-file/python.jpeg HTTP/1.0" 404 179 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
[2025-09-14 17:13:54 +0800] [8] [DEBUG] GET /media/course-file/react-native-1024x631.png
WARNING 2025-09-14 17:13:54,508 log 8 126705401088896 Not Found: /media/course-file/react-native-1024x631.png
172.19.0.3 - - [14/Sep/2025:17:13:54 +0800] "GET /media/course-file/react-native-1024x631.png HTTP/1.0" 404 179 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
[2025-09-14 17:14:00 +0800] [8] [DEBUG] GET /api/v1/course/course-list/
172.19.0.3 - - [14/Sep/2025:17:14:00 +0800] "GET /api/v1/course/course-list/ HTTP/1.0" 200 88053 "https://lms.tyuan21081.top/login/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
[2025-09-14 17:14:02 +0800] [8] [DEBUG] GET /api/v1/course/course-list/
172.19.0.3 - - [14/Sep/2025:17:14:02 +0800] "GET /api/v1/course/course-list/ HTTP/1.0" 200 88053 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
[2025-09-14 17:14:02 +0800] [8] [DEBUG] GET /media/course-file/react-native-1024x631.png
WARNING 2025-09-14 17:14:02,891 log 8 126705401088896 Not Found: /media/course-file/react-native-1024x631.png
172.19.0.3 - - [14/Sep/2025:17:14:02 +0800] "GET /media/course-file/react-native-1024x631.png HTTP/1.0" 404 179 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
[2025-09-14 17:14:02 +0800] [8] [DEBUG] GET /media/course-file/python.jpeg
WARNING 2025-09-14 17:14:02,892 log 8 126705401088896 Not Found: /media/course-file/python.jpeg
172.19.0.3 - - [14/Sep/2025:17:14:02 +0800] "GET /media/course-file/python.jpeg HTTP/1.0" 404 179 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
[2025-09-14 17:14:02 +0800] [8] [DEBUG] GET /media/course-file/django.png
WARNING 2025-09-14 17:14:02,894 log 8 126705401088896 Not Found: /media/course-file/django.png
172.19.0.3 - - [14/Sep/2025:17:14:02 +0800] "GET /media/course-file/django.png HTTP/1.0" 404 179 "https://lms.tyuan21081.top/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
[2025-09-14 17:14:12 +0800] [8] [DEBUG] GET /api/v1/course/category/
127.0.0.1 - - [14/Sep/2025:17:14:12 +0800] "GET /api/v1/course/category/ HTTP/1.1" 200 3645 "-" "curl/8.14.1"
[2025-09-14 17:14:19 +0800] [8] [DEBUG] POST /api/v1/user/token/
ERROR 2025-09-14 17:14:19,737 middleware 8 126705401088896 Request exception in CSRF middleware: attempt to write a readonly database
ERROR 2025-09-14 17:14:19,738 log 8 126705401088896 Internal Server Error: /api/v1/user/token/
Traceback (most recent call last):
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/utils.py", line 105, in _execute
    return self.cursor.execute(sql, params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/sqlite3/base.py", line 354, in execute
    return super().execute(query, params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
sqlite3.OperationalError: attempt to write a readonly database

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/home/appuser/.local/lib/python3.11/site-packages/django/core/handlers/exception.py", line 55, in inner
    response = get_response(request)
               ^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/core/handlers/base.py", line 197, in _get_response
    response = wrapped_callback(request, *callback_args, **callback_kwargs)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/views/decorators/csrf.py", line 65, in _view_wrapper
    return view_func(request, *args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/views/generic/base.py", line 104, in view
    return self.dispatch(request, *args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework/views.py", line 509, in dispatch
    response = self.handle_exception(exc)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework/views.py", line 469, in handle_exception
    self.raise_uncaught_exception(exc)
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework/views.py", line 480, in raise_uncaught_exception
    raise exc
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework/views.py", line 506, in dispatch
    response = handler(request, *args, **kwargs)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework_simplejwt/views.py", line 46, in post
    serializer.is_valid(raise_exception=True)
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework/serializers.py", line 227, in is_valid
    self._validated_data = self.run_validation(self.initial_data)
                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework/serializers.py", line 429, in run_validation
    value = self.validate(value)
            ^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework_simplejwt/serializers.py", line 75, in validate
    refresh = self.get_token(self.user)
              ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/app/api/serializer.py", line 39, in get_token
    token = super().get_token(user)
            ^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework_simplejwt/serializers.py", line 66, in get_token
    return cls.token_class.for_user(user)  # type: ignore
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework_simplejwt/tokens.py", line 344, in for_user
    OutstandingToken.objects.create(
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/manager.py", line 87, in manager_method
    return getattr(self.get_queryset(), name)(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/query.py", line 679, in create
    obj.save(force_insert=True, using=self.db)
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/base.py", line 892, in save
    self.save_base(
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/base.py", line 998, in save_base
    updated = self._save_table(
              ^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/base.py", line 1161, in _save_table
    results = self._do_insert(
              ^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/base.py", line 1202, in _do_insert
    return manager._insert(
           ^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/manager.py", line 87, in manager_method
    return getattr(self.get_queryset(), name)(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/query.py", line 1847, in _insert
    return query.get_compiler(using=using).execute_sql(returning_fields)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/sql/compiler.py", line 1836, in execute_sql
    cursor.execute(sql, params)
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/utils.py", line 79, in execute
    return self._execute_with_wrappers(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/utils.py", line 92, in _execute_with_wrappers
    return executor(sql, params, many, context)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/utils.py", line 100, in _execute
    with self.db.wrap_database_errors:
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/utils.py", line 91, in __exit__
    raise dj_exc_value.with_traceback(traceback) from exc_value
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/utils.py", line 105, in _execute
    return self.cursor.execute(sql, params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/sqlite3/base.py", line 354, in execute
    return super().execute(query, params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
django.db.utils.OperationalError: attempt to write a readonly database
172.19.0.3 - - [14/Sep/2025:17:14:19 +0800] "POST /api/v1/user/token/ HTTP/1.0" 500 145 "https://lms.tyuan21081.top/login/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
[2025-09-14 17:14:26 +0800] [8] [DEBUG] POST /api/v1/user/token/
ERROR 2025-09-14 17:14:27,345 middleware 8 126705401088896 Request exception in CSRF middleware: attempt to write a readonly database
ERROR 2025-09-14 17:14:27,346 log 8 126705401088896 Internal Server Error: /api/v1/user/token/
Traceback (most recent call last):
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/utils.py", line 105, in _execute
    return self.cursor.execute(sql, params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/sqlite3/base.py", line 354, in execute
    return super().execute(query, params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
sqlite3.OperationalError: attempt to write a readonly database

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/home/appuser/.local/lib/python3.11/site-packages/django/core/handlers/exception.py", line 55, in inner
    response = get_response(request)
               ^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/core/handlers/base.py", line 197, in _get_response
    response = wrapped_callback(request, *callback_args, **callback_kwargs)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/views/decorators/csrf.py", line 65, in _view_wrapper
    return view_func(request, *args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/views/generic/base.py", line 104, in view
    return self.dispatch(request, *args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework/views.py", line 509, in dispatch
    response = self.handle_exception(exc)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework/views.py", line 469, in handle_exception
    self.raise_uncaught_exception(exc)
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework/views.py", line 480, in raise_uncaught_exception
    raise exc
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework/views.py", line 506, in dispatch
    response = handler(request, *args, **kwargs)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework_simplejwt/views.py", line 46, in post
    serializer.is_valid(raise_exception=True)
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework/serializers.py", line 227, in is_valid
    self._validated_data = self.run_validation(self.initial_data)
                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework/serializers.py", line 429, in run_validation
    value = self.validate(value)
            ^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework_simplejwt/serializers.py", line 75, in validate
    refresh = self.get_token(self.user)
              ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/app/api/serializer.py", line 39, in get_token
    token = super().get_token(user)
            ^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework_simplejwt/serializers.py", line 66, in get_token
    return cls.token_class.for_user(user)  # type: ignore
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/rest_framework_simplejwt/tokens.py", line 344, in for_user
    OutstandingToken.objects.create(
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/manager.py", line 87, in manager_method
    return getattr(self.get_queryset(), name)(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/query.py", line 679, in create
    obj.save(force_insert=True, using=self.db)
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/base.py", line 892, in save
    self.save_base(
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/base.py", line 998, in save_base
    updated = self._save_table(
              ^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/base.py", line 1161, in _save_table
    results = self._do_insert(
              ^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/base.py", line 1202, in _do_insert
    return manager._insert(
           ^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/manager.py", line 87, in manager_method
    return getattr(self.get_queryset(), name)(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/query.py", line 1847, in _insert
    return query.get_compiler(using=using).execute_sql(returning_fields)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/models/sql/compiler.py", line 1836, in execute_sql
    cursor.execute(sql, params)
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/utils.py", line 79, in execute
    return self._execute_with_wrappers(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/utils.py", line 92, in _execute_with_wrappers
    return executor(sql, params, many, context)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/utils.py", line 100, in _execute
    with self.db.wrap_database_errors:
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/utils.py", line 91, in __exit__
    raise dj_exc_value.with_traceback(traceback) from exc_value
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/utils.py", line 105, in _execute
    return self.cursor.execute(sql, params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/appuser/.local/lib/python3.11/site-packages/django/db/backends/sqlite3/base.py", line 354, in execute
    return super().execute(query, params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
django.db.utils.OperationalError: attempt to write a readonly database
172.19.0.3 - - [14/Sep/2025:17:14:27 +0800] "POST /api/v1/user/token/ HTTP/1.0" 500 145 "https://lms.tyuan21081.top/login/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
[2025-09-14 17:14:42 +0800] [8] [DEBUG] GET /api/v1/course/category/
127.0.0.1 - - [14/Sep/2025:17:14:42 +0800] "GET /api/v1/course/category/ HTTP/1.1" 200 3645 "-" "curl/8.14.1"
[2025-09-14 17:15:12 +0800] [8] [DEBUG] GET /api/v1/course/category/
127.0.0.1 - - [14/Sep/2025:17:15:12 +0800] "GET /api/v1/course/category/ HTTP/1.1" 200 3645 "-" "curl/8.14.1"
[2025-09-14 17:15:42 +0800] [8] [DEBUG] GET /api/v1/course/category/
127.0.0.1 - - [14/Sep/2025:17:15:42 +0800] "GET /api/v1/course/category/ HTTP/1.1" 200 3645 "-" "curl/8.14.1"
[2025-09-14 17:16:12 +0800] [8] [DEBUG] GET /api/v1/course/category/
127.0.0.1 - - [14/Sep/2025:17:16:12 +0800] "GET /api/v1/course/category/ HTTP/1.1" 200 3645 "-" "curl/8.14.1"
[2025-09-14 17:16:42 +0800] [8] [DEBUG] GET /api/v1/course/category/
127.0.0.1 - - [14/Sep/2025:17:16:42 +0800] "GET /api/v1/course/category/ HTTP/1.1" 200 3645 "-" "curl/8.14.1"