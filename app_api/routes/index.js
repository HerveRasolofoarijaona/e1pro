var express = require('express');
var router = express.Router();

//DASHBOARD DATA
var othersCtrl = require('../api_controllers/others.controller');

router.get('/data', othersCtrl.dataGet);

var fieldsCtrl = require('../api_controllers/fields.controller');
// Fields CRUD
router.get('/fields', fieldsCtrl.fieldsList);
router.get('/fields/:idfield', fieldsCtrl.fieldsGetOne);
router.post('/fields', fieldsCtrl.fieldsCreate);
router.put('/fields/:idfield', fieldsCtrl.fieldsUpdateOne);
router.delete('/fields/:idfield', fieldsCtrl.fieldsDeleteOne);
router.get('/import-fields', fieldsCtrl.import);

// Inner Fields CRUD
/*
router.get('/fields/:idfield/innerfields/:idinnerfield', fieldsCtrl.innerFieldsGetOne);
router.post('/fields/:idfield/innerfields', fieldsCtrl.innerFieldsCreate);
router.put('/fields/:idfield/innerfields/:idinnerfield', fieldsCtrl.innerFieldsUpdateOne);
router.delete('/fields/:idfield/innerfields/:idinnerfield', fieldsCtrl.innerFieldsDeleteOne);
//router.get('/importinnerfields', fieldsCtrl.importinner);
*/


var rolesCtrl = require('../api_controllers/roles.controller');
// Roles CRUD
router.get('/roles', rolesCtrl.rolesList);
router.get('/roles/:id_role', rolesCtrl.rolesGetOne);
router.post('/roles', rolesCtrl.rolesCreate);
router.put('/roles/:id_role', rolesCtrl.rolesUpdateOne);
router.delete('/roles/:id_role', rolesCtrl.rolesDeleteOne);
router.get('/import-roles', rolesCtrl.rolesImport);


var langCtrl = require('../api_controllers/languages.controller');
// Languages CRUD
router.get('/languages', langCtrl.languagesList);
router.get('/languages/:id_language', langCtrl.languagesGetOne);
router.post('/languages', langCtrl.languagesCreate);
router.put('/languages/:id_language', langCtrl.languagesUpdateOne);
router.delete('/languages/:id_language', langCtrl.languagesDeleteOne);
router.get('/import-languages', langCtrl.languagesImport);


var statusCtrl = require('../api_controllers/status.controller');
// Status CRUD
router.get('/status', statusCtrl.statusList);
router.get('/status/:id_status', statusCtrl.statusGetOne);
router.post('/status', statusCtrl.statusCreate);
router.put('/status/:id_status', statusCtrl.statusUpdateOne);
router.delete('/status/:id_status', statusCtrl.statusDeleteOne);
router.get('/import-status', statusCtrl.statusImport);


var skillsCtrl = require('../api_controllers/skills.controller');
// Skills CRUD
router.get('/skills', skillsCtrl.skillsList);
router.get('/skills/:id_skill', skillsCtrl.skillsGetOne);
router.post('/skills', skillsCtrl.skillsCreate);
router.put('/skills/:id_skill', skillsCtrl.skillsUpdateOne);
router.delete('/skills/:id_skill', skillsCtrl.skillsDeleteOne);
router.get('/import-skills', skillsCtrl.skillsImport);

// Inner Skills CRUD
router.get('/skills/:id_skill/sub-skills/:id_inner_skill', skillsCtrl.innerSkillsGetOne);
router.post('/skills/:id_skill/sub-skills', skillsCtrl.innerSkillsCreate);
router.put('/skills/:id_skill/sub-skills/:id_inner_skill', skillsCtrl.innerSkillsUpdateOne);
router.delete('/skills/:id_skill/sub-skills/:id_inner_skill', skillsCtrl.innerSkillsDeleteOne);
//router.get('/importinnerfields', fieldsCtrl.importinner);


// Users CRUD
var usersCtrl = require('../api_controllers/users.controller');
router.get('/users', usersCtrl.usersList);
router.get('/users/:id_user', usersCtrl.usersGetOne);
router.post('/users', usersCtrl.usersCreate);
router.put('/users/:id_user', usersCtrl.usersUpdateOne);
router.delete('/users/:id_user', usersCtrl.usersDeleteOne);
router.get('/import-users', usersCtrl.usersImport);
// update user personnal details
router.put('/users/details/:id_user', usersCtrl.usersUpdatePersoDetails);
router.put('/users/bio/:id_user', usersCtrl.usersUpdateOneBio);
router.post('/users/skill/:id_user', usersCtrl.usersAddOneSkill);
router.delete('/users/skills/:id_user/skill/:id_user_skill', usersCtrl.usersDeleteOneSkill);


