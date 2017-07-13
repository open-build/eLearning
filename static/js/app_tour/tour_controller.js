
'use strict'
class TourController{

    constructor(){



    }


    getCsrfToken(){
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, "csrftoken".length + 1) == ("csrftoken" + '=')) {
                    return decodeURIComponent(cookie.substring(name.length + 1));
                }
            }
        }
        return null;
    }


    csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }


    sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    ajaxSetup(){
        $.ajaxSetup(
            {
                beforeSend: function(xhr, settings) {
                                if (!this.csrfSafeMethod(settings.type) && this.sameOrigin(settings.url)) {
                                    xhr.setRequestHeader("X-CSRFToken", this.csrftoken);
                                }
                            },
                async: false
            }
        );
    }


    getAppTours(){
        $.ajax({
            url: '/apptours/get_tours',
            type: 'get', // This is the default though, you don't actually need to always mention it
            success: function(tours_data) {
                return tours_data;
            },
            failure: function(data) {
                return null;
            }
        });
    }


    createPost(post_data) {
        $.ajax({
            url : "/apptours/create_tour/", // the endpoint
            type : "POST", // http method
            data : {app_tour: JSON.stringify(post_data)
            },

            success : function(json) {
                $('#post-text').val('');
                console.log(json);
                console.log("success");
                resetForm();
                window.location.href = "/apptours/view_tours"
            },

            error : function(xhr,errmsg,err) {
                console.log(errmsg)
            }
        });
    }

}