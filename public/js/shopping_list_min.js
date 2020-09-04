 
  //If Width Less Then 1079 show list on the bottom if grater then 180 dont display if clicked is not true


 //Slide Shopping List When Width Less Then 1079px
 $(document).on('scroll ', function() {
    $(this).EventIfInScreen()
    //If Width Less Then 1079 show list on the bottom if grater then 180 dont display if clicked is not true 
})
$(window).resize( function() {
    $(this).EventIfInScreen()
    if($(window).width() <= 1080){
        $('.position-statistics .content')
            .css("-webkit-animation", "0.48s linear toggle-statistics-elements 0.6s")
            .css('animation-fill-mode','forwards')
            .css("-moz-animation", "0.48s linear toggle-statistics-elements 0.6s")
            .css("-ms-animation", "0.48s linear toggle-statistics-elements 0.6s")
        if($('.list-content').length  == 0 ){
            
            $('.shopping-list-out').css('display','none')
            $('.pageContentWrapper').css('margin-bottom','80px')
          
        }else{
            $(' .center-shopping-list').css('width','100%')
                .css("display","block")
            $('.shopping-list-out')
                .css("-webkit-animation", "0.5s linear toggle-shopping-list 0.1s")
                .css('animation-fill-mode','forwards')
                .css("-moz-animation", "0.5s linear toggle-shopping-list 0.1s")
                .css("-ms-animation", "0.5s linear toggle-shopping-list 0.1s")
               
        }
        
    } else{
        $('.statistics .content').css("opacity", "0")
            
            $(".shopping-list-out").css("-webkit-animation", "none");
            $(".shopping-list-out").css("-moz-animation", "none");
            $(".shopping-list-out").css("-ms-animation", " none");
            $(".shopping-list-out").css("animation", "none");
    }
})
$(document).ready(function(){
    $(this).EventIfInScreen()
 
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
        $('.center-shopping-list')
            .css("display","block")
        $('.shopping-list')
            .css("display","block")
        $('.position-statistics .content')
            .css("-webkit-animation", "0.48s linear toggle-statistics-elements 0.6s")
            .css('animation-fill-mode','forwards')
            .css("-moz-animation", "0.48s linear toggle-statistics-elements 0.6s")
            .css("-ms-animation", "0.48s linear toggle-statistics-elements 0.6s")
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
        $('.shopping-list-out').css("height", "0")
        $('.statistics .content').css("opacity", "0")
    }
    if($(window).width() >=1081){
        $('.statistics .content').css("opacity", "1")
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
