from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import user_passes_test, login_required
from .forms import *
from users.views import professor


@login_required
def courses(request):
    if request.user.is_professor or request.user.is_site_admin:
        queryset = Course.objects.filter(is_active=True)
    else:
        queryset = Course.objects.filter(for_everybody=True) | Course.objects.filter(students=request.user)

    context = {
        "title": "Courses",
        "queryset": queryset,
    }

    return render(request, "users/course.html", context)


@user_passes_test(lambda user: user.is_professor)
def course(request, course_name=None):
    add_chapter_form = AddChapterForm(request.POST or None)
    queryset_chapter = Chapter.objects.filter(course__course_name=course_name).filter(is_active=True)

    context = {
        "title": course_name,
        "add_chapter_form": add_chapter_form,
        "queryset_chapter": queryset_chapter,
        "course_name": course_name,
        "path": "Profile",
        "redirect_path": "profile",
    }

    if add_chapter_form.is_valid():
        instance = add_chapter_form.save(commit=False)
        instance.course = Course.objects.get(course_name=course_name)
        instance.save()
        return redirect(reverse('professor_course', kwargs={'course_name': course_name}))

    return professor(request,course_name=course_name)


@user_passes_test(lambda user: user.is_professor)
def chapter(request, course_name=None, slug=None):
    place = Chapter.objects.get(course__course_name=course_name, slug=slug, is_active=True)

    add_link_form = AddLinkForm(request.POST or None)
    add_txt_form = AddTxtForm(request.POST or None)
    file_upload_form = FileUploadForm(request.POST or None, request.FILES or None)

    queryset_txt_block = TextBlock.objects.filter(text_block_fk__id=place.id).filter(is_active=True)
    queryset_yt_link = YTLink.objects.filter(yt_link_fk__id=place.id).filter(is_active=True)
    queryset_files = FileUpload.objects.filter(file_fk__id=place.id).filter(is_active=True)

    context = {
        "title": place.chapter_name,
        "course_name": course_name,
        "slug": slug,
        "add_link_form": add_link_form,
        "add_txt_form": add_txt_form,
        "queryset_yt_link": queryset_yt_link,
        "queryset_txt_block": queryset_txt_block,
        "queryset_files": queryset_files,
        "path": "Profile",
        "redirect_path": "profile",
        "file_upload_form": file_upload_form,
    }

    if add_link_form.is_valid() and 'add_link' in request.POST:
        instance = add_link_form.save(commit=False)
        instance.yt_link_fk = Chapter.objects.get(id=place.id)

        key = add_link_form.cleaned_data.get("link")

        if 'embed' not in key and 'youtube' in key:
            key = key.split('=')[1]
            instance.link = 'https://www.youtube.com/embed/' + key

        instance.yt_link_fk = Chapter.objects.get(id=place.id)
        instance.save()
        return redirect(reverse('chapter', kwargs={'course_name': course_name,
                                                   'slug': slug}))

    if add_txt_form.is_valid() and 'add_text' in request.POST:
        instance = add_txt_form.save(commit=False)
        instance.text_block_fk = Chapter.objects.get(id=place.id)
        instance.save()
        return redirect(reverse('chapter', kwargs={'course_name': course_name,
                                                   'slug': slug}))

    if file_upload_form.is_valid() and 'add_file' in request.POST:
        instance = file_upload_form.save(commit=False)
        instance.file_fk = Chapter.objects.get(id=place.id)
        instance.save()
        return redirect(reverse('chapter', kwargs={'course_name': course_name,
                                                   'slug': slug}))

    return render(request, "courses/chapter.html", context)


@user_passes_test(lambda user: user.is_professor)
def delete_course(request, course_name=None):
    instance = Course.objects.get(course_name=course_name)
    instance.is_active = False
    instance.save()
    return HttpResponseRedirect(reverse('profile'))


