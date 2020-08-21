const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const ClientVisits = require('../models/clientsVisits')
const Treatment = require('../models/treatment')
const CompanyShopping = require('../models/stats/companyShoppingStats')
const ShoppingList = require('../models/shoppingList')
const {ensureAuthenticated} = require('../config/auth')
//Clients Statistics Main Page
router.get('/' ,ensureAuthenticated, async(req,res)=>{
    const cssSheets =[]
    cssSheets.push('../../public/css/user/statistics/statistics.css',"https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css");
    let todayDate = new Date(),weekDate=new Date();
    let cliantStats = ClientVisits.find().populate('treatment');

    let sum =0;

    if(req.query.dateFrom != null &&  req.query.dateFrom != '')
        cliantStats = cliantStats.gte('clientVisitDate', req.query.dateFrom);
    if(req.query.dateTo != null &&  req.query.dateTo != '')
        cliantStats = cliantStats.lte('clientVisitDate', req.query.dateTo);
    try{
    
      
        clientt =await Client.find({user:req.user.id}).exec();
      
        const clientVisits = await cliantStats.exec();
        todayDate.setDate(todayDate.getDate() - 1)
        weekDate.setDate(todayDate.getDate() + 8)
        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})

        res.render('stats/index',{
            shoppingAll:shoppingList,
            user:req.user,
            clients:clientt,
            sum:sum,
            addedVisist:clientVisits ,
            searchOptions:req.query ,
            styles:cssSheets
            
        })
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
})
//Treatments Statistics Main Page
router.get('/treatment', ensureAuthenticated,async(req,res)=>{
    let todayDate = new Date(),weekDate=new Date();
    let sum=0;
    let moneySpent = 0;
    const cssSheets =[]
    cssSheets.push('../../public/css/user/statistics/statistics.css',"https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css");

    let cliantStats =  ClientVisits.find().populate('treatment')/*.find({user:req.user.id})*/

    if(req.query.dateFrom != null &&  req.query.dateFrom != '')
        cliantStats = cliantStats.gte('clientVisitDate', req.query.dateFrom);
    if(req.query.dateTo != null &&  req.query.dateTo != '')
        cliantStats = cliantStats.lte('clientVisitDate', req.query.dateTo);

    try{
        todayDate.setDate(todayDate.getDate() - 1)
        weekDate.setDate(todayDate.getDate() + 8)
        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})



        const treatment =  Treatment.find({user:req.user.id});
        let treatments = await treatment.find({user:req.user.id}).exec();
        const clientVisits = await cliantStats.find({user:req.user.id}).exec()
        var totalAmountOfTreatments =  calculateAmountOfTreatments(treatments,clientVisits )
        var totalAmountOfSpent = calculateTotalAmountSpent(clientVisits);
        res.render('stats/treatmentStats',{
            shoppingAll:shoppingList,
            treatmentExists: false,
            treatments:treatments,
            clientVisits:clientVisits,
            user:req.user,
            searchOptions:req.query,
            sum:sum,
            moneySpent:moneySpent,
            totalAmountOfTreatments:totalAmountOfTreatments,
            totalAmountOfSpent:totalAmountOfSpent,
            styles:cssSheets
        })
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
   
})
//Shopping Statistics Main Page
router.get('/shopping',ensureAuthenticated, async(req,res)=>{
    var countAmountOfBoughtProducts  = [], countPriceOfBoughtProducts  = [],cssSheets =[];
    let todayDate = new Date(),weekDate=new Date();
    let searchOptions =  CompanyShopping.find({user:req.user.id})
    cssSheets.push('../../public/css/user/statistics/statistics.css',"https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css");
    if(req.query.dateFrom != null && req.query.dateFrom!='')
        searchOptions = searchOptions.gte('transactionDate', req.query.dateFrom)
    if(req.query.dateTo != null && req.query.dateTo!='')
        searchOptions = searchOptions.lte('transactionDate', req.query.dateTo)

   
    try{
        let companyDistinctShopping =  await CompanyShopping.find({user:req.user.id}).find(searchOptions).sort({productName:'asc'}).distinct("productName");
        let companyShopping = await searchOptions.sort({productName:'asc'}).exec()
        let price = totalShoppingPrice(companyShopping)
        let amount = totalShoppingAmount(companyShopping)
        todayDate.setDate(todayDate.getDate() - 1)
        weekDate.setDate(todayDate.getDate() + 8)
        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})
        res.render('stats/shoppingStats',{
            shoppingAll:shoppingList,
            companyShopping:companyShopping,
            companyDistinctShopping:companyDistinctShopping,
            countAmountOfBoughtProducts:countAmountOfBoughtProducts,
            countPriceOfBoughtProducts:countPriceOfBoughtProducts,
            totalPrice:price,
            amount:amount,
            searchOptions:req.query,
            styles:cssSheets
        })
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
   
})

