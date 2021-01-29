
const randomstring=require('randomstring');
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const emailLook = require('../misc/emailLayout')
const mailer  = require('../misc/mailer')


const userRegistry = async (userDetails,role,res,req,registerSuccess, registerFailed, cssStyles) => {
 
    try{
        const findUser = await User.findOne({email:userDetails.email})
        const hashedPassword = await bcrypt.hash(userDetails.password,10)
        if(!userDetails.email || !userDetails.companyName || !userDetails.password || !userDetails.ConfirmPassword){
            req.flash('mess', 'Prosze uzupełnij wszystkie pola admin');
          
        }
        //Check Password
        if(userDetails.password !=userDetails.ConfirmPassword){
            req.flash('mess', 'Wprowadzono różne hasła');
           
        }
        //Check password lenght
        if(userDetails.password.length < 3){
            req.flash('mess', 'Hasło powinno zawierac 3 znaków');
          
        }
        if(findUser){
           req.flash('mess', 'Email istnieje w bazie danych');
           
        }
        if(findUser || userDetails.password.length < 3 || userDetails.password !=userDetails.ConfirmPassword 
            ||!userDetails.email || !userDetails.companyName || !userDetails.password || !userDetails.ConfirmPassword)
            req.flash('type', 'info-alert')
        if(findUser || userDetails.password.length < 3 || userDetails.password !=userDetails.ConfirmPassword){
            res.render(registerFailed)
            return;
        }
        else {
               //Flag account inactive
            const secretToken =randomstring.generate();  //email verify
            var newUser = new User({
                companyName:userDetails.companyName || 'Admin',
                email:userDetails.email,
                password:hashedPassword,
                secretToken:secretToken,
                active:false,
                role:role
            })
           await newUser.save();
           let email
            if(role=='admin'){
                 email= emailLook(secretToken,'Konto Administratora zostało utworzone', 
                'Proszę zweryfikuj swoje konto za pomocą kodu:',
                'Na stronie:',
                'https://beauty-base.herokuapp.com/admin-verify',
                'Miłego dnia!'
                )
            }else{
                 email= emailLook(secretToken,'Dziękujemy za rejestrację', 
                'Proszę zweryfikuj swoje konto za pomocą kodu:',
                'Na stronie:',
                'https://beauty-base.herokuapp.com/verify',
                'Miłego dnia!'
                )
            }
       
            //send mailer
           await mailer.sendEmail('beautybasehelp@gmail.com',userDetails.email,'Zweryfikuj swoje konto Beauty Base!',email,
            {
                file:'Beauty Base.png',
                path: './public/Beauty Base.png',
                cid:'logo'
            })
           
           req.flash('mess', 'Sprawdź swój email!');
           req.flash('type', 'info')
           res.redirect(registerSuccess)
        }
       
    }catch(err){
        console.log(err)
      
        req.flash('mess', 'Spróbuj ponownie');
        req.flash('type', 'info-alert')
        res.render(registerFailed)
    }  
}

const userVerify = async (userDetails,res,req,redirectSuccess, redirectFailure)=>{
    let user
    try{
        const secretTokenn = userDetails.secretToken
        user = await User.findOne({secretToken:secretTokenn})
        if(!user){
           
            req.flash('mess', 'Nie znaleźliśmy użytkownika o podanym kluczu.');
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
const userChangePassword =async(verify,res,req,role,redirectSuccess,redirectFailure)=>{
    let searchUser
    try{
        searchUser = await User.findOne({email:verify.forgotPassword})
        if(searchUser!=null && searchUser!='' ){
            const secretTokenn =randomstring.generate();
            var email
           if(role=='admin'){
             email= emailLook(secretTokenn,
                'Witaj!',
                `Otrzymaliśmy prośbę dotyczącą zresetowania Twojego hasła Administratora.
                Wprowadź następujący kod resetowania hasła:`,` Na stronie: ` 
                ,'https://beauty-base.herokuapp.com/admin-change-password',
                'Miłego dnia!'
            )
           }else{
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
           if(role=='admin'){
            await mailer.sendEmail('beautybasehelp@gmail.com',verify.forgotPassword,'Zmień hasło Administratora!',email,
            {
                file:'Beauty Base.png',
                path: './public/Beauty Base.png',
                cid:'logo'
            })
           }else{
            await mailer.sendEmail('beautybasehelp@gmail.com',verify.forgotPassword,'Zmień hasło Beauty Base!',email,
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
            req.flash('mess', 'Nie znaleźliśmy konta z podanym kluczem weryfikacujnym.');
            req.flash('type', 'info-alert')
            res.render(redirectFailure)
        }
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}
const changePassword = async (verify,res,req,redirectSuccess,redirectFailure)=>{
    let searchUser
    try{
        searchUser  = await User.findOne({secretToken:verify.secretToken})
        if(searchUser!=null && searchUser!='' && verify.password == verify.passwordConfirm){
            const hashedPassword = await bcrypt.hash(verify.password,10)
            searchUser.password = hashedPassword
            searchUser.secretToken ='';
            searchUser.active = true;
            await searchUser.save();
        
            req.flash('mess', 'Zmieniono hasło możesz się zalogować!');
            req.flash('type', 'info-success')
            res.redirect(redirectSuccess)
        }else if(verify.password != verify.passwordConfirm){
            req.flash('mess', 'Wprowadź takie same hasła.');
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