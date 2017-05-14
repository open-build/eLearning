from django.db import models

class BlogPost(models.Model):
    title = models.CharField("Title", max_length=300,)
    details = models.TextField("Details", null=True, blank=True)
    date_created = models.DateTimeField(null=True, blank=True)
    created_by = models.CharField("author", default="OpenBuild Team", max_length=100,)

class BlogComment(models.Model):
	blog_id = models.ForeignKey(BlogPost,related_name=('blog_comments'),)
	comment = models.CharField("Comment", max_length=500,)
	created_by = models.CharField("Sender", default="Anonymous", max_length=100,)
	sender_email = models.EmailField("Sender email ", blank=True, null=True,)
	posted_date = models.DateTimeField(null=True, blank=True)