const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const Treatment = require('../models/treatment')
const ClientVisits = require('../models/clientsVisits')
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/user')
const ShoppingList = require('../models/shoppingList')
const {ensureAuthenticated} = require('../config/auth')

//All Clients Route
router.get('/', ensureAuthenticated,async(req,res)=>{
    let searchOptions ={},searchClientLastName ={}, todayDate = new Date(),weekDate=new Date();
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']
    //const cssSheets=[]
    //cssSheets.push('../../public/css/index.css');
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
            todayDate.setDate(todayDate.getDate() - 1)
            weekDate.setDate(todayDate.getDate() + 8)
            const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})
        res.render('clients/index',{
            shoppingAll:shoppingList,
            clients:clientFind,
            oneClient:new Client(),
            treatments:treatments, //to raczej zbedne
            searchOptions:req.query,
            
            weekdays:weekdays
        });
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
   
})
//Create Client Route
router.post('/new', ensureAuthenticated,async(req,res)=>{
    const clients = new Client({
     
        skinDiagnoseAll:{
            drySkin:{
                name:"Sucha",
                value:Boolean(req.body.drySkin) ||false
            },
            wrinkless:{
                name:"Zmarszczki i drobne linie",
                value:Boolean(req.body.wrinkless)||false
            },
            lackfirmnes:{
                name:"Brak jędrności",
                value:Boolean(req.body.lackfirmnes)||false
            },
            nonuniformColor:{
                name:"Niejednolity koloryt",
                value:Boolean(req.body.nonuniformColor)||false
            },
            tiredness:{
                name:" Zmęczenie - stres",
                value:Boolean(req.body.tiredness)||false
            },
            acne:{
                name:"Trądzik grudkowy",
                value:Boolean(req.body.acne)||false
            },
            smokerSkin:{
                name:"Skóra palacza",
                value:Boolean(req.body.smokerSkin)||false
            },
            fatSkin:{
                name:"Przetłuszczanie się",
                value:Boolean(req.body.fatSkin)||false
            },
            discoloration:{
                name:"Przebarwienia",
                value:Boolean(req.body.discoloration)||false
            },
            blackheads:{
                name:"Zaskórniki",
                value: Boolean(req.body.blackheads)||false,
            },
            darkCirclesEyes:{
                name:"Cienie - opuchnięcia pod oczami",
                value:Boolean(req.body.darkCirclesEyes)||false
            },
            dilatedCapillaries:{
                name:"Rozszerzone naczynka",
                value:Boolean(req.body.dilatedCapillaries)||false
            },
            papularPustularAcne:{
                name:"Trądzik grudkowo - kostkowy",
                value:Boolean(req.body.papularPustularAcne)||false
            },
            externallyDrySkin:{
                name:"Zewnętrznie przesuszona ",
                value:Boolean(req.body.externallyDrySkin)||false
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
        user:req.user.id,
     
    })

    try{
        await clients.save();
        req.flash('mess','Dodano klienta do bazy.');
        req.flash('type','info-success')
        res.redirect(`/clients`)
  
       
    }catch(err){
        console.log(err)
        const cssSheets=[]
        req.flash('mess','Nie udało się dodać klienta do bazy.');
        req.flash('type','info-alert')
        res.redirect(`/calendar`)
      
    }
})
//Show Client
router.get('/client-view/:id',ensureAuthenticated,async(req,res)=>{
    try{
        const treatments = await Treatment.find({user:req.user.id});
        const clientt  = await Client.findById(req.params.id)
        const visit = new ClientVisits()  
        const addedVisit = await ClientVisits.find({client:req.params.id}).populate('product').exec()
        
        res.render('clients/clientView',{
            addedVisit:addedVisit,
            treatments:treatments,
            newVisit:visit,
            curentClient:req.params.id,
            oneClient:clientt,
        })
    }catch(err){
        //console.log(err)
        res.redirect('/clients')
    }
})
//Add new Visit/Post
router.post('/client-view/:id',ensureAuthenticated, async(req,res)=>{
    const visit = new ClientVisits({
        client:req.params.id,
        comment: req.body.comment,
        clientVisitDate:new Date( req.body.clientVisitDate) ,
        treatment: req.body.treatmentName,
        user:req.user.id,
        shopping:req.body.shopping
    })
   
    try{   
        await visit.save();
        req.flash('mess','Dodano wizyte');
        req.flash('type','info-success')
        res.redirect( `/clients/client-view/${req.params.id}`)
    }catch(err){
        const treatments = await Treatment.find({user:req.user.id});
        const addedVisit = await ClientVisits.find({client:req.params.id}).populate( 'treatment').populate('client').populate('product')
        const clientt  = await Client.findById(req.params.id);
        req.flash('mess','Nie udało się dodać wizyty');
        req.flash('type','info-alert')
        res.render(`clients/clientView`,{
            addedVisist:addedVisit,
            newVisit:visit,
            treatments:treatments,
            curentClient:req.params.id,
            clientInfo:clientt
        })
    }
})

//delete Visits/Post
router.delete('/client-view/:id',ensureAuthenticated, async(req,res)=>{
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
              req.flash('type','info-success')
            }else{
                visit = await ClientVisits.findById(ObjectId(req.body.chackboxDelet));
                clientValue= visit.client
                await visit.remove();
                req.flash('mess','Wizyta została usunięta');
                req.flash('type','info-success')
            }
          }else{
            req.flash('mess','Nie wybrano wizyty do usunięcia');
            req.flash('type','info')
          }
          res.redirect(`/clients/client-view/${client._id}`)
    }catch(err){
        console.log(err);
        client = await Client.findById(req.params.id)
        res.redirect(`/clients/client-view/${client._id}`) 
    }
})
//edit Visit/Post
router.get('/edit-visit/:id',ensureAuthenticated, async(req,res)=>{
    let addedVisit
    try{
        addedVisit = await ClientVisits.findById(req.params.id)
        res.send(addedVisit)
    }catch(err){
        res.redirect(`/clients`)
    }
  
})
//edit Visit/Post
router.put('/client-view/:id/editPost',ensureAuthenticated, async(req,res)=>{
    let visit
    try{
         visit = await ClientVisits.findById(req.params.id).populate('client').exec()
         visit.client=visit.client
         visit.comment= req.body.comment
         visit.clientVisitDate= new Date( req.body.clientVisitDate) 
         visit.treatment= req.body.treatmentName
         visit.shopping = req.body.shopping
         await visit.save(req.body.treatment);
         
         req.flash('mess','Wizyta została edytowana');
         req.flash('type','info-success')
         return res.redirect(`/clients/client-view/${visit.client.id}`)
    }catch(err){
       
    
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


//Update Client 
router.put('/client-view/:id',ensureAuthenticated,async (req,res)=>{
    let clients;
   
    try{
        clients =  await Client.findById(req.params.id)
      
        clients.skinDiagnoseAll.drySkin ={
                name:"Sucha",
                value:Boolean(req.body.drySkin)||false
        }
        clients.skinDiagnoseAll.wrinkless ={
            name:"Zmarszczki i drobne linie",
                value:Boolean(req.body.wrinkless)||false
        }
        clients.skinDiagnoseAll.lackfirmnes ={
            name:"Brak jędrności",
            value:Boolean(req.body.lackfirmnes)||false
        }
        clients.skinDiagnoseAll.nonuniformColor ={
            name:"Niejednolity koloryt",
            value:Boolean(req.body.nonuniformColor)||false
        }
        clients.skinDiagnoseAll.tiredness ={
            name:" Zmęczenie - stres",
            value:Boolean(req.body.tiredness)||false
        }
        clients.skinDiagnoseAll.acne ={
            name:"Trądzik grudkowy",
            value:Boolean(req.body.acne)||false
        }
        clients.skinDiagnoseAll.smokerSkin ={
            name:"Skóra palacza",
                value:Boolean(req.body.smokerSkin)||false
        }
        clients.skinDiagnoseAll.fatSkin ={
            name:"Przetłuszczanie się",
            value:Boolean(req.body.fatSkin)||false
        }
        clients.skinDiagnoseAll.discoloration ={
            name:"Przebarwienia",
            value:Boolean(req.body.discoloration)||false
        }
        clients.skinDiagnoseAll.blackheads ={
            name:"Zaskórniki",
            value: Boolean(req.body.blackheads)||false,
        }
        clients.skinDiagnoseAll.darkCirclesEyes ={
            name:"Cienie - opuchnięcia pod oczami",
            value:Boolean(req.body.darkCirclesEyes)||false
        }
        clients.skinDiagnoseAll.dilatedCapillaries ={
            name:"Rozszerzone naczynka",
            value:Boolean(req.body.dilatedCapillaries)||false
        }
        clients.skinDiagnoseAll.papularPustularAcne ={
            name:"Trądzik grudkowo - kostkowy",
            value:Boolean(req.body.papularPustularAcne)||false
        }
        clients.skinDiagnoseAll.externallyDrySkin ={
            name:"Zewnętrznie przesuszona ",
            value:Boolean(req.body.externallyDrySkin)||false
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
        req.flash('type','info-success')
        res.redirect(`/clients/client-view/${clients._id}`)
    }catch(err){
        if(clients == null){
            res.redirect('/')
        }else{
            req.flash('mess','Nie udało się edytować klienta.');
            req.flash('type','info-alert')
            console.log(err)
            res.redirect(`/clients/client-view/${clients.id}`);
        }
       
    }
})
//Delete Client
router.delete('/:id', ensureAuthenticated,async(req,res)=>{
    try{
        let client =  await Client.findById(req.params.id);
        await client.deleteOne();
        req.flash('mess','Udało się usunąć klienta')
        req.flash('type','info-success') 
        res.redirect('/clients') 

    }catch(err){
        console.log(err);
        req.flash('mess','Nie udało się usunąć klienta')
        req.flash('type','info-alert') 
        res.redirect('/clients')       
    }
  
})
module.exports = router;