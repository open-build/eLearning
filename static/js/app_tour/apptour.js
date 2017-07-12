
'use strict'
class AppTour{


    constructor(){

        this.tour_template = `<div style="color: grey;" class='popover tour'>
                                <div class='arrow'></div>
                                <h3 class='popover-title'></h3>
                                <div class='popover-content'></div>
                                <div class='popover-navigation'>
                                    <button class='btn btn-default' data-role='prev'>« Prev button again</button>
                                    <span data-role='separator'>|</span>
                                    <button class='btn btn-default' data-role='next'>Next »</button>
                                </div>
                                <button class='btn btn-default' data-role='end'>End tour</button>
                              </div>`;


    }


    createTour(tour_config, steps_config){

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
                removeLocalStorageTour();
                if(localStorage.getItem("try_tour__tour") != null){
                    localStorage.setItem("try_tour__finished",true);
                    window.location.href = "/apptours/create_apptour"
                } else{
                    $('#myModal').modal('show');
                }
            },
            steps:tour_steps
        });

        // Initialize and start the tour
        tour.init();
        tour.start()
    }



}

