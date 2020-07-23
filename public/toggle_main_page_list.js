$(document).ready(function(){
    $(window).keyup(function(e){
        $(this).window($('.create-visit-form '),$('.center-form'),e)
        
    })
    //if clients write
    $('.myInputSearch').on('keyup click', function () {
        $(this).toggle_main_page_list($(this),  $('.main-div-full-content .visit '))

    })
    //if clients list clicked toggle visits
    $('.clients-list').on('click',function(){
        $(this).toggle_main_page_list($('.myInputSearch'),  $('.main-div-full-content .visit '))
    })
    $('.delete-brand').click(function(){
        $(this).open_box( $('.hide-delete'))
    })
    $('.close').click(function(){
        $(this).close_box( $('.create-visit-form'),$('.center-form'));
    })
    $('.create-list').click(function(){
       $(this).open_box($('.hidden-create-list'))
    })
    $('.showForm').click(function(){
        $(this).open_box($('.brand-form'))
    })
    
    //Search
    $(".myInputSearch").on('keyup click', function(){
        let value = $(this).val().toLowerCase()
         $(this).search_list_settings($('.clients-list'),$('.list-client li'),$(".myInputSearch"))
         $(window).click(function(event){
            var target = $( event.target );
            console.log(target)
            //Check If Clicked Outside Edit Form Box
            $(this).window_click(event,$('.myInputSearch'), $('.clients-list'),$('.clients-list li'))
        })
    })

    $(".my-input-new-list-name").on('keyup click', function(){
        let value = $(this).val().toLowerCase()
        $(this).toggle_list_create_edit (
            $('.form-content .clients-list'),$(this),$('.list-client li'),
            $(".hiddenBrandName"),$(".brandState") ,'newBrand', 'brand')
        $(window).click(function(event){
            $(this).window_click(event,$(".my-input-new-list-name"),$('.form-content .clients-list'),$('.clients-list li'))
        })
    })
    //Search
    $.fn.search_list_settings = function($list ,$list_li,$input){
        $list.show()
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
    $.fn.toggle_list_create_edit = function($form_content, $input, $list_client,$hidden_input, $data_state,
    $data_dosnt_exists, $data_exists) {
            $form_content.show()
            let value =$(this).val().toLowerCase()
            
            if (value.length == 0 || $list_client.text().toLowerCase().indexOf(value) == -1) 
                $form_content.hide()

            $data_state.val('new');
            $hidden_input.attr('name',$data_dosnt_exists)
            $hidden_input.val( $(this).val());

            $list_client.filter(function(){
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                $(this).click(function(){
                    $input.val($(this).text())
                    $data_state.val('exists')
                    $hidden_input.attr('name',$data_exists)
                    $hidden_input.val(  $(this).attr('value'));
                    $form_content.hide();
                    
                })
            })

            
            return this
    
    }
    //open close window if outside box
    $.fn.window_click=function($event,$input,$list,$list_li){
        var target = $( $event.target );
        console.log(target)
        if(target.is('.create-visit-form') || target.is('.center-form')){
            $('.create-visit-form').hide();
            $('.center-form').closest('form').find("input").val('')
   
        }
        //Check If Clicked Outside Edit Form Box 
        if(!target.is($input))
            $list.hide()
        else{
            let value = $input.val().toLowerCase()
            if($list_li.text().toLowerCase().indexOf(value) != -1)
                $list.show()     
        }
    }
    //toggle main page on search 
    $.fn.toggle_main_page_list = function($input,$visits){
        let value = $input.val().toLowerCase();
        $visits.filter(function(){
           $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      
       })  
    }
    //open window
    $.fn.open_box = function($box){
        $box.show();
    }
    $.fn.close_box = function($box,$clear_form){
        $clear_form.closest('form').find("input").val('')

        $box.hide();
    }
    $.fn.window = function($close_form,$clear_form, $e){
        if($e.keyCode == 27){
            $clear_form.closest('form').find("input").val('')
            $close_form.hide();
          
        }
    }
  
})