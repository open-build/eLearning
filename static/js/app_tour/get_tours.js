window.onload = function() {


    var tour_template = `<div style="color: grey;" class='popover tour'>
                        <div class='arrow'></div>
                        <h3 class='popover-title'></h3>
                        <div class='popover-content'></div>
                        <div class='popover-navigation'>
                            <button class='btn btn-default' data-role='prev'>« Prev button again</button>
                            <span data-role='separator'>|</span>
                            <button class='btn btn-default' data-role='next'>Next »</button>
                        </div>
                        <button class='btn btn-default' data-role='end'>End tour</button>
                      </div>`


    var fillToursArray = function(){
        var app_tours = [];
        JSON.parse(sessionStorage.getItem("tours")).forEach(function(val,index){
            app_tours.push(val.tour_name);
        });
        return app_tours
    }


    var createTour = function(tour_config, steps_config, tour_step=0){
        var tour_steps = [];
        var start_path = steps_config.filter(function(conf){
                return conf.order == (1);
            })[0].path;
        for(var i = 1; i <= steps_config.length; i++){
            step = steps_config.filter(function(conf){
                return conf.order == i;
            })[0]
            var previous_path = i == 1? null: steps_config.filter(function(conf){
                return conf.order == (i - 1);
            })[0].path;
            var next_path = i == steps_config.length? null: steps_config.filter(function(conf){
                return conf.order == (i + 1);
            })[0].path;

            addStep = {
                orphan: true,
                title: step.title,
                content: step.content,
                placement: step.placement,
                element: step.element,
                path:step.path,
                onNext: function(){
                    if(this.path != next_path){
                        localStorage.setItem("tour_in_progress",true);
                    }
                },
                onPrev: function(){
                    if(this.path != previous_path){
                        localStorage.setItem("tour_in_progress",true);
                    }
                },
            }

            tour_steps.push(addStep)
        }

        var tour = new Tour({
            name: tour_config.name + "__tour",
            //template: tour_template,
            onStart: function(tour){
                if (start_path != document.location.pathname){
                    localStorage.setItem("tour_in_progress",true);
                }
                localStorage.setItem("tour_config",JSON.stringify(tour_config)); 
                localStorage.setItem("steps_config",JSON.stringify(steps_config));
            },
            onEnd: function (tour){
                localStorage.removeItem("tour_in_progress");
                localStorage.removeItem("tour_config"); 
                localStorage.removeItem("steps_config");
                $('#myModal').modal('show');
                localStorage.clear();
            },
            steps:tour_steps
        });

        // Initialize and start the tour
        tour.init();
        tour.start()
    }



    if(localStorage.getItem("tour_in_progress") != null){ 
        createTour( 
            JSON.parse(localStorage.getItem("steps_config")), 
            JSON.parse(localStorage.getItem("steps_config"))
        );
        localStorage.removeItem("tour_in_progress");
       } else{
        localStorage.removeItem("tour_in_progress");
        localStorage.removeItem("tour_config"); 
        localStorage.removeItem("steps_config");
        localStorage.clear();
     }


    var addListenersToTours = function(tours_array){
        tours_array.forEach(function(val,index){
            var re = /\s/g;
            str_val = val.replace(re,'_')
            $(`#${str_val}`).click(function(){
                $('#myModal').modal('hide');
                tour = JSON.parse(sessionStorage.getItem("tours"))
                    .filter(function(element, index, array){return element.tour_name == val;})[0]
                createTour(tour_config={}, steps_config=tour.steps);
            });
        });
     }


    var getAppTours = function(){
        $.ajax({
            url: '/apptours/get_tours',
            type: 'get', // This is the default though, you don't actually need to always mention it
            success: function(data) {
                sessionStorage.removeItem('tours');
                sessionStorage.setItem('tours',data);
                var app_tours = fillToursArray();
                fillModalTable(app_tours);
                addListenersToTours(app_tours);
            },
            failure: function(data) {
                return null;
            }
        });
    }


    var fillModalTable = function(app_tours){
        $(".modal-body table").remove("tr")
        app_tours.forEach(function(val,index){
            var re = /\s/g;
            str_val = val.replace(re,'_')
            $(".modal-body table").append(`<tr id='${str_val}'><td>false</td><td>${val}</td><td>true</td></tr>`)
        });
    }


    $("#myModal").on('shown.bs.modal',function(){
        getAppTours();
    });


    if (document.cookie.includes("show_app_tour=True") == true){
        $("#apptour_modal_btn").click();
        getAppTours();
     }


};