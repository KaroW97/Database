const mongoose = require('mongoose');

const TreatmentSchema = mongoose.Schema({
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