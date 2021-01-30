const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const Treatment = require('../models/treatment')
const ClientVisits = require('../models/clientsVisits')
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/user')
const ShoppingList = require('../models/shoppingList')
const ClientsShoppingsStats = require('../models/clientsShoppingsStats')
const {ensureAuthenticated} = require('../config/auth')
/*
* All Clients Route
*/
router.get('/', ensureAuthenticated,async(req,res)=>{
    let clientBirthday, todayDate = new Date(),weekDate=new Date();
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']
    todayDate.setDate(todayDate.getDate() - 1)
    weekDate.setDate(todayDate.getDate() + 8)

   
    clientBirthday = Client.find({user:req.user.id})
    
  
    if(req.query.birthday != null &&  req.query.birthday !='')
        clientBirthday = clientBirthday.gte('dateOfBirth', req.query.birthday)  
      
    try{
        const clients =  Client.find(clientBirthday); 
        let clientFind =await clients.find({user:req.user.id}).exec();

        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
        $gt:todayDate,
        $lt:weekDate
        }}).sort({transactionDate:'asc'})
        res.render('clients/index',{
            shoppingAll:shoppingList,
            clients:clientFind,
            searchOptions:req.query,
            weekdays:weekdays,
        });
    }catch(err){
        console.log(err)
        res.redirect('/calendar')
    }
   
})
/*
* Create Client Route
*/
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
        name:req.body.name.trim(),
        lastName:req.body.lastName.trim(),
        phoneNumber:req.body.phoneNumber.trim(),
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
        req.flash('mess','Nie udało się dodać klienta do bazy.');
        req.flash('type','info-alert')
        res.redirect(`/calendar`)
      
    }
})
/*
* Show Client
*/
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
        console.log(err)
        res.redirect('/clients')
    }
})
/*
* Add new Visit and add it to stats
*/
router.post('/client-view/:id',ensureAuthenticated, async(req,res)=>{
    let clientt, findTreatmentStat ;
    let date = req.body.clientVisitDate === '' ? new Date().toISOString().split('T')[0] : new Date(req.body.clientVisitDate).toISOString().split('T')[0]
    const visit = new ClientVisits({
        client:req.params.id,
        comment: req.body.comment,
        clientVisitDate: date ,
        treatment: req.body.treatmentName,
        user:req.user.id,
        shopping:req.body.shopping,
        price:req.body.price
    })

    try{   
        findTreatmentStat = await ClientsShoppingsStats.find({user:req.user.id,treatment:req.body.treatmentName})
        clientt  = await Client.findById(req.params.id)
        clientt.totalSumSpent =  Number(clientt.totalSumSpent) + Number(req.body.price)

        clientt.clientVisits.push({
            visit:visit.id,
            treatment: req.body.treatmentName,
            clientVisitDate: req.body.clientVisitDate === '' ? new Date() : new Date(req.body.clientVisitDate),
            price:req.body.price
        })
        if(findTreatmentStat.length === 0){
             const treatmentStats = new ClientsShoppingsStats({
                user:req.user.id,
                treatment: req.body.treatmentName.trim(),
                totalPrice:req.body.price,
            })
            treatmentStats.transactionDate.push(date)
            await treatmentStats.save()
        }else{
            findTreatmentStat[0].transactionDate.push(date)
            await findTreatmentStat[0].save()
        }

        await clientt.save()
        await visit.save();
        req.flash('mess','Wizyta została dodana.');
        req.flash('type','info-success')
        res.redirect( `/clients/client-view/${req.params.id}`)
    }catch(err){
        console.log(err)
        req.flash('mess','Nie udało się dodać wizyty.');
        req.flash('type','info-alert')
        res.redirect( `/clients/client-view/${req.params.id}`)
    }
})
/*
* Delete Visit
*/
router.delete('/client-view/:id',ensureAuthenticated, async(req,res)=>{
    let visit,clientt, findTreatmentStat;
    try{
        visit = await ClientVisits.findById(req.params.id);
        clientt = await Client.findById(visit.client)
        clientt.totalSumSpent -= Number(visit.price)
        findTreatmentStat = await ClientsShoppingsStats.find({user:req.user.id,  treatment:visit.treatment})
        if(findTreatmentStat.length !== 0){
            let dateStatToDelete = findTreatmentStat[0].transactionDate.findIndex(data => data === visit.clientVisitDate.toISOString().split('T')[0])

            findTreatmentStat[0].transactionDate =[
                ...findTreatmentStat[0].transactionDate.splice(0,dateStatToDelete),
                ...findTreatmentStat[0].transactionDate.splice(dateStatToDelete + 1)
            ]
            findTreatmentStat[0].transactionDate.length === 0 ?  findTreatmentStat[0].deleteOne() : await findTreatmentStat[0].save()
        }
       
        let visitToDelte =  clientt.clientVisits.findIndex(v =>{
            return v.visit === visit.id && 
                visit.clientVisitDate.toISOString().split('T')[0] === v.clientVisitDate.toISOString().split('T')[0]
        })
        clientt.clientVisits.length === 1 ?  
            clientt.clientVisits = [] :
            clientt.clientVisits= [
                ...clientt.clientVisits.slice(0,visitToDelte),
                ...clientt.clientVisits.slice(visitToDelte +1)
            ]
        
        await clientt.save()
        await visit.deleteOne();
    
        req.flash('mess','Wizyta została usunięta.');
        req.flash('type','info-success')
        res.redirect(`/clients/client-view/${clientt._id}`)
    }catch(err){
        console.log(err);
        req.flash('mess','Nie udało się usunąć wizyty.');
        req.flash('type','info-alert')
        visit = await ClientVisits.findById(req.params.id);
        res.redirect(`/clients/client-view/${visit.client._id}`) 
    }
})
/*
* Get edit Visit data
*/
router.get('/edit-visit/:id',ensureAuthenticated, async(req,res)=>{
    let addedVisit
    try{
        addedVisit = await ClientVisits.findById(req.params.id)
        res.send(addedVisit)
    }catch(err){
        res.redirect(`/clients`)
    }
  
})
/*
* Edit Visit
*/
router.put('/client-view/:id/editPost',ensureAuthenticated, async(req,res)=>{
    let visit, findTreatmentStat, findTreatmentStatAfter
    let date = req.body.clientVisitDate === '' ? new Date().toISOString().split('T')[0] : new Date(req.body.clientVisitDate).toISOString().split('T')[0]

    try{
         visit = await ClientVisits.findById(req.params.id).populate('client').exec()
         findTreatmentStat = await ClientsShoppingsStats.find({user:req.user.id, treatment:visit.treatment})
        
         let compare = visit.clientVisitDate.toISOString().split('T')[0]
         visit.client=visit.client
         visit.comment= req.body.comment
         visit.clientVisitDate= date 
         visit.treatment= req.body.treatmentName.trim()
         visit.shopping = req.body.shopping
      
         clientt  = await Client.findById(visit.client.id)
         let updateClientVisits =  clientt.clientVisits.findIndex(v =>v.visit == visit._id)

         clientt.totalSumSpent -= Number(visit.price)
         clientt.totalSumSpent =  Number(clientt.totalSumSpent) + Number(req.body.price)
         visit.price = req.body.price

         clientt.clientVisits.set(updateClientVisits,{
            visit: visit.id,
            treatment : req.body.treatmentName.trim(),
            clientVisitDate : new Date( req.body.clientVisitDate),
            price : req.body.price
         })
         findTreatmentStatAfter = await ClientsShoppingsStats.find({treatment:visit.treatment})
         /*
         * If treatment is the same but data is not
         */
         if(findTreatmentStat.length !==0 && findTreatmentStat[0].treatment ===visit.treatment){
            let updateTreatmentStats = findTreatmentStat[0].transactionDate.findIndex(data =>{
                return data === compare
            })
            findTreatmentStat[0].transactionDate =[
                ...findTreatmentStat[0].transactionDate.splice(0,updateTreatmentStats),
                ...findTreatmentStat[0].transactionDate.splice(updateTreatmentStats + 1)
            ]
            findTreatmentStat[0].transactionDate.push(date)
            findTreatmentStat[0].transactionDate.length === 1 ?  await findTreatmentStat[0].deleteOne() : await  findTreatmentStat[0].save()    
         }
         /*
         * If name of the treatment is diferent and lenght of the treatment after updating does exist
         */
        else if(findTreatmentStatAfter.length !== 0 && findTreatmentStat.length !==0 && findTreatmentStat[0].treatment !== visit.treatment){
           let updateTreatmentStats = findTreatmentStat[0].transactionDate.findIndex(data => data === compare)

           findTreatmentStat[0].transactionDate =[
               ...findTreatmentStat[0].transactionDate.splice(0,updateTreatmentStats),
               ...findTreatmentStat[0].transactionDate.splice(updateTreatmentStats + 1)
           ]
           findTreatmentStatAfter[0].transactionDate.push(date)
           findTreatmentStat[0].transactionDate.length === 0 ?   await findTreatmentStat[0].deleteOne() :  await  findTreatmentStat[0].save()
       
           await findTreatmentStatAfter[0].save()
        }
        /*
        * If after upadting name of the visit, the visit is not in database create new
        */
        else if(findTreatmentStatAfter.length === 0 ){
            const treatmentStats = new ClientsShoppingsStats({
                user:req.user.id,
                treatment: req.body.treatmentName.trim(),
                totalPrice:req.body.price,
            })
            treatmentStats.transactionDate.push(date)
            if(findTreatmentStat[0].transactionDate.length > 1){
                let updateTreatmentStats = findTreatmentStat[0].transactionDate.findIndex(data => data === compare)
                findTreatmentStat[0].transactionDate = [
                    ...findTreatmentStat[0].transactionDate.splice(0,updateTreatmentStats),
                    ...findTreatmentStat[0].transactionDate.splice(updateTreatmentStats + 1)
                ]
                await findTreatmentStat[0].save()
            }
            if(findTreatmentStat[0].transactionDate.length <= 1){
              await  findTreatmentStat[0].deleteOne()
            }
            await treatmentStats.save()
         }

 
        await clientt.save();
        await visit.save();
        
         req.flash('mess','Wizyta została edytowana.');
         req.flash('type','info-success')
         return res.redirect(`/clients/client-view/${visit.client.id}`)
    }catch(err){
        console.log(err)
        visit = await ClientVisits.findById(req.params.id).populate('client').exec()
        req.flash('mess','Nie udało się edytować wizyty.');
        req.flash('type','info-alert')
        return res.redirect(`/clients/client-view/${visit.client.id}`)
    }
   
})
/*
* Update client
*/
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
        clients.name=req.body.name.trim(),
        clients.lastName=req.body.lastName.trim(),
        clients.phoneNumber=req.body.phoneNumber,
        clients. dateOfBirth= Date.parse(req.body.dateOfBirth)||'',
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
/*
* Delete client
*/
router.delete('/:id', ensureAuthenticated,async(req,res)=>{
    try{
        let client =  await Client.findById(req.params.id);
        await client.deleteOne();
        req.flash('mess','Udało się usunąć klienta.')
        req.flash('type','info-success') 
        res.redirect('/clients') 

    }catch(err){
        console.log(err);
        req.flash('mess','Nie udało się usunąć klienta.')
        req.flash('type','info-alert') 
        res.redirect('/clients')       
    }
  
})
module.exports = router;