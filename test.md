 => => extracting sha256:b2feff975e6dd2ebaf182772fb9ee26274648387b061e821e0bb5026735dd094                                                                                 1.4s
 => => extracting sha256:3675cac5502bd5a12d0d0087f64ccd38de879fb730b38470a4714edfa3da4699                                                                                 0.1s
 => => extracting sha256:87104540c7dd1ad74d6c46fc47af98e48a13ac8cdb1e5a63d498bba70d88e87c                                                                                 0.7s
 => => extracting sha256:8a169d42b20af852ea1af256db44dec4e7882718377eaab1ad7364f3b653cb4b                                                                                 0.0s
 => [backend internal] load build context                                                                                                                                 9.8s
 => => transferring context: 627.12MB                                                                                                                                     9.8s
 => [frontend build 1/7] FROM docker.io/library/node:20-alpine@sha256:eabac870db94f7342d6c33560d6613f188bbcf4bbe1f4eb47d5e2a08e1a37722                                   10.2s
 => => resolve docker.io/library/node:20-alpine@sha256:eabac870db94f7342d6c33560d6613f188bbcf4bbe1f4eb47d5e2a08e1a37722                                                   0.0s
 => => sha256:dc51168f088b66e2048a9c64d8069ced46324ea6d4026a6a094511bd04ff625c 6.44kB / 6.44kB                                                                            0.0s
 => => sha256:eabac870db94f7342d6c33560d6613f188bbcf4bbe1f4eb47d5e2a08e1a37722 7.67kB / 7.67kB                                                                            0.0s
 => => sha256:76194b803ea265cd3e41a3c23220344e58bf4820cba8e72f81ce4f0ec95572e3 1.72kB / 1.72kB                                                                            0.0s
 => => sha256:5a8e8228254a218fbf68fbf8d7093ea99dfce63dd0a72ad0cc8be65e6da3f7c8 42.43MB / 42.43MB                                                                          9.4s
 => => sha256:c149c7c96aa9b49de8c5de3415d3692e81ced50773077ea0be1a0f3f36032234 1.26MB / 1.26MB                                                                            7.2s
 => => sha256:127c05f5df6b075d5c314444a05d3de523268e2de5e9b235e7ba72aa60ed3c61 446B / 446B                                                                                7.3s
 => => extracting sha256:5a8e8228254a218fbf68fbf8d7093ea99dfce63dd0a72ad0cc8be65e6da3f7c8                                                                                 0.7s
 => => extracting sha256:c149c7c96aa9b49de8c5de3415d3692e81ced50773077ea0be1a0f3f36032234                                                                                 0.0s
 => => extracting sha256:127c05f5df6b075d5c314444a05d3de523268e2de5e9b235e7ba72aa60ed3c61                                                                                 0.0s
 => [frontend internal] load build context                                                                                                                                5.8s
 => => transferring context: 388.41MB                                                                                                                                     5.6s
 => [frontend runtime 1/3] FROM docker.io/library/nginx:alpine@sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98605ba5e3b26ab8                                   12.8s
 => => resolve docker.io/library/nginx:alpine@sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98605ba5e3b26ab8                                                     0.0s
 => => sha256:35f3cbee4fb77c3efb39f2723a21ce181906139442a37de8ffc52d89641d9936 10.80kB / 10.80kB                                                                          0.0s
 => => sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98605ba5e3b26ab8 10.33kB / 10.33kB                                                                          0.0s
 => => sha256:77d740efa8f9c4753f2a7212d8422b8c77411681971f400ea03d07fe38476cac 2.50kB / 2.50kB                                                                            0.0s
 => => sha256:49f3b06c840fcb4c48cf9bfe1da039269b88c682942434e2bf8b266d3acdd4fd 1.80MB / 1.80MB                                                                            9.2s
 => => sha256:04ba7957f9d23b5a6073e2690367274e07226e16229a3874c65e854a457ca4d2 627B / 627B                                                                                9.3s
 => => extracting sha256:49f3b06c840fcb4c48cf9bfe1da039269b88c682942434e2bf8b266d3acdd4fd                                                                                 0.0s
 => => sha256:6156ecb6dfff3c433e78d41dab6d6dd7d2c5c759f6faebb49c0b6bc04874509b 953B / 953B                                                                                9.7s
 => => extracting sha256:04ba7957f9d23b5a6073e2690367274e07226e16229a3874c65e854a457ca4d2                                                                                 0.0s
 => => sha256:0bc2f07fbf03f53f2569fbdf75ab4c409fbde0d5ab4b4a6d49e8bfbd41577b76 403B / 403B                                                                                9.8s
 => => sha256:6c2c01fdb0949fef1a50f981f1c837eb1076c7731fbbcc3382fe699c33f232c6 1.21kB / 1.21kB                                                                           10.0s
 => => extracting sha256:6156ecb6dfff3c433e78d41dab6d6dd7d2c5c759f6faebb49c0b6bc04874509b                                                                                 0.0s
 => => sha256:66ce170f7dd87f4ee563e53b9f099a4e295f5e52cd580b4b84df4d3879c41486 1.40kB / 1.40kB                                                                           10.2s
 => => extracting sha256:0bc2f07fbf03f53f2569fbdf75ab4c409fbde0d5ab4b4a6d49e8bfbd41577b76                                                                                 0.0s
 => => sha256:021cb5923c0e90937539b3bc922d668109e6fa19b27d1e67bf0d6cb84cbc94d8 16.99MB / 16.99MB                                                                         12.5s
 => => extracting sha256:6c2c01fdb0949fef1a50f981f1c837eb1076c7731fbbcc3382fe699c33f232c6                                                                                 0.0s
 => => extracting sha256:66ce170f7dd87f4ee563e53b9f099a4e295f5e52cd580b4b84df4d3879c41486                                                                                 0.0s
 => => extracting sha256:021cb5923c0e90937539b3bc922d668109e6fa19b27d1e67bf0d6cb84cbc94d8                                                                                 0.2s
 => [backend base 2/2] WORKDIR /app                                                                                                                                       0.7s
 => [backend builder 1/4] RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*                                                       130.0s
 => [backend runtime 1/7] RUN adduser --disabled-password --gecos '' appuser                                                                                              0.3s
 => [backend runtime 2/7] WORKDIR /app                                                                                                                                    0.0s
 => [frontend build 2/7] WORKDIR /app                                                                                                                                     0.0s
 => [frontend build 3/7] COPY frontend/frontend/package.json frontend/frontend/pnpm-lock.yaml ./                                                                          0.0s
 => [frontend build 4/7] RUN npm install -g pnpm                                                                                                                          4.3s
 => [frontend build 5/7] RUN pnpm install                                                                                                                                11.7s
 => [frontend build 6/7] COPY frontend/frontend/ /app/                                                                                                                    2.3s
 => [frontend build 7/7] RUN pnpm run build                                                                                                                               7.9s
 => [frontend runtime 2/3] COPY --from=build /app/dist /usr/share/nginx/html                                                                                              0.0s
 => [frontend runtime 3/3] COPY docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf                                                                                 0.0s
 => [frontend] exporting to image                                                                                                                                         0.0s
 => => exporting layers                                                                                                                                                   0.0s
 => => writing image sha256:ddac28d95cb91dcb268f4ead999eecd2be0f9ead4ee4635d4b1fb9773e3ef1c8                                                                              0.0s
 => => naming to docker.io/library/lms-frontend:latest                                                                                                                    0.0s
 => [frontend] resolving provenance for metadata file                                                                                                                     0.0s
 => [backend builder 2/4] COPY backend/requirements.txt ./                                                                                                                0.0s
 => ERROR [backend builder 3/4] RUN pip install --upgrade pip && pip install -r requirements.txt                                                                         36.6s
