
'use strict'
class GenerateTourStep{


    constructor(){
        this.iframe_num = null;
        this.dblclicked = false;
        this.chosen_path = null;
        this.chosen_element = null;
        this.chosen_placement = null;

        this.popover_content = `<div class="popover-content">
                                    <button id="choose_element" type="button" class="btn btn-primary">Choose</button>
                                    <button id="dont_choose_element" type="button" class="btn btn-danger">Exit</button>
                                </div>`
    }


    loadIFrame(){
        $("iframe").load(function(){
            //The iframe has loaded or reloaded.
            $("#app-tour-iframe").contents()
                .find("[data-toggle=popover]").popover('hide');
            $("#app-tour-iframe").contents().find(chosen_element)
                .removeAttr("data-toggle");
            this.dblclicked = false;
            this.chosen_path = null;
            this.chosen_element = null;
            this.chosen_placement = null;

            $("#app-tour-iframe").contents().find("*").dblclick(function(e) {
                //if not a current popup in the iframe add one
                if(this.dblclicked == true){
                    this.click_fctn(e);
                }
                else{
                    this.dblclick_fctn(this,e);
                }
                return false;
            });
        });
    }


    doubleClickedListener(){
        $("#app-tour-iframe").contents().find("*").dblclick(function(e) {
            //if not a current popup in the iframe add one
            if(dblclicked == true){
                click_fctn(e);
            }
            else{
                dblclick_fctn(this,e);
            }
            return false;
        });
    }


    dblclickFctn(){
        //set variables for this clicked location
        this.dblclicked = true;
        this.chosen_element = this.get_element(element);
        this.chosen_path = this.get_iframe_path();
        this.chosen_placement = this.get_placement(element, event);
        //create popover
        $("#app-tour-iframe").contents()
                .find(chosen_element).attr("data-toggle","popover");
         $("#app-tour-iframe").contents()
                .find("[data-toggle=popover]").popover({
                    placement: chosen_placement,
                    html: true,
                    trigger: "manual",
                    title:"Chosen Element",
                    content: this.popover_content
                });
         $("#app-tour-iframe").contents()
                .find("[data-toggle=popover]").popover('show');
    }


    clickFctn(e){
        //if popover clicked do nothing
        //if choose clicked save vars to form and exit iframe and remove popover
        if(e.target.id == "choose_element"){
            $(`#step${iframe_num}_path`).val(chosen_path);
            $(`#step${iframe_num}_element`).val(chosen_element);
            $(`#step${iframe_num}_placement`).val(chosen_placement);
            iframe_num = null;
            dblclicked = false;
            chosen_path = null;
            chosen_element = null;
            chosen_placement = null;
            $("#app-tour-iframe").contents()
                .find("[data-toggle=popover]").popover('hide');
            $("#app-tour-iframe").contents().find(chosen_element)
                .removeAttr("data-toggle");
            $('[data-dismiss=modal').click();
        }
        //if exit clicked or outside of popover clicked or modal closed remove popover and reset vars to null
        if(e.target.id == "dont_choose_element"){
            $("#app-tour-iframe").contents()
                .find("[data-toggle=popover]").popover('hide');
            $("#app-tour-iframe").contents().find(chosen_element)
                .removeAttr("data-toggle");
            dblclicked = false;
            chosen_path = null;
            chosen_element = null;
            chosen_placement = null;
        }
    }

    openIframeOnCLick(){
        $(document).on('click', '.app_tour_iframe_link', function(){
            this.iframe_num = $(this).parent().attr("id").slice(-1)
        });
    }


    uponClosingIFrame(){
        //if doubleclicked and modal goes away reset
        $("#app_tour_iframe_modal").on('hidden.bs.modal',function(){
            if(dblclicked){
                $(chosen_path).popover("hide");
                $("#app-tour-iframe").contents().find(chosen_path)
                .removeAttr("data-toggle").removeAttr("data-placement");
            }
            this.iframe_num = null;
            this.dblclicked = false;
            this.chosen_path = null;
            this.chosen_element = null;
            this.chosen_placement = null;
        });
    }


    get_placement(element, event){
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


    get_iframe_path(){
        return $('#app-tour-iframe').contents().get(0).location.pathname;
    }


    get_element(el) {
      var stack = [];
      while ( el.parentNode != null ) {
        var sibCount = 0;
        var sibIndex = 0;
        for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
          var sib = el.parentNode.childNodes[i];
          if ( sib.nodeName == el.nodeName ) {
            if ( sib === el ) {
              sibIndex = (sibCount + 1);
            }
            sibCount++;
          }
        }
        if ( el.hasAttribute('id') && el.id != '' ) {
          stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
        } else if ( sibCount > 1 ) {
          stack.unshift(el.nodeName.toLowerCase() + ':nth-of-type(' + sibIndex + ')');
        } else {
          stack.unshift(el.nodeName.toLowerCase());
        }
        el = el.parentNode;
      }

      var css_path = stack.slice(1); // removes the html element
      css_path = ("" + css_path).replace(/,/g," ");
      css_path = css_path.substring(css_path.lastIndexOf("#"));
      return css_path;
    }



}

