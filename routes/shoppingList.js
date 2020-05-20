const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList')

//Main Page Shopping List
router.get('/',async(req,res)=>{
    try{
        const shoppingList = await ShoppingList.find({})
        res.render('shoppingList/index',{
            shopping:shoppingList
        });
    }catch{
        res.redirect('/clients');
    }
    
})
//Add Shopping List Name
router.post('/', async(req,res)=>{
    const shoppingList = new ShoppingList({
       
        listName:req.body.listName,
      
    })
    try{
        await shoppingList.save();
        res.redirect(`/shoppingList/new/${shoppingList.id}`)
    }catch{
        res.redirect(`/clients`)
    }
})
//Add New Shopping List Items
router.get('/new/:id',async(req,res)=>{
    try{
        const shopping  = await ShoppingList.findById(req.params.id)
        const addedShoping = await ShoppingList.find({_id:shopping.id})
       
        res.render(`shoppingList/new`,{
            list:shopping,
            addedShoping:addedShoping
        });
    }catch{
        res.redirect('/shoppingList')
    }
   
})
// Update Shopping List Item
router.put('/new/:id',async(req,res)=>{
    let totalPriceCalculate = 0;
    try{
        list =  await ShoppingList.findById(req.params.id);
        list.price.push(Number(req.body.price)),
        list.productName.push(req.body.productName);
        
        if(list.transactionDate  == null)
        list.transactionDate = Date.parse(req.body.transactionDate)|| '';

        list.price.forEach(element => {
            totalPriceCalculate +=element;
        });
        list.totalPrice = totalPriceCalculate
        await list.save();
        res.redirect(`/shoppingList/new/${list.id}`);
    }catch{
        const shopping  = await ShoppingList.findById(req.params.id)
        const addedShoping = await ShoppingList.find({_id:shopping.id});

        res.render('shoppingList/new',{
            errorMessage:'Error Creating List',
            list:list,
            addedShoping:addedShoping
        })
    }
})
//List View Router
router.get('/listView/:id',async(req,res)=>{
    try{
        const shoppingList = await ShoppingList.findById(req.params.id);
        res.render('shoppingList/listView',{
            shopping:shoppingList
        })
    }catch{
        res.redirect('/shoppingList');
    }
})
//Delete Shopping List Router
router.delete('/:id',async(req,res)=>{
    try{
        const list = await ShoppingList.findById(req.params.id);
        await list.remove();
        res.redirect('/shoppingList');
    }catch{
      
        if(clients == null){
            res.redirect('/clients')
        }else{
            res.redirect(`/shoppingList/listView/${list.id}`)
        }   
    }
  
})
//Edit List Router
router.get('/listView/:id/edit', async(req,res)=>{
    try{
        const list = await ShoppingList.findById(req.params.id);
        res.render('shoppingList/edit',{
            list:list
        })
    }catch{
        res.redirect(`/shoppingList/listView/${list.id}`)
    }
  
})
//Edit List Item
router.put('/listView/:id/edit', async(req,res)=>{
    let list
    let totalPriceCalculate = 0;
    try{
        list = await ShoppingList.findById(req.params.id);
        list.listName = req.body.listName
        console.log(req.body.price )
        if( req.body.price == null ||req.body.price =='' ||req.body.price =='0')
            list.price.pull(req.body.price);
        list.price = req.body.price
        list.productName =req.body.productName
        list.transactionDate = Date.parse(req.body.transactionDate)|| '';

        list.price.forEach(element =>totalPriceCalculate +=element);
        list.totalPrice = totalPriceCalculate
        console.log(list)
        await list.save();
        res.redirect(`/shoppingList/listView/${list.id}`);

    }catch(err){
        console.log(err)
        res.redirect(`/shoppingList`);
    }
  
})
//Delete List Item
//TODO FIX DELETING ROUTS
/*router.delete('/listView/:id', async(req,res)=>{
   
    
       try{
        let elem = req.params.id.split(',');
       
        const list = await ShoppingList.findById(elem[0]);
        console.log(list)
       // await list.price[elem [1]].remove()
       
       
        res.redirect(`/shoppingList/listView/${list.id}`);
      
    }catch(err){
        console.log(err)
            res.redirect('clients')
    }
})*/
module.exports = router