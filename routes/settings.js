const express = require('express');
const router =express.Router();
const {ensureAuthenticated} = require('../config/auth')

//Show current options
router.get('/',ensureAuthenticated,(req,res)=>{
    res.render('settings/index');
})

/*router.put('/',(req,res)=>{
    res.send('Update Stings');
})*/

module.exports = router;