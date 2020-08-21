

$(document).ready(function(){
    $(window).keyup(function(e){
        $(this).window($('.create-visit-form '),$('.center-form'),e)
        
    })
    //if clients write toggle elements on 
    $('.myInputSearch').on('keyup click input', function () {
        $(this).toggle_main_page_list($(this),  $('.main-div-full-content .visit '))
        
    })
  
    $(".my-input-new-list-name").on('keyup click ', function(){
        let value = $(this).val().toLowerCase()
    
        $(this).toggle_list_create_edit (
            $('.form-content .clients-list'),$(this),$('.ui-menu .ui-menu-item'))
    })

    //Search
    $.fn.search_list_settings = function($list ,$list_li,$input){
        //$list.show()
        let value = $(this).val().toLowerCase()
        if (value.length == 0 || $list_li.text().toLowerCase().indexOf(value) == -1) 
            $list.hide()

        $list_li.filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            $(this).click(function(){
                $input.val($(this).text())
                $list.hide();
            })
        })
    }
    ///Create Form
    $.fn.toggle_list_create_edit = function($form_content, $input, $list_client) {
            //$form_content.show()
            let value =$(this).val().toLowerCase()
            if (value.length == 0 || $list_client.text().toLowerCase().indexOf(value) == -1) 
                $form_content.hide()
            $list_client.filter(function(){
              
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                $(this).click(function(){
                    $input.val($(this).text())
                  
                })
            })
            return this
    
    }

    //toggle main page on search 
    $.fn.toggle_main_page_list = function($input,$visits){
        let value = $input.val().toLowerCase();
        $visits.filter(function(){
           $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
       })  
    }
    
    $.fn.window = function($close_form,$clear_form, $e){
        if($e.keyCode == 27){
            $clear_form.closest('form').find("input").val('')
            $close_form.hide();
          
        }
    }
   //CLIENT
   var brand = [], shopping_element = [],treatmentCreate = [], clientsCreate = []
   $('.list-client li').filter(function(){
       clientsCreate.push({value:$(this).text(),phone:$(this).attr('phone') })
   })
   $(function(){
       $( ".client-search" ).autocomplete({
           source: clientsCreate,
           autoFocus:true
       });
   })
   //TREATMANT
   $('.listTreatment li').filter(function(){
       treatmentCreate.push($(this).text())
   })
   $(function(){
       $( ".treatment-search" ).autocomplete({
           source: treatmentCreate,
           autoFocus:true
       });
   })
   //BRAND
   $('.brand li').filter(function(){
       brand.push({value:$(this).text()})
   })
   $(function(){
       $( ".brand-search" ).autocomplete({
           source: brand,
           autoFocus:true
       });
   })
   $(function(){
       $( ".create-brand" ).autocomplete({
           source: brand,
           autoFocus:true
       });
   })
   $('.shopping-elements-list li').filter(function(){
    shopping_element.push({value:$(this).text()})
   })
   $(function(){
       $( ".shopping-search" ).autocomplete({
           source: shopping_element,
           autoFocus:true
       });
   })
    
   $(document).ready(function(){
    $('#download').change(function(){
   
        let elem = $('#download').val();
        if($('#download').val().length>= 24){
            elem =  $('#download').val().substring(0,24)+'...';
        }
        if($(window).width() <=670 && $(window).width() >=571){
            elem =  $('#download').val().substring(0,15)+'...';
        }
        if($('#download').prop('files').length >= 2)
            $('.download_file').text(elem+ ' '+$('#download').prop('files').length+' pliki')
        else if($('#download').prop('files').length >= 10)
            $('.download_file').text(elem+ ' '+$('#download').prop('files').length+' plików')
        else
            $('.download_file').text(elem)
    
    })

})  
    $('.download_file_border').click(function(){
        $('#download').click();
    })
    var doc = []
    $('.doc li').filter(function(){
        doc.push({value:$(this).text()})
    })

    $(function(){
        $( ".doc-search" ).autocomplete({
            source: doc,
            autoFocus:true
        });
    })
   $('.ui-menu').on('click',function(){
        $(".myInputSearch").trigger('click')
    })
})
