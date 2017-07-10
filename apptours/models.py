from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Tour(models.Model):
    tour_name = models.CharField(max_length=50,unique=True)
    status = models.CharField(null=False, default="complete",max_length=10)
    tour_image = models.TextField(null=False, default="")
    tour_groups = models.CharField(default="users professors admin ",max_length=25)
    tour_create_date = models.DateTimeField()

class Step(models.Model):
    element = models.CharField(max_length=50)
    placement = models.CharField(max_length=50)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    content = models.CharField(max_length=500)
    path = models.CharField(max_length=50)
    order = models.IntegerField()


def transform_tour_groups_field(input):
    if type(input) == dict:
        return "" \
            + ("user " if input.get("user") else "") \
            + ("professor " if input.get("professor") else "") \
            + ("admin " if input.get("admin") else "")
    elif type(input) == str:
        return {
            "user": True if "user" in input else False,
            "professor": True if "professor" in input else False,
            "admin": True if "admin" in input else False,
        }
    else:
        return None