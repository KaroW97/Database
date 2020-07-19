const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/user')
const {ensureAuthenticated} = require('../config/auth')

const {  
     userVerify, 
    userRegistry,
    userChangePassword,
    changePassword
} = require('../config/authentication')
//Regular User
//Passport Config
router.get('/',async (req, res)=>{
    let cssSheets = [];
    cssSheets.push("../../public/css/initial-views/index-page.css");
    try{ 
        if(req.user.role === 'user'){
            return res.redirect('/calendar')
        }else if(req.user.role === 'admin'){
            return res.redirect('/admin')
        }
        return res.render('users/index',{
            styles:cssSheets,
            scripts:''
        })
     
    }catch{
        res.render('users/index',{
            styles:cssSheets
        })
    }
 
})
//Registration Page
router.get('/registration',async (req, res)=>{
    let cssSheets = [];
    cssSheets.push("../../public/css/registrationUser.css");
    try{ 
        if(req.user){
            return res.redirect('/calendar')
        }
        res.render('users/register',{
            styles:cssSheets
        })  
      
    }catch(err){
        console.log(err)
        res.render('users/register',{
            errorMessage:'Coś poszło nie tak',
            type:'danger',
            styles:cssSheets
        })
    }
 
})
//Register Form
router.post('/registration',async(req,res)=>{
    let cssSheets = [];
    cssSheets.push("../../public/css/registrationUser.css");
    await userRegistry(req.body,'user',res,req,'/login','users/register',cssSheets)
})
//Email send
//Verify Registration
router.get('/verify',async(req,res)=>{
    let cssSheets = [];
    cssSheets.push("../../public/css/verify.css");
    try{
        res.render('users/verify',{styles:cssSheets});
    }catch{
        res.redirect('/')
    }
})
router.put('/verify',async(req,res)=>{
    await userVerify(req.body,res,req,'/login', '/verify');
})
//Front Page
router.get('/login',async (req, res)=>{
    let cssSheets = [];
    cssSheets.push("../../public/css/login.css");

    try{

        if(req.user){
            return res.redirect('/calendar')
        }
        res.render('users/login',{
            styles:cssSheets
        })

        
    }catch{
        res.render('users/login')
    }
 
})
// Login Process
router.post('/login', function(req, res, next){
    let cssSheets = [];
    cssSheets.push("../../public/css/login.css");
    if(req.body.email=='' || req.body.password ==''){
        req.flash('error','Uzupełnij wszystkie pola')
        res.render('users/login',{styles:cssSheets})
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
    let cssSheets = [];
    cssSheets.push("../../public/css/forgot.css");
    try{

        res.render('users/forgot',{styles:cssSheets})
    }catch{
        req.flash('mess','Coś poszło nie tak');
        req.flash('type','danger',)
        res.render('users/forgot',{
            styles:cssSheets
        })
    }
})
router.post('/forgot',async(req,res)=>{
    await userChangePassword(req.body,res,req,'user','/login','users/forgot') 
})
//Reset Password Verification
router.get('/change-password' ,async(req,res)=>{
    let cssSheets = [];
    cssSheets.push("../../public/css/newPassword.css");
    try{
        res.render('users/changePassword',{styles:cssSheets})
    }catch{
        req.flash('error','Coś poszło nie tak ')
        req.flash('danger','danger ')
        res.render('users/changePassword',{
            styles:cssSheets
        })
    }
  
})
router.post('/change-password' ,async(req,res)=>{
    await changePassword(req.body,res,req,'/login','users/changePassword')
})
/////////Change Password If Token is Correct
////////ADMIN
//Registration Page
router.get('/admin-register',async (req, res)=>{
    let cssSheets = [];
    cssSheets.push("../../public/css/admin/register.css");
    try{ 
        if(req.user){
            req.logOut();
            res.redirect('/admin-register')
        }
        res.render('admin/register',{styles:cssSheets})
    }catch(err){
        req.flash('error','Coś poszło nie tak')
        res.render('admin/register',{
            errorMessage:'Coś poszło nie tak',
            styles:cssSheets,
        })
    }
 
})
//Register Form
router.post('/admin-register',async(req,res)=>{
    let cssSheets = [];
    cssSheets.push("../../public/css/admin/register.css");
    await userRegistry(req.body,'admin',res,req,'/admin-login','admin/register',cssSheets)
})
//Front Page
router.get('/admin-login',async (req, res)=>{
    let cssSheets = [];
    cssSheets.push("../../public/css/login.css");
    try{
        if(req.user){
            req.logOut();
            res.redirect('/admin-login')
        }
        res.render('admin/login',{styles:cssSheets})

    }catch(err){
        console.log(err)
        res.render('admin/login',{styles:cssSheets})
    }
 
})
// Login Process
router.post('/admin-login', function(req, res, next){
    let cssSheets = [];
    cssSheets.push("../../public/css/login.css");
    if(req.body.email=='' || req.body.password ==''){
        req.flash('error','Uzupełnij wszystkie pola')
        res.render('admin/login',{styles:cssSheets})
      }else{
        passport.authenticate('local',{
            successRedirect:'/admin',
            failureRedirect:'/admin-login',
            failureFlash:true
        })(req,res,next)
      }
})

//Verify Registration
router.get('/admin-verify',async(req,res)=>{
    let cssSheets = [];
    cssSheets.push("../../public/css/verify.css");
    try{
        if(req.user){
            req.logOut();
            res.redirect('/admin-verify')
        }
        res.render('admin/verify',{styles:cssSheets});
    }catch{
        res.redirect('/')
    }
})
router.put('/admin-verify',async(req,res)=>{
    await userVerify(req.body,res,req,'/admin-login', '/admin-verify');
})
//Reset Email Password
router.get('/admin-forgot' ,async(req,res)=>{
    let cssSheets = [];
    cssSheets.push("../../public/css/forgot.css");
    try{
        if(req.user){
            req.logOut();
            res.redirect('/admin-forgot')
        }
        res.render('admin/forgot',{styles:cssSheets})
    }catch{
        req.fresh('mess','Coś poszło nie tak');
        req.flash('type','danger')
        res.render('admin/forgot',{
          
            styles:cssSheets
        })
    }
})
router.post('/admin-forgot',async(req,res)=>{
    await userChangePassword(req.body,res,req,'admin','/admin-login','admin/forgot') 
})
//Reset Password Verification
router.get('/admin-change-password' ,async(req,res)=>{
    let cssSheets = [];
    cssSheets.push("../../public/css/newPassword.css");
    try{
        if(req.user){
            req.logOut();
            res.redirect('/admin-change-password')
        }
        res.render('admin/changePassword',{styles:cssSheets})
    }catch{
        req.flash('mess','Coś poszło nie tak ');
        req.fresh('type','danger');
        res.render('admin/changePassword',{
            styles:cssSheets
        })
    }
  
})
router.post('/admin-change-password' ,async(req,res)=>{
    await changePassword(req.body,res,req,'/admin-login','admin/changePassword')
})
router.get('/admin-logout',ensureAuthenticated, (req,res)=>{
    req.logOut();
   
    req.flash('logged', 'Do zobaczenia!!');
    req.flash('success', 'success')
   
    res.redirect('/admin-login')
})
module.exports = router;