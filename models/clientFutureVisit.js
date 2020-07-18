const mongoose = require('mongoose');
const ttl  =require('mongoose-ttl');
const ms = require('ms');

const futureVisit = mongoose.Schema({
    user:{
        type:String,
        require:true
    },
    //If Client In Database
    client:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:'Client',
    },
    //If Not
    newClient:{
        type:String,
        require:false
    },
    visitDate:{
        type:Date,
        require:false
    },
    timeFrom:{
        type:String,
        require:false,
    },
    timeTo:{
        type:String,
        require:false
    },
    treatment:{
        type:mongoose.Schema.Types.ObjectId, //id of another object in our colection
        required:false,
        ref:'Treatment' //do czego sie odnosi
    },
    newTreatment:{
        type:String,
        require:false
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    clientState:{
        type:String,
        required:false
    },
    treatmentState:{
        type:String,
        required:false
    }

})


futureVisit.plugin(ttl,{ttl:ms('1d')})
const FutureVisit = mongoose.model('FutureVisit',futureVisit)
FutureVisit.startTTLReaper()

module.exports = FutureVisit
