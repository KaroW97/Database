const mongoose = require('mongoose');

const clientVisits = mongoose.Schema({
    user:{
        type:String, 
        require:true
    },
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
        type:String, //id of another object in our colection
        required:false,
      
    },
    shopping:{
        type:String,
        required:false,
    }
    
})

module.exports = mongoose.model('ClientVisits',clientVisits);