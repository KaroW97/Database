const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList')
const BrandName = require('../models/brandName')
const ListProducts = require('../models/listProducts')
const {ensureAuthenticated} = require('../config/auth')

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
            searchOptions:req.query  ,
            listProducts:listProducts 
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
    const shoppingList = new ShoppingList({
        listName:req.body.listName.trim(),
        transactionDate:req.body.transactionDate,
        user:req.user.id,
        brandName:req.body.brandName.trim(),
    })
    try{
        const brands = await BrandName.find({user:req.user.id,  name:req.body.brandName});
        await req.body.shoppingItem.split(',').forEach(async(item, index)=>{
            let split = item.toLowerCase().split('+')
            let name = split[0].trim()
            let price =  Number(split[1]) || 0
            let amount =  Number(split[2]) || 0
            const items = await ListProducts.find({user:req.user.id , name:name});
            shoppingList.productListInfo.push({
                name:name,
                price:price ,
                amount:amount, 
            })
            shoppingList.totalPrice = shoppingList.totalPrice +   (price * amount)
            if(items.length === 0){
                const listProducts = new ListProducts({
                    user:req.user.id,
                    name: name || 'brak nazwy',
                    productInfo:[{
                        date:req.body.transactionDate,
                        price:price,
                        amount:amount,
                    }],
                })
                await listProducts.save()
            }else{
                items[0].productInfo.push({
                    date:req.body.transactionDate,
                    price:price ,
                    amount:amount,
                })
                await items[0].save()
            }
            if(req.body.shoppingItem.split(',').length-1 == index ) 
                await shoppingList.save();         
        })
        if(brands.length === 0){
            const brandName = new BrandName({
                user:req.user.id,
                name:req.body.brandName.trim(),
            })
            await brandName.save()
        }
        req.flash('mess','Lista została dodana.')
        req.flash('type','info-success')
        res.redirect(`/shopping-list`)
    }catch(err){
        console.log(err)
        res.redirect(`/clients`)
    }
})
/*
* List View Router
*/
router.get('/list-view/:id',ensureAuthenticated,async(req,res)=>{
    try{
        const shoppingList = await ShoppingList.findById(req.params.id)
        const listProducts = await ListProducts.find({user:req.user.id})
        res.render('shoppingList/listView',{
            list:shoppingList,
            listProducts:listProducts 
        })
    }catch{
        res.redirect('/shopping-list');
    }
})
/*
* Delete Shopping List Router
*/
router.delete('/:id',ensureAuthenticated,async(req,res)=>{
        var list
    try{
   
        list = await ShoppingList.findById(req.params.id);
        await list.deleteOne();
        req.flash('mess','Usunięto liste zakupów.')
        req.flash('type','info-success')
        
        res.redirect('/shopping-list');
    }catch(err){
        console.log(err)
        req.flash('mess','Nie udało się usunąć rekordu.')
        req.flash('type','info-alert')
        res.redirect(`/shopping-list`)   
    }
})
/*
* Add new item to the list
*/
router.put('/list-view/add-post/:id',ensureAuthenticated, async(req,res)=>{
    let list
    try{
        let shoppingItems = req.body.shoppingItem.split(',')
        list = await ShoppingList.findById(req.params.id)
        shoppingItems.forEach(async(item, index) =>{
            let split = item.toLowerCase().split('+')
            let name = split[0].trim()
            let price = Number(split[1]) || 0
            let amount =  Number(split[2]) ||0
            const items = await ListProducts.find({user:req.user.id , name:name});

            list.totalPrice += price * amount
            list.productListInfo.push({
                name:name,
                price:price,
                amount:amount
            })
            if(items.length === 0){
                const listProducts = new ListProducts({
                    user:req.user.id,
                    name: name,
                    productInfo:[{
                        date:list.transactionDate.toISOString().split('T')[0],
                        price:price,
                        amount:amount,
                    }],
                })
                await listProducts.save()
            }else{
                items[0].productInfo.push({
                    date:list.transactionDate.toISOString().split('T')[0],
                    price:price ,
                    amount:amount,
                })
                await items[0].save()
            }
            if(req.body.shoppingItem.split(',').length-1 === index ) 
                await list.save();   
        })

        req.flash('mess','Produkt został dodany do listy.')
        req.flash('type','info-success')
        res.redirect(`/shopping-list/list-view/${list.id}`);

    }catch{
        console.log(err)
        req.flash('mess','Nie udało się dodać elementu do listy.')
        req.flash('type','info-alert')
        res.redirect(`/shopping-list`);
    }
  
})
/*
* Update info abotu list such as company, list name and date if realization
*/
router.put('/list-view/edit-list-info/:id', ensureAuthenticated, async(req,res)=>{
    let list 
    try{
        list =  await ShoppingList.findById(req.params.id);
        list.listName = req.body.listName.trim()
        list.transactionDate = new Date(req.body.transactionDate) || ''
        list.brandName =  req.body.brandName.trim()

        await list.save()
        req.flash('mess','Edytowano liste.')
        req.flash('type','info-success')
        res.redirect(`/shopping-list/list-view/${req.params.id}`)

    }catch(err){
        console.log(err)
        req.flash('mess','Nie udało sie edytować listy.')
        req.flash('type','info-alert')
        res.redirect(`/shopping-list/list-view/${req.params.id}`)
    }
})
/*
* Update existing item on the list 
*/
router.put('/list-view/:id/:itemIndex',ensureAuthenticated,async(req,res)=>{
    let list;
    try{
        list =  await ShoppingList.findById(req.params.id);
        list.markModified('productListInfo');

        let beforeEdit = list.productListInfo[req.params.itemIndex]
        list.totalPrice -= beforeEdit.price * beforeEdit.amount
  
        list.productListInfo[req.params.itemIndex] = {
            name:req.body.itemName.trim(),
            price:Number(req.body.itemPrice) || 0,
            amount:Number(req.body.itemAmount) || 0
        }
        let afterEdit =  list.productListInfo[req.params.itemIndex]
        list.totalPrice += afterEdit.price * afterEdit.amount
        

        const list_products_before = await ListProducts.find({user:req.user.id, name:beforeEdit.name})
        if(beforeEdit.name != afterEdit.name){
            const list_products = await ListProducts.find({user:req.user.id, name:afterEdit.name})
            let index  =list_products_before[0].productInfo.findIndex(item=>{
                if(item.date === list.transactionDate.toISOString().split('T')[0] && beforeEdit.price === item.price && beforeEdit.amount === item.amount)
                    return item
            }) 
        
            list_products_before[0].productInfo = [
                ...list_products_before[0].productInfo.splice(0, index),
                ...list_products_before[0].productInfo.splice(index + 1)
            ]
            list_products_before[0].productInfo.length === 0 ? 
                await list_products_before[0].deleteOne() : 
                await list_products_before[0].save()
            
            if(list_products.length != 0){
                list_products[0].productInfo.push({
                    date:list.transactionDate.toISOString().split('T')[0],
                    price:Number(req.body.itemPrice) || 0,
                    amount:Number(req.body.itemAmount) || 0
                })     
                await list_products[0].save()  
            }else{
                const new_list_item = new ListProducts({
                    user:req.user.id,
                    name: afterEdit.name.trim(),
                    productInfo:[{
                        date:list.transactionDate.toISOString().split('T')[0],
                        price:afterEdit.price,
                        amount:afterEdit.amount,
                    }],
                })
                await new_list_item.save()
            }
        }else{
            list_products_before[0].markModified('productInfo');
            let index  =list_products_before[0].productInfo.findIndex(item=>{
                if(item.date === list.transactionDate.toISOString().split('T')[0] && beforeEdit.price === item.price && beforeEdit.amount === item.amount)
                    return item
            })

                list_products_before[0].productInfo[index] = {
                    date:list.transactionDate.toISOString().split('T')[0],
                    price:Number(req.body.itemPrice) || 0,
                    amount:Number(req.body.itemAmount) || 0
                }
            
         
            await list_products_before[0].save()
        }
        list.set('productListInfo', list.productListInfo)
        await list.save();

        req.flash('mess','Dodano element do listy.')
        req.flash('type','info-success')
        res.redirect(`/shopping-list/list-view/${req.params.id}`)
    }catch(err){
        console.log(err)
        req.flash('mess','Coś poszło nie tak.')
        req.flash('type','info-alert')
        res.redirect(`/shopping-list/list-view/${req.params.id}`)
    }
})
/*
* Delete List Item
*/
router.delete('/list-view/:id/:item',ensureAuthenticated, async(req,res)=>{
    let list, statsListProducts
    try{    
        let split = req.params.item.toLowerCase().split('+')
        let name = split[0].trim()
        let price = Number(split[1])
        let amount = Number(split[2])
       
        list = await ShoppingList.findById(req.params.id);
        statsListProducts = await ListProducts.find({user:req.user.id,name:name })
   
        let indexStatsList = statsListProducts[0].productInfo.findIndex(item =>{
            if(item.date === list.transactionDate.toISOString().split('T')[0] && item.price === price && item.amount === amount)
                return item
        })
        let indexList = list.productListInfo.findIndex(item=>{
            if(item.name === name && item.price === price && item.amount === amount)
                return item
        })
        list.totalPrice -= (list.productListInfo[indexList].price * list.productListInfo[indexList].amount)
        statsListProducts[0].productInfo = [
            ...statsListProducts[0].productInfo.splice(0,indexStatsList),
            ...statsListProducts[0].productInfo.splice(indexStatsList + 1)
        ]
        let newList = list.productListInfo.filter((item, index)=>{
            if(index != indexList)
                return item
        })

        if(statsListProducts[0].productInfo.length != 0)
            await statsListProducts[0].save()
        else
            await statsListProducts[0].deleteOne()
        await list.set('productListInfo',newList).save();

        req.flash('mess','Element został usunięty z listy.')
        req.flash('type','info-success') 
        res.redirect(`/shopping-list/list-view/${list.id}`);   
    }catch(err){
        console.log(err)
        req.flash('mess','Nie udało sie usunąć elementu.')
        req.flash('type','info-alert')
        res.redirect('/shopping-list')
    }
})
/*
* Get data about one item from the list 
*/
router.get('/list-view/:id/:itemIndex', async(req,res)=>{
    let list
    try{
        list = await ShoppingList.findById(req.params.id)
        res.send(list.productListInfo[req.params.itemIndex])
    }catch{
        req.flash('mess','Nie udało sie usunąć elementu.')
        req.flash('type','info-alert')
    }
})


module.exports = router