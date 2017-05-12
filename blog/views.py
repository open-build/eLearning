from models import *
from .forms import *
from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from datetime import datetime
from django.db.models import Q


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

    # most recent posts
    blog_post = BlogPost.objects.all().order_by("date_created")

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

    return render(request, "blog.html", context)
