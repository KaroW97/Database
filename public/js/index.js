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
      //  disableDayFn:(e)=>{
       //   return e.toString().slice(0,3) === 'Sun'
       // }
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
    M.Dropdown.init(dropdown_trigger, {
        constrainWidth:false
    });
    

    /*
    *Search inforamtions in main contents
    */
    let myInputSearch = document.getElementsByClassName('myInputSearch')[0]
    if(myInputSearch){
        const filterRow = ()=>{
            let info_card = document.querySelectorAll('.top-separator');
            [...info_card].filter(e=>{
                !e.querySelector('.search-by').getAttribute('data-value').toLowerCase().includes(myInputSearch.value.toLowerCase()) ?
                    e.style.display ='none' : e.style.display ='block'   
            })
        }
        myInputSearch.addEventListener('keyup',(e)=>{
            filterRow()
        })
        myInputSearch.addEventListener('click',(e)=>{
            filterRow()
        })
    }
    var elems = document.querySelectorAll('.chips-autocomplete');
    const input = document.getElementById('chips-input')
    if(elems && input){
    
        let input_value = []
        M.Chips.init(elems, {
            autocompleteOptions: {
                limit: Infinity,
            },
            placeholder: 'Pordukty',
            secondaryPlaceholder: ' ',
            onChipAdd: (event, chip) => {
                input_value =[];
                event[0].M_Chips.chipsData.forEach(elem=>{
                    input_value.push(elem.tag)
                })
                input.setAttribute('value',input_value)
            },
            onChipDelete:(event, chip)=>{
                input_value =[];
                event[0].M_Chips.chipsData.forEach(elem=>{
                    input_value.push(elem.tag)
                })
                input.setAttribute('value',input_value)
            }
        });
    }
    const input_list = document.getElementById('chips-input-list-product')
    if(elems && input_list){
    
        let input_value = []
        M.Chips.init(elems, {
            autocompleteOptions: {
                limit: Infinity,
            },
            placeholder: 'Pordukty (nazwa, cena, ilość)',
            secondaryPlaceholder: ' ',
            onChipAdd: (event, chip) => {
                input_value =[];
                event[0].M_Chips.chipsData.forEach(elem=>{
                    input_value.push(elem.tag)
                })
                input.setAttribute('value',input_value)
            },
            onChipDelete:(event, chip)=>{
                input_value =[];
                event[0].M_Chips.chipsData.forEach(elem=>{
                    input_value.push(elem.tag)
                })
                input.setAttribute('value',input_value)
            }
        });
    }
    /*
    * Autocomplete Event Listeners
    */
    let searchby1 = document.querySelector('#searchby-1') 
    let searchby2 = document.querySelector('#searchby-2')
    let search2 = document.querySelector('#search2') 
    let client1 = document.querySelector('#search-1')
    let client_search = document.querySelector('#client-search')
  
    if(searchby1){
        let searchedElement = document.querySelector('#options-1');
        let templateContent = document.querySelector('#searchTemplate1-1').options;
        searchby1.addEventListener('keyup', function handler(event) {
            
            autocomplete(searchby1, searchedElement, templateContent, false, false )
        });
        searchby1.addEventListener('click', function handler(event) {
            autocomplete(searchby1, searchedElement, templateContent, false, true )
        })
        searchby1.addEventListener('keypress', (e)=>{
            if(e.key === 'Enter'){
                searchedElement.blur()
            }
        })
        let price = getElementById('price-1')
        if(price){
            searchby1.addEventListener('input', function(e){
                add_price_to_input(e,1)
            })
            searchby1.addEventListener('keydown', function(e){
                if(e.keyCode  === 8){
                    getElementById(`price-1`).setAttribute('value',0)
                }
            })
           
        }
    }
    if(searchby2){
        let searchedElement = document.querySelector('#options-2');
        let templateContent = document.querySelector('#searchTemplate1-2').options;
        searchby2.addEventListener('keyup', function handler(event) {
            autocomplete(searchby2, searchedElement, templateContent, false, false )
        });
        searchby2.addEventListener('click', function handler(event) {
            autocomplete(searchby2, searchedElement, templateContent, false, true )
        })
        searchby2.addEventListener('keypress', (e)=>{
            if(e.key === 'Enter'){
                searchedElement.blur()
            }
        })
        let price2 = getElementById('price-2')
        if(price2){
            searchby2.addEventListener('input', function(e){
                add_price_to_input(e,2)
            })
            searchby2.addEventListener('keydown', function(e){
                if(e.keyCode  === 8){
                    getElementById(`price-2`).setAttribute('value',0)
                }
            })
            
        }
    }
    if(search2){
        let searchedElement = document.querySelector('#searchedElement2');
        let templateContent = document.querySelector('#searchTemplate2').options;
        search2.addEventListener('keyup', function handler(event) {
            autocomplete(search2, searchedElement, templateContent, false, false )
        });
        search2.addEventListener('click', function handler(event) {
            autocomplete(search2, searchedElement, templateContent, false, true )
        })
        search2.addEventListener('keypress', (e)=>{
            if(e.key === 'Enter'){
                searchedElement.blur()
            }
        })
    }
    if(client1 || client_search){
        var searchedElement = document.querySelector('#clientOptions-1');
        var templateContent = document.querySelector('#searchTemplate-1').options;
        if(client_search){
            client_search.addEventListener('keyup', function handler(event) {
                autocomplete(client_search, searchedElement, templateContent, false, false )
            })
            client_search.addEventListener('click', function handler(event) {
                autocomplete(client_search, searchedElement, templateContent, false, true )
            })
        } else{
            client1.addEventListener('keyup', function handler(event) {
                autocomplete(client1, searchedElement, templateContent, true, false )
            })
            client1.addEventListener('click', function handler(event) {
                autocomplete(client1, searchedElement, templateContent, true, true)
            })
            client1.addEventListener('input', function(e){
                add_number_to_input(e, 1)
            })
        }
    }
});

