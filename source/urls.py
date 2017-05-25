"""eLearning URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from users import views as user_views
from registration.backends.default.views import RegistrationView
from users.forms import AddUser

urlpatterns = [
    url(r'^$', user_views.home, name='home'),
    url(r'^ourteam/$', user_views.ourteam, name='ourteam'),
    url(r'^about/$', user_views.about, name='about'),
    url(r'^contact/$', user_views.contact, name='contact'),
    url(r'^logout_view/$', user_views.logout_view, name='logout_view'),

    url(r'^admin/', admin.site.urls),
    url(r'^courses/', include('courses.urls')),
    url(r'^forum/', include('forum.urls')),
    url(r'^blog/', include('blog.urls')),
    url(r'^profile/', include('users.urls')),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url('', include('social_django.urls', namespace='social')),
]

# Remove this in project deployment
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
