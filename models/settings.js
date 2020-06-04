const mongoose = require('mongoose');


const settingsSchema = mongoose.Schema({
    companyName:{
        type:String
    }, 
    password:{
        type:String
    },
    email:{
        type:String
    }
})

module.exports = mongoose.model('Settings', settingsSchema)