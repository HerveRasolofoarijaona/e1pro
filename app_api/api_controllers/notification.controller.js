var mongoose = require('mongoose');
var Notif = require('../models/notification.schema');

var sendJsonResponse = (function(res, status, content) {
    res.status(status);
    res.send(content);
});

module.exports.AvisNotif = (function(req, res) { //pour les nouveaux avis à mettre dans le controlleur lié au submit app_api
    var notif = new Notif();
    notif.sender = req.body.sender;
    notif.offer = req.body.offer_id;
    notif.modif.avis = req.body.avis;
    notif.save(function(err, notif) {
        if (err) return next(err);
    });
});

module.exports.newDevisNotif = (function(req, res) { //pour les nouveaux devis à mettre dans le controlleur lié au submit app_api
    var notif = new Notif();
    notif.sender = req.body.sender;
    notif.demand = req.body.demand_id;
    notif.modif.new_devis = req.body.new_devis;
    notif.save(function(err, notif) {
        if (err) return next(err);
    });
});

module.exports.notifByAuthor = (function(req, res) { // get afficher toutes les notifications liées à l'utilisateur utiliser ajax pour l'affichage'
    Notif
        .find({ $or: [{ 'sender': { '$in': req.params.id_user } }, { 'offer.offer_author': req.params.id_user }, { 'demand.demand_author': req.params.id_user }, { 'devis.devis_author': req.params.id_user }] })
        .populate('sender devis demand offer')
        .exec(function(err, notif) {
            if (!notif) {
                sendJsonResponse(res, 404, {
                    "message": "No devis found"
                });
            } else if (err) {
                sendJsonResponse(res, 404, err);
                return;
            }
            sendJsonResponse(res, 200, notif);
        });
});
// $or: [{ 'sender': { '$in': req.params.id_user } }, { 'author_dmd': { '$in': req.params.id_user } }]