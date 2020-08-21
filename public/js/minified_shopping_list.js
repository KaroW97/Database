   //Slide Shopping List When Width Less Then 1079px
$(document).on('resize scroll ', function() {
    $(this).EventIfInScreen()
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