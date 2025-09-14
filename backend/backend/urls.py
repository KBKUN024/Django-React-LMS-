"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.utils import translation
from core.views import debug_static_files

# 临时切换到英文生成Swagger schema以避免翻译代理对象问题
def get_swagger_schema_view():
    with translation.override('en'):
        return get_schema_view(
            openapi.Info(
                title="hwx LMS Backend APIs",
                default_version="v1",
                description="This is the API documentation for hwx LMS project APIs",
                terms_of_service="https://www.google.com/policies/terms/",
                contact=openapi.Contact(email="kblualua24@gmail.com"),
                license=openapi.License(name="BSD License"),
            ),
            public=True,
            permission_classes=(
                # permissions.IsAdminUser,
                permissions.AllowAny,
            ),  # 这里只要改成permissions.IsAdminUser，非管理员是无法查看api管理面板的。而且改成了IsAdminUser之后，Swagger会显示403 Forbidden，只有用一个管理员账户登录了Django Admin之后，Swagger才可以正常显示
        )

schema_view = get_swagger_schema_view()

urlpatterns = [
    path(
        "swagger<format>/", schema_view.without_ui(cache_timeout=0), name="schema-json"
    ),
    path("", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    path("admin/", admin.site.urls),
    path("api/v1/", include("api.urls"), name="api_url"),
    path("debug/static/", debug_static_files, name="debug_static"),
]
# 始终服务媒体文件和静态文件（生产环境也需要）
# 这样Django admin的静态文件才能正常工作
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
