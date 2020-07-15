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
//Show Calendar Page
router.get('/',ensureAuthenticated,async (req,res)=>{
    let cssSheets = [];
    cssSheets.push('../../public/css/user/front_page/index.css',"https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css");
    let shopping = FutureVisit.find({user:req.user.id}).populate('client').populate('treatment')
    if(req.query.visitAfter != null &&  req.query.visitAfter !=''){
        shopping = shopping.gte('visitDate', req.query.visitAfter)  
    }
    if(req.query.visitBefore != null &&  req.query.visitBefore !='')
        shopping = shopping.lte('visitDate', req.query.visitBefore)
    try{
       
        const user = await User.findById(req.user.id);
        const perchuse = await shopping.exec()
        const shoppingAll = await ShoppingList.find({user:req.user.id}).populate('listName')
        const treatment = await Treatment.find({user:req.user.id});
        const clients =  await Client.find({user:req.user.id});
     
        const futureVisit = await shopping.sort({visitDate:'asc'}).exec();
      // const futureVisit = await shopping.exec();
        if(req.user.isUser())
            res.render('calendar/index',{
                list:perchuse,
                shoppingAll:shoppingAll,
                searchOptions:req.query,
                newVisit:futureVisit,
                treatments:treatment,
                clients:clients,
                user:user,
                styles:cssSheets,
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
//Delete Visito
router.delete('/:id',ensureAuthenticated, async (req,res)=>{
    try {
        let futureVisit= await FutureVisit.findById(req.params.id);
        await futureVisit.remove();
        req.flash('mess','Wizyta została usunięta');
        req.flash('type','success');
        res.redirect('/calendar')
    }catch(err){
        console.log(err)
        req.flash('err','Wizyta została usunięta');
        res.redirect('/calendar')
    }
})
//Create New Visit
router.post('/visit',ensureAuthenticated, async(req,res)=>{
    const cssSheets =[];
    cssSheets.push('../../public/css/user/front_page/index.css',"https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css");
    let futureVisit  = new FutureVisit({
        user:req.user.id,
        client:req.body.clients,
        newClient:req.body.newClient,
        visitDate :req.body.visitDate,
        timeFrom:req.body.timeFrom,
        timeTo:req.body.timeTo,
        treatment:req.body.treatment ,
        newTreatment:req.body.newTreatment,
        phoneNumber:req.body.phone,
        clientState:req.body.clientState,
        treatmentState:req.body.treatmentState
    });
   
    try{
        await futureVisit.save();
       
        req.flash('mess', 'Dodano wyzyte!');
        req.flash('type', 'success')
        res.redirect('/calendar')
    }catch(err){
        console.log(err)
        res.redirect('/clients')
    }
})

router.put('/edit/:id', async(req,res)=>{
    let futureVisit;
      try{
        futureVisit = await FutureVisit.findById(req.params.id).populate( 'treatment').populate('client').exec()

        if(req.body.clientState == 'newClient'){
            futureVisit.newClient = req.body.newClient
            futureVisit.client=null;
            
        }else if(req.body.clientState == 'clients'){
            futureVisit.client = req.body.clients
            futureVisit.newClient=null;
          
        }
        if(req.body.treatmentState=='newTreatment'){
            futureVisit.newTreatment = req.body.newTreatment
            futureVisit.treatment=null;
           
        }else{
            futureVisit.treatment = req.body.treatment
            futureVisit.newTreatment=null;
        }
        futureVisit.clientState = req.body.clientState
        futureVisit.treatmentState = req.body.treatmentState
        futureVisit.visitDate =new Date(req.body.visitDateEdit)
        futureVisit.timeFrom = req.body.timeFromEdit
        futureVisit.timeTo = req.body.timeToEdit
        futureVisit.phoneNumber = req.body.phone

        await futureVisit.save();
        req.flash('mess', 'Edytowano wizyte!');
        req.flash('type', 'success')
        res.redirect('/calendar')
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
})


module.exports =router;