/* User type CRUD Consultant */
var csCtrl = require('../api_controllers/consultants.controller');
router.get('/consultants', csCtrl.consultantsList);
router.get('/consultants/:id_consultant', csCtrl.consultantsGetOne);
router.post('/consultants', csCtrl.consultantsCreate);
router.get('/consultants/consultant/:id_user', csCtrl.getConsultantByUserId);
//router.put('/consultants/:id_user', csCtrl.consultantsUpdateOne);
//router.delete('/consultants/:id_user', csCtrl.consultantsDeleteOne);
/*
// Enterprise
var enCtrl = require('../api_controllers/enterprises.controller');
router.get('/enterprises', enCtrl.enterprisesList);
router.get('/enterprises/:id_user', enCtrl.enterprisesGetOne);
router.post('/enterprises', enCtrl.enterprisesCreate);
router.put('/enterprises/:id_user', enCtrl.enterprisesUpdateOne);
router.delete('/enterprises/:id_user', enCtrl.enterprisesDeleteOne);*/

// Offers CRUD
var offersCtrl = require('../api_controllers/offers.controller');
router.get('/offers', offersCtrl.offersList);
router.get('/offers/:id_offer', offersCtrl.offersGetOne);
router.post('/offers', offersCtrl.offersCreate);
router.get('/offers/author/:id_user', offersCtrl.offersByAuthor);
router.put('/offers/:id_offer', offersCtrl.offersUpdateOne);
router.delete('/offers/:id_offer', offersCtrl.offersDeleteOne);

// Demands CRUD
var dmdsCtrl = require('../api_controllers/demands.controller');
router.get('/demands', dmdsCtrl.demandsList);
router.get('/demands/:id_demand', dmdsCtrl.demandsGetOne);
router.put('/demands/approuve/:id_demand', dmdsCtrl.demandApprouve);
router.post('/demands', dmdsCtrl.demandsCreate);
router.get('/demands/author/:id_user', dmdsCtrl.demandsByAuthor);
router.put('/demands/:id_demand', dmdsCtrl.demandsUpdateOne);
router.delete('/demands/:id_demand', dmdsCtrl.demandsDeleteOne);

//Devis CRUD
var devisCtrl = require('../api_controllers/devis.controller');
router.post('/demands/:id_demand', devisCtrl.devisCreate); //demand car formulaire dans le view de demand-detail
router.get('/devis', devisCtrl.allDevis);
router.get('/devis/u/:id_user', devisCtrl.allDevisForUser);
router.get('/devis/:id_devis', devisCtrl.devisGetOne);
router.put('/devis/:id_devis', devisCtrl.devisUpdateStatus);
router.put('/devis/approuved/:id_devis', devisCtrl.approuved); //Approuver le devis
router.put('/conversation/update/:id_devis', devisCtrl.devisNegociation); //negociation depuis la conversation
router.delete('/devis/:id_devis', devisCtrl.devisDeleteOne);




// offerReview CRUD
var offReviewCtrlr = require('../api_controllers/offerReview.controller');
router.get('/reviews', offReviewCtrlr.offerReviewsList);
router.get('/reviews/:id_offer_review', offReviewCtrlr.offerReviewsGetOne);
router.get('/reviews/all/:id_offer', offReviewCtrlr.reviewsByOffer);
router.get('/reviews/approved/:id_offer', offReviewCtrlr.reviewsApprovedByOffer);
router.post('/reviews', offReviewCtrlr.offerReviewsCreate);
router.put('/reviews/:id_offer_review', offReviewCtrlr.offerReviewsUpdateOne);
router.delete('/reviews/:id_offer_review', offReviewCtrlr.offerReviewsDeleteOne);

//Conversation CRUD
var chatCtrlr = require('../api_controllers/chat.controller');
//router.get('/conversation/:id_devis', chatCtrlr.getConv); //afficher la conversation
//router.post('/conversation/save', chatCtrlr.saveConv);

// notification CRUD
var notifCtrlr = require('../api_controllers/notification.controller');
router.get('/notif/show/:id_user', notifCtrlr.notifByAuthor); // affichage notif
router.post('/notif/avis', notifCtrlr.AvisNotif);
router.post('/notif/newDevis', notifCtrlr.newDevisNotif);
//router.post('/notif/negoDevis/:id_devis', notifCtrlr.DevisNotif);

// Card, Payment, RIB
var payCtrlr = require('../api_controllers/payment.controller');
router.get('/pay/cardRegistered/:id_user', payCtrlr.GetCard); //affichage des cartes enregistr�es
router.post('/pay/cardRegistered/:id_user', payCtrlr.RegisterCard);
router.delete('/pay/cardRegistered/:id_user', payCtrlr.UnRegisterCard);

router.get('/pay/validation/:id_user', payCtrlr.ValidCommand);
router.post('/pay/validation/:id_user', payCtrlr.ValidCommandCard); //enregistrer l'id carte choisi
router.get('/pay/confirm/:id_user', payCtrlr.ValidCommand);

router.get('/command/:id_user', payCtrlr.commandePageRender); //Mes commandes
router.get('/command', payCtrlr.allCommand); //Toutes les commandes
router.post('/pay/valider/:id_user', payCtrlr.MoneyInWithCardId);

//router.get('/rib', payCtrlr.GetRib); //afficher les rib enregistr�s sur LEMONWAY
router.get('/rib/:id_user', payCtrlr.GetIBAN);
router.post('/rib/registerRib', payCtrlr.RegisterRib); // Enregistrer ou modifier un rib



module.exports = router;