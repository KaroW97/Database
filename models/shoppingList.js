const mongoose = require('mongoose');

const shoppingList = mongoose.Schema ({

    listName:{
        type:String,
        require:true,
    
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
    }
    /*brandName:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'BrandName'
    }*/
   
 
})

module.exports = mongoose.model('ShoppingList', shoppingList);