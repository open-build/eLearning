from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Tour(models.Model):
    tour_name = models.CharField(max_length=50,unique=True)
    status = models.CharField(null=False, default="complete",max_length=10)

class Step(models.Model):
    element = models.CharField(max_length=50)
    placement = models.CharField(max_length=50)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    content = models.CharField(max_length=500)
    path = models.CharField(max_length=50)
    order = models.IntegerField()
