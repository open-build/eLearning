

class GenerateTourStep{


    constructor(){
        this.iframe_num = null;
        this.dblclicked = false;
        this.chosen_path = null;
        this.chosen_element = null;
        this.chosen_placement = null;
        this.popover_content = `<div class="popover-content"style="z-index:999999999; text-align:center; background-color:#006dcc;; text-color:white;" id="choose_element" >
                                    <strong>Confirm Chosen Element</strong>
                                    <pre style="text-align:left;">Path: <span id="chosen_path"></span>
Element: <span id="chosen_element"></span>
Placement: <span id="chosen_position"></span></pre>
                                </div>`
    }


    loadIFrame(){
        var self = this;
        $("iframe").load(function(){
            //The iframe has loaded or reloaded
            //remove popup added and reset variables
            self.resetChosenElement();
            //setup listener
            self.setupIframeListener();
        });
        $("#app_tour_iframe_modal").on('shown.bs.modal',function(){
            //The iframe has loaded or reloaded
            //remove popup added and reset variables
            self.resetChosenElement();
            //setup listener
            self.setupIframeListener();
        });
    }


    resetChosenElement(){
        //remove popup added and reset variables
        var self = this;
        $("#app-tour-iframe").contents()
            .find("[data-toggle=popover]").popover('hide');
        $("#app-tour-iframe").contents().find(self.chosen_element)
            .removeAttr("data-toggle");
        this.dblclicked = false;
        this.chosen_path = null;
        this.chosen_element = null;
        this.chosen_placement = null;
    }


    setupIframeListener(){
        var self = this;
        $("#app-tour-iframe").contents().find("*").off().dblclick(function(event) {
            event.stopImmediatePropagation();
            if(self.dblclicked == true){
                self.clickFctn(event);
                return false;
            }
            else{
                self.dblclickFctn(this,event);
                return false;
            }
        });
    }


    createPopover(chosen_element, chosen_placement){
        //create popover
        var self = this;
        $("#app-tour-iframe").contents()
                .find(chosen_element).first().attr("data-toggle","popover");
         $("#app-tour-iframe").contents()
                .find("[data-toggle=popover]").popover({
                    placement: chosen_placement,
                    html: true,
                    trigger: "manual",
                    content: self.popover_content
                });
         $("#app-tour-iframe").contents()
                .find("[data-toggle=popover]").popover('show');
         $("#app-tour-iframe").contents()
                .find("#chosen_path").text(self.chosen_path);
         $("#app-tour-iframe").contents()
                .find("#chosen_element").text(self.chosen_element);
         $("#app-tour-iframe").contents()
                .find("#chosen_position").text(self.chosen_placement);

    }


    dblclickFctn(element, event){
        //set variables for this clicked location
        this.dblclicked = true;
        this.chosen_element = this.getElement(element);
        this.chosen_path = this.getIFramePath();
        this.chosen_placement = this.getPlacement(element, event);
        //create popover
        this.createPopover(this.chosen_element,this.chosen_placement);
    }


    setCreateForm(){
        $(`#step${this.iframe_num}_path`).val(this.chosen_path).trigger('change');;
        $(`#step${this.iframe_num}_element`).val(this.chosen_element).trigger('change');;
        $(`#step${this.iframe_num}_placement`).val(this.chosen_placement).trigger('change');;
    }


    clickFctn(event){
        //if popover clicked do nothing
        //if choose clicked save vars to form and exit iframe and remove popover
        var self = this;
        if(event.target.id == "choose_element"
            || event.target.parentNode.id == "choose_element"
            || event.target.parentNode.parentNode.id == "choose_element"){
            self.setCreateForm();
            self.resetChosenElement();
            $("#app_tour_iframe_modal").modal("hide");
        }
        //if exit clicked or outside of popover clicked or modal closed remove popover and reset vars to null
        else{
            self.resetChosenElement();
        }
    }


    getPlacement(element, event){
        var xpos = event.pageX;
        var ypos = event.pageY;
        var right = (xpos - $(element).offset().left)/ $(element).width();
        var left = 1 - right;
        var bottom = (ypos - $(element).offset().top)/ $(element).height();
        var top = 1 - bottom;
        var max_placement = Math.max(right,left,bottom,top);
        var placement = "top";
        if (right == max_placement){
            placement = "right";
        }else if(left == max_placement){
            placement = "left";
        }else if(top == max_placement){
            placement = "top";
        }else if(bottom == max_placement){
            placement = "bottom";
        }else placement = null;
        return placement;
    }


    getIFramePath(){
        return $('#app-tour-iframe').contents().get(0).location.pathname;
    }


    getElement(element) {
        var stack = [];
        while ( element.parentNode != null ) {
            var sibCount = 0;
            var sibIndex = 0;
            for ( var i = 0; i < element.parentNode.childNodes.length; i++ ) {
                var sib = element.parentNode.childNodes[i];
                if ( sib.nodeName == element.nodeName ) {
                    if ( sib === element ) {
                        sibIndex = (sibCount + 1);
                    }
                    sibCount++;
                }
            }
            if ( element.hasAttribute('id') && element.id != '' ) {
                stack.unshift(element.nodeName.toLowerCase() + '#' + element.id);
            }
            else if ( sibCount > 1 ) {
                stack.unshift(element.nodeName.toLowerCase() + ':nth-of-type(' + sibIndex + ')');
            }
            else {
                stack.unshift(element.nodeName.toLowerCase());
            }
            element = element.parentNode;
        }
        var css_path = stack.slice(1); // removes the html element
        css_path = ("" + css_path).replace(/,/g," ");
        css_path = css_path.substring(css_path.lastIndexOf("#"));
        return css_path;
  }



}

