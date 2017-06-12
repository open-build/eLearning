
class app_tour_middleware(object):
    # One-time configuration and initialization.

    def process_response(self, request, response):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        # Code to be executed for each request/response after
        # the view is called.
        if hasattr(request,'user') and request.user.is_authenticated():
            if request.COOKIES.get('show_app_tour',False):
                response.set_cookie("show_app_tour", False)
            else:
                response.set_cookie("show_app_tour", True)
        else:
            if request.COOKIES.get('show_app_tour',False):
                response.delete_cookie('show_app_tour')
        return response

