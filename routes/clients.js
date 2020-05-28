const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const Treatment = require('../models/treatment')
const ClientVisits = require('../models/clientsVisits')
const {ensureAuthenticated} = require('../config/auth')

//All Clients Route
router.get('/', ensureAuthenticated,async(req,res)=>{
    let searchOptions ={};
    if(req.query.name!= null && req.query.name !==''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const treatments = await Treatment.find({});
        const clients = await Client.find(searchOptions); //we have no conditions 
        res.render('clients/index',{
            clients:clients,
            treatments:treatments,
            searchOptions:req.query
        });
    }catch{
        res.redirect('/calendar')
    }
   
})

//New Client Route Displaing form
router.get('/new',ensureAuthenticated,async (req,res)=>{
   try{
    res.render('clients/new',{ clients: new Client(),})
   }catch{
       res.redirect('/clients')
   }
   
})

//Create Client Route
router.post('/', async(req,res)=>{

    const clients = new Client({
     
        skinDiagnoseAll:{
            drySkin:{
                name:"Sucha",
                value:req.body.drySkin
            },
            wrinkless:{
                name:"Zmarszczki i drobne linie",
                value:req.body.wrinkless
            },
            lackfirmnes:{
                name:"Brak jędrności",
                value:req.body.lackfirmnes
            },
            nonuniformColor:{
                name:"Niejednolity koloryt",
                value:req.body.nonuniformColor
            },
            tiredness:{
                name:" Zmęczenie - stres",
                value:req.body.tiredness
            },
            acne:{
                name:"Trądzik grudkowy",
                value:req.body.acne
            },
            smokerSkin:{
                name:"Skóra palacza",
                value:req.body.smokerSkin
            },
            fatSkin:{
                name:"Przetłuszczanie się",
                value:req.body.fatSkin
            },
            discoloration:{
                name:"Przebarwienia",
                value:req.body.discoloration
            },
            blackheads:{
                name:"Zaskórniki",
                value: req.body.blackheads,
            },
            darkCirclesEyes:{
                name:"Cienie - opuchnięcia pod oczami",
                value:req.body.darkCirclesEyes
            },
            dilatedCapillaries:{
                name:"Rozszerzone naczynka",
                value:req.body.dilatedCapillaries
            },
            papularPustularAcne:{
                name:"Trądzik grudkowo - kostkowy",
                value:req.body.papularPustularAcne
            },
            externallyDrySkin:{
                name:"Zewnętrznie przesuszona ",
                value:req.body.externallyDrySkin
            },
            other:req.body.other,
        },
        visitDate:Date.parse(req.body.visitDate) || '',
        nextVisitDate:Date.parse(req.body.nextVisitDate)||'',
        name:req.body.name,
        lastName:req.body.lastName,
        phoneNumber:req.body.phoneNumber,
        dateOfBirth:Date.parse(req.body.dateOfBirth)||'',
        //Diagnoza skory
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
        res.redirect(`clients/clientView/${newClient.id}`)
       
    }catch{
        res.render('clients/new',{
            clients:clients,
            errorMessage:'Error creating Client', 
        });
    }
})

//Show Client
router.get('/clientView/:id',ensureAuthenticated,async(req,res)=>{
    try{
        const visit = new ClientVisits()
        const addedVisit = await ClientVisits.find({client:req.params.id}).populate( 'treatment').populate('client').exec()
        console.log(addedVisit)
        const treatments = await Treatment.find({});
        const clientt  = await Client.findById(req.params.id)
        res.render('clients/clientView',{
            addedVisist:addedVisit,
            treatments:treatments,
            newVisit:visit,
            curentClient:req.params.id,
            clientInfo:clientt  
        })
    }catch{
        res.redirect('/clients')
    }
})

//Add new Visit/Post
router.post('/clientView/:id', async(req,res)=>{
 
    const visit = new ClientVisits({
        client:req.params.id,
        comment: req.body.comment,
        clientVisitDate:new Date( req.body.clientVisitDate) ,
        treatment: req.body.treatment,
    })
    try{
        await visit.save();
        res.redirect( `/clients/clientView/${req.params.id}`)
    }catch{
        const treatments = await Treatment.find({});
        const addedVisit = await ClientVisits.find({client:req.params.id}).populate( 'treatment').populate('client').exec()
        const clientt  = await Client.findById(req.params.id);
        res.render(`clients/clientView`,{
            errorMessage:'Error creating Visit',
            addedVisist:addedVisit,
            newVisit:visit,
           
            curentClient:req.params.id,
            clientInfo:clientt
        })
    }
})
//delete Visits/Post
router.delete('/clientView/:id', async(req,res)=>{
    let visit, clientValue;
    try{
        visit = await ClientVisits.findById(req.params.id);
        clientValue= visit.client
        await visit.remove();
        res.redirect( `/clients/clientView/${clientValue}`)
    }catch(err){
        res.redirect(`/clients/clientView/${req.params.id}`)
    }
})
//edit Visit/Post
router.get('/clientView/:id/editPost',ensureAuthenticated, async(req,res)=>{
    
    try{
       
       
        const addedVisit = await ClientVisits.findById(req.params.id).populate( 'treatment').populate('client').exec()
        const treatments = await Treatment.find({});//_id:addedVisit.treatment.id
        console.log(addedVisit)
        res.render('clients/editPost',{
            treatments:treatments,
            curentVisit:req.params.id,
            newVisit:addedVisit,
        })
      
    }catch(err){
        const addedVisit = await ClientVisits.findById(req.params.id)
        res.redirect(`/clients/${addedVisit.id}`)
    }
  
})
//edit Visit/Post
router.put('/clientView/:id/editPost', async(req,res)=>{
    let visit
    try{
         visit = await ClientVisits.findById(req.params.id).populate( 'treatment').populate('client').exec()
         visit.client=visit.client
         visit.comment= req.body.comment
         visit.clientVisitDate= new Date( req.body.clientVisitDate) 
         visit.treatment= req.body.treatment

         await visit.save();
         res.redirect(`/clients/clientView/${visit.client.id}`)
    }catch(err){
        console.log(err)
        const addedVisit = await ClientVisits.findById(req.params.id)
        const treatments = await Treatment.find({});
        res.render('clients/editPost',{
            treatments:treatments,
            curentVisit:req.params.id,
            clientId:addedVisit.client,
            newVisit:addedVisit,
        })
    }
   
})

//edit
router.get('/clientView/:id/edit',ensureAuthenticated, async(req,res)=>{
    try{
        const clietnEdit = await Client.findById(req.params.id)
        res.render('clients/edit',{
            clients:clietnEdit
        })
    }catch{
        res.redirect(`/clients/${clietnEdit.id}`)
    }
   
})
//Update Client 
router.put('/clientView/:id',async (req,res)=>{
    let clients;
    try{
        clients =  await Client.findById(req.params.id)
        //update

        clients.skinDiagnoseAll.drySkin ={
                name:"Sucha",
                value:req.body.drySkin
        }
        clients.skinDiagnoseAll.wrinkless ={
            name:"Zmarszczki i drobne linie",
                value:req.body.wrinkless
        }
        clients.skinDiagnoseAll.lackfirmnes ={
            name:"Brak jędrności",
            value:req.body.lackfirmnes
        }
        clients.skinDiagnoseAll.nonuniformColor ={
            name:"Niejednolity koloryt",
            value:req.body.nonuniformColor
        }
        clients.skinDiagnoseAll.tiredness ={
            name:" Zmęczenie - stres",
            value:req.body.tiredness
        }
        clients.skinDiagnoseAll.acne ={
            name:"Trądzik grudkowy",
            value:req.body.acne
        }
        clients.skinDiagnoseAll.smokerSkin ={
            name:"Skóra palacza",
                value:req.body.smokerSkin
        }
        clients.skinDiagnoseAll.fatSkin ={
            name:"Przetłuszczanie się",
            value:req.body.fatSkin
        }
        clients.skinDiagnoseAll.discoloration ={
            name:"Przebarwienia",
            value:req.body.discoloration
        }
        clients.skinDiagnoseAll.blackheads ={
            name:"Zaskórniki",
            value: req.body.blackheads,
        }
        clients.skinDiagnoseAll.darkCirclesEyes ={
            name:"Cienie - opuchnięcia pod oczami",
            value:req.body.darkCirclesEyes
        }
        clients.skinDiagnoseAll.dilatedCapillaries ={
            name:"Rozszerzone naczynka",
            value:req.body.dilatedCapillaries
        }
        clients.skinDiagnoseAll.papularPustularAcne ={
            name:"Trądzik grudkowo - kostkowy",
            value:req.body.papularPustularAcne
        }
        clients.skinDiagnoseAll.externallyDrySkin ={
            name:"Zewnętrznie przesuszona ",
            value:req.body.externallyDrySkin
        }
        clients.skinDiagnoseAll.other =req.body.other
        clients.name=req.body.name,
        clients.lastName=req.body.lastName,
        clients.phoneNumber=req.body.phoneNumber,
        clients.dateOfBirth= Date.parse(req.body.dateOfBirth)||'',

        clients.washingFace =req.body.washingFace
        clients.faceTension =req.body.faceTension
        clients.currentFaceCreams =req.body.currentFaceCreams
        clients.shopping =req.body.shopping
        clients.diagnose1 =req.body.diagnose1
        clients.teraphyPlan =req.body.teraphyPlan
        clients.recommendedCare =req.body.recommendedCare


        await clients.save();
        res.redirect(`/clients/clientView/${clients.id}`)
    }catch(err){
        if(clients == null){
            res.redirect('/')
        }else{
            res.render('clients/edit',{
                clients:clients,
                errorMessage:'Error updating Client', 
            });
        }
       
    }
})
//Delete Client
router.delete('/:id',async (req,res)=>{
    let clients;
    try{
        clients =  await Client.findById(req.params.id);
        await clients.remove(); 
        res.redirect(`/clients`)
    }catch{
        if(clients == null){
            res.redirect('/')
        }else{
            res.redirect(`/clients/clientView/${clients.id}`)
        }   
    }
})
module.exports = router;