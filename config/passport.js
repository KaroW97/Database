const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');
module.exports = function (passport){
  // Local Strategy
  passport.use(new LocalStrategy({usernameField:'email'},(email, password, done)=>{
    //Match User
    User.findOne({email:email})
      .then(user=>{
        //Check if user exists
        if(!user)
          return done(null, false, {message: 'Email nie zarejestrowany'})

        //Check if password is correct
        bcrypt.compare(password, user.password,(err, isMatch)=>{
          //Check if account has been verified
          if(!user.active){
            return done(null, false, {message:'Musisz najpierw zweryfikować email'})
          }
          if(err) throw err;
          if(isMatch)
            return done(null, user);
          else  
            return done(null, false, {message:'Nie poprawne hasło'})
        });

      })
      .catch(err=>console.log(err))
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
