from django.db import models
from django.utils.translation import ugettext as _
from django.conf import settings

class BlogPost(models.Model):
    title = models.CharField("Title", max_length=300,)
    details = models.TextField("Details", null=True, blank=True)
    date_created = models.DateTimeField(null=True, blank=True)
    created_by = models.CharField("author", default="OpenBuild Team", max_length=100,)


def attachment_path(instance, filename):
    """
    Provide a file path that will help prevent files being overwritten, by
    putting attachments in a folder off attachments for ticket/followup_id/.
    """
    import os
    from django.conf import settings
    os.umask(0)
    path = 'blog/attachments/%s' % (instance.blog.id )
    att_path = os.path.join(settings.MEDIA_ROOT, path)
    if settings.DEFAULT_FILE_STORAGE == "django.core.files.storage.FileSystemStorage":
        if not os.path.exists(att_path):
            os.makedirs(att_path, 0o777)
    return os.path.join(path, filename)

class BlogAttachment(models.Model):
    blog = models.ForeignKey(BlogPost,verbose_name=('blog'),)
    file = models.FileField(_('File'),upload_to=attachment_path, max_length=1000,)
    filename = models.CharField(_('Filename'),max_length=1000,)
    mime_type = models.CharField(_('MIME Type'),max_length=255,)
    size = models.IntegerField(_('Size'),help_text=_('Size of this file in bytes'),)

    def get_upload_to(self, field_attname):
        """ Get upload_to path specific to this item """
        if not self.id:
            return u''
        return u'blog/attachments/%s' % (
            
            self.task.id
            )

    def __unicode__(self):
        return u'%s' % self.filename

    class Meta:
        ordering = ['filename',]
        verbose_name = _('Attachment')
        verbose_name_plural = _('Attachments')


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

class BlogSubscription(models.Model):
    email = models.EmailField("subscriber email ", null=True,)
