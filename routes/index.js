const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/user')
const {ensureAuthenticated} = require('../config/auth')
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
        res.render('users/register',{ user:req.user.id})
    }catch{
        res.render('users/register',{
            errorMessage:'Coś poszło nie tak',
            type:'danger',
        })
    }
 
})
//Register Form
router.post('/registration',async(req,res)=>{
    var errorMessage ='';
    try{
        const findUser = await User.findOne({email:req.body.email})
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        if(!req.body.email || !req.body.companyName || !req.body.password || !req.body.ConfirmPassword){
            errorMessage = 'Prosze uzupełnij wszystkie pola. '
        }
        //Check Password
        if(req.body.password !=req.body.ConfirmPassword){
            errorMessage +='Wprowadzono różne hasła. '
        }
        //Check password lenght
        if(req.body.password.length < 3){
            errorMessage +=' Hasło powinno zawierac 3 znaków.'
        }
        if(findUser){
            errorMessage +=' Email istnieje w bazie danych.'
        }
        if(errorMessage.length > 0){
            res.render('users/register',{
                errorMessage:errorMessage,
                type:'danger'
            })
        }
        else {
            var newUser = new User({
                companyName:req.body.companyName,
                email:req.body.email,
                password:hashedPassword
            })
           //await newUser.save();
           req.flash('logged', 'Do zobaczenia!');
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
    passport.authenticate('local',{
        successRedirect:'/calendar',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next)
})
//Logut
router.get('/logout',ensureAuthenticated, (req,res)=>{
    req.logOut();
    req.flash('logged', 'Do zobaczenia!');
    req.flash('success', 'success')
    res.redirect('/')
})
module.exports = router;