let comapnyForm = document.getElementById('comapnyForm');
let showForm = document.getElementById('showForm')
let close = document.getElementById('close')
let input = document.getElementById('input')

function showFormm(){
    comapnyForm.style.display = 'block'
    input.focus();     
}
 function closeForm (){
    comapnyForm.style.display = 'none'
}
function checkIfNull(){
    let select  =  document.getElementById('select');
    let myForm = document.getElementById('myForm')
    if(select.options.length != 0)
        myForm.style.display="block"    
}