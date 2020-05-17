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
                name:"Przebarwienia",
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
       
    }catch(err){
        console.log(err)
        res.render('clients/new',{
            clients:clients,
            errorMessage:'Error creating Client', 
        });
    }
})

//Show Client
router.get('/clientView/:id',async(req,res)=>{
    try{
        const visit = new ClientVisits()
        const addedVisit = await ClientVisits.find({})
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

//Add new Visit
router.post('/clientView/:id', async(req,res)=>{
 
    const visit = new ClientVisits({
        client:req.params.id,
        clientVisitDate:new Date( req.body.clientVisitDate) ,
        comment: req.body.comment,// ||'default' ,
        treatment: req.body.treatment,
    })
    try{
        await visit.save();
        res.redirect( `/clients/clientView/${req.params.id}`)
    }catch{
        const treatments = await Treatment.find({});
        const addedVisit = await ClientVisits.find({})
        const clientt  = await Client.findById(req.params.id);
        res.render(`clients/clientView`,{
            errorMessage:'Error creating Visit',
            addedVisist:addedVisit,
            newVisit:visit,
            treatments:treatments,
            curentClient:req.params.id,
            clientInfo:clientt
        })
    }
})
//deleteVisits
router.delete('/clientView/:id', async(req,res)=>{
    res.send('delete visit' + req.params.id)
})


//edit
router.get('/clientView/:id/edit', async(req,res)=>{
    try{
        const clietnEdit = await Client.findById(req.params.id)
        res.render('clients/edit',{
            clients:clietnEdit
        })
    }catch{
        res.redirect(`/clients/${clietnEdit.id}`)
    }
   
})
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
            name:"Przebarwienia",
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
        clients.skinDiagnoseAll.dilatedCapillaries ={
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
        clients.dateOfBirth=new Date(req.body.dateOfBirth),


        await clients.save();
        console.log(clients)
        res.redirect(`/clients/clientView/${clients.id}`)
        //res.redirect( `clients`)
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
    let clientVisits;
    try{
       
        //clientVisits = await ClientVisits.find()//{client:req.params.id}
        clients =  await Client.findById(req.params.id);
       /* for(var i = 0;i<clientVisits.length ; i++){
            await clientVisits[i].remove();
        }*/
        //console.log(clientVisits )  
        //if(clientVisits.length == 0)
            await clients.remove(); 
       
       // console.log(clientVisits )
        //console.log(clientVisits.client)
         //clientVisits;
        //
        res.redirect(`/clients`)
    }catch(err){
        if(clients == null){
            res.redirect('/')
        }else{
            res.redirect(`/clients/clientView/${clients.id}`)
        }   
    }
})
module.exports = router;