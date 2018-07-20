/**
 * Created by nokamojd on 12/07/2016.
 */
var request = require('request');
var methodOverride = require('method-override');
var passport = require('passport');
var passportConf = require('../../passport-conf');
var kickbox = require('kickbox').client('live_e55b5665f2e986561c0b1e8a79f5fd912f7f318b8043ca15d5e957e19b38f79d').kickbox();
var jwt = require('jsonwebtoken');
var mailjet = require('node-mailjet').connect('c5848cd983dd3d11a381c9999bfab96c', '8be8a7c7eb0b1fbfa73b34fae63ab36f');// pour se connecter à l'API envoie d'email
var secret = 'shhhhh'; // clé pour avoir le jeton verif e-mail
var secret2 = 'vanity'

var mongoose = require('mongoose');
require('../../app_api/models/cart.schema');
require('../../app_api/models/consultant.schema.js');
require('../../app_api/models/enterprise.schema.js');
require('../../app_api/models/user.schema');
var User = mongoose.model('User');
var Cart = mongoose.model('Cart');
var Consultant = mongoose.model('Consultant');
var Enterprise = mongoose.model('Enterprise');
var async = require('async');
var urlDirectkit = "https://sandbox-api.lemonway.fr/mb/demo/dev/directkitjson2/Service.asmx/"


var apiOptions = {
    server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "";
}

// error handling function
var _showError = function (req, res, status, page) {
    var errTitle, content, page;
    if (status === 404) {
        errTitle = "404, page not found";
        content = "Oh dear. Looks like we can't find this page. Sorry.";
    } else {
        errTitle = status + ", something's gone wrong";
        content = "Something, somewhere, has gone just a little bit wrong.";
    }
    page = 'index';
    res.status(status);
    res.render(page, {
        errTitle : errTitle,
        errMessage : content
    });
};
// Confirmation E-mail 25/04
/*module.exports.confEmail = (function (req, res) {
    
});*/

// Request the SignUp page
module.exports.signupPageRender = (function (req, res) {
    if(req.user) return res.redirect('/dashboard');
    res.render('signup', {
        title: 'Emploi1Pro | Inscription',
        errors: req.flash('errors')
    });
});
// enregistrer consultant
module.exports.signupConsultant = (function (req, res, next) {
    if (req.body.password != req.body.passconf) {
        req.flash('errors', 'les mots de passe ne sont pas identiques');
        return res.redirect(req.get('referer'));
    }
    async.waterfall([
        function (callback) {
            var user = new User();
            user.first_name = req.body.firstName;
            user.last_name = req.body.lastName;
            user.email = req.body.email;
            user.password = req.body.password;
            user.user_role = req.body.role;
            user.profile_pic_path = user.gravatar(64);
            user.temporarytoken = jwt.sign({ first_name: user.first_name, lastname: user.last_name, email: user.email }, secret, { expiresIn: '1h' });

            User.findOne({ email: req.body.email }, function (err, existingUser) {

                if (existingUser) {
                    req.flash('errors', 'Cet email existe déjà.');
                    return res.redirect('signup');

                } else /*if (true) {// verification si mail valide
                    kickbox.verify( req.body.email , function (error, response) {
                        var verif = response.body.result;
                        console.log(req.body.email); // les console.log sont facultatives
                        console.log(verif);
                        if (verif == "undeliverable" ) {
                            console.log(response.body.reason);
                            req.flash('errors', 'Cet E-mail est invalide');
                            return res.redirect('signup');
                        } else */ { //Si mail valide on sauvegarde || envoie mail confirmation

                    /*res.json({ succes: test, message: 'Compte a été créé! Vous allez reçevoir un e-mail de validdation' })*/
                    user.save(function (err, user) {
                        //var token = user.temporarytoken;        /*jwt.sign({ foo: 'bar' }, 'shhhhh');*/
                        var link = req.protocol + "://" + req.get('host') + "/verification/" + user.temporarytoken; //25/04
                        const request = mailjet
                            .post("send")
                            .request({
                                "FromEmail": "news@aprentiv.com ",
                                "FromName": "Emploi1Pro",
                                "Subject": "[Confirmez votre e-mail]",
                                "Text-part": "V",
                                "Html-part": '<h3>Bonjour ' + user.first_name + ', Pour valider votre adresse e- mail, veuillez cliquer sur le lien suivant : <p><a href="' + link + '"> Confirmez</a> ', //faire un href ' + token +'
                                "Recipients": [{
                                    "Email": user.email
                                }]
                            })
                        request
                            .then(result => {
                                console.log(result.body)
                            })
                            .catch(err => {
                                console.log(err.statusCode)
                            })
                        if (err) return next(err);
                        callback(null, user);
                        //return res.redirect('login');
                        //res.json({ success: true, message: "Compte enregistré! verifier vos mails pour l'activation" });
                    })
                }
            });
        }, //enlever la virgule qd kickbox est utilisé

        //}
        //)
        //},
        function (user) {
            var consultant = new Consultant();
            consultant.related_user = user._id;
            consultant.save(function (err) {
                if (err) return next(err);
            });
            var cart = new Cart();
            cart.owner = user._id;
            cart.save(function (err) {
                if (err) return next(err);
                console.log("Panier créer");
                //req.flash('errors', 'Un e-mail vous a été envoyé pour confirmer votre addresse e-mail');
                res.redirect('login');
            });
        },
    ]);
});

