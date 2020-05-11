const express = require('express');
const router = express.Router();
const Client = require('../models/clients')

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
        console.log(req.body)
    }catch{
        res.redirect('/calendar')
    }
   
})
//New Client Route Displaing form
router.get('/new',(req,res)=>{
    res.render('clients/new',{ clients: new Client() })
})


//Create Client Route
router.post('/', async(req,res)=>{
    req.body.drySkin = Boolean(req.body.drySkin)  //dziala jesli value jest ustawione na false
    req.body.wrinkless = Boolean(req.body.wrinkless)
    req.body.lackfirmnes = Boolean(req.body.lackfirmnes)
    req.body.nonuniformColor = Boolean(req.body.nonuniformColor)
    req.body.tiredness = Boolean(req.body.tiredness)
    req.body.acne = Boolean(req.body.acne)
    req.body.smokerSkin = Boolean(req.body.smokerSkin)
    req.body.fatSkin = Boolean(req.body.fatSkin)
    req.body.discoloration = Boolean(req.body.discoloration)
    req.body.blackheads = Boolean(req.body.blackheads)
    req.body.darkCirclesEyes = Boolean(req.body.darkCirclesEyes)
    req.body.dilatedCapillaries = Boolean(req.body.dilatedCapillaries)
    req.body.papularPustularAcne = Boolean(req.body.papularPustularAcne)
    req.body.externallyDrySkin = Boolean(req.body.externallyDrySkin)
   

    const clients = new Client({
        visitDate:req.body.visitDate,
        nextVisitDate:req.body.nextVisitDate,
        name:req.body.name,
        lastName:req.body.lastName,
        phoneNumber:req.body.phoneNumber,
        dateOfBirth:req.body.dateOfBirth,

        //Diagnoza skory
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

    try{
        const newClient = await clients.save();
        //res.redirect(`clients/${newClient.id}`)
        res.redirect( `clients`)
    }catch{
        res.render('clients/new',{
            clients:clients,
            errorMessage:'Error creating Client'
        });
    }
    
   
   
})


module.exports = router;