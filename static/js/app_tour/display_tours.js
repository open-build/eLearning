
class DisplayTours{


    constructor(){
        this.tours_array = [];
        this.apptour = new AppTour();
        this.tour_controller = new TourController();
    }


    addListenersToTours(){
        var apptour_obj = this.apptour;
        this.tours_array.forEach(function(val,index){
            var re = /\s/g;
            var str_val = val.replace(re,'_')
            $(`#${str_val}__apptour`).click(function(){
                //hide modal to start tour for user
                $('#app_tour_display_modal').modal('hide');
                //get tour by name
                var tour = JSON.parse(sessionStorage.getItem("tours"))
                    .filter(function(element, index, array){return element.tour_name == val;})[0]
                //start tour for user
                apptour_obj.startTour(tour,tour.steps,true);
            });
        });
    }


    fillModalTable(app_tours){
        $(".modal-body table tbody tr").remove();
        this.tours_array.forEach(function(val,index){
            var re = /\s/g;
            var str_val = val.replace(re,'_')
            $(".modal-body table").append(`<tr id='${str_val}__apptour'><td>false</td><td>${val}</td><td>true</td></tr>`)
        });
    }


    getTourNames(){
        var app_tours = [];
        var tours = JSON.parse(sessionStorage.getItem("tours"));
        Array.from(tours).forEach(function(val,index){
            app_tours.push(val.tour_name);
        });
        this.tours_array = app_tours;
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







