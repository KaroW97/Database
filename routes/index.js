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
/*
 * Start page
*/
router.get('/',async (req, res)=>{
    try{ 
        if(req.user.role === 'user'){
            return res.redirect('/calendar')
        }else if(req.user.role === 'admin'){
            return res.redirect('/admin')
        }
        return res.render('users/index')
    }catch{
        res.render('users/index')
    }
})
/*
 * Register Form
*/
router.post('/registration',async(req,res)=>{
    await userRegistry(req.body,'user',res,req,'/login','users/index')
})
/*
 * Verify Registration Page
*/
router.get('/verify',async(req,res)=>{

    try{
        res.render('users/verify');
    }catch{
        res.redirect('/')
    }
})
/*
 * Verify Registration Send request
*/
router.put('/verify',async(req,res)=>{
    await userVerify(req.body,res,req,'/login', '/verify');
})
/*
 * Login Page
*/
router.get('/login',async (req, res)=>{
    try{

        if(req.user)
            return res.redirect('/calendar')
        res.render('users/login')
    }catch{
        res.render('users/login')
    }
 
})
/*
 * Send login request
*/
router.post('/login', function(req, res, next){
   
    if(req.body.email=='' || req.body.password ==''){
        req.flash('mess', 'Uzupełnij wszystkie pola.');
        req.flash('type', 'info-alert')
        res.render('users/login',)   
      }else{
        passport.authenticate('local',{
            successRedirect:'/calendar',
            failureRedirect:'/login',
            failureFlash:true
        })(req,res,next)
      }
})
/*
 * Logut
*/
router.get('/logout',ensureAuthenticated, (req,res)=>{
    req.logOut();
    req.flash('mess', 'Do zobaczenia!');
    req.flash('type', 'info-success')
    res.redirect('/')
})
/*
 * Forgot password page
*/
router.get('/forgot' ,async(req,res)=>{
    
    try{

        res.render('users/forgot')
    }catch{
        req.flash('mess','Coś poszło nie tak');
        req.flash('type','info-alert',)
        res.render('users/forgot')
    }
})
/*
 * Forgot password request
*/
router.post('/forgot',async(req,res)=>{
    await userChangePassword(req.body,res,req,'user','/login','users/forgot') 
})
/*
 * Reset password page
*/
router.get('/change-password' ,async(req,res)=>{

    try{
        res.render('users/changePassword')
    }catch{
        req.flash('mess','Coś poszło nie tak ')
        req.flash('type','info-alert ')
        res.render('users/changePassword')
    }
  
})
/*
 * Reset password request
*/
router.post('/change-password' ,async(req,res)=>{
    await changePassword(req.body,res,req,'/login','users/changePassword')
})
/*
 * Login admin page
*/
router.get('/admin-login',async (req, res)=>{

    try{
        if(req.user){
            req.logOut();
            res.redirect('/admin-login')
        }
        res.render('admin/login')

    }catch(err){
        console.log(err)
        res.render('admin/login')
    }
 
})
/*
 * Login admin request
*/
router.post('/admin-login', function(req, res, next){
    if(req.body.email=='' || req.body.password ==''){
     
        req.flash('mess','Uzupełnij wszystkie pola')
        req.flash('type','info-alert ')
        res.render('admin/login')
      }else{
        passport.authenticate('local',{
            successRedirect:'/admin',
            failureRedirect:'/admin-login',
            failureFlash:true
        })(req,res,next)
      }
})
/*
 * Login logout
*/
router.get('/admin-logout',ensureAuthenticated, (req,res)=>{
    req.logOut();
    req.flash('mess', 'Do zobaczenia!!');
    req.flash('type', 'info-success')
    res.redirect('/admin-login')
})
module.exports = router;