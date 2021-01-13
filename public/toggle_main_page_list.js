

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
 
})
