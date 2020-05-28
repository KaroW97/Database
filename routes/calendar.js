const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList')
const {ensureAuthenticated} = require('../config/auth')
//Show Calendar Page
router.get('/',ensureAuthenticated,async (req,res)=>{
    let todayDate = new Date();

    let shopping =  ShoppingList.find({user:req.user.id}).populate('listName')
    let shoppingTwoDays =  ShoppingList.find({user:req.user.id}).populate('listName')
    /*if(req.query.transactionDate != null &&  req.query.transactionDate !=''){
        //szukamy w bazie danych title od naszego req.query.title
        query = query.lte('publishDate', req.query.publishedBefore) //less then or equal
    }*/
    if(req.query.dateTime != null &&  req.query.dateTime !=''){
        shopping = shopping.gte('transactionDate', req.query.dateTime)
    }else{
        shopping = shopping.gte('transactionDate',todayDate.toISOString().split('T')[0])
    }
    //For Two Days From Nowssssssssssssssss
        //Todays Date
        shoppingTwoDays = shoppingTwoDays.gte('transactionDate',todayDate.toISOString().split('T')[0])
        todayDate.setDate(todayDate.getDate() + 2)
        //Two Days From Now Date
        shoppingTwoDays = shoppingTwoDays.lte('transactionDate',todayDate.toISOString().split('T')[0])
    
    try{
        const perchuse = await shopping.exec()
        const shoppingTwoDaysFromNow = await shoppingTwoDays.exec();
        res.render('calendar/index',{
            //perchuseStandard:perchuseStandardC,
            list:perchuse,
            shoppingTwoDaysFromNow:shoppingTwoDaysFromNow,
            searchOptions:req.query || ''
        });
    }catch(err){
        console.log(err)
        res.redirect('/shoppingList')
    }
    
})


module.exports =router;