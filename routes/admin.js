const express = require('express');
const router = express.Router();
const User = require('../models/user')
const {ensureAuthenticated} = require('../config/auth')
const bcrypt = require('bcryptjs')
const mailer  = require('../misc/mailer')
const emailLook = require('../misc/emailLayout')
////////////////////////////////////////////////////////////////

const {adminDeleteUsers} = require('../config/authentication')
router.get('/',ensureAuthenticated, async(req, res) => {
    try{
        let user =await User.find({role:'user'});
        if(req.user.isAdmin())
            res.render('admin/index', {
                layout: "layouts/layoutAdmin",
                user: user
            })
        else{
            req.logOut();
            res.sendStatus(403)
        }
          
    }catch(err){
        console.log(err)
        res.render('admin/login')
    }
})
//Delete admin
router.delete('/',ensureAuthenticated,async(req,res)=>{
    try{
        if(req.body.chackboxDelet!= null ){
            if(Array.isArray(req.body.chackboxDelet)){

              for(var i = 0; i < (req.body.chackboxDelet).length; i++)
                await adminDeleteUsers(req.body.chackboxDelet[i],req)
       
              req.flash('mess','Udało się usunąć użytkowników')
              req.flash('type','success') 
             
            }else{
                await adminDeleteUsers(req.body.chackboxDelet,req)
                req.flash('mess','Udało się usunąć użytkownika')
                req.flash('type','success') 
            }
          }else{
            req.flash('mess','Nie wybrano Użytkowników do usunięcia')
            req.flash('type','info') 
          }
          res.redirect('/admin') 
    }catch(err){
        console.log(err);
        req.flash('mess','Nie udało się usunąć klienta')
        req.flash('type','danger') 
        res.redirect('/admin')       
    }
  
})

router.get('/settings',ensureAuthenticated,async (req,res)=>{
    try{
        let admin = await User.findById(req.user.id)
        res.render('admin/settings',{
            layout: "layouts/layoutAdmin",
            admin:admin
        })
    }catch(err){
        console.log(err);
        res.redirect('/admin');
    }
})

router.put('/settings/change-password', async(req, res)=>{
    let admin;
    try{
         admin = await User.findById(req.user.id)
        if(req.body.newPassword == ''|| req.body.confirmNewPassword == ''){

            req.flash('error','Wypełnij wszystkie pola ')
            req.flash('danger','info')
            res.redirect('/admin/settings')
            return
        }
        else if(req.body.newPassword.length < 3 || req.body.confirmNewPassword.length < 3){
            req.flash('error','Hasło musi mieć przynajmniej 3 znaki')
            req.flash('danger','danger')
            res.redirect('/admin/settings')
            return
        }
       else if( req.body.newPassword == req.body.confirmNewPassword ) {
            const hashedPassword = await bcrypt.hash( req.body.newPassword,10)
            admin.password = hashedPassword
            let email= emailLook(``,
            'Witaj!',
            `Twoje hasło Administratora powiązane z mailem`,`${admin.email} ` 
            ,  `zostało zmienione `,
            'Miłego dnia!'
        )
        await admin.save();
        await mailer.sendEmail('beautybasehelp@gmail.com',admin.email,'Zmieniono hasło Beauty Base!',email,
         {
             file:'logo2.JPG',
             path: './public/logo2.JPG',
             cid:'logo'
         })
        req.flash('error','Hasło zostało zmienione')
        req.flash('danger','success')
        res.redirect('/admin/settings')
        return
        } 
        else{
            req.flash('error','Hasła się różnią.')
            req.flash('danger','danger')
            res.render('admin/settings',{
                layout: "layouts/layoutAdmin",
                admin:admin
            })
            return;
        }


    }catch(err){
        console.log(err)
        res.redirect('/admin/settings')
    }
})

router.put('/settings/change-email',async (req, res)=>{
    let admin
    try{
        admin = await User.findById(req.user.id);
        if( req.body.newEmail=='' ||req.body.confirmNewEmail==''){
            req.flash('error','Wypełnij wszystkie pola potrzebne do zmiany hasła')
            req.flash('danger','info')
            res.redirect('/admin/settings')
        }
        else if(admin != null && req.body.newEmail == req.body.confirmNewEmail){
            let oldEmial = admin.email;
            admin.email = req.body.newEmail
            await admin.save();
            let email= emailLook(``,
                'Witaj!',
                `Email Administratora ${oldEmial} został  zmieniony na`,`${admin.email}.` 
                ,  ` `,
                'Miłego dnia!'
            )
            await admin.save();
            await mailer.sendEmail('beautybasehelp@gmail.com',admin.email,'Zmieniono email Beauty Base!',email,
            {
                file:'logo2.JPG',
                path: './public/logo2.JPG',
                cid:'logo'
            })
            req.flash('error','Email został zmieniony.')
            req.flash('danger','success')
            res.redirect('/admin/settings')
        }else{
            req.flash('error',"Podano różne email'e")
            req.flash('danger','danger')
            res.render('admin/settings',{
                layout: "layouts/layoutAdmin",
                admin:admin
            })
            return;
        }
    }catch(err){
        console.log(err)
        let admin = await User.findById(req.user.id);
        res.render('admin/settings',{
            layout: "layouts/layoutAdmin",
            admin:admin
        })
    }
})
module.exports = router