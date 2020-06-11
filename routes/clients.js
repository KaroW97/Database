const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const Treatment = require('../models/treatment')
const ClientVisits = require('../models/clientsVisits')
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/user')
const {ensureAuthenticated} = require('../config/auth')

//All Clients Route
router.get('/', ensureAuthenticated,async(req,res)=>{
    let searchOptions ={};
    let searchClientLastName ={};
    if(req.query.name!= null && req.query.name !==''){
        searchOptions.name = new RegExp(req.query.name, 'i')
        searchClientLastName.lastName =  new RegExp(req.query.name, 'i')
    }
    try{
        const treatments = await Treatment.find({});
        const clients =  Client.find(searchOptions); //we have no conditions 
        const clientLastName =  Client.find(searchClientLastName); 
        let clientFind =await clients.find({user:req.user.id}).exec();
        if(clientFind =='')
            clientFind = await clientLastName.find({user:req.user.id}).exec(); 
        res.render('clients/index',{
            clients:clientFind,
            treatments:treatments, //to raczej zbedne
            searchOptions:req.query
        });
    }catch(err){
        console.log(err)
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
router.post('/', ensureAuthenticated,async(req,res)=>{

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
        user:req.user.id
    })

    try{
       
        const newClient = await clients.save();
        res.redirect(`clients/clientView/${newClient.id}`)
       
    }catch(err){
        console.log(err)
        res.render('clients/new',{
          
            type:'danger',
            clients:clients,
            errorMessage:'Bład w trakcie tworzenia klienta', 
        });
    }
})

//Show Client
router.get('/clientView/:id',ensureAuthenticated,async(req,res)=>{

    try{
        const visit = new ClientVisits()
        const addedVisit = await ClientVisits.find({client:req.params.id}).populate( 'treatment').populate('client').exec()
     
        const treatments = await Treatment.find({user:req.user.id});
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
router.post('/clientView/:id',ensureAuthenticated, async(req,res)=>{
    const visit = new ClientVisits({
        client:req.params.id,
        comment: req.body.comment,
        clientVisitDate:new Date( req.body.clientVisitDate) ,
        treatment: req.body.treatment,
        user:req.user.id
    })
    try{   
        
        await visit.save();
        req.flash('mess','Dodano wizyte');
        req.flash('type','success')
        res.redirect( `/clients/clientView/${req.params.id}`)
    }catch(err){
        console.log(err)
        const treatments = await Treatment.find({user:req.user.id});

        const addedVisit = await ClientVisits.find({client:req.params.id}).populate( 'treatment').populate('client')
        const clientt  = await Client.findById(req.params.id);
        req.flash('mess','Nie udało się dodać wizyty');
        req.flash('type','danger')
        res.render(`clients/clientView`,{
            addedVisist:addedVisit,
            newVisit:visit,
            treatments:treatments,
            curentClient:req.params.id,
            clientInfo:clientt,
        })
    }
})
//delete Visits/Post
/*router.delete('/clientView/:id',ensureAuthenticated, async(req,res)=>{
    let visit, clientValue;
    try{
        visit = await ClientVisits.findById(req.params.id);
        clientValue= visit.client
        await visit.remove();
        req.flash('mess','Wizyta została usunięta');
        req.flash('type','info')
        res.redirect( `/clients/clientView/${clientValue}`)
    }catch(err){
        res.redirect(`/clients/clientView/${req.params.id}`)
    }
})*/
//delete Visits/Post
router.delete('/clientView/:id',ensureAuthenticated, async(req,res)=>{
    let visit, clientValue,client;
   
    try{
        client = await Client.findById(req.params.id)
        if(req.body.chackboxDelet!= null ){
            
            if(Array.isArray(req.body.chackboxDelet)){
              for(var i = 0; i < (req.body.chackboxDelet).length; i++){
                visit = await ClientVisits.findById(ObjectId(req.body.chackboxDelet[i]));
                clientValue= visit.client
                await visit.remove();
              } 
              req.flash('mess','Wizyty zostały usunięte');
              req.flash('type','info')
            }else{
                visit = await ClientVisits.findById(ObjectId(req.body.chackboxDelet));
                clientValue= visit.client
                await visit.remove();
                req.flash('mess','Wizyta została usunięta');
                req.flash('type','info')
            }
          }
          res.redirect(`/clients/clientView/${client._id}`)
    }catch(err){
        console.log(err);
        client = await Client.findById(req.params.id)
        res.redirect(`/clients/clientView/${client._id}`) 
    }
})
//edit Visit/Post
router.get('/clientView/:id/editPost',ensureAuthenticated, async(req,res)=>{
    
    try{
        const addedVisit = await ClientVisits.findById(req.params.id).populate( 'treatment').populate('client').exec()
        const treatments = await Treatment.find({user:req.user.id});//_id:addedVisit.treatment.id
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
router.put('/clientView/:id/editPost',ensureAuthenticated, async(req,res)=>{
    let visit
    let clientStat
    try{
         visit = await ClientVisits.findById(req.params.id).populate( 'treatment').populate('client').exec()
         visit.client=visit.client
         visit.comment= req.body.comment
         visit.clientVisitDate= new Date( req.body.clientVisitDate) 
         visit.treatment= req.body.treatment
         
         await visit.save();
         req.flash('mess','Wizyta została edytowana');
         req.flash('type','success')
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
router.put('/clientView/:id',ensureAuthenticated,async (req,res)=>{
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
        req.flash('mess','Dane klienta zostały edytowane.');
        req.flash('type','success')
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
/*router.delete('/:id',ensureAuthenticated,async (req,res)=>{
    let clients;
    let clientStats;
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
})*/
////
router.delete('/', async(req,res)=>{
    try{
        console.log(req.body.chackboxDelet)
        if(req.body.chackboxDelet!= null ){
            if(Array.isArray(req.body.chackboxDelet)){
              for(var i = 0; i < (req.body.chackboxDelet).length; i++){
                client =  await Client.findById(ObjectId(req.body.chackboxDelet[i]));
                await client.remove(); 
              } 
             
            }else{
                client =  await Client.findById(ObjectId(req.body.chackboxDelet));
                await client.remove();  
            }
          }
          res.redirect('/clients') 
    }catch(err){
        console.log(err);
        res.redirect('/calendar')       
    }
  
})
module.exports = router;