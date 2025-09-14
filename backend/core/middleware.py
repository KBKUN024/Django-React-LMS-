"""
自定义中间件
"""
from django.utils.deprecation import MiddlewareMixin
from django.middleware.csrf import CsrfViewMiddleware
from django.http import HttpResponseServerError
import re
import logging

logger = logging.getLogger(__name__)


class CustomCsrfMiddleware:
    """
    自定义CSRF中间件，豁免API请求的CSRF检查
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, callback, callback_args, callback_kwargs):
        try:
            # 豁免API请求的CSRF检查
            if request.path.startswith('/api/'):
                return None

            # 对于其他请求，使用默认的CSRF检查
            csrf_middleware = CsrfViewMiddleware(self.get_response)
            return csrf_middleware.process_view(request, callback, callback_args, callback_kwargs)
        except Exception as e:
            logger.error(f"CSRF middleware error: {e}")
            return None

    def process_exception(self, request, exception):
        # 记录异常但不阻止处理
        logger.error(f"Request exception in CSRF middleware: {exception}")
        return None
