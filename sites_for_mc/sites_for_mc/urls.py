"""sites_for_mc URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
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
from django.urls import path, re_path
from signin.views import home_view
from dashboard.views import dash_view
from creator.views import creator_view, page_view, editor_view
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view, name='home'),
    path('dashboard/', dash_view, name='dashboard'),
    path('creator/', creator_view, name='creator'),
    path('editor/<str:site_name>/', editor_view),
    path('creator/<str:site_name>/', page_view)
     
]

urlpatterns += staticfiles_urlpatterns()