from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.shortcuts import render, redirect



class UserProfile(AbstractUser):
    is_professor = models.BooleanField(default=False)
    is_site_admin = models.BooleanField(default=False)

from django.contrib.auth.signals import user_logged_in
from django.template import RequestContext


def do_stuff(sender, user, request, **kwargs):
    print('hello world')
    response = render(request, "users/contact.html")
    response.set_cookie('cookie_name', 'cookie_value')


user_logged_in.connect(do_stuff)

class simple_middleware(object):
    # One-time configuration and initialization.

    def process_response(self, request, response):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        # Code to be executed for each request/response after
        # the view is called.
        print("setting cookie")
        if hasattr(request, 'user'):
            if request.user.is_authenticated() and ( not request.COOKIES.get('user') or request.COOKIES.get('user') != 'Hello Cookie'):
                response.set_cookie("user", 'Hello Cookie')
            else:
                # else if if no user and cookie remove user cookie, logout
                response.set_cookie("user", 'Bye Cookie')
        return response

