from django.contrib.auth.signals import user_logged_in
from apptours.models import TourUsers, Tour
from users.models import UserProfile


class app_tour_middleware(object):
    # One-time configuration and initialization.

    def process_response(self, request, response):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        # Code to be executed for each request/response after
        # the view is called.
        if hasattr(request,'user') and request.user.is_authenticated():
            if request.COOKIES.get('show_app_tour',False):
                response.set_cookie("show_app_tour", False)
            else:
                response.set_cookie("show_app_tour", True)
        else:
            if request.COOKIES.get('show_app_tour',False):
                response.delete_cookie('show_app_tour')
        return response




def connect_user_to_apptours(sender, user, request, **kwargs):
    all_tour_ids = [val.get("id") for val in Tour.objects.values("id")]
    all_user_tour_ids = [tour_users.tour_id for tour_users in TourUsers.objects.filter(user__id=user.id)]
    #all_missing_tour_ids_for_user
    missing_tour_ids = list(set(all_tour_ids) - set(all_user_tour_ids))
    print("missing app tour ids for user with id %s:\n%s"%(user.id,missing_tour_ids))
    for tour_id in missing_tour_ids:
        tour = Tour.objects.get(id=tour_id)
        user = UserProfile.objects.get(id=user.id)
        print("making TourUsers object with user id %s and tour id %s"%(user.id,tour.id))
        tour_users = TourUsers(user=user, tour=tour)
        tour_users.save()


user_logged_in.connect(connect_user_to_apptours)
