var $timepickerFrom= $('#timepickerFrom').timepicker({modal: false,  mode: '24hr',footer: false});
var $timepickerTo = $('#timepickerTo').timepicker({modal: false,  mode: '24hr',footer: false});
var $timepickerFromEdit= $('#timepickerFromEdit').timepicker({modal: false,  mode: '24hr',footer: false});
var $timepickerToEdit = $('#timepickerToEdit').timepicker({modal: false,  mode: '24hr',footer: false});
$('#datapickerAddEdit').datepicker({ header: true, footer: false  ,format: 'yyyy-mm-dd'});
$('#datapickerAdd').datepicker({ header: true, footer: false  ,format: 'mm-dd-yyyy'});

$('#dataFrom').datepicker({ header: true, footer: false ,format: 'mm-dd-yyyy' });
$('#dataTo').datepicker({ header: true, footer: false ,format: 'mm-dd-yyyy' });


