from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Tour(models.Model):
    tour_name = models.CharField(max_length=50,unique=True)
    status = models.CharField(null=False, default="complete",max_length=10)
    tour_image = models.TextField(null=False, default="")
    tour_groups = models.IntegerField(default=7)

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
        return (1 if input.get("user") else 0) \
            + (2 if input.get("professor") else 0) \
            + (4 if input.get("admin") else 0)
    elif type(input) == int:
        return {
            "user": True if input in [1,3,5,7] else False,
            "professor": True if input in [2,3,6,7] else False,
            "admin": True if input in [4,5,6,7] else False,
        }
    else:
        return None