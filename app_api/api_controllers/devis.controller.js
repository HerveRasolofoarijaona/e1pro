var mongoose = require('mongoose');
var Devis = require('../models/devis.schema');
var Notif = require('../models/notification.schema');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});

// création de devis
module.exports.devisCreate = (function (req, res) {
    var devis = new Devis();
    devis.mission_title= req.body.mission;
    devis.reference = req.body.reference;
    devis.date_debut = req.body.date_db;
    devis.date_fin = req.body.date_fn;
    devis.quantity = req.body.quantity;
    devis.tarif_unit = req.body.tf_u;
    devis.unit = req.body.unit;
        //devis.total_price= req.body.total;
    devis.devis_author = req.body.devis_authr;
    devis.save(function (err, devis) {
        if (err) return next(err)

    })
});
//listes des devis pour le moderateur
module.exports.allDevis = (function (req, res) {
    Devis
        .find({})
        .populate('devis_author')
        .exec(function (err, devis_all) {
            if (!devis_all) {
                sendJsonResponse(res, 404, {
                    "message": "No devis found"
                });
            }
            else if (err) {
                sendJsonResponse(res, 404, err);
                return;
            }
            //console.log("app-api " + devis_all[2].devis_author.name);
            sendJsonResponse(res, 200, devis_all); //ça marche ok            
        });
});
//Devis liés aux demandes du User
module.exports.allDevisForUser = (function (req, res) {
    Devis
        .find({ $or: [{'devis_author': { '$in': req.params.id_user }} ,{'author_dmd': { '$in': req.params.id_user } } ]})
        .populate('devis_author')
        .exec(function (err, devis) {
            console.log("devis controller : " + devis);
            if (!devis) {
                sendJsonResponse(res, 404, {
                    "message": "No devis found"
                });
            }
            else if (err) {
                sendJsonResponse(res, 404, err);
                return;
            }
            else {    //console.log("app-api " + devis_all[2].devis_author.name);
                sendJsonResponse(res, 200, devis); //ça marche ok 
            }
        });
});

//Devis spécifique (en particulier) pour la consultation par l'entreprise
module.exports.devisGetOne = (function (req, res) {
    if (req.params && req.params.id_devis) {
        Devis
            /*.update({ '_id': req.params.params }, { //si devis est ouvert 'lu' devient true
                $set: {
                    'lu': true,
                }
            })*/
            .findById(req.params.id_devis)
            .populate('devis_author reference author_dmd')
            .exec(function (err, devis) {
                if (!devis) {
                    sendJsonResponse(res, 404, {
                        "message": "id_devis not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                devis.status_devis.lu = true;//si devis est ouvert 'lu' devient true
                devis.save(function (err, devis) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, devis);
                    }
                });
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_devis in request"
        });
    }
});

//approbation devis côté moderateur,Admin
module.exports.approuved = function (req, res) {
    if (!req.params.id_devis) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_devis is required"
        });
        return;
    }
    Devis
        .findById({ '_id': req.params.id_devis })
        .exec(
        function (err, devis) {
            if (!devis) {
                sendJsonResponse(res, 404, {
                    "message": "id_devis not found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            devis.status_devis.approuved = req.body.approuved;
            devis.save(function (err, devis) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, devis);
                    console.log('Devis n°: ' + req.params.id_devis + ' approuvé' );
                }
            });
        }
        );
};
//approbation devis côté consultant,entreprise
module.exports.devisUpdateStatus = function (req, res) {
    if (!req.params.id_devis) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_devis is required"
        });
        return;
    }
    Devis
        .findById({ '_id': req.params.id_devis })
        .exec(
        function (err, devis) {
            if (!devis) {
                sendJsonResponse(res, 404, {
                    "message": "id_devis not found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            devis.status_devis.is_accepted = req.body.accept;
            devis.status_devis.en_attente = req.body.attente;
            devis.status_devis.negocier = req.body.negociate;
            devis.save(function (err, devis) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, devis);
                    console.log('sauvegardé');
                }
            });
        }
        );
};
//modifier les données de l'attributs négociation
module.exports.devisNegociation = function (req, res, next) {
    if (!req.params.id_devis) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_devis is required"
        });
        return;
    }
    var notif = new Notif(); //notification
    //console.log("notif controller ok");
    notif.sender = req.body.sender;
    notif.devis = req.params.id_devis;
    notif.modif.devis_nego = "true";
    notif.save(function (err, notif) {
        if (err) return next(err)
    });
    Devis
        .findById({ '_id': req.params.id_devis })
        .exec(
        function (err, devis) {
            if (!devis) {
                sendJsonResponse(res, 404, {
                    "message": "id_devis not found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            devis.negociation.motif_prix = req.body.motif_1;
            devis.negociation.motif_datedb = req.body.motif_2;
            devis.negociation.motif_duree = req.body.motif_3;
            devis.negociation.new_date_db = req.body.date_db;
            devis.negociation.new_date_fn = req.body.date_fn;
            devis.negociation.new_price = req.body.prix;
            devis.save(function (err, devis) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, devis);
                    console.log('devis.controller');
                }
            });
        }
        );
};

module.exports.devisDeleteOne = (function (req, res) {
    var id_devis = req.params.id_devis;
    if (id_devis) {
        Devis
            .findByIdAndRemove(id_devis)
            .exec(
            function (err, devis) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 204, null);
            }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_devis"
        });
    }
});

