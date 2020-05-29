const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const ClientVisits = require('../models/clientsVisits')
const Treatment = require('../models/treatment')
const {ensureAuthenticated} = require('../config/auth')
//Clients Statistics Main Page
router.get('/' ,ensureAuthenticated, async(req,res)=>{
    let cliantStats = ClientVisits.find().populate('treatment');
    let searchClient = {}
    let searchClientLastName = {}
    if(req.query.clientName!= null && req.query.clientName !==''){
        searchClient.name = new RegExp(req.query.clientName, 'i')
        searchClientLastName.lastName = new RegExp(req.query.clientName, 'i')
    }
  
    if(req.query.dateFrom != null &&  req.query.dateFrom != '')
        cliantStats = cliantStats.gte('clientVisitDate', req.query.dateFrom);
    if(req.query.dateTo != null &&  req.query.dateTo != '')
        cliantStats = cliantStats.lte('clientVisitDate', req.query.dateTo);
    try{
        const clients =  Client.find(searchClient);
        const clientLastName =  Client.find(searchClientLastName);

        let clientt =await clients.find({user:req.user.id}).exec();
        if(clientt =='')
            clientt =await clientLastName.find({user:req.user.id}).exec();
        const clientVisits = await cliantStats.exec();
        res.render('stats/index',{
            user:req.user.id,
            clients:clientt,

            addedVisist:clientVisits ,
            searchOptions:req.query
        })
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
})
//Treatments Statistics Main Page
router.get('/treatment', async(req,res)=>{
    try{
        res.render('stats/treatmentStats',{
            user:req.user.id
        })
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
   
})
//Shopping Statistics Main Page
router.get('/shopping', async(req,res)=>{
    try{
        res.render('stats/shoppingStats',{
            user:req.user.id
        })
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
   
})

//Client Statistics
router.get('/:id', ensureAuthenticated,async(req,res)=>{
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
        var totalPrcie = calculateTotalPricec(clientVisit)
        const treatment = await Treatment.find()
        res.render('stats/clientStatsView',{
            clientInfo:clientt,
            user:req.user.id,
            clientVisits:clientVisit,
            treatments:treatment,
            totalPrice:totalPrcie,
            searchOptions:req.query|| ''

        })
    }catch(err){
        console.log(err)
        res.redirect('/statistics')
    }
})

module.exports = router;




function calculateTotalPricec(clientVisits){
    var countTotal=0;
    for(var i=0;i<clientVisits.length ;i++)
        countTotal+=clientVisits[i].treatment.treatmentPrice
    return countTotal
}
