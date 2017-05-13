from django.conf.urls import url
from . import views as blog_views

urlpatterns = [
    url(r'^(?P<id>[\w-]+)/$', blog_views.blog, name='blog'),
    url(r'^comment/(?P<blog_id>[\w-]+)/$', blog_views.post_comment, name='comment'),
]
