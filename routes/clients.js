const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const Treatment = require('../models/treatment')
const ClientVisits = require('../models/clientsVisits')
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/user')
const ShoppingList = require('../models/shoppingList')
const {ensureAuthenticated} = require('../config/auth')
///

//All Clients Route
router.get('/', ensureAuthenticated,async(req,res)=>{
    let searchOptions ={},searchClientLastName ={}, todayDate = new Date(),weekDate=new Date();
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']
    const cssSheets=[]
    cssSheets.push('../../public/css/user/clients/index.css',"https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css");
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
            treatments:treatments, //to raczej zbedne
            searchOptions:req.query,
            styles:cssSheets,
            weekdays:weekdays
        });
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
   
})

//New Client Route Displaing form
router.get('/new',ensureAuthenticated,async (req,res)=>{
    const cssSheets=[];
   try{
    res.render('clients/new',{ clients: new Client(), styles:cssSheets})
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
                value:req.body.drySkin ||false
            },
            wrinkless:{
                name:"Zmarszczki i drobne linie",
                value:req.body.wrinkless||false
            },
            lackfirmnes:{
                name:"Brak jędrności",
                value:req.body.lackfirmnes||false
            },
            nonuniformColor:{
                name:"Niejednolity koloryt",
                value:req.body.nonuniformColor||false
            },
            tiredness:{
                name:" Zmęczenie - stres",
                value:req.body.tiredness||false
            },
            acne:{
                name:"Trądzik grudkowy",
                value:req.body.acne||false
            },
            smokerSkin:{
                name:"Skóra palacza",
                value:req.body.smokerSkin||false
            },
            fatSkin:{
                name:"Przetłuszczanie się",
                value:req.body.fatSkin||false
            },
            discoloration:{
                name:"Przebarwienia",
                value:req.body.discoloration||false
            },
            blackheads:{
                name:"Zaskórniki",
                value: req.body.blackheads||false,
            },
            darkCirclesEyes:{
                name:"Cienie - opuchnięcia pod oczami",
                value:req.body.darkCirclesEyes||false
            },
            dilatedCapillaries:{
                name:"Rozszerzone naczynka",
                value:req.body.dilatedCapillaries||false
            },
            papularPustularAcne:{
                name:"Trądzik grudkowo - kostkowy",
                value:req.body.papularPustularAcne||false
            },
            externallyDrySkin:{
                name:"Zewnętrznie przesuszona ",
                value:req.body.externallyDrySkin||false
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
       
        const newClient = await clients.save();
        req.flash('mess','Dodano klienta do bazy.');
        req.flash('type','success')
        res.redirect(`clients/client-view/${newClient.id}`)
        
       
    }catch(err){
        const cssSheets=[]
        req.flash('mess','Nie udało się dodać klienta do bazy.');
        req.flash('type','danger')
        res.render('clients/new',{
          
            clients:clients,
            styles:cssSheets
        });
    }
})

