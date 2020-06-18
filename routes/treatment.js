const express = require('express');
const router = express.Router();
const Treatment = require('../models/treatment')
const ObjectId = require('mongodb').ObjectId;
const {ensureAuthenticated} = require('../config/auth')
//All Treatments
router.get('/',ensureAuthenticated,async(req,res)=>{
   var searchOptions={};
   if(req.query.treatmentName !=null && req.query.treatmentName !=='')
        searchOptions.treatmentName = new RegExp(req.query.treatmentName,'i');
    try{
        const treatment = await Treatment.find(searchOptions).find({user:req.user.id});
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
        req.flash('mess','Udało się dodać nowy zabieg')
        req.flash('type','success')
        res.redirect( `treatment`);
    }catch{
        req.flash('mess','Nie udało się dodać nowego zabiegu')
        req.flash('type','success')
        res.render('treatment',{
            treatment:treatment,
        });
    } 
   
})

//Delete Treatment
router.delete('/',ensureAuthenticated, async(req,res)=>{
    var treatment;
  //  console.log(req.body.chackboxDelete)
    try{
        if(req.body.chackboxDelete!= null){
            if(Array.isArray(req.body.chackboxDelete)){
                for(var i=0;i<req.body.chackboxDelete.length; i++){
                    treatment = await Treatment.findById(req.body.chackboxDelete[i])
                    await treatment.remove() 
                }
                req.flash('mess','Udało się usunąć zabiegi')
                req.flash('type','success') 
            }else{
                treatment = await Treatment.findById(req.body.chackboxDelete)
                await treatment.remove() 
                req.flash('mess','Udało się usunąć zabieg')
                req.flash('type','success')
            }
        }else{
            req.flash('mess','Nie podano zabiegu do usunącia')
            req.flash('type','info')
        }
    
   
        res.redirect('/treatment');
    }catch{
        req.flash('mess','Nie udało się usunąć rekordu')
        req.flash('type','danger')
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
        req.flash('mess','Zabieg został zedytowany')
        req.flash('type','success')
        res.redirect('/treatment')
    }catch(err){
        console.log(err)
        req.flash('mess','Nie udało się zedytować zabiegu')
        req.flash('type','danger')
        res.redirect('/treatment/edit',{
            treatment:treatment
        })
    }
})
module.exports = router