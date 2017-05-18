from models import *
from .forms import *
from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from datetime import datetime
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect
from PIL import Image

def blog(request,id):
    if request.method == 'POST':
        title = request.POST.get("title")
        details = request.POST.get("details")
        image = {}
        if request.FILES:
            image = request.FILES['image']
        print "Anne"
        print image
        created_by = request.user
        date_created = datetime.now()
        post = BlogPost(title=title, details=details, image=image, date_created=date_created, created_by = created_by)
        post.save()
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))  
    
    # latest posts
    blog_post = BlogPost.objects.all().prefetch_related('blog_comments','response').order_by("date_created")
    
    recent_post = {}
    if int(id) == 0:
        recent_post =  blog_post.latest("date_created")
    else:
        recent_post =  blog_post.get(id=id)

    # print "Anne"
    # print image 
    # show_image = Image.open(image)
    # search blogs
    # image = recent_post.image
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

    return render(request, "blog.html", context)

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