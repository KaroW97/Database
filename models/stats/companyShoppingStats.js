const mongoose = require('mongoose');

const companyShopping = mongoose.Schema({
    user:{
        type:String,
        require:false
    },
    productName:{
        type:String,
        require:false
    },
    productPrice:{
        type:Number,
        require:false
    },
    transactionDate:{
        type:Date,
        require:false
    }
})

module.exports = mongoose.model('CompanyShopping', companyShopping)