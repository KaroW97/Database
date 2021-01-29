// TODO: Add Delete Visit
const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList')
const Treatment = require('../models/treatment');
const FutureVisit = require('../models/clientFutureVisit')
const Client = require('../models/clients')
const User = require('../models/user')
const ObjectId = require('mongodb').ObjectId;
const {ensureAuthenticated} = require('../config/auth')
/*
 * Calendar page
*/
router.get('/',ensureAuthenticated,async (req,res)=>{
   
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']
   
    let visit = FutureVisit.find({user:req.user.id})
    let todayDate = new Date(),weekDate=new Date();
   
    if(req.query.visitAfter != null &&  req.query.visitAfter !='')
        visit = visit.gte('visitDate', req.query.visitAfter)  
    else
        visit = visit.find({visitDate:{ $gt:todayDate}}).sort({visitDate:'asc',timeFrom:'asc'})
    if(req.query.visitBefore != null &&  req.query.visitBefore !='')
        visit = visit.lte('visitDate', req.query.visitBefore)
   
    try{
        const user = await User.findById(req.user.id);
        todayDate.setDate(todayDate.getDate() - 1)
        weekDate.setDate(todayDate.getDate() + 8)
        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})

        const treatment = await Treatment.find({user:req.user.id});
        const clients =  await Client.find({user:req.user.id});
        const futureVisit = await visit.sort({visitDate:'asc'}).exec();
        if(req.user.isUser())
            res.render('calendar/index',{
                
                shoppingAll:shoppingList,
                searchOptions:req.query,
                newVisit:futureVisit,
                treatments:treatment,
                clients:clients,
                user:user,
                weekdays:weekdays,
            });
        else{
            req.logOut();
            res.sendStatus(403)
        }
        
    }catch(err){
        console.log(err)
        res.redirect('/login')
    }
    
})
/*
 * Delete visit
*/
router.delete('/:id',ensureAuthenticated, async (req,res)=>{
    try {
        let futureVisit= await FutureVisit.findById(req.params.id);
        await futureVisit.deleteOne();
        req.flash('mess','Wizyta została usunięta');
        req.flash('type','info');
        res.redirect('/calendar')
    }catch(err){
        console.log(err)
        req.flash('mess', 'Wizyta została usunięta!');
        req.flash('type', 'info')
        res.redirect('/calendar')
    }
})

/*
 * Create new visit
*/
router.post('/visit',ensureAuthenticated, async(req,res)=>{
    const cssSheets =[];
    cssSheets.push('../../public/css/user/front_page/index.css',"https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css");
    let futureVisit  = new FutureVisit({
        user:req.user.id,
        clientName:req.body.clients,
        visitDate :new Date(req.body.visitDate),
        timeFrom:req.body.timeFrom,
        timeTo:req.body.timeTo,
        treatment:req.body.treatment ,
        phoneNumber:req.body.phone,
    });
   
    try{
        await futureVisit.save();
       
        req.flash('mess', 'Dodano wyzyte!');
        req.flash('type', 'info-success')
        res.redirect('/calendar')
    }catch(err){
        console.log(err)
        res.redirect('/clients')
    }
})
/*
 * Edit visit
*/
router.put('/edit/:id', async(req,res)=>{
    let futureVisit;
  
      try{
        futureVisit = await FutureVisit.findById(Object(req.params.id)).exec()
        futureVisit.clientName = req.body.clients
        futureVisit.treatment = req.body.treatment
        futureVisit.visitDate =new Date(req.body.visitDate)
        futureVisit.timeFrom = req.body.timeFrom
        futureVisit.timeTo = req.body.timeTo
        futureVisit.phoneNumber = req.body.phone
    
        await futureVisit.save();
        req.flash('mess', 'Edytowano wizyte!');
        req.flash('type', 'info-success')
        res.redirect('/calendar')
    }catch(err){
        req.flash('mess', 'Nie udało sie edytować wizyty!');
        req.flash('type', 'info-alert')
        res.redirect('/calendar')
    }
})
/*
 * Handle request from js and send info about visit
*/
router.get('/:id', async(req, res)=>{
    let visitToFind;
    try{

        visitToFind = await FutureVisit.findById(req.params.id)
        res.send(visitToFind)
    }catch(err){
        console.log(err)
    }
})

module.exports =router;