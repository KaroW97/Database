$(document).ready(function(){


    //Edit View
    $(".div-element").click(function(){
        //After Click Give Action
        //set Form action
        $('.formEdit').attr('action', $(this).attr('action') )
        $('.edit-form').show();
        $(".inputEdit").val( $(this).attr('client'));
       
        $(".phone").val( $(this).attr('phone'));

        $(".inputEditTreatment").val( $(this).attr('treatment'));
        $(".timeFrom").val( $(this).attr('timeFrom'));
        $(".timeTo").val( $(this).attr('timeTo'));
        $(".visitDateEdit").val($(this).attr('visitDate'))
  
    })
})