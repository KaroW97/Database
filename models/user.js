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
    },
    //Email send
    secretToken:{
        type: String,
        require:false
    },
    active:{
        type:Boolean,
        require:false
    },
    role:{
        type: String,
        default: "user",
        enum: ["user", "admin"]
    }

})
userSchema.methods.isUser = function() {
    return (this.role === "user");
};
userSchema.methods.isAdmin = function() {
    return (this.role === "admin");
};
module.exports = mongoose.model('User', userSchema)