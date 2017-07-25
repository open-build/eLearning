

class TourController{


    constructor(){
        //getting csrf token if one exists
        this.csrftoken = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.startsWith("csrftoken=")) {
                    this.csrftoken = cookie.substring("csrftoken=".length);

                }
            }
        }
        //setup ajax to use csrf when needed and to set async to false
        var self = this;
        $.ajaxSetup(
            {
                beforeSend: function(xhr, settings) {
                                if ( (/^(POST|PUT)$/.test(settings.type)) ) {
                                    xhr.setRequestHeader("X-CSRFToken", self.csrftoken);
                                }
                            },
                async: false
            }
        );
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
            },
            error : function(xhr,errmsg,err) {
                console.log(errmsg)
            }
        });
    }

}