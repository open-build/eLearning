from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.views import login

class UserProfile(AbstractUser):
    is_professor = models.BooleanField(default=False)
    is_site_admin = models.BooleanField(default=False)


class app_tour_middleware(object):
    # One-time configuration and initialization.

    def process_response(self, request, response):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        # Code to be executed for each request/response after
        # the view is called.
        print("setting cookie")
        if hasattr(request,'user') and request.user.is_authenticated():
            if request.COOKIES.get('show_app_tour',False):
                response.set_cookie("show_app_tour", False)
            else:
                response.set_cookie("show_app_tour", True)
        else:
            if request.COOKIES.get('show_app_tour',False):
                response.delete_cookie('show_app_tour')
        return response

