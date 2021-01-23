const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList')
const BrandName = require('../models/brandName')
const CompanyShopping = require('../models/companyShoppingStats')
const ObjectId = require('mongodb').ObjectId;
const ListProducts = require('../models/listProducts')
const {ensureAuthenticated} = require('../config/auth')

//Main Page Shopping List
/*
* All shopping lists
*/
router.get('/',ensureAuthenticated,async(req,res)=>{
    let todayDate = new Date(),weekDate=new Date();
    todayDate.setDate(todayDate.getDate() - 1)
    weekDate.setDate(todayDate.getDate() + 8)
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']
    let shoppingList =  ShoppingList.find({user:req.user.id})
    if(req.query.visitAfter != null && req.query.visitAfter !='')
        shoppingList = shoppingList.gte('transactionDate',req.query.visitAfter);
    else
        shoppingList = shoppingList.find({transactionDate:{ $gt:todayDate}}).sort({transactionDate:'asc'})
    try{
        const brandName = await BrandName.find({user:req.user.id})
        const shoppingListShort = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})
        const shopping =  await shoppingList.sort({transactionDate:'asc'}).exec();
        const shoppingDist = await shoppingList.sort({transactionDate:'asc'}).distinct('listName')
        const listProducts = await ListProducts.find({user:req.user.id})
        res.render('shoppingList/index',{
            shoppingAll:shoppingListShort,
            shoppingDist:shoppingDist,
            shopping:shopping,
            brandName:brandName,
            weekdays:weekdays,
            searchOptions:req.query   
        });
    }catch(err){
        console.log(err)
        res.redirect('/clients');
    }
})
/*
* Add Shopping List name and create brand 
*/
router.post('/', ensureAuthenticated,async(req,res)=>{

    const listProducts = new ListProducts({
        name: req.body.shoppingItem,
        price:req.body.shoppingItem
    })
    const shoppingList = new ShoppingList({  
        listName:req.body.listName,
        transactionDate:req.body.transactionDate,
        user:req.user.id,
        brandName:req.body.brandName
    })
    try{
        const brands = await BrandName.find({name:req.body.brandName});
        if(brands.length === 0){
            const brandName = new BrandName({
                user:req.user.id,
                name:req.body.brandName,
            })
            await brandName.save()
        }
        await shoppingList.save();
        
        res.redirect(`/shopping-list`)
        //res.redirect(`/shopping-list/list-view/${shoppingList.id}`)
    }catch(err){
        console.log(err)
        res.redirect(`/clients`)
    }
})

//List View Router
router.get('/list-view/:id',ensureAuthenticated,async(req,res)=>{
    try{
        const shoppingList = await ShoppingList.findById(req.params.id)
        res.render('shoppingList/listView',{
            list:shoppingList
        })
    }catch{
        res.redirect('/shopping-list');
    }
})





router.put('/list-view/:id',ensureAuthenticated,async(req,res)=>{
    let totalPriceCalculate = 0;
    let list;
    try{
       
        list =  await ShoppingList.findById(req.params.id);
        list.price.push(Number(req.body.price)),
        list.productName.push(req.body.productName);
        //if(list.transactionDate  == null)
       // list.transactionDate = Date.parse(req.body.transactionDate)|| '';

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
        req.flash('type','info-success')
        await shoppingStatistics.save();
        await list.save();
 
        res.redirect(`/shopping-list/list-view/${list.id}`)
 

    }catch(err){
        const cssSheets =[]
        const shopping  = await ShoppingList.findById(req.params.id)
        const addedShoping = await ShoppingList.find({_id:shopping.id});
        req.flash('mess','Coś poszło nie tak.')
        req.flash('type','info-danger')
        res.render('shoppingList/list-view',{
            list:shopping,
            addedShoping:addedShoping,
            styles:cssSheets
        })
    }
})
//Delete Brands
router.delete('/brand-name-delete',async(req,res)=>{
    let brand_name;
    try{
        if(req.body.chackboxDeleteBrand!= null ){
            if(Array.isArray(req.body.chackboxDeleteBrand)){
              for(var i = 0; i < (req.body.chackboxDeleteBrand).length; i++){
                brand_name = await BrandName.findById(ObjectId(req.body.chackboxDeleteBrand[i]));
                await brand_name.remove();
              } 
              req.flash('mess','Nazwy firm zostały usunięte');
              req.flash('type','info')
            }else{
                brand_name = await BrandName.findById(ObjectId(req.body.chackboxDeleteBrand));
                await  brand_name.remove();
                req.flash('mess','Nazwa firmy została usunięta');
                req.flash('type','info')
            }
          }else{
            req.flash('mess','Nie wybrano nazwy firmy do usunięcia');
            req.flash('type','info')
          }
          res.redirect(`/shopping-list`)
    }catch(err){
        console.log(err)
        res.redirect(`/shopping-list`)
    }

})
//Delete Shopping List Router
router.delete('/:id',ensureAuthenticated,async(req,res)=>{
        var list
    try{
   
        list = await ShoppingList.findById(req.params.id);
        await list.remove();
        req.flash('mess','Usunięto liste zakupów.')
        req.flash('type','info-success')
        
        res.redirect('/shopping-list');
    }catch(err){
        console.log(err)
        req.flash('mess','Nie udało się usunąć rekordu.')
        req.flash('type','info-danger')
        res.redirect(`/shopping-list`)   
    }
})
//Edit List Router
router.get('/list-view/:id/edit',ensureAuthenticated, async(req,res)=>{
    const cssSheets =[]

    try{
        const list = await ShoppingList.findById(req.params.id)
        res.render('shoppingList/edit',{
            list:list,
            styles:cssSheets
        })
    }catch{
        res.redirect(`/shopping-list/list-view/${list.id}`)
    }
  
})
//Edit List Item
router.put('/list-view/:id/edit',ensureAuthenticated, async(req,res)=>{
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
        req.flash('type','info-success')
        await list.save();
  
        res.redirect(`/shopping-list/list-view/${list.id}`);

    }catch{
        req.flash('mess','Nie udało się zedytować listy.')
        req.flash('type','info-danger')
        res.redirect(`/shopping-list`);
    }
  
})
//Delete List Item
router.delete('/list-view/:id',ensureAuthenticated, async(req,res)=>{
   
    var list
    try{
        if(req.body.chackboxDelete==null){
            req.flash('mess','Nie wybrano produktów do usunięcia')
            req.flash('type','info')
            res.redirect(`/shopping-list/list-view/${req.params.id}`);
        }

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
            req.flash('type','info-success')
        }else{
            
            let elem = req.body.chackboxDelete;
            list = await ShoppingList.findById(req.params.id);
            
            list.totalPrice -= list.price[elem]
            list.price.splice(elem,1)
            list.productName.splice(elem,1)
            
            req.flash('mess','Rekord został usunięty')
            req.flash('type','info-success')
        }
        if(list.price == 0 || list.productName == ''||list.productName == []){
            list.remove()
            res.redirect(`/shopping-list`);
        }else{
            list.save();
            res.redirect(`/shopping-list/list-view/${list.id}`);
        }
       
        
       
 }catch(err){
     console.log(err)
         res.redirect('/shopping-list')
 }
})



module.exports = router