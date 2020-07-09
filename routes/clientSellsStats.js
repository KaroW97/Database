const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const ClientVisits = require('../models/clientsVisits')
const Treatment = require('../models/treatment')
const CompanyShopping = require('../models/stats/companyShoppingStats')
const {ensureAuthenticated} = require('../config/auth')
//Clients Statistics Main Page
router.get('/' ,ensureAuthenticated, async(req,res)=>{
    const cssSheets =[]

    let cliantStats = ClientVisits.find().populate('treatment');
    let searchClient = {}
    let searchClientLastName = {}
    let sum =0;
    if(req.query.clientName!= null && req.query.clientName !==''){
        searchClient.name = new RegExp(req.query.clientName, 'i')
        searchClientLastName.lastName = new RegExp(req.query.clientName, 'i')
    }
    if(req.query.dateFrom != null &&  req.query.dateFrom != '')
        cliantStats = cliantStats.gte('clientVisitDate', req.query.dateFrom);
    if(req.query.dateTo != null &&  req.query.dateTo != '')
        cliantStats = cliantStats.lte('clientVisitDate', req.query.dateTo);
    try{
        const clients =  Client.find(searchClient)
        const clientLastName =  Client.find(searchClientLastName);
        
        let clientt =await clients.find({user:req.user.id}).exec();
        if(clientt =='')
            clientt =await clientLastName.find({user:req.user.id}).exec();
        const clientVisits = await cliantStats.exec();
        res.render('stats/index',{
            user:req.user,
            clients:clientt,
            sum:sum,
            addedVisist:clientVisits ,
            searchOptions:req.query,
            styles:cssSheets
            
        })
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
})
//Treatments Statistics Main Page
router.get('/treatment', async(req,res)=>{
    let searchTreatment = {};
    let sum=0;
    let moneySpent = 0;
    const cssSheets =[]

    let cliantStats =  ClientVisits.find().populate('treatment')/*.find({user:req.user.id})*/
    if(req.query.treatment != null &&req.query.treatment !='')
        searchTreatment.treatmentName = new RegExp(req.query.treatment,'i');
    
    if(req.query.dateFrom != null &&  req.query.dateFrom != '')
        cliantStats = cliantStats.gte('clientVisitDate', req.query.dateFrom);
    if(req.query.dateTo != null &&  req.query.dateTo != '')
        cliantStats = cliantStats.lte('clientVisitDate', req.query.dateTo);

    try{
        const treatment =  Treatment.find(searchTreatment)//.find({user:req.user.id});
        let treatments = await treatment.find({user:req.user.id}).exec();
        const clientVisits = await cliantStats.find({user:req.user.id}).exec()
        if(clientVisits.treatment != null){
            var totalAmountOfTreatments =  calculateAmountOfTreatments(treatments,clientVisits )
            var totalAmountOfSpent = calculateTotalAmountSpent(clientVisits);
        }
        res.render('stats/treatmentStats',{
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
router.get('/shopping', async(req,res)=>{
    var countAmountOfBoughtProducts =0;
    var countPriceOfBoughtProducts = 0;
    const cssSheets =[]

    //let searchOptions = {}
    let searchOptions = CompanyShopping.find({user:req.user.id})
   // let companyDistinct=   CompanyShopping.find({user:req.user.id}).distinct("productName")
    if(req.query.product != null && req.query.product !='')
        searchOptions = searchOptions.regex('productName', new RegExp(req.query.product , 'i'))
        //searchOptions.productName  = new RegExp(req.query.product , 'i');
    if(req.query.dateFrom != null && req.query.dateFrom!='')
        searchOptions = searchOptions.gte('transactionDate', req.query.dateFrom)
    if(req.query.dateTo != null && req.query.dateTo!='')
        searchOptions = searchOptions.lte('transactionDate', req.query.dateTo)

   
    try{
        let companyDistinctShopping =  await CompanyShopping.find({user:req.user.id}).find(searchOptions).distinct("productName");
        //let companyDistinctShopping =  await companyDistinct.exec();
        let companyShopping = await searchOptions.exec()
        let price = totalShoppingPrice(companyShopping)
        let amount = totalShoppingAmount(companyShopping)
        res.render('stats/shoppingStats',{
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

router.delete('/shopping', async(req,res)=>{
   
    var shopping;
    try{
        if(req.body.checkboxDelete != null ){
            for(var i=0; i<req.body.checkboxDelete.length;i++)
                var shopping = await CompanyShopping.find({productName:req.body.checkboxDelete}).find({user:req.user.id});
            for(var i=0;i<shopping.length ; i++)
                await shopping[i].remove()

            if(shopping.length >1){
                req.flash('mess','Usunięto Statystyki Produktów')
                req.flash('type','success')
            }else{
                req.flash('mess','Usunięto Statystyke Produktu')
                req.flash('type','success')
            }
        }else{
            req.flash('mess','Nie Podano Elementu Do Usunięcia')
            req.flash('type','info') 
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
    for(var i = 0 ; i< treatments.length ; i++  )
        for(var j = 0; j < clientVisits.length ; j++)
            if(treatments[i].id == clientVisits[j].treatment._id)
                countAmount++;
    return countAmount;
}
function calculateTotalAmountSpent(clientVisits){
    let price= 0;
    for(var j = 0; j < clientVisits.length ; j++)
        price+= clientVisits[j].treatment.treatmentPrice;
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

