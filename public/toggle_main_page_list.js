$(document).ready(function(){
    $(window).keyup(function(e){
        $(this).window($('.create-visit-form '),$('.center-form'),e)
        
    })
    //if clients write toggle elements on 
    $('.myInputSearch').on('keyup click input', function () {
        $(this).toggle_main_page_list($(this),  $('.main-div-full-content .visit '))
        
    })
  
    $(".my-input-new-list-name").on('keyup click ', function(){
        let value = $(this).val().toLowerCase()
    
        $(this).toggle_list_create_edit (
            $('.form-content .clients-list'),$(this),$('.ui-menu .ui-menu-item'))
    })

    //Search
    $.fn.search_list_settings = function($list ,$list_li,$input){
        //$list.show()
        let value = $(this).val().toLowerCase()
        if (value.length == 0 || $list_li.text().toLowerCase().indexOf(value) == -1) 
            $list.hide()

        $list_li.filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            $(this).click(function(){
                $input.val($(this).text())
                $list.hide();
            })
        })
    }
    ///Create Form
    $.fn.toggle_list_create_edit = function($form_content, $input, $list_client) {
            //$form_content.show()
            let value =$(this).val().toLowerCase()
            if (value.length == 0 || $list_client.text().toLowerCase().indexOf(value) == -1) 
                $form_content.hide()
            $list_client.filter(function(){
              
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                $(this).click(function(){
                    $input.val($(this).text())
                  
                })
            })
            return this
    
    }

    //toggle main page on search 
    $.fn.toggle_main_page_list = function($input,$visits){
        let value = $input.val().toLowerCase();
        $visits.filter(function(){
           $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
       })  
    }
    
    $.fn.window = function($close_form,$clear_form, $e){
        if($e.keyCode == 27){
            $clear_form.closest('form').find("input").val('')
            $close_form.hide();
          
        }
    }
   //CLIENT
   var brand = [], shopping_element = [],treatmentCreate = [], clientsCreate = []
   $('.list-client li').filter(function(){
       clientsCreate.push({value:$(this).text(),phone:$(this).attr('phone') })
   })
   $(function(){
       $( ".client-search" ).autocomplete({
           source: clientsCreate,
           autoFocus:true
       });
   })
   //TREATMANT
   $('.listTreatment li').filter(function(){
       treatmentCreate.push($(this).text())
   })
   $(function(){
       $( ".treatment-search" ).autocomplete({
           source: treatmentCreate,
           autoFocus:true
       });
   })
   //BRAND
   $('.brand li').filter(function(){
       brand.push({value:$(this).text()})
   })
   $(function(){
       $( ".brand-search" ).autocomplete({
           source: brand,
           autoFocus:true
       });
   })
   $(function(){
       $( ".create-brand" ).autocomplete({
           source: brand,
           autoFocus:true
       });
   })
   $('.shopping-elements-list li').filter(function(){
    shopping_element.push({value:$(this).text()})
   })
   $(function(){
       $( ".shopping-search" ).autocomplete({
           source: shopping_element,
           autoFocus:true
       });
   })
   $('.ui-menu').on('click',function(){
        $(".myInputSearch").trigger('click')
    })
   
   //Slide Shopping List When Width Less Then 1079px
   $(window).on('resize scroll load', function() {
    if ($(window).width() <1080 &&$(this).isOnScreen()  ) {
        $('.content-div-first-element')
            .css("-webkit-animation", "0.48s linear fade-in 0.67s")
            .css('animation-fill-mode','forwards')
            .css("-moz-animation", "0.48s linear fade-in 0.67s")
            .css("-ms-animation", "0.48s linear fade-in 0.67s")
    
        $('.content-div-sec-element')
            .css("-webkit-animation", "0.48s linear fade-in 0.67s")
            .css('animation-fill-mode','forwards')
            .css("-moz-animation", "0.48s linear fade-in 0.67s")
            .css("-ms-animation", "0.48s linear fade-in 0.67s")
    
        $('.statistics .content')
            .css("-webkit-animation", "0.48s linear fade-in 0.67s")
            .css('animation-fill-mode','forwards')
            .css("-moz-animation", "0.48s linear fade-in 0.67s")
            .css("-ms-animation", "0.48s linear fade-in 0.67s")
      
        $('.center-shopping-list')
            .css("-webkit-animation", "0.48s linear fade-in 0.5s")
            .css('animation-fill-mode','forwards')
            .css("-moz-animation", "0.48s linear fade-in 0.5s")
            .css("-ms-animation", "0.48s linear fade-in 0.5s")
    
      $('.position-statistics')
            .css("-webkit-animation", "0.4s linear toggle-statistics 0.7s")
            .css('animation-fill-mode','forwards')
            .css("-moz-animation", "0.4s linear toggle-statistics  0.7s")
            .css("-ms-animation", "0.4s linear toggle-statistics  0.7s")
  
        $('.shopping-list-out')
            .css("-webkit-animation", "0.5s linear toggle-shopping-list 0.1s")
            .css('animation-fill-mode','forwards')
            .css("-moz-animation", "0.5s linear toggle-shopping-list 0.1s")
            .css("-ms-animation", "0.5s linear toggle-shopping-list 0.1s")
   
  
    }else if($(window).width() <1080 && !$(this).isOnScreen()) {
        $('.position-statistics').css("height", "0")//.css("-webkit-animation", "none");
        $('.shopping-list-out').css("height", "0")//.css("-webkit-animation", "none");
        $('.statistics .content').css("opacity", "0 ")//.css("-webkit-animation", "none");
        $(' .center-shopping-list').css("opacity", "0 ")//.css("-webkit-animation", "none");
    }
    if($(window).width() >=1080){
        $(' .shopping-list-out')
            .css("-webkit-animation", "none")
            .css("-moz-animation", "none")
            .css("-ms-animation", "none")
        $('.center-shopping-list') 
            .css("-webkit-animation", "none")
            .css("-moz-animation", "none")
            .css("-ms-animation", "none")
        $('.center-shopping-list').css('opacity','1')
    }
})

$.fn.isOnScreen = function(){
    var win = $(window);
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
    var bounds = $('.statistics').offset() ;
    bounds.right = bounds.left +  $(this).outerWidth();
    bounds.bottom = bounds.top +  $(this).outerHeight();
    
    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
};



})