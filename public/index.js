
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