/*
*Client Form, add number to phone input
* Take care of adding number just after choosing right client
*/ 
const add_number_to_input = (e, nr) =>{             //take care of adding number just after choosing right client 
    const val = document.querySelectorAll(`#clientOptions-${nr} option[value="${e.target.value}"]`)
    if(val.length === 1 ){
        getElementById(`phoneNumber-${nr}`).select();
        getElementById(`phoneNumber-${nr}`).value = val[0].innerText
    }else if(val.length > 1 ){          
                                        //if there is more clients with the same name informa about that and force to choose number 
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
/*
* Add price of the treatemtn to hidden input
*/ 
const add_price_to_input = (e, nr) =>{
    const val = document.querySelectorAll(`#searchTemplate1-${nr}  option[value="${e.target.value}"]`)
 
    if(val[0] !=undefined){
        getElementById(`price-${nr}`).setAttribute('value',val[0].getAttribute('data-value'))
    }
       
}
/*
* Autocomplete Function
*/
const autocomplete = (element, searchedElement, templateContent, addInnerHtml, clicked) =>{
    if(clicked === true){
       
        Array.from(templateContent).forEach(e=>{
            let option = document.createElement('option')
         
            if(searchedElement.options.length < 4 && searchedElement.options.length < templateContent.length){
                option.value = e.value
                if(addInnerHtml === true){
                    option.innerText = e.innerText
                    option.setAttribute('data-value', e.getAttribute('data-value'))
                }
                    
                searchedElement.append(option);
               
            }
        })
    }else{
   
            
        while (searchedElement.children.length) searchedElement.removeChild(searchedElement.firstChild);
        var inputVal= element.value.trim().toLowerCase()
        Array.from(templateContent).forEach(e=>{
            let eToLower = e.value.toLowerCase();
            let option = document.createElement('option')
            if(searchedElement.options.length < 4 && eToLower.includes(inputVal)){
                option.value = e.value
                if(addInnerHtml === true)
                    option.innerText = e.innerText
                searchedElement.append(option);
            }
        })
    }
   

}
/* 
 * Fetch data about prev created visit CALENDAR
*/
const edit_form = (id) =>{ 
    let search2 = document.querySelector('#search-2')
    var searchedElement = document.querySelector('#clientOptions-2');
    var templateContent = document.querySelector('#searchTemplate-2').options;

    search2.addEventListener('keyup', function handler(event) {
        autocomplete(search2, searchedElement, templateContent, true, false )
    }); 
    search2.addEventListener('click', function handler(event) {
      
        autocomplete(search2, searchedElement, templateContent, true, true )
    });  
  
    getElementById('search-2').addEventListener('input', function(e){   
        add_number_to_input(e, 2)
    })
    fetch(`/calendar/${id}`)
    .then(res => res.json())
    .then(data =>{
    getElementById('visit-form').setAttribute('action', `/calendar/edit/${id}?_method=PUT`)
    getElementById('search-2').select();
    getElementById('search-2').value = data.clientName
    getElementById('phoneNumber-2').select();
    getElementById('phoneNumber-2').value = data.phoneNumber
    getElementById('searchby-2').select();
    getElementById('searchby-2').value = data.treatment
 
    
    getElementById('data-2').select();
    getElementById('data-2').value = data.visitDate.split('T')[0]

    getElementById('timeFrom-2').select();
    getElementById('timeFrom-2').value = data.timeFrom

    getElementById('timeTo-2').select();
    getElementById('timeTo-2').value = data.timeTo

    
    })
}  
/*
* Edit client form CLIENT
*/
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

        Array.from(header).forEach(h=>h.classList.add('col', 's12', 'm6', 'l6', 'xl6'))
    
        let create_label = document.createElement('label')
        let create_label2 = document.createElement('label')
        create_label.setAttribute('for','client-name')
        create_label2.setAttribute('for','lastName')
        create_label.innerText = 'Imie'
        create_label2.innerText = 'Nazwisko'
        header[0].append(create_label)
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
        Array.from(header).forEach(h=>{
            h.classList.remove('col', 's12', 'm6', 'l6', 'xl6')
            h.getElementsByTagName('label')[0].remove()
        })
        button[0].style.display = 'none'
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

/* 
* Dynamic Alert box
*/
const alert_box = (message) =>{
    const create_section = document.createElement('section')          //create section
        const create_p = document.createElement('p')                    //create p tag and then fill it
        create_p.innerText = message 
        create_section.appendChild(create_p)                            //append it to section and then add class
        create_section.classList.add('info')     
        getElementById('container').prepend(create_section)
}

/*
 * Fetch client data CLIENT
 */
const edit_form_client_visit = (id, nr) =>{
    fetch(`/clients/edit-visit/${id}`)
    .then(res => res.json())
    .then(data =>{
        getElementById('edit_client_visit').setAttribute('action', `/clients/client-view/${id}/editPost?_method=PUT`)
        getElementById(`clientVisitDate-${nr}`).select();
        getElementById(`clientVisitDate-${nr}`).value = data.clientVisitDate.split('T')[0]
        getElementById(`searchby-${nr}`).select();
        getElementById(`searchby-${nr}`).value = data.treatment
        getElementById(`price-${nr}`).setAttribute('value',data.price) 
        getElementById(`diagnose-${nr}`).select();
        getElementById(`diagnose-${nr}`).value = data.comment
        getElementById(`shopping-${nr}`).select();
        getElementById(`shopping-${nr}`).value = data.shopping
    })

}


/*
* Updating treatment, displaying label
*/
const edit_treatment = (products_for_treatment) =>{
    value = !value
    let e = document.getElementsByClassName('pTag')
    let add_input_field = document.getElementsByClassName('add-input-field')
    let header  = document.getElementsByClassName('treatmentName')
    let textarea = document.getElementsByClassName('textarea')
    let add_chips_input = document.getElementsByClassName('add-chips-input')
    let add_auto_chips = document.getElementsByClassName('init')
    const input = document.getElementById('chips-input')
    let button = document.getElementsByClassName('submit')
    let data = [];
    if(products_for_treatment){
        products_for_treatment.split(',').forEach((e)=>{        //adding chips to array and then to input
            data.push({tag:e})
        })
        input.setAttribute('value',products_for_treatment)
    }      
    let elems = document.querySelectorAll('.init');
    M.Chips.init(elems, {
        data:data,
        onChipAdd: (event, chip) => {
            input_value =[];
            event[0].M_Chips.chipsData.forEach(elem=>{
                input_value.push(elem.tag)
            })
            input.setAttribute('value',input_value)
        },
        onChipDelete:(event, chip)=>{
            input_value =[];
            event[0].M_Chips.chipsData.forEach(elem=>{
                input_value.push(elem.tag)
            })
            input.setAttribute('value',input_value)
        }
    });

    if(value === true){
        button[0].style.display = 'block'
        add_auto_chips[0].style.display ='block'
        header[0].getElementsByTagName('label')[0].style.display="block"
        Array.from(add_chips_input).forEach(chips=>{
            chips.style.display = 'none'
        })
        Array.from(e).forEach(tag =>{
            let d = document.createElement('input');
            d.value = tag.innerText;
            d.classList = tag.classList
            d.id = tag.id
            d.name = tag.getAttribute('name')
            d.type="text"
            tag.parentNode.replaceChild(d, tag)
        })
        Array.from(add_input_field).forEach(input=>{
            input.getElementsByTagName('input')[0].select()
            input.classList.add('input-field')
        })
        Array.from(textarea).forEach(textarea =>{ 
            textarea.readOnly =false
        })
        
        
        add_input_field[0].getElementsByTagName('input')[0].select()
    }else{
        button[0].style.display = 'none'
        header[0].getElementsByTagName('label')[0].style.display="none"
        add_auto_chips[0].style.display ='none'
        Array.from(e).forEach(tag =>{
            var d = document.createElement('p');
            d.innerText = tag.value;
            d.classList = tag.classList
            d.id = tag.id
            tag.parentNode.replaceChild(d, tag)
            d.classList.remove('input-field')
        })
        Array.from(textarea).forEach(textarea =>{ 
            textarea.readOnly =true
        })
        Array.from(add_input_field).forEach(input=>{
            input.classList.remove('input-field')
        })
        Array.from(add_chips_input).forEach(chips=>{
        chips.style.display = 'inline-block'
        })
    }
}
