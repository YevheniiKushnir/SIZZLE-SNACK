"""
URL configuration for store project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from .utils import get_admin_endpoint
from .views import StopServerView

admin.site.site_header = 'Sizzle Snack Administration'

urlpatterns = [
    path(get_admin_endpoint(), admin.site.urls),
    path("api/", include("products.urls")),
    path("api/", include("orders.urls")),
    path("api/", include("users.urls")),
    path("stop/", StopServerView.as_view()),
]

if settings.DEBUG:
    urlpatterns.extend(
        static(settings.STATIC_URL, document_root=settings.STATIC_ROOT))
