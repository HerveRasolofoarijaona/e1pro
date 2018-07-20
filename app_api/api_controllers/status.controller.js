/**
 * Created by nokamojd on 16/08/2016.
 */

var mongoose = require('mongoose');
var Status = require('../models/status.schema');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});

module.exports.statusImport = (function (req, res) {
    Status.create(
        { "status": "ENTREPRISE INDIVIDUELLE"},
        { "status": "ENTREPRISE UNIPERSONNELLE À RESPONSABILITÉ LIMITÉE (EURL)"},
        { "status": "SOCIÉTÉ À RESPONSABILITÉ LIMITÉE (SARL)"},
        function (err) {
            if (err) return console.log(err);
            return res.send(202);
        });
});

module.exports.statusList = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    Status.find({},function(err, status_all) {
        if (!status_all) {
            sendJsonResponse(res, 404, {
                "message": "No status found"
            });
        }
        else {
            sendJsonResponse(res, 200, status_all);
        }
    });
});

module.exports.statusGetOne = (function (req, res) {
    if (req.params && req.params.id_status) {
        Status
            .findById(req.params.id_status)
            .exec(function(err, status) {
                if (!status) {
                    sendJsonResponse(res, 404, {
                        "message": "id_status not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, status);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_status in request"
        });
    }
});

module.exports.statusCreate = (function (req, res) {
    Status.create({
        status: req.body.status_label
    }, function(err, status) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, status);
        }
    });
});

module.exports.statusUpdateOne = (function (req, res) {
    if (!req.params.id_status) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_status is required"
        });
        return;
    }
    Status
        .findById(req.params.id_status)
        .exec(
            function(err, status) {
                if (!status) {
                    sendJsonResponse(res, 404, {
                        "message": "id_status not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                status.status = req.body.status_label;
                status.save(function(err, status) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, status);
                    }
                });
            }
        );
});

module.exports.statusDeleteOne = (function (req, res) {
    var id_status = req.params.id_status;
    if (id_status) {
        Status
            .findByIdAndRemove(id_status)
            .exec(
                function(err, status) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_status"
        });
    }
});