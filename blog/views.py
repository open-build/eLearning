from models import *
from .forms import *
from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from datetime import datetime


def blog(request):
    if request.method == 'POST':
        title = request.POST.get("title")
        details = request.POST.get("details")
        created_by = request.user
        date_created = datetime.now()
        post = BlogPost(title=title, details=details, date_created=date_created, created_by = created_by)
        post.save()
        return redirect(reverse('blog')) 

    print request.GET.get("older")
    
    add_post_form = Blog()

    recent_post = {}
    blog_post = BlogPost.objects.all().order_by("date_created")
    if blog_post:
        recent_post = blog_post.latest("date_created")

    context = {
        "title": "Blog",
        "add_post_form": add_post_form,
        "recent_post":recent_post,
        "blog_post": blog_post,

    } 

    return render(request, "blog.html", context)