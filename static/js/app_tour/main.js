$( document ).ready(function() {

    $("#myBtn").click(function(){
            $("#myModal").modal();
     });

    var tour_template = `<div style="background-color: black;color: grey;" class='popover tour'>
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

    var tours = [
                    {
                        tourName: "my first product tour which used as a demo",
                         config:{
                            tour_data:{

                            },
                            steps_data:[
                                {
                                    element: "#contact",
                                    placement: "bottom",
                                    title: "first tour",
                                    path: "/"
                                  },
                                  {
                                    element: "#footer",
                                    placement: "bottom",
                                    title: "<code>hello world</code>",
                                    content: "Here are the sections of this page, easily laid out.",
                                    path: "/"
                                  },
                                  {
                                    element: "#contact",
                                    placement: "top",
                                    title: "Main section",
                                    content: "This is a section that you can read. It has valuable information.",
                                    path: "/"
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
                                    element: "#page-top",
                                    placement: "bottom",
                                    title: "second tour",
                                    content: "This tour will guide you through some of the features we'd like to point out.",
                                    path: "/"
                                  },
                                  {
                                    element: "#contact",
                                    placement: "bottom",
                                    title: "<code>hello world</code>",
                                    path: "Here are the sections of this page, easily laid out.",
                                    path: "/"
                                  },
                                  {
                                    element: "#contact",
                                    placement: "top",
                                    title: "Main section",
                                    content: "This is a section that you can read. It has valuable information.",
                                    path: "/"
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
                                    element: "#contact",
                                    placement: "bottom",
                                    title: "third tour",
                                    content: "This tour will guide you through some of the features we'd like to point out.",
                                    path: "/"
                                  },
                                  {
                                    element: "#contact",
                                    placement: "bottom",
                                    title: "<code>hello world</code>",
                                    content: "Here are the sections of this page, easily laid out.",
                                    path: "/"
                                  },
                                  {
                                    element: "#contact",
                                    placement: "top",
                                    title: "Main section",
                                    content: "This is a section that you can read. It has valuable information.",
                                    path: "/"
                                  }
                            ]
                         }

                    }
                ]

    var getAppTours = function(){
        $.ajax({
            url: '/apptours/hello',
            type: 'get', // This is the default though, you don't actually need to always mention it
            success: function(data) {
                alert(data);
            },
            failure: function(data) {
                alert('Got an error dude');
            }
        });

    }



    sessionStorage.removeItem('tours')
    sessionStorage.setItem('tours',JSON.stringify(tours))

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
    JSON.parse(sessionStorage.getItem("tours")).forEach(function(val,index){
        app_tours.push(val.tourName);
    });

    var fillModalTable = function(){
        $(".modal-body table").remove("tr")
        app_tours.forEach(function(val,index){
            var re = /\s/g;
            str_val = val.replace(re,'_')
            $(".modal-body table").append(`<tr id='${str_val}'><td>false</td><td>${val}</td><td>true</td></tr>`)
        })
    }

    var redirectFunction = function(){
        if(this == window.location.pathname){
        }
        else{
            document.location.href = this;
        }
        return (new jQuery.Deferred()).promise();
    };

    var createMultipageTours = function(){
        this.steps_data.forEach(function(val,index){
            loc = val.path
            val.onNext = redirectFunction.bind(loc)
        })
    }



    fillModalTable()

    if (document.cookie.includes("show_app_tour=False") == true){
        getAppTours()
     }

     var addListenerToTours = function(tours_array){
        tours_array.forEach(function(val,index){
            var re = /\s/g;
            str_val = val.replace(re,'_')
            $(`#${str_val}`).click(function(){
                $('#myModal').modal('hide');
                tour_config = JSON.parse(sessionStorage.getItem("tours"))
                .filter(function(element, index, array){return element.tourName == val;})[0].config
                //tour_config.steps_data.forEach(function(val,index){
                    //loc = val.path
                    //val.onNext = redirectFunction.bind(loc)
                //})
                createTour(tour_config);
            });
        });
     }

     addListenerToTours(app_tours);



});