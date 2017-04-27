from courses.forms import AddCourseForm
from courses.models import *
from .forms import *
from django.contrib.auth.hashers import make_password
from django.contrib.auth.decorators import user_passes_test, login_required
from django.core.urlresolvers import reverse
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from django.shortcuts import render, redirect
from itertools import chain
from django.http import Http404


def home(request):
    context = {
        "title": "eLearning",
    }

    return render(request, "home.html", context)


def about(request):
    context = {
        "title": "About",
    }

    return render(request, "users/about.html", context)

def ourteam(request):
    context = {
        "title": "Our Team",
    }

    return render(request, "ourteam.html", context)



def contact(request):
    contact_form = Contact(request.POST or None)

    context = {
        "title": "Contact",
        "contact_form": contact_form,
    }
    if contact_form.is_valid():
        sender = contact_form.cleaned_data.get("sender")
        subject = contact_form.cleaned_data.get("subject")
        from_email = contact_form.cleaned_data.get("email")
        message = contact_form.cleaned_data.get("message")
        message = 'Sender:  ' + sender + '\nFrom:  ' + from_email + '\n\n' + message
        send_mail(subject, message, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], fail_silently=True)
        success_message = "We appreciate you contacting us, one of our Customer Service colleagues will get back" \
                          " to you within a 24 hours."
        messages.success(request, success_message)
        return redirect(reverse('home'))

    return render(request, "users/contact.html", context)


@login_required
def profile(request):
    if request.user.is_site_admin:
        return redirect(reverse('admin'))

    elif request.user.is_professor:
        return redirect(reverse('professor'))

    return redirect(reverse('student'))


@user_passes_test(lambda user: user.is_site_admin)
def admin(request):
    add_user_form = AddUser(request.POST or None)
    queryset = UserProfile.objects.all()

    search = request.GET.get("search")
    if search:
        queryset = queryset.filter(username__icontains=search)

    context = {
        "title": "Admin",
        "add_user_form": add_user_form,
        "queryset": queryset,

    }

    if add_user_form.is_valid():
        instance = add_user_form.save(commit=False)
        passwd = add_user_form.cleaned_data.get("password")
        instance.password = make_password(password=passwd,
                                          salt='salt', )
        instance.save()
        reverse('profile')

    return render(request, "users/sysadmin_dashboard.html", context)


@user_passes_test(lambda user: user.is_professor)
def professor(request):
    add_course_form = AddCourseForm(request.POST or None)
    queryset_course = Course.objects.filter(user__username=request.user).filter(is_active=True)

    context = {
        "title": "Professor",
        "add_course_form": add_course_form,
        "queryset_course": queryset_course,
    }

    if add_course_form.is_valid():
        course_name = add_course_form.cleaned_data.get("course_name")
        instance = add_course_form.save(commit=False)
        instance.user = request.user
        instance.save()
        return redirect(reverse('professor_course', kwargs={'course_name': course_name}))

    return render(request, "users/professor_dashboard.html", context)


@login_required
def student(request):
    queryset = Course.objects.filter(students=request.user)

    context = {
        "queryset": queryset,
        "title": request.user,
    }

    return render(request, "users/student_dashboard.html", context)


@user_passes_test(lambda user: user.is_site_admin)
def update_user(request, username):
    user = UserProfile.objects.get(username=username)
    data_dict = {'username': user.username, 'email': user.email}
    update_user_form = EditUser(initial=data_dict, instance=user)

    path = request.path.split('/')[1]
    redirect_path = path
    path = path.title()

    context = {
        "title": "Edit",
        "update_user_form": update_user_form,
        "path": path,
        "redirect_path": redirect_path,
    }

    if request.POST:
        user_form = EditUser(request.POST, instance=user)

        if user_form.is_valid():
            instance = user_form.save(commit=False)
            passwd = user_form.cleaned_data.get("password")

            if passwd:
                instance.password = make_password(password=passwd,
                                                  salt='salt', )
            instance.save()

            return redirect(reverse('profile'))

    return render(request, "users/edit_user.html", context)


@user_passes_test(lambda user: user.is_site_admin)
def delete_user(request, username):
    user = UserProfile.objects.get(username=username)
    user.delete()
    return redirect(reverse('profile'))


@login_required
def course_homepage(request, course_name):
    chapter_list = Chapter.objects.filter(course__course_name=course_name)
    if chapter_list:
        course = Course.objects.get(course_name=course_name)
        chapter_list = Chapter.objects.filter(course=course)
        user = request.user

        if user in course.students.all() or user.is_professor or user.is_site_admin or course.for_everybody:
            context = {
                "course_name": course_name,
                "chapter_list": chapter_list,
                "title": course_name ,
            }

            return render(request, "users/student_courses.html", context)

        else:
            raise Http404
    else:
        warning_message = "Currently there are no chapters for %s "%(course_name)
        messages.warning(request, warning_message)
        return redirect(reverse('courses'))


@login_required
def student_course(request, course_name, slug=None):
    course = Course.objects.get(course_name=course_name)
    chapter_list = Chapter.objects.filter(course=course)
    chapter = Chapter.objects.get(course__course_name=course_name, slug=slug)
    text = TextBlock.objects.filter(text_block_fk=chapter).values('lesson_name','date_created','id')
    videos = YTLink.objects.filter(yt_link_fk=chapter)
    files = FileUpload.objects.filter(file_fk=chapter)
    user = request.user


    if user in course.students.all() or user.is_professor or user.is_site_admin or course.for_everybody:
        videos = sorted(videos,key=lambda instance: instance.date_created, reverse=True)
        files = sorted(files,key=lambda instance: instance.date_created, reverse=True)
        text = sorted(text,key=lambda instance: instance.get('date_created'), reverse=True)

        context = {
            "course_name": course_name,
            "chapter_list": chapter_list,
            "chapter_name": chapter.chapter_name,
            "slug": chapter.slug,
            "text": text,
            "files": files,
            "videos": videos,
            "title": course_name + ' : ' + chapter.chapter_name,
        }
        if len(text) +len(files) +len(videos)  == 0:
            warning_message = "Currently there are no materials for %s "%(chapter.chapter_name)
            messages.warning(request, warning_message)
            return redirect(reverse('course_homepage', kwargs={"course_name":course_name}))

        return render(request, "users/student_chapter.html", context)

    else:
        raise Http404


@login_required
def student_lesson(request, course_name, slug=None, txt_id = None):
    course = Course.objects.get(course_name=course_name)
    chapter = Chapter.objects.get(course__course_name=course_name, slug=slug)
    text = TextBlock.objects.get(id=txt_id)
    user = request.user

    if user in course.students.all() or user.is_professor or user.is_site_admin or course.for_everybody:

        context = {
            "course_name": course_name,
            "chapter_name": chapter.chapter_name,
            "slug": chapter.slug,
            "text": text,
            "title": course_name + ' : ' + chapter.chapter_name + ' : ' + text.lesson_name,
        }
        return render(request, "users/student_lesson.html", context)

    else:
        raise Http404



