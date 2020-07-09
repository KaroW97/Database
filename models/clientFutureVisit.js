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
    clientName:{
        type:String,
        require:false
    },
    clientLastName:{
        type:String,
        require:false
    },
    visitDate:{
        type:Date,
        require:true
    },
    timeFrom:{
        type:String,
        require:true,
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
   
})
//,{timestamps: true}
//futureVisit.index({createdAt: 1},{expireAfterSeconds: 30})
futureVisit.plugin(ttl,{ttl:ms('120 days')})
const FutureVisit = mongoose.model('FutureVisit',futureVisit)

FutureVisit.startTTLReaper()

module.exports = FutureVisit
