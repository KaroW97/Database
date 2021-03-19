document.addEventListener('DOMContentLoaded', function() {

    const initCalendar = (initView, header, height)=>{
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: initView,
        height: height,
        nowIndicator:true,
        bootstrapFontAwesome: { addEvent: 'fas fa-plus'},
        navLinks: true,
        headerToolbar: header,
        eventBackgroundColor:'#ff0000',
        navLinkWeekClick: function(date, jsEvent) {
        },
        customButtons: {
            addEvent: {
                click: function() {
                    this.id = 'create-event'
                    this.setAttribute('href','#createVisit')
                    this.classList.add('modal-trigger')

                    document.getElementById('button-1').addEventListener('click', ()=>{
                        let event = {}
                        let form = document.querySelector('#create-visit-form').elements
                            Array.from(form).forEach(input=>{
                            event[input.name] = input.type ==='tel' ? Number(input.value) : input.value
                        })
                        let params = {
                            method:'POST',
                            body:event,
                            headers: { 
                                "Content-type": "application/json; charset=UTF-8"
                            } 
                        }
                        if(event.clients != '' && event.phone  && event.timeFrom && event.treatment && event.visitDate){
                            fetch('/calendar/visit', params)
                            .then(res=>res.json())
                            .then(json=>console.log(json))
                        }       
                    })
                }
            }
        },
        buttonText:{ 
            today:    'dziś',
            month:    'miesiąc',
            week:     'tydzień',
            day:      'dzień',
            list:     'lista',
        },
        locale: 'pl',
        themeSystem:'bootstrap',
        progressiveEventRendering:true,
        dayMaxEventRows: true,
        moreLinkClick:"popover",
        eventSources: [{
            color: '#26a69a',
            events:function(info, successCallback, failureCallback){
                fetch('/calendar/calendar-events')
                .then(res=>res.json())
                .then(data=>{
                    successCallback(
                        data.map(event=>{
                            return{
                                extendedProps:{ 
                                    clients:event.clientName,
                                    phone:event.phoneNumber,
                                    treatment:event.treatment,
                                    visitDate:event.visitDate.split('T')[0],
                                    timeFrom:event.timeFrom,
                                    timeTo:event.timeTo,    
                                },
                                id:event._id,
                                title:`${event.clientName} \n  Kontakt: ${event.phoneNumber}, \nZabieg ${event.treatment}`,
                                start:event.visitDate.split('T')[0]+'T'+event.timeFrom+':00',
                                end:event.visitDate.split('T')[0]+'T'+event.timeTo+':00',
                            }
                        })
                    )
                })
            },
        }],
        
        eventClick: function(info) {
            M.Modal.init(document.getElementById('visit'), {}).open();
            let form = document.querySelector('#visit-form')
                edit_calendar_visit()
            Array.from(form.elements).forEach(input=>{
                input.focus()
                input.value = info.event.extendedProps[input.name]
            })
            document.getElementById('edit').addEventListener('click', ()=>{
                form.setAttribute('action',`/calendar/edit/${info.event.id}?_method=PUT`)
            })
            document.getElementById('delete').addEventListener('click', ()=>{
                form.setAttribute('action',`/calendar/${info.event.id}?_method=DELETE`)
            })
        }

    });
    calendar.render();
    }
    const windowSize = () =>{
    if(window.innerWidth < 1000) 
        initCalendar(
            'listWeek',    
            {
                left: 'prev,next addEvent',
                right: 'title'
            },
            500 
        )
    else 
        initCalendar(
            'dayGridMonth',
            {
                left: 'prev,next today addEvent',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            }, 
            800
        )
    }
    window.addEventListener('resize',()=> windowSize() )
    window.addEventListener('load', () =>  windowSize() );
    
});
