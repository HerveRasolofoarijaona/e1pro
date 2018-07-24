/**
 * Created by nokamojd on 02/09/2016.
 */
var request = require('request');
var async = require('async');
var methodOverride = require('method-override');
var Offer = require('../../app_api/models/offer.schema');
var User = require('../../app_api/models/user.schema');
var Field = require('../../app_api/models/field.schema');

var sendJsonResponse = (function (res, status, content) {
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
        errTitle : errTitle,
        content : content
    });
};


// Offers list page renderer
// All offers request
module.exports.allOffers = function (req, res, next) {
    if (!req.user) return res.redirect('/login');
    else if (req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    async.parallel({
        user: function (callback) {
            User.find({}, function (err, users_all) {
                if (!users_all) {
                    sendJsonResponse(res, 404, {
                        "message": "No users found"
                    });
                }
                /*else {
                    sendJsonResponse(res, 200, users_all);
                }*/
            })
                .exec(callback)
        },
        fields: function (callback) {
            Field.find({}, function (err, fields_all) {
                if (!fields_all) {
                    sendJsonResponse(res, 404, {
                        "message": "No demands found"
                    });
                }
                /*else {
                    sendJsonResponse(res, 200, demands_all);
                }*/
            })
                .exec(callback)
        },
        offer: function (callback) {
            Offer.find({}, function (err, offers_all) {
                if (!offers_all) {
                    sendJsonResponse(res, 404, {
                        "message": "No offers found"
                    });
                }
                /*else {
                    sendJsonResponse(res, 200, users_all);
                }*/
            })
                .exec(callback)
        }
    }, function(err, results) {
            if (err) { return next(err); } // Error in API usage.
            if (results.offer == null) { // No results.
                var err = new Error('Offer not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('dashboard/offers-table', {
                title: 'Dashboard - Offres | Emploi1pro',
                offersAll: results.offer,
                usersAll: results.user,
                fieldsAll: results.fields
            });
        })
    };
 
    
    /*(function (req, res) {
    var requestOptions, path;
    path = '/api/offers';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
		
    };
    request(
        requestOptions,
        function(req, res, body) {
            renderOffersPage(req, res, body);
        }
    );
});*/

// Offers by author list page renderer
/*var renderOffersByAuthorPage = function (req, res, responseBody) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user._id != req.params.id_user) return res.redirect('/denied');
    return res.render('dashboard/offers-table', {
        title: 'Dashboard - Offres | Emploi1pro',
        offersAll: responseBody
    });
};*/

// All offers request
module.exports.allOffersByAuthor = function (req, res, next) {
    if (!req.user) return res.redirect('/login');
    else if (req.user && req.user._id != req.params.id_user) return res.redirect('/denied');
    async.parallel({
        user: function (callback) {
            User.find({}, function (err, users_all) {
                if (!users_all) {
                    sendJsonResponse(res, 404, {
                        "message": "No users found"
                    });
                }
                /*else {
                    sendJsonResponse(res, 200, users_all);
                }*/
            })
                .exec(callback)
        },
        fields: function (callback) {
            Field.find({}, function (err, fields_all) {
                if (!fields_all) {
                    sendJsonResponse(res, 404, {
                        "message": "No demands found"
                    });
                }
                /*else {
                    sendJsonResponse(res, 200, demands_all);
                }*/
            })
                .exec(callback)
        },
        offer: function (callback) {
            Offer.find({'offer_author': req.params.id_user }, function (err, offers_all) {
                if (!offers_all) {
                    sendJsonResponse(res, 404, {
                        "message": "No offers found"
                    });
                }
                /*else {
                    sendJsonResponse(res, 200, users_all);
                }*/
            })
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.offer == null) { // No results.
            var err = new Error('Offer not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('dashboard/offers-table', {
            title: 'Dashboard - Offres | Emploi1pro',
            offersAll: results.offer,
            usersAll: results.user,
            fieldsAll: results.fields
        });
    })
};

// Offer details renderer function
var renderOfferDetail = function (req, res, offer) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64' && req.user.user_role!='57b2e3f36a0c14cc080d2f62') return res.redirect('/denied');
    res.render('dashboard/offers-edit', {
        title: 'Dashboard - Offres | Emploi1pro',
        offer: offer
    });
};

module.exports.getOneOffer = (function (req, res) {
    var requestOptions, path;
    path = '/api/offers/'+ req.params.id_offer;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions,
        function(err, response, body){
            renderOfferDetail(req, res, body);
        }
    );
});


module.exports.getOfferForm = (function (req, res) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64' && req.user.user_role!='57b2e3f36a0c14cc080d2f62') return res.redirect('/denied');
    res.render('dashboard/offers-form', {
        title: 'Créer offre | Emploi1pro'
    });
});

module.exports.addOffer = (function (req, res) {
    var requestOptions, path, postData;
    path = '/api/offers';
    postData = {
        offerTitle: req.body.offer_t,
        offerDescription: req.body.offer_desc,
        bundlePrice: req.body.bdl_price,
        dailyPrice: req.body.dl_price,
        hdPrice: req.body.h_d_price,
        hourPrice: req.body.h_price,
        conds: req.body.conditions,
        offerLocation: req.body.offer_loc,
        keywords: req.body.tags,
        offerField: req.body.offer_fld,
        offerAuthor: req.body.offer_authr

    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/dashboard/offers/u/' + req.params.id_user);
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    );
});


module.exports.updateOffer = (function (req, res) {
    var requestOptions, path, putData;
    path='/api/offers/'+ req.params.id_offer;
    putData = {
        offerTitle: req.body.offer_t,
        offerDescription: req.body.offer_desc,
        bundlePrice: req.body.bdl_price,
        dailyPrice: req.body.dl_price,
        hdPrice: req.body.h_d_price,
        hourPrice: req.body.h_price,
        conds: req.body.conditions,
        offerLocation: req.body.offer_loc,
        keywords: req.body.tags,
        offerField: req.body.offer_fld,
        offerAuthor: req.body.offer_authr,
        offerAvailability: req.body.isAvailable,
        offerState: req.body.notPublished
    };
    requestOptions = {
        url: apiOptions.server + path,
        method:"PUT",
        json: putData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 200) {
                res.redirect('/dashboard/offers/'+ req.params.id_offer);
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});

module.exports.deleteOffer = (function (req, res) {
    var requestOptions, path;
    path='/api/offers/'+ req.params.id_offer;
    requestOptions = {
        url: apiOptions.server + path,
        method:"DELETE",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 204) {
                if(req.user.user_role != '57b2e3f36a0c14cc080d2f64')
                    return res.redirect('/dashboard/offers/u/'+req.params.id_user);
                else
                    return res.redirect('/dashboard/offers')
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});