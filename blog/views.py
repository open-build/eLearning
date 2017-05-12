from models import *
from .forms import *
from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from datetime import datetime


def blog(request,id):
    if request.method == 'POST':
        title = request.POST.get("title")
        details = request.POST.get("details")
        created_by = request.user
        date_created = datetime.now()
        post = BlogPost(title=title, details=details, date_created=date_created, created_by = created_by)
        post.save()
        return redirect(reverse('blog')) 
    

    recent_post = {}
    if int(id) == 0:
        recent_post =  BlogPost.objects.all().order_by("date_created").latest("date_created")
    else:
        recent_post =  BlogPost.objects.get(id=id)
        

    context = {
        "title": "Blog",
        "recent_post":recent_post,
        "blog_post": BlogPost.objects.all().order_by("date_created"),

    } 

    return render(request, "blog.html", context)