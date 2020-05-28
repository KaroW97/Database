const mongoose = require('mongoose');

const TreatmentSchema = mongoose.Schema({
    user:{
        type:String,
        require:true
    },
    treatmentName:{
        type:String,
        require:true
    },
    treatmentPrice:{
        type:Number,
        require:true
    }
})


module.exports = mongoose.model('Treatment',TreatmentSchema)