const mongoose = require('mongoose');
const ClientVisits = require('./clientsVisits')

const clientSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    totalSumSpent:{
        type:Number,
        required:false,
        default:0
    },
    visitDate:{
        type:Date,
        required:false
    },
    nextVisitDate:{
        type:Date,
        required:false
    },
    name:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true,
      
    },
    dateOfBirth:{
        type:Date,
        required:false
    },
 
   
   skinDiagnoseAll:{
        drySkin:Boolean,
        wrinkless:Boolean,
        lackfirmnes:Boolean,
        nonuniformColor:Boolean,
        tiredness:Boolean,
        acne:Boolean,
        smokerSkin:Boolean,
        fatSkin:Boolean,
        discoloration:Boolean,
        blackheads:Boolean,
        darkCirclesEyes:Boolean,
        dilatedCapillaries:Boolean,
        papularPustularAcne:Boolean,
        externallyDrySkin:Boolean,
        other:String
    },
    scalpCondition:{
        scalyScalp:Boolean,
        normalScalp:Boolean,
        oilyScalp:Boolean,
        dandruff:Boolean,
        psoriasis:Boolean, //luszczyca
        alopecia:Boolean,  //lysienie
        parasites:Boolean,
        reddedScalp:Boolean,
        scratchedWounds:Boolean,
        scarsOnTheScalp:Boolean,
      

    },

    hairTypeAndTexture:{
        straightHair:Boolean,
        wavyHair:Boolean,
        curlyHair:Boolean,
        woollyHair:Boolean,

        fineHair:Boolean,
        proneHair:Boolean,
        thickHair:Boolean,
        glassyHair:Boolean
    },
    hairCondition:{
        dryHair:Boolean,
        oilyHair:Boolean,
        normalHair:Boolean,

        healthyHair:Boolean,
        overlyGlowingHair:Boolean,
        dullHair:Boolean,
        tangleHair:Boolean,
    },
    hairAfterChemicalTreatments:{
        coloredHair:Boolean,
        lightenedHair:Boolean,
        shadedHair:Boolean,
        permHair:Boolean,
    },
    
 
    //Wywiad
    washingFace:{
        type:String,
        required:false
    },
    faceTension:{
        type:String,
        required:false
    },
    currentFaceCreams:{
        type:String,
        required:false
    },

    //Zakupy
    shopping:{
        type:String,
        required:false
    },
    //Diagnoza
    diagnose1:{
        type:String,
        required:false
    },
    teraphyPlan:{
        type:String,
        required:false
    },
    recommendedCare:{
        type:String,
        required:false
    },
    clientVisits:[
        
    ]
})

clientSchema.pre('remove',function(next){
    ClientVisits.find({client:this.id}, (err,visits)=>{
        if(err){
            next(err)
        }
        if(visits.length >=0){
            for(var i=0;i<visits.length;i++){
                visits[i].remove()
            }
            next();
        }else{
            next(new Error("We couldn't remove visits for this client please try again"))
        }
    })
})



module.exports = mongoose.model('Client',clientSchema)

