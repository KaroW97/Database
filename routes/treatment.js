const express = require('express');
const router = express.Router();
const Treatment = require('../models/treatment')
const ShoppingList = require('../models/shoppingList')
const ObjectId = require('mongodb').ObjectId;
const {ensureAuthenticated} = require('../config/auth')
//All Treatments
router.get('/',ensureAuthenticated,async(req,res)=>{
   var searchOptions={};
   const cssSheets =[];
   let todayDate = new Date(),weekDate=new Date();
   todayDate.setDate(todayDate.getDate() - 1)
   weekDate.setDate(todayDate.getDate() + 8)
   cssSheets.push('../../public/css/user/treatment/index.css')
   if(req.query.treatmentName !=null && req.query.treatmentName !=='')
        searchOptions.treatmentName = new RegExp(req.query.treatmentName,'i');
    try{
        const treatment = await Treatment.find(searchOptions).find({user:req.user.id});
 
        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).populate('listName').sort({transactionDate:'asc'})
      
        res.render('treatment/index',{
            shoppingAll:shoppingList,
            treatment:treatment,
            searchOptions:searchOptions,
            styles:cssSheets
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
        const cssSheets =[]
        req.flash('mess','Nie udało się dodać nowego zabiegu')
        req.flash('type','success')
        res.render('treatment',{
            treatment:treatment,
            styles:cssSheets
        });
    } 
   
})

//Delete Treatment
router.delete('/:id',ensureAuthenticated, async(req,res)=>{
    var treatment;
    try{
        treatment = await Treatment.findById(req.params.id);
        await treatment.remove() 
        req.flash('mess','Udało się usunąć zabieg')
        req.flash('type','success')
        
        res.redirect('/treatment');
    }catch{
        req.flash('mess','Nie udało się usunąć rekordu')
        req.flash('type','danger')
        res.redirect('/treatment')
    }
    
})
//Edit Treatment
router.put('/edit/:id',ensureAuthenticated, async(req,res)=>{
    let treatment;
    try{
        treatment = await Treatment.findById(req.params.id)
        treatment.treatmentName = req.body.treatmentNameEdit
        treatment.treatmentPrice= req.body.treatmentPriceEdit
        await treatment.save();
        req.flash('mess','Zabieg został zedytowany')
        req.flash('type','success')
        res.redirect('/treatment')
    }catch(err){
        const cssSheets =[]

        req.flash('mess','Nie udało się zedytować zabiegu')
        req.flash('type','danger')
        res.render('/treatment',{
            treatment:treatment,
            styles:cssSheets
        })
    }
})
module.exports = router