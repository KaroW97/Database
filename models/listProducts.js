const mongoose = require('mongoose');

const listProducts = mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    user:{
        type:String,
        required:true
    },
    productInfo:[

    ],

    
})

module.exports = mongoose.model('ListProducts', listProducts)