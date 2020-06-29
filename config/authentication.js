
const randomstring=require('randomstring');
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const emailLook = require('../misc/emailLayout')
const mailer  = require('../misc/mailer')

const ObjectId = require('mongodb').ObjectId;
const Client = require('../models/clients');
const CompanyShopping = require('../models/stats/companyShoppingStats')
const ShoppingList = require('../models/shoppingList')
const BrandName = require('../models/productCompany')
const Treatment = require('../models/treatment')
const FutureVisit = require('../models/clientFutureVisit')
const ClientVisits = require('../models/clientsVisits')

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
const userChangePassword =async(verify,res,req,role,redirectSuccess,redirectFailure)=>{
    let searchUser
    console.log('kestem')
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
                file:'logo2.JPG',
                path: './public/logo2.JPG',
                cid:'logo'
            })
           }else{
            await mailer.sendEmail('beautybasehelp@gmail.com',verify.forgotPassword,'Zmień hasło Beauty Base!',email,
            {
                file:'logo2.JPG',
                path:'./public/logo2.JPG',
                cid:'logo'
            })
           }
           
            req.flash('success','success')
            req.flash('logged','Sprawdź swoją skrzynkę email.')
            res.redirect(redirectSuccess)
        }
        else{
            res.render(redirectFailure,{
                type:'danger',
                errorMessage:'Nie znaleźliśmy twojego emaila w bazie danych. Spróbuj jeszcze raz.'
            })
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
            req.flash('success','success');
            req.flash('logged', 'Zmieniono hasło możesz się zalogować!')
            res.redirect(redirectSuccess)
        }else if(verify.password != verify.passwordConfirm){
            res.render(redirectFailure,{
                type:'danger',
                errorMessage: 'Wprowadź takie same hasła.'
            })
        }else{
            res.render(redirectFailure,{
                type:'danger',
                errorMessage: 'Błędny token'
            })
        }
    }catch(err){
        console.log(err)
        res.render(redirectFailure,{
            type:'danger',
            errorMessage: 'Coś poszło nie tak'
        })
    }
}
const adminDeleteUsers = async(deleteUser,req) =>{
    let clients = await Client.find({user:ObjectId(deleteUser)});
    let companyShopping = await CompanyShopping.find({user:ObjectId(deleteUser)});
    let shoppingList = await ShoppingList.find({user:ObjectId(deleteUser)});
    let brandName = await BrandName.find({user:ObjectId(deleteUser)});
    let treatments = await Treatment.find({user:ObjectId(deleteUser)});
    let futureVisit = await FutureVisit.find({user:ObjectId(deleteUser)});
    let clientVisits = await ClientVisits.find({user:ObjectId(deleteUser)});

    for (let client of clients)
        await client.remove()
        
    for (let list of shoppingList)
        await list.remove()

    for (let brand of brandName)
        await brand.remove()

    for (let clientVisit of clientVisits)
        await clientVisit.remove()

    for (let visit of futureVisit)
        await visit.remove()

    for (let shopping of companyShopping)
        await shopping.remove()

    for (let treatment of treatments)
        await treatment.remove()

    await req.app.locals.gfs.files.find({'metadata.user':ObjectId(deleteUser)}).toArray( (err, files)=> {
        if (err) throw err
        for(var file of files){
        
            req.app.locals.gfs.remove({_id:ObjectId(file._id),root:'uploads'}, function (err, gridStore) {
                if (err)  throw(err);
            
            });
        }       
    })
    let user =  await User.findById(ObjectId(deleteUser));
    await user.remove();  

}
module.exports = {
    userVerify, 
    userRegistry,
    userChangePassword,
    changePassword,
    adminDeleteUsers
}