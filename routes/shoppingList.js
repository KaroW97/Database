const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList')
const BrandName = require('../models/productCompany')
const CompanyShopping = require('../models/stats/companyShoppingStats')
const {ensureAuthenticated} = require('../config/auth')

//Main Page Shopping List
//TODO DODAC OBSLUGE BLEDOW
router.get('/',ensureAuthenticated,async(req,res)=>{
    try{
        const shoppingList = await ShoppingList.find({user:req.user.id}).populate('listName').exec();
        const brandName = await BrandName.find({user:req.user.id})
        res.render('shoppingList/index',{
            shopping:shoppingList,
            brandName:brandName
        });
    }catch{
        res.redirect('/clients');
    }
    
})
//Add Shopping List Name
router.post('/', ensureAuthenticated,async(req,res)=>{
    const shoppingList = new ShoppingList({  
        listName:req.body.brandName,
        user:req.user.id
    })
    try{
        await shoppingList.save();
        res.redirect(`/shoppingList/listView/${shoppingList.id}`)
    }catch{
        res.redirect(`/clients`)
    }
})
//Shoping list Create Brand Name
router.post('/brandName',async(req,res)=>{
    const brandName = new BrandName({
        name:req.body.name,
        user:req.user.id
    })
    try{
        brandName.save();
        res.redirect('/shoppingList')
    }catch{
        res.redirect('/clients')
    }
})
//List View Router
router.get('/listView/:id',ensureAuthenticated,async(req,res)=>{
    try{
        const shoppingList = await ShoppingList.findById(req.params.id)
        .populate('listName')
        .exec();
        res.render('shoppingList/listView',{
            list:shoppingList
        })
    }catch{
        res.redirect('/shoppingList');
    }
})
router.put('/listView/:id',ensureAuthenticated,async(req,res)=>{
    let totalPriceCalculate = 0;
    let list;
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
        const shoppingStatistics = new CompanyShopping({
            productName:req.body.productName,
            productPrice:req.body.price,
            user:req.user.id,
            transactionDate:Date.parse(req.body.transactionDate)||list.transactionDate
        })    
        await shoppingStatistics.save();
        await list.save();
        res.redirect(`/shoppingList/listView/${list.id}`);
    }catch(err){
        console.log(err)
        const shopping  = await ShoppingList.findById(req.params.id)
        const addedShoping = await ShoppingList.find({_id:shopping.id});

        res.render('shoppingList/listView',{
            type:'danger',
            errorMessage:'Błąd Tworzenia Listy',
            list:shopping,
            addedShoping:addedShoping
        })
    }
})
//Delete Shopping List Router
router.delete('/:id',ensureAuthenticated,async(req,res)=>{
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
router.get('/listView/:id/edit',ensureAuthenticated, async(req,res)=>{
    try{
        const list = await ShoppingList.findById(req.params.id).populate('listName').exec();
        res.render('shoppingList/edit',{
            list:list
        })
    }catch{
        res.redirect(`/shoppingList/listView/${list.id}`)
    }
  
})
//Edit List Item
router.put('/listView/:id/edit',ensureAuthenticated, async(req,res)=>{
    let list
    let totalPriceCalculate = 0;
    try{
        list = await ShoppingList.findById(req.params.id)
        //list.listName = req.body.listName
        if( req.body.price == null ||req.body.price =='' ||req.body.price =='0')
            list.price.pull(req.body.price);
        list.price = req.body.price
        list.productName =req.body.productName
        list.transactionDate = Date.parse(req.body.transactionDate)|| '';

        list.price.forEach(element =>totalPriceCalculate +=element);
        list.totalPrice = totalPriceCalculate
     
        await list.save();
        res.redirect(`/shoppingList/listView/${list.id}`);

    }catch{
        res.redirect(`/shoppingList`);
    }
  
})
//Delete List Item
router.delete('/listView/:id',ensureAuthenticated, async(req,res)=>{
       try{
        let elem = req.params.id.split(',');
        const list = await ShoppingList.findById(elem[0]);
        //pricee = list.totalPrice 
        //pricee = pricee- list.price[elem[1]]
        list.totalPrice -= list.price[elem[1]]
        list.price.splice(elem[1],1)
        list.productName.splice(elem[1],1)
        if(list.price == 0 || list.productName == ''|| list.productName == []){
            list.remove()
            res.redirect(`/shoppingList`);
        }else{
            list.save();
            res.redirect(`/shoppingList/listView/${list.id}`);
        }
    }catch(err){
            res.redirect('clients')
    }
})

module.exports = router