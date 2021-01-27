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
// TODO: Get Files to de lete 
const {ensureAuthenticated} = require('../config/auth')

//Show current options
router.get('/',ensureAuthenticated, async(req,res)=>{
    try{
        const cssSheets =[]
        cssSheets.push(" ../../public/css/user/settings/index.css");
        const user   = await User.findById(req.user.id);
        res.render('settings/index',{
            user:user,
            styles:cssSheets
        });
    }catch(err){
        console.log(err)
        req.flash('created','Nie udało się otworzyć Ustawień');
        req.flash('success', 'danger');
        res.redirect('/calendar')
    } 
})
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
            req.flash('error','Hasło zostało zmienione')
            req.flash('danger','success')
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
            req.flash('type','info-danger')
            res.redirect('/settings')
            return;
        }
    }catch(err){
        console.log(err)
        res.redirect('/settings')
    }
})

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


module.exports = router;