from django.http import HttpResponse
from .models import Tour, Step


# Create your views here.

def hello(request):
    tours = Tour.objects.all().values()
    response = []
    for tour in tours:
        tour['steps'] = Step.objects.filter(tour=tour['id']).values()
        response.append(tour)
    return HttpResponse(response)