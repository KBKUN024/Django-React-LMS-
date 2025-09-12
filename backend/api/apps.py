from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    
    def ready(self):
        """当应用准备就绪时执行的代码"""
        # 应用Swagger翻译代理对象修复
        try:
            from .swagger_inspector import monkey_patch_field_repr
            monkey_patch_field_repr()
        except ImportError:
            pass