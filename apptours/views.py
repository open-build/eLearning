from django.http import HttpResponse
from models import Tour, Step, transform_tour_groups_field, TourUsers
from users.models import UserProfile
import json
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import user_passes_test, login_required
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from datetime import datetime



# Create your views here.


@login_required
def get_tours(request):
    user_type = get_user_type(user=request.user._wrapped)
    tours = Tour.objects.filter(status="complete",tour_groups__contains=user_type).values()
    response = []
    for tour in tours:
        tour["tour_groups"] = transform_tour_groups_field(str(tour["tour_groups"]))
        tour["tour_create_date"] = tour["tour_create_date"].strftime('%Y-%m-%dT%H:%M:%S')
        tour["tour_update_date"] = None if tour.get("tour_update_date") is None \
            else tour["tour_update_date"].strftime('%Y-%m-%dT%H:%M:%S')
        tour["visited"] = tour_visited_by_user(user_id=request.user._wrapped.id,tour_id=tour.get("id"))
        temp_tour = {k:v for k,v in tour.items()}
        temp_steps = []
        tour['steps'] = Step.objects.filter(tour=tour['id']).values()
        for temp_step in tour['steps']:
            temp_steps.append({k:v for k,v in temp_step.items()})
        temp_tour['steps'] =  temp_steps
        response.append(temp_tour)
    #ensure order of first unvisited second create date
    unvisited = list(filter(lambda i: i.get("visited") == False, response))
    unvisited_sorted = sorted(unvisited,key=lambda i: i.get("tour_create_date"), reverse=True)
    visited = list(filter(lambda i: i.get("visited") == True, response))
    visited_sorted = sorted(visited, key=lambda i: i.get("tour_create_date"), reverse=True)
    return HttpResponse(json.dumps(unvisited_sorted + visited_sorted))


def tour_visited_by_user(user_id, tour_id):
    tour_users = TourUsers.objects.filter(tour__id=tour_id,user__id=user_id)
    if len(tour_users)>0:
        return tour_users[0].visited
    else:
        return False


def get_user_type(user):
    if user.is_professor:
        return "professor"
    elif user.is_site_admin:
        return "admin"
    else:
        return "user"


@login_required
def mark_tour_as_visited(request, tour_id):
    user_id = request.user._wrapped.id
    tour_user = TourUsers.objects.filter(tour__id=tour_id,user__id=user_id)[0]
    updated_tour_user = TourUsers(
        id=tour_user.id,
        tour_id=tour_id,
        user_id=user_id,
        visited=True
    )
    updated_tour_user.save(force_update=True)
    response = "tour_user with tour_id %s and user_id %s is marked as viewed"%(tour_id,user_id)
    return HttpResponse(response)


@user_passes_test(lambda user: user.is_site_admin)
def create_apptour(request):
    return render(request, "app_tour/create_app_tour.html")


@user_passes_test(lambda user: user.is_site_admin)
def create_tour(request):
    if request.method == 'POST':
        post_text = json.loads(request.POST.get('app_tour'))
        if post_text.get("tour").get("id") is not None:
            update_existing_apptour(post_text=post_text)
        else:
            create_new_apptour(post_text=post_text)
        return redirect(reverse('create_apptour'))


def update_existing_apptour(post_text):
    #check to se if creating a new apptour or making a previously incomplete(i.e., saved) apptour complete
    existing_tour = Tour.objects.get(id=post_text.get("tour").get("id"))
    if existing_tour.status == "incomplete":
        #creating new tour from existing saved tour
        if post_text.get("tour").get("status") == "incomplete":
            print("saving saved tour")
        else:
            print("creating saved tour")
        tour = Tour(
            tour_name=post_text.get("tour").get("tour_name"),
            id=post_text.get("tour").get("id"),
            status=post_text.get("tour").get("status"),
            tour_description=post_text.get("tour").get("tour_description"),
            tour_groups=transform_tour_groups_field(post_text.get("tour").get("tour_groups")),
            tour_image=post_text.get("tour").get("tour_image"),
            tour_create_date=datetime.now()
        )
        tour.save(force_update=True)
    else:
        #updaing an existing tour
        if post_text.get("tour").get("status") == "incomplete":
            print("saving previously created tour")
            print("warning: the previoius version and the newer version will both be unaccessable to the users at this time")
        else:
            print("updating previously created tour")
        tour = Tour(
            tour_name=post_text.get("tour").get("tour_name"),
            id=post_text.get("tour").get("id"),
            status=post_text.get("tour").get("status"),
            tour_description=post_text.get("tour").get("tour_description"),
            tour_groups=transform_tour_groups_field(post_text.get("tour").get("tour_groups")),
            tour_image=post_text.get("tour").get("tour_image"),
            tour_create_date=existing_tour.tour_create_date,
            tour_update_date=datetime.now()
        )
        tour.save(force_update=True)
    Step.objects.filter(tour__id=post_text.get("tour").get("id")).delete()
    for step in post_text.get("steps"):
        step = Step(
            placement=step.get('placement'),
            title=step.get('title'),
            element=step.get('element'),
            content=step.get('content'),
            path=step.get('path'),
            order=step.get('order'),
            tour=tour
        )
        step.save(force_insert=True)


def create_new_apptour(post_text):
    if post_text.get("tour").get("status") == "incomplete":
        print("saving new tour")
    else:
        print("creating new tour")
    tour = Tour(
        tour_name=post_text.get("tour").get("tour_name"),
        status=post_text.get("tour").get("status"),
        tour_description=post_text.get("tour").get("tour_description"),
        tour_groups=transform_tour_groups_field(post_text.get("tour").get("tour_groups")),
        tour_image=post_text.get("tour").get("tour_image"),
        tour_create_date=datetime.now()
    )
    tour.save(force_insert=True)
    connect_apptour_to_users(tour_id=tour.id)
    for step in post_text.get("steps"):
        step = Step(
            placement=step.get('placement'),
            title=step.get('title'),
            element=step.get('element'),
            content=step.get('content'),
            path=step.get('path'),
            order=step.get('order'),
            tour=tour
        )
        step.save(force_insert=True)


def connect_apptour_to_users(tour_id):
    all_user_ids = [val.get("id") for val in UserProfile.objects.values("id")]
    for user_id in all_user_ids:
        print("making TourUsers object with user id %s and tour id %s"%(user_id,tour_id))
        tour_users = TourUsers(user_id=user_id, tour_id=tour_id)
        tour_users.save()


@user_passes_test(lambda user: user.is_site_admin)
def view_tours(request):
    tours = Tour.objects.filter(status="complete")
    for tour in tours:
        tour.tour_groups = transform_tour_groups_field(str(tour.tour_groups))
    saved_tours = Tour.objects.filter(status="incomplete")
    for tour in saved_tours:
        tour.tour_groups = transform_tour_groups_field(str(tour.tour_groups))
    return render(request, "app_tour/tour_views.html", {"tours":tours,"saved_tours":saved_tours})


@user_passes_test(lambda user: user.is_site_admin)
def delete_tour(request, tour_id=None):
    instance = Tour.objects.get(id=tour_id)
    instance.delete()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@user_passes_test(lambda user: user.is_site_admin)
def update_apptour(request, tour_id=None):
    instance = Tour.objects.get(id=tour_id)
    instance.tour_groups = transform_tour_groups_field(str(instance.tour_groups))
    return render(request, "app_tour/create_app_tour.html", {"instance":instance})



