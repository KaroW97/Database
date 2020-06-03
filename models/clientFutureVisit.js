const mongoose = require('mongoose');

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
    }

    
})

module.exports = mongoose.model('FutureVisit',futureVisit)