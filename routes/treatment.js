const express = require('express');
const router = express.Router();
const Treatment = require('../models/treatment')
const ShoppingList = require('../models/shoppingList')
const ObjectId = require('mongodb').ObjectId;
const {ensureAuthenticated} = require('../config/auth')
const ProductsForTreatment = require('../models/treatmentProducts')

/*
* All Treatments
*/
router.get('/',ensureAuthenticated,async(req,res)=>{
   var searchOptions={};
   let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']
   let todayDate = new Date(),weekDate=new Date();
   todayDate.setDate(todayDate.getDate() - 1)
   weekDate.setDate(todayDate.getDate() + 8)
  
   if(req.query.treatmentName !=null && req.query.treatmentName !=='')
        searchOptions.treatmentName = new RegExp(req.query.treatmentName,'i');
    try{
        const treatments = await Treatment.find(searchOptions).find({user:req.user.id});
        const treatmentsDist = await Treatment.find(searchOptions).find({user:req.user.id}).distinct('treatmentName');
        const productsAll = await ProductsForTreatment.find({user:req.user.id});
       
        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})
      
        res.render('treatment/index',{
            shoppingAll:shoppingList,
            treatments:treatments,
            treatmentsDist:treatmentsDist,
            searchOptions:searchOptions,
            weekdays:weekdays,
            productsAll:productsAll,
        })
    }catch(err){
        req.flash('mess','Nie udało się dodać nowego zabiegu')
        req.flash('type','info-alert')
        res.redirect('/treatment')
    }
})
/*
* Add New Treatment
*/
router.post('/',ensureAuthenticated, async(req,res)=>{
    
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
       if(req.body.products_needed_to_do_the_treatment.split(',').length > 1){
        await  req.body.products_needed_to_do_the_treatment.split(',').forEach(async(e) =>{
            const product = await ProductsForTreatment.find({user:req.user.id,prodTreatmentName:e})
            if(product.length === 0){
                let productNew = new ProductsForTreatment({
                    user:req.user.id,
                    prodTreatmentName: e
                })
                await productNew.save();
            }else{
                req.flash('mess','Produkt nie zostanie dodany do bazy')
                req.flash('type','info') 
            }
        }) 
       }else{
            const product = await ProductsForTreatment.find({user:req.user.id, prodTreatmentName: req.body.products_needed_to_do_the_treatment})
            if(product.length === 0){
                let productNew = new ProductsForTreatment({
                    user:req.user.id,
                    prodTreatmentName: req.body.products_needed_to_do_the_treatment
                })
                await productNew.save();
            }
       }
    
        req.flash('mess','Udało się dodać nowy zabieg')
        req.flash('type','info-success')
        res.redirect('/treatment')
    }catch(err){
        console.log(err)
        req.flash('mess','Nie udało się dodać nowego zabiegu')
        req.flash('type','info-alert')
        res.redirect('/treatment')
    } 
   
})
/*
* Delete Treatment
*/
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
/*
* Edit Treatment
*/
router.put('/edit/:id',ensureAuthenticated, async(req,res)=>{
    let treatment;

    try{
        treatment = await Treatment.findById(req.params.id)
        treatment.treatmentName = req.body.treatmentName
        treatment.treatmentPrice= req.body.treatmentPrice
        treatment.treatmentDescription=req.body.treatmentDescription
        treatment.duration=req.body.duration
        treatment.costs_of_products_per_treatment = req.body.costs_of_products_per_treatment
        treatment.products_needed_to_do_the_treatment = req.body.productsForTreatment.toString()
        
        await treatment.save();
     
        req.flash('mess','Zabieg został zedytowany')
        req.flash('type','info-success')
        res.redirect(`/treatment/${req.params.id}`)
    }catch(err){
        console.log(err)
        req.flash('mess','Nie udało się zedytować zabiegu')
        req.flash('type','info-alert')
        res.redirect(`/treatment/${req.params.id}`)
    }
})
/*
* Show Treatment
*/
router.get('/:id',async (req,res)=>{
    try{
        let treatment = await Treatment.findById(req.params.id)
        let products = treatment.products_needed_to_do_the_treatment.split(',')
        const productsAll = await ProductsForTreatment.find({user:req.user.id});

        res.render('treatment/treatmentView',{
            treatment:treatment,
            splited:products,
            productsAll:productsAll
        })
    }catch{

    }
})
module.exports = router