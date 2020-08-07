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
    //If Width Less Then 1079 show list on the bottom if grater then 180 dont display if clicked is not true 
    $(window).resize(function(){
        if($(window).width() <= 1079){
            $(".center-shopping-list").css('display','block')
        }else{
            //If button is not clicked close it
            if($('.company-square').attr('clicked') !='true'){
                $(".center-shopping-list").css('display','none')
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
            $(".center-shopping-list").animate({width:'toggle', queue:false},400)
           
           if($('.company-square').css('right') =='350px'){
                $(".company-square").animate({right:'0px', queue:false})
                $(".square-shadow").animate({right:'0px', queue:false})
                $('.company-square').attr('clicked','false')
            }else{
                $(".company-square").animate({right:'350px', queue:false})
                $(".square-shadow").animate({right:'350px', queue:false})
            }
    })
    

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
        console.log('jestem')
        $(this).open_box($('.create-form'))
    })
    $('.create-brand').click(function(){
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


