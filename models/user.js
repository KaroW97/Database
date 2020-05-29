const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    companyName:{
        type:String,
        require:true
    },
    email:{
        type: String,
        require:true,
        
    },
    password:{
        type:String,
        require:true
    },
    resetLink:{
        data:String,
        default:''
    }

})

module.exports = mongoose.model('User', userSchema)