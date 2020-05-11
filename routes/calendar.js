const express = require('express');
const router = express.Router();

//Show Calendar Page
router.get('/',(req,res)=>{
    res.render('calendar/index');
})

module.exports =router;