const mongoose = require('mongoose');

const brandName = mongoose.Schema({
    name:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model('BrandName',brandName )