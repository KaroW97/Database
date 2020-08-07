const mongoose = require('mongoose');
const ClientVisits = require('./clientsVisits')

const clientSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    totalSumSpent:{
        type:Number,
        required:false
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
        drySkin:{
            name:String,
            value:Boolean
        },
        wrinkless:{
            name:String,
            value:Boolean
        },
        lackfirmnes:{
            name:String,
            value:Boolean
        },
        nonuniformColor:{
            name:String,
            value:Boolean
        },
        tiredness:{
            name:String,
            value:Boolean
        },
        acne:{
            name:String,
            value:Boolean
        },
        smokerSkin:{
            name:String,
            value:Boolean
        },
        fatSkin:{
            name:String,
            value:Boolean
        },
        discoloration:{
            name:String,
            value:Boolean
        },
        blackheads:{
            name:String,
            value:Boolean
        },
        darkCirclesEyes:{
            name:String,
            value:Boolean
        },
        dilatedCapillaries:{
            name:String,
            value:Boolean
        },
        papularPustularAcne:{
            name:String,
            value:Boolean
        },
        externallyDrySkin:{  
            name:String,
            value:Boolean
        },
        other:String
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

