const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList')
const Treatment = require('../models/treatment');
const FutureVisit = require('../models/clientFutureVisit')
const Client = require('../models/clients')
const {ensureAuthenticated} = require('../config/auth')
//Show Calendar Page
router.get('/',ensureAuthenticated,async (req,res)=>{
 
    let todayDate = new Date();
    let shopping =  ShoppingList.find({user:req.user.id}).populate('listName')
    let shoppingTwoDays =  ShoppingList.find({user:req.user.id}).populate('listName')
    if(req.query.dateTime != null &&  req.query.dateTime !='')
        shopping = shopping.gte('transactionDate', req.query.dateTime)
    else
        shopping = shopping.gte('transactionDate',todayDate.toISOString().split('T')[0])

    //For Two Days From Now //Todays Date Or Only Shopping To Figure Out
    shoppingTwoDays = shoppingTwoDays.gte('transactionDate',todayDate.toISOString().split('T')[0])
   // todayDate.setDate(todayDate.getDate() + 2)
    //Two Days From Now Date
    //shoppingTwoDays = shoppingTwoDays.lte('transactionDate',todayDate.toISOString().split('T')[0])
    try{
        const perchuse = await shopping.exec()
        const shoppingTwoDaysFromNow = await shoppingTwoDays.exec();
        const treatment = await Treatment.find({user:req.user.id});
        const clients =  await Client.find({user:req.user.id});
        const futureVisit = await FutureVisit.find({user:req.user.id}).populate('client').populate('treatment')
        if(req.user.isUser())
            res.render('calendar/index',{
                //perchuseStandard:perchuseStandardC,
                list:perchuse,
                shoppingTwoDaysFromNow:shoppingTwoDaysFromNow,
                searchOptions:req.query || '',
                newVisit:futureVisit,
                treatments:treatment,
                clients:clients
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
//Create New Visit
router.post('/visit', async(req,res)=>{
    let futureVisit
    if(req.body.clientName=='' ||req.body.clientLastName==''){
        futureVisit  = new FutureVisit({
            user:req.user.id,
            client:req.body.clients,
            visitDate :Date.parse(req.body.visitDate)|| new Date(req.body.visitDate),
            timeFrom:req.body.timeFrom,
            timeTo:req.body.timeTo,
            treatment:req.body.treatment
        });  
    }else{
        futureVisit  = new FutureVisit({
            user:req.user.id,
            clientName:req.body.clientName,
            clientLastName:req.body.clientLastName ,
            visitDate :Date.parse(req.body.visitDate)|| new Date(req.body.visitDate),
            timeFrom:req.body.timeFrom,
            timeTo:req.body.timeTo,
            treatment:req.body.treatment
        });  
    }
    
    try{
        await futureVisit.save();
        req.flash('created', 'Dodano wyzyte!');
        req.flash('success', 'success')
        res.redirect('/calendar')
    }catch(err){
        console.log(err)
        let shoppingTwoDays, todayDate = new Date();
        let shopping =  await ShoppingList.find({user:req.user.id}).populate('listName')
       
        shoppingTwoDays = ShoppingList.find({user:req.user.id}).populate('listName').gte('transactionDate',todayDate.toISOString().split('T')[0])
        todayDate.setDate(todayDate.getDate() + 2)
        //Two Days From Now Date
        shoppingTwoDays = ShoppingList.find({user:req.user.id}).populate('listName').lte('transactionDate',todayDate.toISOString().split('T')[0])
        const shoppingTwoDaysFromNow = await shoppingTwoDays.exec();
        const clients =  await Client.find({user:req.user.id});
        const treatment = await Treatment.find({user:req.user.id});
        res.render('calendar/index',{
            list:shopping,
            shoppingTwoDaysFromNow:shoppingTwoDaysFromNow,
            clients:clients,
            newVisit:futureVisit,
            treatments:treatment,
            errorMessage:'Nie udało się utworzyć wizyty.',
            type:'danger',
            searchOptions:''
        })
    }
})

module.exports =router;