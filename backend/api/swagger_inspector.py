"""
自定义Swagger检查器 - 修复Django国际化翻译代理对象兼容性问题
"""
from django.utils.translation import gettext_lazy as _
from django.utils.functional import Promise
import logging

logger = logging.getLogger(__name__)

def monkey_patch_field_repr():
    """
    猴子补丁：修复DRF字段表示中的翻译代理对象问题
    """
    from rest_framework.utils.representation import smart_repr
    
    original_smart_repr = smart_repr
    
    def safe_smart_repr(value):
        """安全版本的smart_repr，处理翻译代理对象"""
        try:
            # 如果是翻译代理对象，直接转换为字符串
            if isinstance(value, Promise):
                return repr(str(value))
            return original_smart_repr(value)
        except AttributeError as e:
            if '_delegate_text' in str(e):
                # 如果遇到_delegate_text错误，返回安全的字符串表示
                return repr(str(value) if hasattr(value, '__str__') else 'TranslatedString')
            raise
    
    # 应用猴子补丁
    import rest_framework.utils.representation
    rest_framework.utils.representation.smart_repr = safe_smart_repr


# 应用猴子补丁
monkey_patch_field_repr()