// Request the Enterprise SignUp page
module.exports.businessSignupPageRender = (function (req, res) {
    if(req.user) return res.redirect('/dashboard');
    res.render('business-signup', {
        title: 'Inscription Entreprises | Emploi1Pro',
        errors: req.flash('errors')
    });
});

// enregistrer entreprise
module.exports.signupEntreprise = (function (req, res, next) {
    if (req.body.password != req.body.passconf) {
        req.flash('errors', 'les mots de passe ne sont pas identiques');
        return res.redirect(req.get('referer'));
    }
    async.waterfall([
        function (callback) {
            var user = new User();
            user.company_name = req.body.businessName;
            user.first_name = req.body.firstName;
            user.last_name = req.body.lastName;
            user.qualification = req.body.position;
            user.email = req.body.email;
            user.password = req.body.password;
            user.user_role = req.body.role;
            user.profile_pic_path = user.gravatar(64);
            user.temporarytoken = jwt.sign({ first_name: user.first_name, lastname: user.last_name, email: user.email }, secret, { expiresIn: '1h' });
            User.findOne({ email: user.email }, function (err, existingUser) {
                if (existingUser) {
                    req.flash('errors', 'Cet email existe déjà.');
                    return res.redirect('signup');

                } else if (true) {// verification si mail valide
                    /*kickbox.verify(req.body.email, function (error, response) {
                        var verif = response.body.result;
                        console.log(req.body.email); // les console.log sont facultatives
                        console.log(verif);
                        if (verif == "undeliverable") {
                            console.log(response.body.reason);
                            req.flash('errors', 'Cet E-mail est invalide');
                            return res.redirect('signup');
                        } else { //Si mail valide on sauvegarde || envoie mail confirmation

                            /*res.json({ succes: test, message: 'Compte a été créé! Vous allez reçevoir un e-mail de validdation' })*/
                            user.save(function (err, user) {
                                //var token = user.temporarytoken;        /*jwt.sign({ foo: 'bar' }, 'shhhhh');*/
                                var link = req.protocol + "://" + req.get('host') + "/verification/" + user.temporarytoken; //25/04
                                const request = mailjet
                                    .post("send")
                                    .request({
                                        "FromEmail": "news@aprentiv.com ",
                                        "FromName": "Emploi1Pro",
                                        "Subject": "[Confirmez votre e-mail]",
                                        "Text-part": "V",
                                        "Html-part": '<h3>Bonjour ' + user.first_name + ', Pour valider votre adresse e- mail, veuillez cliquer sur le lien suivant : <p><a href="' + link + '"> Confirmez</a> ', //faire un href ' + token +'
                                        "Recipients": [{
                                            "Email": user.email
                                        }]
                                    })
                                request
                                    .then(result => {
                                        console.log(result.body)
                                    })
                                    .catch(err => {
                                        console.log(err.statusCode)
                                    })
                                if (err) return next(err);
                                callback(null, user);
                                //return res.redirect('login');
                                //res.json({ success: true, message: "Compte enregistré! verifier vos mails pour l'activation" });
                            })
                        }
                    });
                //}

            //}
            //)
        },
        function (user) {
            var enterprise = new Enterprise();
            enterprise.linked_user = user._id;
            enterprise.save(function (err) {
                if (err) return next(err);
            });
            var cart = new Cart();
            cart.owner = user._id;
            cart.save(function (err) {
                if (err) return next(err);
                req.flash('success', 'Un e-mail vous a été envoyé pour confirmer votre addresse e-mail1');
                res.redirect('/login');
            });
        }
    ]);
});


