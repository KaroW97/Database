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
   var clientsCreate = []
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
   var treatmentCreate = []
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
   var brand = []
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
   
   $('.ui-menu').on('click',function(){
    $(".myInputSearch").trigger('click')
})




})