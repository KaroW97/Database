const express = require('express');
const router =express.Router();


//Show current options
router.get('/',(req,res)=>{
    res.render('settings/index');
})

/*router.put('/',(req,res)=>{
    res.send('Update Stings');
})*/

module.exports = router;