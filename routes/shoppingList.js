const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList')
const BrandName = require('../models/productCompany')
const CompanyShopping = require('../models/stats/companyShoppingStats')
const ObjectId = require('mongodb').ObjectId;

const {ensureAuthenticated} = require('../config/auth')

//Main Page Shopping List
//TODO DODAC OBSLUGE BLEDOW
//TODO: Change Way Of Creating Company Name 
router.get('/',ensureAuthenticated,async(req,res)=>{
    const cssSheets=[]
    let todayDate = new Date(),weekDate=new Date();
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']
    cssSheets.push('../../public/css/user/shopping_list/index.css',"https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css");
    let shoppingList =  ShoppingList.find({user:req.user.id}).populate('listName')
   
    if(req.query.visitAfter != null && req.query.visitAfter !='')
        shoppingList = shoppingList.gte('transactionDate',req.query.visitAfter);
    else
        shoppingList = shoppingList.find({transactionDate:{ $gt:todayDate}}).sort({transactionDate:'asc'})
    try{
       
        const brandName = await BrandName.find({user:req.user.id})
      
        todayDate.setDate(todayDate.getDate() - 1)
        weekDate.setDate(todayDate.getDate() + 8)
        const shoppingListShort = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).populate('listName').sort({transactionDate:'asc'})
       
        const shopping =  await shoppingList.sort({transactionDate:'asc'}).exec();
        res.render('shoppingList/index',{
            shoppingAll:shoppingListShort,
            shopping:shopping,
            brandName:brandName,
            styles:cssSheets,
            weekdays:weekdays,
            searchOptions:req.query,
        });
    }catch{
        res.redirect('/clients');
    }
    
})
//Add Shopping List Name
router.post('/', ensureAuthenticated,async(req,res)=>{
  
    const shoppingList = new ShoppingList({  
        listName:req.body.brand,
        listNameNew:req.body.newBrand,
        transactionDate:req.body.transactionDate,
        user:req.user.id
    })
    try{
        await shoppingList.save();
  
        res.redirect(`/shopping-list/list-view/${shoppingList.id}`)
    }catch(err){
        console.log(err)
        res.redirect(`/clients`)
    }
})
//List View Router
router.get('/list-view/:id',ensureAuthenticated,async(req,res)=>{
    const cssSheets =[]
    cssSheets.push('../../public/css/user/shopping_list/list-view.css',"https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css");
    try{
        const shoppingList = await ShoppingList.findById(req.params.id)
        .populate('listName')
        .exec();
        res.render('shoppingList/listView',{
            list:shoppingList,
            styles:cssSheets
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
        req.flash('type','success')
        await shoppingStatistics.save();
        await list.save();
 
        res.redirect(`/shopping-list/list-view/${list.id}`)
 

    }catch(err){
        const cssSheets =[]
        const shopping  = await ShoppingList.findById(req.params.id)
        const addedShoping = await ShoppingList.find({_id:shopping.id});
        req.flash('mess','Coś poszło nie tak.')
        req.flash('type','succesdangers')
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
              req.flash('type','success')
            }else{
                brand_name = await BrandName.findById(ObjectId(req.body.chackboxDeleteBrand));
                await  brand_name.remove();
                req.flash('mess','Nazwa firmy została usunięta');
                req.flash('type','success')
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
//Shoping list Create Brand Name
router.post('/brand-name',async(req,res)=>{
    const brandName = new BrandName({
        name:req.body.name,
        user:req.user.id
    })
    try{
       await brandName.save();
        req.flash('mess','Dodano nową listę zakupów do bazy.')
        req.flash('type','success')
        res.redirect('/shopping-list')
    }catch{
        req.flash('mess','Dodanie listy do bazy nie powiodło się')
        req.flash('type','danger')
        res.redirect('/clients')
    }
})


//Delete Shopping List Router
router.delete('/:id',ensureAuthenticated,async(req,res)=>{
        var list
    try{
   
        list = await ShoppingList.findById(req.params.id);
        await list.remove();
        req.flash('mess','Usunięto liste zakupów.')
        req.flash('type','success')
        
        res.redirect('/shopping-list');
    }catch(err){
        console.log(err)
        req.flash('mess','Nie udało się usunąć rekordu.')
        req.flash('type','danger')
        res.redirect(`/shopping-list`)   
    }
})
//Edit List Router
router.get('/list-view/:id/edit',ensureAuthenticated, async(req,res)=>{
    const cssSheets =[]

    try{
        const list = await ShoppingList.findById(req.params.id).populate('listName').exec();
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
        req.flash('type','success')
        await list.save();
  
        res.redirect(`/shopping-list/list-view/${list.id}`);

    }catch{
        req.flash('mess','Nie udało się zedytować listy.')
        req.flash('type','danger')
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