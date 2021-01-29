const express = require('express');
const router = express.Router();
const User = require('../models/user')
const {ensureAuthenticatedAdmin} = require('../config/auth')
const bcrypt = require('bcryptjs')
const mailer  = require('../misc/mailer')
const emailLook = require('../misc/emailLayout')

const ObjectId = require('mongodb').ObjectId;
const Client = require('../models/clients');
const ClientsShoppingsStats = require('../models/clientsShoppingsStats')
const ShoppingList = require('../models/shoppingList')
const BrandName = require('../models/brandName')
const Treatment = require('../models/treatment')
const FutureVisit = require('../models/clientFutureVisit')
const ClientVisits = require('../models/clientsVisits')
const ListProducts = require('../models/listProducts')
const ProductsForTreatment = require('../models/treatmentProducts')

/*
 * Admin panel page
*/
router.get('/',ensureAuthenticatedAdmin, async(req, res) => {
    try{
        let user =await User.find({role:'user'});
        if(req.user.isAdmin())
            res.render('admin/index', {
                layout: "layouts/layoutAdmin",
                user: user,
            })
        else{
            req.logOut();
            res.sendStatus(403)
        }
          
    }catch(err){
        console.log(err)
        res.render('admin/login',{styles:cssSheets})
    }
})
/*
 * Delete user
*/
router.delete('/:id',ensureAuthenticatedAdmin,async(req,res)=>{
    try{
        let user = await User.findById(req.params.id);
        let clients = await Client.find({user:req.params.id}); 
        let companyShopping = await ClientsShoppingsStats.find({user:req.params.id}); 
        let shoppingList = await ShoppingList.find({user:req.params.id}); 
        let brandName = await BrandName.find({user:req.params.id}); 
        let treatments = await Treatment.find({user:req.params.id}); 
        let futureVisit = await FutureVisit.find({user:req.params.id}); 
        let clientVisits = await ClientVisits.find({user:req.params.id});
        let listProducts = await ListProducts.find({user:req.params.id});
        let productsForTreatment = await ProductsForTreatment.find({user:req.params.id});

        for (let client of clients) await client.deleteOne()
        for (let list of shoppingList)  await list.deleteOne()
        for (let brand of brandName) await brand.deleteOne()
        for (let clientVisit of clientVisits)   await clientVisit.deleteOne()
        for (let visit of futureVisit)  await visit.deleteOne()
        for (let shopping of companyShopping)   await shopping.deleteOne()
        for (let treatment of treatments)   await treatment.deleteOne()
        for (let listProduct of listProducts) await listProduct.deleteOne()
        for (let product of productsForTreatment) await product.deleteOne()

        await req.app.locals.gfs.files.find({'metadata.user':ObjectId(req.user.id)}).toArray( (err, files)=> {
            if (err) throw err
            for(var file of files){
            
                req.app.locals.gfs.remove({_id:ObjectId(file._id),root:'uploads'}, function (err, gridStore) {
                    if (err)  throw(err);
                
                });
            }       
        })

          req.flash('mess','Konto użytkownika zostało usunięte')
          req.flash('type','info-success')
          await user.deleteOne();
          res.redirect('/admin') 
    }catch(err){
        console.log(err);
        req.flash('mess','Nie udało się usunąć klienta')
        req.flash('type','info-alert') 
        res.redirect('/admin')       
    }
  
})
module.exports = router