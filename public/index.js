
function showFormm(){
    let comapnyForm = document.getElementById('comapnyForm');
    let input = document.getElementById('input')
    if(comapnyForm){
        comapnyForm.style.display = 'block'
        if(input)
            input.focus(); 
    }
}
 function closeForm (){
    let comapnyForm = document.getElementById('comapnyForm');
    if(comapnyForm){
        comapnyForm.style.display = 'none'
    }
}
//Edit form
function showEditForm( productName=null, productPrice=null, productCapacity=null, action,date=null){
   document.getElementById('editForm').action = action;
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

$( document ).ready(function() {
    $(".alert" ).fadeOut(3000); 
});
$(document).ready(function(){
    if( $("#myInputTreatment").val()=='')  $('#listTreatment li').hide()
    if( $("#myInput").val()=='')  $('#list li').hide()

    $("#myInput").on('keyup', function(){
        let value = $(this).val().toLowerCase()
        if (value.length == 0) 
            $('#list').hide();
        else
            $('#list').show();
        $('#list li').filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
             
            $(this).click(function(){
                $('#myInput').val($(this).text())
                $("#hiddenInput").val( $(this).attr('value'));
            })
        })
    })
    $("#myInputTreatment").on('keyup', function(){
      
        console.log($(this).val())
        let value = $(this).val().toLowerCase()
        if(value=='') $('#listTreatment li').css('display','none')
        if (value.length == 0) 
            $('#listTreatment').hide();
        else
            $('#listTreatment').show();
        

        $('#listTreatment li').filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
             
            $(this).click(function(){
                $('#myInputTreatment').val($(this).text())
                $("#hiddenInputTreatment").val( $(this).attr('value'));
            })
        })
    })
    
})