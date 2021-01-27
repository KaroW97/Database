const mongoose = require('mongoose');
const ttl = require('mongoose-ttl');
const ms = require('ms')
const shoppingList = mongoose.Schema ({
    user:{
        type:String,
        require:false
    },
    listName:{
        type:String,
        require:false
    },
    productListInfo:[

    ],
    transactionDate:{
        type:Date,
        require:false
    },
    totalPrice:{
        type:Number,
        require:false,
        default:0
    },
    brandName:{
        type:String,
        require:false
    }

   
 
})

shoppingList.plugin(ttl,{ttl:ms('40d')})
const ShoppingList = mongoose.model('ShoppingList',shoppingList)
ShoppingList.startTTLReaper()


module.exports = ShoppingList