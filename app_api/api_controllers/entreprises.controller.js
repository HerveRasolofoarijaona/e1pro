/**
 * Created by nokamojd on 19/08/2016.
 */
var mongoose = require('mongoose');
/*var Enterprise = require('../models/enterprise.schema');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});


/************************************* ENTERPRISES CRUD METHODS ********************************

module.exports.enterprisesCreate = (function (req, res) {
    Enterprise.create({
        first_name : req.body.firstName,
        last_name : req.body.lastName,
        email : req.body.email,
        password: req.body.password,
        user_role : req.body.role
    }, function(err, role) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, role);
        }
    });
});


module.exports.enterprisesList = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    Enterprise.find(function(err, enterprises_all){
        if (!enterprises_all) {
            sendJsonResponse(res, 404, {
                "message": "No users found"
            });
        }
        else {
            sendJsonResponse(res, 200, enterprises_all);
        }
    }).populate('user_role');
});

module.exports.enterprisesGetOne = (function (req, res) {
    if (req.params && req.params.id_user) {
        Enterprise
            .findById(req.params.id_user)
            .populate('user_role')
            .exec(function(err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, {
                        "message": "id_user not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, user);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_user in request"
        });
    }
});


module.exports.enterprisesUpdateOne = (function (req, res) {
    if (!req.params.id_user) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_user is required"
        });
        return;
    }
    Enterprise
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

module.exports.enterprisesDeleteOne = (function (req, res) {
    var id_user = req.params.id_user;
    if (id_user) {
        Enterprise
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