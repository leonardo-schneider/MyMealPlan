from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

# Defina o schema_view antes de usá-lo:
schema_view = get_schema_view(
    openapi.Info(
        title="My Meal Plan API",
        default_version='v1',
        description="Documentação interativa da API do sistema Meal Plan",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contato@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    # Endpoints de documentação:
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', 
            schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), 
         name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), 
         name='schema-redoc'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)