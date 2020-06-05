const express = require('express');
const router =express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const mailer  = require('../misc/mailer')
const emailLook = require('../misc/emailLayout')
const {ensureAuthenticated} = require('../config/auth')

//Show current options
router.get('/',ensureAuthenticated, async(req,res)=>{
    try{
        const user   = await User.findById(req.user.id);
        res.render('settings/index',{
            user:user
        });
    }catch(err){
        console.log(err)
        req.flash('created','Nie udało się otworzyć Ustawień');
        req.flash('success', 'danger');
        res.redirect('/calendar')
    } 
})
router.post('/changepassword', async(req,res)=>{
    let user
    try{
        user  = await User.findById(req.user.id);
        if(user != null &&req.body.newPassword == req.body.confirmNewPassword){
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
                 path: './views/public/logo2.JPG',
                 cid:'logo'
             })
            req.flash('error','Hasło zostało zmienione')
            req.flash('danger','success')
            res.redirect('/settings')
            return
        }else{
            req.flash('error','Hasła się różnią.')
            req.flash('danger','danger')
            res.render('settings/index',{
                user:user
            })
            return;
        }
        
    }catch(err){
        console.log(err)
        res.render('settings/index',{
            errorMessage:'Coś poszło nie tak.',
            type:'danger',
            user:user
        })
    }
})
router.post('/changeemail', async(req,res)=>{
    let user
    try{
        user = await User.findById(req.user.id);
        if(user != null && req.body.newEmail == req.body.confirmNewEmial){
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
                path: './views/public/logo2.JPG',
                cid:'logo'
            })
            req.flash('error','Email został zmieniony.')
            req.flash('danger','success')
            res.redirect('/settings')
        }else{
            req.flash('error',"Podano różne email'e")
            req.flash('danger','danger')
            res.render('settings/index',{
                user:user
            })
            return;
        }
    }catch(err){
        console.log(err)
        res.render('settings/index',{
            user:user,
            errorMessage:'Coś poszło nie tak.',
            type:'danger'
        })
    }
})

router.post('/changecompanyname', async(req,res)=>{
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
            path: './views/public/logo2.JPG',
            cid:'logo'
        })

        req.flash('error','Nazwa firmy została zmieniona')
        req.flash('danger','success')
        res.redirect('/settings')
    }catch{
        res.render('settings/index',{
            errorMessage:'Coś poszło nie tak.',
            type:'danger',
            user:user
        })
    }
})
/*router.put('/',(req,res)=>{
    res.send('Update Stings');
})*/

module.exports = router;