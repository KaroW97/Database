
function showFormm(){
    let comapnyForm = document.getElementById('comapnyForm');
    let input = document.getElementById('input')
    if(comapnyForm){
        comapnyForm.style.display = 'block'
        if(input)
            input.focus(); 
    }
}
function showClientt(){
    let showClient = document.getElementById('showClient')
    let clientSelect = document.getElementById('clientSelect')
    if(showClient) {
        clientSelect.style.display = 'block'
    }
}
 function closeForm (){
    let comapnyForm = document.getElementById('comapnyForm');
    if(comapnyForm){
        comapnyForm.style.display = 'none'
    }
}
function checkIfNull(){
    let select  =  document.getElementById('select');
    let myForm = document.getElementById('myForm')
    if(select && select.options.length != 0)
        myForm.style.display="block"    
}


