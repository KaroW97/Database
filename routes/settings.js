const express = require('express');
const router =express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const mailer  = require('../misc/mailer')
const emailLook = require('../misc/emailLayout')
////////////////////////////////////////////////////////////////
const ObjectId = require('mongodb').ObjectId;
const Client = require('../models/clients');
const CompanyShopping = require('../models/companyShoppingStats')
const ShoppingList = require('../models/shoppingList')
const BrandName = require('../models/brandName')
const Treatment = require('../models/treatment')
const FutureVisit = require('../models/clientFutureVisit')
const ClientVisits = require('../models/clientsVisits')
// TODO: Get Files to delete 
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

            req.flash('error','Wypełnij wszystkie pola ')
            req.flash('danger','info')
            res.redirect('/settings')
            return
        }
        else if(req.body.newPassword.length < 3 || req.body.confirmNewPassword.length < 3){
            req.flash('error','Hasło musi mieć przynajmniej 3 znaki')
            req.flash('danger','danger')
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
            const cssSheets =[]

            req.flash('error','Hasła się różnią.')
            req.flash('danger','danger')
            res.render('settings/index',{
                styles:cssSheets
            })
            return;
        }
        
    }catch(err){
        console.log(err)
        const cssSheets =[]

        res.render('settings/index',{
            errorMessage:'Coś poszło nie tak.',
            type:'danger',
            styles:cssSheets
        })
    }
})
router.put('/change-email',ensureAuthenticated, async(req,res)=>{
    let user
    try{
        user = await User.findById(req.user.id);
        if( req.body.newEmail=='' ||req.body.confirmNewEmail==''){
            req.flash('error','Wypełnij wszystkie pola potrzebne do zmiany hasła')
            req.flash('danger','info')
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
            req.flash('error','Email został zmieniony.')
            req.flash('danger','success')
            res.redirect('/settings')
        }else{
            const cssSheets =[]

            req.flash('error',"Podano różne email'e")
            req.flash('danger','danger')
            res.render('settings/index',{
                styles:cssSheets
            })
            return;
        }
    }catch(err){
        console.log(err)
        const cssSheets =[]

        res.render('settings/index',{
          
            styles:cssSheets
        })
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

        req.flash('error','Nazwa firmy została zmieniona')
        req.flash('danger','success')
        res.redirect('/settings')
    }catch{
        const cssSheets =[]

        res.render('settings/index',{
        
            styles:cssSheets
           
        })
    }
})
router.delete('/delete-account',ensureAuthenticated, async(req,res)=>{
    try {
        let user = await User.findById(req.user.id);
        let clients = await Client.find({user:req.user.id});
        let companyShopping = await CompanyShopping.find({user:req.user.id});
        let shoppingList = await ShoppingList.find({user:req.user.id});
        let brandName = await BrandName.find({user:req.user.id});
        let treatments = await Treatment.find({user:req.user.id});
        let futureVisit = await FutureVisit.find({user:req.user.id});
        let clientVisits = await ClientVisits.find({user:req.user.id});
      
        for (let client of clients)
            await client.remove()
            
        for (let list of shoppingList)
            await list.remove()

        for (let brand of brandName)
            await brand.remove()

        for (let clientVisit of clientVisits)
            await clientVisit.remove()

        for (let visit of futureVisit)
            await visit.remove()

        for (let shopping of companyShopping)
            await shopping.remove()

        for (let treatment of treatments)
            await treatment.remove()

        await req.app.locals.gfs.files.find({'metadata.user':ObjectId(req.user.id)}).toArray( (err, files)=> {
            if (err) throw err
            for(var file of files){
            
                req.app.locals.gfs.remove({_id:ObjectId(file._id),root:'uploads'}, function (err, gridStore) {
                    if (err)  throw(err);
                
                });
            }       
        })
    
        req.flash('logged','Konto użytkownika zostało usunięte')
        await user.remove();
        res.redirect('/login'); //TODO: Redirect on Main Page Maybe
    }catch(err){
        console.log(err)
        res.redirect('/settings');
    }
})


module.exports = router;