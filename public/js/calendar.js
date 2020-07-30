$(document).ready(function(){


    //Edit View
    $(".div-element").click(function(){
        //After Click Give Action
        //set Form action
        $('.formEdit').attr('action', $(this).attr('action') )
      
        $('.openForm').show();
        $(".inputEdit").val( $(this).attr('client'));
       
        $(".phone").val( $(this).attr('phone'));

        $(".inputEditTreatment").val( $(this).attr('treatment'));
        $(".timeFrom").val( $(this).attr('timeFrom'));
        $(".timeTo").val( $(this).attr('timeTo'));
        $(".visitDateEdit").val($(this).attr('visitDate'))
  
    })


  
   /* $(".myInput").on('keyup click', function(){
        $('.clients-list').show()
        let value = $(this).val().toLowerCase()
        if (value.length == 0 || $('.list-client li').text().toLowerCase().indexOf(value) == -1){  
            $('.clients-list').hide()
        }
        $(".clientState").val('newClient')
        $(".hiddenInput").attr('name','newClient')
        $(".hiddenInput").val( $('.myInput').val());
         //filter client list
       
        $('.list-client li').filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
           
            $(this).click(function(){
                $('.phone').val($(this).attr('phone'))
                $('.myInput').val($(this).text())
                $(".clientState").val('clients')
                $(".hiddenInput").attr('name','clients')
                $(".hiddenInput").val( $(this).attr('value'));
                $('.clients-list').hide();
                
            })
        })
    })*/
  /*  $('.inputCreate').on('keydown',function(e){
        $(".myInput").on('keyup',function(){
            $('.clients-list').show()
        })
        let list =  $('.create ul.list li')
              console.log('-------------') 
        let list_new = list
       // console.log(list)
        $(this).ArrowFilterLi($('.create ul.list'),$('.create ul.list'),e,list)
      //  
       
      
    })

    $.fn.ArrowFilterLi = function($list, $scroll,$e,$li){
        let $listElement = $li

        //console.log('list element')
      
        let key = $e.keyCode,
        $currentElement,
        $selected = $listElement.filter('.selected');
       // console.log( $listElement )
       // console.log('selected')
       // console.log($selected)
       // console.log('---------------------')
        
        if(key != 40 && key != 38) return; //if not arrow down or up return
        $listElement.removeClass('selected')
        if(key==40){ //down 
            if(!$selected.length || $selected.is(':last-child')){
                $currentElement = $listElement.eq(0);
                $list.scrollTop(0)
                if(key ==	13){
                    $('.inputCreate').val($currentElement.text())
                    $('.hiddenInput').val($currentElement.attr('value'))
                }
              
            }else{
                $currentElement =  $selected.next();
                $list.scrollTop($scroll.scrollTop()+34)
                console.log($currentElement.text())
                console.log($currentElement.attr('value'))
                if(key ==	13){
            
                    $('.inputCreate').val($currentElement.text())
                    $('.hiddenInput').val($currentElement.attr('value'))
                }
            }
        }
        else if(key==38){ //up
            if(!$selected.length || $selected.is(':first-child')){
                $currentElement = $listElement.last();
                $list.scrollTop( $listElement.last().offset().top)
                console.log(key)
                if(key ==	13){
                    $('.inputCreate').val($currentElement.text())
                    $('.hiddenInput').val($currentElement.attr('value'))
                }
            }else{
                $currentElement =  $selected.prev();
                $list.scrollTop( $scroll.scrollTop()-34)  
                if(key ==	13){
                    $('.inputCreate').val($currentElement.text())
                    $('.hiddenInput').val($currentElement.attr('value'))
                }
            }
        }
        $currentElement.addClass('selected');

    }*/

   
    $(".showForm").click(function(){
        $('#visitForm').show();
    })
    $('.closeEdit').click(function(){
            $('.openForm').closest('form').find("input").val('')
            $('.create-visit-form').closest('form').find("input").val('')
            $('.openForm').hide();
        })
    $('.close').click(function(){
        $('.openForm').closest('form').find("input").val('')
        $('.create-visit-form').closest('form').find("input").val('')
        $('.create-visit-form').hide();
    })

    //If ESC Clicked Close Edit/Create Visit
    $(window).keyup(function(e){
        if(e.keyCode == 27){
            $('.openForm').closest('form').find("input").val('')
            $('#comapnyForm').closest('form').find("input").val('')
            $('#visitForm').hide();
            $('.openForm').hide();
        }
    })
    $(window).click(function(event){
        var target = $( event.target );
         //Check If Clicked Outside Edit Form Box 
        if(target.is('.create-visit-form') || target.is('.center-form')){
            $('.create-visit-form').hide();
            $('.openForm').closest('form').find("input").val('')
            $('#comapnyForm').closest('form').find("input").val('')
        }

       
        
    })
    
 


})