from django.conf.urls import url
from . import views as blog_views

urlpatterns = [
    url(r'^(?P<id>[\w-]+)/$', blog_views.blog, name='blog'),
]
