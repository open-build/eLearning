from django.http import HttpResponse
from .models import Tour, Step
import json
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import user_passes_test, login_required
from django.core.urlresolvers import reverse


# Create your views here.

def hello(request):
    tours = Tour.objects.all().values()
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
    return render(request, "create_app_tour.html")

@user_passes_test(lambda user: user.is_site_admin)
def create_tour(request):
    if request.method == 'POST':
        post_text = json.loads(request.POST.get('app_tour'))
        tour = Tour(tour_name=post_text.get("tour").get("tour_name"))
        tour.save()
        for step in post_text.get("steps"):
            step = Step(placement=step.get('placement'),title=step.get('title'),
                        element=step.get('element'),content=step.get('content'),
                        path=step.get('path'),order=step.get('order'),
                        tour=tour)
            step.save()
    return redirect(reverse('create_apptour'))

