const deleteClass = (id) =>{
    const floating = getElementById(id);
    floating.classList.remove('pulse')
}
const getElementById = (elementId) => document.getElementById(elementId)
 document.addEventListener('DOMContentLoaded', function() {
    var modal = document.querySelectorAll('.modal');
    M.Modal.init(modal, {});
    var datepicker  = document.querySelectorAll('.datepicker');
    M.Datepicker.init(datepicker, {
        container:document.getElementsByTagName("BODY")[0],
        autoClose:true,
        firstDay:1,
        format: 'yyyy-mm-dd',
        disableDayFn:(e)=>{
            
           return e.toString().slice(0,3) === 'Sun'
        }
    });
    var timepicker = document.querySelectorAll('.timepicker');
    M.Timepicker.init(timepicker, {
        container:'body',
        twelveHour:false,
        vibrate:true
    });
    var floating_btn = document.querySelectorAll('.fixed-action-btn'); //floating button initialization
     M.FloatingActionButton.init(floating_btn, {});
    var sidenavbar = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenavbar, {});
    var collapsible = document.querySelectorAll('.collapsible');
    M.Collapsible.init(collapsible, {});
    var dropdown_trigger = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdown_trigger, {});
    //Client Form 
    let client = getElementById("clientName-1");
    if(client){
        client.addEventListener('input', function(e){
            add_number_to_input(e, 1, 'createVisit')
        })
        getElementById('clientName-2').addEventListener('input', function(e){
            add_number_to_input(e, 2, 'visit')
        })
    }
    const add_number_to_input = (e, nr, form_id) =>{   //take care of adding number just after choosing right client 
        const val = document.querySelectorAll(`#clientOptions-${nr} option[value="${e.target.value}"]`)
        if(val.length === 1 ){
            getElementById(`phoneNumber-${nr}`).select();
            getElementById(`phoneNumber-${nr}`).value = val[0].innerText
        }else if(val.length > 1 ){                                           //if there is more clients with the same name informa about that and force to choose number 
                getElementById(`phoneNumber-${nr}`).select()                    //select number input atiomaticly
                getElementById(`phoneNumber-${nr}`).value =''
                const create_section = document.createElement('section')        //create section
                const create_p = document.createElement('p')                    //create p tag and then fill it
                create_p.innerText = 'Wykryto więcej klientów o tym imieniu '   
                create_section.appendChild(create_p)                            //append it to section and then add class
                create_section.classList.add('info-alert')       
            
                const datalist = document.createElement('datalist')
                datalist.id = `phoneNumbers-${nr}`
                val.forEach(value =>{
                        const option = document.createElement('option')
                        option.value = value.innerText
                        option.label = value.value
                        datalist.appendChild(option)
                })
            
            getElementById('createVisit').appendChild(datalist)
            getElementById('container').prepend(create_section)
        
        }
    }


});
var value = false
const edit_client = (arg) =>{
    value = !value
    var e = document.getElementsByClassName('pTag')
    let inputs = document.getElementsByClassName('disabled')
    let textarea = document.getElementsByClassName('textarea')
    let add_input_field = document.getElementsByClassName('add-input-field')
    let button = document.getElementsByClassName('submit')
    let header  = document.getElementsByClassName('name')
    let header_content = document.getElementsByClassName('header-content')
    if( value === true){
        button[0].style.display = 'block'
        header_content[0].classList.remove('flex-content')
        header_content[0].classList.add('col','s12')
        header[0].classList.add('col', 's12', 'm6', 'l6', 'xl6')
        header[1].classList.add('col', 's12', 'm6', 'l6', 'xl6')
        let create_label = document.createElement('label')
        let create_label2 = document.createElement('label')
        create_label.setAttribute('for','client-name')
        create_label2.setAttribute('for','lastName')
        create_label.innerText = 'Imie'
        header[0].append(create_label)
        create_label2.innerText = 'Nazwisko'
        header[1].append(create_label2)
        Array.from(e).forEach(tag =>{
            var d = document.createElement('input');
            d.value = tag.innerText;
            d.classList = tag.classList
            d.id = tag.id
            d.name = tag.getAttribute('name')
            d.type="text"
            tag.parentNode.replaceChild(d, tag)
       
            if(d.classList.contains('dateTag')){
                d.classList.add('datepicker')
                var elems = document.querySelectorAll('.datepicker');
                var instances = M.Datepicker.init(elems, {
                    container:document.getElementsByTagName("BODY")[0],
                    autoClose:true,
                    firstDay:1,
                    format: 'yyyy-mm-dd',
                });       
            }
            
        }); 
        Array.from(inputs).forEach(input =>{
            input.disabled =false
        })
        Array.from(textarea).forEach(textarea =>{
            textarea.readOnly = false
        })
        Array.from(add_input_field).forEach(input=>{
            input.getElementsByTagName('input')[0].select()
            input.classList.add('input-field')
        })
        add_input_field[0].getElementsByTagName('input')[0].select()
    }else{
        
        header_content[0].classList.remove('col','s12','input-field')
        header_content[0].classList.add('flex-content')
        header[0].classList.remove('col', 's12', 'm12', 'l6', 'xl6')
        header[1].classList.remove('col', 's12', 'm12', 'l6', 'xl6')
        button[0].style.display = 'none'
        header[0].getElementsByTagName('label')[0].remove()
        header[1].getElementsByTagName('label')[0].remove()
  
        alert_box( 'Jeśli nie zapisałeś danych zostaną one usunięte '  )
        Array.from(e).forEach(tag =>{
            if(tag.getAttribute('type') === 'text' ){
                var d = document.createElement('p');
                tag.value === '' ?  d.innerText ='-' :  d.innerText = tag.value;
                d.classList = tag.classList
                d.id = tag.id
                tag.parentNode.replaceChild(d, tag)
          
            }  
        });
        Array.from(inputs).forEach(input =>{ 
            input.disabled =true
        })
        Array.from(textarea).forEach(textarea =>{ 
            textarea.readOnly =true
        })
        Array.from(add_input_field).forEach(input=>{
            input.classList.remove('input-field')
        })
    }
}
const alert_box = (message) =>{
    const create_section = document.createElement('section')        //create section
        const create_p = document.createElement('p')                    //create p tag and then fill it
        create_p.innerText = message 
        create_section.appendChild(create_p)                            //append it to section and then add class
        create_section.classList.add('info')     
        getElementById('container').prepend(create_section)
}
const edit_form_client_visit = (id, nr) =>{
    fetch(`/clients/edit-visit/${id}`)
    .then(res => res.json())
    .then(data =>{
        getElementById('edit_client_visit').setAttribute('action', `/clients/client-view/${id}/editPost?_method=PUT`)
        getElementById(`clientVisitDate-${nr}`).select();
        getElementById(`clientVisitDate-${nr}`).value = data.clientVisitDate.split('T')[0]
        getElementById(`treatmentOptions_${nr}`).select();
        getElementById(`treatmentOptions_${nr}`).value = data.treatment
        getElementById(`diagnose-${nr}`).select();
        getElementById(`diagnose-${nr}`).value = data.comment
        getElementById(`shopping-${nr}`).select();
        getElementById(`shopping-${nr}`).value = data.shopping
    })

}
const edit_form = (id) =>{    //fetch data about prev created visit
    fetch(`/calendar/${id}`)
    .then(res => res.json())
    .then(data =>{
        
    getElementById('visit-form').setAttribute('action', `/calendar/edit/${id}?_method=PUT`)
    getElementById('clientName-2').select();
    getElementById('clientName-2').value = data.clientName
    getElementById('phoneNumber-2').select();
    getElementById('phoneNumber-2').value = data.phoneNumber
    getElementById('treatmentName-2').select();
    getElementById('treatmentName-2').value = data.treatment

    getElementById('data-2').select();
    getElementById('data-2').value = data.visitDate.split('T')[0]

    getElementById('timeFrom-2').select();
    getElementById('timeFrom-2').value = data.timeFrom

    getElementById('timeTo-2').select();
    getElementById('timeTo-2').value = data.timeTo

    
    })
}  



   
     
      


