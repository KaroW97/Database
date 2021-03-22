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
         
        let clientFind =await Client.find(clientBirthday).exec();
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
            drySkin:Boolean(req.body.drySkin) ||false,
            wrinkless:Boolean(req.body.wrinkless)||false,
            lackfirmnes:Boolean(req.body.lackfirmnes)||false,
            nonuniformColor:Boolean(req.body.nonuniformColor)||false,
            tiredness:Boolean(req.body.tiredness)||false,
            acne:Boolean(req.body.acne)||false,
            smokerSkin:Boolean(req.body.smokerSkin)||false,
            fatSkin:Boolean(req.body.fatSkin)||false,
            discoloration:Boolean(req.body.discoloration)||false,
            blackheads: Boolean(req.body.blackheads)||false,
            darkCirclesEyes:Boolean(req.body.darkCirclesEyes)||false,
            dilatedCapillaries:Boolean(req.body.dilatedCapillaries)||false,
            papularPustularAcne:Boolean(req.body.papularPustularAcne)||false,
            externallyDrySkin:Boolean(req.body.externallyDrySkin)||false,
            other:req.body.other,
        },
        scalpCondition:{
            scalyScalp:Boolean(req.body.scalyScalp) ||false,
            normalScalp:Boolean(req.body.normalScalp) ||false,
            oilyScalp:Boolean(req.body.oilyScalp) ||false,
            dandruff:Boolean(req.body.dandruff) ||false,
            psoriasis:Boolean(req.body.psoriasis) ||false,
            alopecia:Boolean(req.body.alopecia) ||false,
            parasites:Boolean(req.body.parasites) ||false,
            reddedScalp:Boolean(req.body.reddedScalp) ||false,
            scratchedWounds:Boolean(req.body.scratchedWounds) ||false,
            scarsOnTheScalp:Boolean(req.body.scarsOnTheScalp) ||false,
        },
        hairTypeAndTexture:{
            straightHair:Boolean(req.body.straightHair) ||false,
            curlyHair:Boolean(req.body.curlyHair) ||false,
            wavyHair:Boolean(req.body.wavyHair) ||false,
            woollyHair:Boolean(req.body.woollyHair) ||false,
            fineHair:Boolean(req.body.fineHair) ||false,
            proneHair:Boolean(req.body.proneHair) ||false,
            thickHair:Boolean(req.body.thickHair) ||false,
            glassyHair:Boolean(req.body.glassyHair) ||false,
        },
        hairCondition:{
            dryHair:Boolean(req.body.dryHair) ||false,
            oilyHair:Boolean(req.body.oilyHair) ||false,
            normalHair:Boolean(req.body.normalHair) ||false,
            healthyHair:Boolean(req.body.healthyHair) ||false,
            overlyGlowingHair:Boolean(req.body.overlyGlowingHair) ||false,
            dullHair:Boolean(req.body.dullHair) ||false,
            tangleHair:Boolean(req.body.tangleHair) ||false,
        },

        hairAfterChemicalTreatments:{
            coloredHair:Boolean(req.body.coloredHair) ||false,
            lightenedHair:Boolean(req.body.lightenedHair) ||false,
            shadedHair:Boolean(req.body.shadedHair) ||false,
            permHair:Boolean(req.body.permHair) ||false,
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
        console.log(err)
        req.flash('mess','Nie udało się dodać klienta do bazy.');
        req.flash('type','info-alert')
        res.redirect(`/calendar`)
      
    }
})
/*
* Show Client
*/
router.get('/client-view/:id',ensureAuthenticated,async(req,res)=>{
    let query = ClientVisits.find({client:req.params.id});
    if(req.query.dateFrom != null &&  req.query.dateFrom !=''){
        query = query.gte('clientVisitDate', req.query.dateFrom) //less then or equal
    }
    if(req.query.dateTo != null &&  req.query.dateTo !=''){
        query = query.lte('clientVisitDate', req.query.dateTo) //greater then or equal
    }

   if(req.query.selectVisitByType != null && req.query.selectVisitByType !== ''){
        query.typeOfVisit = req.query.selectVisitByType
   }
    try{
      
        const treatments = await Treatment.find({user:req.user.id});
        const clientt  = await Client.findById(req.params.id)
        const addedVisit =( req.query.selectVisitByType != undefined && req.query.selectVisitByType != "Wszystko") ? 
                await ClientVisits.find(query).find({typeOfVisit:req.query.selectVisitByType}).limit(100).exec():
                await ClientVisits.find(query).limit(100).exec()

       
      
        res.render('clients/clientView',{
            addedVisit:addedVisit,
            treatments:treatments,
            curentClient:req.params.id,
            oneClient:clientt,
            searchOptions:req.query,
           
        })
    }catch(err){
        console.log(err)
        res.redirect(`/clients/client-view/${req.params.id}`)
    }
})
/*
* Add new Visit and add it to stats
*/
router.post('/client-view/:id',ensureAuthenticated, async(req,res)=>{
    let clientt, findTreatmentStat ;
    let date = req.body.clientVisitDate === '' ? new Date().toISOString().split('T')[0] : new Date(req.body.clientVisitDate).toISOString().split('T')[0]
    console.log(req.body.typeOfVisit)

    try{   
        let treatment = await Treatment.find({user:req.user.id, treatmentName:req.body.treatment.trim()})
        let treatmentPrice = treatment.length > 0 ? treatment[0].treatmentPrice : 0
        findTreatmentStat = await ClientsShoppingsStats.find({user:req.user.id,treatment:req.body.treatment})
        clientt  = await Client.findById(req.params.id)
        clientt.totalSumSpent =  Number(clientt.totalSumSpent) + Number(treatmentPrice)
        const visit = new ClientVisits({
            client:req.params.id,
            comment: req.body.comment,
            clientVisitDate: date ,
            treatment: req.body.treatment,
            user:req.user.id,
            shopping:req.body.shopping,
            price:treatmentPrice, 
            typeOfVisit:req.body.typeOfVisit
        })
        clientt.clientVisits.push({
            visit:visit.id,
            treatment: req.body.treatment,
            clientVisitDate: date,
            price:treatmentPrice
        })
        if(findTreatmentStat.length === 0){
             const treatmentStats = new ClientsShoppingsStats({
                user:req.user.id,
                treatment: req.body.treatment.trim(),
                totalPrice:treatmentPrice,
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
                visit.clientVisitDate.toISOString().split('T')[0] === v.clientVisitDate
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
         let treatment = await Treatment.find({user:req.user.id, treatmentName:req.body.treatment.trim()})
         
         let treatmentPrice = treatment.length > 0 ? Number(treatment[0].treatmentPrice) : 0
         visit = await ClientVisits.findById(req.params.id).exec()
         findTreatmentStat = await ClientsShoppingsStats.find({user:req.user.id, treatment:visit.treatment})
       
        
         let compare = visit.clientVisitDate.toISOString().split('T')[0]
         visit.client=visit.client
         visit.comment= req.body.comment
         visit.clientVisitDate= date 
         visit.treatment= req.body.treatment.trim()
         visit.shopping = req.body.shopping
         visit.typeOfVisit=req.body.typeOfVisit
         clientt  = await Client.findById(visit.client)
         let updateClientVisits =  clientt.clientVisits.findIndex(v =>v.visit == visit._id)
        
         clientt.totalSumSpent -= Number(visit.price)
         clientt.totalSumSpent =  Number(clientt.totalSumSpent) + treatmentPrice
         visit.price = treatmentPrice

         clientt.clientVisits.set(updateClientVisits,{
            visit: visit.id,
            treatment : req.body.treatment.trim(),
            clientVisitDate : date,
            price : treatmentPrice
         })
         findTreatmentStatAfter = await ClientsShoppingsStats.find({treatment:visit.treatment})
        
         /*
         * If treatment is the same but data is not
         */
         if(findTreatmentStat.length !==0 && findTreatmentStat[0].treatment ===visit.treatment){
            findTreatmentStat[0].transactionDate = modify_array(findTreatmentStat, compare)
            findTreatmentStat[0].transactionDate.push(date)
            findTreatmentStat[0].transactionDate.length === 0 ?  await findTreatmentStat[0].deleteOne() : await  findTreatmentStat[0].save()    
         }
         /*
         * If name of the treatment is diferent and lenght of the treatment after updating is 0
         */
        else if(findTreatmentStatAfter.length !== 0 && findTreatmentStat.length !==0 && findTreatmentStat[0].treatment !== visit.treatment){
           findTreatmentStat[0].transactionDate = modify_array(findTreatmentStat, compare)
           findTreatmentStatAfter[0].transactionDate.push(date)
           findTreatmentStat[0].transactionDate.length === 0 ?   await findTreatmentStat[0].deleteOne() :  await  findTreatmentStat[0].save()
           await findTreatmentStatAfter[0].save()
        }
        /*
        * if after upadting visit, the name of treatment is not in database then create new 
        */
        else if(findTreatmentStatAfter.length === 0 ){
            const treatmentStats = new ClientsShoppingsStats({
                user:req.user.id,
                treatment: req.body.treatment.trim(),
                totalPrice:treatmentPrice,
            })
            treatmentStats.transactionDate.push(date)
            if(findTreatmentStat[0].transactionDate.length > 1){
                findTreatmentStat[0].transactionDate = modify_array(findTreatmentStat, compare)
                await findTreatmentStat[0].save()
            }else if(findTreatmentStat[0].transactionDate.length <= 1)
              await  findTreatmentStat[0].deleteOne()
            
            await treatmentStats.save()
         }

        await clientt.save();
        await visit.save();
        
         req.flash('mess','Wizyta została edytowana.');
         req.flash('type','info-success')
         return res.redirect(`/clients/client-view/${visit.client._id}`)
    }catch(err){
        console.log(err)
        req.flash('mess','Nie udało się edytować wizyty.');
        req.flash('type','info-alert')
        return res.redirect(`/clients/client-view/${req.params.id}`)
    }
   
})
/*
* Update client
*/
router.put('/client-view/:id',ensureAuthenticated,async (req,res)=>{
    let clients;
    
    try{
        clients =  await Client.findById(req.params.id)
      
        clients.skinDiagnoseAll.drySkin =Boolean(req.body.drySkin)||false
        clients.skinDiagnoseAll.wrinkless =Boolean(req.body.wrinkless)||false
        clients.skinDiagnoseAll.lackfirmnes =Boolean(req.body.lackfirmnes)||false
        clients.skinDiagnoseAll.nonuniformColor =Boolean(req.body.nonuniformColor)||false
        clients.skinDiagnoseAll.tiredness =Boolean(req.body.tiredness)||false
        clients.skinDiagnoseAll.acne =Boolean(req.body.acne)||false
        clients.skinDiagnoseAll.smokerSkin =Boolean(req.body.smokerSkin)||false
        clients.skinDiagnoseAll.fatSkin =Boolean(req.body.fatSkin)||false
        clients.skinDiagnoseAll.discoloration =Boolean(req.body.discoloration)||false
        clients.skinDiagnoseAll.blackheads =Boolean(req.body.blackheads)||false,
        clients.skinDiagnoseAll.darkCirclesEyes =Boolean(req.body.darkCirclesEyes)||false
        clients.skinDiagnoseAll.dilatedCapillaries =Boolean(req.body.dilatedCapillaries)||false
        clients.skinDiagnoseAll.papularPustularAcne =Boolean(req.body.papularPustularAcne)||false
        clients.skinDiagnoseAll.externallyDrySkin =Boolean(req.body.externallyDrySkin)||false

        clients.skinDiagnoseAll.other =req.body.other

    
        clients.scalpCondition.scalyScalp=Boolean(req.body.scalyScalp) ||false,
        clients.scalpCondition.normalScalp=Boolean(req.body.normalScalp) ||false,
        clients.scalpCondition.oilyScalp=Boolean(req.body.oilyScalp) ||false,
        clients.scalpCondition.dandruff=Boolean(req.body.dandruff) ||false,
        clients.scalpCondition.psoriasis=Boolean(req.body.psoriasis) ||false,
        clients.scalpCondition.alopecia=Boolean(req.body.alopecia) ||false,
        clients.scalpCondition.parasites=Boolean(req.body.parasites) ||false,
        clients.scalpCondition.reddedScalp=Boolean(req.body.reddedScalp) ||false,
        clients.scalpCondition.scratchedWounds=Boolean(req.body.scratchedWounds) ||false,
        clients.scalpCondition.scarsOnTheScalp=Boolean(req.body.scarsOnTheScalp) ||false,
        
        clients.hairTypeAndTexture.straightHair=Boolean(req.body.straightHair) ||false,
        clients.hairTypeAndTexture.curlyHair=Boolean(req.body.curlyHair) ||false,
        clients.hairTypeAndTexture.wavyHair=Boolean(req.body.wavyHair) ||false,
        clients.hairTypeAndTexture.woollyHair=Boolean(req.body.woollyHair) ||false,
        clients.hairTypeAndTexture.fineHair=Boolean(req.body.fineHair) ||false,
        clients.hairTypeAndTexture.proneHair=Boolean(req.body.proneHair) ||false,
        clients.hairTypeAndTexture.thickHair=Boolean(req.body.thickHair) ||false,
        clients.hairTypeAndTexture.glassyHair=Boolean(req.body.glassyHair) ||false,

        clients.hairCondition.dryHair=Boolean(req.body.dryHair) ||false,
        clients.hairCondition.oilyHair=Boolean(req.body.oilyHair) ||false,
        clients.hairCondition.normalHair=Boolean(req.body.normalHair) ||false,
        clients.hairCondition.healthyHair=Boolean(req.body.healthyHair) ||false,
        clients.hairCondition.overlyGlowingHair=Boolean(req.body.overlyGlowingHair) ||false,
        clients.hairCondition.dullHair=Boolean(req.body.dullHair) ||false,
        clients.hairCondition.tangleHair=Boolean(req.body.tangleHair) ||false,



        clients.hairAfterChemicalTreatments.coloredHair=Boolean(req.body.coloredHair) ||false,
        clients.hairAfterChemicalTreatments.lightenedHair=Boolean(req.body.lightenedHair) ||false,
        clients.hairAfterChemicalTreatments.shadedHair=Boolean(req.body.shadedHair) ||false,
        clients.hairAfterChemicalTreatments.permHair=Boolean(req.body.permHair) ||false,
        




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

const modify_array = (findTreatmentStat, compare) =>{
    let updateTreatmentStats = findTreatmentStat[0].transactionDate.findIndex(data => data === compare)
    return [
        ...findTreatmentStat[0].transactionDate.splice(0,updateTreatmentStats),
        ...findTreatmentStat[0].transactionDate.splice(updateTreatmentStats + 1)
    ]
}
module.exports = router;