$( document ).ready(function() {

    $("#myBtn").click(function(){
            $("#myModal").modal();
     });

    var tour_template = `<div style="background-color: black;color: grey;" class='popover tour'>
                        <div class='arrow'></div>
                        <h3 class='popover-title'></h3>
                        <div class='popover-content'></div>
                        <div class='popover-navigation'>
                            <button class='btn btn-default' data-role='prev'>« Prev</button>
                            <span data-role='separator'>|</span>
                            <button class='btn btn-default' data-role='next'>Next »</button>
                        </div>
                        <button class='btn btn-default' data-role='end'>End tour</button>
                      </div>`

    var tours = [
                    {
                        tourName: "my first product tour which used as a demo",
                         config:{
                            tour_data:{

                            },
                            steps_data:[
                                {
                                    element: "#toladata",
                                    placement: "bottom",
                                    title: "first tour",
                                    content: "This tour will guide you through some of the features we'd like to point out."
                                  },
                                  {
                                    element: "#contact",
                                    placement: "bottom",
                                    title: "<code>hello world</code>",
                                    content: "Here are the sections of this page, easily laid out."
                                  },
                                  {
                                    element: "#contact",
                                    placement: "top",
                                    title: "Main section",
                                    content: "This is a section that you can read. It has valuable information."
                                  }
                            ]
                         }

                    },
                    {
                        tourName: "my second product tour which used as a demo",
                         config:{
                            tour_data:{

                            },
                            steps_data:[
                                {
                                    element: "#toladata",
                                    placement: "bottom",
                                    title: "second tour",
                                    content: "This tour will guide you through some of the features we'd like to point out."
                                  },
                                  {
                                    element: "#contact",
                                    placement: "bottom",
                                    title: "<code>hello world</code>",
                                    content: "Here are the sections of this page, easily laid out."
                                  },
                                  {
                                    element: "#contact",
                                    placement: "top",
                                    title: "Main section",
                                    content: "This is a section that you can read. It has valuable information."
                                  }
                            ]
                         }

                    },
                    {
                        tourName: "my third product tour which used as a demo",
                         config:{
                            tour_data:{

                            },
                            steps_data:[
                                {
                                    element: "#toladata",
                                    placement: "bottom",
                                    title: "third tour",
                                    content: "This tour will guide you through some of the features we'd like to point out."
                                  },
                                  {
                                    element: "#contact",
                                    placement: "bottom",
                                    title: "<code>hello world</code>",
                                    content: "Here are the sections of this page, easily laid out."
                                  },
                                  {
                                    element: "#contact",
                                    placement: "top",
                                    title: "Main section",
                                    content: "This is a section that you can read. It has valuable information."
                                  }
                            ]
                         }

                    }
                ]

    var createTour = function(config){
        var tour = new Tour({
            storage : false,
            template: tour_template,
            onEnd: function (tour) {$('#myModal').modal('show');},
        });
        tour.addSteps(config.steps_data);
        // Initialize and start the tour
        tour.init();
        tour.start();
        return tour;
    }

    var app_tours = [];
    tours.forEach(function(val,index){
        app_tours.push(val.tourName);
    });

    if (document.cookie.includes("show_app_tour=False") == true){
        app_tours.forEach(function(val,index){
        var re = /\s/g;
        str_val = val.replace(re,'_')
        $(".modal-body table").append(`<tr id='${str_val}'><td>false</td><td>${val}</td><td>true</td></tr>`)
        })
        $('#myModal').modal('show');
     }

     app_tours.forEach(function(val,index){
        var re = /\s/g;
        str_val = val.replace(re,'_')
        $(`#${str_val}`).click(function(){
            $('#myModal').modal('hide');
            tour_config = tours.filter(function(element, index, array){return element.tourName == val;})[0].config
            createTour(tour_config);
        });
     });


});