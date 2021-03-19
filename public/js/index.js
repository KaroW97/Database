

const deleteClass = (id) =>{
    const floating = getElementById(id);
    floating.classList.remove('pulse')
}
const datapicker_init = () =>{
    var elems = document.querySelectorAll('.datepicker');
    M.Datepicker.init(elems, {
        container:document.getElementsByTagName("BODY")[0],
        autoClose:true,
        firstDay:1,
        format: 'yyyy-mm-dd',
        i18n:{
            months:	['Styczeń','Luty','Mrzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
            weekdaysShort: ['Niedz','Pon','Wt','Śr','Czw','Pt','Sob'],
            monthsShort:	['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paź','Lis','Gru'],
            weekdaysAbbrev:	['N','P','W','Ś','CZ','P','S']  
        }
        
    }); 
}
const chips_init = (elems = undefined, data = undefined) => {
   
    if(elems === undefined)  elems = document.querySelectorAll('.chips-autocomplete')
    const input = document.getElementById('chips-input')
    const input_list = document.getElementById('chips-input-list-product')

    if(elems && input){
        let input_value = []
        const chips_set_up = (event) =>{
            input_value =[];
            event[0].M_Chips.chipsData.forEach(elem=>{
                input_value.push(elem.tag)
            })
            input.setAttribute('value',input_value)
        }
        M.Chips.init(elems, {
            autocompleteOptions: {
                limit: Infinity,
            },
            data: data ? data :'',
            placeholder: 'Pordukty',
            secondaryPlaceholder: ' ',
            onChipAdd: (event, chip) =>chips_set_up(event), 
            onChipDelete:(event, chip)=> chips_set_up(event)
        });
    }
    if(elems && input_list){
        let input_value = []
        const split = (event) =>{
            input_value =[];
            event[0].M_Chips.chipsData.forEach(elem=>{
                let name = elem.tag.split(',')[0];
                let price = elem.tag.split(',')[1]
                let amount = elem.tag.split(',')[2]
                input_value.push(name+'+'+price+'+'+amount)
            })
            input_list.setAttribute('value',input_value)
        }
        M.Chips.init(elems, {
            autocompleteOptions: {
                limit: Infinity,
            },
            placeholder: 'Pordukty (nazwa, cena, ilość)',
            secondaryPlaceholder: ' ',
            onChipAdd: (event, chip) => split(event),
            onChipDelete:(event, chip)=> split(event)
        });
    }
}
const edit_fields = (header = null, searchedElement= null, templateContent= null, price = null) =>{
    return {
        e :document.getElementsByClassName('pTag')  ,
        add_input_field : document.getElementsByClassName('add-input-field'),
        textarea : document.getElementsByClassName('textarea'),
        button : document.getElementsByClassName('submit'),
        elems : document.querySelectorAll('.init'),
        header  : document.getElementsByClassName(header),  
        add_chips_input : document.getElementsByClassName('add-chips-input'),
        add_auto_chips: document.getElementsByClassName('init'),
        input : getElementById('chips-input'),
        header_content : document.getElementsByClassName('header-content'),
        inputs : document.getElementsByClassName('disabled'),
        searchedElement : document.querySelector(searchedElement),
        templateContent: document.querySelector(templateContent),
        price:getElementById(price), 
        datalistName:!searchedElement ? ''  : searchedElement.split('#')[1] 
    }
}
const change_tags_in_inputs = e =>{
    Array.from(e).forEach(tag =>{
        let d = document.createElement('input');
        d.value = tag.innerText;
        d.classList = tag.classList
        d.id = tag.id
        d.name = tag.getAttribute('name')
        d.type="text"
        tag.parentNode.replaceChild(d, tag)
        if(d.classList.contains('dateTag')){
            datapicker(d)
        }      
    }); 
}
const change_inputs_in_tags = e =>{
    Array.from(e).forEach(tag =>{
        var d = document.createElement('p');
        tag.value === '' ?  d.innerText ='-' :  d.innerText = tag.value;
        d.classList = tag.classList
        d.id = tag.id
        tag.parentNode.replaceChild(d, tag)
        d.classList.remove('input-field')
    })
}
const readOnly_set_up = (field, value) =>Array.from(field).forEach(field =>field.readOnly =value)
const disabled_set_up = (field, value) =>Array.from(field).forEach(field =>field.disabled =value)
const remove_class = (field, className) =>  Array.from(field).forEach(input=>   input.classList.remove(className))
const style_display_set_up = (field, method) =>Array.from(field).forEach(field=>field.style.display = method)
const getElementById = (elementId) => document.getElementById(elementId)
document.addEventListener('DOMContentLoaded', function() {
    datapicker_init()
    const materialize_inicjalization = () =>{
        let select = document.querySelectorAll('select');
        M.FormSelect.init(select,{
            isMultiple:true,
        });
        M.Modal.init(document.querySelectorAll('.modal'), {});
        M.Timepicker.init(document.querySelectorAll('.timepicker'), {
            container:'body',
            twelveHour:false,
            vibrate:true
        });
        M.FloatingActionButton.init( document.querySelectorAll('.fixed-action-btn'), {});//floating button initialization
        M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
        M.Collapsible.init(document.querySelectorAll('.collapsible'), {});
        M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
            constrainWidth:false
        });
        chips_init()
     
    }
    materialize_inicjalization()
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
    /*
    * Autocomplete Event Listeners
    */
    let searchby1 = document.querySelector('#searchby-1') 
    let searchby2 = document.querySelector('#searchby-2')
    let searchby3 = document.querySelector('#searchby-3')
    let search2 = document.querySelector('#search2') 
    let client1 = document.querySelector('#search-1')
    let client_search = document.querySelector('#client-search')
    const search_method_config = (searchby, searchedElementId, templateContentId, isPrice, innerHTML, priceId = null, number = null) =>{
        const {searchedElement, templateContent, price, datalistName} = edit_fields(null, searchedElementId, templateContentId, priceId)
        invoke_autocomplete_listener_keyup(searchedElement,datalistName, templateContent, searchby, innerHTML, false)
        invoke_autocomplete_listener_click(searchedElement, templateContent, searchby, innerHTML, true)  
        if(isPrice && price)   add_price_listeners( searchby, priceId, number)
    }
    if(searchby1)
        search_method_config(searchby1, '#options-1', '#searchTemplate1-1', true, false, 'price-1', 1)
    if(searchby2)
        search_method_config(searchby2, '#options-2', '#searchTemplate1-2', true, false, 'price-2', 2)
    if(searchby3)
        search_method_config(searchby3, '#options-3', '#searchTemplate1-3', false, false)      
    if(search2)
        search_method_config(search2, '#searchedElement2', '#searchTemplate2', false, false) 
    if(client1 || client_search){
        const callAutoComplete = (input, innerHTML) =>
            search_method_config(input, '#clientOptions-1', '#searchTemplate-1',false,  innerHTML) 
        
        if(client_search){
            callAutoComplete(client_search, false)
        } else if(client1){
            let phone =  getElementById(`phoneNumber-1`)
            callAutoComplete(client1, true)
            if(phone) add_number_to_input_listener (client1,1) 
        }
    }
});
const invoke_autocomplete_listener_keyup = (searchedElement,id,  templateContent, element, addInnerHtml, clicked) =>{
    element.addEventListener('keyup', function handler(event) {
        event.key === undefined ? searchedElement.id = '' : searchedElement.id = id;
        autocomplete(element, searchedElement, templateContent.options, addInnerHtml, clicked )
    });
}
const invoke_autocomplete_listener_click = (searchedElement, templateContent, element, addInnerHtml, clicked) =>{
    element.addEventListener('click', function handler(event) {
        autocomplete(element, searchedElement, templateContent.options, addInnerHtml, clicked )
    });
}
const add_price_listeners = (input, price, number) =>{
    input.addEventListener('input', function(e){
        add_price_to_input(e,number)
    })
    input.addEventListener('keydown', function(e){
        if(e.keyCode === 8)  getElementById(price).setAttribute('value',0)
    })
}
const add_number_to_input_listener = (input, number) =>{
    input.addEventListener('input', function(e){   
        add_number_to_input(e, number)
    })
}
/* 
 * Fetch data about prev created visit CALENDAR
*/
const edit_calendar_visit = () =>{ 
    let search = document.querySelector('#search-2')
    var searchedElement = document.querySelector('#clientOptions-2');
    var templateContent = document.querySelector('#searchTemplate-2');

    invoke_autocomplete_listener_keyup(searchedElement,'clientOptions-2', templateContent, search, true, false)
    invoke_autocomplete_listener_click(searchedElement, templateContent, search, true, true)   
    add_number_to_input_listener (search,2)
}  
/*
*Client Form, add number to phone input
* Take care of adding number just after choosing right client
*/ 
const add_number_to_input = (e, nr) =>{             //take care of adding number just after choosing right client 
    const val = document.querySelectorAll(`#searchTemplate-${nr} option[value="${e.target.value}"]`)
    let number = getElementById(`phoneNumber-${nr}`)
    const equalOrSingle = () =>{
        number.select();
        number.value = val[0].getAttribute('data-value')
    }
    const notEqual = () =>{    //if there is more clients with the same name informa about that and force to choose number 
        number.select();            //select number input atiomaticly
        number.value =''
        alert_box('Wykryto więcej klientów o tym imieniu')  
    
        const datalist = document.createElement('datalist')
        datalist.id = `phoneNumbers-${nr}`
        val.forEach(value =>{
            const option = document.createElement('option')
            option.value = value.getAttribute('data-value')
            option.label = value.value
            datalist.appendChild(option)
        })
        getElementById('createVisit').appendChild(datalist)
    }
    if(val.length > 1){
        let isEqual = Array.from(val).every(v=> val[0].getAttribute('data-value') === v.getAttribute('data-value') )
        isEqual ? equalOrSingle(): notEqual()
    }
    else if(val.length === 1 )
        equalOrSingle()
}
/*
* Add price of the treatemtn to hidden input
*/ 
const add_price_to_input = (e, nr) =>{
    const val = document.querySelectorAll(`#searchTemplate1-${nr}  option[value="${e.target.value}"]`)
    if(val[0] !=undefined)
        getElementById(`price-${nr}`).setAttribute('value',val[0].getAttribute('data-value'))
}
/*
* Autocomplete Function
*/
const autocomplete = (element, searchedElement, templateContent, addInnerHtml, clicked) =>{
    const setAtributes = (option, searchedElement, e) =>{
        option.value = e.value
        if(addInnerHtml){
            option.innerText = e.getAttribute('data-value')
            option.setAttribute('data-value', e.getAttribute('data-value'))
        }
        searchedElement.append(option);
    } 
    const iterator = (clicked) =>{
        Array.from(templateContent).forEach(e=>{
            let eToLower = e.value.toLowerCase();
            var inputVal= element.value.trim().toLowerCase()
            let option = document.createElement('option')
            if(!clicked ? 
                (searchedElement.options.length < 4 && searchedElement.options.length < templateContent.length) :  
                (searchedElement.options.length < 4 && eToLower.includes(inputVal)) 
                )
                setAtributes(option, searchedElement, e)
        })  
    }

    if(clicked) iterator(false)
    else{  
        while (searchedElement.children.length) searchedElement.removeChild(searchedElement.firstChild, true);
        iterator(true)
    }
}
const datapicker = (d) =>{
    d.classList.add('datepicker')
    datapicker_init()
}
/*
* Edit client form CLIENT
*/
var value = false
const edit_client = () =>{
    value = !value
    let {e ,add_input_field,textarea,button, header, header_content, inputs} = edit_fields('name')
    const client_header = (innerText, labelAssign, position ) =>{
        let create_label = document.createElement('label')
        create_label.setAttribute('for',labelAssign)
        create_label.innerText = innerText
        header[position].append(create_label)
    }
    if( value === true){
        button[0].style.display = 'block'
        header_content[0].classList.remove('flex-content')
        header_content[0].classList.add('col','s12')
        Array.from(header).forEach(h=>h.classList.add('col', 's12', 'm6', 'l6', 'xl6'))
        client_header('Imie', 'client-name', 0)
        client_header('Nazwisko', 'lastName', 1)
        change_tags_in_inputs(e)
        disabled_set_up(inputs, false)
        readOnly_set_up(textarea, false)
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
        change_inputs_in_tags(e)
        readOnly_set_up(textarea, true)
        disabled_set_up(inputs, true)
        remove_class(add_input_field, 'input-field')
    }
}
/*
* Edit list information
*/
const edit_list = () =>{
    value = !value
    let {e ,add_input_field, button} = edit_fields()
    if(value === true){
        button[0].style.display = 'block'
        change_tags_in_inputs(e)
        add_input_field[0].getElementsByTagName('input')[0].select()
    } else{
        alert_box( 'Jeśli nie zapisałeś danych zostaną one usunięte '  )
        button[0].style.display = 'none'
        let input_field = document.getElementsByClassName('input-field')
        input_field[0].classList.remove('col','s12','input-field')
        input_field[0].classList.add('flex-content')
        change_inputs_in_tags(e)
    }
}
/*
* Fetch data and add it to edit list item form
*/
const fill_edit_form = (data, formId, action) =>{
    let form = document.querySelector(formId)
    Array.from(form.elements).forEach(input=>{
        input.focus()
        if(input.name ==='price')   input.setAttribute('value',data[input.name] )
        else  input.value = input.name === 'clientVisitDate' ?data[input.name].split('T')[0] : data[input.name]
    })
    form.elements[0].select()
    form.action = action
}
const edit_list_item = (id, index) =>{
    fetch(`/shopping-list/list-view/${id}/${index}`)
    .then(res=>res.json())
    .then(data =>   fill_edit_form(data, '#edit-item', `/shopping-list/list-view/${id}/${index}?_method=PUT`))
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
    .then(data => fill_edit_form(data, '#edit_client_visit', `/clients/client-view/${id}/editPost?_method=PUT`))
}
/*
* Updating treatment, displaying label
*/
const edit_treatment = (products_for_treatment) =>{
    value = !value
    let {e, add_input_field, textarea, button, elems, header, add_chips_input, add_auto_chips, input} = edit_fields('treatmentName')
    let data = [];
    if(products_for_treatment){
        products_for_treatment.split(',').forEach((e)=>{        //adding chips to array and then to input
            data.push({tag:e})
        })
        input.setAttribute('value',products_for_treatment)
    }      
    chips_init(elems, data)
    if(value === true){
        button[0].style.display = 'block'
        add_auto_chips[0].style.display ='block'
        header[0].getElementsByTagName('label')[0].style.display="block"
        change_tags_in_inputs(e)
        readOnly_set_up(textarea, false)
        style_display_set_up(add_chips_input, 'none')
        Array.from(add_input_field).forEach(input=>{
            input.getElementsByTagName('input')[0].focus()
            input.classList.add('input-field')
        })
        
        add_input_field[0].getElementsByTagName('input')[0].select()
    }else{
        button[0].style.display = 'none'
        header[0].getElementsByTagName('label')[0].style.display="none"
        add_auto_chips[0].style.display ='none'
        change_inputs_in_tags(e)
        readOnly_set_up(textarea, true)
        remove_class(add_input_field, 'input-field')
        style_display_set_up(add_chips_input, 'inline-block')
    }
}
