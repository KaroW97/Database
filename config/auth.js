
    const ensureAuthenticated= function(req,res,next){
        if(  req.isAuthenticated()){
            return next()
        }else{
            req.flash('Zaloguj się ')
            res.redirect('/login',)
        }   
    }

const ensureAuthenticatedAdmin = (req,res,next)=>{
    if(  req.isAuthenticated()){
        return next()
    }else{
        req.flash('Zaloguj się ')
        res.redirect('/admin-login',)
    }   
}
module.exports={
    ensureAuthenticated,
    ensureAuthenticatedAdmin
}