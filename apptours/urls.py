from django.conf.urls import url
from . import views as apptours_views

urlpatterns = [
    url(r'^hello$', apptours_views.hello, name='apptours_hello'),
    url(r'^create_apptour', apptours_views.create_apptour, name='create_apptour'),
    url(r'^create_tour', apptours_views.create_tour, name='create_tour'),

]
