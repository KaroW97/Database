const express = require('express');
const router = express.Router();
const Treatment = require('../models/treatment')

const {ensureAuthenticated} = require('../config/auth')
//All Treatments
router.get('/',ensureAuthenticated,async(req,res)=>{
   var searchOptions={};
   if(req.query.treatmentName !=null && req.query.treatmentName !=='')
        searchOptions.treatmentName = new RegExp(req.query.treatmentName,'i');
    try{
        const treatment = await Treatment.find(searchOptions);
        res.render('treatment/index',{
            treatment:treatment,
            searchOptions:searchOptions
        })
    }catch(err){
        console.log(err)
        res.redirect('/treatment')
    }
})
//Add New Treatment
router.post('/',ensureAuthenticated, async(req,res)=>{
    const treatment = new Treatment({
        user:req.user.id,
        treatmentName: req.body.treatmentName,
        treatmentPrice: req.body.treatmentPrice
    })
    try{
        await treatment.save();
        res.redirect( `treatment`);
    }catch{
        res.render('treatment',{
            treatment:treatment,
            errorMessage:'Error creating Treatment'
        });
    } 
   
})
//Delete Treatment
router.delete('/:id',ensureAuthenticated, async(req,res)=>{
    let treatment;
    try{
        treatment = await Treatment.findById(req.params.id);
        await treatment.remove();
        res.redirect('/treatment');
    }catch{
        res.redirect('/treatment')
    }
    
})
//Edit Treatment
router.get('/:id/edit' ,ensureAuthenticated, async(req,res)=>{
    try{
        const treatment = await Treatment.findById(req.params.id);
        res.render('treatment/edit',{
            treatment:treatment,
        });
    }catch{
        res.redirect('/treatment')
    }
})

router.put('/:id',ensureAuthenticated, async(req,res)=>{
    let treatment;
    try{
        treatment = await Treatment.findById(req.params.id)
        treatment.treatmentName = req.body.treatmentName
        treatment.treatmentPrice= req.body.treatmentPrice
        await treatment.save();
        res.redirect('/treatment')
    }catch(err){
        console.log(err)
        res.redirect('/treatment/edit',{
            treatment:treatment,
            errorMessage:'Error updating Client', 
        })
    }
})
module.exports = router