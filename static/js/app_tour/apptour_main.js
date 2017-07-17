

window.onload = function() {


    //create objects for apptrour
    var display_tour = new DisplayTours();
    var apptour = new AppTour();
    var admin_tours_view = new AdminToursView();
    var create_tour_form = new CreateTourForm();
    var generate_tour_step = new GenerateTourStep();



    ///////////////////////////////////add listeners get tour////////////////////////////////


    //if the user just logged in
    if (document.cookie.includes("show_app_tour=True") == true){
        $("#app_tour_display_modal").modal({backdrop: 'static', keyboard: false, backdrop: false})
    }


    //if user clicks on tour elearning element
    $("#apptour_modal_btn").click(function(event){
        event.preventDefault();
        $("#app_tour_display_modal").modal({backdrop: 'static', keyboard: false, backdrop: false})
    });


    if(localStorage.getItem("tour_in_progress") != null){ 
        var tour_config = JSON.parse(localStorage.getItem("tour_config"));
        var steps_config = JSON.parse(localStorage.getItem("steps_config"));
        apptour.startTour(tour_config,steps_config);
      } 


    $("#app_tour_display_modal").on('shown.bs.modal',function(){
        display_tour.tour_controller.getAppTours();
        display_tour.getTourNames();
        display_tour.fillModalTable();
        display_tour.addListenersToTours();
    });



    ////////////////////////////listeners for admin tours view////////////////////////////

    //to view saved tours
    $('#view_saved_tours').on('click', function(event){
        admin_tours_view.viewSavedTours();
    });

    //to view completed tours
    $('#view_complete_tours').on('click', function(event){
        admin_tours_view.viewCompletedTours();
    });




    ////////////////////////listeners for creating a tour///////////////////////////////

    //add the first step when loading create_apptour page
    if(window.location.pathname=="/apptours/create_apptour"){
        create_tour_form.appendStepsInitially()
    }

    //enable adding a step
    $("#add_step").click(function(){
        create_tour_form.addStep();
    });

    //enable removing a step, removes last step
    $("#remove_step").click(function(){
        create_tour_form.removeLastStep();
    });


    //for getting an image
    $("#tour_image").on("change", function(){
        var file = this.files[0];
        create_tour_form.hashFileImage(file);
    });

    //reseting tour image
    $("#tour_image_reset").click(function(){
        create_tour_form.resetTourImage();
    });


    // Save post on save btn
    $('#save_tour').on('click', function(event){
        event.preventDefault();
        create_tour_form.saveTour();
    });


    //when updating an apptour
    if(typeof instance != 'undefined' && instance != null){
        create_tour_form.prepopulateTourForm(instance);
    }


    //begin process of submiting apptour, so show modal and let admin user review and try tour
    $("#submit_apptour").on("click",function(event){
        event.preventDefault();
        create_tour_form.submittingAppTour();
    });


    //continue



    $("#modal_confirm").on('hidden.bs.modal',function(){

    });


    $("#confirm_apptour_try_tour").on("click",function(event){

    });


    if(localStorage.getItem("try_tour__finished") != null){ 

    };


    // Submit post on submit
    $('#confirm_apptour_submit').on('click', function(event){

    });




    //////////////listeners fro getting tour step information from admin user///////////////////


    //if user clicks on tour elearning element
    $(document).on("click",".app_tour_iframe_link",function(event){
        event.preventDefault();
        $("#app_tour_iframe_modal").modal({backdrop: 'static', keyboard: false, backdrop: false});
        generate_tour_step.iframe_num = $(this).parent().attr("id").slice(-1);
        generate_tour_step.loadIFrame();
    });

    //reset element variables to null/default and remove popover when exiting iframe
    $("#app_tour_iframe_modal").on('hidden.bs.modal',function(){
        generate_tour_step.resetChosenElement()
    });





};
