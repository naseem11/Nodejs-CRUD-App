const { mongoose } = require('mongoose');
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');


module.exports = function (passport) {

    passport.use(new localStrategy({
        usernameField: 'userEmail',
        passwordField: 'userPassword'
    }, (email, password, done) => {

        User.findOne({email:email})
        .then((user)=>{
          if(!user){

            return done(null,false,{message :'No user found'});
          }

          bcrypt.compare(password, user.password,(err,isMatch)=>{

            if(err) throw err;
            if(isMatch){

                return done(null,user);

            }else{

                return done(null,false,{message :'Wrong password'});
            }
          });

        });

      
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
