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


    removeLocalStorageTour(){
        Object.keys(localStorage)
            .forEach(function(key){
                if (/tour_end$|tour_current_step$|tour_redirect_to$/.test(key)) {
                    localStorage.removeItem(key);
                }
            }
        );
    }


    createSteps(steps_config){
        var tour_steps = [];
        var start_path = steps_config.filter(function(conf){
                return conf.order == (1);
            })[0].path;
        for(var i = 1; i <= steps_config.length; i++){
            var step = steps_config.filter(function(conf){
                return conf.order == i;
            })[0]
            var previous_path = i == 1? null: steps_config.filter(function(conf){
                return conf.order == (i - 1);
            })[0].path;
            var next_path = i == steps_config.length? null: steps_config.filter(function(conf){
                return conf.order == (i + 1);
            })[0].path;

            var addStep = {
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
        return tour_steps;
    }


    createTour(tour_config, steps_config, steps){
        var self = this;
        var tour = new Tour({
            name: tour_config.name + "__tour",
            onStart: function(tour){
                localStorage.setItem("tour_in_progress",true);
                localStorage.setItem("tour_config",JSON.stringify(tour_config)); 
                localStorage.setItem("steps_config",JSON.stringify(steps_config));
            },
            onEnd: function (tour){
                localStorage.removeItem("tour_in_progress");
                localStorage.removeItem("tour_config"); 
                localStorage.removeItem("steps_config");
                self.removeLocalStorageTour();
                //if admin is trying tour before creating tour set tour to finished
                //and redirect back to create_apptour page
                if(localStorage.getItem("try_tour__tour") != null){
                    localStorage.setItem("try_tour__finished",true);
                    window.location.href = "/apptours/create_apptour"
                }
                //else user is using tour and has finished to display other tours now
                else{
                    $('#app_tour_display_modal').modal({backdrop: 'static', keyboard: false, backdrop: false});
                }
            },
            steps:steps
        });
        return tour;
    }


    startTour(tour_config, steps_config, starting = false){
        //if starting is true make sure to clear localStoarge that may have been
        //leftover from the last apptour that ran
        if(starting){
            localStorage.removeItem("tour_in_progress");
            localStorage.removeItem("tour_config"); 
            localStorage.removeItem("steps_config");
            this.removeLocalStorageTour();
        }
        var steps = this.createSteps(steps_config);
        var tour = this.createTour(tour_config,steps_config,steps);
        // Initialize and start the tour
        tour.init();
        tour.start()
    }



}

