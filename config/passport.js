const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');
module.exports = function (passport){
  // Local Strategy
  passport.use(new LocalStrategy({usernameField:'email'},(email, password, done)=>{
    //Match User
    User.findOne({email:email})
      .then(user=>{
        if(!user)
          return done(null, false, {message: 'Email nie zarejestrowany'})
          
        bcrypt.compare(password, user.password,(err, isMatch)=>{
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
