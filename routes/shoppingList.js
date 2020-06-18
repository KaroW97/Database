const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList')
const BrandName = require('../models/productCompany')
const CompanyShopping = require('../models/stats/companyShoppingStats')
const ObjectId = require('mongodb').ObjectId;

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
       await brandName.save();
        req.flash('mess','Dodano nową listę zakupów do bazy.')
        req.flash('type','success')
        res.redirect('/shoppingList')
    }catch{
        req.flash('mess','Dodanie listy do bazy nie powiodło się')
        req.flash('type','danger')
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
        req.flash('mess','Dodano element do listy')
        req.flash('type','success')
        await shoppingStatistics.save();
        await list.save();
 
        res.redirect(`/shoppingList/listView/${list.id}`)
 

    }catch(err){
        console.log(err)
        const shopping  = await ShoppingList.findById(req.params.id)
        const addedShoping = await ShoppingList.find({_id:shopping.id});
        req.flash('mess','Coś poszło nie tak.')
        req.flash('type','succesdangers')
        res.render('shoppingList/listView',{
            list:shopping,
            addedShoping:addedShoping
        })
    }
})

//Delete Shopping List Router
router.delete('/',ensureAuthenticated,async(req,res)=>{
    console.log(req.body.chackboxDelete)
    var list
    try{
        if(req.body.chackboxDelete!= null){
            if(Array.isArray(req.body.chackboxDelete)){
                for(var i=0;i<req.body.chackboxDelete.length; i++){
                    list = await ShoppingList.findById(req.body.chackboxDelete[i]);
                    await list.remove();
                }
                req.flash('mess','Usunięto listy zakupów.')
                req.flash('type','success')
            }else{
                list = await ShoppingList.findById(req.body.chackboxDelete);
                await list.remove();
                req.flash('mess','Usunięto liste zakupów.')
                req.flash('type','success')
            }
        
        }else{
            req.flash('mess','Nie podano zabiegu do usunącia')
            req.flash('type','info')
        }
        res.redirect('/shoppingList');
    }catch{
        req.flash('mess','Nie udało się usunąć rekordu.')
        req.flash('type','danger')
        res.redirect(`/shoppingList`)   
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
        req.flash('mess','Lista została zedytowana.')
        req.flash('type','success')
        await list.save();
  
        res.redirect(`/shoppingList/listView/${list.id}`);

    }catch{
        req.flash('mess','Nie udało się zedytować listy.')
        req.flash('type','danger')
        res.redirect(`/shoppingList`);
    }
  
})
//Delete List Item
/*router.delete('/listView/:id',ensureAuthenticated, async(req,res)=>{
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
})*/
//Delete List Item
router.delete('/listView/:id',ensureAuthenticated, async(req,res)=>{
   
    var list
    try{
       
        if(Array.isArray(req.body.chackboxDelete)){
            list  = await ShoppingList.findById(req.params.id);
            let sorted = (req.body.chackboxDelete).sort().reverse();
            for(var i=0;i<sorted.length ; i++){
                let elem = sorted[i];
                list.totalPrice -= list.price[elem]
                list.price.splice(elem,1)
                list.productName.splice(elem,1 )    
            }
            req.flash('mess','Rekordy zostały usunięte')
            req.flash('type','success')
        }else{
          
            let elem = req.body.chackboxDelete;
            list = await ShoppingList.findById(req.params.id);
            
            list.totalPrice -= list.price[elem]
            list.price.splice(elem,1)
            list.productName.splice(elem,1)
           
            req.flash('mess','Rekord został usunięty')
            req.flash('type','success')
        }
        if(list.price == 0 || list.productName == ''||list.productName == []){
            list.remove()
            res.redirect(`/shoppingList`);
        }else{
            list.save();
            res.redirect(`/shoppingList/listView/${list.id}`);
        }
        
       
 }catch(err){
     console.log(err)
         res.redirect('/shoppingList')
 }
})

module.exports = router