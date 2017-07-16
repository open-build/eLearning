


//setup ajax first
var getCsrfToken = function(){
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

var csrfSafeMethod = function(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

var sameOrigin = function(url) {
    var host = document.location.host;
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

var ajaxSetup = function(){
    $.ajaxSetup(
        {
            beforeSend: function(xhr, settings) {
                            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                                xhr.setRequestHeader("X-CSRFToken", getCsrfToken());
                            }
                        },
            async: false
        }
    );
}

//setup ajax to use csrf when needed and to set async to false
ajaxSetup();


class TourController{

    constructor(){

    }

    getAppTours(){
        $.ajax({
            url: '/apptours/get_tours',
            type: 'get',
            success: function(tours_data) {
                sessionStorage.setItem('tours',tours_data);
                return true;
            },
            failure: function(data) {
                sessionStorage.setItem('tours',null);
                console.log("Failed to get apptour...");
                return false;
            }
        });
    }


    createPost(post_data) {
        $.ajax({
            url : "/apptours/create_tour/",
            type : "POST",
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