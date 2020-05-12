const mongoose = require('mongoose');


const clientSchema = new mongoose.Schema({
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
    skinDiagnose:{ //jak cos to po w values/name mozna sporbowac skinDiagnose.dryskin
        type:Array,
        of:Boolean
    },
    skinDiagnoseNames:{ //jak cos to po w values/name mozna sporbowac skinDiagnose.dryskin
        type:Array,
        of:String
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
   
    other:{
        type:String,
        required:false
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

    //Add new diagnose
    comments:[{
        forId:String, //to mozna sporobwac dodac treatment
        comment:String
    }],
    treatment:{
        type:mongoose.Schema.Types.ObjectId, //id of another object in our colection
        required:false,
        ref:'Treatment' //do czego sie odnosi
    },
        
})



module.exports = mongoose.model('Client',clientSchema)

