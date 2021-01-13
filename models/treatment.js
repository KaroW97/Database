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
    },
    treatmentDescription:{
        type:String,
        require:false
    },
    duration:{
        type:Number,
        require:false
    },
    costs_of_products_per_treatment:{
        type:Number,
        require:false
    },
    products_needed_to_do_the_treatment:{
        type:String,
        require:false
    }
})


module.exports = mongoose.model('Treatment',TreatmentSchema)