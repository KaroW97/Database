const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/user')
const randomstring=require('randomstring');  //Emeil confirmation 
const {ensureAuthenticated} = require('../config/auth')

const emailLook = require('../misc/emailLayout')
const mailer  = require('../misc/mailer')

//Passport Config
router.get('/',async (req, res)=>{
    try{ 
        res.render('users/index')
    }catch{
        res.render('users/index')
    }
 
})
//Registration Page
router.get('/registration',async (req, res)=>{
    try{ 
        res.render('users/register')
    }catch(err){
        res.render('users/register',{
            errorMessage:'Coś poszło nie tak',
            type:'danger',
        })
    }
 
})
//Register Form
router.post('/registration',async(req,res)=>{
   
    try{
        const findUser = await User.findOne({email:req.body.email})
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        if(!req.body.email || !req.body.companyName || !req.body.password || !req.body.ConfirmPassword){
            req.flash('logged', 'Prosze uzupełnij wszystkie pola');
            req.flash('success', 'danger')
        }
        //Check Password
        if(req.body.password !=req.body.ConfirmPassword){
            req.flash('logged', 'Wprowadzono różne hasła');
            req.flash('success', 'danger')
        }
        //Check password lenght
        if(req.body.password.length < 3){
            req.flash('logged', 'Hasło powinno zawierac 3 znaków');
            req.flash('success', 'danger')
        }
        if(findUser){
           req.flash('logged', 'Email istnieje w bazie danych');
            req.flash('success', 'danger')
        }
        if(findUser || req.body.password.length < 3 || req.body.password !=req.body.ConfirmPassword){
            res.render('users/register')
            return;
        }
        else {
               //Flag account inactive
            const secretToken =randomstring.generate();  //email verify
            var newUser = new User({
                companyName:req.body.companyName,
                email:req.body.email,
                password:hashedPassword,
                secretToken:secretToken,
                active:false
            })
           await newUser.save();
           let email= emailLook(secretToken,'Dziękujemy za rejestrację', 
           'Proszę zweryfikuj swoje konto za pomocą kodu:',
           'Na stronie:',
           'https://beauty-base.herokuapp.com/verify',
           'Miłego dnia!'
           )
            //send mailer
           await mailer.sendEmail('beautybasehelp@gmail.com',req.body.email,'Zweryfikuj swoje konto Beauty Base!',email,
            {
                file:'logo2.JPG',
                path: './views/public/logo2.JPG',
                cid:'logo'
            })
           req.flash('logged', 'Sprawdź swój email!');
           req.flash('success', 'success')
           res.redirect('/login')
        }
       
    }catch(err){
        res.render('users/register',{
            errorMessage:'Spróbuj ponownie',
            type:'danger'
        })
    }  
})
//Email send
//Verify Registration
router.get('/verify',async(req,res)=>{
    try{
        res.render('users/verify');
    }catch{
        res.redirect('/')
    }
})
router.put('/verify',async(req,res)=>{
    let user
    try{
        const secretTokenn = req.body.secretToken
        user = await User.findOne({secretToken:secretTokenn})
       
        if(!user){
            req.flash('error','Nie znaleziono takiego użytkownika.')
            req.flash('danger','danger');
            res.redirect('/verify');
            return;
        }
        user.active = true;
        user.secretToken = '';
      
        await user.save();
        req.flash('succesRegister','Teraz możesz się zarejestrować');
        req.flash('succes','succes');
        res.redirect('/login')
    }catch{
        res.redirect('/')
    }
})
//Front Page
router.get('/login',async (req, res)=>{
    try{
        res.render('users/login')
    }catch{
        res.render('users/login')
    }
 
})
// Login Process
router.post('/login', function(req, res, next){
    if(req.body.email=='' || req.body.password ==''){
        req.flash('error','Uzupełnij wszystkie pola')
        res.render('users/login')
      }else{
        passport.authenticate('local',{
            successRedirect:'/calendar',
            failureRedirect:'/login',
            failureFlash:true
        })(req,res,next)
      }
})
//Logut
router.get('/logout',ensureAuthenticated, (req,res)=>{
    req.logOut();
    req.flash('logged', 'Do zobaczenia!');
    req.flash('success', 'success')
    res.redirect('/')
})
//Reset Email Password
router.get('/forgot' ,async(req,res)=>{
    try{
        res.render('users/forgot')
    }catch{
        res.render('users/forgot',{
            type:'danger',
            errorMessage: 'Coś poszło nie tak '
        })
    }
})
router.post('/forgot',async(req,res)=>{
    let searchUser
    try{
        searchUser = await User.findOne({email:req.body.forgotPassword})
        if(searchUser!=null && searchUser!=''){
            const secretTokenn =randomstring.generate();
           
            let email= emailLook(secretTokenn,
                'Witaj!',
                `Otrzymaliśmy prośbę dotyczącą zresetowania Twojego hasła Beauty Base.
                Wprowadź następujący kod resetowania hasła:`,` Na stronie: ` 
                ,'https://beauty-base.herokuapp.com/changepassword',
                'Miłego dnia!'
            )
            searchUser.secretToken = secretTokenn
            searchUser.active = false;
            //send mailer
           await searchUser.save();
           await mailer.sendEmail('beautybasehelp@gmail.com',req.body.forgotPassword,'Zmień hasło Beauty Base!',email,
            {
                file:'logo2.JPG',
                path: './views/public/logo2.JPG',
                cid:'logo'
            })
           
           
            req.flash('success','success')
            req.flash('logged','Sprawdź swoją skrzynkę email.')
            res.redirect('/login')
        }else{
            res.render('users/forgot',{
                type:'danger',
                errorMessage:'Nie znaleźliśmy twojego emaila w bazie danych. Spróbuj jeszcze raz.'
            })
        }
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
})
//Reset Password Verification
router.get('/changePassword' ,async(req,res)=>{
    try{
        res.render('users/changePassword')
    }catch{
        res.render('users/changePassword',{
            type:'danger',
            errorMessage: 'Coś poszło nie tak '
        })
    }
  
})
router.post('/changePassword' ,async(req,res)=>{
    let searchUser
    try{
        searchUser  = await User.findOne({secretToken:req.body.secretToken})
        if(searchUser!=null && searchUser!='' && req.body.password == req.body.passwordConfirm){
            const hashedPassword = await bcrypt.hash(req.body.password,10)
            searchUser.password = hashedPassword
            searchUser.secretToken ='';
            searchUser.active = true;
            await searchUser.save();
            req.flash('success','success');
            req.flash('logged', 'Zmieniono hasło możesz się zalogować!')
            res.redirect('/login')
        }else if(req.body.password != req.body.passwordConfirm){
            res.render('users/changePassword',{
                type:'danger',
                errorMessage: 'Wprowadź takie same hasła.'
            })
        }else{
            res.render('users/changePassword',{
                type:'danger',
                errorMessage: 'Błędny token'
            })
        }
    }catch(err){
        console.log(err)
        res.render('users/changePassword',{
            type:'danger',
            errorMessage: 'Coś poszło nie tak'
        })
    }
})
/////////Change Password If Token is Correct

module.exports = router;