//Show Client
router.get('/client-view/:id',ensureAuthenticated,async(req,res)=>{
  
    const cssSheets=[]
    cssSheets.push('../../public/css/user/clients/clientView.css',"https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css");
    try{
         
        const treatments = await Treatment.find({user:req.user.id});
        const clientt  = await Client.findById(req.params.id)
     
        res.render('clients/clientView',{
           
            treatments:treatments,
            
            curentClient:req.params.id,
            clientInfo:clientt,
            styles:cssSheets
        })
    }catch(err){
        console.log(err)
        res.redirect('/clients')
    }
})
//Show Client Visit
router.get("/client-visits/:id",ensureAuthenticated,async (req,res)=>{
    const cssSheets=[]
    cssSheets.push('../../public/css/user/clients/clientView.css',"https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css");
    try{
        const visit = new ClientVisits()  
        const addedVisit = await ClientVisits.find({client:req.params.id}).populate('client').populate('product').exec()
        const clientt  = await Client.findById(req.params.id)
        const treatments = await Treatment.find({user:req.user.id});
        res.render('clients/clientViewVisits',{
            treatments:treatments,
            addedVisist:addedVisit,
            clientInfo:clientt,
            newVisit:visit,
            styles:cssSheets
        })
    }catch(err){
        console.log(err)
        res.redirect(`/clients/client-view/${req.params.id}`)

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
   
   // totalSumSpent
    try{   

        //console.log(treatment.treatmentPrice)
        await visit.save();
        req.flash('mess','Dodano wizyte');
        req.flash('type','success')
        res.redirect( `/clients/client-view/${req.params.id}`)
    }catch(err){
        const cssSheets=[];
        console.log(err)
        const treatments = await Treatment.find({user:req.user.id});
        const addedVisit = await ClientVisits.find({client:req.params.id}).populate( 'treatment').populate('client').populate('product')
        const clientt  = await Client.findById(req.params.id);
        req.flash('mess','Nie udało się dodać wizyty');
        req.flash('type','danger')
        res.render(`clients/clientView`,{
            addedVisist:addedVisit,
            newVisit:visit,
            treatments:treatments,
            curentClient:req.params.id,
            clientInfo:clientt,
            styles:cssSheets
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
              req.flash('type','success')
            }else{
                visit = await ClientVisits.findById(ObjectId(req.body.chackboxDelet));
                clientValue= visit.client
                await visit.remove();
                req.flash('mess','Wizyta została usunięta');
                req.flash('type','success')
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
router.get('/client-view/:id/editPost',ensureAuthenticated, async(req,res)=>{
    const cssSheets =[]
    try{
        const addedVisit = await ClientVisits.findById(req.params.id).populate( 'treatment').populate('client').populate( 'product').exec()

        const treatments = await Treatment.find({user:req.user.id});//_id:addedVisit.treatment.id
        res.render('clients/editPost',{
            treatments:treatments,
            curentVisit:req.params.id,
            newVisit:addedVisit,
            styles:cssSheets
        })
      
    }catch(err){
        const addedVisit = await ClientVisits.findById(req.params.id)
        res.redirect(`/clients/${addedVisit.id}`)
    }
  
})
//edit Visit/Post
router.put('/client-view/:id/editPost',ensureAuthenticated, async(req,res)=>{
    let visit
    let clientStat
    try{
         visit = await ClientVisits.findById(req.params.id).populate('client').exec()
         visit.client=visit.client
         visit.comment= req.body.comment
         visit.clientVisitDate= new Date( req.body.clientVisitDate) 
         visit.treatment= req.body.treatment
         visit.shopping = req.body.shopping
         await visit.save(req.body.treatment);
         console.log()
         req.flash('mess','Wizyta została edytowana');
         req.flash('type','success')
         return res.redirect(`/clients/client-view/${visit.client.id}`)
    }catch(err){
        console.log(err + "jestem")
        const cssSheets =[]
    
        const addedVisit = await ClientVisits.findById(req.params.id)
        const treatments = await Treatment.find({});
        res.render('clients/editPost',{
            treatments:treatments,
            curentVisit:req.params.id,
            clientId:addedVisit.client,
            newVisit:addedVisit,
            styles:cssSheets
        })
    }
   
})

//edit
router.get('/client-view/:id/edit',ensureAuthenticated, async(req,res)=>{
    const cssSheets =[]

    try{
        const clietnEdit = await Client.findById(req.params.id)
        res.render('clients/edit',{
            clients:clietnEdit,
            styles:cssSheets
        })
    }catch{
        res.redirect(`/clients/${clietnEdit.id}`)
    }
   
})
//Update Client 
router.put('/client-view/:id',ensureAuthenticated,async (req,res)=>{
    let clients;
    try{
        clients =  await Client.findById(req.params.id)
        //update

        clients.skinDiagnoseAll.drySkin ={
                name:"Sucha",
                value:req.body.drySkin||false
        }
        clients.skinDiagnoseAll.wrinkless ={
            name:"Zmarszczki i drobne linie",
                value:req.body.wrinkless||false
        }
        clients.skinDiagnoseAll.lackfirmnes ={
            name:"Brak jędrności",
            value:req.body.lackfirmnes||false
        }
        clients.skinDiagnoseAll.nonuniformColor ={
            name:"Niejednolity koloryt",
            value:req.body.nonuniformColor||false
        }
        clients.skinDiagnoseAll.tiredness ={
            name:" Zmęczenie - stres",
            value:req.body.tiredness||false
        }
        clients.skinDiagnoseAll.acne ={
            name:"Trądzik grudkowy",
            value:req.body.acne||false
        }
        clients.skinDiagnoseAll.smokerSkin ={
            name:"Skóra palacza",
                value:req.body.smokerSkin||false
        }
        clients.skinDiagnoseAll.fatSkin ={
            name:"Przetłuszczanie się",
            value:req.body.fatSkin||false
        }
        clients.skinDiagnoseAll.discoloration ={
            name:"Przebarwienia",
            value:req.body.discoloration||false
        }
        clients.skinDiagnoseAll.blackheads ={
            name:"Zaskórniki",
            value: req.body.blackheads||false,
        }
        clients.skinDiagnoseAll.darkCirclesEyes ={
            name:"Cienie - opuchnięcia pod oczami",
            value:req.body.darkCirclesEyes||false
        }
        clients.skinDiagnoseAll.dilatedCapillaries ={
            name:"Rozszerzone naczynka",
            value:req.body.dilatedCapillaries||false
        }
        clients.skinDiagnoseAll.papularPustularAcne ={
            name:"Trądzik grudkowo - kostkowy",
            value:req.body.papularPustularAcne||false
        }
        clients.skinDiagnoseAll.externallyDrySkin ={
            name:"Zewnętrznie przesuszona ",
            value:req.body.externallyDrySkin||false
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
        res.redirect(`/clients/client-view/${clients.id}`)
    }catch(err){
        if(clients == null){
            res.redirect('/')
        }else{
            const cssSheets =[]

            req.flash('mess','Nie udało się edytować klienta.');
            req.flash('type','danger')
            res.render('clients/edit',{
                clients:clients,
                styles:cssSheets
            });
        }
       
    }
})
//Delete Client
router.delete('/:id', ensureAuthenticated,async(req,res)=>{
    try{
        let client =  await Client.findById(req.params.id);
        await client.remove();
        req.flash('mess','Udało się usunąć klienta')
        req.flash('type','success') 
        res.redirect('/clients') 

    }catch(err){
        console.log(err);
        req.flash('mess','Nie udało się usunąć klienta')
        req.flash('type','danger') 
        res.redirect('/clients')       
    }
  
})
module.exports = router;