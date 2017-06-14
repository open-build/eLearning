window.onload = function(){


    //declare varibles to hold temporary state
    var iframe_num = null;
    var dblclicked = false;
    var chosen_path = null;
    var chosen_element = null;
    var chosen_placement = null;

    $("iframe").load(function(){
        //The iframe has loaded or reloaded.
        $("#app-tour-iframe").contents().find("*").dblclick(function(e) {
            //if not a current popup in the iframe add one
            if(!dblclicked){
                dblclick_fctn();
            }
            return false;
        });
    });

    $("#app-tour-iframe").contents().find("*").dblclick(function(e) {
        //if not a current popup in the iframe add one
        if(!dblclicked){
            dblclick_fctn();
        }
        return false;
    });

    var dblclick_fctn = function(){
        //set variables for this clicked location
        dbclicked = true;
        chosen_element = get_element_location(this);
        chosen_path = get_iframe_path();
        alert(chosen_element);
        alert(chosen_path)
        //chosen_placement = get_placement(e, this);
        //create popover
        $("#app-tour-iframe").contents()
            .find(chosen_element)
            .attr("data-toggle","popover")
            .attr("data-placement",chosen_placement);
        $("[data-toggle=popover]").popover({
            placement: chosen_placement,
            html: 'true',
            trigger: "manual",
            template: `<div class="popover" role="tooltip">
                            <div class="popover-arrow"></div>
                            <div class="popover-content">
                                <button id="choose_element" type="button" class="btn btn-primary">Choose</button>
                                <button id="dont_choose_element" type="button" class="btn btn-danger">Exit</button>
                            </div>
                       </div>`
        });
        $("[data-toggle=popover]").popover("show");
    }

    $(document).on('click', '.app_tour_iframe_link', function(){
        iframe_num = $(this).parent().attr("id").slice(-1)
    });

    /*iframe_contents.find("*").click(function(e) {
        //if currently shoing popover
        if(dblclicked){
            //if popover clicked do nothing
            if(['popover','popover-arrow','popover-content'].indexOf($(this).attr("class")) != -1){
                return;
            }
            //if choose clicked save vars to form and exit iframe and remove popover
            if($(this).attr("id") == "choose_element"){
                $(chosen_path).popover("hide");
                $("#app-tour-iframe").contents().find(chosen_path)
                    .removeAttr("data-toggle").removeAttr("data-placement");
                $('#app_tour_iframe_modal').modal('toggle');
                $("step${iframe_num}_path").val(chosen_path);
                $("step${iframe_num}_element").val(chosen_element);
                $("step${iframe_num}_position").val(chosen_position);
                iframe_num = null;
                dblclicked = false;
                chosen_path = null;
                chosen_element = null;
                chosen_placement = null;
            }
            //if exit clicked or outside of popover clicked or modal closed remove popover and reset vars to null
            if($(this).attr("id") == "dont_choose_element"){
                if(dblclicked){
                    $(chosen_path).popover("hide");
                    $("#app-tour-iframe").contents().find(chosen_path)
                        .removeAttr("data-toggle").removeAttr("data-placement");
                }
                dblclicked = false;
                chosen_path = null;
                chosen_element = null;
                chosen_placement = null;
            }
        }
    });*/


    //if doubleclicked and modal goes away reset
    $("#app_tour_iframe_modal").on('hidden.bs.modal',function(){
        if(dblclicked){
            $(chosen_path).popover("hide");
            $("#app-tour-iframe").contents().find(chosen_path)
            .removeAttr("data-toggle").removeAttr("data-placement");
        }
        iframe_num = null;
        dblclicked = false;
        chosen_path = null;
        chosen_element = null;
        chosen_placement = null;
    });


    function get_placement(event, element){
        var xpos = event.pageX;
        var ypos = event.pageY;
        var right = (xpos - $(this).offset().left)/ ($(this).width()/2);
        var left = 1 - right;
        var bottom = (ypos - $(this).offset().top)/ ($(this).height()/2);
        var top = 1 - bottom;
        var max_placement = Math.max([right,left,bottom,top]);
        if (right == max_placement){
            return "right";
        }else if(left == max_placement){
            return "left";
        }else if(top == max_placement){
            return "top";
        }else if(bottom == max_placement){
            return "bottom";
        }else return null;
    }

    function get_element_location(element){
        var path = [];
        var index = $(element).index()
        var id = $(element).attr("id");
        var clss = $(element).attr("class");
        var element = $(element).get(0).tagName
        added_selector = (id != undefined ? " #" + id.split(" ")[0] :
                (clss != undefined ? " ." + clss.split(" ")[0]: element)
            )
        if (index != 0 && id == undefined){
            added_selector += `:nth-of-type(${index})`
        }
        path.push(added_selector);
        $.each($(element).parents(), function(index, value) {
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
        css_path = path.reverse().join(" ");
        return css_path;
    }

    function get_iframe_path(){
        return $('#app-tour-iframe').contents().get(0).location.pathname;
    }


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
            num_of_steps = i.toString();
            step = {
                title:$(`#step${num_of_steps}_title`).val(),
                content:$(`#step${num_of_steps}_content`).val(),
                placement:$(`#step${num_of_steps}_placement`).val(),
                path:$(`#step${num_of_steps}_path`).val(),
                element:$(`#step${num_of_steps}_element`).val(),
                order:$(`#step${num_of_steps}_order`).val(),
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

    // Submit post on submit
    $('#post-form').on('submit', function(event){
        event.preventDefault();
        console.log("form submitted!")  // sanity check
        create_post(num_of_steps);
    });


    var num_of_steps = 1;

    var get_step_form_content = function(num_of_steps){
        var step_form_content =
            `<button type="button" class="btn btn-primary">Step <span class="badge">${num_of_steps}</span></button>
              <div id="step${num_of_steps}">
                <div class="form-group">
                    <label >Title:</label>
                    <input class="form-control" id="step${num_of_steps}_title">
                  </div>
                <div class="form-group">
                    <label >Content:</label>
                    <textarea class="form-control" id="step${num_of_steps}_content"></textarea>
                  </div>
                <div class="form-group">
                    <label >Placement:</label>
                    <select readonly id="step${num_of_steps}_placement" class="form-control">
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <div class="form-group">
                    <label >Path:</label>
                    <input readonly class="form-control" id="step${num_of_steps}_path">
                  </div>
                <div class="form-group">
                    <label >Element:</label>
                    <input readonly class="form-control" id="step${num_of_steps}_element">
                  </div>
                 <div class="form-group">
                    <label >Order:</label>
                      <input readonly value="${num_of_steps}" class="form-control" id="step${num_of_steps}_order">
                </div>
                  <a class="app_tour_iframe_link" data-toggle="modal" data-target="#app_tour_iframe_modal" href="">view iframe of site to find elements</a>
            </div>`

        return step_form_content;
    }


    var i = 0;
    for(; i < num_of_steps;){
        $("#steps").empty()
        i += 1;
        $("#steps").append(get_step_form_content(num_of_steps))
    }

    function removeLastStep(){
        $('#steps button').last().remove();
        $(`#step${num_of_steps}`).remove()
        num_of_steps -= 1;
    }

    $("#remove_step").click(function(){
        removeLastStep();
    });


    $("#add_step").click(function(){
        num_of_steps += 1
        num_of_steps = num_of_steps;
        $("#steps").append(get_step_form_content(num_of_steps))
    })



};
