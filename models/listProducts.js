const mongoose = require('mongoose');

const listProducts = mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    price:{
        type:Number,
        required:false
    }
})

module.exports = mongoose.model('ListProducts', listProducts)