from django.db import models

class BlogPost(models.Model):
    title = models.CharField("Title", max_length=300,)
    details = models.TextField("Details", null=True, blank=True)
    date_created = models.DateTimeField(null=True, blank=True)
    created_by = models.CharField("author", default="OpenBuild Team", max_length=100,)