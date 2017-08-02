from django.conf.urls import url
from . import views as apptours_views

urlpatterns = [
    url(r'^get_tours$', apptours_views.get_tours, name='get_tours'),
    url(r'^mark_tour_as_visited/(\d+)/$', apptours_views.mark_tour_as_visited, name='mark_tour_as_visited'),
    url(r'^create_apptour', apptours_views.create_apptour, name='create_apptour'),
    url(r'^create_tour', apptours_views.create_tour, name='create_tour'),
    url(r'^view_tours', apptours_views.view_tours,name="view_tours"),
    url(r'^delete_tour/(?P<tour_id>[\d ]+)/$',
        apptours_views.delete_tour, name='delete_tour'),
    url(r'^update_apptour/(?P<tour_id>[\d ]+)/$',
        apptours_views.update_apptour, name='update_apptour'),

]
