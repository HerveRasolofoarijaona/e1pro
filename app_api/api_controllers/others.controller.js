var mongoose = require('mongoose');
var async = require('async');
var User = require('../models/user.schema.js');
var Devis = require('../models/devis.schema.js');
var Command = require('../models/commande.schema.js');

var sendJsonResponse = (function(res, status, content) {
    res.status(status);
    res.send(content);
});

module.exports.dataGet = (function(req, res) {
    async.parallel({
        user: function(callback) {
            User.find({}, function(err, user) {
                    if (!user) {
                        sendJsonResponse(res, 404, {
                            "message": "il n'y a pas d'inscrit"
                        });
                    } else if (err) {
                        sendJsonResponse(res, 400, err);
                        return;
                    }
                })
                .exec(callback);
        },
        devis: function(callback) {
            Devis.find({ "status_devis.is_accepted": true }, function(err, devis) {
                    if (!devis) {
                        sendJsonResponse(res, 404, {
                            "message": "No devis found"
                        });
                    }
                    /*else {
                        sendJsonResponse(res, 200, demands_all);
                    }*/
                })
                .exec(callback);
        },
        commands: function(callback) {
            Command.find({}, function(err, command) {
                    if (!command) {
                        sendJsonResponse(res, 404, {
                            "message": "No command found"
                        });
                    }
                    /*else {
                        sendJsonResponse(res, 200, demands_all);
                    }*/
                })
                .exec(callback);
        },
    }, function(err, results) { //faire une erreur pour les trois donn�es
        if (err) { return next(err); } // Error in API usage.
        if (results.user == null) { // No results.
            var err1 = new Error('Author not found');
            err1.status = 404;
            return next(err1);
        }
        // Successful
        var data = [];
        data.push(results.user);
        data.push(results.devis);
        data.push(results.commands);
        sendJsonResponse(res, 200, data);
    });
});