router.delete('/shopping/:id', async(req,res)=>{
    
    var shopping;
    try{
      
            var shoppingAll = await CompanyShopping.find()
            for(var i=0; i<shoppingAll.length;i++)
                var shopping = await CompanyShopping.find({productName:req.params.id}).find({user:req.user.id});
            console.log(shopping)
            for(var i=0;i<shopping.length ; i++)
                await shopping[i].remove()

            if(shopping.length >1){
                req.flash('mess','Usunięto Statystyki Produktów')
                req.flash('type','success')
            }else{
                req.flash('mess','Usunięto Statystyke Produktu')
                req.flash('type','success')
            }
      
        
        res.redirect('/statistics/shopping')
    }catch(err){
        console.log(err)
        req.flash('mess','Nie udało się usunąć rekordu.')
        req.flash('type','danger')
        res.redirect('/statistics/shopping')
       
    }
})
//Client Statistics
router.get('/:id', ensureAuthenticated,async(req,res)=>{
    const cssSheets =[]
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']
    cssSheets.push('../../public/css/user/front_page/index.css',"https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css");
    let clientVisitDate =  ClientVisits.find({client:req.params.id}).populate('treatment').populate('client')
    if(req.query.dateFrom != null &&  req.query.dateFrom !=''){
        clientVisitDate = clientVisitDate.gte('clientVisitDate', req.query.dateFrom)
    }
    if(req.query.dateTo != null &&  req.query.dateTo !=''){
        clientVisitDate = clientVisitDate.lte('clientVisitDate', req.query.dateTo)
    }
    try{
        const clientt  = await Client.findById(req.params.id)
        const clientVisit = await clientVisitDate.exec()

       
        var totalPrcie = calculateTotalPrice(clientVisit)
        const treatment = await Treatment.find()
        res.render('stats/clientStatsView',{
            clientInfo:clientt,
            clientVisits:clientVisit,
            treatments:treatment,
            totalPrice:totalPrcie,
            searchOptions:req.query|| '',
            styles:cssSheets

        })
    }catch(err){
        console.log(err)
        res.redirect('/statistics')
    }
})

module.exports = router;

function totalShoppingPrice(companyShopping){
    var count =0;
    companyShopping.forEach(shopping=>{
        count+=shopping.productPrice
    })
    return count
}
function totalShoppingAmount(companyShopping){
    var count =0;
    for(var i=0;i<companyShopping.length ; i++)
        count++;
    return count
}
///////////////
function calculateAmountOfTreatments(treatments,clientVisits ){
    var countAmount = 0;
    for(var i = 0 ; i< treatments.length ; i++  ){
        for(var j = 0; j < clientVisits.length ; j++){
            if(clientVisits[j].treatment != null)
            if(treatments[i].id == clientVisits[j].treatment._id)
                countAmount++;
        }
    }
       
     
    return countAmount;
}
function calculateTotalAmountSpent(clientVisits){
    let price= 0;
    for(var j = 0; j < clientVisits.length ; j++){
        if(clientVisits[j].treatment)
            price+= clientVisits[j].treatment.treatmentPrice;

    }
    return price;
}
function calculateTotalPrice(clientVisits){
    let countTotal=0;
    for(var i=0;i<clientVisits.length ;i++){
        if(clientVisits[i].treatment!= null)
            countTotal+=clientVisits[i].treatment.treatmentPrice
    }
    
    
    return countTotal
}