------
 > [backend builder 3/4] RUN pip install --upgrade pip && pip install -r requirements.txt:
0.630 Requirement already satisfied: pip in /usr/local/lib/python3.13/site-packages (25.2)
3.499 WARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager, possibly rendering your system unusable. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv. Use the --root-user-action option if you know what you are doing and want to suppress this warning.
7.298 Collecting alipay-sdk-python==3.7.752 (from -r requirements.txt (line 1))
9.044   Downloading alipay_sdk_python-3.7.752-py3-none-any.whl.metadata (9.1 kB)
9.343 Collecting asgiref==3.8.1 (from -r requirements.txt (line 2))
9.541   Downloading asgiref-3.8.1-py3-none-any.whl.metadata (9.3 kB)
10.42 Collecting boto3==1.20.26 (from -r requirements.txt (line 3))
10.62   Downloading boto3-1.20.26-py3-none-any.whl.metadata (6.5 kB)
11.12 Collecting botocore==1.23.54 (from -r requirements.txt (line 4))
11.32   Downloading botocore-1.23.54-py3-none-any.whl.metadata (5.8 kB)
11.57 Collecting certifi==2023.11.17 (from -r requirements.txt (line 5))
11.76   Downloading certifi-2023.11.17-py3-none-any.whl.metadata (2.2 kB)
12.04 Collecting cffi==1.17.1 (from -r requirements.txt (line 6))
12.24   Downloading cffi-1.17.1-cp313-cp313-manylinux_2_17_aarch64.manylinux2014_aarch64.whl.metadata (1.5 kB)
12.50 Collecting charset-normalizer==3.3.2 (from -r requirements.txt (line 7))
13.07   Downloading charset_normalizer-3.3.2-py3-none-any.whl.metadata (33 kB)
13.55 Collecting cryptography==41.0.7 (from -r requirements.txt (line 8))
13.75   Downloading cryptography-41.0.7-cp37-abi3-manylinux_2_28_aarch64.whl.metadata (5.2 kB)
13.97 Collecting decorator==5.2.1 (from -r requirements.txt (line 9))
14.17   Downloading decorator-5.2.1-py3-none-any.whl.metadata (3.9 kB)
14.38 Collecting defusedxml==0.7.1 (from -r requirements.txt (line 10))
14.58   Downloading defusedxml-0.7.1-py2.py3-none-any.whl.metadata (32 kB)
15.01 Collecting dj-database-url==2.1.0 (from -r requirements.txt (line 11))
15.21   Downloading dj_database_url-2.1.0-py3-none-any.whl.metadata (11 kB)
15.47 Collecting Django==5.1.4 (from -r requirements.txt (line 12))
15.84   Downloading Django-5.1.4-py3-none-any.whl.metadata (4.2 kB)
16.05 Collecting django-anymail==13.0.1 (from -r requirements.txt (line 13))
16.26   Downloading django_anymail-13.0.1-py3-none-any.whl.metadata (11 kB)
16.63 Collecting django-ckeditor-5==0.2.18 (from -r requirements.txt (line 14))
16.84   Downloading django_ckeditor_5-0.2.18-py3-none-any.whl.metadata (15 kB)
17.07 Collecting django-cors-headers==3.14.0 (from -r requirements.txt (line 15))
17.28   Downloading django_cors_headers-3.14.0-py3-none-any.whl.metadata (17 kB)
17.51 Collecting django-jazzmin==3.0.0 (from -r requirements.txt (line 16))
17.87   Downloading django_jazzmin-3.0.0-py3-none-any.whl.metadata (6.2 kB)
18.08 Collecting django-storages==1.12.3 (from -r requirements.txt (line 17))
18.26   Downloading django_storages-1.12.3-py3-none-any.whl.metadata (54 kB)
18.70 Collecting djangorestframework==3.14.0 (from -r requirements.txt (line 18))
18.90   Downloading djangorestframework-3.14.0-py3-none-any.whl.metadata (10 kB)
19.27 Collecting djangorestframework_simplejwt==5.5.1 (from -r requirements.txt (line 19))
19.48   Downloading djangorestframework_simplejwt-5.5.1-py3-none-any.whl.metadata (4.6 kB)
19.86 Collecting drf-yasg==1.21.7 (from -r requirements.txt (line 20))
20.05   Downloading drf_yasg-1.21.7-py3-none-any.whl.metadata (16 kB)
20.29 Collecting environs==10.0.0 (from -r requirements.txt (line 21))
20.50   Downloading environs-10.0.0-py3-none-any.whl.metadata (13 kB)
20.72 Collecting gunicorn==21.2.0 (from -r requirements.txt (line 22))
20.91   Downloading gunicorn-21.2.0-py3-none-any.whl.metadata (4.1 kB)
21.13 Collecting idna==3.6 (from -r requirements.txt (line 23))
21.33   Downloading idna-3.6-py3-none-any.whl.metadata (9.9 kB)
21.56 Collecting imageio==2.37.0 (from -r requirements.txt (line 24))
21.76   Downloading imageio-2.37.0-py3-none-any.whl.metadata (5.2 kB)
21.98 Collecting imageio-ffmpeg==0.6.0 (from -r requirements.txt (line 25))
22.18   Downloading imageio_ffmpeg-0.6.0-py3-none-manylinux2014_aarch64.whl.metadata (1.5 kB)
22.77 Collecting inflection==0.5.1 (from -r requirements.txt (line 26))
22.97   Downloading inflection-0.5.1-py2.py3-none-any.whl.metadata (1.7 kB)
23.19 Collecting jmespath==0.10.0 (from -r requirements.txt (line 27))
23.39   Downloading jmespath-0.10.0-py2.py3-none-any.whl.metadata (8.0 kB)
24.37 Collecting markdown-it-py==4.0.0 (from -r requirements.txt (line 28))
24.57   Downloading markdown_it_py-4.0.0-py3-none-any.whl.metadata (7.3 kB)
24.81 Collecting marshmallow==3.20.1 (from -r requirements.txt (line 29))
25.01   Downloading marshmallow-3.20.1-py3-none-any.whl.metadata (7.8 kB)
25.23 Collecting mdurl==0.1.2 (from -r requirements.txt (line 30))
25.81   Downloading mdurl-0.1.2-py3-none-any.whl.metadata (1.6 kB)
26.02 Collecting moviepy==2.1.2 (from -r requirements.txt (line 31))
26.22   Downloading moviepy-2.1.2-py3-none-any.whl.metadata (6.9 kB)
26.55 Collecting numpy==2.3.2 (from -r requirements.txt (line 32))
26.75   Downloading numpy-2.3.2-cp313-cp313-manylinux_2_27_aarch64.manylinux_2_28_aarch64.whl.metadata (62 kB)
27.05 Collecting oauthlib==3.3.1 (from -r requirements.txt (line 33))
27.26   Downloading oauthlib-3.3.1-py3-none-any.whl.metadata (7.9 kB)
27.83 Collecting packaging==23.2 (from -r requirements.txt (line 34))
28.03   Downloading packaging-23.2-py3-none-any.whl.metadata (3.2 kB)
28.34 Collecting pillow==10.4.0 (from -r requirements.txt (line 35))
28.52   Downloading pillow-10.4.0-cp313-cp313-manylinux_2_28_aarch64.whl.metadata (9.2 kB)
28.72 Collecting proglog==0.1.12 (from -r requirements.txt (line 36))
28.91   Downloading proglog-0.1.12-py3-none-any.whl.metadata (794 bytes)
29.15 Collecting psycopg2==2.9.10 (from -r requirements.txt (line 37))
29.56   Downloading psycopg2-2.9.10.tar.gz (385 kB)
29.78   Installing build dependencies: started
34.72   Installing build dependencies: finished with status 'done'
34.72   Getting requirements to build wheel: started
35.03   Getting requirements to build wheel: finished with status 'error'
35.03   error: subprocess-exited-with-error
35.03   
35.03   × Getting requirements to build wheel did not run successfully.
35.03   │ exit code: 1
35.03   ╰─> [34 lines of output]
35.03       /tmp/pip-build-env-qf__h11q/overlay/lib/python3.13/site-packages/setuptools/dist.py:759: SetuptoolsDeprecationWarning: License classifiers are deprecated.
35.03       !!
35.03       
35.03               ********************************************************************************
35.03               Please consider removing the following classifiers in favor of a SPDX license expression:
35.03       
35.03               License :: OSI Approved :: GNU Library or Lesser General Public License (LGPL)
35.03       
35.03               See https://packaging.python.org/en/latest/guides/writing-pyproject-toml/#license for details.
35.03               ********************************************************************************
35.03       
35.03       !!
35.03         self._finalize_license_expression()
35.03       running egg_info
35.03       writing psycopg2.egg-info/PKG-INFO
35.03       writing dependency_links to psycopg2.egg-info/dependency_links.txt
35.03       writing top-level names to psycopg2.egg-info/top_level.txt
35.03       
35.03       Error: pg_config executable not found.
35.03       
35.03       pg_config is required to build psycopg2 from source.  Please add the directory
35.03       containing pg_config to the $PATH or specify the full executable path with the
35.03       option:
35.03       
35.03           python setup.py build_ext --pg-config /path/to/pg_config build ...
35.03       
35.03       or with the pg_config option in 'setup.cfg'.
35.03       
35.03       If you prefer to avoid building psycopg2 from source, please install the PyPI
35.03       'psycopg2-binary' package instead.
35.03       
35.03       For further information please check the 'doc/src/install.rst' file (also at
35.03       <https://www.psycopg.org/docs/install.html>).
35.03       
35.03       [end of output]
35.03   
35.03   note: This error originates from a subprocess, and is likely not a problem with pip.
36.52 error: subprocess-exited-with-error
36.52 
36.52 × Getting requirements to build wheel did not run successfully.
36.52 │ exit code: 1
36.52 ╰─> See above for output.
36.52 
36.52 note: This error originates from a subprocess, and is likely not a problem with pip.
------
Dockerfile:12

--------------------

  10 |     RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

  11 |     COPY backend/requirements.txt ./

  12 | >>> RUN pip install --upgrade pip && pip install -r requirements.txt

  13 |     COPY backend/ /app/

  14 |     

--------------------

target backend: failed to solve: process "/bin/sh -c pip install --upgrade pip && pip install -r requirements.txt" did not complete successfully: exit code: 1



View build details: docker-desktop://dashboard/build/desktop-linux/desktop-linux/idevo52yq5s8zc1hncx3bdgm4