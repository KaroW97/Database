const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const ClientVisits = require('../models/clientsVisits')
const Treatment = require('../models/treatment')
const ClientsShoppingsStats = require('../models/clientsShoppingsStats')
const ShoppingList = require('../models/shoppingList')
const ListProducts = require('../models/listProducts')
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
                price: sum
            }
        })
        let clientTop  = [...calculateSpentMonay].splice(0,2).sort((a,b)=>b.price - a.price)
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
            sectionNameChange:false,
            TopSection:false,
            TopSectionClient:true, 
            Top1:clientTop,
            amount:clientVisits.length,
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
        const companyShopping = await ClientsShoppingsStats.find();
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
                name:cs.treatment,
                price: date.length * cs.totalPrice,
                amount:date.length
            }
        })
        let treatmentsMadeSortSum = [...treatmentsMade].sort((a,b) => b.price - a.price).splice(0,2)
        let treatmentsMadeSortTreatmentSum = [...treatmentsMade].sort((a,b) => b.amount - a.amount).splice(0,2)
        let countTreatmentSum = [...treatmentsMade].reduce((a, {amount})=>a + amount,0)
        let totalSum =  [...treatmentsMade].reduce((a, b)=>a+ b.price ,0)
      
        res.render('stats/treatmentStats',{
            shoppingAll:shoppingList,
            treatments:treatment,
            amount:countTreatmentSum,
            user:req.user,
            searchOptions:req.query,

            Top1:treatmentsMadeSortSum,
            Top2:treatmentsMadeSortTreatmentSum,

            weekdays:weekdays,
            totalSum:totalSum,
            treatmentsMade:treatmentsMade,
            showHiddenFloatingButtons:true,
            sectionNameChange:false,
            TopSection:true,
            TopSectionClient:false
        })
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
   
})

//
/* 
 * Products shoppings statistics
*/
router.get('/shopping',ensureAuthenticated, async(req,res)=>{
    let todayDate = new Date(),weekDate=new Date();
    todayDate.setDate(todayDate.getDate() - 1)
    weekDate.setDate(todayDate.getDate() + 8)
    let dateFrom = req.query.dateFrom ||new Date(new Date().setFullYear(new Date().getFullYear() -1)).toISOString().split('T')[0]
    let dateTo = req.query.dateTo ||new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']

    try{
        let listProducts = await ListProducts.find({user:req.user.id})
        let distList = listProducts.map(item=> item.name)
        let filteredList = listProducts.map(item =>{
            let price = 0, dateArr = [], amount = 0
            let date = item.productInfo.reduce((sum,date) =>{
                if(date.date >= dateFrom && date.date <= dateTo){
                    dateArr.push(date.date)
                    price+=(date.price * date.amount)
                    amount +=date.amount
                }
                if(dateArr.length != 0 )
                    return {
                        name:item.name,
                        date : dateArr ,
                        price : price ,
                        amount: amount
                    }
            },{})
            return date
        }).filter(date=> date != undefined)

        let totalPrice = [...filteredList].reduce((sum,item) => sum + item.price, 0)
        let totalAmount =[...filteredList].reduce((sum,item) => sum + item.amount, 0)
        let sortedByPrice = [...filteredList].sort((a, b) => b.price - a.price).splice(0,2)
        let sortedByAmount = [...filteredList].sort((a, b) => b.amount - a.amount).splice(0,2)
     
        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})
        res.render('stats/shoppingStats',{
            Top1:sortedByPrice,
            Top2:sortedByAmount,
            amount:totalAmount,
            totalSum:totalPrice,

            shoppingAll:shoppingList,
            searchOptions:req.query,
            shoppingDist:distList,
            companyShopping: filteredList,
            TopSection:true,
            TopSectionClient:false,
            showHiddenFloatingButtons:true,
            sectionNameChange:true,
            weekdays:weekdays
        })
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
   
})
/*
* Client Statistics
*/
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
                name:treatmentName,
                price: sum,
                amount:treatmentSum
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
            sectionNameChange:false,
            amount:clientt.clientVisits.length,
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
