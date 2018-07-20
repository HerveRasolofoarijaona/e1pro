/**
 * Created by nokamojd on 28/08/2016.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
require('./app_api/models/user.schema');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
//import _ from 'lodash';


// serialize and deserialize
passport.serializeUser(function (user, done) {
    done(null, user._id);
});



passport.deserializeUser(function (id, done) {
   User.findById(id, function (err, user) {
       done(err, user);
   });
});

// middleware
passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
        }, function(req, email, password, done){
            User.findOne({email: email}, function(err, user) {
                if(err) return done(err);

                if(!user){
                    return done(null, false, req.flash("errors", "Utilisateur inexistant"));
                }
                if (!user.is_active) {
                    return done(null, false, req.flash("errors", "Please confirn your e-mail"));
                }
                if(!user.comparePassword(password)){
                    return done(null, false, req.flash("errors", "Mot de passe incorrect"));
                }
                return done(null, user);
            });
    })
);

// custom function to validate
exports.ensureAuthenticated = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};