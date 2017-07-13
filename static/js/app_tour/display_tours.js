
'use strict'
class DisplayTours{

    constructor(){

        this.tours_array = [];
        this.tours_data = '';
        this.tour_controller = new TourController();

    }


    addListenersToTours(tours_array){
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


    fillModalTable(app_tours){
        $(".modal-body table tbody tr").remove();
        app_tours.forEach(function(val,index){
            var re = /\s/g;
            str_val = val.replace(re,'_')
            $(".modal-body table").append(`<tr id='${str_val}'><td>false</td><td>${val}</td><td>true</td></tr>`)
        });
    }


    saveToursToLocalStorage(tours_data){
        sessionStorage.setItem('tours',tours_data);
    }


    displayTourOnLogin(){
        if (document.cookie.includes("show_app_tour=True") == true){
            $("#apptour_modal_btn").click();
            return true;
        }else{
            return false;
        }
    }


    getTourNames(){
        var app_tours = [];
        JSON.parse(sessionStorage.getItem("tours")).forEach(function(val,index){
            app_tours.push(val.tour_name);
        });
        this.tours_array = app_tours
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


    removeLocalStorageTour(){
        Object.keys(localStorage)
            .forEach(function(key){
                if (/tour_end$|tour_current_step$|tour_redirect_to$/.test(key)) {
                    localStorage.removeItem(key);
                }
            }
        );
    }


}







