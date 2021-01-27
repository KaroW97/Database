const mongoose = require('mongoose');


const clientsShoppingsStats = mongoose.Schema({
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

module.exports = mongoose.model('ClientsShoppingsStats', clientsShoppingsStats)
