module.exports={
    ensureAuthenticated: function(req,res,next){
        if(  req.isAuthenticated()){
            return next()
        }
        req.flash('Zaloguj się ')
        res.redirect('/login',)
    }
}