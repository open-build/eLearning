
'use strict'
class AdminToursView{


    viewSavedTours(){
        $("#saved_tours_list").show();
        $("#complete_tours_list").hide();
        $("#view_saved_tours").hide();
        $("#view_complete_tours").show();
    }


    viewCompletedTours(){
        $("#saved_tours_list").hide();
        $("#complete_tours_list").show();
        $("#view_saved_tours").show();
        $("#view_complete_tours").hide();
    }

}