//TODO: add arrow navigation to toggle menu
if($('.list-content').length  == 0 && !$('div').hasClass('keep-shopping-list-on-top') ){
                
    $('.shopping-list-out').css('display','none')
    $('.pageContentWrapper').css('margin-bottom','80px')
  //  $('.statistics').css('bottom','90px')
  
}

$(window).resize(function(){
    if($('.list-content').length  == 0 && !$('div').hasClass('keep-shopping-list-on-top') && $(window).width() <=1080){
        //alert('jo')
    }
})
$(document).ready(function(){
    if($('.list-content').length  == 0 && !$('div').hasClass('keep-shopping-list-on-top') && $(window).width() <=1080){
        //alert('jo')
    }
    $(".alert" ).fadeOut(3000);
    //If  List Is Not Empty Shine Till Not Clicked
    if($('.list-content').length == 0){
        $('.company-square').css("-webkit-animation", "1s ease-out slideInBigSquare");
        $('.company-square').css("-moz-animation", "1s ease-out slideInBigSquare");
        $('.company-square').css("-ms-animation", "1s ease-out slideInBigSquare");
        $('.company-square').css("animation", "1s ease-out slideInBigSquare");
    }


    if($('.list-content').length  == 0 &&!$('div').hasClass('keep-shopping-list-on-top')){   
        $('.pageContentWrapper').css('margin-bottom','80px')
    }
   
     //ANCHOR
    function scrollToTopAnchor(an){
        let anchor =  $("div[name='"+ an +"']") ;
        if(anchor.length == 0)
             anchor = $("footer[name='"+ an +"']")
        $('html,body').animate({scrollTop: anchor.offset().top},'slow');
    }
    $('.anchor ').click(function(){
        if($('.anchor .anchor-button i').hasClass('fa-caret-down') ){
            if($('.shopping-list-out').css('display') == 'block')
                scrollToTopAnchor('shopping-list')
            else    
                scrollToTopAnchor('footer')
        }
        else {
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

           // $('.company-square p').addClass('p-color')
            //$(".center-shopping-list").animate({width:'toggle', queue:false},'slow')
           
           if($('.company-square').css('right') =='350px'){
            $(".center-shopping-list").animate({"right":"-356px",queue:false},'slow')
                $(".company-square").animate({right:'0px', queue:false},'slow')
                $(".square-shadow").animate({right:'0px', queue:false},'slow')
               
                $('.company-square').attr('clicked','false')
            }else{
                $(".center-shopping-list").animate({"right":"0px",queue:false},'slow')
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


