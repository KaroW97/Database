
function showFormm(){
    let comapnyForm = document.getElementById('comapnyForm');
    let visitForm = document.getElementById('visitForm');
    let input = document.getElementById('input')
    if(comapnyForm){
        comapnyForm.style.display = 'block';
        visitForm.style.display = 'block'
       // editForm.style.display = 'block'

        if(input)
            input.focus(); 
    }
}
 function closeForm (){
    let comapnyForm = document.getElementById('comapnyForm') ;
    let visitForm = document.getElementById('visitForm');
    if(comapnyForm){
        comapnyForm.style.display = 'none'
        visitForm.style.display = 'none'
       // editForm.style.display = 'none'

    }
}
//Edit form
function showEditForm( productName=null, productPrice=null, productCapacity=null, action,date=null){
   document.getElementById('editForm').action = action;
   console.log(action)
   let producttName = document.getElementById('productName') ;
   let producttPrice = document.getElementById('productPrice') ;
   let producttCapacity = document.getElementById('productCapacity') ;
   producttName.value  = productName
   producttPrice.value  = productPrice
   if(producttCapacity){
        producttCapacity.value  = productCapacity
   }
   document.getElementById('popUpPage').style.display ='block'
  
}
function closeEditForm(){
    let popUpPage = document.getElementById('popUpPage');
    popUpPage.style.display ='none';
}
////////////////////////////////
function checkIfNull(){
    let select  =  document.getElementById('select');
    let myForm = document.getElementById('myForm')
    if(select && select.options.length != 0)
        myForm.style.display="block"    
}

//TODO: add arrow navigation to toggle menu
$(document).ready(function(){
    $(".alert" ).fadeOut(3000); 

    //If  List Is Not Empty Shine Till Not Clicked
    if($('.list-content').length > 0){
        $('.company-square').addClass('list-content-shine')
        $('.company-square p').removeClass('p-color')
    }
   //If Click Toggle List
    $('.company-square').click(function(){
            $('.company-square').removeClass('list-content-shine')
            $('.company-square p').addClass('p-color ')
            $(".center-shopping-list").animate({width:'toggle', queue:false},400)
            if($('.company-square').css('right') =='350px'){
                $(".company-square").animate({right:'0px', queue:false})
                $(".square-shadow").animate({right:'0px', queue:false})
            }else{
                $(".company-square").animate({right:'350px', queue:false})
                $(".square-shadow").animate({right:'350px', queue:false})
            }

            $(".shopping-list")
                .css("box-shadow", "0px 3px 11px 2px rgba(0, 0, 0,1)")
                .css("-moz-box-shadow", "0px 3px 11px 2px rgba(0, 0, 0,1)")
                .css("-webkit-box-shadow", "0px 3px 11px 2px rgba(0, 0, 0,1)");
        
        })
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
        if (value.length == 0 || $('.list-client li').text().toLowerCase().indexOf(value) == -1) 
            $('.clients-list').hide()

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
            $('#comapnyForm').closest('form').find("input").val('')
            $('.openForm').hide();
           // $('.list li').hide()
           // $('.listTreatment li').hide()
        })
    $('.close').click(function(){
        $('.openForm').closest('form').find("input").val('')
        $('#comapnyForm').closest('form').find("input").val('')
        $('#visitForm').hide();
    })
    $('.list-client li').on('mouseover',function(){
            $(this).css('background-color','#F8F8F8')
    }).on('mouseout',function(){
        $(this).css('background-color','white')
    })
    
    $('.treatments-list li').on('mouseover',function(){
            $(this).css('background-color','#F8F8F8')
   
    }).on('mouseout',function(){
        $(this).css('background-color','white')
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
    
    //Control Shopping List Height
    var height =  $(window).height();
    $('.main-div-full-content   .center-shopping-list .shopping-list').css('height',`${height-314}px`)
    $('.content-div').css('max-height',`${height-314}px`)
   $(window).on('resize onload load',function(){
        var height =  $(window).height();
        $('.main-div-full-content   .center-shopping-list .shopping-list').css('height',`${height-314}px`)
        $('.visit-div').css('max-height',`${height-314}px`)
       
   })



})


/*$(document).ready(function(){

    $(".alert" ).fadeOut(3000); 
    //If  List Is Not Empty Shine Till Not Clicked
    if($('.list-content').length > 0){
        $('.company-square').addClass('list-content-shine')
        $('.company-square p').removeClass('p-color')
    }
   //If Click Toggle List
    $('.company-square').click(function(){
            $('.company-square').removeClass('list-content-shine')
            $('.company-square p').addClass('p-color ')
            $(".center-shopping-list").animate({width:'toggle', queue:false},400)
            if($('.company-square').css('right') =='350px'){
                $(".company-square").animate({right:'0px', queue:false})
                $(".square-shadow").animate({right:'0px', queue:false})
            }else{
                $(".company-square").animate({right:'350px', queue:false})
                $(".square-shadow").animate({right:'350px', queue:false})
            }

            $(".shopping-list")
                .css("box-shadow", "0px 3px 11px 2px rgba(0, 0, 0,1)")
                .css("-moz-box-shadow", "0px 3px 11px 2px rgba(0, 0, 0,1)")
                .css("-webkit-box-shadow", "0px 3px 11px 2px rgba(0, 0, 0,1)");
        
        })
    //Edit View
    $(".div-element").click(function(){
        //After Click Give Action
      $('.button').click(function(){
        $('.formEdit').attr('action',`/calendar/edit/${$('.div-element').attr('visitId')}?_method=PUT` )
      })
      
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
        $(".visitDate").val($('.div-element').attr('visitDate'))

        $('.myInput').on('keyup', function(){
            $('.myInput').val($(this).val())
            $(".hiddenInput").val( $('.myInput').val());  
        })
        $('.myInputTreatment').on('keyup', function(){
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
        console.log('clicked')
        let value = $(this).val().toLowerCase()
        if (value.length == 0 || $('.list-client li').text().toLowerCase().indexOf(value) == -1) 
            $('.clients-list').hide()
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
            $('#comapnyForm').closest('form').find("input").val('')
            $('.openForm').hide();
           // $('.list li').hide()
           // $('.listTreatment li').hide()
        })
    $('.close').click(function(){
        $('.openForm').closest('form').find("input").val('')
        $('#comapnyForm').closest('form').find("input").val('')
        $('#visitForm').hide();
    })
    $('.list-client li').on('mouseover',function(){
            $(this).css('background-color','#F8F8F8')
    }).on('mouseout',function(){
        $(this).css('background-color','white')
    })
    
    $('.treatments-list li').on('mouseover',function(){
            $(this).css('background-color','#F8F8F8')
   
    }).on('mouseout',function(){
        $(this).css('background-color','white')
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

        //Check If Clicked Outside Input 
        if(!target.is('.myInputTreatment'))
            $('.treatments-list').hide()
        else{
            let value = $('.myInputTreatment').val().toLowerCase()
            if($('.treatments-list li').text().toLowerCase().indexOf(value) != -1)
                $('.treatments-list').show()   
        }
       
        
    })
    
    //Control Shopping List Height
    var height =  $(window).height();
    $('.main-div-full-content  .center-shopping-list .shopping-list').css('height',`${height-314}px`)
    $('.content-div').css('max-height',`${height-314}px`)
   $(window).on('resize onload load',function(){
        var height =  $(window).height();
        $('.main-div-full-content  .center-shopping-list .shopping-list').css('height',`${height-314}px`)
        $('.content-div').css('max-height',`${height-314}px`)
       
   })



})
*/