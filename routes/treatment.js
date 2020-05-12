const express = require('express');
const router = express.Router();
const Treatment = require('../models/treatment')

//All Treatments
router.get('/',async(req,res)=>{
   var searchOptions={};
   if(req.query.treatmentName !=null && req.query.treatmentName !=='')
        searchOptions.treatmentName = new RegExp(req.query.treatmentName,'i');
    try{
        const treatment = await Treatment.find(searchOptions);
        res.render('treatment/index',{
            treatment:treatment,
            searchOptions:searchOptions
        })
    }catch{
        res.redirect('/treatment')
    }
})

//New Treatment
router.get('/new',(req,res)=>{
    res.render('treatment/new', {treatment:new Treatment()})
})


//
router.post('/', async(req,res)=>{
    const treatment = new Treatment({
        treatmentName: req.body.treatmentName,
        treatmentPrice: req.body.treatmentPrice
    })

    try{
        const newTreatment= await treatment.save();
        res.redirect( `treatment`);
    }catch{
        res.render('treatment/new',{
            treatment:treatment,
            errorMessage:'Error creating Treatment'
        });
    } 
   
})

module.exports = router