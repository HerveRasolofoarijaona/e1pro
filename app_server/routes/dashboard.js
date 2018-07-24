/**
 * Created by nokamojd on 31/07/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var async = require('async');

var othersCrtlr = require('../controllers/others.controller');
var catalogsCtrlr = require('../controllers/catalogs.controller');
var usersCtrlr = require('../controllers/users.controller');
var authCtrlr = require('../controllers/auth.controller.js');
var fieldsCtrlr = require('../controllers/fields.controller');
var rolesCtrlr = require('../controllers/roles.controller');
var langCtrlr = require('../controllers/languages.controller');
var statusCtrlr = require('../controllers/status.controller');
var skillsCtrlr = require('../controllers/skills.controller');
var offersCtrlr = require('../controllers/offers.controller');
var demandsCtrlr = require('../controllers/demands.controller');
var chatCtrlr = require('../controllers/chat.controller');
var chatEmpCtrlr = require('../controllers/chatEmploi1.controller');
var devisCtrlr = require('../controllers/devis.controller');
/* GET dashboard pages. */

// Dashboard Home
router.get('/',othersCrtlr.dashHomePage);

// GET post form pages
router.get('/offers/new', catalogsCtrlr.createOffer);
router.get('/demands/new', catalogsCtrlr.createDemand);
router.get('/offers/consultants/consultant-details', catalogsCtrlr.createDemand);



// Get all fields
router.get('/fields', fieldsCtrlr.allfields);
// Get one field based on its id
router.get('/fields/:idfield', fieldsCtrlr.getOneField);
router.get('/fields/new', fieldsCtrlr.newField);
router.post('/fields', fieldsCtrlr.addField);
router.put('/fields/:idfield', fieldsCtrlr.updateField);
router.delete('/fields/:idfield', fieldsCtrlr.deleteField);


// SKILLS CRUD
router.get('/skills', skillsCtrlr.allSkills);
router.get('/skills/:id_skill', skillsCtrlr.getOneSkill);
router.post('/skills', skillsCtrlr.addSkill);
router.put('/skills/:id_skill', skillsCtrlr.updateSkill);
router.delete('/skills/:id_skill', skillsCtrlr.deleteSkill);
// SUB SKILLS CRUD
router.post('/skills/:id_skill', skillsCtrlr.addSubSkill);
router.put('/skills/:id_skill/sub-skills/:id_inner_skill', skillsCtrlr.updateSubSkill);
router.delete('/skills/:id_skill/sub-skills/:id_inner_skill', skillsCtrlr.deleteSubSkill);


// LANGUAGES CRUD
router.get('/languages', langCtrlr.allLanguages);
router.post('/languages', langCtrlr.addLanguage);
router.put('/languages/:id_language', langCtrlr.updateLanguage);
router.delete('/languages/:id_language', langCtrlr.deleteLanguage);


// LEGAL STATUS CRUD
router.get('/legal-status', statusCtrlr.allStatus);
router.post('/legal-status', statusCtrlr.addStatus);
router.put('/legal-status/:id_status', statusCtrlr.updateStatus);
router.delete('/legal-status/:id_status', statusCtrlr.deleteStatus);

// USERS CRUD
router.get('/users', usersCtrlr.allUsers);
router.post('/users', usersCtrlr.addUser);
router.get('/users/user/:id_user', usersCtrlr.getOneUser);
router.put('/users/:id_user', usersCtrlr.updateUser);
router.delete('/users/:id_user', usersCtrlr.deleteUser);

router.get('/u/profile/:id_user', usersCtrlr.getUserProfile);
router.get('/u/settings', usersCtrlr.getUserSettings);
router.put('/u/settings/:id_user', usersCtrlr.editPersonalDetails);
router.put('/u/settings/bio/:id_user', usersCtrlr.editUserBio);
router.post('/u/settings/skill/:id_user', usersCtrlr.editUserSkills);
router.delete('/u/settings/skills/:id_user/skill/:id_user_skill', usersCtrlr.deleteUserSkill);


// ROLES CRUD
router.get('/users/roles', rolesCtrlr.allRoles);
router.put('/users/roles/:id_role', rolesCtrlr.updateRole);


// OFFERS CRUD
router.get('/offers', offersCtrlr.allOffers);
router.get('/offers/u/:id_user', offersCtrlr.allOffersByAuthor);
router.get('/offers/u/:id_user/offer/new', offersCtrlr.getOfferForm);
router.post('/offers/u/:id_user/offer/new', offersCtrlr.addOffer);//modif 16/05
router.get('/offers/:id_offer', offersCtrlr.getOneOffer);
router.put('/offers/:id_offer', offersCtrlr.updateOffer);
router.delete('/offers/:id_offer', offersCtrlr.deleteOffer);

// DEMANDS CRUD
router.get('/demands', demandsCtrlr.allDemands);
router.get('/demands/u/:id_user', demandsCtrlr.allDemandsByAuthor);
router.get('/demands/u/:id_user/demand/new', demandsCtrlr.getDemandForm);
router.post('/demands/u/:id_user/demand/new', demandsCtrlr.addDemand);
router.get('/demands/:id_demand', demandsCtrlr.getOneDemand);
router.put('/demands/:id_demand', demandsCtrlr.updateDemand);
router.delete('/demands/:id_demand', demandsCtrlr.deleteDemand);

//DEVIS CRUD
router.get('/devis', devisCtrlr.allDevis);
router.get('/devis/u/:id_user', devisCtrlr.allDevisForUser);// afficher les devis liés à cet utilisateur
router.get('/devis/u/:id_user/:id_devis', devisCtrlr.allDevisForUser);
router.get('/devis/:id_devis', devisCtrlr.detailsDevis);// afficher le devis détaillé
router.get('/devis/:id_devis/status', devisCtrlr.detailsDevis);// page render pour le route du bas 
router.put('/devis/:id_devis', devisCtrlr.returnDevis);// retourner la décision de l'entreprise, gère les boutons Accepter, refuser, negocier
router.delete('/devis/u/:id_user/:id_devis', devisCtrlr.deleteDevis);// supprimer le devis

//router.put('/devis/u/:id_user', demandsCtrlr.updateDevis);// pour mettre à jour si Devis accepter ou non



var offersReviewsCtrlr = require('../controllers/offersReviews.controller');
// OFFERS REVIEWS CRUD
router.get('/o/reviews', offersReviewsCtrlr.allOffersReviews);
router.put('/o/reviews/:id_offer_review', offersReviewsCtrlr.updateReview);
router.delete('/o/reviews/:id_offer_review', offersReviewsCtrlr.deleteReview);

//CHAT 
router.get('/conversations/:id_devis', chatCtrlr.chats);
//router.post('/conversations/:id_devis', chatCtrlr.negoNotif);

//MES COMMANDES
var payCtrlr = require('../controllers/payment.controller');
router.get('/commandes/:id_user', payCtrlr.commandePageRender); // Mes Commandes
router.get('/commandes', payCtrlr.allCommand); // toutes les commandes (mode administrateur)
//router.get();

//RIB, Cartes enregistrées
router.get('/rib', payCtrlr.GetRib); //afficher les rib enregistrés sur LEMONWAY
router.post('/rib/register', payCtrlr.RegisterRib); // Enregistrer ou modifier un rib


module.exports = router;