@user_passes_test(lambda user: user.is_professor)
def delete_chapter(request, course_name=None, slug=None):
    instance = Chapter.objects.get(slug=slug)
    instance.is_active = False
    instance.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@user_passes_test(lambda user: user.is_professor)
def delete_yt_link(request, yt_id=None):
    instance = YTLink.objects.get(id=yt_id)
    instance.is_active = False
    instance.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@user_passes_test(lambda user: user.is_professor)
def delete_text_block(request, txt_id=None):
    instance = TextBlock.objects.get(id=txt_id)
    instance.is_active = False
    instance.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@user_passes_test(lambda user: user.is_professor)
def delete_file(request, file_id=None):
    instance = FileUpload.objects.get(id=file_id)
    instance.is_active = False
    instance.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@user_passes_test(lambda user: user.is_professor)
def update_course(request, course_name=None):
    instance = Course.objects.get(course_name=course_name, is_active=True)
    
    if request.method == 'POST':
        new_name = request.POST.get('new_course')
        course = Course(id=instance.id, course_name=new_name)
        course.save(update_fields=['course_name'])

    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@user_passes_test(lambda user: user.is_professor)
def update_chapter(request, course_name=None, slug=None):
    instance = Chapter.objects.get(slug=slug, is_active=True)


    if request.method == 'POST':
        title = request.POST.get('new_chapter')
        chapter = Chapter(id=instance.id, chapter_name=title)
        chapter.save(update_fields=['chapter_name'])

    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
        


@user_passes_test(lambda user: user.is_professor)
def update_yt_link(request, course_name=None, slug=None, yt_id=None):
    instance = YTLink.objects.get(id=yt_id, is_active=True)
    update_link_form = EditYTLinkForm(request.POST or None, instance=instance)

    context = {
        "title": "Edit",
        "course_name": course_name,
        "yt_id": yt_id,
        "slug": slug,
        "form": update_link_form,
        "path": "Profile",
        "redirect_path": "profile",
    }

    if update_link_form.is_valid():
        update_link_form.save()
        return redirect(reverse('chapter', kwargs={'course_name': course_name,
                                                   "slug": slug}))

    return render(request, "courses/edit.html", context)


@user_passes_test(lambda user: user.is_professor)
def update_text_block(request, course_name=None, slug=None, txt_id=None):
    instance = TextBlock.objects.get(id=txt_id, is_active=True)
    update_txt_form = EditTxtForm(request.POST or None, instance=instance)

    context = {
        "title": "Edit",
        "course_name": course_name,
        "text_id": txt_id,
        "form": update_txt_form,
        "slug": slug,
        "path": "Profile",
        "redirect_path": "profile",
    }

    if update_txt_form.is_valid():
        update_txt_form.save()
        return redirect(reverse('chapter', kwargs={'course_name': course_name,
                                                   "slug": slug}))

    return render(request, "courses/edit.html", context)


@user_passes_test(lambda user: user.is_professor)
def list_students(request, course_name=None):
    course = Course.objects.get(course_name=course_name)
    added_students = UserProfile.objects.filter(students_to_course=course)
    excluded_students = UserProfile.objects.exclude(students_to_course=course).filter(is_professor=False).filter(
        is_site_admin=False)

    query_first = request.GET.get("q1")
    if query_first:
        excluded_students = excluded_students.filter(username__icontains=query_first)

    query_second = request.GET.get("q2")
    if query_second:
        added_students = added_students.filter(username__icontains=query_second)

    path = request.path.split('/')[1]
    redirect_path = path
    path = path.title()

    context = {
        "title": "Edit students in course " + course_name,
        "excluded_students": excluded_students,
        "added_students": added_students,
        "course_name": course_name,
        "path": path,
        "redirect_path": redirect_path,
    }

    return render(request, "courses/add_students.html", context)


