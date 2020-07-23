$(document).ready(function(){

    //Edit View
    $(".div-element").click(function(){
        //After Click Give Action
        //set Form action
        $('.formEdit').attr('action', $(this).attr('action') )
      
        $('.openForm').show();
        $(".myInput").val( $(this).attr('client'));
        $(".hiddenInput").val( $(this).attr('clientId'));
        $(".phone").val( $(this).attr('phone'));

        $(".myInputTreatment").val( $(this).attr('treatment'));
        $(".hiddenInputTreatment").val( $(this).attr('treatmentId'));
        $(".hiddenInput").attr('name', $(this).attr('clientState'))
       $(".hiddenInputTreatment").attr('name',$(this).attr('treatmentState'))

        $(".timeFrom").val( $(this).attr('timeFrom'));
        $(".timeTo").val( $(this).attr('timeTo'));
     
        $(".treatmentState").val( $(this).attr('treatmentState'))
        $(".clientState").val($(this).attr('clientState'))
        $(".visitDateEdit").val($(this).attr('visitDate'))
        
        $('.myInput').on('keyup ', function(){
            $('.myInput').val($(this).val())
            $(".hiddenInput").val( $('.myInput').val());  

        })
        $('.myInputTreatment').on('keyup ', function(){
            $('.myInputTreatment').val($(this).val())
            $(".hiddenInputTreatment").val( $('.myInputTreatment').val());
        })
    })
    $(".myInputTreatment").on('keyup click', function(){
        $('.treatments-list').show()
        let value = $(this).val().toLowerCase()
        if (value.length == 0 ||$('.treatments-list li').text().toLowerCase().indexOf(value) == -1) 
            $('.treatments-list').hide();
        
        $(".hiddenInputTreatment").attr('name','newTreatment')
        $(".treatmentState").val('newTreatment')
        $(".hiddenInputTreatment").val( $('.myInputTreatment').val());
        //filter treatment list
        $('.listTreatment li').filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            $(this).click(function(){
                $('.myInputTreatment').val($(this).text())
                //If Exists Name Treatmetn
                $(".treatmentState").val('treatment')
                $(".hiddenInputTreatment").attr('name','treatment')
                $(".hiddenInputTreatment").val( $('.myInputTreatment').val());
                $(".hiddenInputTreatment").val( $(this).attr('value'));
                $('.treatments-list').hide();
            
            })
        })
    
    })
    $(".myInput").on('keyup click', function(){
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
    })

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
         //Check If Clicked Outside Input 
        if(!target.is('.myInput'))
            $('.clients-list').hide()
        else{
            let value = $('.myInput').val().toLowerCase()
            if($('.clients-list li').text().toLowerCase().indexOf(value) != -1)
                $('.clients-list').show()     
        }
        //Check If Clicked Outside Input 
        if(!target.is('.myInputTreatment'))
            $('.treatments-list').hide()
        else{
            let value = $('.myInputTreatment').val().toLowerCase()
            if($('.treatments-list li').text().toLowerCase().indexOf(value) != -1)
                $('.treatments-list').show()   
        }
       
        
    })
    



})