/*
module.exports.signUp = (function (req, res) {
    var requestOptions, path, postData;
    path='/api/users';
    postData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    };
    requestOptions = {
        url: apiOptions.server + path,
        method:"POST",
        json: postData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 201) {
                res.redirect('login');
            }

            else {
                ///_showError(req, res, response.statusCode, 'signup');
                res.redirect('signup')
            }
        }
    )
});

module.exports.signUpCs = (function (req, res) {
    var requestOptions, path, postData;
    path='/api/consultants';
    postData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    };
    requestOptions = {
        url: apiOptions.server + path,
        method:"POST",
        json: postData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 201) {
                res.redirect('login');
            }
                
            else {
                ///_showError(req, res, response.statusCode, 'signup');
                res.redirect('signup')
            }
        }
    )
});

module.exports.signUpEn = (function (req, res) {
    var requestOptions, path, postData;
    path='/api/enterprises';
    postData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    };
    requestOptions = {
        url: apiOptions.server + path,
        method:"POST",
        json: postData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 201) {
                res.redirect('/login');
            }

            else {
                ///_showError(req, res, response.statusCode, 'signup');
                res.redirect('signup')
            }
        }
    )
});*/

// Request the Login page
module.exports.loginPageRender = (function (req, res) {
    if(req.user) return res.redirect('/dashboard');
    res.render('login', {
        title: 'Emploi1Pro | Connexion',
        errors: req.flash('errors'),
        success: req.flash('success')
    });
});

// Request the Verification page
module.exports.verifPageRender = (function (req, res) {//modifier pour renvoie d'email'
    res.render('verification', {
        title: 'Emploi1Pro | Vérification',
        errors: req.flash('errors'),
        success: req.flash('success')
    });
});
//verification du jeton e-mail confirmation
module.exports.verifJeton = (function (req, res) {
    User.findOne({ temporarytoken: req.params.token }, function (err, user) {
        if (err) throw err; // Throw error if cannot login
        var token = req.params.token; // Save the token from URL for verification 
        // Function to verify the user's token
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                //res.json({ success: false, message: 'Activation link has expired.' });// Token is expired
                //req.flash('errors', 'lien expiré, appuyer sur le bouton pour renvoyer le lien');
                return res.redirect('/verification');

            } else if (!user) {
                res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
            } else {
                user.temporarytoken = undefined; // Remove temporary token
                user.is_active = true; // Change account status to Activated
                user.confirmed = true;
                // Mongoose Method to save user into the database
                user.save(function (err) {
                    if (err) {
                        console.log(err); // If unable to save user, log error info to console/terminal
                    } else {
                        // If save succeeds, create e-mail object
                        const request = mailjet
                            .post("send")
                            .request({
                                "FromEmail": "news@aprentiv.com ",
                                "FromName": "Emploi1Pro",
                                "Subject": "[E-mail confirmé]",
                                "Text-part": "V",
                                "Html-part": '<h3>Votre email a été confirmé avec succés',
                                "Recipients": [{
                                    "Email": user.email
                                }]
                            })
                        request
                            .then(result => {
                                console.log(result.body)
                            })
                            .catch(err => {
                                console.log(err.statusCode)
                            })

                        // Send e-mail object to user
                        /*client.sendMail(email, function (err, info) {
                            if (err) console.log(err); // If unable to send e-mail, log error info to console/terminal
                        });*/
                        //res.json({ success: true, message: 'Account activated!' }); // Return success message to controller
                        req.flash('success', 'Compte Activé.');//26/04
                        return res.redirect('/login');
                    }
                });


            }
        });
    });
});

