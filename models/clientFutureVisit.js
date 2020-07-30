const mongoose = require('mongoose');
const ttl  =require('mongoose-ttl');
const ms = require('ms');

const futureVisit = mongoose.Schema({
    user:{
        type:String,
        require:true
    },
    //If Not
    clientName:{
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
        type:String, 
        required:false,
    },
    phoneNumber:{
        type:Number,
        required:true
    },


})


futureVisit.plugin(ttl,{ttl:ms('90d')})
const FutureVisit = mongoose.model('FutureVisit',futureVisit)
FutureVisit.startTTLReaper()

module.exports = FutureVisit
