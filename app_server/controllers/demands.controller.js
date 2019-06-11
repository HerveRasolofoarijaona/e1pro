/**
 * Created by nokamojd on 06/09/2016.
 */
var request = require('request');
var async = require('async');
var methodOverride = require('method-override');
var User = require('../../app_api/models/user.schema'); //pour utiliser users dans le view
var Demand = require('../../app_api/models/demand.schema');
var Field = require('../../app_api/models/field.schema');

var sendJsonResponse = (function(res, status, content) {
    res.status(status);
    res.send(content);
});

var apiOptions = {
    server: "http://localhost:5000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://thawing-fjord-87586.herokuapp.com";
}

// error handling function
var _showError = function(req, res, status) {
    var errTitle, content;
    if (status === 404) {
        errTitle = "404, page not found";
        content = "Oh dear. Looks like we can't find this page. Sorry.";
    } else {
        errTitle = status + ", something's gone wrong";
        content = "Something, somewhere, has gone just a little bit wrong.";
    }
    res.status(status);
    res.render('index', {
        errTitle: errTitle,
        content: content
    });
};


// Demands list page renderer
// All demands request
module.exports.allDemands = function(req, res, next) {
    if (!req.user) return res.redirect('/login');
    else if (req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    async.parallel({
        user: function(callback) {
            User.find({}, function(err, users_all) {
                    if (!users_all) {
                        sendJsonResponse(res, 404, {
                            "message": "No users found"
                        });
                    }
                    /*else {
                        sendJsonResponse(res, 200, users_all);
                    }*/
                })
                .exec(callback);
        },
        fieldsAll: function(callback) {
            Field.find({}, function(err, fields_all) {
                    if (!fields_all) {
                        sendJsonResponse(res, 404, {
                            "message": "No fields found"
                        });
                    }
                    /*else {
                        sendJsonResponse(res, 200, demands_all);
                    }*/
                })
                .exec(callback);
        },
        demandsAll: function(callback) {
            Demand.find({}, function(err, demands_all) {
                    if (!demands_all) {
                        sendJsonResponse(res, 404, {
                            "message": "No demands found"
                        });
                    }
                    /*else {
                        sendJsonResponse(res, 200, demands_all);
                    }*/
                })
                .exec(callback);
        },
    }, function(err, results) { //faire une erreur pour les trois données
        if (err) { return next(err); } // Error in API usage.
        if (results.user == null) { // No results.
            var err1 = new Error('Author not found');
            err1.status = 404;
            return next(err1);
        }
        // Successful, so render.
        res.render('dashboard/demands-table', {
            title: 'Dashboard - Demandes | Emploi1pro',
            usersAll: results.user,
            fields: results.fieldsAll,
            demands: results.demandsAll,

        });
    });

};
/*var renderDemandsPage = function (req, res, demandsAll) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    return res.render('dashboard/demands-table', {
        title: 'Dashboard - Demandes | Emploi1pro',
        demands: demandsAll,
        //usersAll: usersAll
    })   
};
var renderDemandsPage2 = function (req, res, usersAll) { // 19/04
    if (!req.user) return res.redirect('/login');
    else if (req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    return res.render('dashboard/demands-table', {
        title: 'Dashboard - Demandes | Emploi1pro',
        usersAll : usersAll
    })
};*/

// All demands request
/*module.exports.allDemands = (function (req, res) {
    var requestOptions, path, requestOptions2,  path2;
    path = '/api/demands';
    path2 = '/api/users';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    requestOptions2 = {
        url: apiOptions.server + path2,
        method: "GET",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            renderDemandsPage(req, res, body);

        }
    );
    request(
        requestOptions2,
        function (err, response, body) {
            renderDemandsPage2(req, res, body);
        }
    );
});*/
/*module.exports.allDemands2 = (function (req, res) {
    var requestOptions, path;
    path = '/api/users';
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };

    request(
        requestOptions,
        function (err, response, body) {
            renderDemandsPage2(req, res, body);
        }
    );
    
});*/

// Demands by author list page renderer
/*var renderDemandsByAuthorPage = function (req, res, responseBody) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user._id != req.params.id_user) return res.redirect('/denied');
    return res.render('dashboard/demands-table', {
        title: 'Dashboard - Demandes | Emploi1pro',
        demands: responseBody
    })
};*/

// All demands by author request
module.exports.allDemandsByAuthor = function(req, res, next) {
    if (!req.user) return res.redirect('/login');
    else if (req.user && req.user._id != req.params.id_user) return res.redirect('/denied');
    async.parallel({
        user: function(callback) {
            User.find({ /*'_id': { $id: req.params.id_user }*/ }, function(err, users_all) {
                    if (!users_all) {
                        sendJsonResponse(res, 404, {
                            "message": "No users found"
                        });
                    }
                    /*else {
                        sendJsonResponse(res, 200, users_all);
                    }*/
                })
                .exec(callback);
        },
        fieldsAll: function(callback) {
            Field.find({}, function(err, fields_all) {
                    if (!fields_all) {
                        sendJsonResponse(res, 404, {
                            "message": "No fields found"
                        });
                    }
                    /*else {
                        sendJsonResponse(res, 200, demands_all);
                    }*/
                })
                .exec(callback);
        },
        demandsAll: function(callback) {
            Demand.find({ 'dmd_author': req.params.id_user }, function(err, demands_all) {
                    if (!demands_all) {
                        sendJsonResponse(res, 404, {
                            "message": "No demands found"
                        });
                    }
                    /*else {
                        sendJsonResponse(res, 200, demands_all);
                    }*/
                })
                .exec(callback);
        },
    }, function(err, results) { //faire une erreur pour les trois données
        if (err) { return next(err); } // Error in API usage.
        if (results.user == null) { // No results.
            var err1 = new Error('Author not found');
            err1.status = 404;
            return next(err1);
        }
        // Successful, so render.
        res.render('dashboard/demands-table', {
            title: 'Dashboard - Demandes | Emploi1pro',
            usersAll: results.user,
            fields: results.fieldsAll,
            demands: results.demandsAll,

        });
    });

};

// Demand details renderer function
var renderDemandDetail = function(req, res, demand) {
    if (!req.user) return res.redirect('/login');
    else if (req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64' && req.user.user_role != '57b2e3f36a0c14cc080d2f63') return res.redirect('/denied');
    res.render('dashboard/demands-edit', {
        title: 'Dashboard - Demandes | Emploi1pro',
        demand: demand
    });
};

module.exports.getOneDemand = (function(req, res) {
    var requestOptions, path;
    path = '/api/demands/' + req.params.id_demand;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions,
        function(err, response, body) {
            renderDemandDetail(req, res, body);
        }
    );
});


module.exports.getDemandForm = (function(req, res) {
    if (!req.user) return res.redirect('/login');
    else if (req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64' && req.user.user_role != '57b2e3f36a0c14cc080d2f63') return res.redirect('/denied');
    res.render('dashboard/demands-form', {
        title: 'Créer demande | Emploi1pro'
    });
});

module.exports.addDemand = (function(req, res) {
    var requestOptions, path, postData;
    path = '/api/demands';
    postData = {
        dmdTitle: req.body.demand_t,
        dmdDescription: req.body.demand_desc,
        dmdDStartDate: req.body.demand_d_s_d,
        dmdSEndDate: req.body.demand_e_d,
        dmdConditions: req.body.demand_conds,
        dmdEstimatedBudget: req.body.demand_es_bgt,
        dmdLocation: req.body.demand_loc,
        dmdField: req.body.demand_fld,
        dmdRequiredSkills: req.body.demand_skills,
        dmdAuthor: req.body.demand_authr,
        dmdDuree: req.body.duree
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/dashboard/demands/u/' + req.params.id_user);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
});


module.exports.updateDemand = (function(req, res) {
    var requestOptions, path, putData;
    path = '/api/demands/' + req.params.id_demand;
    putData = {
        dmdTitle: req.body.demand_t,
        dmdDescription: req.body.demand_desc,
        dmdDStartDate: req.body.demand_d_s_d,
        dmdSEndDate: req.body.demand_e_d,
        dmdConditions: req.body.demand_conds,
        dmdEstimatedBudget: req.body.demand_es_bgt,
        dmdLocation: req.body.demand_loc,
        dmdField: req.body.demand_fld,
        dmdRequiredSkills: req.body.demand_skills,
        dmdAuthor: req.body.demand_authr,
        dmdAvailability: req.body.is_available,
        dmdState: req.body.id_dmd_complete,
        dmdDuree: req.body.duree,
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "PUT",
        json: putData
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 200) {
                res.redirect('/dashboard/demands/' + req.params.id_demand);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
});

module.exports.deleteDemand = (function(req, res) {
    var requestOptions, path;
    path = '/api/demands/' + req.params.id_demand;
    requestOptions = {
        url: apiOptions.server + path,
        method: "DELETE",
        json: {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 204) {
                if (req.user.user_role != '57b2e3f36a0c14cc080d2f64')
                    return res.redirect('/dashboard/demands/u/' + req.params.id_user);
                else
                    return res.redirect('/dashboard/demands');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
});