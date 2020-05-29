const mongoose = require('mongoose');

const clientVisits = mongoose.Schema({
    client:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Client',
        //forId:String, //to mozna sporobwac dodac treatment
    },
    clientVisitDate:{
        type:Date,
        required:true
    },
    comment:{
        type:String,
        required:true,
    },
        
    treatment:{
        type:mongoose.Schema.Types.ObjectId, //id of another object in our colection
        required:false,
        ref:'Treatment' //do czego sie odnosi
    },

   

})

module.exports = mongoose.model('ClientVisits',clientVisits);