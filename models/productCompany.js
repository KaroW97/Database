const mongoose = require('mongoose');

const brandName = mongoose.Schema({
    user:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model('BrandName',brandName )