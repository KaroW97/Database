
const randomstring=require('randomstring');
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const emailLook = require('../misc/emailLayout')
const mailer  = require('../misc/mailer')

const userRegistry = async (userDetails,role,res,req,registerSuccess, registerFailed) => {
 
    try{
        const findUser = await User.findOne({email:userDetails.email})
        const hashedPassword = await bcrypt.hash(userDetails.password,10)
        if(!userDetails.email || !userDetails.companyName || !userDetails.password || !userDetails.ConfirmPassword){
            req.flash('err', 'Prosze uzupełnij wszystkie pola admin');
        }
        //Check Password
        if(userDetails.password !=userDetails.ConfirmPassword){
            req.flash('err', 'Wprowadzono różne hasła');
        }
        //Check password lenght
        if(userDetails.password.length < 3){
            req.flash('err', 'Hasło powinno zawierac 3 znaków');
        }
        if(findUser){
           req.flash('err', 'Email istnieje w bazie danych');
        }
        if(findUser || userDetails.password.length < 3 || userDetails.password !=userDetails.ConfirmPassword){
            res.render(registerFailed)
            return;
        }
        else {
               //Flag account inactive
            const secretToken =randomstring.generate();  //email verify
            var newUser = new User({
                email:userDetails.email,
                password:hashedPassword,
                secretToken:secretToken,
                active:false,
                role:role
            })
           await newUser.save();
           let email
            if(role=='admin'){
                 email= emailLook(secretToken,'Konto Admin zostało utworzone', 
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
                file:'logo2.JPG',
                path: './public/logo2.JPG',
                cid:'logo'
            })
           req.flash('logged', 'Sprawdź swój email!');
           res.redirect(registerSuccess)
        }
       
    }catch(err){
        console.log(err)
        res.render(registerFailed,{
            errorMessage:'Spróbuj ponownie',
            type:'error'
        })
    }  
}

const userVerify = async (userDetails,res,req,redirectSuccess, redirectFailure)=>{
    let user
    try{
        const secretTokenn = userDetails.secretToken
        user = await User.findOne({secretToken:secretTokenn})
        if(!user){
           
            req.flash('error','Nie znaleziono takiego użytkownika.')
            req.flash('danger','danger')
            res.redirect(redirectFailure);
            return;
        }
        user.active = true;
        user.secretToken = '';
      
        await user.save();
        req.flash('logged','Teraz możesz się zalogować');
        req.flash('danger','success')
        res.redirect(redirectSuccess)
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}
module.exports = {
    userVerify, 
    userRegistry
}