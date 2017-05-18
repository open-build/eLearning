from django.db import models

def attachment_path(filename):
    # defining the unique path to the blog image
    import os
    from django.conf import settings
    os.umask(0)
    path = 'blog/attachments/%s'
    att_path = os.path.join(settings.MEDIA_ROOT, path)
    if settings.DEFAULT_FILE_STORAGE == "django.core.files.storage.FileSystemStorage":
        if not os.path.exists(att_path):
            os.makedirs(att_path, 0o777)
    return os.path.join(path, filename)

class BlogPost(models.Model):
    title = models.CharField("Title", max_length=300,)
    details = models.TextField("Details", null=True, blank=True)
    image =  models.ImageField(upload_to="/openbuild/elearning/media/blog/", null=True, blank=True)
    date_created = models.DateTimeField(null=True, blank=True)
    created_by = models.CharField("author", default="OpenBuild Team", max_length=100,)


class BlogComment(models.Model):
	blog_id = models.ForeignKey(BlogPost,related_name=('blog_comments'),)
	comment = models.CharField("Comment", max_length=500,)
	created_by = models.CharField("Sender", default="Anonymous", max_length=100,)
	sender_email = models.EmailField("Sender email ", blank=True, null=True,)
	posted_date = models.DateTimeField(null=True, blank=True)

 
class Response(models.Model):
	blog_id = models.ForeignKey(BlogPost,related_name=('response'),)
	comment_id = models.ForeignKey(BlogComment,related_name=('reply'),)
	reply = models.CharField("Response", max_length=500,)
	created_by = models.CharField("Sender", default="Anonymous", max_length=100,)
	sender_email = models.EmailField("Sender email ", blank=True, null=True,)
	posted_date = models.DateTimeField(null=True, blank=True)