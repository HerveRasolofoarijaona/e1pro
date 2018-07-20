/**
 * Created by nokamojd on 17/08/2016.
 */

var mongoose = require('mongoose');
var Language = require('../models/language.schema');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});



module.exports.languagesImport = (function (req, res) {
    Language.create(
        { "language": "Anglais"},
        { "language": "Français"},
        { "language": "Chinois"},
        function (err) {
            if (err) return console.log(err);
            return res.sendStatus(202);
        });
});



module.exports.languagesList = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    Language.find({},function(err, languages_all) {
        if (!languages_all) {
            sendJsonResponse(res, 404, {
                "message": "No languages found"
            });
        }
        else {
            sendJsonResponse(res, 200, languages_all);
        }
    });
});

module.exports.languagesGetOne = (function (req, res) {
    if (req.params && req.params.id_language) {
        Language
            .findById(req.params.id_language)
            .exec(function(err, language) {
                if (!language) {
                    sendJsonResponse(res, 404, {
                        "message": "id_language not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, language);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_language in request"
        });
    }
});



module.exports.languagesCreate = (function (req, res) {
    Language.create({
        language: req.body.language_lab
    }, function(err, language) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, language);
        }
    });
});



module.exports.languagesUpdateOne = (function (req, res) {
    if (!req.params.id_language) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_language is required"
        });
        return;
    }
    Language
        .findById(req.params.id_language)
        .exec(
            function(err, language) {
                if (!language) {
                    sendJsonResponse(res, 404, {
                        "message": "id_language not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                language.language = req.body.language_lab;
                language.save(function(err, language) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, language);
                    }
                });
            }
        );
});

module.exports.languagesDeleteOne = (function (req, res) {
    var id_language = req.params.id_language;
    if (id_language) {
        Language
            .findByIdAndRemove(id_language)
            .exec(
                function(err, language) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_language"
        });
    }
});
