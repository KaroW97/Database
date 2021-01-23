const mongoose = require('mongoose');
const PorductSchema = mongoose.Schema({
    user:{
        type:String,
        require:true
    },
    prodTreatmentName:{
        type:String,
        require:true
    },
})
module.exports = mongoose.model('ProductsForTreatment',PorductSchema)