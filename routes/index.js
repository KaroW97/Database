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
    try{ 
        if(req.user){
            return res.redirect('/calendar')
        }
        return res.render('users/index')
     
    }catch{
        res.render('users/index')
    }
 
})
//Registration Page
router.get('/registration',async (req, res)=>{
    try{ 
        if(req.user){
            return res.redirect('/calendar')
        }
        res.render('users/register')  
      
    }catch(err){
        console.log(err)
        res.render('users/register',{
            errorMessage:'Coś poszło nie tak',
            type:'danger',
        })
    }
 
})
//Register Form
router.post('/registration',async(req,res)=>{
    await userRegistry(req.body,'user',res,req,'/login','user/register')
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
    await userVerify(req.body,res,req,'/login', '/verify');
})
//Front Page
router.get('/login',async (req, res)=>{
    try{
        if(req.user){
            return res.redirect('/calendar')
        }
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
    await userChangePassword(req.body,res,req,'user','/login','user/forgot') 
})
//Reset Password Verification
router.get('/change-password' ,async(req,res)=>{
    try{
        res.render('users/changePassword')
    }catch{
        res.render('users/changePassword',{
            type:'danger',
            errorMessage: 'Coś poszło nie tak '
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
    try{ 
        res.render('admin/register')
    }catch(err){
        res.render('admin/register',{
            errorMessage:'Coś poszło nie tak',
            type:'danger',
        })
    }
 
})
//Register Form
router.post('/admin-register',async(req,res)=>{
    await userRegistry(req.body,'admin',res,req,'/admin-login','admin/register')
})
//Front Page
router.get('/admin-login',async (req, res)=>{
    try{
            res.render('admin/login')
    }catch(err){
        console.log(err)
        res.render('admin/login')
    }
 
})
// Login Process
router.post('/admin-login', function(req, res, next){
    if(req.body.email=='' || req.body.password ==''){
        req.flash('error','Uzupełnij wszystkie pola')
        res.render('admin/login')
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
    try{
        res.render('admin/verify');
    }catch{
        res.redirect('/')
    }
})
router.put('/admin-verify',async(req,res)=>{
    await userVerify(req.body,res,req,'/admin-login', '/admin-verify');
})
//Reset Email Password
router.get('/admin-forgot' ,async(req,res)=>{
    try{
        res.render('admin/forgot')
    }catch{
        res.render('admin/forgot',{
            type:'danger',
            errorMessage: 'Coś poszło nie tak '
        })
    }
})
router.post('/admin-forgot',async(req,res)=>{
    await userChangePassword(req.body,res,req,'admin','/admin-login','admin/forgot') 
})
//Reset Password Verification
router.get('/admin-change-password' ,async(req,res)=>{
    try{
        res.render('admin/changePassword')
    }catch{
        res.render('admin/changePassword',{
            type:'danger',
            errorMessage: 'Coś poszło nie tak '
        })
    }
  
})
router.post('/admin-change-password' ,async(req,res)=>{
    await changePassword(req.body,res,req,'/admin-login','admin/changePassword')
})
router.get('/admin-logout',ensureAuthenticated, (req,res)=>{
    req.logOut();
    req.flash('logged', 'Do zobaczenia!');
    req.flash('success', 'success')
    res.redirect('/admin-login')
})
module.exports = router;