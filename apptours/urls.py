from django.conf.urls import url
from . import views as apptours_views

urlpatterns = [
    url(r'^hello$', apptours_views.hello, name='apptours_hello'),

]
