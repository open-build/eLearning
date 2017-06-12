window.onload = function(){


    $(document).on('click', '.app_tour_iframe_link', function(){alert($(this).parent().attr("id").slice(-1))});

    $("#app-tour-iframe").contents().find("*").dblclick(function(e) {
        var path = [];

        var index = $(this).index()
        var id = $(this).attr("id");
        var clss = $(this).attr("class");
        var element = $(this).get(0).tagName
        added_selector = (id != undefined ? " #" + id.split(" ")[0] :
                (clss != undefined ? " ." + clss.split(" ")[0]: element)
            )
        if (index != 0 && id == undefined){
            added_selector += `:nth-of-type(${index})`
        }
        path.push(added_selector);

        $.each($(this).parents(), function(index, value) {
            var index = $(value).index()
            var id = $(value).attr("id");
            var clss = $(value).attr("class");
            var element = $(value).get(0).tagName
            added_selector = (id != undefined ? " #" + id.split(" ")[0] :
                    (clss != undefined ? " ." + clss.split(" ")[0]: element)
                )
            if (index != 0 && id == undefined){
                added_selector += `:nth-of-type(${index})`
            }
            path.push(added_selector);
        });
        alert( $('#app-tour-iframe').contents().get(0).location.pathname );

        css_path = path.reverse().join(" ")
        $("#app-tour-iframe").contents().find(css_path)
            .append("<span id='spantest'>hey</span>");
        $("#spantest").tooltip();
        console.log(css_path);
        return false;
    });

    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
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

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    function getPost(num_of_steps){
        post = {};
        post.tour = {tour_name: $("#tour_name").val()}
        post.steps = []
        var i = 0;
        for(; i < num_of_steps;){
            i += 1;
            index = i.toString();
            step = {
                title:$(`#step${index}_title`).val(),
                content:$(`#step${index}_content`).val(),
                placement:$(`#step${index}_placement`).val(),
                path:$(`#step${index}_path`).val(),
                element:$(`#step${index}_element`).val(),
                order:$(`#step${index}_order`).val(),
            }
            post.steps.push(step)
        }
        return post;
    }

    // AJAX for posting
    function create_post(num_of_steps) {
        post_data = getPost(num_of_steps)
        $.ajax({
            url : "/apptours/create_tour/", // the endpoint
            type : "POST", // http method
            data : {app_tour: JSON.stringify(post_data)}, // data sent with the post request

            // handle a successful response
            success : function(json) {
                $('#post-text').val(''); // remove the value from the input
                console.log(json); // log the returned json to the console
                console.log("success"); // another sanity check
                resetForm()
            },

            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    };

    function resetForm(){
        while(num_of_steps > 1){
            removeLastStep()
        }
        $('#post-form').trigger("reset");
    }

    var num_of_steps = 1;

        // Submit post on submit
    $('#post-form').on('submit', function(event){
        event.preventDefault();
        console.log("form submitted!")  // sanity check
        create_post(num_of_steps);
    });


    var num_of_steps = 1;
    var i = 0;
    for(; i < num_of_steps;){
        $("#steps").empty()
        i += 1;
        index = i.toString();
        step_form_content = `<lable>Step ${index}</lable>
                          <div id="step${index}">
                            <div class="form-group">
                                <label >Title:</label>
                                <input class="form-control" id="step${index}_title">
                              </div>
                            <div class="form-group">
                                <label >Content:</label>
                                <textarea class="form-control" id="step${index}_content"></textarea>
                              </div>
                            <div class="form-group">
                                <label >Placement:</label>
                                <select id="step${index}_placement" class="form-control">
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label >Path:</label>
                                <input class="form-control" id="step${index}_path">
                              </div>
                            <div class="form-group">
                                <label >Element:</label>
                                <input class="form-control" id="step${index}_element">
                              </div>
                              <a class="app_tour_iframe_link" data-toggle="modal" data-target="#app_tour_iframe" href="">view iframe of site to find elements</a>
                            <input value="${index}" readonly type="hidden" class="form-control" id="step${index}_order">
                        </div>`
        $("#steps").append(step_form_content)
    }

    function removeLastStep(){
        $('#steps lable').last().remove();
        $(`#step${num_of_steps}`).remove()
        num_of_steps -= 1;
    }

    $("#remove_step").click(function(){
        removeLastStep();
    });


    $("#add_step").click(function(){
        num_of_steps += 1
        index = num_of_steps;
        step_form_content = `<lable>Step ${index}</lable>
                          <div id="step${index}">
                            <div class="form-group">
                                <label >Title:</label>
                                <input class="form-control" id="step${index}_title">
                              </div>
                            <div class="form-group">
                                <label >Content:</label>
                                <textarea class="form-control" id="step${index}_content"></textarea>
                              </div>
                            <div class="form-group">
                                <label >Placement:</label>
                                <select id="step${index}_placement" class="form-control">
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div claxss="form-group">
                                <label >Path:</label>
                                <input class="form-control" id="step${index}_path">
                              </div>
                            <div class="form-group">
                                <label >Element:</label>
                                <input class="form-control" id="step${index}_element">
                              </div>
                              <a class="app_tour_iframe_link" data-toggle="modal" data-target="#app_tour_iframe" href="">view iframe of site to find elements</a>
                            <input value="${index}" readonly type="hidden" class="form-control" id="step${index}_order">
                        </div>`
        $("#steps").append(step_form_content)
    })
};
