//TODO: add arrow navigation to toggle menu
$(document).ready(function(){
    $(".alert" ).fadeOut(3000);
    //If  List Is Not Empty Shine Till Not Clicked
    if($('.list-content').length == 0){
        $('.company-square').css("-webkit-animation", "1s ease-out slideInBigSquare");
        $('.company-square').css("-moz-animation", "1s ease-out slideInBigSquare");
        $('.company-square').css("-ms-animation", "1s ease-out slideInBigSquare");
        $('.company-square').css("animation", "1s ease-out slideInBigSquare");
    }

    if($('.list-content').length  == 0 ){
                
        $('.shopping-list-out').css('opacity','0')
        $('.pageContentWrapper').css('margin-bottom','80px')
      
    }
    
    //If Width Less Then 1079 show list on the bottom if grater then 180 dont display if clicked is not true 
    $(window).resize(function(){
        if($(window).width() <= 1080){
            
           
            if($('.list-content').length  == 0 ){
                
                $('.shopping-list-out').css('opacity','0')
                $('.pageContentWrapper').css('margin-bottom','80px')
              
            }else{
               
                $('.center-shopping-list')
                    .css('display','block')
                    .css("-webkit-animation", "0.48s linear fade-in 0.5s")
                    .css('animation-fill-mode','forwards')
                    .css("-moz-animation", "0.48s linear fade-in 0.5s")
                    .css("-ms-animation", "0.48s linear fade-in 0.5s")
                $('.shopping-list-out')
                    .css("-webkit-animation", "0.5s linear toggle-shopping-list 0.1s")
                    .css('animation-fill-mode','forwards')
                    .css("-moz-animation", "0.5s linear toggle-shopping-list 0.1s")
                    .css("-ms-animation", "0.5s linear toggle-shopping-list 0.1s")
            }
            
        }else{
            //If button is not clicked close it
            $('.content-div-first-element').css("opacity", "0 ")
            if($('.company-square').attr('clicked') !='true'){
                $('.center-shopping-list').css('display', 'none');
                
                $(".shopping-list-out").css("-webkit-animation", "none");
                $(".shopping-list-out").css("-moz-animation", "none");
                $(".shopping-list-out").css("-ms-animation", " none");
                $(".shopping-list-out").css("animation", "none");
            }
            
        }
    
    })
     //ANCHOR
    function scrollToTopAnchor(an){
        let anchor =  $("div[name='"+ an +"']");
       
        console.log(anchor)
        $('html,body').animate({scrollTop: anchor.offset().top},'slow');
    }
    $('.anchor ').click(function(){
        if($('.anchor .anchor-button i').hasClass('fa-caret-down')){
            scrollToTopAnchor('shopping-list')
        }else{
            scrollToTopAnchor('nav-bar')
        }
    })

    var position = $(window).scrollTop();
    $(window).scroll(function (event) {
        let scroll = $(window).scrollTop();
        if(scroll>position)
            $('.anchor .anchor-button i').addClass('fa-caret-up').removeClass('fa-caret-down',100).css('color','white')
        else
            $('.anchor .anchor-button i').removeClass('fa-caret-up').addClass('fa-caret-down').css('color','white')
        
        position =scroll
       
    });
    //If Click Toggle List
    $('.company-square').click(function(){

        $('.company-square').attr('clicked','true')
            $('.company-square').css("-webkit-animation", "1s ease-out slideInBigSquare");
            $('.company-square').css("-moz-animation", "1s ease-out slideInBigSquare");
            $('.company-square').css("-ms-animation", "1s ease-out slideInBigSquare");
            $('.company-square').css("animation", "1s ease-out slideInBigSquare");

            $('.company-square p').addClass('p-color')
            $(".center-shopping-list").animate({width:'toggle', queue:false},'slow')
           
           if($('.company-square').css('right') =='350px'){
                $(".company-square").animate({right:'0px', queue:false},'slow')
                $(".square-shadow").animate({right:'0px', queue:false},'slow')
                $('.company-square').attr('clicked','false')
            }else{
                $(".company-square").animate({right:'350px', queue:false},'slow')
                $(".square-shadow").animate({right:'350px', queue:false},'slow')
            }
    })

    $(".stats-square").click(function(){
        $('.stats-shadow').css("-webkit-animation", "1s ease-out slideInBigSquare");
        $('.stats-shadow').css("-moz-animation", "1s ease-out slideInBigSquare");
        $('.stats-shadow').css("-ms-animation", "1s ease-out slideInBigSquare");
        $('.stats-shadow').css("animation", "1s ease-out slideInBigSquare");
        if($(this).css('right') == '130px'){
            $(this).animate({"right":"0px",queue:false},'slow')
            $(".stats-shadow").animate({right:'0px', queue:false},'slow')
            $('.position-statistics').animate({"right":"-135px",queue:false},'slow')
        }else{
            $(this).animate({"right":"130px",queue:false},'slow')
            $(".stats-shadow").animate({right:'130px', queue:false},'slow')
            $('.position-statistics').animate({"right":"0px",queue:false},'slow')
        }
    });
 

   $(window).click(function(event){
        var target = $( event.target );
        //Check If Clicked Outside Edit Form Box 
        if(target.is('.create-visit-form') || target.is('.center-form')){
            $('.close-form').hide();
            if(!$('#list-edit-form'))
                $('.center-form').closest('form').find("input").val('')
           
        }   
    })
    $('.div-element').click(function(){
        $('.openForm').show();
        $('.formEdit').attr('action', $(this).attr('action') )
        $('.treatmentNameEdit').val($(this).attr('treatmentName'))
        $('.treatmentPriceEdit').val(parseInt($(this).attr('treatmentPrice')))

    })
    $('.delete').click(function(){
        $(this).open_box( $('.hide-delete'))
    })
    $('.close').click(function(){
        $(this).close_box( $('.close-form'),$('.center-form'));
    })
    $('.create').click(function(){
       $(this).open_box($('.hidden-create'))
    })
    $('.showForm').click(function(){
        $(this).open_box($('.create-form'))
    })
    $('.create-brand-button').click(function(){
        $(this).open_box($('.create-brand-form'))
    })
   
    $(window).keyup(function(e){
        if(e.keyCode == 27){
            if(!$('#list-edit-form'))
                $('.form').closest('form').find("input").val('')
            $('.close-form').hide(); 
        }
    })

       //open window
    $.fn.open_box = function($box){
        $box.show();
    }
    $.fn.close_box = function($box,$clear_form){
        if(!$('#list-edit-form'))
            $clear_form.closest('form').find("input").val('')
        $box.hide();
    }
      
})

 //Slide Shopping List When Width Less Then 1079px
 $(document).on('resize scroll ', function() {
    $(this).EventIfInScreen()
})

$(document).ready(function(){
    $(this).EventIfInScreen()
    $(document).resize( function() {
        $(this).EventIfInScreen()
    })
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
$.fn.EventIfInScreen = function(){
    if ($(window).width() <=1080 &&$(this).isOnScreen()  ) {
       
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
   
  
    }else if($(window).width() <=1080 && !$(this).isOnScreen()) {
        $('.position-statistics').css("height", "0")//.css("-webkit-animation", "none");
        $('.shopping-list-out').css("height", "0")//.css("-webkit-animation", "none");
        $('.statistics .content').css("opacity", "0 ")//.css("-webkit-animation", "none");
        $(' .center-shopping-list').css("opacity", "0 ")//.css("-webkit-animation", "none");
    }
    if($(window).width() >=1081){
        $(' .shopping-list-out')
            .css("-webkit-animation", "none")
            .css("-moz-animation", "none")
            .css("-ms-animation", "none")
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


    return;
}