//renvoie du jeton
module.exports.verifEnvoie = (function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        //if (err) throw err;
        if (!user) {
            req.flash('errors', 'Cet email est incorrecte veuillez réessayer');
            return res.redirect('/verification');
        };
        async.waterfall([
            function (callback) {
                user.temporarytoken = jwt.sign({ first_name: user.first_name, lastname: user.last_name, email: user.email }, secret, { expiresIn: '1h' });
                user.save(function (err, user) {
                    var link = req.protocol + "://" + req.get('host') + "/verification/" + user.temporarytoken; //25/04
                    const request = mailjet
                        .post("send")
                        .request({
                            "FromEmail": "news@aprentiv.com ",
                            "FromName": "Emploi1Pro",
                            "Subject": "[Confirmez votre e-mail]",
                            "Text-part": "V",
                            "Html-part": '<h3>Bonjour ' + user.first_name + ', Pour valider votre adresse e- mail, veuillez cliquer sur le lien suivant : <p><a href="' + link + '"> Confirmez</a> ', //faire un href ' + token +'
                            "Recipients": [{
                                "Email": user.email
                            }]
                        })
                    request
                        .then(result => {
                            console.log(result.body)
                        })
                        .catch(err => {
                            console.log(err.statusCode)
                        })
                    if (err) return next(err);
                    callback(null, user);
                    req.flash('success', 'e-mail envoyé');
                    return res.redirect('/verification');
                });
            }]);

    });
});




module.exports.logOut = (function (req, res) {
    req.logout();
    res.redirect('/');
});

// Request the forgotten password page
module.exports.forgotten = (function (req, res) {//ok
    res.render('forgotten-pass', {
        title: 'Emploi1Pro',
        user: req.user,
        errors: req.flash('errors'),
        success: req.flash('success')
    });
});
module.exports.passEnvoie = (function(req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
            req.flash('errors', 'Aucun compte associé à cet e-mail.');
            return res.redirect('/forgotten');
        }
        async.waterfall([
                function (done) {
                    var token = jwt.sign({ first_name: user.first_name, lastname: user.last_name, email: user.email }, secret2, { expiresIn: '1h' });
                    done(err, token);
                },
            function (token, done) {
                User.findOne({ email: req.body.email }, function (err, user) {
                    if (!user) {
                        req.flash('errors', 'Aucun compte associé à cet e-mail.');
                        return res.redirect('/forgotten');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },
            //user.confirmed = false;
            function (token, user, done) {
                var link = req.protocol + "://" + req.get('host') + "/reset/" + token; //25/04
                const request = mailjet
                    .post("send")
                    .request({
                        "FromEmail": "news@aprentiv.com ",
                        "FromName": "Emploi1Pro",
                        "Subject": "[Réinitialisation du mot de passe]",
                        "Text-part": "V",
                        "Html-part": '<h3>Bonjour ' + user.first_name + ', Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : <p><a href="' + link + '"> Confirmez</a> ',
                        "Recipients": [{
                            "Email": user.email
                        }]
                    })
                request
                    .then(result => {
                        console.log(result.body)
                    })
                    .catch(err => {
                        console.log(err.statusCode)
                    })
                if (err) return next(err);
                req.flash('success', 'e-mail envoyé');
                return res.redirect('/forgotten');

            }]);
        });
    

    });//ok

// Request the renew password page
module.exports.renewPwd = (function (req, res) {
    if (req.body.password != req.body.confirm) {
        req.flash('errors', 'les mots de passe ne sont pas identiques');
        return res.redirect(req.get('referer'));
    }
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                console.log(user);
                if (!user) {
                    req.flash('errors', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                } 


                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function (err) {
                    req.logIn(user, function (err) {
                       
                    });
                });
            });
        },
        function (user, done) {
            const request = mailjet
                .post("send")
                .request({
                    "FromEmail": "news@aprentiv.com ",
                    "FromName": "Emploi1Pro",
                    "Subject": "[Réinitialisation du mot de passe]",
                    "Text-part": "V",
                    "Html-part": '<h3>Bonjour ' + user.first_name + ', votre mot de passe a été modifié avec succès',
                    "Recipients": [{
                        "Email": user.email
                    }]
                })
            request
                .then(result => {
                    console.log(result.body)
                })
                .catch(err => {
                    console.log(err.statusCode)
                })
            if (err) return next(err);
            done(null, user);
        }
    ], function (err) {
        res.redirect('/');
        })
    req.flash("success", "Mot de passe a été mise à jour");
    return res.redirect('/login');
});

module.exports.passVerif = (function (req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            req.flash('errors', 'Le lien est invalide ou expiré');
            return res.redirect('/forgotten');
        }
        console.log(user);
        res.render('reset', {
            token: req.params.token,
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    });
});//normalement ok


