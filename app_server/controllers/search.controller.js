/**
 * Created by nokamojd on 28/09/2016.
 */
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
require('../../app_api/models/offer.schema');
var Offer = mongoose.model('Offer');
require('../../app_api/models/demand.schema');
var Demand = mongoose.model('Demand');
require('../../app_api/models/consultant.schema');
var Consultant = mongoose.model('Consultant');
require('../../app_api/models/user.schema');
var User = mongoose.model('User');
//var elasticsearch = require('elasticsearch');// pour la barre de recherche
/*var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});*/


module.exports.searchRequest = (function(req, res, next) {
    res.redirect('/search?q=' + req.body.q + '&section=' + req.body.section);
});

//fonction escapeRegExp
function escapeRegex(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

module.exports.offersSearch = (function(req, res, next) {
    var noMatch = null;
    if (req.query.q && req.query.section == 0) {
        /*Demand.search({
            query_string: {query: req.query.q}
        }, function (err, results) {
            //results:
            if(err) return next(err);
            var data = results.hits.hits.map(function (hit) {
                return hit;
            });
            res.render('search-in-demands', {
                query: req.query.q,
                section: req.query.section,
                data: data
            });
        });*/
        //sans Elasticsearch (E-S)
        const regex = new RegExp(escapeRegex(req.query.q), 'gi');
        Demand.find({ dmd_title: regex }, function(err, allDemands) {
            if (err) {
                console.log(err);
            } else {
                if (allDemands.length < 1) {
                    noMatch = "No campgrounds match that query, please try again.";
                }
                res.render("search-in-demands", { data: allDemands, noMatch: noMatch });
            }
        });

    } else if (req.query.q && req.query.section == 1) {
        /*Consultant.search({
            query_string: {query: req.query.q}
        }, function (err, results) {
            //results:
            if(err) return next(err);
            var data = results.hits.hits.map(function (hit) {
                return hit;
            });
            res.render('search-in-consultants', {
                query: req.query.q,
                section: req.query.section,
                data: data
            });
        });*/
        //sans E-S 
        const regex = new RegExp(escapeRegex(req.query.q), 'gi');
        User.find({ $or: [{ first_name: regex }, { last_name: regex }], user_role: "57b2e3f36a0c14cc080d2f62" }, function(err, user) {
            if (!user) {
                req.flash("errors", "Aucun consultant trouv�");
            }
            if (err) {
                console.log(err);
            }

            res.render("search-in-consultants", { data: user /*, noMatch: noMatch */ });


        });
        /*Consultant.find({}, function (err, allConsultants) {
            User.find({ $or: [{ first_name: regex }, { last_name: regex }] }, function (err, user) {
            });
        });*/


    } else if (req.query.q && req.query.section == 2) {
        /*Offer.search({
            query_string: {query: req.query.q}
        }, function (err, results) {
            //results:
            if(err) return next(err);
            var data = results.hits.hits.map(function (hit) {
                return hit;
            });
            res.render('search-in-offers', {
                query: req.query.q,
                section: req.query.section,
                data: data
            });
        });*/
        //sans E-S
        const regex = new RegExp(escapeRegex(req.query.q), 'gi');
        Offer.find({ offer_title: regex }, function(err, allOffers) {
            if (err) {
                console.log(err);
            } else {
                if (allOffers.length < 1) {
                    noMatch = "No campgrounds match that query, please try again.";
                }
                res.render("search-in-offers", { data: allOffers, noMatch: noMatch });
            }
        });
    } else {
        res.redirect('/');
    }
});