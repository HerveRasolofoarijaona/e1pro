/**
 * Created by nokamojd on 16/08/2016.
 */

var mongoose = require('mongoose');
var Role = require('../models/role.schema.js');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});

module.exports.rolesImport = (function (req, res) {
    Role.create(
        { "role": "Consultant"},
        { "role": "Entreprise"},
        { "role": "Administrateur"},
        function (err) {
            if (err) return console.log(err);
            return res.send(202);
        });
});

module.exports.rolesList = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    Role.find({},function(err, roles_all) {
        if (!roles_all) {
            sendJsonResponse(res, 404, {
                "message": "No roles found"
            });
        }
        else {
            sendJsonResponse(res, 200, roles_all);
        }
    });
});

module.exports.rolesGetOne = (function (req, res) {
    if (req.params && req.params.id_role) {
        Role
            .findById(req.params.id_role)
            .exec(function(err, role) {
                if (!role) {
                    sendJsonResponse(res, 404, {
                        "message": "id_role not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, role);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_role in request"
        });
    }
});

module.exports.rolesCreate = (function (req, res) {
    Role.create({
        role: req.body.role_label
    }, function(err, role) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, role);
        }
    });
});

module.exports.rolesUpdateOne = (function (req, res) {
    if (!req.params.id_role) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_role is required"
        });
        return;
    }
    Role
        .findById(req.params.id_role)
        .exec(
            function(err, role) {
                if (!role) {
                    sendJsonResponse(res, 404, {
                        "message": "id_role not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                role.role = req.body.role_label;
                role.save(function(err, role) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, role);
                    }
                });
            }
        );
});

module.exports.rolesDeleteOne = (function (req, res) {
    var id_role = req.params.id_role;
    if (id_role) {
        Role
            .findByIdAndRemove(id_role)
            .exec(
                function(err, role) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_role"
        });
    }
});