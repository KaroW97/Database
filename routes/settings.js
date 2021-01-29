const express = require('express');
const router =express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const mailer  = require('../misc/mailer')
const emailLook = require('../misc/emailLayout')
////////////////////////////////////////////////////////////////
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
const {ensureAuthenticated} = require('../config/auth')

/*
 * Show options
*/
router.get('/',ensureAuthenticated, async(req,res)=>{
    try{

        const user   = await User.findById(req.user.id);
        const brandName = await BrandName.find({user:req.user.id})
        const listProducts = await ListProducts.find({user:req.user.id})
        const productsForTreatment = await ProductsForTreatment.find({user:req.user.id})
        res.render('settings/index',{
            user:user,
            brandName:brandName,
            listProducts:listProducts,
            productsForTreatment:productsForTreatment
        });
    }catch(err){
        console.log(err)
        req.flash('mess','Nie udało się otworzyć Ustawień');
        req.flash('type', 'info-alert');
        res.redirect('/calendar')
    } 
})
/*
 * Change password request
*/
router.put('/change-password',ensureAuthenticated, async(req,res)=>{
    let user
    try{
        user  = await User.findById(req.user.id);
        if(req.body.newPassword == ''|| req.body.confirmNewPassword == ''){

            req.flash('mess','Wypełnij wszystkie pola ')
            req.flash('type','info-alert')
            res.redirect('/settings')
            return
        }
        else if(req.body.newPassword.length < 3 || req.body.confirmNewPassword.length < 3){
            req.flash('mess','Hasło musi mieć przynajmniej 3 znaki')
            req.flash('type','info-alert')
            res.redirect('/settings')
            return
        }
        else if(user != null &&req.body.newPassword == req.body.confirmNewPassword){
            let hashed = await bcrypt.hash(req.body.newPassword,10)
            user.password = hashed;
           
            //(secretToken='', header='',paragrafFirst='',paragrafTh='', link='', footer='')
            let email= emailLook(``,
                'Witaj!',
                `Twoje hasło Beauty Base powiązane z kontem`,`${user.email} ` 
                ,  `zostało zmienione `,
                'Miłego dnia!'
            )
            await user.save();
            await mailer.sendEmail('beautybasehelp@gmail.com',user.email,'Zmieniono hasło Beauty Base!',email,
             {
                 file:'logo2.JPG',
                 path: './public/logo2.JPG',
                 cid:'logo'
             })
            req.flash('mess','Hasło zostało zmienione')
            req.flash('type','info-success')
            res.redirect('/settings')
            return
        }else{
         

            req.flash('mess','Hasła się różnią.')
            req.flash('type','info-alert')
            res.redirect('/settings')
        
            return;
        }
        
    }catch(err){
        console.log(err)
        req.flash('mess','Hasła się różnią.')
        req.flash('type','info-alert')
        res.redirect('/settings')
    }
})
/*
 * Change email request
*/
router.put('/change-email',ensureAuthenticated, async(req,res)=>{
    let user
    try{
        user = await User.findById(req.user.id);
        if( req.body.newEmail=='' ||req.body.confirmNewEmail==''){
            req.flash('mess','Wypełnij wszystkie pola potrzebne do zmiany hasła')
            req.flash('type','info-alert')
            res.redirect('/settings')
        }
        else if(user != null && req.body.newEmail == req.body.confirmNewEmail){
            let oldEmial = user.email;
            user.email = req.body.newEmail
            await user.save();
            let email= emailLook(``,
                'Witaj!',
                `Twoj email ${oldEmial} został  zmieniony na`,`${user.email}.` 
                ,  ` `,
                'Miłego dnia!'
            )
            await user.save();
            await mailer.sendEmail('beautybasehelp@gmail.com',user.email,'Zmieniono email Beauty Base!',email,
            {
                file:'logo2.JPG',
                path: './public/logo2.JPG',
                cid:'logo'
            })
            req.flash('mess','Email został zmieniony.')
            req.flash('type','info-success')
            res.redirect('/settings')
        }else{
           

            req.flash('mess',"Podano różne email'e")
            req.flash('type','info-alert')
            res.redirect('/settings')
            return;
        }
    }catch(err){
        console.log(err)
        res.redirect('/settings')
    }
})
/*
 * Change company name request
*/
router.put('/change-company-name',ensureAuthenticated, async(req,res)=>{
    let user
    try{
        user  = await User.findById(req.user.id);
        user.companyName = req.body.newCompanyName;
        await user.save();
        let email= emailLook(``,
        'Witaj!',
        `Nazwa twojej firmy została zmieniona na`,`"${user.companyName}"` 
        ,  ``,
        'Miłego dnia!'
        )
    
        await mailer.sendEmail('beautybasehelp@gmail.com',user.email,'Zmieniono nazwe firmy Beauty Base!',email,
        {
            file:'logo2.JPG',
            path: './public/logo2.JPG',
            cid:'logo'
        })

        req.flash('mess','Nazwa firmy została zmieniona')
        req.flash('type','info-success')
        res.redirect('/settings')
    }catch{
        res.redirect('/settings')
    }
})
/*
 * delete account request
*/
router.delete('/delete-account',ensureAuthenticated, async(req,res)=>{
    try {
        let user = await User.findById(req.user.id);
        let clients = await Client.find({user:req.user.id}); 
        let companyShopping = await ClientsShoppingsStats.find({user:req.user.id}); 
        let shoppingList = await ShoppingList.find({user:req.user.id}); 
        let brandName = await BrandName.find({user:req.user.id}); 
        let treatments = await Treatment.find({user:req.user.id}); 
        let futureVisit = await FutureVisit.find({user:req.user.id}); 
        let clientVisits = await ClientVisits.find({user:req.user.id});
        let listProducts = await ListProducts.find({user:req.user.id});
        let productsForTreatment = await ProductsForTreatment.find({user:req.user.id});

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
        req.flash('type','info')
        await user.deleteOne();
        res.redirect('/login'); //TODO: Redirect on Main Page Maybe
    }catch(err){
        console.log(err)
        res.redirect('/settings');
    }
})
/*
 * Delete brands request
*/
router.delete('/brand-name-delete',async(req,res)=>{
    let brand_id ;
    if(typeof(req.body.selectedBrand) === "string")
        brand_id = req.body.selectedBrand.split(' ')
    else
        brand_id = req.body.selectedBrand
  
    try{
        brand_id.forEach(async(item)=>{
            let brand = await BrandName.findById(item)
            if(brand)
                await brand.deleteOne();
        })
        if(brand_id.length > 1)
            req.flash('mess','Nazway firm zostały usunięte')
        else
            req.flash('mess','Nazwa firmy została usunięta')
        req.flash('type','info-success')
        res.redirect('/settings')
    }catch(err){
        req.flash('mess','Coś poszło nie tak, spróbuj jeszcze raz.')
        req.flash('type','info-alert')
        res.redirect('/settings')
    }

})
/*
 * Delete products request
*/
router.delete('/delete-product',async(req,res)=>{
    let products_id ;
    if(typeof(req.body.selectedProduct) === "string")
        products_id = req.body.selectedProduct.split(' ')
    else
        products_id = req.body.selectedProduct
  
    try{
        products_id.forEach(async(item)=>{
            let product = await ListProducts.findById(item)
            if(product)
                await product.deleteOne();
        })
        if(products_id.length > 1)
            req.flash('mess','Nazway produktów zostały usunięte')
        else
            req.flash('mess','Nazwa produktu została usunięta')
        req.flash('type','info-success')
        res.redirect('/settings')
    }catch(err){
        req.flash('mess','Coś poszło nie tak, spróbuj jeszcze raz.')
        req.flash('type','info-alert')
        res.redirect('/settings')
    }

})
/*
 * Delete products needed for the treatments
*/
router.delete('/delete-product-for-treatments',async(req,res)=>{
    let productsForTreatment_id ;
    if(typeof(req.body.selectedProductForTreatment) === "string")
        productsForTreatment_id = req.body.selectedProductForTreatment.split(' ')
    else
        productsForTreatment_id = req.body.selectedProductForTreatment
    try{
        productsForTreatment_id.forEach(async(item)=>{
            let productsForTreatment = await ProductsForTreatment.findById(item)
            if(productsForTreatment)
                await productsForTreatment.deleteOne();
        })
        if(productsForTreatment_id.length > 1)
            req.flash('mess','Nazway produktów zostały usunięte')
        else
            req.flash('mess','Nazwa produktu została usunięta')
        req.flash('type','info-success')
        res.redirect('/settings')
    }catch(err){
        req.flash('mess','Coś poszło nie tak, spróbuj jeszcze raz.')
        req.flash('type','info-alert')
       
        res.redirect('/settings')
    }

})
module.exports = router;