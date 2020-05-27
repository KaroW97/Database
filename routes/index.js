const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/user')
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
    }catch{
        res.render('users/register')
    }
 
})
//Register Form
router.post('/registration',async(req,res)=>{
    try{
        const findUser = await User.findOne({email:req.body.email})
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        if(req.body.password ==req.body.ConfirmPassword && findUser ==null ){
            var newUser = new User({
                companyName:req.body.companyName,
                email:req.body.email,
                password:hashedPassword
            })
            await newUser.save();
            res.redirect('users/login')
        }else if(req.body.password !=req.body.ConfirmPassword){
            res.render('users/register',{
                errorMessage:'Hasła są różne'
            })
        }else if(findUser.email = req.body.email){
            res.render('users/register',{
                errorMessage:'W bazie danych istnieje ten email'
            })
        }
    }catch(err){
       
        res.render('users/register',{
            errorMessage:'Spróbuj Ponownie'
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
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
})
module.exports = router;