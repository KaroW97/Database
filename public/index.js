
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


$(document).ready(function(){
    $(".alert" ).fadeOut(3000); 

  
})