
class DisplayTours{


    constructor(){
        this.tours_array = [];
        this.tour_names = [];
        this.apptour = new AppTour();
        this.tour_controller = new TourController();
    }


    getTours(){
        this.tours_array = JSON.parse(sessionStorage.getItem("tours"));
        var self = this;
        this.tours_array.forEach(function(val,index){
            self.tour_names.push(val.tour_name);
        });
    }


    getTourDisplayHtml(tour_id,tour_name,tour_create_date,tour_visited,tour_description,tour_image){
        tour_create_date = `Date Created:\t${tour_create_date}`;
        tour_visited = `Visited:\t${tour_visited}`
        var re = /\s/g;
        var tour_id_name = tour_name.replace(re,'_')
        var html_str = `<div class="panel panel-default">
                          <a data-toggle="collapse" href="#collapse${tour_id}">
                            <div class="panel-heading">
                              <h3 class="panel-title">
                                ${tour_name}
                              </h3>
                            </div>
                          </a>
                          <div id="collapse${tour_id}" class="panel-collapse collapse">
                            <div class="panel-body">
                              <br/>
                              <h5>
                              ${tour_create_date}
                              </h5>
                              <h5>
                                ${tour_visited}
                              </h5>
                              <p>
                                ${tour_description}
                              </p>
                              <div class="tour_image img-responsive">
                                <img src="${tour_image}">
                              </div>
                              <button class="btn-success btn" id='${tour_id_name}__apptour'>tour</button>
                            </div>
                          </div>
                        </div>`;
        return html_str;
    }


    addListenersToTours(){
        var self = this;
        self.tour_names.forEach(function(val,index){
            var re = /\s/g;
            var str_val = val.replace(re,'_')
            //listerner to start app tour
            $(`#${str_val}__apptour`).click(function(){
                //hide modal to start tour for user
                $('#app_tour_display_modal').modal('hide');
                //get tour by name
                var tour = JSON.parse(sessionStorage.getItem("tours"))
                            .filter(function(element, index, array){
                                return element.tour_name == val;
                            })[0]
                //start tour for user
                self.apptour.startTour(tour,tour.steps,true);
            });
        });
    }


    fillSingleDisplay(){
        var tour_display_number = localStorage.getItem("tour_display_number");
        tour_display_number = tour_display_number <= this.tours_array.length? tour_display_number: 1;
        localStorage.setItem("tour_display_number",tour_display_number)
        var tour = this.tours_array[(tour_display_number - 1)]
        $("#single_display_tour_name").text(tour.tour_name);
        $("#single_display_tour_create_date").text("Create Date:\t"+tour.tour_create_date);
        $("#single_display_tour_visited").text("Visited\t" + tour.tour_visited);
        $("#single_display_tour_description").text(tour.tour_description);
        $("#single_display_tour_image").prop("src",tour.tour_image);
        //add listener
        var self = this;
        $("#apptour_single").click(function(){
            //hide modal to start tour for user
            $('#app_tour_display_modal').modal('hide');
            //start tour for user
            self.apptour.startTour(tour,tour.steps,true);
        });
    }


    fillModalTable(app_tours){
        var self = this;
        $("#all_displayed_tours .panel").remove();
        this.tours_array.forEach(function(val,index){
            var html_for_tour_display = self.getTourDisplayHtml(val.id,val.tour_name,val.tour_create_date,val.visited,val.tour_description,val.tour_image);
            $("#all_displayed_tours").append(html_for_tour_display);
        });
    }


    tourInProgress(){
        if(localStorage.getItem("tour_in_progress") != null){ 
            createTour( 
                JSON.parse(localStorage.getItem("steps_config")), 
                JSON.parse(localStorage.getItem("steps_config"))
            );
            localStorage.removeItem("tour_in_progress");
            return true;
           } else{
            localStorage.removeItem("tour_in_progress");
            localStorage.removeItem("tour_config"); 
            localStorage.removeItem("steps_config");
            removeLocalStorageTour();
            return false;
         }
    }


}







