from django.http import HttpResponse
from .models import Tour, Step
import json
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import user_passes_test, login_required
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect



# Create your views here.

@login_required
def get_tours(request):
    tours = Tour.objects.filter(status="complete").values()
    response = []
    for tour in tours:
        temp_tour = {k:v for k,v in tour.items()}
        temp_steps = []
        tour['steps'] = Step.objects.filter(tour=tour['id']).values()
        for temp_step in tour['steps']:
            temp_steps.append({k:v for k,v in temp_step.items()})
        temp_tour['steps'] =  temp_steps
        response.append(temp_tour)
    return HttpResponse(json.dumps(response))

@user_passes_test(lambda user: user.is_site_admin)
def create_apptour(request):
    return render(request, "app_tour/create_app_tour.html")

@user_passes_test(lambda user: user.is_site_admin)
def create_tour(request):
    if request.method == 'POST':
        post_text = json.loads(request.POST.get('app_tour'))
        if post_text.get("tour").get("id") is not None:
            print(post_text)
            print("put")
            tour = Tour(tour_name=post_text.get("tour").get("tour_name"),
                        id=post_text.get("tour").get("id"),
                        status=post_text.get("tour").get("status"))
            tour.save(force_update=True)
            Step.objects.filter(tour__id=post_text.get("tour").get("id")).delete()
            for step in post_text.get("steps"):
                step = Step(placement=step.get('placement'), title=step.get('title'),
                            element=step.get('element'), content=step.get('content'),
                            path=step.get('path'), order=step.get('order'),
                            tour=tour)
                step.save(force_insert=True)
        else:
            print("post")
            tour = Tour(tour_name=post_text.get("tour").get("tour_name"),
                        status=post_text.get("tour").get("status"))
            tour.save(force_insert=True)
            for step in post_text.get("steps"):
                step = Step(placement=step.get('placement'),title=step.get('title'),
                            element=step.get('element'),content=step.get('content'),
                            path=step.get('path'),order=step.get('order'),
                            tour=tour)
                step.save(force_insert=True)
        return redirect(reverse('app_tour/create_apptour'))

@user_passes_test(lambda user: user.is_site_admin)
def view_tours(request):
    tours = Tour.objects.filter(status="complete")
    saved_tours = Tour.objects.filter(status="incomplete")
    return render(request, "app_tour/tour_views.html", {"tours":tours,"saved_tours":saved_tours})

@user_passes_test(lambda user: user.is_site_admin)
def delete_tour(request, tour_id=None):
    instance = Tour.objects.get(id=tour_id)
    instance.delete()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@user_passes_test(lambda user: user.is_site_admin)
def update_apptour(request, tour_id=None):
    instance = Tour.objects.get(id=tour_id)
    return render(request, "app_tour/create_app_tour.html", {"instance":instance})



