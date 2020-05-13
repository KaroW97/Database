const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const Treatment = require('../models/treatment')
const ClientVisits = require('../models/clientsVisits')


//All Clients Route
router.get('/', async(req,res)=>{
    let searchOptions ={};
    if(req.query.name!= null && req.query.name !==''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const newVisit = await ClientVisits.find({})
        const treatments = await Treatment.find({});
        const clients = await Client.find(searchOptions); //we have no conditions 
        res.render('clients/index',{
            clients:clients,
            treatments:treatments,
            newVisit:newVisit,
            searchOptions:req.query
        });
    }catch{
        res.redirect('/calendar')
    }
   
})

//New Client Route Displaing form
router.get('/new',async (req,res)=>{
   try{
    res.render('clients/new',{ clients: new Client(),})
   }catch{
       res.redirect('/clients')
   }
   
})

//Create Client Route
router.post('/', async(req,res)=>{

    const clients = new Client({
        visitDate:Date(req.body.visitDate),
        nextVisitDate:Date(req.body.nextVisitDate),
        name:req.body.name,
        lastName:req.body.lastName,
        phoneNumber:req.body.phoneNumber,
        dateOfBirth:Date(req.body.dateOfBirth),
        //Diagnoza skory
        skinDiagnoseAll:{
            drySkin:req.body.drySkin,
            wrinkless:req.body.wrinkless,
            lackfirmnes:req.body.lackfirmnes,
            nonuniformColor:req.body.nonuniformColor,
            tiredness:req.body.tiredness,
            acne:req.body.acne,
            smokerSkin:req.body.smokerSkin,
            fatSkin:req.body.fatSkin,
            discoloration:req.body.discoloration,
            blackheads:req.body.blackheads,
            darkCirclesEyes:req.body.darkCirclesEyes,
            dilatedCapillaries:req.body.dilatedCapillaries,
            papularPustularAcne:req.body.papularPustularAcne,
            externallyDrySkin:req.body.externallyDrySkin,
            other:req.body.other,
        },
        other:req.body.other,

        //Wywiad
        washingFace:req.body.washingFace,
        faceTension:req.body.faceTension,
        currentFaceCreams:req.body.currentFaceCreams,

        //Zakupy
        shopping:req.body.shopping,

        //Diagnoza
        diagnose1:req.body.diagnose1,
        teraphyPlan:req.body.teraphyPlan,
        recommendedCare:req.body.recommendedCare,
    })
    console.log(clients)
    
    try{
        const newClient = await clients.save();
        //res.redirect(`clients/${newClient.id}`)
        res.redirect( `clients`)
    }catch(err){
        console.log(err)
        res.render('clients/new',{
            clients:clients,
            errorMessage:'Error creating Client', 
        });
    }
})


//Show Client toturial
router.get('/clientView/:id',async(req,res)=>{
    try{
     
        const visit = await ClientVisits.find({})
        if(visit.comment =='default')
            visit.collection.remove();
        
        const treatments = await Treatment.find({});
        const clientt  = await Client.findById(req.params.id)
        res.render('clients/clientView',{
            treatments:treatments,
            newVisit:visit,
            curentClient:req.params.id,
            newVisit:visit,
            clientInfo:clientt  
        })
    }catch(err){
        console.log(err)
        res.redirect('/clients')
    }
})

//Add new Visit
router.post('/clientView/:id', async(req,res)=>{
    const treatments = await Treatment.find({});
    const clientt  = await Client.findById(req.params.id)
    const visit = new ClientVisits({
        client:req.params.id,
        clientVisitDate:Date( req.body.clientVisitDate) ,
        comment: req.body.comment ||'default' ,
        treatment: req.body.treatment,
    })

    
    try{
    
     
        const newVisit = await visit.save();
        res.redirect( `/clients/clientView/${req.params.id}`)
    }catch(err){
        console.log(err)
        res.render(`clients/clientView`,{
            errorMessage:'Error creating Visit',
            newVisit:visit,
            treatments:treatments,
           
            curentClient:req.params.id,
            clientInfo:clientt
        })
    }
})
router.get('/clientView/:id/edit', async(req,res)=>{
    try{
        const clietnEdit = await Client.findById(req.params.id)
        res.render('clients/edit',{
            clients:clietnEdit
        })
    }catch{
        res.redirect(`/clients/${clietnEdit._id}`)
    }
   
})
router.put('/clientView/:id',(req,res)=>{
    res.send('Update Client' + req.params.id)
})
router.delete('/clientView/:id/delete',(req,res)=>{
    res.send('Delete Client' + req.params.id)
})
module.exports = router;