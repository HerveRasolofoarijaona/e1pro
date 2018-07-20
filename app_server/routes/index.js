var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportConf = require('../../passport-conf');


var othersCrtlr = require('../controllers/others.controller');
var catalogsCtrlr = require('../controllers/catalogs.controller');
var usersCtrlr = require('../controllers/users.controller');
var authCtrlr = require('../controllers/auth.controller.js');
var expressValidator = ('express-validator');

var mongoose = require('mongoose');
require('../../app_api/models/user.schema');
require('../../app_api/models/cart.schema');
require('../../app_api/models/consultant.schema.js');
require('../../app_api/models/enterprise.schema.js');
var User = mongoose.model('User');
var Cart = mongoose.model('Cart');
var Consultant = mongoose.model('Consultant');
var Enterprise = mongoose.model('Enterprise');


/* GET accueil and static pages. */
router.get('/', othersCrtlr.accueil);
router.get('/mentions-legales', othersCrtlr.mention);
router.get('/confidentialite', othersCrtlr.confidentialite);
router.get('/termes-et-conditions', othersCrtlr.termes);
router.get('/cookies', othersCrtlr.cookies);
router.get('/nous-contacter', othersCrtlr.contacter);
router.get('/envoi-mail', othersCrtlr.envoiMail);
router.get('/a-propos', othersCrtlr.propos);
router.get('/presse', othersCrtlr.presse);
router.get('/help', othersCrtlr.help);
router.get('/denied', othersCrtlr.denied);
//router.get('/offers/consultants/consultant-details', catalogsCtrlr.createDemand);

/* GET Reglog pages */
router.get('/signup', authCtrlr.signupPageRender);
router.get('/enterprise/signup', authCtrlr.businessSignupPageRender);
//router.post('/signup', authCtrlr.signUp);
//router.post('/signup/u1', authCtrlr.signUpCs);
//router.post('/signup/u0', authCtrlr.signUpEn);



// Sign up for enterprise user
router.post('/enterprise/signup', authCtrlr.signupEntreprise);



// Sign up for consultant user
router.post('/signup', authCtrlr.signupConsultant);

//Confirmation e-mail 25/04
router.get('/verification/:token', authCtrlr.verifJeton);
//renvoie email
router.get('/verification', authCtrlr.verifPageRender);
router.post('/verification', authCtrlr.verifEnvoie);

//router.get('/verification', authCtrlr.verifPageRender);

// Login user directly
router.get('/login', authCtrlr.loginPageRender);
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));


router.get('/logout', authCtrlr.logOut);
//mot de passe oublié
router.get('/forgotten', authCtrlr.forgotten);
router.post('/forgotten', authCtrlr.passEnvoie);
router.get('/reset/:token', authCtrlr.passVerif);
router.post('/reset/:token', authCtrlr.renewPwd);// :token


/* GET Catalogs pages */
router.get('/offers', catalogsCtrlr.offers);
router.get('/demands', catalogsCtrlr.demands);
router.get('/consultants', catalogsCtrlr.consultants);

/* GET post details pages */
//router.get('/offers/:id_offer/:id_author', catalogsCtrlr.offerDetails);
router.get('/offers/:id_offer', catalogsCtrlr.offerDetails);
router.get('/demands/:id_demand', catalogsCtrlr.demandDetails);
router.get('/consultants/:id_user', catalogsCtrlr.consultantDetails);

// test pour devis
var devisCtrlr = require('../controllers/devis.controller');
router.post('/demands/:id_demand', devisCtrlr.devisCreate);//envoyer les données du devis 15/05/2018

/* POST REVIEW */
router.post('/offers/:id_offer', catalogsCtrlr.postReview);

/* Add Item to cart */
router.put('/offers/:id_offer', catalogsCtrlr.addToCart);
router.post('/cart/remove', catalogsCtrlr.removeItemFromCart);

/* Get Cart page */
var cartCtrlr = require('../controllers/cart.controller');
router.get('/cart', cartCtrlr.getCart);

// Get Paiement Page 21/06/18
var payCtrlr = require('../controllers/payment.controller');
router.get('/cart/pay/:id_user', payCtrlr.pay); 
router.get('/cart/pay/validation/:id_user', payCtrlr.validationPage);//validation des infos bancaires
router.get('/cart/pay/confirm/:id_user', payCtrlr.confirm);//page de confirmation de la commande et envoie du paiement avec la facture, etc...
router.post('/cart/pay/validation/:id_user', payCtrlr.validationCommande);//validation des infos bancaires
router.post('/cart/pay/valider', payCtrlr.MoneyInWithCardId);

/* Get search pages */
var searchCtrlr = require('../controllers/search.controller');
router.post('/search', searchCtrlr.searchRequest);
router.get('/search', searchCtrlr.offersSearch);



/* GET consultants pages
router.get('/consultants', usersCtrlr.userAll);
router.get('/consultants/consultant-details', usersCtrlr.);*/
//userProfil
module.exports = router;
