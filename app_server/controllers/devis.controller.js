var request = require('request');
var async = require('async');
var methodOverride = require('method-override');
var Devis = require('../../app_api/models/devis.schema');
var User = require('../../app_api/models/user.schema');
var Demand = require('../../app_api/models/demand.schema');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});

var apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "";
}

// error handling function
var _showError = function (req, res, status) {
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

module.exports.devisCreate = (function (req, res) {
    /*var requestOptions, path, postData;
    path = '/api/devis';
    postData = {
        mission_title: req.body.mission,
        reference: req.body.reference,
        date_debut: req.body.date_db,
        date_fin: req.body.date_fn,
        quantity: req.body.quantity,
        tarif_unit: req.body.tf_u,
        unit: req.body.unit,
        //total_price: req.body.total,
        devis_author: req.body.devis_authr,
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if (response.statusCode === 200) {
                res.redirect('/demands/' + req.params.id_demand);
            }
            else {
                console.log(postData);
                _showError(req, res, response.statusCode);
            }
        }
    );*/
    Devis.findOne({}, function (err, dev) {
        if (err) return err
        if (!req.user) return res.redirect('/login');
        var devis = new Devis();
        devis.mission_title = req.body.mission;
        devis.reference = req.body.reference;
        devis.author_dmd = req.body.dmd_author;
        devis.motif = req.body.motif;
        devis.date_debut = req.body.date_db;
        devis.date_fin = req.body.date_fn;
        devis.quantity = req.body.quantity;
        devis.tarif_unit = req.body.tf_u;
        devis.unit = req.body.unit;
        devis.total_price= req.body.total;
        devis.devis_author = req.body.devis_authr;
        devis.commentaire = req.body.commentaire;

        devis.save(function (err) {
            if (err) return err
            req.flash("success", "DEVIS PRIS EN COMPTE");
            res.redirect('/demands/' + req.params.id_demand);
        });
    });
});

//tous les devis (pour la partie modérateur)
var renderDevis = function (req, res, devis) {
    //if (!req.user) return res.redirect('/login');
    res.render('dashboard/devis-table', {
        title: 'Dashboard - Devis | Emploi1pro',
        devis_all: devis
    });
};
module.exports.allDevis = function (req, res) {
    var requestOptions, path;
    path = '/api/devis';
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions, function (err, response, body) {
        renderDevis(req, res, body);
    }
    );

};

// tous les devis liés à l'utilisateur'
var renderDevisUser = function (req, res, devis) {
    //if (!req.user) return res.redirect('/login');
    res.render('dashboard/devis-table', {
        title: 'Dashboard - Devis | Emploi1pro',
        devis_all: devis
    });
};
module.exports.allDevisForUser = function (req, res) {
    var requestOptions, path;
    path = '/api/devis/u/' + req.params.id_user;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions, function (err, response, body) {
        renderDevisUser(req, res, body);
        }
    );
    
};
//La page pour afficher les détails du devis
var renderDevisDetail = function (req, res, devis) {
    if (!req.user) return res.redirect('/login');
    res.render('dashboard/devis-details', {
        title: 'Dashboard - Devis | Emploi1pro',
        devis: devis
    });
};
module.exports.detailsDevis = function (req, res) {
    var requestOptions, path;
    path = '/api/devis/' + req.params.id_devis;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            renderDevisDetail(req, res, body);
        }
    );
    /*Devis.findOne({ '_id': req.params.id_devis }, function (err, devis) {
        if (!devis) {
            sendJsonResponse(res, 404, {
                "message": "No Devis found"
            });
        }
        else {
            renderDevisDetail(req, res, devis);
        }    


    });*/
};
// intéraction avec les boutons pour le devis
module.exports.returnDevis = function (req, res) {
    if (!req.user) return res.redirect('/login');
    else if (req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64' && req.user.user_role != '57b2e3f36a0c14cc080d2f63' && req.user.user_role != '57b2e3f36a0c14cc080d2f62') return res.redirect('/denied');
    var requestOptions, path, postData;
    path = "/api/devis/" + req.params.id_devis;
    putData = {
        accept: req.body.accepted,
        attente: req.body.attente,
        negociate: req.body.negocier
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "PUT",
        json: putData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if (response.statusCode === 200) {
                if (putData.negociate == "true") {
                    res.redirect('/dashboard/conversations/' + req.params.id_devis);
                } else {
                    res.redirect('/dashboard/devis/' + req.params.id_devis);
                }
            }
            else {
                _showError(req, res, response.statusCode);
            }  
        }
    );
};
//test
/*module.exports.test = (function (req, res) {
    res.render('dashboard/devis-details', {
        title: 'Dashboard - Devis | Emploi1pro',
    });
});*/
module.exports.deleteDevis = (function (req, res) {
    var requestOptions, path;
    path = '/api/devis/' + req.params.id_devis;
    requestOptions = {
        url: apiOptions.server + path,
        method: "DELETE",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            res.redirect('/dashboard/devis/u/' + req.params.id_user);
        }
    )
});