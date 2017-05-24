from models import *
from .forms import *
from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from django.core.mail import send_mail
from django.template.loader import render_to_string
from datetime import datetime
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect

def blog(request,id):
    send_to = []
    if request.method == 'POST':
        title = request.POST.get("title")
        details = request.POST.get("details")
        created_by = request.user
        date_created = datetime.now()
        post = BlogPost(title=title, details=details, date_created=date_created, created_by = created_by)
        post.save()
        file_attachment(request, post)
        subscribers = BlogSubscription.objects.all()
        for subscriber in subscribers:
            send_to.append(subscriber.email)   
        email(post,send_to) 
           
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))  
    
    # latest posts
    blog_post = BlogPost.objects.all().prefetch_related('blog_comments','response').order_by("date_created")
    
    recent_post = {}

    if blog_post:

        if int(id) == 0:
            recent_post =  blog_post.latest("date_created")

        else:
            recent_post =  blog_post.get(id=id)

    # search blogs
    key_word = request.GET.get('search', None)

    if key_word:
        query_list = key_word.split()
        for q in query_list:

            qset = (
                Q(id__icontains=q) |
                Q(title__icontains=q) |
                Q(details__icontains=q) |
                Q(created_by__icontains=q) |
                Q(date_created__icontains=q) 
            )

            blog_post = blog_post.filter(qset)
    # end search  

    querydict = request.GET.copy()

    context = {
        "title": "Blog",
        "query_string": querydict.urlencode(),
        "query": request.GET.get('search'),
        "num_blog": len(blog_post),
        "recent_post":recent_post,
        "blog_post": blog_post,

    } 

    return render(request, "blog/blog.html", context)

def blog_notification(request,id):
    recent_post = BlogPost.objects.all().prefetch_related('blog_comments','response').latest("date_created")
    

    context = {
        "title": "New Post",
        "recent_post":recent_post,

    } 

    return render(request, "blog/subscription.html", context)

def post_comment(request,blog_id):
    blog = get_object_or_404(BlogPost, id=blog_id)

    if request.method == 'POST':
        blog_id = blog
        comment = request.POST.get("comment")
        created_by = request.POST.get("name")
        sender_email = request.POST.get("email")
        posted_date = datetime.now()
        comment = BlogComment(blog_id=blog_id, comment=comment, created_by=created_by, sender_email=sender_email,posted_date=posted_date)
        comment.save()
        return HttpResponseRedirect(request.META.get('HTTP_REFERER')) 

def comment_reply(request,blog_id,comment_id):
    blog = get_object_or_404(BlogPost, id=blog_id)
    comment = get_object_or_404(BlogComment, id=comment_id)

    if request.method == 'POST':
        blog_id = blog
        comment_id = comment
        reply = request.POST.get("reply")
        created_by = request.POST.get("name")
        sender_email = request.POST.get("email")
        posted_date = datetime.now()
        reply = Response(blog_id=blog_id, comment_id=comment_id, reply=reply, created_by=created_by, sender_email=sender_email,posted_date=posted_date)
        reply.save()
        return HttpResponseRedirect(request.META.get('HTTP_REFERER')) 

def file_attachment(request, blog):
    files = []
    if request.FILES:
        import mimetypes, os
        for file in request.FILES.getlist('image'):
            filename = file.name.encode('ascii', 'ignore')
            a = BlogAttachment(
                blog=blog,
                filename=filename,
                mime_type=mimetypes.guess_type(filename)[0] or 'application/octet-stream',
                size=file.size,
                )
            a.file.save(filename, file, save=False)
            a.save()

            if file.size < getattr(settings, 'MAX_EMAIL_ATTACHMENT_SIZE', 512000):
                # Only files smaller than 512kb (or as defined in
                #settings.MAX_EMAIL_ATTACHMENT_SIZE) are sent via email.
                try:
                    files.append([a.filename, a.file])
                except NotImplementedError:
                    pass
    return

def subscribe(request,blog_id):
    if request.method == 'POST':
        email =  request.POST.get("subscribe")
        subscribe = BlogSubscription(email=email)
        subscribe.save()
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

# send post to subscribers    
def email(blog,send_to):
    text_message = render_to_string('blog/email/subscription.txt',{'blog':blog})
    html_message = render_to_string('blog/email/subscription.html',{'blog':blog})

    send_mail('OpenBuild New Post',text_message,'OpenBuild Team',[send_to],fail_silently=False,html_message=html_message)

    