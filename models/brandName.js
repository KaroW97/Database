const mongoose = require('mongoose');

const brandName = mongoose.Schema({
    user:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:false
    }
})

module.exports = mongoose.model('BrandName',brandName )