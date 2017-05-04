from django.db import models

class BlogPost(models.Model):
    title = models.CharField("Title", max_length=200,)
    details = models.TextField("Details", null=True, blank=True)
    date_created = models.DateTimeField(null=True, blank=True)