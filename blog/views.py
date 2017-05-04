from models import *
from .forms import *
from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from datetime import datetime


def blog(request):
    if request.method == 'POST':
        title = request.POST.get("title")
        print "Annie"
        print title
        details = request.POST.get("details")
        date_created = datetime.now()
        post = BlogPost(title=title, details=details, date_created=date_created,)
        print "Annie"
        print post
        post.save()
        return redirect(reverse('blog')) 
    else:
        add_post_form = Blog()


    blog_post = BlogPost.objects.all()
    context = {
        "title": "Blog",
        "add_post_form": add_post_form,
        "blog_post": blog_post,

    } 

    return render(request, "blog.html", context)