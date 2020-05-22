const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList')
//Show Calendar Page
router.get('/',async (req,res)=>{
    let todayDate = new Date();
    let shopping =  ShoppingList.find().populate('listName')
    let shoppingTwoDays =  ShoppingList.find().populate('listName')
    /*if(req.query.transactionDate != null &&  req.query.transactionDate !=''){
        //szukamy w bazie danych title od naszego req.query.title
        query = query.lte('publishDate', req.query.publishedBefore) //less then or equal
    }*/
    if(req.query.dateTime != null &&  req.query.dateTime !=''){
        shopping = shopping.gte('transactionDate', req.query.dateTime)
    }
        //od obecnej daty
        shoppingTwoDays = shoppingTwoDays.gte('transactionDate',todayDate.toISOString().split('T')[0])
        todayDate.setDate(todayDate.getDate() + 2)
        //do dwa dni do przodu
        shoppingTwoDays = shoppingTwoDays.lte('transactionDate',todayDate.toISOString().split('T')[0])
    
        
    try{
        const perchuse = await shopping.exec()
        const shoppingTwoDaysFromNow = await shoppingTwoDays.exec();
        res.render('calendar/index',{
            //perchuseStandard:perchuseStandardC,
            list:perchuse,
            shoppingTwoDaysFromNow:shoppingTwoDaysFromNow,
            todayDate:todayDate,
            searchOptions:req.query || ''
        });
    }catch(err){
        console.log(err)
    }
    
})


module.exports =router;