
const randomstring=require('randomstring');
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const emailLook = require('../misc/emailLayout')
const mailer  = require('../misc/mailer')

const userRegistry = async (role,res,req,registerSuccess, registerFailed) => {
    try{
        const findUser = await User.findOne({email:req.body.email})
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        if(!req.body.email || !req.body.companyName || !req.body.password || !req.body.ConfirmPassword){
            req.flash('mess', 'Prosze uzupełnij wszystkie pola.');
        }
        if(req.body.password !== req.body.ConfirmPassword){
            req.flash('mess', 'Wprowadzono różne hasła.');
        }
        if(req.body.password.length < 8){
            req.flash('mess', 'Hasło powinno zawierac 8 znaków.');
        }
        if(req.body.beautySalon === undefined && req.body.hairdresser === undefined){
            req.flash('mess', 'Nie wybrano rodzaju działalności.');
        }
        if(findUser){
           req.flash('mess', 'Email juz istnieje w bazie danych.');
        }
        if(findUser ||  req.body.ConfirmPassword.length < 8  ||req.body.password.length < 8 || req.body.password != req.body.ConfirmPassword ||!req.body.email || !req.body.companyName || !req.body.password || !req.body.ConfirmPassword || (req.body.beautySalon === undefined && req.body.hairdresser === undefined)){
            req.flash('type', 'info-alert')
            res.render(registerFailed)
        }
        
        else {
            const secretToken =randomstring.generate();  //email verify
            let newUser = new User({
                companyName:req.body.companyName,
                email:req.body.email,
                password:hashedPassword,
                secretToken:secretToken,
                active:false,
                beautySalon:req.body.beautySalon === 'on' ? true : false,
                hairdresser:req.body.hairdresser === 'on' ? true : false,
                role:role
            })
           await newUser.save();
           let email
            if(role=='user'){
                email= emailLook(secretToken,'Dziękujemy za rejestrację', 
                'Proszę zweryfikuj swoje konto za pomocą kodu:',
                'Na stronie:',
                'https://beauty-base.herokuapp.com/verify',
                'Miłego dnia!'
                )
            }
       
            //send mailer
           await mailer.sendEmail('beautybasehelp@gmail.com',req.body.email,'Zweryfikuj swoje konto Beauty Base!',email,
            {
                file:'Beauty Base.png',
                path: './public/Beauty Base.png',
                cid:'logo'
            })
           
           req.flash('mess', 'Sprawdź swój email!');
           req.flash('type', 'info-success')
           res.redirect(registerSuccess)
        }
       
    }catch(err){
        console.log(err)
      
        req.flash('mess', 'Spróbuj ponownie.');
        req.flash('type', 'info-alert')
        res.render(registerFailed)
    }  
}

const userVerify = async (res,req,redirectSuccess, redirectFailure)=>{
    let user
    try{
        const secretTokenn = req.body.secretToken
        user = await User.findOne({secretToken:secretTokenn})
        if(!user){
           
            req.flash('mess', 'Nie znaleźliśmy użytkownika o podanym kluczu w bazie danych.');
            req.flash('type', 'info-alert')
            res.redirect(redirectFailure);
            return;
        }
        user.active = true;
        user.secretToken = '';
      
        await user.save();
        req.flash('mess', 'Teraz możesz się zalogować.');
        req.flash('type', 'info-success')
        res.redirect(redirectSuccess)
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}
const userChangePassword =async(res,req,role,redirectSuccess,redirectFailure)=>{
    let searchUser
    try{
        searchUser = await User.findOne({email:req.body.forgotPassword})
        if(searchUser!=null && searchUser!='' ){
            const secretTokenn =randomstring.generate();
            var email
         
           if(role==='user'){
            email= emailLook(secretTokenn,
                'Witaj!',
                `Otrzymaliśmy prośbę dotyczącą zresetowania Twojego hasła Beauty Base.
                Wprowadź następujący kod resetowania hasła:`,` Na stronie: ` 
                ,'https://beauty-base.herokuapp.com/change-password',
                'Miłego dnia!'
            )
           }
        
            searchUser.secretToken = secretTokenn
            searchUser.active = false;
            //send mailer
           await searchUser.save();
           if(role=='user'){
            await mailer.sendEmail('beautybasehelp@gmail.com',req.body.forgotPassword,'Zmień hasło Beauty Base!',email,
            {
                file:'Beauty Base.png',
                path:'./public/Beauty Base.png',
                cid:'logo'
            })
           }
            req.flash('mess', 'Sprawdź swoją skrzynkę email.');
            req.flash('type', 'info-success')
            res.redirect(redirectSuccess)
        }
        else{
            req.flash('mess', 'Nie znaleźliśmy konta z podanym kluczem weryfikacyjnym.');
            req.flash('type', 'info-alert')
            res.render(redirectFailure)
        }
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}
const changePassword = async (res,req,redirectSuccess,redirectFailure)=>{
    let searchUser
    try{
       
        searchUser  = await User.findOne({secretToken:req.body.secretToken})
        if(searchUser!=null && searchUser!='' && req.body.password === req.body.passwordConfirm 
        && req.body.password.length >= 8 && req.body.passwordConfirm.length >= 8){
            const hashedPassword = await bcrypt.hash(req.body.password,10)
            searchUser.password = hashedPassword
            searchUser.secretToken ='';
            searchUser.active = true;
            await searchUser.save();
        
            req.flash('mess', 'Zmieniono hasło możesz się zalogować!');
            req.flash('type', 'info-success')
            res.redirect(redirectSuccess)
        }else if(req.body.password !== req.body.passwordConfirm){
            req.flash('mess', 'Wprowadź takie same hasła.');
            req.flash('type', 'info-alert')
            res.render(redirectFailure)
        }else if(req.body.password.length < 8 || req.body.passwordConfirm.length < 8){
            req.flash('mess', 'Wprowadzone hasło jest za krótkie.');
            req.flash('type', 'info-alert')
            res.render(redirectFailure)
        }else{
            req.flash('mess', 'Nie znaleziono użytkownika.');
            req.flash('type', 'info-alert')
            res.render(redirectFailure)
        }
    }catch(err){
        req.flash('mess', 'Nie znaleziono użytkownika.');
        req.flash('type', 'info-alert')
        res.render(redirectFailure)
    }
}

module.exports = {
    userVerify, 
    userRegistry,
    userChangePassword,
    changePassword,
   
}