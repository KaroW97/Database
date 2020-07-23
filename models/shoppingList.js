const mongoose = require('mongoose');
const ttl = require('mongoose-ttl');
const ms = require('ms')
const shoppingList = mongoose.Schema ({
    user:{
        type:String,
        require:false
    },
    listName:{
        type:mongoose.Schema.Types.ObjectId,
        require:false,
        ref:'BrandName'
    },
    listNameNew:{
        type:String,
        require:false
    },
    brandState:{
        type:String,
        require:false
    },
    productName:{
        type:[String],
        require:false
    },
    price:{
        type:[Number],
        require:false
    },
    transactionDate:{
        type:Date,
        require:false
    },
    totalPrice:{
        type:Number,
        require:false
    },
    

   
 
})
////shoppingList.plugin(ttl,{ttl:ms('1d')})
const ShoppingList = mongoose.model('ShoppingList',shoppingList)
//ShoppingList.startTTLReaper()

module.exports = ShoppingList