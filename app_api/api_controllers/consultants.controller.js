/**
 * Created by nokamojd on 19/08/2016.
 */

var mongoose = require('mongoose');
var Consultant = require('../models/consultant.schema');

var sendJsonResponse = (function(res, status, content) {
    res.status(status);
    res.send(content);
});


// Mapping consultants to elastic search
// Consultant.createMapping(function(err, mapping){
//     if(err){
//         console.log("error creating mapping on Consultants");
//         console.log(err);
//     } else{
//         console.log("Mapping created on Consultants");
//         console.log(mapping);
//     }
// });

var stream = Consultant.synchronize();
var count = 0;

stream.on('data', function() {
    count++;
});

stream.on('close', function() {
    console.log("Indexed " + count + " Consultants document(s)");
});

stream.on('error', function(err) {
    console.log(err);
});


module.exports.consultantsCreate = (function(req, res) {
    Consultant.create({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        user_role: req.body.role
    }, function(err, role) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, role);
        }
    });
});


module.exports.consultantsList = (function(req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    Consultant.find(function(err, consultants_all) {
        if (!consultants_all) {
            sendJsonResponse(res, 404, {
                "message": "No users found"
            });
        } else {
            sendJsonResponse(res, 200, consultants_all);
        }
    }).populate('related_user');
});



module.exports.consultantsGetOne = (function(req, res) {
    if (req.params && req.params.id_consultant) {
        Consultant
            .findById(req.params.id_consultant)
            .populate('related_user')
            .exec(function(err, consultant) {
                if (!consultant) {
                    sendJsonResponse(res, 404, {
                        "message": "id_consultant not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, consultant);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_consultant in request"
        });
    }
});


module.exports.getConsultantByUserId = (function(req, res) {
    if (req.params && req.params.id_user) {
        Consultant
            .find({ 'related_user': { $in: req.params.id_user } })
            .populate('related_user')
            .exec(function(err, consultant) {
                if (!consultant) {
                    sendJsonResponse(res, 404, {
                        "message": "id_consultant not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, consultant);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_consultant in request"
        });
    }
});


module.exports.offersByAuthor = (function(req, res) {
    if (req.params && req.params.id_user) {
        Offer
            .findOne({ 'offer_author': { $in: req.params.id_user } })
            .populate('offer_field offer_author')
            .exec(function(err, offers_all) {
                if (!offers_all) {
                    sendJsonResponse(res, 404, {
                        "message": "No offers found"
                    });
                } else {
                    sendJsonResponse(res, 200, offers_all);
                }
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_author in request"
        });
    }
});

/************************************* CONSULTANTS CRUD METHODS ********************************
module.exports.consultantsUpdateOne = (function (req, res) {
    if (!req.params.id_user) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_user is required"
        });
        return;
    }
    Consultant
        .findById(req.params.id_user)
        .exec(
            function(err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, {
                        "message": "id_user not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                user.first_name = req.body.firstName;
                user.last_name = req.body.lastName;
                user.email = req.body.email;
                user.password = req.body.password;
                user.user_role = req.body.role;
                user.is_certified = req.body.certified;
                user.is_active = req.body.active;
                user.save(function(err, user) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, user);
                    }
                });
            }
        );
});

module.exports.consultantsDeleteOne = (function (req, res) {
    var id_user = req.params.id_user;
    if (id_user) {
        Consultant
            .findByIdAndRemove(id_user)
            .exec(
                function(err, user) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_user"
        });
    }
});

*/