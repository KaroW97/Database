const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const ClientVisits = require('../models/clientsVisits')
const Treatment = require('../models/treatment')
const CompanyShopping = require('../models/companyShoppingStats')
const ShoppingList = require('../models/shoppingList')
const {ensureAuthenticated} = require('../config/auth')
/*
* Clients Sell Statistics Main Page
*/
router.get('/' ,ensureAuthenticated, async(req,res)=>{
    let todayDate = new Date(),weekDate=new Date();
    todayDate.setDate(todayDate.getDate() - 1)
    weekDate.setDate(todayDate.getDate() + 8)
    let dateFrom = req.query.dateFrom ||new Date(new Date().setFullYear(new Date().getFullYear() -1)).toISOString().split('T')[0]
    let dateTo = req.query.dateTo ||new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.'] 

    try{
        const clientt =await Client.find({user:req.user.id}).exec();
        const clientVisits = await ClientVisits.find({user:req.user.id, clientVisitDate:{
            $gte:dateFrom,
            $lte:dateTo
        }}).exec();
        const calculateSpentMonay = clientt.map(client=>{
            let sum = client.clientVisits.reduce( (sum,cv) =>{
                if(cv.clientVisitDate.toISOString().split('T')[0] >= dateFrom && 
                    cv.clientVisitDate.toISOString().split('T')[0] <= dateTo)
                    sum += parseInt(cv.price) 
                return sum
            },0 )
            return{
                clientId:client.id,
                client: client.name + ' ' + client.lastName,
                sum: sum
            }
        })
        let clientTop  = [...calculateSpentMonay].splice(0,2).sort((a,b)=>b.sum - a.sum)
        const totalSum = clientVisits.reduce((a, cv) =>a + cv.price  , 0)
        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})
        
        res.render('stats/index',{
            shoppingAll:shoppingList,
            user:req.user,
            clients:clientt,
            addedVisist:calculateSpentMonay ,
            searchOptions:req.query , 
            weekdays:weekdays,
            showHiddenFloatingButtons:true,
            TopSection:false,
            TopSectionClient:true, 
            Top1:clientTop,
            clientVisits:clientVisits.length,
            totalSum:totalSum,
        })
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
})
/*
* Treatments Sell Statistics Main Page
*/
router.get('/treatment', ensureAuthenticated,async(req,res)=>{
    let todayDate = new Date(),weekDate=new Date();
    todayDate.setDate(todayDate.getDate() - 1)
    weekDate.setDate(todayDate.getDate() + 8)
    let dateFrom = req.query.dateFrom ||new Date(new Date().setFullYear(new Date().getFullYear() -1)).toISOString().split('T')[0]
    let dateTo = req.query.dateTo ||new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']

    try{
        const companyShopping = await CompanyShopping.find();
        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})
        const treatment =  await Treatment.find({user:req.user.id});
        const treatmentsMade = companyShopping.map(cs =>{
            let date = cs.transactionDate.filter(date =>{
                return date >= dateFrom && date <= dateTo
            })
            return{
                treatmentName:cs.treatment,
                sum: date.length * cs.totalPrice,
                treatmentSum:date.length
            }
        })
        let treatmentsMadeSortSum = [...treatmentsMade].splice(0,2).sort((a,b) => b.sum - a.sum)
        let treatmentsMadeSortTreatmentSum = [...treatmentsMade].splice(0,2).sort((a,b) => b.treatmentSum - a.treatmentSum)
        let countTreatmentSum = [...treatmentsMade].reduce((a, {treatmentSum})=>a + treatmentSum,0)
        let totalSum =  [...treatmentsMade].reduce((a, b)=>a+ b.sum ,0)
        res.render('stats/treatmentStats',{
            shoppingAll:shoppingList,
            treatments:treatment,
            clientVisits:countTreatmentSum,
            user:req.user,
            searchOptions:req.query,

            Top1:treatmentsMadeSortSum,
            Top2:treatmentsMadeSortTreatmentSum,

            weekdays:weekdays,
            totalSum:totalSum,
            treatmentsMade:treatmentsMade,
            showHiddenFloatingButtons:true,
            TopSection:true,
            TopSectionClient:false

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
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']
    let searchOptions =  CompanyShopping.find({user:req.user.id})
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
    
            TopSection:false,
            weekdays:weekdays
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
    let todayDate = new Date(),weekDate=new Date();
    todayDate.setDate(todayDate.getDate() - 1)
    weekDate.setDate(todayDate.getDate() + 8)
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']
    let clientVisitDate =  ClientVisits.find({client:req.params.id}).populate('client')
    let dateFrom = req.query.dateFrom ||new Date(new Date().setFullYear(new Date().getFullYear() -1)).toISOString().split('T')[0]
    let dateTo = req.query.dateTo ||new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  
    if(req.query.dateFrom != null &&  req.query.dateFrom !=''){
        clientVisitDate = clientVisitDate.gte('clientVisitDate', req.query.dateFrom)
    }
    if(req.query.dateTo != null &&  req.query.dateTo !=''){
        clientVisitDate = clientVisitDate.lte('clientVisitDate', req.query.dateTo)
    }
    try{
      
        const clientt  = await Client.findById(req.params.id)
        const clientVisit = await clientVisitDate.distinct('treatment').exec()
       
        const totalSum = clientt.clientVisits.reduce((a, b) =>{
            return a + parseInt(b.price)
        },0)
        const treatmentsMade = clientVisit.map(treatmentName=>{
            let sum = 0,treatmentSum=0;
            clientt.clientVisits.filter(clientVisits =>{
                if(clientVisits.treatment === treatmentName &&   
                    clientVisits.clientVisitDate.toISOString().split('T')[0] >= dateFrom &&
                    clientVisits.clientVisitDate.toISOString().split('T')[0] <= dateTo){
                        sum += parseInt(clientVisits.price, 10)
                        treatmentSum+=1
                }
            })
            return{
                treatmentName:treatmentName,
                sum: sum,
                treatmentSum:treatmentSum
            }
        })
    
        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})
        const treatments = await Treatment.find({user:req.user.id})
        clientVisitDate =''
        res.render('stats/clientStatsView',{
            clientInfo:clientt,
            shoppingAll:shoppingList,
            searchOptions:req.query|| '',
            weekdays:weekdays,
            treatmentsMade:treatmentsMade,
            totalSum:totalSum,
            showHiddenFloatingButtons:true,
            clientVisits:clientt.clientVisits.length,
            treatments:treatments,
            TopSection:false,
            TopSectionClient:false

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
