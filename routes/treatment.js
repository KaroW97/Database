const express = require('express');
const router = express.Router();
const Treatment = require('../models/treatment')
const ShoppingList = require('../models/shoppingList')
const ObjectId = require('mongodb').ObjectId;
const {ensureAuthenticated} = require('../config/auth')
//All Treatments
router.get('/',ensureAuthenticated,async(req,res)=>{
   var searchOptions={};

   let todayDate = new Date(),weekDate=new Date();
   todayDate.setDate(todayDate.getDate() - 1)
   weekDate.setDate(todayDate.getDate() + 8)
  
   if(req.query.treatmentName !=null && req.query.treatmentName !=='')
        searchOptions.treatmentName = new RegExp(req.query.treatmentName,'i');
    try{
        const treatments = await Treatment.find(searchOptions).find({user:req.user.id});
        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})
      
        res.render('treatment/index',{
            shoppingAll:shoppingList,
            treatments:treatments,
            searchOptions:searchOptions,
        })
    }catch(err){
        req.flash('mess','Nie udało się dodać nowego zabiegu')
        req.flash('type','info-alert')
        res.redirect('/treatment')
    }
})
//Add New Treatment
router.post('/',ensureAuthenticated, async(req,res)=>{
    console.log(req.body.products_needed_to_do_the_treatment)
    console.log(req.body)
    const treatment = new Treatment({
        user:req.user.id,
        treatmentName: req.body.treatmentName,
        treatmentPrice: req.body.treatmentPrice,
        treatmentDescription:req.body.treatmentDescription,
        duration:req.body.duration,
        costs_of_products_per_treatment :req.body.costs_of_products_per_treatment,
        products_needed_to_do_the_treatment:req.body.products_needed_to_do_the_treatment
    })
    try{
        await treatment.save();
        req.flash('mess','Udało się dodać nowy zabieg')
        req.flash('type','info-success')
        res.redirect('/treatment')
    }catch{
        req.flash('mess','Nie udało się dodać nowego zabiegu')
        req.flash('type','info-alert')
        res.redirect('/treatment')
    } 
   
})
//Delete Treatment
router.delete('/:id',ensureAuthenticated, async(req,res)=>{
    var treatment;
    try{
        treatment = await Treatment.findById(req.params.id);
        await treatment.remove() 
        req.flash('mess','Udało się usunąć zabieg')
        req.flash('type','info-success')
        
        res.redirect('/treatment');
    }catch{
        req.flash('mess','Nie udało się usunąć rekordu')
        req.flash('type','info-alert')
        res.redirect('/treatment')
    }
    
})
//Edit Treatment
router.put('/edit/:id',ensureAuthenticated, async(req,res)=>{
    let treatment;
    try{
        treatment = await Treatment.findById(req.params.id)
        treatment.treatmentName = req.body.treatmentName
        treatment.treatmentPrice= req.body.treatmentPrice
        treatment.treatmentDescription=req.body.treatmentDescription
        treatment.duration=req.body.duration
        treatment.costs_of_products_per_treatment = req.body.costs_of_products_per_treatment
        treatment.products_needed_to_do_the_treatment = req.body.products_needed_to_do_the_treatment
        await treatment.save();
        req.flash('mess','Zabieg został zedytowany')
        req.flash('type','info-success')
        res.redirect('/treatment')
    }catch(err){
      

        req.flash('mess','Nie udało się zedytować zabiegu')
        req.flash('type','info-alert')
        res.redirect('/treatment')
    }
})
//Show Treatment
router.get('/:id',async (req,res)=>{
    try{
        let treatment = await Treatment.findById(req.params.id)
        res.render('treatment/treatmentView',{
            treatment:treatment
        })
    }catch{

    }
})
module.exports = router