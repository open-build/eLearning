$(document).ready( function(){



    $("#submit_apptour").on("click",function(event){
        event.preventDefault();
        var post = getPost(num_of_steps, "NA")
        $("#confirm_apptour_tourname").val(post.tour_name);
        $("#modal_confirm").modal({backdrop: 'static', keyboard: false, backdrop: false})
        var steps_html = "";
        for(var i=0; i<post.steps.length;i+=1){
            steps_html +=
                `
                <br/>
                <h4>Tour Steps:</h4>
                <br/>
                <h5>Title:</h5> <p>${post.steps[i].title}</p>
                <br/>
                <h5>Content:</h5> <p>${post.steps[i].content}</p>
                <br/>
                <pre>Path: ${post.steps[i].path}   Element: ${post.steps[i].element}    Position: ${post.steps[i].placement}    Order: ${post.steps[i].order}</pre>
                `
        }
        $("#confirm_apptour_steps").append(steps_html)
    })

    $("#modal_confirm").on('hidden.bs.modal',function(){
        $("#confirm_apptour_steps").empty();
    });





    //declare varibles to hold temporary state
    var iframe_num = null;
    var dblclicked = false;
    var chosen_path = null;
    var chosen_element = null;
    var chosen_placement = null;

    $("iframe").load(function(){
        //The iframe has loaded or reloaded.
        $("#app-tour-iframe").contents()
            .find("[data-toggle=popover]").popover('hide');
        $("#app-tour-iframe").contents().find(chosen_element)
            .removeAttr("data-toggle");
        dblclicked = false;
        chosen_path = null;
        chosen_element = null;
        chosen_placement = null;

        $("#app-tour-iframe").contents().find("*").dblclick(function(e) {
            //if not a current popup in the iframe add one
            if(dblclicked == true){
                click_fctn(e);
            }
            else{
                dblclick_fctn(this,e);
            }
            return false;
        });
    });


    $("#app-tour-iframe").contents().find("*").dblclick(function(e) {
        //if not a current popup in the iframe add one
        if(dblclicked == true){
            click_fctn(e);
        }
        else{
            dblclick_fctn(this,e);
        }
        return false;
    });




    var dblclick_fctn = function(element, event){
        //set variables for this clicked location
        dblclicked = true;
        chosen_element = get_element(element);
        chosen_path = get_iframe_path();
        chosen_placement = get_placement(element, event);
        //create popover
        var popover_content = `<div class="popover-content">
                                    <button id="choose_element" type="button" class="btn btn-primary">Choose</button>
                                    <button id="dont_choose_element" type="button" class="btn btn-danger">Exit</button>
                                </div>`

        $("#app-tour-iframe").contents()
                .find(chosen_element).attr("data-toggle","popover");
         $("#app-tour-iframe").contents()
                .find("[data-toggle=popover]").popover({
                    placement: chosen_placement,
                    html: true,
                    trigger: "manual",
                    title:"Chosen Element",
                    content: popover_content
                });
         $("#app-tour-iframe").contents()
                .find("[data-toggle=popover]").popover('show');
    }

    var click_fctn = function(e){
        //if popover clicked do nothing
        //if choose clicked save vars to form and exit iframe and remove popover
        if(e.target.id == "choose_element"){
            $(`#step${iframe_num}_path`).val(chosen_path);
            $(`#step${iframe_num}_element`).val(chosen_element);
            $(`#step${iframe_num}_placement`).val(chosen_placement);
            iframe_num = null;
            dblclicked = false;
            chosen_path = null;
            chosen_element = null;
            chosen_placement = null;
            $("#app-tour-iframe").contents()
                .find("[data-toggle=popover]").popover('hide');
            $("#app-tour-iframe").contents().find(chosen_element)
                .removeAttr("data-toggle");
            $('[data-dismiss=modal').click();
        }
        //if exit clicked or outside of popover clicked or modal closed remove popover and reset vars to null
        if(e.target.id == "dont_choose_element"){
            $("#app-tour-iframe").contents()
                .find("[data-toggle=popover]").popover('hide');
            $("#app-tour-iframe").contents().find(chosen_element)
                .removeAttr("data-toggle");
            dblclicked = false;
            chosen_path = null;
            chosen_element = null;
            chosen_placement = null;
        }
    }

    $(document).on('click', '.app_tour_iframe_link', function(){
        iframe_num = $(this).parent().attr("id").slice(-1)
    });


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


    function get_placement(element, event){
        var xpos = event.pageX;
        var ypos = event.pageY;
        var right = (xpos - $(element).offset().left)/ $(element).width();
        var left = 1 - right;
        var bottom = (ypos - $(element).offset().top)/ $(element).height();
        var top = 1 - bottom;
        var max_placement = Math.max(right,left,bottom,top);
        var placement = "top";
        if (right == max_placement){
            placement = "right";
        }else if(left == max_placement){
            placement = "left";
        }else if(top == max_placement){
            placement = "top";
        }else if(bottom == max_placement){
            placement = "bottom";
        }else placement = null;
        return placement;
    }


    function get_iframe_path(){
        return $('#app-tour-iframe').contents().get(0).location.pathname;
    }


    function get_element(el) {
      var stack = [];
      while ( el.parentNode != null ) {
        var sibCount = 0;
        var sibIndex = 0;
        for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
          var sib = el.parentNode.childNodes[i];
          if ( sib.nodeName == el.nodeName ) {
            if ( sib === el ) {
              sibIndex = (sibCount + 1);
            }
            sibCount++;
          }
        }
        if ( el.hasAttribute('id') && el.id != '' ) {
          stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
        } else if ( sibCount > 1 ) {
          stack.unshift(el.nodeName.toLowerCase() + ':nth-of-type(' + sibIndex + ')');
        } else {
          stack.unshift(el.nodeName.toLowerCase());
        }
        el = el.parentNode;
      }

      var css_path = stack.slice(1); // removes the html element
      css_path = ("" + css_path).replace(/,/g," ");
      css_path = css_path.substring(css_path.lastIndexOf("#"));
      return css_path;
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

    function getPost(num_of_steps, status){
        post = {};
        post.tour = {tour_name: $("#tour_name").val(), status: status}
        if(instance != null){
            post.tour.id = instance.id;
        }
        else{
            post.tour.id = null;
        }
        post.steps = []
        for(var i = 1; i <= num_of_steps;i++){
            step = {
                title:$(`#step${i}_title`).val(),
                content:$(`#step${i}_content`).val(),
                placement:$(`#step${i}_placement`).val(),
                path:$(`#step${i}_path`).val(),
                element:$(`#step${i}_element`).val(),
                order:$(`#step${i}_order`).val(),
            }
            post.steps.push(step)
        }
        return post;
    }

    // AJAX for posting
    function create_post(num_of_steps, status) {
        post_data = getPost(num_of_steps, status)
        $.ajax({
            url : "/apptours/create_tour/", // the endpoint
            type : "POST", // http method
            data : {app_tour: JSON.stringify(post_data)}, // data sent with the post request

            // handle a successful response
            success : function(json) {
                $('#post-text').val(''); // remove the value from the input
                console.log(json); // log the returned json to the console
                console.log("success"); // another sanity check
                resetForm();
                window.location.href = "/apptours/view_tours"
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
    $('#confirm_apptour_submit').on('click', function(event){
        event.preventDefault();
        console.log("form submitted!")  // sanity check
        create_post(num_of_steps, "complete");
    });

    // Save post on save btn
    $('#save_tour').on('click', function(event){
        event.preventDefault();
        console.log("form saved!")  // sanity check
        create_post(num_of_steps, "incomplete");
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
                    <select  id="step${num_of_steps}_placement" class="form-control">
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <div class="form-group">
                    <label >Path:</label>
                    <input class="form-control" id="step${num_of_steps}_path">
                  </div>
                <div class="form-group">
                    <label >Element:</label>
                    <input class="form-control" id="step${num_of_steps}_element">
                  </div>
                 <div  class="form-group">
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



    if (typeof variable !== 'undefined' && instance != null){
        $("#tour_name").val(instance.tour_name);
        for(var i=0; i<instance.steps.length;){
            if(i > 0){
                num_of_steps += 1
                num_of_steps = num_of_steps;
                $("#steps").append(get_step_form_content(num_of_steps))
            }
            i+=1;
            $(`#step${i}_title`).val(instance.steps[i-1].title);
            $(`#step${i}_content`).val(instance.steps[i-1].content);
            $(`#step${i}_placement`).val(instance.steps[i-1].placement);
            $(`#step${i}_path`).val(instance.steps[i-1].path);
            $(`#step${i}_element`).val(instance.steps[i-1].element);
            $(`#step${i}_order`).val(instance.steps[i-1].order);
        }
    }


    // view saved tours
    $('#view_saved_tours').on('click', function(event){
        $("#saved_tours_list").show();
        $("#complete_tours_list").hide();
        $("#view_saved_tours").hide();
        $("#view_complete_tours").show();
    });
    // view completed tours
    $('#view_complete_tours').on('click', function(event){
        $("#saved_tours_list").hide();
        $("#complete_tours_list").show();
        $("#view_saved_tours").show();
        $("#view_complete_tours").hide();
    });


});