def add_students(request, student_id, course_name=None):
    student = UserProfile.objects.get(id=student_id)
    course = Course.objects.get(course_name=course_name)
    course.students.add(student)
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@user_passes_test(lambda user: user.is_professor)
def remove_students(request, student_id, course_name=None):
    student = UserProfile.objects.get(id=student_id)
    course = Course.objects.get(course_name=course_name)
    course.students.remove(student)
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@user_passes_test(lambda user: user.is_professor)
def admin_courses(request, slug = None):
    queryset = Course.objects.all()
    search = request.GET.get("search")

    if search:
        queryset = queryset.filter(course_name__icontains=search)

    context = {
        "title": "Admin",
        "queryset": queryset,
        "slug": slug,
    }

    return render(request, "courses/admin_courses.html", context)

@user_passes_test(lambda user: user.is_site_admin)
def admin_course_delete(request, course_name=None):
    instance = Course.objects.get(course_name=course_name)
    instance.delete()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@user_passes_test(lambda user: user.is_site_admin)
def admin_course_reactivate(request, course_name=None):
    instance = Course.objects.get(course_name=course_name)
    instance.is_active = True
    instance.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@user_passes_test(lambda user: user.is_site_admin)
def admin_chapters(request, course_name=None):
    queryset = Chapter.objects.filter(course__course_name=course_name)
    search = request.GET.get("search")
    if search:
        queryset = queryset.filter(chapter_name__icontains=search)

    context = {
        "title": "Admin",
        "queryset": queryset,
    }

    return render(request, "courses/admin_chapters.html", context)

@user_passes_test(lambda user: user.is_site_admin)
def admin_chapter_delete(request, chapter_name=None):
    instance = Chapter.objects.get(chapter_name=chapter_name)
    instance.delete()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@user_passes_test(lambda user: user.is_site_admin)
def admin_chapter_reactivate(request, chapter_name=None):
    instance = Chapter.objects.get(chapter_name=chapter_name)
    instance.is_active = True
    instance.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@user_passes_test(lambda user: user.is_site_admin)
def admin_chapter_materials(request, chapter_name=None):
    chapter = Chapter.objects.get(chapter_name=chapter_name)
    queryset_txt_block = TextBlock.objects.filter(text_block_fk__id=chapter.id)
    queryset_yt_link = YTLink.objects.filter(yt_link_fk__id=chapter.id)
    queryset_files = FileUpload.objects.filter(file_fk__id=chapter.id)

    search = request.GET.get("search")
    if search:
        queryset_txt_block = queryset_txt_block.filter(lesson__icontains=search)
        queryset_yt_link = queryset_yt_link.filter(link__icontains=search)
        queryset_files = queryset_files.filter(file__icontains=search)

    context = {
        "title": chapter.chapter_name,
        "queryset_yt_link": queryset_yt_link,
        "queryset_txt_block": queryset_txt_block,
        "queryset_files": queryset_files,
    }

    return render(request, "courses/admin_chapter_materials.html", context)

@user_passes_test(lambda user: user.is_site_admin)
def admin_link_reactivate(request, yt_id=None):
    instance = YTLink.objects.get(id=yt_id)
    instance.is_active = True
    instance.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@user_passes_test(lambda user: user.is_site_admin)
def admin_link_delete(request, yt_id=None):
    instance = YTLink.objects.get(id=yt_id)
    instance.delete()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@user_passes_test(lambda user: user.is_site_admin)
def admin_txt_reactivate(request, txt_id=None):
    instance = TextBlock.objects.get(id=txt_id)
    instance.is_active = True
    instance.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@user_passes_test(lambda user: user.is_site_admin)
def admin_txt_delete(request, txt_id=None):
    instance = TextBlock.objects.get(id=txt_id)
    instance.delete()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@user_passes_test(lambda user: user.is_site_admin)
def admin_file_reactivate(request, file_id=None):
    instance = FileUpload.objects.get(id=file_id)
    instance.is_active = True
    instance.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@user_passes_test(lambda user: user.is_site_admin)
def admin_file_delete(request, file_id=None):
    instance = FileUpload.objects.get(id=file_id)
    instance.delete()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


