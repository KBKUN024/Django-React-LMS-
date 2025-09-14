"""
调试视图
"""
from django.http import JsonResponse
from django.conf import settings
import os


def debug_static_files(request):
    """
    调试静态文件状态
    """
    static_root = settings.STATIC_ROOT
    static_dirs = settings.STATICFILES_DIRS
    
    # 检查静态文件目录是否存在
    static_root_exists = os.path.exists(static_root)
    static_dirs_exist = [os.path.exists(str(d)) for d in static_dirs]
    
    # 列出静态文件目录内容
    static_files = []
    if static_root_exists:
        try:
            static_files = os.listdir(static_root)
        except:
            static_files = ["无法读取目录"]
    
    return JsonResponse({
        'static_root': str(static_root),
        'static_root_exists': static_root_exists,
        'static_dirs': [str(d) for d in static_dirs],
        'static_dirs_exist': static_dirs_exist,
        'static_files': static_files[:10],  # 只显示前10个文件
        'debug': settings.DEBUG,
        'django_dev_mode': os.environ.get('DJANGO_DEV_MODE'),
    })