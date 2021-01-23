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
       
    },
    clientVisitDate:{
        type:Date,
        required:false
    },
    comment:{
        type:String,
        required:false,
    },
        
    treatment:{
        type:String, //id of another object in our colection
        required:false,
    },
    price:{
        type:Number,
        required:false,
        default:0
    },
    shopping:{
        type:String,
        required:false,
    }
    
})

module.exports = mongoose.model('ClientVisits',clientVisits);