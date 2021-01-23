const mongoose = require('mongoose');

const companyShopping = mongoose.Schema({
    user:{
        type:String,
        require:false
    },
    treatment:{
        type:String,
        require:false
    },
    totalPrice:{
        type:Number,
        require:false
    },
    transactionDate:[]
})

module.exports = mongoose.model('CompanyShopping', companyShopping)