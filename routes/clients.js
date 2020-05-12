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
        const clients = await Client.find(searchOptions); //we have no conditions 
        res.render('clients/index',{
            clients:clients,
            searchOptions:req.query
        });
        //console.log(req.body)
    }catch{
        res.redirect('/calendar')
    }
   
})

//New Client Route Displaing form
var skinDiagnoseNames =["Sucha skóra","Zmarszczki i drobne linie","Brak jędrności"];
router.get('/new',async (req,res)=>{
   try{
    res.render('clients/new',{ 
        clients: new Client(),
        skinDiagnoseNames:skinDiagnoseNames,
       
         })
   }catch{
       res.redirect('/clients')
   }
   
})

//Create Client Route

router.post('/', async(req,res)=>{

    const clients = new Client({
        visitDate:req.body.visitDate,
        nextVisitDate:req.body.nextVisitDate,
        name:req.body.name,
        lastName:req.body.lastName,
        phoneNumber:req.body.phoneNumber,
        dateOfBirth:req.body.dateOfBirth,
        skinDiagnoseNames:skinDiagnoseNames,
        skinDiagnose:req.body.skinDiagnose,
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
    console.log(clients.skinDiagnoseAll)
    
    try{
        const newClient = await clients.save();
        //res.redirect(`clients/${newClient.id}`)
        res.redirect( `clients`)
    }catch{
        res.render('clients/new',{
            clients:clients,
            errorMessage:'Error creating Client',
            skinDiagnoseNames:skinDiagnoseNames
            
        });
    }
})


//Show Client
router.get('/show',async (req,res)=>{

    try{
        const treatments = await Treatment.find({});
        const newVisit = new ClientVisits();
        res.render('clients/show',{
            treatments:treatments,
            comment:newVisit
        });
    }catch{
        res.redirect('/clients')
    }
})

//Add new Visit
router.post('/show', async(req,res)=>{
    const treatments = await Treatment.find({});
    
    const newVisit = new ClientVisits({
        //client:req.body.client
        clientVisitDate:req.body.clientVisitDate,
        comment:req.body.comment,
        treatment:req.body.treatment
    })
   
    try{
        const visit = await newVisit.save();
        res.redirect( `/clients`)
    }catch{
        res.render('clients/show',{
            comment:newVisit,
            treatments:treatments,
            errorMessage:'Error creating Client',
        })
    }
})

module.exports = router;