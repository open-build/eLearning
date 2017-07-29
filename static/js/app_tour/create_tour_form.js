class CreateTourForm{


    constructor(){

        //add listener
        $("#modal_confirm").on('hidden.bs.modal',function(){
            $("#confirm_apptour_steps").empty();
        });

        this.number_of_steps = 1;

        this.apptour = new AppTour();

        this.tour_controller = new TourController();

        this.step_form_content = `<button type="button" class="btn btn-primary">Step <span class="badge">__number_of_steps__</span></button>
                                  <div id="step__number_of_steps__">
                                    <div class="form-group">
                                        <label >Title:</label>
                                        <input class="form-control" id="step__number_of_steps___title">
                                      </div>
                                    <div class="form-group">
                                        <label >Content:</label>
                                        <textarea class="form-control" id="step__number_of_steps___content"></textarea>
                                      </div>
                                    <div style="display: none;" class="form-group">
                                        <label >Placement:</label>
                                        <select  id="step__number_of_steps___placement" class="form-control">
                                            <option value="top">Top</option>
                                            <option value="bottom">Bottom</option>
                                            <option value="left">Left</option>
                                            <option value="right">Right</option>
                                        </select>
                                    </div>
                                    <div style="display: none;" class="form-group">
                                        <label >Path:</label>
                                        <input class="form-control" id="step__number_of_steps___path">
                                      </div>
                                    <div style="display: none;" class="form-group">
                                        <label >Element:</label>
                                        <input class="form-control" id="step__number_of_steps___element">
                                      </div>
                                     <div  style="display: none;" class="form-group">
                                        <label >Order:</label>
                                          <input readonly value="__number_of_steps__" class="form-control" id="step__number_of_steps___order">
                                     </div>
                                     <pre>Path:  <span id="step__number_of_steps___path_display"></span>  Element: <span id="step__number_of_steps___element_display"></span>   Position: <span id="step__number_of_steps___placement_display"></span>    Order: <span id="step__number_of_steps___order_display">__number_of_steps__</span></pre>
                                      <a class="app_tour_iframe_link" href="">view iframe of site to find elements</a>
                                </div>`

        this.image_displayed = false;
        this.image_hashed_value = null;


    }

    displayChosenElement(step_number){
        $('body').on("change","#step"+step_number+"_path",function(){
            $("#step"+step_number+"_path_display").text($("#step"+step_number+"_path").val())
        });
        $('body').on("change","#step"+step_number+"_element",function(){
            $("#step"+step_number+"_element_display").text($("#step"+step_number+"_element").val())
        });
        $('body').on("change","#step"+step_number+"_placement",function(){
            $("#step"+step_number+"_placement_display").text($("#step"+step_number+"_placement").val())
        });
    }


    getStepFormContent(){
        return this.step_form_content.replace(/__number_of_steps__/g,this.number_of_steps)
    }


    appendStepsInitially(){
        for(var i = 0; i < this.number_of_steps;i++){
            $("#steps").empty();
            $("#steps").append(this.getStepFormContent(this.number_of_steps));
        }
    }


    resetForm(){
        //need to remove added steps
        while(this.number_of_steps > 1){
            this.removeLastStep();
        }
        //need to remove displayed image
        this.resetTourImage();
        //
        $('#post-form').trigger("reset");
        //want to display chosen element 1 to the form rest value of nothing
        $("#step1_path_display").text("");
        $("#step1_element_display").text("");
        $("#step1_placement_display").text("");
    }


    removeLastStep(){
        if(this.number_of_steps>1){
            $('#steps button').last().remove();
            $(`#step${this.number_of_steps}`).remove()
            this.number_of_steps -= 1;
        }
    }


    addStep(){
        this.number_of_steps += 1
        $("#steps").append(this.getStepFormContent(this.number_of_steps));
    }


    hashFileImage(file){
        var self = this;
        var reader = new FileReader();
        reader.onload = function(fileload) {
            var base64file = fileload.target.result;
            //display image on element #tour_image_display
            //set image_displayed to true and save hash of image
            $("#tour_image_display").attr("src",base64file)
            self.image_displayed = true;
            self.image_hashed_value = base64file;
        }
        reader.readAsDataURL(file);
    }


    resetTourImage(){
        $("#tour_image").val("")
        $("#tour_image_display").attr("src","")
        this.image_displayed = false;
        this.image_hashed_value = null;
    }


    getPost(status){
        var self = this;
        var post = {};
        post.tour = {
            tour_name: $("#tour_name").val(),
            status: status,
            tour_image: self.image_displayed ? $("#tour_image_display").prop("src") : "",
            tour_groups:{
                user:$("#tour_group_user").prop("checked"),
                professor:$("#tour_group_professor").prop("checked"),
                admin:$("#tour_group_admin").prop("checked")
                }
            }
        if(typeof instance != 'undefined' && instance != null){
            post.tour.id = instance.tour.id;
        }
        else{
            post.tour.id = null;
        }
        post.steps = []
        for(var i = 1; i <= this.number_of_steps;i++){
            var step = {
                title:$(`#step${i}_title`).val(),
                content:$(`#step${i}_content`).val(),
                placement:$(`#step${i}_placement`).val(),
                path:$(`#step${i}_path`).val(),
                element:$(`#step${i}_element`).val(),
                order:$(`#step${i}_order`).val(),
            }
            post.steps.push(step)
        }
        return post;
    }


    prepopulateTourForm(tour_instance){
        $("#tour_name").val(tour_instance.tour.tour_name); 
        if( tour_instance.tour.tour_image == ""){
            $("#tour_image_display").attr("src","")
            this.image_displayed = false;
        }else{
            $("#tour_image_display").attr("src",tour_instance.tour.tour_image)
            this.image_displayed = true;
        }
        if(tour_instance.tour.tour_groups.user == true){
            $("#tour_group_user").prop("checked",true);
        }else{
            $("#tour_group_user").prop("checked",false);
        }
        if(tour_instance.tour.tour_groups.professor == true){
            $("#tour_group_professor").prop("checked",true)
        }else{
            $("#tour_group_professor").prop("checked",false);
        }
        if(tour_instance.tour.tour_groups.admin == true){
            $("#tour_group_admin").prop("checked",true)
        }else{
            $("#tour_group_admin").prop("checked",false);
        }
        for(var i=0; i < tour_instance.steps.length; i++){ 
            if(i>0){
                this.number_of_steps += 1 ;
                this.displayChosenElement(this.number_of_steps);
                $("#steps").append(this.getStepFormContent(this.number_of_steps)) ;
            }

            $(`#step${i+1}_title`).val(tour_instance.steps[i].title).trigger('change'); 
            $(`#step${i+1}_content`).val(tour_instance.steps[i].content).trigger('change'); 
            $(`#step${i+1}_placement`).val(tour_instance.steps[i].placement).trigger('change'); 
            $(`#step${i+1}_path`).val(tour_instance.steps[i].path).trigger('change'); 
            $(`#step${i+1}_element`).val(tour_instance.steps[i].element).trigger('change'); 
            $(`#step${i+1}_order`).val(tour_instance.steps[i].order).trigger('change'); 
        } 
    }


    submittingAppTour(){
        var post = this.getPost("NA")
        $("#confirm_apptour_tourname").html(post.tour.tour_name);
        $("#confirm_apptour_tour_image").prop("src", post.tour.tour_image);
        var groups = ($("#tour_group_user").prop("checked")==true?"users ":"")+
                        ($("#tour_group_professor").prop("checked")==true?"professors ":"")+
                        ($("#tour_group_admin").prop("checked")==true?"administrators ":"");
        $("#confirm_apptour_tour_groups").html(groups);
        $("#modal_confirm").modal({backdrop: 'static', keyboard: false, backdrop: false})
        var steps_html = "";
        for(var i=0; i<post.steps.length;i+=1){
            steps_html +=
                `<br/>
                <h4>Tour Steps:</h4>
                <br/>
                <h5>Title:</h5> <p>${post.steps[i].title}</p>
                <br/>
                <h5>Content:</h5> <p>${post.steps[i].content}</p>
                <br/>
                <pre>Path: ${post.steps[i].path}   Element: ${post.steps[i].element}    Position: ${post.steps[i].placement}    Order: ${post.steps[i].order}</pre>`
        }
        $("#confirm_apptour_steps").append(steps_html);
    }


    startTryTour(){
        var post = this.getPost("NA")
        $("#modal_confirm").modal("hide")
        localStorage.setItem("try_tour__tour",JSON.stringify(post));
        //if updating an existing tour
        if(typeof instance != 'undefined' && instance != null){
            localStorage.setItem("try_tour__tourinstance",JSON.stringify(instance));
        }
        this.apptour.startTour( {name:post.tour.tour_name}, post.steps,true);
    }


    finishTryTour(){
        localStorage.removeItem("try_tour__finished");
        var post = JSON.parse(localStorage.getItem("try_tour__tour"));
        localStorage.removeItem("try_tour__tour");
        this.prepopulateTourForm(post);
        this.submittingAppTour();
        if(localStorage.getItem("try_tour__tourinstance") != null){ 
            instance = JSON.parse(localStorage.getItem("try_tour__tourinstance"));
            localStorage.removeItem("try_tour__tourinstance");
        }
    }


    saveTour(){
        console.log("form saved!");
        var saved_tour = this.getPost("incomplete");
        this.tour_controller.createPost(saved_tour);
        this.resetForm();
    }


    confirmSubmitTour(){
        console.log("form submitted!");
        var complete_tour = this.getPost("complete");
        this.tour_controller.createPost(complete_tour);
        this.resetForm();
    }



}


