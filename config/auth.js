module.exports={
    ensureAuthenticated: function(req,res,next){
        if(  req.isAuthenticated()){
            return next()
        }else{
            req.flash('Zaloguj się ')
            res.redirect('/login',)
        }   
    }
}